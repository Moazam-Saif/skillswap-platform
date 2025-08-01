import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("skill");
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const expandTimeoutRef = useRef(null);

    // Close search area when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsExpanded(false);
                setShowDropdown(false);
                setUserInteracted(false);
                setSearchQuery("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (expandTimeoutRef.current) {
                clearTimeout(expandTimeoutRef.current);
            }
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results page with query parameters
            navigate(`/search?type=${searchType}&query=${encodeURIComponent(searchQuery.trim())}`);
            
            // Collapse search after submission
            setIsExpanded(false);
            setShowDropdown(false);
            setUserInteracted(false);
            setSearchQuery("");
        }
    };

    const handleSearchIconHover = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            // Set timeout to collapse if no interaction
            expandTimeoutRef.current = setTimeout(() => {
                if (!userInteracted) {
                    setIsExpanded(false);
                }
            }, 3000); // Collapse after 3 seconds if no interaction
        }
    };

    const handleInputFocus = () => {
        setUserInteracted(true);
        if (expandTimeoutRef.current) {
            clearTimeout(expandTimeoutRef.current);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setUserInteracted(true);
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit(e);
        }
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
        setUserInteracted(true);
        if (expandTimeoutRef.current) {
            clearTimeout(expandTimeoutRef.current);
        }
    };

    const handleDropdownSelect = (type) => {
        setSearchType(type);
        setShowDropdown(false);
        setUserInteracted(true);
        inputRef.current?.focus();
    };

    return (
        <div className="w-48 sm:w-60 md:w-72 lg:w-80 xl:w-96 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                {/* Search Container */}
                <div className={`flex items-center bg-white border border-gray-300 rounded-full transition-all duration-300 ease-in-out ${
                    isExpanded 
                        ? 'w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64' // Responsive expanded widths
                        : 'w-10' // Collapsed width
                } h-10 overflow-hidden`}>
                    {/* Search Icon */}
                    <div 
                        className="flex items-center justify-center w-10 h-10 flex-shrink-0 cursor-pointer"
                        onMouseEnter={handleSearchIconHover}
                    >
                        <svg 
                            className="w-5 h-5 text-gray-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                    </div>
                    
                    {/* Search Input - Fixed text color */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={`Search by ${searchType}...`}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyPress={handleInputKeyPress}
                        className={`flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm transition-opacity duration-300 text-gray-900 placeholder-gray-500 ${
                            isExpanded ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ color: '#111827' }} // Force dark text color
                    />
                </div>

                {/* Dropdown Button - Fixed Position */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={handleDropdownToggle}
                        className={`flex items-center justify-center px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 ${
                            isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    >
                        <span className="capitalize hidden sm:inline">{searchType}</span>
                        <span className="capitalize sm:hidden">{searchType.charAt(0).toUpperCase()}</span>
                        <svg 
                            className={`ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                                showDropdown ? 'transform rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div 
                            ref={dropdownRef}
                            className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-24 sm:min-w-32"
                        >
                            {['skill', 'category', 'name'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleDropdownSelect(type)}
                                    className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize ${
                                        searchType === type ? 'bg-[#e76f51] text-white' : 'text-gray-700'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}