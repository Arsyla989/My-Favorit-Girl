/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, CSSProperties } from 'react';

interface SakuraPetal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  rotate: string;
}

interface FloatingHeart {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
}

export default function BackgroundEffects() {
  const [petals, setPetals] = useState<SakuraPetal[]>([]);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // Generate sakura petals
    const newPetals = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 20}s`, // slow falling
      size: `${8 + Math.random() * 15}px`,
      rotate: `${Math.random() * 360}deg`
    }));
    setPetals(newPetals);

    // Generate floating hearts
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 15}s`,
      size: 12 + Math.random() * 18
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Ambient Blur Pink / Peach Bubbles */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 md:w-[450px] md:h-[450px] bg-pink-200/40 rounded-full blur-[100px] animate-pulse [animation-duration:12s]" />
      <div className="absolute bottom-[15%] right-[5%] w-80 h-80 md:w-[500px] md:h-[500px] bg-peach-soft/50 rounded-full blur-[120px] animate-pulse [animation-duration:16s]" />
      <div className="absolute top-[50%] left-[35%] w-60 h-60 bg-purple-soft/30 rounded-full blur-[90px] animate-pulse [animation-duration:10s]" />

      {/* Grid Scrapbook Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.4]" />
      <div className="absolute inset-0 dots-pattern opacity-[0.25]" />

      {/* Immersive Theme Floating Sticker Emojis */}
      <div className="absolute top-[10%] left-[5%] text-[24px] select-none pointer-events-none animate-float-soft">🌸</div>
      <div className="absolute top-[15%] right-[8%] text-[32px] select-none pointer-events-none animate-float-rotate">💖</div>
      <div className="absolute bottom-[10%] left-[12%] text-[28px] select-none pointer-events-none animate-float-soft">✨</div>
      <div className="absolute bottom-[15%] right-[5%] text-[20px] select-none pointer-events-none animate-float-rotate">🌷</div>

      {/* Falling Sakura Petals */}
      {petals.map((petal) => (
        <span
          key={`sakura-${petal.id}`}
          className="absolute bg-pink-pastel border border-pink-100 rounded-tr-[50%] rounded-bl-[50%] rounded-br-[15%]"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            top: '-20px',
            opacity: 0.7,
            animationName: 'floatBubble',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            transform: `rotate(${petal.rotate})`,
          }}
        />
      ))}

      {/* Floating Sparkly Hearts */}
      {hearts.map((heart) => (
        <svg
          key={`heart-${heart.id}`}
          className="absolute text-pink-deep/40 fill-pink-soft/20 animate-float-bubble"
          viewBox="0 0 24 24"
          style={{
            left: heart.left,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            top: '110%',
            opacity: 0.6,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            '--duration': heart.duration,
          } as CSSProperties}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}

      {/* Handdrawn Sparkles Blinking */}
      <div className="absolute top-[25%] left-[15%] text-pink-deep/50 animate-ping [animation-duration:2s]">✨</div>
      <div className="absolute top-[40%] right-[20%] text-pink-deep/40 animate-ping [animation-duration:3s]">✨</div>
      <div className="absolute top-[75%] left-[25%] text-pink-deep/30 animate-pulse [animation-duration:2.5s]">✨</div>
      <div className="absolute bottom-[20%] right-[10%] text-pink-deep/40 animate-pulse [animation-duration:4s]">✨</div>
    </div>
  );
}
