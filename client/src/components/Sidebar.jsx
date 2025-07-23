import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

const Sidebar = () => {
    const { userId, setAccessToken, setUserId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setAccessToken(null);
        setUserId(null);
        navigate("/login");
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Burger Menu Button - Only visible on mobile */}
            <button
                onClick={toggleSidebar}
                className="
                    md:hidden fixed top-4 left-4 z-50
                    bg-[#264653] text-white p-2 rounded-md
                    hover:bg-[#1e4a4f] transition-colors
                "
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                </svg>
            </button>

            {/* Blur overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 backdrop-blur-sm z-30"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed md:sticky top-0 left-0 z-40
                    w-[20%] min-w-[200px]
                    h-screen 
                    bg-[#264653] 
                    pt-16 md:pt-20 
                    p-4 md:p-6 
                    text-white 
                    rounded-tl-[30px] 
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
                {/* Search Bar - Only visible on mobile when sidebar is open */}
                <div className="md:hidden mb-6">
                    <SearchBar />
                </div>
                
                <ul className="space-y-0 flex flex-col text-sm md:text-base">
                    <li>
                        <Link 
                            to={`/dashboard/${userId}`}
                            onClick={closeSidebar}
                            className="
                                block text-left
                                py-3
                                hover:text-[#e76f51] 
                                transition-colors
                                font-medium
                            "
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            Dashboard
                        </Link>
                        <hr className="border-[#e76f51] border-t-1 my-2" />
                    </li>
                    <li>
                        <Link 
                            to={`/profile/${userId}`}
                            onClick={closeSidebar}
                            className="
                                block text-left
                                py-3
                                hover:text-[#e76f51] 
                                transition-colors
                                font-medium
                            "
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            Profile
                        </Link>
                        <hr className="border-[#e76f51] border-t-1 my-2" />
                    </li>
                    <li>
                        <Link 
                            to={`/users/swap-requests`}
                            onClick={closeSidebar}
                            className="
                                block text-left
                                py-3
                                hover:text-[#e76f51] 
                                transition-colors
                                font-medium
                            "
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            Swap Requests
                        </Link>
                        <hr className="border-[#e76f51] border-t-1 my-2" />
                    </li>
                    <li>
                        <Link 
                            to={`/active-requests`}
                            onClick={closeSidebar}
                            className="
                                block text-left
                                py-3
                                hover:text-[#e76f51] 
                                transition-colors
                                font-medium
                            "
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            Active Requests
                        </Link>
                        <hr className="border-[#e76f51] border-t-1 my-2" />
                    </li>
                    <li className="mt-4">
                        <button
                            onClick={() => {
                                handleLogout();
                                closeSidebar();
                            }}
                            className="
                                w-full
                                bg-[#e76f51] 
                                text-white 
                                px-4 
                                py-2 
                                rounded-full 
                                font-semibold
                                hover:bg-[#d45d47] 
                                transition-colors
                                text-sm md:text-base
                            "
                            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;