
import React from 'react';
import { Language, RenderingMode } from '../types';
import { translations } from '../translations';
import { useAppContext } from '../AppContext';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
  const { renderingMode, setRenderingMode } = useAppContext();
  const t = translations[lang];

  return (
    <header className="py-10 px-4 mb-2">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left drop-shadow-sm">
                <div className="relative group">
                   <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <svg className="w-20 h-20 md:w-24 md:h-24 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 8L88 29.5V70.5L50 92L12 70.5V29.5L50 8Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2"/>
                      <path d="M50 25L72 38V62L50 75L28 62V38L50 25Z" fill="white"/>
                      <path d="M50 40L55 50L50 60L45 50L50 40Z" fill="#FFB800"/>
                   </svg>
                </div>

                <div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-display">
                        {t.headerTitle}
                        <span className="text-[#FFB800] ml-3">App</span>
                    </h1>
                    <p className="mt-3 text-white/90 font-medium text-lg">
                        {t.headerSubtitle}
                    </p>
                </div>
            </div>

             <div className="flex flex-col items-center md:items-end gap-4">
                 {/* Rendering Mode Toggle */}
                 <div className="flex flex-col items-center md:items-end gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{t.renderModeLabel}</span>
                    <div className="bg-black/20 backdrop-blur-md rounded-xl p-1 flex gap-1 border border-white/20 shadow-inner">
                        <button
                            onClick={() => setRenderingMode('raw_realism')}
                            className={`
                                px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2
                                ${renderingMode === 'raw_realism' 
                                    ? 'bg-gradient-to-r from-[#FF1E1E] to-[#FFB800] text-white shadow-lg' 
                                    : 'text-white/70 hover:bg-white/10'}
                            `}
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                            RAW
                        </button>
                        <button
                            onClick={() => setRenderingMode('nikon_z9')}
                            className={`
                                px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2
                                ${renderingMode === 'nikon_z9' 
                                    ? 'bg-white text-gray-900 shadow-lg' 
                                    : 'text-white/70 hover:bg-white/10'}
                            `}
                        >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm5 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h3a1 1 0 100-2H7z" /></svg>
                            ULTRA
                        </button>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex gap-1 border border-white/20">
                        {(['ru', 'en', 'es'] as Language[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`
                            px-3 py-1 rounded-full text-xs font-bold uppercase transition-all
                            ${lang === l 
                                ? 'bg-white text-[#FF1E1E] shadow-sm' 
                                : 'text-white hover:bg-white/10'}
                            `}
                        >
                            {l}
                        </button>
                        ))}
                    </div>
                    <span className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-white/20 text-white backdrop-blur-md border border-white/40 shadow-sm">
                        v3.5 {renderingMode === 'nikon_z9' ? 'Sharp' : 'Warm'}
                    </span>
                 </div>
            </div>
        </div>
    </header>
  );
};
