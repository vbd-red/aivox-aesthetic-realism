export type AspectRatio = '1:1' | '16:9' | '9:16';
export type ImageCount = 1 | 2 | 4 | 6 | 7;
export type Language = 'ru' | 'en' | 'es';
export type AiModel = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview' | 'imagen-4.0-generate-001' | 'gemini-nano-banana' | 'veo-3.1-fast-generate-preview';

export type RenderingMode = 'raw_realism' | 'nikon_z9';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface QueueItem {
  id: string;
  rawInput: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  imageUrl?: string;
  error?: string;
}

export interface CreativePrompt {
  id: string;
  title: string;
  description: string;
  promptEn: string;
  style: string;
}

export type ActiveTab = 'generate' | 'ideas' | 'avatar' | 'identity' | 'outpainting' | 'restoration' | 'scenarios' | 'image-fusion' | 'initial-frame' | 'nano-banana';

export interface AvatarConfig {
  gender: string;
  age: string;
  ethnicity: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  clothingType: string;
  clothingColor: string;
  emotion: string;
  shotType: string;
  pose: string;
  location: string;
  additionalDetails: string;
}

export type RestorationLevel = 'low' | 'balanced' | 'aggressive';

export interface RestorationConfig {
  level: RestorationLevel;
  colorize: boolean;
  enhanceFaces: boolean;
  description: string;
}

export type CinematicStyle = 'family_warmth' | 'modern_luxury' | 'mediterranean' | 'hollywood_glam' | 'scandinavian_hygge' | 'minimalist_zen';

export interface StoryAct {
  id: string;
  actNumber: number;
  textRu: string;
  textEn: string;
  promptEn: string;
  imageUrl?: string;
  videoUrl?: string;
  isVideoLoading?: boolean;
}