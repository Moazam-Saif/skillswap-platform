import SearchBar from "./SearchBar";
import Logo from "./Logo";
import UserProfile from "./UserProfile";

export default function Nav() {
    return (
        <nav className="w-full bg-[#FFFAFA] bg-opacity-90 p-4 flex items-center justify-between relative sticky top-0 z-1000 backdrop-blur-sm">
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