
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Language, GeneratedImage, ActiveTab, CreativePrompt, RenderingMode } from './types';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  images: GeneratedImage[];
  setImages: React.Dispatch<React.SetStateAction<GeneratedImage[]>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  creativePrompts: CreativePrompt[];
  setCreativePrompts: React.Dispatch<React.SetStateAction<CreativePrompt[]>>;
  renderingMode: RenderingMode;
  setRenderingMode: (mode: RenderingMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Reduced to 20 images because localStorage has a 5MB limit. 
const MAX_IMAGES = 20;

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('aivox_lang');
      return (saved as Language) || 'ru';
    } catch {
      return 'ru';
    }
  });

  const [renderingMode, setRenderingMode] = useState<RenderingMode>(() => {
    try {
      const saved = localStorage.getItem('aivox_render_mode');
      return (saved as RenderingMode) || 'raw_realism';
    } catch {
      return 'raw_realism';
    }
  });

  const [images, setImages] = useState<GeneratedImage[]>(() => {
    try {
      const saved = localStorage.getItem('aivox_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [creativePrompts, setCreativePrompts] = useState<CreativePrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('generate');

  // Persistence with error handling
  useEffect(() => {
    try {
      localStorage.setItem('aivox_lang', lang);
    } catch (e) {
      console.warn("Could not save language to localStorage", e);
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('aivox_render_mode', renderingMode);
    } catch (e) {
      console.warn("Could not save rendering mode to localStorage", e);
    }
  }, [renderingMode]);

  useEffect(() => {
    try {
      const slicedImages = images.slice(0, MAX_IMAGES);
      localStorage.setItem('aivox_images', JSON.stringify(slicedImages));
    } catch (e) {
      console.error("LocalStorage Quota Exceeded. Try deleting old images.", e);
    }
  }, [images]);

  const value = useMemo(() => ({
    lang, setLang,
    images, setImages,
    isLoading, setIsLoading,
    error, setError,
    activeTab, setActiveTab,
    creativePrompts, setCreativePrompts,
    renderingMode, setRenderingMode
  }), [lang, images, isLoading, error, activeTab, creativePrompts, renderingMode]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
