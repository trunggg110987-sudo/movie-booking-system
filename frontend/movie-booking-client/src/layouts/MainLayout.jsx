import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navbar />

            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;