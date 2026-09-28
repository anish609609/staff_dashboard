import React, { useState, useRef, useEffect } from 'react';
import { StaffUser } from '../types/clinic';
import { CLINIC_LOGO_PATH, HOSPITAL_NAME } from '../data/mockData';
import { Menu, X, LogOut } from 'lucide-react';

interface HeaderProps {
  currentStaff: StaffUser;
  staffList?: StaffUser[];
  onSelectStaff?: (staff: StaffUser) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStaff,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
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
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-none truncate">
                {HOSPITAL_NAME}
              </h1>
              <div className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate">
                powered by <span className="font-semibold text-slate-700">AshwiniCare</span>
              </div>
            </div>
          </div>

          {/* Top-Right Navigation: 3-bar Hamburger Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 sm:p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Navigation Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Hamburger Dropdown Menu: Contains ONLY Staff Name and Logout Option */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Staff Name Only */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {currentStaff.name}
                  </p>
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
    </header>
  );
};
