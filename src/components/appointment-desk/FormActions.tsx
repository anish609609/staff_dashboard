import React from 'react';
import { CalendarCheck } from 'lucide-react';

interface FormActionsProps {
  onClear: () => void;
  isSubmitting?: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onClear,
  isSubmitting = false,
}) => {
  return (
    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
      <button
        type="button"
        onClick={onClear}
        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
      >
        Clear Form
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-md text-xs font-bold shadow-xs transition-colors cursor-pointer"
      >
        <CalendarCheck className="w-4 h-4" />
        <span>Schedule Appointment</span>
      </button>
    </div>
  );
};
