package com.example.moviebooking.service;

import com.example.moviebooking.entity.Room;
import com.example.moviebooking.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomById(Integer id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    @Override
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Room updateRoom(Integer id, Room room) {
        Room existingRoom = getRoomById(id);
        existingRoom.setName(room.getName());
        existingRoom.setCinema(room.getCinema());
        return roomRepository.save(existingRoom);
    }

    @Override
    public void deleteRoom(Integer id) {
        Room existingRoom = getRoomById(id);
        roomRepository.delete(existingRoom);
    }

    @Override
    public List<Room> getRoomsByCinema(Integer cinemaId) {
        return roomRepository.findByCinemaId(cinemaId);
    }
}
