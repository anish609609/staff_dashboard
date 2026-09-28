import React, { useState } from 'react';
import { StaffUser } from '../types/clinic';
import { CLINIC_LOGO_PATH, HOSPITAL_NAME, HOSPITAL_TAGLINE } from '../data/mockData';
import { LogIn, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  staffList: StaffUser[];
  onLogin: (staff: StaffUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ staffList, onLogin }) => {
  const [selectedStaff, setSelectedStaff] = useState<StaffUser>(staffList[0]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-8 space-y-6">
        {/* Branding */}
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
            powered by <span className="font-semibold text-slate-700">AshwiniCare</span> · reception desk
          </p>
        </div>

        {/* Staff Sign-in Form */}
        <div className="space-y-4 pt-2">
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
                      : 'border-slate-200 hover:border-slate-300'
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
                      <div className="text-[11px] text-slate-500 font-medium">{staff.role} · {staff.deskNumber}</div>
                    </div>
                  </div>
                  {selectedStaff.id === staff.id && (
                    <ShieldCheck className="w-4 h-4 text-slate-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onLogin(selectedStaff)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Reception Desk</span>
          </button>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          AshwiniCare Outpatient Intake Station · Secure Session
        </p>
      </div>
    </div>
  );
};
