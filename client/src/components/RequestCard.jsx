import React, { useContext } from "react";
import { createSession } from '../api/auth';
import { AuthContext } from "../context/AuthContext";

export default function RequestCard({ request, type }) {
    const { offerSkill, wantSkill, days, timeSlots, status, from, to } = request || {};
    const { accessToken } = useContext(AuthContext);

    const handleSwap = async () => {
        try {
            const duration = days;
            const data = { requestId: request._id, duration };
            const response = await createSession(data, accessToken);
            alert('Session created successfully!');
        } catch (err) {
            console.error('Failed to create session', err);
            alert('Failed to create session');
        }
    };

    // Function to truncate skill names
    const truncateSkillName = (skillName, maxLength = 15) => {
        if (!skillName) return "";
        return skillName.length > maxLength ? skillName.substring(0, maxLength) + "..." : skillName;
    };

    return (
        <div
            className="relative w-[280px] h-[130px] sm:w-[360px] sm:h-[150px] md:w-[450px] md:h-[180px] lg:w-[520px] lg:h-[200px]"
            style={{
                backgroundImage: 'url("/request-bg.svg")',
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                boxShadow: "0 4px 24px 0 rgba(38, 70, 83, 0.10)",
                borderRadius: "18px",
                fontFamily: "'Josefin Sans', sans-serif",
            }}
        >
            {/* Header */}
            <div className="relative w-full h-[17%] flex gap-0 cursor-pointer">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[18px] w-[18px] sm:h-[22px] sm:w-[22px] md:h-[26px] md:w-[26px] lg:h-[30px] lg:w-[30px] bg-gray-300 rounded-full">
                    <img src="/userImage.png" alt="icon" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center text-[10px] sm:text-xs md:text-sm lg:text-base">
                    {(() => {
                        const name = type === "received" ? (from?.name || "From") : (to?.name || "To");
                        return name.split(" ")[0];
                    })()}
                </div>
                <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center text-[10px] sm:text-xs md:text-sm lg:text-base">
                    {(() => {
                        const name = type === "received" ? (from?.name || "From") : (to?.name || "To");
                        const parts = name.split(" ");
                        return parts.length > 1 ? parts.slice(1).join(" ") : "You";
                    })()}
                </div>
            </div>

            {/* Skills Section */}
            <div className="relative w-full h-[40%] flex">
                <div className="relative flex w-[42%] items-center justify-center p-1" title={offerSkill?.name || ""}>
                    <div className="relative px-1 sm:px-2 md:px-3 py-1 rounded-lg sm:rounded-xl md:rounded-2xl bg-[#264653] opacity-90 text-white text-center min-w-0 w-full">
                        <span className="block text-[9px] sm:text-[10px] md:text-xs lg:text-sm leading-tight">
                            {truncateSkillName(offerSkill?.name, 12)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-center" style={{ width: "16%" }}>
                    <img
                        src="/difArrows.svg"
                        alt="Arrows"
                        className="w-[18px] h-[20px] sm:w-[22px] sm:h-[24px] md:w-[26px] md:h-[28px] lg:w-[30px] lg:h-[32px]"
                    />
                </div>
                <div className="relative flex w-[42%] items-center justify-center p-1" title={wantSkill?.name || ""}>
                    <div className="relative px-1 sm:px-2 md:px-3 py-1 rounded-lg sm:rounded-xl md:rounded-2xl bg-[#e76f51] opacity-90 text-white text-center min-w-0 w-full">
                        <span className="block text-[9px] sm:text-[10px] md:text-xs lg:text-sm leading-tight">
                            {truncateSkillName(wantSkill?.name, 12)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Days and Time Slots */}
            <div className="relative w-full h-[26%] flex flex-col">
                <div className="w-full flex justify-center items-center" style={{ height: "25%" }}>
                    <span className="text-shadow-custom text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] font-semibold">{days} Days</span>
                </div>
                <div className="w-full text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-semibold flex items-center justify-center px-2 sm:px-3 md:px-4" style={{ height: "75%" }}>
                    <span className="px-2 sm:px-3 py-1 bg-[#FFE5E5] rounded-lg sm:rounded-xl md:rounded-2xl truncate max-w-[90%] text-center">
                        {timeSlots && timeSlots.length > 0 ? timeSlots[0] : "No time slot"}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="relative w-full h-[17%] flex justify-evenly cursor-pointer py-[3px] sm:py-[4px] md:py-[5px] px-2 sm:px-3 md:px-4">
                {type === "sent" ? (
                    <span className={`text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold px-2 sm:px-3 md:px-4 py-1 rounded-lg sm:rounded-xl md:rounded-2xl ${
                        status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                    }`} style={{ fontFamily: "Lemon, sans" }}>
                        {status?.toUpperCase()}
                    </span>
                ) : (
                    <>
                        <button 
                            onClick={handleSwap} 
                            className="bg-[#fff8f4] text-[9px] sm:text-[10px] md:text-xs lg:text-sm px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-md text-[#e76f51] hover:bg-[#fff0e6] transition-colors font-semibold" 
                            style={{ fontFamily: "Lemon, sans" }}
                        >
                            SWAP
                        </button>
                        <button className="bg-[#fff8f4] text-[9px] sm:text-[10px] md:text-xs lg:text-sm px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-md hover:bg-[#f0f0f0] transition-colors font-semibold">
                            Reject
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}