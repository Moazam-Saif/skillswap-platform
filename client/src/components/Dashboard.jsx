import React from "react";
import { SwapCard } from "./SwapCard";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAllUsers } from "../api/auth";
import { useState,useEffect } from "react";

const Dashboard = () => {
    const { userId } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            }
        };
        fetchUsers();
    }, []);
    
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
           <Nav/>

            {/* Main Content Area */}
            <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
                {/* Sidebar */}
                <aside className="w-[20%] sticky top-0 h-screen bg-[#264653] pt-20 p-6 text-white rounded-tl-[30px] ">
                    <h2 className="font-semibold mb-2">Sidebar</h2>
                    <ul className="space-y-2">
                        <li>Dashboard</li>
                        <li>Settings</li>
                        <li>
                            <Link to={`/profile/${userId}`} className="hover:underline">Profile</Link>
                        </li>
                    </ul>
                </aside>

                {/* Content */}
                <section className="w-[80%] flex-1 overflow-y-auto bg-[#264653]">
                    <div>
                        <img
                            src="/Top.svg"
                            alt="Dashboard SVG"
                            className="w-full max-w-[1380px] h-auto"
                            style={{ aspectRatio: '1380 / 98' }}
                        />
                    </div>
                    <div className="h-[193px] w-full bg-[#fff8f8] rounded-tl-[30px] pl-8 pt-[10px] pb-[10px] flex gap-4 overflow-x-auto">
                        {users.map(user => (
                            <SwapCard
                                key={user._id}
                                name={user.name}
                                imageUrl={user.imageUrl}
                            />
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
                        <div><SwapCard /></div>
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
                        <div><SwapCard /></div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Dashboard;
