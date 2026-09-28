import React, { useState, useEffect } from 'react';
import { OPDEntry, PatientRecord, DoctorUser, ConsultationRecord } from '../../types/clinic';
import { PatientHeaderCard } from './PatientHeaderCard';
import { PreviousPrescriptionsAccordion } from './PreviousPrescriptionsAccordion';
import { ConsultationForm } from './ConsultationForm';
import { FileText, Download, X } from 'lucide-react';

interface PatientConsultationModalProps {
  entry: OPDEntry;
  patient?: PatientRecord;
  currentDoctor: DoctorUser;
  isOpen: boolean;
  onClose: () => void;
  onSaveConsultation: (
    consultation: ConsultationRecord,
    updatedEntry: OPDEntry,
    updatedPatient: PatientRecord
  ) => void;
}

export const PatientConsultationModal: React.FC<PatientConsultationModalProps> = ({
  entry,
  patient,
  currentDoctor,
  isOpen,
  onClose,
  onSaveConsultation,
}) => {
  const isConsulted = entry.status === 'consulted';
  const pastVisits = patient?.pastVisits || [];

  // Edit Mode: if already consulted, start in read-only view; if waiting, start in form mode
  const [isEditing, setIsEditing] = useState<boolean>(!isConsulted);

  // Lightbox preview for full-size inspection
  const [lightboxPreview, setLightboxPreview] = useState<{
    url: string;
    title: string;
    date: string;
  } | null>(null);

  // Sync edit mode on entry change or open
  useEffect(() => {
    if (isOpen) {
      setIsEditing(entry.status !== 'consulted');
      setLightboxPreview(null);
    }
  }, [entry.id, entry.status, isOpen]);

  // Prevent background body and html scrolling when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.style.overflow = originalBodyOverflow || 'unset';
      document.documentElement.style.overflow = originalHtmlOverflow || 'unset';
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Handle Escape key to close modal (or close lightbox if open)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxPreview) {
          setLightboxPreview(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, lightboxPreview, onClose]);

  if (!isOpen) return null;

  // Handle Save / Update Consultation
  const handleSaveConsultationData = ({
    doctorNotes,
    attachedFile,
    followUpDays,
  }: {
    doctorNotes: string;
    attachedFile: {
      url: string;
      fileName: string;
      fileType: 'image' | 'pdf';
      fileSize?: string;
      uploadedAt: string;
      uploadedTimestamp: number;
    } | null;
    followUpDays: number | undefined;
  }) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const uploadTimeStr =
      attachedFile?.uploadedAt ||
      now.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

    const consultationRecord: ConsultationRecord = {
      id: `cons-${Date.now()}`,
      opdEntryId: entry.id,
      patientId: entry.patientId,
      patientName: entry.patientName,
      doctorName: currentDoctor.name,
      date: formattedDate,
      timestamp: Date.now(),
      chiefComplaint: entry.chiefComplaint,
      diagnosis: doctorNotes.trim() || entry.chiefComplaint || 'Consultation Completed',
      doctorNotes: doctorNotes.trim(),
      prescriptionImageUrl: attachedFile?.url,
      prescriptionFileName: attachedFile?.fileName,
      prescriptionFileType: attachedFile?.fileType,
      followUpDays,
    };

    const updatedEntry: OPDEntry = {
      ...entry,
      status: 'consulted',
      prescription: {
        uploadedAt: uploadTimeStr,
        doctorNotes: doctorNotes.trim(),
        imageUrl: attachedFile?.url,
        fileName: attachedFile?.fileName,
        fileType: attachedFile?.fileType,
      },
    };

    const currentPastVisits = patient?.pastVisits || [];
    const newVisitRecord = {
      id: `pv-${Date.now()}`,
      date: formattedDate,
      doctorName: currentDoctor.name,
      diagnosis: doctorNotes.trim() || entry.chiefComplaint || 'Consultation',
      complaint: entry.chiefComplaint || 'Consultation',
      notes: doctorNotes.trim(),
      prescriptionUrl: attachedFile?.url,
      prescriptionFileName: attachedFile?.fileName,
      prescriptionType: attachedFile?.fileType,
    };

    const updatedPatient: PatientRecord = {
      ...(patient || {
        id: entry.patientId,
        uhid: `VEH-${Math.floor(10000 + Math.random() * 90000)}`,
        name: entry.patientName,
        phone: entry.phone,
        gender: entry.gender,
        age: entry.age,
        lastVisitDate: formattedDate,
        totalVisits: 1,
      }),
      lastVisitDate: formattedDate,
      totalVisits: isConsulted ? patient?.totalVisits || 1 : (patient?.totalVisits || 1) + 1,
      pastVisits: [newVisitRecord, ...currentPastVisits],
    };

    onSaveConsultation(consultationRecord, updatedEntry, updatedPatient);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden overscroll-contain animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* 1. Patient Header & Details Card */}
        <PatientHeaderCard
          entry={entry}
          patient={patient}
          isConsulted={isConsulted}
          onClose={onClose}
        />

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 space-y-4 bg-slate-50/50">
          {/* 2. Previous Prescriptions Accordion (Positioned directly below Patient Details) */}
          <PreviousPrescriptionsAccordion
            pastVisits={pastVisits}
            onZoomPrescription={(preview) => setLightboxPreview(preview)}
          />

          {/* 3. Doctor's Workflow Consultation Form */}
          <ConsultationForm
            entry={entry}
            currentDoctor={currentDoctor}
            isConsulted={isConsulted}
            isEditing={isEditing}
            onStartEditing={() => setIsEditing(true)}
            onCancelEditing={() => setIsEditing(false)}
            onClose={onClose}
            onSave={handleSaveConsultationData}
            onZoomPrescription={(preview) => setLightboxPreview(preview)}
          />
        </div>
      </div>

      {/* Clean Lightbox Modal for zooming attached or historical prescription */}
      {lightboxPreview && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden overscroll-contain animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxPreview(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200 shrink-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <h5 className="text-xs sm:text-sm font-bold truncate text-slate-900">
                    {lightboxPreview.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-tabular">
                    Date: {lightboxPreview.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <a
                  href={lightboxPreview.url}
                  download={lightboxPreview.title}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer text-xs flex items-center gap-1 px-2 border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxPreview(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-3 sm:p-6 bg-slate-50 flex items-center justify-center min-h-[300px]">
              <div className="bg-white p-2 rounded-lg shadow-md border border-slate-300 max-w-full">
                <img
                  src={lightboxPreview.url}
                  alt={lightboxPreview.title}
                  className="max-h-[72vh] w-auto object-contain rounded"
                />
              </div>
            </div>

            <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setLightboxPreview(null)}
                className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
