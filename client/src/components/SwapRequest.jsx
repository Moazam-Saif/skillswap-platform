import React, { useState } from 'react';

export default function () {
      const [selected, setSelected] = useState([]);

  const handleToggle = (slot) => {
    setSelected((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '1:00 PM - 2:00 PM',
    '2:30 PM - 3:30 PM',
    '4:00 PM - 5:00 PM',
    '5:30 PM - 6:30 PM',
  ];
    return (
        <div className="relative mx-auto my-20 w-[400px] h-[300px] flex flex-col gap-0 rounded-[15px] bg-[#FFF8F8] text-center shadow-2xl" style={{ backgroundImage: 'url("/Popup.svg")', fontFamily: "'Josefin Sans', sans-serif" }}>
            <div className="relative w-full h-[13%] flex gap-0 cursor-pointer">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[35px] w-[35px] bg-gray-300 rounded-full">
                    <img src="/userImage.png" alt="icon" className="w-full h-full object-cover rounded-full" />
                </div>

                <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center">Moazam</div>
                <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center">Saif</div>
            </div>

            <div className="relative w-full h-[30%] flex gap-0 bg-[#E76F5133]">
                <div className="relative w-1/2 h-full ">
                    <div className="relative w-full h-[35%] flex items-center justify-center">
                        You will Teach
                    </div>
                    <div className="relative w-full h-[65%] flex items-center justify-center text-[#264653] font-bold">
                        GUITAR
                    </div>
                </div>
                <div className="relative w-1/2 h-full ">
                    <div className="relative w-full h-[35%] flex items-center justify-center">
                        Moazam will Teach
                    </div>
                    <div className="relative w-full h-[65%] flex items-center justify-center text-[#E76F51] font-bold">
                        CYCLING
                    </div>
                </div>
            </div>
            <div className="relative w-full h-[40%] flex gap-0 ">
                <div className="relative w-1/2 h-full">
                    <div className="relative w-full h-[25%] flex items-center justify-center">
                        Enter the Duration
                    </div>
                    <div className="relative w-full h-[75%] flex flex-col items-center justify-center">
                        <label htmlFor="days">
                            Days:
                        </label>
                        <input id="days" type="number" className="px-2 text-center outline-none bg-white border-1 border-gray-200 rounded-full shadow-2xs" />
                    </div>
                </div>
                <div className="relative w-1/2 h-full">
                    <div className="relative w-full h-[25%] flex items-center justify-center">
                        Available TimeSlots
                    </div>
                    <div className='relative w-full h-[75%] pl-[2px] pr-[2px overflow-y-auto'>
                    <div className="relative w-full h-full max-h-full flex flex-col items-center justify-center overflow-y-auto p-2 border-1 bg-[#fddede] opacity-90 rounded-[15px]">
                        <ul className="text-sm text-gray-700 space-y-1 w-full">
                            {timeSlots.map((slot, index) => (
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
                            ))}
                        </ul>
                    </div>
                    </div>
                </div>

            </div>

            <div className="relative w-full h-[17%] flex gap-0 ">
                <div className="flex items-center justify-center relative w-1/2 h-full rounded-bl-[15px]">
                    <button className="px-3 py-1 bg-[#264653] text-white text-sm rounded-[15px] shadow-[#2646531A] shadow-md">Request Swap</button>
                </div>
                <div className="flex items-center justify-center relative w-1/2 h-full rounded-br-[15px]">
                    <button className="px-3 py-1 bg-[#264653] text-white text-sm rounded-[15px] shadow-[#2646531A] shadow-md">CHAT</button>
                </div>
            </div>
        </div>
    )
}