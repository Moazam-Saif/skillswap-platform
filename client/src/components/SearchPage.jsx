import React, { useState, useContext } from "react";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { searchUsersBySkill, searchUsersByCategory, searchUsersByName } from "../api/auth";

export default function UserSearchPage() {
  const { accessToken } = useContext(AuthContext);
  const [option, setOption] = useState("skill");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    try {
      let data = [];
      if (option === "skill") data = await searchUsersBySkill(query, accessToken);
      if (option === "category") data = await searchUsersByCategory(query, accessToken);
      if (option === "name") data = await searchUsersByName(query, accessToken);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
        <Sidebar />
        <section className="w-[80%] flex flex-col bg-[#fff8f8] p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#264653]">Search Users</h2>
          
          {/* Search Controls */}
          <div className="flex gap-4 mb-6">
            <select 
              value={option} 
              onChange={e => setOption(e.target.value)} 
              className="border rounded-lg px-3 py-2 bg-white"
            >
              <option value="skill">By Skill</option>
              <option value="category">By Category</option>
              <option value="name">By Name</option>
            </select>
            <input
              className="border rounded-lg px-3 py-2 flex-1"
              placeholder={`Enter ${option}...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleSearch} 
              disabled={loading || !query.trim()}
              className="bg-[#e76f51] text-white px-6 py-2 rounded-lg hover:bg-[#d65d42] disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-gray-500">Searching...</div>
          ) : searched ? (
            <div>
              <p className="text-gray-600 mb-4">
                Found {results.length} user{results.length !== 1 ? 's' : ''} 
                {results.length > 0 && ` for "${query}"`}
              </p>
              <div className="flex flex-col gap-4">
                {results.map(user => (
                  <div key={user._id} className="p-4 bg-white rounded-xl shadow flex items-center gap-4">
                    <img 
                      src={user.imageUrl || "/userImage.png"} 
                      alt="user" 
                      className="w-12 h-12 rounded-full object-cover" 
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-[#264653]">{user.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Skills: {user.skillsHave?.length > 0 
                          ? user.skillsHave.map(s => s.name).join(", ")
                          : "No skills listed"
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Enter a search term and click Search to find users.</div>
          )}
        </section>
      </main>
    </div>
  );
}