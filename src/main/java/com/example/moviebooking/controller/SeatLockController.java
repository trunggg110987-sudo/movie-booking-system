package com.example.moviebooking.controller;

import com.example.moviebooking.service.SeatLockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seat-lock")
@CrossOrigin("*")
public class SeatLockController {

    @Autowired
    private SeatLockService service;

    @PostMapping
    public void lock(@RequestBody Map<String, Object> req) {
        List<Integer> seatIds = (List<Integer>) req.get("seatIds");
        Integer showtimeId = (Integer) req.get("showtimeId");
        Integer userId = (Integer) req.get("userId");

        service.lockSeats(seatIds, showtimeId, userId);
    }

    @DeleteMapping("/{userId}")
    public void unlock(@PathVariable Integer userId) {
        service.unlockByUser(userId);
    }
}
