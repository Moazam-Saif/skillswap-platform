import React, { useEffect, useState, useContext } from "react";
import { getSkillMatches, getPartialSkillMatches } from "../api/auth";
import { SwapCard } from "./SwapCard";
import { AuthContext } from "../context/AuthContext";
import Nav from "./Nav";
import { Link } from "react-router-dom";
import { getCategorySkillMatches } from "../api/auth";

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
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
                <aside className="w-[20%] sticky top-0 h-screen bg-[#264653] pt-20 p-6 text-white rounded-tl-[30px] ">
                    <h2 className="font-semibold mb-2">Sidebar</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link to={`/dashboard/${userId}`}>Dashboard</Link>
                        </li>
                        <li>
                            <Link to={`/profile/${userId}`}>Profile</Link>
                        </li>
                    </ul>
                </aside>
                <section className="w-[80%] flex-1 overflow-y-auto bg-[#264653]">
                    <div>
                        <img
                            src="/Top.svg"
                            alt="Dashboard SVG"
                            className="w-full max-w-[1380px] h-auto"
                            style={{ aspectRatio: '1380 / 98' }}
                        />
                    </div>
                    {/* SwapCard list for mutual skill matches */}
                    <div className="h-[193px] w-full bg-[#fff8f8] rounded-tl-[30px] pl-8 pt-[10px] pb-[10px] flex gap-4 overflow-x-auto">
                        {matches.length === 0 ? (
                            <div className="text-gray-500 flex items-center">No matches found.</div>
                        ) : (
                            (
                                matches.map(user => (
                                    <SwapCard
                                        key={user.userId}
                                        name={user.name}
                                        imageUrl={user.imageUrl}
                                        skillsTheyOffer={user.skillsTheyOffer}
                                        skillsTheyWant={user.skillsTheyWant}
                                    />
                                ))
                            ))}
                    </div>
                    <div>
                        <img
                            src="/Mid.svg"
                            alt="Dashboard SVG2"
                            className="w-full max-w-[1380px] h-auto"
                            style={{ aspectRatio: '1380 / 98' }}
                        />
                    </div>
                    <div className="h-[193px] w-full bg-[#fff8f8] pl-8 pt-[10px] pb-[10px]">
                        {matches2.length === 0 ? (
                            <div className="text-gray-500 flex items-center">No matches found.</div>
                        ) : (
                            (
                                matches2.map(user => (
                                    <SwapCard
                                        key={user.userId}
                                        name={user.name}
                                        imageUrl={user.imageUrl}
                                        skillsTheyOffer={user.skillsTheyOffer}
                                        skillsTheyWant={user.skillsTheyWant}
                                    />
                                ))
                            ))}
                    </div>
                    <div>
                        <img
                            src="/Bottom.svg"
                            alt="Dashboard SVG2"
                            className="w-full max-w-[1380px] h-auto"
                            style={{ aspectRatio: '1380 / 98' }}
                        />
                    </div>
                    <div className="h-[193px] w-full bg-[#fff8f8] pl-8 pt-[10px] pb-[10px]">
                        {filteredCategoryMatches.length === 0 ? (
                            <div className="text-gray-500 flex items-center">No matches found.</div>
                        ) : (
                            categoryMatches.map(user => (
                                <SwapCard
                                    key={user.userId}
                                    name={user.name}
                                    imageUrl={user.imageUrl}
                                    skillsTheyOffer={user.skillsTheyOffer}
                                    skillsTheyWant={user.skillsTheyWant}
                                />
                            ))
                        )}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Dashboard;
