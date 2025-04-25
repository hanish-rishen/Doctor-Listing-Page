"use client";

import { useState } from "react";

interface FilterPanelProps {
  specialties: string[];
  onConsultModeChange: (mode: string | null) => void;
  onSpecialtyChange: (specialty: string, checked: boolean) => void;
  onSortChange: (sortBy: string) => void;
  selectedConsultMode: string | null;
  selectedSpecialties: string[];
  selectedSort: string | null;
}

export default function FilterPanel({
  specialties,
  onConsultModeChange,
  onSpecialtyChange,
  onSortChange,
  selectedConsultMode,
  selectedSpecialties,
  selectedSort,
}: FilterPanelProps) {
  const [specialtiesOpen, setSpecialtiesOpen] = useState(true);
  const [consultModeOpen, setConsultModeOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);
  const [specialtySearch, setSpecialtySearch] = useState("");

  // Format specialty ID for data-testid attribute
  const formatSpecialtyId = (specialty: string) => {
    return specialty.replace(/\//g, "-").replace(/\s+/g, "-");
  };

  // Filter specialties based on search term
  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  // Custom arrow icon component
  const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${
        isOpen ? "transform rotate-180" : ""
      } text-gray-500`}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <>
      {/* Sort By Card - Separate from filters */}
      <div className="w-full md:max-w-xs p-4 border border-gray-200 rounded-lg bg-white shadow-sm mb-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setSortOpen(!sortOpen)}
          data-testid="filter-header-sort"
        >
          <h3
            className={`text-lg font-semibold ${
              sortOpen ? "mb-4" : "mb-0"
            } text-gray-800`}
          >
            Sort by
          </h3>
          <ArrowIcon isOpen={sortOpen} />
        </div>

        {sortOpen && (
          <div className="pl-1 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={selectedSort === "fees"}
                onChange={() => onSortChange("fees")}
                className="text-blue-600"
                data-testid="sort-fees"
              />
              <span className="text-gray-700">Price: Low-High</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={selectedSort === "experience"}
                onChange={() => onSortChange("experience")}
                className="text-blue-600"
                data-testid="sort-experience"
              />
              <span className="text-gray-700">
                Experience: Most Experience first
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Filters Card - Without sorting */}
      <div className="w-full md:max-w-xs p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>

        {/* Specialties - Now first */}
        <div className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setSpecialtiesOpen(!specialtiesOpen)}
            data-testid="filter-header-speciality"
          >
            <h3 className="font-medium text-gray-700">Specialities</h3>
            <ArrowIcon isOpen={specialtiesOpen} />
          </div>

          {specialtiesOpen && (
            <>
              <div className="mb-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search specialties..."
                    value={specialtySearch}
                    onChange={(e) => setSpecialtySearch(e.target.value)}
                    className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  {specialtySearch && (
                    <button
                      onClick={() => setSpecialtySearch("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="pl-1 space-y-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded">
                {filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(specialty)}
                        onChange={(e) => {
                          onSpecialtyChange(specialty, e.target.checked);
                        }}
                        className="text-blue-600"
                        data-testid={`specialty-${formatSpecialtyId(
                          specialty
                        )}`}
                      />
                      <span className="text-gray-700">{specialty}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No specialties found</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mode of consultation - Now second */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setConsultModeOpen(!consultModeOpen)}
            data-testid="filter-header-moc"
          >
            <h3 className="font-medium text-gray-700">Mode of consultation</h3>
            <ArrowIcon isOpen={consultModeOpen} />
          </div>

          {consultModeOpen && (
            <div className="pl-1 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="consultMode"
                  checked={selectedConsultMode === "Video Consult"}
                  onChange={() => onConsultModeChange("Video Consult")}
                  className="text-blue-600"
                />
                <span className="text-gray-700">Video Consultation</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="consultMode"
                  checked={selectedConsultMode === "In Clinic"}
                  onChange={() => onConsultModeChange("In Clinic")}
                  className="text-blue-600"
                />
                <span className="text-gray-700">In-Clinic Consultation</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer mt-1">
                <input
                  type="radio"
                  name="consultMode"
                  checked={selectedConsultMode === null}
                  onChange={() => onConsultModeChange(null)}
                  className="text-blue-600"
                />
                <span className="text-gray-700">All</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
