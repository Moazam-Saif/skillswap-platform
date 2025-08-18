import React, { useEffect, useState, useContext } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { getUserSessions } from "../api/auth";
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

    // Helper: Is meeting ongoing for a slot?
    function isMeetingOngoing(slot) {
        let dayTime, endTime, day, startTime;
        if (slot.includes(' - ')) {
            [dayTime, endTime] = slot.split(' - ');
            [day, startTime] = dayTime.split(' ');
        } else {
            [dayTime, endTime] = slot.split('-');
            [day, startTime] = dayTime.trim().split(' ');
        }
        const now = moment.utc();
        const slotStart = moment.utc().day(day).hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1]));
        const slotEnd = moment.utc().day(day).hour(Number(endTime.split(':')[0])).minute(Number(endTime.split(':')[1]));
        return now.isBetween(slotStart.clone().subtract(5, 'minutes'), slotEnd.clone().add(5, 'minutes'));
    }

    // Helper: Get other user's info
    function getOtherUser(session) {
        if (session.userA?._id === userId) return session.userB;
        return session.userA;
    }

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
                                className={`px-4 py-2 rounded-l-full font-semibold text-sm transition-colors duration-150 ${
                                    viewType === "active"
                                        ? "bg-[#e76f51] text-white"
                                        : "bg-white text-gray-400 hover:bg-[#f4a26122]"
                                }`}
                                onClick={() => setViewType("active")}
                            >
                                Active
                            </button>
                            <button
                                className={`px-4 py-2 rounded-r-full font-semibold text-sm transition-colors duration-150 ${
                                    viewType === "completed"
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
                    <div className="hidden md:flex sticky top-70 h-fit w-[25%] items-center justify-start">
                        <div
                            className="relative flex items-center justify-center"
                            style={{ transform: "rotate(-90deg)", width: "max-content" }}
                        >
                            <div className="relative flex items-center justify-center">
                                <button
                                    className={`px-6 py-1 rounded-l-full font-semibold text-lg shadow-lg transition-colors duration-150 ${
                                        viewType === "active"
                                            ? "bg-[#e76f51] text-white"
                                            : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
                                    }`}
                                    onClick={() => setViewType("active")}
                                >
                                    Active
                                </button>
                                <button
                                    className={`px-6 py-1 rounded-r-full font-semibold text-lg shadow-lg transition-colors duration-150 ${
                                        viewType === "completed"
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
                    <div className="w-full md:w-[75%] flex flex-col items-center md:items-start md:pl-8 gap-4 md:gap-5">
                        {loading ? (
                            <div className="text-gray-400 mt-8">Loading...</div>
                        ) : filteredSessions.length === 0 ? (
                            <div className="text-gray-400 mt-8">No {viewType} sessions found.</div>
                        ) : (
                            filteredSessions.map((session, idx) => {
                                const otherUser = getOtherUser(session);
                                const firstName = otherUser?.name?.split(' ')[0] || "User";
                                const lastName = otherUser?.name?.split(' ').slice(1).join(' ') || "";
                                const imageUrl = otherUser?.imageUrl || "/userImage.png";
                                // Show swapped skills in a single line
                                const skillA = session.skillFromA?.name || "";
                                const skillB = session.skillFromB?.name || "";

                                return (
                                    <div
                                        key={session._id}
                                        className="bg-[#e76f51] text-white rounded-[25px] md:rounded-[35px] lg:rounded-[50px] shadow-sm hover:shadow-md transition-shadow h-auto min-h-[160px] sm:min-h-[140px] md:h-[155px] lg:h-[170px] w-[90%] sm:w-full mx-auto overflow-hidden"
                                        style={{ fontFamily: "'Josefin Sans', sans-serif" }}
                                    >
                                        {/* Top Section */}
                                        <div className="h-auto sm:h-[30%] border-b-2 border-white flex items-center py-2 sm:py-0">
                                            <div className="w-[45%] px-2 sm:px-3 md:px-4 flex justify-center">
                                                <span className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl truncate">
                                                    {firstName}
                                                </span>
                                            </div>
                                            <div className="w-[10%] flex justify-center">
                                                <img
                                                    src={imageUrl}
                                                    alt="user"
                                                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="w-[45%] px-2 sm:px-3 md:px-4 flex justify-center">
                                                <span className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl truncate">
                                                    {lastName}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Skills Swapped */}
                                        <div className="flex justify-center items-center py-2">
                                            <span className="bg-[#f4a261] text-[#264653] rounded-full px-4 py-1 text-sm font-medium shadow-sm">
                                                {skillA} ↔ {skillB}
                                            </span>
                                        </div>
                                        {/* Timeslot and Duration */}
                                        <div className="flex flex-col sm:flex-row gap-2 px-2 sm:px-3 md:px-4 py-2 text-xs text-white/90">
                                            <span>
                                                <b>Duration:</b> {session.duration} weeks
                                            </span>
                                            {session.scheduledTime && session.scheduledTime.length > 0 && (
                                                <span>
                                                    <b>Timeslot:</b> {session.scheduledTime.join(', ')}
                                                </span>
                                            )}
                                        </div>
                                        {/* Join Meeting Button */}
                                        {viewType === "active" && session.scheduledTime && session.scheduledTime.some(isMeetingOngoing) && (
                                            <div className="flex justify-center pb-3">
                                                <a
                                                    href={`/meeting/${session._id}/0`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#264653] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-[#1e4a4f] transition-colors text-sm"
                                                >
                                                    Join Meeting
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}