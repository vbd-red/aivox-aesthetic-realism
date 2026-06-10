import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, CreativePrompt, Language, AiModel, RestorationConfig, CinematicStyle, RenderingMode, StoryAct } from '../types';
import { HYPER_REALISTIC_STYLE_PROMPT, NIKON_Z9_STYLE_PROMPT, CINEMATIC_STYLES } from '../constants';

const AESTHETIC_TECH_SPECS = "Immaculate cleanliness, high-end modern aesthetics, polished surfaces, professional lighting, pristine environment.";

const FEMALE_REFINERS = "Elegant appearance, healthy glowing complexion, well-maintained hairstyle, sophisticated and clean look.";

const MALE_REFINERS = "Confident and well-groomed appearance, sharp features, clean-cut hairstyle, pristine look.";

const getRealModelId = (model: AiModel): string => {
  if (model === 'veo-3.1-fast-generate-preview') return 'veo-3.1-fast-generate-preview';
  if (model === 'imagen-4.0-generate-001') return 'imagen-4.0-generate-001';
  if (model === 'gemini-3-pro-image-preview') return 'gemini-3-pro-image-preview';
  if (model === 'gemini-2.5-flash-image') return 'gemini-2.5-flash-image';
  if (model === 'gemini-nano-banana') return 'gemini-2.5-flash-image';
  return 'gemini-2.5-flash-image';
};

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorStr = JSON.stringify(error).toUpperCase();
      const isQuotaError = errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("QUOTA");

      if (isQuotaError && attempt < maxRetries) {
        let waitMs = Math.pow(2, attempt) * 5000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, waitMs));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

const extractMimeAndBase64 = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return { mimeType: 'image/png', base64: dataUrl.replace(/^data:image\/\w+;base64,/, "") };
  return { mimeType: match[1], base64: match[2] };
};

const detectGenderAndRefine = (prompt: string): string => {
  const p = prompt.toLowerCase();
  const femaleKeywords = ['woman', 'girl', 'lady', 'female', 'девушка', 'женщина', 'mujer', 'chica'];
  const maleKeywords = ['man', 'boy', 'guy', 'male', 'мужчина', 'парень', 'hombre', 'chico'];
  const isFemale = femaleKeywords.some(k => p.includes(k));
  const isMale = maleKeywords.some(k => p.includes(k));
  let enhanced = prompt;
  if (isFemale) enhanced += `. ${FEMALE_REFINERS}`;
  else if (isMale) enhanced += `. ${MALE_REFINERS}`;
  enhanced += `. ${AESTHETIC_TECH_SPECS}`;
  return enhanced;
};

export const generateSingleImage = async (
  userPrompt: string,
  aspectRatio: AspectRatio,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism'
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const apiModel = getRealModelId(model);
    const refinedPrompt = detectGenderAndRefine(userPrompt);
    const stylePrompt = renderingMode === 'nikon_z9' ? NIKON_Z9_STYLE_PROMPT : HYPER_REALISTIC_STYLE_PROMPT;
    const finalPrompt = `${refinedPrompt}. ${stylePrompt}`;

    if (apiModel.includes('imagen')) {
      const response = await ai.models.generateImages({
        model: apiModel,
        prompt: finalPrompt,
        config: { numberOfImages: 1, aspectRatio: aspectRatio }
      });
      const base64 = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64}`;
    } else {
      const response = await ai.models.generateContent({
        model: apiModel,
        contents: { parts: [{ text: finalPrompt }] },
        config: { imageConfig: { aspectRatio: aspectRatio } },
      });
      
      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break; 
          }
        }
      }
      if (!imageUrl) throw new Error("Generation failed. Model returned no image.");
      return imageUrl;
    }
  });
};

export const generateSingleImageWithReference = async (
  referenceImageBase64: string,
  userPrompt: string,
  aspectRatio: AspectRatio,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism'
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const apiModel = getRealModelId(model);
    const { mimeType, base64 } = extractMimeAndBase64(referenceImageBase64);
    const refinedPrompt = detectGenderAndRefine(userPrompt);
    const stylePrompt = renderingMode === 'nikon_z9' ? NIKON_Z9_STYLE_PROMPT : HYPER_REALISTIC_STYLE_PROMPT;
    
    const finalPrompt = `Cinematic photo of the person from the reference. Scene: ${refinedPrompt}. Style: ${stylePrompt}.`;

    const response = await ai.models.generateContent({
      model: apiModel, 
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: finalPrompt }
        ],
      },
      config: { imageConfig: { aspectRatio: aspectRatio } },
    });
    
    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break; 
        }
      }
    }
    if (!imageUrl) throw new Error("Identity locking failed. No image returned.");
    return imageUrl;
  });
};

export const generateInitialFrame = async (
  references: string[],
  userPrompt: string,
  aspectRatio: AspectRatio,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism',
  globalStyle: string = ""
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const apiModel = getRealModelId(model);
    const stylePrompt = renderingMode === 'nikon_z9' ? NIKON_Z9_STYLE_PROMPT : HYPER_REALISTIC_STYLE_PROMPT;

    const identityInstruction = `Photorealistic frame of the person from the reference. The person's facial features and clothing must match exactly. Scene: ${userPrompt}. Style: ${stylePrompt}.`;

    const parts: any[] = [];
    references.slice(0, 1).forEach(ref => { // Restrict to 1 reference for better reliability in batch mode
      const { mimeType, base64 } = extractMimeAndBase64(ref);
      parts.push({ inlineData: { mimeType, data: base64 } });
    });
    parts.push({ text: identityInstruction });

    const response = await ai.models.generateContent({
      model: apiModel,
      contents: { parts },
      config: { imageConfig: { aspectRatio } },
    });

    let imageUrl = '';
    let refusalText = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
        if (part.text) refusalText += part.text;
      }
    }
    
    if (!imageUrl) {
      throw new Error(refusalText || "Frame generation failed: No image returned. The model may have filtered the request.");
    }
    return imageUrl;
  });
};

export const generateHyperRealImages = async (
  userPrompt: string,
  aspectRatio: AspectRatio,
  count: number,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism',
  referenceImage?: string,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    try {
      if (onProgress) onProgress(i, count);
      const url = referenceImage 
        ? await generateSingleImageWithReference(referenceImage, userPrompt, aspectRatio, model, renderingMode)
        : await generateSingleImage(userPrompt, aspectRatio, model, renderingMode);
      urls.push(url);
      if (count > 1 && i < count - 1) await new Promise(r => setTimeout(r, 4500));
    } catch (err) {
      console.error(`Item ${i+1} failed:`, err);
      if (urls.length === 0 && i === 0) throw err; 
    }
  }
  if (onProgress) onProgress(count, count);
  return urls;
};

export const generateOutpainting = async (
  referenceImageBase64: string,
  userPrompt: string,
  targetAspectRatio: AspectRatio,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism'
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const apiModel = getRealModelId(model);
    const { mimeType, base64 } = extractMimeAndBase64(referenceImageBase64);
    const refinedPrompt = detectGenderAndRefine(userPrompt);
    
    // Improved Prompt for Outpainting/Generative Expansion
    const promptText = `IMAGE EXPANSION TASK: Maintain the provided image content in the center. Extend the background and borders to fit the new ${targetAspectRatio} aspect ratio seamlessly. Add high-end aesthetic details to the expanded areas: ${refinedPrompt}. Ensure a perfect blend between the original and new parts. Pristine and clean environment only.`;

    const response = await ai.models.generateContent({
      model: apiModel,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: promptText }
        ],
      },
      // Essential: target aspect ratio must be provided here for the engine to know how to extend
      config: { imageConfig: { aspectRatio: targetAspectRatio } },
    });
    
    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break; 
        }
      }
    }
    
    if (!imageUrl) {
      console.error("Outpainting Response Refusal:", response);
      throw new Error("Outpainting failed: No image returned by model. The content might be too complex or blocked by safety filters.");
    }
    return imageUrl;
  });
};

export const restorePhoto = async (
  referenceImageBase64: string,
  config: RestorationConfig,
  model: AiModel,
  aspectRatio: AspectRatio,
  renderingMode: RenderingMode = 'raw_realism'
): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const apiModel = getRealModelId(model);
    const { mimeType, base64 } = extractMimeAndBase64(referenceImageBase64);
    const pipelineInstructions = `Restore this photo to pristine quality. Remove artifacts. ${config.colorize ? "Apply natural colors." : "Maintain high fidelity B&W."} Style: Professional modern photography.`;
    
    const response = await ai.models.generateContent({
      model: apiModel,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: pipelineInstructions }
        ],
      },
      config: { imageConfig: { aspectRatio: aspectRatio } },
    });
    
    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break; 
        }
      }
    }
    if (!imageUrl) throw new Error("Restoration failed.");
    return imageUrl;
  });
};

export const generateCinematicScene = async (
  referenceImageBase64: string,
  userPrompt: string,
  style: CinematicStyle,
  aspectRatio: AspectRatio,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism'
): Promise<string> => {
    return withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const apiModel = getRealModelId(model);
      const { mimeType: m1, base64: b1 } = extractMimeAndBase64(referenceImageBase64);
      const refinedPrompt = detectGenderAndRefine(userPrompt);
      const styleDef = CINEMATIC_STYLES.find(s => s.id === style);
      const systemPrompt = `Cinematic photo of the person from the reference. Environment: ${refinedPrompt}. Style: ${styleDef?.desc}. Clean and professional composition.`;
      
      const response = await ai.models.generateContent({
          model: apiModel,
          contents: {
              parts: [
                  { inlineData: { mimeType: m1, data: b1 } },
                  { text: systemPrompt }
              ]
          },
          config: { imageConfig: { aspectRatio: aspectRatio } }
      });
      
      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                  break; 
              }
          }
      }
      if (!imageUrl) throw new Error("Scene generation failed.");
      return imageUrl;
    });
}

export const generateActVideo = async (
  prompt: string,
  referenceImageBase64?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const imagePart = referenceImageBase64 ? {
    imageBytes: extractMimeAndBase64(referenceImageBase64).base64,
    mimeType: extractMimeAndBase64(referenceImageBase64).mimeType
  } : undefined;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `${prompt}. Cinematic clean aesthetics, soft lighting.`,
    image: imagePart,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};

export const generateCreativePrompts = async (
  description: string,
  lang: Language,
  style?: CinematicStyle
): Promise<CreativePrompt[]> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-3-flash-preview';
    const styleName = style ? (CINEMATIC_STYLES.find(s => s.id === style)?.name || style) : "Aesthetic Modern";
    const prompt = `Generate 4 photographic prompts for: "${description}". Style: ${styleName}. Pristine and elegant focus. Output JSON.`;
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              promptEn: { type: Type.STRING },
              style: { type: Type.STRING },
            },
            required: ["title", "description", "promptEn", "style"],
          }
        }
      }
    });
    const results = JSON.parse(response.text || "[]");
    return results.map((item: any) => ({ ...item, id: crypto.randomUUID() }));
  });
};

export const generateScenarioIdeas = async (
  referenceImage: string | null,
  style: CinematicStyle,
  lang: Language,
  hint: string = ""
): Promise<string[]> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-3-flash-preview';
    const parts: any[] = [];
    if (referenceImage) {
       const { mimeType, base64 } = extractMimeAndBase64(referenceImage);
       parts.push({ inlineData: { mimeType, data: base64 } });
    }
    const systemInstruction = `Generate 10-ACT narrative scenario. Theme: Aesthetic living. Output: JSON array of 10 strings formatted as: Русский: [Description] English (for the tool): [Prompt]`;
    const prompt = `Theme: ${hint || "Aesthetic Living"}. Style: ${style}. 10 acts.`;
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
       model: modelId,
       contents: { parts },
       config: {
           systemInstruction,
           responseMimeType: "application/json",
           responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
       }
    });
    return JSON.parse(response.text || "[]");
  });
}

export const generateImageFusion = async (
  img1Base64: string,
  img2Base64: string,
  userPrompt: string,
  aspectRatio: AspectRatio,
  model: AiModel,
  renderingMode: RenderingMode = 'raw_realism'
): Promise<string> => {
    return withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const apiModel = getRealModelId(model);
      const { mimeType: m1, base64: b1 } = extractMimeAndBase64(img1Base64);
      const { mimeType: m2, base64: b2 } = extractMimeAndBase64(img2Base64);
      const refinedPrompt = detectGenderAndRefine(userPrompt);
      const systemPrompt = `Merge elements of both images into: "${refinedPrompt}". Clean and aesthetic result.`;
      
      const response = await ai.models.generateContent({
          model: apiModel,
          contents: {
              parts: [
                  { inlineData: { mimeType: m1, data: b1 } },
                  { inlineData: { mimeType: m2, data: b2 } },
                  { text: systemPrompt }
              ]
          },
          config: { imageConfig: { aspectRatio: aspectRatio } }
      });
      
      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                  break; 
              }
          }
      }
      if (!imageUrl) throw new Error("Fusion failed.");
      return imageUrl;
    });
}

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Translate to ${targetLanguage}: "${text}"`,
    });
    return response.text?.trim() || "";
  });
};

export const generateVideoScript = async (concept: string, materialStyle: string, imageBase64?: string): Promise<StoryAct[]> => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-3-flash-preview';
    const parts: any[] = [];
    if (imageBase64) {
      const { mimeType, base64 } = extractMimeAndBase64(imageBase64);
      parts.push({ inlineData: { mimeType, data: base64 } });
    }
    const systemInstruction = `Storyboarding role. 10 acts focusing on modern beauty and comfort. Material Style: ${materialStyle}.`;
    parts.push({ text: `Concept: "${concept}". JSON array of 10 objects.` });

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: { 
        systemInstruction, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              actNumber: { type: Type.INTEGER },
              textRu: { type: Type.STRING },
              textEn: { type: Type.STRING },
              promptEn: { type: Type.STRING }
            },
            required: ["actNumber", "textRu", "textEn", "promptEn"]
          }
        }
      }
    });
    const results = JSON.parse(response.text || "[]");
    return results.map((act: any) => ({ ...act, id: crypto.randomUUID() }));
  });
};