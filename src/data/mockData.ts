import { PatientRecord, OPDEntry, StaffUser } from '../types/clinic';

export const CLINIC_LOGO_PATH = '/src/assets/images/clinic_logo_mark_1790534329715.jpg';
export const RECEPTION_AVATAR_PATH = '/src/assets/images/receptionist_avatar_1790534317228.jpg';

export const HOSPITAL_NAME = 'Vamshi ENT Hospital';
export const HOSPITAL_TAGLINE = 'Ear, Nose, Throat & Head-Neck Speciality Center';
export const CONSULTING_DOCTOR = 'Dr. Vamshi Krishna';
export const CONSULTING_ROOM = 'Consultation Room 01 (ENT)';

export interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  room: string;
}

export const AVAILABLE_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-1',
    name: 'Dr. Vamshi Krishna',
    qualification: 'MS (ENT)',
    specialty: 'Senior ENT Consultant & Surgeon',
    room: 'Consultation Room 01 (ENT)',
  },
  {
    id: 'doc-2',
    name: 'Dr. Sneha Reddy',
    qualification: 'DLO, DNB (ENT)',
    specialty: 'Rhinology & Sinus Specialist',
    room: 'Consultation Room 02 (ENT)',
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Kulkarni',
    qualification: 'MS (ENT)',
    specialty: 'Head & Neck Surgeon',
    room: 'Consultation Room 03 (ENT)',
  },
  {
    id: 'doc-4',
    name: 'Dr. Ananya Rao',
    qualification: 'MBBS, DLO',
    specialty: 'Pediatric ENT Specialist',
    room: 'Consultation Room 04 (ENT)',
  },
];

export const TODAY_ISO_DATE = new Date().toISOString().split('T')[0];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  {
    id: 'staff-1',
    name: 'Pooja Sharma',
    role: 'Front Desk Coordinator',
    deskNumber: 'Counter 01',
    avatarUrl: RECEPTION_AVATAR_PATH,
    email: 'pooja.sharma@vamshient.org',
    shiftHours: '09:00 AM – 05:00 PM',
  },
  {
    id: 'staff-2',
    name: 'Deepak Rao',
    role: 'Outpatient Executive',
    deskNumber: 'Counter 02',
    avatarUrl: RECEPTION_AVATAR_PATH,
    email: 'deepak.rao@vamshient.org',
    shiftHours: '10:00 AM – 06:00 PM',
  },
  {
    id: 'staff-3',
    name: 'Kavita Verma',
    role: 'Evening Duty Desk Officer',
    deskNumber: 'Counter 01',
    avatarUrl: RECEPTION_AVATAR_PATH,
    email: 'kavita.verma@vamshient.org',
    shiftHours: '04:00 PM – 09:00 PM',
  },
];

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'p-101',
    uhid: 'VEH-10492',
    name: 'Rajesh Kumar',
    phone: '9845012345',
    gender: 'Male',
    age: 48,
    bloodGroup: 'B+',
    registeredDate: '15 Mar 2024',
    lastVisitDate: '12 Aug 2026',
    notes: 'Recurrent sinusitis & deviated nasal septum (DNS) evaluation.',
    totalVisits: 5,
  },
  {
    id: 'p-102',
    uhid: 'VEH-10518',
    name: 'Lakshmi Narayanan',
    phone: '9731298456',
    gender: 'Female',
    age: 62,
    bloodGroup: 'O+',
    registeredDate: '10 Jan 2023',
    lastVisitDate: '02 Sep 2026',
    notes: 'Age-related hearing loss (Presbycusis) and audiometry check.',
    totalVisits: 8,
  },
  {
    id: 'p-103',
    uhid: 'VEH-10640',
    name: 'Ananya Patel',
    phone: '9886034120',
    gender: 'Female',
    age: 29,
    bloodGroup: 'A+',
    registeredDate: '18 Nov 2025',
    lastVisitDate: '19 Sep 2026',
    notes: 'Acute throat pain, tonsillitis follow-up after antibiotic course.',
    totalVisits: 2,
  },
  {
    id: 'p-104',
    uhid: 'VEH-10702',
    name: 'Mohammed Farhan',
    phone: '9900145872',
    gender: 'Male',
    age: 36,
    bloodGroup: 'AB+',
    registeredDate: '28 Jun 2026',
    lastVisitDate: '28 Jun 2026',
    notes: 'Right ear cerumen impaction (earwax removal review).',
    totalVisits: 3,
  },
  {
    id: 'p-105',
    uhid: 'VEH-10789',
    name: 'Meenakshi Sundaram',
    phone: '9448055621',
    gender: 'Female',
    age: 54,
    bloodGroup: 'O-',
    registeredDate: '15 Feb 2023',
    lastVisitDate: '15 Sep 2026',
    notes: 'Persistent hoarseness of voice (laryngoscopy follow-up).',
    totalVisits: 4,
  },
  {
    id: 'p-106',
    uhid: 'VEH-10821',
    name: 'Karthik Viswanathan',
    phone: '9845187654',
    gender: 'Male',
    age: 33,
    bloodGroup: 'B+',
    registeredDate: '05 Sep 2025',
    lastVisitDate: '05 Sep 2026',
    notes: 'Tinnitus (ringing in ears) and sound sensitivity.',
    totalVisits: 1,
  },
  {
    id: 'p-107',
    uhid: 'VEH-10890',
    name: 'Sunita Deshmukh',
    phone: '9980243198',
    gender: 'Female',
    age: 41,
    bloodGroup: 'A-',
    registeredDate: '22 Jul 2024',
    lastVisitDate: '22 Jul 2026',
    notes: 'Allergic rhinitis and nasal blockage in morning hours.',
    totalVisits: 6,
  },
  {
    id: 'p-108',
    uhid: 'VEH-10944',
    name: 'Ramesh Babu',
    phone: '9880011223',
    gender: 'Male',
    age: 58,
    bloodGroup: 'O+',
    registeredDate: '20 Aug 2023',
    lastVisitDate: '20 Aug 2026',
    notes: 'Vertigo & balance disturbance (BPPV follow-up).',
    totalVisits: 7,
  },
];

// Today's Queue with only TWO statuses: 'waiting' and 'consulted'
export const INITIAL_TODAY_QUEUE: OPDEntry[] = [
  {
    id: 'opd-1',
    tokenNumber: 1,
    tokenDisplay: 'M-01',
    patientId: 'p-107',
    patientName: 'Sunita Deshmukh',
    phone: '9980243198',
    gender: 'Female',
    age: 41,
    appointmentDate: TODAY_ISO_DATE,
    session: 'morning',
    registeredTime: '11:05 AM',
    registeredTimestamp: Date.now() - 38 * 60 * 1000,
    createdBy: 'Pooja Sharma',
    status: 'consulted', // Automatically updated to Consulted after doctor saved prescription
    doctorAssigned: CONSULTING_DOCTOR,
    room: CONSULTING_ROOM,
    chiefComplaint: 'Allergic rhinitis & follow-up',
    extraNote: 'Previous prescription brought along',
    prescription: {
      uploadedAt: '11:32 AM',
      medicines: 'Tab Levocetirizine 5mg (1-0-1) x 5 days, Fluticasone Nasal Spray 2 puffs daily',
      doctorNotes: 'Nasal mucosa normal. Continue saline rinse twice daily.',
    },
  },
  {
    id: 'opd-2',
    tokenNumber: 2,
    tokenDisplay: 'M-02',
    patientId: 'p-102',
    patientName: 'Lakshmi Narayanan',
    phone: '9731298456',
    gender: 'Female',
    age: 62,
    appointmentDate: TODAY_ISO_DATE,
    session: 'morning',
    registeredTime: '11:15 AM',
    registeredTimestamp: Date.now() - 25 * 60 * 1000,
    createdBy: 'Pooja Sharma',
    status: 'waiting', // Waiting state
    doctorAssigned: CONSULTING_DOCTOR,
    room: CONSULTING_ROOM,
    chiefComplaint: 'Bilateral ear ringing & hearing check',
    extraNote: 'Senior citizen - needs wheelchair assistance',
  },
  {
    id: 'opd-3',
    tokenNumber: 3,
    tokenDisplay: 'M-03',
    patientId: 'p-101',
    patientName: 'Rajesh Kumar',
    phone: '9845012345',
    gender: 'Male',
    age: 48,
    appointmentDate: TODAY_ISO_DATE,
    session: 'morning',
    registeredTime: '11:28 AM',
    registeredTimestamp: Date.now() - 15 * 60 * 1000,
    createdBy: 'Pooja Sharma',
    status: 'waiting', // Waiting state
    doctorAssigned: CONSULTING_DOCTOR,
    room: CONSULTING_ROOM,
    chiefComplaint: 'Sinus headache & nasal blockage',
    extraNote: 'CT PNS scan report attached',
  },
  {
    id: 'opd-4',
    tokenNumber: 4,
    tokenDisplay: 'M-04',
    patientId: 'p-104',
    patientName: 'Mohammed Farhan',
    phone: '9900145872',
    gender: 'Male',
    age: 36,
    appointmentDate: TODAY_ISO_DATE,
    session: 'morning',
    registeredTime: '11:35 AM',
    registeredTimestamp: Date.now() - 5 * 60 * 1000,
    createdBy: 'Pooja Sharma',
    status: 'waiting', // Waiting state
    doctorAssigned: CONSULTING_DOCTOR,
    room: CONSULTING_ROOM,
    chiefComplaint: 'Ear ache & foreign body sensation',
  },
];

// Pool of daily quotations rotating smoothly across date cycles (every 5-6 days)
export const DAILY_INSPIRATIONAL_QUOTATIONS = [
  "“Wherever the art of medicine is loved, there is also a love of humanity.” — Hippocrates",
  "“The good physician treats the disease; the great physician treats the patient who has the disease.” — Sir William Osler",
  "“Caring is the essence of nursing and front-line healthcare.” — Jean Watson",
  "“To cure sometimes, to relieve often, to comfort always.” — Edward Livingston Trudeau",
  "“Kindness is the language which the deaf can hear and the blind can see.” — Mark Twain",
  "“Every patient who walks through our doors is someone’s entire world. Treat them with heart.” — Clinical Excellence Maxim",
];
