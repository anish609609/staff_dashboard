import React, { useState } from 'react';
import { OPDEntry, OPDStatus } from '../../types/clinic';
import { Search, Clock, User, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface DoctorQueueProps {
  queue: OPDEntry[];
  selectedEntryId?: string;
  onSelectEntry: (entry: OPDEntry) => void;
}

export const DoctorQueue: React.FC<DoctorQueueProps> = ({
  queue,
  selectedEntryId,
  onSelectEntry,
}) => {
  const [statusFilter, setStatusFilter] = useState<'waiting' | 'consulted' | 'all'>('waiting');
  const [searchQuery, setSearchQuery] = useState('');

  // Status priority: waiting first, then consulted, cancelled last
  const statusPriority: Record<OPDStatus, number> = {
    waiting: 1,
    consulted: 2,
    cancelled: 3,
  };

  // Filter and search
  const filteredQueue = queue
    .filter((entry) => {
      if (statusFilter !== 'all' && entry.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = entry.patientName.toLowerCase().includes(q);
        const matchPhone = entry.phone.includes(q);
        const matchToken = entry.tokenDisplay.toLowerCase().includes(q);
        const matchComplaint = entry.chiefComplaint?.toLowerCase().includes(q);
        return matchName || matchPhone || matchToken || matchComplaint;
      }
      return true;
    })
    .sort((a, b) => {
      const priorityA = statusPriority[a.status] ?? 99;
      const priorityB = statusPriority[b.status] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.tokenNumber - b.tokenNumber;
    });

  const waitingCount = queue.filter((e) => e.status === 'waiting').length;
  const consultedCount = queue.filter((e) => e.status === 'consulted').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Header and Queue Metrics: Strictly Two States (Waiting and Consulted) */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Today's Queue
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Registered by reception desk
            </p>
          </div>

          {/* Quick Counter Pills: Strictly 2 States Only */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 font-tabular">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Waiting: {waitingCount}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 font-tabular">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Consulted: {consultedCount}
            </span>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, token #, phone or complaint..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Segmented Buttons: Reordered strictly to Waiting, Consulted, All */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => setStatusFilter('waiting')}
            className={`flex-1 py-1.5 rounded-md text-center transition-colors cursor-pointer ${
              statusFilter === 'waiting'
                ? 'bg-white text-amber-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏳ Waiting ({waitingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('consulted')}
            className={`flex-1 py-1.5 rounded-md text-center transition-colors cursor-pointer ${
              statusFilter === 'consulted'
                ? 'bg-white text-emerald-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✅ Consulted ({consultedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`flex-1 py-1.5 rounded-md text-center transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 All ({queue.length})
          </button>
        </div>
      </div>

      {/* Patient Cards List: Increased Card Size & Padding */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2.5 sm:p-3 space-y-2 max-h-[calc(100vh-280px)] min-h-[420px]">
        {filteredQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="text-xs font-semibold text-slate-600">No patients found</p>
            <p className="text-[11px] text-slate-400">
              {searchQuery ? 'Try clearing your search query' : 'Queue is empty for this filter'}
            </p>
          </div>
        ) : (
          filteredQueue.map((entry) => {
            const isSelected = selectedEntryId === entry.id;

            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className={`p-4 sm:p-4.5 rounded-xl border text-left transition-all cursor-pointer relative shadow-2xs ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-emerald-600 rounded-r-md" />
                )}

                <div className="flex items-start justify-between gap-3">
                  {/* Token & Patient Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold font-tabular tracking-wide shrink-0 shadow-2xs ${
                        entry.session === 'morning'
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-indigo-100 text-indigo-950 border border-indigo-300'
                      }`}
                    >
                      #{entry.tokenDisplay}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-950 truncate leading-snug">
                        {entry.patientName}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 font-tabular mt-0.5">
                        <span>{entry.gender}</span>
                        <span>·</span>
                        <span>{entry.age ? `${entry.age}y` : 'Age N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge: Strictly Waiting or Consulted */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {entry.status === 'waiting' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-md font-tabular">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Waiting
                      </span>
                    )}
                    {entry.status === 'consulted' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md font-tabular">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Consulted
                      </span>
                    )}

                    <ChevronRight className={`w-5 h-5 text-slate-300 ml-1 ${isSelected ? 'text-emerald-700' : ''}`} />
                  </div>
                </div>

                {/* Complaint & Time Row */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 gap-2">
                  <div className="truncate font-medium text-slate-700 flex-1">
                    {entry.chiefComplaint ? (
                      <span className="text-slate-800">
                        <span className="text-slate-400 font-normal">Complaint: </span>
                        {entry.chiefComplaint}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">General ENT checkup</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-tabular shrink-0 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{entry.registeredTime}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
