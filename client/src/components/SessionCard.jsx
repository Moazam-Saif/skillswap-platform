import React from "react";
import moment from "moment-timezone";

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

export default function SessionCard({ session, userId, viewType }) {
    const otherUser = session.userA?._id === userId ? session.userB : session.userA;
    const firstName = otherUser?.name?.split(' ')[0] || "User";
    const lastName = otherUser?.name?.split(' ').slice(1).join(' ') || "";
    const imageUrl = otherUser?.imageUrl || "/userImage.png";
    const skillA = session.skillFromA?.name || "";
    const skillB = session.skillFromB?.name || "";

    const showJoinSession = viewType === "active" && session.scheduledTime && session.scheduledTime.some(isMeetingOngoing);

    return (
        <div
            className="
                bg-[#e76f51] text-white 
                rounded-[25px] md:rounded-[35px] lg:rounded-[50px] 
                shadow-sm hover:shadow-md transition-shadow 
                w-full max-w-full sm:max-w-[95vw] md:w-[600px] lg:w-[650px] 
                h-auto md:h-[190px] lg:h-[190px] 
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
            {/* Lower Section (70% height) */}
            <div className="flex flex-col justify-start h-[78%] md:h-[70%]">
                {/* Skills Swapped */}
                <div className="flex flex-row w-full justify-evenly items-center py-2 h-auto md:h-[50%]">
                    <div className="w-[45%] flex justify-center">
                        <span className="bg-[#f4a261] text-[#264653] rounded-full px-2 py-1 md:px-4 md:py-2 text-sm md:text-base font-medium shadow-sm">
                            {skillA}
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
                            {skillB}
                        </span>
                    </div>
                </div>
                {/* Timeslot and Duration */}
                <div className="mt-1 flex flex-col items-center gap-1 px-2 md:px-6 text-xs md:text-sm text-white/90 h-auto md:h-[30%] justify-center relative w-full">
                    <span>
                        {session.duration} weeks
                    </span>
                    <div className="flex flex-row gap-1 mt-1 w-full justify-center">
                        {session.scheduledTime && session.scheduledTime.map((slot, i) => (
                            <span key={i} className="bg-[#ec8b73] px-2 py-1 rounded-full">
                                {slot}
                            </span>
                        ))}
                    </div>
                    {/* Join Meeting Button */}
                    {showJoinSession && (
                        <div className="flex justify-center decoration-1 underline">
                            <a
                                href={`/meeting/${session._id}/0`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#264653] text-base transition-transform duration-200 ease-in-out transform hover:scale-110"
                            >
                                Join Session
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}