/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Camera, Gift as GiftIcon, Gamepad2, Home, Sparkles, RefreshCw } from 'lucide-react';
import { DEFAULT_MEMORIES } from './data';
import { MemoryPhoto } from './types';
import backupData from './custom_backup.json';

// Importing custom components
import BackgroundEffects from './components/BackgroundEffects';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import Scrapbook from './components/Scrapbook';
import Gift from './components/Gift';
import Games from './components/Games';

const STORAGE_MEMORIES_KEY = 'ikaa_scrapbook_memories';
const STORAGE_AVATAR_KEY = 'ikaa_scrapbook_avatar_v2';

export default function App() {
  const [tab, setTab] = useState<'dashboard' | 'memories' | 'gift' | 'games'>('dashboard');
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string>('https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=400&auto=format&fit=crop');

  // Load custom user uploads from localStorage or Server Backup on mount
  useEffect(() => {
    const savedMemories = localStorage.getItem(STORAGE_MEMORIES_KEY);
    if (savedMemories) {
      try {
        setMemories(JSON.parse(savedMemories));
      } catch (e) {
        setMemories((backupData as any).memories || DEFAULT_MEMORIES);
      }
    } else {
      setMemories((backupData as any).memories || DEFAULT_MEMORIES);
    }

    const savedAvatar = localStorage.getItem(STORAGE_AVATAR_KEY);
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    } else if ((backupData as any).avatar) {
      setAvatarUrl((backupData as any).avatar);
    }
  }, []);

  // Background synchronize images and texts to server filesystem
  useEffect(() => {
    const syncPhotosToServer = async () => {
      const savedMem = localStorage.getItem(STORAGE_MEMORIES_KEY);
      const savedAv = localStorage.getItem(STORAGE_AVATAR_KEY);
      const savedSheet = localStorage.getItem('animal_character_sheet');
      const savedPuzzles = localStorage.getItem('custom_puzzle_images');
      const savedSweet = localStorage.getItem('gift_sweet_letters');
      const savedSpirit = localStorage.getItem('gift_spirit_letters');

      if (savedMem || savedAv || savedSheet || savedPuzzles || savedSweet || savedSpirit) {
        try {
          const memoriesParsed = savedMem ? JSON.parse(savedMem) : null;
          const puzzlesParsed = savedPuzzles ? JSON.parse(savedPuzzles) : null;
          const sweetParsed = savedSweet ? JSON.parse(savedSweet) : null;
          const spiritParsed = savedSpirit ? JSON.parse(savedSpirit) : null;

          await fetch('/api/sync-photos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              memories: memoriesParsed,
              avatar: savedAv,
              animalSheet: savedSheet,
              puzzleImages: puzzlesParsed,
              giftSweetLetters: sweetParsed,
              giftSpiritLetters: spiritParsed,
            }),
          });
          console.log('Backed up your custom photos and letters successfully to server!');
        } catch (err) {
          console.error('Backup of custom photos and letters failed:', err);
        }
      }
    };

    // Delay slightly to allow normal page load flow
    const timer = setTimeout(() => {
      syncPhotosToServer();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen text-gray-800 pb-28 select-none">
      {/* Background Interactive Effects (sakura, blur bubbles, grid pattern) */}
      <BackgroundEffects />

      {/* Persistent floating music playbar controls */}
      <MusicPlayer />

      {/* Header Glassmorphic Navigation Bar - only shows when NOT on the intro main landing */}
      <header className="sticky top-4 z-40 max-w-lg mx-auto px-4 mt-4 pointer-events-auto">
        <AnimatePresence>
          {tab !== 'dashboard' && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="glass-card rounded-2xl px-3 py-2 flex items-center justify-between border shadow-md"
            >
              <button
                id="header-nav-dashboard"
                onClick={() => setTab('dashboard')}
                className="p-2 rounded-xl text-pink-deep hover:bg-pink-pastel/60 hover:scale-105 active:scale-95 transition flex items-center gap-1.5 font-bold text-xs"
                title="Home Dashboard"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Home</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  id="header-nav-memories"
                  onClick={() => setTab('memories')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    tab === 'memories'
                      ? 'bg-pink-deep text-white shadow-sm'
                      : 'text-pink-deep hover:bg-pink-pastel/60'
                  }`}
                >
                  <Camera size={13} />
                  <span>Memories</span>
                </button>

                <button
                  id="header-nav-gift"
                  onClick={() => setTab('gift')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    tab === 'gift'
                      ? 'bg-pink-deep text-white shadow-sm'
                      : 'text-pink-deep hover:bg-pink-pastel/60'
                  }`}
                >
                  <GiftIcon size={13} />
                  <span>Gift</span>
                </button>

                <button
                  id="header-nav-games"
                  onClick={() => setTab('games')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                    tab === 'games'
                      ? 'bg-pink-deep text-white shadow-sm'
                      : 'text-pink-deep hover:bg-pink-pastel/60'
                  }`}
                >
                  <Gamepad2 size={13} />
                  <span>Games</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main interactive tabs transitions router */}
      <main className="relative z-10 w-full min-h-[75vh] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <Hero 
                onNav={(target) => setTab(target)} 
                avatarUrl={avatarUrl}
              />
            </motion.div>
          )}

          {tab === 'memories' && (
            <motion.div
              key="memories-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Scrapbook
                memories={memories}
              />
            </motion.div>
          )}

          {tab === 'gift' && (
            <motion.div
              key="gift-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Gift />
            </motion.div>
          )}

          {tab === 'games' && (
            <motion.div
              key="games-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <Games avatarUrl={avatarUrl} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Sweet Dedicated Footer */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none z-10">
        <div className="flex flex-col items-center gap-1 bg-white/25 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/40 shadow-sm">
          <p className="text-[10px] font-bold text-pink-deep uppercase tracking-widest font-mono flex items-center gap-1 animate-pulse">
            Made Specially with Love for Ikaa <Heart size={10} className="fill-pink-deep text-pink-deep animate-ping" />
          </p>
          <p className="text-[8px] text-gray-400 font-mono">
            ★ All Rights Surrendered © 2026 ★
          </p>
        </div>
      </footer>
    </div>
  );
}
