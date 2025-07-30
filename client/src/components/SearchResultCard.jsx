import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchResultCard({ user }) {
    const [canScrollLeftHave, setCanScrollLeftHave] = useState(false);
    const [canScrollRightHave, setCanScrollRightHave] = useState(false);
    const [canScrollLeftWant, setCanScrollLeftWant] = useState(false);
    const [canScrollRightWant, setCanScrollRightWant] = useState(false);
    const skillsHaveRef = useRef(null);
    const skillsWantRef = useRef(null);
    const navigate = useNavigate();

    // Process real user data
    const userData = {
        firstName: user?.name?.split(' ')[0] || "User",
        lastName: user?.name?.split(' ').slice(1).join(' ') || "",
        imageUrl: user?.imageUrl || "/userImage.png",
        skillsHave: user?.skillsHave || [],
        skillsWant: user?.skillsWant || [],
        userId: user?._id
    };

    // Handle card click to navigate to profile
    const handleCardClick = () => {
        if (userData.userId) {
            navigate(`/users/profile/show/${userData.userId}`);
        }
    };

    // Debug: Still keep a simple log to see what we're getting
    useEffect(() => {
        console.log('User:', userData.firstName, userData.lastName);
        console.log('Skills Have:', userData.skillsHave);
        console.log('Skills Want:', userData.skillsWant);
    }, [user]);

    // Check scroll positions and overflow (only for desktop)
    const checkScrollPosition = (container, setCanLeft, setCanRight) => {
        if (container) {
            const { scrollLeft, scrollWidth, clientWidth } = container;
            const hasOverflow = scrollWidth > clientWidth;
            
            if (!hasOverflow) {
                setCanLeft(false);
                setCanRight(false);
            } else {
                setCanLeft(scrollLeft > 0);
                setCanRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        }
    };

    // Handle carousel scroll (only for desktop)
    const handleScroll = (container, direction, event) => {
        // Stop event propagation to prevent card click
        event.stopPropagation();
        
        if (container) {
            const scrollAmount = 120;
            const newScrollLeft = direction === 'left' 
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;
            
            container.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Check all scroll positions (only for desktop)
    const checkAllScrollPositions = () => {
        // Only check scroll on larger screens
        if (window.innerWidth >= 640) {
            checkScrollPosition(skillsHaveRef.current, setCanScrollLeftHave, setCanScrollRightHave);
            checkScrollPosition(skillsWantRef.current, setCanScrollLeftWant, setCanScrollRightWant);
        } else {
            // Reset scroll buttons for mobile
            setCanScrollLeftHave(false);
            setCanScrollRightHave(false);
            setCanScrollLeftWant(false);
            setCanScrollRightWant(false);
        }
    };

    // Handle resize and initial setup
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            checkAllScrollPositions();
        }, 100);

        const handleResize = () => {
            checkAllScrollPositions();
        };

        window.addEventListener('resize', handleResize);

        const resizeObserver = new ResizeObserver(() => {
            checkAllScrollPositions();
        });

        if (skillsHaveRef.current) {
            resizeObserver.observe(skillsHaveRef.current);
        }
        if (skillsWantRef.current) {
            resizeObserver.observe(skillsWantRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
    }, [userData.skillsHave, userData.skillsWant]);

    return (
        <div 
            className="bg-[#e76f51] text-white rounded-[25px] md:rounded-[35px] lg:rounded-[50px] shadow-sm hover:shadow-md transition-shadow 
                       h-auto min-h-[160px] sm:min-h-[140px] md:h-[155px] lg:h-[170px] 
                       w-[90%] sm:w-full mx-auto overflow-hidden cursor-pointer hover:shadow-lg" 
            style={{fontFamily: "'Josefin Sans', sans-serif"}}
            onClick={handleCardClick}
        >
            {/* Top Section - Fixed height on desktop, flexible on mobile */}
            <div className="h-auto sm:h-[30%] border-b-2 border-white flex items-center py-2 sm:py-0">
                {/* First Name - Responsive width and padding */}
                <div className="w-[45%] px-2 sm:px-3 md:px-4 flex justify-center">
                    <span className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl truncate">
                        {userData.firstName}
                    </span>
                </div>
                
                {/* User Image - Responsive size */}
                <div className="w-[10%] flex justify-center">
                    <img 
                        src={userData.imageUrl} 
                        alt="user" 
                        className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover" 
                    />
                </div>
                
                {/* Last Name - Responsive width and padding */}
                <div className="w-[45%] px-2 sm:px-3 md:px-4 flex justify-center">
                    <span className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl truncate">
                        {userData.lastName}
                    </span>
                </div>
            </div>

            {/* Skills Have Section - Flexible height on mobile, fixed on desktop */}
            <div className="h-auto sm:h-[35%] flex flex-col sm:flex-row sm:items-center px-2 sm:px-3 md:px-4 py-2 sm:py-0">
                {/* Label - Full width on mobile, responsive width on desktop */}
                <div className="w-full sm:w-[25%] md:w-[22%] lg:w-[20%] text-left sm:text-center mb-1 sm:mb-0">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                        <span className="hidden sm:inline">Skills Have:</span>
                        <span className="sm:hidden">Have:</span>
                    </span>
                </div>
                
                {/* Skills Container - Mobile: wrap, Desktop: scroll */}
                <div className="w-full sm:w-[75%] md:w-[78%] lg:w-[80%] flex items-center relative">
                    {/* Left Arrow - Only show on desktop */}
                    {canScrollLeftHave && (
                        <button
                            onClick={(e) => handleScroll(skillsHaveRef.current, 'left', e)}
                            className="hidden sm:flex absolute left-0 z-10 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 items-center justify-center rounded-full text-xs sm:text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            ←
                        </button>
                    )}
                    
                    {/* Skills Container */}
                    <div 
                        ref={skillsHaveRef}
                        className="w-full px-0 sm:px-3 md:px-6 
                                   overflow-visible sm:overflow-x-hidden sm:overflow-y-hidden"
                        onScroll={() => window.innerWidth >= 640 && checkScrollPosition(skillsHaveRef.current, setCanScrollLeftHave, setCanScrollRightHave)}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Mobile: Wrap, Desktop: Single row */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 py-1">
                            {userData.skillsHave.length > 0 ? (
                                userData.skillsHave.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 sm:px-3 py-1 bg-[#f4a261] text-[#264653] rounded-full text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0 shadow-sm"
                                    >
                                        {skill.name || skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] sm:text-xs text-white/70 italic">No skills listed</span>
                            )}
                        </div>
                    </div>

                    {/* Right Arrow - Only show on desktop */}
                    {canScrollRightHave && (
                        <button
                            onClick={(e) => handleScroll(skillsHaveRef.current, 'right', e)}
                            className="hidden sm:flex absolute right-0 z-10 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 items-center justify-center rounded-full text-xs sm:text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            →
                        </button>
                    )}
                </div>
            </div>

            {/* Skills Want Section - Flexible height on mobile, fixed on desktop */}
            <div className="h-auto sm:h-[35%] flex flex-col sm:flex-row sm:items-center px-2 sm:px-3 md:px-4 py-2 sm:py-0">
                {/* Label - Full width on mobile, responsive width on desktop */}
                <div className="w-full sm:w-[25%] md:w-[22%] lg:w-[20%] text-left sm:text-center mb-1 sm:mb-0">
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                        <span className="hidden sm:inline">Skills Want:</span>
                        <span className="sm:hidden">Want:</span>
                    </span>
                </div>
                
                {/* Skills Container - Mobile: wrap, Desktop: scroll */}
                <div className="w-full sm:w-[75%] md:w-[78%] lg:w-[80%] flex items-center relative">
                    {/* Left Arrow - Only show on desktop */}
                    {canScrollLeftWant && (
                        <button
                            onClick={(e) => handleScroll(skillsWantRef.current, 'left', e)}
                            className="hidden sm:flex absolute left-0 z-10 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 items-center justify-center rounded-full text-xs sm:text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            ←
                        </button>
                    )}
                    
                    {/* Skills Container */}
                    <div 
                        ref={skillsWantRef}
                        className="w-full px-0 sm:px-3 md:px-6 
                                   overflow-visible sm:overflow-x-hidden sm:overflow-y-hidden"
                        onScroll={() => window.innerWidth >= 640 && checkScrollPosition(skillsWantRef.current, setCanScrollLeftWant, setCanScrollRightWant)}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Mobile: Wrap, Desktop: Single row */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 py-1">
                            {userData.skillsWant.length > 0 ? (
                                userData.skillsWant.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 sm:px-3 py-1 bg-[#e9c46a] text-[#264653] rounded-full text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0 shadow-sm"
                                    >
                                        {skill.name || skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] sm:text-xs text-white/70 italic">No skills wanted</span>
                            )}
                        </div>
                    </div>

                    {/* Right Arrow - Only show on desktop */}
                    {canScrollRightWant && (
                        <button
                            onClick={(e) => handleScroll(skillsWantRef.current, 'right', e)}
                            className="hidden sm:flex absolute right-0 z-10 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 items-center justify-center rounded-full text-xs sm:text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            →
                        </button>
                    )}
                </div>
            </div>

            {/* Hide scrollbar styles */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}