package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.dto.request.BookingRequest;
import com.example.moviebooking.entity.Booking;
import com.example.moviebooking.rest.api.BookingApi;
import com.example.moviebooking.service.BookingService;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class BookingController implements BookingApi {
    private final BookingService bookingService;

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(bookingService.createBooking(request.getUserId(), request.getShowtimeId(), request.getSeatIds()), 201, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(bookingService.getBookingById(id), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByUser(@PathVariable Integer userId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(bookingService.getBookingsByUser(userId), 200, "success", LocalDateTime.now()));
    }
}
