
import AnimationStroke from "./animations/animationstroke.jsx";
import IconAnimation from "./animations/iconAnimation.jsx";


export default function LandingPage() {

  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* SVG Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.svg')",
        }}
      />

      {/* Content Container with Grid */}
      <div className="relative z-10 h-screen w-full grid grid-cols-20 grid-rows-[repeat(10,1fr)] gap-0">
        {/* SKILL text on left */}
        <div className="col-start-3 col-span-3 row-start-1 flex items-center justify-center mt-5">
          <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-8xl text-white tracking-wider">
            SKILL
          </h1>
        </div>

        {/* SWAP text on right */}
        <div className="col-start-14 col-span-3 row-start-1 flex items-center justify-center mt-11">
          <h1 style={{ fontFamily: "Lemon, serif" }} className="text-8xl text-white tracking-wider">
            SWAP
          </h1>
        </div>

        {/* Left Circle */}
        <div className="col-start-3 col-span-4 row-start-5 flex items-center justify-center">
          <div
            className="flex items-center justify-center w-45 h-45 rounded-full shadow-md"
            style={{ backgroundColor: "#F4A261" }}
          >
           <IconAnimation direction="left"/>
          </div>
        </div>
        <div className="col-start-7 col-span-8 row-start-5 mt-8">
          <AnimationStroke />
        </div>

        {/* Right Circle */}
        <div className="col-start-14 col-span-4 row-start-5 flex items-center justify-center">
          <div
            className="flex items-center justify-center w-45 h-45 rounded-full shadow-md"
            style={{ backgroundColor: "#E9C46A" }}
          >
         <IconAnimation direction="right"/>
         </div>
        </div>

        {/* Login and Signup Buttons */}
        <button className="col-start-6 col-span-2 row-start-9 bg-[#E76F51] text-white px-5 py-3 rounded-3xl text-lg font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
  Login
</button>

        <button className="col-start-14 col-span-2 row-start-9 bg-[#264653] text-white px-5 py-3 rounded-3xl text-lg font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
          Sign Up
        </button>
      </div>
    </div>
  );
}