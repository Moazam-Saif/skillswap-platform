export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* SVG Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.svg')",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen p-8 flex flex-col">
        {/* Text Content */}
        <div className="flex justify-between items-start pt-20">
          {/* SKILL text on left */}
          <div>
            <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-5xl text-white">Kranky</h1>
          </div>

          {/* SWAP text on right */}
          <div className="mt-12">
            <h1
            style={{ fontFamily: "Lemon, serif" }}
            className="text-5xl text-white"
          >SWAP</h1>
          </div>
        </div>

        {/* Circles */}
        <div className="flex justify-between items-center px-12 mt-16 relative">
          {/* Left Circle */}
          <div className="w-32 h-32 rounded-full" style={{ backgroundColor: "#F4A261" }}></div>

          {/* Right Circle */}
          <div className="w-32 h-32 rounded-full" style={{ backgroundColor: "#E9C46A" }}></div>
        </div>

        {/* Login and Signup Buttons */}
        <div className="flex justify-center items-center gap-6 mt-16">
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
