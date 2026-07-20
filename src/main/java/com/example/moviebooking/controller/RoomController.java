package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.entity.Room;
import com.example.moviebooking.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Room>>> getAllRooms() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(roomService.getAllRooms(), 200, "success", LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(roomService.getRoomById(id), 200, "success", LocalDateTime.now()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Room>> createRoom(@RequestBody Room room) {
        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(roomService.createRoom(room), 200, "success", LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>>  updateRoom(@PathVariable Integer id,
                           @RequestBody Room room) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(roomService.updateRoom(id, room), 200, "success", LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>>  deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<ApiResponse<List<Room>>> getRoomsByCinema(@PathVariable Integer cinemaId) {
        return ResponseEntity.status(200).body(new ApiResponse<>(roomService.getRoomsByCinema(cinemaId), 200, "Success", LocalDateTime.now()));
    }
}