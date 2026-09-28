import React, { RefObject } from 'react';
import { Gender, PatientRecord } from '../../types/clinic';
import { calculateDynamicPatientAge } from '../../utils/patientAge';

interface PatientInfoFieldsProps {
  nameInputRef: RefObject<HTMLInputElement | null>;
  phoneInputRef: RefObject<HTMLInputElement | null>;
  namePopupRef: RefObject<HTMLDivElement | null>;
  phonePopupRef: RefObject<HTMLDivElement | null>;
  patientName: string;
  phoneNumber: string;
  gender: Gender;
  age: string;
  ageAdjustmentNote?: string | null;
  selectedPatientId?: string;
  formErrors: { name?: string; phone?: string };
  showNamePopup: boolean;
  showPhonePopup: boolean;
  nameMatches: PatientRecord[];
  phoneMatches: PatientRecord[];
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onGenderChange: (gender: Gender) => void;
  onAgeChange: (value: string) => void;
  onFocusName: () => void;
  onFocusPhone: () => void;
  onSelectPatient: (patient: PatientRecord) => void;
  onDirectScheduleToday: (patient: PatientRecord) => void;
}

// Helper to format phone with +91 country code and spacing e.g. +91 98450 12345
const formatPhoneWithCode = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return `+91 ${phone}`;
};

export const PatientInfoFields: React.FC<PatientInfoFieldsProps> = ({
  nameInputRef,
  phoneInputRef,
  namePopupRef,
  phonePopupRef,
  patientName,
  phoneNumber,
  gender,
  age,
  ageAdjustmentNote,
  selectedPatientId,
  formErrors,
  showNamePopup,
  showPhonePopup,
  nameMatches,
  phoneMatches,
  onNameChange,
  onPhoneChange,
  onGenderChange,
  onAgeChange,
  onFocusName,
  onFocusPhone,
  onSelectPatient,
  onDirectScheduleToday,
}) => {
  return (
    <>
      {/* Row 2: Patient Name & Mobile Number (Both with Real-Time Autocomplete Match) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field A: Patient Name with Auto-complete Pop-up */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Patient Full Name <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              ref={nameInputRef}
              type="text"
              value={patientName}
              onChange={(e) => onNameChange(e.target.value)}
              onFocus={onFocusName}
              placeholder="Type to create or search existing records..."
              autoComplete="off"
              className={`w-full min-w-0 px-2.5 sm:px-3 py-2 bg-white border rounded-md text-[11px] sm:text-xs text-slate-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder-slate-400 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900 ${
                formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
            {selectedPatientId && (
              <span className="absolute right-2.5 top-2 text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                Existing Record
              </span>
            )}
          </div>

          {formErrors.name && (
            <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.name}</p>
          )}

          {/* POP-UP: Matching patient names */}
          {showNamePopup && nameMatches.length > 0 && (
            <div
              ref={namePopupRef}
              className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-600 flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
                <span>Matched by Name ({nameMatches.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Click to fill</span>
              </div>

              {nameMatches.map((p) => {
                const dynamicAge = calculateDynamicPatientAge(p);
                return (
                  <div
                    key={p.id}
                    className="p-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPatient(p)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {p.name} <span className="font-semibold text-slate-600 font-tabular text-[11px]">({formatPhoneWithCode(p.phone)})</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-tabular">
                          · {p.gender}, {dynamicAge.calculatedAge ? `${dynamicAge.calculatedAge}y` : '—'}
                        </span>
                        {dynamicAge.hasAdjustment && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-tabular font-medium">
                            +{dynamicAge.elapsedYears}y (Reg: {dynamicAge.registrationYear})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-tabular flex items-center gap-2 mt-0.5">
                        <span>UHID: {p.uhid}</span>
                        <span>·</span>
                        <span>Last Visit: {p.lastVisitDate}</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDirectScheduleToday(p)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-semibold shrink-0 transition-colors cursor-pointer"
                    >
                      Book Today
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Field B: Mobile Number with Auto-complete Pop-up */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Mobile Number <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-tabular font-semibold">
              +91
            </div>
            <input
              ref={phoneInputRef}
              type="tel"
              maxLength={12}
              value={phoneNumber}
              onChange={(e) => onPhoneChange(e.target.value)}
              onFocus={onFocusPhone}
              placeholder="Type to create or search existing records.."
              autoComplete="off"
              className={`w-full min-w-0 pl-10 pr-2.5 py-2 bg-white border rounded-md text-[11px] sm:text-xs text-slate-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder-slate-400 font-tabular font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900 ${
                formErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
              }`}
            />
          </div>

          {formErrors.phone && (
            <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.phone}</p>
          )}

          {/* POP-UP: Matching Phone Numbers */}
          {showPhonePopup && phoneMatches.length > 0 && (
            <div
              ref={phonePopupRef}
              className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-600 flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
                <span>Matched by Phone ({phoneMatches.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Distinguish identical names</span>
              </div>

              {phoneMatches.map((p) => {
                const dynamicAge = calculateDynamicPatientAge(p);
                return (
                  <div
                    key={p.id}
                    className="p-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPatient(p)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {p.name} <span className="font-semibold text-slate-600 font-tabular text-[11px]">({formatPhoneWithCode(p.phone)})</span>
                        </span>
                        <span className="text-[11px] text-slate-500 font-tabular">
                          · {p.gender}, {dynamicAge.calculatedAge ? `${dynamicAge.calculatedAge}y` : '—'}
                        </span>
                        {dynamicAge.hasAdjustment && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-tabular font-medium">
                            +{dynamicAge.elapsedYears}y (Reg: {dynamicAge.registrationYear})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-tabular flex items-center gap-2 mt-0.5">
                        <span>UHID: {p.uhid}</span>
                        <span>·</span>
                        <span>Last Visit: {p.lastVisitDate}</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDirectScheduleToday(p)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-semibold shrink-0 transition-colors cursor-pointer"
                    >
                      Book Today
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Gender & Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Gender
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md">
            {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGenderChange(g)}
                className={`py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer ${
                  gender === g
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Age <span className="text-slate-400 font-normal"></span>
            </label>
            {ageAdjustmentNote && (
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-tabular">
                {ageAdjustmentNote}
              </span>
            )}
          </div>
          <input
            type="number"
            min={0}
            max={120}
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            placeholder="e.g. 42"
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-900 font-tabular focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>
    </>
  );
};
