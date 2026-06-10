import React, { useState, useRef } from 'react';
import { AspectRatio, Language, AiModel, GeneratedImage } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ModelSelect } from './ModelSelect';

interface OutpaintingProps {
  lang: Language;
  onGenerate: (srcImage: string, prompt: string, aspectRatio: AspectRatio, model: AiModel) => void;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
}

export const Outpainting: React.FC<OutpaintingProps> = ({ lang, onGenerate, isLoading, galleryImages }) => {
  const t = translations[lang];
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isApiKeyPromptVisible, setIsApiKeyPromptVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkApiKey = async () => {
    const aistudio = (window as any).aistudio;
    // Check if the model is one that REQUIRES a paid key (gemini-3-pro-image-preview)
    if (aistudio && selectedModel === 'gemini-3-pro-image-preview' && !(await aistudio.hasSelectedApiKey())) {
      setIsApiKeyPromptVisible(true);
      return false;
    }
    return true;
  };

  const handleOpenSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      setIsApiKeyPromptVisible(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrcImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
      setSrcImage(img.url);
      setIsGalleryOpen(false);
  };

  const handleGenerateClick = async () => {
    if (srcImage && prompt.trim()) {
      const hasKey = await checkApiKey();
      if (!hasKey) return;
      onGenerate(srcImage, prompt, aspectRatio, selectedModel);
    }
  };

  const filterImageModels = (modelId: AiModel) => {
      // Outpainting works best on Flash and Pro image models
      return modelId.includes('image') || modelId.includes('imagen');
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-red-50 rounded-xl text-[#FF1E1E]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-gray-900">{t.opTitle}</h2>
                 <p className="text-gray-500 text-sm">{t.opSubtitle}</p>
             </div>
        </div>

        {isApiKeyPromptVisible && (
          <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-orange-900">
              <span className="text-2xl">🔑</span>
              <div>
                <p className="font-bold">Paid API Key Required for Gemini 3 Pro</p>
                <p className="text-orange-700 text-xs">This model requires an active billing account. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">Docs</a></p>
              </div>
            </div>
            <button onClick={handleOpenSelectKey} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest">Select Key</button>
          </div>
        )}

        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-gray-100 rounded-2xl p-4 md:p-8 flex items-center justify-center relative overflow-hidden min-h-[400px]">
                <div className="absolute inset-0 opacity-10" 
                     style={{ backgroundImage: 'linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {srcImage ? (
                    <div className="relative z-10 flex flex-col items-center w-full max-w-lg">
                        <div 
                            className="relative border-4 border-dashed border-[#FF1E1E]/50 bg-white/50 backdrop-blur-sm shadow-xl flex items-center justify-center overflow-hidden transition-all duration-500"
                            style={{
                                width: '100%',
                                aspectRatio: aspectRatio.replace(':', '/')
                            }}
                        >
                            <img 
                                src={srcImage} 
                                alt="Source" 
                                className="max-w-[80%] max-h-[80%] object-contain shadow-2xl rounded-lg border border-white" 
                            />
                            
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#FF1E1E] animate-bounce">
                                <svg className="w-6 h-6 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#FF1E1E] animate-bounce">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>

                         <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-6 bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all shadow-md z-20"
                        >
                            {t.opChangeImage}
                        </button>
                    </div>
                ) : (
                    <div className="text-center relative z-10 flex flex-col items-center">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#FF1E1E] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            {t.opUploadLabel}
                        </button>

                        {galleryImages.length > 0 && (
                            <button 
                                onClick={() => setIsGalleryOpen(true)}
                                className="mt-4 bg-white/50 hover:bg-white text-gray-600 hover:text-[#FF1E1E] px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                {t.idSelectGallery}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6">
                 <div>
                    <AspectRatioSelect 
                        value={aspectRatio} 
                        onChange={setAspectRatio} 
                        lang={lang} 
                        disabled={isLoading} 
                    />
                    <p className="text-[10px] font-black uppercase text-gray-400 mt-2 tracking-widest">{t.opCanvasLabel}</p>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t.opPromptLabel}</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.opPromptPlaceholder}
                        disabled={isLoading}
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-[#FF1E1E] focus:border-[#FF1E1E] resize-none text-gray-800 placeholder-gray-400 text-sm shadow-inner outline-none"
                    />
                 </div>

                 <div className="mt-auto flex flex-col gap-4">
                     <ModelSelect 
                        value={selectedModel} 
                        onChange={setSelectedModel} 
                        lang={lang} 
                        disabled={isLoading}
                        filter={filterImageModels}
                     />
                     <GenerateButton 
                        onClick={handleGenerateClick} 
                        isLoading={isLoading} 
                        disabled={!srcImage || !prompt.trim()}
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