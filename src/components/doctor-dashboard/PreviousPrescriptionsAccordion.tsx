import React, { useState } from 'react';
import { PastVisitRecord } from '../../types/clinic';
import { History, ChevronDown, ZoomIn } from 'lucide-react';

interface PreviousPrescriptionsAccordionProps {
  pastVisits: PastVisitRecord[];
  onZoomPrescription: (preview: { url: string; title: string; date: string }) => void;
}

export const PreviousPrescriptionsAccordion: React.FC<PreviousPrescriptionsAccordionProps> = ({
  pastVisits,
  onZoomPrescription,
}) => {
  const [showPastPrescriptions, setShowPastPrescriptions] = useState(false);

  if (pastVisits.length === 0) return null;

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={() => setShowPastPrescriptions(!showPastPrescriptions)}
        className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-teal-600" />
          <span>Previous Prescriptions ({pastVisits.length})</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold">
          <span>{showPastPrescriptions ? 'Hide Past Prescriptions' : 'View Past Prescriptions'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showPastPrescriptions ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {showPastPrescriptions && (
        <div className="p-3 sm:p-3.5 space-y-2.5 bg-white border-t border-slate-100 animate-in fade-in duration-150">
          {pastVisits.map((visit) => (
            <div
              key={visit.id}
              className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2.5 text-xs"
            >
              {/* 1. Visit Date (timestamp) & Zoom Slip action */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-slate-900 font-tabular text-xs">
                  {visit.date}
                </span>
                {visit.prescriptionUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onZoomPrescription({
                        url: visit.prescriptionUrl!,
                        title: visit.prescriptionFileName || `Rx_${visit.date}`,
                        date: visit.date,
                      })
                    }
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <ZoomIn className="w-3 h-3 text-emerald-600" />
                    <span>Zoom Slip</span>
                  </button>
                )}
              </div>

              {/* 2. Doctor's Note / Diagnosis text */}
              {(visit.diagnosis || visit.notes) && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-slate-800 leading-relaxed font-medium">
                  {visit.diagnosis || visit.notes}
                </div>
              )}

              {/* 3. Photo / Image preview of the past prescription (with click-to-zoom lightbox) */}
              {visit.prescriptionUrl && (
                <div className="flex items-center gap-2.5 pt-0.5">
                  <div
                    onClick={() =>
                      onZoomPrescription({
                        url: visit.prescriptionUrl!,
                        title: visit.prescriptionFileName || `Rx_${visit.date}`,
                        date: visit.date,
                      })
                    }
                    className="relative w-14 h-16 rounded-lg bg-white border border-slate-300 overflow-hidden shadow-2xs cursor-pointer group hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                    title="Click to inspect full document slip"
                  >
                    <img
                      src={visit.prescriptionUrl}
                      alt="Prescription preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 flex items-center justify-center transition-colors">
                      <ZoomIn className="w-4 h-4 text-white opacity-80 group-hover:opacity-100" />
                    </div>
                  </div>

                  <div className="min-w-0 text-slate-500 text-[11px]">
                    <p className="font-semibold text-slate-800 truncate">
                      {visit.prescriptionFileName || 'Prescription Slip'}
                    </p>
                    <p className="text-[10px] text-slate-400">Tap thumbnail to inspect full slip</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
