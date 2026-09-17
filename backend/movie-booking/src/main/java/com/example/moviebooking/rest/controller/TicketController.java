package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.Ticket;
import com.example.moviebooking.rest.api.TicketApi;
import com.example.moviebooking.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TicketController implements TicketApi {

    private final TicketService ticketService;

    @Override
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<Ticket>>> getTicketsByBooking(@PathVariable Integer bookingId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(ticketService.getTicketsByBooking(bookingId), 200, "success", LocalDateTime.now()));
    }
}