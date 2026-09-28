import React, { useState, useEffect } from 'react';
import { 
  DoctorUser, 
  OPDEntry, 
  PatientRecord, 
  ConsultationRecord 
} from '../../types/clinic';
import { DAILY_INSPIRATIONAL_QUOTATIONS } from '../../data/mockData';
import { OpdsConsultationTab } from './OpdsConsultationTab';
import { AnalyticsTab } from './AnalyticsTab';
import { ClipboardList, BarChart3, Clock, Sparkles } from 'lucide-react';

interface DoctorDashboardProps {
  currentDoctor: DoctorUser;
  queue: OPDEntry[];
  historicalQueue: OPDEntry[];
  patients: PatientRecord[];
  onUpdateOpdStatus: (opdId: string, newStatus: 'waiting' | 'consulted') => void;
  onSaveConsultation: (consultation: ConsultationRecord, updatedEntry: OPDEntry, updatedPatient: PatientRecord) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentDoctor,
  queue,
  historicalQueue,
  patients,
  onUpdateOpdStatus,
  onSaveConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'opds' | 'analytics'>('opds');
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

  useEffect(() => {
    const updateTime = () => setCurrentHour(new Date().getHours());
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Time-based greeting line
  let greeting = 'Good morning,';
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon,';
  } else if (currentHour >= 17) {
    greeting = 'Good evening,';
  }

  // Dynamic Daily Quotation matching exact staff view algorithm
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const quoteIndex = Math.floor(dayOfYear / 5) % DAILY_INSPIRATIONAL_QUOTATIONS.length;
  const currentQuote = DAILY_INSPIRATIONAL_QUOTATIONS[quoteIndex];

  // Active queue counters (strictly waiting and consulted)
  const waitingCount = queue.filter((e) => e.status === 'waiting').length;
  const consultedCount = queue.filter((e) => e.status === 'consulted').length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Greeting & Quote Section (matching exact typography and spacing of the staff view) */}
      <div className="bg-white border-b border-slate-200 -mx-3 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto space-y-1.5">
          {/* Large Greeting line */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
            {greeting}
          </h1>

          {/* Doctor Name line with high-contrast teal-700 accent (ONLY doctor name, no qualifications or room) */}
          <div className="text-lg sm:text-2xl font-bold text-teal-700 tracking-tight flex items-center gap-2 flex-wrap">
            <span>{currentDoctor.name}</span>
          </div>

          {/* Daily Inspirational Medical Quotation */}
          <p className="text-xs sm:text-sm text-slate-500 italic font-medium pt-0.5 leading-relaxed max-w-3xl">
            {currentQuote}
          </p>

          {/* 2. Top Navigation Tabs: Positioned directly below greeting banner */}
          <div className="pt-4 flex items-center gap-2 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab('opds')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'opds'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>OPDs (Consultation Workspace)</span>
              {waitingCount > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full font-tabular ${
                    activeTab === 'opds'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {waitingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics &amp; Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'opds' ? (
          <OpdsConsultationTab
            queue={queue}
            patients={patients}
            currentDoctor={currentDoctor}
            onUpdateOpdStatus={onUpdateOpdStatus}
            onSaveConsultation={onSaveConsultation}
          />
        ) : (
          <AnalyticsTab
            queue={queue}
            historicalQueue={historicalQueue}
            patients={patients}
          />
        )}
      </div>
    </div>
  );
};
