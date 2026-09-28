import React, { useState } from 'react';
import { OPDEntry, PatientRecord, DoctorUser, ConsultationRecord, Gender, SessionSlot } from '../../types/clinic';
import { DoctorQueue } from './DoctorQueue';
import { PatientConsultationModal } from './PatientConsultationModal';
import { AddAppointmentModal } from './AddAppointmentModal';
import { CheckCircle2 } from 'lucide-react';

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
  onBookAppointment?: (appointmentData: {
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
}

export const OpdsConsultationTab: React.FC<OpdsConsultationTabProps> = ({
  queue,
  patients,
  currentDoctor,
  onUpdateOpdStatus: _onUpdateOpdStatus,
  onSaveConsultation,
  onBookAppointment,
}) => {
  // Currently active selected patient ID from today's queue - default to undefined when modal is closed
  const [selectedEntryId, setSelectedEntryId] = useState<string | undefined>(undefined);

  // Modal Pop-up state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected entry and matching patient (only resolved when selectedEntryId is present)
  const selectedEntry = selectedEntryId ? queue.find((e) => e.id === selectedEntryId) : undefined;
  const selectedPatient = selectedEntry
    ? patients.find((p) => p.id === selectedEntry.patientId)
    : undefined;

  // Trigger modal when doctor clicks/taps on ANY patient card
  const handleSelectEntry = (entry: OPDEntry) => {
    setSelectedEntryId(entry.id);
    setIsModalOpen(true);
  };

  // Clear selected patient state when modal is closed
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntryId(undefined);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-70 flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-slate-900 text-white border border-slate-700 rounded-full shadow-xl text-xs sm:text-sm font-medium animate-in fade-in slide-from-top-3 duration-200 max-w-[92vw]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Main Clean Queue Workspace */}
      <div className="w-full">
        <DoctorQueue
          queue={queue}
          selectedEntryId={selectedEntryId}
          onSelectEntry={handleSelectEntry}
          onOpenAddAppointment={
            onBookAppointment ? () => setIsAddAppointmentModalOpen(true) : undefined
          }
        />
      </div>

      {/* Comprehensive Patient Modal / Pop-up on Patient Selection */}
      {selectedEntry && (
        <PatientConsultationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          entry={selectedEntry}
          patient={selectedPatient}
          currentDoctor={currentDoctor}
          onSaveConsultation={(consultation, updatedEntry, updatedPatient) => {
            const wasAlreadyConsulted = selectedEntry?.status === 'consulted';
            onSaveConsultation(consultation, updatedEntry, updatedPatient);
            showToast(
              wasAlreadyConsulted
                ? `Consultation updated for Token #${updatedEntry.tokenDisplay} (${updatedEntry.patientName})`
                : `Consultation completed for Token #${updatedEntry.tokenDisplay} (${updatedEntry.patientName})`
            );
            handleCloseModal();
          }}
        />
      )}

      {/* Add Appointment Modal for Doctor Workspace */}
      {onBookAppointment && (
        <AddAppointmentModal
          isOpen={isAddAppointmentModalOpen}
          onClose={() => setIsAddAppointmentModalOpen(false)}
          currentDoctor={currentDoctor}
          patients={patients}
          todayQueue={queue}
          onBookAppointment={onBookAppointment}
          onSuccess={(newEntry) => {
            showToast(
              `Appointment registered: Token #${newEntry.tokenDisplay} (${newEntry.patientName}) added to queue`
            );
          }}
        />
      )}
    </div>
  );
};
