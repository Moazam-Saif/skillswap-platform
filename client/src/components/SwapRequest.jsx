import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { sendSwapRequest } from '../api/auth';
import moment from 'moment-timezone';

export default function SwapRequest({
    userId,
    userName,
    imageUrl,
    availability = [],
    skillsTheyOffer = [],
    skillsTheyWant = [],
    onClose = () => { },
}) {

    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedSlotIds, setSelectedSlotIds] = useState([]);
    const [days, setDays] = useState(1);
    const [offerIndex, setOfferIndex] = useState(0);
    const [wantIndex, setWantIndex] = useState(0);
    const [userTimezone, setUserTimezone] = useState('UTC');
    const [convertedAvailability, setConvertedAvailability] = useState([]);

    const userData = {
        userId: userId || "unknown-user",
        userName: userName || "Unknown User",
        imageUrl: imageUrl || "/userImage.png",
        availability: availability.length > 0 ? availability : [],
        skillsTheyOffer: skillsTheyOffer.length > 0 ? skillsTheyOffer : [],
        skillsTheyWant: skillsTheyWant.length > 0 ? skillsTheyWant : []
    };

    useEffect(() => {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(detectedTimezone);
        convertAvailabilityToUserTimezone(availability, detectedTimezone);
    }, [availability]);

const convertAvailabilityToUserTimezone = (slots, timezone) => {
    console.log('🌍 Converting availability to user timezone:', timezone);
    console.log('🔍 Raw slots received:', slots);

    const converted = slots.map((slot, index) => {
        console.log(`🔍 Processing slot ${index}:`, slot);
        console.log(`🔍 Has UTC fields? utcDay: ${slot.utcDay}, utcStartTime: ${slot.utcStartTime}, utcEndTime: ${slot.utcEndTime}`);

        // ✅ If slot has UTC fields, convert UTC → User's timezone
        if (slot.utcDay && slot.utcStartTime && slot.utcEndTime) {
            const utcStart = moment.utc().day(slot.utcDay).hour(
                parseInt(slot.utcStartTime.split(':')[0])
            ).minute(
                parseInt(slot.utcStartTime.split(':')[1])
            );

            const utcEnd = moment.utc().day(slot.utcDay).hour(
                parseInt(slot.utcEndTime.split(':')[0])
            ).minute(
                parseInt(slot.utcEndTime.split(':')[1])
            );

            const localStart = utcStart.tz(timezone);
            const localEnd = utcEnd.tz(timezone);

            const convertedSlot = {
                ...slot,
                day: localStart.format('dddd'),
                startTime: localStart.format('HH:mm'),
                endTime: localEnd.format('HH:mm'),
                displayTimezone: timezone
            };
            
            console.log(`✅ Converted slot ${index}:`, convertedSlot);
            return convertedSlot;
        }
        
        // ✅ If no UTC fields, return the slot as-is with timezone label
        // (This handles slots that are already in user's timezone or missing UTC data)
        const slotWithTimezone = {
            ...slot,
            displayTimezone: timezone
        };
        
        console.log(`ℹ️ Slot ${index} returned as-is with timezone:`, slotWithTimezone);
        return slotWithTimezone;
    });

    console.log('✅ All converted availability:', converted);
    setConvertedAvailability(converted);
};

    const handleRequestSwap = async () => {
        if (selectedSlotIds.length === 0) {
            alert("Please select at least one time slot");
            return;
        }

        // ✅ VALIDATE: Ensure all selected slots have real IDs
        const invalidSlots = selectedSlotIds.filter(id => !id || id.startsWith('fallback-'));
        if (invalidSlots.length > 0) {
            alert("Some selected time slots don't have valid IDs. Please ask the user to reset their availability.");
            console.error('❌ Invalid slot IDs detected:', invalidSlots);
            return;
        }

        const data = {
            toUserId: userData.userId,
            offerSkill: userData.skillsTheyOffer[offerIndex],
            wantSkill: userData.skillsTheyWant[wantIndex],
            days: Number(days),
            selectedAvailabilityIds: selectedSlotIds,
        };

        console.log('🚀 Sending swap request with validated real IDs:', selectedSlotIds);

        try {
            const response = await sendSwapRequest(data, accessToken);
            console.log('✅ Swap request response:', response);
            alert("Swap request sent successfully!");
            onClose();
        } catch (err) {
            console.error("❌ Failed to send swap request:", err);
            console.error("❌ Backend error:", err.response?.data);
            alert(`Failed to send request: ${err.response?.data?.message || 'Please try again'}`);
        }
    };

    const handleToggle = (slot) => {
        // ✅ VALIDATE: Only work with slots that have real IDs
        if (!slot.id || slot.id.startsWith('fallback-')) {
            alert("This time slot doesn't have a valid ID. Please ask the user to reset their availability.");
            console.error('❌ Attempted to select slot without valid ID:', slot);
            return;
        }

        console.log('🔄 Toggling slot with real ID:', slot.id);

        setSelectedSlotIds((prev) =>
            prev.includes(slot.id)
                ? prev.filter((id) => id !== slot.id)
                : [...prev, slot.id]
        );
    };

    const handleHeaderClick = () => {
        navigate(`/users/profile/show/${userData.userId}`);
    };

    const availabilityToUse = convertedAvailability.length ? convertedAvailability : userData.availability;

    // ✅ FILTER: Only show slots with valid IDs (no fallback IDs)
    const validSlots = availabilityToUse.filter(slot => slot.id && !slot.id.startsWith('fallback-'));
    
    const displaySlots = validSlots.map((slot) => ({
        id: slot.id, // ✅ Real ID only
        display: `${slot.day} ${slot.startTime} - ${slot.endTime}${slot.displayTimezone ? ` (${userTimezone})` : ''}`,
        slot: slot
    }));

    // Show warning if some slots were filtered out
    const invalidSlotsCount = availabilityToUse.length - validSlots.length;

    const nextOffer = () => setOfferIndex((prev) => (prev + 1) % userData.skillsTheyOffer.length);
    const prevOffer = () => setOfferIndex((prev) => (prev - 1 + userData.skillsTheyOffer.length) % userData.skillsTheyOffer.length);
    const nextWant = () => setWantIndex((prev) => (prev + 1) % userData.skillsTheyWant.length);
    const prevWant = () => setWantIndex((prev) => (prev - 1 + userData.skillsTheyWant.length) % userData.skillsTheyWant.length);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center shadow-sm backdrop-blur-sm p-4">
            <div className="relative mx-auto w-[340px] sm:w-[380px] md:w-[500px] h-[320px] sm:h-[350px] md:h-[400px] flex flex-col gap-0 rounded-[15px] text-center shadow-2xl text-white bg-[#E76F51E6]" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>

                {/* Header */}
                <div className="relative w-full h-[40px] sm:h-[45px] md:h-[50px] flex gap-0 cursor-pointer border-b-1 border-white" onClick={handleHeaderClick}>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[32px] sm:h-[38px] md:h-[42px] w-[32px] sm:w-[38px] md:w-[42px] bg-gray-300 rounded-full border-2 border-[#264653]">
                        <img src={userData.imageUrl} alt="icon" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center text-sm sm:text-base md:text-lg font-medium">{userData.userName}</div>
                    <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center text-sm sm:text-base md:text-lg font-medium">You</div>
                </div>

                {/* Skills Section */}
                <div className="relative w-full h-[120px] sm:h-[140px] md:h-[158px] flex gap-0 bg-[#264653cc] shadow-2xs">
                    <div className="relative w-1/2 h-full flex flex-col items-center justify-center border-r-1 border-white">
                        <div className="relative w-full h-[30%] flex items-center justify-center text-xs sm:text-sm md:text-base font-medium px-1">
                            {userData.userName} will Teach
                        </div>
                        <div className="relative w-full h-[70%] flex items-center justify-center text-white font-bold">
                            <button
                                className="px-1 text-sm sm:text-lg md:text-xl font-bold text-[#264653] hover:text-white focus:outline-none"
                                onClick={prevOffer}
                                disabled={userData.skillsTheyOffer.length <= 1}
                                type="button"
                            >
                                &#8592;
                            </button>
                            <span className="mx-1 text-xs sm:text-base md:text-lg text-center">
                                {userData.skillsTheyOffer[offerIndex]?.name || "No Skills Available"}
                            </span>
                            <button
                                className="px-1 text-sm sm:text-lg md:text-xl font-bold text-[#264653] hover:text-white focus:outline-none"
                                onClick={nextOffer}
                                disabled={userData.skillsTheyOffer.length <= 1}
                                type="button"
                            >
                                &#8594;
                            </button>
                        </div>
                    </div>
                    <div className="relative w-1/2 h-full flex flex-col items-center justify-center">
                        <div className="relative w-full h-[30%] flex items-center justify-center text-xs sm:text-sm md:text-base font-medium px-1">
                            You will Teach
                        </div>
                        <div className="relative w-1/2 h-[70%] flex items-center justify-center text-white font-bold">
                            <button
                                className="px-1 text-sm sm:text-lg md:text-xl font-bold text-[#264653] hover:text-white focus:outline-none"
                                onClick={prevWant}
                                disabled={userData.skillsTheyWant.length <= 1}
                                type="button"
                            >
                                &#8592;
                            </button>
                            <span className="mx-1 text-xs sm:text-base md:text-lg text-center">
                                {userData.skillsTheyWant[wantIndex]?.name || "No Skills Available"}
                            </span>
                            <button
                                className="px-1 text-sm sm:text-lg md:text-xl font-bold text-[#264653] hover:text-white focus:outline-none"
                                onClick={nextWant}
                                disabled={userData.skillsTheyWant.length <= 1}
                                type="button"
                            >
                                &#8594;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Duration & TimeSlots */}
                <div className="relative w-full h-[110px] sm:h-[120px] md:h-[132px] flex gap-0 bg-[#e76f5122]">
                    <div className="relative w-1/2 h-full border-r-1 border-white">
                        <div className="relative w-full h-[100%] flex flex-col items-center justify-between">
                            <label className="mt-2 text-sm sm:text-base md:text-lg font-medium" htmlFor="days">
                                Days:
                            </label>
                            <input
                                id="days"
                                type="number"
                                min={1}
                                value={days}
                                onChange={e => setDays(e.target.value)}
                                className="px-2 text-center text-sm sm:text-base md:text-lg outline-none bg-white w-[100px] sm:w-[130px] md:w-[150px] border-1 border-[#e76f51] text-[#e76f51] rounded-full shadow-2xs mb-4 sm:mb-7 md:mb-9"
                            />
                        </div>
                    </div>
                    <div className="relative w-1/2 h-full p-[3px] sm:p-[4px]">
                        <div className='relative w-full h-[100%] pl-[2px] pr-[2px] overflow-y-auto'>
                            <div className="relative w-full h-full max-h-full flex flex-col items-center justify-center overflow-y-auto p-1 sm:p-2 border-1 bg-[#e76f5140] opacity-90 rounded-[15px]">
                                {/* ✅ Warning for invalid slots */}
                                {invalidSlotsCount > 0 && (
                                    <div className="text-yellow-300 text-xs mb-2 text-center px-1">
                                        ⚠️ {invalidSlotsCount} slot(s) hidden (invalid IDs)
                                    </div>
                                )}
                                <ul className="text-xs sm:text-sm text-white space-y-1 w-full">
                                    {displaySlots.length === 0 ? (
                                        <li className="text-gray-400 text-xs text-center">
                                            {availabilityToUse.length > 0 
                                                ? "No valid time slots (user needs to reset availability)" 
                                                : "No available time slots"
                                            }
                                        </li>
                                    ) : (
                                        displaySlots.map((item) => (
                                            <li
                                                key={item.id}
                                                onClick={() => handleToggle(item.slot)}
                                                className={`cursor-pointer px-1 sm:px-2 md:px-3 py-1 rounded transition text-xs sm:text-sm ${selectedSlotIds.includes(item.id)
                                                    ? 'bg-[#264653] font-medium text-white'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {item.display}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="relative w-full h-[50px] sm:h-[55px] md:h-[60px] flex gap-0 border-t-1 border-white">
                    <div className="flex items-center justify-center relative w-1/2 h-full rounded-bl-[15px] border-r-1 border-white">
                        <button 
                            className={`px-2 sm:px-3 py-1 bg-white text-[#e76f51] text-xs sm:text-sm md:text-base rounded-[15px] shadow-[#2646531A] shadow-md ${displaySlots.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={handleRequestSwap}
                            disabled={displaySlots.length === 0}
                        >
                            Request Swap
                        </button>
                    </div>
                    <div className="flex items-center justify-center relative w-1/2 h-full rounded-br-[15px]">
                        <button className="px-2 sm:px-3 py-1 bg-white text-[#e76f51] text-xs sm:text-sm md:text-base rounded-[15px] shadow-[#2646531A] shadow-md">CHAT</button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={e => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg sm:text-xl font-bold"
                    type="button"
                >
                    ×
                </button>
            </div>
        </div>
    );
}