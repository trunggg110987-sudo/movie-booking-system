import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSeatsByShowtime, getShowtimeById } from "../services/movieService.js";
import { getCurrentUser } from "../services/authService.js";
import CheckoutModal from "../components/CheckoutModal.jsx";

const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .booking-root {
    background: #000;
    min-height: 100vh;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 140px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,24,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(245,197,24,0); }
  }

  .bk-header {
    padding: 36px 48px 0;
    animation: fadeUp 0.5s ease both;
  }
  .bk-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #71717A;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: color 0.2s;
    margin-bottom: 20px;
    background: none;
    border: none;
  }
  .bk-back:hover { color: #fff; }
  .bk-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .bk-subtitle {
    color: #71717A;
    font-size: 13px;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bk-badge {
    background: rgba(229,9,20,0.15);
    border: 1px solid rgba(229,9,20,0.3);
    color: #f87171;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 9999px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .bk-screen-wrap {
    padding: 36px 48px 0;
    animation: fadeUp 0.5s 0.1s ease both;
  }
  .bk-screen {
    position: relative;
    width: 70%;
    max-width: 600px;
    margin: 0 auto 10px;
    height: 14px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.04));
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    overflow: visible;
  }
  .bk-screen::before {
    content: '';
    position: absolute;
    top: -1px; left: -10%; right: -10%;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
    border-radius: 50%;
    box-shadow: 0 0 20px 4px rgba(255,255,255,0.15);
  }
  .bk-screen-label {
    text-align: center;
    font-size: 10px;
    font-weight: 600;
    color: #52525B;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 8px;
    margin-bottom: 32px;
  }

  .bk-seats-wrap {
    padding: 0 48px;
    animation: fadeUp 0.5s 0.15s ease both;
  }
  .bk-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .bk-row-label {
    width: 24px;
    text-align: right;
    font-size: 12px;
    font-weight: 700;
    color: #71717a;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .bk-seat {
    width: 42px;
    height: 38px;
    border-radius: 8px 8px 4px 4px;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease, background 0.15s ease;
    position: relative;
    border: 1px solid transparent;
    user-select: none;
  }
  .bk-seat::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 20%; right: 20%;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: inherit;
    filter: brightness(0.6);
    opacity: 0.8;
  }
  .bk-seat.normal {
    background: #1F2937;
    border-color: #374151;
    color: #9CA3AF;
  }
  .bk-seat.normal:hover {
    background: #374151;
    transform: translateY(-3px) scale(1.06);
    border-color: #4B5563;
    box-shadow: 0 6px 16px rgba(0,0,0,0.4);
  }
  .bk-seat.vip {
    background: #2E1065;
    border-color: #4C1D95;
    color: #C4B5FD;
  }
  .bk-seat.vip:hover {
    background: #3B0764;
    transform: translateY(-3px) scale(1.06);
    border-color: #6D28D9;
    box-shadow: 0 6px 16px rgba(109,40,217,0.3);
  }
  .bk-seat.selected {
    background: #F5C518 !important;
    border-color: #F5C518 !important;
    color: #000 !important;
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 20px rgba(245,197,24,0.4);
    animation: pulse 1.5s ease infinite;
  }
  .bk-seat.locked {
    background: #451A03 !important;
    border-color: #78350F !important;
    color: #F59E0B !important;
    cursor: not-allowed;
    opacity: 0.7;
  }
  .bk-seat.booked {
    background: #2a080c !important;
    border-color: #5c0d16 !important;
    color: #ef4444 !important;
    cursor: not-allowed;
    opacity: 0.8;
  }
  .bk-seat.booked::before {
    content: '✕';
    font-size: 13px;
    font-weight: 900;
    color: #ef4444;
  }

  .bk-legend {
    display: flex;
    justify-content: center;
    gap: 28px;
    margin-top: 36px;
    padding: 0 48px;
    flex-wrap: wrap;
    animation: fadeUp 0.5s 0.2s ease both;
  }
  .bk-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #9CA3AF;
  }
  .bk-legend-dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
  }

  .bk-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(10, 4, 4, 0.95);
    border-top: 1px solid #2A1A1A;
    backdrop-filter: blur(20px);
    padding: 16px 48px;
    z-index: 40;
  }
  .bk-bar-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }
  .bk-selected-seats {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    flex: 1;
  }
  .bk-empty-label {
    color: #52525B;
    font-size: 13px;
  }
  .bk-seat-chip {
    background: rgba(245,197,24,0.15);
    border: 1px solid rgba(245,197,24,0.3);
    color: #F5C518;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 9999px;
  }
  .bk-price-wrap {
    text-align: right;
  }
  .bk-price-label {
    font-size: 10px;
    color: #71717A;
    letter-spacing: 1px;
    font-weight: 600;
  }
  .bk-price {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #F5C518;
  }
  .bk-pay-btn {
    background: linear-gradient(135deg, #E50914, #B91C1C);
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 9999px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.3px;
    box-shadow: 0 8px 24px rgba(229,9,20,0.35);
    transition: all 0.2s ease;
  }
  .bk-pay-btn:hover:not(:disabled) {
    transform: scale(1.03);
    box-shadow: 0 12px 30px rgba(229,9,20,0.5);
  }
  .bk-pay-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }
  .bk-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;
    color: #71717A;
    font-size: 14px;
  }
  .bk-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(229,9,20,0.2);
    border-top-color: #E50914;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function BookingPage() {
    const params = useParams();
    const showtimeId = params.showtimeId || params.id;
    const navigate = useNavigate();
    const location = useLocation();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showtimeInfo, setShowtimeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const currentUser = getCurrentUser();

    const loadData = useCallback(async () => {
        if (!showtimeId) {
            setErrorMessage("Không tìm thấy mã suất chiếu.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage("");
            
            const [seatsRes, showtimeRes] = await Promise.all([
                getSeatsByShowtime(showtimeId).catch(() => []),
                getShowtimeById(showtimeId).catch(() => null)
            ]);

            const rawList = Array.isArray(seatsRes) ? seatsRes : (seatsRes?.data || []);

            const mapped = rawList.map((s, i) => {
                const name = s.seatNumber || `S${i + 1}`;
                return {
                    id: s.id,
                    name,
                    booked: Boolean(s.booked),
                    locked: Boolean(s.locked),
                    vip: Boolean(s.vip || name.startsWith("C") || name.startsWith("D")),
                };
            });

            setSeats(mapped);
            if (showtimeRes) {
                setShowtimeInfo(showtimeRes);
            } else {
                setShowtimeInfo({ id: showtimeId });
            }
        } catch (err) {
            console.error("Failed to load seats:", err);
            setErrorMessage("Không thể tải sơ đồ ghế cho suất chiếu này. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    }, [showtimeId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const toggleSeat = (seat) => {
        if (seat.booked) {
            alert("Ghế này đã được đặt!");
            return;
        }
        if (seat.locked) {
            alert("Ghế này đang được người khác giữ chỗ!");
            return;
        }

        setSelectedSeats((prev) => {
            if (prev.includes(seat.id)) {
                return prev.filter((id) => id !== seat.id);
            }
            if (prev.length >= 8) {
                alert("Bạn chỉ được chọn tối đa 8 ghế trong một lần đặt!");
                return prev;
            }
            return [...prev, seat.id];
        });
    };

    const totalPrice = selectedSeats.reduce((sum, seatId) => {
        const s = seats.find((item) => item.id === seatId);
        return sum + (s?.vip ? 120000 : 80000);
    }, 0);

    const handleOpenCheckout = () => {
        if (!currentUser || !currentUser.id) {
            alert("Vui lòng đăng nhập tài khoản để tiếp tục thanh toán!");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Vui lòng chọn ít nhất một ghế trước khi thanh toán!");
            return;
        }

        setShowCheckoutModal(true);
    };

    const rows = [...new Set(seats.map((s) => s.name?.charAt(0)))].filter(Boolean).sort();

    const getSeatClass = (seat) => {
        if (selectedSeats.includes(seat.id)) return "bk-seat selected";
        if (seat.booked) return "bk-seat booked";
        if (seat.locked) return "bk-seat locked";
        if (seat.vip) return "bk-seat vip";
        return "bk-seat normal";
    };

    return (
        <div className="booking-root">
            <link href={FONTS} rel="stylesheet" />
            <style>{CSS}</style>

            <div className="bk-header">
                <button className="bk-back" onClick={() => navigate(-1)}>
                    ← Quay lại chi tiết phim
                </button>
                <h1 className="bk-title">
                    {showtimeInfo?.movie?.title ? `Đặt vé: ${showtimeInfo.movie.title}` : "Chọn ghế ngồi"}
                </h1>
                <div className="bk-subtitle">
                    <span className="bk-badge">🔴 Trực tiếp</span>
                    <span>Suất chiếu #{showtimeId}</span>
                    <span style={{ color: "#3F3F46" }}>·</span>
                    <span>{showtimeInfo?.room?.name || "Phòng chiếu 1"}</span>
                    <span style={{ color: "#3F3F46" }}>·</span>
                    <span>{seats.length} ghế trong phòng</span>
                </div>
            </div>

            <div className="bk-screen-wrap">
                <div className="bk-screen" />
                <div className="bk-screen-label">Màn hình chiếu</div>
            </div>

            {loading ? (
                <div className="bk-loading">
                    <div className="bk-spinner" />
                    <span>Đang tải sơ đồ ghế trực tiếp từ hệ thống...</span>
                </div>
            ) : errorMessage ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#ef4444" }}>
                    <p style={{ fontSize: "18px", marginBottom: "12px" }}>⚠️ {errorMessage}</p>
                    <button
                        onClick={loadData}
                        style={{
                            background: "#dc2626", color: "#fff", border: "none",
                            padding: "8px 20px", borderRadius: "8px", cursor: "pointer"
                        }}
                    >
                        Tải lại sơ đồ ghế
                    </button>
                </div>
            ) : (
                <div className="bk-seats-wrap">
                    {rows.map((row) => (
                        <div key={row} className="bk-row">
                            <span className="bk-row-label">{row}</span>
                            {seats
                                .filter((s) => s.name?.charAt(0) === row)
                                .sort((a, b) => parseInt(a.name.slice(1)) - parseInt(b.name.slice(1)))
                                .map((seat) => (
                                    <div
                                        key={seat.id}
                                        className={getSeatClass(seat)}
                                        onClick={() => toggleSeat(seat)}
                                        title={
                                            seat.booked
                                                ? `${seat.name} · Đã đặt (Booked)`
                                                : seat.locked
                                                ? `${seat.name} · Đang giữ chỗ (Locked)`
                                                : `${seat.name} · ${seat.vip ? "VIP · 120,000đ" : "Thường · 80,000đ"}`
                                        }
                                    >
                                        {seat.booked ? "" : seat.name.slice(1)}
                                    </div>
                                ))}
                            <span className="bk-row-label" style={{ textAlign: "left", marginLeft: 6 }}>
                                {row}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="bk-legend">
                {[
                    { color: "#1F2937", border: "#374151", label: "Thường · 80.000đ" },
                    { color: "#2E1065", border: "#4C1D95", label: "VIP · 120.000đ" },
                    { color: "#F5C518", border: "#F5C518", label: "Đang chọn" },
                    { color: "#451A03", border: "#78350F", label: "Đang giữ chỗ" },
                    { color: "#2a080c", border: "#5c0d16", label: "Đã đặt (Không thể chọn)" },
                ].map((item) => (
                    <div key={item.label} className="bk-legend-item">
                        <div
                            className="bk-legend-dot"
                            style={{ background: item.color, border: `1px solid ${item.border}` }}
                        />
                        {item.label}
                    </div>
                ))}
            </div>

            <div className="bk-bar">
                <div className="bk-bar-inner">
                    <div className="bk-selected-seats">
                        {selectedSeats.length === 0 ? (
                            <span className="bk-empty-label">Chưa chọn ghế nào...</span>
                        ) : (
                            selectedSeats.map((id) => {
                                const s = seats.find((item) => item.id === id);
                                return <span key={id} className="bk-seat-chip">{s?.name}</span>;
                            })
                        )}
                    </div>

                    <div className="bk-price-wrap">
                        <div className="bk-price-label">TỔNG TIỀN VÉ</div>
                        <div className="bk-price">
                            {totalPrice > 0 ? `${totalPrice.toLocaleString("vi-VN")}đ` : "0đ"}
                        </div>
                    </div>

                    <button
                        className="bk-pay-btn"
                        onClick={handleOpenCheckout}
                        disabled={selectedSeats.length === 0}
                    >
                        Thanh toán ({selectedSeats.length} ghế) →
                    </button>
                </div>
            </div>

            {/* CHECKOUT MODAL */}
            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                showtimeInfo={showtimeInfo}
                selectedSeats={selectedSeats}
                seatsList={seats}
                currentUser={currentUser}
                onBookingComplete={() => {
                    loadData();
                }}
            />
        </div>
    );
}

export default BookingPage;
