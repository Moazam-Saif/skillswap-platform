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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Half */}
      <div className="w-1/2 p-8 flex flex-col gap-10">
        {/* Upper Half - Image Uploader */}
        <div className='h-1/2 mx-auto'>
          <ImageUploader image={imagePreview} onChange={handleImageChange} />
        </div>
        
        <SkillSearch/>
        {/* Lower Half - Form Fields */}
      </div>

      {/* Right Half - Empty Div */}
      <div className="w-1/2 h-screen border-gray-200" style={{
        background: 'linear-gradient(to right, #FFF8F8 0%, #E76F51 15%)',
        opacity: 0.8, // Total opacity of 80%
     // Example width
       // Example height
        // Add any other styles you need for your div
      }}>
        {/* This div is intentionally left empty as requested */}
        <UserInfo/>
      </div>
    </div>
  );
}