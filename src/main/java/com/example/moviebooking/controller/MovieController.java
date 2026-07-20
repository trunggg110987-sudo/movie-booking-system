package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.entity.Movie;
import com.example.moviebooking.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {
    private final MovieService movieService;
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Movie>>> getAllMovies() {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.getAllMovies(), 200, "success", LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Movie>> getMovieById(@PathVariable Integer id) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.getMovieById(id), 200, "success", LocalDateTime.now()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Movie>> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.createMovie(movie), 201, "success", LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Movie>> updateMovie(@PathVariable Integer id,
                             @RequestBody Movie movie) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.updateMovie(id, movie), 201, "success", LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMovie(@PathVariable Integer id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Movie>>> searchMovies(@RequestParam String title) {
        return ResponseEntity.status(200).body(new ApiResponse<>(movieService.searchMovies(title), 200, "success", LocalDateTime.now()));
    }
}
