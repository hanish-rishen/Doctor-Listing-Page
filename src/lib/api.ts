export interface Speciality {
  name: string;
}

export interface Address {
  locality: string;
  city: string;
  address_line1: string;
  location: string;
  logo_url: string;
}

export interface Clinic {
  name: string;
  address: Address;
}

export interface Doctor {
  id: string;
  name: string;
  name_initials?: string;
  photo?: string;
  doctor_introduction?: string;
  specialities: Speciality[];
  fees: string;
  experience: string;
  languages?: string[];
  clinic: Clinic;
  video_consult: boolean;
  in_clinic: boolean;
}

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch(
      "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch doctors: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export function getUniqueSpecialties(doctors: Doctor[]): string[] {
  const specialtiesSet = new Set<string>();
  doctors.forEach((doctor) => {
    // Check if specialities array exists before iterating through it
    if (doctor && doctor.specialities && Array.isArray(doctor.specialities)) {
      doctor.specialities.forEach((spec) => specialtiesSet.add(spec.name));
    }
  });
  return Array.from(specialtiesSet).sort();
}
