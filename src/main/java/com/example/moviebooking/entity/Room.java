package com.example.moviebooking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "cinema_id")
    private Cinema cinema;

    public Room() {
    }

    public Room(String name, Cinema cinema) {
        this.name = name;
        this.cinema = cinema;
    }
}

