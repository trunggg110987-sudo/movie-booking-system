import { useNavigate } from "react-router-dom";

function MyBookingsPage() {
    const navigate = useNavigate();
    const tickets = JSON.parse(localStorage.getItem("myTickets") || "[]").reverse();

    return (
        <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', sans-serif", paddingBottom: "80px" }}>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .ticket-card {
                    background: #0f0f0f;
                    border: 1px solid #1a1a1a;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: rgba(0,0,0,0.3) 0 0 0 1px, rgba(0,0,0,0.2) 0 4px 8px, rgba(0,0,0,0.15) 0 8px 16px, rgba(255,255,255,0.02) 0 1px 0 inset;
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                    animation: fadeUp 0.5s ease both;
                }
                .ticket-card:hover {
                    transform: translateY(-6px);
                    box-shadow: rgba(229,9,20,0.2) 0 20px 40px, rgba(0,0,0,0.4) 0 0 0 1px;
                }
                .seat-chip {
                    background: rgba(245,197,24,0.1);
                    border: 1px solid rgba(245,197,24,0.2);
                    color: #facc15;
                    font-size: 11px; font-weight: 600;
                    padding: 3px 10px; border-radius: 9999px;
                }
                .cta-btn {
                    background: linear-gradient(135deg, #e50914, #b91c1c);
                    border: none; color: #fff;
                    padding: 14px 40px; border-radius: 9999px;
                    font-family: 'Outfit', sans-serif;
                    font-size: 15px; font-weight: 600;
                    cursor: pointer; letter-spacing: 0.3px;
                    box-shadow: 0 8px 24px rgba(229,9,20,0.35);
                    transition: all 0.2s ease;
                }
                .cta-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 32px rgba(229,9,20,0.5);
                }
                .social-link {
                    color: #6b7280; font-size: 13px;
                    cursor: pointer; transition: color 0.2s;
                    display: block; line-height: 2.2;
                }
                .social-link:hover { color: #e50914; }
            `}</style>

            {/* ── HEADER ── */}
            <div style={{ padding: "48px 52px 0", animation: "fadeUp 0.5s ease both" }}>
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none", border: "none",
                        color: "#6b7280", fontSize: "13px",
                        cursor: "pointer", marginBottom: "24px",
                        display: "flex", alignItems: "center", gap: "6px",
                        fontFamily: "'Outfit', sans-serif", padding: 0,
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                >
                    ← Trang chủ
                </button>

                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "2.8rem", fontWeight: 700,
                            letterSpacing: "-0.5px", marginBottom: "8px"
                        }}>
                            My Tickets
                        </h1>
                        <div style={{ width: "60px", height: "3px", background: "linear-gradient(to right, #e50914, #f97316)", borderRadius: "2px" }} />
                    </div>

                    {tickets.length > 0 && (
                        <div style={{
                            background: "rgba(229,9,20,0.1)",
                            border: "1px solid rgba(229,9,20,0.2)",
                            borderRadius: "9999px",
                            padding: "8px 20px",
                            fontSize: "13px", color: "#f87171", fontWeight: 500
                        }}>
                            🎟 {tickets.length} vé đã đặt
                        </div>
                    )}
                </div>
            </div>

            {/* ── EMPTY STATE ── */}
            {tickets.length === 0 ? (
                <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "120px 24px", textAlign: "center",
                    animation: "fadeUp 0.6s ease both"
                }}>
                    <div style={{
                        width: "96px", height: "96px",
                        background: "rgba(229,9,20,0.08)",
                        border: "1px solid rgba(229,9,20,0.15)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "40px", marginBottom: "24px"
                    }}>
                        🎭
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "10px" }}>
                        Chưa có vé nào
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "32px", fontWeight: 300 }}>
                        Bạn chưa đặt vé nào. Hãy khám phá các bộ phim đang chiếu!
                    </p>
                    <button className="cta-btn" onClick={() => navigate("/movies")}>
                        🎬 Xem phim ngay
                    </button>
                </div>
            ) : (
                <div style={{ maxWidth: "860px", margin: "48px auto 0", padding: "0 24px" }}>
                    {tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className="ticket-card"
                            style={{ marginBottom: "20px", animationDelay: `${index * 0.07}s` }}
                        >
                            {/* Top accent bar */}
                            <div style={{ height: "3px", background: "linear-gradient(to right, #e50914, #f97316)" }} />

                            <div style={{ padding: "24px 28px" }}>

                                {/* Header row */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#4b5563", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                                            Suất chiếu
                                        </div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700 }}>
                                            🎬 Showtime #{ticket.showtimeId}
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "rgba(34,197,94,0.1)",
                                        border: "1px solid rgba(34,197,94,0.2)",
                                        color: "#4ade80",
                                        fontSize: "12px", fontWeight: 600,
                                        padding: "6px 16px", borderRadius: "9999px",
                                        display: "flex", alignItems: "center", gap: "6px",
                                        letterSpacing: "0.5px"
                                    }}>
                                        ✓ Đã thanh toán
                                    </div>
                                </div>

                                {/* Divider dashed */}
                                <div style={{ borderTop: "1px dashed #1f1f1f", margin: "0 0 20px" }} />

                                {/* Info grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#4b5563", fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px" }}>
                                            Ghế đã chọn
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                            {ticket.seats.map(s => (
                                                <span key={s} className="seat-chip">{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "11px", color: "#4b5563", fontWeight: 500, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "8px" }}>
                                            Tổng tiền
                                        </div>
                                        <div style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "26px", fontWeight: 700,
                                            color: "#facc15", letterSpacing: "-0.5px"
                                        }}>
                                            {ticket.totalPrice?.toLocaleString("vi-VN")}đ
                                        </div>
                                    </div>
                                </div>

                                {/* Footer row */}
                                <div style={{
                                    display: "flex", alignItems: "center",
                                    justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
                                    borderTop: "1px solid #141414", paddingTop: "16px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4b5563", fontSize: "12px" }}>
                                        <span>🕐</span>
                                        <span>{ticket.bookedAt}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate("/movies")}
                                        style={{
                                            background: "rgba(229,9,20,0.08)",
                                            border: "1px solid rgba(229,9,20,0.2)",
                                            color: "#f87171",
                                            padding: "8px 20px", borderRadius: "9999px",
                                            fontSize: "12px", fontWeight: 600,
                                            cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                                            transition: "all 0.2s ease", letterSpacing: "0.3px"
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "rgba(229,9,20,0.15)";
                                            e.currentTarget.style.borderColor = "rgba(229,9,20,0.4)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "rgba(229,9,20,0.08)";
                                            e.currentTarget.style.borderColor = "rgba(229,9,20,0.2)";
                                        }}
                                    >
                                        🎬 Đặt thêm vé
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── FOOTER ── */}
            <footer style={{ background: "#0d0d0d", borderTop: "1px solid #141414", padding: "48px 48px 28px", marginTop: "80px" }}>
                <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", marginBottom: "32px" }}>
                    <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#e50914", marginBottom: "12px", fontWeight: 700 }}>
                            CGV CINEMAS
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.7 }}>
                            Nền tảng đặt vé xem phim hiện đại, mang đến trải nghiệm giải trí đỉnh cao.
                        </p>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px", color: "#e5e7eb" }}>Liên hệ</div>
                        <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 2.2 }}>
                            📧 trung@cgv.com<br />
                            📞 0942 457 198<br />
                            📍 Hà Nội, Việt Nam
                        </p>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px", color: "#e5e7eb" }}>Mạng xã hội</div>
                        {["→ Facebook", "→ Instagram", "→ YouTube"].map(s => (
                            <span key={s} className="social-link">{s}</span>
                        ))}
                    </div>
                </div>
                <div style={{ textAlign: "center", color: "#374151", fontSize: "12px", borderTop: "1px solid #141414", paddingTop: "20px" }}>
                    © 2026 CGV CINEMAS. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default MyBookingsPage;