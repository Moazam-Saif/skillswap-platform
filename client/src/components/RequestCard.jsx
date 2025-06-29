import React from "react";


export default function RequestCard() {
    return (
        <div
            className="relative"
            style={{
                width: "420px", // smaller width
                height: "180px", // smaller height
                backgroundImage: 'url("/request-bg.svg")',
                backgroundSize: "100% 100%", // SVG will stretch to fit new size
                backgroundPosition: "center",
                boxShadow: "0 4px 24px 0 rgba(38, 70, 83, 0.10)",
                borderRadius: "18px",
                fontFamily: "'Josefin Sans', sans-serif",
            }}

        >
            <div className="relative w-full h-[17%] flex gap-0 cursor-pointer">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[28px] w-[28px] bg-gray-300 rounded-full">
                    <img src="/userImage.png" alt="icon" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center">First Name</div>
                <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center">Last Name</div>
            </div>
            <div className="relative w-full h-[40%] flex">
                {/* Left half */}
                <div className="w-1/2 h-full flex items-center justify-center text-2xl text-[#264653] font-extralight" style={{ fontFamily: "Lemon,sans" }}>
                    {/* Content for left side */}DJANGO
                </div>
                {/* Right half */}
                
                <div className="w-1/2 h-full flex items-center justify-center text-2xl text-[#264653]" style={{ fontFamily: "Lemon, sans" }}>
                    {/* Content for right side */}ANGULAR
                </div>
                {/* Center arrows */}
                <div
                    className="absolute left-1/2 top-1/2 flex items-center justify-center"
                    style={{
                        width: "28px",
                        height: "31px",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                    }}
                >
                    {/* Replace the FontAwesomeIcons with your SVG */}
                    <img
                        src="/difArrows.svg" // Replace with your SVG file path
                        alt="Arrows"
                        style={{ width: "28px", height: "31px" }}
                    />
                </div>
            </div>
            <div className="relative w-full h-[26%] flex flex-col">
                {/* Top div: 25% of height */}
                <div className="w-full flex justify-center items-center" style={{ height: "20%" }}>
                    {/* Content for top 25% */}<span className="text-shadow-custom text-[11px] font-semibold">15 Days</span>
                </div>
                {/* Bottom div: 75% of height */}
                <div className="w-full text-xs font-semibold flex items-center justify-center" style={{ height: "80%" }}>
                    {/* Content for bottom 75% */}<span className="px-2 py-1 bg-[#FFE5E5] rounded-2xl">Monday 11:00 - 12:00</span>
                </div>
            </div>
            <div className="relative w-full h-[17%] flex justify-evenly cursor-pointer py-[5px]">
                <button className="bg-[#fff8f4] text-sm px-3 rounded-2xl flex items-center justify-center shadow-md text-[#e76f51]" style={{ fontFamily: "Lemon, sans" }}>SWAP</button>
                <button className="bg-[#fff8f4] text-sm px-3 rounded-2xl flex items-center justify-center shadow-md" >Reject</button>
            </div>


        </div>
    );
}