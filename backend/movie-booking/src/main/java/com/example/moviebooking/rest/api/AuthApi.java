package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.dto.request.LoginRequest;
import com.example.moviebooking.entity.dto.request.RegisterRequest;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.dto.response.AuthResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Validated
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public interface AuthApi {
    @PostMapping("/register")
    ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request);

    @PostMapping("/login")
    ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request);
}