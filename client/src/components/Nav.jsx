import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Nav() {
    const { setAccessToken, setUserId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setAccessToken(null);
        setUserId(null);
        navigate("/login");
    };

    return (
        <nav className="w-full bg-[#FFFAFA] p-2 flex items-center justify-between">
            <Link to={userId ? `/dashboard/${userId}` : "/"} className="flex items-center gap-3 text-5xl text-[#e76f51]">
                <h1 style={{ fontFamily: "Kranky, cursive" }}>SKILL</h1>
                <h1 style={{ fontFamily: "Lemon, sans" }}>SWAP</h1>
            </Link>
            <button
                onClick={handleLogout}
                className="bg-[#e76f51] text-white px-4 py-2 rounded-full font-semibold"
            >
                Logout
            </button>
        </nav>
    );
}