import React, { useState } from 'react';
import ImageUploader from "./ImageUploader";
import SkillSearch from './SkillSelection';
import UserInfo from './Info';
import Nav from './Nav';
import WeekBar from './WeekBar';
import { useDispatch, useSelector } from 'react-redux';
import { openPopup, closePopup } from '../store/popupSlice';
import { useParams } from "react-router-dom";
import { getUser } from '../api/auth';
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(accessToken);
        const user = await getUser(userId, accessToken);
        if (user.imageUrl && user.imageUrl !== "") setImagePreview(user.imageUrl);
        if (user.name) setUserName(user.name);
        if (user.bio) setBio(user.bio);
        if (user.contact) setContact(user.contact);
        if (user.availability) setTimeSlots(user.availability);
      if (user.skillsWant) setSkillsWant(user.skillsWant);
      if (user.skillsHave) setSkillsHave(user.skillsHave);
      } catch (err) {
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

  const handleSave = () => {
    const availability = convertTimeSlotsToAvailability(timeSlots);
    console.log({
      availability,
      skills: selectedSkills,
      // ...other fields...
    });
    // Now send { ...otherUserFields, availability } to your backend
  };

  const handleImageChange = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };


  const handleButtonClick = () => {
    dispatch(openPopup());
  };

  return (
    <>
      <Nav />
      <div className="h-full bg-gray-50 flex" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
        {/* Left Half */}
        <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[12%] flex flex-col justify-between'>
          <span className='bg-[#E76F51] text-transparent relative px-3 py-2 rounded-full font-medium'>Set Availability</span>
          <span className=' bg-[#E76F51] text-transparent font-medium relative px-3 py-2  rounded-full'>Save Details</span>
        </div>
        <div className='z-20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[12%] flex flex-col justify-between bg-transparent'>
          <button onClick={handleButtonClick} className='bg-transparent text-[#264653] relative px-3 py-2 rounded-full font-medium shadow-md'>Set Availability</button>
          <button onClick={handleSave} className=' bg-transparent text-[#264653] font-medium relative px-3 py-2  rounded-full shadow-md'>Save Details</button>
        </div>
        {isPopupOpen && (
          <div className='backdrop-blur-lg z-50 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[80%] w-[50%] bg-[rgb(38,70,83,0.6)] rounded-2xl'>
            <WeekBar timeSlots={timeSlots} setTimeSlots={setTimeSlots} />
          </div>
        )}
        <div className="w-1/2 p-8 flex flex-col gap-10 bg-[#fff8f8] ">
          {/* Upper Half - Image Uploader */}
          <div className='relative h-1/2 w-full mx-auto border-b-1 border-black'>
            <ImageUploader image={imagePreview} onChange={handleImageChange} />
          </div>

           <div className="flex flex-col gap-4">
        <div className="flex justify-center gap-4 mb-2">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              activeSkillType === "want"
                ? "bg-[#e76f51] text-white"
                : "bg-gray-200 text-[#264653]"
            }`}
            onClick={() => setActiveSkillType("want")}
            type="button"
          >
            Skills I Want
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              activeSkillType === "have"
                ? "bg-[#e76f51] text-white"
                : "bg-gray-200 text-[#264653]"
            }`}
            onClick={() => setActiveSkillType("have")}
            type="button"
          >
            Skills I Have
          </button>
        </div>

        <SkillSearch
          selectedSkills={activeSkillType === "want" ? skillsWant : skillsHave}
          setSelectedSkills={activeSkillType === "want" ? setSkillsWant : setSkillsHave}
        />
      </div>
          {/* Lower Half - Form Fields */}
        </div>

        {/* Right Half - Empty Div */}
        <div className="w-1/2 min-h-screen border-gray-200" style={{
          background: 'linear-gradient(to right, #FFF8F8 0%, #E76F51 15%)',
          opacity: 0.8,
        }}>
          {/* This div is intentionally left empty as requested */}
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
    </>
  );
}