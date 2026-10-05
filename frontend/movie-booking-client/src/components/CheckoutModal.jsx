import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment, completePayment } from "../services/paymentService";
import { createBooking } from "../services/bookingService";

const VOUCHERS = {
    "CGV50K": { type: "FIXED", value: 50000, label: "Giảm 50.000đ cho đơn hàng" },
    "CGV10": { type: "PERCENT", value: 10, label: "Giảm 10% tổng đơn hàng" },
    "VIPMEMBER": { type: "FIXED", value: 30000, label: "Ưu đãi thành viên VIP - 30.000đ" },
};

const COMBOS = [
    {
        id: "combo-solo",
        name: "Combo Solo CGV",
        desc: "1 Bắp ngọt 60oz + 1 Nước ngọt 32oz mát lạnh",
        price: 69000,
        icon: "🍿",
    },
    {
        id: "combo-couple",
        name: "Combo Couple CGV",
        desc: "1 Bắp lớn 80oz + 2 Nước ngọt 32oz siêu đã",
        price: 99000,
        icon: "🥤",
    },
    {
        id: "combo-snack",
        name: "Snack Phô Mai Giòn",
        desc: "1 Khoai tây lắc phô mai cao cấp CGV",
        price: 35000,
        icon: "🍟",
    },
];

function CheckoutModal({
    isOpen,
    onClose,
    showtimeInfo,
    selectedSeats,
    seatsList,
    currentUser,
    onBookingComplete,
}) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Order Summary & Combos, 2: Payment Gateway, 3: E-Ticket
    const [selectedCombos, setSelectedCombos] = useState({});
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [voucherError, setVoucherError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("vietqr"); // 'vietqr', 'momo', 'vnpay', 'card'
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
    const [isProcessing, setIsProcessing] = useState(false);
    const [createdTicket, setCreatedTicket] = useState(null);

    // Card state
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");

    const ticketRef = useRef(null);

    // Countdown Timer
    useEffect(() => {
        if (!isOpen || step === 3) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert("Thời gian giữ chỗ đã hết hạn. Vui lòng thực hiện đặt vé lại!");
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, step, onClose]);

    if (!isOpen) return null;

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    // Calculate prices
    const seatItems = selectedSeats.map((id) => seatsList.find((s) => s.id === id) || { id, name: `S${id}`, vip: false });
    const rawSeatPrice = seatItems.reduce((sum, s) => sum + (s.vip ? 120000 : 80000), 0);

    const comboPrice = Object.entries(selectedCombos).reduce((sum, [comboId, qty]) => {
        const combo = COMBOS.find((c) => c.id === comboId);
        return sum + (combo ? combo.price * qty : 0);
    }, 0);

    const subtotal = rawSeatPrice + comboPrice;

    let discountAmount = 0;
    if (appliedVoucher) {
        if (appliedVoucher.type === "FIXED") {
            discountAmount = appliedVoucher.value;
        } else if (appliedVoucher.type === "PERCENT") {
            discountAmount = Math.round((subtotal * appliedVoucher.value) / 100);
        }
    }
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const handleApplyVoucher = () => {
        setVoucherError("");
        const code = voucherCode.trim().toUpperCase();
        if (!code) {
            setVoucherError("Vui lòng nhập mã voucher!");
            return;
        }
        if (VOUCHERS[code]) {
            setAppliedVoucher(VOUCHERS[code]);
        } else {
            setVoucherError("Mã voucher không hợp lệ hoặc đã hết hạn.");
        }
    };

    const handleComboQty = (comboId, delta) => {
        setSelectedCombos((prev) => {
            const current = prev[comboId] || 0;
            const updated = Math.max(0, current + delta);
            if (updated === 0) {
                const copy = { ...prev };
                delete copy[comboId];
                return copy;
            }
            return { ...prev, [comboId]: updated };
        });
    };

    const handleExecutePayment = async () => {
        if (!currentUser?.id) {
            alert("Vui lòng đăng nhập để hoàn tất thanh toán!");
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Optional backend payment record
            let paymentRecord = null;
            try {
                paymentRecord = await createPayment({
                    userId: currentUser.id,
                    showtimeId: Number(showtimeInfo?.id || 1),
                    amount: finalTotal,
                });
            } catch (err) {
                console.warn("Payment create warning:", err);
            }

            // 2. Create Booking in Database
            const bookingPayload = {
                userId: currentUser.id,
                showtimeId: Number(showtimeInfo?.id || 1),
                seatIds: selectedSeats,
            };
            const savedBooking = await createBooking(bookingPayload);

            // 3. Complete payment record if exists
            if (paymentRecord?.id) {
                try {
                    await completePayment({
                        paymentId: paymentRecord.id,
                        seatIds: selectedSeats,
                    });
                } catch (e) {
                    console.warn("Payment complete warning:", e);
                }
            }

            // 4. Generate Cinema E-Ticket
            const ticketCode = `CGV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
            const seatNames = seatItems.map((s) => s.name);
            const comboSummary = Object.entries(selectedCombos)
                .map(([id, q]) => `${q}x ${COMBOS.find((c) => c.id === id)?.name}`)
                .filter(Boolean);

            const ticketData = {
                id: savedBooking?.id || Date.now(),
                ticketCode,
                showtimeId: Number(showtimeInfo?.id || 1),
                movieTitle: showtimeInfo?.movie?.title || "Phim CGV Cinemas",
                moviePoster: showtimeInfo?.movie?.image || "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
                roomName: showtimeInfo?.room?.name || `Phòng chiếu ${showtimeInfo?.room?.id || 1}`,
                startTime: showtimeInfo?.startTime ? new Date(showtimeInfo.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "19:30",
                showDate: showtimeInfo?.startTime ? new Date(showtimeInfo.startTime).toLocaleDateString("vi-VN") : "Hôm nay",
                seats: seatNames,
                combos: comboSummary,
                totalPrice: finalTotal,
                paymentMethod: paymentMethod.toUpperCase(),
                bookedAt: new Date().toLocaleString("vi-VN"),
                userName: currentUser.username,
            };

            // Save to user storage
            const userKey = `myTickets_${currentUser.id}`;
            const existing = JSON.parse(localStorage.getItem(userKey) || "[]");
            localStorage.setItem(userKey, JSON.stringify([ticketData, ...existing]));

            setCreatedTicket(ticketData);
            setStep(3); // Go to E-Ticket screen
            if (onBookingComplete) {
                onBookingComplete(ticketData);
            }
        } catch (err) {
            console.error("Payment execution error:", err);
            const msg = err.response?.data?.message || err.message || "Thanh toán không thành công. Vui lòng thử lại!";
            alert("Lỗi thanh toán: " + msg);
        } finally {
            setIsProcessing(false);
        }
    };

    // VietQR URL generator
    const vietQrUrl = `https://img.vietqr.io/image/970422-0987654321-compact2.png?amount=${finalTotal}&addInfo=CGV%20${showtimeInfo?.id || 1}%20${currentUser?.username || "USER"}`;

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "'DM Sans', sans-serif",
            animation: "fadeIn 0.25s ease",
            overflowY: "auto"
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(229,9,20,0.25); } 50% { box-shadow: 0 0 35px rgba(229,9,20,0.5); } }
                .method-card {
                    cursor: pointer;
                    border: 1px solid #27272a;
                    border-radius: 12px;
                    padding: 14px 18px;
                    background: #141416;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    transition: all 0.2s ease;
                }
                .method-card:hover {
                    border-color: #e50914;
                    background: #1b1113;
                }
                .method-card.active {
                    border-color: #f5c518;
                    background: rgba(245,197,24,0.06);
                    box-shadow: 0 0 16px rgba(245,197,24,0.15);
                }
                .ticket-stub {
                    background: #111;
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1);
                }
                .ticket-stub::before, .ticket-stub::after {
                    content: '';
                    position: absolute;
                    top: 66%;
                    width: 28px;
                    height: 28px;
                    background: #000;
                    border-radius: 50%;
                    z-index: 10;
                }
                .ticket-stub::before { left: -14px; }
                .ticket-stub::after { right: -14px; }
            `}</style>

            <div style={{
                width: "100%",
                maxWidth: step === 3 ? "520px" : "680px",
                background: "#0c0608",
                border: "1px solid #2a1518",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0,0,0,0.9), 0 0 40px rgba(229,9,20,0.15)",
                color: "#fff",
                animation: "scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}>
                {/* MODAL HEADER */}
                <div style={{
                    padding: "20px 28px",
                    background: "linear-gradient(135deg, #1f080b, #120506)",
                    borderBottom: "1px solid #261214",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "24px" }}>🎬</span>
                        <div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, margin: 0, color: "#fff" }}>
                                {step === 1 ? "Tóm tắt & Dịch vụ bắp nước" : step === 2 ? "Cổng Thanh toán CGV" : "Vé xem phim điện tử (E-Ticket)"}
                            </h2>
                            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                                {step === 1 ? "Bước 1/2 · Kiểm tra thông tin đặt vé" : step === 2 ? "Bước 2/2 · Chọn phương thức thanh toán" : "Thanh toán thành công & Xuất vé"}
                            </span>
                        </div>
                    </div>

                    {step !== 3 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{
                                background: "rgba(229,9,20,0.15)",
                                border: "1px solid rgba(229,9,20,0.3)",
                                color: "#f87171",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }}>
                                <span>⏱</span> Giữ chỗ: <strong style={{ color: "#facc15" }}>{formatTimer(timeLeft)}</strong>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "none",
                                    color: "#9ca3af",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onClose}
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "none",
                                color: "#9ca3af",
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                cursor: "pointer",
                                fontSize: "14px"
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* MODAL BODY */}
                <div style={{ padding: "28px", maxHeight: "75vh", overflowY: "auto" }}>
                    
                    {/* ================= STEP 1: SUMMARY & F&B ================= */}
                    {step === 1 && (
                        <div>
                            {/* MOVIE & SEAT INFO CARD */}
                            <div style={{
                                background: "#160b0d",
                                border: "1px solid #2a1518",
                                borderRadius: "16px",
                                padding: "18px 20px",
                                display: "flex",
                                gap: "20px",
                                marginBottom: "24px"
                            }}>
                                {showtimeInfo?.movie?.image && (
                                    <img
                                        src={showtimeInfo.movie.image}
                                        alt=""
                                        style={{ width: "70px", height: "100px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                                    />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "11px", color: "#f87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                                        CGV Cinemas
                                    </div>
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, margin: "4px 0 8px" }}>
                                        {showtimeInfo?.movie?.title || "Phim điện ảnh CGV"}
                                    </h3>
                                    <div style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6 }}>
                                        <div>📍 {showtimeInfo?.room?.name || "Phòng chiếu 1"} · 2D Phụ đề</div>
                                        <div>🕐 {showtimeInfo?.startTime ? new Date(showtimeInfo.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "19:30"} - {showtimeInfo?.startTime ? new Date(showtimeInfo.startTime).toLocaleDateString("vi-VN") : "Hôm nay"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* SEATS SELECTED */}
                            <div style={{ marginBottom: "24px" }}>
                                <div style={{ fontSize: "13px", fontWeight: 600, color: "#d1d5db", marginBottom: "10px" }}>
                                    Ghế đã chọn ({selectedSeats.length} ghế):
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {seatItems.map((s) => (
                                        <div
                                            key={s.id}
                                            style={{
                                                background: s.vip ? "rgba(147,51,234,0.18)" : "rgba(255,255,255,0.06)",
                                                border: s.vip ? "1px solid rgba(147,51,234,0.4)" : "1px solid rgba(255,255,255,0.15)",
                                                color: s.vip ? "#c084fc" : "#fff",
                                                padding: "6px 14px",
                                                borderRadius: "8px",
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}
                                        >
                                            <span>{s.name}</span>
                                            <span style={{ fontSize: "11px", opacity: 0.7 }}>
                                                ({s.vip ? "VIP · 120k" : "Thường · 80k"})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* F&B COMBOS SECTION */}
                            <div style={{ marginBottom: "24px" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#facc15", display: "flex", alignItems: "center", gap: "6px" }}>
                                        🍿 Mua thêm Combo Bắp Nước (Ưu đãi 15%)
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {COMBOS.map((combo) => {
                                        const qty = selectedCombos[combo.id] || 0;
                                        return (
                                            <div
                                                key={combo.id}
                                                style={{
                                                    background: qty > 0 ? "rgba(245,197,24,0.06)" : "#13080a",
                                                    border: qty > 0 ? "1px solid rgba(245,197,24,0.3)" : "1px solid #241113",
                                                    borderRadius: "12px",
                                                    padding: "12px 16px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    transition: "all 0.2s"
                                                }}
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <span style={{ fontSize: "26px" }}>{combo.icon}</span>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: "14px", color: "#fff" }}>{combo.name}</div>
                                                        <div style={{ fontSize: "11px", color: "#9ca3af" }}>{combo.desc}</div>
                                                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#facc15", marginTop: "2px" }}>
                                                            {combo.price.toLocaleString("vi-VN")}đ
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleComboQty(combo.id, -1)}
                                                        disabled={qty === 0}
                                                        style={{
                                                            width: "28px", height: "28px", borderRadius: "50%",
                                                            border: "1px solid #3f3f46", background: "#1f1f23",
                                                            color: "#fff", cursor: qty === 0 ? "not-allowed" : "pointer",
                                                            opacity: qty === 0 ? 0.3 : 1
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: 700, fontSize: "14px" }}>
                                                        {qty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleComboQty(combo.id, 1)}
                                                        style={{
                                                            width: "28px", height: "28px", borderRadius: "50%",
                                                            border: "1px solid #e50914", background: "#e50914",
                                                            color: "#fff", cursor: "pointer", fontWeight: 700
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* VOUCHER INPUT */}
                            <div style={{ marginBottom: "24px" }}>
                                <div style={{ fontSize: "13px", fontWeight: 600, color: "#d1d5db", marginBottom: "8px" }}>
                                    Mã Voucher / Khuyến mãi CGV:
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <input
                                        type="text"
                                        placeholder="Nhập CGV50K, CGV10, VIPMEMBER..."
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: "#160b0d",
                                            border: "1px solid #2f171a",
                                            color: "#fff",
                                            padding: "10px 14px",
                                            borderRadius: "10px",
                                            outline: "none",
                                            textTransform: "uppercase"
                                        }}
                                    />
                                    <button
                                        onClick={handleApplyVoucher}
                                        style={{
                                            background: "linear-gradient(135deg, #e50914, #b91c1c)",
                                            color: "#fff",
                                            border: "none",
                                            padding: "0 20px",
                                            borderRadius: "10px",
                                            fontWeight: 600,
                                            cursor: "pointer"
                                        }}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                                {appliedVoucher && (
                                    <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "6px", fontWeight: 500 }}>
                                        ✓ Đã áp dụng: {appliedVoucher.label} (-{discountAmount.toLocaleString("vi-VN")}đ)
                                    </div>
                                )}
                                {voucherError && (
                                    <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>
                                        {voucherError}
                                    </div>
                                )}
                            </div>

                            {/* PRICE BREAKDOWN */}
                            <div style={{ background: "#110708", border: "1px dashed #2a1518", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>
                                    <span>Tiền vé ({selectedSeats.length} ghế)</span>
                                    <span>{rawSeatPrice.toLocaleString("vi-VN")}đ</span>
                                </div>
                                {comboPrice > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>
                                        <span>Combo Bắp Nước</span>
                                        <span>+{comboPrice.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                )}
                                {discountAmount > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4ade80", marginBottom: "8px" }}>
                                        <span>Giảm giá Voucher</span>
                                        <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                )}
                                <div style={{ borderTop: "1px solid #221013", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontWeight: 700, fontSize: "15px" }}>Tổng thanh toán:</span>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#facc15" }}>
                                        {finalTotal.toLocaleString("vi-VN")}đ
                                    </span>
                                </div>
                            </div>

                            {/* CTA CONTINUE */}
                            <button
                                onClick={() => setStep(2)}
                                style={{
                                    width: "100%",
                                    background: "linear-gradient(135deg, #e50914, #b91c1c)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "16px",
                                    borderRadius: "14px",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    boxShadow: "0 8px 24px rgba(229,9,20,0.4)"
                                }}
                            >
                                Tiếp tục chọn Phương thức thanh toán →
                            </button>
                        </div>
                    )}

                    {/* ================= STEP 2: PAYMENT GATEWAY ================= */}
                    {step === 2 && (
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={{
                                        background: "none", border: "none", color: "#9ca3af",
                                        fontSize: "13px", cursor: "pointer", display: "flex",
                                        alignItems: "center", gap: "6px", marginBottom: "16px"
                                    }}
                                >
                                    ← Quay lại chỉnh sửa Combo / Voucher
                                </button>
                                <div style={{ fontSize: "14px", fontWeight: 600, color: "#d1d5db", marginBottom: "12px" }}>
                                    Chọn 1 trong các hình thức thanh toán bên dưới:
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    {[
                                        { id: "vietqr", label: "VietQR / Chuyển khoản", icon: "🏦", desc: "Quét mã 24/7 tức thì" },
                                        { id: "momo", label: "Ví MoMo", icon: "🟣", desc: "Mã QR Ví MoMo" },
                                        { id: "vnpay", label: "VNPay / ZaloPay", icon: "🔵", desc: "Cổng thanh toán QR" },
                                        { id: "card", label: "Thẻ Visa / Master", icon: "💳", desc: "Thẻ quốc tế & nội địa" },
                                    ].map((m) => (
                                        <div
                                            key={m.id}
                                            className={`method-card ${paymentMethod === m.id ? "active" : ""}`}
                                            onClick={() => setPaymentMethod(m.id)}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <span style={{ fontSize: "20px" }}>{m.icon}</span>
                                                <div>
                                                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{m.label}</div>
                                                    <div style={{ fontSize: "11px", color: "#71717a" }}>{m.desc}</div>
                                                </div>
                                            </div>
                                            <span style={{ color: paymentMethod === m.id ? "#f5c518" : "#3f3f46" }}>
                                                {paymentMethod === m.id ? "●" : "○"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* PAYMENT METHOD DETAILS */}
                            <div style={{
                                background: "#120709",
                                border: "1px solid #281416",
                                borderRadius: "16px",
                                padding: "20px",
                                marginBottom: "24px"
                            }}>
                                {paymentMethod === "vietqr" && (
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "13px", color: "#facc15", fontWeight: 600, marginBottom: "12px" }}>
                                            Quét mã QR Ngân hàng (MB Bank / Vietcombank) để thanh toán
                                        </div>
                                        <div style={{
                                            background: "#fff",
                                            padding: "12px",
                                            borderRadius: "16px",
                                            display: "inline-block",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
                                        }}>
                                            <img
                                                src={vietQrUrl}
                                                alt="VietQR"
                                                style={{ width: "200px", height: "200px", display: "block" }}
                                            />
                                        </div>
                                        <div style={{ marginTop: "14px", fontSize: "12px", color: "#9ca3af", lineHeight: 1.6 }}>
                                            <div>Ngân hàng: <strong>MB BANK (Quân Đội)</strong></div>
                                            <div>Số tài khoản: <strong style={{ color: "#fff" }}>0987654321</strong></div>
                                            <div>Chủ tài khoản: <strong>CGV CINEMAS VIETNAM</strong></div>
                                            <div>Số tiền: <strong style={{ color: "#facc15" }}>{finalTotal.toLocaleString("vi-VN")}đ</strong></div>
                                            <div>Nội dung: <strong>CGV {showtimeInfo?.id} {currentUser?.username}</strong></div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "momo" && (
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "13px", color: "#ec4899", fontWeight: 700, marginBottom: "12px" }}>
                                            🟣 Thanh toán qua Ví MoMo
                                        </div>
                                        <div style={{
                                            background: "#fff",
                                            padding: "12px",
                                            borderRadius: "16px",
                                            display: "inline-block"
                                        }}>
                                            <img
                                                src={vietQrUrl}
                                                alt="MoMo QR"
                                                style={{ width: "200px", height: "200px", display: "block" }}
                                            />
                                        </div>
                                        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
                                            Mở ứng dụng MoMo trên điện thoại và quét mã QR để hoàn tất số tiền <strong>{finalTotal.toLocaleString("vi-VN")}đ</strong>
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === "vnpay" && (
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "13px", color: "#38bdf8", fontWeight: 700, marginBottom: "12px" }}>
                                            🔵 Cổng thanh toán VNPay / ZaloPay
                                        </div>
                                        <div style={{
                                            background: "#fff",
                                            padding: "12px",
                                            borderRadius: "16px",
                                            display: "inline-block"
                                        }}>
                                            <img
                                                src={vietQrUrl}
                                                alt="VNPay QR"
                                                style={{ width: "200px", height: "200px", display: "block" }}
                                            />
                                        </div>
                                        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
                                            Hỗ trợ tất cả ứng dụng Mobile Banking & Ví điện tử
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === "card" && (
                                    <div>
                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#facc15", marginBottom: "14px" }}>
                                            💳 Nhập thông tin thẻ Visa / Master / JCB
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            <div>
                                                <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>
                                                    Số thẻ (16 chữ số)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="4111 2222 3333 4444"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    style={{
                                                        width: "100%", background: "#1a0b0e", border: "1px solid #33161a",
                                                        color: "#fff", padding: "10px 14px", borderRadius: "8px", outline: "none"
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>
                                                    Tên chủ thẻ (In hoa không dấu)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="NGUYEN VAN A"
                                                    value={cardHolder}
                                                    onChange={(e) => setCardHolder(e.target.value)}
                                                    style={{
                                                        width: "100%", background: "#1a0b0e", border: "1px solid #33161a",
                                                        color: "#fff", padding: "10px 14px", borderRadius: "8px", outline: "none",
                                                        textTransform: "uppercase"
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                                <div>
                                                    <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>
                                                        Ngày hết hạn (MM/YY)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="12/28"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(e.target.value)}
                                                        style={{
                                                            width: "100%", background: "#1a0b0e", border: "1px solid #33161a",
                                                            color: "#fff", padding: "10px 14px", borderRadius: "8px", outline: "none"
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ fontSize: "11px", color: "#9ca3af", display: "block", marginBottom: "4px" }}>
                                                        Mã bảo mật CVV
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="•••"
                                                        maxLength={4}
                                                        value={cardCvv}
                                                        onChange={(e) => setCardCvv(e.target.value)}
                                                        style={{
                                                            width: "100%", background: "#1a0b0e", border: "1px solid #33161a",
                                                            color: "#fff", padding: "10px 14px", borderRadius: "8px", outline: "none"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TOTAL & CONFIRM */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                                <div>
                                    <div style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Tổng thanh toán:
                                    </div>
                                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, color: "#facc15" }}>
                                        {finalTotal.toLocaleString("vi-VN")}đ
                                    </div>
                                </div>

                                <button
                                    onClick={handleExecutePayment}
                                    disabled={isProcessing}
                                    style={{
                                        background: "linear-gradient(135deg, #e50914, #b91c1c)",
                                        color: "#fff",
                                        border: "none",
                                        padding: "16px 36px",
                                        borderRadius: "9999px",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        cursor: isProcessing ? "not-allowed" : "pointer",
                                        boxShadow: "0 8px 25px rgba(229,9,20,0.45)",
                                        opacity: isProcessing ? 0.6 : 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    {isProcessing ? "⏳ Đang xử lý thanh toán..." : "✓ Xác nhận Đã Chuyển Khoản"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ================= STEP 3: E-TICKET RECEIPT ================= */}
                    {step === 3 && createdTicket && (
                        <div>
                            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                                <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "#4ade80", margin: 0 }}>
                                    Thanh Toán Thành Công!
                                </h3>
                                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
                                    Vé xem phim của bạn đã được xuất và lưu vào hệ thống CGV.
                                </p>
                            </div>

                            {/* CINEMA TICKET STUB */}
                            <div ref={ticketRef} className="ticket-stub" style={{ background: "#160b0d", border: "1px solid #33161a", padding: "28px 24px", marginBottom: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                    <div>
                                        <span style={{ background: "#e50914", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                            CGV CINEMAS E-PASS
                                        </span>
                                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, margin: "8px 0 2px", color: "#fff" }}>
                                            {createdTicket.movieTitle}
                                        </h4>
                                        <div style={{ fontSize: "12px", color: "#f87171" }}>
                                            Mã vé: <strong>{createdTicket.ticketCode}</strong>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase" }}>Phòng chiếu</div>
                                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#facc15" }}>{createdTicket.roomName}</div>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", padding: "12px 0", borderTop: "1px dashed #33161a", borderBottom: "1px dashed #33161a", margin: "14px 0" }}>
                                    <div>
                                        <div style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase" }}>Ngày xem</div>
                                        <div style={{ fontSize: "13px", fontWeight: 600 }}>{createdTicket.showDate}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase" }}>Suất chiếu</div>
                                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#f87171" }}>{createdTicket.startTime}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase" }}>Ghế ngồi</div>
                                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#facc15" }}>
                                            {createdTicket.seats.join(", ")}
                                        </div>
                                    </div>
                                </div>

                                {createdTicket.combos && createdTicket.combos.length > 0 && (
                                    <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "12px" }}>
                                        🍿 Bắp nước: <strong style={{ color: "#fff" }}>{createdTicket.combos.join(" + ")}</strong>
                                    </div>
                                )}

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                                    <div>
                                        <div style={{ fontSize: "10px", color: "#71717a", textTransform: "uppercase" }}>Tổng thanh toán</div>
                                        <div style={{ fontSize: "20px", fontWeight: 700, color: "#facc15" }}>
                                            {createdTicket.totalPrice.toLocaleString("vi-VN")}đ
                                        </div>
                                    </div>
                                    {/* QR Code */}
                                    <div style={{ background: "#fff", padding: "6px", borderRadius: "8px" }}>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${createdTicket.ticketCode}`}
                                            alt="Barcode"
                                            style={{ width: "60px", height: "60px", display: "block" }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate("/my-bookings");
                                    }}
                                    style={{
                                        flex: 1,
                                        background: "linear-gradient(135deg, #e50914, #b91c1c)",
                                        color: "#fff",
                                        border: "none",
                                        padding: "14px",
                                        borderRadius: "12px",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        cursor: "pointer"
                                    }}
                                >
                                    🎟 Xem vé trong "My Tickets"
                                </button>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate("/");
                                    }}
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "#fff",
                                        padding: "14px 20px",
                                        borderRadius: "12px",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        cursor: "pointer"
                                    }}
                                >
                                    🏠 Về Trang chủ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;
