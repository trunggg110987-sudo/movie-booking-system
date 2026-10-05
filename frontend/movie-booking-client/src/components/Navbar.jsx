import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    useEffect(() => {
        const syncUser = () => {
            setCurrentUser(getCurrentUser());
        };

        syncUser();
        window.addEventListener("auth-change", syncUser);
        window.addEventListener("storage", syncUser);
        return () => {
            window.removeEventListener("auth-change", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, [location.pathname]);

    const handleMyTicketsClick = () => {
        if (!currentUser) {
            navigate("/login", { state: { from: "/my-bookings" } });
        } else {
            navigate("/my-bookings");
        }
    };

    return (
        <nav
            className="
                fixed top-0 left-0 w-full z-50
                bg-[#180507]/90
                backdrop-blur-xl
                border-b border-[#2A1A1A]
                px-6 lg:px-12
                h-16
                flex items-center justify-between
            "
        >
            {/* Logo */}
            <div
                onClick={() => navigate("/")}
                className="
                    cursor-pointer
                    text-[#E50914]
                    text-2xl
                    font-bold
                    tracking-wide
                    select-none
                    flex items-center gap-2
                "
                style={{
                    fontFamily: "'Playfair Display', serif",
                }}
            >
                <span>🎬</span> CGV CINEMAS
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
                <span
                    onClick={() => navigate("/")}
                    className="
                        text-white/80
                        text-sm
                        font-medium
                        tracking-[0.5px]
                        cursor-pointer
                        transition-all duration-200
                        hover:text-[#F5C518]
                    "
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    Trang chủ
                </span>

                <span
                    onClick={() => navigate("/movies")}
                    className="
                        text-white/80
                        text-sm
                        font-medium
                        tracking-[0.5px]
                        cursor-pointer
                        transition-all duration-200
                        hover:text-[#F5C518]
                    "
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    Phim
                </span>

                <span
                    onClick={handleMyTicketsClick}
                    className="
                        text-white/80
                        text-sm
                        font-medium
                        tracking-[0.5px]
                        cursor-pointer
                        transition-all duration-200
                        hover:text-[#F5C518]
                    "
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    My Tickets
                </span>

                {/* User info & Auth button */}
                {currentUser ? (
                    <div className="flex items-center gap-3 ml-2">
                        <span className="text-xs text-[#facc15] font-semibold bg-[#facc15]/10 border border-[#facc15]/20 px-3 py-1 rounded-full">
                            👤 {currentUser.username}
                        </span>
                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="
                                px-4 py-1.5
                                rounded-full
                                bg-[#E50914]
                                text-white
                                text-xs
                                font-semibold
                                tracking-[0.5px]
                                transition-all duration-200
                                hover:bg-[#C8000F]
                                hover:scale-[1.03]
                                focus:outline-none
                            "
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="
                            ml-2
                            px-5 py-2
                            rounded-full
                            bg-[#E50914]
                            text-white
                            text-sm
                            font-medium
                            tracking-[0.5px]
                            transition-all duration-200
                            hover:bg-[#C8000F]
                            hover:scale-[1.03]
                            focus:outline-none
                        "
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
