import React from 'react';

export const SwapCard = () => {
  return (
    <div className="w-[186px] h-[202px] relative bg-transparent">
      {/* Top Section */}
      <div className="w-full h-[70%] rounded-t-[30px] bg-[#E76F51] border-b-4 border-white relative overflow-hidden flex items-center justify-center">
        {/* SVG placeholders */}
        <div className="absolute left-0 top-0 h-full w-1/2 flex items-center justify-center">
          {/* Replace with your left SVG */}
          {/* <YourLeftSVG /> */}
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center">
          {/* Replace with your right SVG */}
          {/* <YourRightSVG /> */}
        </div>
        <div className="text-white text-4xl">↔</div>
      </div>

      {/* Bottom Section */}
      <div className="w-full h-[30%] flex bg-white rounded-b-[30px] overflow-hidden">
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
    </div>
  );
};


