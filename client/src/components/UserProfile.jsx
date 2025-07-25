import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
    const { userId, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileOpen);

    if (!userId) return null;

    // Determine border color based on sidebar state
    const borderColor = isMobileSidebarOpen ? 'border-[#e76f51]' : 'border-[#264653]';
    const hoverBorderColor = isMobileSidebarOpen ? 'hover:border-[#d65d42]' : 'hover:border-[#d65d42]';

    return (
        <div className="flex items-center">
            <img 
                src={user?.imageUrl || "/userImage.png"} 
                alt="Profile" 
                className={`w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] rounded-full object-cover border-2 ${borderColor} ${hoverBorderColor} cursor-pointer transition-colors`}
                onClick={() => navigate(`/profile/${userId}`)}
            />
        </div>
    );
}