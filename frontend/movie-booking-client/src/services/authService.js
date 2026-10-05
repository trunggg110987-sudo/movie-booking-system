import api from "./api";

// LOGIN
export const login = (data) => {
    return api.post("/auth/login", data).then((res) => res.data?.data || res.data);
};

// REGISTER
export const register = (data) => {
    return api.post("/auth/register", {
        username: data.username,
        password: data.password,
        role: "USER"
    }).then((res) => res.data?.data || res.data);
};

// GET CURRENT USER
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined" && userStr !== "null") {
            const user = JSON.parse(userStr);
            if (user && (user.id || user.username)) {
                return user;
            }
        }
    } catch (e) {
        console.error("Error parsing user:", e);
    }
    return null;
};

// CHECK IF AUTHENTICATED
export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();
    return Boolean(token && token !== "undefined" && token !== "null" && user);
};

// LOGOUT
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
};
