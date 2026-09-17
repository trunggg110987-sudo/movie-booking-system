import api from "./api";

export const getMovies = () => {
    return api.get("/movies").then(res => res.data.data || res.data);
};

export const getMovieDetail = (id) => {
    return api.get(`/movies/${id}`).then(res => res.data.data || res.data);
};

export const getShowtimesByMovie = (movieId) => {
    return api.get(`/showtimes/movie/${movieId}`).then(res => res.data.data || res.data);
};

export const getSeatsByShowtime = (showtimeId) => {
    return api.get(`/seats/showtime/${showtimeId}`).then(res => res.data.data || res.data);
};

export const bookTicket = (data) => {
    return api.post("/bookings", data).then(res => res.data.data || res.data);
};