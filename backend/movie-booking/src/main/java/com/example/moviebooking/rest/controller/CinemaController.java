package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.Cinema;
import com.example.moviebooking.rest.api.CinemaApi;
import com.example.moviebooking.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CinemaController implements CinemaApi {

    private final CinemaService cinemaService;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Cinema>>> getAllCinemas() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.getAllCinemas(), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Cinema>> getCinemaById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.getCinemaById(id), 200, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<Cinema>> createCinema(@RequestBody Cinema cinema) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.createCinema(cinema), 201, "success", LocalDateTime.now()));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Cinema>> updateCinema(@PathVariable Integer id,
                               @RequestBody Cinema cinema) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(cinemaService.updateCinema(id,cinema), 200, "success", LocalDateTime.now()));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCinema(@PathVariable Integer id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.noContent().build();
    }
}