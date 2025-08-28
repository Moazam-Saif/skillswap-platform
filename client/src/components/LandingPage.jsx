import { Link } from 'react-router-dom';
import AnimationStroke from "../animations/animationstroke.jsx";
import IconAnimation from "../animations/iconAnimation.jsx";

export default function LandingPage() {
  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        {/* SVG Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background.svg')",
          }}
        />

        {/* Single Responsive Layout */}
        <div className="relative z-10 h-screen w-full">
          {/* Mobile Layout */}
          <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-2 py-0 overflow-y-auto md:hidden">
            {/* Title Section */}
            <div className="absolute top-[3vh] text-center mb-6">
              <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-[7vh] sm:text-[5vh] text-white tracking-wider mb-2">
                SKILL
              </h1>
              <h1 style={{ fontFamily: "Lemon, serif" }} className="text-[7vh] sm:text-[5vh] text-white tracking-wider">
                SWAP
              </h1>
            </div>

            {/* Circles Section - Vertical Stack */}
            <div className="flex flex-col items-center space-y-4 w-full mt-5">
              {/* Top Circle */}
              <div
                className="flex items-center justify-center w-[17vh] h-[17vh] max-w-[150px] max-h-[150px] rounded-full"
                style={{
                  backgroundColor: "#F4A261",
                  boxShadow: "0 8px 24px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(244,162,97,0.25) inset"
                }}
              >
                <IconAnimation direction="left" key="mobile-left" isMobile={true} />
              </div>

              {/* Animation Stroke */}
              <div className="w-[32vw] h-[24vw] max-w-[140px] max-h-[90px] flex items-center justify-center">
                <AnimationStroke key="mobile" id="mobile" />
              </div>

              {/* Bottom Circle */}
              <div
                className="flex items-center justify-center w-[17vh] h-[17vh] max-w-[150px] max-h-[150px] rounded-full"
                style={{
                  backgroundColor: "#E9C46A",
                  boxShadow: "0 8px 24px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(244,162,97,0.25) inset"
                }}
              >
                <IconAnimation direction="right" key="mobile-right" isMobile={true} />
              </div>
            </div>

            {/* Buttons Section - Stacked */}
            <div className="absolute bottom-[3vh] flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full max-w-xs">
              <Link to="/login" className="flex-1">
                <button className="w-full bg-[#E76F51] text-white px-4 py-2 rounded-3xl text-base font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
                  Login
                </button>
              </Link>
              <Link to="/register" className="flex-1">
                <button className="w-full bg-[#264653] text-white px-4 py-2 rounded-3xl text-base font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid grid-cols-20 grid-rows-[repeat(10,1fr)] gap-0 h-full">
            {/* SKILL text on left */}
            <div className="col-start-3 col-span-3 row-start-1 flex items-center justify-center mt-5">
              <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-[8vw] lg:text-[6vw] xl:text-[5vw] text-white tracking-wider">
                SKILL
              </h1>
            </div>

            {/* SWAP text on right */}
            <div className="col-start-14 col-span-3 row-start-1 flex items-center justify-center mt-11">
              <h1 style={{ fontFamily: "Lemon, serif" }} className="text-[8vw] lg:text-[6vw] xl:text-[5vw] text-white tracking-wider">
                SWAP
              </h1>
            </div>

            {/* Left Circle */}
            <div className="col-start-3 col-span-4 row-start-5 flex items-center justify-center">
              <div
                className="flex items-center justify-center w-36 h-36 lg:w-45 lg:h-45 xl:w-52 xl:h-52 rounded-full"
                style={{
                  backgroundColor: "#F4A261",
                  boxShadow: "0 8px 24px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(244,162,97,0.25) inset"
                }}
              >
                <IconAnimation direction="left" key="desktop-left" isMobile={false} />
              </div>
            </div>

            <div className="col-start-7 col-span-8 row-start-5 mt-8">
              <AnimationStroke key="desktop" id="desktop" />
            </div>

            {/* Right Circle */}
            <div className="col-start-14 col-span-4 row-start-5 flex items-center justify-center">
              <div
                className="flex items-center justify-center w-36 h-36 lg:w-45 lg:h-45 xl:w-52 xl:h-52 rounded-full"
                style={{
                  backgroundColor: "#E9C46A",
                  boxShadow: "0 8px 24px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(244,162,97,0.25) inset"
                }}
              >
                <IconAnimation direction="right" key="desktop-right" isMobile={false} />
              </div>
            </div>

            {/* Login and Signup Buttons */}
            <Link className="col-start-6 col-span-2 row-start-9" to="/login">
              <button className="bg-[#E76F51] text-white px-4 py-2 lg:px-5 lg:py-3 xl:px-6 xl:py-4 rounded-3xl text-base lg:text-lg xl:text-xl font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
                Login
              </button>
            </Link>

            <Link className="col-start-14 col-span-2 row-start-9" to="/register">
              <button className="bg-[#264653] text-white px-4 py-2 lg:px-5 lg:py-3 xl:px-6 xl:py-4 rounded-3xl text-base lg:text-lg xl:text-xl font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}