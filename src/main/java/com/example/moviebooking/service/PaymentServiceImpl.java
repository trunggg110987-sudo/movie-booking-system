package com.example.moviebooking.service;

import com.example.moviebooking.entity.Payment;
import com.example.moviebooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService{
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BookingService bookingService) {
        this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
    }

    @Override
    public Payment createPayment(Integer userId, Integer showtimeId, Double amount) {
        Payment p  = new Payment();
        p.setUserId(userId);
        p.setShowtimeId(showtimeId);
        p.setAmount(amount);
        p.setStatus("PENDING");
        p.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(p);
    }

    @Override
    public void handleSuccess(Integer paymentId, List<Integer> seatIds) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getStatus().equals("PENDING")) return;

        bookingService.createBooking(
                payment.getUserId(),
                payment.getShowtimeId(),
                seatIds
        );

        payment.setStatus("SUCCESS");
        paymentRepository.save(payment);
    }
}
