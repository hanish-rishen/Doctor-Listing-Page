"use client";

import { useEffect, useState, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import DoctorCard from "@/components/DoctorCard";
import { Doctor, getDoctors } from "@/lib/api";
import { useSearchParams } from "next/navigation";

// This component uses useSearchParams and will be wrapped in Suspense
function HomeContent() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedConsultMode, setSelectedConsultMode] = useState<string | null>(
    null
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This hook needs to be wrapped in Suspense
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q") || "";

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);

        // Extract unique specialties
        const uniqueSpecialties = new Set<string>();
        doctorsData.forEach((doctor: Doctor) => {
          if (doctor.specialities && Array.isArray(doctor.specialities)) {
            doctor.specialities.forEach((spec) => {
              if (spec.name) uniqueSpecialties.add(spec.name);
            });
          }
        });
        setSpecialties(Array.from(uniqueSpecialties).sort());

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter selections change
    if (doctors.length > 0) {
      let filtered = [...doctors];

      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter((doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by consult mode
      if (selectedConsultMode) {
        filtered = filtered.filter((doctor) =>
          selectedConsultMode === "Video Consult"
            ? doctor.video_consult
            : doctor.in_clinic
        );
      }

      // Filter by specialties
      if (selectedSpecialties.length > 0) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.specialities &&
            Array.isArray(doctor.specialities) &&
            doctor.specialities.some((spec) =>
              selectedSpecialties.includes(spec.name)
            )
        );
      }

      // Apply sorting
      if (selectedSort === "fees") {
        filtered = filtered.sort((a, b) => {
          // Parse fees string to get numeric value (removes '₹ ' prefix)
          const aFees = parseInt(a.fees.replace(/[^\d]/g, ""), 10) || 0;
          const bFees = parseInt(b.fees.replace(/[^\d]/g, ""), 10) || 0;
          return aFees - bFees;
        });
      } else if (selectedSort === "experience") {
        filtered = filtered.sort(
          (a, b) => Number(b.experience) - Number(a.experience)
        );
      }

      setFilteredDoctors(filtered);
    }
  }, [
    doctors,
    searchQuery,
    selectedConsultMode,
    selectedSpecialties,
    selectedSort,
  ]);

  const handleSearch = (query: string) => {
    // Handle search by updating the URL parameters
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.pushState({}, "", url);

    // Direct filtering will be handled by the useEffect watching searchQuery
  };

  const handleConsultModeChange = (mode: string | null) => {
    setSelectedConsultMode(mode);
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setSelectedSpecialties((prev) =>
      checked ? [...prev, specialty] : prev.filter((item) => item !== specialty)
    );
  };

  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading doctors...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-blue-600 mb-8">
        <div className="container mx-auto px-4 py-6">
          <SearchBar doctors={doctors} onSearch={handleSearch} />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4">
            <FilterPanel
              specialties={specialties}
              onConsultModeChange={handleConsultModeChange}
              onSpecialtyChange={handleSpecialtyChange}
              onSortChange={handleSortChange}
              selectedConsultMode={selectedConsultMode}
              selectedSpecialties={selectedSpecialties}
              selectedSort={selectedSort}
            />
          </div>

          <div className="w-full md:w-3/4">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">
                  No doctors found matching your criteria.
                </p>
                <p
                  className="mt-2 text-blue-600 cursor-pointer"
                  onClick={() => {
                    setSelectedConsultMode(null);
                    setSelectedSpecialties([]);
                    setSelectedSort(null);
                  }}
                >
                  Clear all filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function Home() {
  return (
    <Suspense
      fallback={<div className="text-center py-8 bg-white">Loading...</div>}
    >
      <HomeContent />
    </Suspense>
  );
}
