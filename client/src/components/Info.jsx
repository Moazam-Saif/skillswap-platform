import React from "react";

export default function UserInfo({ name, setName, bio, setBio, contact, setContact }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <form className="w-full h-full mx-auto py-0 mt-5 flex flex-col justify-between text-white" style={{ fontFamily: "'Josefin Sans', sans-serif" }} onSubmit={handleSubmit}>
            <div className="w-sm mx-auto">
                <label htmlFor="name" className="block text-2xl mb-2 text-center">
                    Enter Your Name:
                </label>
                <input
                    id="name"
                    type="text"
                    value={name || ""}
                    onChange={e => setName(e.target.value)}
                    className="w-full mt-8 outline-none border-b-1 border-white text-center"
                />
            </div>
            <div className="w-sm mx-auto">
                <label htmlFor="contact" className="block text-2xl mb-2 text-center">
                    Contact Number:
                </label>
                <input
                    id="contact"
                    type="text"
                    value={contact || ""}
                    onChange={e => setContact(e.target.value)}
                    className="w-full mt-8 outline-none text-center border-b-1 border-white"
                />
            </div>
            <div className="w-[95%] mx-auto mb-0">
                <label htmlFor="bio" className="block text-2xl mb-2 text-center">
                    Bio:
                </label>
                <textarea
                    id="bio"
                    value={bio || ""}
                    onChange={e => setBio(e.target.value)}
                    rows={4}
                    className=" w-full px-3 py-2 border-2 border-t-white border-l-white border-r-white border-b-0 rounded-tl-[30px] rounded-tr-[30px] focus:outline-none resize-none"
                    placeholder="Tell us about yourself..."
                    style={{
                        background: 'linear-gradient(to right, rgba(255,248,248,0.2) 0%, rgba(233,196,106,0.2) 15%)'
                    }}
                />
            </div>
        </form>
    );
}