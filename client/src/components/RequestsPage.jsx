import React, { useState } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
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
                <section className="w-[80%] flex-1 bg-[#264653] p-8">
                    {/* Tabs */}
                    <div className="w-full flex justify-center mb-6">
                        <button
                            className={`px-6 py-2 rounded-l-full font-semibold ${tab === "received" ? "bg-[#e76f51] text-white" : "bg-white text-[#264653]"}`}
                            onClick={() => setTab("received")}
                        >
                            Received
                        </button>
                        <button
                            className={`px-6 py-2 rounded-r-full font-semibold ${tab === "sent" ? "bg-[#e76f51] text-white" : "bg-white text-[#264653]"}`}
                            onClick={() => setTab("sent")}
                        >
                            Sent
                        </button>
                    </div>
                    {/* Requests List */}
                    <div className="flex flex-col gap-4">
                        {requestsToShow.length === 0 ? (
                            <div className="text-white text-center">No requests found.</div>
                        ) : (
                            requestsToShow.map(request => (
                                // <RequestItem key={request.id} {...request} />
                                <div key={request.id} className="bg-white rounded-lg p-4 shadow">
                                    {/* Replace with <RequestItem ... /> */}
                                    Request #{request.id}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}