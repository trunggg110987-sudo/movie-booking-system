package com.example.moviebooking.repository;

import com.example.moviebooking.entity.SeatLock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatLockRepository extends JpaRepository<SeatLock, Integer> {

    @Query("""
        SELECT sl FROM SeatLock sl
        WHERE sl.seat.id = :seatId
        AND sl.showtime.id = :showtimeId
        AND sl.expiresAt > CURRENT_TIMESTAMP
    """)
    Optional<SeatLock> findActiveLock(Integer seatId, Integer showtimeId);

    void deleteByUserId(Integer userId);

    @Modifying
    @Query("DELETE FROM SeatLock sl WHERE sl.expiresAt < CURRENT_TIMESTAMP")
    void deleteExpiredLocks();

    boolean existsBySeatIdAndShowtimeId(Integer id, Integer showtimeId);
}
