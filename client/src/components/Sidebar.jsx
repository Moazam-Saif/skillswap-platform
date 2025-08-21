import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { openMobileSidebar, closeMobileSidebar } from '../store/sidebarSlice';

const Sidebar = ({ hideOnDesktop = false }) => {
    const { userId, setAccessToken, setUserId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();



    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        
        // Only dispatch Redux actions when it's mobile/burger menu usage
        // (either hideOnDesktop is true, or screen is mobile size)
        if (hideOnDesktop || window.innerWidth < 768) {
            if (newState) {
                dispatch(openMobileSidebar());
            } else {
                dispatch(closeMobileSidebar());
            }
        }
    };

    const closeSidebar = () => {
        setIsOpen(false);
        
        // Only dispatch Redux actions when it's mobile/burger menu usage
        if (hideOnDesktop || window.innerWidth < 768) {
            dispatch(closeMobileSidebar());
        }
    };

    // Handle window resize to reset Redux state if screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && !hideOnDesktop) {
                dispatch(closeMobileSidebar());
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [hideOnDesktop, dispatch]);

    return (
        <>
            {/* Burger Menu Button - Hide when sidebar is open */}
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className={`
                        fixed top-4 left-4 z-[1010]
                        bg-[#264653] text-white p-2 rounded-md
                        hover:bg-[#1e4a4f] transition-colors
                        ${hideOnDesktop ? '' : 'md:hidden'}
                    `}
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
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            )}

            {/* Blur overlay when sidebar is open */}
            {isOpen && (
                <div
                    className={`fixed inset-0 backdrop-blur-sm z-[950] ${hideOnDesktop ? '' : 'md:hidden'}`}
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-0 left-0 z-[980]
                    w-[20%] min-w-[200px]
                    h-screen 
                    bg-[#264653] 
                    pt-20 lg:pt-20 
                    p-4 md:p-6 
                    text-white 
                    rounded-tl-[30px] 
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    ${hideOnDesktop ? '' : 'md:sticky md:translate-x-0 md:top-[72px] md:h-[calc(100vh-72px)] md:pt-6'}
                `}
                style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
                {/* Search Bar - Hidden on large screens, visible on mobile when sidebar is open */}
                <div className="mb-6 lg:hidden">
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
                        <hr className="border-white border-t-1 border-dotted my-2 opacity-40" />
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
                        <hr className="border-white border-t-1 border-dotted my-2 opacity-40" />
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
                        <hr className="border-white border-t-1 border-dotted my-2 opacity-40" />
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
                        <hr className="border-white border-t-1 border-dotted my-2 opacity-40" />
                    </li>
                    
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;