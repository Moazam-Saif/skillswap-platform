import React, { useState, useEffect, useContext } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import RequestCard from "./RequestCard";
import { AuthContext } from "../context/AuthContext";
import { getUserRequests } from "../api/auth";

export default function RequestsPage() {
    const [tab, setTab] = useState("received");
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const { userId, accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getUserRequests(accessToken);
                setReceivedRequests(data.received || []);
                setSentRequests(data.sent || []);
            } catch (err) {
                console.error("Failed to fetch requests", err);
            }
        };
        fetchRequests();
    }, [userId, accessToken]);

    const requestsToShow = tab === "received" ? receivedRequests : sentRequests;

    const handleRemoveRequest = (id) => {
        if (tab === "received") {
            setReceivedRequests(prev => prev.filter(req => req._id !== id));
        } else {
            setSentRequests(prev => prev.filter(req => req._id !== id));
        }
    };

    return (
        <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <Nav />
            <main className="flex flex-1 md:rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="relative w-full md:w-[80%] flex flex-col md:flex-row bg-[#fff8f8] p-4 md:p-8">

                    {/* Mobile: Top Horizontal Tabs (visible only on small screens) */}
                    <div className="md:hidden w-full flex justify-center mb-6">
                        <div className="flex items-center justify-center bg-white rounded-full shadow-lg p-1">
                            <button
                                className={`px-4 py-2 rounded-l-full font-semibold text-sm transition-colors duration-150 ${tab === "received"
                                        ? "bg-[#e76f51] text-white"
                                        : "bg-white text-gray-400 hover:bg-[#f4a26122]"
                                    }`}
                                onClick={() => setTab("received")}
                            >
                                Received
                            </button>
                            <button
                                className={`px-4 py-2 rounded-r-full font-semibold text-sm transition-colors duration-150 ${tab === "sent"
                                        ? "bg-[#e76f51] text-white"
                                        : "bg-white text-gray-400 hover:bg-[#f4a26122]"
                                    }`}
                                onClick={() => setTab("sent")}
                            >
                                Sent
                            </button>
                        </div>
                    </div>

                    {/* Desktop: Left Rotated Tabs (hidden on mobile) */}
                    <div className="hidden md:flex sticky top-70 h-fit w-[20%] items-center justify-start">
                        <div
                            className="relative flex items-center justify-center"
                            style={{ transform: "rotate(-90deg)", width: "max-content" }}
                        >
                            <div className="relative flex items-center justify-center">
                                <button
                                    className={`px-6 py-1 rounded-l-full font-semibold text-lg shadow-lg transition-colors duration-150 ${tab === "received"
                                            ? "bg-[#e76f51] text-white"
                                            : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
                                        }`}
                                    onClick={() => setTab("received")}
                                >
                                    Received
                                </button>
                                <button
                                    className={`px-6 py-1 rounded-r-full font-semibold text-lg shadow-lg transition-colors duration-150 ${tab === "sent"
                                            ? "bg-[#e76f51] text-white"
                                            : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
                                        }`}
                                    onClick={() => setTab("sent")}
                                >
                                    Sent
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="w-full md:w-[80%] flex flex-col items-center md:items-start md:pl-8 gap-4 md:gap-5">
                        {requestsToShow.length === 0 ? (
                            <div className="text-gray-400 mt-8">No requests found.</div>
                        ) : (
                            requestsToShow.map((req, idx) => (
                                <RequestCard
                                    key={req._id || idx}
                                    request={req}
                                    type={tab}
                                    onRemove={handleRemoveRequest}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}