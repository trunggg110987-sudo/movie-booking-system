import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../services/movieService";

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getMovies()
            .then((data) => {
                setMovies(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filtered = movies.filter((m) =>
        m.title?.toLowerCase().includes(search.toLowerCase())
    );

    const featured = movies[0]; // Lấy phim đầu làm Hero

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#0B0B0F]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD60A]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">

                {/* Search Bar */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold hidden md:block">Khám phá phim</h1>
                    <div className="relative w-full md:w-96 ml-auto">
                        <input
                            type="text"
                            placeholder="Tìm phim..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#1C1C26] border border-[#2A2A35] rounded-full py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#FFD60A]"
                        />
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                    </div>
                </div>

                {/* Hero Section */}
                {featured && (
                    <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 group">
                        <img
                            src={featured.image || `https://picsum.photos/seed/${featured.id}/1200/600`}
                            alt={featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0F]/80 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
                            <span className="px-3 py-1 bg-[#FFD60A] text-black text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                                🔥 Nổi bật
                            </span>
                            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">{featured.title}</h2>
                            <p className="text-gray-300 mb-6 line-clamp-2">{featured.description}</p>
                            <button
                                onClick={() => navigate(`/movies/${featured.id}`)}
                                className="bg-[#FFD60A] text-black font-bold px-8 py-3 rounded-full hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                            >
                                <i className="fas fa-ticket"></i> Đặt Vé Ngay
                            </button>
                        </div>
                    </div>
                )}

                {/* Movie Grid */}
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold">Phim Đang Chiếu</h3>
                    <span className="text-sm text-gray-500">{filtered.length} phim</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {filtered.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => navigate(`/movies/${movie.id}`)}
                            className="cursor-pointer group"
                        >
                            <div className="relative rounded-2xl overflow-hidden h-[300px] md:h-[360px] mb-3 bg-[#1C1C26]">
                                <img
                                    src={movie.image || `https://picsum.photos/seed/${movie.id}/200/300`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-sm text-gray-200 line-clamp-4">{movie.description}</span>
                                </div>
                            </div>
                            <h4 className="font-semibold text-sm md:text-base truncate group-hover:text-[#FFD60A] transition-colors">
                                {movie.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">Hành động · 120 phút</p>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <i className="fas fa-film text-4xl mb-4 block"></i>
                        Không tìm thấy phim nào phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
}