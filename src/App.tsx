/**
 * Vamshi ENT Hospital - Outpatient Consultation & Reception System
 * Powered by AshwiniCare
 * Doctor Dashboard (OPDs + Analytics) & Staff Reception Desk
 */

import React, { useState, useEffect } from 'react';
import { 
  PatientRecord, 
  OPDEntry, 
  StaffUser, 
  DoctorUser,
  UserRole,
  SessionSlot, 
  Gender,
  ConsultationRecord
} from './types/clinic';
import { 
  INITIAL_STAFF_USERS, 
  INITIAL_DOCTORS,
  INITIAL_PATIENTS, 
  INITIAL_TODAY_QUEUE,
  HISTORICAL_OPD_ENTRIES,
  CONSULTING_DOCTOR,
  CONSULTING_ROOM,
  HOSPITAL_NAME,
  TODAY_ISO_DATE
} from './data/mockData';
import { Header } from './components/Header';
import { DoctorHeader } from './components/doctor-dashboard/DoctorHeader';
import { DoctorDashboard } from './components/doctor-dashboard/DoctorDashboard';
import { StaffDashboard } from './components/staff-dashboard/StaffDashboard';
import { LoginScreen } from './components/LoginScreen';
import { Footer } from './components/Footer';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('doctor');
  const [currentDoctor, setCurrentDoctor] = useState<DoctorUser>(INITIAL_DOCTORS[0]);
  const [currentStaff, setCurrentStaff] = useState<StaffUser>(INITIAL_STAFF_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Patients registry with LocalStorage persistence
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vamshi_ent_patients_v6');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  // Scheduled queue with LocalStorage persistence
  const [queue, setQueue] = useState<OPDEntry[]>(() => {
    try {
      const saved = localStorage.getItem('vamshi_ent_queue_v6');
      return saved ? JSON.parse(saved) : INITIAL_TODAY_QUEUE;
    } catch {
      return INITIAL_TODAY_QUEUE;
    }
  });

  // Clinical Consultation records with LocalStorage persistence
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('vamshi_ent_consultations_v6');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('vamshi_ent_patients_v6', JSON.stringify(patients));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('vamshi_ent_queue_v6', JSON.stringify(queue));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [queue]);

  useEffect(() => {
    try {
      localStorage.setItem('vamshi_ent_consultations_v6', JSON.stringify(consultations));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [consultations]);

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

  // Create appointment handler (Defaults to 'waiting')
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
      doctorAssigned: appointmentData.doctorAssigned || currentDoctor.name || CONSULTING_DOCTOR,
      room: appointmentData.room || currentDoctor.room || CONSULTING_ROOM,
      chiefComplaint: appointmentData.chiefComplaint || undefined,
      extraNote: appointmentData.extraNote || undefined,
    };

    setQueue((prev) => [newOpdEntry, ...prev]);
    return newOpdEntry;
  };

  // Update status (strictly 'waiting' or 'consulted')
  const handleUpdateOpdStatus = (
    opdId: string,
    newStatus: 'waiting' | 'consulted'
  ) => {
    setQueue((prev) =>
      prev.map((entry) => (entry.id === opdId ? { ...entry, status: newStatus } : entry))
    );
  };

  // Complete consultation: save Rx, update patient history, update queue status
  const handleSaveConsultation = (
    consultation: ConsultationRecord,
    updatedEntry: OPDEntry,
    updatedPatient: PatientRecord
  ) => {
    setQueue((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );

    setPatients((prev) => {
      const exists = prev.some((p) => p.id === updatedPatient.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p));
      }
      return [updatedPatient, ...prev];
    });

    setConsultations((prev) => [consultation, ...prev]);
  };

  // If user logs out, display Login Screen
  if (!isLoggedIn) {
    return (
      <LoginScreen
        staffList={INITIAL_STAFF_USERS}
        doctorList={INITIAL_DOCTORS}
        onLoginDoctor={(doctor) => {
          setCurrentDoctor(doctor);
          setUserRole('doctor');
          setIsLoggedIn(true);
        }}
        onLoginStaff={(staff) => {
          setCurrentStaff(staff);
          setUserRole('staff');
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* 1. Header: Matches exact style ("Vamshi ENT Hospital" powered by "AshwiniCare") */}
      {userRole === 'doctor' ? (
        <DoctorHeader
          currentDoctor={currentDoctor}
          availableDoctors={INITIAL_DOCTORS}
          onSelectDoctor={setCurrentDoctor}
          onSwitchToStaff={() => setUserRole('staff')}
          onLogout={() => setIsLoggedIn(false)}
        />
      ) : (
        <Header
          currentStaff={currentStaff}
          staffList={INITIAL_STAFF_USERS}
          onSelectStaff={setCurrentStaff}
          onSwitchToDoctor={() => setUserRole('doctor')}
          onLogout={() => setIsLoggedIn(false)}
        />
      )}

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
        {userRole === 'doctor' ? (
          <DoctorDashboard
            currentDoctor={currentDoctor}
            queue={queue}
            historicalQueue={HISTORICAL_OPD_ENTRIES}
            patients={patients}
            onUpdateOpdStatus={handleUpdateOpdStatus}
            onSaveConsultation={handleSaveConsultation}
          />
        ) : (
          <StaffDashboard
            currentStaff={currentStaff}
            patients={patients}
            queue={queue}
            onBookAppointment={handleBookAppointment}
          />
        )}
      </main>

      {/* Footer: Centered layout with enhanced typography */}
      <Footer />
    </div>
  );
}
