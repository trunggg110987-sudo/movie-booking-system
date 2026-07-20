package com.example.moviebooking.service;

import com.example.moviebooking.entity.Cinema;
import com.example.moviebooking.repository.CinemaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaServiceImpl implements CinemaService {
    private final CinemaRepository cinemaRepository;

    public CinemaServiceImpl(CinemaRepository cinemaRepository) {
        this.cinemaRepository = cinemaRepository;
    }

    @Override
    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    @Override
    public Cinema getCinemaById(Integer id) {
        return cinemaRepository.findById(id).orElseThrow(() -> new RuntimeException("Cinema not found with id: " + id));
    }

    @Override
    public Cinema createCinema(Cinema cinema) {
        return cinemaRepository.save(cinema);
    }

    @Override
    public Cinema updateCinema(Integer id, Cinema cinema) {
        Cinema existingCinema = getCinemaById(id);
        existingCinema.setName(cinema.getName());
        existingCinema.setAddress(cinema.getAddress());
        return cinemaRepository.save(existingCinema);
    }

    @Override
    public void deleteCinema(Integer id) {
        Cinema existing = getCinemaById(id);
        cinemaRepository.delete(existing);
    }
}
