package com.example.moviebooking.service;

import com.example.moviebooking.entity.*;
import com.example.moviebooking.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.example.moviebooking.exception.BadRequestException;
import com.example.moviebooking.exception.NotFoundException;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final SeatLockRepository seatLockRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository,
            ShowtimeRepository showtimeRepository,
            SeatRepository seatRepository,
            SeatLockRepository seatLockRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.seatLockRepository = seatLockRepository;
    }

    @Transactional
    @Override
    public Booking createBooking(Integer userId, Integer showtimeId, List<Integer> seatIds) {

        if (seatIds == null || seatIds.isEmpty()) {
            throw new BadRequestException("Seat IDs cannot be empty");
        }

        if (seatIds.size() != new HashSet<>(seatIds).size()) {
            throw new BadRequestException("Duplicate seat IDs are not allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new NotFoundException("Showtime not found"));

        List<Seat> seats = new ArrayList<>();

        for (Integer seatId : seatIds) {

            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow(() -> new NotFoundException("Seat not found"));

            if (!seat.getRoom().getId().equals(showtime.getRoom().getId())) {
                throw new BadRequestException("Seat does not belong to the showtime room");
            }

            boolean alreadyBooked =
                    ticketRepository.existsBySeatIdAndBooking_Showtime_Id(seatId, showtimeId);

            if (alreadyBooked) {
                throw new BadRequestException("Seat is already booked");
            }
            Optional<SeatLock> lock =
                    seatLockRepository.findActiveLock(seatId, showtimeId);

            if (lock.isPresent() && !lock.get().getUserId().equals(userId)) {
                throw new BadRequestException("Seat is being held by another user");
            }

            seats.add(seat);
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setBookingTime(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        for (Seat seat : seats) {
            Ticket ticket = new Ticket();
            ticket.setSeat(seat);
            ticket.setBooking(savedBooking);
            ticketRepository.save(ticket);
        }

        seatLockRepository.deleteByUserId(userId);
        return savedBooking;
    }

    @Override
    public Booking getBookingById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Override
    public List<Booking> getBookingsByUser(Integer userId) {
        return bookingRepository.findByUserId(userId);
    }
}