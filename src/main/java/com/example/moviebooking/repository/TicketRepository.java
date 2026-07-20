package com.example.moviebooking.repository;

import com.example.moviebooking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByBookingId(Integer bookingId);

    List<Ticket> findBySeatId(Integer seatId);

    boolean existsBySeatIdAndBooking_Showtime_Id(Integer id, Integer showTimeId);
}