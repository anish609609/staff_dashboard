import React from 'react';
import { OPDEntry } from '../../types/clinic';
import { INITIAL_STAFF_USERS } from '../../data/mockData';
import { Users, Award, Sun, Moon } from 'lucide-react';

interface StaffPerformanceTableProps {
  entries: OPDEntry[];
}

export const StaffPerformanceTable: React.FC<StaffPerformanceTableProps> = ({ entries }) => {
  // Aggregate registrations by staff name
  const staffStatsMap: Record<
    string,
    {
      staffName: string;
      totalRegistered: number;
      morningCount: number;
      eveningCount: number;
    }
  > = {};

  // Initialize with known staff members
  INITIAL_STAFF_USERS.forEach((s) => {
    staffStatsMap[s.name] = {
      staffName: s.name,
      totalRegistered: 0,
      morningCount: 0,
      eveningCount: 0,
    };
  });

  // Calculate counts from filtered entries
  entries.forEach((entry) => {
    const creator = entry.createdBy || 'Front Desk';
    if (!staffStatsMap[creator]) {
      staffStatsMap[creator] = {
        staffName: creator,
        totalRegistered: 0,
        morningCount: 0,
        eveningCount: 0,
      };
    }

    staffStatsMap[creator].totalRegistered += 1;
    if (entry.session === 'morning') {
      staffStatsMap[creator].morningCount += 1;
    } else {
      staffStatsMap[creator].eveningCount += 1;
    }
  });

  const staffStatsList = Object.values(staffStatsMap).sort(
    (a, b) => b.totalRegistered - a.totalRegistered
  );

  const totalEntries = entries.length || 1;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Reception Staff Performance
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 font-tabular">
          {entries.length} registrations evaluated
        </span>
      </div>

      {/* 1. DESKTOP VIEW (Medium & Larger screens): Clean 4-column Table */}
      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/60">
              <th className="py-2.5 px-3 rounded-l-lg">Staff Member</th>
              <th className="py-2.5 px-3 text-center">Registrations</th>
              <th className="py-2.5 px-3 text-center">Share</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Session Breakdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {staffStatsList.map((stat, idx) => {
              const matchedStaff = INITIAL_STAFF_USERS.find((s) => s.name === stat.staffName);
              const percent = Math.round((stat.totalRegistered / totalEntries) * 100);

              return (
                <tr key={stat.staffName} className="hover:bg-slate-50/70 transition-colors">
                  {/* Metric 1: Staff Member (Name & Avatar) */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {matchedStaff?.avatarUrl ? (
                          <img
                            src={matchedStaff.avatarUrl}
                            alt={stat.staffName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{stat.staffName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="truncate">{stat.staffName}</span>
                          {idx === 0 && stat.totalRegistered > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                              <Award className="w-2.5 h-2.5 text-amber-600" />
                              Top
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Metric 2: Registrations */}
                  <td className="py-3 px-3 text-center font-extrabold text-slate-900 font-tabular text-sm">
                    {stat.totalRegistered}
                  </td>

                  {/* Metric 3: Share (% share with bar) */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 font-tabular min-w-[32px]">
                        {percent}%
                      </span>
                    </div>
                  </td>

                  {/* Metric 4: Morning/Evening Session Breakdown */}
                  <td className="py-3 px-3 text-right text-slate-700 font-tabular text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="font-bold text-amber-900">M: {stat.morningCount}</span>
                      <span className="text-slate-300">/</span>
                      <span className="font-bold text-indigo-900">E: {stat.eveningCount}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE VIEW (< md screens): Stacked Vertical Cards (No Horizontal Scroll) */}
      <div className="md:hidden space-y-3">
        {staffStatsList.map((stat, idx) => {
          const matchedStaff = INITIAL_STAFF_USERS.find((s) => s.name === stat.staffName);
          const percent = Math.round((stat.totalRegistered / totalEntries) * 100);

          return (
            <div
              key={stat.staffName}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs"
            >
              {/* Line 1: Staff Name */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {matchedStaff?.avatarUrl ? (
                      <img
                        src={matchedStaff.avatarUrl}
                        alt={stat.staffName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{stat.staffName.charAt(0)}</span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {stat.staffName}
                  </span>
                </div>

                {idx === 0 && stat.totalRegistered > 0 && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                    <Award className="w-3 h-3 text-amber-600" />
                    Top
                  </span>
                )}
              </div>

              {/* Line 2: Total Registrations */}
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Registrations:</span>
                <span className="font-extrabold text-slate-950 font-tabular text-sm">
                  {stat.totalRegistered}
                </span>
              </div>

              {/* Line 3: Share in % */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Share:</span>
                <div className="flex items-center gap-2 flex-1 justify-end max-w-[65%]">
                  <div className="w-20 sm:w-28 h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="font-bold text-emerald-800 font-tabular text-xs min-w-[28px] text-right">
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Line 4: Session Breakdown (Morning / Evening counts) */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 font-medium">Session Breakdown:</span>
                <div className="flex items-center gap-1.5 font-tabular text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                    <Sun className="w-3 h-3 text-amber-600" />
                    M: {stat.morningCount}
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="inline-flex items-center gap-1 font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    <Moon className="w-3 h-3 text-indigo-600" />
                    E: {stat.eveningCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
