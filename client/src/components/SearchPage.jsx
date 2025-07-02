import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";
import { searchUsersBySkill, searchUsersByCategory, searchUsersByName } from "../api/auth";

export default function SearchPage() {
  const { accessToken } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Get search parameters from URL
  const searchType = searchParams.get('type') || 'skill';
  const searchQuery = searchParams.get('query') || '';

  // Perform search when component mounts or URL parameters change
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    }
  }, [searchType, searchQuery, accessToken]);

  const performSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      let data = [];
      console.log(`Searching for ${searchType}: "${searchQuery}"`);
      
      if (searchType === "skill") {
        data = await searchUsersBySkill(searchQuery, accessToken);
      } else if (searchType === "category") {
        data = await searchUsersByCategory(searchQuery, accessToken);
      } else if (searchType === "name") {
        data = await searchUsersByName(searchQuery, accessToken);
      }
      
      console.log(`Search results:`, data);
      setResults(data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex flex-1 rounded-tl-[30px] border-t-2 border-[#e76f51]">
        <Sidebar />
        <section className="w-[80%] flex flex-col bg-[#fff8f8] p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#264653]">Search Results</h2>
          
          {/* Search Info */}
          {searchQuery && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700">
                Searching for <span className="font-semibold">"{searchQuery}"</span> in{" "}
                <span className="font-semibold capitalize">{searchType}</span>
              </p>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 text-lg">Searching...</div>
            </div>
          ) : searched ? (
            <div>
              <p className="text-gray-600 mb-6 text-lg">
                Found <span className="font-semibold text-[#e76f51]">{results.length}</span> user{results.length !== 1 ? 's' : ''} 
                {results.length > 0 && ` matching "${searchQuery}"`}
              </p>
              
              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map(user => (
                    <div key={user._id} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <img 
                          src={user.imageUrl || "/userImage.png"} 
                          alt="user" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#e76f51]" 
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-xl text-[#264653] mb-2">{user.name}</div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Skills: </span>
                            {user.skillsHave?.length > 0 
                              ? user.skillsHave.map(s => s.name).join(", ")
                              : "No skills listed"
                            }
                          </div>
                          {user.skillsHave?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {user.skillsHave.slice(0, 5).map((skill, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 bg-[#e76f51]/10 text-[#e76f51] rounded-full text-xs font-medium"
                                >
                                  {skill.name}
                                </span>
                              ))}
                              {user.skillsHave.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  +{user.skillsHave.length - 5} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button 
                          className="px-4 py-2 bg-[#e76f51] text-white rounded-lg hover:bg-[#d65d42] transition-colors font-medium"
                          onClick={() => window.open(`/profile/${user._id}`, '_blank')}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No users found</div>
                  <div className="text-gray-500">Try searching with different terms</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Use the search bar above to find users</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}