import React, { useState } from 'react';

export default function SwapRequest({
  userId,
  userName,
  imageUrl,
  availability = [],
  skillsTheyOffer = [],
  skillsTheyWant = [],
  onClose = () => {},
}) {
  const [selected, setSelected] = useState([]);
  const [days, setDays] = useState(1);

  const handleToggle = (slot) => {
    setSelected((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Format slots for display
  const timeSlots = availability.length
    ? availability.map(
        (slot) => `${slot.day} ${slot.startTime} - ${slot.endTime}`
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative mx-auto w-[400px] h-[300px] flex flex-col gap-0 rounded-[15px] bg-[#FFF8F8] text-center shadow-2xl" style={{ backgroundImage: 'url("/Popup.svg")', fontFamily: "'Josefin Sans', sans-serif" }}>
        {/* Header */}
        <div className="relative w-full h-[13%] flex gap-0 cursor-pointer">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[35px] w-[35px] bg-gray-300 rounded-full">
            <img src={imageUrl} alt="icon" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center">{userName}</div>
          <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center">You</div>
        </div>

        {/* Skills Section */}
        <div className="relative w-full h-[30%] flex gap-0 bg-[#E76F5133]">
          <div className="relative w-1/2 h-full ">
            <div className="relative w-full h-[35%] flex items-center justify-center">
              You will Teach
            </div>
            <div className="relative w-full h-[65%] flex items-center justify-center text-[#264653] font-bold">
              {skillsTheyOffer[0]?.name || "Your Skill"}
            </div>
          </div>
          <div className="relative w-1/2 h-full ">
            <div className="relative w-full h-[35%] flex items-center justify-center">
              {userName} will Teach
            </div>
            <div className="relative w-full h-[65%] flex items-center justify-center text-[#E76F51] font-bold">
              {skillsTheyWant[0]?.name || "Their Skill"}
            </div>
          </div>
        </div>

        {/* Duration & TimeSlots */}
        <div className="relative w-full h-[40%] flex gap-0 ">
          <div className="relative w-1/2 h-full">
            <div className="relative w-full h-[25%] flex items-center justify-center">
              Enter the Duration
            </div>
            <div className="relative w-full h-[75%] flex flex-col items-center justify-center">
              <label htmlFor="days">
                Days:
              </label>
              <input
                id="days"
                type="number"
                min={1}
                value={days}
                onChange={e => setDays(e.target.value)}
                className="px-2 text-center outline-none bg-white border-1 border-gray-200 rounded-full shadow-2xs"
              />
            </div>
          </div>
          <div className="relative w-1/2 h-full">
            <div className="relative w-full h-[25%] flex items-center justify-center">
              Available TimeSlots
            </div>
            <div className='relative w-full h-[75%] pl-[2px] pr-[2px] overflow-y-auto'>
              <div className="relative w-full h-full max-h-full flex flex-col items-center justify-center overflow-y-auto p-2 border-1 bg-[#F4A26133] opacity-90 rounded-[15px]">
                <ul className="text-sm text-gray-700 space-y-1 w-full">
                  {timeSlots.length === 0 ? (
                    <li className="text-gray-400">No available time slots</li>
                  ) : (
                    timeSlots.map((slot, index) => (
                      <li
                        key={index}
                        onClick={() => handleToggle(slot)}
                        className={`cursor-pointer px-3 py-1 rounded transition ${selected.includes(slot)
                          ? 'bg-[#264653] font-medium text-white'
                          : 'hover:bg-gray-100'
                          }`}
                      >
                        {slot}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative w-full h-[17%] flex gap-0 ">
          <div className="flex items-center justify-center relative w-1/2 h-full rounded-bl-[15px]">
            <button className="px-3 py-1 bg-[#264653] text-white text-sm rounded-[15px] shadow-[#2646531A] shadow-md">Request Swap</button>
          </div>
          <div className="flex items-center justify-center relative w-1/2 h-full rounded-br-[15px]">
            <button className="px-3 py-1 bg-[#264653] text-white text-sm rounded-[15px] shadow-[#2646531A] shadow-md">CHAT</button>
          </div>
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}