package com.example.moviebooking.service;

import com.example.moviebooking.entity.Movie;
import java.util.List;

public interface MovieService {
    List<Movie> getAllMovies();

    Movie getMovieById(Integer id);

    Movie createMovie(Movie movie);

    Movie updateMovie(Integer id, Movie movie);

    void deleteMovie(Integer id);

    List<Movie> searchMovies(String title);
}
