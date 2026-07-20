package com.example.moviebooking.repository;

import com.example.moviebooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {
    List<Room> findByCinemaId(Integer cinemaId);
}