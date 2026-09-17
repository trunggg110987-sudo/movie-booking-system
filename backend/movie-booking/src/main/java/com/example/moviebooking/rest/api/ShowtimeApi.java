package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "*")
public interface ShowtimeApi {

    @GetMapping
    ResponseEntity<ApiResponse<List<Showtime>>> getAllShowtime();

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<Showtime>> getShowtimeById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<ApiResponse<Showtime>> createShowtime(@RequestBody Showtime showtime);

    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<Showtime>> updateShowtime(@PathVariable Integer id, @RequestBody Showtime showtime);

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<String>> deleteShowtime(@PathVariable Integer id);

    @GetMapping("/movie/{movieId}")
    ResponseEntity<ApiResponse<List<Showtime>>> getShowtimeByMovie(@PathVariable Integer movieId);

    @GetMapping("/room/{roomId}")
    ResponseEntity<ApiResponse<List<Showtime>>> getShowtimeByRoom(@PathVariable Integer roomId);

    @GetMapping("/showtimes/{id}/seats")
    ResponseEntity<ApiResponse<List<Seat>>> getSeatsByShowtime(@PathVariable Integer id);
}
