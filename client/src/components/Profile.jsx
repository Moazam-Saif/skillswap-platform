import React, { useState } from "react";
import { searchSkills } from "../api/auth";

const Profile = () => {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 3) {
      setSkills([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchSkills(query);
      console.log(res)
      setSkills(res);
      
    } catch (err) {
      setSkills([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Skill Search</h2>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a skill..."
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-[#e76f51] text-white px-4 py-2 rounded">
          Search
        </button>
      </form>
      {loading && <div>Loading...</div>}
      <ul className="mt-4">
        {skills.map(skill => (
          <li key={skill.id || skill.name} className="border-b py-1">{skill.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;