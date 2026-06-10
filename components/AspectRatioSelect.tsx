import React from 'react';
import { AspectRatio, Language } from '../types';
import { translations } from '../translations';

interface AspectRatioSelectProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
  lang: Language;
}

export const AspectRatioSelect: React.FC<AspectRatioSelectProps> = ({ value, onChange, disabled, lang }) => {
  const t = translations[lang];
  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      <label htmlFor="aspectRatio" className="text-white font-bold text-xs tracking-wider uppercase drop-shadow-sm">
        {t.formatLabel}
      </label>
      <div className="relative">
        <select
          id="aspectRatio"
          value={value}
          onChange={(e) => onChange(e.target.value as AspectRatio)}
          disabled={disabled}
          className="w-full appearance-none p-3.5 pr-10 border-2 border-transparent bg-gray-50 text-gray-900 rounded-xl font-semibold cursor-pointer focus:outline-none focus:bg-white focus:border-[#FF1E1E] transition-all shadow-sm"
        >
          <option value="1:1">{t.formatSquare}</option>
          <option value="16:9">{t.formatLandscape}</option>
          <option value="9:16">{t.formatPortrait}</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};