
import React, { useState, useEffect } from 'react';
import { Language, AvatarConfig, AspectRatio, ImageCount, AiModel } from '../types';
import { translations } from '../translations';
import { GenerateButton } from './GenerateButton';
import { AspectRatioSelect } from './AspectRatioSelect';
import { ImageCountSelect } from './ImageCountSelect';
import { ModelSelect } from './ModelSelect';
import { 
    GENDERS, AGES, ETHNICITIES, EYE_COLORS, HAIR_COLORS, 
    HAIR_STYLES_MALE, HAIR_STYLES_FEMALE, 
    CLOTHING_MALE, CLOTHING_FEMALE, 
    EMOTIONS, SHOT_TYPES, POSES, LOCATIONS 
} from '../constants';

interface AvatarBuilderProps {
  lang: Language;
  onGenerate: (prompt: string, aspectRatio: AspectRatio, count: ImageCount, model: AiModel) => void;
  isLoading: boolean;
}

export const AvatarBuilder: React.FC<AvatarBuilderProps> = ({ lang, onGenerate, isLoading }) => {
  const t = translations[lang];
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [imageCount, setImageCount] = useState<ImageCount>(1);
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');

  const [config, setConfig] = useState<AvatarConfig>({
    gender: 'female',
    age: 'young_adult',
    ethnicity: 'caucasian',
    eyeColor: 'blue',
    hairStyle: 'long_wavy',
    hairColor: 'blonde',
    clothingType: 'summer_dress',
    clothingColor: 'Red',
    emotion: 'happy_smiling',
    shotType: 'waist_up',
    pose: 'looking_away',
    location: 'cozy_cafe',
    additionalDetails: ''
  });

  // Update defaults when gender changes
  useEffect(() => {
    if (config.gender === 'male') {
        if (!HAIR_STYLES_MALE.includes(config.hairStyle)) setConfig(prev => ({...prev, hairStyle: HAIR_STYLES_MALE[2], clothingType: CLOTHING_MALE[1] }));
    } else {
        if (!HAIR_STYLES_FEMALE.includes(config.hairStyle)) setConfig(prev => ({...prev, hairStyle: HAIR_STYLES_FEMALE[1], clothingType: CLOTHING_FEMALE[1] }));
    }
  }, [config.gender]);

  const handleChange = (field: keyof AvatarConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const constructPrompt = () => {
    const genderStr = config.gender === 'male' ? 'man' : 'woman';
    let basePrompt = `A hyper-realistic photograph of a ${config.ethnicity} ${config.age.replace('_', ' ')} ${config.gender} (${genderStr}). `;
    basePrompt += `Face: ${config.eyeColor} eyes, ${config.hairColor} ${config.hairStyle.replace('_', ' ')} hair. `;
    basePrompt += `Clothing: Wearing a ${config.clothingColor} ${config.clothingType.replace('_', ' ')}. `;
    basePrompt += `Emotion: ${config.emotion.replace('_', ' ')}. `;
    basePrompt += `Pose: ${config.pose.replace('_', ' ')}. `;
    basePrompt += `Shot: ${config.shotType.replace('_', ' ')}. `;
    basePrompt += `Location: ${config.location.replace('_', ' ')}. `;
    if (config.additionalDetails) {
        basePrompt += `Details: ${config.additionalDetails}. `;
    }
    basePrompt += `Cinematic lighting, 8k resolution, highly detailed, photorealistic, masterpiece.`;
    return basePrompt;
  };

  const handleGenerateClick = async () => {
      const prompt = constructPrompt();
      onGenerate(prompt, aspectRatio, imageCount, selectedModel);
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <div className="text-[#FF1E1E]">{icon}</div>
        <h3 className="text-gray-800 font-bold text-lg">{title}</h3>
    </div>
  );

  const SelectGroup = ({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string) => void, options: string[] }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="relative">
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-[#FF1E1E] focus:border-[#FF1E1E] block p-2.5 appearance-none font-medium"
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>
                        {(t as any)[opt] || opt}
                    </option>
                ))}
            </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: Physical */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <SectionHeader 
                    title={t.avSectionPhysical} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
                />
                <div className="space-y-4">
                    <SelectGroup label={t.avGender} value={config.gender} onChange={(v) => handleChange('gender', v)} options={GENDERS} />
                    <SelectGroup label={t.avAge} value={config.age} onChange={(v) => handleChange('age', v)} options={AGES} />
                    <SelectGroup label={t.avEthnicity} value={config.ethnicity} onChange={(v) => handleChange('ethnicity', v)} options={ETHNICITIES} />
                    
                    <div className="grid grid-cols-2 gap-3">
                         <SelectGroup label={t.avEyeColor} value={config.eyeColor} onChange={(v) => handleChange('eyeColor', v)} options={EYE_COLORS} />
                         <SelectGroup label={t.avHairColor} value={config.hairColor} onChange={(v) => handleChange('hairColor', v)} options={HAIR_COLORS} />
                    </div>
                    
                    <SelectGroup 
                        label={t.avHairStyle} 
                        value={config.hairStyle} 
                        onChange={(v) => handleChange('hairStyle', v)} 
                        options={config.gender === 'male' ? HAIR_STYLES_MALE : HAIR_STYLES_FEMALE} 
                    />
                </div>
            </div>

            {/* Column 2: Style & Scene */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <SectionHeader 
                    title={t.avSectionStyle} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} 
                />
                <div className="space-y-4 mb-8">
                     <SelectGroup 
                        label={t.avClothing} 
                        value={config.clothingType} 
                        onChange={(v) => handleChange('clothingType', v)} 
                        options={config.gender === 'male' ? CLOTHING_MALE : CLOTHING_FEMALE} 
                    />
                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.avClothingColor}</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                className="h-10 w-10 p-0 border-0 rounded-lg cursor-pointer overflow-hidden shadow-sm"
                                onChange={(e) => handleChange('clothingColor', e.target.value)}
                                title="Pick Color"
                            />
                            <input 
                                type="text"
                                value={config.clothingColor}
                                onChange={(e) => handleChange('clothingColor', e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg p-2.5 focus:ring-[#FF1E1E] focus:border-[#FF1E1E]"
                                placeholder="Red, Navy Blue, etc."
                            />
                        </div>
                    </div>
                </div>

                <SectionHeader 
                    title={t.avSectionScene} 
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
                />
                 <div className="space-y-4">
                     <SelectGroup label={t.avLocation} value={config.location} onChange={(v) => handleChange('location', v)} options={LOCATIONS} />
                 </div>
            </div>

             {/* Column 3: Posing & Generate */}
             <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div className="space-y-4">
                     <SectionHeader 
                        title="Posing & Output" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                    />
                    
                    <SelectGroup label={t.avEmotion} value={config.emotion} onChange={(v) => handleChange('emotion', v)} options={EMOTIONS} />
                    <SelectGroup label={t.avPose} value={config.pose} onChange={(v) => handleChange('pose', v)} options={POSES} />
                    <SelectGroup label={t.avShotType} value={config.shotType} onChange={(v) => handleChange('shotType', v)} options={SHOT_TYPES} />

                    <div className="flex flex-col gap-1.5 mt-4">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t.avAdditional}</label>
                        <textarea
                            value={config.additionalDetails}
                            onChange={(e) => handleChange('additionalDetails', e.target.value)}
                            placeholder="E.g. Holding a coffee cup, tattoo on neck, glasses..."
                            className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-[#FF1E1E] focus:border-[#FF1E1E] block p-2.5 h-20 resize-none"
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col gap-4 mb-6">
                        <ModelSelect value={selectedModel} onChange={setSelectedModel} lang={lang} disabled={isLoading} />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <AspectRatioSelect value={aspectRatio} onChange={setAspectRatio} lang={lang} disabled={isLoading} />
                            </div>
                            <div className="w-24">
                                <ImageCountSelect value={imageCount} onChange={setImageCount} lang={lang} disabled={isLoading} />
                            </div>
                        </div>
                    </div>
                    
                    <GenerateButton 
                        onClick={handleGenerateClick} 
                        isLoading={isLoading} 
                        lang={lang}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};
