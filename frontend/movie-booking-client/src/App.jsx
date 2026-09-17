import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovieList from "./pages/MovieList";
import MovieDetailPage from "./pages/MovieDetailPage";
import MainLayout from "./layouts/MainLayout";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

function App() {
    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={token ? <Navigate to="/" replace /> : <LoginPage />}
                />

                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<MovieList />} />
                    <Route path="movies" element={<HomePage />} />
                    <Route path="movies/:id" element={<MovieDetailPage />} />
                    <Route path="booking/:id" element={<BookingPage />} />
                    <Route path="my-bookings" element={<MyBookingsPage />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;