import React, { useState } from 'react';
import ImageUploader from "./ImageUploader";
import SkillSearch from './SkillSelection';

export default function ProfileUploadPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');


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
      <div className="w-1/2 bg-white border-l border-gray-200">
        {/* This div is intentionally left empty as requested */}
         <div className="flex-1 flex flex-col justify-start">
          <div className="w-full max-w-md mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Profile Information
            </h2>
            
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Bio Field */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}