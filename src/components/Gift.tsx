/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift as GiftIcon, Heart, Sparkles, Mail, ChevronRight, RefreshCw, Star, Edit2, Plus, Trash2, Check, BookOpen } from 'lucide-react';
import { SWEET_MESSAGES } from '../data';
import backupData from '../custom_backup.json';

export default function Gift() {
  const [isOpened, setIsOpened] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [activeCategory, setActiveCategory] = useState<'sweet' | 'spirit'>(() => {
    try {
      const saved = localStorage.getItem('gift_active_category');
      return (saved === 'spirit' ? 'spirit' : 'sweet');
    } catch {
      return 'sweet';
    }
  });

  const [sweetLetters, setSweetLetters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gift_sweet_letters');
      if (saved) return JSON.parse(saved);
      return (backupData as any).giftSweetLetters || SWEET_MESSAGES;
    } catch {
      return (backupData as any).giftSweetLetters || SWEET_MESSAGES;
    }
  });

  const [spiritLetters, setSpiritLetters] = useState<string[]>(() => {
    const defaultSpirit = [
      "Semangat terus yaa Ikaa cantiiik! Aku tau kamu punya hari-hari yang sibuk, tapi jangan lupa kalau kamu itu hebat banget dan pasti bisa melewatinya dengan senyuman terbaikmu! 🌟",
      "Setiap hari adalah petualangan baru! Jangan dengarkan hal-hal sedih di luar sana. Ingat selalu ada orang yang sangat peduli dan selalu mendoakan yang terbaik untuk kebahagiaanmu setiap saat! 🌸",
      "Jangan terlalu keras pada dirimu sendiri yaa. Kamu sudah berusaha luar biasa hebat! Istirahatlah saat lelah, hirup napas dalam-dalam, dan rasakan kehangatan di sekitarmu. You are doing amazing! 🦖💖",
      "Jaga kesehatanmu baik-baik, Miss Ikaa! Semoga hari ini membawakanmu tawa kecil yang manis, kopi hangat kesukaanmu, dan kejutan kecil yang membahagiakan! Semangat selalu! 🥰✨"
    ];
    try {
      const saved = localStorage.getItem('gift_spirit_letters');
      if (saved) return JSON.parse(saved);
      return (backupData as any).giftSpiritLetters || defaultSpirit;
    } catch {
      return (backupData as any).giftSpiritLetters || defaultSpirit;
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTexareaVal, setEditTextareaVal] = useState('');

  const currentLetters = activeCategory === 'sweet' ? sweetLetters : spiritLetters;
  const currentFullMessage = currentLetters[activeMessageIndex] || "Surat kosong... 🌸";

  const saveSweetLetters = (updated: string[]) => {
    setSweetLetters(updated);
    try {
      localStorage.setItem('gift_sweet_letters', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveSpiritLetters = (updated: string[]) => {
    setSpiritLetters(updated);
    try {
      localStorage.setItem('gift_spirit_letters', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCategory = (cat: 'sweet' | 'spirit') => {
    setActiveCategory(cat);
    setActiveMessageIndex(0);
    try {
      localStorage.setItem('gift_active_category', cat);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddLetter = () => {
    const letters = activeCategory === 'sweet' ? sweetLetters : spiritLetters;
    const updated = [...letters, "Tulis surat barumu di sini... 🌸"];
    if (activeCategory === 'sweet') {
      saveSweetLetters(updated);
    } else {
      saveSpiritLetters(updated);
    }
    setEditingIndex(updated.length - 1);
    setEditTextareaVal("Tulis surat barumu di sini... 🌸");
  };

  const handleDeleteLetter = (index: number) => {
    const letters = activeCategory === 'sweet' ? sweetLetters : spiritLetters;
    if (letters.length <= 1) {
      alert("Harus ada minimal 1 surat yaa! 🌸");
      return;
    }
    if (window.confirm("Apakah kamu yakin ingin menghapus surat ini?")) {
      const updated = letters.filter((_, i) => i !== index);
      if (activeCategory === 'sweet') {
        saveSweetLetters(updated);
      } else {
        saveSpiritLetters(updated);
      }
      if (editingIndex === index) {
        setEditingIndex(null);
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
      setActiveMessageIndex(0);
    }
  };

  const handleSaveEdit = (index: number) => {
    const letters = activeCategory === 'sweet' ? sweetLetters : spiritLetters;
    const updated = [...letters];
    updated[index] = editTexareaVal;
    if (activeCategory === 'sweet') {
      saveSweetLetters(updated);
    } else {
      saveSpiritLetters(updated);
    }
    setEditingIndex(null);
  };

  const handleResetLetters = () => {
    if (window.confirm("Apakah kamu yakin ingin mengembalikan semua surat ke bawaan awal?")) {
      if (activeCategory === 'sweet') {
        saveSweetLetters(SWEET_MESSAGES);
      } else {
        const defaultSpirit = [
          "Semangat terus yaa Ikaa cantiiik! Aku tau kamu punya hari-hari yang sibuk, tapi jangan lupa kalau kamu itu hebat banget dan pasti bisa melewatinya dengan senyuman terbaikmu! 🌟",
          "Setiap hari adalah petualangan baru! Jangan dengarkan hal-hal sedih di luar sana. Ingat selalu ada orang yang sangat peduli dan selalu mendoakan yang terbaik untuk kebahagiaanmu setiap saat! 🌸",
          "Jangan terlalu keras pada dirimu sendiri yaa. Kamu sudah berusaha luar biasa hebat! Istirahatlah saat lelah, hirup napas dalam-dalam, dan rasakan kehangatan di sekitarmu. You are doing amazing! 🦖💖",
          "Jaga kesehatanmu baik-baik, Miss Ikaa! Semoga hari ini membawakanmu tawa kecil yang manis, kopi hangat kesukaanmu, dan kejutan kecil yang membahagiakan! Semangat selalu! 🥰✨"
        ];
        saveSpiritLetters(defaultSpirit);
      }
      setEditingIndex(null);
      setActiveMessageIndex(0);
    }
  };

  // Letter Typing simulation effect
  useEffect(() => {
    if (!showLetter) return;
    
    setTypedMessage('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      setTypedMessage((prev) => prev + currentFullMessage.charAt(i));
      i++;
      if (i >= currentFullMessage.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 35); // comfortable reading pacing

    return () => clearInterval(interval);
  }, [showLetter, activeMessageIndex, currentFullMessage]);

  const handleOpenGift = () => {
    setIsOpened(true);
    // Auto trigger letter after 1 second of opening animation
    setTimeout(() => {
      setShowLetter(true);
    }, 1200);
  };

  const handleNextMessage = () => {
    if (isTyping) {
      // Speed up or skip typing
      setTypedMessage(currentFullMessage);
      setIsTyping(false);
    } else {
      setActiveMessageIndex((prev) => (prev + 1) % currentLetters.length);
    }
  };

  const handleCloseAndReset = () => {
    setIsOpened(false);
    setShowLetter(false);
    setActiveMessageIndex(0);
    setTypedMessage('');
  };

  return (
    <div id="gift-section" className="relative z-10 py-10 px-4 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[75vh]">
      
      {/* Small badge header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-pink-pastel/60 px-4 py-1.5 rounded-full border border-pink-soft mb-3">
          <Sparkles size={14} className="text-pink-deep animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs font-bold text-pink-deep uppercase tracking-widest font-quicksand">Surprise Room</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-pink-deep font-sans">
          A Special Gift For You 🎁
        </h2>
        <p className="font-handwritten text-base text-pink-deep/80 mt-1">
          Bubbles, secrets, and magical words 🌸
        </p>
      </div>

      {/* Category selector & editor controls (unopened state only) */}
      {!isOpened && (
        <div className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-pink-pastel shadow-sm mb-6 transition-all">
          <p className="text-[10px] font-bold text-pink-deep/70 uppercase tracking-widest text-center mb-2.5 font-sans">
            Pilih Bagian Surat Utama:
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              id="category-btn-sweet"
              type="button"
              onClick={() => handleSaveCategory('sweet')}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition select-none cursor-pointer ${
                activeCategory === 'sweet'
                  ? 'bg-pink-deep text-white border-pink-deep shadow-sm'
                  : 'bg-white text-pink-deep border-pink-pastel hover:bg-pink-pastel/10'
              }`}
            >
              <Heart size={12} className={activeCategory === 'sweet' ? 'fill-white' : ''} />
              <span>Surat Special 💖</span>
            </button>
            <button
              id="category-btn-spirit"
              type="button"
              onClick={() => handleSaveCategory('spirit')}
              className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition select-none cursor-pointer ${
                activeCategory === 'spirit'
                  ? 'bg-pink-deep text-white border-pink-deep shadow-sm'
                  : 'bg-white text-pink-deep border-pink-pastel hover:bg-pink-pastel/10'
              }`}
            >
              <Sparkles size={12} className={activeCategory === 'spirit' ? 'fill-white' : ''} />
              <span>You and Me ✨</span>
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button
              id="toggle-editor-btn"
              type="button"
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-pink-deep bg-pink-pastel/30 hover:bg-pink-pastel/50 px-4 py-2 rounded-full border border-pink-soft/40 transition select-none cursor-pointer"
            >
              <BookOpen size={11} />
              <span>{isEditorOpen ? 'Tutup Atur Surat ❌' : 'Atur & Edit Pesan Surat 📝'}</span>
              <span className="bg-pink-deep text-[9px] text-white px-1.5 py-0.2 rounded-full font-mono font-bold">
                {activeCategory === 'sweet' ? sweetLetters.length : spiritLetters.length}
              </span>
            </button>
          </div>

          {/* Collapsible Editor Cabinet */}
          <AnimatePresence>
            {isEditorOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-pink-pastel/40"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold font-mono text-pink-deep bg-pink-pastel/30 px-2 py-0.5 rounded border border-pink-soft/20 uppercase tracking-wider">
                    Daftar Surat ({activeCategory === 'sweet' ? 'Special' : 'You and Me'})
                  </span>
                  <button
                    id="btn-reset-letters"
                    type="button"
                    onClick={handleResetLetters}
                    className="text-[9px] font-bold text-pink-deep/60 hover:text-red-500 hover:bg-red-50 px-2 py-0.5 rounded border border-pink-pastel/30 transition cursor-pointer"
                  >
                    Reset Bawaan 🔄
                  </button>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {currentLetters.map((msg, idx) => (
                    <div
                      key={`edit-card-${idx}`}
                      className="p-2.5 bg-pink-pastel/10 hover:bg-pink-pastel/20 rounded-xl border border-pink-pastel/30 transition-all"
                    >
                      {editingIndex === idx ? (
                        <div className="flex flex-col gap-1.5 w-full">
                          <textarea
                            value={editTexareaVal}
                            onChange={(e) => setEditTextareaVal(e.target.value)}
                            className="w-full text-xs font-sans p-2 rounded-lg border border-pink-deep bg-white focus:outline-none focus:ring-1 focus:ring-pink-deep resize-y min-h-[70px] text-gray-700 font-semibold"
                            placeholder="Tulis pesan indahmu di sini..."
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`cancel-edit-${idx}`}
                              type="button"
                              onClick={() => setEditingIndex(null)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-white border border-pink-pastel text-pink-deep/70 rounded-full hover:bg-pink-pastel/10 cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              id={`save-edit-${idx}`}
                              type="button"
                              onClick={() => handleSaveEdit(idx)}
                              className="px-2.5 py-1 text-[10px] font-bold bg-pink-deep text-white rounded-full hover:bg-pink-soft cursor-pointer flex items-center gap-0.5"
                            >
                              <Check size={9} />
                              Simpan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2.5">
                          <div className="flex-grow min-w-0">
                            <span className="text-[9px] font-bold font-mono text-pink-deep/60 block mb-0.5">
                              Surat #{idx + 1}
                            </span>
                            <p className="text-xs text-gray-700 whitespace-pre-wrap break-words pr-2 leading-relaxed font-medium">
                              {msg}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 mt-1">
                            <button
                              id={`btn-edit-card-${idx}`}
                              type="button"
                              onClick={() => {
                                setEditingIndex(idx);
                                setEditTextareaVal(msg);
                              }}
                              className="p-1.5 rounded-full hover:bg-pink-pastel/40 text-pink-deep transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              id={`btn-delete-card-${idx}`}
                              type="button"
                              onClick={() => handleDeleteLetter(idx)}
                              className="p-1.5 rounded-full hover:bg-red-50 text-red-400 hover:text-red-600 transition cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {editingIndex === null && (
                  <button
                    id="btn-add-new-letter"
                    type="button"
                    onClick={handleAddLetter}
                    className="w-full mt-2.5 py-2 rounded-xl border border-dashed border-pink-deep/40 text-pink-deep font-bold text-xs hover:bg-pink-pastel/20 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Tambah Surat Baru 📦</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="relative w-full min-h-[46vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* STATE 1: UNOPENED BOX */}
          {!isOpened && (
            <motion.div 
              key="closed-gift-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, y: -40, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={handleOpenGift}
            >
              <div className="relative group w-44 h-44 flex items-center justify-center">
                {/* Visual pulse glow circles */}
                <div className="absolute inset-x-0 inset-y-0 bg-pink-soft/20 rounded-full blur-2xl group-hover:scale-130 transition duration-500 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-deep/20 text-7xl select-none animate-ping [animation-duration:3s]">💖</div>

                {/* Animated Gift elements */}
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, -2, 2, -2, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut'
                  }}
                  className="relative z-10 w-36 h-36 flex flex-col justify-end"
                >
                  {/* Gift Box Lid */}
                  <div className="w-[104%] h-9 bg-pink-deep rounded-t-lg shadow-sm border border-pink-200 self-center flex items-center justify-center relative">
                    {/* Golden Star Tag */}
                    <div className="absolute -bottom-8 right-6 bg-yellow-100 border border-yellow-200 px-2 py-0.5 rounded shadow-sm text-[8px] font-bold text-yellow-600 rotate-12 flex items-center gap-0.5">
                      <Star size={8} className="fill-yellow-400" />
                      <span>For: Ikaa</span>
                    </div>

                    {/* Ribbon knot top */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-8 flex items-end justify-center pointer-events-none">
                      <div className="w-6 h-6 border-4 border-pink-soft rounded-full absolute -left-1" />
                      <div className="w-6 h-6 border-4 border-pink-soft rounded-full absolute -right-1" />
                      <div className="w-4 h-4 bg-pink-soft rounded-full z-10" />
                    </div>
                  </div>

                  {/* Gift Box Body */}
                  <div className="w-32 h-28 bg-pink-soft rounded-b-xl self-center border border-pink-200/50 shadow-lg relative overflow-hidden flex justify-center">
                    {/* Ribbon strip vertical */}
                    <div className="w-8 h-full bg-pink-deep" />
                    {/* Ribbon strip horizontal */}
                    <div className="absolute top-1/2 left-0 right-0 h-8 -translate-y-1/2 bg-pink-deep flex items-center justify-center" />
                  </div>
                </motion.div>
              </div>

              {/* Sweet call to action */}
              <p className="text-pink-deep font-bold text-xs mt-6 uppercase tracking-wider animate-pulse flex items-center gap-1.5 bg-pink-pastel/50 px-4 py-1.5 rounded-full border border-pink-soft">
                <GiftIcon size={12} className="animate-bounce" /> Click to open surprise! 🎀
              </p>
            </motion.div>
          )}

          {/* STATE 2: POPUP LETTER CARD */}
          {isOpened && showLetter && (
            <motion.div 
              key="opened-surprise-card"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full max-w-lg mt-2 text-center z-20 flex flex-col min-h-0"
            >
              {/* Envelope styling container */}
              <div className="relative bg-white rounded-3xl p-5 md:p-8 shadow-2xl border-4 border-pink-pastel grid-pattern flex flex-col justify-between w-full min-h-[350px]">
                
                {/* Top wax seal cute stamp */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-pink-deep rounded-full shadow border-2 border-white flex items-center justify-center text-white text-sm select-none z-30 animate-pulse">
                  💝
                </div>

                {/* Simulated ruled-paper lines for handwritten look */}
                <div className="flex-1 flex flex-col items-center p-1 md:p-2 w-full mb-2">
                  <div className="flex items-center gap-2 mb-3 bg-gradient-to-r from-pink-soft/10 to-pink-soft/30 px-3.5 py-1 rounded-full border border-pink-soft/20 self-center shrink-0">
                    <Mail size={12} className="text-pink-deep" />
                    <span className="text-[10px] font-extrabold text-pink-deep font-mono tracking-widest uppercase flex items-center gap-1">
                      {activeCategory === 'sweet' ? '🌸 Surat Special' : '✨ You and Me'} #{activeMessageIndex + 1}
                    </span>
                  </div>

                  {/* Typing message container maximized to prevent any clipping/cutting off */}
                  <div className="w-full text-left font-handwritten text-base md:text-lg text-gray-700 leading-relaxed min-h-[220px] h-auto p-5 md:p-6 bg-pink-pastel/10 rounded-xl relative select-text shadow-inner border border-pink-pastel/30">
                    {/* Pink notepad ruled lines */}
                    <p className="whitespace-pre-wrap break-words px-1 text-pink-deep/90 drop-shadow-sm font-sans md:font-quicksand font-semibold leading-relaxed">
                      {typedMessage}
                      {isTyping && (
                        <span className="inline-block w-2.5 h-4 ml-1 bg-pink-deep animate-pulse" />
                      )}
                    </p>
                  </div>
                </div>

                {/* Lined notebook cute border and sticker footer */}
                <div className="flex items-center justify-between mt-4 border-t border-pink-pastel pt-4">
                  {/* Cancel / reset trigger */}
                  <button 
                    id="btn-close-gift"
                    onClick={handleCloseAndReset}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-pink-deep/50 hover:text-pink-deep transition cursor-pointer"
                  >
                    <RefreshCw size={10} /> Close Letter 💌
                  </button>

                  {/* Flow Trigger Button */}
                  <motion.button 
                    id="btn-next-letter"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextMessage}
                    className="flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold text-white bg-pink-deep shadow hover:bg-pink-soft transition cursor-pointer"
                  >
                    <span>{isTyping ? 'Finish Text ✨' : 'Next Letter 💌'}</span>
                    <ChevronRight size={13} />
                  </motion.button>
                </div>
              </div>

              {/* Float floating micro hearts above layout */}
              <div className="flex gap-2.5 justify-center mt-5 pointer-events-none">
                <Heart size={16} className="text-pink-deep fill-pink-deep animate-bounce [animation-delay:0.1s]" />
                <Heart size={24} className="text-pink-deep fill-pink-deep animate-bounce" />
                <Heart size={16} className="text-pink-deep fill-pink-deep animate-bounce [animation-delay:0.2s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
