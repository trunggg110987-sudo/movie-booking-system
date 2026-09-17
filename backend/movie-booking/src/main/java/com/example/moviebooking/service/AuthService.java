package com.example.moviebooking.service;

import com.example.moviebooking.entity.dto.response.AuthResponse;
import com.example.moviebooking.entity.dto.request.LoginRequest;
import com.example.moviebooking.entity.dto.request.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
