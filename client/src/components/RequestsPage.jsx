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

    return (
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="relative w-[80%] flex flex-row bg-[#fff8f8] p-8">
                    {/* Left: Rotated Tabs */}
                    <div className="relative w-[25%] flex items-center justify-start" style={{fontFamily: "'Josefin Sans', sans-serif" }}>
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
                    {/* Right: Requests List */}
                    <div className="w-[75%] flex flex-col items-start pl-8">
                        {requestsToShow.length === 0 ? (
                            <div className="text-gray-400 mt-8">No requests found.</div>
                        ) : (
                            requestsToShow.map((req, idx) => (
                                <RequestCard
                                    key={idx}
                                    request={req}
                                    type={tab}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}