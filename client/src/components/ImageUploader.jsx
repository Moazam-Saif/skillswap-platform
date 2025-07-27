import React, { useRef, useState } from "react";
import { Plus, User, Loader } from "lucide-react";
import { uploadToCloudinary } from "../utils/cloudinary";

const ImageUploader = ({ image, onChange }) => {
  const fileInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = () => {
    if (!uploading) {
      fileInput.current.click();
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Upload to Cloudinary using your preset
      const cloudinaryUrl = await uploadToCloudinary(file);
      
      // Call the onChange callback with the Cloudinary URL
      if (onChange) {
        onChange(cloudinaryUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-[210px] lg:h-[210px] mx-auto" style={{
          backgroundImage: `url(/circleFrame.png)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        }}>
        <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-[180px] lg:h-[180px] mx-auto">
          {image && image !== "" ? (
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover rounded-full aspect-square"
              onError={(e) => {
                e.target.src = "/userImage.png"; // Fallback image
              }}
            />
          ) : (
            <User className="text-[#264653] w-full h-full rounded-full" />
          )}
          
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className={`absolute inset-0 m-auto bg-white text-gray-400 rounded-full p-1 shadow transition-all flex items-center justify-center ${
              uploading 
                ? 'opacity-75 cursor-not-allowed' 
                : 'opacity-50 hover:bg-[#264653] hover:text-white'
            }`}
            style={{ width: 32, height: 32 }}
            aria-label={uploading ? "Uploading..." : "Upload image"}
          >
            {uploading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
          </button>
          
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>
      
      {/* Upload status */}
      {uploading && (
        <p className="text-sm text-black mt-2">Uploading image...</p>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;