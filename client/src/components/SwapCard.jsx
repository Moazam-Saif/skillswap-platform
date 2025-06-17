import React from 'react';


export const SwapCard = ({name,imageUrl}) => {
    return (
        <div className="w-[179px] h-[173px] relative bg-transparent">

            <div className="w-full h-[122px] rounded-t-[17px] bg-[#E76F51] border-b-2 border-white relative overflow-hidden flex items-center justify-center">
                <img
                    src="/Arrows.svg"
                    alt="Swap Taf"
                    className="w-[32px] h-[15px] scale-[1.5] "
                />
              
                <div className="absolute left-1 top-3 z-50 w-[31px] h-[100px] flex items-center justify-center overflow-hidden">
                    <span className="text-center z-50 transform rotate-90 origin-center text-[min(0.9rem,100%)] text-[#264653] leading-3 font-bold" style={{fontFamily: "'Josefin Sans', sans-serif" }}>
                        Guitar
                    </span>
                </div>
                <div className="absolute right-1 top-3 z-50 w-[32px] h-[100px] flex items-center justify-center overflow-hidden">
                    <span className="text-center z-50 transform -rotate-90 origin-center text-[min(0.9rem,100%)] text-[#264653] leading-3 font-bold" style={{fontFamily: "'Josefin Sans', sans-serif" }} >
                        Cycling
                    </span>
                </div>

                <div className="absolute left-[-67px] top-0 h-[122px] w-[126px] flex items-end"
                    style={{
                        backgroundImage: "url('/LeftEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                    }}>
                </div>
                <div className='absolute left-0 bottom-0 h-[8px] w-[8px] bg-[#F4A261]'></div>
                <div
                    className="absolute right-[-67px] top-0 h-[122px] w-[126px]"
                    style={{
                        backgroundImage: "url('/RightEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                    }}
                >
                </div>

                <div className='absolute right-0 bottom-0 h-[8px] w-[8px] bg-[#E9C46A]'></div>
            </div>
            <div className="w-full h-[50px] flex bg-[#E76F51] rounded-b-[30px] overflow-hidden">
                {/* Left: Image */}
                <div className="w-1/2 flex items-center justify-center border-r-2 border-white">
                    <img
                        src={imageUrl||"/userImage.png"}
                        alt="Profile"
                        className="w-[35px] h-[35px] rounded-full object-cover"
                    />
                </div>
                {/* Right: Name */}
                <div className="w-1/2 flex flex-col items-center justify-center text-white text-sm px-2 text-center" style={{fontFamily: "'Josefin Sans', sans-serif" }}>
                    <p className='flex flex-wrap'>{name || "User"}</p>
                </div>
            </div>
        </div >
    );
};