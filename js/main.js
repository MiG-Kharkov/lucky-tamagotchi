import * as st from './state.js';
import { T, pick, say2, LUCKY, DOG, CHATS, PRANKS, RIDDLES, FOODS, MISSIONS, CARE, DEEDS, PHRASES, BELTS } from './i18n.js';
import { PLACES, DECOR, ALBUMS, STICKERS, BADGES } from './content.js';
import { WEAR, WEAR_BY_ID, SLOTS } from './wardrobe.js';
import * as art from './art.js';
import { sfx, unlockAudio, setSound, setVoice, stopSpeech, speak } from './sound.js';
import { REPLY, ASKS, MOOD_OPTS, MOOD_REPLY, TOUCH_REPLY, STORY, FROG } from './dialogs.js';
import { GAMES, openGame } from './game.js';

const $ = (s, r = document) => r.querySelector(s);

let S = st.load();
// ?mute — для автотестов: без звука и голоса (настройки не трогаем)
const MUTE = new URLSearchParams(location.search).has('mute');
const tr = (k, v) => T(S.lang, k, v);
const L = (pair) => say2(pair, S.lang);
const other = () => (S.lang === 'ru' ? 'en' : 'ru');
const P = (key, v) => [T('ru', key, v), T('en', key, v)]; // UI-строка как пара для реплик
// Имена фиксированы: они вшиты в записи голосов
const dogName = (lang = S.lang) => T(lang, 'dogDefault');
const idx = () => (S.lang === 'en' ? 1 : 0);
// Турбо-режим (для родителя): всё без ограничений, прогресс до турбо сохранён отдельно
const turbo = () => !!S.turbo;
// Дневной потолок активной игры: после него Лаки отдыхает до утра
const dayDone = (T0 = S.today) => !turbo() && S.settings.dailyMax > 0 && (S.playedMs[T0?.date] || 0) >= S.settings.dailyMax * 60e3;
const addH = (n, cat, cap) => st.addHearts(S, turbo() ? n * 5 : n, cat, turbo() ? Infinity : cap);
// Лаки с повязкой цвета текущего пояса
const luckyArt = (o) => art.lucky({ ...o, belt: BELTS[S.belt].color });

const ui = {
  top: $('#top'), stats: $('#stats'), scene: $('#scene'), bg: $('#bg'), bubble: $('#bubble'),
  decor: $('#decor'), decorFront: $('#decorFront'), dog: $('#dog'), lucky: $('#lucky'), fx: $('#fx'), actions: $('#actions'),
  tray: $('#tray'), choices: $('#choices'), editTools: $('#editTools'), sheetWrap: $('#sheetWrap'), sheet: $('#sheet'), overlay: $('#overlay'), modal: $('#modal'), toast: $('#toast'),
};

let mode = 'main'; // main | wash | game | sleep | edit
let tempFace = null, tempFaceUntil = 0;
let shownFace = '', shownOutfit = '';
let dogHere = false;
let lastSpeech = 0, bubbleTimer = 0, tick = 0, sleepKey = '';
let sheetOpen = false;

// ---------- настроение ----------

const tier = () => st.moodTier(S.pet);
// Реплика по настроению: для грустного и восторженного — свои варианты
const byTier = (low, normal, max) => { const t = tier(); return t === 'low' ? low : t === 'max' ? max : normal; };

// ---------- речь ----------

const kidName = (lang) => T(lang, 'kidDefault');
const fill = (txt, lang) => txt.replaceAll('{dog}', dogName(lang)).replaceAll('{name}', kidName(lang));

// Не повторяем недавние реплики
const recent = [];
function fresh(list) {
  const pool = list.filter((x) => !recent.includes(x));
  const x = pick(pool.length ? pool : list);
  recent.push(x);
  if (recent.length > 25) recent.shift();
  return x;
}

let chainQ = [], chainTimer = 0;
let lastSaid = null;
let busyUntil = 0;   // до этого момента звучит текущая реплика
let pending = null;  // одна отложенная автоматическая реплика
function stopChain() { chainQ = []; clearTimeout(chainTimer); }

function speechMs(text) { return Math.max(3200, text.length * 85); }

// Сам Лаки говорит, только если окно на экране, в фокусе и Лиза касалась экрана в последнюю минуту.
// На касания он отвечает всегда, пока окно видно.
const ACTIVE_MS = 60e3;
let lastInput = Date.now();
const windowActive = () => !document.hidden && document.hasFocus();
const userActive = () => windowActive() && Date.now() - lastInput < ACTIVE_MS;

// Реплика: текст на основном языке, перевод мелко, озвучка вслух.
// Говорим только в активном окне и по одной: автоматическая реплика ждёт, пока закончится текущая.
function say(pair, who = 'lucky', { auto = false, chain = false, ambient = false, hold = false, forAsk = false } = {}) {
  if (document.hidden) return 0;
  if (ask && !forAsk) return 0; // не перебиваем вопрос Лаки или лягушки
  if ((auto || chain) && !userActive() && !(ambient && windowActive())) return 0;
  if ((auto || chain) && mode === 'game') return 0;
  const now = Date.now();
  if (auto && (now < busyUntil || chainQ.length)) { pending = { pair, who, at: now }; return 0; }
  if (!chain) stopChain();
  const main = fill(typeof pair === 'string' ? pair : L(pair), S.lang);
  const sub = typeof pair === 'string' || !S.settings.translate ? '' : fill(say2(pair, other()), other());
  ui.bubble.className = 'bubble show b-' + who;
  ui.bubble.innerHTML = `<div class="b-main">${main}</div>${sub ? `<div class="b-sub">🔊 ${sub}</div>` : ''}`;
  // Сама реплика звучит сразу; касание облачка озвучивает перевод
  ui.bubble.onclick = (e) => {
    e.stopPropagation();
    if (sub) speak(sub, other(), who); else speak(main, S.lang, who);
    if (hold) return;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => ui.bubble.classList.remove('show'), speechMs(sub || main) + 1500);
  };
  if (mode !== 'sleep') speak(main, S.lang, who);
  lastSaid = { main, who, at: Date.now() };
  const ms = speechMs(main);
  busyUntil = now + ms;
  clearTimeout(bubbleTimer);
  if (!hold) bubbleTimer = setTimeout(() => ui.bubble.classList.remove('show'), ms + (sub ? 2500 : 0));
  lastSpeech = now;
  return ms;
}

const sayAuto = (pair, who = 'lucky') => say(pair, who, { auto: true });

// Отложенная реплика звучит, когда освободится «эфир»; устаревшие выбрасываем
function flushPending(now) {
  if (!pending || ask || now < busyUntil || chainQ.length || mode !== 'main' || sheetOpen || modalOpen || !userActive()) return;
  const p = pending;
  pending = null;
  if (now - p.at < 15000) sayAuto(p.pair, p.who);
}

function silence() {
  stopChain();
  stopSpeech();
  pending = null;
  busyUntil = 0;
  clearTimeout(bubbleTimer);
  ui.bubble.classList.remove('show');
}

// Сценка: реплики по очереди, следующая — когда закончилась предыдущая
function talk(lines) {
  stopChain();
  chainQ = [...lines];
  nextLine();
}

function nextLine() {
  const line = chainQ.shift();
  if (!line || mode !== 'main' || !windowActive()) return stopChain();
  const [who, ru, en] = line;
  if (who === 'dog' && !dogHere) return nextLine();
  const ms = say([ru, en], who, { chain: true });
  chainTimer = setTimeout(nextLine, ms + 600);
}

const reactAt = {};
function react(kind, list, chance = 1) {
  const now = Date.now();
  if (now - (reactAt[kind] || 0) < 20000 || Math.random() > chance || now < busyUntil) return;
  reactAt[kind] = now;
  say(fresh(list));
}

// Проделки Тали: сценка + смешное действие
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
  talk(p.lines);
}

function riddle(r) {
  talk([['lucky', ...r[0]], ['lucky', ...r[1]]].map((x, i) => (i === 1 ? ['lucky', '🤔 … ' + x[1], '🤔 … ' + x[2]] : x)));
}

function toast(html, ms = 3500) {
  ui.toast.innerHTML = html;
  ui.toast.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => ui.toast.classList.remove('show'), ms);
}

// ---------- эффекты ----------

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

// Разовый эффект: класс снимается, когда анимация самого элемента закончилась
// (иначе вложенные бесконечные анимации, например уши-вертолёт, крутились бы вечно).
function hop(elm, cls = 'hop', maxMs = 4000) {
  elm.classList.remove(cls);
  void elm.getBoundingClientRect(); // перезапуск анимации, работает и для SVG
  elm.classList.add(cls);
  const timers = (elm._fx ||= {});
  clearTimeout(timers[cls]);
  const off = () => { clearTimeout(timers[cls]); elm.classList.remove(cls); elm.removeEventListener('animationend', onEnd); };
  const onEnd = (e) => { if (e.target === elm) off(); };
  elm.addEventListener('animationend', onEnd);
  timers[cls] = setTimeout(off, maxMs); // страховка, если анимация не запустилась
}

function confetti() {
  const colors = ['#FF5FA2', '#FFD23F', '#8B6CFF', '#4CD37B', '#6FD3FF', '#FF9F43'];
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

// ---------- модальные окна ----------

const modalQ = [];
let modalOpen = false;

function showModal(m) {
  modalQ.push(m);
  if (!modalOpen) nextModal();
}

function nextModal() {
  const m = modalQ.shift();
  if (!m) { modalOpen = false; ui.modal.className = 'modal'; return; }
  modalOpen = true;
  if (m.custom) { ui.modal.className = 'modal show ' + (m.cls ?? 'reveal-host'); m.custom(ui.modal, nextModal); return; }
  const btns = m.buttons || [{ label: tr('hooray') }];
  ui.modal.className = 'modal show';
  ui.modal.innerHTML = `<div class="modal-card">
    ${m.art ? `<div class="m-art">${m.art}</div>` : ''}
    <h2>${m.title}</h2>${m.text ? `<p>${m.text}</p>` : ''}
    <div class="m-btns">${btns.map((b, i) => `<button class="btn ${i === 0 ? 'pink' : ''}" data-i="${i}">${b.label}</button>`).join('')}</div></div>`;
  ui.modal.querySelectorAll('button').forEach((b) => {
    b.onclick = () => { sfx.tap(); const fn = btns[b.dataset.i].onClick; nextModal(); fn?.(); };
  });
}

function award(res) {
  if (!res) return;
  for (const lvl of res.ups) showModal({ custom: (host, done) => revealLevel(host, lvl, done) });
  renderTop();
}

// Что приносит уровень: наряд, место, украшение; если ничего — наклейка или бонус
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

// Красивое открытие подарка за уровень
function revealLevel(host, lvl, done) {
  revealGift(host, { title: tr('levelUp', { n: lvl }), rewards: levelRewards(lvl), next: nextRewardHint(lvl), line: LUCKY.levelUp }, done);
}

function wearIt(w) {
  S.wear = { ...S.wear, [w.slot]: w.id };
  stat('wearChanges');
  renderLucky(true);
}

// Открытие подарка: уровень, сюрприз, альбом, подарок Тали
function revealGift(host, { title, rewards, next = '', line = LUCKY.levelUp }, done) {
  const main = rewards[0];
  rewards.filter((r) => r.kind === 'decor').forEach((r) => placeNewDecor(r.id));
  if (rewards.some((r) => r.kind === 'decor')) renderDecor();
  if (main.kind === 'hearts') setTimeout(() => award(addH(5, 'giftBonus', 15)), 0);
  ui.toast.classList.remove('show');
  st.save(S);
  sfx.levelup();
  host.innerHTML = `<div class="reveal">
    <div class="rays"></div><div class="rv-glow"></div>
    <div class="rv-content">
      <div class="rv-level">${title}</div>
      <button class="rv-gift" aria-label="gift"><span>🎁</span></button>
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
      const finish = (worn) => { sfx.tap(); done(); setTimeout(() => sayAuto(fresh(worn && LUCKY.wearSay[main.id] ? LUCKY.wearSay[main.id] : line)), 300); };
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

// Расстановка на сцене: для каждого места свой список предметов (координаты в % сцены)
const DECOR_W = { rainbow: 72, lantern: 12, hutch: 31, bowl: 18, ball: 13, tent: 30, snowman: 15, igloo: 30, rocket: 15, castle: 34, pond: 32 };
const DECOR_POS = { rainbow: [50, 14], lantern: [88, 11], hutch: [17, 60], bowl: [86, 90], ball: [10, 91],
  tent: [82, 58], snowman: [88, 68], igloo: [18, 62], rocket: [86, 50], castle: [20, 54], pond: [74, 90] };
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

// Новое украшение сразу ставим в текущее место
function placeNewDecor(id) {
  const items = layout();
  if (!items.some((it) => it.id === id)) items.push({ k: 'decor', id, x: DECOR_POS[id][0], y: DECOR_POS[id][1], s: 1, f: 0 });
}

// Что стоит ниже этой линии — ближе к зрителю, перед Лаки
const FRONT_Y = 80;

function renderDecor() {
  const items = layout();
  const html = (front) => items.map((it, i) => {
    if ((it.y >= FRONT_Y) !== front) return '';
    const w = it.k === 'decor' ? DECOR_W[it.id] : EMOJI_W;
    return `<div class="pl ${it.k === 'decor' ? 'pl-decor dec-' + it.id : 'pl-emoji'} ${editSel === i ? 'sel' : ''}" data-i="${i}"
      style="left:${it.x}%;top:${it.y}%;--w:${w};--s:${it.s};--f:${it.f ? -1 : 1}"><div class="pl-in">${it.k === 'decor' ? art.decor(it.id) : `<span>${it.id}</span>`}</div></div>`;
  }).join('');
  ui.decor.innerHTML = html(false);
  ui.decorFront.innerHTML = html(true);
  ui.editTools.hidden = !(mode === 'edit' && editSel >= 0);
}

// Касание предмета вне режима украшения: маленькая анимация
const LAYERS = [ui.decor, ui.decorFront];
const onLayers = (ev, fn) => LAYERS.forEach((l) => l.addEventListener(ev, fn));

onLayers('click', (e) => {
  const el = e.target.closest('.pl');
  if (!el || mode !== 'main') return;
  const it = layout()[el.dataset.i];
  if (!it) return;
  if (it.id === 'ball') { sfx.pop(); hop(el, 'bounce'); return; }
  if (it.id === 'lantern') { sfx.note(392); hop(el, 'swingfast'); return; }
  sfx.tap();
  hop(el, 'wiggle');
});

// Перетаскивание в режиме украшения
let drag = null;
onLayers('pointerdown', (e) => {
  if (mode !== 'edit' || drag) return;
  const el = e.target.closest('.pl');
  if (!el) return;
  e.preventDefault();
  const i = Number(el.dataset.i);
  if (editSel !== i) { editSel = i; LAYERS.forEach((l) => l.querySelectorAll('.pl.sel').forEach((x) => x.classList.remove('sel'))); el.classList.add('sel'); ui.editTools.hidden = false; }
  const r = ui.decor.getBoundingClientRect();
  drag = { el, i, r, id: e.pointerId, sx: e.clientX, sy: e.clientY, x0: layout()[i].x, y0: layout()[i].y, moved: false };
  el.setPointerCapture(e.pointerId);
});
onLayers('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const it = layout()[drag.i];
  it.x = Math.max(2, Math.min(98, drag.x0 + ((e.clientX - drag.sx) / drag.r.width) * 100));
  it.y = Math.max(4, Math.min(98, drag.y0 + ((e.clientY - drag.sy) / drag.r.height) * 100));
  drag.el.style.left = it.x + '%';
  drag.el.style.top = it.y + '%';
  drag.moved = true;
});
const endDrag = (e) => {
  if (!drag || (e && e.pointerId !== drag.id)) return;
  // выбранный предмет — поверх остальных
  const items = layout();
  if (drag.i !== items.length - 1) { items.push(items.splice(drag.i, 1)[0]); editSel = items.length - 1; }
  renderDecor(); // предмет мог перейти вперёд или назад
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
  st.save(S);
});

function trayItems() {
  const seen = new Set();
  return [
    ...DECOR.filter((d) => S.level >= d.level).map((d) => ({ k: 'decor', id: d.id })),
    ...PLACES.filter((pl) => S.level >= pl.level).flatMap((pl) => pl.props).map((id) => ({ k: 'emoji', id })),
    ...S.stickers.map((id) => ({ k: 'emoji', id })),
  ].filter((o) => !seen.has(o.id) && seen.add(o.id));
}

function startEdit() {
  if (mode !== 'main') return;
  cancelAsk();
  closeSheet();
  mode = 'edit';
  editSel = -1;
  document.body.classList.add('editing');
  const list = trayItems();
  ui.tray.innerHTML = `<div class="tray-head"><span>${tr('editHint')}</span><button class="btn pink tray-done">✓ ${tr('done')}</button></div>
    <div class="tray-items">${list.map((o, i) => `<button class="tray-it" data-i="${i}">${o.k === 'decor' ? art.decor(o.id) : o.id}</button>`).join('')}</div>`;
  ui.tray.hidden = false;
  ui.tray.querySelector('.tray-done').onclick = finishEdit;
  ui.tray.querySelectorAll('.tray-it').forEach((b) => {
    b.onclick = () => {
      const items = layout();
      if (items.length >= MAX_ITEMS) return toast(tr('editFull'), 2500);
      const o = list[b.dataset.i];
      items.push({ k: o.k, id: o.id, x: 50 + Math.random() * 20 - 10, y: 55 + Math.random() * 16 - 8, s: 1, f: 0 });
      editSel = items.length - 1;
      sfx.pop();
      renderDecor();
      st.save(S);
      stat('decorPlaced');
      react('place-' + (LUCKY.place_item[o.id] ? o.id : 'sticker'), LUCKY.place_item[o.id] || LUCKY.placeGeneric, 0.9);
    };
  });
  renderDecor();
  say(LUCKY.decorate[0]);
}

function finishEdit(silent = false) {
  if (mode !== 'edit') return;
  mode = 'main';
  editSel = -1;
  drag = null;
  document.body.classList.remove('editing');
  ui.tray.hidden = true;
  renderDecor();
  st.save(S);
  if (silent === true) return;
  sfx.sparkle();
  setTemp('happy', 1500);
  say(fresh(LUCKY.decorate.slice(1)));
  award(addH(3, 'decor', 3));
}

// Вещь доступна: открыта уровнем или получена в подарок / за альбом
const ownsWear = (w) => (w.level && S.level >= w.level) || S.owned.includes(w.id);
const albumReward = (id) => ALBUMS.find((a) => a.reward === id);

// Счётчики для значков
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
    case 'worlds': return S.worldsSeen.length;
    default: return S.stats[key] || 0;
  }
}

let badgeToastAt = 0;
function checkBadges() {
  for (const [id, e, name, key, goal] of BADGES) {
    if (S.badges.includes(id) || statValue(key) < goal) continue;
    S.badges.push(id);
    // значки показываем по очереди, не пачкой
    const at = Math.max(Date.now(), badgeToastAt + 3600);
    badgeToastAt = at;
    setTimeout(() => { sfx.sparkle(); toast(`<b>${e} ${tr('newBadge')}</b><br>${L(name)}`, 3400); }, at - Date.now());
  }
}

function giveSticker() {
  const left = STICKERS.filter((s) => !S.stickers.includes(s));
  if (!left.length) return null;
  const s = pick(left);
  S.stickers.push(s);
  checkAlbums();
  checkBadges();
  return s;
}

// Полный альбом — особая вещь в подарок
function checkAlbums() {
  for (const a of ALBUMS) {
    if (S.albumsDone.includes(a.id) || !a.stickers.every((x) => S.stickers.includes(x))) continue;
    S.albumsDone.push(a.id);
    if (!S.owned.includes(a.reward)) S.owned.push(a.reward);
    const w = WEAR_BY_ID[a.reward];
    setTimeout(() => showModal({ custom: (host, done) => revealGift(host, { title: tr('albumDone', { x: L(a.name) }), rewards: [{ kind: 'outfit', ...w, rarity: 'gold' }], line: LUCKY.albumDone }, done) }), 1500);
  }
}

// Подарок: наклейка (обычный), вещь (редкий) или особая вещь (золотой)
function rollGift(rareChance, goldChance) {
  const r = Math.random();
  const missing = (rar) => WEAR.filter((w) => w.rarity === rar && !albumReward(w.id) && !S.owned.includes(w.id));
  const pickWear = (rar) => { const list = missing(rar); return list.length ? { kind: 'outfit', ...pick(list), rarity: rar } : null; };
  const g = (r < goldChance && pickWear('gold')) || (r < goldChance + rareChance && pickWear('rare'));
  if (g) { S.owned.push(g.id); return g; }
  const s = giveSticker();
  return s ? { kind: 'sticker', id: s, name: P('rvSticker') } : { kind: 'hearts', id: '💖', name: P('rvHearts') };
}

// ---------- отрисовка ----------

function moodFace() {
  if (tempFace && Date.now() < tempFaceUntil) return tempFace;
  const p = S.pet;
  if (p.energy < 30) return 'tired';
  if (Math.min(p.hunger, p.fun, p.clean) < 30) return 'sad';
  return 'ok';
}

function renderLucky(force = false) {
  const face = moodFace();
  const look = JSON.stringify(S.wear) + S.belt;
  if (!force && face === shownFace && look === shownOutfit) return;
  shownFace = face;
  shownOutfit = look;
  ui.lucky.innerHTML = luckyArt({ face, wear: S.wear });
}

const STAT_ICONS = { hunger: '🥕', fun: '💗', clean: '🫧', energy: '⚡' };

function buildStats() {
  ui.stats.innerHTML = Object.keys(STAT_ICONS).map((k) => `<div class="stat" data-k="${k}">
    <span class="s-ico">${STAT_ICONS[k]}</span><div class="s-body"><span class="s-name">${tr(k)}</span><div class="s-bar"><i></i></div></div></div>`).join('');
}

function renderStats() {
  ui.stats.querySelectorAll('.stat').forEach((row) => {
    const v = S.pet[row.dataset.k];
    row.querySelector('i').style.width = v + '%';
    row.classList.toggle('low', v < 35);
  });
}

function renderTop() {
  $('#lvlNum').textContent = S.level;
  $('#lvlLabel').textContent = tr('lv');
  $('#lvlBar').style.width = Math.round((S.hearts / st.levelNeed(S.level)) * 100) + '%';
  if (renderTop.belt !== S.belt) { renderTop.belt = S.belt; $('#beltChip').innerHTML = art.belt(BELTS[S.belt].color, 44); }
  $('#turboBadge').hidden = !turbo();
}

const ACTIONS = [
  { id: 'feed', e: '🥕', fn: () => openFeed() },
  { id: 'play', e: '🎈', fn: () => openPlay() },
  { id: 'wash', e: '🫧', fn: () => startWash() },
  { id: 'dojo', e: '🥷', fn: () => openDojo() },
  { id: 'collection', e: '🎀', fn: () => openCollection() },
];

function buildActions() {
  ui.actions.innerHTML = ACTIONS.map((a) => `<button class="act" data-id="${a.id}"><span class="a-ico">${a.e}</span><span class="a-name">${tr(a.id)}</span></button>`).join('');
  ui.actions.querySelectorAll('.act').forEach((b) => {
    b.onclick = () => {
      if (mode !== 'main') return;
      sfx.tap();
      ACTIONS.find((a) => a.id === b.dataset.id).fn();
    };
  });
}

function renderBg() {
  ui.bg.innerHTML = art.scene(S.bg);
}

function goPlace(id) {
  S.bg = id;
  if (!S.worldsSeen.includes(id)) { S.worldsSeen.push(id); checkBadges(); }
  renderBg();
  renderDecor();
}

function applyLang() {
  document.documentElement.lang = S.lang;
  buildStats();
  renderStats();
  buildActions();
  renderTop();
  if (mode === 'sleep') renderSleep(true);
}

// ---------- шторка ----------

function openSheet(title, html, mount) {
  cancelAsk();
  ui.sheet.innerHTML = `<div class="sheet-head"><h2>${title}</h2><button class="x" aria-label="close">✕</button></div><div class="sheet-body">${html}</div>`;
  ui.sheetWrap.classList.add('show');
  sheetOpen = true;
  ui.sheet.querySelector('.x').onclick = closeSheet;
  mount?.(ui.sheet);
}

function closeSheet() {
  ui.sheetWrap.classList.remove('show');
  sheetOpen = false;
  // содержимое убираем после анимации закрытия, чтобы спрятанные сцены не тратили батарею
  setTimeout(() => { if (!sheetOpen) ui.sheet.innerHTML = ''; }, 400);
}

ui.sheetWrap.addEventListener('click', (e) => { if (e.target === ui.sheetWrap) closeSheet(); });

// Текст на основном языке и перевод мелко
const bi = (pair) => `<div class="bi"><div class="bi-main">${L(pair)}</div>${S.settings.translate ? `<div class="bi-sub">${say2(pair, other())}</div>` : ''}</div>`;

// ---------- кормление ----------

function openFeed() {
  const T0 = st.today(S);
  openSheet(tr('feedTitle'), `<div class="food-grid">${FOODS.map((f) => `<button class="food" data-id="${f.id}">
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
    const ms = say(fresh(hungerBefore < 30 ? LUCKY.feedStarving : hungerBefore > 80 ? LUCKY.feedNearlyFull
      : Math.random() < 0.6 && LUCKY.food[f.id] ? LUCKY.food[f.id] : LUCKY.eat));
    // Ел слишком быстро — икота
    if (quick || Math.random() < 0.12) setTimeout(hiccups, ms + 300);
    award(addH(2, 'feed', 10));
    renderStats();
    setTimeout(() => toast(`<b>💡 ${tr('didYouKnow')}</b><br>${L(f.fact)}`, 6000), 900);
  };
}

// ---------- мытьё ----------

let washGain = 0, washIdle = 0, washDown = false, washLast = 0, cleanBefore = 100;

function startWash() {
  cancelAsk();
  mode = 'wash';
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

// ---------- касания ----------

let tapCount = 0, lastTapAt = 0, pressTimer = 0, pressed = false, tapTimes = [], earTimes = [];

// Долгое нажатие — обнимашки
ui.lucky.addEventListener('pointerdown', () => {
  if (mode !== 'main') return;
  pressed = false;
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => { pressed = true; hug(); }, 650);
});
['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => ui.lucky.addEventListener(ev, () => clearTimeout(pressTimer)));
ui.lucky.addEventListener('contextmenu', (e) => e.preventDefault());

ui.lucky.addEventListener('click', (e) => {
  if (mode !== 'main') return;
  if (pressed) { pressed = false; return; }
  if (ask?.touch) { touchAnswer(e); return; }
  if (ask) { sfx.pop(); hop(ui.lucky); heartsBurst(...sceneXY(e), 2); return; }
  const now = Date.now();
  const [x, y] = sceneXY(e);
  if (e.target.closest('.nose')) { sneeze(); return; }
  if (e.target.closest('.ear')) { ears(e.target.closest('.ear')); return; }
  // Много быстрых касаний — щекотка
  tapTimes.push(now);
  while (tapTimes.length && now - tapTimes[0] > 3000) tapTimes.shift();
  if (tapTimes.length >= 6) { tapTimes = []; tickle(); return; }
  // Двойное касание — прыжок «бинки»
  if (now - lastTapAt < 350) { lastTapAt = 0; binky(); return; }
  lastTapAt = now;
  // Капризничает, если ему очень чего-то не хватает (кроме радости — гладить как раз помогает)
  const need = st.lowestNeed(S.pet);
  if (tier() === 'low' && LUCKY.sulk[need] && S.pet[need] < 30 && Math.random() < 0.35) { sulk(need); return; }
  sfx.pop();
  hop(ui.lucky);
  heartsBurst(x, y - 20);
  st.boost(S, 'fun', 3);
  setTemp('laugh', 1100);
  tapCount++;
  if (tapCount % 3 === 0) award(addH(1, 'pet', 8));
  if (tapCount % 2 === 1) say(fresh(byTier(LUCKY.tapLow, LUCKY.tap, LUCKY.tapMax)));
  renderStats();
});

function sulk(need) {
  sfx.note(196);
  hop(ui.lucky, 'sulk');
  setTemp('sad', 1500);
  say(fresh(LUCKY.sulk[need]));
}

function hug() {
  sfx.happy();
  hop(ui.lucky, 'hug');
  setTemp('happy', 1800);
  const [x, y] = luckyPoint(0.5, 0.35);
  heartsBurst(x, y, 7);
  st.boost(S, 'fun', 5);
  award(addH(1, 'pet', 8));
  say(fresh(byTier(LUCKY.hugLow, LUCKY.hug, LUCKY.hugMax)));
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

function ears(ear) {
  const now = Date.now();
  earTimes.push(now);
  while (earTimes.length && now - earTimes[0] > 2500) earTimes.shift();
  // Три быстрых касания ушка — уши-вертолёт
  if (earTimes.length >= 3) { earTimes = []; helicopter(); return; }
  sfx.tap();
  ui.lucky.querySelectorAll('.ear').forEach((x) => hop(x, 'wiggle'));
  setTemp('laugh', 900);
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
  hop(ui.lucky, 'heli');
  setTemp('laugh', 2400);
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
  say(fresh(LUCKY.tickle));
  stat('tickles');
  renderStats();
}

// Когда счастлив, Лаки иногда ловит свой хвостик
function chaseTail() {
  hop(ui.lucky, 'chase');
  setTemp('laugh', 2200);
  sayAuto(fresh(LUCKY.tail));
}

// Подсказки о нуждах: мушки у грязного, урчание у голодного
let nextRumbleAt = 0;
function needCues(now) {
  const dirty = mode === 'main' && S.pet.clean < 30;
  let flies = ui.scene.querySelector('.flies');
  if (dirty && !flies) { flies = document.createElement('div'); flies.className = 'flies'; flies.innerHTML = '<span>🪰</span><span>🪰</span>'; ui.scene.appendChild(flies); }
  if (!dirty && flies) flies.remove();
  if (mode === 'main' && S.pet.hunger < 25 && userActive() && now > nextRumbleAt && now >= busyUntil) {
    nextRumbleAt = now + 45e3 + Math.random() * 30e3;
    hop(ui.lucky, 'rumble');
    sfx.rumble();
    const [x, y] = luckyPoint(0.5, 0.75);
    floatFx(x, y, '〰️', 'spark');
  }
}

// ---------- сцена: живые мелочи ----------

function fxAt(x, y, list, n, cls) {
  for (let i = 0; i < n; i++) setTimeout(() => floatFx(x + Math.random() * 60 - 30, y + Math.random() * 20, pick(list), cls), i * 70);
}

ui.bg.addEventListener('click', (e) => {
  if (mode !== 'main') return;
  const t = e.target.closest('[data-tap]');
  if (!t) return;
  const [x, y] = sceneXY(e);
  hop(t, 'tapped');
  switch (t.dataset.tap) {
    case 'sun': sfx.sparkle(); fxAt(x, y, ['✨', '☀️'], 5, 'spark'); react('sun', LUCKY.sun, 0.6); break;
    case 'cloud': sfx.bubble(); fxAt(x, y + 20, ['💧'], 8, 'drop'); react('rain', LUCKY.rain, 0.6); break;
    case 'tree': sfx.bubble(); fxAt(x, y, ['🌸'], 8, 'drop petal-fx'); react('petals', LUCKY.petals, 0.6); break;
    case 'flower': sfx.pop(); floatFx(x, y - 10, '🦋', 'fly-up'); react('flowers', LUCKY.flowers, 0.4); break;
    case 'gong': sfx.gong(); floatFx(x, y, '', 'ripple'); react('gong', LUCKY.gong, 0.7); break;
    case 'fuji': sfx.sparkle(); fxAt(x, y, ['❄️', '✨'], 5, 'spark'); break;
    case 'lolly': sfx.sparkle(); fxAt(x, y, ['🍬', '✨', '🍭'], 5, 'spark'); react('candy', LUCKY.candy, 0.5); break;
    case 'palm': sfx.pop(); floatFx(x, y, '🥥', 'drop'); react('palm', LUCKY.worldTap.palm, 0.7); break;
    case 'shell': sfx.sparkle(); fxAt(x, y, ['✨', '🌊'], 4, 'spark'); react('shell', LUCKY.worldTap.shell, 0.6); break;
    case 'crab': sfx.tap(); react('crab', LUCKY.worldTap.crab, 0.7); break;
    case 'pine': sfx.bubble(); fxAt(x, y, ['❄️'], 8, 'drop'); react('pine', LUCKY.worldTap.pine, 0.6); break;
    case 'snowman': sfx.pop(); fxAt(x, y, ['❄️', '⛄'], 4, 'spark'); react('snowman', LUCKY.worldTap.snowman, 0.7); break;
    case 'ice': sfx.sparkle(); fxAt(x, y, ['✨', '❄️'], 5, 'spark'); break;
    case 'planet': sfx.whirr(); fxAt(x, y, ['✨', '⭐'], 4, 'spark'); react('planet', LUCKY.worldTap.planet, 0.7); break;
    case 'crater': sfx.pop(); floatFx(x, y, '🪨', 'spark'); break;
    case 'star': sfx.note(pick([988, 1175, 1319])); floatFx(x, y, '⭐', 'spark'); break;
    case 'gold': sfx.sparkle(); fxAt(x, y, ['🪙', '✨', '🪙'], 7, 'spark'); react('gold', LUCKY.worldTap.gold, 0.8); break;
    case 'sheep': sfx.baa(); react('sheep', LUCKY.worldTap.sheep, 0.7); break;
    case 'clover': sfx.pop(); floatFx(x, y, '☘️', 'fly-up'); react('clover', LUCKY.worldTap.clover, 0.5); break;
    case 'castle': sfx.sparkle(); fxAt(x, y, ['✨', '🏰'], 3, 'spark'); break;
    case 'pagoda': sfx.gong(); floatFx(x, y, '', 'ripple'); react('pagoda', LUCKY.worldTap.pagoda, 0.7); break;
    case 'bamboo': sfx.bubble(); react('bamboo', LUCKY.worldTap.bamboo, 0.6); break;
    case 'lamp': sfx.note(523); fxAt(x, y, ['✨'], 3, 'spark'); break;
  }
});

// Иногда пролетает бабочка — её можно поймать
let nextVisitorAt = Date.now() + 70e3;
function maybeVisitor(now) {
  if (now < nextVisitorAt || mode !== 'main' || sheetOpen || modalOpen || !userActive()) return;
  nextVisitorAt = now + 100e3 + Math.random() * 80e3;
  const b = document.createElement('button');
  b.className = 'visitor ' + (Math.random() < 0.5 ? 'path1' : 'path2');
  b.textContent = pick(['🦋', '🦋', '🐞', '🐝']);
  b.onclick = (e) => {
    e.stopPropagation();
    const [x, y] = sceneXY(e);
    b.remove();
    sfx.sparkle();
    fxAt(x, y, ['✨', '💖'], 6, 'spark');
    award(addH(1, 'bug', 5));
    stat('bugs');
    say(fresh(LUCKY.butterfly));
  };
  ui.scene.appendChild(b);
  setTimeout(() => b.remove(), 11000);
}

// Сюрприз дня: подарок появляется после минуты игры
function maybeSurprise(now, T0) {
  if (T0.surprise || ask || mode !== 'main' || sheetOpen || modalOpen || !userActive() || S.session.activeMs < 60e3 || ui.scene.querySelector('.surprise')) return;
  const b = document.createElement('button');
  b.className = 'surprise';
  b.textContent = '🎁';
  b.style.left = (18 + Math.random() * 60) + '%';
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
  sayAuto(fresh(LUCKY.surprise));
}

// ---------- дела дня: понятная точка «на сегодня всё» ----------

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
  if (T0.planDone || !PLAN.every(([, , done]) => done(T0)) || mode !== 'main' || modalOpen || sheetOpen) return;
  T0.planDone = true;
  stat('plans');
  st.save(S);
  confetti();
  sfx.levelup();
  showModal({ art: '<div class="big-emoji">🌟</div>', title: tr('planDone'), text: '+5 💗' });
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

// ---------- вопросы Лаки с вариантами ответа ----------
// Реплики Лаки озвучены, ответы Лизы — только текст (английский, мелко перевод).

const ASK_EVERY = 4 * 60e3;
const ASK_WEIGHTS = { guess: 3, pref: 2, wyr: 2, quiz: 2, mood: 1.5, touch: 1.5, story: 1 };
let ask = null, lastAskAt = Date.now(), askTimer = 0;
const recentAsks = [];

const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const canAsk = () => mode === 'main' && !sheetOpen && !modalOpen && userActive() && Date.now() >= busyUntil && !chainQ.length && !ask;

function pickAsk() {
  const T0 = st.today(S);
  const pool = ASKS.filter((a) => !recentAsks.includes(a.id) && !(a.kind === 'story' && T0.story && !turbo()));
  let x = Math.random() * pool.reduce((sum, a) => sum + ASK_WEIGHTS[a.kind], 0);
  return pool.find((a) => (x -= ASK_WEIGHTS[a.kind]) < 0) || pool[0];
}

function choicesHtml(opts) {
  const noEmoji = (t) => t.replace(/\p{Extended_Pictographic}\uFE0F?\s*/gu, '');
  return opts.map((o, i) => `<button class="choice" data-i="${i}"><b>${fill(o[1], 'en')}</b>${S.settings.translate ? `<small>${noEmoji(fill(o[0], 'ru'))}</small>` : ''}</button>`).join('');
}

// Вопрос: реплика висит, пока Лиза не ответит; варианты — кнопки под облачком
function askQ(q, who, opts, onPick, { compact = false } = {}) {
  say(q, who, { hold: true, forAsk: true });
  ui.choices.innerHTML = choicesHtml(opts);
  ui.choices.className = 'choices' + (compact ? ' compact' : '');
  ui.choices.hidden = false;
  // Лаки поднимается над вариантами ответа, чтобы его было видно
  ui.scene.style.setProperty('--choicesH', ui.choices.offsetHeight + 'px');
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
  askTimer = setTimeout(cancelAsk, 35000); // не ответила — тихо убираем, без упрёков
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
  ui.bubble.classList.remove('show');
}

// Ответ Лаки; wrong — вариант остаётся, можно выбрать другой
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

// Что сейчас правда: тот же порядок, что и у мордочки (сначала усталость)
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
    // неправильные варианты — только то, что сейчас точно не про Лаки
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

// Касание Лаки в ответ на «нажми на мои ушки»
function touchAnswer(e) {
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

// ---------- лягушка-загадушка ----------

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
  f.onclick = (e) => {
    e.stopPropagation();
    if (mode !== 'main' || ask) return;
    frogRiddle(f);
  };
  // не подошли — лягушка сама упрыгает
  f.timer = setTimeout(() => { if (!ask?.frog) frogLeave(); }, force ? 120e3 : 60e3);
}

function frogLeave() {
  const f = ui.scene.querySelector('.frog');
  if (!f) return;
  clearTimeout(f.timer);
  f.classList.add('away');
  setTimeout(() => f.remove(), 900);
}

function frogRiddle(f) {
  if (f.classList.contains('asking')) return;
  f.onclick = null;
  const r = fresh(FROG.riddles);
  ask = { frog: true };
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
      setTimeout(() => {
        frogLeave();
        if (mode !== 'main') return;
        say(fresh(FROG.bye), 'frog');
        const s = giveSticker();
        if (s) showModal({ art: `<div class="big-emoji">${s}</div>`, title: tr('newSticker'), text: tr('fromFrog') });
      }, done + 300);
    });
  }, ms + 300);
}

function maybeFrog(now, T0) {
  if (T0.frog || !canAsk() || S.session.activeMs < 3 * 60e3 || st.hash(T0.date + 'frog') % 100 >= 60) return;
  showFrog();
}

// ---------- настроение и ниндзя-дыхание ----------

const MOODS = [['happy', '😊'], ['calm', '😌'], ['tired', '😴'], ['sad', '😢'], ['angry', '😠']];

function maybeMood(T0) {
  if (T0.mood || !S.onboarded || mode !== 'main' || sheetOpen || modalOpen || !userActive() || S.session.activeMs < 8000 || Date.now() < busyUntil) return;
  T0.mood = 'asked';
  sayAuto(LUCKY.moodAsk[0]);
  showModal({
    art: luckyArt({ face: 'ok', wear: S.wear }),
    title: tr('moodTitle'),
    buttons: MOODS.map(([id, e]) => ({
      label: `${e} ${tr('mood_' + id)}`,
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
  showModal({ custom: (host, done) => {
    silence();
    host.innerHTML = `<div class="breath"><h2>${tr('breathTitle')}</h2><div class="b-circle"><span></span></div><p class="b-text"></p>
      <button class="btn ghost b-stop">${tr('close')}</button></div>`;
    const circle = host.querySelector('.b-circle'), text = host.querySelector('.b-text');
    const timers = [];
    const stop = () => { timers.forEach(clearTimeout); done(); };
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
      host.querySelector('.b-stop').textContent = tr('done');
    }, CYCLES * (IN + OUT)));
  } });
}

// ---------- игра ----------

const GAME_COOLDOWN = 15 * 60e3;

function openPlay() {
  const T0 = st.today(S);
  const left = turbo() ? 99 : S.settings.gamesPerDay - T0.games;
  const wait = turbo() ? 0 : Math.ceil((S.lastGameAt + GAME_COOLDOWN - Date.now()) / 60e3);
  const can = left > 0 && wait <= 0;
  if (left > 0 && wait > 0) say(fresh(LUCKY.cooldown));
  const note = left <= 0 ? tr('noGames') : wait > 0 ? `⏳ ${tr('gameCooldown', { n: wait })}` : tr('gamesLeft', { n: left });
  const html = `<p class="muted center">${note}</p>
    <div class="game-list">${GAMES.map((g) => `<button class="game-item" data-id="${g.id}" ${can ? '' : 'disabled'}>
      <span class="gi-emoji">${g.emoji}</span><span class="gi-text"><b>${tr('g_' + g.id)}</b><small>${tr('g_' + g.id + '_hint')}</small></span></button>`).join('')}</div>`;
  openSheet('🎈 ' + tr('pickGame'), html, (root) => root.querySelectorAll('.game-item').forEach((b) => {
    b.onclick = () => { sfx.tap(); closeSheet(); startGame(GAMES.find((g) => g.id === b.dataset.id)); };
  }));
}

function closeGame() {
  ui.overlay.className = 'overlay';
  ui.overlay.innerHTML = '';
  mode = 'main';
}

function startGame(game) {
  if (S.pet.energy < 22) return say(P('tooTired'));
  if (S.pet.hunger < 25) { setTemp('sad', 1500); return say(fresh(LUCKY.gameRefuse)); }
  cancelAsk();
  mode = 'game';
  ui.overlay.className = 'overlay show game-ov';
  openGame(ui.overlay, game, {
    tr, sfx, lang: S.lang,
    svgOk: luckyArt({ face: 'ok', wear: S.wear }),
    svgHappy: luckyArt({ face: 'laugh', wear: S.wear }),
    onCancel: closeGame,
    onEnd: (score) => {
      const T0 = st.today(S);
      T0.games++;
      S.lastGameAt = Date.now();
      stat('games');
      if (score >= game.great) stat('gamesGreat');
      if (game.id === 'talk') stat('talkRight', Math.floor(score / 3));
      closeGame();
      st.boost(S, 'fun', 20);
      st.boost(S, 'energy', -game.energy);
      renderStats();
      setTemp('happy', 1500);
      say(fresh(score >= game.great ? LUCKY.gameGreat : Math.random() < 0.5 ? LUCKY.gameOk : LUCKY.gameAfter));
      award(addH(Math.min(10, Math.ceil(score / 3)), 'game', 20));
      toast(tr('gamesLeft', { n: Math.max(0, S.settings.gamesPerDay - T0.games) }));
      st.save(S);
    },
  });
}

// ---------- додзё ----------

const taskEnds = {}; // когда станет доступна кнопка «Я сделала!» (переживает перерисовку шторки)

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

function openDojo() {
  const T0 = st.today(S);
  const b = BELTS[S.belt];
  const master = S.belt >= BELTS.length - 1;
  const m = MISSIONS[st.missionIndex(S, MISSIONS.length)];
  const careList = S.settings.realPet ? CARE : DEEDS;
  const c = careList[st.careIndex(S, careList.length)];
  const html = `
    <div class="belt-box">${art.belt(b.color, 120)}
      <div><div class="muted">${tr('belt')}</div><div class="belt-name">${L(b.name)}</div>
      ${master ? `<div class="muted">${tr('beltMax')}</div>` : `<div class="dots">${[0, 1, 2].map((i) => `<i class="${i < S.beltSteps ? 'on' : ''}"></i>`).join('')}</div><div class="muted">${tr('beltProgress', { n: S.beltSteps })}</div>`}</div>
    </div>
    <div class="card mission">
      <div class="card-title">🥷 ${tr('mission')}</div>
      ${T0.missionDone ? `<p class="done-note">✅ ${tr('missionFinished')}</p>` : `
        <div class="task"><span class="t-emoji">${m[2]}</span>${bi(m)}</div>
        <p class="muted">${tr('missionReal')}</p>
        <div class="row"><button class="btn pink go">${tr('missionStart')}</button>
        ${T0.missionSwap < 1 ? `<button class="btn ghost swap">${tr('missionSwap')}</button>` : ''}</div>`}
    </div>
    <div class="card care">
      <div class="card-title">💗 ${S.settings.realPet ? tr('care') : tr('deed')}</div>
      ${T0.careDone ? `<p class="done-note">✅ ${tr('careDone')}</p>` : `
        <div class="task"><span class="t-emoji">${c[2]}</span>${bi(c)}</div>
        <div class="row"><button class="btn purple go">${tr('missionStart')}</button></div>`}
    </div>
    <div class="row"><button class="btn ghost breath-go">${tr('breathBtn')}</button></div>`;
  openSheet(tr('dojoTitle'), html, (root) => {
    const mc = root.querySelector('.mission'), cc = root.querySelector('.care');
    if (!T0.missionDone) {
      taskFlow(mc, 'mission', 20, missionComplete);
      const sw = mc.querySelector('.swap');
      if (sw) sw.onclick = () => { T0.missionSwap++; delete taskEnds.mission; sfx.tap(); openDojo(); };
    }
    if (!T0.careDone) taskFlow(cc, 'care', 15, careComplete);
    root.querySelector('.breath-go').onclick = () => { sfx.tap(); closeSheet(); breathe(); };
  });
}

function missionComplete() {
  const T0 = st.today(S);
  T0.missionDone = true;
  stat('missions');
  sfx.happy();
  confetti();
  const res = addH(10, 'mission', 10);
  let beltUp = false;
  if (S.belt < BELTS.length - 1) {
    S.beltSteps++;
    if (S.beltSteps >= 3) {
      beltUp = true;
      S.beltSteps = 0;
      S.belt++;
      const b = BELTS[S.belt];
      showModal({ art: art.belt(b.color, 160), title: tr('newBelt'), text: L(b.name) });
      sfx.levelup();
    }
  }
  award(res);
  st.save(S);
  openDojo();
  say(fresh(beltUp ? LUCKY.belt : LUCKY.missionCheer));
}

function careComplete() {
  const T0 = st.today(S);
  T0.careDone = true;
  stat('care');
  sfx.happy();
  const res = addH(8, 'care', 8);
  const s = giveSticker();
  if (s) showModal({ art: `<div class="big-emoji">${s}</div>`, title: tr('newSticker'), text: tr('fromCare') });
  award(res);
  st.save(S);
  openDojo();
}

// ---------- коллекция ----------

const SLOT_ICON = { head: '🎩', face: '👓', neck: '🧣', body: '🦸' };
let wardSlot = 'head';

// Как получить закрытую вещь
function wearLock(w) {
  if (w.level) return `🔒 ${tr('unlockAt', { n: w.level })}`;
  const al = albumReward(w.id);
  if (al) return `📒 ${L(al.name)}`;
  return w.rarity === 'gold' ? `✨ ${tr('giftGold')}` : `🎁 ${tr('giftRare')}`;
}

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
  // значки
  return `<p class="muted center">${tr('badgesOf', { n: S.badges.length, m: BADGES.length })}</p><div class="badges">${BADGES.map(([id, e, name, key, goal]) => {
    const got = S.badges.includes(id), v = Math.min(goal, statValue(key));
    return `<div class="badge ${got ? 'on' : ''}"><div class="b-emoji">${e}</div><b>${L(name)}</b>${got ? '' : `<div class="b-bar"><i style="width:${Math.round((v / goal) * 100)}%"></i></div><small>${v}/${goal}</small>`}</div>`;
  }).join('')}</div>`;
}

function openCollection(tab = 'outfits') {
  const tabs = ['outfits', 'places', 'decor', 'stickers', 'badges'];
  const html = `<p class="muted center">${tr('daysTogether', { n: S.days.length })} · ${tr('lv')} ${S.level}</p>
    <div class="tabs coll-tabs">${tabs.map((t) => `<button class="tab ${t === tab ? 'on' : ''}" data-t="${t}">${tr(t)}</button>`).join('')}</div>${collectionBody(tab)}`;
  openSheet(tr('collection'), html, (root) => {
    const again = () => { const y = root.scrollTop; openCollection(tab); ui.sheet.scrollTop = y; };
    root.querySelectorAll('.tab').forEach((b) => { b.onclick = () => { sfx.tap(); openCollection(b.dataset.t); }; });
    root.querySelectorAll('.chip[data-slot]').forEach((b) => { b.onclick = () => { sfx.tap(); wardSlot = b.dataset.slot; again(); }; });
    root.querySelectorAll('.stk.on').forEach((x) => { x.onclick = () => { sfx.pop(); hop(x, 'wiggle'); }; });
    root.querySelectorAll('.badge.on').forEach((x) => { x.onclick = () => { sfx.sparkle(); hop(x, 'wiggle'); }; });
    root.querySelector('.deco-go')?.addEventListener('click', () => { sfx.tap(); startEdit(); });
    root.querySelectorAll('.tile').forEach((b) => {
      b.onclick = () => {
        if (b.classList.contains('locked')) { sfx.tap(); hop(b, 'wiggle'); return; }
        sfx.sparkle();
        if (b.dataset.d !== undefined) { startEdit(); return; }
        if (b.dataset.p) { goPlace(b.dataset.p); st.save(S); closeSheet(); say(fresh(LUCKY.arrive[b.dataset.p] || LUCKY.place)); return; }
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

// ---------- фраза дня и викторина ----------

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
  const q = pick(PHRASES);
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

// ---------- собачка ----------

function dogArrive() {
  dogHere = true;
  stat('dogVisits');
  ui.scene.classList.add('has-dog');
  ui.dog.innerHTML = `<div class="dog-body">${art.dog({ face: 'happy' })}</div>
    ${S.dog.gift ? '' : `<button class="gift" aria-label="gift">🎁</button>`}
    ${S.dog.played ? '' : `<button class="pill together">🐾 ${tr('playTogether')}</button>`}`;
  const body = ui.dog.querySelector('.dog-body');
  hop(body, 'enter', 1500);
  body.onclick = () => {
    if (mode !== 'main') return;
    sfx.bark();
    hop(body);
    say(fresh(DOG.tap), 'dog');
  };
  const gift = ui.dog.querySelector('.gift');
  if (gift) gift.onclick = () => {
    if (mode !== 'main') return;
    S.dog.gift = true;
    gift.remove();
    sfx.sparkle();
    say(fresh(DOG.gift), 'dog');
    const g = rollGift(0.25, 0.05);
    setTimeout(() => showModal({ custom: (host, done) => revealGift(host, { title: tr('fromDog', { dog: dogName() }), rewards: [g], line: LUCKY.levelUp }, done) }), 1200);
    st.save(S);
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
    setTimeout(() => { say(fresh(LUCKY.dogPlay)); setTemp('laugh', 1500); heartsBurst(...luckyPoint(0.5, 0.2), 5); }, 1400);
    award(addH(5, 'dog', 8));
    st.save(S);
  };
  setTimeout(() => {
    sfx.bark();
    if (!S.dog.met) { const line = pick(LUCKY.meetDog); if (sayAuto(line) > 0 || pending?.pair === line) { S.dog.met = true; st.save(S); } }
    else if (userActive()) talk([['dog', ...fresh(DOG.arrive)], ['lucky', ...fresh(tier() === 'low' ? LUCKY.dogSad : LUCKY.dogHappy)]]);
  }, 700);
}

function dogLeave(silent = false) {
  if (!dogHere) return;
  dogHere = false;
  if (!silent && mode === 'main' && !sheetOpen) sayAuto(fresh(DOG.bye), 'dog');
  const body = ui.dog.querySelector('.dog-body');
  body?.classList.add('leave');
  setTimeout(() => { if (!dogHere) { ui.dog.innerHTML = ''; ui.scene.classList.remove('has-dog'); } }, silent ? 0 : 1200);
}

const DOG_STAY = 7 * 60e3;

// Визит: собачка приходит один раз за окно визита, гостит ~7 минут и уходит
function updateDog(now, asleep) {
  const key = asleep ? null : st.dogVisitKey(S, now);
  const d = S.dog;
  if (key && key !== d.doneKey) {
    if (d.visitKey !== key) { d.visitKey = key; d.gift = false; d.played = false; d.stayUntil = now + DOG_STAY; }
    if (dogHere && now >= d.stayUntil) { d.doneKey = key; dogLeave(); st.save(S); }
    else if (!dogHere && mode === 'main' && now < d.stayUntil) dogArrive();
  } else if (dogHere) dogLeave(asleep);
}

// ---------- сон ----------

function fmtTime(t) {
  return new Date(t).toLocaleTimeString(S.lang === 'ru' ? 'ru-RU' : 'en-IE', { hour: '2-digit', minute: '2-digit' });
}

function renderSleep(force = false) {
  const now = Date.now();
  const night = st.isNight(now, S.settings);
  const done = !night && now >= S.session.napUntil && dayDone();
  const until = night || done ? st.nextWake(now, S.settings) : S.session.napUntil;
  const key = `${night}-${done}-${until}-${S.lang}`;
  if (!force && key === sleepKey) return;
  sleepKey = key;
  const m = MISSIONS[st.missionIndex(S, MISSIONS.length)];
  const time = fmtTime(until);
  ui.overlay.className = 'overlay show sleep-ov' + (night ? '' : ' rest');
  const bgHtml = night ? art.scene('night') : `${art.scene(S.bg)}<div class="rest-decor">${ui.decor.innerHTML}${ui.decorFront.innerHTML}</div><div class="rest-veil"></div>`;
  ui.overlay.innerHTML = `<div class="sleep-bg">${bgHtml}</div>
    <button class="shooting" aria-label="star">🌠</button>
    <button class="icon-btn gear gear-sleep" aria-label="parents">⚙️</button>
    <div class="sleep-content">
      <h1>${night ? tr('nightTitle') : done ? tr('dayDoneTitle') : tr('napTitle')} 🌙</h1>
      <p>${night ? tr('nightSub', { time }) : done ? tr('dayDoneSub', { time }) : tr('napSub', { time })}</p>
      ${night ? '' : `<p class="rest-note">${tr('restNote')}</p>`}
      <div class="sleep-lucky">${luckyArt({ face: 'sleep', wear: S.wear })}<div class="zzz"><span>z</span><span>z</span><span>Z</span></div></div>
      ${!night && !S.today.missionDone ? `<div class="card idea"><div class="muted">${tr('napIdea')}</div><div class="task"><span class="t-emoji">${m[2]}</span>${bi(m)}</div></div>` : ''}
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
  renderLucky(true);
  sayAuto(fresh(LUCKY.woke));
  sfx.happy();
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
    art: luckyArt({ face: 'tired', wear: S.wear }),
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

// ---------- родителям ----------

// Родительский раздел под паролем. Пароль задаётся на каждом устройстве при первом входе,
// хранится только его хеш и только на этом телефоне — в коде игры пароля нет.
let adminUntil = 0;
const pwHash = (v) => st.hash(v.trim().toLowerCase());

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

// Код восстановления: 8 символов без похожих букв и цифр (O/0, I/1)
function recoveryCode() {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const r = crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(8)) : Array.from({ length: 8 }, () => Math.random() * 1e9);
  const c = Array.from(r, (x) => A[x % A.length]).join('');
  return c.slice(0, 4) + '-' + c.slice(4);
}
const recHash = (v) => st.hash(v.replace(/[^a-z0-9]/gi, '').toUpperCase());

function fmtDateTime(t) {
  return new Date(t).toLocaleString(S.lang === 'ru' ? 'ru-RU' : 'en-IE', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

// Новый пароль → показать код восстановления
function createPassword(host, done, note = '') {
  pwCard(host, (note ? note + '<br>' : '') + tr('pwNew'), ['•••••', tr('pwRepeat')], ([a, b], err) => {
    if (a.trim().length < 4) return err(tr('pwShort'));
    if (a.trim().toLowerCase() !== b.trim().toLowerCase()) return err(tr('pwMismatch'));
    const code = recoveryCode();
    st.setParentData({ hash: pwHash(a), rec: recHash(code) });
    adminUntil = Date.now() + 10 * 60e3;
    host.innerHTML = `<div class="modal-card pw-card"><h2>🔑 ${tr('pwRecTitle')}</h2><div class="rec-code">${code}</div><p>${tr('pwRecText')}</p>
      <div class="m-btns"><button class="btn pink rec-ok">${tr('pwRecSaved')}</button></div></div>`;
    host.querySelector('.rec-ok').onclick = () => { sfx.tap(); toast('🔒 ' + tr('pwSaved'), 2000); done(); openParent(); };
  }, done);
}

// Забыли пароль: сбросить можно только кодом восстановления, который есть у родителя.
// Без кода — никак (иначе ребёнок мог бы забрать настройки себе); последнее средство описано в README.
function forgotPassword(host, done) {
  pwCard(host, tr('pwRecEnter'), ['XXXX-XXXX'], ([code], err) => {
    if (recHash(code) !== st.parentData().rec) return err(tr('pwRecBad'));
    createPassword(host, done);
  }, done);
  const row = host.querySelector('.m-btns');
  row.insertAdjacentHTML('beforeend', `<button class="btn ghost pw-nocode">${tr('pwNoCode')}</button>`);
  row.querySelector('.pw-nocode').onclick = () => {
    sfx.tap();
    host.innerHTML = `<div class="modal-card pw-card"><h2>🔒 ${tr('pwForgot')}</h2><p>${tr('pwNoCodeText')}</p>
      <div class="m-btns"><button class="btn pink nocode-ok">${tr('close')}</button></div></div>`;
    host.querySelector('.nocode-ok').onclick = () => { sfx.tap(); done(); };
  };
}

let pwOpen = false;
function askPassword() {
  if (Date.now() < adminUntil) return openParent();
  if (pwOpen) return;
  pwOpen = true;
  const d = st.parentData();
  showModal({ cls: '', custom: (host, doneModal) => {
    const done = () => { pwOpen = false; doneModal(); };
    if (!d.hash) return createPassword(host, done);
    pwCard(host, tr('pwHint'), [''], ([a], err) => {
      if (pwHash(a) !== d.hash) return err('');
      adminUntil = Date.now() + 10 * 60e3;
      done();
      openParent();
    }, done);
    host.querySelector('.m-btns').insertAdjacentHTML('afterend', `<button class="btn ghost pw-forgot">${tr('pwForgot')}</button>`);
    host.querySelector('.pw-forgot').onclick = () => { sfx.tap(); forgotPassword(host, done); };
  } });
}

// Подтверждение действия родителя
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

// Инструменты турбо-режима: быстро показать и проверить любую функцию
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
    </div>
    <div class="card"><div class="card-title">${tr('modeTitle')}</div>
      <div class="tabs mode-tabs"><button class="tab ${turbo() ? '' : 'on'}" data-m="std">🐢 ${tr('modeStd')}</button><button class="tab ${turbo() ? 'on' : ''}" data-m="turbo">⚡ ${tr('modeTurbo')}</button></div>
      <p class="muted">${turbo() ? tr('turboNote') : tr('stdNote')}</p>
      ${turbo() ? `<div class="tools">${TURBO_TOOLS.map(([id, e]) => `<button class="tool" data-t="${id}"><span>${e}</span>${tr('tool_' + id)}</button>`).join('')}</div>` : ''}
    </div>
    <div class="row wrap">
      <button class="btn purple wake">⏰ ${tr('wakeLucky')}</button>
      <button class="btn pink invite">🐶 ${tr('inviteDog')}</button>
    </div>
    <p class="muted">${tr('installHint')}</p>
    <div class="row"><button class="btn ghost danger reset">${tr('resetAll')}</button></div>`;
  openSheet('⚙️ ' + tr('parent'), html, (root) => {
    root.querySelectorAll('select').forEach((x) => {
      x.onchange = () => { s[x.dataset.k] = /Min$|PerDay$|Max$/.test(x.dataset.k) ? Number(x.value) : x.value; st.save(S); loop(); };
    });
    root.querySelectorAll('input[type=checkbox]').forEach((x) => {
      x.onchange = () => { s[x.dataset.k] = x.checked; setSound(s.sound); setVoice(s.voice); st.save(S); };
    });
    root.querySelector('.wake').onclick = () => {
      S.session.napUntil = 0;
      S.session.activeMs = 0;
      S.session.warned = false;
      if (st.isNight(Date.now(), s)) toast(tr('nightSub', { time: fmtTime(st.nextWake(Date.now(), s)) }));
      closeSheet();
      loop();
    };
    root.querySelector('.invite').onclick = () => {
      S.dog.forceUntil = Date.now() + DOG_STAY;
      closeSheet();
      loop();
    };
    root.querySelector('.reset').onclick = () => { sfx.tap(); closeSheet(); resetAll(); };
    root.querySelectorAll('.mode-tabs .tab').forEach((b) => {
      b.onclick = () => { if ((b.dataset.m === 'turbo') !== turbo()) { sfx.tap(); closeSheet(); setTurbo(b.dataset.m === 'turbo'); } };
    });
    root.querySelectorAll('.tool').forEach((b) => { b.onclick = () => { sfx.sparkle(); TURBO_TOOLS.find(([id]) => id === b.dataset.t)[2](); }; });
  });
}

// ---------- болтовня ----------

// Когда Лиза просто смотрит: редкие спокойные реплики, в основном по настроению
function ambientTalk() {
  const list = Math.random() < 0.6 ? LUCKY.tier[tier()] : LUCKY[pick(['idle', 'facts', 'ninja', 'compliments'])];
  say(fresh(list), 'lucky', { auto: true, ambient: true });
}

const IDLE_BAG = [['idle', 3], ['questions', 2], ['jokes', 2], ['facts', 2], ['ninja', 1], ['compliments', 1], ['outside', 2], ['phraseHint', 0.6], ['riddle', 1.5], ['realPet', 1]];
const NEED_LINES = { hunger: 'hungry', energy: 'tired', fun: 'bored', clean: 'dirty' };

// Выбор реплики: чаще про то, чего не хватает, и по настроению, иногда общие темы и редкие фразы
function idleTalk() {
  const p = S.pet, t = tier();
  if (Math.random() < 0.03) return sayAuto(fresh(LUCKY.rare));
  if (dogHere && Math.random() < 0.25) return prank(fresh(PRANKS));
  if (dogHere && Math.random() < 0.45) return talk(fresh(CHATS));
  const needs = Object.keys(NEED_LINES).filter((k) => p[k] < 40);
  if (needs.length && Math.random() < 0.7) return sayAuto(fresh(LUCKY[NEED_LINES[pick(needs)]]));
  if (st.minutesToBed(Date.now(), S.settings) <= 60 && Math.random() < 0.4) return sayAuto(fresh(LUCKY.evening));
  if (!S.today.missionDone && Math.random() < 0.12) return sayAuto(fresh(LUCKY.missionHint));
  if (Math.random() < (t === 'low' ? 0.75 : 0.5)) return sayAuto(fresh(LUCKY.tier[t]));
  const bag = IDLE_BAG.filter(([k]) => (k !== 'realPet' || S.settings.realPet) && !(t === 'low' && (k === 'jokes' || k === 'riddle')));
  let x = Math.random() * bag.reduce((a, [, w]) => a + w, 0);
  const [kind] = bag.find(([, w]) => (x -= w) < 0) || bag[0];
  if (kind === 'riddle') return riddle(fresh(RIDDLES));
  sayAuto(fresh(LUCKY[kind]));
}

// Смена настроения: радуемся выздоровлению и полному восторгу; в восторге сам делает бинки
let prevTier = null, recoveredAt = 0, nextBinkyAt = 0, nextTailAt = Date.now() + 120e3;
function moodEvents(now, T0) {
  const t = tier();
  if (mode === 'main' && userActive()) {
    if (prevTier === 'low' && t !== 'low' && now - recoveredAt > 180e3) { recoveredAt = now; sayAuto(fresh(LUCKY.recovered)); }
    else if (t === 'max' && prevTier && prevTier !== 'max' && !T0.maxSaid) { T0.maxSaid = true; sayAuto(fresh(LUCKY.maxReached)); binky(true); }
    else if (t === 'max' && now > nextBinkyAt) { nextBinkyAt = now + 90e3 + Math.random() * 60e3; if (prevTier === 'max') binky(true); }
    else if ((t === 'happy' || t === 'max') && now > nextTailAt && now >= busyUntil && !ask) { nextTailAt = now + 150e3 + Math.random() * 120e3; if (prevTier && Math.random() < 0.5) chaseTail(); }
  }
  prevTier = t;
}

// ---------- главный цикл ----------

function loop() {
  const now = Date.now();
  st.applyDecay(S, now);
  const T0 = st.today(S, now);
  let asleep = turbo() ? now < S.session.napUntil : (st.isAsleep(S, now) || dayDone(T0));

  const dt = Math.max(0, Math.min(now - (S.session.lastAt || now), 5000));
  if (!document.hidden) S.viewMs[T0.date] = (S.viewMs[T0.date] || 0) + dt;
  // Сессия тратится только когда Лиза действует; просто смотреть на Лаки можно сколько угодно
  if (S.session.activeMs > 0 && now - (S.session.activeAt || now) > restGap()) { S.session.activeMs = 0; S.session.warned = false; }
  if (!document.hidden && !asleep && userActive()) {
    S.session.activeAt = now;
    S.session.activeMs += dt;
    S.playedMs[T0.date] = (S.playedMs[T0.date] || 0) + dt;
    const limit = S.settings.sessionMin * 60e3;
    if (!turbo() && (mode === 'main' || mode === 'wash' || mode === 'edit')) {
      if (!S.session.warned && S.session.activeMs >= limit - 60e3) { S.session.warned = true; sayAuto(fresh(LUCKY.sleepSoon)); }
      if (S.session.activeMs >= limit) {
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
    asleep = turbo() ? now < S.session.napUntil : (st.isAsleep(S, now) || dayDone(T0));
  }

  if (asleep && mode !== 'game') {
    if (mode !== 'sleep') enterSleep(); else renderSleep();
  } else if (!asleep && mode === 'sleep') exitSleep();

  updateDog(now, asleep);
  ui.scene.classList.toggle('evening', st.minutesToBed(now, S.settings) <= 60);

  flushPending(now);
  if (mode === 'main' && !sheetOpen && !modalOpen && windowActive() && now >= busyUntil && !chainQ.length) {
    const idleFor = now - lastInput;
    if (idleFor < ACTIVE_MS && canAsk() && now - lastAskAt > ASK_EVERY && (T0.asks < 8 || turbo()) && now - lastSpeech > 20e3 && Math.random() < 0.3) startAsk(pickAsk());
    else if (idleFor < ACTIVE_MS && !ask && now - lastSpeech > 60e3) idleTalk();
    else if (idleFor >= ACTIVE_MS && idleFor < 10 * 60e3 && now - lastSpeech > 180e3) ambientTalk();
  }
  checkPlan(T0);
  moodEvents(now, T0);
  needCues(now);
  if (tick % 10 === 0) checkBadges();
  maybeVisitor(now);
  maybeSurprise(now, T0);
  maybeMood(T0);
  maybeFrog(now, T0);

  renderStats();
  renderLucky();
  renderTop();
  if (++tick % 5 === 0) st.save(S);
}

// Возвращает, сколько не было игрока. Большой перерыв тоже считается отдыхом.
// Большой перерыв без действий тоже считается отдыхом
const restGap = () => Math.min(20, S.settings.napMin) * 60e3;

function resume() {
  const now = Date.now();
  const gap = now - (S.session.activeAt || S.session.lastAt || now);
  if (gap > restGap()) { S.session.activeMs = 0; S.session.warned = false; }
  S.session.lastAt = now;
  return gap;
}

document.addEventListener('pointerdown', () => { lastInput = Date.now(); }, { capture: true });
window.addEventListener('blur', () => silence());
window.addEventListener('focus', () => { lastInput = Date.now(); lastSpeech = Date.now(); });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { silence(); st.save(S); return; }
  const gap = resume();
  lastInput = Date.now();
  lastSpeech = Date.now();
  loop();
  if (gap > 3 * 3600e3 && mode === 'main') sayAuto(fresh(LUCKY.welcomeBack));
});
window.addEventListener('pagehide', () => st.save(S));

['touchend', 'click', 'pointerup'].forEach((ev) => document.addEventListener(ev, unlockAudio, { passive: true, capture: true }));
// iOS молчит до первого касания — повторяем вслух приветствие, которое было на экране
let replayed = false;
const replayGreeting = () => {
  if (replayed) return;
  replayed = true;
  if (lastSaid && Date.now() - lastSaid.at < 8000 && ui.bubble.classList.contains('show')) speak(lastSaid.main, S.lang, lastSaid.who);
};
['touchend', 'click'].forEach((ev) => document.addEventListener(ev, replayGreeting, { once: true, capture: true }));
document.addEventListener('gesturestart', (e) => e.preventDefault());

// ---------- старт ----------

function greetList(gap) {
  if (gap > 3 * 3600e3 && Math.random() < 0.6) return LUCKY.welcomeBack;
  const d = new Date(), h = d.getHours(), weekend = d.getDay() === 0 || d.getDay() === 6;
  if (Math.random() < 0.35) return LUCKY.greet;
  if (h < 12) return LUCKY.morning;
  if (h < 18) return weekend ? LUCKY.weekend : LUCKY.afternoon;
  return LUCKY.evening;
}

function greet(gap) {
  setTemp('happy', 1500);
  sayAuto(fresh(greetList(gap)));
}

function start() {
  if (S.dog.visitKey && S.dog.stayUntil) S.dog.doneKey = S.dog.visitKey;
  S.dog.forceUntil = 0;
  // Старые сохранения: одна вещь → слот гардероба
  const old = WEAR_BY_ID[S.outfit];
  if (old && !Object.values(S.wear).some(Boolean)) S.wear = { [old.slot]: old.id };
  if (old && !ownsWear(old)) S.owned.push(old.id);
  S.outfit = null;
  if (!S.badgesSeeded) {
    // Первый запуск с новой версией: открытые миры считаем посещёнными, уже заработанные значки — без пачки уведомлений
    for (const pl of PLACES) if (S.level >= pl.level && !S.worldsSeen.includes(pl.id)) S.worldsSeen.push(pl.id);
    for (const [id, , , key, goal] of BADGES) if (!S.badges.includes(id) && statValue(key) >= goal) S.badges.push(id);
    for (const a of ALBUMS) if (!S.albumsDone.includes(a.id) && a.stickers.every((x) => S.stickers.includes(x))) { S.albumsDone.push(a.id); if (!S.owned.includes(a.reward)) S.owned.push(a.reward); }
    S.badgesSeeded = true;
  }
  if (!S.worldsSeen.includes(S.bg)) S.worldsSeen.push(S.bg);
  // Интерфейс и речь Лаки всегда на английском, русский — перевод мелко и озвучка по касанию
  S.lang = 'en';
  setSound(S.settings.sound && !MUTE);
  setVoice(S.settings.voice && !MUTE);
  const gap = resume();
  applyLang();
  renderBg();
  renderDecor();
  renderLucky(true);
  $('#beltChip').onclick = () => {
    if (mode !== 'main') return;
    sfx.tap();
    const b = BELTS[S.belt];
    toast(`🥷 <b>${tr('belt')}: ${L(b.name)}</b><br>${S.belt >= BELTS.length - 1 ? tr('beltMax') : tr('beltProgress', { n: S.beltSteps }) + ' · ' + tr('beltGoal')}`, 4500);
    openDojo();
  };
  $('#sleepBtn').onclick = () => { sfx.tap(); askBed(); };
  $('#wordBtn').onclick = () => { if (mode === 'main') { sfx.tap(); openPhrase(); } };
  $('#editBtn').onclick = () => { sfx.tap(); startEdit(); };
  $('#lvlCard').onclick = () => { if (mode === 'main') { sfx.tap(); openPlan(); } };
  bindParentGear($('#gearBtn'));
  lastSpeech = Date.now();
  loop();
  setInterval(loop, 1000);

  if (!S.onboarded) { S.onboarded = true; st.save(S); }
  if (mode === 'main') greet(gap);
}

// Офлайн-кеш только на настоящем https-хостинге. При локальной разработке убираем старый кеш,
// чтобы браузер не смешивал старые и новые файлы.
if ('serviceWorker' in navigator) {
  if (location.protocol === 'https:') navigator.serviceWorker.register('./sw.js').catch(() => {});
  else {
    navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
    window.caches?.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
  }
}


if (new URLSearchParams(location.search).has('debug')) window.game = { S: () => S, st, loop, save: () => st.save(S), visitorNow: () => { nextVisitorAt = 0; }, askById: (id) => { lastInput = Date.now(); busyUntil = 0; startAsk(ASKS.find((x) => x.id === id)); } };

start();
