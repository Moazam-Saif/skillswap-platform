import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
    const { userId, user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!userId) return null;

    return (
        <div className="flex items-center">
            <img 
                src={user?.imageUrl || "/userImage.png"} 
                alt="Profile" 
                className="w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] rounded-full object-cover border-2 border-[#264653] cursor-pointer hover:border-[#d65d42] transition-colors"
                onClick={() => navigate(`/profile/${userId}`)}
            />
        </div>
    );
}