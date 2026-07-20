package com.example.moviebooking.service;

import com.example.moviebooking.dto.SeatDTO;
import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.repository.SeatLockRepository;
import com.example.moviebooking.repository.SeatRepository;
import com.example.moviebooking.repository.ShowtimeRepository;
import com.example.moviebooking.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final SeatLockRepository seatLockRepository;
    private final ShowtimeRepository showtimeRepository;
    private final TicketRepository ticketRepository;

    public SeatServiceImpl(SeatRepository seatRepository, SeatLockRepository seatLockRepository, ShowtimeRepository showtimeRepository, TicketRepository ticketRepository) {
        this.seatRepository = seatRepository;
        this.seatLockRepository = seatLockRepository;
        this.showtimeRepository = showtimeRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    @Override
    public Seat getSeatById(Integer id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with id: " + id));
    }

    @Override
    public Seat createSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    @Override
    public Seat updateSeat(Integer id, Seat seat) {
        Seat existing = getSeatById(id);

        existing.setSeatNumber(seat.getSeatNumber());
        existing.setRoom(seat.getRoom());

        return seatRepository.save(existing);
    }

    @Override
    public void deleteSeat(Integer id) {
        Seat existing = getSeatById(id);
        seatRepository.delete(existing);
    }

    @Override
    public List<Seat> getSeatsByRoom(Integer roomId) {
        return seatRepository.findByRoomId(roomId);
    }

    @Override
    public List<SeatDTO> getSeatsByRoomWithLockStatus(Integer roomId, Integer showtimeId) {
        List<Seat> seats = seatRepository.findByRoomId(roomId);
        return seats.stream()
                .map(seat -> {
                    boolean locked = seatLockRepository
                            .findActiveLock(seat.getId(), showtimeId)
                            .isPresent();
                    return new SeatDTO(
                            seat.getId(),
                            seat.getSeatNumber(),
                            seat.getRoom().getId(),
                            locked
                    );
                })
                .toList();
    }

    @Override
    public List<SeatDTO> getSeatsByShowtime(Integer showtimeId) {

        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        Integer roomId = showtime.getRoom().getId();

        List<Seat> seats = seatRepository.findByRoomId(roomId);

        return seats.stream().map(seat -> {

            boolean booked = ticketRepository
                    .existsBySeatIdAndBooking_Showtime_Id(seat.getId(), showtimeId);

            boolean locked = seatLockRepository
                    .existsBySeatIdAndShowtimeId(seat.getId(), showtimeId);

            boolean vip = seat.getSeatNumber().startsWith("C")
                    || seat.getSeatNumber().startsWith("D");

            return new SeatDTO(
                    seat.getId(),
                    seat.getSeatNumber(),
                    booked,
                    locked,
                    vip
            );

        }).toList();
    }
}