import React from 'react';
import { PatientRecord, OPDEntry, StaffUser, SessionSlot, Gender } from '../../types/clinic';
import { WelcomeBanner } from '../WelcomeBanner';
import { SpotAppointmentDesk } from '../SpotAppointmentDesk';
import { LiveOpdQueueTable } from '../LiveOpdQueueTable';

interface StaffDashboardProps {
  currentStaff: StaffUser;
  patients: PatientRecord[];
  queue: OPDEntry[];
  onBookAppointment: (appointmentData: {
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

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentStaff,
  patients,
  queue,
  onBookAppointment,
}) => {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome Banner: Large Typography Greeting, Staff Name, Dynamic Date Quotation */}
      <div className="-mx-3 sm:-mx-6 lg:-mx-8">
        <WelcomeBanner currentStaff={currentStaff} />
      </div>

      {/* Main Reception Desk Workspaces */}
      <div className="space-y-5 sm:space-y-6">
        {/* CREATE APPOINTMENT FORM */}
        <section aria-label="Create Appointment Desk">
          <SpotAppointmentDesk
            patients={patients}
            todayQueue={queue}
            currentStaff={currentStaff}
            onBookAppointment={onBookAppointment}
          />
        </section>

        {/* CURRENT DAY'S QUEUE (Strictly Read-Only for Staff) */}
        <section aria-label="Today Live OPD Queue Table">
          <LiveOpdQueueTable queue={queue} />
        </section>
      </div>
    </div>
  );
};
