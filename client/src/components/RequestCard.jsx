import React, { useContext } from "react";
import { createSession, rejectSwapRequest } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { convertTimeSlotToLocal } from "../utils/timeUtils";

export default function RequestCard({ request, type, onRemove }) {
    const { offerSkill, wantSkill, days, timeSlots, status, from, to, _id } = request || {};
    const { accessToken } = useContext(AuthContext);

    // Truncate skill names for display
    const truncateSkillName = (skillName, maxLength = 15) => {
        if (!skillName) return "";
        return skillName.length > maxLength ? skillName.substring(0, maxLength) + "..." : skillName;
    };

    // Get user info for card
    const user = type === "received" ? from : to;
    const firstName = user?.name?.split(" ")[0] || "User";
    const lastName = user?.name?.split(" ").slice(1).join(" ") || "You";
    const imageUrl = user?.imageUrl || "/userImage.png";

    // Accept (Swap) handler
    const handleSwap = async () => {
        try {
            const duration = days;
            const data = { requestId: _id, duration };
            await createSession(data, accessToken);
            if (onRemove) onRemove(_id);
            alert('Session created successfully!');
        } catch (err) {
            console.error('Failed to create session', err);
            alert('Failed to create session');
        }
    };

    // Reject handler
    const handleReject = async () => {
        try {
            await rejectSwapRequest(_id, accessToken);
            if (onRemove) onRemove(_id);
            alert('Request rejected!');
        } catch (err) {
            console.error('Failed to reject request', err);
            alert('Failed to reject request');
        }
    };

    return (
        <div
            className="
                bg-[#e76f51] text-white 
                rounded-[25px] md:rounded-[35px] lg:rounded-[50px] 
                shadow-sm hover:shadow-md transition-shadow 
                w-full max-w-full sm:max-w-[95vw] md:w-[600px] lg:w-[650px] 
                h-auto md:h-[210] lg:h-[210px] 
                mx-auto overflow-hidden flex flex-col justify-between
            "
            style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
            {/* Top Section */}
            <div className="h-[22%] md:h-[30%] border-b-2 border-white flex items-center py-2">
                <div className="w-[45%] px-1 sm:px-2 md:px-4 flex justify-center">
                    <span className="font-semibold text-sm sm:text-lg md:text-xl truncate">
                        {firstName}
                    </span>
                </div>
                <div className="w-[10%] flex justify-center">
                    <img
                        src={imageUrl}
                        alt="user"
                        className="w-7 h-7 sm:w-10 sm:h-10 md:w-13 md:h-13 rounded-full object-cover"
                    />
                </div>
                <div className="w-[45%] px-1 sm:px-2 md:px-4 flex justify-center">
                    <span className="font-semibold text-sm sm:text-lg md:text-xl truncate">
                        {lastName}
                    </span>
                </div>
            </div>
            {/* Lower Section */}
            <div className="flex flex-col justify-start h-[78%] md:h-[70%] pb-[6px]">
                {/* Skills Swapped */}
                <div className="flex flex-row w-full justify-evenly items-center py-2 h-auto md:h-[50%]">
                    <div className="w-[45%] flex justify-center">
                        <span className="bg-[#f4a261] text-[#264653] rounded-full px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium shadow-sm">
                            {truncateSkillName(offerSkill?.name, 15)}
                        </span>
                    </div>
                    <div className="w-10% flex justify-center">
                        <img
                            src="/Arrows.svg"
                            alt="Swap Taf"
                            className="w-[18px] h-[8px] md:w-[23px] md:h-[15px] sm:w-[34px] sm:h-[17px] scale-[1.5]"
                        />
                    </div>
                    <div className="w-[45%] flex justify-center">
                        <span className="bg-[#e9c46a] text-[#264653] rounded-full px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium shadow-sm">
                            {truncateSkillName(wantSkill?.name, 15)}
                        </span>
                    </div>
                </div>
                {/* Days and Time Slots */}
                <div className="mt-2 flex flex-col items-center gap-1 px-2 md:px-6 text-xs md:text-sm text-white/90 h-auto md:h-[30%] justify-center relative w-full">
                    <span>
                        {days} Number of Sessions
                    </span>
                    <div className="flex flex-row gap-1 mt-1 w-full justify-center">
                        <span className="bg-[#ec8b73] px-2 py-1 rounded-full">
                            {convertTimeSlotToLocal(timeSlots && timeSlots.length > 0 ? timeSlots[0] : null)}
                        </span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-center w-full mt-[3px]">
                        {type === "sent" ? (
                            <span className={`text-xs md:text-sm  px-2 py-[2px] rounded-lg ${
                                status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : status === "accepted"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                            }`}>
                                {status?.toUpperCase()}
                            </span>
                        ) : (
                            <>
                            <div className="w-1/2 flex items-center justify-center">
                                <button 
                                    onClick={handleSwap} 
                                    className="bg-[#fff8f4] text-xs md:text-sm px-2 py-1 rounded-lg flex items-center justify-center shadow-md text-[#e76f51] hover:bg-[#fff0e6] transition-colors font-semibold cursor-pointer" 
                                    style={{ fontFamily: "Lemon, sans" }}
                                >
                                    SWAP
                                </button>
                            </div>
                            <div className="w-1/2 flex items-center justify-center">
                                <button 
                                    onClick={handleReject}
                                    className="bg-[#fff8f4] text-xs md:text-sm px-3 py-1 rounded-lg flex items-center justify-center shadow-md hover:bg-[#f0f0f0] transition-colors text-black"
                                >
                                    Reject
                                </button>
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}