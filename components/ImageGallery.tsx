
import React, { useState } from 'react';
import { GeneratedImage, Language } from '../types';
import { translations } from '../translations';

interface ImageGalleryProps {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
  onDownloadAll: () => void;
  onDeleteAll: () => void;
  lang: Language;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete, onDownloadAll, onDeleteAll, lang }) => {
  const t = translations[lang];
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (images.length === 0) {
    return (
      <div className="mt-8 text-center p-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-lg">
        <div className="mx-auto h-16 w-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <h3 className="text-white font-bold text-xl mb-2 drop-shadow-md">{t.galleryEmptyTitle}</h3>
        <p className="text-white/80 text-base max-w-sm mx-auto font-medium">
          {t.galleryEmptyDesc}
        </p>
      </div>
    );
  }

  const handleDeleteAllWithConfirm = () => {
    if (showConfirmDelete) {
      onDeleteAll();
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3 drop-shadow-md">
              <span className="w-2 h-8 bg-white rounded-full shadow-sm"></span>
              {t.galleryTitle} <span className="bg-white/20 px-2 py-0.5 rounded-lg text-lg backdrop-blur-sm">#{images.length}</span>
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={onDownloadAll}
              className="flex items-center justify-center px-4 py-2 bg-white text-[#FF1E1E] font-bold rounded-lg hover:bg-gray-50 transition-all shadow-md text-sm group"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.downloadAll}
            </button>

            <div className="relative">
              <button
                onClick={handleDeleteAllWithConfirm}
                className={`
                  flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all shadow-sm text-sm
                  ${showConfirmDelete 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'}
                `}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {showConfirmDelete ? 'УВЕРЕНЫ?' : t.clearAll}
              </button>
              {showConfirmDelete && (
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="absolute -top-8 left-0 right-0 text-white text-[10px] uppercase font-black text-center"
                >
                  Отмена
                </button>
              )}
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div 
              className="aspect-auto bg-gray-100 flex items-center justify-center overflow-hidden relative border-b border-gray-100 cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img.url} alt={img.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <span className="text-white font-bold px-4 py-2 bg-black/50 rounded-full backdrop-blur-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {t.preview}
                 </span>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-4">
               <div>
                   <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] uppercase tracking-wider text-[#FF1E1E] font-extrabold bg-red-50 px-2 py-1 rounded-md">Aivox App</span>
                       <span className="text-xs text-gray-400 font-medium">{new Date(img.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                   <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 font-medium" title={img.prompt}>{img.prompt}</p>
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                   <div className="flex items-center gap-3">
                       <a href={img.url} download={`aivox-${img.id}.png`} className="inline-flex items-center text-gray-600 text-sm font-bold hover:text-[#FF1E1E] transition-colors">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          {t.save}
                       </a>
                       <button onClick={() => setSelectedImage(img)} className="inline-flex items-center text-gray-600 text-sm font-bold hover:text-[#FF1E1E] transition-colors">
                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          {t.preview}
                       </button>
                   </div>
                   <button onClick={() => onDelete(img.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title={t.delete}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setSelectedImage(null)}>
            <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img src={selectedImage.url} alt={selectedImage.prompt} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-2 transition-all">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="absolute bottom-6 bg-black/60 p-4 rounded-2xl backdrop-blur-xl border border-white/10 w-full max-w-2xl flex flex-col md:flex-row justify-between items-center gap-4 mx-4">
                    <p className="text-white/90 text-sm line-clamp-2 font-medium text-center md:text-left">{selectedImage.prompt}</p>
                    <div className="flex gap-3 shrink-0">
                      <a href={selectedImage.url} download={`aivox-${selectedImage.id}.png`} className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          {t.save}
                      </a>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
