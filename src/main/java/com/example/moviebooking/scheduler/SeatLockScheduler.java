package com.example.moviebooking.scheduler;

import com.example.moviebooking.service.SeatLockService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SeatLockScheduler {

    private final SeatLockService service;

    public SeatLockScheduler(SeatLockService service) {
        this.service = service;
    }

    @Scheduled(fixedRate = 60000)
    public void cleanExpiredLocks() {
        service.cleanExpired();
    }
}
