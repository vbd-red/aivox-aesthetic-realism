
import React from 'react';
import { ActiveTab, Language, RenderingMode } from '../types';
import { translations } from '../translations';

interface TabSelectorProps {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  renderingMode: RenderingMode;
  setRenderingMode: (mode: RenderingMode) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ 
  activeTab, onChange, lang, setLang, renderingMode, setRenderingMode 
}) => {
  const t = translations[lang];

  const TabButton = ({ tab, icon, label }: { tab: ActiveTab; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => onChange(tab)}
      className={`
        w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-3
        ${activeTab === tab 
          ? 'bg-white text-[#FF1E1E] shadow-lg transform scale-105 z-10' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'}
      `}
    >
      <span className={`${activeTab === tab ? 'text-[#FF1E1E]' : 'text-white/60'}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <div className="fixed top-0 left-0 bottom-0 w-72 bg-black/30 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col hidden md:flex">
      {/* LOGO AREA */}
      <div className="p-8 flex flex-col items-center gap-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <svg className="w-16 h-16 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 8L88 29.5V70.5L50 92L12 70.5V29.5L50 8Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2"/>
            <path d="M50 25L72 38V62L50 75L28 62V38L50 25Z" fill="white"/>
            <path d="M50 40L55 50L50 60L45 50L50 40Z" fill="#FFB800"/>
          </svg>
        </div>
        <div className="text-center">
            <h1 className="text-2xl font-black text-white font-display tracking-tight">
                {t.headerTitle}
            </h1>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFB800] mt-0.5">
                Aesthetic Engine
            </div>
        </div>
      </div>

      {/* TABS SCROLLABLE AREA */}
      <div className="flex-grow overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
        <TabButton 
          tab="generate" 
          label={t.tabGenerator}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <TabButton 
          tab="nano-banana" 
          label={t.tabNanoBanana}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <TabButton 
          tab="initial-frame" 
          label={t.tabInitialFrame}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <TabButton 
          tab="avatar" 
          label={t.tabAvatar}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <TabButton 
          tab="identity" 
          label={t.tabIdentity}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <TabButton 
          tab="outpainting" 
          label={t.tabOutpainting}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>}
        />
        <TabButton 
          tab="restoration" 
          label={t.tabRestoration}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>}
        />
        <TabButton 
          tab="image-fusion" 
          label={t.tabImageFusion}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
        />
        <TabButton 
          tab="scenarios" 
          label={t.tabScenarios}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1v14a1 1 0 001 1z" /></svg>}
        />
        <TabButton 
          tab="ideas" 
          label={t.tabIdeas}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
        />
      </div>

      {/* BOTTOM SETTINGS */}
      <div className="p-6 border-t border-white/10 space-y-6">
        {/* Render Mode */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{t.renderModeLabel}</span>
          <div className="bg-white/5 rounded-xl p-1 flex gap-1 border border-white/10">
            <button
              onClick={() => setRenderingMode('raw_realism')}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${renderingMode === 'raw_realism' ? 'bg-gradient-to-r from-[#FF1E1E] to-[#FFB800] text-white' : 'text-white/50 hover:bg-white/5'}`}
            >
              RAW
            </button>
            <button
              onClick={() => setRenderingMode('nikon_z9')}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${renderingMode === 'nikon_z9' ? 'bg-white text-gray-900' : 'text-white/50 hover:bg-white/5'}`}
            >
              ULTRA
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {(['ru', 'en', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center ${lang === l ? 'bg-white text-[#FF1E1E]' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-black text-white/20 uppercase">v3.5</div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};
