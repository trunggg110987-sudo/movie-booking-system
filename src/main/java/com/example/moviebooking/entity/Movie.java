package com.example.moviebooking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer duration;

    private LocalDate releaseDate;

    public Movie() {}

    public Movie(String title, String description, Integer duration, LocalDate releaseDate) {
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.releaseDate = releaseDate;
    }
}
