import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { AspectRatio, Language, AiModel, GeneratedImage } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ModelSelect } from './ModelSelect';

interface InitialFrameGeneratorProps {
  lang: Language;
  onGenerate: (refs: string[], prompts: string[], aspectRatio: AspectRatio, model: AiModel, style?: string) => Promise<GeneratedImage[]>;
  isLoading: boolean;
  galleryImages: GeneratedImage[];
  progress: { current: number, total: number } | null;
}

export const InitialFrameGenerator: React.FC<InitialFrameGeneratorProps> = ({ lang, onGenerate, isLoading, galleryImages, progress }) => {
  const t = translations[lang];
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [promptText, setPromptText] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<GeneratedImage[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const remainingSlots = 6 - referenceImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setReferenceImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeReference = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectFromGallery = (img: GeneratedImage) => {
    if (referenceImages.length < 6) {
      setReferenceImages(prev => [...prev, img.url]);
    }
    setIsGalleryOpen(false);
  };

  const handleGenerateClick = async () => {
    const prompts = promptText.split('\n').map(p => p.trim()).filter(p => p.length > 0);
    if (referenceImages.length > 0 && prompts.length > 0) {
      setSessionResults([]); 
      const results = await onGenerate(referenceImages, prompts, aspectRatio, selectedModel, "");
      setSessionResults(results);
    }
  };

  const handleDownloadZip = async () => {
    if (sessionResults.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      sessionResults.forEach((img, idx) => {
        const base64Data = img.url.split(',')[1];
        zip.file(`frame-${idx + 1}.png`, base64Data, { base64: true });
      });
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content as any);
      link.download = `initial-frames-${Date.now()}.zip`;
      link.click();
    } catch (err) {
      console.error("ZIP Error:", err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleSaveSingle = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `frame-${img.id.slice(0, 8)}.png`;
    link.click();
  };

  const isAnchorActive = referenceImages.length >= 1 && referenceImages.length <= 6;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t.ifTitle}</h2>
            <p className="text-gray-500 text-sm font-medium">{t.ifSubtitle}</p>
          </div>
        </div>
        
        {isAnchorActive && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl border border-green-100 animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{t.ifAnchorActive}</span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.ifUploadLabel}</label>
              <p className="text-[10px] text-gray-500 font-bold mt-1">Визуальный канон: лицо, стиль, одежда</p>
            </div>
            <span className={`px-3 py-1 rounded-lg border text-xs font-black shadow-sm ${isAnchorActive ? 'bg-white border-rose-600 text-rose-600' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
              {referenceImages.length} / 6
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {referenceImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-white shadow-md transition-all hover:scale-[1.02]">
                <img src={img} className="w-full h-full object-cover" alt={`Ref ${idx}`} />
                <button 
                  onClick={() => removeReference(idx)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                   <span className="text-[8px] text-white font-black uppercase">REF {idx + 1}</span>
                </div>
              </div>
            ))}
            {referenceImages.length < 6 && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-300 hover:border-rose-600 hover:text-rose-600 transition-all bg-white hover:bg-rose-50 group"
              >
                <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider">Add Ref</span>
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsGalleryOpen(true)}
            className="w-full py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black text-gray-600 hover:border-rose-600 hover:text-rose-600 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            ВЫБРАТЬ ИЗ ГАЛЕРЕИ
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.ifPromptLabel}</label>
                <div className="text-[10px] font-black text-rose-600 uppercase tracking-tighter">1 Line = 1 Frame</div>
              </div>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={t.ifPromptPlaceholder}
                disabled={isLoading}
                className="w-full h-48 p-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:ring-0 focus:border-rose-600 resize-none text-gray-800 placeholder-gray-400 text-sm font-medium shadow-inner outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ModelSelect 
              value={selectedModel} 
              onChange={setSelectedModel} 
              lang={lang} 
              disabled={isLoading}
              filter={m => m.startsWith('gemini')}
            />
            <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} lang={lang} disabled={isLoading} />
          </div>

          <div className="mt-auto">
            {progress && (
              <div className="mb-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 animate-pulse">
                <div className="flex justify-between text-[10px] font-black text-rose-600 mb-2 uppercase tracking-widest">
                  <span>Последовательная генерация кадров...</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-600 transition-all duration-500"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            <GenerateButton 
              onClick={handleGenerateClick} 
              isLoading={isLoading} 
              disabled={!isAnchorActive || !promptText.trim()}
              lang={lang}
            />
          </div>
        </div>
      </div>

      {sessionResults.length > 0 && (
        <div className="mt-4 pt-8 border-t-2 border-gray-50 animate-fade-in">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-rose-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{t.ifSessionResults}</h3>
              </div>
              <button 
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="text-xs font-black text-gray-900 border-2 border-gray-900 px-4 py-2 rounded-xl hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50"
              >
                {isZipping ? 'Zipping...' : t.ifDownloadZip}
              </button>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {sessionResults.map((img, idx) => (
               <div key={img.id} className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                 <div className="aspect-[16/9] relative overflow-hidden bg-gray-200">
                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="result" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                       <button 
                        onClick={() => handleSaveSingle(img)}
                        className="bg-white text-gray-900 p-2.5 rounded-xl font-bold shadow-lg hover:bg-gray-100 transform active:scale-95 transition-all"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       </button>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                       Frame {idx + 1}
                    </div>
                 </div>
                 <div className="p-4">
                    <p className="text-[10px] text-gray-600 font-medium line-clamp-2 italic">"{img.prompt.replace('Initial Frame: ', '')}"</p>
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
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Выбрать визуальные референсы</h3>
              <button onClick={() => setIsGalleryOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50">
              {galleryImages.map(img => (
                <div 
                  key={img.id} 
                  onClick={() => handleSelectFromGallery(img)}
                  className="aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent hover:border-rose-600 relative group shadow-sm transition-all"
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