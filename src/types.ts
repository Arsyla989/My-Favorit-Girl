/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
  sticker?: string; // 'star' | 'heart' | 'flower' | 'sparkle'
  angle?: number; // tilt angle for scrapbook view
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface AnimalQuestion {
  id: string;
  image: string; // illustration or photo representation
  correctAnswer: string; // e.g., 'cat'
  options: string[]; // pool of options
  hint: string;
}

export interface HeartItem {
  id: string;
  x: number; // horizontal speed percentage (0-100)
  size: number; // diameter in px
  speed: number; // travel speed px/frame
  type: 'heart' | 'star' | 'bonus' | 'broken'; // different scores
  color: string;
}
