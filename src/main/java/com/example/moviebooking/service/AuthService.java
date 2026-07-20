package com.example.moviebooking.service;

import com.example.moviebooking.dto.AuthResponse;
import com.example.moviebooking.dto.LoginRequest;
import com.example.moviebooking.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
