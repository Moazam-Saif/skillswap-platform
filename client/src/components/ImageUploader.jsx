import React, { useRef } from "react";
import { Plus, User } from "lucide-react";

const ImageUploader = ({ image, onChange }) => {
  const fileInput = useRef();

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && onChange) {
      onChange(file);
    }
  };

  return (
    
    <div className="relative flex items-center justify-center sm:w-64 sm:h-64 md:w-[210px] md:h-[210px] mx-auto" style={{
        backgroundImage: `url(/circleFrame.png)`, // frame is the PNG path
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain"
      }}>
    <div className="relative flex items-center justify-center sm:w-56 sm:h-56 md:w-[180px] md:h-[180px] mx-auto"
      >
        {image ? (
        <img
          src={image}
          alt="Profile"
          className="w-full h-full object-cover rounded-full aspect-square"
        />
      ) : (
        
          <User className="text-[#264653] w-full h-full rounded-full" />
      )}
      <button
        type="button"
        onClick={handleClick}
        className="absolute inset-0 m-auto bg-white opacity-50 text-gray-400 rounded-full p-1 shadow hover:bg-blue-600 transition-colors flex items-center justify-center"
        style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}
        aria-label="Upload image"
      >
        <Plus size={18} />
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        onChange={handleChange}
        className="hidden"
      />
    </div>
    </div>
  );
};

export default ImageUploader;