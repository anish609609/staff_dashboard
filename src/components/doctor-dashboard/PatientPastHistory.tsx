import React, { useState } from 'react';
import { PatientRecord, PastVisitRecord } from '../../types/clinic';
import { Calendar, FileText, Image as ImageIcon, Eye, X, ZoomIn, Download, Stethoscope, Clock } from 'lucide-react';

interface PatientPastHistoryProps {
  patient?: PatientRecord;
}

export const PatientPastHistory: React.FC<PatientPastHistoryProps> = ({ patient }) => {
  const [activePreview, setActivePreview] = useState<{
    url: string;
    title: string;
    date: string;
    type?: string;
  } | null>(null);

  const pastVisits = patient?.pastVisits || [];
  const totalVisits = patient?.totalVisits || (pastVisits.length > 0 ? pastVisits.length + 1 : 1);
  const isReturningPatient = totalVisits > 1 || pastVisits.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Previous Visits &amp; Past Prescriptions
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-tabular">
            {pastVisits.length} past record{pastVisits.length === 1 ? '' : 's'}
          </span>
          {isReturningPatient ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Returning Patient ({totalVisits} visits)
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              New Patient
            </span>
          )}
        </div>
      </div>

      {/* Past Visits Timeline */}
      {pastVisits.length === 0 ? (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center space-y-1">
          <p className="text-xs font-semibold text-slate-700">No prior consultation records on file</p>
          <p className="text-[11px] text-slate-500">
            This is the patient's first recorded visit at Vamshi ENT Hospital. Prescriptions uploaded today will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pastVisits.map((visit, index) => (
            <div
              key={visit.id || index}
              className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors space-y-2.5"
            >
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-tabular flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {visit.date}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">· {visit.doctorName}</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-900">
                    <span className="text-slate-400 font-normal">Diagnosis: </span>
                    {visit.diagnosis}
                  </p>
                </div>

                {/* Prescription preview button if available */}
                {visit.prescriptionUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setActivePreview({
                        url: visit.prescriptionUrl!,
                        title: visit.prescriptionFileName || `${patient?.name || 'Patient'}_Rx_${visit.date}`,
                        date: visit.date,
                        type: visit.prescriptionType || 'pdf',
                      })
                    }
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
                    title="View scanned prescription slip"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Prescription</span>
                  </button>
                )}
              </div>

              {/* Symptoms / Notes */}
              <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2 rounded-lg border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700">Presented Complaint: </span>
                  <span>{visit.complaint}</span>
                </div>
                {visit.notes && (
                  <div>
                    <span className="font-semibold text-slate-700">Clinical Advice: </span>
                    <span className="text-slate-700">{visit.notes}</span>
                  </div>
                )}
              </div>

              {/* Clickable Prescription Thumbnail */}
              {visit.prescriptionUrl && (
                <div className="flex items-center gap-2.5 pt-1">
                  <div
                    onClick={() =>
                      setActivePreview({
                        url: visit.prescriptionUrl!,
                        title: visit.prescriptionFileName || `Rx_${visit.date}`,
                        date: visit.date,
                        type: visit.prescriptionType || 'pdf',
                      })
                    }
                    className="relative w-16 h-20 rounded border border-slate-300 bg-white overflow-hidden shadow-2xs cursor-pointer group hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                    title="Click to zoom prescription"
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

                  <div className="text-left text-xs min-w-0">
                    <p className="font-bold text-slate-900 truncate text-[11px]">
                      {visit.prescriptionFileName || 'Prescription Slip (Handwritten / Printed)'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Scanned Attachment · Uploaded during consult
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePreview({
                          url: visit.prescriptionUrl!,
                          title: visit.prescriptionFileName || `Rx_${visit.date}`,
                          date: visit.date,
                          type: visit.prescriptionType || 'pdf',
                        })
                      }
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline underline-offset-2 mt-0.5 inline-block"
                    >
                      Click to expand &amp; inspect document
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Full Prescription Inspection */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold truncate">
                    {activePreview.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-tabular">
                    Consultation Date: {activePreview.date} · Vamshi ENT Hospital Archive
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activePreview.url}
                  download={activePreview.title}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 px-2"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Document Body */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex items-center justify-center min-h-[350px]">
              <div className="bg-white p-2 rounded-lg shadow-md border border-slate-300 max-w-full">
                <img
                  src={activePreview.url}
                  alt={activePreview.title}
                  className="max-h-[72vh] w-auto object-contain rounded"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-[11px]">
                Patient: <span className="font-bold text-slate-900">{patient?.name}</span> (UHID: {patient?.uhid})
              </span>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold text-xs transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
