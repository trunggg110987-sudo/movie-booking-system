import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetail, getShowtimesByMovie } from "../services/movieService";

const imageMap = {
    "Avengers: Endgame": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "Avengers: Endgame (4K)": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "The Dark Knight": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOI-ol3t5a85pw8sSPVBI4gN1FJ_LVkE-OAQ&s",
    "Spider-Man: No Way Home": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    "Iron Man": "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    "Doctor Strange": "https://m.media-amazon.com/images/M/MV5BN2YxZGRjMzYtZjE1ZC00MDI0LThjZmQtZTZmMzVmMmQ2NzBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "Black Panther": "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    "Civil War": "https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg",
    "Thor Ragnarok": "https://image.tmdb.org/t/p/w500/kaIfm5ryEOwYg8mLbq8HkPuM1Fo.jpg",
    "Joker": "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    "Matrix": "https://m.media-amazon.com/images/M/MV5BZGM1NDM3MTAtMmI0ZC00ZDAwLWEwY2EtNDdhYjZmMjJkNzM0XkEyXkFqcGc@._V1_.jpg",
    "Inception": "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    "Interstellar": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    "Fast 7": "https://upload.wikimedia.org/wikipedia/vi/b/b8/Furious_7_poster.jpg",
    "John Wick": "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    "MI Fallout": "https://image.tmdb.org/t/p/w500/AkJQpZp9WoNdj7pLYSj1L0RcMMN.jpg",
    "Naruto The Last": "https://image.tmdb.org/t/p/w500/bAQ8O5Uw6FedtlCbJTutenzPVKd.jpg",
    "Your Name": "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
    "Demon Slayer": "https://image.tmdb.org/t/p/w500/h8Rb9gBr48ODIwYUttZNYeMWeUU.jpg",
    "One Piece Red": "https://image.tmdb.org/t/p/w500/ogDXuVkO92GcETZfSofXXemw7gb.jpg",
    "Attack on Titan": "https://static2.vieon.vn/vieplay-image/thumbnail_big_v4/2022/04/20/bjba9wk4_1920x1080-attackontitan-2_1267_712.jpg",
    "Avatar": "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    "Titanic": "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg"
};

function formatShowtime(raw) {
    if (!raw) return { day: "", date: "", time: "", dateKey: "", fullDate: "" };
    const date = new Date(raw);
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const day = weekdays[date.getDay()];
    const yyyy = date.getFullYear();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const dateKey = `${yyyy}-${mm}-${dd}`;
    return {
        day,
        date: `${dd}/${mm}`,
        time: `${hh}:${min}`,
        dateKey,
        fullDate: `${day}, ${dd}/${mm}/${yyyy}`
    };
}

function MovieDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDateKey, setSelectedDateKey] = useState("");
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [detail, st] = await Promise.all([
                    getMovieDetail(id),
                    getShowtimesByMovie(id).catch((err) => {
                        console.warn("Could not fetch showtimes:", err);
                        return [];
                    })
                ]);
                const m = detail?.data || detail;
                if (m) {
                    m.image = m.image?.trim() || imageMap[m.title] || `https://picsum.photos/seed/${m.id || id}/400/600`;
                    setMovie(m);
                } else {
                    setError("Không tìm thấy thông tin phim");
                }
                const stList = Array.isArray(st) ? st : (st?.data || []);
                setShowtimes(stList);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết phim:", err);
                setError("Đã xảy ra lỗi khi tải dữ liệu phim.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const availableDates = useMemo(() => {
        if (!showtimes || showtimes.length === 0) return [];
        const dateMap = new Map();
        const todayKey = new Date().toISOString().split("T")[0];

        showtimes.forEach((st) => {
            const fmt = formatShowtime(st.startTime);
            if (!dateMap.has(fmt.dateKey)) {
                const isToday = fmt.dateKey === todayKey;
                dateMap.set(fmt.dateKey, {
                    dateKey: fmt.dateKey,
                    dayName: isToday ? "Hôm nay" : fmt.day,
                    dateLabel: fmt.date,
                    count: 1
                });
            } else {
                dateMap.get(fmt.dateKey).count += 1;
            }
        });

        return Array.from(dateMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    }, [showtimes]);

    useEffect(() => {
        if (availableDates.length > 0) {
            if (!selectedDateKey || !availableDates.some(d => d.dateKey === selectedDateKey)) {
                setSelectedDateKey(availableDates[0].dateKey);
            }
        }
    }, [availableDates, selectedDateKey]);

    const filteredShowtimes = useMemo(() => {
        if (!selectedDateKey) return showtimes;
        return showtimes.filter((s) => {
            const fmt = formatShowtime(s.startTime);
            return fmt.dateKey === selectedDateKey;
        });
    }, [showtimes, selectedDateKey]);

    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#080808",
                color: "#fff",
                fontFamily: "Outfit, sans-serif"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>🎬</div>
                    <p style={{ color: "#6b7280" }}>Đang tải thông tin phim...</p>
                </div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "#080808",
                color: "#fff",
                fontFamily: "Outfit, sans-serif"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
                    <p style={{ color: "#ef4444", marginBottom: "16px" }}>{error || "Không tìm thấy phim"}</p>
                    <button
                        onClick={() => navigate("/")}
                        style={{
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Quay lại trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', sans-serif", paddingBottom: "80px" }}>
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .date-tab {
                    cursor: pointer;
                    border: 1px solid #262626;
                    border-radius: 14px;
                    padding: 12px 20px;
                    background: #121212;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    text-align: center;
                    min-width: 90px;
                    user-select: none;
                }
                .date-tab:hover {
                    border-color: #ef4444;
                    background: #1a0f0f;
                    transform: translateY(-2px);
                }
                .date-tab.active {
                    background: linear-gradient(135deg, #dc2626, #991b1b);
                    border-color: #f87171;
                    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
                    transform: translateY(-3px) scale(1.03);
                }
                .showtime-card {
                    cursor: pointer;
                    border: 1px solid #222;
                    border-radius: 14px;
                    padding: 16px 22px;
                    background: #111;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    min-width: 140px;
                    user-select: none;
                }
                .showtime-card:hover {
                    border-color: #ef4444;
                    background: #180d0e;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                }
                .showtime-card.selected {
                    background: linear-gradient(135deg, #1f0b0d, #2d0f12);
                    border: 2px solid #ef4444;
                    box-shadow: 0 0 25px rgba(239, 68, 68, 0.35);
                    transform: translateY(-3px) scale(1.02);
                }
            `}</style>

            {/* HERO / MOVIE INFO */}
            <div style={{
                position: "relative",
                padding: "80px 60px 40px",
                background: "radial-gradient(ellipse at top, rgba(220,38,38,0.18) 0%, rgba(8,8,8,0.95) 70%)",
                borderBottom: "1px solid #1c1c1c"
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#9ca3af",
                        padding: "8px 18px",
                        borderRadius: "20px",
                        cursor: "pointer",
                        marginBottom: "28px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        fontWeight: 500,
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                >
                    ← Quay lại danh sách
                </button>

                <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {movie.image && (
                        <div style={{
                            width: "220px",
                            height: "330px",
                            borderRadius: "16px",
                            overflow: "hidden",
                            flexShrink: 0,
                            boxShadow: "0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)"
                        }}>
                            <img
                                src={movie.image}
                                alt={movie.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    )}

                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <span style={{
                                background: "linear-gradient(135deg, #dc2626, #991b1b)",
                                color: "white", fontSize: "11px", fontWeight: 700,
                                padding: "4px 14px", borderRadius: "20px",
                                letterSpacing: "1.5px", textTransform: "uppercase"
                            }}>
                                🔴 Đang chiếu
                            </span>
                            <span style={{
                                background: "rgba(245, 197, 24, 0.15)",
                                border: "1px solid rgba(245, 197, 24, 0.3)",
                                color: "#facc15", fontSize: "12px", fontWeight: 600,
                                padding: "4px 12px", borderRadius: "20px"
                            }}>
                                ⭐ 9.2 / 10
                            </span>
                        </div>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "3rem", fontWeight: 900,
                            lineHeight: 1.1, margin: "0 0 16px",
                            textShadow: "0 2px 20px rgba(0,0,0,0.4)"
                        }}>
                            {movie.title}
                        </h1>

                        <p style={{
                            color: "#9ca3af",
                            fontSize: "15px",
                            lineHeight: 1.7,
                            maxWidth: "600px",
                            fontWeight: 300,
                            marginBottom: "20px"
                        }}>
                            {movie.description || "Một siêu phẩm điện ảnh đỉnh cao với kỹ xảo hoành tráng, nội dung lôi cuốn và cảm xúc trọn vẹn dành cho khán giả tại rạp CGV Cinemas."}
                        </p>

                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {["Hành động", "Phiêu lưu", "2D Phụ đề", "Thời lượng: " + (movie.duration ? movie.duration + " phút" : "120 phút")].map(tag => (
                                <span key={tag} style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    padding: "5px 16px", borderRadius: "20px",
                                    fontSize: "12px", color: "#d1d5db"
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* DATE & SHOWTIME SELECTOR SECTION */}
            <div style={{ padding: "48px 60px" }}>
                
                {/* 1. DATE SELECTION */}
                <div style={{ marginBottom: "36px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 700 }}>
                                📅 Chọn ngày xem
                            </h2>
                            <span style={{ color: "#6b7280", fontSize: "13px" }}>
                                (Lựa chọn ngày để xem danh sách suất chiếu tương ứng)
                            </span>
                        </div>
                    </div>

                    {availableDates.length === 0 ? (
                        <div style={{ color: "#6b7280", fontSize: "14px" }}>Chưa có lịch chiếu cho phim này.</div>
                    ) : (
                        <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "10px" }}>
                            {availableDates.map((d) => {
                                const isActive = selectedDateKey === d.dateKey;
                                return (
                                    <div
                                        key={d.dateKey}
                                        className={`date-tab ${isActive ? "active" : ""}`}
                                        onClick={() => {
                                            setSelectedDateKey(d.dateKey);
                                            setSelectedShowtime(null);
                                        }}
                                    >
                                        <div style={{
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            color: isActive ? "#fff" : "#9ca3af",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            marginBottom: "4px"
                                        }}>
                                            {d.dayName}
                                        </div>
                                        <div style={{
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            color: isActive ? "#fff" : "#e5e7eb"
                                        }}>
                                            {d.dateLabel}
                                        </div>
                                        <div style={{
                                            fontSize: "10px",
                                            color: isActive ? "#fca5a5" : "#6b7280",
                                            marginTop: "4px",
                                            fontWeight: 500
                                        }}>
                                            {d.count} suất
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 2. SHOWTIMES LIST FOR SELECTED DATE */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 700 }}>
                            🎟 Suất chiếu ngày {availableDates.find(d => d.dateKey === selectedDateKey)?.dayName || ""} {availableDates.find(d => d.dateKey === selectedDateKey)?.dateLabel || ""}
                        </h2>
                        <span style={{
                            background: "rgba(220,38,38,0.15)",
                            border: "1px solid rgba(220,38,38,0.3)",
                            color: "#f87171", fontSize: "12px",
                            padding: "3px 12px", borderRadius: "20px",
                            fontWeight: 600
                        }}>
                            {filteredShowtimes.length} suất chiếu
                        </span>
                    </div>

                    <div style={{
                        width: "60px",
                        height: "3px",
                        background: "linear-gradient(to right, #dc2626, #f97316)",
                        borderRadius: "2px",
                        marginBottom: "24px"
                    }} />

                    {filteredShowtimes.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "50px 0",
                            background: "#111", borderRadius: "16px",
                            border: "1px dashed #2a2a2a", color: "#6b7280", fontSize: "14px"
                        }}>
                            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎭</div>
                            Không có suất chiếu nào vào ngày này. Vui lòng chọn ngày khác ở trên.
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                            {filteredShowtimes.map((s) => {
                                const fmt = formatShowtime(s.startTime);
                                const isSelected = selectedShowtime?.id === s.id;
                                const roomName = s.room?.name || ("Phòng " + (s.room?.id || 1));
                                return (
                                    <div
                                        key={s.id}
                                        className={`showtime-card ${isSelected ? "selected" : ""}`}
                                        onClick={() => setSelectedShowtime(s)}
                                    >
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: "8px",
                                            marginBottom: "6px"
                                        }}>
                                            <span style={{
                                                fontSize: "11px",
                                                color: isSelected ? "#fca5a5" : "#9ca3af",
                                                fontWeight: 600,
                                                background: isSelected ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.05)",
                                                padding: "2px 8px",
                                                borderRadius: "6px"
                                            }}>
                                                {roomName}
                                            </span>
                                            <span style={{ fontSize: "10px", color: "#6b7280" }}>2D Digital</span>
                                        </div>

                                        <div style={{
                                            fontSize: "24px",
                                            fontWeight: 800,
                                            color: isSelected ? "#ef4444" : "#fff",
                                            letterSpacing: "-0.5px"
                                        }}>
                                            {fmt.time}
                                        </div>

                                        <div style={{
                                            fontSize: "11px",
                                            color: isSelected ? "#f87171" : "#6b7280",
                                            marginTop: "6px",
                                            fontWeight: 500
                                        }}>
                                            {isSelected ? "✓ Đã chọn suất này" : "80k - 120k / vé"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 3. CTA BOTTOM BAR */}
                {selectedShowtime && (
                    <div style={{
                        marginTop: "40px",
                        padding: "24px 32px",
                        background: "linear-gradient(135deg, rgba(220,38,38,0.15), rgba(185,28,28,0.06))",
                        border: "1px solid rgba(220,38,38,0.3)",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "20px",
                        animation: "fadeUp 0.3s ease",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                    }}>
                        <div>
                            <p style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                                Suất chiếu đã chọn
                            </p>
                            <p style={{ fontWeight: 700, fontSize: "18px", color: "#fff" }}>
                                {movie.title} · <span style={{ color: "#f87171" }}>{formatShowtime(selectedShowtime.startTime).fullDate}</span> · <span style={{ color: "#facc15" }}>{formatShowtime(selectedShowtime.startTime).time}</span> ({selectedShowtime.room?.name || ("Phòng " + (selectedShowtime.room?.id || 1))})
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/booking/${selectedShowtime.id}`)}
                            style={{
                                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                border: "none", color: "white",
                                padding: "14px 36px", borderRadius: "12px",
                                fontSize: "15px", fontWeight: 700,
                                cursor: "pointer", letterSpacing: "0.5px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 8px 25px rgba(220,38,38,0.4)"
                            }}
                            onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                            onMouseLeave={e => e.target.style.transform = "scale(1)"}
                        >
                            🎟 Chọn ghế ngay
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetailPage;
