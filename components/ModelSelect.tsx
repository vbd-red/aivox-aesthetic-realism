
import React from 'react';
import { AiModel, Language } from '../types';
import { AI_MODELS } from '../constants';
import { translations } from '../translations';

interface ModelSelectProps {
  value: AiModel;
  onChange: (value: AiModel) => void;
  disabled?: boolean;
  lang: Language;
  filter?: (model: AiModel) => boolean;
}

export const ModelSelect: React.FC<ModelSelectProps> = ({ value, onChange, disabled, lang, filter }) => {
  const t = translations[lang];
  const displayModels = filter ? AI_MODELS.filter(m => filter(m.id)) : AI_MODELS;

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <label htmlFor="modelSelect" className="text-white font-bold text-xs tracking-wider uppercase drop-shadow-sm">
        {t.modelLabel}
      </label>
      <div className="relative">
        <select
          id="modelSelect"
          value={value}
          onChange={(e) => onChange(e.target.value as AiModel)}
          disabled={disabled}
          className="w-full appearance-none p-3.5 pr-10 border-2 border-transparent bg-gray-50 text-gray-900 rounded-xl font-semibold cursor-pointer focus:outline-none focus:bg-white focus:border-[#FF1E1E] transition-all shadow-sm"
        >
          {displayModels.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
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
