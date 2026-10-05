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
        String paymentMethod = req.get("paymentMethod") != null ? req.get("paymentMethod").toString() : "VIETQR";
        String transactionCode = req.get("transactionCode") != null ? req.get("transactionCode").toString() : null;

        return ResponseEntity
                .status(201)
                .body(new ApiResponse<>(paymentService.createPayment(userId, showtimeId, amount, paymentMethod, transactionCode), 201, "success", LocalDateTime.now()));
    }

    @Override
    @PostMapping("/success")
    @SuppressWarnings("unchecked")
    public ResponseEntity<ApiResponse<Object>> success(@RequestBody Map<String, Object> req) {

        Integer paymentId = (Integer) req.get("paymentId");
        List<Integer> seatIds = (List<Integer>) req.get("seatIds");

        com.example.moviebooking.entity.Booking booking = paymentService.handleSuccess(paymentId, seatIds);

        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(booking != null ? booking : "Payment success", 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Payment>>> getPaymentsByUser(@PathVariable Integer userId) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(paymentService.getPaymentsByUser(userId), 200, "success", LocalDateTime.now()));
    }

    @Override
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentById(@PathVariable Integer id) {
        return ResponseEntity
                .status(200)
                .body(new ApiResponse<>(paymentService.getPaymentById(id), 200, "success", LocalDateTime.now()));
    }
}
