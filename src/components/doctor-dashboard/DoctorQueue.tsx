import React, { useState } from 'react';
import { OPDEntry, OPDStatus } from '../../types/clinic';
import { Search, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';
import { QueueCard } from './QueueCard';

interface DoctorQueueProps {
  queue: OPDEntry[];
  selectedEntryId?: string;
  onSelectEntry: (entry: OPDEntry) => void;
  onOpenAddAppointment?: () => void;
}

export const DoctorQueue: React.FC<DoctorQueueProps> = ({
  queue,
  selectedEntryId,
  onSelectEntry,
  onOpenAddAppointment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OPDStatus>('all');

  // Filtered queue according to search & status
  const filteredQueue = queue.filter((entry) => {
    // 1. Status Filter: strictly 'waiting' or 'consulted'
    if (statusFilter !== 'all' && entry.status !== statusFilter) {
      return false;
    }

    // 2. Search Query: token, name, phone, complaint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = entry.patientName.toLowerCase().includes(q);
      const matchToken = entry.tokenDisplay.toLowerCase().includes(q);
      const matchPhone = entry.phone.includes(q);
      const matchComplaint = entry.chiefComplaint?.toLowerCase().includes(q);
      return matchName || matchToken || matchPhone || matchComplaint;
    }

    return true;
  });

  const waitingCount = queue.filter((e) => e.status === 'waiting').length;
  const consultedCount = queue.filter((e) => e.status === 'consulted').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header and Queue Metrics: Strictly Two States (Waiting and Consulted) */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Today's Queue
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time OPD token status
            </p>
          </div>

          {/* Quick Counter Pills: Strictly 2 States Only */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 font-tabular">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Waiting: {waitingCount}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 font-tabular">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Consulted: {consultedCount}
            </span>
          </div>
        </div>

        {/* Action Button: "Add Appointment" directly above the patient queue search bar */}
        {onOpenAddAppointment && (
          <button
            type="button"
            onClick={onOpenAddAppointment}
            className="w-full py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Appointment</span>
          </button>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, token #, phone or complaint..."
            className="w-full pl-9 pr-8 py-2 sm:py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-700 cursor-pointer min-w-[32px] justify-center"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Segmented Control: Strictly 'waiting', 'consulted', 'all' */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setStatusFilter('waiting')}
            className={`flex-1 py-2 sm:py-1.5 rounded-md text-center transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              statusFilter === 'waiting'
                ? 'bg-white text-amber-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Waiting ({waitingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('consulted')}
            className={`flex-1 py-2 sm:py-1.5 rounded-md text-center transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              statusFilter === 'consulted'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Consulted ({consultedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-2 sm:py-1.5 rounded-md text-center transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
              statusFilter === 'all'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({queue.length})
          </button>
        </div>
      </div>

      {/* Patient Cards List: Clean Solid Background, No Overlays */}
      <div className="p-3 sm:p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
        {filteredQueue.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No patients found</p>
            <p className="text-[11px] text-slate-400">
              {searchQuery
                ? 'No matching patient records in this queue view.'
                : 'All patients in this status category have been attended to.'}
            </p>
          </div>
        ) : (
          filteredQueue.map((entry) => (
            <QueueCard
              key={entry.id}
              entry={entry}
              isSelected={selectedEntryId === entry.id}
              onSelect={onSelectEntry}
            />
          ))
        )}
      </div>
    </div>
  );
};
