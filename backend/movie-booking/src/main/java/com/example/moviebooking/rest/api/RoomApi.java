package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Room;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public interface RoomApi {

    @GetMapping
    ResponseEntity<ApiResponse<List<Room>>> getAllRooms();

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Integer id);

    @PostMapping
    ResponseEntity<ApiResponse<Room>> createRoom(@RequestBody Room room);

    @PutMapping("/{id}")
    ResponseEntity<ApiResponse<Room>> updateRoom(@PathVariable Integer id, @RequestBody Room room);

    @DeleteMapping("/{id}")
    ResponseEntity<ApiResponse<String>> deleteRoom(@PathVariable Integer id);

    @GetMapping("/cinema/{cinemaId}")
    ResponseEntity<ApiResponse<List<Room>>> getRoomsByCinema(@PathVariable Integer cinemaId);
}
