package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Booking;
import com.example.moviebooking.entity.dto.request.BookingRequest;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public interface BookingApi {

    @PostMapping
    ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request);

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Integer id);

    @GetMapping("/user/{userId}")
    ResponseEntity<ApiResponse<List<Booking>>> getBookingsByUser(@PathVariable Integer userId);
}
