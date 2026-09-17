import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register({
                username,
                password,
                role: "USER",
            });

            navigate("/login");
        } catch (err) {
            setError("Đăng ký thất bại. Username có thể đã tồn tại.");
        }
    };

    return (
        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                relative
                overflow-hidden
                bg-black
                px-4
            "
            style={{
                backgroundImage:
                    "url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80"></div>

            {/* Red Glow */}
            <div
                className="
                    absolute
                    w-[600px]
                    h-[600px]
                    rounded-full
                    bg-red-700/20
                    blur-3xl
                "
            ></div>

            {/* Main Container */}
            <div
                className="
                    relative
                    z-10
                    w-full
                    max-w-5xl
                    overflow-hidden
                    rounded-3xl
                    border
                    border-[#2A1A1A]
                    bg-[#0A0404]/90
                    backdrop-blur-xl
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                "
                style={{
                    boxShadow: `
                        rgba(0,0,0,0.3) 0px 0px 0px 1px,
                        rgba(0,0,0,0.2) 0px 8px 16px,
                        rgba(229,9,20,0.15) 0px 20px 40px
                    `,
                }}
            >
                {/* LEFT CINEMA PANEL */}
                <div className="hidden lg:block relative">
                    <img
                        src="https://images.pexels.com/photos/7991319/pexels-photo-7991319.jpeg"
                        alt="cinema"
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-10">
                        <h1
                            className="
                                text-white
                                text-5xl
                                leading-tight
                                font-bold
                            "
                            style={{
                                fontFamily: "'Playfair Display', serif",
                            }}
                        >
                            Enter The
                            <br />
                            Cinema World
                        </h1>

                        <p
                            className="
                                text-[#A1A1AA]
                                mt-4
                                text-sm
                                leading-6
                                max-w-sm
                            "
                            style={{
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            Book blockbuster movies, choose premium seats,
                            and experience cinema like never before.
                        </p>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className="p-8 lg:p-12 flex items-center">
                    <div className="w-full">
                        {/* Logo */}
                        <div className="mb-10">
                            <h2
                                className="
                                    text-[#E50914]
                                    text-4xl
                                    font-bold
                                "
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                }}
                            >
                                CGV CINEMAS
                            </h2>

                            <p
                                className="
                                    text-[#A1A1AA]
                                    mt-3
                                    text-sm
                                "
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Create your cinema account
                            </p>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleRegister}>
                            {/* Username */}
                            <div className="mb-5">
                                <label
                                    className="
                                        block
                                        text-white/80
                                        text-sm
                                        mb-2
                                    "
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="
                                        w-full
                                        bg-[#1A0608]
                                        border
                                        border-[#2A1A1A]
                                        text-white
                                        px-4
                                        py-3
                                        rounded-xl
                                        outline-none
                                        transition-all
                                        duration-200
                                        placeholder:text-[#71717A]
                                        focus:border-[#F5C518]
                                        focus:ring-2
                                        focus:ring-[#F5C518]
                                    "
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-5">
                                <label
                                    className="
                                        block
                                        text-white/80
                                        text-sm
                                        mb-2
                                    "
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="
                                        w-full
                                        bg-[#1A0608]
                                        border
                                        border-[#2A1A1A]
                                        text-white
                                        px-4
                                        py-3
                                        rounded-xl
                                        outline-none
                                        transition-all
                                        duration-200
                                        placeholder:text-[#71717A]
                                        focus:border-[#F5C518]
                                        focus:ring-2
                                        focus:ring-[#F5C518]
                                    "
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p
                                    className="
                                        text-red-500
                                        text-sm
                                        mb-4
                                    "
                                    style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    {error}
                                </p>
                            )}

                            {/* Register Button */}
                            <button
                                type="submit"
                                className="
                                    w-full
                                    bg-[#E50914]
                                    hover:bg-[#C8000F]
                                    text-white
                                    py-3
                                    rounded-full
                                    font-medium
                                    transition-all
                                    duration-200
                                    hover:scale-[1.02]
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-[#F5C518]
                                "
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Create Account
                            </button>

                            {/* Back */}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="
                                    w-full
                                    mt-4
                                    border
                                    border-white/10
                                    bg-transparent
                                    hover:bg-white/5
                                    text-white
                                    py-3
                                    rounded-full
                                    transition-all
                                    duration-200
                                "
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Back to Login
                            </button>

                            {/* Footer */}
                            <p
                                className="
                                    text-center
                                    text-[#71717A]
                                    text-xs
                                    mt-6
                                "
                                style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                Experience premium cinema booking with CGV
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;