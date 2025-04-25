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

  // Determine consultation modes
  const consultationModes = [];
  if (doctor.video_consult) consultationModes.push("Video Consult");
  if (doctor.in_clinic) consultationModes.push("In Clinic");

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

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg mb-4 bg-white flex flex-col md:flex-row gap-4"
      data-testid="doctor-card"
    >
      <div className="w-20 h-20 bg-gray-200 rounded-full shrink-0 self-center md:self-start overflow-hidden">
        {validPhotoUrl ? (
          <Image
            src={validPhotoUrl}
            alt={doctor.name}
            width={80}
            height={80}
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
              className="w-12 h-12"
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

      <div className="flex-1">
        <h3
          className="font-semibold text-lg text-gray-900"
          data-testid="doctor-name"
        >
          {doctor.name}
        </h3>
        <p className="text-gray-600 mb-1" data-testid="doctor-specialty">
          {specialtyNames}
        </p>
        <p
          className="text-sm text-gray-500 mb-2"
          data-testid="doctor-experience"
        >
          {doctor.experience}
        </p>

        <div className="flex flex-col md:flex-row gap-2 mt-2">
          <div className="flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
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
            <span className="text-sm text-gray-700">
              {doctor.clinic?.name},
              {doctor.clinic?.address?.locality &&
                ` ${doctor.clinic.address.locality}, `}
              {doctor.clinic?.address?.city}
            </span>
          </div>

          <div className="md:ml-4 flex items-center space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 8.25H9m6 3H9m3 3H9M9 18h12m-8.25-8.25h1.5m-1.5-6.75L12 3m0 0 2.25 2.25M12 3l-2.25 2.25"
              />
            </svg>
            <span
              className="font-medium text-gray-800"
              data-testid="doctor-fee"
            >
              {doctor.fees}
            </span>
          </div>
        </div>

        {doctor.languages && doctor.languages.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium">Languages:</span>{" "}
            {doctor.languages.join(", ")}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {consultationModes.map((mode) => (
            <span
              key={mode}
              className={`text-xs px-2 py-1 rounded ${
                mode === "Video Consult"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {mode}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 self-center flex flex-col items-center gap-2 mt-4 md:mt-0">
        <button className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full">
          Book Appointment
        </button>
      </div>
    </div>
  );
}
