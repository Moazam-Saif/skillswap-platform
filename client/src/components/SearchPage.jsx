import React, { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import SearchResultCard from "./SearchResultCard";
import { AuthContext } from "../context/AuthContext";
import { searchUsersBySkill, searchUsersByCategory, searchUsersByName } from "../api/auth";
import { closeMobileSidebar } from '../store/sidebarSlice';

export default function SearchPage() {
  const { accessToken } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const dispatch = useDispatch();

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
    
    // Close the mobile sidebar when search starts
    dispatch(closeMobileSidebar());
    
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
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
      <Nav />
      <main className="flex flex-1 md:rounded-tl-[30px] border-t-2 border-[#e76f51]">
        <Sidebar />
        <section className="w-full md:w-[80%] flex flex-col bg-[#fff8f8] p-4 md:p-8">
          
          {/* Search Info - Responsive text */}
          {searchQuery && (
            <div className="mb-4 md:mb-6 text-center px-2">
              <p className="text-[#264653] text-base md:text-lg">
                Searching for <span className="font-semibold">"{searchQuery}"</span> in{" "}
                <span className="font-semibold capitalize">{searchType}</span>
              </p>
            </div>
          )}

          {/* Results Container - Responsive width */}
          <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8 md:py-12 text-center">
                <div className="text-gray-500 text-base md:text-lg">Searching...</div>
              </div>
            ) : searched ? (
              <div>
                {/* Results count - Responsive text */}
                <p className="text-[#264653] text-xs md:text-sm mb-4 md:mb-6 text-center">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </p>
                
                {results.length > 0 ? (
                  <div className="flex flex-col gap-4 md:gap-6">
                    {results.map(user => (
                      <SearchResultCard key={user._id} user={user} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12 px-4">
                    <div className="text-gray-400 text-base md:text-lg mb-2">No users found</div>
                    <div className="text-gray-500 text-sm md:text-base">Try searching with different terms</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12 px-4">
                <div className="text-gray-500 text-base md:text-lg">Use the search bar above to find users</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}