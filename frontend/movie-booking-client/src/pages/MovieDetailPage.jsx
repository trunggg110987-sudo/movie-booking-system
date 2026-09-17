import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {getMovieDetail, getShowtimesByMovie} from "../services/movieService";

const imageMap = {
    "Avengers: Endgame": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
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
    if (!raw) return "";
    const date = new Date(raw);
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const day = weekdays[date.getDay()];
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return {day, date: `${dd}/${mm}`, time: `${hh}:${min}`};
}

function MovieDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [detail, st] = await Promise.all([
                getMovieDetail(id),
                getShowtimesByMovie(id)
            ]);
            const m = detail.data;
            m.image = m.image?.trim() || imageMap[m.title] || "";
            setMovie(m);
            setShowtimes(st.data);
        };
        fetchData();
    }, [id]);

    if (!movie) return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "#080808",
            color: "#fff",
            fontFamily: "Outfit, sans-serif"
        }}>
            <div style={{textAlign: "center"}}>
                <div style={{fontSize: "40px", marginBottom: "16px"}}>🎬</div>
                <p style={{color: "#6b7280"}}>Đang tải...</p>
            </div>
        </div>
    );

    return (
        <div style={{background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', sans-serif"}}>
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;500;600&display=swap"
                rel="stylesheet"/>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .showtime-card {
                    cursor: pointer;
                    border: 1px solid #2a2a2a;
                    border-radius: 12px;
                    padding: 14px 20px;
                    background: #111;
                    transition: all 0.25s ease;
                    text-align: center;
                    min-width: 100px;
                }
                .showtime-card:hover {
                    border-color: #dc2626;
                    background: rgba(220,38,38,0.08);
                    transform: translateY(-3px);
                }
                .showtime-card.selected {
                    border-color: #dc2626;
                    background: rgba(220,38,38,0.15);
                    box-shadow: 0 0 20px rgba(220,38,38,0.2);
                }
            `}</style>

            {/* HERO */}
            <div style={{position: "relative", height: "500px", overflow: "hidden"}}>
                {/* Blurred BG */}
                {movie.image && (
                    <img src={movie.image} alt=""
                         style={{
                             position: "absolute",
                             inset: 0,
                             width: "100%",
                             height: "100%",
                             objectFit: "cover",
                             filter: "blur(20px) brightness(0.3)",
                             transform: "scale(1.1)"
                         }}
                    />
                )}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, #080808 0%, transparent 60%)"
                }}/>

                {/* Content */}
                <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center",
                    padding: "0 60px", gap: "48px",
                    animation: "fadeUp 0.7s ease"
                }}>
                    {/* Poster */}
                    {movie.image && (
                        <div style={{
                            flexShrink: 0,
                            width: "200px", height: "300px",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)"
                        }}>
                            <img src={movie.image} alt={movie.title}
                                 style={{width: "100%", height: "100%", objectFit: "cover"}}/>
                        </div>
                    )}

                    {/* Info */}
                    <div style={{flex: 1}}>
                        <span style={{
                            display: "inline-block",
                            background: "linear-gradient(135deg, #dc2626, #991b1b)",
                            color: "white", fontSize: "11px", fontWeight: 600,
                            padding: "4px 14px", borderRadius: "20px",
                            letterSpacing: "1.5px", textTransform: "uppercase",
                            marginBottom: "16px"
                        }}>
                            🔴 Đang chiếu
                        </span>

                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "3.2rem", fontWeight: 900,
                            lineHeight: 1.1, margin: "0 0 16px",
                            textShadow: "0 2px 20px rgba(0,0,0,0.3)"
                        }}>
                            {movie.title}
                        </h1>

                        <p style={{
                            color: "#9ca3af",
                            fontSize: "15px",
                            lineHeight: 1.7,
                            maxWidth: "500px",
                            fontWeight: 300
                        }}>
                            {movie.description}
                        </p>

                        {/* Tags */}
                        <div style={{display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap"}}>
                            {["Hành động", "Phiêu lưu", "2026"].map(tag => (
                                <span key={tag} style={{
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    padding: "4px 14px", borderRadius: "20px",
                                    fontSize: "12px", color: "#d1d5db"
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SHOWTIMES */}
            <div style={{padding: "48px 60px"}}>
                <div style={{display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px"}}>
                    <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700}}>
                        Chọn suất chiếu
                    </h2>
                    <span style={{
                        background: "rgba(220,38,38,0.15)",
                        border: "1px solid rgba(220,38,38,0.3)",
                        color: "#f87171", fontSize: "12px",
                        padding: "4px 12px", borderRadius: "20px"
                    }}>
                        {showtimes.length} suất
                    </span>
                </div>

                <div style={{
                    width: "60px",
                    height: "3px",
                    background: "linear-gradient(to right, #dc2626, #f97316)",
                    borderRadius: "2px",
                    marginBottom: "28px"
                }}/>

                {showtimes.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "60px 0",
                        color: "#4b5563", fontSize: "15px"
                    }}>
                        <div style={{fontSize: "48px", marginBottom: "16px"}}>🎭</div>
                        Chưa có suất chiếu nào
                    </div>
                ) : (
                    <div style={{display: "flex", flexWrap: "wrap", gap: "14px"}}>
                        {showtimes.map((s) => {
                            const fmt = formatShowtime(s.startTime);
                            const isSelected = selectedShowtime?.id === s.id;
                            return (
                                <div
                                    key={s.id}
                                    className={`showtime-card ${isSelected ? "selected" : ""}`}
                                    onClick={() => setSelectedShowtime(s)}
                                >
                                    <div style={{
                                        fontSize: "11px",
                                        color: "#6b7280",
                                        fontWeight: 500,
                                        letterSpacing: "0.5px",
                                        marginBottom: "4px"
                                    }}>
                                        {fmt.day} · {fmt.date}
                                    </div>
                                    <div style={{
                                        fontSize: "22px",
                                        fontWeight: 700,
                                        color: isSelected ? "#f87171" : "#fff",
                                        letterSpacing: "-0.5px"
                                    }}>
                                        {fmt.time}
                                    </div>
                                    {isSelected && (
                                        <div style={{fontSize: "11px", color: "#f87171", marginTop: "4px"}}>✓ Đã
                                            chọn</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                {selectedShowtime && (
                    <div style={{
                        marginTop: "40px",
                        padding: "24px 32px",
                        background: "linear-gradient(135deg, rgba(220,38,38,0.1), rgba(185,28,28,0.05))",
                        border: "1px solid rgba(220,38,38,0.2)",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        animation: "fadeUp 0.3s ease"
                    }}>
                        <div>
                            <p style={{color: "#9ca3af", fontSize: "13px", marginBottom: "4px"}}>Suất chiếu đã chọn</p>
                            <p style={{fontWeight: 600, fontSize: "16px"}}>
                                {movie.title} · {formatShowtime(selectedShowtime.startTime).day} {formatShowtime(selectedShowtime.startTime).date} · {formatShowtime(selectedShowtime.startTime).time}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(`/booking/${selectedShowtime.id}`)}
                            style={{
                                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                border: "none", color: "white",
                                padding: "14px 36px", borderRadius: "10px",
                                fontSize: "15px", fontWeight: 600,
                                cursor: "pointer", letterSpacing: "0.3px",
                                transition: "all 0.2s ease",
                                boxShadow: "0 8px 25px rgba(220,38,38,0.35)"
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