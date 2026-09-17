package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.Room;
import com.example.moviebooking.rest.api.RoomApi;
import com.example.moviebooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoomController implements RoomApi {

    private final RoomService roomService;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<Room>>> getAllRooms() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(roomService.getAllRooms(), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(roomService.getRoomById(id), 200, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping
    public ResponseEntity<ApiResponse<Room>> createRoom(@RequestBody Room room) {
        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(roomService.createRoom(room), 200, "success", LocalDateTime.now()));
    }

    @Override
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> updateRoom(@PathVariable Integer id,
                           @RequestBody Room room) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(roomService.updateRoom(id, room), 200, "success", LocalDateTime.now()));
    }

    @Override
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<ApiResponse<List<Room>>> getRoomsByCinema(@PathVariable Integer cinemaId) {
        return ResponseEntity.status(200).body(new ApiResponse<>(roomService.getRoomsByCinema(cinemaId), 200, "Success", LocalDateTime.now()));
    }
}