import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
    const { userId } = useContext(AuthContext);

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
            </ul>
        </aside>
    );
};

export default Sidebar;