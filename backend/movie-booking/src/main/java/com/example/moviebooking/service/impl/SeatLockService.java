package com.example.moviebooking.service.impl;

import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.SeatLock;
import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.exception.impl.BadRequestException;
import com.example.moviebooking.exception.impl.NotFoundException;
import com.example.moviebooking.repository.SeatLockRepository;
import com.example.moviebooking.repository.SeatRepository;
import com.example.moviebooking.repository.ShowtimeRepository;
import com.example.moviebooking.repository.TicketRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SeatLockService {

    private final SeatLockRepository repo;
    private final SeatRepository seatRepo;
    private final ShowtimeRepository showtimeRepo;
    private final TicketRepository ticketRepository;

    public SeatLockService(
            SeatLockRepository repo,
            SeatRepository seatRepo,
            ShowtimeRepository showtimeRepo,
            TicketRepository ticketRepository
    ) {
        this.repo = repo;
        this.seatRepo = seatRepo;
        this.showtimeRepo = showtimeRepo;
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public void lockSeats(List<Integer> seatIds, Integer showtimeId, Integer userId) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new BadRequestException("Seat IDs cannot be empty");
        }

        Showtime showtime = showtimeRepo.findById(showtimeId)
                .orElseThrow(() -> new NotFoundException("Showtime not found with id: " + showtimeId));

        for (Integer seatId : seatIds) {
            Seat seat = seatRepo.findById(seatId)
                    .orElseThrow(() -> new NotFoundException("Seat not found with id: " + seatId));

            if (!seat.getRoom().getId().equals(showtime.getRoom().getId())) {
                throw new BadRequestException("Seat does not belong to the showtime room");
            }

            if (ticketRepository.existsBySeatIdAndBooking_Showtime_Id(seatId, showtimeId)) {
                throw new BadRequestException("Seat is already booked");
            }

            // check lock
            if (repo.findActiveLock(seatId, showtimeId).isPresent()) {
                throw new BadRequestException("Seat already locked");
            }

            SeatLock lock = new SeatLock();
            lock.setSeat(seat);
            lock.setShowtime(showtime);
            lock.setUserId(userId);
            lock.setExpiresAs(LocalDateTime.now().plusMinutes(5));

            repo.save(lock);
        }
    }

    @Transactional
    public void unlockByUser(Integer userId) {
        repo.deleteByUserId(userId);
    }

    @Transactional
    public void cleanExpired() {
        repo.deleteExpiredLocks();
    }
}

