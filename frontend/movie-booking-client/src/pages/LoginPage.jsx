import { useState, useEffect } from "react";
import { login, isAuthenticated } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirectUrl = location.state?.from || "/";

    useEffect(() => {
        if (isAuthenticated()) {
            navigate(redirectUrl, { replace: true });
        } else {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");
            if (!token || !userStr || token === "undefined" || userStr === "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
    }, [navigate, redirectUrl]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        setLoading(true);
        try {
            const authData = await login({ username: username.trim(), password });

            if (authData?.token) {
                localStorage.setItem("token", authData.token);
                localStorage.setItem("user", JSON.stringify({
                    id: authData.userId || authData.id,
                    username: authData.username || username.trim(),
                    role: authData.role || "USER"
                }));
                window.dispatchEvent(new Event("auth-change"));
                navigate(redirectUrl, { replace: true });
            } else {
                setError("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black"
            style={{
                backgroundImage:
                    "url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
            <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-red-700"></div>

            <div
                className="relative z-10 w-[420px] bg-[#0A0404]/90 border border-[#2A1A1A] rounded-2xl p-10 shadow-2xl backdrop-blur-xl"
                style={{
                    boxShadow: `
                        rgba(0,0,0,0.3) 0px 0px 0px 1px,
                        rgba(0,0,0,0.2) 0px 4px 8px,
                        rgba(0,0,0,0.15) 0px 8px 16px,
                        rgba(229,9,20,0.15) 0px 20px 40px
                    `,
                }}
            >
                <div className="text-center mb-8">
                    <h1
                        className="text-[#E50914] text-4xl font-bold tracking-wide"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        CGV CINEMAS
                    </h1>

                    <p
                        className="text-[#A1A1AA] text-sm mt-3 tracking-[0.5px]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Welcome back to the cinema experience
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-5">
                        <label
                            className="block text-white/80 text-sm mb-2"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#1A0608] border border-[#2A1A1A] text-white px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-[#71717A] focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            className="block text-white/80 text-sm mb-2"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1A0608] border border-[#2A1A1A] text-white px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder:text-[#71717A] focus:border-[#F5C518] focus:ring-2 focus:ring-[#F5C518]"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        />
                    </div>

                    {error && (
                        <p
                            className="text-red-500 text-sm mb-4"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E50914] hover:bg-[#C8000F] text-white py-3 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F5C518] disabled:opacity-50"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    <p
                        className="text-center text-[#A1A1AA] text-sm mt-6"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-[#F5C518] cursor-pointer hover:underline"
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
