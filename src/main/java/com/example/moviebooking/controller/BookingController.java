package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.dto.BookingRequest;
import com.example.moviebooking.entity.Booking;
import com.example.moviebooking.service.BookingService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(bookingService.createBooking(request.getUserId(), request.getShowtimeId(), request.getSeatIds()), 201, "success", LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(bookingService.getBookingById(id), 200, "success", LocalDateTime.now()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByUser(@PathVariable Integer userId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(bookingService.getBookingsByUser(userId), 200, "success", LocalDateTime.now()));
    }
}
