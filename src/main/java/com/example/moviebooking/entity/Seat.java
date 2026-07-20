package com.example.moviebooking.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    public Seat() {}

    public Seat(String seatNumber, Room room) {
        this.seatNumber = seatNumber;
        this.room = room;
    }
}
