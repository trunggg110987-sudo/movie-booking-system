USE movie_booking;

-- 1. Insert seats for all rooms 1 to 19 (A1-A8, B1-B8, C1-C8, D1-D8, E1-E8)
INSERT INTO seats (seat_number, room_id)
SELECT s.seat_num, r.room_id
FROM rooms r
CROSS JOIN (
    SELECT 'A1' AS seat_num UNION ALL SELECT 'A2' UNION ALL SELECT 'A3' UNION ALL SELECT 'A4' UNION ALL SELECT 'A5' UNION ALL SELECT 'A6' UNION ALL SELECT 'A7' UNION ALL SELECT 'A8'
    UNION ALL SELECT 'B1' UNION ALL SELECT 'B2' UNION ALL SELECT 'B3' UNION ALL SELECT 'B4' UNION ALL SELECT 'B5' UNION ALL SELECT 'B6' UNION ALL SELECT 'B7' UNION ALL SELECT 'B8'
    UNION ALL SELECT 'C1' UNION ALL SELECT 'C2' UNION ALL SELECT 'C3' UNION ALL SELECT 'C4' UNION ALL SELECT 'C5' UNION ALL SELECT 'C6' UNION ALL SELECT 'C7' UNION ALL SELECT 'C8'
    UNION ALL SELECT 'D1' UNION ALL SELECT 'D2' UNION ALL SELECT 'D3' UNION ALL SELECT 'D4' UNION ALL SELECT 'D5' UNION ALL SELECT 'D6' UNION ALL SELECT 'D7' UNION ALL SELECT 'D8'
    UNION ALL SELECT 'E1' UNION ALL SELECT 'E2' UNION ALL SELECT 'E3' UNION ALL SELECT 'E4' UNION ALL SELECT 'E5' UNION ALL SELECT 'E6' UNION ALL SELECT 'E7' UNION ALL SELECT 'E8'
) s
WHERE NOT EXISTS (
    SELECT 1 FROM seats existing WHERE existing.room_id = r.room_id AND existing.seat_number = s.seat_num
);

-- 2. Insert showtimes for next 7 days for every movie (6 showtimes per day = 42 showtimes per movie)
INSERT INTO showtimes (movie_id, room_id, start_time)
SELECT 
    m.movie_id,
    ((m.movie_id + d.day_offset + t.slot_id) % 19) + 1 AS room_id,
    TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL d.day_offset DAY), t.slot_time) AS start_time
FROM movies m
CROSS JOIN (
    SELECT 0 AS day_offset UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
) d
CROSS JOIN (
    SELECT 1 AS slot_id, TIME('09:00:00') AS slot_time
    UNION ALL SELECT 2, TIME('11:30:00')
    UNION ALL SELECT 3, TIME('14:15:00')
    UNION ALL SELECT 4, TIME('16:45:00')
    UNION ALL SELECT 5, TIME('19:30:00')
    UNION ALL SELECT 6, TIME('21:45:00')
) t
WHERE NOT EXISTS (
    SELECT 1 FROM showtimes st 
    WHERE st.movie_id = m.movie_id 
    AND st.start_time = TIMESTAMP(DATE_ADD(CURDATE(), INTERVAL d.day_offset DAY), t.slot_time)
);

-- 3. Ensure test users have valid passwords
UPDATE users SET password = '$2a$10$54IwaETg7XN2AWX3tnhbWuin12yyq8lI0XrtUrWIl4Vesdr7pwHKS' WHERE password = '123456';
