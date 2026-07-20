package com.example.moviebooking.service;

import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.repository.ShowtimeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;

    public ShowtimeServiceImpl(ShowtimeRepository showtimeRepository) {
        this.showtimeRepository = showtimeRepository;
    }

    @Override
    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    @Override
    public Showtime getShowtimeById(Integer id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found with id: " + id));
    }

    @Override
    public Showtime createShowtime(Showtime showtime) {
        return showtimeRepository.save(showtime);
    }

    @Override
    public Showtime updateShowtime(Integer id, Showtime showtime) {
        Showtime existing = getShowtimeById(id);

        existing.setStartTime(showtime.getStartTime());
        existing.setMovie(showtime.getMovie());
        existing.setRoom(showtime.getRoom());

        return showtimeRepository.save(existing);
    }

    @Override
    public void deleteShowtime(Integer id) {
        Showtime existing = getShowtimeById(id);
        showtimeRepository.delete(existing);
    }

    @Override
    public List<Showtime> getShowtimesByMovie(Integer movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    @Override
    public List<Showtime> getShowtimesByRoom(Integer roomId) {
        return showtimeRepository.findByRoomId(roomId);
    }
}