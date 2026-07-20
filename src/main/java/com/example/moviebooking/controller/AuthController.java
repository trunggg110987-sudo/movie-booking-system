package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.dto.AuthResponse;
import com.example.moviebooking.dto.LoginRequest;
import com.example.moviebooking.dto.RegisterRequest;
import com.example.moviebooking.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(authService.register(request),200, "success", LocalDateTime.now()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.status(200).body(new ApiResponse<>(authService.login(request),200, "success", LocalDateTime.now()));
    }
}
