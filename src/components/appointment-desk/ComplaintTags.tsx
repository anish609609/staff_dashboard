import React from 'react';

interface ComplaintTagsProps {
  complaint: string;
  commonComplaints: string[];
  onToggleTag: (tag: string) => void;
  isTagSelected: (tag: string) => boolean;
  onComplaintChange: (value: string) => void;
}

export const ComplaintTags: React.FC<ComplaintTagsProps> = ({
  complaint,
  commonComplaints,
  onToggleTag,
  isTagSelected,
  onComplaintChange,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-slate-700">
          Reason for Visit <span className="text-slate-400 font-normal"></span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        {commonComplaints.map((item) => {
          const isSelected = isTagSelected(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggleTag(item)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer font-medium ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item} {isSelected ? '✓' : '+'}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        value={complaint}
        onChange={(e) => onComplaintChange(e.target.value)}
        placeholder="e.g. Ear Pain, Throat Pain"
        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-1 focus:ring-slate-900"
      />
    </div>
  );
};
