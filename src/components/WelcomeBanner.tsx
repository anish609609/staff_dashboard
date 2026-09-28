import React, { useState, useEffect } from 'react';
import { StaffUser } from '../types/clinic';
import { DAILY_INSPIRATIONAL_QUOTATIONS } from '../data/mockData';

interface WelcomeBannerProps {
  currentStaff: StaffUser;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  currentStaff,
}) => {
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

  useEffect(() => {
    const updateTime = () => setCurrentHour(new Date().getHours());
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Time-based greeting line
  let greeting = 'Good morning,';
  if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good afternoon,';
  } else if (currentHour >= 17) {
    greeting = 'Good evening,';
  }

  // Dynamic Daily Quotation: Cycles every 5–6 days based on the calendar date
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  // Rotates to the next inspirational quotation every 5 days
  const quoteIndex = Math.floor(dayOfYear / 5) % DAILY_INSPIRATIONAL_QUOTATIONS.length;
  const currentQuote = DAILY_INSPIRATIONAL_QUOTATIONS[quoteIndex];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Greeting line, Staff Name, and Daily Inspirational Quotation */}
        <div className="space-y-1.5 max-w-3xl">
          {/* 1. Large Greeting line with modern deep slate contrast */}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
            {greeting}
          </h1>

          {/* 2. Staff Name line with distinctive, modern high-contrast teal-700 accent */}
          <div className="text-lg sm:text-2xl font-bold text-teal-700 tracking-tight flex items-center gap-2">
            <span>{currentStaff.name}</span>
          </div>

          {/* 3. Daily Inspirational Quotation underneath */}
          <p className="text-xs sm:text-sm text-slate-500 italic font-medium pt-0.5 leading-relaxed">
            {currentQuote}
          </p>
        </div>
      </div>
    </div>
  );
};
