import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovieList from "./pages/MovieList";
import MovieDetailPage from "./pages/MovieDetailPage";
import MainLayout from "./layouts/MainLayout";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import { isAuthenticated } from "./services/authService";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const authenticated = isAuthenticated();
    if (!authenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Main app routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<MovieList />} />
                    <Route path="movies" element={<HomePage />} />
                    <Route path="movies/:id" element={<MovieDetailPage />} />

                    {/* Booking routes - handle both parameter formats */}
                    <Route path="booking/:showtimeId" element={<BookingPage />} />
                    <Route path="booking/:id" element={<BookingPage />} />

                    {/* Protected My Tickets */}
                    <Route
                        path="my-bookings"
                        element={
                            <ProtectedRoute>
                                <MyBookingsPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
