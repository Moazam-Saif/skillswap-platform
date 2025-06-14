import React, { useState, useEffect } from "react";
import { searchSkills } from "../api/auth";

const Profile = () => {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce logic
  useEffect(() => {
    if (query.length < 3) {
      setSkills([]);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await searchSkills(query);
        setSkills(res);
      } catch (err) {
        setSkills([]);
      }
      setLoading(false);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Skill Search</h2>
      <form className="mb-4 flex gap-2" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a skill..."
          className="border p-2 rounded"
        />
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