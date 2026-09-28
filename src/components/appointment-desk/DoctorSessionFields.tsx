import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DoctorProfile } from '../../data/mockData';
import { SessionSlot } from '../../types/clinic';

interface DoctorSelectProps {
  selectedDoctorId: string;
  availableDoctors: DoctorProfile[];
  onSelectDoctor: (doctorId: string) => void;
}

export const DoctorSelectDropdown: React.FC<DoctorSelectProps> = ({
  selectedDoctorId,
  availableDoctors,
  onSelectDoctor,
}) => {
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <label htmlFor="doctor-select" className="text-xs font-bold text-slate-700 whitespace-nowrap shrink-0">
        Doctor:
      </label>
      <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
        <select
          id="doctor-select"
          value={selectedDoctorId}
          onChange={(e) => onSelectDoctor(e.target.value)}
          className="appearance-none pr-8 text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md pl-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs w-full sm:w-auto min-h-[38px]"
        >
          {availableDoctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

interface DateSessionRowProps {
  appointmentDate: string;
  session: SessionSlot;
  isToday: boolean;
  onDateChange: (newDate: string) => void;
  onSessionChange: (newSession: SessionSlot) => void;
}

export const DateSessionRow: React.FC<DateSessionRowProps> = ({
  appointmentDate,
  session,
  isToday,
  onDateChange,
  onSessionChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
      {/* Appointment Date */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Appointment Date
        </label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-tabular"
        />
        <span className="text-[11px] text-slate-500 mt-1 block">
          {isToday ? 'Today' : 'Advance booking for selected date'}
        </span>
      </div>

      {/* Session Slot */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Session
        </label>
        <div className="relative">
          <select
            value={session}
            onChange={(e) => onSessionChange(e.target.value as SessionSlot)}
            className="appearance-none pr-8 w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 cursor-pointer"
          >
            <option value="morning">Morning OPD (11:00 AM – 3:00 PM)</option>
            <option value="evening">Evening OPD (6:00 PM – 8:00 PM)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <span className="text-[11px] text-slate-500 mt-1 block">
          Session auto-selected (change if needed)
        </span>
      </div>
    </div>
  );
};
