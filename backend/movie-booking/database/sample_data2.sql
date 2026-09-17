use movie_booking;
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM tickets;
DELETE FROM bookings;
DELETE FROM showtimes;
DELETE FROM movies;
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 1;
ALTER TABLE movies AUTO_INCREMENT = 1;
INSERT INTO movies (title, description, duration, release_date, image) VALUES

                                                                           ('Avengers: Endgame','Final battle vs Thanos',181,'2019-04-26','https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'),
                                                                           ('The Dark Knight','Batman vs Joker',152,'2008-07-18','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOI-ol3t5a85pw8sSPVBI4gN1FJ_LVkE-OAQ&s'),
                                                                           ('Spider-Man: No Way Home','Multiverse chaos',148,'2021-12-17','https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'),
                                                                           ('Iron Man','Origin of Tony Stark',126,'2008-05-02','https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg'),
                                                                           ('Doctor Strange','Magic world',115,'2016-11-04','https://image.tmdb.org/t/p/w500/4PiiNGXj1KENTmCBHeN6Mskj2Fq.jpg'),
                                                                           ('Black Panther','Wakanda king',134,'2018-02-16','https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg'),
                                                                           ('Civil War','Avengers split',147,'2016-05-06','https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg'),
                                                                           ('Thor Ragnarok','Save Asgard',130,'2017-11-03','https://image.tmdb.org/t/p/w500/kaIfm5ryEOwYg8mLbq8HkPuM1Fo.jpg'),
                                                                           ('Joker','Origin story',122,'2019-10-04','https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'),
                                                                           ('Matrix','Reality simulation',136,'1999-03-31','https://image.tmdb.org/t/p/w500/aoi3nH3cYqNfT8nKcUo1b7M3G1.jpg'),
                                                                           ('Inception','Dream hacking',148,'2010-07-16','https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg'),
                                                                           ('Interstellar','Space travel',169,'2014-11-07','https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
                                                                           ('Fast 7','Racing revenge',137,'2015-04-03','https://image.tmdb.org/t/p/w500/dCgm7efXDmiABSdWDHBDBx2jwmn.jpg'),
                                                                           ('John Wick','Hitman returns',101,'2014-10-24','https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg'),
                                                                           ('MI Fallout','Spy mission',147,'2018-07-27','https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg'),
                                                                           ('Naruto The Last','Ninja war',112,'2014-12-06','https://image.tmdb.org/t/p/w500/bAQ8O5Uw6FedtlCbJTutenzPVKd.jpg'),
                                                                           ('Your Name','Body swap',106,'2016-08-26','https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg'),
                                                                           ('Demon Slayer','Train battle',117,'2020-10-16','https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODIwYUttZNYeMWeUU.jpg'),
                                                                           ('One Piece Red','Uta concert',115,'2022-08-06','https://image.tmdb.org/t/p/w500/ogDXuVkO92GcETZfSofXXemw7gb.jpg'),
                                                                           ('Attack on Titan','Final war',120,'2023-03-04','https://image.tmdb.org/t/p/w500/sm8E0g8PqR7tYc9YjRzCQXDpUe1.jpg'),
                                                                           ('Avatar','Pandora world',162,'2009-12-18','https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg'),
                                                                           ('Titanic','Love tragedy',195,'1997-12-19','https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg');

INSERT INTO showtimes (movie_id, room_id, start_time)
SELECT id, 1, NOW() + INTERVAL FLOOR(RAND()*5) DAY
FROM movies;

INSERT INTO bookings(user_id, showtime_id, booking_time) VALUES
                                                             (1,33,'2026-07-10 08:15:00'),
                                                             (2,33,'2026-07-10 08:20:00'),
                                                             (3,34,'2026-07-10 09:05:00'),
                                                             (4,35,'2026-07-10 09:15:00'),
                                                             (5,36,'2026-07-10 10:00:00'),
                                                             (6,37,'2026-07-10 10:40:00'),
                                                             (7,38,'2026-07-10 11:15:00'),
                                                             (8,39,'2026-07-10 13:10:00'),
                                                             (9,40,'2026-07-10 14:00:00'),
                                                             (10,41,'2026-07-10 15:00:00'),
                                                             (11,42,'2026-07-10 16:10:00'),
                                                             (2,43,'2026-07-11 08:00:00'),
                                                             (5,44,'2026-07-11 09:00:00'),
                                                             (7,45,'2026-07-11 10:30:00'),
                                                             (1,46,'2026-07-11 14:20:00');

INSERT INTO tickets (booking_id, seat_id) VALUES
                                              (2,1),
                                              (2,2),

                                              (3,3),

                                              (4,4),
                                              (4,5),

                                              (5,6),

                                              (6,7),
                                              (6,8),

                                              (7,9),

                                              (8,10),
                                              (8,11),

                                              (9,12),

                                              (10,13),
                                              (10,14),

                                              (11,15),

                                              (12,16),
                                              (12,17),

                                              (13,18),

                                              (14,19),

                                              (15,20),

                                              (16,21);

INSERT INTO payments(user_id,showtime_id,amount,status,created_at) VALUES
                                                                       (1,33,180000,'SUCCESS','2026-07-10 08:16:00'),
                                                                       (2,33,90000,'SUCCESS','2026-07-10 08:21:00'),
                                                                       (3,34,180000,'SUCCESS','2026-07-10 09:06:00'),
                                                                       (4,35,90000,'SUCCESS','2026-07-10 09:16:00'),
                                                                       (5,36,180000,'SUCCESS','2026-07-10 10:02:00'),
                                                                       (6,37,90000,'SUCCESS','2026-07-10 10:41:00'),
                                                                       (7,38,180000,'SUCCESS','2026-07-10 11:16:00'),
                                                                       (8,39,90000,'SUCCESS','2026-07-10 13:11:00'),
                                                                       (9,40,180000,'SUCCESS','2026-07-10 14:01:00'),
                                                                       (10,41,90000,'SUCCESS','2026-07-10 15:01:00'),
                                                                       (11,42,180000,'SUCCESS','2026-07-10 16:11:00'),
                                                                       (2,43,90000,'SUCCESS','2026-07-11 08:01:00'),
                                                                       (5,44,90000,'PENDING','2026-07-11 09:01:00'),
                                                                       (7,45,90000,'SUCCESS','2026-07-11 10:31:00'),
                                                                       (1,46,90000,'SUCCESS','2026-07-11 14:21:00');

INSERT INTO seat_locks(seat_id,showtime_id,user_id,expires_at) VALUES
                                                                   (5,47,3,'2026-07-17 14:10:00'),
                                                                   (6,47,4,'2026-07-17 14:12:00'),
                                                                   (7,48,5,'2026-07-17 15:05:00'),
                                                                   (8,49,6,'2026-07-17 15:20:00'),
                                                                   (9,50,7,'2026-07-17 16:00:00'),
                                                                   (10,51,8,'2026-07-17 16:05:00'),
                                                                   (11,52,9,'2026-07-17 16:20:00'),
                                                                   (12,53,10,'2026-07-17 17:10:00'),
                                                                   (13,54,11,'2026-07-17 17:30:00');

SELECT * FROM bookings;