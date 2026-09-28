export type SessionSlot = 'morning' | 'evening';

// Strictly 2 operational statuses: 'waiting' and 'consulted' (with optional 'cancelled')
export type OPDStatus = 'waiting' | 'consulted' | 'cancelled';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type UserRole = 'doctor' | 'staff';

export interface PastVisitRecord {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  complaint: string;
  notes?: string;
  prescriptionUrl?: string;
  prescriptionFileName?: string;
  prescriptionType?: 'image' | 'pdf';
}

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
  pastVisits?: PastVisitRecord[];
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
  status: OPDStatus;
  doctorAssigned: string;
  room: string;
  chiefComplaint?: string;
  extraNote?: string;
  prescription?: {
    uploadedAt: string;
    medicines?: string;
    doctorNotes?: string;
    imageUrl?: string;
    fileName?: string;
    fileType?: 'image' | 'pdf';
  };
}

export interface ConsultationRecord {
  id: string;
  opdEntryId?: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  timestamp: number;
  chiefComplaint?: string;
  diagnosis?: string;
  doctorNotes?: string;
  medicines?: string;
  prescriptionImageUrl?: string;
  prescriptionFileName?: string;
  prescriptionFileType?: 'image' | 'pdf';
  followUpDays?: number;
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

export interface DoctorUser {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  room: string;
  avatarUrl?: string;
  email?: string;
}
