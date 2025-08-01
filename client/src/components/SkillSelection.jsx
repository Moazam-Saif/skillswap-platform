import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { searchSkills } from "../api/auth";

const SkillSearch = ({ selectedSkills, setSelectedSkills, activeSkillType }) => {
  const [query, setQuery] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
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
      console.log(skill,":skill selected")
      setSelectedSkills([...selectedSkills, skill]);
    }
    setQuery("");
    setSkills([]);
    setShowDropdown(false);
  };

  const handleRemoveSkill = (name) => {
    setSelectedSkills(selectedSkills.filter(skill => skill.name !== name));
  };

  // Determine tag colors based on activeSkillType
  const tagBgColor = activeSkillType === "want" ? "bg-[#264653]" : "bg-[#e76f51]";
  const tagTextColor = "text-white";

  return (
    <div className="relative w-full h-auto lg:h-1/2 p-2 md:p-3 flex flex-col gap-6 md:gap-10">
      {/* Search Input Container */}
      <div className="relative flex flex-col gap-0" ref={containerRef}>
        <div className="relative w-full flex items-center justify-center">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            className={
              `relative w-full md:w-3/4 lg:w-1/2 px-3 py-2 text-sm border-2 border-gray-300 bg-white focus:outline-none rounded-[30px]` +
              (showDropdown && skills.length > 0 ? " rounded-b-none" : "")
            }
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
          <div className="relative mx-auto z-20 w-full md:w-3/4 lg:w-1/2 bg-white border-2 border-gray-200 rounded-t-none rounded-b-lg shadow-lg">
            <div
              className="max-h-32 overflow-y-auto"
              style={{ maxHeight: "128px" }}
            >
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors ${index !== skills.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  onClick={() => handleSelectSkill(skill)}
                >
                  <span className="text-gray-800 font-medium text-sm md:text-base">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {selectedSkills.map(skill => (
            <div
              key={skill.id}
              className={`flex items-center gap-2 md:gap-3 ${tagBgColor} ${tagTextColor} py-1 rounded-full whitespace-nowrap`}
            >
              <span className="ml-2 md:ml-3 text-xs md:text-sm">{skill.name}</span>
              <button
                className="flex items-center justify-center w-4 h-4 rounded-full bg-white bg-opacity-20 hover:bg-red-600 transition-colors mr-2"
                onClick={() => handleRemoveSkill(skill.name)}
                aria-label={`Remove ${skill.name}`}
                type="button"
              >
                <X className="w-3 h-3 text-black" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSearch;