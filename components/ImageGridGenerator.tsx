
import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { AspectRatio, Language, AiModel, GeneratedImage } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ModelSelect } from './ModelSelect';

interface ImageGridGeneratorProps {
  lang: Language;
  onGenerate: (refs: string[], prompts: string[], aspectRatio: AspectRatio, model: AiModel) => Promise<GeneratedImage[]>;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
  progress: { current: number, total: number } | null;
}

const STYLES = ["Modern cinema", "Dark Fantasy"];

const SHOT_TYPES = [
  "Extreme Long Shot",
  "Long Shot",
  "Medium Long Shot",
  "Medium Shot",
  "Medium Close-Up",
  "Close-Up",
  "Extreme Close-Up",
  "Low Angle",
  "High Angle"
];

export const ImageGridGenerator: React.FC<ImageGridGeneratorProps> = ({ lang, onGenerate, isLoading, galleryImages, progress }) => {
  const t = translations[lang];
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<GeneratedImage[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClick = async () => {
    if (!prompt.trim() || !referenceImage) return;
    
    setSessionResults([]);
    const prompts = SHOT_TYPES.map(type => 
      `${type} of ${prompt}. Visual Style: ${selectedStyle}. High-end cinematic composition, professional lighting.`
    );
    
    const results = await onGenerate([referenceImage], prompts, aspectRatio, selectedModel);
    setSessionResults(results);
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
    setReferenceImage(img.url);
    setIsGalleryOpen(false);
  };

  const handleDownloadZip = async () => {
    if (sessionResults.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      sessionResults.forEach((img, idx) => {
        const base64Data = img.url.split(',')[1];
        zip.file(`story-grid-frame-${idx + 1}-${SHOT_TYPES[idx].replace(/\s+/g, '-').toLowerCase()}.png`, base64Data, { base64: true });
      });
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content as Blob);
      link.download = `story-grid-${Date.now()}.zip`;
      link.click();
    } catch (err) {
      console.error("ZIP Error:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleSaveSingle = (img: GeneratedImage, idx: number) => {
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `frame-${idx + 1}-${SHOT_TYPES[idx].replace(/\s+/g, '-').toLowerCase()}.png`;
    link.click();
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-xl text-[#FF1E1E]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.gridTitle}</h2>
            <p className="text-gray-500 text-sm">{t.gridSubtitle}</p>
          </div>
        </div>

        {sessionResults.length > 0 && (
          <button 
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isZipping ? 'Zipping...' : t.ifDownloadZip}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.ifUploadLabel}</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${referenceImage ? 'border-[#FF1E1E] bg-red-50' : 'border-gray-200 hover:border-[#FF1E1E] hover:bg-red-50'}`}
            >
              {referenceImage ? (
                <>
                  <img src={referenceImage} alt="Ref" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">Изменить референс</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-xs font-bold uppercase tracking-widest">Загрузить фото</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            
            {galleryImages.length > 0 && (
              <button 
                onClick={() => setIsGalleryOpen(true)}
                className="w-full py-2.5 bg-white border-2 border-gray-100 rounded-xl text-[10px] font-black text-gray-500 hover:border-[#FF1E1E] hover:text-[#FF1E1E] transition-all flex items-center justify-center gap-2"
              >
                ВЫБРАТЬ ИЗ ГАЛЕРЕИ
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.gridStyleLabel}</label>
            <div className="flex gap-2">
              {STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStyle(s)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all border-2 ${selectedStyle === s ? 'bg-[#FF1E1E] text-white border-[#FF1E1E] shadow-lg' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.inputLabel}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.inputPlaceholder}
              disabled={isLoading}
              className="w-full h-32 p-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:ring-0 focus:border-[#FF1E1E] resize-none text-gray-800 placeholder-gray-400 text-sm font-medium shadow-inner outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} lang={lang} disabled={isLoading} />
          </div>

          <div className="mt-auto">
            {progress && (
              <div className="mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-pulse">
                <div className="flex justify-between text-[10px] font-black text-rose-600 mb-2 uppercase tracking-widest">
                  <span>Batch Generation (1-9 Frames)</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FF1E1E] transition-all duration-500"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            <ModelSelect value={selectedModel} onChange={setSelectedModel} lang={lang} disabled={isLoading} filter={m => m.startsWith('gemini')} />
            <div className="mt-4">
               <GenerateButton 
                onClick={handleGenerateClick} 
                isLoading={isLoading} 
                disabled={!prompt.trim() || !referenceImage} 
                lang={lang} 
              />
            </div>
          </div>
        </div>
      </div>

      {sessionResults.length > 0 && (
        <div className="mt-4 pt-8 border-t-2 border-gray-50 animate-fade-in">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{t.ifSessionResults}</h3>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {sessionResults.map((img, idx) => (
               <div key={img.id} className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                 <div className="aspect-[16/9] relative overflow-hidden bg-gray-200">
                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Shot ${idx + 1}`} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button 
                        onClick={() => handleSaveSingle(img, idx)}
                        className="bg-white text-gray-900 p-2.5 rounded-xl font-bold shadow-lg hover:bg-gray-100 transform active:scale-95 transition-all"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-widest">
                       {SHOT_TYPES[idx]}
                    </div>
                 </div>
                 <div className="p-3">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">SHOT #{idx + 1}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {isGalleryOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsGalleryOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Выбрать из галереи</h3>
              <button onClick={() => setIsGalleryOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50">
              {galleryImages.map(img => (
                <div 
                  key={img.id} 
                  onClick={() => handleSelectFromGallery(img)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent hover:border-[#FF1E1E] relative group shadow-sm transition-all"
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
