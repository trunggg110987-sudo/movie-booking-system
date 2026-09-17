package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.Movie;
import com.example.moviebooking.rest.api.MovieApi;
import com.example.moviebooking.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MovieController implements MovieApi {
    private final MovieService movieService;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Movie>>> getAllMovies() {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.getAllMovies(), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Movie>> getMovieById(@PathVariable Integer id) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.getMovieById(id), 200, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<Movie>> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.createMovie(movie), 201, "success", LocalDateTime.now()));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Movie>> updateMovie(@PathVariable Integer id,
                             @RequestBody Movie movie) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.updateMovie(id, movie), 201, "success", LocalDateTime.now()));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMovie(@PathVariable Integer id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Movie>>> searchMovies(@RequestParam String title) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.searchMovies(title), 200, "success", LocalDateTime.now()));
    }
}
