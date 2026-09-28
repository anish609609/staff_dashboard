import React from 'react';
import { OPDEntry, PatientRecord } from '../../types/clinic';
import { 
  User, 
  Phone, 
  Clock, 
  MapPin, 
  Tag, 
  FileText, 
  ShieldCheck, 
  Activity, 
  PlayCircle,
  AlertCircle
} from 'lucide-react';

interface PatientDetailCardProps {
  entry: OPDEntry;
  patient?: PatientRecord;
  onStartConsultation?: () => void;
}

export const PatientDetailCard: React.FC<PatientDetailCardProps> = ({
  entry,
  patient,
  onStartConsultation,
}) => {
  const isReturning = (patient?.totalVisits || 1) > 1;
  const isWaiting = entry.status === 'waiting';
  const isConsulted = entry.status === 'consulted';

  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4"
      style={{ backgroundImage: 'none' }}
    >
      {/* Top Banner: Token, Name, Demographics & Status Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold font-tabular shadow-2xs shrink-0 ${
              entry.session === 'morning'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none text-slate-500">Token</span>
            <span className="text-base font-extrabold leading-none mt-0.5">#{entry.tokenDisplay}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight">
                {entry.patientName}
              </h2>
              <span className="text-[11px] font-bold text-slate-500 font-tabular">
                ({entry.gender}, {entry.age ? `${entry.age}y` : 'Age N/A'})
              </span>
              {isReturning ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Follow-up Visit ({patient?.totalVisits}th visit)
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  New Patient
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1 flex-wrap font-tabular">
              <span className="font-semibold text-slate-700">UHID: {patient?.uhid || 'VEH-Pending'}</span>
              <span>·</span>
              <a
                href={`tel:+91${entry.phone}`}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3" />
                <span>+91 {entry.phone}</span>
              </a>
              {patient?.bloodGroup && (
                <>
                  <span>·</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 text-[10px]">
                    {patient.bloodGroup}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-2 shrink-0">
          {isWaiting && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-lg text-xs font-bold font-tabular">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Waiting</span>
            </span>
          )}

          {isConsulted && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold font-tabular">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consulted</span>
            </span>
          )}
        </div>
      </div>

      {/* Staff Registration Metadata Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Reason for Visit / Chief Complaint
          </span>
          <p className="font-bold text-slate-900">
            {entry.chiefComplaint || 'General ENT Consultation'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Registration &amp; Staff Attribution
          </span>
          <p className="font-medium text-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{entry.registeredTime} by <span className="font-bold text-slate-900">{entry.createdBy}</span></span>
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Session &amp; Assigned Room
          </span>
          <p className="font-medium text-slate-700 capitalize flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{entry.session} Slot · {entry.room}</span>
          </p>
        </div>
      </div>

      {/* Reception Extra Notes (if any) */}
      {entry.extraNote && (
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-start gap-2 text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Front Desk Remarks: </span>
            <span className="font-medium">{entry.extraNote}</span>
          </div>
        </div>
      )}
    </div>
  );
};
