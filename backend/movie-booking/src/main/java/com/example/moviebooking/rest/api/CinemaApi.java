package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Cinema;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/cinemas")
@CrossOrigin(origins = "*")
public interface CinemaApi {

    @GetMapping
    ResponseEntity<ApiResponse<List<Cinema>>> getAllCinemas();

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<Cinema>> getCinemaById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<ApiResponse<Cinema>> createCinema(@RequestBody Cinema cinema);

    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<Cinema>> updateCinema(@PathVariable Integer id, @RequestBody Cinema cinema);

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<String>> deleteCinema(@PathVariable Integer id);
}
