import React, { useEffect, useState, useContext } from "react";
import { getSkillMatches, getPartialSkillMatches } from "../api/auth";
import { SwapCard } from "./SwapCard";
import { AuthContext } from "../context/AuthContext";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import { getCategorySkillMatches } from "../api/auth";
import Sidebar from "./Sidebar";

const Dashboard = () => {
    const { userId, accessToken } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);
    const [matches2, setMatches2] = useState([]);
    const [categoryMatches, setCategoryMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const [mutualMatches, partialMatches, categoryMatchesRes] = await Promise.all([
                    getSkillMatches(accessToken),
                    getPartialSkillMatches(accessToken),
                    getCategorySkillMatches(accessToken)
                ]);
                setMatches(mutualMatches);
                setMatches2(partialMatches);
                setCategoryMatches(categoryMatchesRes);
            } catch (err) {
                console.error("Failed to fetch matches:", err);
            }
        };
        fetchMatches();
    }, [accessToken]);

    // Create a Set of userIds already shown in the first two lists
    const shownUserIds = new Set([
        ...matches.map(u => u.userId),
        ...matches2.map(u => u.userId)
    ]);

    const filteredCategoryMatches = categoryMatches.filter(
        user => !shownUserIds.has(user.userId)
    );

    // Scroll handler for carousel
    const scrollContainer = (containerId, direction) => {
        const container = document.getElementById(containerId);
        if (container) {
            const scrollAmount = 200; // Adjust as needed
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
// ...existing code...

    // SwapCard container component with rounded corners option
    const SwapCardContainer = ({ users, containerId, title, hasRoundedCorners = false }) => (
        <div className="relative">
            <div className={`
                w-full bg-[#fff8f8] p-4 md:pl-8 md:pt-[20px] md:pb-[20px]
                ${hasRoundedCorners ? 'rounded-tl-[30px]' : ''}
                /* Mobile: Grid layout 2 per row */ 
                grid grid-cols-2 gap-4 auto-rows-auto justify-items-center
                /* Desktop: Horizontal scroll with max 5 visible */
                md:flex md:gap-8 md:overflow-x-auto md:h-[223px] md:scrollbar-hide
                /* Hide scrollbar */
                scrollbar-hide
            `} id={containerId}>
                {users.length === 0 ? (
                    <div className="col-span-2 md:col-span-1 text-gray-500 flex items-center justify-center py-8">
                        No matches found.
                    </div>
                ) : (
                    users.map(user => (
                        <div key={user.userId} className="flex-shrink-0">
                            <SwapCard
                                userId={user.userId}
                                name={user.name}
                                imageUrl={user.imageUrl}
                                skillsTheyOffer={user.skillsTheyOffer}
                                skillsTheyWant={user.skillsTheyWant}
                                availability={user.availability}
                            />
                        </div>
                    ))
                )}
            </div>
            
            {/* Scroll buttons for desktop - only show if more than 5 cards */}
            {users.length > 5 && (
                <>
                    <button
                        onClick={() => scrollContainer(containerId, 'left')}
                        className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#264653] rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <button
                        onClick={() => scrollContainer(containerId, 'right')}
                        className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#264653] rounded-full p-2 shadow-lg transition-all duration-200 z-10"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );

// ...existing code...

    return (
        <div className="flex flex-col h-auto" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <Nav />
            <main className="flex flex-1 md:rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="w-full md:w-[80%] flex-1 h-auto bg-[#264653] md:ml-0">
                    <div className="md:pt-0 ">
                        <div>
                            <img
                                src="/Top.svg"
                                alt="Dashboard SVG"
                                className="w-full max-w-[1380px] h-auto"
                                style={{ aspectRatio: '1380 / 98' }}
                            />
                        </div>
                        
                        {/* Perfect matches - WITH rounded corners */}
                        <SwapCardContainer 
                            users={matches} 
                            containerId="matches-container"
                            title="Perfect Matches"
                            hasRoundedCorners={true}
                        />
                        
                        <div>
                            <img
                                src="/Mid.svg"
                                alt="Dashboard SVG2"
                                className="w-full max-w-[1380px] h-auto"
                                style={{ aspectRatio: '1380 / 98' }}
                            />
                        </div>
                        
                        {/* Partial matches - WITHOUT rounded corners */}
                        <SwapCardContainer 
                            users={matches2} 
                            containerId="matches2-container"
                            title="Partial Matches"
                            hasRoundedCorners={false}
                        />
                        
                        <div>
                            <img
                                src="/Bottom.svg"
                                alt="Dashboard SVG2"
                                className="w-full max-w-[1380px] h-auto"
                                style={{ aspectRatio: '1380 / 98' }}
                            />
                        </div>
                        
                        {/* Category matches - WITHOUT rounded corners */}
                        <SwapCardContainer 
                            users={filteredCategoryMatches} 
                            containerId="category-matches-container"
                            title="Category Matches"
                            hasRoundedCorners={false}
                        />
                    </div>
                </section>
            </main>
            
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* Internet Explorer 10+ */
                    scrollbar-width: none;  /* Firefox */
                }
                .scrollbar-hide::-webkit-scrollbar { 
                    display: none;  /* Safari and Chrome */
                }
            `}</style>
        </div>
    );
};

export default Dashboard;