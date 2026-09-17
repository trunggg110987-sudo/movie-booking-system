package com.example.moviebooking.service;

import com.example.moviebooking.entity.Booking;

import java.util.List;

public interface BookingService {

    Booking createBooking(Integer userId, Integer showtimeId, List<Integer> seatIds);

    Booking getBookingById(Integer id);

    List<Booking> getBookingsByUser(Integer userId);
}