// The holiday games: three for each holiday, in place of the usual games while it is on (main.js openPlay).
// Each is a kind of game from arcade.js (or the memory and copy-me games of game.js) with the holiday's pictures,
// sounds and twists. target: the points for three stars at each difficulty (two stars from 55%), set from a bot that
// plays like a quick child: about half of what the bot scores.

import { shooter, catcher, whacker, fireworks, runner } from './arcade.js';

// w: how often it comes; pts: points; hp: hits it takes; move: fall, drift, zigzag (shooter), drop (a hazard on a thread)
const POWERS = (rapid, triple, shield, magnet) => [{ e: rapid, kind: 'rapid' }, { e: triple, kind: 'triple' }, { e: shield, kind: 'shield' }, { e: magnet, kind: 'magnet' }];
const CATCH_POWERS = [{ e: '🧲', kind: 'magnet' }, { e: '✨', kind: 'double' }, { e: '🐢', kind: 'slow' }, { e: '🌟', kind: 'big' }];

export const HOLIDAY_GAMES = {
  halloween: [
    { id: 'hw_zapper', emoji: '👻', kind: shooter, energy: 14, target: { easy: 1800, normal: 2800, hard: 4000 }, theme: {
      bg: ['#1E1233', '#4A2B80', '#B5568C', '#FF9A4D'], moon: true, stars: 30, far: { e: ['🦇'], n: 5, alpha: 0.3 }, ground: '#2E1F4A',
      shot: '⭐', hit: ['✨', '⭐', '💜'], killSfx: 'boing',
      targets: [{ e: '👻', pts: 10, move: 'drift', v: 62, w: 5 }, { e: '🦇', pts: 15, move: 'zigzag', v: 80, w: 3, size: 40 }, { e: '🎃', pts: 25, hp: 3, move: 'fall', v: 46, w: 1.4, size: 50 }],
      drop: { e: ['🍬', '🍭', '🍫'], pts: 5, chance: 0.55 },
      hazards: [{ e: '🕷️', move: 'drop', v: 210, size: 34 }],
      friend: { e: '🐈‍⬛' },
      powers: POWERS('🧹', '🔮', '🛡️', '🧲'),
      boss: { e: '🎃', crown: '👑', hp: 30, pts: 250, burst: ['🍬', '🍭', '✨', '💥'] }, bossName: 'bossPumpkin',
    } },
    { id: 'hw_patch', emoji: '🎃', kind: whacker, energy: 10, target: { easy: 2800, normal: 4500, hard: 6800 }, theme: {
      bg: ['#2A1A47', '#5B3592', '#FF9A4D'], stars: 24, far: { e: ['🦇', '⭐'], n: 6, alpha: 0.3 },
      spot: '🎃', good: [{ e: '👻', pts: 10, w: 5 }, { e: '🦇', pts: 15, w: 3 }], gold: { e: '🍬', pts: 30 }, bad: [{ e: '🐈‍⬛' }], hit: ['✨', '💜', '⭐'], hitSfx: 'boing',
    } },
    { id: 'hw_memory', emoji: '🕸️', kind: 'memory', energy: 6, target: { easy: 550, normal: 800, hard: 1100 }, theme: {
      faces: ['👻', '🎃', '🦇', '🕷️', '🍬', '🧙', '🌙', '🕸️', '🧹', '🍭'], back: '🦇',
    } },
  ],
  christmas: [
    { id: 'xm_storm', emoji: '❄️', kind: shooter, energy: 14, target: { easy: 1800, normal: 2800, hard: 4000 }, theme: {
      bg: ['#0F2A4A', '#2B5A8C', '#9CC8EE', '#EAF6FF'], stars: 18, far: { e: ['❄️'], n: 9, alpha: 0.5 }, ground: '#F4FAFF',
      shot: '⭐', hit: ['❄️', '✨'], killSfx: 'pop',
      targets: [{ e: '☁️', pts: 10, hp: 2, move: 'drift', v: 55, w: 4, size: 50, drops: 0.8 }, { e: '❄️', pts: 8, move: 'zigzag', v: 85, w: 3, size: 34 }, { e: '🌨️', pts: 25, hp: 3, move: 'fall', v: 44, w: 1.4, size: 52, drops: 1 }],
      drop: { e: ['🎁', '🍪', '🎁'], pts: 6, chance: 0.4 },
      hazards: [{ e: '🧊', move: 'drop', v: 220, size: 32 }],
      friend: { e: '🦌' },
      powers: POWERS('🔔', '⭐', '🍪', '🧲'),
      boss: { e: '⛈️', hp: 30, pts: 250, burst: ['🎁', '❄️', '✨'] }, bossName: 'bossCloud',
    } },
    { id: 'xm_sleigh', emoji: '🎁', kind: catcher, energy: 12, target: { easy: 1500, normal: 2300, hard: 3400 }, theme: {
      bg: ['#102846', '#2E5E96', '#BFE0FF'], stars: 18, far: { e: ['❄️', '⭐'], n: 10, alpha: 0.45 }, ground: '#F4FAFF',
      dropper: '🛷', dropperFlip: true, basket: '🧺', rushText: 'rushPresents',
      good: [{ e: '🎁', pts: 5, w: 5 }, { e: '🍪', pts: 5, w: 3 }, { e: '🧸', pts: 10, w: 1.5 }, { e: '⭐', pts: 20, w: 0.6 }],
      bad: [{ e: '⚫', size: 30 }], powers: CATCH_POWERS, hit: ['✨', '❄️'],
    } },
    { id: 'xm_bells', emoji: '🔔', kind: 'simon', energy: 6, target: { easy: 360, normal: 550, hard: 800 }, theme: {
      // the pads play C, D, E and G; Lucky's tunes follow "Jingle Bells"
      pads: [{ e: '🔔', c: '#FFD23F', f: 523 }, { e: '🎁', c: '#E2313B', f: 587 }, { e: '⭐', c: '#4D9BFF', f: 659 }, { e: '🎄', c: '#2E9E4E', f: 784 }],
      melody: [2, 2, 2, 2, 2, 2, 2, 3, 0, 1, 2, 2, 1, 1, 2, 1, 3, 2, 2, 2, 2, 2, 2, 2, 3, 0, 1, 2],
    } },
  ],
  newyear: [
    { id: 'ny_fireworks', emoji: '🎆', kind: fireworks, energy: 12, target: { easy: 3500, normal: 5500, hard: 8000 }, theme: {
      bg: ['#070B26', '#1B1F5C', '#4A3290'], stars: 40, far: { e: ['✨', '⭐'], n: 12, alpha: 0.45 },
    } },
    { id: 'ny_balloons', emoji: '🎈', kind: shooter, energy: 14, target: { easy: 1800, normal: 2800, hard: 4000 }, theme: {
      bg: ['#1B1F5C', '#6B3FA0', '#FF7AB8', '#FFD9A8'], stars: 24, far: { e: ['✨', '🎊'], n: 8, alpha: 0.4 }, ground: '#3B2A6E',
      shot: '✨', hit: ['🎊', '✨', '🎉'], killSfx: 'pop',
      targets: [{ e: '🎈', pts: 10, move: 'drift', v: 58, w: 5 }, { e: '🎁', pts: 20, hp: 2, move: 'fall', v: 50, w: 2, drops: 0.9 }, { e: '⭐', pts: 15, move: 'zigzag', v: 85, w: 2.2, size: 36 }],
      drop: { e: ['🍬', '🍰', '🍭'], pts: 5, chance: 0.45 },
      hazards: [{ e: '❄️', move: 'drop', v: 200, size: 32 }],
      friend: { e: '🦉' },
      powers: POWERS('🎺', '🎉', '🎩', '🧲'),
      boss: { e: '🪅', hp: 28, pts: 250, burst: ['🍬', '🍭', '🎊', '✨'] }, bossName: 'bossPinata',
    } },
    { id: 'ny_memory', emoji: '🎉', kind: 'memory', energy: 6, target: { easy: 550, normal: 800, hard: 1100 }, theme: {
      faces: ['🎉', '🎈', '🎆', '✨', '🎁', '🕛', '🪅', '🎊', '🍰', '⭐'], back: '🎊',
    } },
  ],
  valentine: [
    { id: 'vl_cupid', emoji: '💘', kind: shooter, energy: 14, target: { easy: 1800, normal: 2800, hard: 4000 }, theme: {
      bg: ['#5A1F45', '#C2477E', '#FF9EC0', '#FFE3EC'], far: { e: ['💗', '✨'], n: 8, alpha: 0.35 }, ground: '#FFC2D6',
      shot: '💘', hit: ['💗', '💖', '✨'], killSfx: 'kiss',
      targets: [{ e: '💗', pts: 10, move: 'drift', v: 60, w: 5 }, { e: '💖', pts: 15, move: 'zigzag', v: 85, w: 3 }, { e: '💝', pts: 25, hp: 2, move: 'fall', v: 48, w: 1.5, size: 48, drops: 1 }],
      drop: { e: ['🍫', '🌹', '🍓'], pts: 5, chance: 0.5 },
      hazards: [{ e: '🌧️', move: 'drop', v: 190, size: 36 }],
      friend: { e: '🕊️' },
      powers: POWERS('🌹', '💐', '🧸', '🧲'),
      boss: { e: '💞', hp: 28, pts: 250, burst: ['💗', '💖', '💕', '✨'] }, bossName: 'bossHeart',
    } },
    { id: 'vl_letters', emoji: '💌', kind: catcher, energy: 12, target: { easy: 1500, normal: 2300, hard: 3400 }, theme: {
      bg: ['#FFD3E4', '#FFB3CC', '#FF8FB5'], far: { e: ['💗', '☁️'], n: 7, alpha: 0.35 },
      dropper: '👼', basket: '🧺', rushText: 'rushLetters',
      good: [{ e: '💌', pts: 5, w: 5 }, { e: '🍫', pts: 5, w: 3 }, { e: '🌹', pts: 10, w: 1.5 }, { e: '💎', pts: 20, w: 0.5 }],
      bad: [{ e: '💔', size: 34 }], powers: CATCH_POWERS, hit: ['💗', '✨'],
    } },
    { id: 'vl_memory', emoji: '💝', kind: 'memory', energy: 6, target: { easy: 550, normal: 800, hard: 1100 }, theme: {
      faces: ['💌', '💝', '💘', '🌹', '🧸', '🍫', '💐', '💞', '🦢', '🍓'], back: '💗',
    } },
  ],
  patrick: [
    { id: 'sp_run', emoji: '🌈', kind: runner, energy: 14, target: { easy: 1000, normal: 1600, hard: 2400 }, theme: {
      bg: ['#7FC8FF', '#BDE6FF', '#E6F8E8'], far: { e: ['☁️', '🌈'], n: 4, alpha: 0.6 }, ground: '#5CB85C', ground2: '#4CA64C', hills: ['#A8DCA0', '#86C77A'],
      obstacles: [{ e: '🪨', w: 3, size: 40 }, { e: '🍄', w: 2, size: 38 }, { e: '🪵', w: 1.5, size: 44 }, { e: '🐝', w: 1, size: 32, air: true }],
      items: [{ e: '🪙', pts: 5, w: 6 }, { e: '☘️', pts: 10, w: 2 }, { e: '🍀', pts: 20, w: 0.6 }],
      powers: [{ e: '🌈', power: 'star' }, { e: '🧲', power: 'magnet' }, { e: '🎈', power: 'fly' }], hit: ['✨', '🍀'],
    } },
    { id: 'sp_gold', emoji: '🪙', kind: shooter, energy: 14, target: { easy: 1800, normal: 2800, hard: 4000 }, theme: {
      bg: ['#4AA6E8', '#9AD8FF', '#D9F5DD', '#7CCB5C'], far: { e: ['☁️'], n: 4, alpha: 0.6 }, ground: '#4CA64C',
      shot: '✨', hit: ['🪙', '✨', '🍀'], killSfx: 'pop',
      targets: [{ e: '☁️', pts: 10, hp: 2, move: 'drift', v: 55, w: 4, size: 50, drops: 0.85 }, { e: '🍀', pts: 15, move: 'zigzag', v: 85, w: 2.5, size: 36 }, { e: '🎩', pts: 25, hp: 2, move: 'fall', v: 50, w: 1.4, drops: 1 }],
      drop: { e: ['🪙', '🪙', '🌟'], pts: 5, chance: 0.4 },
      hazards: [{ e: '🪨', move: 'drop', v: 210, size: 32 }],
      friend: { e: '🐑' },
      powers: POWERS('🎻', '🌈', '🍀', '🧲'),
      boss: { e: '💰', hp: 30, pts: 250, burst: ['🪙', '✨', '🍀'] }, bossName: 'bossPot',
    } },
    { id: 'sp_hats', emoji: '🎩', kind: whacker, energy: 10, target: { easy: 2800, normal: 4500, hard: 6800 }, theme: {
      bg: ['#9AD8FF', '#D9F5DD', '#7CCB5C'], far: { e: ['☁️', '🌈'], n: 3, alpha: 0.6 },
      spot: '☘️', good: [{ e: '🎩', pts: 10, w: 5 }, { e: '🌈', pts: 15, w: 2 }], gold: { e: '🪙', pts: 30 }, bad: [{ e: '🐑' }], hit: ['✨', '🍀', '🪙'],
    } },
  ],
  easter: [
    { id: 'ea_catch', emoji: '🥚', kind: catcher, energy: 12, target: { easy: 1500, normal: 2300, hard: 3400 }, theme: {
      bg: ['#BDE6FF', '#E3F4FF', '#FFF6D6'], far: { e: ['☁️', '🦋'], n: 6, alpha: 0.5 }, ground: '#9BDB82',
      dropper: '🐔', dropperFlip: true, basket: '🧺', rushText: 'rushEggs',
      good: [{ e: '🥚', pts: 5, w: 6 }, { e: '🐣', pts: 10, w: 2 }, { e: '🌷', pts: 5, w: 1.5 }, { e: '🌟', pts: 20, w: 0.5 }],
      bad: [{ e: '🪨', size: 30 }], powers: CATCH_POWERS, hit: ['✨', '🌸'],
    } },
    { id: 'ea_hop', emoji: '🐰', kind: runner, energy: 14, target: { easy: 1000, normal: 1600, hard: 2400 }, theme: {
      bg: ['#A8DCFF', '#DDF1FF', '#FFF6E0'], far: { e: ['☁️', '🦋'], n: 5, alpha: 0.55 }, ground: '#8CD67A', ground2: '#7CC56A', hills: ['#CDEFC0', '#A8DE98'], path: '#F2E2B8',
      obstacles: [{ e: '🪵', w: 2.5, size: 44 }, { e: '🪨', w: 2.5, size: 40 }, { e: '🦔', w: 1.5, size: 38 }, { e: '🐝', w: 1, size: 32, air: true }],
      items: [{ e: '🥚', pts: 5, w: 6 }, { e: '🐣', pts: 10, w: 2 }, { e: '🌟', pts: 20, w: 0.6 }],
      powers: [{ e: '🦋', power: 'fly' }, { e: '🧲', power: 'magnet' }, { e: '🌈', power: 'star' }], hit: ['✨', '🌸'],
    } },
    { id: 'ea_hunt', emoji: '🐣', kind: whacker, energy: 10, target: { easy: 2800, normal: 4500, hard: 6800 }, theme: {
      bg: ['#BDE6FF', '#E8F8E0', '#9BDB82'], far: { e: ['🦋', '☁️'], n: 4, alpha: 0.5 },
      spot: '🌿', good: [{ e: '🥚', pts: 10, w: 5 }, { e: '🐣', pts: 15, w: 2.5 }], gold: { e: '🌟', pts: 30 }, bad: [{ e: '🐝' }], hit: ['✨', '🌸'],
    } },
  ],
};
