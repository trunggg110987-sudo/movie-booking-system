import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser } from "../services/bookingService.js";
import { getCurrentUser } from "../services/authService.js";

function MyBookingsPage() {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!currentUser?.id) {
            setTickets([]);
            return;
        }

        const userTicketKey = `myTickets_${currentUser.id}`;
        const localTickets = JSON.parse(localStorage.getItem(userTicketKey) || "[]").reverse();

        const fetchRemote = async () => {
            try {
                setLoading(true);
                const res = await getBookingsByUser(currentUser.id);
                const list = Array.isArray(res) ? res : (res?.data || []);
                if (list.length > 0) {
                    const mapped = list.map(b => ({
                        id: b.id,
                        ticketCode: `CGV-${b.id}-2026`,
                        showtimeId: b.showtime?.id,
                        movieTitle: b.showtime?.movie?.title || "Phim CGV Cinemas",
                        roomName: b.showtime?.room?.name || `Phòng ${b.showtime?.room?.id || 1}`,
                        startTime: b.showtime?.startTime ? new Date(b.showtime.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "19:30",
                        showDate: b.showtime?.startTime ? new Date(b.showtime.startTime).toLocaleDateString("vi-VN") : "Gần đây",
                        seats: ["Ghế đã xác nhận"],
                        totalPrice: 120000,
                        paymentMethod: "VIETQR",
                        bookedAt: b.bookingTime ? new Date(b.bookingTime).toLocaleString("vi-VN") : "Gần đây"
                    }));
                    const combined = [...localTickets];
                    mapped.forEach(m => {
                        if (!combined.some(c => c.id === m.id)) {
                            combined.push(m);
                        }
                    });
                    setTickets(combined);
                } else {
                    setTickets(localTickets);
                }
            } catch (err) {
                console.warn("Could not fetch remote bookings:", err);
                setTickets(localTickets);
            } finally {
                setLoading(false);
            }
        };

        fetchRemote();
    }, [currentUser?.id]);

    if (!currentUser) {
        return (
            <div style={{
                background: "#080808",
                minHeight: "100vh",
                color: "#fff",
                fontFamily: "'Outfit', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px"
            }}>
                <div style={{ textAlign: "center", maxWidth: "420px" }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔒</div>
                    <h2 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "12px" }}>
                        Vui lòng đăng nhập
                    </h2>
                    <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>
                        Bạn cần đăng nhập tài khoản để xem lịch sử vé và thông tin đặt chỗ của mình.
                    </p>
                    <button
                        onClick={() => navigate("/login", { state: { from: "/my-bookings" } })}
                        style={{
                            background: "linear-gradient(135deg, #e50914, #b91c1c)",
                            color: "#fff",
                            border: "none",
                            padding: "12px 32px",
                            borderRadius: "9999px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', sans-serif", paddingBottom: "80px" }}>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .ticket-card {
                    background: #11080a;
                    border: 1px solid #281417;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
                    animation: fadeUp 0.5s ease both;
                    position: relative;
                }
                .ticket-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(229,9,20,0.18);
                    border-color: #3d1c21;
                }
                .seat-chip {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(245,197,24,0.12);
                    border: 1px solid rgba(245,197,24,0.3);
                    color: #facc15;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 6px;
                    letter-spacing: 0.5px;
                }
                .cta-btn {
                    background: linear-gradient(135deg, #e50914, #b91c1c);
                    color: #fff",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                    boxShadow: "0 8px 20px rgba(229,9,20,0.35)",
                    transition: "transform 0.2s ease"
                }
                .cta-btn:hover {
                    transform: scale(1.04);
                }
            `}</style>

            <div style={{ padding: "48px 52px 20px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>
                        🎟 Vé đã đặt của tôi
                    </h1>
                    <span style={{ color: "#9ca3af", fontSize: "14px", fontWeight: 400 }}>
                        {currentUser?.username ? `(Tài khoản: ${currentUser.username})` : ""} · {tickets.length} vé đã đặt
                    </span>
                </div>

                <div style={{
                    width: "48px", height: "3px",
                    background: "linear-gradient(to right, #e50914, #f97316)",
                    borderRadius: "9999px",
                    marginTop: "16px", marginBottom: "40px"
                }} />
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                    Đang tải danh sách vé...
                </div>
            ) : tickets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 24px", animation: "fadeUp 0.5s ease both" }}>
                    <div style={{ fontSize: "64px", marginBottom: "20px", filter: "grayscale(0.5)" }}>🎟</div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>
                        Bạn chưa đặt vé nào
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: "15px", maxWidth: "380px", margin: "0 auto 32px", lineHeight: 1.6 }}>
                        Hãy khám phá các bộ phim bom tấn đang chiếu và đặt ngay những vị trí đẹp nhất!
                    </p>
                    <button className="cta-btn" onClick={() => navigate("/movies")}>
                        🎬 Khám phá phim ngay
                    </button>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                    gap: "24px",
                    padding: "0 52px"
                }}>
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="ticket-card">
                            <div style={{ height: "4px", background: "linear-gradient(to right, #e50914, #f59e0b)" }} />

                            <div style={{ padding: "24px 28px" }}>
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#f87171", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
                                            {ticket.ticketCode || `MÃ VÉ: #${ticket.id}`}
                                        </div>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700 }}>
                                            🎬 {ticket.movieTitle || `Suất chiếu #${ticket.showtimeId}`}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                                            📍 {ticket.roomName || "Phòng chiếu CGV"} {ticket.startTime ? `· ${ticket.startTime}` : ""} {ticket.showDate ? `(${ticket.showDate})` : ""}
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "rgba(34,197,94,0.1)",
                                        border: "1px solid rgba(34,197,94,0.2)",
                                        color: "#4ade80",
                                        fontSize: "12px", fontWeight: 600,
                                        padding: "4px 14px", borderRadius: "9999px",
                                        display: "flex", alignItems: "center", gap: "6px"
                                    }}>
                                        ✓ Đã thanh toán
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px dashed #2a1518", margin: "0 0 16px" }} />

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#71717a", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "6px" }}>
                                            Ghế đã chọn
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                            {Array.isArray(ticket.seats) ? ticket.seats.map(s => (
                                                <span key={s} className="seat-chip">{s}</span>
                                            )) : <span className="seat-chip">Đã xác nhận</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: "11px", color: "#71717a", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "6px" }}>
                                            Tổng tiền
                                        </div>
                                        <div style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: "22px", fontWeight: 700,
                                            color: "#facc15"
                                        }}>
                                            {ticket.totalPrice ? `${ticket.totalPrice.toLocaleString("vi-VN")}đ` : "120.000đ"}
                                        </div>
                                    </div>
                                </div>

                                {ticket.combos && ticket.combos.length > 0 && (
                                    <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px", background: "rgba(255,255,255,0.03)", padding: "6px 10px", borderRadius: "6px" }}>
                                        🍿 Bắp nước: <strong style={{ color: "#fff" }}>{ticket.combos.join(" + ")}</strong>
                                    </div>
                                )}

                                <div style={{
                                    display: "flex", alignItems: "center",
                                    justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
                                    borderTop: "1px solid #1f1214", paddingTop: "14px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#71717a", fontSize: "12px" }}>
                                        <span>🕐 Đặt lúc:</span>
                                        <span>{ticket.bookedAt}</span>
                                    </div>

                                    <div style={{
                                        fontSize: "11px", color: "#facc15",
                                        background: "rgba(245,197,24,0.1)",
                                        border: "1px solid rgba(245,197,24,0.2)",
                                        padding: "3px 10px", borderRadius: "6px", fontWeight: 600
                                    }}>
                                        💳 {ticket.paymentMethod || "VIETQR"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookingsPage;
