import React, { useState, useRef, useEffect } from 'react';
import { DoctorUser } from '../../types/clinic';
import { CLINIC_LOGO_PATH, HOSPITAL_NAME } from '../../data/mockData';
import { Menu, X, LogOut, Stethoscope, ArrowLeftRight, UserCheck } from 'lucide-react';

interface DoctorHeaderProps {
  currentDoctor: DoctorUser;
  availableDoctors?: DoctorUser[];
  onSelectDoctor?: (doctor: DoctorUser) => void;
  onSwitchToStaff: () => void;
  onLogout: () => void;
}

export const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  currentDoctor,
  availableDoctors = [],
  onSelectDoctor,
  onSwitchToStaff,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDoctorPicker, setShowDoctorPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setShowDoctorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hospital Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
              <img
                src={CLINIC_LOGO_PATH}
                alt={HOSPITAL_NAME}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-none truncate">
                  {HOSPITAL_NAME}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <Stethoscope className="w-3 h-3 text-emerald-600" />
                  Doctor Console
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate">
                powered by <span className="font-semibold text-slate-700">AshwiniCare</span>
              </div>
            </div>
          </div>

          {/* Quick Doctor Info Badge & Navigation Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Switch to Staff Desk Button */}
            <button
              type="button"
              onClick={onSwitchToStaff}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              title="Open Reception Staff Desk"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span>Staff Desk</span>
            </button>

            {/* Hamburger Dropdown Menu */}
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 sm:p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center min-h-[44px] min-w-[44px]"
                aria-label="Doctor Navigation Menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </button>

              {/* Hamburger Dropdown Menu: Contains Doctor Profile, Switch Role, and Logout */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* Doctor Profile Banner */}
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logged in Doctor</p>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {currentDoctor.name}
                    </p>
                  </div>

                  {/* Change Active Doctor (if multiple available) */}
                  {availableDoctors.length > 1 && onSelectDoctor && (
                    <div className="p-1.5 border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowDoctorPicker(!showDoctorPicker)}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-slate-500" />
                          <span>Switch Doctor</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {showDoctorPicker ? 'Hide' : 'Select'}
                        </span>
                      </button>

                      {showDoctorPicker && (
                        <div className="mt-1 space-y-1 pl-2">
                          {availableDoctors.map((doc) => (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => {
                                onSelectDoctor(doc);
                                setShowDoctorPicker(false);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                                doc.id === currentDoctor.id
                                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div>{doc.name}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Switch to Reception Staff Desk (Mobile view) */}
                  <div className="p-1.5 border-b border-slate-100 sm:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSwitchToStaff();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Switch to Staff Desk</span>
                    </button>
                  </div>

                  {/* Logout Option Only */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer min-h-[44px]"
                    >
                      <LogOut className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
