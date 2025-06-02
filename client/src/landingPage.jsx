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
        <div className="col-start-6 col-span-3 row-start-2 flex items-center justify-center">
          <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-7xl text-white">
            SKILL
          </h1>
        </div>

        {/* SWAP text on right */}
        <div className="col-start-12 col-span-3 row-start-2 flex items-center justify-center">
          <h1 style={{ fontFamily: "Lemon, serif" }} className="text-7xl text-white">
            SWAP
          </h1>
        </div>

        {/* Left Circle */}
        <div className="col-start-4 col-span-2 row-start-5 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full" style={{ backgroundColor: "#F4A261" }}></div>
        </div>

        {/* Right Circle */}
        <div className="col-start-15 col-span-2 row-start-5 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full" style={{ backgroundColor: "#E9C46A" }}></div>
        </div>

        {/* Login and Signup Buttons */}
        <div className="col-start-8 col-span-6 row-start-8 flex justify-center items-center gap-6">
          <button className="bg-[#E76F51] text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:border-2 hover:border-white hover:border-dotted">
            Login
          </button>
          <button className="bg-[#264653] text-white px-8 py-3 rounded-md text-lg font-medium transition-all duration-300 hover:border-2 hover:border-white hover:border-dotted">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
