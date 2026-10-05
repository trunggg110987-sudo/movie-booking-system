package com.example.moviebooking.repository;

import com.example.moviebooking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByBookingId(Integer bookingId);

    List<Ticket> findBySeatId(Integer seatId);

    @Query("SELECT COUNT(t) > 0 FROM Ticket t WHERE t.seat.id = :seatId AND t.booking.showtime.id = :showtimeId")
    boolean existsBySeatIdAndBooking_Showtime_Id(@Param("seatId") Integer seatId, @Param("showtimeId") Integer showtimeId);
}