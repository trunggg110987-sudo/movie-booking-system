package com.example.moviebooking.service;

import com.example.moviebooking.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment createPayment(Integer userId, Integer showtimeId, Double amount);
    void handleSuccess(Integer paymentId, List<Integer> seatIds);
}
