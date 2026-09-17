package com.example.moviebooking.rest.api;

import com.example.moviebooking.entity.Payment;
import com.example.moviebooking.entity.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Validated
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public interface PaymentApi {

    @PostMapping("/create")
    ResponseEntity<ApiResponse<Payment>> create(@RequestBody Map<String, Object> req);

    @PostMapping("/success")
    ResponseEntity<ApiResponse<String>> success(@RequestBody Map<String, Object> req);
}
