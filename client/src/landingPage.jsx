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
                <div className="relative w-full pt-20">
                    {/* SKILL text on left */}
                    <div className="absolute left-[20%] transform -translate-x-1/2 -mt-11">
                        <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-8xl text-white tracking-wide">
                            SKILL
                        </h1>
                    </div>

                    {/* SWAP text on right */}
                    <div className="absolute right-[30%] transform translate-x-1/2 -mt-8">
                        <h1 style={{ fontFamily: "Lemon, serif" }} className="text-8xl text-white tracking-wide">
                            SWAP
                        </h1>
                    </div>
                </div>

                {/* Circles */}
                <div className="flex justify-center items-center px-12 mt-32 gap-[40%] relative">
                    {/* Left Circle */}
                    <div className="relative left-[2%]">
                        <div className="w-34 h-34 rounded-full" style={{ backgroundColor: "#F4A261" }}></div>
                    </div>
                    {/* Right Circle */}
                    <div className="relative right-[1%]">
                        <div className="w-34 h-34 rounded-full" style={{ backgroundColor: "#E9C46A" }}></div>
                    </div>
                </div>

                {/* Login and Signup Buttons */}
                <div className="w-full flex justify-center items-center mt-16">
                    <div className="w-[60%] flex justify-between items-center gap-6">
                        <button className="bg-transparent text-[#E76F51] px-8 py-3 rounded-md text-lg font-medium border-1 border-[#E76F51] transition-all duration-300">
                            Login
                        </button>
                        <button className="bg-transparent text-[#264653] px-8 py-3 rounded-md text-lg font-medium border-1 border-[#264653] transition-all duration-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
