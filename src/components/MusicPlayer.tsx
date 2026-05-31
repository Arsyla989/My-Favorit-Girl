/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Music, Volume2, VolumeX, EyeOff, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_SONGS } from '../data';

export default function MusicPlayer() {
  const [songs] = useState(DEFAULT_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex];

  // Try to autoplay once page has interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Autoplay blocked/failed: ", err));
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log(err));
      }
    }
  }, [currentSongIndex, currentSong.url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log(err));
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  const handleSongEnded = () => {
    handleNext();
  };

  return (
    <>
      <audio 
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnded}
        loop={songs.length === 1}
      />

      <AnimatePresence mode="wait">
        {isMinimized ? (
          <motion.button 
            key="minimized-music-widget"
            id="mini-music-player-trigger"
            onClick={() => setIsMinimized(false)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-pink-deep text-white border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-pink-soft animate-bounce [animation-duration:3s]"
            style={{ animationTimingFunction: 'ease-in-out' }}
            title="Tampilkan Pemutar Musik"
          >
            <Music size={18} className={isPlaying ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-ping" />
            )}
          </motion.button>
        ) : (
          <motion.div 
            key="expanded-music-player"
            id="mini-music-player"
            initial={{ scale: 0.9, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 15, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 glass-card rounded-2xl p-4 w-72 md:w-80 flex items-center gap-3 border shadow-lg"
          >
            {/* Rotating Cover Art / Vinyl style */}
            <div className="relative flex-shrink-0 w-12 h-12 rounded-full border-2 border-white Pink shadow-md overflow-hidden bg-pink-300">
              <div 
                className={`w-full h-full bg-cover bg-center rounded-full flex items-center justify-center transition-transform duration-1000 ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=200&auto=format&fit=crop')`,
                  animationDuration: '6s'
                }}
              >
                {/* Virtual center record hole */}
                <div className="w-3 h-3 bg-white rounded-full border border-pink-soft flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-pink-deep rounded-full" />
                </div>
              </div>
            </div>

            {/* Song details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-pink-deep tracking-wide truncate">
                {currentSong.title}
              </h4>
              <p className="text-[10px] text-gray-500 font-medium truncate">
                {currentSong.artist}
              </p>

              {/* Dynamic visualizers (wave bar) */}
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3 mt-1.5">
                  <span className="w-[3px] bg-pink-deep rounded-full animate-bounce [animation-duration:0.6s]" style={{ height: '30%' }} />
                  <span className="w-[3px] bg-pink-deep rounded-full animate-bounce [animation-duration:0.8s]" style={{ height: '80%' }} />
                  <span className="w-[3px] bg-pink-deep rounded-full animate-bounce [animation-duration:0.5s]" style={{ height: '50%' }} />
                  <span className="w-[3px] bg-pink-deep rounded-full animate-bounce [animation-duration:0.7s]" style={{ height: '90%' }} />
                  <span className="w-[3px] bg-pink-soft rounded-full animate-bounce [animation-duration:0.9s]" style={{ height: '45%' }} />
                  <span className="w-[3px] bg-pink-soft rounded-full animate-bounce [animation-duration:0.4s]" style={{ height: '70%' }} />
                </div>
              )}
            </div>

            {/* Music Playlist Action Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button 
                id="btn-play-pause"
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-pink-deep text-white flex items-center justify-center shadow-md hover:bg-pink-soft hover:scale-110 active:scale-95 transition"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={14} className="fill-white" /> : <Play size={14} className="fill-white ml-0.5" />}
              </button>

              <button 
                id="btn-next-song"
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-pink-pastel/60 text-pink-deep flex items-center justify-center hover:bg-pink-pastel hover:scale-105 active:scale-95 transition"
                title="Next Song"
              >
                <SkipForward size={12} className="fill-pink-deep" />
              </button>

              <button 
                id="btn-playlist"
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  showPlaylist ? 'bg-pink-deep text-white scale-105' : 'bg-pink-pastel/60 text-pink-deep hover:bg-pink-pastel/90 hover:scale-105 active:scale-95'
                }`}
                title="Daftar Lagu (Playlist)"
              >
                <ListMusic size={12} />
              </button>

              <button 
                id="btn-mute"
                onClick={toggleMute}
                className="w-7 h-7 rounded-full bg-pink-pastel/60 text-pink-deep flex items-center justify-center hover:bg-pink-pastel hover:scale-105 active:scale-95 transition"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>

              {/* Eye icon to collapse the player */}
              <button 
                id="btn-hide-player"
                onClick={() => setIsMinimized(true)}
                className="w-7 h-7 rounded-full bg-pink-pastel/60 text-pink-deep flex items-center justify-center hover:bg-pink-pastel/80 hover:scale-105 active:scale-95 transition"
                title="Sembunyikan Pemutar"
              >
                <EyeOff size={11} />
              </button>
            </div>

            {/* Playlist Menu Popup Overlay */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-16 left-0 right-0 bg-white/95 border border-pink-pastel p-3 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto space-y-1.5"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-pink-pastel/30">
                    <span className="text-[10px] font-bold text-pink-deep uppercase tracking-wider flex items-center gap-1">
                      🎵 Daftar Lagu Ikaa
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPlaylist(false)}
                      className="text-[10px] text-gray-400 hover:text-pink-deep font-semibold"
                    >
                      Selesai
                    </button>
                  </div>
                  <div className="space-y-1 pt-1">
                    {songs.map((song, i) => (
                      <button
                        key={song.id}
                        type="button"
                        onClick={() => {
                          setCurrentSongIndex(i);
                          setIsPlaying(true);
                          setShowPlaylist(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg text-[11px] flex items-center justify-between gap-2 transition ${
                          currentSongIndex === i
                            ? 'bg-pink-soft/20 text-pink-deep font-bold'
                            : 'hover:bg-pink-pastel/20 text-gray-700'
                        }`}
                      >
                        <div className="truncate flex items-center gap-1.5">
                          <span className="text-[9px] text-pink-deep/50">{i + 1}</span>
                          <span className="truncate">{song.title}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 truncate flex-shrink-0">{song.artist}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Track line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-pastel/30 rounded-b-2xl overflow-hidden">
              <div 
                className="h-full bg-pink-deep transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
