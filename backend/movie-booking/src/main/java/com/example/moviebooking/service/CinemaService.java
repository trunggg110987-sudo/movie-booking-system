package com.example.moviebooking.service;

import com.example.moviebooking.entity.Cinema;

import java.util.List;

public interface CinemaService {

    List<Cinema> getAllCinemas();

    Cinema getCinemaById(Integer id);

    Cinema createCinema(Cinema cinema);

    Cinema updateCinema(Integer id, Cinema cinema);

    void deleteCinema(Integer id);
}