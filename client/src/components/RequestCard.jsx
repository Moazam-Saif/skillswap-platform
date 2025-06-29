import React from "react";

export default function RequestCard() {
    return (
        <div
            className="relative flex flex-col items-center justify-center"
             style={{
                width: "420px", // smaller width
                height: "180px", // smaller height
                backgroundImage: 'url("/request-bg.svg")',
                backgroundSize: "100% 100%", // SVG will stretch to fit new size
                backgroundPosition: "center",
                boxShadow: "0 4px 24px 0 rgba(38, 70, 83, 0.10)",
                borderRadius: "18px",
            }}
        
        >
            <div className="relative w-full h-[13%] flex gap-0 cursor-pointer">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[35px] w-[35px] bg-gray-300 rounded-full">
                        <img src="/userImage.png" alt="icon" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div className="relative w-1/2 h-full rounded-tl-[15px] flex items-center justify-center">First Name</div>
                    <div className="relative w-1/2 h-full rounded-tr-[15px] flex items-center justify-center">Last Name</div>
                </div>

        
        </div>
    );
}