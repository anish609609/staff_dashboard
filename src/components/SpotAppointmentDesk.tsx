import React, { useState, useRef, useEffect } from 'react';
import { PatientRecord, SessionSlot, Gender, OPDEntry, StaffUser } from '../types/clinic';
import { X } from 'lucide-react';
import { playReceptionChime } from '../utils/audioChime';
import { TODAY_ISO_DATE, AVAILABLE_DOCTORS } from '../data/mockData';
import { calculateDynamicPatientAge } from '../utils/patientAge';
import { DoctorSelectDropdown, DateSessionRow } from './appointment-desk/DoctorSessionFields';
import { PatientInfoFields } from './appointment-desk/PatientInfoFields';
import { ComplaintTags } from './appointment-desk/ComplaintTags';
import { ExtraNotesField } from './appointment-desk/ExtraNotesField';
import { FormActions } from './appointment-desk/FormActions';

interface SpotAppointmentDeskProps {
  patients: PatientRecord[];
  todayQueue: OPDEntry[];
  currentStaff: StaffUser;
  onBookAppointment: (appointmentData: {
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
  }) => OPDEntry;
}

const COMMON_ENT_COMPLAINTS = [
  'Ear Pain',
  'Throat Pain',
  'Sinus & Cold',
  'Hearing Check',
  'Dizziness / Vertigo',
  'Voice Hoarseness',
];

export const SpotAppointmentDesk: React.FC<SpotAppointmentDeskProps> = ({
  patients,
  todayQueue,
  currentStaff: _currentStaff,
  onBookAppointment,
}) => {
  // Helper to determine corresponding session for a given date
  const getCorrespondingSessionForDate = (dateStr: string): SessionSlot => {
    if (dateStr === TODAY_ISO_DATE) {
      const currentHour = new Date().getHours();
      return currentHour < 16 ? 'morning' : 'evening';
    }
    return 'morning';
  };

  // Form states
  const [appointmentDate, setAppointmentDate] = useState<string>(TODAY_ISO_DATE);
  const [session, setSession] = useState<SessionSlot>(() => getCorrespondingSessionForDate(TODAY_ISO_DATE));
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [age, setAge] = useState('');
  const [ageAdjustmentNote, setAgeAdjustmentNote] = useState<string | null>(null);
  const [complaint, setComplaint] = useState('');
  const [extraNote, setExtraNote] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(AVAILABLE_DOCTORS[0].id);

  const currentDoctor = AVAILABLE_DOCTORS.find((d) => d.id === selectedDoctorId) || AVAILABLE_DOCTORS[0];
  const doctorAssigned = currentDoctor.name;
  const doctorRoom = currentDoctor.room;

  // Autocomplete popup states for Name AND Phone
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [nameMatches, setNameMatches] = useState<PatientRecord[]>([]);

  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneMatches, setPhoneMatches] = useState<PatientRecord[]>([]);

  // Validation & feedback
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});

  // Timed success toast notification (auto-dismiss after 3s)
  const [toastNotification, setToastNotification] = useState<{
    tokenDisplay: string;
    patientName: string;
  } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSuccessToast = (tokenDisplay: string, patientName: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastNotification({ tokenDisplay, patientName });
    toastTimeoutRef.current = setTimeout(() => {
      setToastNotification(null);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const namePopupRef = useRef<HTMLDivElement>(null);
  const phonePopupRef = useRef<HTMLDivElement>(null);

  // Multi-select quick tags handler for Reason for Visit / Complaint
  const handleToggleComplaintTag = (tag: string) => {
    const currentTags = complaint
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const exists = currentTags.some((t) => t.toLowerCase() === tag.toLowerCase());
    let updatedTags: string[];
    if (exists) {
      updatedTags = currentTags.filter((t) => t.toLowerCase() !== tag.toLowerCase());
    } else {
      updatedTags = [...currentTags, tag];
    }
    setComplaint(updatedTags.join(', '));
  };

  const isComplaintTagSelected = (tag: string) => {
    const currentTags = complaint
      .split(',')
      .map((t) => t.trim().toLowerCase());
    return currentTags.includes(tag.toLowerCase());
  };

  // Update session default when appointment date changes
  const handleDateChange = (newDate: string) => {
    setAppointmentDate(newDate);
    setSession(getCorrespondingSessionForDate(newDate));
  };

  // Focus patient name on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Close popups on clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        namePopupRef.current && 
        !namePopupRef.current.contains(target) &&
        nameInputRef.current &&
        !nameInputRef.current.contains(target)
      ) {
        setShowNamePopup(false);
      }

      if (
        phonePopupRef.current && 
        !phonePopupRef.current.contains(target) &&
        phoneInputRef.current &&
        !phoneInputRef.current.contains(target)
      ) {
        setShowPhonePopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time search when typing in Patient Name field
  const handleNameInputChange = (value: string) => {
    setPatientName(value);
    setSelectedPatientId(undefined);
    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));

    const query = value.trim().toLowerCase();
    if (query.length >= 2) {
      const matches = patients.filter((p) => p.name.toLowerCase().includes(query));
      setNameMatches(matches);
      setShowNamePopup(matches.length > 0);
    } else {
      setNameMatches([]);
      setShowNamePopup(false);
    }
  };

  // Real-time search when typing in Mobile Number field
  const handlePhoneInputChange = (value: string) => {
    setPhoneNumber(value);
    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));

    // If an existing patient is selected, keep selectedPatientId so updating their phone number
    // saves directly to their record and appointment, without intrusive search popups
    if (selectedPatientId) {
      setShowPhonePopup(false);
      return;
    }

    const cleanDigits = value.replace(/\D/g, '');
    if (cleanDigits.length >= 3) {
      const matches = patients.filter((p) => {
        const patientDigits = p.phone.replace(/\D/g, '');
        return patientDigits.includes(cleanDigits);
      });
      setPhoneMatches(matches);
      setShowPhonePopup(matches.length > 0);
    } else {
      setPhoneMatches([]);
      setShowPhonePopup(false);
    }
  };

  // When staff selects a patient from either autocomplete popup
  const handleSelectPatient = (patient: PatientRecord) => {
    const dynamicAgeInfo = calculateDynamicPatientAge(patient);
    setPatientName(patient.name);
    setPhoneNumber(patient.phone);
    setGender(patient.gender);
    setAge(dynamicAgeInfo.calculatedAge !== null ? String(dynamicAgeInfo.calculatedAge) : '');
    if (dynamicAgeInfo.hasAdjustment) {
      setAgeAdjustmentNote(
        `Current age calculated: ${dynamicAgeInfo.calculatedAge} (${patient.age} + ${dynamicAgeInfo.elapsedYears} yrs since ${dynamicAgeInfo.registrationYear})`
      );
    } else {
      setAgeAdjustmentNote(null);
    }
    setSelectedPatientId(patient.id);
    setShowNamePopup(false);
    setShowPhonePopup(false);
    setFormErrors({});
  };

  // Directly schedule today's appointment for the selected patient with 1 click
  const handleDirectScheduleToday = (patient: PatientRecord) => {
    const todaySession = getCorrespondingSessionForDate(TODAY_ISO_DATE);

    // Check if already in today's queue
    const alreadyRegistered = todayQueue.find(
      (e) => e.patientId === patient.id && e.appointmentDate === TODAY_ISO_DATE && e.status !== 'cancelled'
    );
    if (alreadyRegistered) {
      alert(`Patient is already in today's queue under Token #${alreadyRegistered.tokenDisplay} (${alreadyRegistered.status})`);
      return;
    }

    const dynamicAgeInfo = calculateDynamicPatientAge(patient);

    const newEntry = onBookAppointment({
      patientId: patient.id,
      name: patient.name,
      phone: patient.phone,
      gender: patient.gender,
      age: dynamicAgeInfo.calculatedAge,
      appointmentDate: TODAY_ISO_DATE,
      session: todaySession,
      doctorAssigned,
      room: doctorRoom,
      chiefComplaint: complaint.trim() || undefined,
      extraNote: extraNote.trim() || undefined,
    });

    playReceptionChime('success');
    triggerSuccessToast(newEntry.tokenDisplay, newEntry.patientName);
    resetForm();
  };

  // Submit appointment form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; phone?: string } = {};
    if (!patientName.trim()) {
      errors.name = 'Patient Name is required';
    }
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber.trim()) {
      errors.phone = 'Phone number is required';
    } else if (cleanDigits.length < 10) {
      errors.phone = 'Enter valid 10-digit number';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const parsedAge = age.trim() ? parseInt(age, 10) : null;

    const newEntry = onBookAppointment({
      patientId: selectedPatientId,
      name: patientName.trim(),
      phone: phoneNumber.trim(),
      gender,
      age: isNaN(parsedAge as number) ? null : parsedAge,
      appointmentDate: appointmentDate,
      session: session,
      doctorAssigned,
      room: doctorRoom,
      chiefComplaint: complaint.trim() || undefined,
      extraNote: extraNote.trim() || undefined,
    });

    playReceptionChime('success');
    triggerSuccessToast(newEntry.tokenDisplay, newEntry.patientName);
    resetForm();
  };

  const resetForm = () => {
    setPatientName('');
    setPhoneNumber('');
    setAge('');
    setAgeAdjustmentNote(null);
    setComplaint('');
    setExtraNote('');
    setSelectedPatientId(undefined);
    setGender('Male');
    setShowNamePopup(false);
    setShowPhonePopup(false);
    nameInputRef.current?.focus();
  };

  const isToday = appointmentDate === TODAY_ISO_DATE;

  return (
    <div className="space-y-4">
      {/* Timed Success Toast Notification (Auto-dismisses in 3 seconds) */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white border border-slate-700 rounded-full shadow-xl text-xs sm:text-sm font-medium animate-in fade-in slide-from-top-3 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <span>Appointment scheduled successfully!</span>
          <span className="text-slate-300 font-tabular font-semibold pl-1.5 border-l border-slate-700">
            #{toastNotification.tokenDisplay}
          </span>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            className="ml-1 p-0.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Appointment Creation Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-visible">
        <div className="px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Create Appointment
            </h3>
            <p className="text-xs font-bold text-slate-500">
              Defaults to today and corresponding session
            </p>
          </div>

          {/* Doctor Selection Dropdown */}
          <DoctorSelectDropdown
            selectedDoctorId={selectedDoctorId}
            availableDoctors={AVAILABLE_DOCTORS}
            onSelectDoctor={setSelectedDoctorId}
          />
        </div>

        {/* Appointment Form */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
          {/* Row 1: Date & Session */}
          <DateSessionRow
            appointmentDate={appointmentDate}
            session={session}
            isToday={isToday}
            onDateChange={handleDateChange}
            onSessionChange={setSession}
          />

          {/* Row 2 & 3: Patient Information Fields (Name, Phone, Gender, Age) */}
          <PatientInfoFields
            nameInputRef={nameInputRef}
            phoneInputRef={phoneInputRef}
            namePopupRef={namePopupRef}
            phonePopupRef={phonePopupRef}
            patientName={patientName}
            phoneNumber={phoneNumber}
            gender={gender}
            age={age}
            ageAdjustmentNote={ageAdjustmentNote}
            selectedPatientId={selectedPatientId}
            formErrors={formErrors}
            showNamePopup={showNamePopup}
            showPhonePopup={showPhonePopup}
            nameMatches={nameMatches}
            phoneMatches={phoneMatches}
            onNameChange={handleNameInputChange}
            onPhoneChange={handlePhoneInputChange}
            onGenderChange={setGender}
            onAgeChange={(val) => {
              setAge(val);
              setAgeAdjustmentNote(null);
            }}
            onFocusName={() => {
              if (nameMatches.length > 0 && patientName.trim().length >= 2) {
                setShowNamePopup(true);
              }
            }}
            onFocusPhone={() => {
              if (!selectedPatientId && phoneMatches.length > 0 && phoneNumber.trim().length >= 3) {
                setShowPhonePopup(true);
              }
            }}
            onSelectPatient={handleSelectPatient}
            onDirectScheduleToday={handleDirectScheduleToday}
          />

          {/* Row 4: Reason for Visit / Complaint (Multi-Select Quick Tags) */}
          <ComplaintTags
            complaint={complaint}
            commonComplaints={COMMON_ENT_COMPLAINTS}
            onToggleTag={handleToggleComplaintTag}
            isTagSelected={isComplaintTagSelected}
            onComplaintChange={setComplaint}
          />

          {/* Row 5: Extra Note / Remarks */}
          <ExtraNotesField
            extraNote={extraNote}
            onChange={setExtraNote}
          />

          {/* Form Actions */}
          <FormActions
            onClear={resetForm}
          />
        </form>
      </div>
    </div>
  );
};
