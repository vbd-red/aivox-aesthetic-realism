import React, { useCallback, useMemo, useState } from 'react';
import JSZip from 'jszip';
import { AppProvider, useAppContext } from './AppContext';
import { useImageActions } from './hooks/useImageActions';
import { PromptInput } from './components/PromptInput';
import { AspectRatioSelect } from './components/AspectRatioSelect';
import { ImageCountSelect } from './components/ImageCountSelect';
import { ModelSelect } from './components/ModelSelect';
import { GenerateButton } from './components/GenerateButton';
import { ImageGallery } from './components/ImageGallery';
import { TabSelector } from './components/TabSelector';
import { PromptGenerator } from './components/PromptGenerator';
import { AvatarBuilder } from './components/AvatarBuilder';
import { IdentityConsistency } from './components/IdentityConsistency';
import { Outpainting } from './components/Outpainting';
import { Restoration } from './components/Restoration';
import { CinematicScenarios } from './components/CinematicScenarios';
import { ImageFusion } from './components/ImageFusion';
import { InitialFrameGenerator } from './components/InitialFrameGenerator';
import { NanoBananaGenerator } from './components/NanoBananaGenerator';
import { translations } from './translations';
import { ActiveTab, AiModel, AspectRatio, ImageCount } from './types';

const AppContent: React.FC = () => {
  const { 
    lang, setLang, images, setImages, isLoading, error, setError,
    activeTab, setActiveTab, creativePrompts, setCreativePrompts,
    renderingMode, setRenderingMode
  } = useAppContext();

  const { 
    generateBasic, generateOutpaint, generateRestore, 
    generateScenarios, generateFusion, generateInitialFrameBatchAction, generationProgress 
  } = useImageActions();

  const t = translations[lang];

  const [prompt, setPrompt] = React.useState('');
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('1:1');
  const [imageCount, setImageCount] = React.useState<ImageCount>(1);
  const [selectedModel, setSelectedModel] = React.useState<AiModel>('gemini-2.5-flash-image');

  const handleGenerationError = useCallback(async (err: any) => {
    let errMsg = "";
    let rawError = err;
    
    try {
      if (typeof err === 'string') {
        const parsed = JSON.parse(err);
        rawError = parsed.error || parsed;
      } else if (err?.error) {
        rawError = err.error;
      }
      errMsg = rawError?.message || rawError?.status || err?.toString() || "";
    } catch {
      errMsg = err?.message || err?.toString() || "";
    }

    const upperMsg = errMsg.toUpperCase();
    const isQuotaExceeded = upperMsg.includes("QUOTA") || upperMsg.includes("429") || upperMsg.includes("RESOURCE_EXHAUSTED");
    const isDailyLimit = upperMsg.includes("DAY") || (upperMsg.includes("LIMIT") && upperMsg.includes("0"));
    
    if (isQuotaExceeded) {
      if (isDailyLimit) {
        setError("Суточный лимит генерации исчерпан (Daily Limit Reached). Попробуйте завтра или смените API ключ.");
      } else {
        const details = rawError?.details;
        let waitTime = "";
        if (Array.isArray(details)) {
          const retryInfo = details.find((d: any) => d['@type']?.includes('RetryInfo'));
          if (retryInfo?.retryDelay) {
            waitTime = ` Подождите ~${Math.ceil(parseFloat(retryInfo.retryDelay))} сек.`;
          }
        }
        setError(`Лимит запросов превышен.${waitTime} Система автоматически повторит попытку через несколько секунд.`);
      }
    } else {
      setError(errMsg || t.errorGen);
    }
  }, [setError, t.errorGen]);

  const handleDelete = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, [setImages]);

  const handleDeleteAll = useCallback(() => {
    setImages([]);
  }, [setImages]);

  const handleDownloadAll = useCallback(async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    images.forEach((img, index) => {
      const base64Data = img.url.split(',')[1];
      zip.file(`aivox-${index+1}.png`, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content as Blob);
    link.download = `aivox-gallery-${Date.now()}.zip`;
    link.click();
  }, [images]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case 'generate':
        return (
          <div className="bg-gradient-to-r from-[#FFB800] to-[#FF1E1E] p-[10px] rounded-[15px] shadow-xl mb-10 animate-fade-in">
            <div className="flex flex-col gap-6 p-2">
              <PromptInput value={prompt} onChange={setPrompt} disabled={isLoading} lang={lang} />
              <div className="flex flex-col xl:flex-row gap-6 items-end">
                <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4">
                  <ModelSelect value={selectedModel} onChange={setSelectedModel} disabled={isLoading} lang={lang} />
                  <div className="flex gap-4">
                    <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} disabled={isLoading} lang={lang} />
                    <ImageCountSelect value={imageCount} onChange={setImageCount} disabled={isLoading} lang={lang} />
                  </div>
                </div>
                <div className="w-full xl:flex-grow flex flex-col gap-2">
                  {generationProgress && activeTab === 'generate' && (
                    <div className="w-full px-1">
                      <div className="flex justify-between text-[10px] font-bold text-white mb-1 drop-shadow-sm">
                        <span>ГЕНЕРАЦИЯ... {Math.round((generationProgress.current / generationProgress.total) * 100)}%</span>
                        <span>{generationProgress.current} / {generationProgress.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-500"
                          style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <GenerateButton 
                    onClick={async () => {
                      generateBasic(prompt, aspectRatio, imageCount, selectedModel).catch(handleGenerationError);
                    }} 
                    isLoading={isLoading} 
                    disabled={!prompt.trim()} 
                    lang={lang} 
                  />
                </div>
              </div>
            </div>
            {error && <div className="mt-6 mx-2 p-4 bg-red-900/40 border border-red-500/50 text-white text-sm rounded-xl animate-pulse backdrop-blur-md">{error}</div>}
          </div>
        );
      case 'nano-banana':
        return (
          <NanoBananaGenerator 
            lang={lang}
            isLoading={isLoading}
            progress={generationProgress}
            onGenerate={(p, r, c, m) => generateBasic(p, r, c, m).catch(handleGenerationError)}
          />
        );
      case 'initial-frame':
        return (
          <InitialFrameGenerator 
            lang={lang} 
            galleryImages={images} 
            isLoading={isLoading} 
            progress={generationProgress}
            onGenerate={async (refs, ps, r, m, style) => {
              try {
                return await generateInitialFrameBatchAction(refs, ps, r, m, style);
              } catch (e) {
                handleGenerationError(e);
                return [];
              }
            }} 
          />
        );
      case 'avatar':
        return <AvatarBuilder lang={lang} onGenerate={(p, r, c, m) => generateBasic(p, r, c, m).catch(handleGenerationError)} isLoading={isLoading} />;
      case 'identity':
        return <IdentityConsistency lang={lang} onGenerate={(p, r, c, m, ref) => generateBasic(p, r, c, m, ref).catch(handleGenerationError)} isLoading={isLoading} galleryImages={images} />;
      case 'outpainting':
        return <Outpainting lang={lang} onGenerate={(src, p, r, m) => generateOutpaint(src, p, r, m).catch(handleGenerationError)} isLoading={isLoading} galleryImages={images} />;
      case 'restoration':
        return <Restoration lang={lang} onGenerate={(src, cfg, m, r) => generateRestore(src, cfg, m, r).catch(handleGenerationError)} isLoading={isLoading} galleryImages={images} />;
      case 'scenarios':
        return <CinematicScenarios lang={lang} onGenerate={(ps, s, r, m, ref) => generateScenarios(ps, s, r, m, ref).catch(handleGenerationError)} isLoading={isLoading} galleryImages={images} progress={generationProgress} />;
      case 'image-fusion':
        return <ImageFusion lang={lang} onGenerate={(i1, i2, p, r, m) => generateFusion(i1, i2, p, r, m).catch(handleGenerationError)} isLoading={isLoading} galleryImages={images} />;
      case 'ideas':
        return (
          <PromptGenerator 
            onSelectPrompt={(p) => { setPrompt(p); setActiveTab('generate'); window.scrollTo({top:0, behavior:'smooth'}); }} 
            lang={lang}
            prompts={creativePrompts}
            onUpdatePrompts={setCreativePrompts}
            onDeletePrompt={(id) => setCreativePrompts(prev => prev.filter(p => p.id !== id))}
            onClearPrompts={() => setCreativePrompts([])}
          />
        );
      default:
        return null;
    }
  }, [activeTab, prompt, aspectRatio, imageCount, selectedModel, isLoading, lang, error, images, creativePrompts, generationProgress, handleGenerationError, generateInitialFrameBatchAction]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <TabSelector 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        lang={lang} 
        setLang={setLang}
        renderingMode={renderingMode}
        setRenderingMode={setRenderingMode}
      />
      <main className="flex-grow w-full md:pl-72">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
          {tabContent}
          <div id="image-gallery">
            <ImageGallery images={images} onDelete={handleDelete} onDownloadAll={handleDownloadAll} onDeleteAll={handleDeleteAll} lang={lang} />
          </div>
        </div>
        <footer className="mt-16 text-center text-white/80 text-sm py-8">
          <div className="flex justify-center items-center gap-2 font-medium">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            {t.footer}
          </div>
        </footer>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;