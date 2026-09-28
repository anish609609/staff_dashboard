import React, { useState } from 'react';
import { OPDEntry } from '../types/clinic';
import { 
  Search, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  ChevronUp,
  Phone
} from 'lucide-react';
import { TODAY_ISO_DATE } from '../data/mockData';

interface LiveOpdQueueTableProps {
  queue: OPDEntry[];
}

export const LiveOpdQueueTable: React.FC<LiveOpdQueueTableProps> = ({ queue }) => {
  // Strictly two operational queue statuses: 'waiting' and 'consulted'
  const [statusFilter, setStatusFilter] = useState<'all' | 'waiting' | 'consulted'>('all');
  const [tableSearch, setTableSearch] = useState('');
  
  // Track expanded cards for on-click detailed view
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Strictly current day's queue only
  const todayOnlyQueue = queue.filter((entry) => entry.appointmentDate === TODAY_ISO_DATE);

  // Status priority: Waiting first, Consulted last
  const statusPriority: Record<string, number> = {
    waiting: 1,
    consulted: 2,
    cancelled: 3,
  };

  // Apply filters on today's queue and sort
  const filteredQueue = todayOnlyQueue
    .filter((entry) => {
      // Status filter: strictly Waiting or Consulted
      if (statusFilter !== 'all' && entry.status !== statusFilter) return false;

      // Search query filter (Staff can search by patient name, phone, token, or reason for visit/note)
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase().trim();
        const matchName = entry.patientName.toLowerCase().includes(q);
        const matchPhone = entry.phone.includes(q);
        const matchToken = entry.tokenDisplay.toLowerCase().includes(q);
        const matchComplaint = entry.chiefComplaint?.toLowerCase().includes(q);
        const matchNote = entry.extraNote?.toLowerCase().includes(q);
        return matchName || matchPhone || matchToken || matchComplaint || matchNote;
      }

      return true;
    })
    .sort((a, b) => {
      const priorityA = statusPriority[a.status] ?? 99;
      const priorityB = statusPriority[b.status] ?? 99;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // Preserve token sequence within each status group
      if (a.session !== b.session) {
        return a.session === 'morning' ? -1 : 1;
      }
      return a.tokenNumber - b.tokenNumber;
    });

  const waitingCount = todayOnlyQueue.filter((q) => q.status === 'waiting').length;
  const consultedCount = todayOnlyQueue.filter((q) => q.status === 'consulted').length;

  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Top Controls & Current Day Metric Bar */}
      <div className="p-3.5 sm:p-5 border-b border-slate-200 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Today's OPDs
              </h2>
            </div>
            {/* Date positioned on a new line directly underneath title */}
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {formattedToday}
            </p>
          </div>

          {/* Strictly Two Status Counts: Waiting & Consulted in Horizontal Single-Line Row */}
          <div className="flex items-center gap-2">
            <div className="flex flex-row items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-900 whitespace-nowrap">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">WAITING -</span>
              <span className="text-xs font-bold text-amber-950 font-tabular leading-none">
                {waitingCount}
              </span>
            </div>

            <div className="flex flex-row items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-900 whitespace-nowrap">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">CONSULTED -</span>
              <span className="text-xs font-bold text-emerald-950 font-tabular leading-none">
                {consultedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar (Only Status Filters: All Status, Waiting, Consulted) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Status Filter: Strictly Waiting & Consulted */}
            <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-md text-xs font-medium w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded transition-colors cursor-pointer text-center ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('waiting')}
                className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded transition-colors cursor-pointer text-center ${
                  statusFilter === 'waiting'
                    ? 'bg-white text-amber-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Waiting ({waitingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('consulted')}
                className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded transition-colors cursor-pointer text-center ${
                  statusFilter === 'consulted'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Consulted ({consultedCount})
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search today's queue..."
              className="w-full min-w-0 pl-8 pr-3 py-1.5 text-[11px] sm:text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-900 placeholder:text-[11px] sm:placeholder:text-xs placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Queue: Vertical Stacked Cards (Zero Horizontal Scrolling) */}
      <div className="p-3 sm:p-5 space-y-2.5">
        {filteredQueue.length > 0 ? (
          filteredQueue.map((entry) => {
            const isCancelled = entry.status === 'cancelled';
            const isExpanded = expandedIds.has(entry.id);
            const cleanDigits = entry.phone.replace(/\D/g, '');

            return (
              <div
                key={entry.id}
                className={`border border-slate-200 rounded-xl bg-white shadow-2xs transition-all overflow-hidden ${
                  isCancelled ? 'opacity-40 bg-slate-50' : 'hover:border-slate-300'
                }`}
              >
                {/* Collapsed Card View: Clicking anywhere on card toggles expansion */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleCard(entry.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCard(entry.id);
                    }
                  }}
                  className="p-3.5 sm:p-4 cursor-pointer focus:outline-hidden hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isExpanded}
                >
                  {/* 1. Top Header Row: Token badge on top-left, Status badge on top-right */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {/* Top-Left: Token Badge */}
                    <span className="shrink-0 font-tabular font-bold px-2.5 py-1 rounded-lg text-xs sm:text-sm bg-slate-100 text-slate-900 border border-slate-200">
                      #{entry.tokenDisplay}
                    </span>

                    {/* Top-Right: Status Badge & Chevron */}
                    <div className="flex items-center gap-2">
                      {entry.status === 'waiting' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Waiting
                        </span>
                      )}
                      {entry.status === 'consulted' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Consulted
                        </span>
                      )}
                      {entry.status === 'cancelled' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-400 bg-slate-100">
                          Cancelled
                        </span>
                      )}

                      <div className="text-slate-400 p-0.5 rounded hover:bg-slate-100">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Patient Name: Prominently directly below top header row */}
                  <div className="mb-0.5">
                    <h3 className={`font-bold text-slate-900 text-base sm:text-lg leading-snug break-words ${isCancelled ? 'line-through text-slate-400' : ''}`}>
                      {entry.patientName}
                    </h3>
                  </div>

                  {/* 3. Patient Meta Row: Demographic info vertically below name */}
                  <div className="text-xs text-slate-500 font-medium">
                    <span>{entry.gender}</span>
                    {entry.age ? <span>, {entry.age}y</span> : ''}
                  </div>
                </div>

                {/* Expandable Detail Layer (OnClick View) */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 sm:p-4 space-y-2.5 text-xs text-slate-700 animate-in fade-in duration-100">
                    {/* Contact / Phone (Tap-to-call) */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="font-semibold text-slate-500 shrink-0 sm:w-36">
                        Contact:
                      </span>
                      <a
                        href={`tel:+91${cleanDigits}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 text-xs font-semibold transition-colors cursor-pointer w-fit"
                        title="Tap to call patient"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-tabular select-all">+91 {entry.phone}</span>
                      </a>
                    </div>

                    {/* Visit Reason */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="font-semibold text-slate-500 shrink-0 sm:w-36">
                        Visit Reason:
                      </span>
                      <span className="font-medium text-slate-900 break-words">
                        {entry.chiefComplaint ? (
                          entry.chiefComplaint
                        ) : (
                          <span className="text-slate-400 italic">Routine consultation</span>
                        )}
                      </span>
                    </div>

                    {/* Extra Note */}
                    {entry.extraNote && (
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-500 shrink-0 sm:w-36">
                          Extra Note:
                        </span>
                        <span className="text-slate-700 break-words">
                          {entry.extraNote}
                        </span>
                      </div>
                    )}

                    {/* Session & Booked Time */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                      <span className="font-semibold text-slate-500 shrink-0 sm:w-36">
                        Session & Booked Time:
                      </span>
                      <span className="text-slate-800 font-tabular font-medium flex items-center gap-1.5 flex-wrap">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{entry.session === 'morning' ? 'Morning OPD' : 'Evening OPD'}</span>
                        <span>·</span>
                        <span>{entry.registeredTime}</span>
                        {entry.createdBy && (
                          <>
                            <span>·</span>
                            <span className="text-slate-500">
                              By: {entry.createdBy.replace(/\s*\([^)]*\)/g, '').trim()}
                            </span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Consulting Doctor */}
                    {entry.doctorAssigned && (
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                        <span className="font-semibold text-slate-500 shrink-0 sm:w-36">
                          Consulting Doctor:
                        </span>
                        <span className="text-slate-800 font-medium">
                          {entry.doctorAssigned.split(',')[0].trim()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-700">
              No appointments in today's queue
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Schedule an appointment above to add to today's queue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
