/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MemoryPhoto, Song, AnimalQuestion } from './types';

// Curated high quality Unsplash images as fallbacks for her beautiful pictures!
export const AESTHETIC_FALLBACKS = [
  'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop', // cute cafe pink
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop', // cherry blossom
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop', // flower heart
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop', // cat pink ears
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop', // pink roses bouquet
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', // polaroid desk aesthetics
  'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?q=80&w=600&auto=format&fit=crop', // warm lighting tea cups
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop', // pink sky dream
  'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=600&auto=format&fit=crop', // cute workspace
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop', // cute dog puppy
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop', // cozy pink blanket
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop', // corgi dog
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=600&auto=format&fit=crop', // cartoon vector avatar cute smile
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop', // floral painting
];

// Initial scrapbook memories
// Points to high-quality beautiful aesthetic sweet Unsplash images directly for immediate, glorious load times
export const DEFAULT_MEMORIES: MemoryPhoto[] = [
  {
    id: 'mem-1',
    url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop',
    caption: 'pretty cafe vibes 🌸',
    date: 'lovely moment',
    sticker: 'flower',
    angle: -4,
  },
  {
    id: 'mem-2',
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop',
    caption: 'cherry blossoms in spring 💖',
    date: 'very stylish',
    sticker: 'star',
    angle: 5,
  },
  {
    id: 'mem-3',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
    caption: 'warm pastel hearts ✨',
    date: 'cutest collage',
    sticker: 'heart',
    angle: -3,
  },
  {
    id: 'mem-4',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop',
    caption: 'absolutely adorable kitty 😭',
    date: 'so photogenic',
    sticker: 'sparkle',
    angle: 6,
  },
  {
    id: 'mem-5',
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop',
    caption: 'softest pink bouquet 🌸',
    date: 'pure sunshine',
    sticker: 'flower',
    angle: -2,
  },
  {
    id: 'mem-6',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    caption: 'cozy journal moments ✨',
    date: 'gorgeous look',
    sticker: 'heart',
    angle: 4,
  },
  {
    id: 'mem-7',
    url: 'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?q=80&w=600&auto=format&fit=crop',
    caption: 'warm starry lights 💖',
    date: 'cherished photo',
    sticker: 'sparkle',
    angle: -5,
  },
  {
    id: 'mem-8',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop',
    caption: 'dreamy cotton skies 😭',
    date: 'peaceful smile',
    sticker: 'star',
    angle: 3,
  },
  {
    id: 'mem-9',
    url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=600&auto=format&fit=crop',
    caption: 'sweet aesthetic study desk 🌸',
    date: 'so delicate',
    sticker: 'flower',
    angle: -6,
  },
  {
    id: 'mem-10',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
    caption: 'sleeping cute puppy ✨',
    date: 'radiant energy',
    sticker: 'heart',
    angle: 5,
  },
  {
    id: 'mem-11',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
    caption: 'fluffy happy corgi puppy 🌸',
    date: 'pretty shades',
    sticker: 'sparkle',
    angle: -2,
  },
  {
    id: 'mem-12',
    url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=600&auto=format&fit=crop',
    caption: 'kawaii chibi smiley 💖',
    date: 'lovely glasses',
    sticker: 'star',
    angle: 4,
  },
  {
    id: 'mem-13',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
    caption: 'floral painting art ✨',
    date: 'gentle grace',
    sticker: 'flower',
    angle: -3,
  },
  {
    id: 'mem-14',
    url: 'https://images.unsplash.com/photo-1550156005-ab7c7d4b227c?q=80&w=600&auto=format&fit=crop',
    caption: 'spring pink tulips 😭',
    date: 'melts major hearts',
    sticker: 'heart',
    angle: 6,
  },
];

// Curated happy & relaxing lofi files
export const DEFAULT_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    url: 'https://archive.org/download/stephen-sanchez-until-i-found-you_202302/Stephen%20Sanchez%20-%20Until%20I%20Found%20You.mp3',
  },
  {
    id: 'song-2',
    title: 'Glue Song',
    artist: 'beabadoobee',
    url: 'https://archive.org/download/beabadoobee-glue-song/beabadoobee%20-%20Glue%20Song.mp3',
  },
  {
    id: 'song-3',
    title: 'Best Part (feat. H.E.R.)',
    artist: 'Daniel Caesar',
    url: 'https://archive.org/download/daniel-caesar-best-part-feat.-h.e.r./Daniel%20Caesar%20-%20Best%20Part%20%28feat.%20H.E.R.%29.mp3',
  },
  {
    id: 'song-4',
    title: 'Lover',
    artist: 'Taylor Swift',
    url: 'https://archive.org/download/lovertaylorswift/Taylor%20Swift%20-%20Lover.mp3',
  },
  {
    id: 'song-5',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    url: 'https://archive.org/download/ed-sheeran-perfect_202111/Ed%20Sheeran%20-%20Perfect.mp3',
  },
  {
    id: 'song-6',
    title: 'Here With Me',
    artist: 'd4vd',
    url: 'https://archive.org/download/d4vd-here-with-me/d4vd%20-%20Here%20With%20Me.mp3',
  },
  {
    id: 'song-7',
    title: 'Double Take',
    artist: 'dhruv',
    url: 'https://archive.org/download/dhruv-double-take/dhruv%20-%20double%20take.mp3',
  },
];

// Interactive message lists for the letters (Translated to clean, heart-warming English)
export const SWEET_MESSAGES = [
  "Hi Ikaa! I made this super cute web journal specially for you 🌸 You are such an incredibly kind person with the most beautiful smile (truly, it makes my days feel so much warmer!) and you bring so much happiness wherever you go. 💖",
  "Thank you for always being such an amazing, sweet, and patient person. Please always remember to prioritize your health, eat on time, and keep your authentic sweet smile! You are incredibly precious! ✨",
  "One more thing: please don't stay up late so you don't get sick again! I want you to be healthy, happy, and full of energy every single day. So make sure to get some sweet dreams early! Sleep well! 😴💖",
  "May your days always be filled with joy, cute giggles, positive energy, and sweet dreams that come true. Remember, in this little pink world of ours, you are the most precious princess! 👑🌸"
];

// Guess the Animal Game Questions (10 Highly Curated Chibi Chataracter-based Animal Questions)
export const ANIMAL_QUESTIONS: AnimalQuestion[] = [
  {
    id: 'q-1',
    image: 'https://images.unsplash.com/photo-1574158622643-69d34d72650a?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'cat',
    options: ['dog', 'cat', 'rabbit', 'panda'],
    hint: 'Suka bilang "Meow" dan punya telinga berbulu yang super sensitif 🐱',
  },
  {
    id: 'q-2',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'rabbit',
    options: ['cat', 'panda', 'rabbit', 'duck'],
    hint: 'Wortel kesukaannya, jalannya melompat, dan punya telinga pemalu panjang tegak! 🐰',
  },
  {
    id: 'q-3',
    image: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'bear',
    options: ['koala', 'fox', 'panda', 'bear'],
    hint: 'Berbulu tebal, badannya besar suka madu manis, jalan kokoh memberi pelukan hangat! 🐻',
  },
  {
    id: 'q-4',
    image: 'https://images.unsplash.com/photo-1504208434309-cb69f4851419?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'fox',
    options: ['dog', 'fox', 'cat', 'bear'],
    hint: 'Punya ekor tebal berbulu lebat, cerdik, jahil, suka berpetualang manis! 🦊',
  },
  {
    id: 'q-5',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'panda',
    options: ['hamster', 'panda', 'sheep', 'otter'],
    hint: 'Suka ngunyah bambu, badannya gembul ngantukan suka memeluk bantal empuk! 🐼',
  },
  {
    id: 'q-6',
    image: 'https://images.unsplash.com/photo-1550156005-ab7c7d4b227c?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'duck',
    options: ['chicken', 'penguin', 'swan', 'duck'],
    hint: 'Burung air menggemaskan yang suka berenang dan jalan-jalan memakai topi matahari ceria! 🦆',
  },
  {
    id: 'q-7',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'hamster',
    options: ['rabbit', 'squirrel', 'hamster', 'mouse'],
    hint: 'Badannya bulat lucu suka ngemil biskuit/biji dan pipinya gembung menggemaskan! 🐹',
  },
  {
    id: 'q-8',
    image: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'penguin',
    options: ['seal', 'penguin', 'polar bear', 'duck'],
    hint: 'Burung lucu yang hidup di salju dingin, suka es krim, dan berjalan berlenggok-lenggok! 🐧',
  },
  {
    id: 'q-9',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'otter',
    options: ['beaver', 'seal', 'otter', 'platypus'],
    hint: 'Suka berenang santai di sungai, ramah, dan memegang cangkir kopi kesukaannya! 🦦',
  },
  {
    id: 'q-10',
    image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=400&auto=format&fit=crop',
    correctAnswer: 'monkey',
    options: ['chimpanzee', 'gorilla', 'monkey', 'panda'],
    hint: 'Hewan lincah yang suka bergelantungan di dahan pohon, suka makan pisang, dan sangat cerdas! 🐒',
  },
];
