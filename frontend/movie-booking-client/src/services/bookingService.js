import axios from "axios";

export const createBooking = (data) => {
    return axios.post("http://localhost:8080/api/bookings", data);
};