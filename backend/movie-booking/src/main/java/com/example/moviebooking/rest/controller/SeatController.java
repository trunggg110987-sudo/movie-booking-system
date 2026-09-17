package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.dto.SeatDTO;
import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.rest.api.SeatApi;
import com.example.moviebooking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SeatController implements SeatApi {

    private final SeatService seatService;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Seat>>> getAllSeats() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatService.getAllSeats(), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Seat>> getSeatById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatService.getSeatById(id), 200, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<Seat>> createSeat(@RequestBody Seat seat) {
        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(seatService.createSeat(seat), 201, "success", LocalDateTime.now()));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Seat>> updateSeat(@PathVariable Integer id,
                           @RequestBody Seat seat) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatService.updateSeat(id, seat), 200, "success", LocalDateTime.now()));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSeat(@PathVariable Integer id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ApiResponse<List<Seat>>> getSeatsByRoom(@PathVariable Integer roomId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatService.getSeatsByRoom(roomId), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/room/{roomId}/with-lock-status")
    public ResponseEntity<ApiResponse<List<SeatDTO>>> getSeatsByRoomWithLockStatus(
            @PathVariable Integer roomId,
            @RequestParam Integer showtimeId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatService.getSeatsByRoomWithLockStatus(roomId, showtimeId), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<ApiResponse<List<SeatDTO>>> getSeatsByShowtime(@PathVariable Integer showtimeId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatService.getSeatsByShowtime(showtimeId), 200,  "success", LocalDateTime.now()));
    }
}