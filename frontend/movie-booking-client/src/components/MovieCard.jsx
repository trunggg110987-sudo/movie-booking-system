import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition"
        >
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-3">
                    {movie.description}
                </p>
            </div>
        </div>
    );
}

export default MovieCard;