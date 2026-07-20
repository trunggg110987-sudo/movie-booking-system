package com.example.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SeatDTO {
    private Integer id;
    private String seatNumber;
    private Integer roomId;
    private boolean locked;

    public SeatDTO(Integer id, String seatNumber, boolean booked, boolean locked, boolean vip) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.locked = locked;
    }
}
