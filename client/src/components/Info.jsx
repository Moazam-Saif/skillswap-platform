import { useState } from "react";

export default function UserInfo() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <form className="w-full h-[96vh] mx-auto mt-5 flex flex-col justify-between" onSubmit={handleSubmit}>
        <div className="w-sm mx-auto">
          <label htmlFor="name" className="block text-2xl text-gray-700 mb-2 text-center">
            Enter Your Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-10 outline-none shadow-2xs text-center"
          />
        </div>
         <div  className="w-sm mx-auto">
          <label htmlFor="contact" className="block text-2xl text-gray-700 mb-2 text-center">
            Contact Number:
          </label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={e => setContact(e.target.value)}
            className="w-full mt-2 outline-none shadow-2xs text-center"
          />
        </div>
        <div className="w-[95%] mx-auto">
          <label htmlFor="bio" className="block text-2xl text-gray-700 mb-2 text-center">
            Bio:
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            className=" w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>
        {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save Profile
        </button> */}
    </form>
  );
}