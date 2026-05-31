/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MemoryPhoto } from '../types';
import { AESTHETIC_FALLBACKS } from '../data';

interface ScrapbookProps {
  memories: MemoryPhoto[];
}

export default function Scrapbook({ memories }: ScrapbookProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  // Track image error URLs to apply Unsplash aesthetic fallbacks
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handlePrevPhoto = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === null ? null : (prev - 1 + memories.length) % memories.length));
    }
  };

  const handleNextPhoto = (e: MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev === null ? null : (prev + 1) % memories.length));
    }
  };

  const getStickerEmoji = (type?: string) => {
    switch (type) {
      case 'heart': return '💖';
      case 'star': return '⭐';
      case 'flower': return '🌸';
      case 'sparkle': return '✨';
      default: return '🎀';
    }
  };

  return (
    <div id="scrapbook-section" className="relative z-10 py-10 px-4 max-w-6xl mx-auto">
      {/* Header of Scrapbook Section */}
      <div className="text-center mb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-pink-pastel/60 px-4 py-1.5 rounded-full border border-pink-soft mb-3"
        >
          <Camera size={14} className="text-pink-deep" />
          <span className="text-xs font-bold text-pink-deep uppercase tracking-widest font-quicksand">Digital Journal</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-pink-deep font-sans">
          Ikaa’s Sweet Memories 📸
        </h2>
        <p className="font-handwritten text-base text-pink-deep/80 mt-1">
          Every little moment is beautiful with you 🌸
        </p>

      </div>



      {/* Polaroid Grid Layout with tape stickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mt-6">
        {memories.map((memo, idx) => {
          // Resolve standard fallback if local image fails
          const hasError = imageErrors[memo.id];
          const displayedUrl = hasError 
            ? AESTHETIC_FALLBACKS[idx % AESTHETIC_FALLBACKS.length]
            : memo.url;

          return (
            <motion.div
              layoutId={`card-container-${memo.id}`}
              key={memo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 0,
                zIndex: 40,
                transition: { duration: 0.3 }
              }}
              style={{ rotate: `${memo.angle || 0}deg` }}
              className="relative polaroid-frame w-full max-w-[250px] mx-auto cursor-pointer group"
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              {/* Virtual Washi Pink Tape at Top of Polaroid */}
              <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 opacity-80 backdrop-blur-[1px] border border-pink-200/50 shadow-[0_1px_4px_rgba(255,133,161,0.05)]"
                style={{
                  background: 'linear-gradient(rgba(255, 183, 197, 0.4), rgba(255, 183, 197, 0.35))',
                  transform: `rotate(${Math.sin(idx) * 8}deg)`,
                }}
              />

              {/* Decorative Cute Sticker Emojis */}
              {memo.sticker && (
                <div className="absolute top-2 right-2 text-xl filter drop-shadow-sm select-none z-10 hover:scale-130 transition duration-300">
                  {getStickerEmoji(memo.sticker)}
                </div>
              )}

              {/* Picture view */}
              <div className="w-full aspect-[4/5] rounded overflow-hidden bg-pink-50 border-b border-pink-pastel/30 relative">
                <img 
                  src={displayedUrl} 
                  alt={memo.caption}
                  onError={() => {
                    setImageErrors(prev => ({ ...prev, [memo.id]: true }));
                  }}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                


                {/* Micro hover sparkles */}
                <div className="absolute inset-0 bg-pink-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <Sparkles size={32} className="text-white/80 animate-ping [animation-duration:1.5s]" />
                </div>
              </div>

              {/* Metadata content */}
              <div className="mt-3.5 text-center flex flex-col items-center justify-center min-h-[44px]">
                <p className="font-handwritten text-base text-pink-deep leading-relaxed break-words whitespace-normal w-full px-1">
                  {memo.caption}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[8px] bg-pink-pastel/50 text-pink-deep/80 px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">
                    {memo.date}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Fullscreen Popup Carousel Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-deep/80 backdrop-blur-md"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            {/* Modal Glassmorphic Floating Container */}
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="max-w-2xl w-full text-center relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Escape Button */}
              <button 
                id="btn-close-lightbox"
                className="absolute -top-12 right-2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full shadow-md transition"
                onClick={() => setSelectedPhotoIndex(null)}
              >
                <X size={20} />
              </button>

              {/* Card wrapper */}
              <div className="bg-white rounded-3xl p-4 md:p-6 shadow-2xl relative border-4 border-pink-pastel">
                
                {/* Main image container */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-pink-50 max-h-[65vh] flex items-center justify-center border">
                  
                  {/* Left Carousel trigger arrow */}
                  <button 
                    id="btn-lightbox-prev"
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-pink-deep hover:scale-110 p-2.5 rounded-full shadow-lg transition active:scale-95 z-40"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <img 
                    src={
                      imageErrors[memories[selectedPhotoIndex].id]
                        ? AESTHETIC_FALLBACKS[selectedPhotoIndex % AESTHETIC_FALLBACKS.length]
                        : memories[selectedPhotoIndex].url
                    } 
                    alt="Lightbox View" 
                    className="w-full h-full object-contain"
                  />

                  {/* Right Carousel trigger arrow */}
                  <button 
                    id="btn-lightbox-next"
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-pink-deep hover:scale-110 p-2.5 rounded-full shadow-lg transition active:scale-95 z-40"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Top Sticker illustration */}
                  {memories[selectedPhotoIndex].sticker && (
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-base font-semibold shadow-md inline-flex items-center gap-1">
                      <span>{getStickerEmoji(memories[selectedPhotoIndex].sticker)}</span>
                      <span className="text-[10px] text-pink-deep font-bold uppercase tracking-wider font-quicksand">IKAALICIOUS</span>
                    </div>
                  )}
                </div>

                {/* Polaroid Bottom caption */}
                <div className="mt-5 text-center flex flex-col items-center justify-center">
                  <h3 className="font-handwritten text-2xl md:text-3.5xl text-pink-deep tracking-wide px-4">
                    {memories[selectedPhotoIndex].caption}
                  </h3>
                  
                  {/* Hearts overlay indicator */}
                  <div className="flex items-center gap-1.5 mt-2 bg-pink-pastel/40 px-3.5 py-1 rounded-full">
                    <Heart size={12} className="fill-pink-deep text-pink-deep animate-pulse" />
                    <span className="text-xs font-semibold text-pink-deep font-mono">
                      {memories[selectedPhotoIndex].date}
                    </span>
                    <Heart size={12} className="fill-pink-deep text-pink-deep animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
