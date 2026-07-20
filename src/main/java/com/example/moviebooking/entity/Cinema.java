package com.example.moviebooking.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "cinemas")
public class Cinema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String address;

    public Cinema() {}

    public Cinema(String name, String address) {
        this.name = name;
        this.address = address;
    }
}