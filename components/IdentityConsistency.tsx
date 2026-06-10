import React, { useState, useRef } from 'react';
import { AspectRatio, ImageCount, Language, GeneratedImage, AiModel } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ImageCountSelect } from './ImageCountSelect';
import { ModelSelect } from './ModelSelect';
import { useImageActions } from '../hooks/useImageActions';

interface IdentityConsistencyProps {
  lang: Language;
  onGenerate: (prompt: string, aspectRatio: AspectRatio, count: ImageCount, model: AiModel, referenceImage: string) => void;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
}

export const IdentityConsistency: React.FC<IdentityConsistencyProps> = ({ lang, onGenerate, isLoading, galleryImages }) => {
  const t = translations[lang];
  const { generateSevenAnglesBatch, generationProgress } = useImageActions();
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageCount, setImageCount] = useState<ImageCount>(7);
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = async () => {
    if (referenceImage && prompt) {
      if (imageCount === 7) {
          // Pass aspectRatio to the batch generator
          await generateSevenAnglesBatch(prompt, selectedModel, referenceImage, aspectRatio);
      } else {
          onGenerate(prompt, aspectRatio, imageCount, selectedModel, referenceImage);
      }
    }
  };

  const handleMatrixClick = async () => {
    if (referenceImage && prompt) {
      // Pass aspectRatio to the batch generator
      await generateSevenAnglesBatch(prompt, selectedModel, referenceImage, aspectRatio);
    }
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
      setReferenceImage(img.url);
      setIsGalleryOpen(false);
  };

  const filterGeminiModels = (modelId: AiModel) => {
      return modelId.startsWith('gemini');
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 rounded-xl text-[#FF1E1E]">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t.idTitle}</h2>
                    <p className="text-gray-500 text-sm">{t.idSubtitle}</p>
                </div>
            </div>

            {referenceImage && prompt && (
                <button 
                    onClick={handleMatrixClick}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 group border-2 border-red-600"
                >
                    <svg className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                    {t.idSevenAnglesBtn}
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.idUploadLabel}</label>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                />

                <div 
                    className={`
                        relative w-full rounded-2xl border-2 border-dashed 
                        flex flex-col items-center justify-center transition-all overflow-hidden group
                        ${referenceImage ? 'border-[#FF1E1E] bg-gray-50' : 'border-gray-300 hover:border-[#FF1E1E] hover:bg-gray-50'}
                    `}
                    style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                >
                    {referenceImage ? (
                        <>
                            <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    {t.idChangeRef}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-6 flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 font-medium text-sm mb-4">{t.idNoRef}</p>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#FF1E1E] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                            >
                                Upload Photo
                            </button>
                            
                            {galleryImages.length > 0 && (
                                <>
                                    <div className="flex items-center gap-2 w-full my-4">
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                        <span className="text-xs text-gray-400 font-bold">OR</span>
                                        <div className="h-px bg-gray-200 flex-1"></div>
                                    </div>
                                    <button 
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="text-gray-600 hover:text-[#FF1E1E] font-bold text-sm flex items-center gap-2 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                        {t.idSelectGallery}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {referenceImage && prompt && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{t.idSevenAnglesDesc}</p>
                        <div className="flex flex-wrap gap-1.5 opacity-60">
                             {['idAngle1', 'idAngle2', 'idAngle3', 'idAngle4', 'idAngle5', 'idAngle6', 'idAngle7'].map(angleKey => (
                                 <span key={angleKey} className="px-2 py-1 bg-white border border-gray-200 rounded text-[9px] font-black text-gray-600">{(t as any)[angleKey]}</span>
                             ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.idPromptLabel}</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.idPromptPlaceholder}
                        disabled={isLoading}
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-[#FF1E1E] focus:border-[#FF1E1E] resize-none text-gray-800 placeholder-gray-400 text-base shadow-inner"
                    />
                </div>

                <div className="flex flex-col gap-4">
                     <ModelSelect 
                        value={selectedModel} 
                        onChange={setSelectedModel} 
                        lang={lang} 
                        disabled={isLoading}
                        filter={filterGeminiModels}
                     />
                    <div className="grid grid-cols-2 gap-4">
                        <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} lang={lang} disabled={isLoading} />
                        <ImageCountSelect value={imageCount} onChange={setImageCount} lang={lang} disabled={isLoading} />
                    </div>
                </div>

                <div className="mt-auto">
                    {generationProgress && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-pulse">
                            <div className="flex justify-between text-[10px] font-black text-rose-600 mb-2 uppercase tracking-widest">
                                <span>Генерация ракурса: {generationProgress.label}</span>
                                <span>{generationProgress.current} / {generationProgress.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-rose-600 transition-all duration-500"
                                    style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                     <GenerateButton 
                        onClick={handleGenerateClick} 
                        isLoading={isLoading} 
                        disabled={!referenceImage || !prompt.trim()}
                        lang={lang}
                    />
                </div>
            </div>
        </div>

        {/* Gallery Selector Modal */}
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