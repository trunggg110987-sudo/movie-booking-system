import api from "./api";

export const getSeatsByShowtime = (showtimeId) => {
    return api.get(`/seats/showtime/${showtimeId}`).then((res) => res.data?.data || res.data);
};

export const lockSeat = (data) => {
    return api.post("/seat-lock", data);
};

export const unlockSeat = (userId) => {
    return api.delete(`/seat-lock/${userId}`);
};
