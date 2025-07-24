import React from "react";

export default function UserInfo({ name, setName, bio, setBio, contact, setContact }) {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form className="w-full h-full mx-auto py-0 mt-2 md:mt-5 flex flex-col justify-between text-white px-4 lg:px-0" style={{ fontFamily: "'Josefin Sans', sans-serif" }} onSubmit={handleSubmit}>
            <div className="w-full max-w-sm mx-auto mb-6 md:mb-0">
                <label htmlFor="name" className="block text-lg md:text-xl lg:text-2xl mb-2 text-center">
                    Enter Your Name:
                </label>
                <input
                    id="name"
                    type="text"
                    value={name || ""}
                    onChange={e => setName(e.target.value)}
                    className="w-full mt-2 md:mt-8 outline-none border-b-1 border-white text-center bg-transparent text-sm md:text-base"
                />
            </div>
            <div className="w-full max-w-sm mx-auto mb-6 md:mb-0">
                <label htmlFor="contact" className="block text-lg md:text-xl lg:text-2xl mb-2 text-center">
                    Contact Number:
                </label>
                <input
                    id="contact"
                    type="text"
                    value={contact || ""}
                    onChange={e => setContact(e.target.value)}
                    className="w-full mt-2 md:mt-8 outline-none text-center border-b-1 border-white bg-transparent text-sm md:text-base"
                />
            </div>
            <div className="w-[95%] mx-auto mb-0">
                <label htmlFor="bio" className="block text-lg md:text-xl lg:text-2xl mb-2 text-center">
                    Bio:
                </label>
                <textarea
                    id="bio"
                    value={bio || ""}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-2 md:px-3 py-2 border-2 border-white border-b-0 rounded-tl-[30px] rounded-tr-[30px] focus:outline-none resize-none text-sm md:text-base"
                    placeholder="Tell us about yourself..."
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,248,248,0.2) 0%, rgba(233,196,106,0.2) 15%)'
                    }}
                />
            </div>
        </form>
    );
}