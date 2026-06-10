
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Language, QueueItem, AiModel, AspectRatio } from '../types';
import { translations } from '../translations';
import { WHISK_LAYERS } from '../constants';
import { generateSingleImage } from '../services/geminiService';
import { useAppContext } from '../AppContext';

interface AutoWhiskProps {
  lang: Language;
}

export const AutoWhisk: React.FC<AutoWhiskProps> = ({ lang }) => {
  const { setImages, renderingMode, setError: setGlobalError } = useAppContext();
  const t = translations[lang];
  
  const [promptList, setPromptList] = useState('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini-2.5-flash-image');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  
  const stopSignal = useRef(false);

  const constructFinalPrompt = (userPrompt: string) => {
    return `${userPrompt}. Style: ${WHISK_LAYERS.STYLE}. ${WHISK_LAYERS.COLORS}. Camera: ${WHISK_LAYERS.TECH}.`;
  };

  const processQueue = useCallback(async () => {
    if (queue.length === 0 || stopSignal.current) {
        setIsProcessing(false);
        setIsPaused(false);
        setStatusMessage(null);
        return;
    }

    const nextIndex = queue.findIndex(item => item.status === 'pending');
    if (nextIndex === -1) {
        setIsProcessing(false);
        setIsPaused(false);
        setStatusMessage("Queue finished");
        return;
    }

    const item = queue[nextIndex];
    setQueue(prev => prev.map((q, i) => i === nextIndex ? { ...q, status: 'processing' } : q));
    setStatusMessage(`Generating item ${nextIndex + 1}...`);

    try {
        const finalPrompt = constructFinalPrompt(item.rawInput);
        const imageUrl = await generateSingleImage(finalPrompt, aspectRatio, selectedModel, renderingMode);
        
        const newGenImage = {
            id: crypto.randomUUID(),
            url: imageUrl,
            prompt: `Whisk: ${item.rawInput}`,
            timestamp: Date.now()
        };
        setImages(prev => [newGenImage, ...prev]);

        setQueue(prev => prev.map((q, i) => i === nextIndex ? { ...q, status: 'completed', imageUrl } : q));
        
        // INTERVAL DELAY LOGIC (Human Simulation)
        if (!stopSignal.current) {
            // Random delay between 4 to 8 seconds to mimic a human user browsing the UI
            const humanDelay = Math.floor(Math.random() * 4000) + 4000;
            setStatusMessage(`Simulation delay: ${Math.round(humanDelay/1000)}s...`);
            await new Promise(r => setTimeout(r, humanDelay));
        }
        
    } catch (err: any) {
        const errMsg = err.message || JSON.stringify(err);
        const isQuota = errMsg.toUpperCase().includes("429") || errMsg.toUpperCase().includes("RESOURCE_EXHAUSTED");
        
        if (isQuota) {
            setIsPaused(true);
            setQueue(prev => prev.map((q, i) => i === nextIndex ? { ...q, status: 'pending' } : q)); // Re-queue the failed item
            
            // RATE LIMIT DETECTION: Long cooldown (60s) to reset Google API counters
            setStatusMessage("RATE LIMIT DETECTED. Recovering (60s)...");
            console.warn("Auto-Whisk: Quota hit. Recovery mode activated.");
            await new Promise(r => setTimeout(r, 60000));
            setIsPaused(false);
        } else {
            setQueue(prev => prev.map((q, i) => i === nextIndex ? { ...q, status: 'error', error: errMsg } : q));
        }
    }

    if (!stopSignal.current) {
        processQueue();
    } else {
        setIsProcessing(false);
        setIsPaused(false);
        setStatusMessage("Stopped by user");
    }
  }, [queue, aspectRatio, selectedModel, renderingMode, setImages]);

  const handleStart = () => {
    const lines = promptList.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    const newItems: QueueItem[] = lines.map(line => ({
        id: crypto.randomUUID(),
        rawInput: line,
        status: 'pending'
    }));

    setQueue(newItems);
    setIsProcessing(true);
    stopSignal.current = false;
    setStatusMessage("Starting pipeline...");
  };

  useEffect(() => {
    if (isProcessing && !isPaused && queue.some(item => item.status === 'pending')) {
        processQueue();
    }
  }, [isProcessing, isPaused, queue, processQueue]);

  const handleStop = () => {
    stopSignal.current = true;
    setIsProcessing(false);
    setIsPaused(false);
    setStatusMessage("Pipeline shutdown requested...");
  };

  const processedCount = queue.filter(q => q.status === 'completed').length;
  const errorCount = queue.filter(q => q.status === 'error').length;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl animate-fade-in border border-gray-100 flex flex-col gap-8">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="p-4 bg-gray-900 rounded-2xl text-[#FF1E1E] shadow-lg shadow-red-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-gray-900 font-display">{t.awTitle}</h2>
                  <p className="text-gray-500 font-medium">{t.awSubtitle}</p>
              </div>
          </div>

          <div className="flex flex-col items-end gap-2">
              <div className="flex gap-3">
                  {statusMessage && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${isPaused ? 'bg-orange-100 text-orange-700 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
                          {isPaused && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {statusMessage}
                      </div>
                  )}
                  <button
                    onClick={isProcessing ? handleStop : handleStart}
                    disabled={!promptList.trim() && !isProcessing}
                    className={`
                        px-8 py-3 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all
                        ${isProcessing 
                            ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' 
                            : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xl shadow-rose-500/30'}
                    `}
                  >
                      {isProcessing ? t.awStopBtn : t.awStartBtn}
                  </button>
              </div>
              {isProcessing && !isPaused && (
                  <div className="flex items-center gap-1.5 text-[8px] font-black text-green-500 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                      Human Simulation Active
                  </div>
              )}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.awPromptListLabel}</label>
              <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-yellow-500 rounded-3xl opacity-20 blur group-focus-within:opacity-40 transition-opacity"></div>
                   <textarea
                        value={promptList}
                        onChange={(e) => setPromptList(e.target.value)}
                        placeholder={t.awPromptListPlaceholder}
                        disabled={isProcessing}
                        className="relative w-full h-[400px] p-6 bg-white border border-gray-100 rounded-3xl focus:ring-0 focus:border-rose-600 resize-none text-gray-800 text-sm font-medium outline-none transition-all custom-scrollbar shadow-inner"
                    />
              </div>
          </div>

          <div className="flex flex-col gap-6">
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col gap-6">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-rose-600 rounded-full"></span>
                      {t.awQueueStatus}
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Total</span>
                          <span className="text-2xl font-black text-gray-900">{queue.length}</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="text-[9px] font-black text-green-500 uppercase block mb-1">{t.awProcessed}</span>
                          <span className="text-2xl font-black text-gray-900">{processedCount}</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                          <span className="text-[9px] font-black text-rose-500 uppercase block mb-1">{t.awErrors}</span>
                          <span className="text-2xl font-black text-gray-900">{errorCount}</span>
                      </div>
                  </div>

                  <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                      {queue.length === 0 ? (
                        <div className="h-20 flex items-center justify-center text-gray-300 italic text-xs uppercase font-bold tracking-widest">Empty Queue</div>
                      ) : (
                        queue.map((item, idx) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                              <div className="flex items-center gap-3 overflow-hidden">
                                  <span className="text-[10px] font-black text-gray-300">#{idx + 1}</span>
                                  <span className="text-[11px] font-bold text-gray-700 truncate">{item.rawInput}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                  {item.status === 'processing' && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>}
                                  {item.status === 'completed' && <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                  {item.status === 'error' && <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
                                  <span className={`text-[9px] font-black uppercase ${item.status === 'completed' ? 'text-green-500' : item.status === 'error' ? 'text-rose-500' : 'text-gray-400'}`}>
                                      {item.status}
                                  </span>
                              </div>
                          </div>
                        ))
                      )}
                  </div>
              </div>

              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 flex flex-col gap-4">
                  <h3 className="text-xs font-black text-rose-900 uppercase tracking-widest">Whisk Automated Engine</h3>
                  <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-rose-700/60">
                          <span>Interval Delay Mode</span>
                          <span className="text-rose-900 font-black">4s - 8s (RANDOM)</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-rose-700/60">
                          <span>Rate Limit Detection</span>
                          <span className="text-rose-900 font-black">ENABLED</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-rose-700/60">
                          <span>Tech Profile</span>
                          <span className="text-rose-900 font-black">Arricam ST + Zeiss</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
