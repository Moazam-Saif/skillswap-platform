// Upload function using your preset
export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'skillswap-users'); // Your preset name
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Generate optimized image URLs (matches your transformation settings)
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured');
    return publicId;
  }

  const {
    width = 400,
    height = 400,
    crop = 'fill', // matches c_fill in your preset
    quality = 'auto', // matches g_auto
    format = 'auto' // matches f_auto
  } = options;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_${crop},g_auto,h_${height},w_${width},q_${quality},f_${format}/${publicId}`;
};