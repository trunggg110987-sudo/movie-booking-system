package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.dto.SeatDTO;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/seats")
@CrossOrigin(origins = "*")
public interface SeatApi {

    @GetMapping
    ResponseEntity<ApiResponse<List<Seat>>> getAllSeats();

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<Seat>> getSeatById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<ApiResponse<Seat>> createSeat(@RequestBody Seat seat);

    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<Seat>> updateSeat(@PathVariable Integer id, @RequestBody Seat seat);

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<String>> deleteSeat(@PathVariable Integer id);

    @GetMapping("/room/{roomId}")
    ResponseEntity<ApiResponse<List<Seat>>> getSeatsByRoom(@PathVariable Integer roomId);

    @GetMapping("/room/{roomId}/with-lock-status")
    ResponseEntity<ApiResponse<List<SeatDTO>>> getSeatsByRoomWithLockStatus(
            @PathVariable Integer roomId,
            @RequestParam Integer showtimeId);

    @GetMapping("/showtime/{showtimeId}")
    ResponseEntity<ApiResponse<List<SeatDTO>>> getSeatsByShowtime(@PathVariable Integer showtimeId);
}
