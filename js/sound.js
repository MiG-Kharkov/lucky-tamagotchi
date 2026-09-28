// Sound effects (Web Audio), pre-recorded voice clips (Google Chirp 3 HD) and the built-in fallback voice.

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

// Keep the voice audible in iPhone silent mode: ask iOS for the 'playback' session as early as possible
try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* ignore */ }

function audioCtx() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* no Web Audio */ }
  }
  return ctx;
}

// Throw the context away: the next tap creates a fresh one inside the gesture
function dropContext() {
  if (!ctx) return;
  const old = ctx;
  ctx = null;
  noiseBuf = null;
  clipSrc = null;
  buffers.clear();
  try { old.close().catch(() => {}); } catch { /* old Safari */ }
}

// Fallback for older iOS: a silent track in a regular <audio> element switches the page
// to the 'playback' session, so Web Audio no longer depends on the silent switch.
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let silentEl = null;
function silentTrack() {
  if (silentEl) return silentEl;
  const rate = 8000, n = rate / 2; // half a second of silence, 8 kHz WAV
  const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o, str) => [...str].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  silentEl = document.createElement('audio');
  silentEl.src = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  silentEl.loop = true;
  silentEl.setAttribute('playsinline', '');
  silentEl.setAttribute('x-webkit-airplay', 'deny');
  return silentEl;
}
// iOS: after the app has been in the background, Web Audio often stays 'interrupted', or says 'running'
// and plays nothing, and resume() doesn't bring it back. So on return we start a fresh context.
let wasHidden = false;
function goneAway() {
  wasHidden = true;
  stopSpeech();
  music.stop();
  if (silentEl) silentEl.pause();
}
function cameBack() {
  if (!wasHidden) return;
  wasHidden = false;
  dropContext();
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* ignore */ }
  try { speechSynthesis.cancel(); } catch { /* ignore */ }
}
document.addEventListener('visibilitychange', () => (document.hidden ? goneAway() : cameBack()));
window.addEventListener('pagehide', goneAway);
window.addEventListener('pageshow', cameBack);

// iOS allows audio only inside a user gesture (touchend/click), and after a call
// or Siri the context can be 'interrupted', so resume it on every tap.
let resumeAt = 0;
export function unlockAudio() {
  let c = audioCtx();
  if (c && c.state !== 'running') {
    const now = Date.now();
    // resume() from an earlier tap didn't help: the context is stuck, start a fresh one
    if (resumeAt && now - resumeAt > 1000) { dropContext(); c = audioCtx(); }
    resumeAt = now;
    c?.resume().then(() => { resumeAt = 0; replayMissed(); }, () => {});
  }
  if (IOS && !navigator.audioSession) { const el = silentTrack(); if (el.paused) el.play().catch(() => {}); }
  if (!speechUnlocked && 'speechSynthesis' in window) {
    try {
      const u = new SpeechSynthesisUtterance('.');
      u.volume = 0.01;
      u.onstart = () => { speechUnlocked = true; };
      speechSynthesis.speak(u);
    } catch { /* ignore */ }
  }
}

// Sounds may be scheduled right after resume() in the same tap: they start as soon as the context runs
const ready = () => enabled && ctx && !document.hidden && (ctx.state === 'running' || (resumeAt && Date.now() - resumeAt < 1000));

function tone(freq, dur, { type = 'sine', vol = 0.12, delay = 0, slide = 0 } = {}) {
  if (!ready()) return;
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

// White noise through a filter: rain, splashes, whooshes, sniffs
let noiseBuf = null;
function noise(dur, { vol = 0.08, delay = 0, type = 'bandpass', freq = 1200, q = 1, to = 0 } = {}) {
  if (!ready()) return;
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime + delay;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.03, dur / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
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
  // scene antics
  rain: () => { for (let i = 0; i < 14; i++) noise(0.05, { vol: 0.05, delay: i * 0.09 + Math.random() * 0.05, freq: 2500 + Math.random() * 2500, q: 3 }); },
  splash: () => { noise(0.45, { vol: 0.12, freq: 1800, to: 500, q: 0.8 }); tone(300, 0.2, { vol: 0.04, slide: 0.5, delay: 0.03 }); },
  shake: () => { for (let i = 0; i < 7; i++) noise(0.06, { vol: 0.07, delay: i * 0.08, freq: 3000, q: 1.5 }); },
  whoosh: () => noise(0.4, { vol: 0.09, freq: 400, to: 2400, q: 2 }),
  sniff: () => [0, 0.16, 0.32].forEach((d) => noise(0.09, { vol: 0.06, delay: d, type: 'highpass', freq: 2500 })),
  bonk: () => { tone(220, 0.12, { type: 'square', vol: 0.06, slide: 0.5 }); tone(1200, 0.25, { vol: 0.04, delay: 0.1, slide: 1.2 }); },
  boing: () => tone(180, 0.45, { type: 'triangle', vol: 0.1, slide: 3 }),
  thump: () => { tone(90, 0.12, { vol: 0.18, slide: 0.6 }); tone(90, 0.12, { vol: 0.18, slide: 0.6, delay: 0.22 }); },
  lick: () => tone(700, 0.12, { vol: 0.06, slide: 1.8 }),
  slurp: () => { noise(0.35, { vol: 0.06, freq: 600, to: 1600, q: 4 }); tone(400, 0.3, { vol: 0.03, slide: 1.6 }); },
  crunch: () => [0, 0.14, 0.28].forEach((d) => noise(0.07, { vol: 0.09, delay: d, freq: 1500, q: 0.7 })),
  puff: () => noise(0.25, { vol: 0.08, type: 'lowpass', freq: 1400, to: 300 }),
  ding: () => { tone(1568, 0.8, { vol: 0.07 }); tone(2349, 0.5, { vol: 0.03 }); },
  chime: () => [1319, 1568, 1976, 2637].forEach((f, i) => tone(f, 0.5, { delay: i * 0.12, vol: 0.05 })),
  knock: () => [0, 0.18, 0.36].forEach((d) => { tone(160, 0.06, { type: 'square', vol: 0.08, delay: d }); noise(0.04, { vol: 0.06, delay: d, type: 'lowpass', freq: 900 }); }),
  beep: (hi) => tone(hi ? 1320 : 880, hi ? 0.35 : 0.12, { type: 'square', vol: 0.04 }),
  launch: () => { noise(1.6, { vol: 0.1, type: 'lowpass', freq: 300, to: 3000 }); tone(120, 1.4, { type: 'sawtooth', vol: 0.03, slide: 4 }); },
  fanfare: () => [523, 523, 659, 784].forEach((f, i) => tone(f, i === 3 ? 0.5 : 0.14, { type: 'sawtooth', vol: 0.04, delay: i * 0.16 })),
  yawn: () => tone(520, 0.9, { type: 'triangle', vol: 0.06, slide: 0.55 }),
  kiss: () => { noise(0.05, { vol: 0.08, type: 'highpass', freq: 3000 }); tone(1400, 0.08, { vol: 0.04, slide: 1.5, delay: 0.03 }); },
  squeak: () => tone(1200, 0.12, { type: 'triangle', vol: 0.06, slide: 1.4 }),
  purr: () => { for (let i = 0; i < 16; i++) tone(70 + (i % 2) * 8, 0.04, { type: 'square', vol: 0.025, delay: i * 0.055 }); },
  thunder: () => noise(1.4, { vol: 0.09, type: 'lowpass', freq: 220, to: 80 }),
  magic: () => [784, 988, 1175, 1568, 1976].forEach((f, i) => tone(f, 0.25, { delay: i * 0.05, vol: 0.05, type: 'triangle' })),
  drum: () => [0, 0.2].forEach((d) => { tone(140, 0.18, { vol: 0.14, slide: 0.5, delay: d }); }),
  jig: () => [659, 587, 523, 587, 659, 659, 659, 587, 587, 587, 659, 784].forEach((f, i) => tone(f, 0.12, { type: 'triangle', vol: 0.07, delay: i * 0.13 })),
  trumpet: () => [392, 523].forEach((f, i) => tone(f, 0.3, { type: 'sawtooth', vol: 0.04, delay: i * 0.25 })),
  zip: () => noise(0.3, { vol: 0.06, freq: 1500, to: 5000, q: 6 }),
  stamp: () => { tone(80, 0.2, { vol: 0.2, slide: 0.5 }); noise(0.12, { vol: 0.08, type: 'lowpass', freq: 600 }); },
  freeze: () => { tone(1200, 0.15, { type: 'square', vol: 0.05 }); tone(600, 0.3, { type: 'square', vol: 0.05, delay: 0.15 }); },
  go: () => { tone(600, 0.1, { type: 'triangle', vol: 0.08 }); tone(900, 0.2, { type: 'triangle', vol: 0.08, delay: 0.1 }); },
  tick: () => tone(1000, 0.04, { type: 'square', vol: 0.03 }),
  // ba-dum-tss after a punchline
  rimshot: () => { tone(200, 0.1, { vol: 0.13, slide: 0.7 }); tone(150, 0.12, { vol: 0.13, slide: 0.7, delay: 0.13 }); noise(0.6, { vol: 0.06, type: 'highpass', freq: 6000, delay: 0.27 }); },
};

// A cheerful loop for Freeze dance: start() / stop()
const TUNE = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
const BASS = [131, 131, 175, 175, 147, 147, 196, 196];
export const music = {
  timer: 0,
  start() {
    if (this.timer) return;
    let step = 0;
    const beat = () => {
      const i = step++ % TUNE.length;
      tone(TUNE[i], 0.16, { type: 'triangle', vol: 0.07 });
      if (i % 2 === 0) tone(BASS[(i / 2) % BASS.length], 0.28, { type: 'sine', vol: 0.1 });
      if (i % 2 === 1) noise(0.04, { vol: 0.03, type: 'highpass', freq: 6000 });
    };
    beat();
    this.timer = setInterval(beat, 190);
  },
  stop() { clearInterval(this.timer); this.timer = 0; },
};

const stripEmoji = (s) => s.replace(/\p{Extended_Pictographic}|️|‍/gu, '').trim();

// ---------- built-in fallback voice ----------

const VOICE_PREF = { en: ['en-IE', 'en-GB', 'en-US', 'en'], ru: ['ru-RU', 'ru'] };
const FALLBACK_LANG = { en: 'en-GB', ru: 'ru-RU' };
// Skip the novelty iOS voices
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
    // iOS sometimes drops an utterance spoken right after cancel()
    if (busy) setTimeout(go, 120); else go();
  } catch { /* speech unavailable */ }
}

// ---------- pre-recorded clips ----------

let clips = null;          // Set of clip ids from audio/manifest.json
const manifest = fetch('audio/manifest.json').then((r) => (r.ok ? r.json() : [])).catch(() => [])
  .then((ids) => { clips = new Set(ids); });
const buffers = new Map(); // id → Promise<AudioBuffer>, at most MAX_BUFFERS
const MAX_BUFFERS = 40;
let clipSrc = null;
let speechSeq = 0;         // number of the latest line: stale loads are not played
let missed = null;         // the last line that couldn't play because audio was locked

function replayMissed() {
  const m = missed;
  missed = null;
  if (m && m.seq === speechSeq && Date.now() - m.at < 8000 && !document.hidden) speak(m.text, m.lang, m.who);
}

function stopClip() {
  if (clipSrc) { try { clipSrc.stop(); } catch { /* already stopped */ } clipSrc = null; }
}

function loadClip(id) {
  if (buffers.has(id)) {
    const p = buffers.get(id);
    buffers.delete(id);
    buffers.set(id, p); // most recent goes to the end of the queue
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

// A line: a pre-recorded clip first, otherwise the built-in voice.
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
      // Audio not allowed yet (no tap so far): stay silent, the line replays on the next tap
      if (e.message === 'audio locked') { missed = { text, lang, who, seq, at: Date.now() }; return; }
    }
  }
  speakSystem(text, lang, who, seq);
}

// Load clips in advance (counting in missions must be on the beat)
export function preload(texts, lang = 'en', who = 'lucky') {
  if (!clips || !audioCtx()) return;
  for (const t of texts) { const id = clipId(who, lang, t); if (clips.has(id)) loadClip(id).catch(() => {}); }
}

// Sound diagnostics for the parents' area
export function soundStatus() {
  return {
    webAudio: ctx ? ctx.state : 'not created',
    session: navigator.audioSession ? navigator.audioSession.type : 'unsupported',
    silentTrack: silentEl ? (silentEl.paused ? 'paused' : 'playing') : 'off',
    clips: clips ? clips.size : 'loading',
    sound: enabled, voice: voiceOn,
  };
}

export function testSound(text) {
  unlockAudio();
  sfx.happy();
  return speak(text, 'en');
}
