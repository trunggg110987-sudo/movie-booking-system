package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.User;
import com.example.moviebooking.repository.UserRepository;
import com.example.moviebooking.rest.api.UserApi;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserRepository userRepository;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(userRepository.findAll(), 200 ,"success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Integer id) {
        User user =  userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(user, 200, "success", LocalDateTime.now()));
    }
}