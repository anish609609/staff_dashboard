import React from 'react';
import { HOSPITAL_NAME } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-1">
        <span className="text-sm font-bold text-slate-800 tracking-tight">
          {HOSPITAL_NAME}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          powered by AshwiniCare
        </span>
      </div>
    </footer>
  );
};
