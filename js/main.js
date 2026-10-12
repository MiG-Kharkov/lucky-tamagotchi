import * as st from './state.js';
import { T, pick, say2, LUCKY, DOG, CHATS, PRANKS, RIDDLES, FOODS, CARE, DEEDS, PHRASES, BELTS } from './i18n.js';
import { MISSIONS, SKILLS } from './missions.js';
import { JOKES, JOKE_BY_ID } from './jokes.js';
import { IDIOMS, TWISTERS, IDIOM_BY_ID, TWISTER_BY_ID } from './english.js';
import { openMission } from './ninja.js';
import { PLACES, DECOR, ALBUMS, STICKERS, BADGES, SUPER } from './content.js';
import { WEAR, WEAR_BY_ID, SLOTS } from './wardrobe.js';
import { VERSION, BUILD } from './version.js';
import { CONFIG } from './config.js';
import * as art from './art.js';
import { sfx, unlockAudio, setSound, setVoice, stopSpeech, speak, soundStatus, testSound } from './sound.js';
import { REPLY, ASKS, MOOD_OPTS, MOOD_REPLY, TOUCH_REPLY, STORY, FROG } from './dialogs.js';
import { GAMES, HOLIDAY_GAMES, openGame } from './game.js';
import { createAntics, gestures, DOUBLE_MS } from './antics.js';
import { createTricks } from './tricks.js';
import { speechText } from './voicekey.js';
import { EVENTS, EVENT_BY_ID, eventOn, eventPreview, holidayOnly, justPassed } from './events.js';

const $ = (s, r = document) => r.querySelector(s);

let S = st.load();
// ?mute is for automated tests: no sound or voice (settings are not changed)
const MUTE = new URLSearchParams(location.search).has('mute');
const tr = (k, v) => T(S.lang, k, v);
const L = (pair) => say2(pair, S.lang);
const other = () => (S.lang === 'ru' ? 'en' : 'ru');
const P = (key, v) => [T('ru', key, v), T('en', key, v)]; // A UI string as a [ru, en] pair for speech
// Names are fixed: they are baked into the voice clips
const dogName = (lang = S.lang) => T(lang, 'dogDefault');
const idx = () => (S.lang === 'en' ? 1 : 0);
// Turbo mode (for parents): no limits; progress from before Turbo is saved separately
const turbo = () => !!S.turbo;
// Daily cap on active play: after it Lucky rests until the morning
const dayDone = (T0 = S.today) => !turbo() && S.settings.dailyMax > 0 && (S.playedMs[T0?.date] || 0) >= S.settings.dailyMax * 60e3;
// the day's limit puts Lucky to bed like the nap: 45 s after its warning was seen (a game can run past the limit: the
// warning then comes when it is over); two minutes past the limit he goes anyway
const dayOver = (T0, now) => dayDone(T0) && (T0.dayWarned ? now - (T0.dayWarnedAt || 0) >= 45e3 : (S.playedMs[T0.date] || 0) >= (S.settings.dailyMax + 2) * 60e3);
const addH = (n, cat, cap) => st.addHearts(S, turbo() ? n * 5 : n, cat, turbo() ? Infinity : cap);
// Lucky with a headband in the current belt colour
const luckyArt = (o) => art.lucky({ ...o, belt: BELTS[S.belt].color });
// Lucky away from the scene (missions, sleep, windows, games) wears the holiday hat too, unless he has a hat on
const luckyPic = (o) => luckyArt({ ...o, extra: EV && EV.stage >= 3 && !o.wear?.head ? art.PROPS[SEASON_HAT[EV.id]]?.art() || '' : '' });

const ui = {
  top: $('#top'), stats: $('#stats'), scene: $('#scene'), bg: $('#bg'), bubble: $('#bubble'),
  decor: $('#decor'), decorFront: $('#decorFront'), hunt: $('#hunt'), dog: $('#dog'), lucky: $('#lucky'), fx: $('#fx'), actions: $('#actions'),
  tray: $('#tray'), choices: $('#choices'), editTools: $('#editTools'), sheetWrap: $('#sheetWrap'), sheet: $('#sheet'), overlay: $('#overlay'), modal: $('#modal'), toast: $('#toast'),
};

let mode = 'main'; // main | wash | game | mission | sleep | edit
let tempFace = null, tempFaceUntil = 0;
let shownFace = '', shownOutfit = '';
let dogHere = false;
let lastSpeech = 0, bubbleTimer = 0, tick = 0, sleepKey = '';
let sheetOpen = false;

// ---------- mood ----------

const tier = () => st.moodTier(S.pet);
// Mood-based line: sad and thrilled moods have their own lists
const byTier = (low, normal, max) => { const t = tier(); return t === 'low' ? low : t === 'max' ? max : normal; };

// ---------- speech ----------

const kidName = (lang) => T(lang, 'kidDefault');
const fill = (txt, lang) => txt.replaceAll('{dog}', dogName(lang)).replaceAll('{name}', kidName(lang));

// Don't repeat recent lines; when all of a short list are recent, the one said longest ago (never the same twice)
const recent = [];
function fresh(list) {
  const pool = list.filter((x) => !recent.includes(x));
  const x = pool.length ? pick(pool) : list.reduce((a, b) => (recent.lastIndexOf(b) < recent.lastIndexOf(a) ? b : a), list[0]);
  recent.push(x);
  if (recent.length > 60) recent.shift(); // about six minutes of an active child's lines
  return x;
}

let chainQ = [], chainTimer = 0, chainKeep = false, chainHeld = 0;
let tapWait = false, tapWord = 0, quietUntil = 0;
let lastSaid = null;
let busyUntil = 0;   // the current line plays until this moment
let pending = null;  // one postponed automatic line
function stopChain() { chainQ = []; chainKeep = false; chainHeld = 0; clearTimeout(chainTimer); }
// a scene with lines that taps don't interrupt is going on (Tali's joke, a saying, a tongue twister)
const storyOn = () => chainKeep && chainQ.length > 0;

function speechMs(text) { return Math.max(3200, text.length * 85); }

// Lucky speaks on his own only if the window is visible, focused and the child touched the screen in the last minute.
// He always answers taps while the window is visible.
const ACTIVE_MS = 60e3;
let lastInput = Date.now();
const windowActive = () => !document.hidden && document.hasFocus();
const userActive = () => windowActive() && Date.now() - lastInput < ACTIVE_MS;

// A line: main-language text, small translation, spoken out loud.
// Speak only in an active window, one line at a time: automatic lines wait for the current one.
// urgent: "soon I'll rest" when the limit has come: it doesn't wait for a second tap or for its own quiet moment
function say(pair, who = 'lucky', { auto = false, chain = false, ambient = false, hold = false, forAsk = false, speed = 1, urgent = false } = {}) {
  if (document.hidden) return 0;
  if (!auto && !chain && !urgent && Date.now() < quietUntil) return 0; // "soon I'll rest" stays a moment (he still moves)
  // a tap's word waits to see whether a second tap follows: then the double tap answers instead, and the first
  // line doesn't flash up and get cut off
  if (tapWait && !auto && !chain && !urgent) {
    clearTimeout(tapWord);
    const opts = { ambient, hold, forAsk, speed };
    tapWord = setTimeout(() => { tapWord = 0; say(pair, who, opts); }, DOUBLE_MS);
    return speechMs(fill(typeof pair === 'string' ? pair : L(pair), S.lang));
  }
  if (ask && !forAsk) return 0; // don't interrupt Lucky's or the frog's question
  if ((auto || chain) && !userActive() && !(ambient && windowActive())) return 0;
  if ((auto || chain) && (mode === 'game' || mode === 'mission')) return 0;
  if (!chain && chainKeep && chainQ.length) return 0; // taps don't talk over Tali's joke (Lucky still reacts)
  const now = Date.now();
  if (auto && (now < busyUntil || chainQ.length)) { pending = { pair, who, at: now }; return 0; }
  if (!chain) stopChain();
  const main = fill(typeof pair === 'string' ? pair : L(pair), S.lang);
  let sub = typeof pair === 'string' || !S.settings.translate ? '' : fill(say2(pair, other()), other());
  if (sub && speechText(sub) === speechText(main)) sub = ''; // the same words in both (Ukrainian, Thai): one line
  ui.bubble.className = 'bubble show b-' + who + (ui.bubble.classList.contains('aloft') ? ' aloft' : '');
  ui.bubble.innerHTML = `<div class="b-main">${main}</div>${sub ? `<div class="b-sub">🔊 ${sub}</div>` : ''}`;
  if (!ui.choices.hidden) fitAsk(); // a reply while the choices are up (a wrong guess): Lucky refits under it
  else fitBubble();
  // The line plays right away; tapping the bubble plays the translation
  ui.bubble.onclick = (e) => {
    e.stopPropagation();
    if (sub) speak(sub, other(), who); else speak(main, S.lang, who);
    if (hold) return;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => ui.bubble.classList.remove('show'), speechMs(sub || main) + 1500);
  };
  if (mode !== 'sleep') speak(main, S.lang, who, speed);
  lastSaid = { main, who, at: Date.now() };
  const ms = speechMs(main);
  busyUntil = now + ms;
  clearTimeout(bubbleTimer);
  if (!hold) bubbleTimer = setTimeout(() => ui.bubble.classList.remove('show'), ms + (sub ? 2500 : 0));
  lastSpeech = now;
  return ms;
}

const sayAuto = (pair, who = 'lucky') => say(pair, who, { auto: true });

// On a short screen a long line could reach down over Lucky's head: then the bubble's text gets smaller (measured
// on the layout box, not the bubble's pop-in animation)
function fitBubble() {
  const B = ui.bubble, parts = [...ui.lucky.querySelectorAll('.head, .ear')];
  if (!parts.length) return;
  const top = ui.scene.getBoundingClientRect().top, headTop = Math.min(...parts.map((g) => g.getBoundingClientRect().top));
  const over = () => top + B.offsetTop + B.offsetHeight + 9 - headTop;
  if (over() <= 0) return;
  B.classList.add('tight');
  if (over() > 0) B.classList.add('tighter');
}

function hideBubble() { clearTimeout(bubbleTimer); ui.bubble.classList.remove('show'); }
// Up in a big jump Lucky would go behind the bubble: while he is up there it steps aside (the voice goes on)
const AIR = ['binky', 'bigjump', 'moonjump', 'heli', 'zeroG', 'beamup', 'balloonfly', 'blastoff', 'land', 'parachute', 'levitate', 'backflip', 'starjump', 'heroflight', 'giant', 'outofhat'];
new MutationObserver(() => ui.bubble.classList.toggle('aloft', AIR.some((c) => ui.lucky.classList.contains(c))))
  .observe(ui.lucky, { attributes: true, attributeFilter: ['class'] });

// A postponed line plays when nothing else is speaking; stale ones are dropped
function flushPending(now) {
  if (!pending || ask || now < busyUntil || chainQ.length || antics.busy() || mode !== 'main' || sheetOpen || modalOpen || !userActive()) return;
  const p = pending;
  pending = null;
  if (now - p.at < 15000) sayAuto(p.pair, p.who);
}

function silence() {
  stopChain();
  stopJokeBook();
  stopSpeech();
  pending = null;
  busyUntil = 0;
  hideBubble();
}

// A scene: lines in turn, each starts when the previous one ends
function talk(lines, keep = false) {
  stopChain();
  chainQ = [...lines];
  chainKeep = keep;
  nextLine();
}

// A step is a line [who, ru, en, pause?] or a function (an action) that returns how long to wait, or -1 to stop.
// If a line can't be said (nobody is looking, a question is on screen), the rest of the scene is dropped.
// While a sheet or a window covers the scene the next line waits (up to 30 s), so a punchline isn't lost.
function nextLine() {
  try { nextStep(); } catch (e) { stopChain(); setTimeout(() => { throw e; }); } // a broken step must not leave Lucky silent
}
function nextStep() {
  if (chainQ.length && mode === 'main' && (sheetOpen || modalOpen)) {
    chainHeld ||= Date.now();
    if (Date.now() - chainHeld < 30e3) { chainTimer = setTimeout(nextLine, 400); return; }
    return stopChain();
  }
  chainHeld = 0;
  const line = chainQ.shift();
  if (!line || mode !== 'main' || !windowActive()) return stopChain();
  if (typeof line === 'function') {
    const ms = line();
    if (ms < 0) return stopChain();
    chainTimer = setTimeout(nextLine, ms || 0);
    return;
  }
  const [who, ru, en, pause] = line;
  if (who === 'dog' && !dogHere) return nextLine();
  const ms = say([ru, en], who, { chain: true });
  if (!ms) return stopChain();
  chainTimer = setTimeout(nextLine, pause ?? ms + 600);
}

const reactAt = {};
function react(kind, list, chance = 1) {
  const now = Date.now();
  if (now - (reactAt[kind] || 0) < 20000 || Math.random() > chance || now < busyUntil) return;
  reactAt[kind] = now;
  say(fresh(list));
}

// Tali's pranks: a scene plus a funny action
function prank(p) {
  const dogEl = ui.dog.querySelector('.dog-body');
  if (p.fx === 'steal' && dogEl) {
    const [x1, y1] = luckyPoint(0.5, 0.8);
    const s = document.createElement('span');
    s.className = 'fly';
    s.textContent = '🥕';
    ui.fx.appendChild(s);
    const d = dogEl.getBoundingClientRect(), sc = ui.scene.getBoundingClientRect();
    s.animate([{ transform: `translate(${x1}px, ${y1}px)` }, { transform: `translate(${d.left - sc.left + d.width / 2}px, ${d.top - sc.top + d.height * 0.55}px)` }], { duration: 700, fill: 'forwards' });
    setTimeout(() => s.remove(), 4200);
    hop(dogEl, 'hop');
  }
  if (p.fx === 'sneeze' && dogEl) { hop(dogEl, 'sneeze'); sfx.sneeze(); }
  if (p.fx === 'dance') setTimeout(() => { hop(ui.lucky, 'zoom'); if (dogEl) hop(dogEl, 'zoom'); sfx.happy(); }, 1500);
  talk(acted(p.lines));
}

// A chat with Tali acted out: before each line, the little action that goes with it (antics.js)
const acted = (lines) => lines.flatMap((l) => [() => { antics.chat(l[2]); return 0; }, l]);

function riddle(r) {
  talk([['lucky', ...r[0]], ['lucky', ...r[1]]].map((x, i) => (i === 1 ? ['lucky', '🤔 … ' + x[1], '🤔 … ' + x[2]] : x)));
}

// Hints come one after another (a new badge is no longer swept away by the food fact): each stays its time, at
// least 2.5 s, and never sits on top of a window (they wait until it closes)
const toastQ = [];
let toastOn = false;
function toast(html, ms = 3500) {
  if ((toastOn && ui.toast.innerHTML === html) || toastQ.some(([h]) => h === html)) return;
  toastQ.push([html, ms]);
  if (toastQ.length > 4) toastQ.splice(0, toastQ.length - 4);
  if (!toastOn) nextToast();
}
function nextToast() {
  if (toastOn || modalOpen || !toastQ.length) return;
  const [html, ms] = toastQ.shift();
  toastOn = true;
  ui.toast.innerHTML = html;
  ui.toast.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { ui.toast.classList.remove('show'); toast.t = setTimeout(() => { toastOn = false; nextToast(); }, 350); }, Math.max(2500, ms));
}
// a window takes the screen: the hint goes, the queued ones follow when it closes
function hideToast() { clearTimeout(toast.t); ui.toast.classList.remove('show'); toastOn = false; }

// ---------- effects ----------

function sceneXY(e) {
  const r = ui.scene.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}

function floatFx(x, y, txt, cls = 'heart') {
  const s = document.createElement('span');
  s.className = 'float ' + cls;
  s.textContent = txt;
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
  ui.fx.appendChild(s);
  setTimeout(() => s.remove(), 1400);
}

function heartsBurst(x, y, n = 3) {
  for (let i = 0; i < n; i++) setTimeout(() => floatFx(x + (Math.random() * 40 - 20), y, pick(['💗', '💖', '💕'])), i * 90);
}

function luckyPoint(fx = 0.5, fy = 0.5) {
  const s = ui.scene.getBoundingClientRect(), l = ui.lucky.getBoundingClientRect();
  return [l.left - s.left + l.width * fx, l.top - s.top + l.height * fy];
}

// One-off effect: the class is removed when the element's own animation ends
// (otherwise nested infinite animations, like the helicopter ears, would run forever).
function hop(elm, cls = 'hop', maxMs = 4000) {
  elm.classList.remove(cls);
  void elm.getBoundingClientRect(); // restart the animation (works for SVG too)
  elm.classList.add(cls);
  const timers = (elm._fx ||= {});
  clearTimeout(timers[cls]);
  const off = () => { clearTimeout(timers[cls]); elm.classList.remove(cls); elm.removeEventListener('animationend', onEnd); };
  const onEnd = (e) => { if (e.target === elm) off(); };
  elm.addEventListener('animationend', onEnd);
  timers[cls] = setTimeout(off, maxMs); // safety net in case the animation never ran
}

// Scene antics: the worlds' details, decorations, Tali and Lucky's props (antics.js)
const antics = createAntics({
  ui,
  ok: () => mode === 'main' && !sheetOpen && !modalOpen,
  free: () => mode === 'main' && !sheetOpen && !modalOpen && !ask,
  talking: () => storyOn(),
  world: () => S.bg,
  day: () => st.today(S),
  say: (list, who = 'lucky') => say(fresh(list), who),
  hop, setTemp, floatFx, fxAt, luckyPoint, sceneXY,
  hearts: heartsBurst,
  reward: () => { st.boost(S, 'fun', 2); award(addH(1, 'world', 10)); renderStats(); },
  boost: (k, n) => { st.boost(S, k, n); renderStats(); },
  stat,
  idiom: (when, chance) => maybeIdiom(when, chance),
  event: () => EV,
  active: () => userActive(),
  toast: (html) => toast(html, 2500),
  // best scores (keepy-uppy): true when it's a new record
  record: (key, n) => { const k = 'best_' + key; if (n <= (S.stats[k] || 0)) return false; S.stats[k] = n; st.save(S); return true; },
});

// Lucky's tricks (tricks.js): the many ways he answers a touch, and the rare big tricks
let tempWear = null; // an outfit he tries on for a moment in a trick
const wornNow = () => (tempWear ? { ...S.wear, ...tempWear } : S.wear);
// Nothing else is on the screen: no line playing, no question, sheet, window, hint or scene (a rare trick can start)
function quietNow() {
  return mode === 'main' && !sheetOpen && !modalOpen && !ask && windowActive() && !chainQ.length && Date.now() >= busyUntil
    && !antics.busy() && !ui.toast.classList.contains('show');
}
const tricks = createTricks({
  kit: antics.kit, ui, setTemp, hop, fxAt, floatFx, luckyPoint,
  hearts: heartsBurst,
  quiet: quietNow,
  free: () => mode === 'main' && !sheetOpen && !modalOpen && !ask,
  clearBubble: () => { if (Date.now() >= busyUntil) hideBubble(); },
  luckyArt: (face) => luckyPic({ face, wear: wornNow() }),
  outfits: () => WEAR.filter((w) => ownsWear(w) && S.wear[w.slot] !== w.id),
  dressUp: (id) => { tempWear = id ? { [WEAR_BY_ID[id].slot]: id } : null; renderLucky(true); },
  wearing: (id) => Object.values(wornNow()).includes(id),
  dogEl: () => (dogHere ? ui.dog.querySelector('.dog-body') : null),
  helicopter: () => helicopter(),
  sneeze: () => sneeze(),
  thump: () => thump(),
  chase: () => { hop(ui.lucky, 'chase'); setTemp('laugh', 2200); },
  say: (list) => say(fresh(list)),
});

function confetti() {
  const colors = EV && EV.stage >= 3 ? EV.confetti : ['#FF5FA2', '#FFD23F', '#8B6CFF', '#4CD37B', '#6FD3FF', '#FF9F43'];
  for (let i = 0; i < 46; i++) {
    const c = document.createElement('i');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(colors);
    c.style.animationDelay = Math.random() * 0.5 + 's';
    c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }
}

function setTemp(face, ms) {
  tempFace = face;
  tempFaceUntil = Date.now() + ms;
  renderLucky();
}

// ---------- modals ----------

const modalQ = [];
let modalOpen = false;

// A window never covers a game or a mission: it waits and opens when that is over (closeGame)
function showModal(m) {
  modalQ.push(m);
  if (!modalOpen && mode !== 'game' && mode !== 'mission') nextModal();
}

function nextModal() {
  const m = modalQ.shift();
  if (!m) {
    modalOpen = false;
    ui.modal.className = 'modal';
    nextToast(); // hints that waited for the window
    return;
  }
  if (!modalOpen) setTimeout(() => { if (modalOpen) antics.end(); }); // Lucky's scene stops under the window (not mid-step)
  if (!modalOpen && toastOn) { const html = ui.toast.innerHTML; hideToast(); toastQ.unshift([html, 3000]); } // shown again after it
  modalOpen = true;
  if (m.custom) { ui.modal.className = 'modal show ' + (m.cls ?? 'reveal-host'); m.custom(ui.modal, nextModal); return; }
  const btns = m.buttons || [{ label: tr('hooray') }];
  ui.modal.className = 'modal show';
  ui.modal.innerHTML = `<div class="modal-card">
    ${m.art ? `<div class="m-art">${m.art}</div>` : ''}
    <h2>${m.title}</h2>${m.text ? `<p>${m.text}</p>` : ''}
    <div class="m-btns">${btns.map((b, i) => `<button class="btn ${i === 0 && !m.plain ? 'pink' : ''}" data-i="${i}">${b.label}</button>`).join('')}</div></div>`;
  ui.modal.querySelectorAll('button').forEach((b) => {
    b.onclick = () => { sfx.tap(); const fn = btns[b.dataset.i].onClick; nextModal(); fn?.(); };
  });
}

function award(res) {
  if (!res) return;
  for (const lvl of res.ups) showModal({ custom: (host, done) => revealLevel(host, lvl, done) });
  renderTop();
}

// What a level brings: an outfit, a place or a decoration; otherwise a sticker or bonus
function levelRewards(lvl) {
  const out = [
    ...WEAR.filter((x) => x.level === lvl).map((x) => ({ kind: 'outfit', ...x })),
    ...PLACES.filter((x) => x.level === lvl).map((x) => ({ kind: 'place', ...x })),
    ...DECOR.filter((x) => x.level === lvl).map((x) => ({ kind: 'decor', ...x })),
  ];
  if (!out.length) {
    const s = giveSticker();
    out.push(s ? { kind: 'sticker', id: s, name: P('rvSticker') } : { kind: 'hearts', id: '💖', name: P('rvHearts') });
  }
  return out;
}

function nextRewardHint(lvl) {
  const next = [...WEAR.filter((x) => x.level), ...PLACES, ...DECOR].filter((x) => x.level > lvl).sort((a, b) => a.level - b.level)[0];
  return next ? tr('rvNext', { x: `${L(next.name)} (${tr('lv')} ${next.level})` }) : '';
}

function rewardArt(r) {
  if (r.kind === 'outfit') return luckyArt({ face: 'happy', wear: { ...S.wear, [r.slot]: r.id } });
  if (r.kind === 'place') return `<div class="rv-place">${art.scene(r.id)}</div>`;
  if (r.kind === 'decor') return `<div class="rv-decor">${art.decor(r.id)}</div>`;
  return `<div class="big-emoji">${r.id}</div>`;
}

const REWARD_LABEL = { outfit: 'rvOutfit', place: 'rvPlace', decor: 'rvDecor', sticker: 'rvSticker', hearts: 'rvHearts' };

// The level-up present reveal
function revealLevel(host, lvl, done) {
  revealGift(host, { title: tr('levelUp', { n: lvl }), rewards: levelRewards(lvl), next: nextRewardHint(lvl), line: LUCKY.levelUp }, done);
}

function wearIt(w) {
  S.wear = { ...S.wear, [w.slot]: w.id };
  stat('wearChanges');
  renderLucky(true);
}

// Present reveal: level-up, daily surprise, album prize, Tali's gift
function revealGift(host, { title, rewards, next = '', line = LUCKY.levelUp }, done) {
  const main = rewards[0];
  rewards.filter((r) => r.kind === 'decor').forEach((r) => placeNewDecor(r.id));
  if (rewards.some((r) => r.kind === 'decor')) renderDecor();
  if (main.kind === 'hearts') setTimeout(() => award(addH(5, 'giftBonus', 15)), 0);
  hideToast();
  st.save(S);
  sfx.levelup();
  host.innerHTML = `<div class="reveal">
    <div class="rays"></div><div class="rv-glow"></div>
    <div class="rv-content">
      <div class="rv-level">${title}</div>
      <button class="rv-gift" aria-label="gift"><span>${EV && EV.stage >= 3 ? EV.gift[0] : '🎁'}</span></button>
      <p class="rv-tap">${tr('rvTap')}</p>
    </div>
  </div>`;
  const content = host.querySelector('.rv-content');
  const gift = host.querySelector('.rv-gift');
  gift.onclick = () => {
    gift.onclick = null;
    gift.classList.add('open');
    sfx.sparkle();
    confetti();
    setTimeout(() => {
      const extra = rewards.slice(1).map((r) => `+ ${L(r.name)}`).join('<br>');
      const primary = main.kind === 'outfit' ? tr('rvWear') : main.kind === 'place' ? tr('rvGo') : tr('hooray');
      content.innerHTML = `
        <div class="rv-level small">${title}</div>
        ${main.kind === 'sticker' || main.kind === 'hearts' ? '' : `<div class="rv-kind ${main.rarity || ''}">${main.rarity === 'gold' ? '✨ ' + tr('rvGold') : main.rarity === 'rare' ? '💎 ' + tr('rvRare') : tr(REWARD_LABEL[main.kind])}</div>`}
        <div class="rv-art">${rewardArt(main)}<i class="spark s1">✨</i><i class="spark s2">⭐</i><i class="spark s3">✨</i></div>
        <h2>${L(main.name)}</h2>
        ${extra ? `<p class="rv-extra">${extra}</p>` : ''}
        <p class="rv-next">${next}</p>
        <div class="m-btns"><button class="btn pink big rv-ok">${primary}</button>
        ${main.kind === 'outfit' || main.kind === 'place' ? `<button class="btn rv-later">${tr('rvLater')}</button>` : ''}</div>`;
      sfx.happy();
      const finish = (worn) => { sfx.tap(); done(); setTimeout(() => sayAuto(fresh(worn && LUCKY.wearSay[main.id] ? LUCKY.wearSay[main.id] : line)), 300); collectionCheck(); };
      content.querySelector('.rv-ok').onclick = () => {
        if (main.kind === 'outfit') wearIt(main);
        if (main.kind === 'place') goPlace(main.id);
        st.save(S);
        finish(main.kind === 'outfit');
      };
      content.querySelector('.rv-later')?.addEventListener('click', () => finish(false));
    }, 450);
  };
}

// Scene layout: each place has its own item list. Coordinates are in % of the background picture (see artBox),
// not of the visible scene, so an item stays on the same spot of grass or sky when the scene gets shorter
// (in Decorate the tray is taller than the action buttons).
const DECOR_W = { rainbow: 72, lantern: 12, hutch: 31, bowl: 18, ball: 13, tent: 30, snowman: 15, igloo: 30, rocket: 15, castle: 34, pond: 32 };
const DECOR_POS = { rainbow: [50, 35], lantern: [88, 33], hutch: [17, 70], bowl: [86, 92], ball: [10, 93],
  tent: [82, 68], snowman: [88, 76], igloo: [18, 71], rocket: [86, 62], castle: [20, 65], pond: [74, 92] };

// The background is a 400×700 picture drawn bottom-aligned and scaled to cover the scene (xMidYMax slice).
// The decoration layers get exactly the same box.
const ART_W = 400, ART_H = 700;
function artBox(w, h) {
  const k = Math.max(w / ART_W, h / ART_H), bw = ART_W * k, bh = ART_H * k;
  return { left: (w - bw) / 2, top: h - bh, width: bw, height: bh };
}
function fitLayer(el, w, h) {
  const b = artBox(w, h);
  Object.assign(el.style, { left: b.left + 'px', top: b.top + 'px', width: b.width + 'px', height: b.height + 'px' });
}
const sceneSize = () => ({ width: ui.scene.clientWidth, height: ui.scene.clientHeight }); // layout size, not the scaled one
function fitDecor() {
  const r = sceneSize();
  if (r.width && r.height) [ui.decor, ui.decorFront].forEach((l) => fitLayer(l, r.width, r.height));
}
// % of the visible scene → % of the picture (for defaults placed in the middle of what's on screen)
function sceneToArt(xp, yp) {
  const r = sceneSize(), b = artBox(r.width, r.height);
  return [((xp / 100) * r.width - b.left) / b.width * 100, ((yp / 100) * r.height - b.top) / b.height * 100];
}
// the top of the picture that is actually visible, in %
const artVisibleTop = () => { const r = sceneSize(), b = artBox(r.width, r.height); return (-b.top / b.height) * 100; };
// Saves from before 1.6.1 kept % of the visible scene: convert them once, with this phone's usual scene size
function migrateLayout() {
  if (S.layoutV >= 2 || mode !== 'main') return;
  const r = sceneSize();
  if (!r.width || !r.height) return;
  for (const list of Object.values(S.layout || {})) {
    for (const it of list || []) { const [x, y] = sceneToArt(it.x, it.y); it.x = +x.toFixed(1); it.y = +y.toFixed(1); }
  }
  S.layoutV = 2;
  st.save(S);
  renderDecor();
}
new ResizeObserver(() => fitDecor()).observe(ui.scene);
const EMOJI_W = 13;
const MAX_ITEMS = 30;
let editSel = -1;

function layout() {
  S.layout ||= {};
  if (!S.layout[S.bg]) {
    S.layout[S.bg] = DECOR.filter((d) => S.level >= d.level && !S.decorOff.includes(d.id))
      .map((d) => ({ k: 'decor', id: d.id, x: DECOR_POS[d.id][0], y: DECOR_POS[d.id][1], s: 1, f: 0 }));
  }
  return S.layout[S.bg];
}

// A new decoration is placed in the current world right away
function placeNewDecor(id) {
  const items = layout();
  if (!items.some((it) => it.id === id)) items.push({ k: 'decor', id, x: DECOR_POS[id][0], y: DECOR_POS[id][1], s: 1, f: 0 });
}

// Items below this line (in % of the picture) are closer to the viewer, in front of Lucky
const FRONT_Y = 85;

// A holiday sticker is on the scene only while its holiday is on (it comes back next year)
const shownNow = (it) => !(it.k === 'emoji' && HOLIDAY_ONLY.has(it.id) && !(EV && EV.stage >= 2 ? EV.stickers : []).includes(it.id));

function renderDecor() {
  fitDecor();
  const items = layout();
  const html = (front) => items.map((it, i) => {
    if ((it.y >= FRONT_Y) !== front) return '';
    if (!shownNow(it)) return '';
    const w = it.k === 'decor' ? DECOR_W[it.id] : EMOJI_W;
    return `<div class="pl ${it.k === 'decor' ? 'pl-decor dec-' + it.id : 'pl-emoji'} ${SUPER.has(it.id) ? 'super' : ''} ${editSel === i ? 'sel' : ''}" data-i="${i}"
      style="left:${it.x}%;top:${it.y}%;--w:${w};--s:${it.s};--f:${it.f ? -1 : 1}"><div class="pl-in">${it.k === 'decor' ? art.decor(it.id) : `<span>${it.id}</span>`}</div></div>`;
  }).join('');
  ui.decor.innerHTML = html(false);
  ui.decorFront.innerHTML = html(true);
  ui.editTools.hidden = !(mode === 'edit' && editSel >= 0);
}

// Tapping an item outside Decorate mode: it answers, and Lucky often joins in (antics.js)
const LAYERS = [ui.decor, ui.decorFront];
const onLayers = (ev, fn) => LAYERS.forEach((l) => l.addEventListener(ev, fn));
LAYERS.forEach((l) => gestures(l, (t) => (mode === 'main' ? t.closest('.pl') : null), (kind, el, p) => {
  const it = layout()[el.dataset.i];
  if (it) antics.decor(kind, el, it, p);
}));

// Dragging in Decorate mode
let drag = null;
onLayers('pointerdown', (e) => {
  if (mode !== 'edit' || drag) return;
  const el = e.target.closest('.pl');
  if (!el) return;
  e.preventDefault();
  const i = Number(el.dataset.i);
  if (editSel !== i) { editSel = i; LAYERS.forEach((l) => l.querySelectorAll('.pl.sel').forEach((x) => x.classList.remove('sel'))); el.classList.add('sel'); ui.editTools.hidden = false; }
  const r = ui.decor.getBoundingClientRect();
  drag = { el, i, r, id: e.pointerId, sx: e.clientX, sy: e.clientY, x0: layout()[i].x, y0: layout()[i].y, minY: artVisibleTop() + 3, moved: false };
  el.setPointerCapture(e.pointerId);
});
onLayers('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const it = layout()[drag.i];
  it.x = Math.max(2, Math.min(98, drag.x0 + ((e.clientX - drag.sx) / drag.r.width) * 100));
  it.y = Math.max(drag.minY, Math.min(98, drag.y0 + ((e.clientY - drag.sy) / drag.r.height) * 100));
  drag.el.style.left = it.x + '%';
  drag.el.style.top = it.y + '%';
  drag.moved = true;
});
const endDrag = (e) => {
  if (!drag || (e && e.pointerId !== drag.id)) return;
  // the selected item goes on top
  const items = layout();
  if (drag.i !== items.length - 1) { items.push(items.splice(drag.i, 1)[0]); editSel = items.length - 1; }
  renderDecor(); // the item may have moved to the front or back layer
  if (drag.moved) sfx.tap();
  drag = null;
  st.save(S);
};
onLayers('pointerup', endDrag);
onLayers('pointercancel', endDrag);
onLayers('lostpointercapture', endDrag);

ui.editTools.addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b || editSel < 0) return;
  const items = layout(), it = items[editSel];
  sfx.tap();
  if (b.dataset.a === 'minus') it.s = Math.max(0.4, +(it.s - 0.2).toFixed(1));
  if (b.dataset.a === 'plus') it.s = Math.min(2.6, +(it.s + 0.2).toFixed(1));
  if (b.dataset.a === 'flip') it.f = it.f ? 0 : 1;
  if (b.dataset.a === 'del') { items.splice(editSel, 1); editSel = -1; sfx.pop(); }
  renderDecor();
  if (b.dataset.a === 'del') renderTray();
  st.save(S);
});

// Decorate tray: categories (super things, home decorations, this world, other worlds, sticker albums) and a grid
let trayCat = null;
function trayCats() {
  const open = PLACES.filter((pl) => S.level >= pl.level);
  const here = PLACES.find((pl) => pl.id === S.bg) || PLACES[0];
  const emo = (id) => ({ k: 'emoji', id });
  const allEmoji = [...new Set([...open.flatMap((pl) => pl.props), ...S.stickers])];
  return [
    { id: 'super', icon: '⭐', label: tr('traySuper'), groups: [{ items: [
      ...DECOR.filter((d) => SUPER.has(d.id) && S.level >= d.level).map((d) => ({ k: 'decor', id: d.id })),
      ...allEmoji.filter((e) => SUPER.has(e)).map(emo)] }] },
    ...(EV && EV.stage >= 2 ? [{ id: 'holiday', icon: EV.icon, label: L(EV.name), groups: [{ items: EV.stickers.map(emo) }] }] : []),
    { id: 'home', icon: '🏡', label: tr('trayHome'), groups: [{ items: DECOR.map((d) => ({ k: 'decor', id: d.id, lv: S.level < d.level ? d.level : 0 })) }] },
    { id: 'world', icon: '🌍', label: L(here.name), groups: [{ items: here.props.map(emo) }] },
    { id: 'worlds', icon: '🗺️', label: tr('trayWorlds'), groups: open.filter((pl) => pl.id !== here.id).map((pl) => ({ title: L(pl.name), items: pl.props.map(emo) })) },
    { id: 'stickers', icon: '📒', label: tr('stickers'), groups: ALBUMS.map((a) => ({ title: L(a.name), items: a.stickers.filter((x) => S.stickers.includes(x)).map(emo) })).filter((g) => g.items.length) },
  ].filter((c) => c.groups.some((g) => g.items.length));
}

function renderTray() {
  const cats = trayCats();
  if (!cats.some((c) => c.id === trayCat)) trayCat = cats.some((c) => c.id === 'world') ? 'world' : cats[0].id;
  const cur = cats.find((c) => c.id === trayCat);
  const placed = (id) => layout().filter((it) => it.id === id).length;
  const tile = (o) => {
    const n = placed(o.id);
    return `<button class="tray-it ${SUPER.has(o.id) ? 'super' : ''} ${o.lv ? 'locked' : ''}" data-k="${o.k}" data-id="${o.id}" ${o.lv ? `data-lv="${o.lv}"` : ''}>
      ${o.k === 'decor' ? art.decor(o.id) : o.id}${n ? `<i class="tray-n">${o.k === 'decor' ? '✓' : n}</i>` : ''}${o.lv ? `<i class="tray-lock">🔒 ${o.lv}</i>` : ''}</button>`;
  };
  const grid = ui.tray.querySelector('.tray-grid'), y = grid && grid.dataset.c === trayCat ? grid.scrollTop : 0;
  // only the open category shows its name, so all of them fit on one line
  ui.tray.innerHTML = `<div class="tray-top"><div class="tray-cats">${cats.map((c) => `<button class="tray-cat ${c.id === trayCat ? 'on' : ''}" data-c="${c.id}" aria-label="${c.label}">${c.icon}<span class="tc-label"> ${c.label}</span></button>`).join('')}</div>
      <button class="btn pink tray-done" aria-label="${tr('done')}">✓</button></div>
    <div class="tray-grid" data-c="${trayCat}">${trayCat === 'super' ? `<p class="tray-note">✨ ${tr('superNote')}</p>` : ''}${cur.groups.map((g) => `${g.title ? `<div class="tray-h">${g.title}</div>` : ''}${g.items.map(tile).join('')}`).join('')}</div>`;
  ui.tray.querySelector('.tray-grid').scrollTop = y;
  ui.tray.querySelector('.tray-done').onclick = finishEdit;
  ui.tray.querySelectorAll('.tray-cat').forEach((b) => { b.onclick = () => { sfx.tap(); trayCat = b.dataset.c; renderTray(); }; });
  ui.tray.querySelectorAll('.tray-it').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.lv) { sfx.tap(); hop(b, 'wiggle'); toast('🔒 ' + tr('unlockAt', { n: b.dataset.lv }), 2000); return; }
      addItem({ k: b.dataset.k, id: b.dataset.id });
    };
  });
}

// Put an item on the scene: decorations go to their usual spot, emoji near the centre
function addItem(o) {
  const items = layout();
  // a decoration is only once on the scene: tapping it again in the tray selects it
  const there = o.k === 'decor' ? items.findIndex((it) => it.id === o.id) : -1;
  if (there >= 0) {
    editSel = there;
    renderDecor();
    sfx.tap();
    const el = [...LAYERS.flatMap((l) => [...l.querySelectorAll('.pl')])].find((x) => Number(x.dataset.i) === there);
    if (el) hop(el, 'wiggle');
    return;
  }
  if (items.filter(shownNow).length >= MAX_ITEMS) return toast('✏️ ' + tr('editFull'), 2500); // hidden holiday stickers don't count
  const [x, y] = o.k === 'decor' && DECOR_POS[o.id] ? DECOR_POS[o.id] : sceneToArt(50 + Math.random() * 20 - 10, 55 + Math.random() * 16 - 8).map((v) => +v.toFixed(1));
  items.push({ k: o.k, id: o.id, x, y, s: 1, f: 0 });
  editSel = items.length - 1;
  sfx.pop();
  renderDecor();
  st.save(S);
  stat('decorPlaced');
  // the first super thing: Lucky explains the gestures
  if (SUPER.has(o.id) && !S.stats.superHint) { S.stats.superHint = 1; say(fresh(LUCKY.antics.superHint)); }
  else react('place-' + (LUCKY.place_item[o.id] ? o.id : 'sticker'), LUCKY.place_item[o.id] || LUCKY.placeGeneric, 0.9);
  renderTray();
}

// In Decorate the tray is taller than the action buttons. Instead of cutting the top of the scene off,
// show the whole scene scaled down, so things end up exactly where they were put.
let sceneH = 0;
function editScale(on) {
  const st2 = ui.scene.style;
  if (!on) { st2.flex = st2.height = st2.transform = st2.transformOrigin = st2.marginBottom = ''; return; }
  const h = sceneH || ui.scene.offsetHeight;
  st2.flex = st2.height = st2.transform = st2.marginBottom = '';
  const room = ui.scene.offsetHeight; // the space left above the tray
  const k = Math.min(1, room / h);
  Object.assign(st2, { flex: 'none', height: h + 'px', transform: `scale(${k})`, transformOrigin: '50% 0', marginBottom: (room - h) + 'px' });
}

function startEdit(addId = null) {
  if (mode !== 'main') return;
  closeSheet();
  sceneH = ui.scene.offsetHeight; // the scene's usual height, before the tray opens
  leaveMain('edit');
  editSel = -1;
  document.body.classList.add('editing');
  renderTray();
  ui.tray.hidden = false;
  editScale(true);
  toast('✏️ ' + tr('editHint'), 2500);
  renderDecor();
  // Opened from Collection → Home with a decoration: put it back on the scene right away
  if (addId) addItem({ k: 'decor', id: addId });
  else say(LUCKY.decorate[0]);
}

function finishEdit(silent = false) {
  if (mode !== 'edit') return;
  mode = 'main';
  editSel = -1;
  drag = null;
  document.body.classList.remove('editing');
  ui.tray.hidden = true;
  editScale(false);
  renderDecor();
  st.save(S);
  if (silent === true) return;
  sfx.sparkle();
  setTemp('happy', 1500);
  say(fresh(LUCKY.decorate.slice(1)));
  award(addH(3, 'decor', 3));
}

// An item is available if unlocked by level or received as a present / album prize
const ownsWear = (w) => (w.level && S.level >= w.level) || S.owned.includes(w.id);
const albumReward = (id) => ALBUMS.find((a) => a.reward === id);

// The whole collection: every outfit, world, decoration and sticker. When it is complete, a window says so, once
// (nothing more to give: the presents after it are bonus hearts)
const collectionFull = () => WEAR.every(ownsWear) && PLACES.every((pl) => S.level >= pl.level) && DECOR.every((d) => S.level >= d.level)
  && STICKERS.every((s) => S.stickers.includes(s));
function collectionCheck() {
  if (S.collectionDone || turbo() || !S.onboarded || !collectionFull()) return;
  S.collectionDone = true;
  st.save(S);
  showModal({ art: luckyPic({ face: 'laugh', wear: S.wear }), title: tr('collFullTitle'), text: tr('collFullText', { n: STICKERS.length }),
    buttons: [{ label: tr('hooray'), onClick: () => { confetti(); sfx.levelup(); setTimeout(() => sayAuto(fresh(LUCKY.collectionFull)), 400); } }] });
}

// Counters for badges
function stat(key, n = 1) {
  S.stats[key] = (S.stats[key] || 0) + n;
  checkBadges();
}

function statValue(key) {
  switch (key) {
    case 'days': return S.days.length;
    case 'level': return S.level;
    case 'belt': return S.belt;
    case 'stickers': return S.stickers.length;
    case 'albums': return S.albumsDone.length;
    case 'jokes': return S.jokes.heard.length;
    case 'twisters': return S.twisters.heard.length;
    case 'idioms': return S.idioms.heard.length;
    case 'worlds': return S.worldsSeen.length;
    default: return S.stats[key] || 0;
  }
}

let badgeToastAt = 0;
function checkBadges() {
  for (const [id, e, name, key, goal] of BADGES) {
    if (S.badges.includes(id) || statValue(key) < goal) continue;
    S.badges.push(id);
    // show badges one at a time, not all at once
    const at = Math.max(Date.now(), badgeToastAt + 3600);
    badgeToastAt = at;
    setTimeout(() => { sfx.sparkle(); toast(`<b>${e} ${tr('newBadge')}</b><br>${L(name)}`, 3400); }, at - Date.now());
  }
}

// Two times in three the sticker comes from the album closest to done, so the albums fill up one after another
// (drawn evenly from all of them, the six albums would finish within a few days of each other)
function giveSticker() {
  const left = STICKERS.filter((s) => !S.stickers.includes(s));
  if (!left.length) return null;
  let pool = left;
  if (Math.random() < 2 / 3) {
    const open = ALBUMS.map((a) => a.stickers.filter((x) => left.includes(x))).filter((miss) => miss.length);
    const fewest = Math.min(...open.map((miss) => miss.length));
    const near = open.filter((miss) => miss.length === fewest).flat();
    if (near.length) pool = near;
  }
  const s = pick(pool);
  S.stickers.push(s);
  checkAlbums();
  checkBadges();
  return s;
}

// A complete album gives a special item
function checkAlbums() {
  for (const a of ALBUMS) {
    if (S.albumsDone.includes(a.id) || !a.stickers.every((x) => S.stickers.includes(x))) continue;
    S.albumsDone.push(a.id);
    if (!S.owned.includes(a.reward)) S.owned.push(a.reward);
    const w = WEAR_BY_ID[a.reward];
    setTimeout(() => showModal({ custom: (host, done) => revealGift(host, { title: tr('albumDone', { x: L(a.name) }), rewards: [{ kind: 'outfit', ...w, rarity: 'gold' }], line: LUCKY.albumDone }, done) }), 1500);
  }
}

// Present: a sticker (common), an item (rare) or a special item (gold)
function rollGift(rareChance, goldChance) {
  const r = Math.random();
  const missing = (rar) => WEAR.filter((w) => w.rarity === rar && !albumReward(w.id) && !S.owned.includes(w.id));
  const pickWear = (rar) => { const list = missing(rar); return list.length ? { kind: 'outfit', ...pick(list), rarity: rar } : null; };
  const g = (r < goldChance && pickWear('gold')) || (r < goldChance + rareChance && pickWear('rare'));
  if (g) { S.owned.push(g.id); return g; }
  const s = giveSticker();
  return s ? { kind: 'sticker', id: s, name: P('rvSticker') } : { kind: 'hearts', id: '💖', name: P('rvHearts') };
}

// ---------- rendering ----------

function moodFace() {
  if (tempFace && Date.now() < tempFaceUntil) return tempFace;
  const p = S.pet;
  if (p.energy < 30) return 'tired';
  if (Math.min(p.hunger, p.fun, p.clean) < 30) return 'sad';
  return 'ok';
}

function renderLucky(force = false) {
  const face = moodFace();
  const look = JSON.stringify(wornNow()) + S.belt;
  if (!force && face === shownFace && look === shownOutfit) return;
  const sameLook = look === shownOutfit;
  shownFace = face;
  shownOutfit = look;
  // A new expression swaps only the eyes and the mouth: the ears, paws and body keep their running animations
  if (!force && sameLook && ui.luckyArt && art.setLuckyFace(ui.luckyArt, face)) return;
  // the picture is redrawn; the props layers stay: behind him (a cape) and on top (sunglasses, umbrella…)
  if (!ui.luckyArt) {
    ui.lucky.innerHTML = '<svg class="l-back" viewBox="0 0 200 210" aria-hidden="true"></svg><div class="l-art"></div><svg class="l-props" viewBox="0 0 200 210" aria-hidden="true"></svg>';
    [ui.propsBack, ui.luckyArt, ui.props] = ui.lucky.children;
  }
  ui.luckyArt.innerHTML = luckyArt({ face, wear: wornNow() });
  ui.lucky.classList.toggle('has-hat', !!wornNow()?.head);
}

const STAT_ICONS = { hunger: '🥕', fun: '🎈', clean: '🫧', energy: '⚡' }; // 💗 is the level's hearts

function buildStats() {
  ui.stats.innerHTML = Object.keys(STAT_ICONS).map((k) => `<div class="stat" data-k="${k}">
    <span class="s-ico">${STAT_ICONS[k]}</span><div class="s-body"><span class="s-name">${tr(k)}</span><div class="s-bar"><i></i></div></div></div>`).join('');
}

// Called every second: a bar is touched only when its whole-number value changes (each change animates)
function renderStats() {
  ui.stats.querySelectorAll('.stat').forEach((row) => {
    const v = Math.round(S.pet[row.dataset.k]);
    if (row.v === v) return;
    row.v = v;
    row.querySelector('i').style.width = v + '%';
    row.classList.toggle('low', v < 35);
  });
}

function renderTop() {
  const icon = (EV && EV.stage >= 3 ? EV.icon : '💗') + ' ', badge = $('#lvlCard .lvl-badge').firstChild;
  if (badge.nodeValue !== icon) badge.nodeValue = icon;
  $('#lvlNum').textContent = S.level;
  $('#lvlLabel').textContent = tr('lv');
  $('#lvlBar').style.width = Math.round((S.hearts / st.levelNeed(S.level)) * 100) + '%';
  if (renderTop.belt !== S.belt) { renderTop.belt = S.belt; $('#beltChip').innerHTML = art.belt(BELTS[S.belt].color, 44); }
  $('#turboBadge').hidden = !turbo();
}

const ACTIONS = [
  { id: 'feed', e: '🥕', fn: () => openFeed() },
  { id: 'play', e: () => (EV && EV.stage >= 3 ? EV.icon : '🎈'), fn: () => openPlay() },
  { id: 'wash', e: '🫧', fn: () => startWash() },
  { id: 'dojo', e: '🥷', fn: () => openDojo() },
  { id: 'collection', e: '🎀', fn: () => openCollection() },
];

function buildActions() {
  ui.actions.innerHTML = ACTIONS.map((a) => `<button class="act" data-id="${a.id}"><span class="a-ico">${typeof a.e === 'function' ? a.e() : a.e}</span><span class="a-name">${tr(a.id)}</span></button>`).join('');
  ui.actions.querySelectorAll('.act').forEach((b) => {
    b.onclick = () => {
      finishWash(); // Wash looks like the main screen: a button there ends the wash and does its thing
      if (mode !== 'main') return;
      sfx.tap();
      ACTIONS.find((a) => a.id === b.dataset.id).fn();
    };
  });
}

function renderBg() {
  ui.bg.innerHTML = art.scene(S.bg) + holidayLayers(S.bg);
  ui.hunt.innerHTML = EV ? art.huntScene(EV.id, S.bg, EV.stage, EV.days <= 7) : '';
  antics.refreshEggs();
  shownSky = null;
  applyNinjaLook();
}

function goPlace(id) {
  S.bg = id;
  if (!S.worldsSeen.includes(id)) { S.worldsSeen.push(id); checkBadges(); }
  renderBg();
  renderDecor();
}

// ---------- holidays (events.js): the same game, decorated for a few weeks before each holiday ----------

let EV = null; // the holiday that is on (with its stage), or null
// who drops the daily surprise and what Tali rides in on while a holiday is on
const HOLIDAY_CARRIER = { halloween: '🦇', christmas: '🎅', newyear: '🎅', birthday: '🎈', valentine: '🕊️', patrick: '🐦', easter: '🐣', songkran: '🦜', ukraine: '🕊️' };
const HOLIDAY_RIDE = { halloween: '🧹', christmas: '🛷', newyear: '🛷', birthday: '🛼', songkran: '🛺' };
const SEASON_HAT = { halloween: 'witchHat', christmas: 'santaHat', newyear: 'partyHat', birthday: 'bdayHat', valentine: 'heartBand', patrick: 'leprechaunHat', easter: 'flowerCrown',
  songkran: 'goggles', ukraine: 'vinok' };
const HOLIDAY_ONLY = holidayOnly([...PLACES.flatMap((pl) => pl.props), ...STICKERS]);
const holidayLayers = (world) => (EV ? art.eventScene(EV.id, world, EV.stage, EV.days <= 7) + art.eventTop(EV.id, EV.stage) : '');

function currentEvent() {
  if (!S.settings.holidays) return null;
  if (S.eventPreview) return eventPreview(S.eventPreview);
  return eventOn(new Date());
}

// Called at start and every minute: when the holiday or its stage changes, redecorate
function updateEvent(force = false) {
  const keyOf = (e) => (e ? e.id + e.stage + (e.days <= 7 ? 'w' : '') : ''); // the last week brings a few more things
  const ev = currentEvent(), key = keyOf(ev);
  if (!force && key === keyOf(EV)) { EV = ev; renderEventBtn(); antics.refreshEggs(); keptPresent(); nicholasPresent(); return; } // a new day: the days to go and the hunt
  EV = ev;
  const b = document.body;
  [...b.classList].filter((c) => c.startsWith('ev-')).forEach((c) => b.classList.remove(c));
  if (ev) {
    b.classList.add('ev-' + ev.id);
    for (let i = 1; i <= ev.stage; i++) b.classList.add('ev-s' + i);
    b.style.setProperty('--ev-icon', `"${ev.icon}"`);
  } else b.style.removeProperty('--ev-icon');
  if (ui.props) antics.setSticky('season', ev && ev.stage >= 3 ? SEASON_HAT[ev.id] : null);
  buildActions();
  renderEventBtn();
  renderBg();
  renderDecor();
  renderTop();
  if (mode === 'sleep') renderSleep(true);
  if (mode === 'edit') renderTray();
  keptPresent();
  nicholasPresent();
}

// ---------- the holiday calendar: one window a day until the holiday; the holiday's own window holds a present ----------
const CAL_TREATS = {
  halloween: ['🍬', '🍭', '🍫', '🎃', '👻', '🦇', '🕸️', '🧙', '🌙', '🧹'],
  christmas: ['🎁', '🍪', '⛄', '🔔', '🧦', '⭐', '🦌', '🎄', '❄️', '🕯️'],
  newyear: ['🎉', '✨', '🎈', '🎆', '🍰', '🎊', '🕛', '🪅'],
  birthday: ['🧁', '🍰', '🎈', '🎁', '🍭', '🎉', '🥳', '🎀'],
  valentine: ['💌', '🍫', '🌹', '💝', '🧸', '💘', '🍓'],
  patrick: ['🍀', '🪙', '🌈', '🎩', '🎻', '☘️', '🥔'],
  easter: ['🥚', '🐣', '🌷', '🐰', '🧺', '🦋', '🐑'],
  songkran: ['🥭', '🍍', '🍉', '🍌', '🌺', '💦', '🐘', '🌴'],
  ukraine: ['🌻', '🌾', '🍒', '🥟', '🍯', '🍎', '🐝', '🕊️'],
};
// the season's days, from the first day of decorations to the holiday (date arithmetic, so a clock change can't shift it)
function calendarDays(ev) {
  const n = new Date(), t0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const target = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + ev.days);
  const days = [];
  for (let k = ev.lead; k >= 0; k--) {
    const d = new Date(target.getFullYear(), target.getMonth(), target.getDate() - k);
    days.push({ key: st.dayKey(d.getTime()), day: d.getDate(), offset: Math.round((d - t0) / 864e5), big: k === 0 });
  }
  return { id: ev.id + '-' + target.getFullYear(), ev: ev.id, days };
}
const calTreat = (cal, d) => { const ev = EVENT_BY_ID[cal.ev], list = CAL_TREATS[cal.ev] || ev.stickers; return d.big ? ev.icon : list[st.hash(cal.id + d.key) % list.length]; };
// A window opens on its day or any day after: missed ones wait for her (the hearts keep their daily cap)
const calOpenable = (d, opened) => d.offset <= 0 && !opened.includes(d.key);

function renderEventBtn() {
  const b = $('#eventBtn');
  if (!b) return;
  b.hidden = !(EV && EV.stage >= 3);
  if (b.hidden) return;
  const cal = calendarDays(EV), opened = S.calendar[cal.id] || [];
  // it shines while today's window or the holiday's own one is waiting (missed ordinary ones just wait quietly)
  const waiting = cal.days.some((d) => (d.offset === 0 || d.big) && calOpenable(d, opened));
  const html = `${EV.icon}<b>${EV.days > 0 ? EV.days : '!'}</b>`;
  if (b.innerHTML !== html) b.innerHTML = html;
  b.classList.toggle('waiting', waiting);
}

function openCalendar() {
  if (!EV || mode !== 'main') return;
  const cal = calendarDays(EV), opened = (S.calendar[cal.id] ||= []), today = st.today(S).date;
  const head = EV.days > 0 ? tr('calDays', { n: EV.days }) : EV.days > -(EV.span || 1) ? tr('calToday', { x: L(EV.today || EV.name) }) : tr('calAfter');
  const html = `<p class="muted center cal-head">${head}<br><small>${tr('calHint')}</small></p>
    <div class="cal-grid">${cal.days.map((d) => {
      const open = opened.includes(d.key), now = d.key === today, can = calOpenable(d, opened);
      const cls = open ? 'open' : now ? 'now' : can ? 'missed' : 'future';
      return `<button class="cal-day ${cls}${d.big ? ' big' : ''}" data-k="${d.key}" ${can ? '' : 'disabled'}><span class="cd-num">${d.day}</span><span class="cd-in">${open ? calTreat(cal, d) : can ? '🎁' : d.big ? EV.icon : '🔒'}</span></button>`;
    }).join('')}</div>${opened.includes(today) ? `<p class="done-note center">✅ ${tr('calOpened')}</p>` : ''}`;
  openSheet('📅 ' + tr('calTitle'), html, (root) => {
    root.querySelectorAll('.cal-day.now, .cal-day.missed').forEach((b) => { b.onclick = () => openWindow(b, cal); });
    // on a small phone today's window (or the holiday's own) may be below the fold
    (root.querySelector('.cal-day.now') || root.querySelector('.cal-day.big.missed'))?.scrollIntoView({ block: 'center' });
  });
}

// The window the button stands for (not "today": the sheet may stay open past midnight)
function openWindow(btn, cal) {
  const opened = (S.calendar[cal.id] ||= []), d = cal.days.find((x) => x.key === btn.dataset.k);
  if (!d || !calOpenable(d, opened)) return;
  opened.push(d.key);
  // the holiday's own window holds a real present: chosen and saved now, shown once the window is open
  const g = d.big ? rollGift(0.4, 0.15) : null;
  btn.disabled = true;
  btn.classList.remove('now', 'missed');
  btn.classList.add('opening');
  sfx.sparkle();
  setTimeout(() => { btn.classList.remove('opening'); btn.classList.add('open'); btn.querySelector('.cd-in').textContent = calTreat(cal, d); sfx.happy(); confetti(); }, 380);
  const res = addH(d.big ? 5 : 2, 'calendar', d.big ? 5 : 2);
  const greeted = st.today(S).holidayHi === cal.ev; // the day's greeting is said already: the window has its own line
  say(fresh(d.big && !greeted && LUCKY.holiday[cal.ev]?.greet ? LUCKY.holiday[cal.ev].greet : LUCKY.holidayThings.calendar));
  if (g) setTimeout(() => { closeSheet(); showModal({ custom: (host, done) => revealGift(host, { title: tr('calGift'), rewards: [g], line: LUCKY.levelUp }, done) }); }, 1500);
  stat('calendar');
  award(res);
  st.save(S);
  renderEventBtn();
}

// A holiday present left in its window waits a week after the holiday: on the next visit Lucky hands it over
function keptPresent() {
  if (!S.settings.holidays || !S.onboarded || mode !== 'main') return;
  if (EV?.id === 'birthday' && EV.days === 0 && S.bdCard !== new Date().getFullYear()) return; // her birthday comes first
  for (const { ev, date } of justPassed()) {
    if (EV && EV.id === ev.id) continue; // still on: its window is in the calendar
    const id = ev.id + '-' + date.getFullYear(), key = st.dayKey(date.getTime()), opened = (S.calendar[id] ||= []);
    if (opened.includes(key)) continue;
    opened.push(key);
    const g = rollGift(0.4, 0.15);
    st.save(S);
    showModal({ custom: (host, done) => revealGift(host, { title: tr('calKept'), rewards: [g], line: LUCKY.levelUp }, done) });
    return;
  }
}

// What Lucky says on arriving in a world (the dojo greets him with its gong)
const ARRIVE = { ...LUCKY.arrive, candy: LUCKY.candy, dojo: LUCKY.gong };
function arrive(id) {
  if (id === 'dojo') sfx.gong();
  say(fresh(ARRIVE[id] || LUCKY.place));
}

function applyLang() {
  document.documentElement.lang = S.lang;
  buildStats();
  renderStats();
  buildActions();
  renderTop();
  if (mode === 'sleep') renderSleep(true);
}

// ---------- bottom sheet ----------

function openSheet(title, html, mount) {
  cancelAsk();
  antics.end();
  ui.sheet.innerHTML = `<div class="sheet-head"><h2>${title}</h2><button class="x" aria-label="close">✕</button></div><div class="sheet-body">${html}</div>`;
  ui.sheetWrap.classList.add('show');
  sheetOpen = true;
  ui.sheet.querySelector('.x').onclick = closeSheet;
  mount?.(ui.sheet);
}

function closeSheet() {
  ui.sheetWrap.classList.remove('show');
  sheetOpen = false;
  stopJokeBook();
  // clear the content after the closing animation so hidden scenes don't drain the battery
  setTimeout(() => { if (!sheetOpen) ui.sheet.innerHTML = ''; }, 400);
}

ui.sheetWrap.addEventListener('click', (e) => { if (e.target === ui.sheetWrap) closeSheet(); });

// Main-language text with a small translation
const bi = (pair) => `<div class="bi"><div class="bi-main">${L(pair)}</div>${S.settings.translate ? `<div class="bi-sub">${say2(pair, other())}</div>` : ''}</div>`;

// ---------- feeding ----------

function openFeed() {
  const T0 = st.today(S);
  openSheet('🥕 ' + tr('feedTitle'), `<div class="food-grid">${FOODS.map((f) => `<button class="food" data-id="${f.id}">
      <span class="fe">${f.emoji}</span><span class="fn">${L(f.name)}</span>${f.treat ? '<i class="treat">★</i>' : ''}</button>`).join('')}</div>
    <p class="muted center">★ ${tr('treatsLeft', { n: T0.treats })}</p>`,
  (root) => root.querySelectorAll('.food').forEach((b) => {
    b.onclick = () => { closeSheet(); feed(FOODS.find((f) => f.id === b.dataset.id)); };
  }));
}

let lastFeedAt = 0;

function hiccups() {
  if (mode !== 'main') return;
  say(fresh(LUCKY.hiccup));
  [0, 700, 1400].forEach((t) => setTimeout(() => { hop(ui.lucky, 'hic'); sfx.hic(); }, t));
}

function feed(f) {
  const T0 = st.today(S);
  if (S.pet.hunger >= 95) return say(fresh(LUCKY.full));
  if (f.treat && T0.treats >= 3 && !turbo()) return say(fresh(LUCKY.noTreats));
  if (f.treat) T0.treats++;
  const hungerBefore = S.pet.hunger;
  const [x1, y1] = luckyPoint(0.5, 0.55);
  const r = ui.scene.getBoundingClientRect();
  const s = document.createElement('span');
  s.className = 'fly';
  s.textContent = f.emoji;
  ui.fx.appendChild(s);
  s.animate([
    { transform: `translate(${r.width / 2}px, ${r.height}px) scale(1.4)` },
    { transform: `translate(${x1}px, ${y1}px) scale(.5)`, opacity: 0.3 },
  ], { duration: 650, easing: 'cubic-bezier(.3,.7,.4,1)' }).onfinish = () => {
    s.remove();
    st.boost(S, 'hunger', f.hunger);
    st.boost(S, 'fun', f.fun);
    setTemp('eat', 1600);
    sfx.yum();
    heartsBurst(x1, y1 - 40, 2);
    const quick = Date.now() - lastFeedAt < 25000;
    lastFeedAt = Date.now();
    stat('feeds');
    const bite = f.treat && T0.treats >= 3 && maybeIdiom('treat', 0.5);
    const ms = bite ? 4000 : say(fresh(hungerBefore < 30 ? LUCKY.feedStarving : hungerBefore > 80 ? LUCKY.feedNearlyFull
      : Math.random() < 0.6 && LUCKY.food[f.id] ? LUCKY.food[f.id] : LUCKY.eat));
    // Ate too fast: hiccups
    if (quick || Math.random() < 0.12) setTimeout(hiccups, ms + 300);
    award(addH(2, 'feed', 10));
    renderStats();
    setTimeout(() => toast(`<b>💡 ${tr('didYouKnow')}</b>${bi(f.fact)}`, 6000), (ms || 500) + 400); // after his line
  };
}

// ---------- washing ----------

let washGain = 0, washIdle = 0, washDown = false, washLast = 0, cleanBefore = 100;

// Leaving the scene for Wash, Decorate, a game or a mission: Lucky's scene, a question, a chat and a waiting line end here
function leaveMain(next) {
  cancelAsk();
  antics.end();
  antics.undark();
  stopChain();
  pending = null;
  mode = next;
}

function startWash() {
  leaveMain('wash');
  washGain = 0;
  cleanBefore = S.pet.clean;
  ui.scene.classList.add('washing');
  say(P('washHint'));
  clearTimeout(washIdle);
  washIdle = setTimeout(finishWash, 8000);
}

function washMove(e) {
  if (mode !== 'wash' || !washDown) return;
  const now = Date.now();
  if (now - washLast < 45) return;
  washLast = now;
  const lr = ui.lucky.getBoundingClientRect();
  if (e.clientX < lr.left || e.clientX > lr.right || e.clientY < lr.top || e.clientY > lr.bottom) return;
  const [x, y] = sceneXY(e);
  floatFx(x, y, '', 'soap');
  if (Math.random() < 0.3) sfx.bubble();
  st.boost(S, 'clean', 1.6);
  washGain += 1.6;
  renderStats();
  clearTimeout(washIdle);
  washIdle = setTimeout(finishWash, 3500);
  if (S.pet.clean >= 99) finishWash();
}

function finishWash() {
  if (mode !== 'wash') return;
  clearTimeout(washIdle);
  mode = 'main';
  ui.scene.classList.remove('washing');
  if (washGain >= 8) {
    const [x, y] = luckyPoint(0.5, 0.3);
    for (let i = 0; i < 5; i++) setTimeout(() => floatFx(x + Math.random() * 120 - 60, y + Math.random() * 60, '✨', 'spark'), i * 80);
    sfx.sparkle();
    setTemp('happy', 1500);
    say(fresh(cleanBefore < 30 ? LUCKY.washDirty : LUCKY.clean));
    stat('washes');
    award(addH(3, 'wash', 6));
  }
}

ui.scene.addEventListener('pointerdown', (e) => {
  if (mode === 'edit' && !drag && !e.target.closest('.pl, .edit-tools') && editSel >= 0) { editSel = -1; renderDecor(); }
  washDown = true;
  washMove(e);
});
ui.scene.addEventListener('pointermove', washMove);
window.addEventListener('pointerup', () => { washDown = false; });
window.addEventListener('pointercancel', () => { washDown = false; });

// ---------- taps ----------

let tapCount = 0, tapTimes = [], earTimes = [], tickledAt = 0, answeredAt = 0;
const partOf = (t) => (t.closest('.nose') ? 'nose' : t.closest('.ear') ? 'ear' : t.closest('.feet') ? 'feet' : t.closest('.paw') ? 'paw'
  : t.closest('.tail') ? 'tail' : t.closest('.tummy') ? 'tummy' : t.closest('.head') ? 'head' : 'body');

// Taps on Lucky: what happens depends on where and how (tap, double tap, long press, stroke, swipe).
// How he answers is tricks.js (several ways for each, now and then a rare big trick); here is what it means for the game.
gestures(ui.lucky, (t) => (mode === 'main' ? ui.lucky : null), (kind, _el, p) => {
  if (mode !== 'main') return;
  const part = partOf(p.target);
  if (kind === 'press') { tapWait = true; try { return luckyPress(part, p); } finally { tapWait = false; } }
  if (kind === 'double') { clearTimeout(tapWord); tapWord = 0; } // the single tap's word gives way
  if (antics.luckyTap() || ask || Date.now() - answeredAt < 700) return;
  // in the middle of a scene or a trick he only shows he felt it (moves of his own would clash with it)
  if (antics.busy()) { if (kind !== 'tap') feltIt(p); return; }
  if (kind === 'tap' && part === 'nose') noseTap();
  if (kind === 'double' && Date.now() - tickledAt > 200) luckyDouble(part);
  if (kind === 'long') luckyLong(part);
  if (kind === 'stroke') stroke(p);
  if (kind === 'swipe') swipe(p);
}, { stroke: true, swipe: true });
ui.scene.addEventListener('contextmenu', (e) => e.preventDefault()); // long presses are gestures here

function feltIt(p) {
  sfx.pop();
  heartsBurst(...sceneXY(p), 2);
  st.boost(S, 'fun', 1);
  renderStats();
}

function luckyPress(part, p) {
  if (antics.luckyTap()) return; // found him hiding, or his trick wants the tap (the statue laughs, the grin comes back)
  if (ask?.touch) { if (!p.second) touchAnswer(p); return; }
  if (ask) { sfx.pop(); hop(ui.lucky); heartsBurst(...sceneXY(p), 2); return; }
  if (antics.busy()) { if (!p.second) feltIt(p); return; }
  if (part === 'ear') { ears(); return; }
  if (part === 'nose') return; // a tap sneezes, a double tap boops
  // Many quick taps: tickling
  const now = Date.now();
  tapTimes.push(now);
  while (tapTimes.length && now - tapTimes[0] > 3000) tapTimes.shift();
  if (tapTimes.length >= 6) { tapTimes = []; tickledAt = now; if (!maybeIdiom('fastTaps', 0.3)) tickle(); return; }
  if (p.second) return; // the second tap of a double tap
  // feet, tail and paws: a giggle, a wag, a high five
  if (part === 'feet' || part === 'tail' || part === 'paw') {
    const w = tricks.touch('tap', part, p);
    if (w.say) antics.line(w.say, part === 'feet' ? 0.5 : 0.7, 15000);
    st.boost(S, 'fun', 2);
    renderStats();
    return;
  }
  pet(part, p);
}

function pet(part, p) {
  const [x, y] = sceneXY(p);
  // Sulks when he badly needs something (except joy: petting is exactly what helps)
  const need = st.lowestNeed(S.pet);
  if (tier() === 'low' && LUCKY.sulk[need] && S.pet[need] < 30 && Math.random() < 0.35) { sulk(need); return; }
  sfx.pop();
  const w = tricks.touch('tap', part, p); // a pat, a clap, a wave, a wink… or now and then a rare trick
  heartsBurst(x, y - 20);
  st.boost(S, 'fun', 3);
  tapCount++;
  if (tapCount % 3 === 0) award(addH(1, 'pet', 8));
  // every other tap a word (a rare trick and the helicopter ears say their own)
  if (tapCount % 2 === 1 && !w.special && w.key !== 'heli') {
    const own = w.say ? antics.line(w.say, 0.8, 15000) : part === 'head' ? antics.line('pat', 0.5, 20000) : part === 'tummy' ? antics.line('giggle', 0.7, 20000) : 0;
    if (!own) say(fresh(byTier(LUCKY.tapLow, LUCKY.tap, LUCKY.tapMax)));
  }
  renderStats();
}

// A tap on his nose: usually a sneeze, sometimes one that never comes, or three in a row
function noseTap() {
  const w = tricks.touch('tap', 'nose');
  if (w.say) say(fresh(w.say));
}

const BINKY_LIKE = ['binky', 'backflip', 'ninjajump', 'starjump', 'spin'];
function luckyDouble(part) {
  if (part === 'ear') return; // ear taps count towards the helicopter
  const w = tricks.touch('double', part);
  if (w.say) antics.line(w.say, w.key === 'binky' ? 1 : 0.9, w.key === 'binky' ? 0 : 12000);
  if (part === 'tummy') { st.boost(S, 'fun', 2); renderStats(); }
  if (BINKY_LIKE.includes(w.key)) stat('binkies');
}

function luckyLong(part) {
  const w = tricks.touch('long', part);
  if (part === 'ear') {
    setTemp('happy', 2500);
    hop(ui.lucky, 'melt');
    sfx.purr();
    heartsBurst(...luckyPoint(0.25, 0.35), 4);
    st.boost(S, 'fun', 4);
    award(addH(1, 'pet', 8));
    antics.line('earRub', 1, 10000);
  } else if (part === 'nose') antics.line(w.say || 'kiss', 1, 10000);
  else if (part === 'tummy') {
    heartsBurst(...luckyPoint(0.5, 0.7), 5);
    st.boost(S, 'fun', 4);
    if (w.say) antics.line(w.say, 1, 20000);
  } else if (part === 'feet') thump();
  else if (part === 'tail' || part === 'paw') { if (w.say) antics.line(w.say, 1, 15000); st.boost(S, 'fun', 2); }
  else { hug(w); return; }
  renderStats();
}

// Two quick thumps: that's how bunnies warn each other
function thump() {
  setTemp('ok', 900);
  hop(ui.lucky, 'thump');
  sfx.thump();
  const [x, y] = luckyPoint(0.5, 0.95);
  fxAt(x, y, ['💨'], 3, 'spark');
  // the thump gives Tali a fright ("Eek! Who's knocking?"); without him Lucky explains it
  const dogEl = dogHere && ui.dog.querySelector('.dog-body');
  if (dogEl) setTimeout(() => { hop(dogEl, 'hop'); sfx.bark(); say(fresh(DOG.thumped), 'dog'); }, 300);
  else antics.line('thump', 0.9);
}

// Stroking Lucky with a finger: he purrs (bunnies really do, by gently grinding their teeth), melts, stretches…
function stroke(p) {
  const w = tricks.touch('stroke', partOf(p.target), p);
  const [x, y] = sceneXY(p);
  heartsBurst(x, y, 3);
  st.boost(S, 'fun', 3);
  stat('strokes');
  if (w.say) antics.line(w.say, 0.9, 10000);
  renderStats();
}

// A quick fling across him: up he jumps, down he goes flat as a pancake, sideways he slides
function swipe(p) {
  const w = tricks.touch('swipe', 'body', p);
  if (w.say) antics.line(w.say, 0.8, 12000);
  st.boost(S, 'fun', 2);
  renderStats();
}

function sulk(need) {
  sfx.note(196);
  hop(ui.lucky, 'sulk');
  setTemp('sad', 1500);
  say(fresh(LUCKY.sulk[need]));
}

// A long press: a hug (or one of its other ways: a bunny loaf, a cosy doze, melting with love)
function hug(w = { key: 'hug' }) {
  const [x, y] = luckyPoint(0.5, 0.35);
  if (w.key === 'hug') { sfx.happy(); hop(ui.lucky, 'hug'); setTemp('happy', 1800); }
  heartsBurst(x, y, 7);
  st.boost(S, 'fun', 5);
  award(addH(1, 'pet', 8));
  if (w.key === 'hug') {
    // now and then the hug is so tight he gets squashed: "Oof! Too tight!"
    const tight = Math.random() < 0.12;
    say(fresh(tight ? LUCKY.antics.squeeze : byTier(LUCKY.hugLow, LUCKY.hug, LUCKY.hugMax)));
    if (tight) setTimeout(() => { if (mode === 'main' && !antics.busy()) { hop(ui.lucky, 'squash', 700); heartsBurst(x, y, 6); sfx.boing(); } }, 900);
  } else if (!w.special) say(fresh(w.say || byTier(LUCKY.hugLow, LUCKY.hug, LUCKY.hugMax)));
  stat('hugs');
  renderStats();
}

function binky(silent = false) {
  sfx.sparkle();
  hop(ui.lucky, 'binky');
  setTemp('laugh', 1400);
  const [x, y] = luckyPoint(0.5, 0.2);
  for (let i = 0; i < 4; i++) setTimeout(() => floatFx(x + Math.random() * 100 - 50, y, '✨', 'spark'), i * 90);
  if (!silent) say(fresh(LUCKY.binky));
  stat('binkies');
}

function ears() {
  const now = Date.now();
  earTimes.push(now);
  while (earTimes.length && now - earTimes[0] > 2500) earTimes.shift();
  // Three quick ear taps: helicopter ears
  if (earTimes.length >= 3) { earTimes = []; helicopter(); return; }
  sfx.tap();
  setTemp('laugh', 900); // face first: Safari doesn't animate SVG parts re-rendered after the class was added
  ui.lucky.querySelectorAll('.ear').forEach((x) => hop(x, 'wiggle'));
  react('ears', LUCKY.ears);
}

function sneeze() {
  setTemp('sleep', 500);
  sfx.note(880);
  setTimeout(() => {
    sfx.sneeze();
    hop(ui.lucky, 'sneeze');
    setTemp('laugh', 1400);
    const [x, y] = luckyPoint(0.5, 0.45);
    fxAt(x, y, ['💨', '✨', '💫'], 5, 'spark');
    say(fresh(LUCKY.sneeze));
    stat('sneezes');
  }, 450);
}

function helicopter() {
  sfx.whirr();
  // Face first, then the effect: Safari doesn't start CSS animations on SVG parts that are
  // re-rendered after the class was added, so the ears would stay still on iPhone.
  setTemp('laugh', 2400);
  hop(ui.lucky, 'heli');
  say(fresh(LUCKY.heli));
}

function tickle() {
  sfx.happy();
  hop(ui.lucky, 'roll');
  setTemp('laugh', 2200);
  const [x, y] = luckyPoint(0.5, 0.4);
  heartsBurst(x, y, 6);
  fxAt(x, y, ['😂', '💕'], 3, 'spark');
  st.boost(S, 'fun', 6);
  award(addH(1, 'pet', 8));
  // sometimes he laughs so much he flops over: "That's it… I fell over laughing!"
  const flop = Math.random() < 0.2;
  say(fresh(flop ? LUCKY.antics.flopLaugh : LUCKY.tickle));
  if (flop) setTimeout(() => { if (mode === 'main') hop(ui.lucky, 'flop', 2600); }, 1400);
  stat('tickles');
  renderStats();
}

// When happy, Lucky sometimes chases his tail
function chaseTail() {
  hop(ui.lucky, 'chase');
  setTemp('laugh', 2200);
  sayAuto(fresh(LUCKY.tail));
}

// Need cues: flies when dirty, a rumbling tummy when hungry
let nextRumbleAt = 0;
function needCues(now) {
  const dirty = mode === 'main' && S.pet.clean < 30;
  let flies = ui.scene.querySelector('.flies');
  if (dirty && !flies) { flies = document.createElement('div'); flies.className = 'flies'; flies.innerHTML = '<span>🪰</span><span>🪰</span>'; ui.scene.appendChild(flies); }
  if (!dirty && flies) flies.remove();
  if (mode === 'main' && S.pet.hunger < 25 && userActive() && now > nextRumbleAt && now >= busyUntil && !antics.busy() && !sheetOpen && !modalOpen) {
    nextRumbleAt = now + 45e3 + Math.random() * 30e3;
    hop(ui.lucky, 'rumble');
    sfx.rumble();
    const [x, y] = luckyPoint(0.5, 0.75);
    floatFx(x, y, '〰️', 'spark');
  }
}

// ---------- scene: tappable details ----------

function fxAt(x, y, list, n, cls) {
  for (let i = 0; i < n; i++) setTimeout(() => floatFx(x + Math.random() * 60 - 30, y + Math.random() * 20, pick(list), cls), i * 70);
}

// Tappable details of the worlds live in antics.js

// Now and then a visitor flies by and can be caught. Who comes depends on the world (and the time of day);
// each one has its own way of flying and its own ending, and a rare one now and then.
const VISITORS = [
  { e: '🦋', w: 3, in: 'garden dojo candy irish castle beach', path: 'flutter', end: ['nose', 'ear', 'circle', 'miss', 'family'] },
  { e: '🐞', w: 2, in: 'garden irish dojo castle', path: 'flutter', end: ['spots'] },
  { e: '🐝', w: 2, in: 'garden candy irish castle', path: 'zigzag', end: ['bee'] },
  { e: '🐦', w: 2, in: 'garden irish winter castle dojo', path: 'glide', end: ['sing', 'feather'], flip: true },
  { e: '🐠', w: 3, in: 'beach', path: 'jump', end: ['splash', 'release'], flip: true },
  { e: '❄️', w: 3, in: 'winter', path: 'fall', end: ['tongue', 'flakes'] },
  { e: '🌠', w: 3, in: 'space', path: 'streak', end: ['wish', 'starhead'] },
  { e: '🛸', w: 2, in: 'space', path: 'glide', end: ['alien', 'beam'] },
  { e: '🪁', w: 1, in: 'garden beach irish dojo castle', path: 'float', end: ['kite'] },
  { e: '🎈', w: 1, in: 'garden candy beach irish castle', path: 'rise', end: ['pop', 'ride'] },
  { e: '🍬', w: 3, in: 'candy', path: 'float', end: ['sweet', 'lolly'] },
  { e: '🦉', w: 1.5, in: 'garden irish winter castle dojo', path: 'glide', end: ['owl'], evening: true, flip: true },
  { e: '🦄', w: 0.15, in: 'all', path: 'glide', end: ['unicorn'], flip: true },
  { e: '🐉', w: 0.15, in: 'dojo castle space winter', path: 'glide', end: ['dragon'], flip: true },
];
const FLIGHT = { flutter: 11000, zigzag: 7000, glide: 9000, streak: 3200, jump: 2600, fall: 9000, float: 13000, rise: 10000 };
// holiday visitors come in every world from their stage on
const HOLIDAY_VISITORS = {
  halloween: [{ e: '🦇', w: 3, path: 'zigzag', end: ['batloop'], stage: 2 }, { e: '👻', w: 2, path: 'float', end: ['ghostboo'], stage: 3 }],
  christmas: [{ e: '❄️', w: 2, path: 'fall', end: ['tongue', 'flakes'], stage: 2 }, { e: '🎅', w: 2, path: 'glide', end: ['santa'], stage: 3 }],
  newyear: [{ e: '🎈', w: 3, path: 'rise', end: ['pop', 'ride'], stage: 3 }, { e: '❄️', w: 1, path: 'fall', end: ['tongue', 'flakes'], stage: 3 }],
  birthday: [{ e: '🎈', w: 3, path: 'rise', end: ['pop', 'ride'], stage: 3 }, { e: '🦄', w: 1, path: 'glide', end: ['unicorn'], stage: 4, flip: true }],
  valentine: [{ e: '💌', w: 3, path: 'float', end: ['love'], stage: 3 }, { e: '👼', w: 2, path: 'glide', end: ['cupid'], stage: 3, flip: true }],
  patrick: [{ e: '🍀', w: 3, path: 'flutter', end: ['luck'], stage: 2 }],
  easter: [{ e: '🐣', w: 3, path: 'jump', end: ['chick'], stage: 2 }, { e: '🦋', w: 2, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'], stage: 2 }],
  songkran: [{ e: '💧', w: 3, path: 'fall', end: ['soak'], stage: 3 }, { e: '🦋', w: 2, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'], stage: 3 }],
  ukraine: [{ e: '🕊️', w: 2, path: 'glide', end: ['dove'], stage: 3, flip: true }, { e: '🐝', w: 2, path: 'zigzag', end: ['bee'], stage: 3 },
    { e: '🦋', w: 2, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'], stage: 3 }],
};

// A flight path as keyframes in % of the scene, a little different every time
function flightPath(kind) {
  const right = Math.random() < 0.5, x0 = right ? -12 : 112, x1 = right ? 112 : -12, y = 18 + Math.random() * 28;
  const at = (t) => x0 + (x1 - x0) * t;
  const k = (x, yy) => ({ left: x + '%', top: yy + '%' });
  const n = 9, a = 5 + Math.random() * 8;
  switch (kind) {
    case 'zigzag': return { right, frames: Array.from({ length: 11 }, (_, i) => k(at(i / 10), y + (i % 2 ? a : -a))) };
    case 'glide': return { right, frames: Array.from({ length: 6 }, (_, i) => k(at(i / 5), y - Math.sin((i / 5) * Math.PI) * a)) };
    case 'streak': return { right, frames: [k(x0, 4 + Math.random() * 8), k(x1, 30 + Math.random() * 12)] };
    case 'jump': { const x = 20 + Math.random() * 60, d = right ? 14 : -14; return { right, frames: [k(x, 64), k(x + d / 2, 42), k(x + d, 64), k(x + d * 1.5, 48), k(x + d * 2, 66)] }; }
    case 'fall': { const x = 15 + Math.random() * 70; return { right, frames: Array.from({ length: 8 }, (_, i) => k(x + Math.sin(i) * 6, -8 + i * 13)) }; }
    case 'rise': { const x = 15 + Math.random() * 70; return { right, frames: Array.from({ length: 7 }, (_, i) => k(x + Math.sin(i) * 7, 96 - i * 18)) }; }
    case 'float': return { right, frames: Array.from({ length: 7 }, (_, i) => k(at(i / 6), y + Math.sin(i * 1.3) * a)) };
    default: return { right, frames: Array.from({ length: n }, (_, i) => k(at(i / (n - 1)), y + Math.sin(i * 1.7) * a + (i % 3 === 1 ? -3 : 0))) }; // flutter
  }
}

let nextVisitorAt = Date.now() + 70e3, lastVisitor = '';
function maybeVisitor(now) {
  if (now < nextVisitorAt || mode !== 'main' || sheetOpen || modalOpen || !userActive()) return;
  nextVisitorAt = now + 100e3 + Math.random() * 80e3;
  const evening = st.minutesToBed(now, S.settings) <= 120;
  const holiday = (EV && HOLIDAY_VISITORS[EV.id] || []).filter((v) => EV.stage >= v.stage).map((v) => ({ ...v, in: 'all' }));
  const pool = [...VISITORS, ...holiday].filter((v) => (v.in === 'all' || v.in.split(' ').includes(S.bg)) && (!v.evening || evening) && v.e !== lastVisitor);
  let r = Math.random() * pool.reduce((sum, v) => sum + v.w, 0);
  const v = pool.find((x) => (r -= x.w) < 0) || pool[0];
  if (!v) return;
  lastVisitor = v.e;
  const b = document.createElement('button');
  b.className = 'visitor';
  b.textContent = v.e;
  const { right, frames } = flightPath(v.path);
  if (v.flip && right) b.style.transform = 'scaleX(-1)';
  ui.scene.appendChild(b);
  const ms = FLIGHT[v.path];
  b.animate(frames, { duration: ms, easing: v.path === 'streak' || v.path === 'jump' ? 'ease-in-out' : 'linear', fill: 'forwards' });
  if (v.e === '👻') antics.kit.dark(ms); // a ghost going by: the scene goes dim
  b.onclick = (e) => {
    e.stopPropagation();
    const [x, y] = sceneXY(e);
    b.remove();
    if (v.e === '👻') antics.undark(); // the ghost is caught: the light comes back
    sfx.sparkle();
    fxAt(x, y, ['✨', '💖'], 6, 'spark');
    award(addH(1, 'bug', 5));
    stat('bugs');
    if (!antics.visitor(pick(v.end), x, y)) say(fresh(LUCKY.butterfly));
  };
  setTimeout(() => b.remove(), ms + 200);
}

// Quiet moments (no taps for a while): Lucky does real bunny things by himself - grooming, a stretch, a flop…
let nextFidgetAt = Date.now() + 40e3;
function maybeFidget(now) {
  if (now < nextFidgetAt || mode !== 'main' || sheetOpen || modalOpen || ask || chainQ.length || !windowActive() || now - lastInput < 12e3 || now < busyUntil) return;
  nextFidgetAt = now + 35e3 + Math.random() * 35e3;
  antics.fidget();
}

// Daily surprise: a present appears after a minute of play
function maybeSurprise(now, T0) {
  if (T0.surprise || ask || mode !== 'main' || sheetOpen || modalOpen || antics.busy() || !userActive() || S.session.activeMs < 60e3 || ui.scene.querySelector('.surprise')) return;
  const b = document.createElement('button');
  b.className = 'surprise';
  b.textContent = pick(EV && EV.stage >= 3 ? EV.gift : ['🎁', '🎁', '🎁', '🧺', '📦', '💝']);
  const left = 18 + Math.random() * 60;
  b.style.left = left + '%';
  b.onclick = (e) => {
    e.stopPropagation();
    const day = st.today(S);
    if (mode !== 'main' || day.surprise) { b.remove(); return; }
    day.surprise = true;
    b.remove();
    stat('surprises');
    const g = rollGift(0.35, 0.1);
    showModal({ custom: (host, done) => revealGift(host, { title: tr('surpriseTitle'), rewards: [g], line: LUCKY.levelUp }, done) });
    st.save(S);
  };
  ui.scene.appendChild(b);
  // it pops up, floats down on a parachute, is dropped by a bird or dug up from the ground
  const how = pick(['pop', 'sky', 'bird', 'dig']);
  const r = ui.scene.getBoundingClientRect(), x = (left / 100) * r.width, gy = r.height * 0.9;
  if (how === 'sky') {
    const chute = document.createElement('span');
    chute.className = 'chute';
    chute.textContent = '🪂';
    b.appendChild(chute);
    b.animate([{ bottom: '105%' }, { bottom: '5%' }], { duration: 2800, easing: 'ease-out' }).onfinish = () => chute.remove();
  } else if (how === 'bird') {
    // while a holiday is on someone else brings it: a bat, Santa, a chick…
    const bird = (EV && EV.stage >= 3 && HOLIDAY_CARRIER[EV.id]) || '🐦';
    antics.fly(bird, [-40, r.height * 0.2], [x, r.height * 0.25], 1000, { size: 34 });
    setTimeout(() => antics.fly(bird, [x, r.height * 0.25], [r.width + 40, r.height * 0.1], 1000, { size: 34 }), 1000);
    b.animate([{ bottom: '75%', opacity: 0 }, { bottom: '75%', opacity: 1, offset: 0.4 }, { bottom: '5%' }], { duration: 1900, easing: 'ease-in' });
  } else if (how === 'dig') {
    b.animate([{ transform: 'translateX(-50%) translateY(70px) scale(.3)' }, { transform: 'translateX(-50%) translateY(-12px) scale(1.1)', offset: 0.7 }, { transform: 'translateX(-50%)' }], { duration: 1100, easing: 'ease-out' });
    fxAt(x, gy, ['💨', '🌱'], 6, 'spark');
    sfx.puff();
  }
  if (!maybeIdiom('surprise', 0.35)) sayAuto(fresh(LUCKY.surprise));
}

// ---------- today's plan: a clear 'that's all for today' ----------

const PLAN = [
  ['feed', '🥕', (T0) => (T0.hearts.feed || 0) > 0, () => openFeed()],
  ['wash', '🫧', (T0) => (T0.hearts.wash || 0) > 0, () => startWash()],
  ['mission', '🥷', (T0) => T0.missionDone, () => openDojo()],
  ['phrase', '💬', (T0) => T0.phraseSeen, () => openPhrase()],
];

function renderPlan(T0) {
  const html = PLAN.map(([id, e, done]) => `<i class="${done(T0) ? 'on' : ''}">${e}</i>`).join('');
  if (html !== renderPlan.last) { renderPlan.last = html; $('#plan').innerHTML = html; }
}

function checkPlan(T0) {
  renderPlan(T0);
  if (T0.planDone || !PLAN.every(([, , done]) => done(T0)) || mode !== 'main' || modalOpen || sheetOpen || antics.busy()) return;
  T0.planDone = true;
  stat('plans');
  st.save(S);
  confetti();
  sfx.levelup();
  showModal({ art: '<div class="big-emoji">🌟</div>', title: tr('planDone'), text: '+5 💗', buttons: [{ label: tr('hooray'), onClick: () => setTimeout(() => maybeIdiom('planDone', 0.7), 300) }] });
  award(addH(5, 'plan', 5));
  setTimeout(() => say(fresh(LUCKY.planDone)), 400);
}

function openPlan() {
  const T0 = st.today(S);
  const html = `<p class="muted center">${tr('planHint')}</p><div class="plan-list">${PLAN.map(([id, e, done]) => `
    <button class="plan-item ${done(T0) ? 'on' : ''}" data-id="${id}"><span class="pi-e">${e}</span><b>${tr('plan_' + id)}</b><span class="pi-c">${done(T0) ? '✅' : '›'}</span></button>`).join('')}</div>
    ${T0.planDone ? `<p class="done-note center">🌟 ${tr('planDone')}</p>` : ''}`;
  openSheet('📋 ' + tr('planTitle'), html, (root) => root.querySelectorAll('.plan-item:not(.on)').forEach((b) => {
    b.onclick = () => { sfx.tap(); closeSheet(); PLAN.find(([id]) => id === b.dataset.id)[3](); };
  }));
}

// ---------- Lucky's questions with answer choices ----------
// Lucky's lines are voiced; the child's answers are text only (English with a small translation).

const ASK_EVERY = 4 * 60e3;
// what kind of question comes how often: for an older child more "would you rather", quizzes and little stories,
// fewer easy guesses, and no "tap my nose"
const ASK_WEIGHTS = { guess: 1.5, pref: 2, wyr: 3, quiz: 3, mood: 0.5, touch: 0, story: 2 };
let ask = null, lastAskAt = Date.now(), askTimer = 0;
const recentAsks = [];

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const canAsk = () => mode === 'main' && !sheetOpen && !modalOpen && userActive() && Date.now() >= busyUntil && !chainQ.length && !ask && !antics.busy();

function pickAsk() {
  const T0 = st.today(S);
  const pool = ASKS.filter((a) => !recentAsks.includes(a.id) && !(a.kind === 'story' && T0.story && !turbo()));
  const w = (a) => ASK_WEIGHTS[a.kind] ?? 1;
  let x = Math.random() * pool.reduce((sum, a) => sum + w(a), 0);
  return pool.find((a) => w(a) > 0 && (x -= w(a)) < 0) || pool.find((a) => w(a) > 0) || pool[0];
}

function choicesHtml(opts) {
  const noEmoji = (t) => t.replace(/\p{Extended_Pictographic}\uFE0F?\s*/gu, '');
  return opts.map((o, i) => `<button class="choice" data-i="${i}"><b>${fill(o[1], 'en')}</b>${S.settings.translate ? `<small>${noEmoji(fill(o[0], 'ru'))}</small>` : ''}</button>`).join('');
}

// A question: the line stays until the child answers; choices are buttons under the bubble
function askQ(q, who, opts, onPick, { compact = false } = {}) {
  antics.end(); // Lucky walks back to his place above the choices
  say(q, who, { hold: true, forAsk: true });
  ui.choices.innerHTML = choicesHtml(opts);
  ui.choices.className = 'choices' + (compact ? ' compact' : '') + (opts.length === 4 ? ' c4' : '');
  ui.choices.hidden = false;
  // Lucky moves up above the choices so he stays visible; on a short screen the choices go in two columns
  ui.scene.style.setProperty('--choicesH', ui.choices.offsetHeight + 'px');
  if (!compact && opts.length >= 3 && askRoom() < 110) {
    ui.choices.classList.add('compact');
    ui.scene.style.setProperty('--choicesH', ui.choices.offsetHeight + 'px');
  }
  fitAsk();
  ui.scene.classList.add('asking');
  ui.choices.querySelectorAll('.choice').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      if (b.disabled) return;
      sfx.tap();
      onPick(Number(b.dataset.i), b);
    };
  });
  clearTimeout(askTimer);
  askTimer = setTimeout(cancelAsk, 35000); // no answer: quietly remove it, no nagging
}

// The room between the question bubble (and its tail) and the choices decides how big Lucky can be there
const askRoom = () => ui.choices.offsetTop - (ui.bubble.offsetTop + ui.bubble.offsetHeight) - 30;
function fitAsk() {
  const w = Math.max(56, Math.min(190, ui.scene.clientWidth * 0.4, (askRoom() * 200) / 210));
  ui.scene.style.setProperty('--askW', Math.round(w) + 'px');
}

function hideChoices() {
  ui.choices.hidden = true;
  ui.choices.innerHTML = '';
  ui.scene.classList.remove('asking');
}

function cancelAsk() {
  if (!ask) return;
  clearTimeout(askTimer);
  hideChoices();
  if (ask.frog) frogLeave();
  ask = null;
  hideBubble();
}

// Lucky's reply; on a wrong guess the question stays and another choice can be picked
function answer(pair, who = 'lucky', { end = true, reward = true } = {}) {
  const ms = say(pair, who, { forAsk: true });
  if (!end) return ms;
  hideChoices();
  clearTimeout(askTimer);
  if (reward) { award(addH(1, 'ask', 5)); stat('asks'); }
  ask = null;
  return ms;
}

function markWrong(btn) {
  btn.disabled = true;
  btn.classList.add('wrong');
}

// What is true right now, in the same order as the face (tiredness first)
const FEEL = { hunger: 'hungry', clean: 'mucky', fun: 'sad' };
function feelings() {
  const p = S.pet;
  const out = [];
  if (p.energy < 30) out.push('sleepy');
  for (const k of Object.keys(FEEL).sort((a, b) => p[a] - p[b])) if (p[k] < 30) out.push(FEEL[k]);
  return out.length ? out : ['happy'];
}

function startAsk(a) {
  if (!a) return;
  const T0 = st.today(S);
  T0.asks++;
  lastAskAt = Date.now();
  recentAsks.push(a.id);
  if (recentAsks.length > 12) recentAsks.shift();
  ask = { a };
  if (a.kind === 'pref') {
    const opts = shuffle(a.opts).slice(0, a.show || 3);
    askQ(a.q, 'lucky', opts, (i) => { setTemp('happy', 1500); answer(a.special?.[opts[i][1]] || fresh(REPLY.like)); });
  } else if (a.kind === 'wyr') {
    askQ(a.q, 'lucky', a.opts, (i) => { setTemp('laugh', 1500); answer(a.replies[i] || fresh(REPLY.funny)); });
  } else if (a.kind === 'guess' || a.kind === 'quiz') {
    const opts = shuffle([a.right, ...shuffle(a.wrong).slice(0, 2)]);
    askQ(a.q, 'lucky', opts, (i, btn) => {
      const ok = opts[i] === a.right;
      if (a.kind === 'guess' && !ok) { markWrong(btn); answer(fresh(REPLY.wrong), 'lucky', { end: false }); return; }
      if (ok) { sfx.happy(); setTemp('laugh', 1500); if (a.binky) setTimeout(() => binky(true), 600); }
      answer(ok ? (a.ok || fresh(REPLY.right)) : a.no);
    });
  } else if (a.kind === 'mood') {
    const truth = feelings(), actual = truth[0];
    // wrong options are only feelings that are definitely not true now
    const keys = shuffle([actual, ...shuffle(Object.keys(MOOD_OPTS).filter((k) => !truth.includes(k))).slice(0, 2)]);
    askQ(a.q, 'lucky', keys.map((k) => MOOD_OPTS[k]), (i) => {
      const ok = truth.includes(keys[i]);
      if (ok) { sfx.happy(); setTemp('happy', 1500); }
      answer(fresh(ok ? MOOD_REPLY.right : MOOD_REPLY[actual]));
    }, { compact: true });
  } else if (a.kind === 'touch') {
    ask.touch = a.target;
    ask.tries = 0;
    say(a.q, 'lucky', { hold: true, forAsk: true });
    clearTimeout(askTimer);
    askTimer = setTimeout(cancelAsk, 20000);
  } else if (a.kind === 'story') {
    T0.story = true;
    storyNode(a.start);
  }
}

function storyNode(id) {
  const n = STORY[id];
  if (!n.opts) { setTemp('laugh', 1500); answer(n.say); return; }
  const opts = n.opts.map(([label]) => label);
  askQ(n.say, 'lucky', opts, (i) => { hideChoices(); storyNode(n.opts[i][1]); });
}

// Tapping Lucky in answer to 'tap my ears'
function touchAnswer(e) {
  answeredAt = Date.now();
  const part = e.target.closest('.nose') ? 'nose' : e.target.closest('.ear') ? 'ears' : e.target.closest('.head') ? 'head' : 'body';
  if (part === ask.touch) {
    sfx.happy();
    hop(ui.lucky);
    setTemp('laugh', 1500);
    heartsBurst(...sceneXY(e), 4);
    answer(fresh(TOUCH_REPLY.right));
  } else {
    sfx.tap();
    if (++ask.tries >= 3) { answer(TOUCH_REPLY[part][0], 'lucky', { reward: false }); return; }
    answer(TOUCH_REPLY[part][0], 'lucky', { end: false });
  }
}

// ---------- riddle frog ----------

function showFrog(force = false) {
  if (ui.scene.querySelector('.frog')) return;
  const T0 = st.today(S);
  T0.frog = true;
  const f = document.createElement('button');
  f.className = 'frog';
  f.textContent = '🐸';
  ui.scene.appendChild(f);
  hop(f, 'in', 1200);
  sfx.croak();
  if (!force) setTimeout(() => { if (!ask) maybeIdiom('frog', 0.5); }, 900);
  f.onclick = (e) => {
    e.stopPropagation();
    if (mode !== 'main' || ask) return;
    frogRiddle(f);
  };
  // if nobody comes, the frog hops away by herself
  f.timer = setTimeout(() => { if (!ask?.frog) frogLeave(); }, force ? 120e3 : 60e3);
}

let frogGoneAt = 0;
function frogLeave() {
  antics.thinking(false);
  const f = ui.scene.querySelector('.frog');
  if (!f) return;
  frogGoneAt = Date.now();
  clearTimeout(f.timer);
  f.classList.add('away');
  setTimeout(() => f.remove(), 900);
}

function frogRiddle(f) {
  if (f.classList.contains('asking')) return;
  f.onclick = null;
  const r = fresh(FROG.riddles);
  ask = { frog: true };
  antics.thinking(true);
  f.classList.add('asking');
  hop(f, 'jump');
  sfx.croak();
  const ms = say(fresh(FROG.hello), 'frog', { forAsk: true });
  setTimeout(() => {
    if (!ask?.frog) return;
    const opts = shuffle([r.right, ...r.wrong]);
    askQ(r.q, 'frog', opts, (i, btn) => {
      if (opts[i] !== r.right) { markWrong(btn); sfx.croak(); answer(fresh(FROG.wrong), 'frog', { end: false }); return; }
      sfx.happy();
      hop(f, 'jump');
      const done = answer(fresh(FROG.right), 'frog', { reward: false });
      award(addH(3, 'frog', 3));
      stat('frogRight');
      const s = giveSticker(); // given now, shown after her goodbye (or once a game started meanwhile is over)
      st.save(S);
      setTimeout(() => {
        frogLeave();
        if (mode === 'main') say(fresh(FROG.bye), 'frog');
        if (s) showModal({ custom: (host, done) => revealGift(host, { title: tr('fromFrog'), rewards: [{ kind: 'sticker', id: s, name: P('rvSticker') }], line: LUCKY.levelUp }, done) });
      }, done + 300);
    });
  }, ms + 300);
}

function maybeFrog(now, T0) {
  if (T0.frog || dogHere || !canAsk() || S.session.activeMs < 3 * 60e3 || st.hash(T0.date + 'frog') % 100 >= 60) return; // not while Tali is here
  showFrog();
}

// ---------- mood check-in and ninja breathing ----------

const MOODS = [['happy', '😊'], ['calm', '😌'], ['tired', '😴'], ['sad', '😢'], ['angry', '😠']];

// The mood check-in: every third day or so (every day felt like too much), after her first things, not on top of them
// (and not on her birthday: the day has its own card)
function maybeMood(T0) {
  if (T0.mood || st.hash(T0.date + 'mood') % 3 || (EV?.id === 'birthday' && EV.days === 0)) return;
  if (!S.onboarded || mode !== 'main' || sheetOpen || modalOpen || antics.busy() || !userActive() || S.session.activeMs < 30e3 || Date.now() < busyUntil) return;
  T0.mood = 'asked';
  sayAuto(LUCKY.moodAsk[0]);
  showModal({
    art: luckyPic({ face: 'ok', wear: S.wear }),
    title: tr('moodTitle'),
    plain: true,
    buttons: MOODS.map(([id, e]) => ({
      label: `${e} ${tr('mood_' + id)}${S.settings.translate ? `<small>${T(other(), 'mood_' + id)}</small>` : ''}`,
      onClick: () => {
        T0.mood = id;
        st.save(S);
        sfx.happy();
        say(fresh(LUCKY.mood[id]));
        if (id === 'sad' || id === 'angry') setTimeout(() => showModal({
          art: '<div class="big-emoji">🌬️</div>', title: tr('breathTitle'),
          buttons: [{ label: tr('breathBtn'), onClick: breathe }, { label: tr('rvLater') }],
        }), 2500);
        if (id === 'happy') setTemp('laugh', 1500);
      },
    })),
  });
}

function breathe() {
  showModal({ cls: '', custom: (host, done) => {
    silence();
    host.innerHTML = `<div class="breath"><h2>${tr('breathTitle')}</h2><div class="b-circle"><span></span></div><p class="b-text"></p>
      <button class="btn ghost b-stop">${tr('close')}</button></div>`;
    const circle = host.querySelector('.b-circle'), text = host.querySelector('.b-text');
    const timers = [];
    let calm = false;
    const stop = () => { timers.forEach(clearTimeout); done(); if (calm) setTimeout(() => maybeIdiom('calm', 0.6), 400); };
    host.querySelector('.b-stop').onclick = () => { sfx.tap(); stop(); };
    const CYCLES = 3, IN = 4000, OUT = 4000;
    for (let c = 0; c < CYCLES; c++) {
      const t0 = c * (IN + OUT);
      timers.push(setTimeout(() => { circle.className = 'b-circle in'; text.textContent = tr('breathIn'); speak(L(LUCKY.breathIn[0]), S.lang); }, t0));
      timers.push(setTimeout(() => { circle.className = 'b-circle out'; text.textContent = tr('breathOut'); speak(L(LUCKY.breathOut[0]), S.lang); }, t0 + IN));
    }
    timers.push(setTimeout(() => {
      circle.className = 'b-circle';
      text.textContent = fill(L(LUCKY.breathDone[0]), S.lang);
      speak(text.textContent, S.lang);
      sfx.sparkle();
      award(addH(3, 'breath', 3));
      stat('breaths');
      calm = true;
      host.querySelector('.b-stop').textContent = tr('done');
    }, CYCLES * (IN + OUT)));
  } });
}

// ---------- mini-games ----------

const GAME_COOLDOWN = 15 * 60e3;

function openPlay() {
  const T0 = st.today(S);
  const left = turbo() ? 99 : S.settings.gamesPerDay - T0.games;
  const wait = turbo() ? 0 : Math.ceil((S.lastGameAt + GAME_COOLDOWN - Date.now()) / 60e3);
  const can = left > 0 && wait <= 0;
  if (left > 0 && wait > 0) say(fresh(LUCKY.cooldown));
  if (left <= 0) say(P('noGames'));
  const note = left <= 0 ? tr('noGames') : wait > 0 ? `⏳ ${tr('gameCooldown', { n: wait })}` : tr('gamesLeft', { n: left });
  // while a holiday is on, its own three games take the usual ones' place, and Chat with Lucky (the English
  // questions and answers) stays as the fourth
  const holiday = !!(EV && EV.stage >= 3 && HOLIDAY_GAMES[EV.id]);
  const list = holiday ? [...HOLIDAY_GAMES[EV.id], GAMES.find((g) => g.id === 'talk')] : GAMES;
  const best = (g) => { const b = Math.max(0, ...Object.entries(S.games.best).filter(([k]) => k.startsWith(g.id + ':')).map(([, v]) => v)); return b ? `<i class="gi-best">🏆 ${b}</i>` : ''; };
  const html = `<p class="muted center">${note}</p>${holiday ? `<p class="center g-holi-head">${EV.icon} ${tr('holidayGames')}</p>` : ''}
    <div class="game-list">${list.map((g) => `<button class="game-item" data-id="${g.id}" ${can ? '' : 'disabled'}>
      <span class="gi-emoji">${g.emoji}</span><span class="gi-text"><b>${tr('g_' + g.id)}</b><small>${tr('g_' + g.id + '_hint')}</small></span>${g.target ? best(g) : ''}</button>`).join('')}</div>`;
  openSheet((holiday ? '' : '🎈 ') + tr('pickGame'), html, (root) => root.querySelectorAll('.game-item').forEach((b) => {
    b.onclick = () => { sfx.tap(); closeSheet(); startGame(list.find((g) => g.id === b.dataset.id)); };
  }));
}

// While a game, a mission or sleep fills the screen, the scene under it is hidden (and its animations aren't drawn)
const cover = (on) => document.body.classList.toggle('covered', on);

function closeGame() {
  ui.overlay.className = 'overlay';
  ui.overlay.innerHTML = '';
  mode = 'main';
  cover(false);
  if (!modalOpen && modalQ.length) nextModal(); // windows that waited for the end of the game
}

function startGame(game) {
  if (S.pet.energy < 22) return say(P('tooTired'));
  if (S.pet.hunger < 25) { setTemp('sad', 1500); return say(fresh(LUCKY.gameRefuse)); }
  leaveMain('game');
  antics.clearProps();
  ui.overlay.className = 'overlay show game-ov';
  cover(true);
  openGame(ui.overlay, game, {
    tr, sfx, lang: S.lang, translate: S.settings.translate,
    svgOk: luckyPic({ face: 'ok', wear: S.wear }),
    svgHappy: luckyPic({ face: 'laugh', wear: S.wear }),
    svgSad: luckyPic({ face: 'sad', wear: S.wear }),
    // the difficulty she chose last time (Normal at first: Easy gave three stars straight away), and the best points
    level: S.games.level[game.id] || 'normal',
    bestOf: (lv) => S.games.best[game.id + ':' + lv] || 0,
    onLevel: (lv) => { S.games.level[game.id] = lv; st.save(S); },
    onRecord: (lv, pts) => { const k = game.id + ':' + lv; if (pts <= (S.games.best[k] || 0)) return false; S.games.best[k] = pts; st.save(S); return true; },
    onCancel: closeGame,
    // a game counts from its start (a reload can't get round the day's games), and what it earned is kept the
    // moment it ends, before the end card is closed (iOS may close the app in the background meanwhile)
    onStart: () => { st.today(S).games++; S.lastGameAt = Date.now(); stat('games'); st.save(S); },
    onScore: (score) => {
      if (score >= game.great) stat('gamesGreat');
      if (game.id === 'talk') stat('talkRight', Math.floor(score / 3));
      st.boost(S, 'fun', 20);
      st.boost(S, 'energy', -game.energy);
      // up to 8 hearts a game and 24 a day: each of the day's three games counts (a new level's window waits for the
      // game to close)
      award(addH(Math.min(8, Math.ceil((score / 30) * 8)), 'game', 24));
      st.save(S);
    },
    onEnd: (score) => {
      closeGame();
      renderStats();
      setTemp('happy', 1500);
      if (!(score >= game.great && maybeIdiom('win', 0.6))) say(fresh(score >= game.great ? LUCKY.gameGreat : Math.random() < 0.5 ? LUCKY.gameOk : LUCKY.gameAfter));
      toast('🎈 ' + tr('gamesLeft', { n: Math.max(0, S.settings.gamesPerDay - st.today(S).games) }));
      st.save(S);
    },
  });
}

// ---------- dojo ----------

const taskEnds = {}; // when the 'I did it!' button becomes available (survives sheet re-renders)

function taskFlow(root, key, seconds, onDone) {
  const btn = root.querySelector('.go');
  const run = () => {
    btn.disabled = true;
    const tickTask = () => {
      const n = Math.ceil((taskEnds[key] - Date.now()) / 1000);
      if (!btn.isConnected) return false;
      if (n > 0) { btn.textContent = tr('missionWait', { n }); return true; }
      btn.disabled = false;
      btn.textContent = tr('missionDone');
      btn.classList.add('ready');
      btn.onclick = () => { delete taskEnds[key]; onDone(); };
      return false;
    };
    if (!tickTask()) return;
    const t = setInterval(() => { if (!tickTask()) clearInterval(t); }, 500);
  };
  if (taskEnds[key]) return run();
  btn.onclick = () => { sfx.tap(); taskEnds[key] = Date.now() + (turbo() ? 2 : seconds) * 1000; run(); };
}

// Two missions to choose from each day, for different skills
function todaysMissions() {
  const a = MISSIONS[st.missionIndex(S, MISSIONS.length)];
  const h = st.hash(st.today(S).date + 'm2');
  for (let i = 0; i < MISSIONS.length; i++) {
    const b = MISSIONS[(h + i) % MISSIONS.length];
    if (b.skill !== a.skill) return [a, b];
  }
  return [a];
}

const skillName = (k) => `${SKILLS[k].emoji} ${L(SKILLS[k].name)}`;

function openDojo() {
  const T0 = st.today(S);
  const b = BELTS[S.belt];
  const master = S.belt >= BELTS.length - 1;
  const careList = S.settings.realPet ? CARE : DEEDS;
  const c = careList[st.careIndex(S, careList.length)];
  const scroll = S.ninja.scroll.slice(-8).reverse();
  const html = `
    <div class="belt-box">${art.belt(b.color, 120)}
      <div><div class="muted">${tr('belt')}</div><div class="belt-name">${L(b.name)}</div>
      ${master ? `<div class="muted">${tr('beltMax')}</div>` : `<div class="dots">${[0, 1, 2].map((i) => `<i class="${i < S.beltSteps ? 'on' : ''}"></i>`).join('')}</div><div class="muted">${tr('beltProgress', { n: S.beltSteps })}</div>`}</div>
    </div>
    <div class="card mission">
      <div class="card-title">🥷 ${tr('mission')}</div>
      ${T0.missionDone ? `<p class="done-note">✅ ${tr('missionFinished')}</p>` : `
        <p class="muted">${tr('chooseMission')}</p>
        ${todaysMissions().map((m) => `<button class="m-pick" data-id="${m.id}"><span class="t-emoji">${m.emoji}</span>
          <span class="mp-text">${bi(m.text)}<small class="mp-skill">${skillName(m.skill)}</small></span></button>`).join('')}`}
    </div>
    <div class="card skills-card">
      <div class="card-title">⭐ ${tr('skills')}</div>
      <div class="skills">${Object.keys(SKILLS).map((k) => `<div class="skill ${S.ninja.skills[k] ? 'on' : ''}"><span>${SKILLS[k].emoji}</span><b>${S.ninja.skills[k] || 0}</b><small>${L(SKILLS[k].name)}</small></div>`).join('')}</div>
    </div>
    ${scroll.length ? `<div class="card scroll-card"><div class="card-title">📜 ${tr('scroll')}</div><div class="ninja-scroll">${scroll.map((x) => {
      const mm = MISSIONS.find((y) => y.id === x.id);
      return `<div class="stamp-mini"><span>${mm?.emoji || '🥷'}</span>${x.r ? `<small>${x.r}</small>` : ''}</div>`;
    }).join('')}</div></div>` : ''}
    <div class="card care">
      <div class="card-title">💗 ${S.settings.realPet ? tr('care') : tr('deed')}</div>
      ${T0.careDone ? `<p class="done-note">✅ ${tr('careDone')}</p>` : `
        <div class="task"><span class="t-emoji">${c[2]}</span>${bi(c)}</div>
        <div class="row"><button class="btn purple go">${tr('missionStart')}</button></div>`}
    </div>
    <div class="row"><button class="btn ghost breath-go">${tr('breathBtn')}</button></div>`;
  openSheet('🥷 ' + tr('dojoTitle'), html, (root) => {
    root.querySelectorAll('.m-pick').forEach((btn) => {
      btn.onclick = () => { sfx.tap(); closeSheet(); startMission(MISSIONS.find((m) => m.id === btn.dataset.id)); };
    });
    const cc = root.querySelector('.care');
    if (!T0.careDone) taskFlow(cc, 'care', 15, careComplete);
    root.querySelector('.breath-go').onclick = () => { sfx.tap(); closeSheet(); breathe(); };
  });
}

// A mission runs full screen (ninja.js); Lucky stays awake until it's over
function startMission(m) {
  leaveMain('mission');
  silence();
  ui.overlay.className = 'overlay show game-ov';
  cover(true);
  openMission(ui.overlay, m, {
    lang: S.lang, translate: S.settings.translate, fast: turbo(), tr,
    luckyArt: (face) => luckyPic({ face, wear: S.wear }),
    onClose: closeGame,
    onDone: (result) => { closeGame(); missionComplete(m, result); },
  });
}

function missionComplete(m, result = {}) {
  const T0 = st.today(S);
  if (T0.missionDone) return;
  T0.missionDone = true;
  stat('missions');
  const N = S.ninja;
  N.skills[m.skill] = (N.skills[m.skill] || 0) + 1;
  N.scroll.push({ d: T0.date, id: m.id, r: result.found || '' });
  while (N.scroll.length > 30) N.scroll.shift();
  if (result.mask) N.mask = { d: T0.date, c: result.mask };
  if (result.cloud) N.cloud = { d: T0.date, e: result.cloud };
  applyNinjaLook();
  confetti();
  const res = addH(10, 'mission', 10);
  let beltUp = false;
  if (S.belt < BELTS.length - 1) {
    S.beltSteps++;
    if (S.beltSteps >= 3) { beltUp = true; S.beltSteps = 0; S.belt++; }
  }
  const master = S.belt >= BELTS.length - 1;
  // a stamp on the ninja scroll, then the new belt if there is one
  showModal({ cls: '', custom: (host, done) => {
    host.innerHTML = `<div class="modal-card stamp-card"><div class="scroll-paper"><div class="stamp">${m.emoji}</div></div>
      <h2>${tr('stampTitle')}</h2><p class="skill-up">${tr('skillUp', { x: skillName(m.skill) })}</p>
      ${master && !beltUp ? '' : `<div class="dots">${[0, 1, 2].map((i) => `<i class="${beltUp || i < S.beltSteps ? 'on' : ''}"></i>`).join('')}</div>`}
      <div class="m-btns"><button class="btn pink">${tr('hooray')}</button></div></div>`;
    setTimeout(() => sfx.stamp(), 450);
    host.querySelector('button').onclick = () => { sfx.tap(); done(); setTimeout(missionCheer, 350); };
  } });
  if (beltUp) {
    const b = BELTS[S.belt];
    showModal({ art: art.belt(b.color, 160), title: tr('newBelt'), text: L(b.name) });
    sfx.levelup();
  }
  award(res);
  st.save(S);
  renderTop();
  say(fresh(beltUp ? LUCKY.belt : master ? LUCKY.sensei.stampMaster : LUCKY.sensei.stamp));
}

// Back on the scene after the stamp, Lucky cheers with a happy jump (unless a new belt or level is being shown).
// 'A little more and you get a new belt!' only when one more stamp gives the belt.
function missionCheer() {
  if (mode !== 'main' || modalOpen || sheetOpen) return;
  const oneToGo = S.belt < BELTS.length - 1 && S.beltSteps === 2;
  binky(true);
  say(fresh(LUCKY.missionCheer.filter((x) => oneToGo || !x[1].includes('new belt'))));
}

// Today's ninja look: the mask she drew and the animal cloud she saw
const todayIs = (x) => x && x.d === st.today(S).date;
const ninjaSky = () => (todayIs(S.ninja.cloud) ? S.ninja.cloud.e : null);
let shownSky = null, shownMask = null;
function applyNinjaLook() {
  const mask = todayIs(S.ninja.mask) ? S.ninja.mask.c : null;
  if (mask !== shownMask && ui.props) { shownMask = mask; antics.setSticky('eyes', mask ? 'mask' : null, mask); }
  const sky = ninjaSky();
  if (sky !== shownSky) { shownSky = sky; antics.sky(sky); }
}

function careComplete() {
  const T0 = st.today(S);
  T0.careDone = true;
  stat('care');
  sfx.happy();
  const res = addH(8, 'care', 8);
  const s = giveSticker();
  if (s) showModal({ custom: (host, done) => revealGift(host, { title: tr('fromCare'), rewards: [{ kind: 'sticker', id: s, name: P('rvSticker') }], line: LUCKY.levelUp }, done) });
  award(res);
  st.save(S);
  openDojo();
}

// ---------- collection ----------

const SLOT_ICON = { head: '🎩', face: '👓', neck: '🧣', body: '🦸' };
let wardSlot = 'head';

// How to get a locked item
function wearLock(w) {
  if (w.level) return `🔒 ${tr('unlockAt', { n: w.level })}`;
  const al = albumReward(w.id);
  if (al) return `📒 ${L(al.name)}`;
  return w.rarity === 'gold' ? `✨ ${tr('giftGold')}` : `🎁 ${tr('giftRare')}`;
}

let bookChip = 'jokes';
function collectionBody(tab) {
  if (tab === 'outfits') {
    const items = WEAR.filter((w) => w.slot === wardSlot);
    const owned = WEAR.filter(ownsWear).length;
    return `<div class="ward-top"><div class="ward-preview">${luckyArt({ face: 'happy', wear: S.wear })}</div>
      <div><div class="muted">${tr('wardOwned', { n: owned, m: WEAR.length })}</div>
      <div class="slot-chips">${SLOTS.map((sl) => `<button class="chip ${sl === wardSlot ? 'on' : ''}" data-slot="${sl}">${SLOT_ICON[sl]} ${tr('slot_' + sl)}</button>`).join('')}</div></div></div>
      <div class="tiles">
        <button class="tile ${!S.wear[wardSlot] ? 'sel' : ''}" data-w=""><div class="tile-art">${luckyArt({ face: 'ok', wear: { ...S.wear, [wardSlot]: null } })}</div><span>${tr('none')}</span></button>
        ${items.map((w) => { const own = ownsWear(w); return `<button class="tile ${S.wear[wardSlot] === w.id ? 'sel' : ''} ${own ? '' : 'locked'} ${w.rarity || ''}" data-w="${w.id}">
          <div class="tile-art">${luckyArt({ face: 'ok', wear: { ...S.wear, [wardSlot]: w.id } })}</div><span>${L(w.name)}</span>${own ? '' : `<i class="lock">${wearLock(w)}</i>`}</button>`; }).join('')}
      </div>`;
  }
  if (tab === 'places') {
    return `<div class="tiles places">${PLACES.map((pl) => { const locked = S.level < pl.level; return `<button class="tile ${S.bg === pl.id ? 'sel' : ''} ${locked ? 'locked' : ''}" data-p="${pl.id}">
      <div class="tile-art place">${art.scene(pl.id)}</div><span>${L(pl.name)}</span>${locked ? `<i class="lock">🔒 ${tr('unlockAt', { n: pl.level })}</i>` : ''}</button>`; }).join('')}</div>`;
  }
  if (tab === 'decor') {
    return `<div class="row"><button class="btn pink big deco-go">${tr('decorateBtn')}</button></div><div class="tiles deco-tiles">${DECOR.map((d) => { const locked = S.level < d.level; return `<button class="tile ${locked ? 'locked' : ''}" data-d="${d.id}">
      <div class="tile-art dec-tile">${art.decor(d.id)}</div><span>${L(d.name)}</span>${locked ? `<i class="lock">🔒 ${tr('unlockAt', { n: d.level })}</i>` : ''}</button>`; }).join('')}</div>`;
  }
  if (tab === 'stickers') {
    return `<p class="muted center">${tr('stickersOf', { n: S.stickers.length, m: STICKERS.length })}</p>${ALBUMS.map((a) => {
      const have = a.stickers.filter((x) => S.stickers.includes(x)).length, done = S.albumsDone.includes(a.id), w = WEAR_BY_ID[a.reward];
      return `<div class="album ${done ? 'done' : ''}"><div class="album-head"><b>${L(a.name)}</b><span>${have}/10</span><span class="album-prize">${done ? '✅' : '🎁'} ${L(w.name)}</span></div>
        <div class="stickers">${a.stickers.map((x) => `<div class="stk ${S.stickers.includes(x) ? 'on' : ''}">${S.stickers.includes(x) ? x : '?'}</div>`).join('')}</div></div>`;
    }).join('')}`;
  }
  if (tab === 'english') {
    const chips = `<div class="slot-chips book-chips">${[['jokes', '😂'], ['twisters', '👅'], ['idioms', '🎭']].map(([k, e]) => `<button class="chip ${bookChip === k ? 'on' : ''}" data-chip="${k}">${e} ${tr(k)}</button>`).join('')}</div>`;
    if (bookChip === 'twisters') {
      const heard = S.twisters.heard.map((id) => TWISTER_BY_ID[id]).filter(Boolean).reverse();
      return `${chips}<p class="muted center">${tr('twistersOf', { n: heard.length, m: TWISTERS.length })}${heard.length ? ' · ' + tr('twisterTap') : ''}</p>
        ${heard.length ? '' : `<div class="card center jokes-empty">👅 ${tr('twistersEmpty', { dog: dogName() })}</div>`}
        <div class="joke-list">${heard.map((tw) => `<div class="joke-card twist-card"><b class="jk-a">${fill(L(tw.t), S.lang)}</b>
          ${S.settings.translate ? `<small class="jk-sub">${fill(say2(tw.t, other()), other())}</small>` : ''}
          <div class="tw-speeds">${SPEEDS.map(([sp, ic]) => `<button class="tw-speed" data-tw="${tw.id}" data-s="${sp}">${ic}</button>`).join('')}</div></div>`).join('')}</div>`;
    }
    if (bookChip === 'idioms') {
      const heard = S.idioms.heard.map((id) => IDIOM_BY_ID[id]).filter(Boolean).reverse();
      return `${chips}<p class="muted center">${tr('idiomsOf', { n: heard.length, m: IDIOMS.length })}${heard.length ? ' · ' + tr('idiomTap') : ''}</p>
        ${heard.length ? '' : `<div class="card center jokes-empty">🎭 ${tr('idiomsEmpty')}</div>`}
        <div class="joke-list">${heard.map((it) => `<button class="joke-card idiom-card" data-idiom="${it.id}"><span class="id-e">${it.e}</span>
          <span class="id-txt"><b class="jk-a">${it.idiom}</b><span class="jk-q">${L(it.mean)}</span><small class="jk-sub">${tr('idiomRu')}: ${it.ru}</small></span></button>`).join('')}</div>`;
    }
    return chips + collectionBody('jokes');
  }
  if (tab === 'jokes') {
    const heard = S.jokes.heard.map((id) => JOKE_BY_ID[id]).filter(Boolean).reverse();
    const setup = (j, lang) => fill(j.kk ? [DOG.knock[0], LUCKY.whosThere[0], j.kk, j.who].map((x) => say2(x, lang)).join(' ') : say2(j.q, lang), lang);
    return `<p class="muted center">${tr('jokesOf', { n: heard.length, m: JOKES.length })}${heard.length ? ' · ' + tr('jokeTap') : ''}</p>
      ${heard.length ? '' : `<div class="card center jokes-empty">🐶 ${tr('jokesEmpty', { dog: dogName() })}</div>`}
      <div class="joke-list">${heard.map((j) => `<button class="joke-card" data-j="${j.id}"><span class="jk-q">${setup(j, S.lang)}</span><b class="jk-a">${fill(L(j.a), S.lang)}</b>
        ${S.settings.translate ? `<small class="jk-sub">${setup(j, other())} ${fill(say2(j.a, other()), other())}</small>` : ''}</button>`).join('')}</div>`;
  }
  // badges
  return `<p class="muted center">${tr('badgesOf', { n: S.badges.length, m: BADGES.length })}</p><div class="badges">${BADGES.map(([id, e, name, key, goal]) => {
    const got = S.badges.includes(id), v = Math.min(goal, statValue(key));
    return `<div class="badge ${got ? 'on' : ''}"><div class="b-emoji">${e}</div><b>${L(name)}</b>${got ? '' : `<div class="b-bar"><i style="width:${Math.round((v / goal) * 100)}%"></i></div><small>${v}/${goal}</small>`}</div>`;
  }).join('')}</div>`;
}

function openCollection(tab = 'outfits') {
  const tabs = ['outfits', 'places', 'decor', 'stickers', 'badges', 'english'];
  const html = `<p class="muted center">${tr('daysTogether', { n: S.days.length })} · ${tr('lv')} ${S.level}${collectionFull() ? ' · 🏆 100%' : ''}</p>
    <div class="tabs coll-tabs">${tabs.map((t) => `<button class="tab ${t === tab ? 'on' : ''}" data-t="${t}">${tr(t)}</button>`).join('')}</div>${collectionBody(tab)}`;
  openSheet('🎀 ' + tr('collection'), html, (root) => {
    const again = () => { const y = root.scrollTop; openCollection(tab); ui.sheet.scrollTop = y; };
    root.querySelectorAll('.tab').forEach((b) => { b.onclick = () => { sfx.tap(); openCollection(b.dataset.t); }; });
    root.querySelectorAll('.chip[data-slot]').forEach((b) => { b.onclick = () => { sfx.tap(); wardSlot = b.dataset.slot; again(); }; });
    root.querySelectorAll('.stk.on').forEach((x) => { x.onclick = () => { sfx.pop(); hop(x, 'wiggle'); }; });
    root.querySelectorAll('.badge.on').forEach((x) => { x.onclick = () => { sfx.sparkle(); hop(x, 'wiggle'); }; });
    root.querySelectorAll('.joke-card[data-j]').forEach((x) => { x.onclick = () => { sfx.tap(); hop(x, 'wiggle'); playJoke(JOKE_BY_ID[x.dataset.j]); }; });
    root.querySelectorAll('.book-chips .chip').forEach((b) => { b.onclick = () => { sfx.tap(); bookChip = b.dataset.chip; again(); }; });
    root.querySelectorAll('.tw-speed').forEach((b) => { b.onclick = () => { sfx.tap(); hop(b, 'wiggle'); speak(fill(L(TWISTER_BY_ID[b.dataset.tw].t), S.lang), S.lang, 'lucky', Number(b.dataset.s)); }; });
    root.querySelectorAll('.idiom-card').forEach((b) => { b.onclick = () => { sfx.sparkle(); replayIdiom(IDIOM_BY_ID[b.dataset.idiom]); }; });
    root.querySelector('.deco-go')?.addEventListener('click', () => { sfx.tap(); startEdit(); });
    root.querySelectorAll('.tile').forEach((b) => {
      b.onclick = () => {
        if (b.classList.contains('locked')) { sfx.tap(); hop(b, 'wiggle'); return; }
        sfx.sparkle();
        if (b.dataset.d !== undefined) { startEdit(layout().some((it) => it.id === b.dataset.d) ? null : b.dataset.d); return; }
        if (b.dataset.p) { const first = !S.worldsSeen.includes(b.dataset.p); goPlace(b.dataset.p); st.save(S); closeSheet(); if (!(first && maybeIdiom('newWorld', 0.6))) arrive(b.dataset.p); return; }
        if (b.dataset.w !== undefined) {
          const w = WEAR_BY_ID[b.dataset.w];
          if (!w) S.wear = { ...S.wear, [wardSlot]: null };
          else if (S.wear[wardSlot] === w.id) S.wear = { ...S.wear, [wardSlot]: null };
          else { wearIt(w); setTemp('happy', 1500); say(fresh(LUCKY.wearSay[w.id] || LUCKY.outfit)); }
          renderLucky(true);
        }
        st.save(S);
        again();
      };
    });
  });
}

// ---------- phrase of the day and quiz ----------

function openPhrase() {
  const T0 = st.today(S);
  T0.phraseSeen = true;
  const p = PHRASES[st.phraseIndex(S, PHRASES.length)];
  const line = (lang) => `<button class="say-line" data-lang="${lang}"><span class="flag">${lang === 'ru' ? 'RU' : 'EN'}</span>${say2(p, lang)} <span class="spk">🔊</span></button>`;
  const html = `<div class="phrase">
      <div class="big-emoji">${p[2]}</div>
      ${line(S.lang)}${line(other())}
      ${p[3] ? `<div class="ga"><span class="flag">☘️</span><div><div class="muted">${tr('gaBonus')}</div><b>${p[3]}</b></div></div>` : ''}
    </div>
    <div class="quiz-box">${T0.quiz < 3 ? `<button class="btn purple quiz-go">🧠 ${tr('quiz')} (${T0.quiz}/3)</button>` : `<p class="done-note">✅ ${tr('quizDone')}</p>`}</div>`;
  openSheet('💬 ' + tr('wordTitle'), html, (root) => {
    root.querySelectorAll('.say-line').forEach((b) => { b.onclick = () => speak(say2(p, b.dataset.lang), b.dataset.lang); });
    const q = root.querySelector('.quiz-go');
    if (q) q.onclick = () => quizStep(root.querySelector('.quiz-box'));
  });
}

function quizStep(box) {
  const T0 = st.today(S);
  if (T0.quiz >= 3) { box.innerHTML = `<p class="done-note">✅ ${tr('quizDone')}</p>`; return; }
  // today's phrase, then the ones from 3 and 10 days ago: a phrase comes back just as it starts to fade
  const q = PHRASES[st.phraseIndex(S, PHRASES.length, [0, 3, 10][T0.quiz] ?? 0)];
  const wrong = PHRASES.filter((x) => x !== q).sort(() => Math.random() - 0.5).slice(0, 2);
  const opts = [q, ...wrong].sort(() => Math.random() - 0.5);
  const ask = say2(q, other());
  box.innerHTML = `<div class="quiz">
    <div class="muted">${tr('quizQ')} (${T0.quiz + 1}/3)</div>
    <button class="say-line q"><span class="flag">${other().toUpperCase()}</span>${ask} <span class="spk">🔊</span></button>
    ${opts.map((o, i) => `<button class="opt" data-i="${i}">${say2(o, S.lang)}</button>`).join('')}
    <div class="q-res"></div></div>`;
  box.querySelector('.q').onclick = () => speak(ask, other());
  speak(ask, other());
  box.querySelectorAll('.opt').forEach((b) => {
    b.onclick = () => {
      if (box.querySelector('.opt.right')) return;
      const ok = opts[b.dataset.i] === q;
      T0.quiz++;
      box.querySelectorAll('.opt').forEach((x) => { if (opts[x.dataset.i] === q) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      const res = box.querySelector('.q-res');
      if (ok) { sfx.happy(); stat('quizRight'); award(addH(2, 'quiz', 6)); res.innerHTML = `<b>${tr('quizRight')}</b>`; }
      else { sfx.tap(); res.innerHTML = `${tr('quizWrong')} <b>${say2(q, S.lang)}</b>`; }
      res.innerHTML += `<div class="row"><button class="btn pink next">${T0.quiz < 3 ? tr('quizNext') : tr('done')}</button></div>`;
      res.querySelector('.next').onclick = () => (T0.quiz < 3 ? quizStep(box) : openPhrase());
      st.save(S);
    };
  });
}

// ---------- the dog ----------

function dogArrive() {
  dogHere = true;
  stat('dogVisits');
  ui.scene.classList.add('has-dog');
  const giftToday = S.dog.giftDay === st.today(S).date;
  ui.dog.innerHTML = `<div class="dog-body">${art.dog({ face: 'happy' })}</div>
    ${giftToday ? '' : `<button class="gift" aria-label="gift">🎁</button>`}
    <button class="joke-btn joke-go" aria-label="joke">😂</button>
    <button class="joke-btn twist-btn" aria-label="tongue twister">👅</button>
    ${S.dog.played ? '' : `<button class="pill together">🐾 ${tr('playTogether')}</button>`}`;
  const body = ui.dog.querySelector('.dog-body');
  // he runs in, jumps in from the sky, pops out of the ground, spins in or rolls in on a skateboard
  const entry = pick(['enter', 'enterJump', 'enterDig', 'enterSpin', 'enterSkate']);
  hop(body, entry, 1900);
  if (entry === 'enterSkate') { ui.dog.insertAdjacentHTML('beforeend', `<span class="skate">${(EV && EV.stage >= 3 && HOLIDAY_RIDE[EV.id]) || '🛹'}</span>`); setTimeout(() => ui.dog.querySelector('.skate')?.remove(), 1500); sfx.whoosh(); }
  if (entry === 'enterDig') setTimeout(() => { const d = body.getBoundingClientRect(), sc = ui.scene.getBoundingClientRect(); fxAt(d.left - sc.left + d.width / 2, d.bottom - sc.top - 10, ['💨', '🌱'], 6, 'spark'); sfx.puff(); }, 200);
  if (entry === 'enterJump') setTimeout(() => sfx.boing(), 500);
  const gift = ui.dog.querySelector('.gift');
  // one present a day, even when Tali comes more often
  if (gift) gift.onclick = () => {
    if (mode !== 'main') return;
    S.dog.giftDay = st.today(S).date;
    gift.remove();
    sfx.sparkle();
    say(fresh(DOG.gift), 'dog');
    const g = rollGift(0.25, 0.05);
    setTimeout(() => showModal({ custom: (host, done) => revealGift(host, { title: tr('fromDog', { dog: dogName() }), rewards: [g], line: LUCKY.levelUp }, done) }), 1200);
    st.save(S);
  };
  ui.dog.querySelector('.joke-go').onclick = (e) => {
    e.stopPropagation();
    if (mode !== 'main' || chainQ.length || ask) { sfx.tap(); return; } // wait until the current scene is over
    sfx.pop();
    antics.end();
    taliJoke(DOG.jokeMore);
  };
  ui.dog.querySelector('.twist-btn').onclick = (e) => {
    e.stopPropagation();
    if (mode !== 'main' || chainQ.length || ask) { sfx.tap(); return; }
    sfx.pop();
    antics.end();
    taliTwister();
  };
  const tog = ui.dog.querySelector('.together');
  if (tog) tog.onclick = () => {
    if (mode !== 'main') return;
    S.dog.played = true;
    stat('dogPlays');
    tog.remove();
    sfx.happy();
    say(fresh(DOG.play), 'dog');
    hop(ui.lucky, 'zoom');
    hop(body, 'zoom');
    st.boost(S, 'fun', 20);
    renderStats();
    setTimeout(() => { if (!maybeIdiom('play', 0.4)) { say(fresh(LUCKY.dogPlay)); setTemp('laugh', 1500); } heartsBurst(...luckyPoint(0.5, 0.2), 5); }, 1400);
    award(addH(5, 'dog', 8));
    st.save(S);
  };
  // hello, then straight away a joke (a cheering-up one if Lucky is sad)
  setTimeout(() => {
    sfx.bark();
    if (!dogHere || !userActive() || mode !== 'main' || ask) return;
    antics.end(); // a scene the child started in these 0.7 s gives way to the hello
    const sad = tier() === 'low', T0 = st.today(S);
    let hello = S.dog.met ? [timed('dog', fresh(DOG.arrive)), timed('lucky', fresh(sad ? LUCKY.dogSad : LUCKY.dogHappy))] : [timed('lucky', pick(LUCKY.meetDog), 1500)];
    // at Halloween he comes trick-or-treating and Lucky gives him a sweet: on his first visit of the day in the last
    // week, and every time on the day itself
    const trick = S.dog.met && EV?.id === 'halloween' && (EV.days === 0 || (EV.days <= 7 && !T0.trickTreat));
    if (trick) T0.trickTreat = true;
    if (trick) hello =[timed('dog', DOG.trickOrTreat[0]), () => { const d = ui.dog.querySelector('.dog-body'); if (d) { const r = d.getBoundingClientRect(), sc = ui.scene.getBoundingClientRect(); antics.fly('🍬', luckyPoint(0.7, 0.6), [r.left - sc.left + r.width / 2, r.top - sc.top + r.height * 0.45], 700, { arc: 50, spin: 300, size: 26 }); } sfx.pop(); return 200; },
      timed('lucky', LUCKY.holidayThings.trickTreat[0]), () => { const d = ui.dog.querySelector('.dog-body'); if (d) hop(d, 'hop'); sfx.crunch(); return 300; }, timed('dog', DOG.sweetThanks[0])];
    S.dog.met = true;
    taliJoke(sad ? DOG.cheer : DOG.jokeNew, hello);
  }, 700);
}

// ---------- Tali's jokes ----------

const JOKES_PER_VISIT = 3;
const jokesLeft = () => (turbo() ? 99 : JOKES_PER_VISIT - S.dog.jokes);
// Roughly how long a line takes when spoken (Tali talks fast), so jokes keep their rhythm
const pauseFor = (pair, min = 900, who = 'dog') => Math.max(min, 400 + pair[1].length * (who === 'lucky' ? 85 : 75)); // long enough for the clip
const timed = (who, pair, min = 1200) => [who, ...pair, pauseFor(pair, min, who)];

// Not repeated soon; new ones first, so the joke book keeps growing
function nextJoke() {
  const J = S.jokes;
  const pool = JOKES.filter((j) => !J.recent.includes(j.id));
  const unheard = pool.filter((j) => !J.heard.includes(j.id));
  const j = pick(unheard.length ? unheard : pool.length ? pool : JOKES);
  J.recent.push(j.id);
  while (J.recent.length > 60) J.recent.shift();
  return j;
}

// A joke as a little scene: the question (Lucky thinks) or a knock-knock (Lucky plays along), the punchline with a
// ba-dum-tss, Lucky laughs and does something that fits the joke, then he comments
function jokeSteps(j) {
  const punch = () => { const b = ui.dog.querySelector('.dog-body'); if (b) hop(b, 'hop'); sfx.rimshot(); return 450; };
  const react = () => {
    if (!dogHere) return -1;
    if (!S.jokes.heard.includes(j.id)) { S.jokes.heard.push(j.id); stat('jokesHeard'); }
    st.boost(S, 'fun', 5);
    renderStats();
    award(addH(1, 'joke', 4));
    st.save(S);
    return antics.laughAt(j.do) || 800;
  };
  const setup = j.kk
    ? [['dog', ...DOG.knock[0], 1300], ['lucky', ...LUCKY.whosThere[0], 1500], ['dog', ...j.kk, pauseFor(j.kk)], ['lucky', ...j.who, j.cut ? 750 : pauseFor(j.who, 900, 'lucky')]]
    : [['dog', ...j.q, pauseFor(j.q, 1500)], () => { antics.think(); return 1300; }];
  return [...setup, ['dog', ...j.a, pauseFor(j.a)], punch, react, ['lucky', ...(j.say || fresh(LUCKY.jokeLaugh))]];
}

// Tali tells a joke (up to 3 a visit); lead is his line before it, before is a scene to play first
function taliJoke(lead = null, before = []) {
  if (!dogHere || jokesLeft() <= 0 || ask || mode !== 'main') return false;
  S.dog.jokes++;
  const ears = lead === DOG.jokeNew ? pickIdiom('joke', 0.35, true) : null;
  // after the last joke of the visit: "That's all my jokes for now! I'll learn some new ones."
  const last = jokesLeft() <= 0 ? [() => { const b = ui.dog.querySelector('.dog-body'); if (b) hop(b, 'hop'); return 300; }, timed('dog', DOG.jokesOut[0])] : [];
  talk([...before, ...(lead ? [timed('dog', fresh(lead))] : []), ...(ears ? idiomSteps(ears) : []), ...jokeSteps(nextJoke()), ...last], true);
  if (jokesLeft() <= 0) ui.dog.querySelector('.joke-go')?.remove();
  st.save(S);
  return true;
}

// The joke book in the collection: tap a joke to hear it again (and tell it to friends at school)
let jokeTimers = [];
function stopJokeBook() { jokeTimers.forEach(clearTimeout); jokeTimers = []; }
function playJoke(j) {
  stopJokeBook();
  const steps = j.kk ? [['dog', DOG.knock[0]], ['lucky', LUCKY.whosThere[0]], ['dog', j.kk], ['lucky', j.who], ['dog', j.a]] : [['dog', j.q], ['dog', j.a]];
  let t = 0;
  jokeTimers = steps.map(([who, pair], i) => {
    const at = t;
    t += pair === j.who && j.cut ? 750 : pauseFor(pair, i === 0 && j.q ? 1500 : 900) + (pair === j.q ? 800 : 0);
    return setTimeout(() => speak(fill(L(pair), S.lang), S.lang, who), at);
  });
  jokeTimers.push(setTimeout(() => sfx.rimshot(), t));
}

// ---------- fun English: idioms Lucky acts out ----------

const IDIOMS_PER_DAY = 3, IDIOM_GAP = 3 * 864e5;
// An idiom that fits this moment ('any' for any of them): at most 3 a day, each one not again for 3 days, new ones first
function pickIdiom(when, chance = 0.5, inChain = false) {
  if (mode !== 'main' || ask || sheetOpen || modalOpen || (!inChain && (chainQ.length || antics.busy())) || !userActive()) return null;
  const T0 = st.today(S);
  if ((!turbo() && (T0.idioms || 0) >= IDIOMS_PER_DAY) || Math.random() > chance) return null;
  const now = Date.now();
  const pool = IDIOMS.filter((x) => (when === 'any' || x.when === when) && now - (S.idioms.at[x.id] || 0) > IDIOM_GAP);
  if (!pool.length) return null;
  const unheard = pool.filter((x) => !S.idioms.heard.includes(x.id));
  return pick(unheard.length ? unheard : pool);
}

// Lucky says the idiom, acts it out literally, then explains what it really means.
// It counts towards the day's three when the picture really starts (a replay from the collection doesn't count).
function idiomSteps(it, intro = false, counts = true) {
  return [
    ...(intro ? [timed('lucky', fresh(LUCKY.idiomIntro))] : []),
    ['lucky', ...it.say, 1100], // the picture starts while he is still saying it
    () => {
      const ms = antics.idiomShow(it.show);
      if (!ms) return -1;
      if (counts) { const T0 = st.today(S); T0.idioms = (T0.idioms || 0) + 1; S.idioms.at[it.id] = Date.now(); }
      if (!S.idioms.heard.includes(it.id)) { S.idioms.heard.push(it.id); stat('idiomsSeen'); }
      st.save(S);
      return ms;
    },
    ['lucky', ...it.mean],
  ];
}

function maybeIdiom(when, chance = 0.5) {
  if (when !== 'sleepSoon' && Date.now() < quietUntil) return false; // a saying would cut "soon I'll rest" short
  const it = pickIdiom(when, chance);
  if (!it) return false;
  talk(idiomSteps(it, ['any', 'idle', 'rare'].includes(when)), true);
  return true;
}

// From the collection: Lucky acts it out again (doesn't count towards the 3 a day)
function replayIdiom(it) {
  closeSheet();
  setTimeout(() => { if (mode === 'main' && !ask && !modalOpen) talk(idiomSteps(it, false, false), true); }, 450);
}

// ---------- tongue twisters: Tali asks, Lucky says it slowly, faster and super fast ----------

const TWISTERS_PER_VISIT = 2;
const twistersLeft = () => (turbo() ? 99 : TWISTERS_PER_VISIT - (S.dog.twisters || 0));
const SPEEDS = [[0.85, '🐢'], [1.25, '🐇'], [1.7, '🚀']];

function nextTwister() {
  const T = S.twisters;
  const pool = TWISTERS.filter((x) => !T.recent.includes(x.id));
  const unheard = pool.filter((x) => !T.heard.includes(x.id));
  const tw = pick(unheard.length ? unheard : pool.length ? pool : TWISTERS);
  T.recent.push(tw.id);
  while (T.recent.length > 12) T.recent.shift();
  return tw;
}

function taliTwister() {
  if (!dogHere || twistersLeft() <= 0 || ask || mode !== 'main' || chainQ.length) return false;
  S.dog.twisters = (S.dog.twisters || 0) + 1;
  const tw = nextTwister();
  const frog = pickIdiom('twister', 0.35, true); // sometimes: "Ahem! I've got a frog in my throat!"
  const at = ([speed, icon]) => () => {
    const ms = say([tw.t[0], `${icon} ${tw.t[1]}`], 'lucky', { chain: true, speed });
    if (!ms) return -1;
    antics.twistPose(speed);
    return Math.round((400 + tw.t[1].length * 70) / speed) + 350;
  };
  talk([
    timed('dog', fresh(DOG.twisterAsk)),
    ...(frog ? idiomSteps(frog) : []),
    ...SPEEDS.map(at),
    () => {
      if (!S.twisters.heard.includes(tw.id)) { S.twisters.heard.push(tw.id); stat('twistersSaid'); }
      st.boost(S, 'fun', 4);
      renderStats();
      award(addH(1, 'twister', 3));
      st.save(S);
      return antics.laughAt('dizzy') || 800;
    },
    timed('lucky', fresh(LUCKY.twisterTangled)),
    () => { const b = ui.dog.querySelector('.dog-body'); if (b) hop(b, 'dogspin', 1400); sfx.bark(); return 300; },
    timed('dog', fresh(DOG.twisterLaugh)),
    ['lucky', ...fresh(LUCKY.twisterYourTurn)],
  ], true);
  if (twistersLeft() <= 0) ui.dog.querySelector('.twist-btn')?.remove();
  st.save(S);
  return true;
}

// Tali: tap - he barks, double tap - spins after his tail, long press - belly rub
gestures(ui.dog, (t) => (mode === 'main' ? t.closest('.dog-body') : null), (kind, body, p) => {
  if (kind === 'press') { if (!p.second) { sfx.bark(); hop(body); say(fresh(DOG.tap), 'dog'); } return; }
  antics.dog(kind, body);
});

function dogLeave(silent = false) {
  if (!dogHere) return;
  dogHere = false;
  if (!silent && mode === 'main' && !sheetOpen) sayAuto(fresh(DOG.bye), 'dog');
  const body = ui.dog.querySelector('.dog-body');
  body?.classList.add('leave');
  setTimeout(() => { if (!dogHere) { ui.dog.innerHTML = ''; ui.scene.classList.remove('has-dog'); } }, silent ? 0 : 1200);
}

// Tali's visits happen while the child plays, not at set times, so there is nothing to miss:
// in the day's first session always (after 1.5-3.5 minutes of play), in later ones 60% of the time,
// at most 3 a day and 40 minutes apart. He stays about 6 minutes; never at night or while Lucky sleeps.
const DOG_STAY = 6 * 60e3, DOG_GAP = 40 * 60e3, DOG_PER_DAY = 3;
let dogDueAt = null, lastActiveMs = 0;

function planDog() {
  const d = S.dog, seenToday = d.day === st.today(S).date && d.n > 0;
  dogDueAt = Math.random() < (seenToday ? 0.6 : 1) ? (90 + Math.random() * 120) * 1000 : null;
}

function updateDog(now, asleep) {
  const d = S.dog, T0 = st.today(S, now);
  if (d.day !== T0.date) { d.day = T0.date; d.n = 0; }
  if (S.session.activeMs + 5000 < lastActiveMs) planDog(); // a new session has started
  lastActiveMs = S.session.activeMs;
  const forced = now < d.forceUntil;
  if (dogHere) {
    if (forced) { d.stayUntil = Math.max(d.stayUntil, d.forceUntil); d.forceUntil = 0; } // invited while here: he stays longer
    // time to go home (never in the middle of a joke); at once when Lucky falls asleep
    if (asleep || (now >= d.stayUntil && !chainQ.length)) { d.lastAt = now; dogLeave(asleep); st.save(S); }
    return;
  }
  if (asleep || mode !== 'main' || sheetOpen || modalOpen || ask || chainQ.length || antics.busy() || Date.now() < quietUntil) return;
  // one visitor at a time: not while the frog is here, nor right after her
  if (!forced && (ui.scene.querySelector('.frog') || now - frogGoneAt < 30e3)) return;
  const due = forced || (dogDueAt !== null && S.session.activeMs >= dogDueAt && d.n < DOG_PER_DAY
    && now - (d.lastAt || 0) > DOG_GAP && !st.isNight(now, S.settings) && windowActive() && now - lastInput < 30e3);
  if (!due) return;
  dogDueAt = null;
  if (!forced) d.n++;
  d.stayUntil = forced ? d.forceUntil : now + DOG_STAY;
  d.forceUntil = 0;
  d.played = false;
  d.jokes = 0;
  d.twisters = 0;
  dogArrive();
  st.save(S);
}

// ---------- sleep ----------

function fmtTime(t) {
  return new Date(t).toLocaleTimeString(S.lang === 'ru' ? 'ru-RU' : 'en-IE', { hour: '2-digit', minute: '2-digit' });
}

function renderSleep(force = false) {
  const now = Date.now();
  const night = st.isNight(now, S.settings) && now >= (S.session.wakeUntil || 0);
  const done = !night && now >= S.session.napUntil && dayDone();
  const until = night || done ? st.nextWake(now, S.settings) : S.session.napUntil;
  const key = `${night}-${done}-${until}-${S.lang}`;
  if (!force && key === sleepKey) return;
  sleepKey = key;
  const m = MISSIONS[st.missionIndex(S, MISSIONS.length)];
  const time = fmtTime(until);
  ui.overlay.className = 'overlay show sleep-ov' + (night ? '' : ' rest');
  cover(true);
  const bgHtml = night ? art.scene('night') + holidayLayers('night') : `${art.scene(S.bg)}${holidayLayers(S.bg)}<div class="rest-decor">${ui.decor.innerHTML}${ui.decorFront.innerHTML}</div><div class="rest-veil"></div>`;
  requestAnimationFrame(() => {
    const rd = ui.overlay.querySelector('.rest-decor'), bg = ui.overlay.querySelector('.sleep-bg');
    if (rd && bg) { const r = bg.getBoundingClientRect(); fitLayer(rd, r.width, r.height); }
  });
  ui.overlay.innerHTML = `<div class="sleep-bg">${bgHtml}</div>
    <button class="shooting" aria-label="star">🌠</button>
    <button class="icon-btn gear gear-sleep" aria-label="parents">⚙️</button>
    <div class="sleep-content">
      <h1>${night ? tr('nightTitle') : done ? tr('dayDoneTitle') : tr('napTitle')} 🌙</h1>
      <p>${night ? tr('nightSub', { time }) : done ? tr('dayDoneSub', { time }) : tr('napSub', { time })}</p>
      ${night ? '' : `<p class="rest-note">${tr('restNote')}</p>`}
      <div class="sleep-lucky">${luckyPic({ face: 'sleep', wear: S.wear })}<div class="zzz"><span>z</span><span>z</span><span>Z</span></div></div>
      ${!night && !S.today.missionDone ? `<div class="card idea"><div class="muted">${tr('napIdea')}</div><div class="task"><span class="t-emoji">${m.emoji}</span>${bi(m.text)}</div></div>` : ''}
    </div>`;
  ui.overlay.querySelector('.sleep-lucky').onclick = (e) => {
    toast('🤫 ' + tr('shh'), 2000);
    sfx.note(262);
    const r = ui.overlay.getBoundingClientRect();
    const z = document.createElement('span');
    z.className = 'float snore';
    z.textContent = '💤';
    z.style.left = (e.clientX - r.left) + 'px';
    z.style.top = (e.clientY - r.top) + 'px';
    z.style.setProperty('--dx', '20px');
    ui.overlay.appendChild(z);
    setTimeout(() => z.remove(), 1400);
  };
  ui.overlay.querySelector('.sleep-bg').onclick = (e) => {
    const t = e.target.closest('[data-tap]');
    if (!t) return;
    hop(t, 'tapped');
    if (t.dataset.tap === 'moon') sfx.note(523); else sfx.note(pick([784, 880, 988, 1175]));
  };
  ui.overlay.querySelector('.shooting').onclick = (e) => { e.currentTarget.classList.add('caught'); sfx.sparkle(); toast('🌠 ' + tr('wish'), 3000); };
  bindParentGear(ui.overlay.querySelector('.gear-sleep'));
}

function enterSleep() {
  antics.end();
  antics.clearProps();
  if (mode === 'edit') finishEdit(true);
  if (mode === 'wash') finishWash();
  cancelAsk();
  silence();
  ui.scene.querySelectorAll('.surprise, .visitor, .frog').forEach((x) => x.remove());
  closeSheet();
  mode = 'sleep';
  sleepKey = '';
  renderSleep(true);
}

function exitSleep() {
  mode = 'main';
  ui.overlay.className = 'overlay';
  ui.overlay.innerHTML = '';
  cover(false);
  renderLucky(true);
  updateEvent(); // a new day may have brought a holiday
  if (!holidayHi()) sayAuto(fresh(LUCKY.woke));
  if (!document.hidden) wokeAt = Date.now();
  sfx.happy();
}
let wokeAt = 0; // he has just said good morning (coming back to the app wakes him up first)

// "Soon I'll need a rest": it stays on the screen a few seconds (a tap doesn't sweep it away; he still moves) and
// comes once more 20 s before the rest. It waits until Lucky can say it (not over a question, a joke or a line that is
// playing), and the rest is counted from the moment it was seen: false means not yet, the loop tries again a second
// later. late: the limit passed a while ago, so it cuts in (still not over a question or Tali's joke)
function sleepSoon(late = false) {
  const free = Date.now() >= busyUntil && !ask && !chainQ.length;
  if (!free && !late) return false;
  const shown = free ? maybeIdiom('sleepSoon', 0.5) || sayAuto(fresh(LUCKY.sleepSoon)) > 0 : say(fresh(LUCKY.sleepSoon), 'lucky', { urgent: true }) > 0;
  if (!shown) return false;
  quietUntil = Date.now() + 4000;
  setTimeout(() => { if (mode === 'main' && !document.hidden && sayAuto(fresh(LUCKY.sleepSoon))) quietUntil = Date.now() + 4000; }, 40e3);
  return true;
}

function startNap() {
  S.session.napUntil = Date.now() + S.settings.napMin * 60e3;
  S.session.activeMs = 0;
  S.session.warned = false;
  sfx.sleep();
  st.save(S);
  loop();
}

function askBed() {
  if (mode !== 'main') return;
  showModal({
    art: luckyPic({ face: 'tired', wear: S.wear }),
    title: tr('putToBed'),
    buttons: [
      { label: `🌙 ${tr('yes')}`, onClick: () => {
        say(fresh(S.pet.energy < 45 ? [...LUCKY.bedSleepy, ...LUCKY.bedThanks] : LUCKY.bedNotSleepy));
        award(addH(3, 'bed', 3));
        setTimeout(startNap, 1800);
      } },
      { label: tr('no') },
    ],
  });
}

// ---------- parents ----------

// Password-protected parents' area. A default password works until the parent sets their own inside;
// the recovery password from the README always works (config.js). Only the hash of the parent's own password
// is stored, only on this phone.
let adminUntil = 0;
const pwHash = (v) => st.hash(v.trim().toLowerCase());
const passwordOk = (v) => {
  const h = pwHash(v);
  return h === (st.parentHash() ?? pwHash(CONFIG.parent.password)) || h === pwHash(CONFIG.parent.recovery);
};

function bindParentGear(btn) {
  btn.addEventListener('click', () => { sfx.tap(); askPassword(); });
}

function pwCard(host, text, fields, onOk, done) {
  host.innerHTML = `<div class="modal-card pw-card"><h2>🔒 ${tr('parent')}</h2><p>${text}</p>
    ${fields.map((ph) => `<input type="password" class="pw" placeholder="${ph}" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="done">`).join('')}
    <p class="pw-err"></p>
    <div class="m-btns"><button class="btn pink pw-ok">${tr('pwOk')}</button><button class="btn pw-cancel">${tr('pwCancel')}</button></div></div>`;
  const inputs = [...host.querySelectorAll('.pw')];
  const err = (msg) => { host.querySelector('.pw-err').textContent = msg; inputs.forEach((i) => { i.value = ''; hop(i, 'shake'); }); inputs[0].focus(); sfx.tap(); };
  setTimeout(() => inputs[0].focus(), 60);
  const ok = () => onOk(inputs.map((i) => i.value), err);
  host.querySelector('.pw-ok').onclick = ok;
  inputs.forEach((i, n) => { i.onkeydown = (e) => { if (e.key !== 'Enter') return; if (n < inputs.length - 1) inputs[n + 1].focus(); else ok(); }; });
  host.querySelector('.pw-cancel').onclick = () => { sfx.tap(); done(); };
}

function fmtDateTime(t) {
  return new Date(t).toLocaleString(S.lang === 'ru' ? 'ru-RU' : 'en-IE', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

let pwOpen = false;
function askPassword() {
  if (Date.now() < adminUntil) return openParent();
  if (pwOpen) return;
  pwOpen = true;
  showModal({ cls: '', custom: (host, doneModal) => {
    const done = () => { pwOpen = false; doneModal(); };
    const ask = () => {
      pwCard(host, tr('pwHint'), [''], ([a], err) => {
        if (!passwordOk(a)) return err(tr('pwWrong'));
        adminUntil = Date.now() + 10 * 60e3;
        done();
        openParent();
      }, done);
      host.querySelector('.m-btns').insertAdjacentHTML('afterend', `<button class="btn ghost pw-forgot">${tr('pwForgot')}</button>`);
      // Forgot it: the recovery password from the README opens the area, then a new password can be set there
      host.querySelector('.pw-forgot').onclick = () => {
        sfx.tap();
        host.innerHTML = `<div class="modal-card pw-card"><h2>🔒 ${tr('pwForgot')}</h2><p>${tr('pwForgotText')}</p>
          <div class="m-btns"><button class="btn pink pw-back">${tr('pwOk')}</button></div></div>`;
        host.querySelector('.pw-back').onclick = () => { sfx.tap(); ask(); };
      };
    };
    ask();
  } });
}

// Confirm a parent action
function confirmBox(title, text, yes, onYes) {
  showModal({ art: '<div class="big-emoji">⚠️</div>', title, text, buttons: [{ label: yes, onClick: onYes }, { label: tr('pwCancel') }] });
}

function setTurbo(on) {
  if (on) {
    confirmBox(tr('turboOnTitle'), tr('turboOnText'), tr('turboOn'), () => {
      st.snapshot(S);
      S.turbo = true;
      st.save(S);
      renderTop();
      toast('⚡ ' + tr('turboActive'), 3000);
      openParent();
    });
  } else {
    confirmBox(tr('turboOffTitle'), tr('turboOffText'), tr('turboOff'), () => {
      if (st.restoreSnapshot()) location.reload();
      else { S.turbo = false; st.save(S); renderTop(); openParent(); }
    });
  }
}

function resetAll() {
  confirmBox(tr('resetTitle'), tr('resetText'), tr('resetYes'), () => {
    confirmBox(tr('resetTitle2'), tr('resetText2'), tr('resetYes2'), () => { st.wipe(); location.reload(); });
  });
}

// Turbo tools: quickly show and test any feature
const TURBO_TOOLS = [
  ['level', '⬆️', () => { closeSheet(); S.hearts = st.levelNeed(S.level) - 1; award(st.addHearts(S, 1, 'turbo', Infinity)); }],
  ['full', '💯', () => { Object.assign(S.pet, { hunger: 100, fun: 100, clean: 100, energy: 100 }); renderStats(); }],
  ['sad', '😢', () => { Object.assign(S.pet, { hunger: 20, fun: 25, clean: 20, energy: 40 }); renderStats(); }],
  ['dog', '🐶', () => { S.dog.forceUntil = Date.now() + DOG_STAY; closeSheet(); loop(); }],
  ['frog', '🐸', () => { closeSheet(); showFrog(true); }],
  ['bug', '🦋', () => { closeSheet(); nextVisitorAt = 0; lastInput = Date.now(); loop(); }],
  ['ask', '❓', () => { closeSheet(); lastInput = Date.now(); busyUntil = 0; startAsk(pickAsk()); }],
  ['day', '🌅', () => { S.today = null; st.today(S); closeSheet(); toast('🌅 ' + tr('newDay'), 2000); }],
  ['nap', '💤', () => { closeSheet(); startNap(); }],
  ['idiom', '🎭', () => { closeSheet(); setTimeout(() => maybeIdiom('any', 1), 450); }],
  ['trick', '🎩', () => { closeSheet(); lastInput = Date.now(); setTimeout(() => { silence(); tricks.special('any', true); }, 600); }],
  ['holiday', '🎃', () => {
    const ids = [null, ...EVENTS.map((e) => e.id)], i = ids.indexOf(S.eventPreview || null);
    S.eventPreview = ids[(i + 1) % ids.length];
    closeSheet();
    updateEvent();
    toast(S.eventPreview ? `${EVENT_BY_ID[S.eventPreview].icon} ${L(EVENT_BY_ID[S.eventPreview].name)}` : `📅 ${tr('holidayAuto')}`, 2500);
  }],
];

function openParent() {
  const s = S.settings;
  const sel = (key, opts, fmt = (v) => v) => `<select data-k="${key}">${opts.map((o) => `<option value="${o}" ${String(s[key]) === String(o) ? 'selected' : ''}>${fmt(o)}</option>`).join('')}</select>`;
  const times = (from, to) => { const r = []; for (let m = from; m <= to; m += 30) r.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${m % 60 ? '30' : '00'}`); return r; };
  const tog = (key) => `<label class="switch"><input type="checkbox" data-k="${key}" ${s[key] ? 'checked' : ''}><i></i></label>`;
  const played = Math.round((S.playedMs[st.today(S).date] || 0) / 60e3);
  const mood = MOODS.find(([id]) => id === S.today.mood);
  const viewed = Math.round((S.viewMs[st.today(S).date] || 0) / 60e3);
  const html = `<div class="card"><b>${tr('playedToday', { n: played })}</b><br>${tr('viewedToday', { n: viewed })}${mood ? `<br>${tr('moodToday')}: ${mood[1]} ${tr('mood_' + mood[0])}` : ''}</div>
    <div class="form">
      <label>${tr('sessionLen')}${sel('sessionMin', [5, 10, 15, 20, 30], (v) => `${v} ${tr('min')}`)}</label>
      <label>${tr('napLen')}${sel('napMin', [30, 60, 90, 120, 180], (v) => `${v} ${tr('min')}`)}</label>
      <label>${tr('gamesPerDay')}${sel('gamesPerDay', [2, 3, 4, 5, 6])}</label>
      <label>${tr('dailyMax')}${sel('dailyMax', [30, 45, 60, 90, 120, 0], (v) => (v ? `${v} ${tr('min')}` : tr('noLimit')))}</label>
      <label>${tr('bedtime')}${sel('bedtime', times(19 * 60, 23 * 60))}</label>
      <label>${tr('wake')}${sel('wake', times(6 * 60, 9 * 60))}</label>
      <label>${tr('sound')}${tog('sound')}</label>
      <label>${tr('voice')}${tog('voice')}</label>
      <label>${tr('translate')}${tog('translate')}</label>
      <label>${tr('realPet')}${tog('realPet')}</label>
      <label>${tr('holidays')}${tog('holidays')}</label>
    </div>
    <div class="card"><div class="card-title">${tr('modeTitle')}</div>
      <div class="tabs mode-tabs"><button class="tab ${turbo() ? '' : 'on'}" data-m="std">🐢 ${tr('modeStd')}</button><button class="tab ${turbo() ? 'on' : ''}" data-m="turbo">⚡ ${tr('modeTurbo')}</button></div>
      <p class="muted">${turbo() ? tr('turboNote') : tr('stdNote')}</p>
      ${turbo() ? `<div class="tools">${TURBO_TOOLS.map(([id, e]) => `<button class="tool" data-t="${id}"><span>${e}</span>${tr('tool_' + id)}</button>`).join('')}</div>` : ''}
    </div>
    <div class="card pw-change"><div class="card-title">🔒 ${tr('pwChangeTitle')}</div>
      ${st.parentHash() ? '' : `<p class="muted">${tr('pwDefaultNote')}</p>`}
      <div class="pw-row"><input type="password" class="pw-new" placeholder="${tr('pwNewPh')}" autocomplete="off" autocapitalize="none" spellcheck="false" enterkeyhint="done">
        <button class="btn ghost pw-eye" aria-label="show">👁</button><button class="btn pink pw-save">${tr('pwSave')}</button></div>
      <p class="pw-err"></p>
    </div>
    <div class="card sound-test"><div class="row wrap" style="margin:0"><button class="btn purple test-sound">🔊 ${tr('testSound')}</button></div><p class="muted sound-status"></p></div>
    <div class="row wrap">
      <button class="btn purple wake">⏰ ${tr('wakeLucky')}</button>
      <button class="btn pink invite">🐶 ${tr('inviteDog')}</button>
    </div>
    <p class="muted">${tr('installHint')}</p>
    <div class="row"><button class="btn ghost danger reset">${tr('resetAll')}</button></div>
    <p class="muted center app-version">Lucky v${VERSION} · build ${BUILD}</p>`;
  openSheet('⚙️ ' + tr('parent'), html, (root) => {
    root.querySelectorAll('select').forEach((x) => {
      x.onchange = () => { s[x.dataset.k] = /Min$|PerDay$|Max$/.test(x.dataset.k) ? Number(x.value) : x.value; st.save(S); loop(); };
    });
    root.querySelectorAll('input[type=checkbox]').forEach((x) => {
      x.onchange = () => { s[x.dataset.k] = x.checked; setSound(s.sound); setVoice(s.voice); st.save(S); updateEvent(); };
    });
    root.querySelector('.wake').onclick = () => {
      S.session.napUntil = 0;
      S.session.activeMs = 0;
      S.session.warned = false;
      // At night: wake him until the morning (this night only); next night Lucky sleeps on schedule
      if (st.isNight(Date.now(), s)) { S.session.wakeUntil = st.nextWake(Date.now(), s); toast('⏰ ' + tr('wokeByParent', { time: fmtTime(S.session.wakeUntil) }), 3500); }
      st.save(S);
      closeSheet();
      loop();
    };
    root.querySelector('.invite').onclick = () => {
      S.dog.forceUntil = Date.now() + DOG_STAY;
      closeSheet();
      loop();
    };
    const showStatus = () => { const st2 = soundStatus(); root.querySelector('.sound-status').textContent = `Web Audio: ${st2.webAudio} · session: ${st2.session} · silent track: ${st2.silentTrack} · clips: ${st2.clips} · sound: ${st2.sound ? 'on' : 'off'} · voice: ${st2.voice ? 'on' : 'off'}`; };
    showStatus();
    root.querySelector('.test-sound').onclick = () => { testSound(say2(LUCKY.greet[2], 'en')); setTimeout(showStatus, 600); setTimeout(showStatus, 2000); };
    root.querySelector('.reset').onclick = () => { sfx.tap(); closeSheet(); resetAll(); };
    // a new parent password: no need for the old one, the parent is already inside
    const pwIn = root.querySelector('.pw-new'), pwErr = root.querySelector('.pw-change .pw-err');
    root.querySelector('.pw-eye').onclick = () => { pwIn.type = pwIn.type === 'password' ? 'text' : 'password'; };
    const savePw = () => {
      if (pwIn.value.trim().length < 4) { pwErr.textContent = tr('pwShort'); hop(pwIn, 'shake'); return; }
      st.setParentHash(pwHash(pwIn.value));
      sfx.happy();
      toast('🔒 ' + tr('pwSaved'), 2500);
      openParent();
    };
    root.querySelector('.pw-save').onclick = savePw;
    pwIn.onkeydown = (e) => { if (e.key === 'Enter') savePw(); };
    root.querySelectorAll('.mode-tabs .tab').forEach((b) => {
      b.onclick = () => { if ((b.dataset.m === 'turbo') !== turbo()) { sfx.tap(); closeSheet(); setTurbo(b.dataset.m === 'turbo'); } };
    });
    root.querySelectorAll('.tool').forEach((b) => { b.onclick = () => { sfx.sparkle(); TURBO_TOOLS.find(([id]) => id === b.dataset.t)[2](); }; });
  });
}

// ---------- chatter ----------

// When the child is just watching: rare calm lines, mostly mood-based
function ambientTalk() {
  const list = Math.random() < 0.6 ? LUCKY.tier[tier()] : LUCKY[pick(['idle', 'facts', 'ninja', 'compliments'])];
  say(fresh(list), 'lucky', { auto: true, ambient: true });
}

const IDLE_BAG = [['idle', 3], ['questions', 2], ['jokes', 2], ['facts', 2], ['ninja', 1], ['compliments', 1], ['outside', 2], ['phraseHint', 0.6], ['riddle', 1.5], ['realPet', 1]];
const NEED_LINES = { hunger: 'hungry', energy: 'tired', fun: 'bored', clean: 'dirty' };

// Line choice: mostly about unmet needs and mood, sometimes general topics and rare lines
function idleTalk() {
  const p = S.pet, t = tier();
  if (Math.random() < 0.03) { if (maybeIdiom('rare', 0.5)) return; return sayAuto(fresh(LUCKY.rare)); }
  if (t === 'low' && maybeIdiom('low', 0.25)) return;
  if ((S.playedMs[S.today.date] || 0) > 40 * 60e3 && maybeIdiom('playedLong', 0.3)) return;
  if (Math.random() < 0.08 && maybeIdiom(Math.random() < 0.3 ? 'idle' : 'any', 1)) return;
  // holidays: a word about it now and then (Tali has his own in the last week)
  if (EV && EV.stage >= 2 && LUCKY.holiday[EV.id] && Math.random() < 0.1) return sayAuto(fresh(LUCKY.holiday[EV.id].idle));
  if (dogHere && EV && EV.stage >= 3 && EV.days <= 7 && dogHoliday()?.length && Math.random() < 0.15) return sayAuto(fresh(dogHoliday()), 'dog');
  if (dogHere && jokesLeft() > 0 && Math.random() < (t === 'low' ? 0.6 : 0.2)) return taliJoke(t === 'low' ? DOG.cheer : DOG.jokeMore);
  if (dogHere && Math.random() < 0.25) return prank(fresh(PRANKS));
  if (dogHere && Math.random() < 0.45) return talk(acted(fresh(CHATS)));
  const needs = Object.keys(NEED_LINES).filter((k) => p[k] < 40);
  if (needs.length && Math.random() < 0.7) return sayAuto(fresh(LUCKY[NEED_LINES[pick(needs)]]));
  if (st.minutesToBed(Date.now(), S.settings) <= 60 && Math.random() < 0.4) return sayAuto(fresh(LUCKY.evening));
  if (!S.today.missionDone && Math.random() < 0.12) { if (maybeIdiom('missionHint', 0.4)) return; return sayAuto(fresh(LUCKY.missionHint)); }
  if (Math.random() < (t === 'low' ? 0.75 : 0.5)) return sayAuto(fresh(LUCKY.tier[t]));
  const bag = IDLE_BAG.filter(([k]) => (k !== 'realPet' || S.settings.realPet) && !(t === 'low' && (k === 'jokes' || k === 'riddle')));
  let x = Math.random() * bag.reduce((a, [, w]) => a + w, 0);
  const [kind] = bag.find(([, w]) => (x -= w) < 0) || bag[0];
  if (kind === 'riddle') return riddle(fresh(RIDDLES));
  sayAuto(fresh(LUCKY[kind]));
}

// Mood changes: celebrate recovering and being thrilled; when thrilled he binkies on his own
let prevTier = null, recoveredAt = 0, nextBinkyAt = 0, nextTailAt = Date.now() + 120e3;
function moodEvents(now, T0) {
  const t = tier();
  if (mode === 'main' && userActive() && !antics.busy() && !sheetOpen && !modalOpen) {
    if (prevTier === 'low' && t !== 'low' && now - recoveredAt > 180e3) { recoveredAt = now; sayAuto(fresh(LUCKY.recovered)); }
    else if (t === 'max' && prevTier && prevTier !== 'max' && !T0.maxSaid) { T0.maxSaid = true; if (!maybeIdiom('max', 0.6)) { sayAuto(fresh(LUCKY.maxReached)); binky(true); } }
    else if (t === 'max' && now > nextBinkyAt) { nextBinkyAt = now + 90e3 + Math.random() * 60e3; if (prevTier === 'max') binky(true); }
    else if ((t === 'happy' || t === 'max') && now > nextTailAt && now >= busyUntil && !ask) { nextTailAt = now + 150e3 + Math.random() * 120e3; if (prevTier && Math.random() < 0.5) chaseTail(); }
  }
  prevTier = t;
}

// ---------- main loop ----------

function loop() {
  const now = Date.now();
  st.applyDecay(S, now);
  const T0 = st.today(S, now);
  let asleep = turbo() ? now < S.session.napUntil : (st.isAsleep(S, now) || dayOver(T0, now));

  const dt = Math.max(0, Math.min(now - (S.session.lastAt || now), 5000));
  if (!document.hidden) S.viewMs[T0.date] = (S.viewMs[T0.date] || 0) + dt;
  // Session time is used only while the child is active; just watching Lucky is free
  if (S.session.activeMs > 0 && now - (S.session.activeAt || now) > restGap()) { S.session.activeMs = 0; S.session.warned = false; }
  if (!document.hidden && !asleep && userActive()) {
    S.session.activeAt = now;
    S.session.activeMs += dt;
    S.playedMs[T0.date] = (S.playedMs[T0.date] || 0) + dt;
    const limit = S.settings.sessionMin * 60e3;
    if (!turbo() && (mode === 'main' || mode === 'wash' || mode === 'edit')) {
      if (!S.session.warned && S.session.activeMs >= limit - 60e3 && sleepSoon(S.session.activeMs >= limit + 30e3)) { S.session.warned = true; S.session.warnedAt = now; }
      const dayLimit = S.settings.dailyMax * 60e3, played = S.playedMs[T0.date] || 0; // the day's limit: the same minute's notice
      if (dayLimit && !T0.dayWarned && played >= dayLimit - 60e3 && sleepSoon(played >= dayLimit + 30e3)) { T0.dayWarned = true; T0.dayWarnedAt = now; }
      // the nap comes at least 45 s after "soon I'll need a nap" was seen (a game can run past the limit: the warning
      // then comes when it is over, and the nap a little later, not in the same second); two minutes past the limit
      // without a warning (a question left open) he goes anyway
      if (S.session.activeMs >= limit && (S.session.warned ? now - (S.session.warnedAt || 0) >= 45e3 : S.session.activeMs >= limit + 120e3)) {
        S.session.napUntil = now + S.settings.napMin * 60e3;
        S.session.activeMs = 0;
        S.session.warned = false;
        sfx.sleep();
        asleep = true;
      }
    }
  }
  S.session.lastAt = now;
  if (S.session.napUntil && now >= S.session.napUntil) {
    S.session.napUntil = 0;
    S.session.activeMs = 0;
    S.session.warned = false;
    asleep = turbo() ? now < S.session.napUntil : (st.isAsleep(S, now) || dayOver(T0, now));
  }

  if (asleep && mode !== 'game' && mode !== 'mission') {
    if (mode !== 'sleep') enterSleep(); else renderSleep();
  } else if (!asleep && mode === 'sleep') exitSleep();

  updateDog(now, asleep);
  if (tick % 60 === 0) updateEvent();
  ui.scene.classList.toggle('evening', st.minutesToBed(now, S.settings) <= 60 || (EV?.id === 'halloween' && EV.stage >= 4));

  flushPending(now);
  if (mode === 'main' && !sheetOpen && !modalOpen && windowActive() && now >= busyUntil && !chainQ.length && !antics.busy()) {
    const idleFor = now - lastInput;
    if (idleFor < ACTIVE_MS && canAsk() && now - lastAskAt > ASK_EVERY && (T0.asks < 8 || turbo()) && now - lastSpeech > 8e3 && Math.random() < 0.3) startAsk(pickAsk());
    else if (idleFor < ACTIVE_MS && !ask && now - lastSpeech > 60e3) idleTalk();
    else if (idleFor >= ACTIVE_MS && idleFor < 10 * 60e3 && now - lastSpeech > 180e3) ambientTalk();
  }
  checkPlan(T0);
  moodEvents(now, T0);
  needCues(now);
  if (tick % 10 === 0) checkBadges();
  if (tick % 60 === 0) applyNinjaLook();
  maybeVisitor(now);
  maybeFidget(now);
  maybeSurprise(now, T0);
  maybeMood(T0);
  maybeFrog(now, T0);

  renderStats();
  renderLucky();
  renderTop();
  if (++tick % 5 === 0) st.save(S);
}

// Returns how long the player was away. A long break also counts as rest.
// A long break without activity also counts as rest
const restGap = () => Math.min(20, S.settings.napMin) * 60e3;

function resume() {
  const now = Date.now();
  const gap = now - (S.session.activeAt || S.session.lastAt || now);
  if (gap > restGap()) { S.session.activeMs = 0; S.session.warned = false; }
  S.session.lastAt = now;
  return gap;
}

document.addEventListener('pointerdown', () => {
  const away = Date.now() - lastInput;
  lastInput = Date.now();
  // back after a couple of minutes of just looking: "Sorry, I had my head in the clouds!"
  if (away > 120e3 && mode === 'main') setTimeout(() => maybeIdiom('back', 0.35), 350);
}, { capture: true });
window.addEventListener('blur', () => silence());
window.addEventListener('focus', () => { lastInput = Date.now(); lastSpeech = Date.now(); });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { silence(); st.save(S); return; }
  const gap = resume();
  lastInput = Date.now();
  lastSpeech = Date.now();
  loop();
  updateEvent(); // the app may have slept in memory overnight: the holiday look and greeting are today's
  // one hello: if he has just woken up and said good morning, that was it
  if (mode === 'main' && Date.now() - wokeAt > 2000 && !holidayHi() && gap > 3 * 3600e3) sayAuto(fresh(LUCKY.welcomeBack));
});
window.addEventListener('pagehide', () => st.save(S));

// After a rotation iOS can leave the page scrolled or keep stale sizes: reset and redraw once upright
let rotateT = 0;
const redrawAfterRotate = () => {
  clearTimeout(rotateT);
  rotateT = setTimeout(() => {
    if (window.innerWidth > window.innerHeight) return;
    window.scrollTo(0, 0);
    if (mode === 'edit') { editScale(false); document.body.classList.remove('editing'); ui.tray.hidden = true; sceneH = ui.scene.offsetHeight; document.body.classList.add('editing'); ui.tray.hidden = false; editScale(true); }
    renderBg();
    renderDecor();
    renderLucky(true);
    if (mode === 'sleep') renderSleep(true);
  }, 300);
};
window.addEventListener('orientationchange', redrawAfterRotate);
window.addEventListener('resize', redrawAfterRotate);

['touchend', 'click', 'pointerup'].forEach((ev) => document.addEventListener(ev, unlockAudio, { passive: true, capture: true }));
document.addEventListener('gesturestart', (e) => e.preventDefault());

// ---------- start ----------

function greetList(gap) {
  if (gap > 3 * 3600e3 && Math.random() < 0.6) return LUCKY.welcomeBack;
  const d = new Date(), h = d.getHours(), weekend = d.getDay() === 0 || d.getDay() === 6;
  if (Math.random() < 0.35) return LUCKY.greet;
  if (h < 12) return LUCKY.morning;
  if (h < 18) return weekend ? LUCKY.weekend : LUCKY.afternoon;
  return LUCKY.evening;
}

// Tali's holiday lines: one list, or lines for before the day and for the day itself (his birthday wishes wait for it)
const dogHoliday = () => { const d = EV && DOG.holiday[EV.id]; return Array.isArray(d) ? d : d && (EV.days > 0 ? d.before : d.day); };

// St Nicholas comes in the night before 6 December (in Ukraine, since 2023) and leaves presents under the pillow:
// inside the Christmas weeks the eve and the day have their own greeting, and a present waits for her
const nicholasDay = (d = new Date()) => (d.getMonth() === 11 ? { 5: 'eve', 6: 'greet' }[d.getDate()] : null);

// In a holiday's last week the day's first greeting is about it: on the eve its own line, on the day the greeting
// (the decorations are out for three weeks, the greeting only in the last one)
function holidayGreeting() {
  const T0 = st.today(S), nick = EV?.id === 'christmas' && EV.stage >= 3 && !EV.preview && nicholasDay();
  if (nick) {
    if (T0.holidayHi === 'nicholas') return null;
    T0.holidayHi = 'nicholas';
    return LUCKY.holiday.nicholas[nick];
  }
  const H = EV && EV.stage >= 3 && EV.days <= 7 && LUCKY.holiday[EV.id];
  if (!H || T0.holidayHi === EV.id) return null;
  T0.holidayHi = EV.id;
  return EV.stage >= 4 ? H.greet : EV.days === 1 && H.eve ? H.eve : H.idle;
}

// Says the day's holiday greeting if there is one (on arrival, on coming back to the app and on waking up);
// on New Year's Day itself the countdown follows, on her birthday a card, on St Nicholas Day his present
function holidayHi() {
  if (document.hidden) return false; // the app is in the background: kept for when she comes back
  const hol = holidayGreeting();
  if (!hol) return false;
  setTemp('happy', 1500);
  // on New Year's Day the countdown is the greeting (it ends with "Happy New Year!" and fireworks)
  if (EV.id === 'newyear' && EV.days === 0) { setTimeout(() => { if (mode === 'main' && !antics.busy() && !ask) antics.countdown(); else sayAuto(fresh(hol)); }, 1200); return true; }
  // on the day itself the greeting goes on in the family's other languages (her birthday, Songkran, Independence Day)
  const more = EV.days === 0 && hol === LUCKY.holiday[EV.id]?.greet ? LUCKY.holiday[EV.id].hello || [] : [];
  let ms = 4000;
  if (more.length) {
    const lines = [timed('lucky', fresh(hol)), ...more.map((l) => timed('lucky', l))];
    ms = lines.reduce((sum, l) => sum + l[3], 1500);
    talk(lines);
  } else sayAuto(fresh(hol));
  if (EV.id === 'birthday' && EV.days === 0) setTimeout(birthdayCard, ms);
  if (st.today(S).holidayHi === 'nicholas') setTimeout(nicholasPresent, ms);
  return true;
}

// Her birthday: after Lucky's greeting, a card from Lucky and Tali with what they have done together (once a year;
// her age is never in the game, so it doesn't say how old she is)
function birthdayCard() {
  const y = new Date().getFullYear();
  if (!EV || EV.id !== 'birthday' || EV.days !== 0 || S.bdCard === y || !S.onboarded) return;
  if (mode !== 'main') { setTimeout(birthdayCard, 5000); return; }
  if (!EV.preview) S.bdCard = y; // a parent's preview doesn't use up the real one
  st.save(S);
  const tiles = [['📅', S.days.length, 'bdDays'], ['😂', S.jokes.heard.length, 'bdJokes'], ['🥷', S.ninja.scroll.length, 'bdMissions'], ['⭐', S.stickers.length, 'bdStickers'],
    ...(S.stats.best_keepy ? [['⚽', S.stats.best_keepy, 'bdKeepy']] : [])];
  showModal({ cls: 'bd-host', custom: (host, done) => {
    host.innerHTML = `<div class="modal-card bd-card"><div class="m-art">${luckyPic({ face: 'happy', wear: S.wear })}</div>
      <h2>${tr('bdTitle', { name: kidName(S.lang) })}</h2><p class="muted">${tr('bdSub')}</p>
      <div class="bd-grid">${tiles.map(([e, n, k]) => `<div class="bd-tile"><span>${e}</span><b>${n}</b><small>${tr(k, { n })}</small></div>`).join('')}</div>
      <p class="bd-belt">🥋 ${tr('bdBelt', { x: L(BELTS[S.belt].name) })}</p>
      <p class="bd-sign">${tr('bdSign', { dog: dogName(S.lang) })}</p>
      <div class="m-btns"><button class="btn pink">${tr('bdThanks')}</button></div></div>`;
    host.querySelector('.btn').onclick = () => { sfx.happy(); confetti(); done(); };
  } });
}

// St Nicholas's present: under the pillow on the morning of 6 December (after Lucky's greeting); if she comes later,
// Lucky has kept it for her until Christmas Eve
function nicholasPresent() {
  const n = new Date(), y = n.getFullYear();
  if (!S.settings.holidays || !S.onboarded || mode !== 'main' || n.getMonth() !== 11 || n.getDate() < 6 || n.getDate() > 24 || S.nicholas === y) return;
  if (nicholasDay(n) === 'greet' && st.today(S).holidayHi !== 'nicholas') return; // the greeting comes first
  S.nicholas = y;
  const g = rollGift(0.4, 0.15);
  st.save(S);
  showModal({ custom: (host, done) => revealGift(host, { title: tr('nicholasGift'), rewards: [g], line: LUCKY.holiday.nicholas.gift }, done) });
}

function greet(gap) {
  if (holidayHi()) return;
  const h = new Date().getHours();
  if (h < 12 && gap > 6 * 3600e3 && maybeIdiom(h < 8 ? 'early' : 'morning', 0.5)) return;
  setTemp('happy', 1500);
  sayAuto(fresh(greetList(gap)));
}

function start() {
  // A visit doesn't survive closing the app: Tali has gone home, and the next one comes after the usual gap
  if (S.dog.stayUntil > Date.now()) S.dog.lastAt = Date.now();
  S.dog.stayUntil = 0;
  S.dog.forceUntil = 0;
  lastActiveMs = S.session.activeMs;
  planDog();
  // Old saves: a single outfit becomes a wardrobe slot
  const old = WEAR_BY_ID[S.outfit];
  if (old && !Object.values(S.wear).some(Boolean)) S.wear = { [old.slot]: old.id };
  if (old && !ownsWear(old)) S.owned.push(old.id);
  S.outfit = null;
  if (!S.badgesSeeded) {
    // First launch of this version: unlocked worlds count as visited, already earned badges are granted silently
    for (const pl of PLACES) if (S.level >= pl.level && !S.worldsSeen.includes(pl.id)) S.worldsSeen.push(pl.id);
    for (const [id, , , key, goal] of BADGES) if (!S.badges.includes(id) && statValue(key) >= goal) S.badges.push(id);
    for (const a of ALBUMS) if (!S.albumsDone.includes(a.id) && a.stickers.every((x) => S.stickers.includes(x))) { S.albumsDone.push(a.id); if (!S.owned.includes(a.reward)) S.owned.push(a.reward); }
    S.badgesSeeded = true;
  }
  if (!S.worldsSeen.includes(S.bg)) S.worldsSeen.push(S.bg);
  // The UI and Lucky's speech are always English; Russian is the small translation, spoken on tap
  S.lang = 'en';
  setSound(S.settings.sound && !MUTE);
  setVoice(S.settings.voice && !MUTE);
  const gap = resume();
  applyLang();
  renderBg();
  renderDecor();
  renderLucky(true);
  applyNinjaLook();
  updateEvent(true);
  migrateLayout();
  $('#beltChip').onclick = () => {
    if (mode !== 'main') return;
    sfx.tap();
    const b = BELTS[S.belt];
    toast(`🥷 <b>${tr('belt')}: ${L(b.name)}</b><br>${S.belt >= BELTS.length - 1 ? tr('beltMax') : tr('beltProgress', { n: S.beltSteps }) + ' · ' + tr('beltGoal')}`, 4500);
    openDojo();
  };
  $('#sleepBtn').onclick = () => { sfx.tap(); askBed(); };
  $('#wordBtn').onclick = () => { finishWash(); if (mode === 'main') { sfx.tap(); openPhrase(); } };
  $('#editBtn').onclick = () => { finishWash(); sfx.tap(); startEdit(); };
  $('#eventBtn').onclick = () => { finishWash(); if (mode === 'main') { sfx.tap(); openCalendar(); } };
  $('#lvlCard').onclick = () => { finishWash(); if (mode === 'main') { sfx.tap(); openPlan(); } };
  bindParentGear($('#gearBtn'));
  lastSpeech = Date.now();
  loop();
  setInterval(loop, 1000);

  if (!S.onboarded) { S.onboarded = true; st.save(S); }
  if (mode === 'main') greet(gap);
  setTimeout(collectionCheck, 6000); // a collection that was already complete gets its window too
  document.body.classList.add('ready'); // the waking-up screen goes away
}

// Offline cache only on real https hosting. In local development remove any old cache
// so the browser doesn't mix old and new files.
if ('serviceWorker' in navigator) {
  if (location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(() => {});
  else {
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
    window.caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
  }
}


if (new URLSearchParams(location.search).has('debug')) window.game = { S: () => S, st, loop, save: () => st.save(S), visitorNow: () => { nextVisitorAt = 0; }, askById: (id) => { lastInput = Date.now(); busyUntil = 0; startAsk(ASKS.find((x) => x.id === id)); }, mission: (id) => startMission(MISSIONS.find((m) => m.id === id)), sound: soundStatus, laugh: (name) => antics.laughAt(name), idiom: (id) => talk(idiomSteps(IDIOM_BY_ID[id]), true), twister: () => taliTwister(), visitorEnd: (kind) => antics.visitor(kind, 120, 220), fidget: () => antics.fidget(), chat: (i) => talk(acted(CHATS[i]), true), prank: (i) => prank(PRANKS[i]), event: (spec) => { S.eventPreview = spec || null; updateEvent(); return EV && `${EV.id}:${EV.stage}`; },
  talk: (steps, keep) => talk(steps, keep), modal: (title) => showModal({ title }), toast: (html) => toast(html), frog: () => showFrog(true), dog: () => { S.dog.forceUntil = Date.now() + DOG_STAY; loop(); },
  game: (id) => startGame(GAMES.find((g) => g.id === id)), ask: (id) => { lastInput = Date.now(); busyUntil = 0; startAsk(ASKS.find((x) => x.id === id)); },
  startHoliday: (g) => startGame(g), trick: (k) => tricks.force(k), tricks: () => tricks.names(), touch: (g, part, dir) => tricks.touch(g, part, { dir }),
  now: () => ({ mode, chain: chainQ.length, keep: chainKeep, held: !!chainHeld, busy: antics.busy(), modalOpen, sheetOpen, ask: !!ask, modalQ: modalQ.length }) };

start();
