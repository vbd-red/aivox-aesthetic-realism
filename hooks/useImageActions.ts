import { useCallback, useState } from 'react';
import { useAppContext } from '../AppContext';
import { translations } from '../translations';
import { 
  generateHyperRealImages, 
  generateOutpainting, 
  restorePhoto, 
  generateCinematicScene, 
  generateImageFusion,
  generateInitialFrame
} from '../services/geminiService';
import { generateImage } from '../services/huggingfaceService';
import { 
  AspectRatio, 
  ImageCount, 
  AiModel, 
  GeneratedImage, 
  RestorationConfig, 
  CinematicStyle 
} from '../types';

export const useImageActions = () => {
  const { setImages, setIsLoading, setError, lang, renderingMode } = useAppContext();
  const t = translations[lang];
  const [generationProgress, setGenerationProgress] = useState<{current: number, total: number, label?: string} | null>(null);

  const scrollToGallery = () => {
    setTimeout(() => {
      const gallery = document.getElementById('image-gallery');
      if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const addImagesToGallery = useCallback((newImages: GeneratedImage[]) => {
    setImages(prev => [...newImages, ...prev]);
    scrollToGallery();
  }, [setImages]);

  const generateBasic = useCallback(async (prompt: string, ratio: AspectRatio, count: ImageCount, model: AiModel, ref?: string) => {
    setIsLoading(true);
    setError(null);
    setGenerationProgress({ current: 0, total: count });
    
    try {
     const urls: string[] = [];
      for (let i = 0; i < count; i++) {
        setGenerationProgress({ current: i + 1, total: count });
        const url = await generateImage(prompt);
        urls.push(url);
      }
      
      const newImgs: GeneratedImage[] = urls.map(url => ({
        id: crypto.randomUUID(),
        url,
        prompt,
        timestamp: Date.now()
      }));
      
      if (newImgs.length > 0) {
        addImagesToGallery(newImgs);
      }
    } catch (err: any) {
      console.error("Generation failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
      setGenerationProgress(null);
    }
  }, [setIsLoading, setError, addImagesToGallery, renderingMode]);

  const generateSevenAnglesBatch = useCallback(async (basePrompt: string, model: AiModel, ref: string, aspectRatio: AspectRatio) => {
    setIsLoading(true);
    setError(null);
    
    const anglePrompts = [
      { id: 'idAngle1', suffix: "Frontal portrait looking directly at the camera, clear view of face and clothing style." },
      { id: 'idAngle2', suffix: "Side view profile shot at a 90-degree angle, showing the silhouette from the side." },
      { id: 'idAngle3', suffix: "Three-quarter view portrait, body turned 45 degrees, providing a natural perspective." },
      { id: 'idAngle4', suffix: "High-angle shot looking down at the character from above, showing the hair and shoulders." },
      { id: 'idAngle5', suffix: "Low-angle heroic shot looking up from below, creating a powerful and tall presence." },
      { id: 'idAngle6', suffix: "Back view of the character standing with their back to the camera, head slightly turned." },
      { id: 'idAngle7', suffix: "Full-body shot from head to toe, showing the complete outfit and posture in the scene." }
    ];

    setGenerationProgress({ current: 0, total: 7, label: t.idAngle1 });
    const results: GeneratedImage[] = [];

    for (let i = 0; i < anglePrompts.length; i++) {
        try {
            const angleLabel = (t as any)[anglePrompts[i].id];
            setGenerationProgress({ current: i + 1, total: 7, label: angleLabel });
            
            const finalPrompt = `${basePrompt}. ${anglePrompts[i].suffix}`;
            // FIX: Pass the selected aspectRatio here instead of hardcoded '1:1'
            const url = await generateInitialFrame([ref], finalPrompt, aspectRatio, model, renderingMode);
            
            const newImg: GeneratedImage = {
                id: crypto.randomUUID(),
                url,
                prompt: `${angleLabel}: ${basePrompt}`,
                timestamp: Date.now()
            };
            results.push(newImg);
            addImagesToGallery([newImg]);

            if (i < anglePrompts.length - 1) {
                await new Promise(r => setTimeout(r, 5500));
            }
        } catch (err) {
            console.error(`Angle ${i+1} failed:`, err);
        }
    }

    setIsLoading(false);
    setGenerationProgress(null);
    return results;
  }, [setIsLoading, setError, addImagesToGallery, renderingMode, t]);

  const generateOutpaint = useCallback(async (src: string, prompt: string, ratio: AspectRatio, model: AiModel) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateOutpainting(src, prompt, ratio, model, renderingMode);
      addImagesToGallery([{
        id: crypto.randomUUID(),
        url,
        prompt: `Outpainting: ${prompt || 'Expansion'}`,
        timestamp: Date.now()
      }]);
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, addImagesToGallery, renderingMode]);

  const generateRestore = useCallback(async (src: string, config: RestorationConfig, model: AiModel, ratio: AspectRatio) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await restorePhoto(src, config, model, ratio, renderingMode);
      const newImg = {
        id: crypto.randomUUID(),
        url,
        prompt: `Restoration (${config.level})`,
        timestamp: Date.now()
      };
      addImagesToGallery([newImg]);
      return url;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, addImagesToGallery, renderingMode]);

  const generateScenarios = useCallback(async (prompts: string[], style: CinematicStyle, ratio: AspectRatio, model: AiModel, ref: string) => {
    setIsLoading(true);
    setError(null);
    setGenerationProgress({ current: 0, total: prompts.length });
    
    const newImages: GeneratedImage[] = [];
    
    for (let i = 0; i < prompts.length; i++) {
      let attempts = 0;
      const maxAttempts = 2;
      
      while (attempts < maxAttempts) {
          try {
            const toolPrompt = prompts[i].includes("English (for the tool):") 
                ? prompts[i].split("English (for the tool):")[1].trim()
                : prompts[i];

            const url = await generateCinematicScene(ref, toolPrompt, style, ratio, model, renderingMode);
            
            const displayPrompt = prompts[i].includes("Русский:")
                ? prompts[i].split("English (for the tool):")[0].replace("Русский:", "").trim()
                : prompts[i];

            newImages.push({
              id: crypto.randomUUID(),
              url,
              prompt: `Act ${i + 1}: ${displayPrompt}`,
              timestamp: Date.now()
            });
            setGenerationProgress({ current: i + 1, total: prompts.length });
            break; 
          } catch (err: any) {
            attempts++;
            if (attempts < maxAttempts) {
                await new Promise(r => setTimeout(r, 4000));
                continue;
            }
            break;
          }
      }
      if (i < prompts.length - 1) await new Promise(r => setTimeout(r, 4000));
    }

    if (newImages.length > 0) {
      addImagesToGallery(newImages);
    } else {
      setError(t.errorGen);
    }
    
    setIsLoading(false);
    setGenerationProgress(null);
  }, [setIsLoading, setError, addImagesToGallery, t.errorGen, renderingMode]);

  const generateFusion = useCallback(async (img1: string, img2: string, prompt: string, ratio: AspectRatio, model: AiModel) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateImageFusion(img1, img2, prompt, ratio, model, renderingMode);
      addImagesToGallery([{
        id: crypto.randomUUID(),
        url,
        prompt: `Fusion: ${prompt}`,
        timestamp: Date.now()
      }]);
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError, addImagesToGallery, renderingMode]);

  const generateInitialFrameBatchAction = useCallback(async (refs: string[], prompts: string[], ratio: AspectRatio, model: AiModel, style?: string) => {
    setIsLoading(true);
    setError(null);
    setGenerationProgress({ current: 0, total: prompts.length });
    
    const batchResults: GeneratedImage[] = [];
    
    for (let i = 0; i < prompts.length; i++) {
      try {
        setGenerationProgress({ current: i + 1, total: prompts.length });
        const url = await generateInitialFrame(refs, prompts[i], ratio, model, renderingMode, style);
        const newImg: GeneratedImage = {
          id: crypto.randomUUID(),
          url,
          prompt: `Initial Frame: ${prompts[i]}`,
          timestamp: Date.now()
        };
        batchResults.push(newImg);
        addImagesToGallery([newImg]);
      } catch (err: any) {
        console.error(`Batch Frame ${i+1} failed:`, err);
        if (i === 0 && prompts.length === 1) throw err;
      }
      
      if (i < prompts.length - 1) {
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    setIsLoading(false);
    setGenerationProgress(null);
    return batchResults;
  }, [setIsLoading, setError, addImagesToGallery, renderingMode]);

  return {
    generateBasic,
    generateSevenAnglesBatch,
    generateOutpaint,
    generateRestore,
    generateScenarios,
    generateFusion,
    generateInitialFrameBatchAction,
    generationProgress
  };
};
