
import React, { useState, useRef } from 'react';
import { AspectRatio, Language, GeneratedImage, AiModel, CinematicStyle } from '../types';
import { translations } from '../translations';
import { CINEMATIC_STYLES } from '../constants';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ModelSelect } from './ModelSelect';
import { generateScenarioIdeas } from '../services/geminiService';

interface CinematicScenariosProps {
  lang: Language;
  onGenerate: (prompts: string[], style: CinematicStyle, aspectRatio: AspectRatio, model: AiModel, referenceImage: string) => void;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
  progress: { current: number, total: number } | null;
}

export const CinematicScenarios: React.FC<CinematicScenariosProps> = ({ lang, onGenerate, isLoading, galleryImages, progress }) => {
  const t = translations[lang];
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [scenes, setScenes] = useState<string[]>(['']);
  const [ideasHint, setIdeasHint] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<CinematicStyle>('hollywood');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = () => {
    const validScenes = scenes.filter(s => s.trim() !== '');
    if (referenceImage && validScenes.length > 0) {
      onGenerate(validScenes, selectedStyle, aspectRatio, selectedModel, referenceImage);
    }
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
      setReferenceImage(img.url);
      setIsGalleryOpen(false);
  };

  const handleGenerateIdeas = async () => {
      setIsGeneratingIdeas(true);
      try {
          const ideas = await generateScenarioIdeas(referenceImage, selectedStyle, lang, ideasHint);
          if (ideas && ideas.length > 0) setScenes(ideas);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingIdeas(false);
      }
  };

  const addScene = () => scenes.length < 15 && setScenes(prev => [...prev, '']);
  const removeScene = (index: number) => scenes.length > 1 && setScenes(prev => prev.filter((_, i) => i !== index));
  const updateScene = (index: number, value: string) => setScenes(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
  });

  const renderBilingualScene = (scene: string, index: number) => {
    const parts = scene.split("English (for the tool):");
    const russian = parts[0]?.replace("Русский:", "").trim();
    const english = parts[1]?.trim();

    return (
        <div key={index} className="flex flex-col gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-100 group shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-[#FF1E1E] uppercase tracking-[0.2em]">VISUAL LOCKDOWN ACT #{index + 1}</span>
                <button onClick={() => removeScene(index)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
            
            {russian ? (
                <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-inner">
                        <span className="text-[9px] font-black text-gray-400 uppercase mb-1 block">РУССКИЙ (Визуальный Канон):</span>
                        <textarea 
                            value={russian} 
                            onChange={(e) => updateScene(index, `Русский: ${e.target.value}\nEnglish (for the tool): ${english || ''}`)} 
                            className="w-full h-20 bg-transparent text-sm text-gray-800 font-medium focus:outline-none resize-none" 
                        />
                    </div>
                    {english && (
                        <div className="bg-gray-900 p-3 rounded-xl shadow-inner">
                            <span className="text-[9px] font-black text-red-500 uppercase mb-1 block">ENGLISH (Lockdown Tool Code):</span>
                            <textarea 
                                value={english} 
                                onChange={(e) => updateScene(index, `Русский: ${russian}\nEnglish (for the tool): ${e.target.value}`)} 
                                className="w-full h-20 bg-transparent text-xs text-green-400 font-mono focus:outline-none resize-none" 
                            />
                        </div>
                    )}
                </div>
            ) : (
                <textarea 
                    value={scene} 
                    onChange={(e) => updateScene(index, e.target.value)} 
                    placeholder={t.scScenePlaceholder} 
                    className="w-full h-24 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none font-medium" 
                />
            )}
        </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-red-50 rounded-xl text-[#FF1E1E]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1v14a1 1 0 001 1z" /></svg>
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-gray-900">Visual Lockdown Narrative</h2>
                 <p className="text-gray-500 text-sm">Rigid Consistency: Specific Gear Brands & Negative Constraints</p>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.idUploadLabel}</label>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <div className={`relative w-full aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden group ${referenceImage ? 'border-[#FF1E1E] bg-gray-50' : 'border-gray-300 hover:border-[#FF1E1E] hover:bg-gray-50'}`}>
                    {referenceImage ? (
                        <>
                            <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm">Изменить</button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6 flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <button onClick={() => fileInputRef.current?.click()} className="bg-[#FF1E1E] text-white px-5 py-2.5 rounded-xl font-bold text-sm">Загрузить</button>
                            {galleryImages.length > 0 && <button onClick={() => setIsGalleryOpen(true)} className="mt-4 text-gray-600 hover:text-[#FF1E1E] font-bold text-sm">Выбрать из галереи</button>}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 mt-2">
                     <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value as CinematicStyle)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl font-semibold text-gray-800 outline-none">
                        {CINEMATIC_STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                     </select>
                     <div className="grid grid-cols-2 gap-4">
                        <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} lang={lang} disabled={isLoading} />
                        <ModelSelect value={selectedModel} onChange={setSelectedModel} lang={lang} disabled={isLoading} filter={m => m.startsWith('gemini')} />
                     </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acts & Continuity</label>
                </div>
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-red-900/60 uppercase tracking-wider">{t.scIdeasHintLabel}</label>
                        <button onClick={handleGenerateIdeas} disabled={isGeneratingIdeas} className="text-xs font-bold text-[#FF1E1E] hover:underline disabled:opacity-50">
                            {isGeneratingIdeas ? t.ideasThinking : "+ CREATE 10 LOCKED ACTS"}
                        </button>
                    </div>
                    <textarea value={ideasHint} onChange={(e) => setIdeasHint(e.target.value)} placeholder="Narrative theme (e.g. Red Jacket, White Helmet...)" className="w-full h-16 bg-white border border-red-100 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none resize-none" />
                </div>

                <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {scenes.map((scene, index) => renderBilingualScene(scene, index))}
                    {scenes.length < 15 && <button onClick={addScene} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-black text-xs uppercase tracking-widest hover:border-[#FF1E1E] hover:text-[#FF1E1E] hover:bg-red-50 transition-all">{t.scAddScene}</button>}
                </div>

                <div className="mt-auto pt-4 relative">
                     {progress && (
                        <div className="mb-4">
                            <div className="flex justify-between text-[10px] font-bold text-red-600 mb-1">
                                <span>LOCKED GENERATION...</span>
                                <span>{progress.current} / {progress.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                     )}
                     <GenerateButton onClick={handleGenerateClick} isLoading={isLoading} disabled={!referenceImage || scenes.every(s => s.trim() === '')} lang={lang} />
                </div>
            </div>
        </div>

        {isGalleryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setIsGalleryOpen(false)}>
                <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Выбрать из галереи</h3>
                        <button onClick={() => setIsGalleryOpen(false)} className="text-gray-400 hover:text-gray-900"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                    <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {galleryImages.map(img => (
                            <div key={img.id} onClick={() => handleSelectFromGallery(img)} className="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#FF1E1E]"><img src={img.url} className="w-full h-full object-cover" /></div>
                        ))}
                    </div>
                </div>
            </div>
        )}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.1);
            border-radius: 10px;
          }
        `}</style>
    </div>
  );
};
