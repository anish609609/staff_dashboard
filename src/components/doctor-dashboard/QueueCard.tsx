import React from 'react';
import { OPDEntry } from '../../types/clinic';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface QueueCardProps {
  entry: OPDEntry;
  isSelected: boolean;
  onSelect: (entry: OPDEntry) => void;
}

export const QueueCard: React.FC<QueueCardProps> = ({
  entry,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(entry)}
      className={`p-4 sm:p-4.5 rounded-xl border text-left transition-all cursor-pointer relative shadow-2xs ${
        isSelected
          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
      style={{ backgroundImage: 'none' }}
    >
      {/* Active Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-600 rounded-r-md" />
      )}

      {/* 1. Top Line: Token Number on the left, with Status Badge beside it on the right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs sm:text-sm font-extrabold font-tabular tracking-wide shrink-0 shadow-2xs ${
              entry.session === 'morning'
                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                : 'bg-indigo-100 text-indigo-950 border border-indigo-300'
            }`}
          >
            #{entry.tokenDisplay}
          </span>

          {/* Status Badge beside Token Number */}
          {entry.status === 'waiting' && (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-tabular">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Waiting
            </span>
          )}
          {entry.status === 'consulted' && (
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-tabular">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Consulted
            </span>
          )}
        </div>

        <ChevronRight
          className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-300 ml-0.5 sm:ml-1 shrink-0 ${
            isSelected ? 'text-emerald-700' : ''
          }`}
        />
      </div>

      {/* 2. Second Line: Patient Name on its own line below the token number */}
      <h3 className="text-sm sm:text-base font-extrabold text-slate-950 truncate leading-snug mt-2.5">
        {entry.patientName}
      </h3>

      {/* 3. Third Line: Gender & Age on its own line below the name */}
      <div className="text-xs text-slate-500 font-medium font-tabular mt-0.5">
        <span>{entry.gender}</span>
        <span className="mx-1">·</span>
        <span>{entry.age ? `${entry.age}y` : 'Age N/A'}</span>
      </div>

      {/* 4. Fourth Line: Chief Complaint on its own line below the gender/age */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700 truncate">
        {entry.chiefComplaint ? (
          <span className="text-slate-800">
            <span className="text-slate-400 font-normal">Complaint: </span>
            <span className="font-medium">{entry.chiefComplaint}</span>
          </span>
        ) : (
          <span className="text-slate-400 italic">General ENT checkup</span>
        )}
      </div>
    </div>
  );
};
