import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = [
    "https://cdnv2.tgdd.vn/mwg-static/common/News/1587020/hinh-nen-zootopia-dien-thoai%20%284%29.jpg",
    "https://s3-api.fpt.vn/fptvn-storage/2025-05-20/1747750381_13-phim-qua-nhanh-qua-nguy-hiem.jpg",
    "https://flowerimages.vnpay.vn/flowerimages/avatar-3-review-2.png",
];

const MovieList = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .feature-card {
                    background: #0f0f0f;
                    border: 1px solid #1a1a1a;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
                }
                .feature-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(220,38,38,0.15);
                }
                .cta-btn {
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    border: none;
                    color: #fff;
                    padding: 16px 48px;
                    border-radius: 9999px;
                    font-family: 'Outfit', sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    letter-spacing: 0.3px;
                    box-shadow: 0 8px 28px rgba(220,38,38,0.4);
                    transition: all 0.2s ease;
                }
                .cta-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 36px rgba(220,38,38,0.55);
                }
                .dot {
                    height: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .social-link {
                    color: #6b7280;
                    font-size: 13px;
                    cursor: pointer;
                    transition: color 0.2s;
                    display: block;
                    line-height: 2;
                }
                .social-link:hover { color: #dc2626; }
            `}</style>

            {/* ── HERO SLIDER ── */}
            <div style={{ position: "relative", width: "100%", height: "520px", overflow: "hidden" }}>
                <div style={{
                    display: "flex",
                    transform: `translateX(-${current * 100}%)`,
                    transition: "transform 0.8s cubic-bezier(0.77,0,0.175,1)",
                    height: "100%",
                }}>
                    {images.map((img, i) => (
                        <img key={i} src={img} alt="banner"
                             style={{ width: "100%", height: "100%", objectFit: "cover", flexShrink: 0, filter: "brightness(0.55)" }}
                        />
                    ))}
                </div>

                {/* Gradient overlay */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.4) 50%, transparent 100%)",
                    pointerEvents: "none"
                }} />

                {/* Slide text */}
                <div style={{
                    position: "absolute", bottom: "80px", left: "48px",
                    animation: "fadeUp 0.8s ease"
                }}>
                    <span style={{
                        background: "rgba(229,9,20,0.15)",
                        border: "1px solid rgba(229,9,20,0.3)",
                        color: "#f87171", fontSize: "11px", fontWeight: 600,
                        padding: "3px 12px", borderRadius: "9999px",
                        letterSpacing: "1px", textTransform: "uppercase",
                        display: "inline-block", marginBottom: "14px"
                    }}>
                        🔴 Đang chiếu
                    </span>
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "52px", fontWeight: 900,
                        lineHeight: 1.1, marginBottom: "20px",
                        textShadow: "0 2px 20px rgba(0,0,0,0.5)"
                    }}>
                        Trải nghiệm điện ảnh<br />đỉnh cao
                    </h1>
                    <button className="cta-btn" onClick={() => navigate("/movies")}>
                        🎟 Đặt vé ngay
                    </button>
                </div>

                {/* Dots */}
                <div style={{ position: "absolute", bottom: "28px", left: "48px", display: "flex", gap: "8px" }}>
                    {images.map((_, i) => (
                        <div key={i} className="dot"
                             onClick={() => setCurrent(i)}
                             style={{
                                 width: current === i ? "28px" : "8px",
                                 background: current === i ? "#dc2626" : "#4b5563",
                             }}
                        />
                    ))}
                </div>
            </div>

            {/* ── INTRO ── */}
            <div style={{
                maxWidth: "800px", margin: "0 auto",
                padding: "80px 24px 80px",
                textAlign: "center",
                animation: "fadeUp 0.6s 0.1s ease both"
            }}>
                <div style={{
                    display: "inline-block",
                    background: "rgba(220,38,38,0.1)",
                    border: "1px solid rgba(220,38,38,0.2)",
                    color: "#f87171", fontSize: "12px", fontWeight: 600,
                    padding: "4px 16px", borderRadius: "9999px",
                    letterSpacing: "1.5px", textTransform: "uppercase",
                    marginBottom: "20px"
                }}>
                    Về chúng tôi
                </div>

                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "42px", fontWeight: 700,
                    marginBottom: "8px", letterSpacing: "-0.5px"
                }}>
                    CGV CINEMAS
                </h2>

                <div style={{ width: "60px", height: "3px", background: "linear-gradient(to right, #dc2626, #f97316)", borderRadius: "2px", margin: "0 auto 28px" }} />

                <p style={{ color: "#9ca3af", fontSize: "16px", lineHeight: 1.8, fontWeight: 300, marginBottom: "16px" }}>
                    CGV CINEMAS không chỉ đơn thuần là một nền tảng đặt vé xem phim, mà còn là nơi hội tụ
                    của những trải nghiệm giải trí đỉnh cao — nơi bạn tận hưởng bom tấn trong không gian
                    hiện đại, sang trọng với công nghệ hàng đầu.
                </p>
                <p style={{ color: "#6b7280", fontSize: "15px", lineHeight: 1.8, fontWeight: 300 }}>
                    Từ lựa chọn phim, đặt vé nhanh chóng cho đến trải nghiệm rạp đẳng cấp quốc tế —
                    đây là nơi lý tưởng để thư giãn cùng bạn bè và người thân.
                </p>
            </div>

            {/* ── STATS ── */}
            <div style={{
                background: "#0d0d0d",
                borderTop: "1px solid #141414",
                borderBottom: "1px solid #141414",
                padding: "48px 24px",
                animation: "fadeUp 0.6s 0.15s ease both"
            }}>
                <div style={{
                    maxWidth: "900px", margin: "0 auto",
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px", textAlign: "center"
                }}>
                    {[
                        { number: "50+", label: "Phim đang chiếu" },
                        { number: "10+", label: "Cụm rạp toàn quốc" },
                        { number: "100K+", label: "Khách hàng tin dùng" },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "44px", fontWeight: 700,
                                color: "#fff", letterSpacing: "-1px",
                                marginBottom: "6px"
                            }}>
                                {stat.number}
                            </div>
                            <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: 400, letterSpacing: "0.3px" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FEATURE CARDS ── */}
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px", animation: "fadeUp 0.6s 0.2s ease both" }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>
                        Tại sao chọn CGV?
                    </h2>
                    <div style={{ width: "60px", height: "3px", background: "linear-gradient(to right, #dc2626, #f97316)", borderRadius: "2px", margin: "0 auto" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                    {[
                        {
                            img: "https://evoseating.com.vn/wp-content/uploads/2024/12/rap-phim-cgv-vincom-mega-mall-grand-park-4.jpg",
                            icon: "🍿", title: "Rạp hiện đại",
                            desc: "Không gian đạt chuẩn quốc tế với hệ thống âm thanh vòm, màn hình sắc nét mang đến trải nghiệm điện ảnh chân thực."
                        },
                        {
                            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbF2CiwqZglV7HgUm6_dFylsVorNJfJ79kqQ&s",
                            icon: "⚡", title: "Đặt vé nhanh",
                            desc: "Hệ thống đặt vé thông minh, tiện lợi giúp bạn tiết kiệm thời gian và chủ động lựa chọn vị trí yêu thích."
                        },
                        {
                            img: "https://kenh14cdn.com/2018/7/16/photo-1-15317220041331953035030.jpg",
                            icon: "🎉", title: "Trải nghiệm đỉnh",
                            desc: "Không chỉ là xem phim — đây là nơi tạo nên những kỷ niệm đáng nhớ cùng bạn bè và người thân."
                        },
                    ].map((item) => (
                        <div key={item.title} className="feature-card">
                            <div style={{ height: "200px", overflow: "hidden" }}>
                                <img src={item.img} alt={item.title}
                                     style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                                     onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                                     onMouseLeave={e => e.target.style.transform = "scale(1)"}
                                />
                            </div>
                            <div style={{ padding: "20px 22px 24px" }}>
                                <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span>{item.icon}</span>
                                    <span>{item.title}</span>
                                </h3>
                                <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.7, fontWeight: 300 }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA BANNER ── */}
            <div style={{
                margin: "0 24px 80px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1a0608, #2c0a0e)",
                border: "1px solid #3f0a0e",
                padding: "60px 48px",
                textAlign: "center",
                animation: "fadeUp 0.6s 0.25s ease both"
            }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 700, marginBottom: "12px" }}>
                    Sẵn sàng cho trải nghiệm điện ảnh?
                </h2>
                <p style={{ color: "#9ca3af", fontSize: "15px", marginBottom: "32px", fontWeight: 300 }}>
                    Hàng chục bộ phim bom tấn đang chờ bạn. Đặt vé ngay hôm nay!
                </p>
                <button className="cta-btn" onClick={() => navigate("/movies")}>
                    🎬 Xem danh sách phim
                </button>
            </div>

            {/* ── FOOTER ── */}
            <footer style={{
                background: "#0d0d0d",
                borderTop: "1px solid #141414",
                padding: "48px 48px 28px"
            }}>
                <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", marginBottom: "32px" }}>
                    <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#dc2626", marginBottom: "12px", fontWeight: 700 }}>
                            CGV CINEMAS
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.7 }}>
                            Nền tảng đặt vé xem phim hiện đại, mang đến trải nghiệm giải trí đỉnh cao.
                        </p>
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: "12px", fontSize: "14px", color: "#e5e7eb" }}>Liên hệ</div>
                        <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 2 }}>
                            📧 cgv@gmail.com<br />
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
};

export default MovieList;