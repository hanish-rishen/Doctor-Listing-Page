"use client";

import { useState, useEffect, useRef } from "react";
import { Doctor } from "@/lib/api";
import Image from "next/image";

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

  // Validate image URL to prevent "Invalid URL" errors
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search Doctors by Name"
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white text-gray-900"
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
            className="w-5 h-5 text-blue-600"
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {suggestions.map((doctor) => (
              <li
                key={doctor.id}
                onClick={() => handleSuggestionClick(doctor.name)}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                data-testid="suggestion-item"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3 w-10 h-10 overflow-hidden bg-gray-200">
                    {isValidImageUrl(doctor.photo) ? (
                      <Image
                        src={doctor.photo || ""}
                        alt={doctor.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-900 font-medium">
                      {doctor.name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {doctor.specialities
                        ?.map((spec) => spec.name)
                        .join(", ") || "Specialty not specified"}
                    </div>
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-gray-400"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
