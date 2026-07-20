package com.example.moviebooking.service;

import com.example.moviebooking.dto.SeatDTO;
import com.example.moviebooking.entity.Seat;

import java.util.List;

public interface SeatService {

    List<Seat> getAllSeats();

    Seat getSeatById(Integer id);

    Seat createSeat(Seat seat);

    Seat updateSeat(Integer id, Seat seat);

    void deleteSeat(Integer id);

    List<Seat> getSeatsByRoom(Integer roomId);

    List<SeatDTO> getSeatsByRoomWithLockStatus(Integer roomId, Integer showtimeId);
    List<SeatDTO> getSeatsByShowtime(Integer showtimeId);
}