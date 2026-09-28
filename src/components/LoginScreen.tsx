import React, { useState } from 'react';
import { StaffUser, DoctorUser, UserRole } from '../types/clinic';
import { CLINIC_LOGO_PATH, HOSPITAL_NAME, INITIAL_DOCTORS } from '../data/mockData';
import { LogIn, ShieldCheck, Stethoscope, Users, Building2 } from 'lucide-react';

interface LoginScreenProps {
  staffList: StaffUser[];
  doctorList?: DoctorUser[];
  onLoginStaff: (staff: StaffUser) => void;
  onLoginDoctor: (doctor: DoctorUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  staffList,
  doctorList = INITIAL_DOCTORS,
  onLoginStaff,
  onLoginDoctor,
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>('doctor');
  const [selectedStaff, setSelectedStaff] = useState<StaffUser>(staffList[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorUser>(doctorList[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRole === 'doctor') {
      onLoginDoctor(selectedDoctor);
    } else {
      onLoginStaff(selectedStaff);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 space-y-5">
        {/* Hospital Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mx-auto flex items-center justify-center">
            <img
              src={CLINIC_LOGO_PATH}
              alt={HOSPITAL_NAME}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            {HOSPITAL_NAME}
          </h1>
          <p className="text-xs text-slate-500">
            powered by <span className="font-semibold text-slate-700">AshwiniCare</span> · clinical portal
          </p>
        </div>

        {/* Role Selector Tabs: Doctor vs Reception Staff */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setActiveRole('doctor')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeRole === 'doctor'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Doctor Console</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRole('staff')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeRole === 'staff'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>Reception Staff</span>
          </button>
        </div>

        {/* Sign-in Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {activeRole === 'doctor' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Consulting Doctor Profile:
              </label>
              <div className="space-y-2">
                {doctorList.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDoctor.id === doc.id
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 shrink-0 flex items-center justify-center font-bold text-xs">
                        Dr
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {doc.qualification} · {doc.specialty}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold">{doc.room}</div>
                      </div>
                    </div>
                    {selectedDoctor.id === doc.id && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Duty Receptionist to Log In:
              </label>
              <div className="space-y-2">
                {staffList.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => setSelectedStaff(staff)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedStaff.id === staff.id
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={staff.avatarUrl}
                          alt={staff.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{staff.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {staff.role} · {staff.deskNumber}
                        </div>
                      </div>
                    </div>
                    {selectedStaff.id === staff.id && (
                      <ShieldCheck className="w-4 h-4 text-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>
              Sign In as {activeRole === 'doctor' ? selectedDoctor.name : selectedStaff.name}
            </span>
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400">
          AshwiniCare Outpatient Station · Secure Clinical Session
        </p>
      </div>
    </div>
  );
};
