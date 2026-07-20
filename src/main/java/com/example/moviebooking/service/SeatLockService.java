package com.example.moviebooking.service;

import com.example.moviebooking.entity.SeatLock;
import com.example.moviebooking.repository.SeatLockRepository;
import com.example.moviebooking.repository.SeatRepository;
import com.example.moviebooking.repository.ShowtimeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import java.time.LocalDateTime;

@Service
public class SeatLockService {

    @Autowired
    private SeatLockRepository repo;

    @Autowired
    private SeatRepository seatRepo;

    @Autowired
    private ShowtimeRepository showtimeRepo;

    @Transactional
    public void lockSeats(List<Integer> seatIds, Integer showtimeId, Integer userId) {

        for (Integer seatId : seatIds) {

            // check lock
            if (repo.findActiveLock(seatId, showtimeId).isPresent()) {
                throw new RuntimeException("Seat already locked");
            }

            SeatLock lock = new SeatLock();
            lock.setSeat(seatRepo.findById(seatId).orElseThrow());
            lock.setShowtime(showtimeRepo.findById(showtimeId).orElseThrow());
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
