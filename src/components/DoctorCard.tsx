"use client";

import { Doctor } from "@/lib/api";
import Image from "next/image";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  // Extract specialty names from specialities objects
  const specialtyNames =
    doctor.specialities?.map((spec) => spec.name).join(", ") ||
    "Specialty not specified";

  // Validate image URL to prevent "Invalid URL" errors
  const isValidImageUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      // Check if URL is absolute (has protocol)
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  };

  const validPhotoUrl = isValidImageUrl(doctor.photo)
    ? doctor.photo
    : undefined;

  // Extract qualification safely from specialities (since qualification property doesn't exist on Doctor type)
  // Add explicit string type to fix the "Type 'unknown' is not assignable to type 'ReactNode'" error
  const qualification: string = (
    doctor.specialities &&
    doctor.specialities[0] &&
    "qualification" in doctor.specialities[0]
      ? doctor.specialities[0].qualification
      : "MBBS"
  ) as string;

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg mb-4 bg-white shadow-sm"
      data-testid="doctor-card"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {validPhotoUrl ? (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
              <Image
                src={validPhotoUrl}
                alt={doctor.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <h3
            className="font-semibold text-lg text-gray-900"
            data-testid="doctor-name"
          >
            {doctor.name}
          </h3>
          <p className="text-gray-700 text-sm" data-testid="doctor-specialty">
            {specialtyNames}
          </p>
          <p
            className="text-gray-600 text-sm mb-1"
            data-testid="doctor-qualification"
          >
            {qualification}
          </p>
          <p className="text-black text-sm" data-testid="doctor-experience">
            {doctor.experience}
          </p>
        </div>
      </div>

      <div className="mt-3">
        {doctor.clinic && (
          <div className="flex flex-col">
            {/* Clinic Name */}
            <div className="flex items-center text-gray-700 text-sm">
              {/* Hospital icon from Lucide */}
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
                className="mr-1 text-gray-500 flex-shrink-0"
              >
                <path d="M12 6v4" />
                <path d="M14 14h-4" />
                <path d="M14 18h-4" />
                <path d="M14 8h-4" />
                <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" />
                <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" />
              </svg>
              <span className="font-medium">{doctor.clinic.name}</span>
            </div>

            {/* Address/Location */}
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span>
                {doctor.clinic.address?.locality &&
                  `${doctor.clinic.address.locality}, `}
                {doctor.clinic.address?.city || ""}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <div className="flex flex-col items-end">
          <p
            className="font-semibold text-lg text-gray-900 mb-6"
            data-testid="doctor-fee"
          >
            ₹ {doctor.fees.replace(/[^\d]/g, "")}
          </p>
          <button className="py-2 px-36 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition text-center">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
