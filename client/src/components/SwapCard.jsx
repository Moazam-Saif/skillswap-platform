import React from 'react';


export const SwapCard = () => {
    return (
        <div className="w-[179px] h-[173px] relative bg-transparent">
            {/* Top Section */}
            {/* REMOVED flex items-center justify-center from this parent div */}
            <div className="w-full h-[122px] rounded-t-[17px] bg-[#E76F51] border-b-2 border-white relative overflow-hidden">
                {/* SVG placeholders */}
                <div className="absolute left-[-67px] top-0 h-[122px] w-[126px] flex items-center justify-center" // This flex is for centering the text within this div
                    style={{
                        backgroundImage: "url('/LeftEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                

                    }}>
                        <text className='text-2xl z-50 rotate-90'>Hello</text>
                </div>
                <div className='absolute left-0 bottom-0 h-[8px] w-[8px] bg-[#F4A261]'></div>
                <div
                    className="absolute right-[-67px] top-0 h-[122px] w-[126px]" // Removed flex items-center justify-center as it's not needed here
                    style={{
                        backgroundImage: "url('/RightEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "content",
                    
                    }}
                >
                </div>

                <div className='absolute right-0 bottom-0 h-[8px] w-[8px] bg-[#E9C46A]'></div>
            </div>
            <div className="w-full h-[50px] flex bg-[#E76F51] rounded-b-[30px] overflow-hidden">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center border-r-2 border-white">
                    <img
                        src="https://via.placeholder.com/80"
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </div>
                {/* Right: Name */}
                <div className="w-1/2 flex flex-col items-center justify-center text-[#2E2E2E] font-semibold text-lg px-2 text-center">
                    <p>Moazam</p>
                    <p>Saif</p>
                </div>
            </div>
        </div >
    );
};