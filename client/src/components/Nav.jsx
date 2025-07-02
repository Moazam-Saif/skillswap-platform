
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import UserProfile from "./UserProfile";

export default function Nav() {
    return (
        <nav className="w-full bg-[#FFFAFA] p-4 flex items-center justify-between relative">
            {/* Left Side - Search Bar */}
            <SearchBar />

            {/* Center - Logo */}
            <Logo />

            {/* Right Side - User Profile */}
            <UserProfile />
        </nav>
    );
}