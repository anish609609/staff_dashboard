export type SessionSlot = 'morning' | 'evening';

// Strictly only Two Active Operational Statuses: 'waiting' and 'consulted'
export type OPDStatus = 'waiting' | 'consulted' | 'cancelled';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface PatientRecord {
  id: string;
  uhid: string;
  name: string;
  phone: string;
  gender: Gender;
  age: number | null;
  bloodGroup?: string;
  registeredDate?: string;
  createdAt?: string;
  lastVisitDate: string;
  notes?: string;
  totalVisits: number;
}

export interface OPDEntry {
  id: string;
  tokenNumber: number;
  tokenDisplay: string;
  patientId: string;
  patientName: string;
  phone: string;
  gender: Gender;
  age: number | null;
  appointmentDate: string; // YYYY-MM-DD
  session: SessionSlot;
  registeredTime: string;
  registeredTimestamp: number;
  createdBy: string;
  status: OPDStatus; // Read-only for staff: 'waiting' by default, changes to 'consulted' only via doctor prescription
  doctorAssigned: string;
  room: string;
  chiefComplaint?: string;
  extraNote?: string;
  prescription?: {
    uploadedAt: string;
    medicines: string;
    doctorNotes: string;
  };
}

export interface StaffUser {
  id: string;
  name: string;
  role: string;
  deskNumber: string;
  avatarUrl: string;
  email?: string;
  shiftHours?: string;
}
