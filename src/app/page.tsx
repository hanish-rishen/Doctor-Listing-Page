"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import DoctorCard from "@/components/DoctorCard";
import { getDoctors, getUniqueSpecialties, Doctor } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States for filters and data
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedConsultMode, setSelectedConsultMode] = useState<string | null>(
    null
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  // Load doctors data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const data = await getDoctors();
        console.log("Fetched doctors:", data);

        if (data && Array.isArray(data)) {
          setDoctors(data);
          setFilteredDoctors(data);

          // Extract unique specialties from doctor data
          const uniqueSpecialties = getUniqueSpecialties(data);
          setSpecialties(uniqueSpecialties);
        } else {
          console.error("Received invalid data format:", data);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Parse URL query parameters on component mount
  useEffect(() => {
    if (searchParams && doctors.length > 0) {
      // Get search query from URL
      const query = searchParams.get("search");
      if (query) {
        setSearchQuery(query);
      }

      // Get consultation mode from URL
      const mode = searchParams.get("mode");
      if (mode === "video" || mode === "clinic") {
        setSelectedConsultMode(
          mode === "video" ? "Video Consult" : "In Clinic"
        );
      }

      // Get specialties from URL
      const specs =
        searchParams.get("specialties")?.split(",").filter(Boolean) || [];
      if (specs.length > 0) {
        // Only set specialties that exist in our data
        const validSpecs = specs.filter((spec) => specialties.includes(spec));
        setSelectedSpecialties(validSpecs);
      }

      // Get sort option from URL
      const sort = searchParams.get("sort");
      if (sort === "fees" || sort === "experience") {
        setSelectedSort(sort);
      }
    }
  }, [searchParams, doctors, specialties]);

  // Apply filters and update URL when filter states change
  useEffect(() => {
    if (doctors.length === 0) return;

    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    // Add search query to URL
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    // Add consultation mode to URL
    if (selectedConsultMode) {
      params.set(
        "mode",
        selectedConsultMode === "Video Consult" ? "video" : "clinic"
      );
    }

    // Add specialties to URL
    if (selectedSpecialties.length > 0) {
      params.set("specialties", selectedSpecialties.join(","));
    }

    // Add sort option to URL
    if (selectedSort) {
      params.set("sort", selectedSort);
    }

    // Update URL without reloading the page
    const url = params.toString() ? `?${params.toString()}` : "";
    router.replace(url, { scroll: false });

    // Apply filters to doctor data
    let filtered = [...doctors];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by consultation mode
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
        const aFees = parseInt(a.fees.replace(/[^\d]/g, ""));
        const bFees = parseInt(b.fees.replace(/[^\d]/g, ""));
        return aFees - bFees;
      });
    } else if (selectedSort === "experience") {
      filtered = filtered.sort((a, b) => {
        // Extract years from experience string (e.g. "13 Years of experience" -> 13)
        const aExp = parseInt(a.experience.match(/\d+/)?.[0] || "0");
        const bExp = parseInt(b.experience.match(/\d+/)?.[0] || "0");
        return bExp - aExp;
      });
    }

    setFilteredDoctors(filtered);
  }, [
    doctors,
    searchQuery,
    selectedConsultMode,
    selectedSpecialties,
    selectedSort,
    router,
  ]);

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle consultation mode filter change
  const handleConsultModeChange = (mode: string | null) => {
    setSelectedConsultMode(mode);
  };

  // Handle specialty filter change
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setSelectedSpecialties((prev) => [...prev, specialty]);
    } else {
      setSelectedSpecialties((prev) =>
        prev.filter((spec) => spec !== specialty)
      );
    }
  };

  // Handle sort filter change
  const handleSortChange = (sortBy: string) => {
    setSelectedSort(sortBy);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <header className="bg-blue-600 py-6">
        <div className="container mx-auto px-4">
          <SearchBar doctors={doctors} onSearch={handleSearch} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel */}
          <aside className="md:w-1/4">
            <FilterPanel
              specialties={specialties}
              onConsultModeChange={handleConsultModeChange}
              onSpecialtyChange={handleSpecialtyChange}
              onSortChange={handleSortChange}
              selectedConsultMode={selectedConsultMode}
              selectedSpecialties={selectedSpecialties}
              selectedSort={selectedSort}
            />
          </aside>

          {/* Doctor List */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  {filteredDoctors.length} Doctors Available
                </h2>
                <div className="space-y-4">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h2 className="text-xl font-medium mb-2 text-gray-800">
                  No doctors found
                </h2>
                <p className="text-gray-600">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
