package com.example.moviebooking.repository;

import com.example.moviebooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByRoomId(Integer roomId);

    Optional<Seat> findBySeatNumberAndRoomId(String seatNumber, Integer roomId);
}