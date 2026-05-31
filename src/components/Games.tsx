/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Heart, Award, RefreshCw, Star, Zap, HelpCircle, Trophy, Play, Pause, ChevronRight } from 'lucide-react';
import { ANIMAL_QUESTIONS, AESTHETIC_FALLBACKS } from '../data';
import { HeartItem, AnimalQuestion } from '../types';
import { compressImage } from '../utils/compress';
import backupData from '../custom_backup.json';

interface GamesProps {
  avatarUrl: string;
}

export default function Games({ avatarUrl }: GamesProps) {
  const [activeGame, setActiveGame] = useState<'animal' | 'puzzle' | 'hearts'>('animal');

  return (
    <div id="games-section" className="relative z-10 py-8 px-4 max-w-5xl mx-auto flex flex-col items-center">
      
      {/* Navigation Headers */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-pink-pastel/60 px-4 py-1.5 rounded-full border border-pink-soft mb-3">
          <Gamepad2 size={14} className="text-pink-deep" />
          <span className="text-xs font-bold text-pink-deep uppercase tracking-widest font-quicksand">Arcade Plaza</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-pink-deep font-sans">
          Kawaii Game Corner 🎮
        </h2>
        <p className="font-handwritten text-base text-pink-deep/80 mt-1">
          Sweet games tailored just to bring a smile to Ikaa 🌸
        </p>

        {/* Game selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            id="tab-game-animal"
            onClick={() => setActiveGame('animal')}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'animal'
                ? 'bg-pink-deep text-white shadow-md'
                : 'bg-white/50 text-pink-deep hover:bg-pink-soft/20 border border-pink-soft/30'
            }`}
          >
            <span>🐾 Guess The Animal</span>
          </button>
          
          <button
            id="tab-game-puzzle"
            onClick={() => setActiveGame('puzzle')}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'puzzle'
                ? 'bg-pink-deep text-white shadow-md'
                : 'bg-white/50 text-pink-deep hover:bg-pink-soft/20 border border-pink-soft/30'
            }`}
          >
            <span>🧩 Slide Puzzle Ikaa</span>
          </button>

          <button
            id="tab-game-hearts"
            onClick={() => setActiveGame('hearts')}
            className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeGame === 'hearts'
                ? 'bg-pink-deep text-white shadow-md'
                : 'bg-white/50 text-pink-deep hover:bg-pink-soft/20 border border-pink-soft/30'
            }`}
          >
            <span>💖 Catch The Hearts</span>
          </button>
        </div>
      </div>

      {/* Main Game Interface Container */}
      <div className="w-full max-w-xl glass-card rounded-3xl p-5 md:p-8 shadow-xl border relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {/* GAME 1: GUESS THE ANIMAL */}
          {activeGame === 'animal' && (
            <motion.div 
              key="game-animal"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col items-center"
            >
              <AnimalGame />
            </motion.div>
          )}

          {/* GAME 2: PUZZLE SLIDE IKAA */}
          {activeGame === 'puzzle' && (
            <motion.div 
              key="game-puzzle"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col items-center"
            >
              <PuzzleSlide avatarUrl={avatarUrl} />
            </motion.div>
          )}

          {/* GAME 3: CATCH THE HEARTS */}
          {activeGame === 'hearts' && (
            <motion.div 
              key="game-hearts"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-col items-center w-full"
            >
              <CatchTheHearts />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// ==========================================
// GAME 1 IMPLEMENTATION: GUESS THE ANIMAL
// ==========================================
function AnimalGame() {
  const [questions] = useState<AnimalQuestion[]>(ANIMAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [customSheet, setCustomSheet] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('animal_character_sheet');
    if (saved) {
      setCustomSheet(saved);
    } else if ((backupData as any).animalSheet) {
      setCustomSheet((backupData as any).animalSheet);
    }
  }, []);

  const handleSheetUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          // Templates don't need excessive resolutions, max 1000px height is fine
          const compressed = await compressImage(base64, 1000, 400);
          localStorage.setItem('animal_character_sheet', compressed);
          setCustomSheet(compressed);
        } catch {
          localStorage.setItem('animal_character_sheet', base64);
          setCustomSheet(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSheet = () => {
    localStorage.removeItem('animal_character_sheet');
    setCustomSheet(null);
  };

  const getGridPositionForQuestion = (id: string) => {
    const indexMap: Record<string, { col: number; row: number }> = {
      'q-1': { col: 0, row: 0 }, // Kucing
      'q-2': { col: 1, row: 0 }, // Kelinci
      'q-3': { col: 2, row: 0 }, // Beruang
      'q-4': { col: 3, row: 0 }, // Rubah
      'q-5': { col: 4, row: 0 }, // Panda
      'q-6': { col: 0, row: 1 }, // Bebek
      'q-7': { col: 1, row: 1 }, // Hamster
      'q-8': { col: 2, row: 1 }, // Penguin
      'q-9': { col: 3, row: 1 }, // Berang-berang
      'q-10': { col: 4, row: 1 }, // Monyet
    };

    const pos = indexMap[id] || { col: 0, row: 0 };
    const posX = (pos.col / 4) * 100; // col / (5 - 1)
    const posY = pos.row * 100; // row / (2 - 1)
    return `${posX}% ${posY}%`;
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswerSubmit = (option: string) => {
    if (showFeedback) return; // ignore duplicates while loading transition
    setSelectedOption(option);
    
    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 10);
      setShowFeedback('correct');
      
      // Auto move next animal after 1.5s
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setShowFeedback(null);
          setSelectedOption(null);
          setShowHint(false);
        } else {
          setCompleted(true);
        }
      }, 1500);
    } else {
      setShowFeedback('wrong');
    }
  };

  const handleRetryQuestion = () => {
    setShowFeedback(null);
    setSelectedOption(null);
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowFeedback(null);
    setSelectedOption(null);
    setShowHint(false);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-pink-pastel text-pink-deep rounded-full flex items-center justify-center mx-auto text-3xl mb-4 animate-bounce">
          👑
        </div>
        <h3 className="text-xl font-bold text-pink-deep">Panda & Kelinci Hebat!</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">Ikaa berhasil menebak semua nama hewan dalam Bahasa Inggris dengan sempurna! Luar biasa! 🎉</p>
        <div className="bg-pink-pastel/40 border border-pink-soft/50 py-3 px-6 rounded-2xl max-w-xs mx-auto my-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Skor</p>
          <span className="text-3xl font-bold text-pink-deep">{score} Pts</span>
        </div>
        <button
          onClick={handleRestartGame}
          className="px-5 py-2.5 rounded-full text-xs font-bold bg-pink-deep text-white hover:bg-pink-soft transition flex items-center gap-1.5 mx-auto shadow-sm"
        >
          <RefreshCw size={13} /> Main Lagi 🐾
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">


      {/* HUD Info */}
      <div className="flex justify-between items-center w-full mb-4.5 border-b border-pink-soft/20 pb-2">
        <span className="text-[10px] font-bold text-gray-400 font-mono">
          HEWAN: {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-[10px] bg-pink-pastel text-pink-deep px-3 py-1 rounded-full font-bold flex items-center gap-1">
          <Award size={11} className="fill-pink-deep" /> SCORE: {score} Pts
        </span>
      </div>

      {/* Animal Image */}
      <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white bg-pink-50 relative group mx-auto">
        {customSheet ? (
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url('${customSheet}')`,
              backgroundSize: '500% 200%',
              backgroundPosition: getGridPositionForQuestion(currentQuestion.id),
              backgroundRepeat: 'no-repeat',
            }}
          />
        ) : (
          <img 
            src={currentQuestion.image} 
            alt="Guess me" 
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}

        {/* Absolute Answer overlays feedback */}
        <AnimatePresence>
          {showFeedback === 'correct' && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 bg-pink-deep/40 flex flex-col items-center justify-center text-white z-10"
            >
              <div className="text-4xl animate-bounce">🌸</div>
              <p className="font-bold text-lg mt-1 tracking-wider text-shadow">YAY, BENAR! YUMMY! 🧁</p>
              <span className="text-[10px] font-semibold opacity-90 uppercase tracking-widest mt-1">Excellent English!</span>
            </motion.div>
          )}

          {showFeedback === 'wrong' && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-10 p-4"
            >
              <div className="text-3xl animate-bounce">🥺</div>
              <p className="font-bold text-sm mt-1">Aduhh, masih kurang tepat.. coba lagi yuk?</p>
              <button 
                onClick={handleRetryQuestion}
                className="mt-3.5 px-4.5 py-1.5 rounded-full text-[10px] font-bold bg-pink-deep text-white hover:bg-pink-soft transition active:scale-95"
              >
                Coba Tebak Lagi 🎀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options columns */}
      <div className="grid grid-cols-2 gap-3 w-full mt-5">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswerSubmit(option)}
            disabled={showFeedback !== null}
            className={`py-3.5 px-4 rounded-2xl border text-xs font-bold capitalize transition flex items-center justify-center gap-1.5 ${
              selectedOption === option
                ? option === currentQuestion.correctAnswer
                  ? 'bg-pink-deep border-pink-deep text-white shadow-md'
                  : 'bg-gray-200 border-gray-300 text-gray-500'
                : 'bg-white/60 border-pink-pastel/60 text-pink-deep hover:bg-pink-pastel/40 hover:scale-103 active:scale-97'
            }`}
          >
            <span>{option}</span>
          </button>
        ))}
      </div>

      {/* Hint Accordion Trigger */}
      <div className="mt-4 w-full text-center">
        {!showHint ? (
          <button
            onClick={() => setShowHint(true)}
            className="text-[10px] font-semibold text-pink-deep/60 hover:text-pink-deep underline inline-flex items-center gap-1 cursor-pointer font-sans"
          >
            <HelpCircle size={10} /> Butuh bocoran petunjuk? 🤫
          </button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-pink-pastel/40 rounded-xl border border-pink-soft/20 text-[11px] text-pink-deep/80 max-w-sm mx-auto"
          >
            <span className="font-bold">✨ Clue:</span> {currentQuestion.hint}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// GAME 2 IMPLEMENTATION: PUZZLE SLIDE
// ==========================================
function PuzzleSlide({ avatarUrl }: { avatarUrl: string }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [puzzleImg, setPuzzleImg] = useState<string>(avatarUrl);

  const [customPuzzles, setCustomPuzzles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('custom_puzzle_images');
      if (saved) return JSON.parse(saved);
      return (backupData as any).puzzleImages || [];
    } catch {
      return (backupData as any).puzzleImages || [];
    }
  });

  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const saveCustomPuzzles = (updated: string[]) => {
    setCustomPuzzles(updated);
    try {
      localStorage.setItem('custom_puzzle_images', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCustomPuzzle = (index: number) => {
    setReplaceIndex(index);
    setTimeout(() => {
      if (replaceInputRef.current) {
        replaceInputRef.current.click();
      }
    }, 50);
  };

  const handleReplaceUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replaceIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const compressed = await compressImage(base64, 600, 600);
          const updated = [...customPuzzles];
          const oldUrl = updated[replaceIndex];
          updated[replaceIndex] = compressed;
          saveCustomPuzzles(updated);
          if (puzzleImg === oldUrl) {
            setPuzzleImg(compressed);
          }
        } catch {
          const updated = [...customPuzzles];
          const oldUrl = updated[replaceIndex];
          updated[replaceIndex] = base64;
          saveCustomPuzzles(updated);
          if (puzzleImg === oldUrl) {
            setPuzzleImg(base64);
          }
        }
        setReplaceIndex(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCustomPuzzle = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (window.confirm("Hapus foto kustom ini dari daftar?")) {
      const targetUrl = customPuzzles[index];
      const updated = customPuzzles.filter((_, i) => i !== index);
      saveCustomPuzzles(updated);
      if (puzzleImg === targetUrl) {
        setPuzzleImg(avatarUrl);
      }
    }
  };

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const PRESET_PUZZLES = [
    { id: 'avatar', name: '🌸 Foto Chibi Ikaa/Avatar', url: avatarUrl },
    { id: 'cats', name: '🐱 Kucing Chibi Imut', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop' },
    { id: 'blossoms', name: '🌸 Bunga Sakura', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop' },
    { id: 'cozy', name: '✨ Kamar Lofi Cozy', url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=600&auto=format&fit=crop' },
    { id: 'tulips', name: '🌷 Bouquet Tulip Pink', url: 'https://images.unsplash.com/photo-1550156005-ab7c7d4b227c?q=80&w=600&auto=format&fit=crop' },
  ];

  // Initialize and Shuffle 3x3 Slide Board (Indices 0 to 8 where 8 is the blank tile)
  const initializePuzzle = () => {
    // Generate ordered tiles (8 is blank / 9th slot)
    const initialTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Perform standard solvable random slides shuffling
    let shuffled = [...initialTiles];
    let isSolvable = false;
    
    while (!isSolvable) {
      // Shuffle array except the last one sometimes, or shuffle completely
      for (let i = shuffled.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }
      
      // Calculate inversions count to ensure solvability
      let inversions = 0;
      for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
          if (shuffled[i] > shuffled[j] && shuffled[i] !== 8 && shuffled[j] !== 8) {
            inversions++;
          }
        }
      }
      // Since grid width is odd (3), board is solvable if inversions count is EVEN
      if (inversions % 2 === 0 && shuffled.join(',') !== initialTiles.join(',')) {
        isSolvable = true;
      }
    }

    setTiles(shuffled);
    setMoveCount(0);
    setSeconds(0);
    setHasWon(false);
    setIsTimerRunning(true);
  };

  const handleStartGameWithShuffle = () => {
    setIsGameStarted(true);
    initializePuzzle();
  };

  const handleBackToPreview = () => {
    setIsGameStarted(false);
    setIsTimerRunning(false);
    setHasWon(false);
  };

  const handleCustomPuzzleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const compressed = await compressImage(base64, 600, 600);
          const updated = [...customPuzzles, compressed].slice(-9);
          saveCustomPuzzles(updated);
          setPuzzleImg(compressed);
        } catch {
          const updated = [...customPuzzles, base64].slice(-9);
          saveCustomPuzzles(updated);
          setPuzzleImg(base64);
        }
        setIsGameStarted(false);
        setHasWon(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Slide Board Clock seconds counters
  useEffect(() => {
    if (isTimerRunning && !hasWon) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, hasWon]);

  // Check slide bounds: standard 2D Grid coordinates slide movements
  const canMove = (index: number) => {
    const blankIndex = tiles.indexOf(8);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const blankRow = Math.floor(blankIndex / 3);
    const blankCol = blankIndex % 3;

    // Direct adjacency detection (No diagonals)
    return (
      (Math.abs(row - blankRow) === 1 && col === blankCol) ||
      (Math.abs(col - blankCol) === 1 && row === blankRow)
    );
  };

  const executeMove = (index: number) => {
    if (!canMove(index) || hasWon) return;

    const blankIndex = tiles.indexOf(8);
    const newTiles = [...tiles];
    
    // Swap tiles
    newTiles[blankIndex] = tiles[index];
    newTiles[index] = 8;
    
    setTiles(newTiles);
    setMoveCount((prev) => prev + 1);

    // Check Win Index configuration: indices 0..8
    let won = true;
    for (let i = 0; i < 9; i++) {
      if (newTiles[i] !== i) {
        won = false;
        break;
      }
    }
    if (won) {
      setHasWon(true);
      setIsTimerRunning(false);
    }
  };

  // Skip Solver cheat button to let user see solved picture easily and experience the winning moment 💖
  const triggerSelfSolveCheat = () => {
    setTiles([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    setHasWon(true);
    setIsTimerRunning(false);
  };

  // Convert digital timer output
  const formatTime = (timeInSecs: number) => {
    const m = Math.floor(timeInSecs / 60);
    const s = timeInSecs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isGameStarted) {
    return (
      <div className="w-full flex flex-col items-center select-none text-center">
        <h3 className="text-base font-bold text-pink-deep mb-1 text-center font-sans">🧩 Pratinjau & Pilih Foto Puzzle</h3>
        <p className="text-[10px] text-gray-500 max-w-sm mb-4 leading-relaxed">
          Pilih dari galeri foto cantik di bawah, dan lihat versi utuh sebelum bermain! ✨
        </p>

        {/* Completed Solved Preview */}
        <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-md border-4 border-pink-pastel bg-white/50 mb-6 relative">
          <img 
            src={puzzleImg} 
            alt="Puzzle Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 text-white text-[9px] font-bold uppercase tracking-wider text-center">
            Foto Jadi (Pratinjau) 🌸
          </div>
        </div>

        {/* Gallery list */}
        <div className="w-full mb-5">
          <p className="text-[10px] font-bold text-pink-deep/70 uppercase tracking-widest mb-2 text-left font-sans">Pilih Foto Puzzle:</p>
          <div className="grid grid-cols-6 gap-2 w-full">
            {PRESET_PUZZLES.map((photo) => {
              const isActive = puzzleImg === photo.url;
              return (
                <button
                  key={photo.id}
                  onClick={() => {
                    setPuzzleImg(photo.url);
                    setHasWon(false);
                  }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition relative ${
                    isActive ? 'border-pink-deep ring-2 ring-pink-soft/30 scale-103' : 'border-pink-soft/30 hover:border-pink-soft'
                  }`}
                  title={photo.name}
                >
                  <img src={photo.url} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartGameWithShuffle}
          className="px-6 py-2.5 bg-pink-deep hover:bg-pink-soft text-white font-bold text-xs rounded-full shadow hover:shadow-md transition flex items-center gap-1.5 mt-2"
        >
          <span>🧩 Mulai Acak & Main!</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Timer HUD */}
      <div className="flex justify-between items-center w-full mb-4 border-b border-pink-soft/20 pb-2">
        <span className="text-[10px] font-bold text-gray-400 font-mono">
          LANGKAH: <span className="text-pink-deep">{moveCount}</span>
        </span>
        <span className="text-[10px] bg-pink-pastel text-pink-deep px-3 py-1 rounded-full font-bold flex items-center gap-1 font-mono">
          ⏱️ TIME: {formatTime(seconds)}
        </span>
      </div>

      {/* Puzzle stage: 3x3 Grid */}
      <div className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-lg border-4 border-pink-pastel bg-white/40 grid grid-cols-3 gap-[2px]">
        
        {tiles.map((tileIndex, currentSlot) => {
          if (tileIndex === 8) {
            // Blank space
            return <div key="blank-space" className="bg-pink-pastel/30 w-full h-full relative" />;
          }

          // Compute 2D background slice percentages for 3x3 grids (row/col are based on original content tileIndex)
          const originalRow = Math.floor(tileIndex / 3);
          const originalCol = tileIndex % 3;
          // Percentage offsets
          const bgX = (originalCol / 2) * 100;
          const bgY = (originalRow / 2) * 100;

          const activeToSlide = canMove(currentSlot);

          return (
            <button
              key={`tile-${tileIndex}`}
              onClick={() => executeMove(currentSlot)}
              disabled={hasWon}
              className={`w-full h-full relative rounded-md overflow-hidden transition-all duration-200 outline-none ${
                activeToSlide ? 'hover:brightness-105 hover:shadow-inner cursor-pointer' : 'cursor-not-allowed'
              }`}
              style={{
                backgroundImage: `url('${puzzleImg}')`,
                backgroundSize: '300% 300%',
                backgroundPosition: `${bgX}% ${bgY}%`,
              }}
            >
              {/* Optional tile sequence identifier label */}
              {activeToSlide && (
                <span className="absolute bottom-1 right-1 bg-white/70 hover:bg-white text-[8px] font-bold text-pink-deep px-1 rounded-full border border-pink-soft">
                  Move
                </span>
              )}
            </button>
          );
        })}

        {/* Win Screen Overlay */}
        <AnimatePresence>
          {hasWon && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-40"
            >
              <div className="text-3xl animate-bounce">💖</div>
              <h3 className="text-base font-bold text-pink-deep mt-2">Puzzle Berhasil Dipecahkan!</h3>
              <p className="text-[10px] text-gray-500 max-w-[200px] mt-1 leading-normal">Ikaa emang jenius parah! Foto cantiknya tersusun kembali dengan sempurna! 🥰</p>
              
              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={handleBackToPreview}
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold text-white bg-pink-deep hover:bg-pink-soft transition shadow"
                >
                  Pilih Foto Lain 💐
                </button>
                <button
                  onClick={initializePuzzle}
                  className="px-4 py-1.5 rounded-full text-[10px] font-bold text-pink-deep bg-pink-pastel hover:bg-pink-soft/10 transition border border-pink-soft"
                >
                  Main Lagi 🧩
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom control anchors */}
      <div className="flex items-center justify-between w-full mt-5 px-1">
        <button
          onClick={handleBackToPreview}
          className="px-3.5 py-1.5 rounded-full text-[10px] font-bold bg-pink-pastel text-pink-deep hover:bg-white border border-pink-soft flex items-center gap-1 shadow-sm uppercase tracking-wider font-sans"
        >
          ↩️ Ganti Foto / Pratinjau
        </button>

        {!hasWon && (
          <button
            onClick={triggerSelfSolveCheat}
            className="px-2 py-1.5 rounded-full text-[8.5px] font-extrabold text-pink-deep/40 hover:text-pink-deep uppercase tracking-widest inline-flex items-center gap-1 font-mono"
          >
            Selesaikan Instan (Cheat) 🤫
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// GAME 3 IMPLEMENTATION: CATCH THE HEARTS
// ==========================================
function CatchTheHearts() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30s match play
  const [hearts, setHearts] = useState<HeartItem[]>([]);
  const [highScore, setHighScore] = useState(0);
  
  // Game loop intervals refs
  const boardRef = useRef<HTMLDivElement | null>(null);
  const loopRef = useRef<number | null>(null);
  const spawnsRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load High Score
  useEffect(() => {
    const saved = localStorage.getItem('heart_catch_high');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Update high score
  const updateHighScore = (currScore: number) => {
    if (currScore > highScore) {
      setHighScore(currScore);
      localStorage.setItem('heart_catch_high', currScore.toString());
    }
  };

  const handleStartGame = () => {
    setScore(0);
    setCombo(0);
    setTimeRemaining(30);
    setHearts([]);
    setGameState('playing');
  };

  // Core spawns loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (spawnsRef.current) clearInterval(spawnsRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    // Spawn heart particles every 500ms
    spawnsRef.current = setInterval(() => {
      const types: ('heart' | 'star' | 'bonus' | 'broken')[] = ['heart', 'heart', 'heart', 'star', 'bonus', 'broken'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      
      let colors = '#ff85a1'; // normal pink
      let diameter = 24 + Math.random() * 12;
      let spd = 2 + Math.random() * 3.5;

      if (chosenType === 'star') {
        colors = '#fbc02d'; // golden sparkle
        diameter = 18;
        spd = 3 + Math.random() * 3;
      } else if (chosenType === 'bonus') {
        colors = '#7e57c2'; // purple bonus charm
        diameter = 30;
        spd = 5 + Math.random() * 2;
      } else if (chosenType === 'broken') {
        colors = '#757575'; // dark grey cloud broken heart
        diameter = 26;
        spd = 2.5 + Math.random() * 1.5;
      }

      const newborn: HeartItem = {
        id: `h-${Date.now()}-${Math.random()}`,
        x: 5 + Math.random() * 90, // position % width
        size: diameter,
        speed: spd,
        type: chosenType,
        color: colors
      };

      setHearts((prev) => [...prev, newborn]);
    }, 450);

    // Game clock count
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (spawnsRef.current) clearInterval(spawnsRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState]);

  // Frame falling rendering loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }

    const updateFrameLoop = () => {
      setHearts((prevHearts) => {
        // Fall down, filter items that have escaped bottom
        const moved = prevHearts.map((h) => ({
          ...h,
          yOffset: (h.speed) // trigger layout redraw
        }));

        // Filter away anything that went past 450px bottom boundary
        // We accumulate their speeds vertically in state or simple top offset percentage
        return moved;
      });

      // Simple relative frame updates using state coordinates is nice, but to eliminate re-render lags,
      // let's animate the elements with framer-motion or simple absolute animations.
      // An easy, ultra-smooth technique is moving elements via Framer Motion's transition layout,
      // or standard React coordinates that increment on frame ticks:
      
      setHearts((prev) => {
        return prev
          .map((h) => ({ ...h, y: (h.x) })) // just placeholder
          .filter(() => true);
      });

      loopRef.current = requestAnimationFrame(updateFrameLoop);
    };

    loopRef.current = requestAnimationFrame(updateFrameLoop);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [gameState]);

  // Handle heart catch click trigger
  const handleItemClick = (id: string, type: 'heart' | 'star' | 'bonus' | 'broken') => {
    // Remove selected item immediately
    setHearts((prev) => prev.filter((h) => h.id !== id));

    if (type === 'broken') {
      // Penalty element
      setScore((prev) => Math.max(0, prev - 15));
      setCombo(0);
    } else {
      let basePoints = 10;
      if (type === 'star') basePoints = 15;
      if (type === 'bonus') basePoints = 30;

      // Combo factor multiplier scaling
      const comboMult = Math.min(5, Math.floor(combo / 4) + 1);
      const pointsScored = basePoints * comboMult;
      
      setScore((prev) => prev + pointsScored);
      setCombo((prev) => prev + 1);
    }
  };

  // Auto clean stale hearts from ground with a standard interval
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const cleaningTick = setInterval(() => {
      // Just clear oldest hearts to prevent DOM memory bloating
      setHearts((prev) => {
        if (prev.length > 25) {
          return prev.slice(5); // drop earliest
        }
        return prev;
      });
    }, 1500);

    return () => clearInterval(cleaningTick);
  }, [gameState]);

  // Update scores on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      updateHighScore(score);
    }
  }, [gameState, score]);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Game statistics HUD wrapper */}
      <div className="flex justify-between items-center w-full mb-3.5 border-b border-pink-soft/20 pb-2">
        <div className="flex items-center gap-1">
          <Zap size={11} className="text-yellow-500 fill-yellow-400" />
          <span className="text-[10px] uppercase font-bold text-gray-500 font-mono">
            COMBO: <span className="text-pink-deep text-xs font-black">{combo}x</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-red-100 text-rose-500 px-2.5 py-0.5 rounded-full font-bold font-mono">
            ⏰ {timeRemaining}s
          </span>
          <span className="text-[10px] bg-pink-pastel text-pink-deep px-3 py-1 rounded-full font-bold font-mono">
            SCORE: {score}
          </span>
        </div>
      </div>

      {/* Main interactive sky canvas box */}
      <div 
        ref={boardRef}
        className="relative w-full h-[260px] md:h-[300px] bg-gradient-to-b from-pink-50 to-pink-pastel/25 rounded-2xl border-2 border-white overflow-hidden shadow-inner flex items-center justify-center cursor-crosshair"
      >
        
        {/* Play States selector screens */}
        {gameState === 'idle' && (
          <div className="text-center p-4">
            <div className="text-4xl animate-bounce mb-3">💖</div>
            <h4 className="text-sm font-bold text-pink-deep">Tangkap Semua Hati Cinta!</h4>
            <p className="text-[9.5px] text-gray-400 max-w-[240px] mx-auto mt-1 leading-normal">Hati berjatuhan dari langit! Klik gelembung hati merah muda sebanyak-banyaknya untuk raih rekor skor combo terbaik! Hindari awan mendung abu-abu ya! ☁️</p>
            
            <div className="bg-pink-pastel/30 py-1.5 px-3 rounded-xl border border-pink-soft/20 inline-flex items-center gap-1.5 mt-4">
              <Trophy size={11} className="text-yellow-500" />
              <span className="text-[10px] font-bold text-pink-deep">REKOR TINGGI: {highScore} Pts</span>
            </div>

            <button
              onClick={handleStartGame}
              className="mt-4 px-6 py-2 rounded-full text-xs font-bold text-white bg-pink-deep hover:bg-pink-soft transition flex items-center gap-1 mx-auto shadow-sm"
            >
              <Play size={11} className="fill-white" /> MULAI GAME 💖
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="text-center p-4 z-20">
            <div className="text-4xl animate-bounce mb-2">🏆</div>
            <h4 className="text-base font-bold text-pink-deep">Game Over! Hebat Banget!</h4>
            <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto mt-1 leading-normal">Waktu habis! Ikaa berhasil membuktikan reflek pahlawan cintanya!</p>
            
            <div className="flex justify-center gap-4 my-3.5">
              <div className="bg-pink-pastel/40 p-2 rounded-xl text-center min-w-[70px] border border-pink-soft/20">
                <p className="text-[8px] font-bold text-gray-400 uppercase">Skor Kamu</p>
                <span className="text-lg font-bold text-pink-deep">{score}</span>
              </div>
              <div className="bg-pink-pastel/40 p-2 rounded-xl text-center min-w-[80px] border border-pink-soft/20">
                <p className="text-[8px] font-bold text-gray-400 uppercase">High Score</p>
                <span className="text-lg font-bold text-pink-deep">{Math.max(highScore, score)}</span>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="px-5 py-2 rounded-full text-xs font-bold text-white bg-pink-deep hover:bg-pink-soft transition flex items-center gap-1.5 mx-auto shadow"
            >
              <RefreshCw size={11} /> Main Lagi 🌸
            </button>
          </div>
        )}

        {/* Active particles falling overlay */}
        {gameState === 'playing' && (
          <div className="absolute inset-0 pointer-events-auto">
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                onClick={() => handleItemClick(heart.id, heart.type)}
                initial={{ y: -30 }}
                // Animate falling down based on customizable velocity heights
                animate={{ y: 350 }}
                // Linear duration computed from speeds props
                transition={{ duration: 7 * (4 / heart.speed), ease: 'linear' }}
                className="absolute origin-center transition hover:scale-135 cursor-none active:scale-95"
                style={{
                  left: `${heart.x}%`,
                  width: `${heart.size}px`,
                  height: `${heart.size}px`,
                }}
              >
                {/* Switch shape depending on candy type layout */}
                {heart.type === 'broken' ? (
                  <span className="text-xl filter drop-shadow select-none" style={{ fontSize: `${heart.size}px` }}>☁️</span>
                ) : heart.type === 'star' ? (
                  <span className="text-xl filter drop-shadow select-none animate-spin" style={{ fontSize: `${heart.size}px`, animationDuration: '3s' }}>⭐</span>
                ) : heart.type === 'bonus' ? (
                  <span className="text-xl filter drop-shadow select-none" style={{ fontSize: `${heart.size}px` }}>🎁</span>
                ) : (
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="text-pink-deep drop-shadow filter animate-pulse"
                    style={{ width: '100%', height: '100%', color: heart.color }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </motion.div>
            ))}

            {/* Zero state HUD notifier if sky is silent for micro seconds */}
            {hearts.length === 0 && (
              <div className="absolute inset-x-0 bottom-4 text-center text-[9px] font-bold text-pink-deep/45 animate-pulse uppercase tracking-widest">
                Menanti Hati Jatuh Dari Langit... 🌸
              </div>
            )}
          </div>
        )}

      </div>

      {/* Touch footer notifier */}
      {gameState === 'playing' && (
        <p className="text-[9.5px] font-bold text-pink-deep/60 mt-3 flex items-center gap-1 uppercase tracking-wider animate-pulse">
          🎯 Sentuh / Klik tiap gelembung sebelum menyentuh tanah!
        </p>
      )}
    </div>
  );
}
