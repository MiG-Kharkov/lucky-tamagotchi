// Звуки (WebAudio), готовые записи голосов (Google Chirp 3 HD) и запасной встроенный голос.

import { clipId, VOICES } from './voicekey.js';

let ctx = null;
let enabled = true;
let voiceOn = true;
let speechUnlocked = false;

export function setSound(on) { enabled = on; }
export function setVoice(on) { voiceOn = on; if (!on) stopSpeech(); }
export function stopSpeech() {
  speechSeq++;
  stopClip();
  try { speechSynthesis.cancel(); } catch { /* ignore */ }
}

function audioCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Голос слышен и в беззвучном режиме iPhone (Safari 16.4+)
      if (navigator.audioSession) navigator.audioSession.type = 'playback';
    } catch { /* нет Web Audio */ }
  }
  return ctx;
}

// iOS разрешает звук только в жесте пользователя (touchend/click), а после звонка
// или Siri контекст бывает «interrupted» — поэтому возобновляем при каждом касании.
export function unlockAudio() {
  const c = audioCtx();
  if (c && c.state !== 'running') c.resume().catch(() => {});
  if (!speechUnlocked && 'speechSynthesis' in window) {
    try {
      const u = new SpeechSynthesisUtterance('.');
      u.volume = 0.01;
      u.onstart = () => { speechUnlocked = true; };
      speechSynthesis.speak(u);
    } catch { /* ignore */ }
  }
}

function tone(freq, dur, { type = 'sine', vol = 0.12, delay = 0, slide = 0 } = {}) {
  if (!enabled || !ctx || ctx.state !== 'running' || document.hidden) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  pop: () => tone(660, 0.12, { slide: 1.6 }),
  tap: () => tone(520, 0.08, { type: 'triangle', vol: 0.08 }),
  yum: () => { tone(300, 0.08, { type: 'square', vol: 0.05 }); tone(340, 0.08, { type: 'square', vol: 0.05, delay: 0.12 }); tone(300, 0.08, { type: 'square', vol: 0.05, delay: 0.24 }); },
  bubble: () => tone(800 + Math.random() * 500, 0.07, { slide: 1.5, vol: 0.05 }),
  happy: () => [523, 659, 784].forEach((f, i) => tone(f, 0.16, { delay: i * 0.09, type: 'triangle' })),
  sparkle: () => [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.12, { delay: i * 0.06, vol: 0.06 })),
  levelup: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.18, { delay: i * 0.11, type: 'triangle' })),
  bark: () => { tone(700, 0.09, { type: 'sawtooth', vol: 0.05, slide: 0.6 }); tone(760, 0.09, { type: 'sawtooth', vol: 0.05, slide: 0.6, delay: 0.16 }); },
  croak: () => { tone(160, 0.12, { type: 'square', vol: 0.05, slide: 1.4 }); tone(150, 0.14, { type: 'square', vol: 0.05, slide: 1.5, delay: 0.18 }); },
  catch: () => tone(880, 0.09, { slide: 1.3, vol: 0.07 }),
  note: (f) => tone(f, 0.32, { type: 'triangle', vol: 0.11 }),
  gong: () => { tone(147, 1.6, { vol: 0.14 }); tone(294, 1.2, { vol: 0.06, type: 'triangle' }); tone(441, 0.8, { vol: 0.03 }); },
  sneeze: () => { tone(900, 0.12, { slide: 1.4, vol: 0.06 }); tone(300, 0.25, { type: 'sawtooth', vol: 0.05, slide: 0.4, delay: 0.14 }); },
  hic: () => tone(700, 0.07, { type: 'square', vol: 0.05, slide: 1.8 }),
  whirr: () => [0, 0.1, 0.2, 0.3, 0.4, 0.5].forEach((d) => tone(180, 0.08, { type: 'sawtooth', vol: 0.03, delay: d })),
  rumble: () => { tone(90, 0.35, { type: 'sawtooth', vol: 0.05, slide: 0.8 }); tone(70, 0.3, { type: 'sawtooth', vol: 0.04, delay: 0.3 }); },
  baa: () => { tone(420, 0.25, { type: 'sawtooth', vol: 0.05 }); tone(400, 0.3, { type: 'sawtooth', vol: 0.05, delay: 0.26 }); },
  sleep: () => [392, 330, 262].forEach((f, i) => tone(f, 0.3, { delay: i * 0.25, vol: 0.07 })),
};

const stripEmoji = (s) => s.replace(/\p{Extended_Pictographic}|️|‍/gu, '').trim();

// ---------- запасной встроенный голос ----------

const VOICE_PREF = { en: ['en-IE', 'en-GB', 'en-US', 'en'], ru: ['ru-RU', 'ru'] };
const FALLBACK_LANG = { en: 'en-GB', ru: 'ru-RU' };
// «Шуточные» голоса iOS нам не подходят
const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley/i;
const langOf = (v) => v.lang.replace('_', '-');

function voiceFor(lang) {
  let list = [];
  try { list = speechSynthesis.getVoices().filter((v) => langOf(v).toLowerCase().startsWith(lang) && !NOVELTY.test(v.name)); } catch { /* ignore */ }
  for (const tag of VOICE_PREF[lang]) {
    const v = list.find((x) => langOf(x).startsWith(tag));
    if (v) return v;
  }
  return list[0] || null;
}

const SYS_VOICE = { lucky: [1.35, 0.92], dog: [1.8, 1.05], frog: [0.7, 0.95] };

function speakSystem(text, lang, who, seq) {
  if (!('speechSynthesis' in window)) return;
  try {
    const busy = speechSynthesis.speaking || speechSynthesis.pending;
    if (busy) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(stripEmoji(text));
    const v = voiceFor(lang);
    if (v) u.voice = v;
    u.lang = v ? langOf(v) : FALLBACK_LANG[lang];
    [u.pitch, u.rate] = SYS_VOICE[who] || SYS_VOICE.lucky;
    const go = () => { if (seq === speechSeq && !document.hidden) speechSynthesis.speak(u); };
    // iOS иногда теряет фразу, сказанную сразу после cancel()
    if (busy) setTimeout(go, 120); else go();
  } catch { /* озвучка недоступна */ }
}

// ---------- готовые записи ----------

let clips = null;          // Set id записей из audio/manifest.json
const manifest = fetch('audio/manifest.json').then((r) => (r.ok ? r.json() : [])).catch(() => [])
  .then((ids) => { clips = new Set(ids); });
const buffers = new Map(); // id → Promise<AudioBuffer>, не больше MAX_BUFFERS
const MAX_BUFFERS = 40;
let clipSrc = null;
let speechSeq = 0;         // номер последней реплики: устаревшие загрузки не проигрываем

function stopClip() {
  if (clipSrc) { try { clipSrc.stop(); } catch { /* уже остановлен */ } clipSrc = null; }
}

function loadClip(id) {
  if (buffers.has(id)) {
    const p = buffers.get(id);
    buffers.delete(id);
    buffers.set(id, p); // свежий — в конец очереди
    return p;
  }
  const p = fetch(`audio/${id}.mp3`)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
    .then((data) => new Promise((ok, err) => ctx.decodeAudioData(data, ok, err)));
  p.catch(() => buffers.delete(id));
  buffers.set(id, p);
  while (buffers.size > MAX_BUFFERS) buffers.delete(buffers.keys().next().value);
  return p;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function playClip(id, who, seq) {
  if (ctx.state !== 'running') {
    await Promise.race([ctx.resume().catch(() => {}), wait(300)]);
    if (ctx.state !== 'running') throw new Error('audio locked');
  }
  const buf = await loadClip(id);
  if (seq !== speechSeq || document.hidden) return;
  stopClip();
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = VOICES[who]?.rate || 1;
  src.connect(ctx.destination);
  src.start();
  clipSrc = src;
}

// Реплика: сначала готовая запись, иначе встроенный голос.
export async function speak(text, lang, who = 'lucky') {
  if (!voiceOn || document.hidden) return;
  const seq = ++speechSeq;
  stopClip();
  if (clips === null) await Promise.race([manifest, wait(1500)]);
  if (seq !== speechSeq) return;
  const c = audioCtx();
  if (c && clips?.has(clipId(who, lang, text))) {
    try { speechSynthesis.cancel(); } catch { /* ignore */ }
    try { await playClip(clipId(who, lang, text), who, seq); return; } catch (e) {
      // Звук ещё не разрешён (не было касания) — молчим, фраза повторится на первом касании
      if (e.message === 'audio locked') return;
    }
  }
  speakSystem(text, lang, who, seq);
}
