import SearchBar from "./SearchBar";
import Logo from "./Logo";
import UserProfile from "./UserProfile";
import { useSelector } from 'react-redux';

export default function Nav() {
    const isMobileSidebarOpen = useSelector((state) => state.sidebar.isMobileOpen);
    
    // Determine navbar background color
    const navBgColor = isMobileSidebarOpen ? 'bg-[#264653]' : 'bg-[#FFFAFA]';
    const navOpacity = isMobileSidebarOpen ? 'bg-opacity-100' : 'bg-opacity-90';
    const navZIndex = isMobileSidebarOpen ? 'z-[1000]' : 'z-[985]';

    return (
        <nav className={`w-full ${navBgColor} ${navOpacity} ${navZIndex} p-4 flex items-center justify-between relative sticky top-0 backdrop-blur-sm transition-colors duration-300`}>
            {/* Left Side - Search Bar (Hidden on mobile, visible on desktop) */}
            <div className="hidden md:block">
                <SearchBar />
            </div>
            
            {/* Empty div for mobile to maintain layout */}
            <div className="md:hidden"></div>

            {/* Center - Logo */}
            <Logo />

            {/* Right Side - User Profile */}
            <UserProfile />
        </nav>
    );
}