package com.example.moviebooking.service;

import com.example.moviebooking.entity.Ticket;
import com.example.moviebooking.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    public TicketServiceImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public List<Ticket> getTicketsByBooking(Integer bookingId) {
        return ticketRepository.findByBookingId(bookingId);
    }
}