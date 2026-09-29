// Game state: storage, slow stat decay, daily limits, levels.

const KEY = 'lucky-tamagotchi-v1';
const SNAP = 'lucky-turbo-snapshot-v1';
let wiped = false; // after a reset nothing is saved any more (otherwise pagehide would write the old state back)
const H = 3600e3;
export const FLOOR = 15;
export const MAX = 100;

// Stat change per hour
// Tuned with a daily simulation: with caring play Lucky is sad ~10% of the time (mostly before feeding),
// happy ~70%, thrilled ~18%. With careless play he is sad more often, but gently.
const RATES = {
  awake: { hunger: -6, fun: -5, clean: -3.5, energy: -3.5 },
  sleep: { hunger: -2, fun: -1.2, clean: -0.8, energy: 15 },
};

// Mood tier: low (sad/sulky), ok, happy, max (thrilled)
export function moodTier(p) {
  const min = Math.min(p.hunger, p.fun, p.clean, p.energy);
  const care = Math.min(p.hunger, p.fun, p.clean);
  const avg = (p.hunger + p.fun + p.clean + p.energy) / 4;
  if (min < 30) return 'low';
  if (care >= 78 && p.energy >= 45 && avg >= 80) return 'max';
  if (avg >= 62) return 'happy';
  return 'ok';
}

// The most unmet need
export function lowestNeed(p) {
  return ['hunger', 'clean', 'energy', 'fun'].reduce((a, b) => (p[b] < p[a] ? b : a));
}

function fresh() {
  const now = Date.now();
  return {
    v: 2,
    createdAt: now,
    onboarded: false,
    lang: 'ru',
    pet: { hunger: 80, fun: 80, clean: 85, energy: 90, at: now },
    hearts: 0,
    level: 1,
    belt: 0,
    beltSteps: 0,
    outfit: null,
    wear: {},
    owned: [],
    stats: {},
    badges: [],
    albumsDone: [],
    worldsSeen: ['garden'],
    decorOff: [],
    layout: null,
    layoutV: 2, // decoration coordinates are in % of the background picture
    bg: 'garden',
    stickers: [],
    days: [],
    today: null,
    // Tali's visits: day and n count visits per day, lastAt is when the last one ended, giftDay is the day of his present
    dog: { name: '', met: false, forceUntil: 0, stayUntil: 0, played: false, jokes: 0, twisters: 0, day: '', n: 0, lastAt: 0, giftDay: '' },
    // Tali's jokes: heard (for the joke book) and recent (not repeated soon)
    jokes: { heard: [], recent: [] },
    // fun English: sayings Lucky acted out (at: when each was last shown) and tongue twisters
    idioms: { heard: [], at: {} },
    twisters: { heard: [], recent: [] },
    // ninja missions: stars per skill, the scroll of stamps, today's mask and animal cloud
    ninja: { skills: {}, scroll: [], mask: null, cloud: null },
    session: { activeMs: 0, lastAt: 0, activeAt: 0, napUntil: 0, warned: false },
    settings: { sessionMin: 15, napMin: 60, bedtime: '22:00', wake: '07:00', sound: true, realPet: true, translate: true, gamesPerDay: 3, dailyMax: 60, voice: true, voiceUri: { ru: '', en: '' } },
    playedMs: {},
    viewMs: {},
    lastGameAt: 0,
  };
}

function merge(base, s) {
  for (const k in s) {
    const b = base[k], v = s[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && b && typeof b === 'object' && !Array.isArray(b)) merge(b, v);
    else base[k] = v;
  }
  return base;
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      saved.v ??= 1;
      const S = merge(fresh(), saved);
      // decorations were placed in % of the visible scene before 1.6.1 (main.js migrateLayout converts them)
      if (!saved.layoutV) S.layoutV = 1;
      // v2: default bedtime moved from 21:00 to 22:00
      if (S.v < 2) { if (S.settings.bedtime === '21:00') S.settings.bedtime = '22:00'; S.v = 2; }
      return S;
    }
  } catch { /* corrupted data: start over */ }
  return fresh();
}

export function save(S) {
  if (wiped) return;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* private mode */ }
}

export function wipe() {
  wiped = true;
  try { localStorage.removeItem(KEY); localStorage.removeItem(SNAP); } catch { /* ignore */ }
}

// The parent's own password, set in the parents' area: its hash only, on this device only (kept by Start over).
// Without it the default password from config.js works.
const PARENT = 'lucky-parent-v2';
// The old per-device password (v1) was created by whoever opened the parents' area first, which could be the child.
// It is dropped, so the default and recovery passwords work again.
try { localStorage.removeItem('lucky-parent-v1'); } catch { /* ignore */ }
export function parentHash() {
  try { return JSON.parse(localStorage.getItem(PARENT))?.hash ?? null; } catch { return null; }
}
export function setParentHash(h) { try { localStorage.setItem(PARENT, JSON.stringify({ hash: h })); } catch { /* ignore */ } }

// Turbo mode: save progress before switching on, restore it when switching off
export function snapshot(S) {
  try { localStorage.setItem(SNAP, JSON.stringify({ ...S, turbo: false })); } catch { /* ignore */ }
}

export function restoreSnapshot() {
  try {
    const raw = localStorage.getItem(SNAP);
    if (!raw) return false;
    localStorage.setItem(KEY, raw);
    localStorage.removeItem(SNAP);
    wiped = true; // stop saving the current (turbo) state
    return true;
  } catch { return false; }
}

export const clamp = (v) => Math.max(FLOOR, Math.min(MAX, v));

export function dayKey(t = Date.now()) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const minOfDay = (t) => { const d = new Date(t); return d.getHours() * 60 + d.getMinutes(); };

export function isNight(t, st) {
  const m = minOfDay(t), b = toMin(st.bedtime), w = toMin(st.wake);
  return b > w ? (m >= b || m < w) : (m >= b && m < w);
}

export function minutesToBed(t, st) {
  let d = toMin(st.bedtime) - minOfDay(t);
  if (d < 0) d += 1440;
  return d;
}

export function nextWake(t, st) {
  const w = toMin(st.wake);
  const r = new Date(t);
  r.setHours(Math.floor(w / 60), w % 60, 0, 0);
  if (r.getTime() <= t) r.setDate(r.getDate() + 1);
  return r.getTime();
}

// A parent can cancel the night until the morning with Wake Lucky (wakeUntil)
export const isAsleep = (S, now) => (isNight(now, S.settings) && now >= (S.session.wakeUntil || 0)) || now < S.session.napUntil;

export function applyDecay(S, now) {
  let t = S.pet.at || now;
  if (now - t > 72 * H) t = now - 72 * H;
  while (t < now) {
    const step = Math.min(10 * 60e3, now - t);
    const r = (isNight(t, S.settings) || t < S.session.napUntil) ? RATES.sleep : RATES.awake;
    for (const k in r) S.pet[k] = clamp(S.pet[k] + r[k] * step / H);
    t += step;
  }
  S.pet.at = now;
}

export function boost(S, stat, n) {
  S.pet[stat] = clamp(S.pet[stat] + n);
}

const blankDay = (k) => ({ date: k, treats: 0, games: 0, hearts: {}, missionSwap: 0, missionDone: false, careDone: false, quiz: 0,
  surprise: false, mood: null, phraseSeen: false, planDone: false, maxSaid: false, asks: 0, frog: false });

export function today(S, now = Date.now()) {
  const k = dayKey(now);
  if (S.today && S.today.date === k && !S.today.filled) S.today = { ...blankDay(k), ...S.today, filled: true }; // old saves
  if (!S.today || S.today.date !== k) {
    S.today = { ...blankDay(k), filled: true };
    if (!S.days.includes(k)) S.days.push(k);
    // keep time stats for 2 weeks only
    const keys = Object.keys(S.playedMs).sort();
    while (keys.length > 14) delete S.playedMs[keys.shift()];
    const vk = Object.keys(S.viewMs).sort();
    while (vk.length > 14) delete S.viewMs[vk.shift()];
  }
  return S.today;
}

export const levelNeed = (l) => 25 + l * 10;

// Grants hearts with a daily cap per category. Returns the new levels.
export function addHearts(S, n, cat, cap) {
  const T = today(S);
  const got = T.hearts[cat] || 0;
  const give = Math.max(0, Math.min(n, cap - got));
  T.hearts[cat] = got + give;
  S.hearts += give;
  const ups = [];
  while (S.hearts >= levelNeed(S.level)) { S.hearts -= levelNeed(S.level); S.level++; ups.push(S.level); }
  return { give, ups };
}


export const missionIndex = (S, len) => (hash(S.today.date + 'm') + S.today.missionSwap) % len;
export const careIndex = (S, len) => hash(S.today.date + 'c') % len;
export const phraseIndex = (S, len) => hash(S.today.date + 'w') % len;
