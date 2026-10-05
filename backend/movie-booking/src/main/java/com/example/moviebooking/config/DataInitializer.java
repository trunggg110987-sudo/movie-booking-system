package com.example.moviebooking.config;

import com.example.moviebooking.entity.Movie;
import com.example.moviebooking.entity.Room;
import com.example.moviebooking.entity.Seat;
import com.example.moviebooking.entity.Showtime;
import com.example.moviebooking.entity.User;
import com.example.moviebooking.repository.MovieRepository;
import com.example.moviebooking.repository.RoomRepository;
import com.example.moviebooking.repository.SeatRepository;
import com.example.moviebooking.repository.ShowtimeRepository;
import com.example.moviebooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initUsers();
        initSeats();
        initShowtimes();
    }

    private void initUsers() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getPassword() != null && !user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
                log.info("Encoded password for user: {}", user.getUsername());
            }
        }
    }

    private void initSeats() {
        List<Room> rooms = roomRepository.findAll();
        String[] rows = {"A", "B", "C", "D", "E"};
        for (Room room : rooms) {
            List<Seat> existingSeats = seatRepository.findByRoomId(room.getId());
            if (existingSeats.size() < 20) {
                List<Seat> toSave = new ArrayList<>();
                for (String r : rows) {
                    for (int i = 1; i <= 8; i++) {
                        String seatNum = r + i;
                        boolean exists = existingSeats.stream()
                                .anyMatch(s -> seatNum.equalsIgnoreCase(s.getSeatNumber()));
                        if (!exists) {
                            Seat seat = new Seat();
                            seat.setRoom(room);
                            seat.setSeatNumber(seatNum);
                            toSave.add(seat);
                        }
                    }
                }
                if (!toSave.isEmpty()) {
                    seatRepository.saveAll(toSave);
                    log.info("Initialized {} seats for room {} ({})", toSave.size(), room.getId(), room.getName());
                }
            }
        }
    }

    private void initShowtimes() {
        List<Movie> movies = movieRepository.findAll();
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) {
            return;
        }

        LocalTime[] timeSlots = {
                LocalTime.of(8, 30),
                LocalTime.of(11, 0),
                LocalTime.of(13, 30),
                LocalTime.of(16, 0),
                LocalTime.of(18, 30),
                LocalTime.of(21, 0)
        };

        LocalDate today = LocalDate.now();

        for (int mIndex = 0; mIndex < movies.size(); mIndex++) {
            Movie movie = movies.get(mIndex);
            List<Showtime> existing = showtimeRepository.findByMovieId(movie.getId());

            // If movie has fewer than 5 showtimes or we want to guarantee at least 5 across dates
            if (existing.size() < 5) {
                List<Showtime> toSave = new ArrayList<>();
                // Generate showtimes for the next 7 days (today + 6 days)
                for (int dayOffset = 0; dayOffset < 7; dayOffset++) {
                    LocalDate showDate = today.plusDays(dayOffset);
                    // For each day, create 3 to 6 showtimes at different slots
                    for (int slotIdx = 0; slotIdx < timeSlots.length; slotIdx++) {
                        LocalDateTime showStart = LocalDateTime.of(showDate, timeSlots[slotIdx]);
                        // Pick room deterministically
                        Room room = rooms.get((mIndex + slotIdx + dayOffset) % rooms.size());

                        boolean alreadyExists = existing.stream()
                                .anyMatch(st -> st.getStartTime() != null && st.getStartTime().equals(showStart));
                        if (!alreadyExists) {
                            Showtime st = new Showtime();
                            st.setMovie(movie);
                            st.setRoom(room);
                            st.setStartTime(showStart);
                            toSave.add(st);
                        }
                    }
                }
                if (!toSave.isEmpty()) {
                    showtimeRepository.saveAll(toSave);
                    log.info("Created {} showtimes for movie ID {}: {}", toSave.size(), movie.getId(), movie.getTitle());
                }
            }
        }
    }
}
