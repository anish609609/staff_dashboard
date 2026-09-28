import { PatientRecord } from '../types/clinic';

/**
 * Extracts registration/reference year from patient record.
 * Checks registeredDate, createdAt, and lastVisitDate.
 */
export function getPatientRegistrationYear(patient: Partial<PatientRecord>): number | null {
  const dateStr = patient.registeredDate || patient.createdAt || patient.lastVisitDate;
  if (!dateStr) return null;

  // Match 4-digit year e.g. "2024", "15 Mar 2024", "2023-04-15"
  const match = dateStr.match(/\b(19\d\d|20\d\d)\b/);
  if (match) {
    return parseInt(match[1], 10);
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.getFullYear();
  }

  return null;
}

/**
 * Calculates current dynamic age for returning patients based on elapsed years:
 * Formula: Current Age = Stored Age + (Current Year - Registration Year)
 */
export function calculateDynamicPatientAge(patient: Partial<PatientRecord>): {
  calculatedAge: number | null;
  elapsedYears: number;
  registrationYear: number | null;
  hasAdjustment: boolean;
} {
  const storedAge = patient.age;
  if (storedAge === null || storedAge === undefined || isNaN(storedAge)) {
    return {
      calculatedAge: null,
      elapsedYears: 0,
      registrationYear: null,
      hasAdjustment: false,
    };
  }

  const regYear = getPatientRegistrationYear(patient);
  if (!regYear) {
    return {
      calculatedAge: storedAge,
      elapsedYears: 0,
      registrationYear: null,
      hasAdjustment: false,
    };
  }

  const currentYear = new Date().getFullYear();
  const elapsedYears = Math.max(0, currentYear - regYear);
  const calculatedAge = storedAge + elapsedYears;

  return {
    calculatedAge,
    elapsedYears,
    registrationYear: regYear,
    hasAdjustment: elapsedYears > 0,
  };
}
