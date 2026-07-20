package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.entity.Cinema;
import com.example.moviebooking.service.CinemaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
@CrossOrigin(origins = "*")
public class CinemaController {

    private final CinemaService cinemaService;

    public CinemaController(CinemaService cinemaService) {
        this.cinemaService = cinemaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cinema>>> getAllCinemas() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.getAllCinemas(), 200, "success", LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Cinema>> getCinemaById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.getCinemaById(id), 200, "success", LocalDateTime.now()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Cinema>> createCinema(@RequestBody Cinema cinema) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.createCinema(cinema), 201, "success", LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Cinema>> updateCinema(@PathVariable Integer id,
                               @RequestBody Cinema cinema) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.updateCinema(id,cinema), 200, "success", LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCinema(@PathVariable Integer id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}