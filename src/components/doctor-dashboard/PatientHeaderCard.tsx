import React from 'react';
import { OPDEntry, PatientRecord } from '../../types/clinic';
import { X, ShieldCheck, Phone } from 'lucide-react';

interface PatientHeaderCardProps {
  entry: OPDEntry;
  patient?: PatientRecord;
  isConsulted: boolean;
  onClose: () => void;
}

export const PatientHeaderCard: React.FC<PatientHeaderCardProps> = ({
  entry,
  patient,
  isConsulted,
  onClose,
}) => {
  return (
    <>
      {/* 1. CLEAN TOP HEADER BAR */}
      <div className="px-4 py-3 sm:px-5 sm:py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Token Number */}
          <span
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-extrabold font-tabular shrink-0 shadow-2xs ${
              entry.session === 'morning'
                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                : 'bg-indigo-100 text-indigo-950 border border-indigo-300'
            }`}
          >
            #{entry.tokenDisplay}
          </span>

          {/* Patient Name, Demographics, and UHID */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-950 truncate leading-snug">
              {entry.patientName}
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-500 font-tabular font-medium">
              ({entry.gender}, {entry.age ? `${entry.age}y` : 'Age N/A'})
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 font-tabular bg-slate-100 px-1.5 py-0.5 sm:px-2 rounded border border-slate-200">
              UHID: <strong className="text-slate-800">{patient?.uhid || 'VEH-Pending'}</strong>
            </span>
          </div>
        </div>

        {/* Right Header Controls: Status Badge & Close 'X' */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isConsulted ? (
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 sm:px-2.5 py-1 rounded-lg font-tabular">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Consulted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 sm:px-2.5 py-1 rounded-lg font-tabular">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Waiting
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close window"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* 2. PATIENT DETAILS BOX (Single Vertical Card with Clinical Focus) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs space-y-2 text-xs text-slate-700">
        {/* Visit Reason */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
          <span className="font-semibold text-slate-500 shrink-0 sm:w-28 text-[11px] sm:text-xs">
            Visit Reason:
          </span>
          <span className="font-bold text-slate-900 text-xs sm:text-sm">
            {entry.chiefComplaint || 'General ENT Consultation'}
          </span>
        </div>

        {/* Remarks / Extra Note: Rendered ONLY if present */}
        {entry.extraNote && (
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 text-amber-950">
            <span className="font-bold text-amber-900 shrink-0 sm:w-28 text-[11px] sm:text-xs">
              Remarks:
            </span>
            <span className="font-medium text-xs sm:text-sm">{entry.extraNote}</span>
          </div>
        )}

        {/* Contact Phone Number */}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 pt-1 border-t border-slate-100">
          <span className="font-semibold text-slate-500 shrink-0 sm:w-28 text-[11px] sm:text-xs">
            Contact:
          </span>
          <a
            href={`tel:+91${entry.phone}`}
            className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline font-tabular text-xs sm:text-sm inline-flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>+91 {entry.phone}</span>
          </a>
        </div>
      </div>
    </>
  );
};
