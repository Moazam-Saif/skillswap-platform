import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import Nav from './Nav';
import { AuthContext } from '@/context/AuthContext';
import { getUser } from '../api/auth';

export default function UserProfileView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useParams();
  const { accessToken } = useContext(AuthContext);

  // Dummy data for testing
  const dummyUser = {
    _id: "64a7b8c9d12345678901234",
    name: "John Doe",
    imageUrl: "/userImage.png",
    bio: "Passionate developer and designer with 5+ years of experience. Love learning new technologies and sharing knowledge with others.",
    contact: "+1-555-0123",
    swapCount: 12, // Added swap count for testing
    skillsHave: [
      { name: "JavaScript", id: "js001", category: "Programming" },
      { name: "React", id: "react001", category: "Frontend" },
      { name: "Node.js", id: "node001", category: "Backend" },
      { name: "MongoDB", id: "mongo001", category: "Database" },
      { name: "CSS", id: "css001", category: "Frontend" },
      { name: "HTML", id: "html001", category: "Frontend" },
      { name: "Express.js", id: "express001", category: "Backend" },
      { name: "Git", id: "git001", category: "Tools" }
    ],
    skillsWant: [
      { name: "Python", id: "py001", category: "Programming" },
      { name: "Machine Learning", id: "ml001", category: "AI/ML" },
      { name: "Docker", id: "docker001", category: "DevOps" },
      { name: "AWS", id: "aws001", category: "Cloud" },
      { name: "TypeScript", id: "ts001", category: "Programming" },
      { name: "GraphQL", id: "graphql001", category: "API" }
    ]
  };

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

  useEffect(() => {
    // For testing, use dummy data without any backend call
    setTimeout(() => {
      setUser(dummyUser);
      setLoading(false);
    }, 1000); // Simulate loading time
    
    // Uncomment below when ready to use real API
    // const fetchUser = async () => {
    //   try {
    //     const userData = await getUser(userId, accessToken);
    //     setUser(userData);
    //   } catch (err) {
    //     setError("Failed to fetch user profile.");
    //     console.error("Failed to fetch user:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchUser();
  }, [userId, accessToken]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <Nav />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500 text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        <Nav />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  const { firstName, lastName } = splitName(user?.name);

  return (
    <div className="flex flex-col min-h-screen w-full" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      <Nav />
      <div className="flex-1 bg-gray-50 flex">
        {/* Left Half - Scrollable */}
        <div className="w-1/2 p-8 flex flex-col gap-10 bg-[#fff8f8] overflow-y-auto">
          {/* Upper Half - User Image with Frame */}
          <div className='relative h-1/2 w-full mx-auto border-b-1 border-[#264653] p-[5px]'>
            <div className="flex items-center justify-center h-full">
              <div className="relative flex items-center justify-center sm:w-64 sm:h-64 md:w-[210px] md:h-[210px] mx-auto" style={{
                backgroundImage: `url(/circleFrame.png)`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain"
              }}>
                <div className="relative flex items-center justify-center sm:w-56 sm:h-56 md:w-[180px] md:h-[180px] mx-auto">
                  <img 
                    src={user?.imageUrl || "/userImage.png"} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lower Half - Skills Sections */}
          <div className="flex flex-col gap-8">
            {/* Skills Have Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-[#264653] text-center">Skills They Have</h3>
              <div className="flex flex-col gap-2 items-center">
                {user?.skillsHave?.length > 0 ? (
                  createRandomPattern(user.skillsHave).map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 justify-center">
                      {row.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-4 py-2 bg-[#E76F51] text-white rounded-full text-sm font-medium shadow-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Skills Want Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-[#264653] text-center">Skills They Want</h3>
              <div className="flex flex-col gap-2 items-center">
                {user?.skillsWant?.length > 0 ? (
                  createRandomPattern(user.skillsWant).map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 justify-center">
                      {row.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-4 py-2 bg-[#264653] text-white rounded-full text-sm font-medium shadow-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No skills wanted</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Half - Sticky */}
        <div className="w-1/2 sticky top-0 h-screen border-gray-200 flex flex-col pt-8 pr-8 pb-8 text-white" style={{
          background: 'linear-gradient(to right, rgba(255,248,248,0.8) 0%, rgba(231,111,81,0.8) 15%)'
          
        }}>
          {/* Name Section - 40% height */}
          <div className="flex flex-col justify-center items-center text-center" style={{ height: '40%' }}>
            <h1 className="text-5xl font-bold mb-2">
              {firstName}
            </h1>
            {lastName && (
              <h2 className="text-3xl font-semibold ">
                {lastName}
              </h2>
            )}
          </div>

          {/* Gap - 1.33% */}
          <div style={{ height: '1.33%' }}></div>

          {/* Swap Section - 28% height */}
          <div className="flex flex-col justify-center items-center text-center rounded-tr-[30px] rounded-br-[30px] border-l-0 border-1 border-white" style={{
                        background: 'linear-gradient(to right, rgba(255,248,248,0.2) 0%, rgba(233,196,106,0.2) 15%)',
                        height: '28%'
                    }}>
            <h3 className="text-3xl font-semibold mb-2">
              Swaps Done
            </h3>
            <div className="text-4xl font-bold text-[#264653]">
              {user?.swapCount || 0}
            </div>
          </div>

          {/* Gap - 1.33% */}
          <div style={{ height: '1.33%' }}></div>

          {/* Buttons Section - 28% height */}
          <div className="flex flex-col gap-4 justify-center" style={{ height: '28%' }}>
            <button className="bg-[#264653] text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#1e3a3f] transition-colors shadow-lg">
              Request Swap
            </button>
            <button className="bg-[#E76F51] text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-[#d85a3c] transition-colors shadow-lg">
              Start Chat
            </button>
          </div>

          {/* Gap - 1.33% */}
          <div style={{ height: '1.33%' }}></div>
        </div>
      </div>
    </div>
  );
}