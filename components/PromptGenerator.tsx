
import React, { useState } from 'react';
import { generateCreativePrompts, translateText } from '../services/geminiService';
import { CreativePrompt, Language, CinematicStyle } from '../types';
import { translations } from '../translations';
import { CINEMATIC_STYLES } from '../constants';

interface PromptGeneratorProps {
  onSelectPrompt: (prompt: string) => void;
  lang: Language;
  prompts: CreativePrompt[];
  onUpdatePrompts: (prompts: CreativePrompt[]) => void;
  onClearPrompts: () => void;
  onDeletePrompt: (id: string) => void;
}

export const PromptGenerator: React.FC<PromptGeneratorProps> = ({ 
    onSelectPrompt, 
    lang, 
    prompts, 
    onUpdatePrompts,
    onClearPrompts,
    onDeletePrompt
}) => {
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<CinematicStyle | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[lang];

  // Translation State: Key is `${promptIndex}-${langCode}`
  const [transCache, setTransCache] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<Record<string, boolean>>({});
  const [activeLangs, setActiveLangs] = useState<Record<string, Language>>({});

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTransCache({});
    setActiveLangs({});
    
    try {
      // Pass the current app language so the "description" field in the result matches the UI language
      const styleToUse = selectedStyle === 'all' ? undefined : selectedStyle;
      const results = await generateCreativePrompts(description, lang, styleToUse);
      onUpdatePrompts(results);
    } catch (err) {
      setError(t.errorIdeas);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (id: string, text: string, targetLang: Language) => {
    setActiveLangs(prev => ({...prev, [id]: targetLang}));

    if (targetLang === 'en') return; // Default, no need to fetch

    const key = `${id}-${targetLang}`;
    if (transCache[key]) return; // Already cached

    setLoadingTranslations(prev => ({...prev, [key]: true}));
    try {
      const targetLangName = targetLang === 'ru' ? 'Russian' : 'Spanish';
      const translated = await translateText(text, targetLangName);
      setTransCache(prev => ({...prev, [key]: translated}));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTranslations(prev => ({...prev, [key]: false}));
    }
  };

  const handleDownloadPrompts = () => {
    if (prompts.length === 0) return;

    const header = `Aivox App — ${t.tabIdeas}\n${t.ideasLabel} (Last): ${description}\n\n============================================\n\n`;
    
    const content = prompts.map((p, index) => 
      `#${index + 1}: ${p.title}\n` +
      `Style: ${p.style}\n` +
      `Description: ${p.description}\n` +
      `--------------------------------------------\n` +
      `PROMPT (EN):\n${p.promptEn}\n` +
      `============================================\n`
    ).join('\n');

    const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aivox-prompts-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
       {/* Input Section */}
       <div className="bg-white rounded-3xl p-6 shadow-xl">
          
          {/* Style Selector */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold text-xs uppercase tracking-wide mb-2">
                {t.ideasStyleLabel}
            </label>
            <div className="relative">
                <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value as CinematicStyle | 'all')}
                    className="w-full appearance-none p-3 border-2 border-gray-100 bg-gray-50 text-gray-900 rounded-xl font-semibold cursor-pointer focus:outline-none focus:bg-white focus:border-[#FF1E1E] transition-all"
                >
                    <option value="all">{t.ideasStyleMix}</option>
                    {CINEMATIC_STYLES.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
          </div>

          <label className="block text-gray-700 font-bold text-sm uppercase tracking-wide mb-3">
             {t.ideasLabel}
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.ideasPlaceholder}
              className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#FF1E1E] focus:bg-white transition-colors resize-none text-gray-800 placeholder-gray-400 focus:outline-none text-lg"
            />
            <button
              onClick={handleGenerate}
              disabled={!description.trim() || isLoading}
              className="absolute bottom-4 right-4 bg-[#FF1E1E] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-[#FF1E1E] transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t.ideasThinking}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t.ideasBtn}
                </>
              )}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
       </div>

       {/* Results Grid */}
       {prompts.length > 0 && (
         <div className="animate-fade-in flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 gap-4">
                <h3 className="text-white font-bold text-xl drop-shadow-md flex items-center gap-2">
                    {t.ideasTitle} 
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg text-base backdrop-blur-sm">#{prompts.length}</span>
                </h3>
                
                <div className="flex gap-2">
                    <button
                        onClick={onClearPrompts}
                        className="flex items-center justify-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg hover:bg-white/30 transition-all shadow-sm text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t.clearAll}
                    </button>
                    <button
                        onClick={handleDownloadPrompts}
                        className="flex items-center justify-center px-4 py-2 bg-white text-[#FF1E1E] font-bold rounded-lg hover:bg-gray-50 transition-all shadow-md text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t.downloadTxt}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prompts.map((item) => {
                  const currentItemLang = activeLangs[item.id] || 'en';
                  const translationKey = `${item.id}-${currentItemLang}`;
                  const displayText = currentItemLang === 'en' ? item.promptEn : transCache[translationKey];
                  const isTransLoading = loadingTranslations[translationKey];

                  return (
                    <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 hover:shadow-xl transition-all flex flex-col h-full group relative overflow-hidden animate-fade-in">
                        
                        {/* Delete Button */}
                        <button 
                            onClick={() => onDeletePrompt(item.id)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all z-20"
                            title={t.delete}
                        >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex justify-between items-start mb-3 relative z-10 pr-8">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
                            <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-600 px-2 py-1 rounded-md ml-2 whitespace-nowrap">
                            {item.style}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 italic relative z-10">
                        "{item.description}"
                        </p>
                        
                        <div className="relative z-10 flex-grow flex flex-col mb-4">
                           {/* Language Selectors */}
                           <div className="flex gap-2 mb-2">
                              {(['en', 'ru', 'es'] as Language[]).map((l) => (
                                <button
                                  key={l}
                                  onClick={() => handleTranslate(item.id, item.promptEn, l)}
                                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full border transition-all ${
                                    currentItemLang === l 
                                      ? 'bg-gray-800 text-white border-gray-800 shadow-md' 
                                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                                  }`}
                                >
                                  {l}
                                </button>
                              ))}
                           </div>

                           {/* Text Area */}
                           <div className="bg-gray-100 p-3 rounded-xl text-xs text-gray-700 font-mono flex-grow overflow-y-auto max-h-40 min-h-[100px] border border-gray-200 relative shadow-inner">
                                {isTransLoading ? (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm z-20">
                                     <div className="flex flex-col items-center gap-1">
                                         <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                         </svg>
                                         <span className="text-[10px] text-gray-400">{t.loading}</span>
                                     </div>
                                  </div>
                                ) : (
                                  displayText || t.transError
                                )}
                           </div>
                        </div>

                        <button
                        onClick={() => onSelectPrompt(item.promptEn)}
                        className="w-full py-3 relative z-10 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-sm shadow-md hover:from-[#FF1E1E] hover:to-[#FFB800] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group-hover:shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {t.usePrompt}
                        </button>
                    </div>
                  );
                })}
            </div>
         </div>
       )}

       <style>{`
         @keyframes fade-in {
           from { opacity: 0; transform: translateY(10px); }
           to { opacity: 1; transform: translateY(0); }
         }
         .animate-fade-in {
           animation: fade-in 0.5s ease-out forwards;
         }
       `}</style>
    </div>
  );
};
