import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// LOGIN
export const login = (data) => {
    return axios.post(`${API_URL}/login`, data);
};

// REGISTER
export const register = (data) => {
    return axios.post("http://localhost:8080/api/auth/register", {
        username: data.username,
        password: data.password,
        role: "USER"
    });
};