package com.example.moviebooking.service;

import com.example.moviebooking.entity.Showtime;

import java.util.List;

public interface ShowtimeService {

    List<Showtime> getAllShowtimes();

    Showtime getShowtimeById(Integer id);

    Showtime createShowtime(Showtime showtime);

    Showtime updateShowtime(Integer id, Showtime showtime);

    void deleteShowtime(Integer id);

    List<Showtime> getShowtimesByMovie(Integer movieId);

    List<Showtime> getShowtimesByRoom(Integer roomId);
}