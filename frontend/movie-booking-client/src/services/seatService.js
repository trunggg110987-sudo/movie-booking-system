import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getSeatsByShowtime = (showtimeId) => {
    return axios.get(`${BASE_URL}/api/seats/showtime/${showtimeId}`);
};

export const lockSeat = (data) =>
    axios.post(`${BASE_URL}/api/seat-lock`, data);

export const unlockSeat = (userId) =>
    axios.delete(`${BASE_URL}/api/seat-lock/${userId}`);