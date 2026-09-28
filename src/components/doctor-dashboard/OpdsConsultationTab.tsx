import React, { useState } from 'react';
import { OPDEntry, PatientRecord, DoctorUser, ConsultationRecord } from '../../types/clinic';
import { DoctorQueue } from './DoctorQueue';
import { PatientDetailCard } from './PatientDetailCard';
import { PatientPastHistory } from './PatientPastHistory';
import { PrescriptionUploader } from './PrescriptionUploader';
import { PatientConsultationModal } from './PatientConsultationModal';
import { playReceptionChime } from '../../utils/audioChime';
import { CheckCircle2, UserX, Stethoscope, Maximize2 } from 'lucide-react';

interface OpdsConsultationTabProps {
  queue: OPDEntry[];
  patients: PatientRecord[];
  currentDoctor: DoctorUser;
  onUpdateOpdStatus: (opdId: string, newStatus: 'waiting' | 'consulted') => void;
  onSaveConsultation: (
    consultation: ConsultationRecord,
    updatedEntry: OPDEntry,
    updatedPatient: PatientRecord
  ) => void;
}

export const OpdsConsultationTab: React.FC<OpdsConsultationTabProps> = ({
  queue,
  patients,
  currentDoctor,
  onUpdateOpdStatus,
  onSaveConsultation,
}) => {
  // Currently active selected patient ID from today's queue
  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>(() => {
    const active = queue.find((e) => e.status === 'waiting');
    return active ? active.id : queue[0]?.id;
  });

  // Modal Pop-up state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected entry and matching patient
  const selectedEntry = queue.find((e) => e.id === selectedEntryId) || queue[0];
  const selectedPatient = selectedEntry
    ? patients.find((p) => p.id === selectedEntry.patientId)
    : undefined;

  // Trigger modal when doctor clicks/taps on ANY patient in any tab
  const handleSelectEntry = (entry: OPDEntry) => {
    setSelectedEntryId(entry.id);
    setIsModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handler to complete consultation
  const handleCompleteConsultation = (data: {
    diagnosis: string;
    doctorNotes: string;
    medicines: string;
    followUpDays: number | null;
    prescriptionFile?: {
      url: string;
      fileName: string;
      fileType: 'image' | 'pdf';
    };
  }) => {
    if (!selectedEntry) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const uploadTimestamp = now.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const consultationId = `cons-${Date.now()}`;
    const newConsultation: ConsultationRecord = {
      id: consultationId,
      opdEntryId: selectedEntry.id,
      patientId: selectedEntry.patientId,
      patientName: selectedEntry.patientName,
      doctorName: currentDoctor.name,
      date: formattedDate,
      timestamp: Date.now(),
      chiefComplaint: selectedEntry.chiefComplaint,
      diagnosis: data.diagnosis,
      doctorNotes: data.doctorNotes,
      medicines: data.medicines,
      prescriptionImageUrl: data.prescriptionFile?.url,
      prescriptionFileName: data.prescriptionFile?.fileName,
      prescriptionFileType: data.prescriptionFile?.fileType,
      followUpDays: data.followUpDays || undefined,
    };

    const updatedEntry: OPDEntry = {
      ...selectedEntry,
      status: 'consulted',
      prescription: {
        uploadedAt: uploadTimestamp,
        medicines: data.medicines,
        doctorNotes: data.doctorNotes,
        imageUrl: data.prescriptionFile?.url,
        fileName: data.prescriptionFile?.fileName,
        fileType: data.prescriptionFile?.fileType,
      },
    };

    const updatedPatient: PatientRecord = {
      ...(selectedPatient || {
        id: selectedEntry.patientId,
        uhid: `VEH-${Math.floor(10000 + Math.random() * 90000)}`,
        name: selectedEntry.patientName,
        phone: selectedEntry.phone,
        gender: selectedEntry.gender,
        age: selectedEntry.age,
        lastVisitDate: formattedDate,
        totalVisits: 1,
      }),
      lastVisitDate: formattedDate,
      totalVisits: (selectedPatient?.totalVisits || 1) + 1,
      pastVisits: [
        {
          id: `pv-${Date.now()}`,
          date: formattedDate,
          doctorName: currentDoctor.name,
          diagnosis: data.diagnosis,
          complaint: selectedEntry.chiefComplaint || 'Consultation',
          notes: data.doctorNotes || data.medicines,
          prescriptionUrl: data.prescriptionFile?.url,
          prescriptionFileName: data.prescriptionFile?.fileName,
          prescriptionType: data.prescriptionFile?.fileType,
        },
        ...(selectedPatient?.pastVisits || []),
      ],
    };

    onSaveConsultation(newConsultation, updatedEntry, updatedPatient);

    playReceptionChime('success');
    showToast(`Consultation completed for Token #${selectedEntry.tokenDisplay} (${selectedEntry.patientName})`);

    // Move to the next waiting patient in line automatically
    const remainingWaiting = queue.filter(
      (e) => e.id !== selectedEntry.id && e.status === 'waiting'
    );
    if (remainingWaiting.length > 0) {
      setSelectedEntryId(remainingWaiting[0].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white border border-slate-700 rounded-full shadow-xl text-xs sm:text-sm font-medium animate-in fade-in slide-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Two-Column Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Pane: Today's OPD Queue */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <DoctorQueue
            queue={queue}
            selectedEntryId={selectedEntryId}
            onSelectEntry={handleSelectEntry}
          />
        </div>

        {/* Right Pane: Detailed Patient Consultation Workspace */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {selectedEntry ? (
            <>
              {/* Quick Modal Launcher Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    #{selectedEntry.tokenDisplay}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-emerald-950 truncate">
                      Selected: {selectedEntry.patientName}
                    </p>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      Click any patient card to launch the comprehensive modal pop-up
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Open Full Modal</span>
                </button>
              </div>

              {/* 1. Staff Registration Details Card */}
              <PatientDetailCard
                entry={selectedEntry}
                patient={selectedPatient}
              />

              {/* 2. Previous Visits & Past Prescriptions Timeline */}
              <PatientPastHistory patient={selectedPatient} />

              {/* 3. Prescription Upload & Completion Area */}
              <PrescriptionUploader
                key={selectedEntry.id}
                entry={selectedEntry}
                doctorName={currentDoctor.name}
                onCompleteConsultation={handleCompleteConsultation}
              />
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 shadow-xs space-y-3">
              <UserX className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <h3 className="text-base font-bold text-slate-700">No Patient Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please click on any patient from the queue on the left to open their consultation modal file.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Patient Modal / Pop-up on Patient Selection */}
      {selectedEntry && (
        <PatientConsultationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entry={selectedEntry}
          patient={selectedPatient}
          currentDoctor={currentDoctor}
          onSaveConsultation={onSaveConsultation}
        />
      )}
    </div>
  );
};
