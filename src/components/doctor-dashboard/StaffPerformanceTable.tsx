import React from 'react';
import { OPDEntry, StaffUser } from '../../types/clinic';
import { INITIAL_STAFF_USERS } from '../../data/mockData';
import { Award, Users, CheckCircle2, Clock } from 'lucide-react';

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
      consultedCount: number;
      waitingCount: number;
      morningCount: number;
      eveningCount: number;
    }
  > = {};

  // Initialize with known staff
  INITIAL_STAFF_USERS.forEach((s) => {
    staffStatsMap[s.name] = {
      staffName: s.name,
      totalRegistered: 0,
      consultedCount: 0,
      waitingCount: 0,
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
        consultedCount: 0,
        waitingCount: 0,
        morningCount: 0,
        eveningCount: 0,
      };
    }

    staffStatsMap[creator].totalRegistered += 1;
    if (entry.status === 'consulted') {
      staffStatsMap[creator].consultedCount += 1;
    } else if (entry.status === 'waiting') {
      staffStatsMap[creator].waitingCount += 1;
    }

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
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Reception Staff Performance Breakdown
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 font-tabular">
          {entries.length} registrations evaluated
        </span>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/60">
              <th className="py-2.5 px-3 rounded-l-lg">Staff Member</th>
              <th className="py-2.5 px-3 text-center">Registrations</th>
              <th className="py-2.5 px-3 text-center">Share</th>
              <th className="py-2.5 px-3 text-center">Consulted</th>
              <th className="py-2.5 px-3 text-center">Morning / Evening</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {staffStatsList.map((stat, idx) => {
              const matchedStaff = INITIAL_STAFF_USERS.find((s) => s.name === stat.staffName);
              const percent = Math.round((stat.totalRegistered / totalEntries) * 100);

              return (
                <tr key={stat.staffName} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center font-bold text-slate-700">
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
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{stat.staffName}</span>
                          {idx === 0 && stat.totalRegistered > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              <Award className="w-2.5 h-2.5 text-amber-600" />
                              Top
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {matchedStaff?.role || 'Reception Officer'} · {matchedStaff?.deskNumber || 'Counter'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-slate-900 font-tabular text-sm">
                    {stat.totalRegistered}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 font-tabular">{percent}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-tabular">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {stat.consultedCount} done
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center text-slate-600 font-tabular text-[11px]">
                    <span className="font-semibold text-amber-900">{stat.morningCount} M</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="font-semibold text-indigo-900">{stat.eveningCount} E</span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md font-tabular">
                      {stat.totalRegistered > 0
                        ? `${Math.round((stat.consultedCount / stat.totalRegistered) * 100)}% consulted`
                        : '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
