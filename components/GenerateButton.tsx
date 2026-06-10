import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  lang: Language;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading, disabled, lang }) => {
  const t = translations[lang];
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full h-[54px] rounded-xl relative overflow-hidden group
        bg-white border-2 border-white
        text-[#FF1E1E] font-bold text-lg tracking-wide
        shadow-lg shadow-black/10
        hover:bg-gray-50 hover:shadow-xl hover:-translate-y-0.5
        active:translate-y-0.5 active:shadow-sm
        transition-all duration-200 
        disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
        flex items-center justify-center gap-2 min-w-[200px]
      `}
    >
      <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-[#FF1E1E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t.generatingBtn}
        </>
      ) : (
        <>
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t.generateBtn}
        </>
      )}
      </span>
    </button>
  );
};