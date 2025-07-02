import { useState, useRef, useEffect } from 'react';

export default function SearchResultCard({ user }) {
    const [canScrollLeftHave, setCanScrollLeftHave] = useState(false);
    const [canScrollRightHave, setCanScrollRightHave] = useState(false);
    const [canScrollLeftWant, setCanScrollLeftWant] = useState(false);
    const [canScrollRightWant, setCanScrollRightWant] = useState(false);
    const skillsHaveRef = useRef(null);
    const skillsWantRef = useRef(null);

    // Process real user data
    const userData = {
        firstName: user?.name?.split(' ')[0] || "User",
        lastName: user?.name?.split(' ').slice(1).join(' ') || "",
        imageUrl: user?.imageUrl || "/userImage.png",
        skillsHave: user?.skillsHave || [],
        skillsWant: user?.skillsWant || []
    };

    // Check scroll positions and overflow
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

    // Handle carousel scroll
    const handleScroll = (container, direction) => {
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

    // Check all scroll positions
    const checkAllScrollPositions = () => {
        checkScrollPosition(skillsHaveRef.current, setCanScrollLeftHave, setCanScrollRightHave);
        checkScrollPosition(skillsWantRef.current, setCanScrollLeftWant, setCanScrollRightWant);
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
        <div className="bg-[#e76f51] text-white rounded-[50px] shadow-sm hover:shadow-md transition-shadow h-[155px] w-full overflow-hidden" style={{fontFamily: "'Josefin Sans', sans-serif"}}>
            {/* Top Section - 30% height */}
            <div className="h-[30%] border-b-2 border-white flex items-center">
                {/* First Name - 45% width */}
                <div className="w-[45%] px-4 flex justify-center">
                    <span className="font-semibold text-lg truncate">
                        {userData.firstName}
                    </span>
                </div>
                
                {/* User Image - 10% width */}
                <div className="w-[10%] flex justify-center">
                    <img 
                        src={userData.imageUrl} 
                        alt="user" 
                        className="w-10 h-10 rounded-full object-cover" 
                    />
                </div>
                
                {/* Last Name - 45% width */}
                <div className="w-[45%] px-4 flex justify-center">
                    <span className="font-semibold text-lg truncate">
                        {userData.lastName}
                    </span>
                </div>
            </div>

            {/* Skills Have Section - 35% height */}
            <div className="h-[35%] flex items-center px-4">
                {/* Label - 20% width */}
                <div className="w-[20%] text-center">
                    <span className="text-sm font-medium">Skills Have:</span>
                </div>
                
                {/* Carousel Container - 80% width */}
                <div className="w-[80%] flex items-center relative">
                    {/* Left Arrow */}
                    {canScrollLeftHave && (
                        <button
                            onClick={() => handleScroll(skillsHaveRef.current, 'left')}
                            className="absolute left-0 z-10 w-6 h-6 flex items-center justify-center rounded-full text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            ←
                        </button>
                    )}
                    
                    {/* Skills Carousel */}
                    <div 
                        ref={skillsHaveRef}
                        className="overflow-x-hidden overflow-y-hidden w-full px-6"
                        onScroll={() => checkScrollPosition(skillsHaveRef.current, setCanScrollLeftHave, setCanScrollRightHave)}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex gap-2 py-1">
                            {userData.skillsHave.length > 0 ? (
                                userData.skillsHave.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-[#f4a261] text-[#264653] rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 shadow-sm"
                                    >
                                        {skill.name || skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-white/70 italic">No skills listed</span>
                            )}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    {canScrollRightHave && (
                        <button
                            onClick={() => handleScroll(skillsHaveRef.current, 'right')}
                            className="absolute right-0 z-10 w-6 h-6 flex items-center justify-center rounded-full text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            →
                        </button>
                    )}
                </div>
            </div>

            {/* Skills Want Section - 35% height */}
            <div className="h-[35%] flex items-center px-4">
                {/* Label - 20% width */}
                <div className="w-[20%] text-center">
                    <span className="text-sm font-medium">Skills Want:</span>
                </div>
                
                {/* Carousel Container - 80% width */}
                <div className="w-[80%] flex items-center relative">
                    {/* Left Arrow */}
                    {canScrollLeftWant && (
                        <button
                            onClick={() => handleScroll(skillsWantRef.current, 'left')}
                            className="absolute left-0 z-10 w-6 h-6 flex items-center justify-center rounded-full text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
                        >
                            ←
                        </button>
                    )}
                    
                    {/* Skills Carousel */}
                    <div 
                        ref={skillsWantRef}
                        className="overflow-x-hidden overflow-y-hidden w-full px-6"
                        onScroll={() => checkScrollPosition(skillsWantRef.current, setCanScrollLeftWant, setCanScrollRightWant)}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div className="flex gap-2 py-1">
                            {userData.skillsWant.length > 0 ? (
                                userData.skillsWant.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-[#e9c46a] text-[#264653] rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 shadow-sm"
                                    >
                                        {skill.name || skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-white/70 italic">No skills wanted</span>
                            )}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    {canScrollRightWant && (
                        <button
                            onClick={() => handleScroll(skillsWantRef.current, 'right')}
                            className="absolute right-0 z-10 w-6 h-6 flex items-center justify-center rounded-full text-sm bg-white/20 hover:bg-white/40 transition-all flex-shrink-0 shadow-sm"
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