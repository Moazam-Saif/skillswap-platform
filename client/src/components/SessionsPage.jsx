import React, { useEffect, useState, useContext } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { getUserSessions } from "../api/auth";

export default function SessionsPage() {
    const { userId, accessToken } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <Nav />
            <main className="flex flex-1 md:rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="w-full md:w-[80%] flex flex-col bg-[#fff8f8] p-4 md:p-8">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-[#264653]">Active Sessions</h2>
                    {loading ? (
                        <div className="text-gray-400">Loading...</div>
                    ) : sessions.length === 0 ? (
                        <div className="text-gray-400">No active sessions found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                            {sessions.map((session) => (
                                <div 
                                    key={session._id} 
                                    className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col gap-2 w-full"
                                >
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <span className="font-semibold text-[#264653] text-sm md:text-base truncate">
                                            {session.skillFromA?.name} ↔ {session.skillFromB?.name}
                                        </span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {session.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs md:text-sm">
                                        <span className="truncate">
                                            <b>With:</b> {session.userA?.name === undefined || session.userA?._id === userId ? session.userB?.name : session.userA?.name}
                                        </span>
                                        <span>
                                            <b>Duration:</b> {session.duration} weeks
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-gray-600">
                                        <span>
                                            <b>Created:</b> {new Date(session.createdAt).toLocaleDateString()}
                                        </span>
                                        <span>
                                            <b>Expires:</b> {session.duration ? new Date(new Date(session.createdAt).getTime() + session.duration * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : "-"}
                                        </span>
                                    </div>
                                    {/* Time slots */}
                                    {session.scheduledTime && session.scheduledTime.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {session.scheduledTime.map((slot, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-[#2a9d8f] text-white text-xs px-2 py-1 rounded"
                                                >
                                                    {slot}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}