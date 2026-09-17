package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.User;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public interface UserApi {

    @GetMapping
    ResponseEntity<ApiResponse<List<User>>> getAllUsers();

    @GetMapping("/{id}")
    ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Integer id);
}
