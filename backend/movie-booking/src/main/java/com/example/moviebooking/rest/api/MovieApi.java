package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Movie;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public interface MovieApi {

    @GetMapping
    ResponseEntity<ApiResponse<List<Movie>>> getAllMovies();

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<Movie>> getMovieById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<ApiResponse<Movie>> createMovie(@RequestBody Movie movie);

    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<Movie>> updateMovie(@PathVariable Integer id, @RequestBody Movie movie);

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<String>> deleteMovie(@PathVariable Integer id);

    @GetMapping("/search")
    ResponseEntity<ApiResponse<List<Movie>>> searchMovies(@RequestParam String title);
}
