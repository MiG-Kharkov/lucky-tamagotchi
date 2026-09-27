// Состояние игры: хранение, медленное убывание показателей, дневные лимиты, уровни.

const KEY = 'lucky-tamagotchi-v1';
const SNAP = 'lucky-turbo-snapshot-v1';
let wiped = false; // после сброса больше ничего не сохраняем (иначе pagehide запишет старое)
const H = 3600e3;
export const FLOOR = 15;
export const MAX = 100;

// Изменение показателей в час
// Подобрано симуляцией дня: у заботливой игры Лаки грустит ~10% времени (в основном до кормления),
// счастлив ~70%, в восторге ~18%. У небрежной — чаще грустит, но мягко.
const RATES = {
  awake: { hunger: -6, fun: -5, clean: -3.5, energy: -3.5 },
  sleep: { hunger: -2, fun: -1.2, clean: -0.8, energy: 15 },
};

// Состояние настроения: low (грустит/капризничает), ok, happy, max (восторг)
export function moodTier(p) {
  const min = Math.min(p.hunger, p.fun, p.clean, p.energy);
  const care = Math.min(p.hunger, p.fun, p.clean);
  const avg = (p.hunger + p.fun + p.clean + p.energy) / 4;
  if (min < 30) return 'low';
  if (care >= 78 && p.energy >= 45 && avg >= 80) return 'max';
  if (avg >= 62) return 'happy';
  return 'ok';
}

// Чего не хватает больше всего
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
    bg: 'garden',
    stickers: [],
    days: [],
    today: null,
    dog: { name: '', met: false, forceUntil: 0, visitKey: '', doneKey: '', stayUntil: 0, gift: false, played: false },
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
      // v2: отбой по умолчанию перенесён с 21:00 на 22:00
      if (S.v < 2) { if (S.settings.bedtime === '21:00') S.settings.bedtime = '22:00'; S.v = 2; }
      return S;
    }
  } catch { /* повреждённые данные — начинаем заново */ }
  return fresh();
}

export function save(S) {
  if (wiped) return;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* приватный режим */ }
}

export function wipe() {
  wiped = true;
  try { localStorage.removeItem(KEY); localStorage.removeItem(SNAP); } catch { /* ignore */ }
}

// Пароль родителя: только хеш и только на этом устройстве (не стирается при «Начать заново»)
const PARENT = 'lucky-parent-v1';
// { hash — пароль, rec — код восстановления } — только хеши, только на этом устройстве
export function parentData() {
  try {
    const raw = localStorage.getItem(PARENT);
    if (!raw) return {};
    const d = JSON.parse(raw);
    return typeof d === 'number' ? { hash: d } : d;
  } catch { return {}; }
}
export function setParentData(d) { try { localStorage.setItem(PARENT, JSON.stringify(d)); } catch { /* ignore */ } }

// Турбо-режим: перед включением запоминаем прогресс, при выключении возвращаем его
export function snapshot(S) {
  try { localStorage.setItem(SNAP, JSON.stringify({ ...S, turbo: false })); } catch { /* ignore */ }
}

export function restoreSnapshot() {
  try {
    const raw = localStorage.getItem(SNAP);
    if (!raw) return false;
    localStorage.setItem(KEY, raw);
    localStorage.removeItem(SNAP);
    wiped = true; // текущее (турбо) состояние больше не сохраняем
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

export const isAsleep = (S, now) => isNight(now, S.settings) || now < S.session.napUntil;

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
  if (S.today && S.today.date === k && !S.today.filled) S.today = { ...blankDay(k), ...S.today, filled: true }; // старые сохранения
  if (!S.today || S.today.date !== k) {
    S.today = { ...blankDay(k), filled: true };
    if (!S.days.includes(k)) S.days.push(k);
    // храним статистику времени только за 2 недели
    const keys = Object.keys(S.playedMs).sort();
    while (keys.length > 14) delete S.playedMs[keys.shift()];
    const vk = Object.keys(S.viewMs).sort();
    while (vk.length > 14) delete S.viewMs[vk.shift()];
  }
  return S.today;
}

export const levelNeed = (l) => 25 + l * 10;

// Выдаёт сердечки с дневным лимитом на категорию. Возвращает новые уровни.
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

// Окно визита собачки: примерно 2 дня из 3, 3 часа в случайное время 10:00–18:00, начиная со 2-го дня.
export function dogVisitKey(S, now) {
  if (now < S.dog.forceUntil) return 'force-' + S.dog.forceUntil;
  if (S.days.length < 2 || isNight(now, S.settings)) return null;
  const k = dayKey(now);
  const h = hash(k + 'tali');
  if (h % 100 >= 65) return null;
  const start = new Date(now);
  start.setHours(10 + ((h >>> 8) % 8), (h >>> 16) % 60, 0, 0);
  const s = start.getTime();
  return now >= s && now < s + 3 * H ? k : null;
}

export const missionIndex = (S, len) => (hash(S.today.date + 'm') + S.today.missionSwap) % len;
export const careIndex = (S, len) => hash(S.today.date + 'c') % len;
export const phraseIndex = (S, len) => hash(S.today.date + 'w') % len;
