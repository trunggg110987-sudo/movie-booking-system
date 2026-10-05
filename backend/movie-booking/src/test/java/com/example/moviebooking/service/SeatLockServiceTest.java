package com.example.moviebooking.service;

import com.example.moviebooking.entity.Room;
import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.SeatLock;
import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.exception.impl.BadRequestException;
import com.example.moviebooking.exception.impl.NotFoundException;
import com.example.moviebooking.repository.SeatLockRepository;
import com.example.moviebooking.repository.SeatRepository;
import com.example.moviebooking.repository.ShowtimeRepository;
import com.example.moviebooking.repository.TicketRepository;
import com.example.moviebooking.service.impl.SeatLockService;
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
class SeatLockServiceTest {

    @Mock
    private SeatLockRepository repo;

    @Mock
    private SeatRepository seatRepo;

    @Mock
    private ShowtimeRepository showtimeRepo;

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private SeatLockService seatLockService;

    private Room room;
    private Showtime showtime;
    private Seat seat1;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setId(10);
        room.setName("Cinema Room 1");

        showtime = new Showtime();
        showtime.setId(100);
        showtime.setRoom(room);
        showtime.setStartTime(LocalDateTime.now().plusHours(2));

        seat1 = new Seat();
        seat1.setId(101);
        seat1.setSeatNumber("B5");
        seat1.setRoom(room);
    }

    @Test
    @DisplayName("TC01 - Giữ ghế thành công khi ghế còn trống và chưa ai giữ")
    void lockSeats_Success() {
        when(showtimeRepo.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepo.findById(101)).thenReturn(Optional.of(seat1));
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(false);
        when(repo.findActiveLock(101, 100)).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> seatLockService.lockSeats(List.of(101), 100, 1));
        verify(repo, times(1)).save(any(SeatLock.class));
    }

    @Test
    @DisplayName("TC02 - Ném ngoại lệ khi danh sách ghế rỗng")
    void lockSeats_EmptySeatIds() {
        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                seatLockService.lockSeats(List.of(), 100, 1)
        );
        assertEquals("Seat IDs cannot be empty", ex.getMessage());
    }

    @Test
    @DisplayName("TC03 - Ném ngoại lệ khi không tìm thấy Suất chiếu")
    void lockSeats_ShowtimeNotFound() {
        when(showtimeRepo.findById(999)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () ->
                seatLockService.lockSeats(List.of(101), 999, 1)
        );
        assertTrue(ex.getMessage().contains("Showtime not found"));
    }

    @Test
    @DisplayName("TC04 - Ném ngoại lệ khi không tìm thấy Ghế")
    void lockSeats_SeatNotFound() {
        when(showtimeRepo.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepo.findById(999)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () ->
                seatLockService.lockSeats(List.of(999), 100, 1)
        );
        assertTrue(ex.getMessage().contains("Seat not found"));
    }

    @Test
    @DisplayName("TC05 - Ném ngoại lệ khi ghế không thuộc phòng của suất chiếu")
    void lockSeats_SeatNotBelongToRoom() {
        Room otherRoom = new Room();
        otherRoom.setId(20);

        Seat seatOther = new Seat();
        seatOther.setId(102);
        seatOther.setRoom(otherRoom);

        when(showtimeRepo.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepo.findById(102)).thenReturn(Optional.of(seatOther));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                seatLockService.lockSeats(List.of(102), 100, 1)
        );
        assertEquals("Seat does not belong to the showtime room", ex.getMessage());
    }

    @Test
    @DisplayName("TC06 - Ném ngoại lệ khi cố giữ ghế đã được mua vé")
    void lockSeats_SeatAlreadyBooked() {
        when(showtimeRepo.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepo.findById(101)).thenReturn(Optional.of(seat1));
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                seatLockService.lockSeats(List.of(101), 100, 1)
        );
        assertEquals("Seat is already booked", ex.getMessage());
        verify(repo, never()).save(any(SeatLock.class));
    }

    @Test
    @DisplayName("TC07 - Ném ngoại lệ khi ghế đang bị khóa bởi người khác")
    void lockSeats_SeatAlreadyLocked() {
        when(showtimeRepo.findById(100)).thenReturn(Optional.of(showtime));
        when(seatRepo.findById(101)).thenReturn(Optional.of(seat1));
        when(ticketRepository.existsBySeatIdAndBooking_Showtime_Id(101, 100)).thenReturn(false);
        when(repo.findActiveLock(101, 100)).thenReturn(Optional.of(new SeatLock()));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                seatLockService.lockSeats(List.of(101), 100, 1)
        );
        assertEquals("Seat already locked", ex.getMessage());
        verify(repo, never()).save(any(SeatLock.class));
    }

    @Test
    @DisplayName("TC08 - Hủy giữ ghế theo User thành công")
    void unlockByUser_Success() {
        seatLockService.unlockByUser(1);
        verify(repo, times(1)).deleteByUserId(1);
    }

    @Test
    @DisplayName("TC09 - Dọn dẹp các ghế hết hạn giữ chỗ")
    void cleanExpired_Success() {
        seatLockService.cleanExpired();
        verify(repo, times(1)).deleteExpiredLocks();
    }
}
