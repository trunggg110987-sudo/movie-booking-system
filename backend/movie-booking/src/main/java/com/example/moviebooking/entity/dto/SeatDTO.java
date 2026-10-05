package com.example.moviebooking.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeatDTO {
    private Integer id;
    private String seatNumber;
    private Integer roomId;
    private boolean booked;
    private boolean locked;
    private boolean vip;

    public SeatDTO(Integer id, String seatNumber, Integer roomId, boolean locked) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.roomId = roomId;
        this.locked = locked;
    }

    public SeatDTO(Integer id, String seatNumber, boolean booked, boolean locked, boolean vip) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.booked = booked;
        this.locked = locked;
        this.vip = vip;
    }
}

