package com.example.moviebooking.rest.controller;

import com.example.moviebooking.rest.api.SeatLockApi;
import com.example.moviebooking.service.impl.SeatLockService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SeatLockController implements SeatLockApi {

    private final SeatLockService service;

    @Override
    @PostMapping
    public void lock(@RequestBody Map<String, Object> req) {
        List<Integer> seatIds = (List<Integer>) req.get("seatIds");
        Integer showtimeId = (Integer) req.get("showtimeId");
        Integer userId = (Integer) req.get("userId");

        service.lockSeats(seatIds, showtimeId, userId);
    }

    @Override
    @DeleteMapping("/{userId}")
    public void unlock(@PathVariable Integer userId) {
        service.unlockByUser(userId);
    }
}
