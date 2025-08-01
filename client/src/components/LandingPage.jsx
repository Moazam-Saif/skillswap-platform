import { Link } from 'react-router-dom';
import AnimationStroke from "../animations/animationstroke.jsx";
import IconAnimation from "../animations/iconAnimation.jsx";
import SearchResultCard from './SearchResultCard.jsx';
import UserProfileView from './ProfilePage.jsx';


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

      {/* Content Container with Grid */}
      <div className="relative z-10 h-screen w-full grid grid-cols-20 grid-rows-[repeat(10,1fr)] gap-0">
        {/* SKILL text on left */}
        <div className="col-start-3 col-span-3 row-start-1 flex items-center justify-center mt-5">
          <h1 style={{ fontFamily: "Kranky, cursive" }} className="text-[7vw] text-white tracking-wider">
            SKILL
          </h1>
        </div>

        {/* SWAP text on right */}
        <div className="col-start-14 col-span-3 row-start-1 flex items-center justify-center mt-11">
          <h1 style={{ fontFamily: "Lemon, serif" }} className="text-[7vw] text-white tracking-wider">
            SWAP
          </h1>
        </div>

        {/* Left Circle */}
        <div className="col-start-3 col-span-4 row-start-5 flex items-center justify-center">
          <div
            className="flex items-center justify-center w-45 h-45 rounded-full"
            style={{ backgroundColor: "#F4A261",
              boxShadow: "0 8px 24px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(244,162,97,0.25) inset"
             }}
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
            className="flex items-center justify-center w-45 h-45 rounded-full"
            style={{ backgroundColor: "#E9C46A",
              boxShadow: "0 8px 24px 0 rgba(0,0,0,0.25), 0 1.5px 4px 0 rgba(244,162,97,0.25) inset"
             }}
          >
         <IconAnimation direction="right"/>
         </div>
        </div>

        {/* Login and Signup Buttons */}
        <Link className="col-start-6 col-span-2 row-start-9" to="/login"><button className="bg-[#E76F51] text-white px-5 py-3 rounded-3xl text-lg font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
  Login
</button>
</Link>

        <Link className="col-start-14 col-span-2 row-start-9" to="/register"><button className="bg-[#264653] text-white px-5 py-3 rounded-3xl text-lg font-medium transition-all duration-300 border border-white/20 shadow-md hover:border-white hover:shadow-lg">
          Sign Up
        </button>
        </Link>
      </div>
    </div>
    <div className="relative w-full h-screen overflow-hidden" style={{ backgroundImage: "url('/background3.svg')" }}>
        {/* Left Circle */}
  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full md:-translate-x-3/4 lg:-translate-x-1/2 animate-slide-in-left">
    <div
      className="flex items-center justify-center w-[13rem] h-[13rem] rounded-full shadow-md"
      style={{
        backgroundColor: "rgba(233,196,106,0.75)",
      
      }}
    />
  </div>

  {/* Right Circle */}
  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full md:translate-x-3/4 lg:translate-x-1/2 animate-slide-in-right">
    <div
      className="flex items-center justify-center w-[13rem] h-[13rem] rounded-full shadow-md"
      style={{
        backgroundColor: "rgba(42,157,143,0.75)",
      
      }}
    />
     
  </div>

  </div>
    <div className="flex items-center justify-center min-h-screen bg-gray-200 w-[100vw]">
      < UserProfileView/>
    </div>


    </>
  );
}