package com.example.moviebooking.service;

import com.example.moviebooking.entity.Booking;
import com.example.moviebooking.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment createPayment(Integer userId, Integer showtimeId, Double amount);
    Payment createPayment(Integer userId, Integer showtimeId, Double amount, String paymentMethod, String transactionCode);
    Booking handleSuccess(Integer paymentId, List<Integer> seatIds);
    List<Payment> getPaymentsByUser(Integer userId);
    Payment getPaymentById(Integer paymentId);
}
