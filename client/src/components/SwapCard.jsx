import React from 'react';
import CurvedText from 'react-curved-text';

export const SwapCard = () => {
    return (
        <div className="w-[179px] h-[173px] relative bg-transparent">
            {/* Top Section */}
            <div className="w-full h-[122px] rounded-t-[17px] bg-[#E76F51] border-b-2 border-white relative overflow-hidden flex items-center justify-center">
                {/* SVG placeholders */}
                <div className="absolute left-[-2px] top-0 h-[122px] w-[126px] flex items-center justify-center"
                    style={{
                        backgroundImage: "url('/LEllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                    }}
                >
                    <CurvedText
                        width={126}
                        height={122}
                        cx={20}
                        cy={60}
                        rx={35} // <- Instead of r
                        ry={40}
                        startOffset={80}
                        reversed={true}
                        text="Wants to Teach"
                        textProps={{ style: { fontSize: 11, fill: "white" } }}
                        textPathProps={null}
                        tspanProps={null}
                        ellipseProps={null}
                        svgProps={null}
                    />
                    {/* Replace with your left SVG */}
                    {/* <YourLeftSVG /> */}
                </div>
                <div className='absolute left-0 bottom-0 h-[8px] w-[8px] bg-[#F4A261]'></div>
                <div className="absolute right-[-2px] top-0 h-[122px] w-[126px] flex items-center justify-center"
                    style={{
                        backgroundImage: "url('/REllipse.svg')",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                        backgroundPositionX: "right"
                    }}>
                    <CurvedText
                        width={126}
                        height={122}
                        cx={106}       // 126 (width) - 20 (left cx) = 106 for mirroring
                        cy={60}        // same vertical center
                        rx={35}
                        ry={40}
                        startOffset={0}
                        reversed={true} // now curves toward center
                        text="Wants to Learn"
                        textProps={{ style: { fontSize: 11, fill: "white" } }}
                        textPathProps={null}
                        tspanProps={null}
                        ellipseProps={null}
                        svgProps={null}
                    />

                    {/* Replace with your right SVG */}
                    {/* <YourRightSVG /> */}

                </div>
                <div className='absolute right-0 bottom-0 h-[8px] w-[8px] bg-[#E9C46A]'></div>
                <div className="text-white text-4xl">↔</div>
            </div>

            {/* Bottom Section */}
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
        </div>
    );
};


