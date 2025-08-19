import React, { useEffect, useState, useContext } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { getUserSessions } from "../api/auth";
import SessionCard from "./SessionCard";
import moment from "moment-timezone";

export default function SessionsPage() {
    const { userId, accessToken } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState("active"); // 'active' or 'completed'

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getUserSessions(accessToken);
                setSessions(data || []);
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, [accessToken]);

    // Filter sessions based on viewType
    const filteredSessions = sessions.filter(
        s => viewType === "active" ? s.status === "active" : s.status === "completed"
    );

    return (
        <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <Nav />
            <main className="flex flex-1 md:rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="relative w-full md:w-[80%] flex flex-col md:flex-row bg-[#fff8f8] p-4 md:p-8">

                    {/* Mobile: Top Horizontal Tabs */}
                    <div className="md:hidden w-full flex justify-center mb-6">
                        <div className="flex items-center justify-center bg-white rounded-full shadow-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-l-full font-semibold text-xs transition-colors duration-150 ${viewType === "active"
                                    ? "bg-[#e76f51] text-white"
                                    : "bg-white text-gray-400 hover:bg-[#f4a26122]"
                                    }`}
                                onClick={() => setViewType("active")}
                            >
                                Active
                            </button>
                            <button
                                className={`px-4 py-2 rounded-r-full font-semibold text-sm transition-colors duration-150 ${viewType === "completed"
                                    ? "bg-[#e76f51] text-white"
                                    : "bg-white text-gray-400 hover:bg-[#f4a26122]"
                                    }`}
                                onClick={() => setViewType("completed")}
                            >
                                Completed
                            </button>
                        </div>
                    </div>

                    {/* Desktop: Left Rotated Tabs */}
                    <div className="hidden md:flex sticky top-70 h-fit w-[20%] justify-center">
                        <div
                            className="relative flex items-center justify-center"
                            style={{ transform: "rotate(-90deg)", width: "max-content" }}
                        >
                            <div className="relative flex items-center justify-center">
                                <button
                                    className={`px-6 py-1 rounded-l-full font-semibold text-base shadow-lg transition-colors duration-150 ${viewType === "active"
                                        ? "bg-[#e76f51] text-white"
                                        : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
                                        }`}
                                    onClick={() => setViewType("active")}
                                >
                                    Active
                                </button>
                                <button
                                    className={`px-6 py-1 rounded-r-full font-semibold text-base shadow-lg transition-colors duration-150 ${viewType === "completed"
                                        ? "bg-[#e76f51] text-white"
                                        : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
                                        }`}
                                    onClick={() => setViewType("completed")}
                                >
                                    Completed
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="w-full md:w-[80%] flex flex-col items-center md:items-start md:pl-5 gap-6 md:gap-5">
                        {loading ? (
                            <div className="text-gray-400 mt-8">Loading...</div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="text-gray-400 mt-8">No {viewType} sessions found.</div>
                        ) : (
                            filteredSessions.map((session) => (
                                <SessionCard
                                    key={session._id}
                                    session={session}
                                    userId={userId}
                                    viewType={viewType}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}