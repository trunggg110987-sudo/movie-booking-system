package com.example.moviebooking.service;

import com.example.moviebooking.entity.*;
import com.example.moviebooking.exception.impl.BadRequestException;
import com.example.moviebooking.exception.impl.NotFoundException;
import com.example.moviebooking.repository.*;
import com.example.moviebooking.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private SeatLockRepository seatLockRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User user;
    private Room room;
    private Showtime showtime;
    private Seat seat1;
    private Seat seat2;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setUsername("testuser");

        room = new Room();
        room.setId(10);
        room.setName("Room 1");

        showtime = new Showtime();
        showtime.setId(100);
        showtime.setRoom(room);
        showtime.setStartTime(LocalDateTime.now().plusDays(1));

        seat1 = new Seat();
        seat1.setId(101);
        seat1.setSeatNumber("A1");
        seat1.setRoom(room);

        seat2 = new Seat();
        seat2.setId(102);
        seat2.setSeatNumber("A2");
        seat2.setRoom(room);
    }

    @Test
    @DisplayName("TC01 - Đặt vé thành công khi ghế hợp lệ và chưa ai đặt")
    void createBooking_Success() {
        List<Integer> seatIds = List.of(101, 102);
        
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepository.findById(101)).thenReturn(Optional.of(seat1));
        when(seatRepository.findById(102)).thenReturn(Optional.of(seat2));

        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(false);
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(102, 100)).thenReturn(false);

        when(seatLockRepository.findActiveLock(101, 100)).thenReturn(Optional.empty());
        when(seatLockRepository.findActiveLock(102, 100)).thenReturn(Optional.empty());

        Booking mockSavedBooking = new Booking();
        mockSavedBooking.setId(1);
        mockSavedBooking.setUser(user);
        mockSavedBooking.setShowtime(showtime);
        when(bookingRepository.save(any(Booking.class))).thenReturn(mockSavedBooking);

        Booking result = bookingService.createBooking(1, 100, seatIds);

        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(ticketRepository, times(2)).save(any(Ticket.class));
        verify(seatLockRepository, times(1)).deleteByUserId(1);
    }

    @Test
    @DisplayName("TC02 - Ném ngoại lệ khi danh sách ghế rỗng hoặc null")
    void createBooking_EmptySeatIds() {
        BadRequestException ex1 = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(1, 100, null)
        );
        assertEquals("Seat IDs cannot be empty", ex1.getMessage());

        BadRequestException ex2 = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(1, 100, List.of())
        );
        assertEquals("Seat IDs cannot be empty", ex2.getMessage());
    }

    @Test
    @DisplayName("TC03 - Ném ngoại lệ khi danh sách ghế có ID trùng lặp")
    void createBooking_DuplicateSeatIds() {
        List<Integer> seatIds = List.of(101, 101);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(1, 100, seatIds)
        );
        assertEquals("Duplicate seat IDs are not allowed", ex.getMessage());
    }

    @Test
    @DisplayName("TC04 - Ném ngoại lệ khi không tìm thấy User")
    void createBooking_UserNotFound() {
        List<Integer> seatIds = List.of(101);
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () ->
                bookingService.createBooking(999, 100, seatIds)
        );
        assertEquals("User not found", ex.getMessage());
    }

    @Test
    @DisplayName("TC05 - Ném ngoại lệ khi không tìm thấy Suất chiếu")
    void createBooking_ShowtimeNotFound() {
        List<Integer> seatIds = List.of(101);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(999)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () ->
                bookingService.createBooking(1, 999, seatIds)
        );
        assertEquals("Showtime not found", ex.getMessage());
    }

    @Test
    @DisplayName("TC06 - Ném ngoại lệ khi ghế không thuộc phòng chiếu của suất chiếu")
    void createBooking_SeatNotBelongToRoom() {
        Room otherRoom = new Room();
        otherRoom.setId(99);

        Seat seatOtherRoom = new Seat();
        seatOtherRoom.setId(201);
        seatOtherRoom.setRoom(otherRoom);

        List<Integer> seatIds = List.of(201);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepository.findById(201)).thenReturn(Optional.of(seatOtherRoom));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(1, 100, seatIds)
        );
        assertEquals("Seat does not belong to the showtime room", ex.getMessage());
    }

    @Test
    @DisplayName("TC07 - Ném ngoại lệ khi ghế đã được mua trước đó")
    void createBooking_SeatAlreadyBooked() {
        List<Integer> seatIds = List.of(101);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepository.findById(101)).thenReturn(Optional.of(seat1));
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(1, 100, seatIds)
        );
        assertEquals("Seat is already booked", ex.getMessage());
    }

    @Test
    @DisplayName("TC08 - Ném ngoại lệ khi ghế đang bị người dùng khác giữ chỗ")
    void createBooking_SeatHeldByAnotherUser() {
        List<Integer> seatIds = List.of(101);

        SeatLock otherUserLock = new SeatLock();
        otherUserLock.setUserId(2); // user 2 giữ chỗ, user 1 đang đặt

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepository.findById(101)).thenReturn(Optional.of(seat1));
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(false);
        when(seatLockRepository.findActiveLock(101, 100)).thenReturn(Optional.of(otherUserLock));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                bookingService.createBooking(1, 100, seatIds)
        );
        assertEquals("Seat is being held by another user", ex.getMessage());
    }

    @Test
    @DisplayName("TC09 - Cho phép đặt vé nếu ghế đang được giữ bởi chính user đó")
    void createBooking_SeatHeldBySameUser() {
        List<Integer> seatIds = List.of(101);

        SeatLock sameUserLock = new SeatLock();
        sameUserLock.setUserId(1); // user 1 tự lock

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepository.findById(101)).thenReturn(Optional.of(seat1));
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(false);
        when(seatLockRepository.findActiveLock(101, 100)).thenReturn(Optional.of(sameUserLock));

        Booking mockSavedBooking = new Booking();
        mockSavedBooking.setId(1);
        when(bookingRepository.save(any(Booking.class))).thenReturn(mockSavedBooking);

        Booking result = bookingService.createBooking(1, 100, seatIds);

        assertNotNull(result);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }
}
