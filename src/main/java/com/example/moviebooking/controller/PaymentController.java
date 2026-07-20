package com.example.moviebooking.controller;

import com.example.moviebooking.dto.ApiResponse;
import com.example.moviebooking.entity.Payment;
import com.example.moviebooking.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Payment>> create(@RequestBody Map<String, Object> req) {

        Integer userId = (Integer) req.get("userId");
        Integer showtimeId = (Integer) req.get("showtimeId");
        Double amount = Double.valueOf(req.get("amount").toString());

        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(paymentService.createPayment(userId, showtimeId, amount), 201, "success", LocalDateTime.now()));
    }

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
