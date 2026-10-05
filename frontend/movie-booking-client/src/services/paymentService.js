import api from "./api";

export const createPayment = (data) => {
    return api.post("/payments/create", data).then((res) => res.data?.data || res.data);
};

export const completePayment = (data) => {
    return api.post("/payments/success", data).then((res) => res.data?.data || res.data);
};
