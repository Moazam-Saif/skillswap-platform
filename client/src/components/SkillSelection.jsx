import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { searchSkills } from "../api/auth";

const SkillSearch = () => {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

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
        containerRef.current &&
        !containerRef.current.contains(event.target)
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
    <div className="relative w-full h-[50vh] bg-gray-50 p-6 flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Select the Skills you want
      </h2>
      
      {/* Search Input Container */}
      <div className="relative mb-6 flex items-center justify-center w-full" ref={containerRef}>
        <div className="relative w-full flex items-center justify-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            className="relative w-1/2 px-3 py-2 text-sm border-2 border-gray-300 rounded-[100px] bg-white focus:outline-none focus:border-blue-500 transition-colors"
            onFocus={() => { 
              if (skills.length > 0) setShowDropdown(true); 
            }}
          />
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && skills.length > 0 && (
          <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            <div 
              className="max-h-32 overflow-y-auto" 
              style={{ maxHeight: "128px" }} // Exactly 3 items height
            >
              {skills.map((skill, index) => (
                <div
                  key={skill.id || skill.name}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                    index !== skills.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onClick={() => handleSelectSkill(skill)}
                >
                  <span className="text-gray-800 font-medium">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 flex-1">
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {selectedSkills.map(skill => (
              <div
                key={skill.id}
                className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0"
              >
                <span className="font-medium">{skill.name}</span>
                <button
                  className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-400 transition-colors"
                  onClick={() => handleRemoveSkill(skill.id)}
                  aria-label={`Remove ${skill.name}`}
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillSearch;