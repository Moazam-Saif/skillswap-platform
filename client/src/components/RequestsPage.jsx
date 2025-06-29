import React, { useState } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import RequestCard from "./RequestCard";
// import RequestItem from "./RequestItem"; // You can create this component for each request

export default function RequestsPage() {
    const [tab, setTab] = useState("received");

    // Dummy data for demonstration
    const receivedRequests = [
        // { id: 1, ...requestData }
    ];
    const sentRequests = [
        // { id: 2, ...requestData }
    ];

    const requestsToShow = tab === "received" ? receivedRequests : sentRequests;

    return (
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="w-[80%] flex-1 bg-[#fff8f8] p-8">
                    {/* Tabs */}
 <div className="w-full flex justify-center mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
    <button
        className={`flex items-center justify-center  px-6 py-1 rounded-l-full  text-lg shadow-lg transition-colors duration-150 ${
            tab === "received"
                ? "bg-[#e76f51] text-white"
                : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
        }`}
        onClick={() => setTab("received")}
    >
        Received
    </button>
    <button
        className={`flex items-center justify-center px-6 py-1 rounded-r-full  text-lg shadow-lg transition-colors duration-150 ${
            tab === "sent"
                ? "bg-[#e76f51] text-white"
                : "bg-white text-gray-400 hover:bg-[#f4a26122] opacity-80"
        }`}
        onClick={() => setTab("sent")}
    >
        Sent
    </button>
</div>
                    {/* Requests List */}
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <RequestCard/>
                    </div>
                </section>
            </main>
        </div>
    );
}