import React, { useState, useEffect, useRef } from 'react';
import { PatientRecord, SessionSlot, Gender, OPDEntry, DoctorUser } from '../../types/clinic';
import { X, UserPlus } from 'lucide-react';
import { TODAY_ISO_DATE } from '../../data/mockData';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoctor: DoctorUser;
  patients: PatientRecord[];
  todayQueue: OPDEntry[];
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
  onSuccess?: (newEntry: OPDEntry) => void;
}

const COMMON_COMPLAINTS = [
  'Ear Pain / Discharge',
  'Throat Pain & Tonsils',
  'Sinusitis & Blocked Nose',
  'Hearing Loss Check',
  'Dizziness / Vertigo',
  'Routine Follow-up',
];

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  currentDoctor,
  patients,
  onBookAppointment,
  onSuccess,
}) => {
  // Determine current active session
  const getCurrentSession = (): SessionSlot => {
    return new Date().getHours() < 16 ? 'morning' : 'evening';
  };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [age, setAge] = useState('');
  const [session, setSession] = useState<SessionSlot>(getCurrentSession());
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);

  // Autocomplete matching
  const [nameMatches, setNameMatches] = useState<PatientRecord[]>([]);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [phoneMatches, setPhoneMatches] = useState<PatientRecord[]>([]);
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false);

  // Validation
  const [errors, setErrors] = useState<{ name?: string; phone?: string; age?: string }>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setGender('Male');
      setAge('');
      setSession(getCurrentSession());
      setChiefComplaint('');
      setSelectedPatientId(undefined);
      setErrors({});
      setNameMatches([]);
      setPhoneMatches([]);
    }
  }, [isOpen]);

  // Lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Autocomplete by name
  const handleNameChange = (val: string) => {
    setName(val);
    setSelectedPatientId(undefined);
    if (val.trim().length >= 2) {
      const q = val.toLowerCase().trim();
      const matches = patients
        .filter((p) => p.name.toLowerCase().includes(q))
        .slice(0, 5);
      setNameMatches(matches);
      setShowNameDropdown(matches.length > 0);
    } else {
      setNameMatches([]);
      setShowNameDropdown(false);
    }
  };

  // Autocomplete by phone
  const handlePhoneChange = (val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 10);
    setPhone(numeric);
    setSelectedPatientId(undefined);
    if (numeric.length >= 3) {
      const matches = patients
        .filter((p) => p.phone.includes(numeric))
        .slice(0, 5);
      setPhoneMatches(matches);
      setShowPhoneDropdown(matches.length > 0);
    } else {
      setPhoneMatches([]);
      setShowPhoneDropdown(false);
    }
  };

  const selectPatient = (patient: PatientRecord) => {
    setSelectedPatientId(patient.id);
    setName(patient.name);
    setPhone(patient.phone);
    setGender(patient.gender);
    setAge(patient.age ? patient.age.toString() : '');
    setShowNameDropdown(false);
    setShowPhoneDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; phone?: string; age?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Patient name is required';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 10) {
      newErrors.phone = 'Enter valid 10-digit mobile number';
    }

    const parsedAge = age ? parseInt(age, 10) : null;
    if (age && (isNaN(parsedAge!) || parsedAge! < 0 || parsedAge! > 120)) {
      newErrors.age = 'Enter valid age (0-120)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newEntry = onBookAppointment({
      patientId: selectedPatientId,
      name: name.trim(),
      phone: phone.trim(),
      gender,
      age: parsedAge,
      appointmentDate: TODAY_ISO_DATE,
      session,
      doctorAssigned: currentDoctor.name,
      room: currentDoctor.room,
      chiefComplaint: chiefComplaint.trim() || undefined,
    });

    if (onSuccess) {
      onSuccess(newEntry);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden overscroll-contain animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950">
                Add New Appointment
              </h3>
              <p className="text-xs text-slate-500">
                Register a patient directly to Dr. {currentDoctor.name}'s OPD queue
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Patient Name with Autocomplete */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Patient Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Ramesh Kulkarni"
              className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-medium mt-0.5">{errors.name}</p>
            )}

            {/* Name Autocomplete Dropdown */}
            {showNameDropdown && nameMatches.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden text-xs max-h-48 overflow-y-auto"
              >
                <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Existing Patient Records ({nameMatches.length})
                </div>
                {nameMatches.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => selectPatient(p)}
                    className="p-2.5 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-none flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500 font-tabular">
                        {p.gender}, {p.age ? `${p.age}y` : 'Age N/A'} · +91 {p.phone}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {p.uhid}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Phone Number with Autocomplete */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Contact Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs text-slate-400 font-bold">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="98765 43210"
                maxLength={10}
                className={`w-full pl-12 pr-3.5 py-2 text-xs bg-slate-50 border rounded-xl text-slate-900 font-tabular font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors ${
                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-rose-600 font-medium mt-0.5">{errors.phone}</p>
            )}

            {/* Phone Autocomplete Dropdown */}
            {showPhoneDropdown && phoneMatches.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden text-xs max-h-48 overflow-y-auto">
                <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Matching Phone Records ({phoneMatches.length})
                </div>
                {phoneMatches.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => selectPatient(p)}
                    className="p-2.5 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 last:border-none flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500 font-tabular">+91 {p.phone}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Select
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Demographics: Gender & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Gender</label>
              <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
                {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      gender === g ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Age (Years)</label>
              <input
                type="number"
                min={0}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 42"
                className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl text-slate-900 font-tabular font-medium placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors ${
                  errors.age ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              {errors.age && (
                <p className="text-[11px] text-rose-600 font-medium mt-0.5">{errors.age}</p>
              )}
            </div>
          </div>

          {/* OPD Session Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              OPD Session Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSession('morning')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  session === 'morning'
                    ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-950">Morning OPD</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded">
                    09:00 AM - 01:00 PM
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSession('evening')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  session === 'evening'
                    ? 'border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-400'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-950">Evening OPD</span>
                  <span className="text-[10px] font-bold text-indigo-800 bg-indigo-200/60 px-1.5 py-0.5 rounded">
                    04:00 PM - 08:00 PM
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Chief Complaint / Reason for Visit */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Chief Complaint / Reason for Visit
            </label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="e.g. Acute tonsillitis with fever"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {COMMON_COMPLAINTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChiefComplaint(c)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Confirm &amp; Add to Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
