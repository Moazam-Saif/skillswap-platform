import React, { useRef } from "react";
import { Plus } from "lucide-react";

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
    <div className="relative flex items-center justify-center sm:w-56 sm:h-56 md:w-[250px] md:h-[250px]">
      <img
        src={image || "/defaultImage.png"}
        alt="Profile"
        className="w-full h-full object-cover rounded-full aspect-square"
      />
      <button
        type="button"
        onClick={handleClick}
        className="absolute inset-0 m-auto bg-gray-400 text-white rounded-full p-1 shadow hover:bg-blue-600 transition-colors flex items-center justify-center"
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
  );
};

export default ImageUploader;