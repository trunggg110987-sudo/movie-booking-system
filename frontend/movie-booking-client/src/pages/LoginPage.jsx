import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await login({ username, password });

            localStorage.setItem("token", res.data.token);

            window.location.href = "/";
        } catch (err) {
            setError("Tài khoản hoặc mật khẩu không chính xác.");
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
            "
            style={{
                backgroundImage:
                    "url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/75"></div>

            {/* Red cinematic glow */}
            <div
                className="
                    absolute
                    w-[500px]
                    h-[500px]
                    rounded-full
                    blur-3xl
                    opacity-20
                    bg-red-700
                "
            ></div>

            {/* Login Card */}
            <div
                className="
                    relative
                    z-10
                    w-[420px]
                    bg-[#0A0404]/90
                    border
                    border-[#2A1A1A]
                    rounded-2xl
                    p-10
                    shadow-2xl
                    backdrop-blur-xl
                "
                style={{
                    boxShadow: `
                        rgba(0,0,0,0.3) 0px 0px 0px 1px,
                        rgba(0,0,0,0.2) 0px 4px 8px,
                        rgba(0,0,0,0.15) 0px 8px 16px,
                        rgba(229,9,20,0.15) 0px 20px 40px
                    `,
                }}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1
                        className="
                            text-[#E50914]
                            text-4xl
                            font-bold
                            tracking-wide
                        "
                        style={{
                            fontFamily: "'Playfair Display', serif",
                        }}
                    >
                        CGV CINEMAS
                    </h1>

                    <p
                        className="
                            text-[#A1A1AA]
                            text-sm
                            mt-3
                            tracking-[0.5px]
                        "
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Welcome back to the cinema experience
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
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
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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

                    {/* Login Button */}
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
                        Sign In
                    </button>

                    {/* Register */}
                    <p
                        className="
                            text-center
                            text-[#A1A1AA]
                            text-sm
                            mt-6
                        "
                        style={{
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="
                                text-[#F5C518]
                                cursor-pointer
                                hover:underline
                            "
                        >
                            Sign up
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;