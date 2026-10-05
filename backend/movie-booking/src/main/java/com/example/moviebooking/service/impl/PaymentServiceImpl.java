package com.example.moviebooking.service.impl;

import com.example.moviebooking.entity.Booking;
import com.example.moviebooking.entity.Payment;
import com.example.moviebooking.exception.impl.BadRequestException;
import com.example.moviebooking.exception.impl.NotFoundException;
import com.example.moviebooking.repository.PaymentRepository;
import com.example.moviebooking.service.BookingService;
import com.example.moviebooking.service.PaymentService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BookingService bookingService) {
        this.paymentRepository = paymentRepository;
        this.bookingService = bookingService;
    }

    @Override
    public Payment createPayment(Integer userId, Integer showtimeId, Double amount) {
        return createPayment(userId, showtimeId, amount, "VIETQR", null);
    }

    @Override
    public Payment createPayment(Integer userId, Integer showtimeId, Double amount, String paymentMethod, String transactionCode) {
        if (amount == null || amount <= 0) {
            throw new BadRequestException("Số tiền thanh toán không hợp lệ (amount phải > 0)");
        }
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) {
            throw new BadRequestException("Vui lòng chọn phương thức thanh toán");
        }

        Payment p = new Payment();
        p.setUserId(userId);
        p.setShowtimeId(showtimeId);
        p.setAmount(amount);
        p.setStatus("PENDING");
        p.setPaymentMethod(paymentMethod);
        p.setTransactionCode(transactionCode != null ? transactionCode : ("CGV-" + System.currentTimeMillis() + "-" + ((int)(Math.random() * 900) + 100)));
        p.setCreatedAt(LocalDateTime.now());

        return paymentRepository.save(p);
    }

    @Override
    public Booking handleSuccess(Integer paymentId, List<Integer> seatIds) {
        if (paymentId == null) {
            throw new BadRequestException("Mã thanh toán không được để trống");
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thông tin thanh toán với id: " + paymentId));

        Booking booking = null;
        if ("PENDING".equalsIgnoreCase(payment.getStatus())) {
            booking = bookingService.createBooking(
                    payment.getUserId(),
                    payment.getShowtimeId(),
                    seatIds
            );

            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);
        }
        return booking;
    }

    @Override
    public List<Payment> getPaymentsByUser(Integer userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public Payment getPaymentById(Integer paymentId) {
        if (paymentId == null) {
            throw new BadRequestException("Mã thanh toán không được để trống");
        }
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thông tin thanh toán với id: " + paymentId));
    }
}
