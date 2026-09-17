package com.example.moviebooking.service;

import com.example.moviebooking.entity.Ticket;

import java.util.List;

public interface TicketService {

    List<Ticket> getTicketsByBooking(Integer bookingId);
}