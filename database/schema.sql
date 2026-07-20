CREATE DATABASE movie_booking;
USE movie_booking;

CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL
);

CREATE TABLE movies (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        duration INT,
                        release_date DATE
);

CREATE TABLE cinemas (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         address VARCHAR(255)
);

CREATE TABLE rooms (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       cinema_id INT,
                       FOREIGN KEY (cinema_id) REFERENCES cinemas(id)
);

CREATE TABLE seats (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       seat_number VARCHAR(10) NOT NULL,
                       room_id INT,
                       FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE showtimes (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           movie_id INT,
                           room_id INT,
                           start_time DATETIME,
                           FOREIGN KEY (movie_id) REFERENCES movies(id),
                           FOREIGN KEY (room_id) REFERENCES rooms(id)
);

CREATE TABLE bookings (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT,
                          showtime_id INT,
                          booking_time DATETIME,
                          FOREIGN KEY (user_id) REFERENCES users(id),
                          FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
);

CREATE TABLE tickets (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         booking_id INT,
                         seat_id INT,
                         FOREIGN KEY (booking_id) REFERENCES bookings(id),tickets
                             FOREIGN KEY (seat_id) REFERENCES seats(id)
);
CREATE TABLE payments (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          user_id INT,
                          showtime_id INT,
                          amount DOUBLE,
                          status VARCHAR(20),
                          created_at DATETIME
);

DROP TABLE payments;
SHOW TABLES;
DROP TABLE payments;
ALTER TABLE movies ADD image VARCHAR(500);