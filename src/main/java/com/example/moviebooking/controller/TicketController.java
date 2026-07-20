package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.entity.Ticket;
import com.example.moviebooking.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<Ticket>>> getTicketsByBooking(@PathVariable Integer bookingId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(ticketService.getTicketsByBooking(bookingId), 200, "success", LocalDateTime.now()));
    }
}