import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import Nav from './Nav';
import Sidebar from './Sidebar';
import SwapRequest from './SwapRequest';
import { AuthContext } from '@/context/AuthContext';
import { getUserById } from '../api/auth';

export default function UserProfileView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSwapRequest, setShowSwapRequest] = useState(false);
  const { userId } = useParams();
  const { accessToken } = useContext(AuthContext);

  // Function to create random pattern for skills
  const createRandomPattern = (skills) => {
    if (!skills || skills.length === 0) return [];

    const rows = [];
    let remainingSkills = [...skills];

    while (remainingSkills.length > 0) {
      // Random row length between 1 and 4 (or remaining skills if less)
      const maxRowLength = Math.min(4, remainingSkills.length);
      const minRowLength = Math.min(1, remainingSkills.length);
      const rowLength = Math.floor(Math.random() * (maxRowLength - minRowLength + 1)) + minRowLength;

      // Take skills for this row
      const rowSkills = remainingSkills.splice(0, rowLength);
      rows.push(rowSkills);
    }

    return rows;
  };

  // Function to split name into first and last
  const splitName = (fullName) => {
    const names = fullName?.split(' ') || [];
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  // Handler for opening swap request
  const handleRequestSwap = () => {
    setShowSwapRequest(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          setError("User ID not provided");
          setLoading(false);
          return;
        }

        const userData = await getUserById(userId, accessToken);
        setUser(userData);
      } catch (err) {
        setError("Failed to fetch user profile.");
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <Nav />
        <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
          <Sidebar />
          <section className="w-full md:w-[80%] flex-1 overflow-y-auto bg-gray-50">
            <div className="pt-16 md:pt-0 flex items-center justify-center min-h-screen">
              <div className="text-gray-500 text-lg">Loading profile...</div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <Nav />
        <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
          <Sidebar />
          <section className="w-full md:w-[80%] flex-1 overflow-y-auto bg-gray-50">
            <div className="pt-16 md:pt-0 flex items-center justify-center min-h-screen">
              <div className="text-red-500 text-lg">{error}</div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const { firstName, lastName } = splitName(user?.name);

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      <Nav />
      <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
        <Sidebar hideOnDesktop={true} />
             <section className="w-full flex-1 overflow-y-auto bg-gray-50">
          <div className="pt-16 md:pt-0">
            <div className="flex-1 bg-gray-50 flex flex-col lg:flex-row">
              {/* Left Half - Scrollable */}
              <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 lg:gap-10 bg-[#fff8f8] overflow-y-auto">


                {/* Upper Half - User Image with Frame */}
                <div className='relative h-64 sm:h-80 lg:h-1/2 w-full mx-auto border-b-1 border-[#264653] p-[5px]'>
                  <div className="flex items-center justify-center lg:h-full" style={{ height: 'calc(100% - 3rem)' }}>
                    <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-[210px] lg:h-[210px] mx-auto" style={{
                      backgroundImage: `url(/circleFrame.png)`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain"
                    }}>
                      <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-[180px] lg:h-[180px] mx-auto">
                        <img
                          src={user?.imageUrl || "/userImage.png"}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full aspect-square"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Name Section - Only visible on mobile, positioned below image */}
                  <div className="lg:hidden absolute bottom-2 left-0 right-0 flex flex-col justify-center items-center text-center">
                    <h1 className="text-lg sm:text-xl font-semibold text-[#E76F51]">
                      {firstName} {lastName}
                    </h1>
                  </div>
                </div>



                {/* Lower Half - Skills Sections */}
                <div className="flex flex-col gap-6 lg:gap-8">
                  {/* Skills Have Section */}
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#264653] text-center">Skills They Have</h3>
                    <div className="flex flex-col gap-2 items-center">
                      {user?.skillsHave?.length > 0 ? (
                        createRandomPattern(user.skillsHave).map((row, rowIndex) => (
                          <div key={rowIndex} className="flex gap-2 justify-center flex-wrap">
                            {row.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#E76F51] text-white rounded-full text-xs sm:text-sm font-medium shadow-sm"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 italic text-sm">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Skills Want Section */}
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#264653] text-center">Skills They Want</h3>
                    <div className="flex flex-col gap-2 items-center">
                      {user?.skillsWant?.length > 0 ? (
                        createRandomPattern(user.skillsWant).map((row, rowIndex) => (
                          <div key={rowIndex} className="flex gap-2 justify-center flex-wrap">
                            {row.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#264653] text-white rounded-full text-xs sm:text-sm font-medium shadow-sm"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 italic text-sm">No skills wanted</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>



              {/* Right Half - Sticky */}
              <div className="profile-gradient w-full lg:w-1/2 lg:sticky lg:top-0 lg:min-h-screen lg:h-screen border-gray-200 flex flex-col pt-5 lg:pt-6 pr-4 pb-6 sm:pt-5 sm:pr-6 sm:pb-8 lg:pr-8 lg:pb-8 text-white">
                {/* Name Section - 40% height - Only visible on desktop */}
                <div className="hidden lg:flex flex-col justify-center items-center text-center" style={{ height: '40%' }}>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    {firstName}
                  </h1>
                  {lastName && (
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                      {lastName}
                    </h2>
                  )}
                </div>

                {/* Gap - 1.33% - Only on desktop */}
                <div className="hidden lg:block" style={{ height: '1.33%' }}></div>

                {/* Swap Section - 28% height on desktop, adjusted height on mobile */}
                <div className="flex flex-col justify-center items-center text-center rounded-tr-[20px] rounded-br-[20px] lg:rounded-tr-[30px] lg:rounded-br-[30px] border-l-0 border-1 border-white mb-4 lg:mb-0" style={{
                  background: 'linear-gradient(to right, rgba(255,248,248,0.2) 0%, rgba(233,196,106,0.2) 15%)',
                  height: window.innerWidth >= 1024 ? '28%' : 'auto',
                  padding: window.innerWidth >= 1024 ? '0' : '1.5rem 0'
                }}>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-2">
                    Swaps Done
                  </h3>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#264653]">
                    {user?.swapCount || 0}
                  </div>
                </div>

                {/* Gap - 1.33% - Only on desktop */}
               <div className="hidden lg:block" style={{ height: '3%' }}></div>

                {/* Buttons Section - 28% height on desktop, auto height on mobile */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-10 px-4" style={{
                  height: window.innerWidth >= 1024 ? '28%' : 'auto',
                  paddingTop: window.innerWidth >= 1024 ? '0' : '1rem',
                  marginTop:window.innerWidth>=1024 ? '0.75rem':'0'
                }}>
                  <button className="w-full sm:w-auto px-6 py-3 bg-[#E76F51] text-white rounded-full text-sm font-medium shadow-sm hover:bg-[#1e3a3f] transition-colors">
                    Start Chat
                  </button>
                  <button
                    onClick={handleRequestSwap}
                    className="w-full sm:w-auto px-6 py-3 bg-[#264653] text-white rounded-full text-sm font-medium shadow-sm hover:bg-[#d85a3c] transition-colors"
                  >
                    Request Swap
                  </button>

                </div>

                {/* Gap - 1.33% - Only on desktop */}
                <div className="hidden lg:block" style={{ height: '1.33%' }}></div>
              </div>


            </div>
          </div>
        </section>
      </main>

      {/* SwapRequest Modal */}
      {showSwapRequest && (
        <SwapRequest
          userId={user?._id}
          userName={user?.name}
          imageUrl={user?.imageUrl}
          availability={user?.availability || []}
          skillsTheyOffer={user?.skillsHave || []}
          skillsTheyWant={user?.skillsWant || []}
          onClose={() => setShowSwapRequest(false)}
        />
      )}
    </div>
  );
}