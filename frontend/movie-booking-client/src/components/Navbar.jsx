import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav
            className="
                fixed top-0 left-0 w-full z-50
                bg-[#2C0A0E]/80
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
                "
                style={{
                    fontFamily: "'Playfair Display', serif",
                }}
            >
                CGV CINEMAS
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
                    onClick={() => navigate("/my-bookings")}
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

                {/* Logout Button */}
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}
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
                        focus:ring-2
                        focus:ring-[#F5C518]
                    "
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;