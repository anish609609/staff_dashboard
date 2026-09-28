/**
 * Vamshi ENT Hospital - Reception Desk
 * Powered by AshwiniCare
 * Ultra-Focused Desk: Create Appointments + View Current Day's Queue (Strictly Read-Only)
 */

import React, { useState, useEffect } from 'react';
import { 
  PatientRecord, 
  OPDEntry, 
  StaffUser, 
  SessionSlot, 
  Gender
} from './types/clinic';
import { 
  INITIAL_STAFF_USERS, 
  INITIAL_PATIENTS, 
  INITIAL_TODAY_QUEUE,
  CONSULTING_DOCTOR,
  CONSULTING_ROOM,
  HOSPITAL_NAME,
  TODAY_ISO_DATE
} from './data/mockData';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { SpotAppointmentDesk } from './components/SpotAppointmentDesk';
import { LiveOpdQueueTable } from './components/LiveOpdQueueTable';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';

export default function App() {
  const [currentStaff, setCurrentStaff] = useState<StaffUser>(INITIAL_STAFF_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Patients registry with LocalStorage persistence
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vamshi_ent_patients_v5');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // Scheduled queue with LocalStorage persistence
  const [queue, setQueue] = useState<OPDEntry[]>(() => {
    try {
      const saved = localStorage.getItem('vamshi_ent_queue_v5');
      return saved ? JSON.parse(saved) : INITIAL_TODAY_QUEUE;
    } catch {
      return INITIAL_TODAY_QUEUE;
    }
  });

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('vamshi_ent_patients_v5', JSON.stringify(patients));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('vamshi_ent_queue_v5', JSON.stringify(queue));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [queue]);

  const getNowFormatted = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Calculate next sequential token for the date and session
  const getNextToken = (dateStr: string, session: SessionSlot) => {
    const matchingEntries = queue.filter(
      (e) => e.appointmentDate === dateStr && e.session === session
    );
    const maxNum = matchingEntries.reduce(
      (max, e) => (e.tokenNumber > max ? e.tokenNumber : max),
      0
    );
    const nextNum = maxNum + 1;
    const prefix = session === 'morning' ? 'M' : 'E';
    const display = `${prefix}-${String(nextNum).padStart(2, '0')}`;
    return { tokenNumber: nextNum, tokenDisplay: display };
  };

  // Create appointment handler (Defaults strictly to 'waiting'; staff cannot modify status)
  const handleBookAppointment = (appointmentData: {
    patientId?: string;
    name: string;
    phone: string;
    gender: Gender;
    age: number | null;
    appointmentDate: string;
    session: SessionSlot;
    doctorAssigned?: string;
    room?: string;
    chiefComplaint?: string;
    extraNote?: string;
  }): OPDEntry => {
    let resolvedPatientId = appointmentData.patientId;
    const todayDisplayDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (!resolvedPatientId) {
      resolvedPatientId = `p-${Date.now()}`;
      const generatedUHID = `VEH-${Math.floor(10000 + Math.random() * 90000)}`;

      const newPatientRecord: PatientRecord = {
        id: resolvedPatientId,
        uhid: generatedUHID,
        name: appointmentData.name,
        phone: appointmentData.phone,
        gender: appointmentData.gender,
        age: appointmentData.age,
        registeredDate: todayDisplayDate,
        lastVisitDate: todayDisplayDate,
        totalVisits: 1,
      };

      setPatients((prev) => [newPatientRecord, ...prev]);
    } else {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === resolvedPatientId
            ? {
                ...p,
                name: appointmentData.name,
                phone: appointmentData.phone,
                gender: appointmentData.gender,
                age: appointmentData.age ?? p.age,
                lastVisitDate: todayDisplayDate,
                totalVisits: p.totalVisits + 1,
              }
            : p
        )
      );
    }

    const { tokenNumber, tokenDisplay } = getNextToken(
      appointmentData.appointmentDate,
      appointmentData.session
    );

    // Initial status is strictly 'waiting'
    const newOpdEntry: OPDEntry = {
      id: `opd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tokenNumber,
      tokenDisplay,
      patientId: resolvedPatientId,
      patientName: appointmentData.name,
      phone: appointmentData.phone,
      gender: appointmentData.gender,
      age: appointmentData.age,
      appointmentDate: appointmentData.appointmentDate,
      session: appointmentData.session,
      registeredTime: getNowFormatted(),
      registeredTimestamp: Date.now(),
      createdBy: currentStaff.name,
      status: 'waiting',
      doctorAssigned: appointmentData.doctorAssigned || CONSULTING_DOCTOR,
      room: appointmentData.room || CONSULTING_ROOM,
      chiefComplaint: appointmentData.chiefComplaint || undefined,
      extraNote: appointmentData.extraNote || undefined,
    };

    setQueue((prev) => [newOpdEntry, ...prev]);
    return newOpdEntry;
  };

  // If staff logs out, display Login Screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        staffList={INITIAL_STAFF_USERS}
        onLogin={(staff) => {
          setCurrentStaff(staff);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Header: Vamshi ENT Hospital / powered by AshwiniCare */}
      <Header
        currentStaff={currentStaff}
        staffList={INITIAL_STAFF_USERS}
        onSelectStaff={setCurrentStaff}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* 2. Welcome Banner: Large Typography Greeting, Staff Name, Dynamic Date Quotation */}
      <WelcomeBanner
        currentStaff={currentStaff}
      />

      {/* Main Reception Workspace: ONLY Create Appointments + View Current Day's Queue */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-5 sm:space-y-6">
        {/* CREATE APPOINTMENT FORM */}
        <section aria-label="Create Appointment Desk">
          <SpotAppointmentDesk
            patients={patients}
            todayQueue={queue}
            currentStaff={currentStaff}
            onBookAppointment={handleBookAppointment}
          />
        </section>

        {/* CURRENT DAY'S QUEUE ONLY (Strictly Read-Only, No Actions Column) */}
        <section aria-label="Today Live OPD Queue Table">
          <LiveOpdQueueTable queue={queue} />
        </section>
      </main>

      {/* Footer: Centered layout with enhanced typography */}
      <Footer />
    </div>
  );
}
