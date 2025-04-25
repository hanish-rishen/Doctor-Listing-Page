"use client";

import { useState, useEffect, useRef } from "react";
import { Doctor } from "@/lib/api";

interface SearchBarProps {
  doctors: Doctor[];
  onSearch: (query: string) => void;
}

export default function SearchBar({ doctors, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of the search component
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Filter doctors to find matches based on name
    const matches = doctors
      .filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 3); // Limit to top 3 matches

    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search Doctors by Name"
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          data-testid="autocomplete-input"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map((doctor) => (
              <li
                key={doctor.id}
                onClick={() => handleSuggestionClick(doctor.name)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                data-testid="suggestion-item"
              >
                {doctor.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
