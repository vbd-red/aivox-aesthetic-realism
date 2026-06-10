
import React, { useState, useRef } from 'react';
import { AspectRatio, Language, AiModel, GeneratedImage } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ModelSelect } from './ModelSelect';

interface ImageFusionProps {
  lang: Language;
  onGenerate: (img1: string, img2: string, prompt: string, aspectRatio: AspectRatio, model: AiModel) => void;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
}

export const ImageFusion: React.FC<ImageFusionProps> = ({ lang, onGenerate, isLoading, galleryImages }) => {
  const t = translations[lang];
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<'img1' | 'img2' | null>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openGalleryForSlot = (slot: 'img1' | 'img2') => {
      setActiveSlot(slot);
      setIsGalleryOpen(true);
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
      if (activeSlot === 'img1') {
          setImg1(img.url);
      } else if (activeSlot === 'img2') {
          setImg2(img.url);
      }
      setIsGalleryOpen(false);
      setActiveSlot(null);
  };

  const handleGenerateClick = async () => {
    if (img1 && img2) {
      onGenerate(img1, img2, prompt, aspectRatio, selectedModel);
    }
  };

  const filterGeminiModels = (modelId: AiModel) => {
      return modelId.startsWith('gemini');
  };

  const UploadBox = ({ 
      image, 
      label, 
      btnLabel, 
      inputRef, 
      onUpload,
      onGalleryClick
  }: { 
      image: string | null, 
      label: string, 
      btnLabel: string, 
      inputRef: React.RefObject<HTMLInputElement>, 
      onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void,
      onGalleryClick: () => void
  }) => (
    <div className="flex flex-col gap-2">
         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
         <input 
            type="file" 
            ref={inputRef} 
            onChange={onUpload} 
            accept="image/*" 
            className="hidden" 
        />
        <div 
            className={`
                relative w-full aspect-square rounded-2xl border-2 border-dashed 
                flex flex-col items-center justify-center transition-all overflow-hidden group
                ${image ? 'border-[#FF1E1E] bg-gray-50' : 'border-gray-300 hover:border-[#FF1E1E] hover:bg-gray-50'}
            `}
        >
            {image ? (
                <>
                    <img src={image} alt="Upload" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            onClick={() => inputRef.current?.click()}
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                            Change
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center p-6 flex flex-col items-center">
                    <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <button 
                        onClick={() => inputRef.current?.click()}
                        className="text-[#FF1E1E] font-bold text-sm hover:underline"
                    >
                        {btnLabel}
                    </button>
                    
                    {galleryImages.length > 0 && (
                         <button 
                            onClick={onGalleryClick}
                            className="mt-3 text-gray-400 hover:text-[#FF1E1E] text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            {t.idSelectGallery}
                        </button>
                    )}
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-red-50 rounded-xl text-[#FF1E1E]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
             </div>
             <div>
                 <h2 className="text-2xl font-bold text-gray-900">{t.fusTitle}</h2>
                 <p className="text-gray-500 text-sm">{t.fusSubtitle}</p>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Images */}
            <div className="grid grid-cols-2 gap-4">
                 <UploadBox 
                    image={img1} 
                    label={t.fusImg1Label} 
                    btnLabel={t.fusUpload1}
                    inputRef={fileInputRef1}
                    onUpload={(e) => handleFileUpload(e, setImg1)}
                    onGalleryClick={() => openGalleryForSlot('img1')}
                 />
                 <UploadBox 
                    image={img2} 
                    label={t.fusImg2Label} 
                    btnLabel={t.fusUpload2}
                    inputRef={fileInputRef2}
                    onUpload={(e) => handleFileUpload(e, setImg2)}
                    onGalleryClick={() => openGalleryForSlot('img2')}
                 />
            </div>

            {/* Right Column: Controls */}
            <div className="flex flex-col gap-6">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{t.fusPromptLabel}</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.fusPromptPlaceholder}
                        disabled={isLoading}
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-[#FF1E1E] focus:border-[#FF1E1E] resize-none text-gray-800 placeholder-gray-400 text-sm shadow-inner"
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
                        disabled={!img1 || !img2}
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
