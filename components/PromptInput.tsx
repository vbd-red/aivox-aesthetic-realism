import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  lang: Language;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled, lang }) => {
  const t = translations[lang];
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor="promptInput" className="text-white font-bold text-xs tracking-wider uppercase drop-shadow-sm">
        {t.inputLabel}
      </label>
      <div className="relative group isolate">
        {/* Fire Waves Effect */}
        <div className="absolute -inset-[3px] rounded-[16px] bg-gradient-to-r from-[#FFB800] via-[#FF1E1E] to-[#FFB800] bg-[length:200%_auto] animate-fire-flow blur-md opacity-60 group-focus-within:opacity-100 group-hover:opacity-80 transition-opacity duration-500 will-change-[background-position,opacity]"></div>
        
        <textarea
            id="promptInput"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.inputPlaceholder}
            disabled={disabled}
            className="relative w-full min-h-[120px] p-[14px] px-[18px] rounded-[14px] bg-white border-2 border-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF1E1E] transition-all resize-y text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed z-10"
        />
        <div className="absolute bottom-3 right-3 pointer-events-none z-20">
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
             </svg>
        </div>
      </div>
      <style>{`
        @keyframes fire-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fire-flow {
          animation: fire-flow 3s ease infinite;
        }
      `}</style>
    </div>
  );
};