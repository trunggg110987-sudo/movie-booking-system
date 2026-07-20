package com.example.moviebooking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@AllArgsConstructor
@Setter
public class BookingRequest {

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Showtime ID is required")
    private Integer showtimeId;

    @NotEmpty(message = "Seat IDs must not be empty")
    private List<Integer> seatIds;

}