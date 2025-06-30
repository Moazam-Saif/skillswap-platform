import React from "react";

export default function RequestCard({ request, type }) {
    // Destructure request fields
    const { offerSkill, wantSkill, days, timeSlots, status, from, to } = request || {};

    return (
        <div
            className="relative"
            style={{
                width: "420px",
                height: "180px",
                backgroundImage: 'url("/request-bg.svg")',
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                boxShadow: "0 4px 24px 0 rgba(38, 70, 83, 0.10)",
                borderRadius: "18px",
                fontFamily: "'Josefin Sans', sans-serif",
            }}
        >
            {/* ...header and arrows as before... */}
            <div className="relative w-full h-[17%] flex gap-0 cursor-pointer">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[28px] w-[28px] bg-gray-300 rounded-full">
                    <img src="/userImage.png" alt="icon" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center">
                    {type === "received" ? (from?.name || "From") : (to?.name || "To")}
                </div>
                <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center">
                    You
                </div>
            </div>
            <div className="relative w-full h-[40%] flex">
                {/* Offer Skill - 45% */}
                <div
                    className="flex items-center justify-center text-[#264653]"
                    style={{
                        width: "45%",
                        fontFamily: "Lemon, sans",
                        fontSize: "clamp(0.5rem, 2vw, 1.2rem)", // auto scales between 1rem and 2rem
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                    title={offerSkill?.name || ""}
                >
                    {offerSkill?.name || ""}
                </div>
                {/* Arrows/Image - 10% */}
                <div
                    className="flex items-center justify-center"
                    style={{ width: "10%" }}
                >
                    <img
                        src="/difArrows.svg"
                        alt="Arrows"
                        style={{ width: "28px", height: "31px" }}
                    />
                </div>
                {/* Want Skill - 45% */}
                <div
                    className="flex items-center justify-center text-[#264653]"
                    style={{
                        width: "45%",
                        fontFamily: "Lemon, sans",
                        fontSize: "clamp(0.5rem, 2vw, 1.2rem)", // auto scales between 1rem and 2rem
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                    title={wantSkill?.name || ""}
                >
                    {wantSkill?.name || ""}
                </div>
            </div>
            <div className="relative w-full h-[26%] flex flex-col">
                <div className="w-full flex justify-center items-center" style={{ height: "20%" }}>
                    <span className="text-shadow-custom text-[11px] font-semibold">{days} Days</span>
                </div>
                <div className="w-full text-xs font-semibold flex items-center justify-center" style={{ height: "80%" }}>
                    <span className="px-2 py-1 bg-[#FFE5E5] rounded-2xl">
                        {timeSlots && timeSlots.length > 0 ? timeSlots[0] : "No time slot"}
                    </span>
                </div>
            </div>
            <div className="relative w-full h-[17%] flex justify-evenly cursor-pointer py-[5px]">
                {type === "sent" && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-2xl ${status === "pending" ? "bg-yellow-100 text-yellow-700" : status === "accepted" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {status?.toUpperCase()}
                    </span>
                )}
                <button className="bg-[#fff8f4] text-sm px-3 rounded-2xl flex items-center justify-center shadow-md text-[#e76f51]" style={{ fontFamily: "Lemon, sans" }}>SWAP</button>
                <button className="bg-[#fff8f4] text-sm px-3 rounded-2xl flex items-center justify-center shadow-md">Reject</button>
            </div>
        </div>
    );
}