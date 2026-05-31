/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles, Heart, Gift, Camera, Gamepad2, Stars } from 'lucide-react';
import { useState, ChangeEvent } from 'react';

interface HeroProps {
  onNav: (tab: 'memories' | 'gift' | 'games') => void;
  avatarUrl: string;
  onAvatarUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Hero({ onNav, avatarUrl, onAvatarUpload }: HeroProps) {
  const [imgError, setImgError] = useState(false);

  // Fallback to high quality sweet illustration if the uploaded local photo hasn't loaded
  const displayUrl = imgError
    ? 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop'
    : avatarUrl;

  return (
    <div id="hero-section" className="relative flex flex-col items-center justify-center min-h-[85vh] py-12 px-4 z-10">
      {/* Decorative Sticker Left */}
      <motion.div 
        initial={{ opacity: 0, rotate: -20, scale: 0.5 }}
        animate={{ opacity: 1, rotate: -15, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-10 left-4 md:left-[15%] pointer-events-none hidden sm:block"
      >
        <div className="glass-pink-card p-3 rounded-2xl rotate-[-15deg] shadow-sm flex items-center gap-1">
          <span className="text-xl">🌸</span>
          <span className="text-xs font-handwritten text-pink-deep text-shadow">Sweet Day</span>
        </div>
      </motion.div>

      {/* Decorative Sticker Right */}
      <motion.div 
        initial={{ opacity: 0, rotate: 20, scale: 0.5 }}
        animate={{ opacity: 1, rotate: 12, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-10 right-4 md:right-[15%] pointer-events-none hidden sm:block"
      >
        <div className="glass-card px-4 py-2 rounded-full border border-pink-soft shadow-sm flex items-center gap-2">
          <span className="animate-spin text-xs" style={{ animationDuration: '4s' }}>✨</span>
          <span className="text-xs font-semibold text-pink-deep">Princess Ikaa 👑</span>
        </div>
      </motion.div>

      {/* Main Container Card with Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl w-full text-center glass-card rounded-3xl p-6 md:p-10 border border-white/60 relative overflow-hidden"
      >
        {/* Sparkle background element */}
        <div className="absolute top-2 right-4 text-pink-deep/30 text-3xl select-none">✨</div>
        <div className="absolute bottom-4 left-4 text-pink-deep/20 text-4xl select-none">💖</div>

        {/* Polaroid frame of Ikaa with customizable upload */}
        <motion.div 
          initial={{ rotate: -5, scale: 0.9, opacity: 0 }}
          animate={{ rotate: -2, scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
          className="relative inline-block mx-auto mb-8 polaroid-frame hover:rotate-2 hover:scale-[1.03] duration-300"
        >
          {/* Heart sticker on Polaroid top */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-3xl drop-shadow-md select-none animate-bounce">
            🎀
          </div>

          <div className="w-48 h-56 md:w-56 md:h-64 rounded-md overflow-hidden bg-pink-50 relative border-b border-pink-pastel/35">
            <img 
              src={displayUrl} 
              alt="Pretty Ikaa" 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          {/* Polaroid caption & ribbon */}
          <div className="mt-4 flex flex-col items-center">
            <p className="font-handwritten text-lg text-pink-deep tracking-wider">
              ikaa being adorable 🎀
            </p>
            <p className="text-[10px] text-gray-400 mt-1 font-mono tracking-widest uppercase">
              ★ Sweetest smile ★
            </p>
          </div>
        </motion.div>

        {/* Headings */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5.5xl font-bold tracking-tight text-pink-deep drop-shadow-sm font-sans flex items-center justify-center gap-1">
            My Pretty girl<span className="animate-pulse">💖</span>
          </h1>
          <p className="font-handwritten text-lg md:text-xl text-pink-deep mt-2 max-w-lg mx-auto leading-relaxed">
            A little pink world made specially for you <span className="text-xl">🌸</span>
          </p>
        </motion.div>

        {/* Short Personal Message */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-600 text-sm mt-5 max-w-md mx-auto leading-relaxed font-quicksand font-medium"
        >
          Selamat datang di jurnal scrapbook digital termanis khusus untukmu! 💫 Jelajahi galeri kenangan, buka kotak hadiah kejutan, dan mainkan game seru yang sengaja dirancang supaya Ikaa tersenyum bahagia hari ini! 🥰💕
        </motion.p>

        {/* Divider lines with a pink heart icon */}
        <div className="flex items-center justify-center gap-3 my-6 max-w-sm mx-auto">
          <div className="h-[1.5px] bg-gradient-to-r from-transparent to-pink-soft flex-1" />
          <Stars size={14} className="text-pink-deep animate-spin" style={{ animationDuration: '6s' }} />
          <div className="h-[1.5px] bg-gradient-to-l from-transparent to-pink-soft flex-1" />
        </div>

        {/* Interactive feature buttons requested: Open Memories, Open Gift, Play Games */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          <motion.button 
            id="btn-nav-memories"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNav('memories')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-pink-deep text-white font-bold text-shadow hover:bg-pink-soft active:translate-y-px transition shadow-md group border-2 border-pink-deep"
          >
            <Camera size={16} className="group-hover:rotate-12 transition-transform" />
            <span>📸 Memories</span>
          </motion.button>

          <motion.button 
            id="btn-nav-gift"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNav('gift')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-peach-soft text-pink-deep font-bold hover:bg-pink-pastel hover:scale-105 transition shadow-md group border-2 border-pink-soft"
          >
            <Gift size={16} className="animate-bounce" />
            <span>🎁 Open Gift</span>
          </motion.button>

          <motion.button 
            id="btn-nav-games"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNav('games')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-purple-soft text-purple-700 font-bold hover:bg-opacity-80 hover:scale-105 transition shadow-md group border-2 border-purple-200"
          >
            <Gamepad2 size={16} className="group-hover:-rotate-12 transition-transform animate-pulse" />
            <span>🎮 Play Games</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
