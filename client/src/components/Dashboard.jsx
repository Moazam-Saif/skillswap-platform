import React from "react";

const Dashboard = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <nav className="w-full bg-[#FFFAFA] p-2 flex items-center justify-center gap-3 text-5xl text-[#e76f51]">
                <h1 style={{ fontFamily: "Kranky, cursive" }}>SKILL</h1>
                <h1 style={{ fontFamily: "Lemon, sans" }}>SWAP</h1>
            </nav>

            {/* Main Content Area */}
            <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
                {/* Sidebar */}
                <aside className="w-[20%] sticky top-0 h-screen bg-[#264653] pt-20 p-6 text-white rounded-tl-[30px] ">
                    <h2 className="font-semibold mb-2">Sidebar</h2>
                    <ul className="space-y-2">
                        <li>Dashboard</li>
                        <li>Settings</li>
                        <li>Profile</li>
                    </ul>
                </aside>

                {/* Content */}
                <section className="w-[80%] flex-1 overflow-y-auto bg-[#264653]">
                    <div className="space-y-6" >
                        <img
                            src="/Top.svg"
                            alt="Dashboard SVG"
                            className="w-full max-w-[1380px] h-auto"
                            style={{ aspectRatio: '1380 / 98' }}
                        />
                    </div>
                    <div className="h-[150px] w-full bg-[#fff8f8] rounded-tl-[30px]"></div>
                </section>
               
            </main>
        </div>
    );
};

export default Dashboard;
