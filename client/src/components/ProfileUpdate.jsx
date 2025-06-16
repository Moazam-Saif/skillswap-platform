import React, { useState } from 'react';
import ImageUploader from "./ImageUploader";
import SkillSearch from './SkillSelection';
import UserInfo from './Info';

export default function ProfileUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);



  const handleImageChange = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="h-full min-h-screen bg-gray-50 flex"style={{fontFamily: "'Josefin Sans', sans-serif" }}>
      {/* Left Half */}
      <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[12%] flex flex-col justify-between'>
        <span className='bg-[#E76F51] text-transparent relative px-3 py-2 rounded-full font-medium'>Set Availability</span>
        <span className=' bg-[#E76F51] text-transparent font-medium relative px-3 py-2  rounded-full'>Save Details</span>
      </div>
      <div className='z-50 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[12%] flex flex-col justify-between bg-transparent'>
        <button className='bg-transparent text-[#264653] relative px-3 py-2 rounded-full font-medium'>Set Availability</button>
        <button className=' bg-transparent text-[#264653] font-medium relative px-3 py-2  rounded-full'>Save Details</button>
      </div>
      <div className="w-1/2 p-8 flex flex-col gap-10 bg-[#fff8f8] ">
        {/* Upper Half - Image Uploader */}
        <div className='relative h-1/2 w-full mx-auto border-b-1 border-black'>
          <ImageUploader image={imagePreview} onChange={handleImageChange}/>
        </div>
        
        <SkillSearch/>
        {/* Lower Half - Form Fields */}
      </div>

      {/* Right Half - Empty Div */}
      <div className="w-1/2 min-h-screen border-gray-200" style={{
        background: 'linear-gradient(to right, #FFF8F8 0%, #E76F51 15%)',
        opacity: 0.8,
      }}>
        {/* This div is intentionally left empty as requested */}
        <UserInfo/>
      </div>
    </div>
  );
}