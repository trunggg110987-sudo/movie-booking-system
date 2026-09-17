package com.example.moviebooking.rest.controller;

import com.example.moviebooking.entity.dto.response.ApiResponse;
import com.example.moviebooking.entity.Payment;
import com.example.moviebooking.rest.api.PaymentApi;
import com.example.moviebooking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PaymentController implements PaymentApi {

    private final PaymentService paymentService;

    @Override
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Payment>> create(@RequestBody Map<String, Object> req) {

        Integer userId = (Integer) req.get("userId");
        Integer showtimeId = (Integer) req.get("showtimeId");
        Double amount = Double.valueOf(req.get("amount").toString());

        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(paymentService.createPayment(userId, showtimeId, amount), 201, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping("/success")
    public ResponseEntity<ApiResponse<String>> success(@RequestBody Map<String, Object> req) {

        Integer paymentId = (Integer) req.get("paymentId");
        List<Integer> seatIds = (List<Integer>) req.get("seatIds");

        paymentService.handleSuccess(paymentId, seatIds);

        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>("Payment success", 200, "success", LocalDateTime.now()));
    }
}
