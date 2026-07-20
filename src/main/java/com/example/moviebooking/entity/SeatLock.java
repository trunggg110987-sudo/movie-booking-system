package com.example.moviebooking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_locks")
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    @Setter
    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private Showtime showtime;

    @Getter
    @Setter
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;


    public void setExpiresAs(LocalDateTime localDateTime) {
        this.expiresAt = localDateTime;
    }

}
