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

    return (
        <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            <Nav />
           <main className="flex flex-1 md:rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <Sidebar />
                <section className="w-full md:w-[80%] flex-1 overflow-y-auto bg-[#264653] md:ml-0">
                    {/* Add top padding on mobile to account for burger menu */}
                    <div className="md:pt-0">
                        <div>
                            <img
                                src="/Top.svg"
                                alt="Dashboard SVG"
                                className="w-full max-w-[1380px] h-auto"
                                style={{ aspectRatio: '1380 / 98' }}
                            />
                        </div>
                        
                        {/* SwapCard list for mutual skill matches */}
                        <div className="
                            w-full bg-[#fff8f8] rounded-tl-[30px] p-4 md:pl-8 md:pt-[10px] md:pb-[10px]
                            /* Mobile: Grid layout */ 
                            grid grid-cols-2 gap-4 auto-rows-auto
                            /* Desktop: Horizontal scroll */
                            md:flex md:gap-6 md:overflow-x-auto md:h-[193px]
                        ">
                            {matches.length === 0 ? (
                                <div className="col-span-2 md:col-span-1 text-gray-500 flex items-center justify-center py-8">
                                    No matches found.
                                </div>
                            ) : (
                                matches.map(user => (
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
                        
                        <div>
                            <img
                                src="/Mid.svg"
                                alt="Dashboard SVG2"
                                className="w-full max-w-[1380px] h-auto"
                                style={{ aspectRatio: '1380 / 98' }}
                            />
                        </div>
                        
                        <div className="
                            w-full bg-[#fff8f8] p-4 md:pl-8 md:pt-[10px] md:pb-[10px]
                            /* Mobile: Grid layout */ 
                            grid grid-cols-2 gap-4 auto-rows-auto
                            /* Desktop: Horizontal scroll */
                            md:flex md:gap-6 md:overflow-x-auto md:h-[193px]
                        ">
                            {matches2.length === 0 ? (
                                <div className="col-span-2 md:col-span-1 text-gray-500 flex items-center justify-center py-8">
                                    No matches found.
                                </div>
                            ) : (
                                matches2.map(user => (
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
                        
                        <div>
                            <img
                                src="/Bottom.svg"
                                alt="Dashboard SVG2"
                                className="w-full max-w-[1380px] h-auto"
                                style={{ aspectRatio: '1380 / 98' }}
                            />
                        </div>
                        
                        <div className="
                            w-full bg-[#fff8f8] p-4 md:pl-8 md:pt-[10px] md:pb-[10px]
                            /* Mobile: Grid layout */ 
                            grid grid-cols-2 gap-4 auto-rows-auto
                            /* Desktop: Horizontal scroll */
                            md:flex md:gap-6 md:overflow-x-auto md:h-[193px]
                        ">
                            {filteredCategoryMatches.length === 0 ? (
                                <div className="col-span-2 md:col-span-1 text-gray-500 flex items-center justify-center py-8">
                                    No matches found.
                                </div>
                            ) : (
                                categoryMatches.map(user => (
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
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;