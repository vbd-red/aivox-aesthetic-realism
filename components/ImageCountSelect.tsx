import React from 'react';
import { ImageCount, Language } from '../types';
import { translations } from '../translations';

interface ImageCountSelectProps {
  value: ImageCount;
  onChange: (value: ImageCount) => void;
  disabled?: boolean;
  lang: Language;
}

export const ImageCountSelect: React.FC<ImageCountSelectProps> = ({ value, onChange, disabled, lang }) => {
  const t = translations[lang];
  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      <label htmlFor="imageCount" className="text-white font-bold text-xs tracking-wider uppercase drop-shadow-sm">
        {t.countLabel}
      </label>
      <div className="relative">
        <select
          id="imageCount"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as ImageCount)}
          disabled={disabled}
          className="w-full appearance-none p-3.5 pr-10 border-2 border-transparent bg-gray-50 text-gray-900 rounded-xl font-semibold cursor-pointer focus:outline-none focus:bg-white focus:border-[#FF1E1E] transition-all shadow-sm"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="7">7</option>
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