
import React, { useState } from 'react';
import { AspectRatio, ImageCount, Language, AiModel } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ImageCountSelect } from './ImageCountSelect';
import { ModelSelect } from './ModelSelect';

interface NanoBananaGeneratorProps {
  lang: Language;
  onGenerate: (prompt: string, aspectRatio: AspectRatio, count: ImageCount, model: AiModel) => void;
  isLoading: boolean;
  progress: { current: number, total: number } | null;
}

export const NanoBananaGenerator: React.FC<NanoBananaGeneratorProps> = ({ lang, onGenerate, isLoading, progress }) => {
  const t = translations[lang];
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageCount, setImageCount] = useState<ImageCount>(1);
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      onGenerate(prompt, aspectRatio, imageCount, selectedModel);
    }
  };

  return (
    <div className="bg-white rounded-[15px] p-8 shadow-xl animate-fade-in flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-yellow-400 rounded-2xl text-white shadow-lg">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-display">{t.nbTitle}</h2>
          <p className="text-gray-500 font-medium">{t.nbSubtitle}</p>
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
            className="w-full h-40 p-6 bg-yellow-50/30 border-2 border-yellow-100 rounded-3xl focus:ring-0 focus:border-yellow-400 resize-none text-gray-800 placeholder-gray-400 text-lg font-medium shadow-inner outline-none transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="w-full sm:w-64">
                    <ModelSelect 
                      value={selectedModel} 
                      onChange={setSelectedModel} 
                      lang={lang} 
                      disabled={isLoading} 
                      filter={m => m.includes('gemini')}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} lang={lang} disabled={isLoading} />
                    </div>
                    <div className="w-28">
                        <ImageCountSelect value={imageCount} onChange={setImageCount} lang={lang} disabled={isLoading} />
                    </div>
                </div>
            </div>

            <div className="flex-grow w-full">
                {progress && (
                  <div className="mb-3 px-1">
                    <div className="flex justify-between text-[10px] font-black text-yellow-600 mb-1 uppercase">
                      <span>Nano Speed Gen...</span>
                      <span>{progress.current} / {progress.total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 transition-all duration-500"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                <GenerateButton 
                    onClick={handleGenerateClick} 
                    isLoading={isLoading} 
                    disabled={!prompt.trim()} 
                    lang={lang} 
                />
            </div>
        </div>
      </div>
    </div>
  );
};
