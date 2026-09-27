// Ninja missions: the phone is the sensei, the doing happens in the real room.
// Lucky explains the mission, counts the moves out loud, calls 'Sneak!' and 'Freeze!', plays the freeze-dance music,
// and afterwards asks what she found, saw or made. Kinds and content are in missions.js.

import { LUCKY } from './i18n.js';
import { PALETTES, SKILLS } from './missions.js';
import { sfx, music, speak, preload, stopSpeech } from './sound.js';
import { PROPS } from './art.js';

const N = LUCKY.sensei;
const rnd = (a, b) => a + Math.random() * (b - a);
const pickOne = (list) => list[Math.floor(Math.random() * list.length)];
const WAIT_LOOK = 15, WAIT_MAKE = 30, HUNT_GAP = 5000;

// ctx: { lang, translate, fast (Turbo: short waits), tr, luckyArt(face), onDone(result), onClose() }
export function openMission(host, m, ctx) {
  const WAIT = (s) => (ctx.fast ? 2 : s), GAP = ctx.fast ? 600 : HUNT_GAP;
  const timers = [];
  let over = false;
  const later = (ms, fn) => timers.push(setTimeout(() => { if (!over) fn(); }, ms));
  const L = (pair) => pair[ctx.lang === 'en' ? 1 : 0];
  const O = (pair) => pair[ctx.lang === 'en' ? 0 : 1];
  const sk = SKILLS[m.skill];

  host.innerHTML = `<div class="ninja-mission m-${m.kind}">
    <div class="m-head"><button class="g-exit" aria-label="close">✕</button><span class="m-skill">${sk.emoji} ${L(sk.name)}</span></div>
    <div class="m-top">
      <div class="m-lucky"><div class="l-art"></div><svg class="l-props" viewBox="0 0 200 210" aria-hidden="true"></svg></div>
      <div class="m-say"><div class="m-main"></div><div class="m-sub"></div></div>
    </div>
    <div class="m-stage"></div>
    <div class="m-btns"></div>
  </div>`;
  const $ = (s) => host.querySelector(s);
  const luckyEl = $('.m-lucky'), stage = $('.m-stage'), btns = $('.m-btns');
  const draw = (face) => { $('.l-art').innerHTML = ctx.luckyArt(face); };
  const props = (list) => { $('.l-props').innerHTML = list.map(([id, arg]) => `<g class="pp pp-in">${PROPS[id].art(arg)}</g>`).join(''); };
  draw('happy');

  // A line: text with a small translation, spoken; tapping the line plays the translation
  let lastLine = null;
  function talk(pair) {
    lastLine = pair;
    $('.m-main').textContent = L(pair);
    $('.m-sub').textContent = ctx.translate ? O(pair) : '';
    speak(L(pair), ctx.lang, 'lucky');
  }
  $('.m-say').onclick = () => { if (lastLine && ctx.translate) speak(O(lastLine), ctx.lang === 'en' ? 'ru' : 'en', 'lucky'); };

  // Lucky's moves: a one-off class (restarted each time) or a pose that stays
  function move(cls) { luckyEl.classList.remove(cls); void luckyEl.getBoundingClientRect(); luckyEl.classList.add(cls); }
  const setPose = (cls = '') => { luckyEl.className = 'm-lucky ' + cls; };

  function buttons(list) {
    btns.innerHTML = list.map((b, i) => `<button class="btn ${b.cls || 'pink'}" data-i="${i}" ${b.off ? 'disabled' : ''}>${b.label}</button>`).join('');
    btns.querySelectorAll('button').forEach((el) => { el.onclick = () => { sfx.tap(); list[el.dataset.i].fn(); }; });
    return btns.querySelectorAll('button');
  }

  // keep the screen on during guided missions, where the browser allows it
  let wake = null;
  const keepAwake = () => { try { navigator.wakeLock?.request('screen').then((w) => { wake = w; }, () => {}); } catch { /* not supported */ } };
  function stop() {
    over = true;
    timers.forEach(clearTimeout);
    music.stop();
    stopSpeech();
    try { wake?.release(); } catch { /* ignore */ }
  }
  const close = () => { stop(); ctx.onClose(); };
  $('.g-exit').onclick = () => { sfx.tap(); close(); };

  // The end: a cheer (or the reaction already said) and the 'I did it!' button
  function done(lines, result = {}) {
    setPose('mv-hop');
    draw('laugh');
    sfx.happy();
    if (lines) talk(pickOne(lines));
    stage.innerHTML = '<div class="m-emoji pop">🎉</div>';
    buttons([{ label: ctx.tr('mDid'), fn: () => { stop(); ctx.onDone(result); } }]);
  }

  // A grid of things to pick: what she found, saw or made. onPick returns false to keep the grid open.
  function palette(key, title, onPick, multi = 0) {
    const list = PALETTES[key];
    const box = document.createElement('div');
    box.className = 'm-pal';
    box.innerHTML = `<h3>${title}</h3><div class="m-pal-grid">${list.map((it, i) => `<button class="m-pal-it" data-i="${i}"><span>${it.e}</span><b>${L(it.w).replace(/!$/, '')}</b>${ctx.translate ? `<small>${O(it.w).replace(/!$/, '')}</small>` : ''}</button>`).join('')}</div>
      ${multi ? `<div class="m-btns"><button class="btn pink m-pal-ok" disabled>${ctx.tr('done')}</button></div>` : ''}`;
    host.querySelector('.ninja-mission').appendChild(box);
    const chosen = [];
    box.querySelectorAll('.m-pal-it').forEach((b) => {
      b.onclick = () => {
        const it = list[b.dataset.i];
        if (multi) {
          const k = chosen.indexOf(it);
          if (k >= 0) { chosen.splice(k, 1); b.classList.remove('sel'); }
          else if (chosen.length < multi) { chosen.push(it); b.classList.add('sel'); sfx.pop(); speak(L(it.w), ctx.lang, 'lucky'); }
          box.querySelector('.m-pal-ok').disabled = !chosen.length;
          return;
        }
        if (onPick(it) === false) { b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); return; }
        box.remove();
      };
    });
    if (multi) box.querySelector('.m-pal-ok').onclick = () => { sfx.tap(); box.remove(); onPick(chosen); };
  }

  // A button that only wakes up after some real-world time: 'I'm back!', 'It's ready!'
  function waitButton(secs, label, fn) {
    const [b] = buttons([{ label: `${label} · ${secs}`, off: true, fn }]);
    const t0 = Date.now();
    const tickBtn = () => {
      const n = Math.ceil(secs - (Date.now() - t0) / 1000);
      if (n > 0) { b.textContent = `⏳ ${label} · ${n}`; later(500, tickBtn); return; }
      b.textContent = label;
      b.disabled = false;
      b.classList.add('ready');
    };
    tickBtn();
  }

  const RUN = {
    // Lucky counts out loud and does the move too
    count() {
      keepAwake();
      buttons([]);
      preload(N.count.slice(0, m.n).map(L).concat(L(N.ready[0])), ctx.lang);
      stage.innerHTML = `<div class="m-emoji">${m.emoji}</div>`;
      talk(N.ready[0]);
      const tick = (i) => {
        stage.innerHTML = `<div class="m-big pop">${i}</div><div class="m-of">/ ${m.n}</div>`;
        talk(N.count[i - 1]);
        move('mv-' + m.move);
        if (i < m.n) later(m.pace, () => tick(i + 1));
        else later(Math.max(900, m.pace), () => done(N.countDone, { n: m.n }));
      };
      later(1900, () => tick(1));
    },

    // hold a pose while Lucky counts the seconds (quietly for the glass of water)
    hold() {
      keepAwake();
      buttons([]);
      preload(N.count.slice(0, m.secs).map(L), ctx.lang);
      setPose('ps-' + m.pose);
      talk(N.ready[0]);
      stage.innerHTML = `<div class="m-ring" style="--p:0"><span>${m.secs}</span></div>`;
      const ring = stage.querySelector('.m-ring');
      let sec = 0;
      const step = () => {
        sec++;
        ring.style.setProperty('--p', sec / m.secs);
        ring.querySelector('span').textContent = Math.max(0, m.secs - sec);
        if (m.quiet) sfx.tick(); else talk(N.count[sec - 1]);
        if (sec >= m.secs) later(900, () => done(m.quiet ? N.quietDone : N.holdDone, { secs: m.secs }));
        else later(1000, step);
      };
      later(2600, step);
    },

    // Ninja sneak: move on 'Sneak!', freeze on 'Freeze!' (the phone can lie on the table)
    freeze() {
      keepAwake();
      buttons([]);
      props([['mask', '#2E2A33']]);
      talk(N.phoneDown[0]);
      stage.innerHTML = `<div class="m-emoji">${m.emoji}</div>`;
      const endAt = Date.now() + 2600 + m.secs * 1000;
      const sneak = () => {
        if (Date.now() >= endAt) { props([]); return done(N.freezeDone); }
        stage.innerHTML = `<div class="m-sign go">🥷 ${ctx.tr('mSneak')}</div>`;
        setPose('ps-sneak');
        sfx.go();
        talk(pickOne(N.sneak));
        later(rnd(3000, 5500), freeze);
      };
      const freeze = () => {
        stage.innerHTML = `<div class="m-sign stop">🧊 ${ctx.tr('mFreeze')}</div>`;
        setPose('ps-frozen');
        sfx.freeze();
        talk(pickOne(N.freeze));
        later(rnd(2200, 3600), sneak);
      };
      later(2600, sneak);
    },

    // Freeze dance: music plays, stops at random moments, and then everyone freezes
    dance() {
      keepAwake();
      buttons([]);
      talk(N.phoneDown[0]);
      stage.innerHTML = `<div class="m-emoji">${m.emoji}</div>`;
      const endAt = Date.now() + 2600 + m.secs * 1000;
      const play = () => {
        if (Date.now() >= endAt) { music.stop(); setPose(''); return done(N.danceDone); }
        stage.innerHTML = `<div class="m-sign go">💃 ${ctx.tr('mDance')}</div>`;
        setPose('ps-dance');
        talk(pickOne(N.dance));
        later(700, () => music.start());
        later(rnd(4500, 7500), freeze);
      };
      const freeze = () => {
        music.stop();
        stage.innerHTML = `<div class="m-sign stop">🧊 ${ctx.tr('mFreeze')}</div>`;
        setPose('ps-frozen');
        sfx.freeze();
        talk(pickOne(N.freeze));
        later(rnd(2200, 3500), play);
      };
      later(2600, play);
    },

    // Find things at home; each find is picked from a grid with its English word
    hunt() {
      const labels = m.labels || Array.from({ length: m.slots }, () => null);
      const found = labels.map(() => null);
      let nextAt = Date.now() + GAP;
      buttons([]);
      talk(N.huntGo[0]);
      const render = () => {
        stage.innerHTML = `<div class="m-slots">${labels.map((lb, i) => `<button class="m-slot ${found[i] ? 'on' : ''}" data-i="${i}">
          <span>${found[i] ? found[i].e : '🔍'}</span>${lb ? `<small>${L(lb)}</small>` : ''}</button>`).join('')}</div>`;
        stage.querySelectorAll('.m-slot').forEach((b) => {
          b.onclick = () => {
            const i = Number(b.dataset.i);
            if (found[i]) return;
            if (Date.now() < nextAt) { sfx.tap(); talk(N.lookFirst[0]); return; }
            sfx.tap();
            palette(m.palette, ctx.tr('mWhatFound') + (labels[i] ? ` (${L(labels[i])})` : ''), (it) => {
              if (it.bad) { sfx.note(220); talk(m.palette === 'b' ? N.notB[0] : N.notRound[0]); return false; }
              found[i] = it;
              nextAt = Date.now() + GAP;
              sfx.sparkle();
              move('mv-hop');
              talk(it.w);
              render();
              if (found.every(Boolean)) later(1500, () => done(N.huntDone, { found: found.map((x) => x.e).join('') }));
              else later(1500, () => talk(pickOne(N.found)));
              return true;
            });
          };
        });
      };
      render();
    },

    // Look out of the window (or listen with eyes closed), then tell Lucky
    look() {
      const ask = { cloud: N.askCloud, birds: N.askBirds, sounds: N.askSounds }[m.result][0];
      const tell = () => {
        buttons([]);
        talk(ask);
        palette(m.palette, L(ask), (pick) => {
          const it = Array.isArray(pick) ? pick[0] : pick;
          sfx.sparkle();
          move('mv-hop');
          draw('laugh');
          talk(it.w);
          stage.innerHTML = `<div class="m-emoji pop">${Array.isArray(pick) ? pick.map((x) => x.e).join('') : it.e}</div>`;
          later(1400, () => {
            if (m.result === 'cloud') { talk(N.cloudSky[0]); done(null, { cloud: it.e, found: it.e }); }
            else if (m.result === 'birds') { talk(it.n === 0 ? N.birds0[0] : it.n <= 2 ? N.birds1[0] : N.birds2[0]); done(null, { found: it.e }); }
            else { talk(N.sounds[0]); done(null, { found: pick.map((x) => x.e).join('') }); }
          });
        }, m.multi || 0);
      };
      if (m.result === 'sounds') {
        keepAwake();
        buttons([]);
        draw('sleep'); // face first: Safari doesn't animate SVG parts redrawn after the class was added
        setPose('ps-listen');
        talk(N.eyesClosed[0]);
        stage.innerHTML = `<div class="m-ring" style="--p:0"><span>👂</span></div>`;
        const ring = stage.querySelector('.m-ring'), t0 = Date.now(), total = (m.secs || 20) * 1000;
        const step = () => {
          const p = Math.min(1, (Date.now() - t0) / total);
          ring.style.setProperty('--p', p);
          if (p >= 1) { sfx.chime(); setPose(''); draw('happy'); tell(); return; }
          later(250, step);
        };
        later(1500, step);
        return;
      }
      talk(N.comeBack[0]);
      stage.innerHTML = `<div class="m-emoji">${m.emoji}</div><p class="m-note">${ctx.tr('mGoLook')}</p>`;
      waitButton(WAIT(m.secs || WAIT_LOOK), ctx.tr('mBack'), tell);
    },

    // Make something real, then tell Lucky what it's like; the mask shows up on Lucky
    make() {
      const ask = { mask: N.askColour, star: N.askColour, drawing: N.askDrawing, plane: N.askPlane }[m.result][0];
      talk(N.makeGo[0]);
      stage.innerHTML = `<div class="m-emoji">${m.emoji}</div><p class="m-note">${ctx.tr('mGoMake')}</p>`;
      waitButton(WAIT(WAIT_MAKE), ctx.tr('mReady'), () => {
        buttons([]);
        talk(ask);
        palette(m.palette, L(ask), (it) => {
          sfx.sparkle();
          draw('laugh');
          talk(it.w);
          stage.innerHTML = `<div class="m-emoji pop">${m.result === 'mask' ? '🥷' : it.e}</div>`;
          if (m.result === 'mask') props([['mask', it.c]]);
          later(1400, () => {
            if (m.result === 'mask') { talk(N.maskOn[0]); done(null, { mask: it.c, found: it.e }); }
            else if (m.result === 'star') { talk(N.starOn[0]); done(null, { found: it.e }); }
            else if (m.result === 'plane') { talk(N['plane' + it.far][0]); done(null, { found: it.e }); }
            else { talk(pickOne(N.wow)); done(null, { found: it.e }); }
          });
        });
      });
    },

    // slow breathing together
    breath() {
      keepAwake();
      buttons([]);
      stage.innerHTML = '<div class="b-circle"><span></span></div>';
      const circle = stage.querySelector('.b-circle'), IN = 4000, OUT = 4000, n = m.cycles || 5;
      draw('happy');
      for (let c = 0; c < n; c++) {
        later(c * (IN + OUT), () => { circle.className = 'b-circle in'; talk(LUCKY.breathIn[0]); });
        later(c * (IN + OUT) + IN, () => { circle.className = 'b-circle out'; talk(LUCKY.breathOut[0]); });
      }
      later(n * (IN + OUT), () => done([LUCKY.breathDone[0]]));
    },
  };

  // intro: the mission, said out loud
  stage.innerHTML = `<div class="m-emoji">${m.emoji}</div><p class="m-note">${ctx.tr(['hunt', 'look', 'make'].includes(m.kind) ? 'mRealNote' : 'mFollowNote')}</p>`;
  talk(m.text);
  buttons([{ label: ctx.tr('mStart'), fn: () => RUN[m.kind]() }, { label: ctx.tr('back'), cls: 'ghost', fn: close }]);
  return { stop };
}
