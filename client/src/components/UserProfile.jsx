import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { AuthContext } from "../context/AuthContext";
import { getUserImage } from "../api/auth";

export default function UserProfile() {
    const { userId } = useContext(AuthContext); // Only need userId now
    const navigate = useNavigate();
    const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileOpen);
    const [profileImage, setProfileImage] = useState("/userImage.png");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserImage = async () => {
            if (!userId) return;
            
            setLoading(true);
            try {
                const { imageUrl } = await getUserImage(userId);
                setProfileImage(imageUrl || "/userImage.png");
            } catch (err) {
                console.error('Failed to fetch user image:', err);
                setProfileImage("/userImage.png"); // Fallback on error
            } finally {
                setLoading(false);
            }
        };

        fetchUserImage();
    }, [userId]);

    if (!userId) return null;

    // Determine border color based on sidebar state
    const borderColor = isMobileSidebarOpen ? 'border-[#e76f51]' : 'border-[#264653]';
    const hoverBorderColor = isMobileSidebarOpen ? 'hover:border-[#d65d42]' : 'hover:border-[#d65d42]';

    return (
        <div className="flex items-center">
            {loading ? (
                <div className="w-[40px] h-[40px] rounded-full bg-gray-300 animate-pulse border-2 border-gray-200"></div>
            ) : (
                <img 
                    src={profileImage} 
                    alt="Profile" 
                    className={`w-[40px] h-[40px] rounded-full object-cover border-2 ${borderColor} ${hoverBorderColor} cursor-pointer transition-colors`}
                    onClick={() => navigate(`/profile/${userId}`)}
                    onError={(e) => {
                        console.log('Image load error, using fallback');
                        e.target.src = "/userImage.png";
                    }}
                />
            )}
        </div>
    );
}