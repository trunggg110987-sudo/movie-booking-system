package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.dto.response.AuthResponse;
import com.example.moviebooking.entity.dto.request.LoginRequest;
import com.example.moviebooking.entity.dto.request.RegisterRequest;
import com.example.moviebooking.rest.api.AuthApi;
import com.example.moviebooking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthService authService;

    @Override
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(authService.register(request),200, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.status(200).body(new ApiResponse<>(authService.login(request),200, "success", LocalDateTime.now()));
    }
}
