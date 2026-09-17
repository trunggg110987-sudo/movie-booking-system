package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.repository.SeatRepository;
import com.example.moviebooking.repository.ShowtimeRepository;
import com.example.moviebooking.rest.api.ShowtimeApi;
import com.example.moviebooking.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ShowtimeController implements ShowtimeApi {

    private final ShowtimeService showtimeService;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Showtime>>> getAllShowtime() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(showtimeService.getAllShowtimes(), 200 , "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Showtime>> getShowtimeById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(showtimeService.getShowtimeById(id), 200, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<Showtime>> createShowtime(@RequestBody Showtime showtime) {
        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(showtimeService.createShowtime(showtime), 201, "success", LocalDateTime.now()));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Showtime>> updateShowtime(@PathVariable Integer id,
                                   @RequestBody Showtime showtime) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(showtimeService.updateShowtime(id, showtime), 200, "success", LocalDateTime.now()));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteShowtime(@PathVariable Integer id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<List<Showtime>>> getShowtimeByMovie(@PathVariable Integer movieId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(showtimeService.getShowtimesByMovie(movieId), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ApiResponse<List<Showtime>>> getShowtimeByRoom(@PathVariable Integer roomId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(showtimeService.getShowtimesByRoom(roomId), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/showtimes/{id}/seats")
    public ResponseEntity<ApiResponse<List<Seat>>> getSeatsByShowtime(@PathVariable Integer id){
        Showtime showtime = showtimeRepository.findById(id).orElseThrow();
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(seatRepository.findByRoomId(showtime.getRoom().getId()), 200, "success", LocalDateTime.now()));
    }
}