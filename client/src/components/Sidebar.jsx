import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
    const { userId,setAccessToken, setUserId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setAccessToken(null);
        setUserId(null);
        navigate("/login");
    };

    return (
        <aside className="w-[20%] sticky top-0 h-screen bg-[#264653] pt-20 p-6 text-white rounded-tl-[30px] ">
            <h2 className="font-semibold mb-2">Sidebar</h2>
            <ul className="space-y-2">
                <li>
                    <Link to={`/dashboard/${userId}`}>Dashboard</Link>
                </li>
                <li>
                    <Link to={`/profile/${userId}`}>Profile</Link>
                </li>
                <li>
                    <Link to={`/users/swap-requests`}>Swap Requests</Link>
                </li>
                <li>
                    <Link to={`/active-requests`}>Swap Requests</Link>
                </li>
                <li>
                    <button
                onClick={handleLogout}
                className="bg-[#e76f51] text-white px-4 py-2 rounded-full font-semibold"
            >
                Logout
            </button>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;