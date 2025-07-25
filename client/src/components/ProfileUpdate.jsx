import React, { useState } from 'react';
import ImageUploader from "./ImageUploader";
import SkillSearch from './SkillSelection';
import UserInfo from './Info';
import Nav from './Nav';
import Sidebar from './Sidebar';
import WeekBar from './WeekBar';
import { useDispatch, useSelector } from 'react-redux';
import { openPopup, closePopup } from '../store/popupSlice';
import { useParams } from "react-router-dom";
import { getUser } from '../api/auth';
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { updateUser } from '../api/auth';

export default function ProfileUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [timeSlots, setTimeSlots] = useState({});
  const [userName, setUserName] = useState('');
  const [bio, setBio] = useState('');
  const [contact, setContact] = useState('');
  const [skillsWant, setSkillsWant] = useState([]);
  const [skillsHave, setSkillsHave] = useState([]);
  const [activeSkillType, setActiveSkillType] = useState("want");
  const { userId } = useParams();
  const { accessToken } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(accessToken);
        const user = await getUser(userId, accessToken);
        if (user.imageUrl && user.imageUrl !== "") setImagePreview(user.imageUrl);
        if (user.name) setUserName(user.name);
        if (user.bio) setBio(user.bio);
        if (user.contact) setContact(user.contact);
        if (user.availability) {
          setTimeSlots(convertAvailabilityToTimeSlots(user.availability));
        }
        if (user.skillsWant) setSkillsWant(user.skillsWant);
        if (user.skillsHave) setSkillsHave(user.skillsHave);
      } catch (err) {
        setError("Failed to fetch user profile.");
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [userId, accessToken]);

  const dispatch = useDispatch();
  const isPopupOpen = useSelector(state => state.popup.isPopupOpen);

  function convertTimeSlotsToAvailability(timeSlots) {
    const availability = [];
    for (const [day, slots] of Object.entries(timeSlots)) {
      if (Array.isArray(slots)) {
        slots.forEach(slot => {
          availability.push({
            day,
            startTime: slot.start,
            endTime: slot.end
          });
        });
      }
    }
    return availability;
  }

  function convertAvailabilityToTimeSlots(availabilityArray) {
    const timeSlots = {};
    if (!Array.isArray(availabilityArray)) return timeSlots;
    for (const slot of availabilityArray) {
      if (!slot.day || !slot.startTime || !slot.endTime) continue;
      if (!timeSlots[slot.day]) timeSlots[slot.day] = [];
      timeSlots[slot.day].push({ start: slot.startTime, end: slot.endTime });
    }
    return timeSlots;
  }

  const handleSave = async () => {
    const availability = convertTimeSlotsToAvailability(timeSlots);

    const payload = {
      name: userName,
      bio,
      contact,
      imageUrl: imagePreview,
      skillsHave,
      skillsWant,
      availability,
    };

    try {
      await updateUser(userId, payload, accessToken);
      setError("");
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
      console.error("Failed to update profile:", err);
    }
  };

  const handleImageChange = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleButtonClick = () => {
    dispatch(openPopup());
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      <Nav />
      <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
        {/* Sidebar - Same pattern as Dashboard and SessionsPage */}
        <Sidebar hideOnDesktop={true}/>
        
           <section className="w-full flex-1 overflow-y-auto bg-gray-50">
          {/* Add top padding on mobile to account for burger menu */}
          <div className="pt-16 md:pt-0">
            {/* Large Screen Layout - Horizontal Split */}
            <div className="hidden lg:flex h-full bg-gray-50">
              {/* Error Message */}
              {error && (
                <div className="w-full absolute top-0 z-10 text-center py-2 bg-red-100 text-red-700 font-semibold rounded mb-4">
                  {error}
                </div>
              )}
              
              {/* Floating Buttons */}
              <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[12%] flex flex-col justify-between'>
                <span className='bg-[#E76F51] text-transparent relative px-3 py-2 rounded-full font-medium'>Set Availability</span>
                <span className=' bg-[#E76F51] text-transparent font-medium relative px-3 py-2  rounded-full'>Save Details</span>
              </div>
              <div className='z-20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[12%] flex flex-col justify-between bg-transparent'>
                <button onClick={handleButtonClick} className='bg-transparent text-[#264653] relative px-3 py-2 rounded-full font-medium shadow-md'>Set Availability</button>
                <button onClick={handleSave} className=' bg-transparent text-[#264653] font-medium relative px-3 py-2  rounded-full shadow-md'>Save Details</button>
              </div>
              
              {/* Popup */}
              {isPopupOpen && (
                <div className='backdrop-blur-lg z-50 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[80%] w-[50%] bg-[rgb(38,70,83,0.6)] rounded-2xl'>
                  <WeekBar timeSlots={timeSlots} setTimeSlots={setTimeSlots} />
                </div>
              )}
              
              {/* Left Half - Image and Skills */}
              <div className="w-1/2 p-8 flex flex-col gap-10 bg-[#fff8f8] overflow-y-auto">
                <div className='relative h-1/2 w-full mx-auto border-b-1 border-black'>
                  <ImageUploader image={imagePreview} onChange={handleImageChange} />
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex justify-center mb-2">
                    <div className="inline-flex w-80 rounded-full bg-gray-200 overflow-hidden">
                      <button
                        className={`flex-1 px-4 py-2 font-semibold transition-colors focus:outline-none ${activeSkillType === "want"
                          ? "bg-[#264653] text-white"
                          : "bg-gray-200 text-black"
                          } rounded-l-full`}
                        onClick={() => setActiveSkillType("want")}
                        type="button"
                      >
                        Skills You Want
                      </button>
                      <button
                        className={`flex-1 px-4 py-2 font-semibold transition-colors focus:outline-none ${activeSkillType === "have"
                          ? "bg-[#E76F51] text-white"
                          : "bg-gray-200 text-black"
                          } rounded-r-full`}
                        onClick={() => setActiveSkillType("have")}
                        type="button"
                      >
                        Skills You Got
                      </button>
                    </div>
                  </div>

                  <SkillSearch
                    selectedSkills={activeSkillType === "want" ? skillsWant : skillsHave}
                    setSelectedSkills={activeSkillType === "want" ? setSkillsWant : setSkillsHave}
                  />
                </div>
              </div>

              {/* Right Half - UserInfo */}
              <div className="w-1/2 h-screen border-gray-200 sticky top-0" style={{
                 background: 'linear-gradient(to right, #FFF8F8 0%, #E76F51 15%)',
                opacity: 0.9,
              }}>
                <UserInfo
                  name={userName}
                  setName={setUserName}
                  bio={bio}
                  setBio={setBio}
                  contact={contact}
                  setContact={setContact}
                />
              </div>
            </div>

            {/* Small/Medium Screen Layout - Vertical Stack */}
            <div className="lg:hidden bg-gray-50">
              {/* Error Message */}
              {error && (
                <div className="w-full text-center py-2 bg-red-100 text-red-700 font-semibold rounded mb-4 mx-4">
                  {error}
                </div>
              )}

              {/* Popup for Mobile */}
              {isPopupOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg p-4'>
                  <div className='w-full max-w-4xl h-[80vh] bg-[rgb(38,70,83,0.9)] rounded-2xl overflow-hidden'>
                    <WeekBar timeSlots={timeSlots} setTimeSlots={setTimeSlots} />
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                {/* Section 1: Image Uploader */}
                <div className="bg-[#fff8f8] p-4 md:p-6">
                  <div className='relative h-auto w-full mx-auto border-b-1 border-black pb-4'>
                    <ImageUploader image={imagePreview} onChange={handleImageChange} />
                  </div>
                </div>

                {/* Section 2: Skills + Availability Button */}
                <div className="bg-[#fff8f8] p-4 md:p-6">
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-center mb-2">
                      <div className="inline-flex w-full max-w-sm rounded-full bg-gray-200 overflow-hidden">
                        <button
                          className={`flex-1 px-3 md:px-4 py-2 text-sm md:text-base font-semibold transition-colors focus:outline-none ${activeSkillType === "want"
                            ? "bg-[#264653] text-white"
                            : "bg-gray-200 text-black"
                            } rounded-l-full`}
                          onClick={() => setActiveSkillType("want")}
                          type="button"
                        >
                          Skills You Want
                        </button>
                        <button
                          className={`flex-1 px-3 md:px-4 py-2 text-sm md:text-base font-semibold transition-colors focus:outline-none ${activeSkillType === "have"
                            ? "bg-[#E76F51] text-white"
                            : "bg-gray-200 text-black"
                            } rounded-r-full`}
                          onClick={() => setActiveSkillType("have")}
                          type="button"
                        >
                          Skills You Got
                        </button>
                      </div>
                    </div>

                    <SkillSearch
                      selectedSkills={activeSkillType === "want" ? skillsWant : skillsHave}
                      setSelectedSkills={activeSkillType === "want" ? setSkillsWant : setSkillsHave}
                    />

                    {/* Availability Button integrated here */}
                    <div className="text-center mt-6">
                      <button 
                        onClick={handleButtonClick} 
                        className="w-full max-w-sm bg-[#E76F51] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#d45d47] transition-colors"
                      >
                        Set Availability
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: User Info + Save Button */}
                <div className="pt-4" style={{
                   background: 'linear-gradient(to bottom, rgba(255, 248, 248, 1) 0%, rgba(231, 111, 81, 0.9) 5%)',
                  }}>
                  <div className="p-4 md:p-6">
                    <UserInfo
                      name={userName}
                      setName={setUserName}
                      bio={bio}
                      setBio={setBio}
                      contact={contact}
                      setContact={setContact}
                    />

                    {/* Save Button integrated here */}
                    <div className="text-center mt-6">
                      <button 
                        onClick={handleSave} 
                        className="w-full max-w-sm bg-[#264653] text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-[#1e4a4f] transition-colors"
                      >
                        Save Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}