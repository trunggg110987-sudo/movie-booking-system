package com.example.moviebooking.rest.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Validated
@RequestMapping("/api/seat-lock")
@CrossOrigin(origins = "*")
public interface SeatLockApi {

    @PostMapping
    void lock(@RequestBody Map<String, Object> req);

    @DeleteMapping("/{userId}")
    void unlock(@PathVariable Integer userId);
}
