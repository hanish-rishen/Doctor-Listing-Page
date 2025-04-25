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

  // Format specialty ID for data-testid attribute
  const formatSpecialtyId = (specialty: string): string => {
    return specialty.replace(/\//g, "-").replace(/\s+/g, "-");
  };

  return (
    <div className="w-full md:max-w-xs p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>

      {/* Sort Filter */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setSortOpen(!sortOpen)}
          data-testid="filter-header-sort"
        >
          <h3 className="font-medium text-gray-700">Sort by</h3>
          <span
            className={`transform transition-transform ${
              sortOpen ? "rotate-180" : ""
            } text-gray-500`}
          >
            ▼
          </span>
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

      {/* Consultation Mode Filter */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setConsultModeOpen(!consultModeOpen)}
          data-testid="filter-header-moc"
        >
          <h3 className="font-medium text-gray-700">Mode of consultation</h3>
          <span
            className={`transform transition-transform ${
              consultModeOpen ? "rotate-180" : ""
            } text-gray-500`}
          >
            ▼
          </span>
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
                data-testid="filter-video-consult"
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
                data-testid="filter-in-clinic"
              />
              <span className="text-gray-700">In-clinic Consultation</span>
            </label>

            <label className="flex items-center space-x-2 mt-1 cursor-pointer">
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

      {/* Specialties Filter */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => setSpecialtiesOpen(!specialtiesOpen)}
          data-testid="filter-header-speciality"
        >
          <h3 className="font-medium text-gray-700">Specialities</h3>
          <span
            className={`transform transition-transform ${
              specialtiesOpen ? "rotate-180" : ""
            } text-gray-500`}
          >
            ▼
          </span>
        </div>

        {specialtiesOpen && (
          <div className="pl-1 space-y-2 max-h-60 overflow-y-auto">
            {specialties.map((specialty) => (
              <label
                key={specialty}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={(e) =>
                    onSpecialtyChange(specialty, e.target.checked)
                  }
                  className="text-blue-600"
                  data-testid={`filter-specialty-${formatSpecialtyId(
                    specialty
                  )}`}
                />
                <span className="text-gray-700">{specialty}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
