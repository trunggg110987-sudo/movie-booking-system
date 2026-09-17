import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSeatsByShowtime } from "../services/seatService.js";

const FONTS = `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap`;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .booking-root {
    background: #000;
    min-height: 100vh;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    padding-bottom: 120px;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245,197,24,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(245,197,24,0); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* HEADER */
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

  /* SCREEN */
  .bk-screen-wrap {
    padding: 40px 48px 0;
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

  /* SEATS */
  .bk-seats-wrap {
    padding: 0 48px;
    animation: fadeUp 0.5s 0.15s ease both;
  }
  .bk-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .bk-row-label {
    width: 20px;
    text-align: right;
    font-size: 11px;
    font-weight: 500;
    color: #3F3F46;
    margin-right: 4px;
    flex-shrink: 0;
  }
  .bk-seat {
    width: 38px;
    height: 34px;
    border-radius: 7px 7px 4px 4px;
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.15s ease, background 0.15s ease;
    position: relative;
    border: 1px solid transparent;
    letter-spacing: 0.2px;
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
    transform: translateY(-3px) scale(1.05);
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
    transform: translateY(-3px) scale(1.05);
    border-color: #6D28D9;
    box-shadow: 0 6px 16px rgba(109,40,217,0.3);
  }
  .bk-seat.selected {
    background: #F5C518;
    border-color: #F5C518;
    color: #000;
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 20px rgba(245,197,24,0.4);
    animation: pulse 1.5s ease infinite;
  }
  .bk-seat.locked {
    background: #451A03;
    border-color: #78350F;
    color: #92400E;
    cursor: not-allowed;
    opacity: 0.7;
  }
  .bk-seat.booked {
    background: #1A0608;
    border-color: #3F0A0E;
    color: #3F0A0E;
    cursor: not-allowed;
    opacity: 0.5;
  }
  .bk-seat.booked::before {
    content: '✕';
    font-size: 12px;
    color: #7F1D1D;
  }

  /* LEGEND */
  .bk-legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 32px;
    padding: 0 48px;
    flex-wrap: wrap;
    animation: fadeUp 0.5s 0.2s ease both;
  }
  .bk-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #71717A;
    font-weight: 400;
  }
  .bk-legend-dot {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  /* PAYMENT BAR */
  .bk-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(10,4,4,0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid #2A1A1A;
    padding: 16px 48px;
    z-index: 100;
    animation: slideUp 0.4s ease both;
  }
  .bk-bar-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .bk-selected-seats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
  }
  .bk-seat-chip {
    background: rgba(245,197,24,0.12);
    border: 1px solid rgba(245,197,24,0.25);
    color: #F5C518;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 9999px;
  }
  .bk-empty-label {
    color: #3F3F46;
    font-size: 13px;
    font-style: italic;
  }
  .bk-price-wrap { text-align: right; flex-shrink: 0; }
  .bk-price-label { font-size: 11px; color: #52525B; font-weight: 400; letter-spacing: 0.5px; margin-bottom: 2px; }
  .bk-price {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #F5C518;
    letter-spacing: -0.5px;
  }
  .bk-pay-btn {
    background: linear-gradient(135deg, #E50914, #C8000F);
    border: none;
    color: #fff;
    padding: 14px 36px;
    border-radius: 9999px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 8px 24px rgba(229,9,20,0.35);
    flex-shrink: 0;
  }
  .bk-pay-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF0A16, #E50914);
    transform: scale(1.04);
    box-shadow: 0 12px 32px rgba(229,9,20,0.5);
  }
  .bk-pay-btn:disabled {
    background: #1A0A0A;
    color: #3F3F46;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  /* LOADING */
  .bk-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;
    color: #3F3F46;
    font-size: 14px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .bk-spinner {
    width: 32px; height: 32px;
    border: 2px solid #1A0A0A;
    border-top-color: #E50914;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  /* PROCESSING OVERLAY */
  .bk-processing {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 200;
    gap: 20px;
    animation: fadeUp 0.2s ease;
  }
  .bk-processing-icon {
    font-size: 48px;
    animation: pulse 1s ease infinite;
  }
  .bk-processing-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #F5C518;
  }
  .bk-processing-sub {
    font-size: 13px;
    color: #71717A;
    font-weight: 400;
  }
`;

function BookingPage() {
    const { id: showtimeId } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const generateMockSeats = () => {
        const rows = ["A", "B", "C", "D", "E", "F", "G"];
        const counts = { A: 10, B: 10, C: 10, D: 10, E: 12, F: 12, G: 12 };
        const vipRows = ["C", "D"];
        const result = [];
        rows.forEach(row => {
            for (let i = 1; i <= counts[row]; i++) {
                result.push({
                    id: `${row}${i}`,
                    name: `${row}${i}`,
                    booked: Math.random() < 0.18,
                    locked: Math.random() < 0.05,
                    vip: vipRows.includes(row),
                });
            }
        });
        return result;
    };

    const mapSeats = (rawData) => {
        const data = Array.isArray(rawData) ? rawData : rawData?.data || [];
        return data.map((s, i) => {
            const name = s.seatNumber || s.name || `S${i}`;
            return {
                id: s.id,
                name,
                booked: s.booked ?? false,
                locked: s.locked ?? false,
                vip: s.vip ?? (name.startsWith("C") || name.startsWith("D")),
            };
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getSeatsByShowtime(showtimeId);
                let mapped = mapSeats(res.data);
                if (mapped.length < 10) mapped = generateMockSeats();
                setSeats(mapped);
            } catch {
                setSeats(generateMockSeats());
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [showtimeId]);

    const toggleSeat = (seat) => {
        if (seat.booked || seat.locked) return;
        setSelectedSeats(prev =>
            prev.includes(seat.id) ? prev.filter(s => s !== seat.id) : [...prev, seat.id]
        );
    };

    const totalPrice = selectedSeats.reduce((sum, id) => {
        const s = seats.find(s => s.id === id);
        return sum + (s?.vip ? 120000 : 80000);
    }, 0);

    const handlePayment = () => {
        setPaying(true);
        setTimeout(() => {
            const existing = JSON.parse(localStorage.getItem("myTickets") || "[]");
            const newTicket = {
                id: Date.now(),
                showtimeId,
                seats: selectedSeats.map(id => seats.find(s => s.id === id)?.name || id),
                totalPrice,
                bookedAt: new Date().toLocaleString("vi-VN"),
            };
            localStorage.setItem("myTickets", JSON.stringify([...existing, newTicket]));
            navigate("/my-bookings");
        }, 2000);
    };

    const rows = [...new Set(seats.map(s => s.name?.charAt(0)))].sort();

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

            {/* PROCESSING OVERLAY */}
            {paying && (
                <div className="bk-processing">
                    <div className="bk-processing-icon">🎟</div>
                    <div className="bk-processing-text">Đang xử lý thanh toán...</div>
                    <div className="bk-processing-sub">Vui lòng không đóng trang này</div>
                    <div className="bk-spinner" style={{ marginTop: 8 }} />
                </div>
            )}

            {/* HEADER */}
            <div className="bk-header">
                <button className="bk-back" onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>
                <h1 className="bk-title">Chọn ghế ngồi</h1>
                <div className="bk-subtitle">
                    <span className="bk-badge">🔴 Live</span>
                    <span>Suất chiếu #{showtimeId}</span>
                    <span style={{ color: "#2A1A1A" }}>·</span>
                    <span>{seats.length} ghế</span>
                </div>
            </div>

            {/* SCREEN */}
            <div className="bk-screen-wrap">
                <div className="bk-screen" />
                <div className="bk-screen-label">Màn hình chiếu</div>
            </div>

            {/* SEATS */}
            {loading ? (
                <div className="bk-loading">
                    <div className="bk-spinner" />
                    <span>Đang tải sơ đồ ghế...</span>
                </div>
            ) : (
                <div className="bk-seats-wrap">
                    {rows.map((row) => (
                        <div key={row} className="bk-row">
                            <span className="bk-row-label">{row}</span>
                            {seats
                                .filter(s => s.name?.charAt(0) === row)
                                .sort((a, b) => parseInt(a.name.slice(1)) - parseInt(b.name.slice(1)))
                                .map(seat => (
                                    <div
                                        key={seat.id}
                                        className={getSeatClass(seat)}
                                        onClick={() => toggleSeat(seat)}
                                        title={`${seat.name} · ${seat.vip ? "VIP · 120,000đ" : "Thường · 80,000đ"}`}
                                    >
                                        {seat.booked ? "" : seat.name.slice(1)}
                                    </div>
                                ))}
                            <span className="bk-row-label" style={{ textAlign: "left", marginLeft: 4 }}>{row}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* LEGEND */}
            <div className="bk-legend">
                {[
                    { color: "#1F2937", border: "#374151", label: "Thường · 80k" },
                    { color: "#2E1065", border: "#4C1D95", label: "VIP · 120k" },
                    { color: "#F5C518", border: "#F5C518", label: "Đang chọn" },
                    { color: "#451A03", border: "#78350F", label: "Đang giữ" },
                    { color: "#1A0608", border: "#3F0A0E", label: "Đã đặt" },
                ].map(item => (
                    <div key={item.label} className="bk-legend-item">
                        <div className="bk-legend-dot" style={{ background: item.color, border: `1px solid ${item.border}` }} />
                        {item.label}
                    </div>
                ))}
            </div>

            {/* PAYMENT BAR */}
            <div className="bk-bar">
                <div className="bk-bar-inner">
                    <div className="bk-selected-seats">
                        {selectedSeats.length === 0 ? (
                            <span className="bk-empty-label">Chưa chọn ghế nào...</span>
                        ) : (
                            selectedSeats.map(id => {
                                const s = seats.find(s => s.id === id);
                                return <span key={id} className="bk-seat-chip">{s?.name}</span>;
                            })
                        )}
                    </div>

                    <div className="bk-price-wrap">
                        <div className="bk-price-label">TỔNG TIỀN</div>
                        <div className="bk-price">
                            {totalPrice > 0 ? `${totalPrice.toLocaleString("vi-VN")}đ` : "—"}
                        </div>
                    </div>

                    <button
                        className="bk-pay-btn"
                        onClick={handlePayment}
                        disabled={selectedSeats.length === 0 || paying}
                    >
                        {paying ? "Đang xử lý..." : `Thanh toán · ${selectedSeats.length} ghế`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingPage;