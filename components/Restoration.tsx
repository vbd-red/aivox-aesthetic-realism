
import React, { useState, useRef } from 'react';
import { Language, AiModel, RestorationConfig, AspectRatio, GeneratedImage } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { ModelSelect } from './ModelSelect';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { AspectRatioSelect } from './AspectRatioSelect';

interface RestorationProps {
  lang: Language;
  onGenerate: (srcImage: string, config: RestorationConfig, model: AiModel, aspectRatio: AspectRatio) => Promise<string>;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
}

export const Restoration: React.FC<RestorationProps> = ({ lang, onGenerate, isLoading, galleryImages }) => {
  const t = translations[lang];
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const [config, setConfig] = useState<RestorationConfig>({
    level: 'balanced',
    colorize: false,
    enhanceFaces: true,
    description: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrcImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
      setSrcImage(img.url);
      setResultImage(null);
      setIsGalleryOpen(false);
  };

  const handleGenerateClick = async () => {
    if (srcImage) {
      const result = await onGenerate(srcImage, config, selectedModel, aspectRatio);
      if (result) {
        setResultImage(result);
      }
    }
  };

  const filterGeminiModels = (modelId: AiModel) => {
      return modelId.startsWith('gemini');
  };

  const ConfigOption = ({ 
    label, 
    active, 
    onClick,
    color = "bg-gray-100 text-gray-600"
  }: { label: string, active: boolean, onClick: () => void, color?: string }) => (
    <button
        onClick={onClick}
        className={`
            px-4 py-2 rounded-lg font-bold text-sm transition-all border-2
            ${active 
                ? 'bg-[#FF1E1E] text-white border-[#FF1E1E] shadow-md transform scale-105' 
                : `${color} border-transparent hover:bg-gray-200`}
        `}
    >
        {label}
    </button>
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-red-50 rounded-xl text-[#FF1E1E]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-gray-900">{t.resTitle}</h2>
                 <p className="text-gray-500 text-sm">{t.resSubtitle}</p>
             </div>
        </div>

        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                 {resultImage && srcImage ? (
                    <div className="flex flex-col gap-2 animate-fade-in">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.resCompare}</label>
                        <BeforeAfterSlider beforeImage={srcImage} afterImage={resultImage} />
                        <div className="flex justify-between mt-2">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-gray-500 text-sm hover:text-black font-medium underline"
                            >
                                {t.opChangeImage}
                            </button>
                            <a 
                                href={resultImage} 
                                download={`restored-${Date.now()}.png`} 
                                className="text-[#FF1E1E] text-sm font-bold hover:underline"
                            >
                                {t.save}
                            </a>
                        </div>
                    </div>
                 ) : (
                    <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.resUploadLabel}</label>
                         {srcImage ? (
                             <div className="relative group rounded-2xl overflow-hidden border-2 border-[#FF1E1E]">
                                 <img src={srcImage} alt="Original" className="w-full h-auto object-contain bg-gray-50" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm"
                                     >
                                        {t.opChangeImage}
                                     </button>
                                 </div>
                             </div>
                         ) : (
                             <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-[#FF1E1E] hover:bg-red-50 transition-all group"
                                >
                                    <div className="p-4 bg-gray-100 rounded-full group-hover:bg-white text-gray-400 group-hover:text-[#FF1E1E] transition-colors">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    </div>
                                    <span className="text-gray-500 font-bold">{t.resUploadLabel}</span>
                                </button>

                                {galleryImages.length > 0 && (
                                    <button 
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="text-gray-500 hover:text-[#FF1E1E] font-bold text-sm flex items-center justify-center gap-2 transition-colors py-2 border border-gray-200 rounded-xl hover:border-[#FF1E1E]"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                        {t.idSelectGallery}
                                    </button>
                                )}
                             </div>
                         )}
                    </div>
                 )}
            </div>

            <div className="flex flex-col gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     <h3 className="font-bold text-gray-800">{t.resConfigLabel}</h3>
                </div>

                <div className="flex flex-col gap-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.resLevel}</label>
                     <div className="flex flex-wrap gap-2">
                        <ConfigOption label={t.resLevelLow} active={config.level === 'low'} onClick={() => setConfig(p => ({...p, level: 'low'}))} />
                        <ConfigOption label={t.resLevelBalanced} active={config.level === 'balanced'} onClick={() => setConfig(p => ({...p, level: 'balanced'}))} />
                        <ConfigOption label={t.resLevelHigh} active={config.level === 'aggressive'} onClick={() => setConfig(p => ({...p, level: 'aggressive'}))} />
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.colorize ? 'border-[#FF1E1E] bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        onClick={() => setConfig(p => ({...p, colorize: !p.colorize}))}
                     >
                         <div className="flex items-center gap-2 mb-1">
                             <div className={`w-5 h-5 rounded border flex items-center justify-center ${config.colorize ? 'bg-[#FF1E1E] border-[#FF1E1E]' : 'border-gray-400'}`}>
                                 {config.colorize && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                             </div>
                             <span className="font-bold text-gray-800 text-sm">{t.resColorize}</span>
                         </div>
                     </div>

                     <div 
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${config.enhanceFaces ? 'border-[#FF1E1E] bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        onClick={() => setConfig(p => ({...p, enhanceFaces: !p.enhanceFaces}))}
                     >
                         <div className="flex items-center gap-2 mb-1">
                             <div className={`w-5 h-5 rounded border flex items-center justify-center ${config.enhanceFaces ? 'bg-[#FF1E1E] border-[#FF1E1E]' : 'border-gray-400'}`}>
                                 {config.enhanceFaces && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                             </div>
                             <span className="font-bold text-gray-800 text-sm">{t.resEnhanceFaces}</span>
                         </div>
                     </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Details</label>
                    <textarea 
                        value={config.description}
                        onChange={(e) => setConfig(p => ({...p, description: e.target.value}))}
                        placeholder={t.resDescriptionPlaceholder}
                        className="w-full h-24 p-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF1E1E] focus:border-[#FF1E1E] resize-none text-sm"
                    />
                </div>

                <div className="mt-auto flex flex-col gap-4">
                     <ModelSelect 
                        value={selectedModel} 
                        onChange={setSelectedModel} 
                        lang={lang} 
                        disabled={isLoading}
                        filter={filterGeminiModels}
                     />
                     <AspectRatioSelect 
                        value={aspectRatio} 
                        onChange={setAspectRatio} 
                        lang={lang} 
                        disabled={isLoading} 
                     />
                     <GenerateButton 
                        onClick={handleGenerateClick} 
                        isLoading={isLoading} 
                        disabled={!srcImage}
                        lang={lang}
                    />
                 </div>
            </div>
        </div>

        {isGalleryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsGalleryOpen(false)}>
                <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">{t.idSelectGallery}</h3>
                        <button onClick={() => setIsGalleryOpen(false)} className="text-gray-400 hover:text-gray-900">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {galleryImages.map(img => (
                            <div 
                                key={img.id} 
                                onClick={() => handleSelectFromGallery(img)}
                                className="aspect-square rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#FF1E1E] relative group"
                            >
                                <img src={img.url} className="w-full h-full object-cover" alt="gallery item" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
