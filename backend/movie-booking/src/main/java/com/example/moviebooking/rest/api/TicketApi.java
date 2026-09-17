package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Ticket;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public interface TicketApi {

    @GetMapping("/booking/{bookingId}")
    ResponseEntity<ApiResponse<List<Ticket>>> getTicketsByBooking(@PathVariable Integer bookingId);
}
