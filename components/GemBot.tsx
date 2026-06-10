
import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { Language, StoryAct, AiModel } from '../types';
import { translations } from '../translations';
import { generateVideoScript, generateSingleImageWithReference, generateActVideo } from '../services/geminiService';
import { useAppContext } from '../AppContext';

interface GemBotProps {
  lang: Language;
}

const CINEMA_STYLES = [
  { id: 'gbStyleMaxRealism', desc: 'RAW REALISM style. Ultra-clean, modern, polished surfaces. Commercial high-end photography. Sharp focus. IMMACULATE ENVIRONMENT.' },
  { id: 'gbStyleModernLuxury', desc: 'Modern Luxury Style. Luxury apartment, high-end materials, bright clean lighting, sophisticated neutral colors, minimalist architectural beauty.' },
  { id: 'gbStyleFamilyComfort', desc: 'Family Comfort Style. Soft warm lighting, clean and cozy home interior, loving atmosphere, bright and airy composition, fresh flowers.' },
  { id: 'gbStyleMediterranean', desc: 'Mediterranean Aesthetic. Sun-drenched white walls, clean linen, aesthetic ocean views, bright summer morning light, pristine textures.' },
  { id: 'gbStyleDoc', desc: 'Aesthetic Documentary. Truthful but beautiful. Clean natural environments, healthy appearances, observational perspective with perfect lighting.' },
  { id: 'gbStyleFeature', desc: 'High-End Feature Film. Professional dolly movements, anamorphic lenses, refined aesthetic realism, polished cinematic look.' },
  { id: 'gbStyleArthouse', desc: 'Clean Arthouse. Carefully composed static shots, elegant symmetry, soft natural light, pristine textures, emotional clarity.' },
  { id: 'gbStyleMainstream', desc: 'Modern Blockbuster. Vibrant crisp colors, professional high-fidelity digital look, clean and epic staging.' },
  { id: 'gbStyleNoir', desc: 'Modern Noir. High contrast but clean lighting, sharp shadows, polished surfaces, sophisticated fashion aesthetic.' },
  { id: 'gbStyleParable', desc: 'Movie Parable. Allegorical philosophical cinema captured in beautiful, serene, and clean environments.' }
];

const ANIMATION_STYLES = [
  { id: '3D Claymation (Aardman & Laika Style)', name: '3D Claymation' },
  { id: 'Hand-drawn Animation', name: 'Hand-drawn' },
  { id: 'Knitted (Woolen)', name: 'Knitted/Woolen' }
];

export const GemBot: React.FC<GemBotProps> = ({ lang }) => {
  const { renderingMode, setError } = useAppContext();
  const t = translations[lang];
  const [concept, setConcept] = useState('');
  const [material, setMaterial] = useState(CINEMA_STYLES[0].desc);
  const [isLoading, setIsLoading] = useState(false);
  const [acts, setActs] = useState<StoryAct[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatingFrames, setGeneratingFrames] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        setActs([]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateScript = async () => {
    if (!concept.trim()) return;
    setIsLoading(true);
    setActs([]);
    try {
      const result = await generateVideoScript(concept, material, referenceImage || undefined);
      setActs(result);
    } catch (err) {
      setError(t.errorGen);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSingleFrame = async (index: number) => {
    if (!referenceImage) return;
    setActs(prev => prev.map((act, i) => i === index ? { ...act, imageUrl: 'loading' } : act));
    try {
      const url = await generateSingleImageWithReference(
        referenceImage,
        acts[index].promptEn,
        '16:9',
        'gemini-2.5-flash-image',
        renderingMode
      );
      setActs(prev => prev.map((act, i) => i === index ? { ...act, imageUrl: url } : act));
    } catch (err) {
      setActs(prev => prev.map((act, i) => i === index ? { ...act, imageUrl: undefined } : act));
    }
  };

  const handleGenerateVideo = async (index: number) => {
    setActs(prev => prev.map((act, i) => i === index ? { ...act, isVideoLoading: true } : act));
    try {
      const videoUrl = await generateActVideo(acts[index].promptEn, referenceImage || undefined);
      setActs(prev => prev.map((act, i) => i === index ? { ...act, videoUrl, isVideoLoading: false } : act));
    } catch (err: any) {
      setError("Video Generation Error. Check credits.");
      setActs(prev => prev.map((act, i) => i === index ? { ...act, isVideoLoading: false } : act));
    }
  };

  const handleGenerateAllFrames = async () => {
    if (!referenceImage || acts.length === 0) return;
    setGeneratingFrames(true);
    for (let i = 0; i < acts.length; i++) {
      if (!acts[i].imageUrl || acts[i].imageUrl === 'loading') {
        await handleGenerateSingleFrame(i);
      }
    }
    setGeneratingFrames(false);
  };

  const handleDownloadSingle = (act: StoryAct) => {
    if (!act.imageUrl || act.imageUrl === 'loading') return;
    const link = document.createElement('a');
    link.href = act.imageUrl;
    link.download = `act_${String(act.actNumber).padStart(2, '0')}.png`;
    link.click();
  };

  const handleDownloadZip = async () => {
    const validActs = acts.filter(a => a.imageUrl && a.imageUrl !== 'loading');
    if (validActs.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      validActs.forEach((act) => {
        const base64Data = act.imageUrl!.split(',')[1];
        const ext = act.imageUrl!.split(';')[0].split('/')[1] || 'png';
        zip.file(`aivox_act_${String(act.actNumber).padStart(2, '0')}.${ext}`, base64Data, { base64: true });
      });
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content as Blob);
      link.download = `aivox_storyboard_${Date.now()}.zip`;
      link.click();
    } catch (err) {
      console.error("ZIP Error:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-rose-600 rounded-2xl text-white shadow-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1v14a1 1 0 001 1z" />
                </svg>
            </div>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 font-display">{t.gbTitle}</h2>
                <p className="text-gray-500 font-medium">{t.gbSubtitle}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col gap-6">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">{t.gbRefLabel}</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${referenceImage ? 'border-rose-600 bg-rose-50' : 'border-gray-200 hover:border-rose-600 hover:bg-rose-50'}`}
                  >
                    {referenceImage ? (
                      <>
                        <img src={referenceImage} alt="Ref" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">{t.gbRefChange}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-bold">{t.gbRefAnchor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">{t.gbCanonLabel}</label>
                    <div className="relative">
                        <select
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-gray-800 appearance-none focus:outline-none focus:border-rose-600 transition-all cursor-pointer shadow-sm text-sm"
                        >
                            <optgroup label={t.gbCategoryCinema.toUpperCase()}>
                                {CINEMA_STYLES.map(s => (
                                  <option key={s.id} value={s.desc}>{(t as any)[s.id] || s.id}</option>
                                ))}
                            </optgroup>
                            <optgroup label={t.gbCategoryAnimation.toUpperCase()}>
                                {ANIMATION_STYLES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </optgroup>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">{t.gbConceptLabel}</label>
                    <textarea
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder={t.gbPlaceholder}
                        className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-rose-600 transition-all resize-none font-medium text-gray-800 shadow-inner text-sm"
                    />
                </div>

                <div className="mt-2 flex flex-col gap-3">
                    <button
                        onClick={handleGenerateScript}
                        disabled={!concept.trim() || isLoading}
                        className="w-full h-14 rounded-2xl relative overflow-hidden group bg-gradient-to-br from-rose-600 to-rose-800 text-white font-bold text-lg shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {isLoading ? t.gbBtnBuilding : t.gbBtn}
                        </span>
                    </button>
                    {acts.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <button onClick={handleGenerateAllFrames} disabled={generatingFrames || !referenceImage} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-all">
                          {generatingFrames ? t.gbBtnGenFramesLoading : t.gbBtnGenFrames}
                        </button>
                        <button onClick={handleDownloadZip} disabled={isZipping || !acts.some(a => a.imageUrl)} className="w-full py-3 bg-white border-2 border-gray-100 rounded-xl font-bold text-xs uppercase tracking-wider hover:border-black transition-all">
                          {isZipping ? t.gbBtnZipping : t.gbBtnZip}
                        </button>
                      </div>
                    )}
                </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                {acts.length === 0 ? (
                  <div className="h-[600px] bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-gray-400 border-4 border-gray-100 border-dashed">
                      <p className="font-black uppercase tracking-[0.2em] text-sm text-center px-8">{t.gbEmptyState}</p>
                  </div>
                ) : (
                  <div className="space-y-12 pb-24">
                    {acts.map((act, index) => (
                      <div key={act.id} className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                        <div className="flex flex-col">
                          <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                              <span className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-xl">
                                {act.actNumber}
                              </span>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{t.gbActLabel}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                                    <span className="text-[9px] font-black text-rose-400 uppercase block mb-1">{t.gbSceneFocus}</span>
                                    <p className="text-gray-900 font-bold leading-relaxed">{lang === 'ru' ? act.textRu : act.textEn}</p>
                                  </div>
                                  <div className="bg-gray-900 p-4 rounded-xl">
                                    <span className="text-[9px] font-black text-green-500 uppercase block mb-1">{t.gbVisualCode}</span>
                                    <textarea 
                                      value={act.promptEn}
                                      onChange={(e) => setActs(prev => prev.map((a, i) => i === index ? { ...a, promptEn: e.target.value } : a))}
                                      className="w-full bg-transparent text-green-400 font-mono text-[10px] leading-tight focus:outline-none resize-none h-16"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="relative aspect-[16/9] w-full bg-gray-50 rounded-2xl overflow-hidden shadow-inner group">
                                    {act.imageUrl === 'loading' ? (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center"><div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div></div>
                                    ) : act.imageUrl ? (
                                      <>
                                        <img src={act.imageUrl} alt="Frame" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                                          <button onClick={() => handleGenerateSingleFrame(index)} className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 flex items-center gap-2">🔄 {t.gbRegen}</button>
                                          <button onClick={() => handleDownloadSingle(act)} className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">📥 {t.gbDownload}</button>
                                        </div>
                                      </>
                                    ) : (
                                      <button onClick={() => handleGenerateSingleFrame(index)} className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-rose-600 transition-colors">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] font-black uppercase mt-2">{t.gbGenFrame}</span>
                                      </button>
                                    )}
                                  </div>

                                  <div className="relative aspect-[16/9] w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                                    {act.isVideoLoading ? (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest">{t.gbGenClip}</p>
                                      </div>
                                    ) : act.videoUrl ? (
                                      <video src={act.videoUrl} className="w-full h-full object-cover" controls playsInline />
                                    ) : (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-gray-800 to-gray-900">
                                        <div className="p-3 bg-white/5 rounded-full text-white/20">
                                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 2.236A1 1 0 0014 9v2a1 1 0 00.553.894l2 1A1 1 0 0018 12V8a1 1 0 00-1.447-.894l-2 1z" /></svg>
                                        </div>
                                        <button 
                                          onClick={() => handleGenerateVideo(index)}
                                          className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-6 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                        >
                                          {t.gbAnimateBtn}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar{width:8px}.custom-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,.05);border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:10px;border:2px solid #fff}.animate-bounce-slow{animation:bounce 3s infinite}@keyframes bounce{0%,100%{transform:translateY(-5%);animation-timing-function:cubic-bezier(0.8,0,1,1)}50%{transform:translateY(0);animation-timing-function:cubic-bezier(0,0,0.2,1)}}`}</style>
    </div>
  );
};
