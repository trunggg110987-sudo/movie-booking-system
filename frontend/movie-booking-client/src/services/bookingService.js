import api from "./api";

export const createBooking = (data) => {
    return api.post("/bookings", data).then((res) => res.data?.data || res.data);
};

export const getBookingById = (id) => {
    return api.get(`/bookings/${id}`).then((res) => res.data?.data || res.data);
};

export const getBookingsByUser = (userId) => {
    return api.get(`/bookings/user/${userId}`).then((res) => res.data?.data || res.data);
};
