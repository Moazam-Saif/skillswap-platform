import React, { useState, useEffect, useRef } from "react";
import { searchSkills } from "../api/auth";

const skillSearch = () => {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    if (query.length < 3) {
      setSkills([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await searchSkills(query);
        setSkills(res);
        setShowDropdown(true);
      } catch (err) {
        setSkills([]);
        setShowDropdown(false);
      }
      setLoading(false);
    }, 150);

    return () => clearTimeout(handler);
  }, [query]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSkill = (skill) => {
    if (!selectedSkills.some(s => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setQuery("");
    setSkills([]);
    setShowDropdown(false);
  };

  const handleRemoveSkill = (id) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.id !== id));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">Select the Skill you want</h2>
      <div className="mb-4 flex flex-col gap-2" ref={inputRef} style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a skill..."
          className="border p-2 rounded"
          onFocus={() => { if (skills.length > 0) setShowDropdown(true); }}
        />
        {showDropdown && skills.length > 0 && (
          <ul
            className="absolute z-10 bg-white border rounded w-full mt-10 shadow"
            style={{
              maxHeight: "180px", // ~5 items at 36px each
              overflowY: "auto"
            }}
          >
            {skills.map(skill => (
              <li
                key={skill.id || skill.name}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSkill(skill)}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Skill tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedSkills.map(skill => (
          <div
            key={skill.id}
            className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
          >
            <span>{skill.name}</span>
            <button
              className="ml-2 text-blue-500 hover:text-red-500"
              onClick={() => handleRemoveSkill(skill.id)}
              aria-label="Remove skill"
              type="button"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default skillSearch;