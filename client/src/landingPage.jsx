import AnimationStroke from "./animationstroke"
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
          <div className="w-45 h-45 rounded-full" style={{ backgroundColor: "#F4A261" }}></div>
        </div>
        <div className="col-start-7 col-span-8 row-start-5 mt-8">
          <AnimationStroke/>
        </div>

        {/* Right Circle */}
        <div className="col-start-14 col-span-4 row-start-5 flex items-center justify-center">
          <div className="w-45 h-45 rounded-full" style={{ backgroundColor: "#E9C46A" }}></div>
        </div>

        {/* Login and Signup Buttons */}
        {/* <div className="col-start-8 col-span-6 row-start-8 flex justify-center items-center gap-6"> */}
          <button className="col-start-6 col-span-2 row-start-9 bg-[#E76F51] text-white px-5 py-3 rounded-3xl text-lg font-medium transition-all duration-300 hover:border-2 hover:border-white">
            Login
          </button>
          <button className="col-start-14 col-span-2 row-start-9 bg-[#264653] text-white px-5 py-3 rounded-3xl text-lg font-medium transition-all duration-300 hover:border-2 hover:border-white">
            Sign Up
          </button>
        {/* </div> */}
      </div>
    </div>
  )
}
