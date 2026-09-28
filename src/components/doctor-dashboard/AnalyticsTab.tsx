import React, { useState, useMemo } from 'react';
import { OPDEntry, PatientRecord } from '../../types/clinic';
import { StaffPerformanceTable } from './StaffPerformanceTable';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  UserPlus, 
  UserCheck, 
  TrendingUp, 
  Sun, 
  Moon, 
  Filter
} from 'lucide-react';

interface AnalyticsTabProps {
  queue: OPDEntry[];
  historicalQueue: OPDEntry[];
  patients: PatientRecord[];
}

type DateFilterOption = 'today' | 'week' | 'month' | 'custom';

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  queue,
  historicalQueue,
  patients,
}) => {
  const [filterOption, setFilterOption] = useState<DateFilterOption>('today');
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Combine live queue and historical entries (deduplicate by id)
  const allEntries = useMemo(() => {
    const map = new Map<string, OPDEntry>();
    [...queue, ...historicalQueue].forEach((item) => {
      map.set(item.id, item);
    });
    return Array.from(map.values());
  }, [queue, historicalQueue]);

  // Filter entries based on selected date range
  const filteredEntries = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const now = new Date();

    if (filterOption === 'today') {
      return allEntries.filter((e) => e.appointmentDate === todayStr);
    }

    if (filterOption === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      const oneWeekStr = oneWeekAgo.toISOString().split('T')[0];
      return allEntries.filter(
        (e) => e.appointmentDate >= oneWeekStr && e.appointmentDate <= todayStr
      );
    }

    if (filterOption === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(now.getDate() - 30);
      const oneMonthStr = oneMonthAgo.toISOString().split('T')[0];
      return allEntries.filter(
        (e) => e.appointmentDate >= oneMonthStr && e.appointmentDate <= todayStr
      );
    }

    if (filterOption === 'custom') {
      return allEntries.filter(
        (e) => e.appointmentDate >= customStartDate && e.appointmentDate <= customEndDate
      );
    }

    return allEntries;
  }, [allEntries, filterOption, customStartDate, customEndDate]);

  // Metric Computations
  const totalVolume = filteredEntries.length;
  const completedCount = filteredEntries.filter((e) => e.status === 'consulted').length;
  const pendingCount = filteredEntries.filter((e) => e.status === 'waiting').length;
  const cancelledCount = filteredEntries.filter((e) => e.status === 'cancelled').length;

  const morningCount = filteredEntries.filter((e) => e.session === 'morning').length;
  const eveningCount = filteredEntries.filter((e) => e.session === 'evening').length;

  // New vs. Follow-up Visits Ratio
  // A patient is considered follow-up if their patientId corresponds to a patient with totalVisits > 1
  const followUpCount = filteredEntries.filter((e) => {
    const patient = patients.find((p) => p.id === e.patientId);
    return (patient?.totalVisits || 1) > 1 || (patient?.pastVisits?.length || 0) > 0;
  }).length;
  const newPatientCount = Math.max(0, totalVolume - followUpCount);

  // Daily Trend aggregation for the chart
  const dailyTrends = useMemo(() => {
    const dayMap: Record<string, { date: string; displayLabel: string; total: number; consulted: number }> = {};

    // Sort entries chronologically
    const sorted = [...filteredEntries].sort((a, b) =>
      a.appointmentDate.localeCompare(b.appointmentDate)
    );

    sorted.forEach((e) => {
      if (!dayMap[e.appointmentDate]) {
        const parsed = new Date(e.appointmentDate);
        const displayLabel = !isNaN(parsed.getTime())
          ? parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          : e.appointmentDate;

        dayMap[e.appointmentDate] = {
          date: e.appointmentDate,
          displayLabel,
          total: 0,
          consulted: 0,
        };
      }
      dayMap[e.appointmentDate].total += 1;
      if (e.status === 'consulted') {
        dayMap[e.appointmentDate].consulted += 1;
      }
    });

    const list = Object.values(dayMap);
    return list.slice(-10); // Show up to last 10 days in window
  }, [filteredEntries]);

  const maxDailyVolume = Math.max(...dailyTrends.map((d) => d.total), 5);

  return (
    <div className="space-y-5">
      {/* Date Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Analytics &amp; Performance Reports</h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time clinical throughput &amp; staff workload distribution
            </p>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold gap-1">
            <button
              type="button"
              onClick={() => setFilterOption('today')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterOption === 'today'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setFilterOption('week')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterOption === 'week'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setFilterOption('month')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterOption === 'month'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setFilterOption('custom')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterOption === 'custom'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* Custom Date Pickers */}
          {filterOption === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-tabular font-medium"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-tabular font-medium"
              />
            </div>
          )}
        </div>
      </div>

      {/* 1. OPD Summary Metrics (Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total OPD Volume */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total OPD Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 font-tabular">
              {totalVolume}
            </span>
            <span className="text-xs font-bold text-teal-700">Patients</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 font-tabular">{morningCount}</span> Morning ·{' '}
            <span className="font-semibold text-slate-700 font-tabular">{eveningCount}</span> Evening
          </div>
        </div>

        {/* Card 2: Completed Consultations */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Completed vs. Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-tabular">
              {completedCount}
            </span>
            <span className="text-xs font-medium text-slate-500 font-tabular">
              / {totalVolume} completed ({totalVolume > 0 ? Math.round((completedCount / totalVolume) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-amber-700 font-tabular">{pendingCount} Waiting</span> ·{' '}
            <span className="font-semibold text-slate-400 font-tabular">{cancelledCount} Cancelled</span>
          </div>
        </div>

        {/* Card 3: New vs Follow-up Visits */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              New vs. Follow-up
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-tabular">
              {followUpCount}
            </span>
            <span className="text-xs font-bold text-blue-700">Follow-up Visits</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>New Patients: <strong className="text-slate-800 font-tabular">{newPatientCount}</strong></span>
            <span className="font-bold text-slate-700 font-tabular">
              {totalVolume > 0 ? `${Math.round((followUpCount / totalVolume) * 100)}%` : '0%'} return
            </span>
          </div>
        </div>

        {/* Card 4: Session Slot Split */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Session Distribution
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-bold text-amber-950 font-tabular block leading-tight">
                {morningCount}
              </span>
              <span className="text-[10px] font-bold uppercase text-amber-700">Morning Slot</span>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold text-indigo-950 font-tabular block leading-tight">
                {eveningCount}
              </span>
              <span className="text-[10px] font-bold uppercase text-indigo-700">Evening Slot</span>
            </div>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-amber-400 h-full"
              style={{ width: `${totalVolume > 0 ? (morningCount / totalVolume) * 100 : 50}%` }}
              title="Morning Sessions"
            />
            <div
              className="bg-indigo-500 h-full"
              style={{ width: `${totalVolume > 0 ? (eveningCount / totalVolume) * 100 : 50}%` }}
              title="Evening Sessions"
            />
          </div>
        </div>
      </div>

      {/* 2. OPD Volume Trends Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              OPD Patient Volume Trends
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Total vs. Consulted Daily Throughput
          </span>
        </div>

        {dailyTrends.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs font-semibold">No OPD volume data available in this date range</p>
          </div>
        ) : (
          <div className="pt-2">
            {/* Visual Bar Summary */}
            <div className="space-y-3">
              {dailyTrends.map((day) => {
                const totalWidthPercent = Math.min(100, Math.round((day.total / maxDailyVolume) * 100));
                const consultedPercent = day.total > 0 ? Math.round((day.consulted / day.total) * 100) : 0;

                return (
                  <div key={day.date} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 font-tabular text-[11px] sm:text-xs">
                        {day.displayLabel}
                      </span>
                      <span className="text-[11px] font-tabular text-slate-500">
                        <strong className="text-slate-900">{day.total}</strong> registered ·{' '}
                        <strong className="text-emerald-700">{day.consulted}</strong> consulted ({consultedPercent}%)
                      </span>
                    </div>

                    <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex items-center p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-md transition-all duration-300 flex items-center justify-end pr-2 text-[10px] text-white font-bold font-tabular"
                        style={{ width: `${Math.max(12, totalWidthPercent)}%` }}
                      >
                        {day.total}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span>Total OPD Registrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" />
                <span>Unfilled Capacity</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Staff Performance Breakdown Table */}
      <StaffPerformanceTable entries={filteredEntries} />
    </div>
  );
};
