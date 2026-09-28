import React from 'react';

interface ExtraNotesFieldProps {
  extraNote: string;
  onChange: (value: string) => void;
}

export const ExtraNotesField: React.FC<ExtraNotesFieldProps> = ({
  extraNote,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Extra Note<span className="text-slate-400 font-normal"></span>
      </label>
      <input
        type="text"
        value={extraNote}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Bring audiometry reports, emergency vitals check, elderly patient"
        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </div>
  );
};
