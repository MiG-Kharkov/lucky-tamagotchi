// Living scene: things in the worlds answer a tap, a double tap and a long press, and Lucky joins in.
// He walks over, puts on props, gets wet and shakes dry, runs away from the crab, hides and waits to be found.
// Lines live in LUCKY.antics; each line has its own cooldown so Lucky comments without chattering.

import { LUCKY, DOG } from './i18n.js';
import { sfx } from './sound.js';
import { PROPS, decor as decorArt } from './art.js';

const LONG_MS = 550, DOUBLE_MS = 300, MOVE_PX = 14, STROKE_PX = 90;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Gestures on elements found by find(target):
//   press  - every tap, at once (p.second is true for the second tap of a double tap)
//   tap    - a single tap, once it's clear no second tap follows
//   double - two quick taps on the same thing
//   long   - press and hold
//   stroke - press and slide the finger (only if opts.stroke)
export function gestures(root, find, on, opts = {}) {
  let down = null, last = null;
  const pt = (e) => ({ clientX: e.clientX, clientY: e.clientY, target: e.target });
  root.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    const el = find(e.target);
    if (!el) return;
    const d = { el, x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY, path: 0, p: pt(e) };
    down = d;
    d.timer = setTimeout(() => { if (down === d && !d.moved) { d.long = true; on('long', el, d.p); } }, LONG_MS);
  });
  root.addEventListener('pointermove', (e) => {
    const d = down;
    if (!d) return;
    d.path += Math.hypot(e.clientX - d.px, e.clientY - d.py);
    d.px = e.clientX;
    d.py = e.clientY;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > MOVE_PX) { d.moved = true; clearTimeout(d.timer); }
    if (opts.stroke && d.moved && !d.stroked && d.path > STROKE_PX) { d.stroked = true; on('stroke', d.el, pt(e)); }
  });
  const up = (e) => {
    const d = down;
    down = null;
    if (!d) return;
    clearTimeout(d.timer);
    if (d.long || d.moved || e.type === 'pointercancel') return;
    const p = pt(e), now = Date.now();
    if (last && last.el === d.el && now - last.at < DOUBLE_MS) {
      clearTimeout(last.timer);
      last = null;
      on('press', d.el, { ...p, second: true });
      on('double', d.el, p);
      return;
    }
    if (last) { clearTimeout(last.timer); last.fire(); } // a tap on something else: finish the previous one now
    on('press', d.el, p);
    const l = { el: d.el, at: now, fire: () => { if (last === l) last = null; on('tap', d.el, p); } };
    l.timer = setTimeout(l.fire, DOUBLE_MS);
    last = l;
  };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
}

// api (from main.js): ui, ok() - scene is interactive, free() - Lucky can take part (no question on screen),
// world(), say(list, who) → ms, hop(el, cls, ms), setTemp(face, ms), floatFx(x, y, txt, cls), fxAt(x, y, list, n, cls),
// hearts(x, y, n), luckyPoint(fx, fy), sceneXY(p), reward(), boost(stat, n), stat(key)
export function createAntics(api) {
  const { ui } = api;
  const L = ui.lucky;

  // ---------- lines ----------
  const saidAt = {};
  function line(key, chance = 0.85, gap = 12000, who = 'lucky') {
    const now = Date.now();
    const list = who === 'dog' ? DOG[key] : LUCKY.antics[key];
    const k = who + ':' + key;
    if (!list || now - (saidAt[k] || 0) < gap || Math.random() > chance) return 0;
    saidAt[k] = now;
    return api.say(list, who);
  }

  // ---------- geometry ----------
  const sceneRect = () => ui.scene.getBoundingClientRect();
  function centerOf(el) {
    const r = el.getBoundingClientRect(), s = sceneRect();
    return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2];
  }
  const topOf = (el) => { const r = el.getBoundingClientRect(), s = sceneRect(); return [r.left - s.left + r.width / 2, r.top - s.top]; };
  const pct = (x) => (x / sceneRect().width) * 100;
  const head = () => api.luckyPoint(0.5, 0.16);
  const nose = () => api.luckyPoint(0.5, 0.5);
  const mouth = () => api.luckyPoint(0.5, 0.56);
  const feet = () => api.luckyPoint(0.5, 0.95);
  const paw = () => api.luckyPoint(0.74, 0.8);
  const earPt = () => api.luckyPoint(0.2, 0.38);
  // where Lucky stands to reach el: a bit to its side, never off the scene
  const nextTo = (el, gap = 20) => { const x = pct(centerOf(el)[0]); return clamp(x < 50 ? x + gap : x - gap, 26, 74); };
  const awayFrom = (el) => (pct(centerOf(el)[0]) > 50 ? 27 : 73);

  // ---------- Lucky's scenes: moving, poses, timers ----------
  let act = null, lastFidget = '';
  function begin(name) {
    end();
    const a = { name, timers: [], cls: new Set() };
    act = a;
    return a;
  }
  function end() {
    const a = act;
    if (!a) return;
    act = null;
    a.timers.forEach(clearTimeout);
    a.cls.forEach((c) => L.classList.remove(c));
    if (L.style.left) { L.style.left = ''; api.hop(L, 'walk', 900); }
  }
  const at = (a, ms, fn) => a.timers.push(setTimeout(() => { if (act === a) fn(); }, ms));
  function hold(a, c, ms) {
    L.classList.add(c);
    a.cls.add(c);
    if (ms) at(a, ms, () => { L.classList.remove(c); a.cls.delete(c); });
  }
  function go(pctX, ms = 700) {
    L.style.setProperty('--go', ms + 'ms');
    L.style.left = pctX + '%';
    api.hop(L, 'walk', ms + 150);
  }
  // face first, then the animation class: Safari doesn't animate SVG parts re-rendered after the class was added
  function pose(face, faceMs, cls, clsMs) {
    if (face) api.setTemp(face, faceMs);
    if (cls) api.hop(L, cls, clsMs);
  }

  // ---------- props ----------
  const worn = {};   // slot → { id, g, timer }
  const sticky = {}; // slot → [id, arg]: comes back when a temporary prop is gone (the ninja mask of the day)
  function prop(id, ms = 4000, arg) {
    const P = PROPS[id];
    if (!P || !ui.props) return;
    unprop(P.slot, true);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `pp pp-in pid-${id}`);
    g.innerHTML = P.art(arg);
    ui.props.appendChild(g);
    L.classList.add('p-' + P.slot);
    worn[P.slot] = { id, g, timer: ms === Infinity ? 0 : setTimeout(() => unprop(P.slot), ms) };
  }
  function unprop(slot, replacing = false) {
    const w = worn[slot];
    if (!w) return;
    clearTimeout(w.timer);
    delete worn[slot];
    L.classList.remove('p-' + slot);
    if (replacing) w.g.remove();
    else {
      w.g.classList.add('pp-out');
      setTimeout(() => w.g.remove(), 350);
      if (sticky[slot]) setTimeout(() => { if (!worn[slot] && sticky[slot]) prop(sticky[slot][0], Infinity, sticky[slot][1]); }, 360);
    }
  }
  function setSticky(slot, id, arg) {
    if (id) { sticky[slot] = [id, arg]; if (!worn[slot]) prop(id, Infinity, arg); }
    else { delete sticky[slot]; if (worn[slot]) unprop(slot); }
  }
  function clearProps() {
    Object.keys(worn).forEach((slot) => { if (!sticky[slot] || worn[slot].id !== sticky[slot][0]) unprop(slot, true); });
    Object.keys(sticky).forEach((slot) => { if (!worn[slot]) prop(sticky[slot][0], Infinity, sticky[slot][1]); });
  }

  // ---------- flying things ----------
  function fly(txt, [x0, y0], [x1, y1], ms = 700, { arc = 0, spin = 0, size = 30, stay = 0, cls = '' } = {}) {
    const s = document.createElement('span');
    s.className = 'fly-fx ' + cls;
    s.textContent = txt;
    s.style.fontSize = size + 'px';
    ui.fx.appendChild(s);
    const at2 = (x, y, r) => `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg)`;
    const frames = [{ transform: at2(x0, y0, 0) }];
    if (arc) frames.push({ transform: at2((x0 + x1) / 2, Math.min(y0, y1) - arc, spin / 2), offset: 0.5 });
    frames.push({ transform: at2(x1, y1, spin) });
    s.animate(frames, { duration: ms, easing: arc ? 'ease-in-out' : 'ease-in', fill: 'forwards' });
    setTimeout(() => s.remove(), ms + stay);
    return s;
  }
  // something appears, stays for a moment and pops away
  function popUp(txt, x, y, ms = 2200, size = 40, cls = 'pop-stay') {
    const s = document.createElement('span');
    s.className = 'fly-fx ' + cls;
    s.textContent = txt;
    s.style.fontSize = size + 'px';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.setProperty('--ms', ms + 'ms');
    ui.fx.appendChild(s);
    setTimeout(() => s.remove(), ms);
    return s;
  }
  function rainbow(ms = 4200) {
    const d = document.createElement('div');
    d.className = 'fx-rainbow';
    d.style.setProperty('--ms', ms + 'ms');
    d.innerHTML = decorArt('rainbow');
    ui.fx.appendChild(d);
    setTimeout(() => d.remove(), ms);
  }
  // water drops fly off in all directions
  function spray(x, y, list = ['💧', '💦']) {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      fly(list[i % list.length], [x, y], [x + Math.cos(a) * 90, y + Math.sin(a) * 60 - 20], 500, { size: 18 });
    }
  }
  function shakeDry(a, ms) {
    at(a, ms, () => {
      sfx.shake();
      api.hop(L, 'shakeOff', 1200);
      unprop('body');
      L.classList.remove('wet');
      a.cls.delete('wet');
      spray(...api.luckyPoint(0.5, 0.45));
      api.boost('clean', 3);
      line('shakeDry', 0.9, 8000);
    });
  }
  function getWet(a, ms = 2200) {
    prop('wet', ms + 400);
    hold(a, 'wet');
    api.setTemp('sad', 1200);
    shakeDry(a, ms);
  }

  // hide and seek: Lucky hides; a tap on him finds him, otherwise he jumps out with a 'Boo!'
  function hideGame(a, el, cls = 'hiding', ms = 4500) {
    const walk = el ? 800 : 0;
    if (el) go(clamp(pct(centerOf(el)[0]), 26, 74), walk);
    at(a, walk, () => {
      hold(a, cls);
      line('hide', 1, 6000);
      sfx.whoosh();
      a.onLuckyTap = () => found(a, cls);
    });
    at(a, walk + ms, () => {
      if (a.found) return;
      a.onLuckyTap = null;
      L.classList.remove(cls);
      a.cls.delete(cls);
      sfx.boing();
      pose('laugh', 1400, 'hop');
      line('boo', 1, 0);
      at(a, 1000, end);
    });
  }
  // she found Lucky while he was hiding (behind a tree, invisible, in his house)
  function found(a, cls) {
    a.found = true;
    a.onLuckyTap = null;
    L.classList.remove(cls);
    a.cls.delete(cls);
    sfx.happy();
    pose('laugh', 1500, 'binky');
    api.hearts(...head(), 4);
    api.reward();
    line('found', 1, 0);
    at(a, 1200, end);
    return true;
  }

  // ---------- reactions: what each thing does ----------
  const who = (fn) => (c) => { if (api.free()) fn(c); };
  const R = {};

  R.sun = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['✨', '☀️'], 5, 'spark'); },
    tap: who(() => { pose('happy', 3000, 'hop'); prop('shades', 5000); line('sunShades'); api.reward(); }),
    double: who(() => {
      api.setTemp('sleep', 500);
      setTimeout(() => { sfx.sneeze(); pose('laugh', 1400, 'sneeze'); api.fxAt(...nose(), ['💨', '✨'], 4, 'spark'); line('sunSneeze', 1); }, 450);
    }),
    long: who(() => {
      const a = begin('bask');
      pose('happy', 3800);
      hold(a, 'bask', 3800);
      api.fxAt(...head(), ['☀️', '✨'], 4, 'spark');
      line('sunBask', 1);
      api.boost('energy', 2);
      api.reward();
      at(a, 3900, end);
    }),
  };

  R.cloud = {
    press: (c) => {
      const w = api.world();
      sfx.bubble();
      api.fxAt(c.x, c.y + 20, w === 'candy' ? ['🍬', '🍭'] : w === 'winter' ? ['❄️'] : ['💧'], 8, 'drop');
    },
    tap: who((c) => {
      if (api.world() !== 'candy' && api.world() !== 'winter' && api.idiom?.('cloud', 0.35)) return; // "It's raining cats and dogs!"
      const a = begin('rain'), w = api.world(), [hx, hy] = head();
      if (w === 'candy') {
        for (let i = 0; i < 5; i++) at(a, i * 220, () => { fly(i % 2 ? '🍬' : '🍭', [c.x, c.y], mouth(), 600, { spin: 200, size: 26 }); });
        at(a, 700, () => { api.setTemp('eat', 1400); sfx.yum(); line('candyRain'); });
        at(a, 1800, end);
        return;
      }
      fly('☁️', [c.x, c.y], [hx, hy - 50], 600, { size: 64, stay: 1700, cls: 'rain-cloud' });
      at(a, 550, () => {
        api.fxAt(hx, hy - 30, w === 'winter' ? ['❄️'] : ['💧'], 10, 'drop');
        if (w === 'winter') { sfx.bubble(); prop('snowcap', 4000); hold(a, 'shiver', 1400); line('snowFlakes'); at(a, 2800, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); }); at(a, 3800, end); return; }
        sfx.rain();
        line('rainWet', 0.9);
        getWet(a, 2000);
        at(a, 3400, end);
      });
    }),
    double: who((c) => {
      const a = begin('umbrella'), [hx, hy] = head();
      prop('umbrella', 4200);
      pose('happy', 3000);
      fly('☁️', [c.x, c.y], [hx, hy - 90], 600, { size: 64, stay: 1600, cls: 'rain-cloud' });
      at(a, 500, () => { sfx.rain(); api.fxAt(hx, hy - 70, ['💧'], 10, 'drop'); line('umbrella', 1); });
      at(a, 2400, end);
    }),
    long: who((c) => {
      const a = begin('storm');
      sfx.thunder();
      api.fxAt(c.x, c.y + 20, ['💧'], 14, 'drop');
      at(a, 400, () => sfx.rain());
      at(a, 1300, () => { rainbow(); sfx.chime(); pose('laugh', 2000, 'binky'); line('rainbow', 1); api.reward(); });
      at(a, 3000, end);
    }),
  };

  R.tree = {
    press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['🌸'], 8, 'drop petal-fx'); },
    tap: who(() => {
      const [hx, hy] = head();
      api.fxAt(hx, hy - 60, ['🌸'], 6, 'drop petal-fx');
      setTimeout(() => { prop('petals', 4500); api.setTemp('happy', 1500); line('petals', 0.8); }, 500);
      if (Math.random() < 0.3) setTimeout(() => { if (!api.free()) return; api.setTemp('sleep', 400); setTimeout(() => { sfx.sneeze(); pose('laugh', 1200, 'sneeze'); unprop('head'); }, 400); }, 1800);
    }),
    double: who((c) => {
      const a = begin('cherry');
      fly('🍒', [c.x, c.y], head(), 700, { spin: 360, size: 30 });
      at(a, 700, () => { sfx.bonk(); api.hop(L, 'squash', 700); });
      at(a, 900, () => { prop('cherry', 2200); api.setTemp('eat', 1800); sfx.crunch(); line('cherry', 1); api.reward(); });
      at(a, 2400, end);
    }),
    long: who((c) => hideGame(begin('hide'), c.el)),
  };

  R.flower = {
    press: (c) => { sfx.pop(); api.floatFx(c.x, c.y - 10, '🦋', 'fly-up'); },
    tap: who((c) => {
      const a = begin('sniff');
      go(nextTo(c.el), 600);
      at(a, 650, () => { api.setTemp('happy', 1500); api.hop(L, 'sniff', 1500); sfx.sniff(); line('sniff', 0.8); });
      if (Math.random() < 0.3) at(a, 1700, () => { api.setTemp('sleep', 400); at(a, 400, () => { sfx.sneeze(); pose('laugh', 1200, 'sneeze'); line('pollen', 1); }); });
      at(a, 2900, end);
    }),
    double: (c) => {
      api.hop(c.el, 'bloom', 1800);
      sfx.magic();
      api.fxAt(c.x, c.y, ['✨', '🌸'], 6, 'spark');
      if (api.free()) { pose('laugh', 1400, 'clap'); line('bloom'); }
    },
    long: who((c) => {
      fly('🌸', [c.x, c.y], earPt(), 600, { size: 26 });
      setTimeout(() => { prop('flower', 30000); sfx.sparkle(); api.setTemp('happy', 1600); line('flowerEar', 1); api.reward(); }, 600);
    }),
  };

  R.gong = {
    press: (c) => { sfx.gong(); api.floatFx(c.x, c.y, '', 'ripple'); },
    tap: who(() => { pose('ok', 1000, 'startle', 1200); line('gongJump', 0.8); }),
    double: who(() => {
      sfx.whoosh();
      pose('laugh', 1200, 'kick', 1000);
      setTimeout(() => { const [x, y] = api.luckyPoint(0.95, 0.55); api.floatFx(x, y, '💥', 'spark'); sfx.bonk(); }, 380);
      line('kick', 0.9);
    }),
    long: who(() => {
      const a = begin('meditate');
      pose('happy', 4200);
      hold(a, 'levitate', 4200);
      api.fxAt(...head(), ['✨'], 3, 'spark');
      line('meditate', 1);
      api.boost('energy', 2);
      api.reward();
      at(a, 4300, end);
    }),
  };

  R.fuji = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['❄️', '✨'], 5, 'spark'); },
    tap: who(() => { pose('happy', 1500, 'hop'); line('fuji', 0.8); }),
    double: who(() => { pose('laugh', 1800, 'climb', 1800); line('climb'); }),
    long: who(() => {
      const a = begin('snow');
      api.fxAt(...head(), ['❄️'], 7, 'drop');
      at(a, 400, () => { prop('snowcap', 3000); hold(a, 'shiver', 1200); line('snowHead', 1); });
      at(a, 2300, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); });
      at(a, 3400, end);
    }),
  };

  R.lolly = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['🍬', '✨', '🍭'], 5, 'spark'); },
    tap: who(() => { api.setTemp('eat', 1300); sfx.lick(); setTimeout(() => sfx.lick(), 300); line('lick', 0.8); }),
    double: who((c) => {
      const a = begin('lolly');
      go(nextTo(c.el), 600);
      at(a, 650, () => { prop('lolly', 4000); api.setTemp('eat', 1800); sfx.slurp(); line('lolly', 1); api.reward(); });
      at(a, 2300, end);
    }),
    long: who(() => {
      const a = begin('sugar');
      pose('laugh', 2400, 'zoom', 2500);
      sfx.whoosh();
      at(a, 900, () => sfx.whoosh());
      line('sugarRush', 1);
      at(a, 2500, () => { prop('dizzy', 2600); api.setTemp('tired', 2400); line('tooSweet', 1, 30000); });
      at(a, 4600, end);
    }),
  };

  R.palm = {
    press: () => sfx.pop(),
    tap: who((c) => {
      const a = begin('coconut');
      fly('🥥', [c.x, c.y], head(), 650, { spin: 240, size: 32 });
      at(a, 650, () => { sfx.bonk(); api.hop(L, 'squash', 700); prop('bump', 3200); prop('dizzy', 2600); api.setTemp('tired', 2000); line('coconut', 0.9); });
      at(a, 2600, end);
    }),
    double: who(() => { prop('coconut', 4000); api.setTemp('eat', 1800); sfx.slurp(); line('coconutDrink'); api.reward(); }),
    long: who((c) => {
      const a = begin('dodge');
      const drop = (i, px) => at(a, i * 750, () => {
        const [hx, hy] = head();
        fly('🥥', [c.x, c.y], [hx, hy + 20], 600, { spin: 200, size: 30 });
        at(a, 250, () => { sfx.whoosh(); go(px, 350); });
      });
      drop(0, 36);
      drop(1, 64);
      drop(2, 50);
      at(a, 2500, () => { pose('laugh', 1400, 'binky'); line('dodge', 1); api.reward(); });
      at(a, 3400, end);
    }),
  };

  R.shell = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['✨', '🌊'], 4, 'spark'); },
    tap: who(() => { prop('shell', 3500); pose('happy', 3000, 'listen', 3000); sfx.whoosh(); setTimeout(() => sfx.whoosh(), 900); line('shellListen', 0.9); }),
    double: who(() => { prop('pearl', 3500); api.fxAt(...paw(), ['✨'], 4, 'spark'); sfx.chime(); api.setTemp('happy', 1500); line('pearl'); api.reward(); }),
    long: who(() => { prop('shell', 2500); sfx.trumpet(); api.fxAt(...earPt(), ['🎵', '🎶'], 4, 'spark'); pose('laugh', 1500, 'hop'); line('shellHorn', 1); }),
  };

  R.crab = {
    press: () => sfx.tap(),
    tap: who((c) => {
      const a = begin('flee');
      api.setTemp('ok', 1800);
      go(awayFrom(c.el), 420);
      hold(a, 'scared', 1900);
      sfx.whoosh();
      line('crabRun', 0.9);
      at(a, 2000, end);
    }),
    double: (c) => {
      api.hop(c.el, 'crabdance', 2200);
      sfx.happy();
      setTimeout(() => sfx.happy(), 700);
      if (api.free()) { pose('laugh', 2200, 'dance', 2200); line('crabDance'); }
    },
    long: who((c) => {
      const a = begin('pinch');
      const tail = api.luckyPoint(0.78, 0.9);
      fly('🦀', [c.x, c.y], tail, 600, { size: 30, stay: 200 });
      at(a, 600, () => { sfx.boing(); pose('laugh', 1500, 'bigjump', 1100); api.floatFx(...tail, '💥', 'spark'); line('crabPinch', 1); });
      at(a, 900, () => fly('🦀', tail, [c.x, c.y], 700, { size: 30 }));
      at(a, 1700, end);
    }),
  };

  R.sea = {
    press: (c) => { sfx.splash(); api.floatFx(c.x, c.y, '💦', 'spark'); },
    tap: who(() => { api.fxAt(...feet(), ['💦', '💧'], 5, 'spark'); pose('laugh', 1200, 'hop'); line('splash', 0.8); }),
    double: who(() => {
      pose('laugh', 1800, 'paddle', 1800);
      [0, 500, 1000].forEach((d) => setTimeout(() => { api.fxAt(...feet(), ['💦'], 3, 'spark'); sfx.splash(); }, d));
      line('paddle');
    }),
    long: who(() => {
      const a = begin('wave'), [, fy] = feet(), w = sceneRect().width;
      fly('🌊', [w + 60, fy - 30], [-80, fy - 30], 1300, { size: 110 });
      at(a, 550, () => { sfx.splash(); line('wave', 1); getWet(a, 1800); });
      at(a, 3400, end);
    }),
  };

  R.pine = {
    press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['❄️'], 8, 'drop'); },
    tap: who(() => {
      const a = begin('snowcap');
      api.fxAt(...head(), ['❄️'], 6, 'drop');
      at(a, 400, () => { prop('snowcap', 3000); hold(a, 'shiver', 1200); line('snowHead', 0.8); });
      at(a, 2400, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); });
      at(a, 3400, end);
    }),
    double: (c) => {
      const [x, y] = topOf(c.el);
      popUp('⭐', x, y + 6, 3200, 30);
      sfx.chime();
      if (api.free()) { pose('happy', 1500, 'clap'); line('treeStar'); }
    },
    long: who((c) => hideGame(begin('hide'), c.el)),
  };

  R.snowman = {
    press: () => sfx.pop(),
    tap: who(() => { pose('happy', 1500, 'wave', 1200); line('snowmanHi', 0.8); }),
    double: who((c) => {
      const a = begin('snowball'), [x, y] = centerOf(c.el);
      pose('laugh', 1400, 'throw', 600);
      at(a, 200, () => { sfx.whoosh(); fly('⚪', paw(), [x, y], 600, { arc: 80, size: 22 }); });
      at(a, 800, () => { sfx.puff(); api.fxAt(x, y, ['❄️'], 6, 'spark'); api.hop(c.el, 'tapped'); line('snowball', 1); api.reward(); });
      at(a, 1500, end);
    }),
    long: who((c) => {
      const a = begin('tophat');
      fly('🎩', topOf(c.el), head(), 700, { arc: 60, size: 36, spin: 360 });
      at(a, 700, () => { prop('tophat', 9000); sfx.pop(); pose('happy', 1600, 'proud', 1200); line('tophat', 1); });
      at(a, 1800, end);
    }),
  };

  R.ice = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['✨', '❄️'], 5, 'spark'); },
    tap: who(() => {
      const a = begin('slide');
      go(Math.random() < 0.5 ? 32 : 68, 900);
      hold(a, 'skate', 1000);
      sfx.whoosh();
      api.setTemp('laugh', 1800);
      line('slide', 0.8);
      at(a, 1100, end);
    }),
    double: who(() => { pose('laugh', 1500, 'pirouette', 1500); sfx.magic(); line('spin'); }),
    long: who(() => {
      pose('ok', 700, 'slip', 1800);
      setTimeout(() => { sfx.bonk(); api.fxAt(...head(), ['💫'], 3, 'spark'); api.setTemp('laugh', 1400); line('slip', 1); }, 650);
    }),
  };

  R.planet = {
    press: (c) => { sfx.whirr(); api.fxAt(c.x, c.y, ['✨', '⭐'], 4, 'spark'); },
    tap: who(() => { pose('laugh', 3300, 'zeroG', 3500); sfx.magic(); line('zeroG', 0.8); }),
    double: who(() => { const a = begin('hula'); prop('ring', 4000); hold(a, 'hula', 4000); api.setTemp('laugh', 3000); sfx.whirr(); line('hula'); api.reward(); at(a, 4100, end); }),
    long: who(() => { prop('helmet', 10000); sfx.zip(); pose('happy', 1600, 'proud', 1200); line('helmet', 1); }),
  };

  R.star = {
    press: (c) => { sfx.note([988, 1175, 1319][Math.floor(Math.random() * 3)]); api.floatFx(c.x, c.y, '⭐', 'spark'); },
    tap: who(() => { api.setTemp('happy', 2500); api.fxAt(...head(), ['✨'], 4, 'spark'); sfx.chime(); line('wish', 0.7); }),
    double: who((c) => { fly('⭐', [c.x, c.y], head(), 700, { size: 28, spin: 360 }); setTimeout(() => { prop('star', 5000); sfx.sparkle(); line('starHead'); }, 700); }),
    long: who(() => {
      const w = sceneRect().width;
      fly('🌠', [-30, 60], [w + 30, 160], 1300, { size: 40 });
      sfx.magic();
      setTimeout(() => { api.setTemp('happy', 2500); line('wish', 1); }, 700);
    }),
  };

  R.crater = {
    press: (c) => { sfx.pop(); api.floatFx(c.x, c.y, '🪨', 'spark'); },
    tap: who(() => { pose('laugh', 2000, 'moonjump', 2100); sfx.boing(); line('moonJump', 0.8); }),
    double: (c) => {
      popUp('👽', c.x, c.y - 10, 2600, 40, 'pop-rise');
      sfx.magic();
      if (api.free()) { pose('happy', 1500, 'wave', 1200); line('alien'); }
    },
    long: who(() => { prop('cheese', 3500); api.setTemp('happy', 1800); sfx.pop(); line('moonCheese', 1); }),
  };

  R.sheep = {
    press: () => sfx.baa(),
    tap: who(() => { setTimeout(() => { sfx.baa(); pose('laugh', 1200, 'hop'); line('baa', 0.8); }, 650); }),
    double: who(() => {
      const a = begin('count'), [, hy] = head(), w = sceneRect().width;
      fly('🐑', [-30, hy + 60], [w + 30, hy + 60], 1300, { arc: 120, size: 44 });
      at(a, 900, () => fly('🐑', [-30, hy + 60], [w + 30, hy + 60], 1300, { arc: 120, size: 44 }));
      at(a, 1500, () => { api.setTemp('tired', 2200); sfx.yawn(); line('countSheep', 1); });
      at(a, 3200, end);
    }),
    long: who((c) => {
      const a = begin('fluffy');
      go(nextTo(c.el, 18), 700);
      at(a, 750, () => { pose('happy', 1600, 'hug'); api.hearts(...head(), 5); line('fluffy', 1); api.reward(); });
      at(a, 2300, end);
    }),
  };

  R.clover = {
    press: (c) => { sfx.pop(); api.floatFx(c.x, c.y, '☘️', 'fly-up'); },
    tap: who((c) => {
      fly('☘️', [c.x, c.y], mouth(), 500, { size: 22 });
      setTimeout(() => { prop('clover', 1800); api.setTemp('eat', 1800); sfx.crunch(); line('cloverEat', 0.7); api.reward(); }, 500);
    }),
    double: (c) => {
      popUp('🍀', c.x, c.y - 20, 2200, 44);
      sfx.chime();
      if (api.free()) { pose('laugh', 1400, 'binky'); line('fourLeaf', 1); api.reward(); }
    },
    long: who(() => { prop('crown', 15000); sfx.magic(); pose('happy', 1500, 'proud', 1200); line('cloverCrown', 1); }),
  };

  R.gold = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['🪙', '✨', '🪙'], 7, 'spark'); },
    tap: who(() => { prop('coins', 2400); sfx.jig(); pose('laugh', 1900, 'jig', 1900); line('jig', 0.8); api.reward(); }),
    double: who(() => { rainbow(); sfx.chime(); pose('happy', 1500, 'hop'); line('rainbowGold', 1); }),
    long: who((c) => {
      const a = begin('heavy');
      go(nextTo(c.el), 700);
      at(a, 750, () => { hold(a, 'strain', 1500); api.setTemp('sad', 1500); api.fxAt(...head(), ['💦'], 3, 'spark'); line('heavy', 1); });
      at(a, 2400, end);
    }),
  };

  R.castle = {
    press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['✨', '🏰'], 3, 'spark'); },
    tap: who(() => { sfx.trumpet(); pose('happy', 1400, 'hop'); line('knight', 0.8); }),
    double: who(() => { prop('shield', 4000); pose('happy', 1500, 'proud', 1200); line('sirLucky', 1); }),
    long: who((c) => { sfx.fanfare(); api.fxAt(c.x, c.y, ['🎺', '✨'], 5, 'spark'); pose('laugh', 1400, 'binky'); line('fanfare', 1); }),
  };

  R.pagoda = {
    press: (c) => { sfx.gong(); api.floatFx(c.x, c.y, '', 'ripple'); },
    tap: who(() => { pose('happy', 1600, 'bow', 1500); line('bow', 0.8); }),
    double: who(() => { sfx.whoosh(); pose('laugh', 1400, 'bigjump', 1100); line('ninjaJump'); }),
    long: who(() => {
      const a = begin('vanish');
      sfx.magic();
      hold(a, 'vanish');
      line('invisible', 1);
      a.onLuckyTap = () => found(a, 'vanish');
      at(a, 3200, () => { if (a.found) return; a.onLuckyTap = null; L.classList.remove('vanish'); sfx.pop(); api.fxAt(...head(), ['✨'], 5, 'spark'); line('back', 1, 0); at(a, 600, end); });
    }),
  };

  R.bamboo = {
    press: () => sfx.bubble(),
    tap: who(() => { pose('happy', 1300, 'sway', 1300); line('bambooSway', 0.8); }),
    double: who(() => { api.setTemp('eat', 1500); sfx.crunch(); line('bambooMunch'); }),
    long: who((c) => hideGame(begin('hide'), c.el)),
  };

  R.lamp = {
    press: (c) => { sfx.note(523); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
    tap: who(() => { const a = begin('glow'); hold(a, 'glow', 2600); api.setTemp('happy', 2000); line('lamp', 0.7); at(a, 2700, end); }),
    double: (c) => { api.hop(c.el, 'swingfast', 2000); sfx.chime(); },
    long: () => {
      ui.bg.querySelectorAll('[data-tap="lamp"]').forEach((x) => api.hop(x, 'lit', 4200));
      sfx.chime();
      if (api.free()) { const a = begin('festival'); hold(a, 'glow', 3000); api.setTemp('laugh', 2000); line('festival', 1); at(a, 3100, end); }
    },
  };

  // the animal cloud from the 'Sharp eyes' mission
  R.skypet = {
    press: (c) => { sfx.magic(); api.hop(c.el, 'wiggle', 800); },
    tap: who(() => { api.setTemp('happy', 1500); line('skyPet', 1, 20000); }),
  };

  // ---------- decorations (tapped outside Decorate mode); ⭐ marks the super ones ----------
  const D = {};
  const count = (n) => LUCKY.sensei.count[Math.min(20, Math.max(1, n)) - 1];

  // ⭐ ball: keepy-uppy. Every tap while the ball is up counts, Lucky counts out loud, best score is kept
  let keepy = null;
  function keepyEnd() {
    const n = keepy?.n || 0;
    keepy = null;
    if (!api.free() || !n) return;
    const best = n >= 3 && api.record('keepy', n);
    if (n >= 3) api.reward();
    if (best) { sfx.levelup(); pose('laugh', 1500, 'binky'); api.toast(`⚽ ${n}! 🏆`); line('keepyRecord', 1, 0); }
    else line(n <= 2 ? 'keepy1' : n <= 5 ? 'keepy2' : 'keepy3', 1, 0);
  }
  D.ball = {
    press: (c) => {
      sfx.squeak();
      api.hop(c.el, 'juggle', 1200);
      const n = keepy && keepy.el === c.el ? keepy.n + 1 : 1;
      clearTimeout(keepy?.timer);
      keepy = { n, el: c.el, timer: setTimeout(keepyEnd, 1350) };
      if (api.free()) { api.say([count(n)]); pose('laugh', 800, 'hop'); }
    },
    long: who(() => { const a = begin('balance'); prop('ball', 3600); hold(a, 'balance', 3600); api.setTemp('laugh', 3000); line('ballNose', 1); at(a, 3700, end); }),
  };
  D.bowl = {
    press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); },
    tap: who((c) => {
      const a = begin('hay');
      go(nextTo(c.el), 650);
      at(a, 700, () => { prop('hay', 1800); api.setTemp('eat', 1800); sfx.crunch(); line('hay', 0.9); api.reward(); });
      at(a, 2600, end);
    }),
  };

  // ⭐ house: hide and seek, peekaboo in the window or a quick tidy-up; a knock-knock joke; a nap
  const peek = who((c) => {
    const a = begin('peek');
    go(clamp(pct(centerOf(c.el)[0]), 26, 74), 800);
    at(a, 800, () => { hold(a, 'intohouse'); sfx.knock(); });
    at(a, 1500, () => { const [x, y] = centerOf(c.el); popUp('👀', x, y - 4, 1700, 30); line('peekaboo', 1, 0); });
    at(a, 3300, () => { L.classList.remove('intohouse'); a.cls.delete('intohouse'); sfx.boing(); pose('laugh', 1200, 'hop'); at(a, 900, end); });
  });
  const tidy = who((c) => {
    const a = begin('tidy');
    go(nextTo(c.el), 700);
    at(a, 750, () => { popUp('🧹', ...paw(), 2300, 36); hold(a, 'sway', 1300); sfx.shake(); line('tidy', 1); api.reward(); });
    [900, 1400, 1900, 2400].forEach((d) => at(a, d, () => api.fxAt(...feet(), ['💨', '✨'], 2, 'spark')));
    at(a, 3100, end);
  });
  const hideIn = (lineKey, sound) => who((c) => {
    const a = begin('house');
    go(clamp(pct(centerOf(c.el)[0]), 26, 74), 800);
    at(a, 800, () => { hold(a, 'intohouse'); sound?.(); a.onLuckyTap = () => found(a, 'intohouse'); });
    at(a, 3000, () => { if (a.found) return; a.onLuckyTap = null; L.classList.remove('intohouse'); sfx.boing(); pose('laugh', 1400, 'hop'); line(lineKey, 1); at(a, 1000, end); });
  });
  const houseGames = [hideIn('home', () => sfx.knock()), peek, tidy];
  let lastHouse = -1;
  D.hutch = {
    press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); },
    tap: (c) => { let i; do { i = Math.floor(Math.random() * houseGames.length); } while (i === lastHouse); lastHouse = i; houseGames[i](c); },
    double: (c) => { sfx.knock(); api.hop(c.el, 'wiggle'); if (api.free()) line('knockJoke', 1, 25000); },
    long: who((c) => {
      const a = begin('nap');
      go(clamp(pct(centerOf(c.el)[0]), 26, 74), 800);
      at(a, 800, () => { hold(a, 'intohouse'); line('hutchNap', 1); sfx.yawn(); });
      [1400, 2200, 3000].forEach((d) => at(a, d, () => api.floatFx(...topOf(c.el), '💤', 'spark')));
      at(a, 4200, () => { L.classList.remove('intohouse'); api.boost('energy', 2); pose('happy', 1200, 'hop'); at(a, 800, end); });
    }),
  };

  // ⭐ tent: hide inside, a ghost story, marshmallows on a campfire
  D.tent = {
    press: D.hutch.press,
    tap: hideIn('camping', () => sfx.zip()),
    double: who((c) => {
      const a = begin('ghost');
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { pose('happy', 2000, 'listen', 2000); line('ghostStory', 1, 0); });
      at(a, 2500, () => { const [x, y] = topOf(c.el); popUp('👻', x, y + 14, 1600, 46, 'pop-rise'); sfx.boing(); pose('ok', 900, 'startle', 1100); });
      at(a, 4000, end);
    }),
    long: who((c) => {
      const a = begin('camp');
      go(nextTo(c.el, 18), 700);
      at(a, 750, () => {
        const [tx] = centerOf(c.el), [lx, gy] = api.luckyPoint(0.5, 0.94);
        popUp('🔥', (tx + lx) / 2, gy - 18, 3600, 42);
        sfx.crackle();
        prop('marsh', 3000);
        api.setTemp('happy', 1500);
      });
      at(a, 1900, () => sfx.crackle());
      at(a, 2500, () => { api.setTemp('eat', 1600); sfx.crunch(); line('marshmallow', 1); api.reward(); });
      at(a, 4300, end);
    }),
  };
  D.igloo = { press: D.hutch.press, tap: hideIn('igloo', () => sfx.whoosh()) };
  D.lantern = {
    press: (c) => { sfx.note(392); api.hop(c.el, 'swingfast'); },
    tap: R.lamp.tap,
    long: who(() => { const a = begin('glow'); hold(a, 'glow', 3000); sfx.chime(); api.setTemp('laugh', 2000); line('festival', 1); at(a, 3100, end); }),
  };

  // ⭐ snowman: a snowball fight. Lucky throws, the snowman throws back; three hits make him wobble
  let snowHits = 0, snowHitAt = 0;
  D.snowman = {
    press: () => sfx.pop(),
    tap: who((c) => {
      const a = begin('snowball'), [x, y] = centerOf(c.el);
      pose('laugh', 1400, 'throw', 600);
      at(a, 200, () => { sfx.whoosh(); fly('⚪', paw(), [x, y], 600, { arc: 80, size: 22 }); });
      at(a, 800, () => {
        sfx.puff();
        api.fxAt(x, y, ['❄️'], 6, 'spark');
        const now = Date.now();
        snowHits = now - snowHitAt < 8000 ? snowHits + 1 : 1;
        snowHitAt = now;
        if (snowHits >= 3) { snowHits = 0; api.hop(c.el, 'wobble', 1500); line('snowmanWobble', 1, 0); }
        else { api.hop(c.el, 'tapped'); line('snowball', 0.8); }
        api.reward();
      });
      at(a, 1500, end);
    }),
    double: who((c) => {
      const a = begin('snowballBack'), [x, y] = topOf(c.el);
      api.hop(c.el, 'throw', 600);
      at(a, 250, () => { sfx.whoosh(); fly('⚪', [x, y + 20], head(), 650, { arc: 80, size: 24 }); });
      at(a, 900, () => { sfx.puff(); prop('snowcap', 2600); api.fxAt(...head(), ['❄️'], 6, 'spark'); pose('sad', 1300, 'shiver', 1300); line('snowballBack', 1); });
      at(a, 2600, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); api.setTemp('laugh', 1200); });
      at(a, 3700, end);
    }),
    long: R.snowman.long,
  };

  // ⭐ rocket: countdown and launch, it comes back with a souvenir; fireworks; a trip to the moon for Lucky
  D.rocket = {
    press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); },
    tap: (c) => {
      [0, 700, 1400].forEach((d) => setTimeout(() => sfx.beep(false), d));
      setTimeout(() => { sfx.beep(true); sfx.launch(); api.hop(c.el, 'launch', 3600); }, 2100);
      if (api.free()) line('countdown', 1, 15000);
      setTimeout(() => {
        const [x, y] = topOf(c.el);
        popUp(['🌙', '⭐', '🪐', '☄️', '👽', '🧀', '🌟', '🛰️'][Math.floor(Math.random() * 8)], x, y - 6, 2400, 38, 'pop-rise');
        sfx.sparkle();
        if (api.free()) { pose('laugh', 1400, 'clap'); line('rocketGift', 0.9, 20000); }
      }, 5600);
    },
    double: (c) => {
      api.hop(c.el, 'wiggle');
      sfx.launch();
      const w = sceneRect().width, h = sceneRect().height;
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const x = w * (0.15 + Math.random() * 0.7), y = h * (0.1 + Math.random() * 0.25);
          popUp(i % 2 ? '🎆' : '🎇', x, y, 1300, 56);
          api.fxAt(x, y, ['✨', '💫', '⭐'], 5, 'spark');
          sfx.pop();
        }, 500 + i * 380);
      }
      if (api.free()) { pose('laugh', 2400, 'clap'); line('fireworks', 0.9); }
    },
    long: who((c) => {
      const a = begin('moon');
      go(nextTo(c.el, 14), 700);
      at(a, 800, () => line('moonTrip', 1));
      [900, 1500, 2100].forEach((d) => at(a, d, () => sfx.beep(false)));
      at(a, 2700, () => { sfx.beep(true); sfx.launch(); api.hop(c.el, 'launch', 3600); hold(a, 'blastoff'); });
      at(a, 6200, () => { L.classList.remove('blastoff'); pose('laugh', 1500, 'land', 900); line('moonBack', 1); api.reward(); });
      at(a, 7200, end);
    }),
  };
  D.castle = {
    press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); },
    tap: who(() => { sfx.fanfare(); pose('happy', 1500, 'proud', 1200); line('myCastle', 0.9); }),
  };

  // ⭐ pond: the frog peeks out, jumps onto Lucky's head; fishing with a surprise catch
  const CATCH = [['🐟', 'fishFish'], ['👢', 'fishBoot'], ['🦆', 'fishDuck'], ['💎', 'fishGem'], ['🧦', 'fishSock']];
  let lastCatch = '';
  D.pond = {
    press: (c) => { sfx.splash(); api.floatFx(c.x, c.y, '', 'ripple'); },
    tap: (c) => { popUp('🐸', c.x, c.y - 16, 1800, 30, 'pop-rise'); sfx.croak(); if (api.free()) line('pond', 0.8); },
    double: who((c) => {
      const a = begin('frogHead'), [x, y] = centerOf(c.el), top = api.luckyPoint(0.5, 0.04);
      fly('🐸', [x, y], top, 700, { arc: 90, size: 30, stay: 2300 });
      sfx.croak();
      at(a, 700, () => { api.setTemp('ok', 2200); api.hop(L, 'squash', 700); line('frogHead', 1); });
      at(a, 1800, () => sfx.croak());
      at(a, 3000, () => fly('🐸', top, [x, y], 700, { arc: 90, size: 30 }));
      at(a, 3300, end);
    }),
    long: who((c) => {
      const a = begin('fishing'), [x, y] = centerOf(c.el);
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { prop('rod', 4300); api.setTemp('happy', 1800); line('fishStart', 1, 0); });
      at(a, 1200, () => popUp('🔴', x, y, 1500, 14, 'bobber'));
      at(a, 2700, () => {
        let pickIt;
        do { pickIt = CATCH[Math.floor(Math.random() * CATCH.length)]; } while (pickIt[0] === lastCatch);
        lastCatch = pickIt[0];
        sfx.splash();
        api.fxAt(x, y, ['💦'], 4, 'spark');
        popUp(pickIt[0], x, y - 24, 2200, 42, 'pop-rise');
        pose('laugh', 1800, 'bigjump', 1100);
        line(pickIt[1], 1, 0);
        if (pickIt[0] === '💎') api.reward();
      });
      at(a, 4900, end);
    }),
  };

  // emoji stickers placed in Decorate: some behave like the real thing
  const EMOJI = {
    '🌷': 'flower', '🌼': 'flower', '🪷': 'flower', '🌸': 'flower', '🌻': 'flower', '🦀': 'crab', '🐑': 'sheep', '🍭': 'lolly', '🍬': 'lolly', '🧁': 'lolly',
    '🐚': 'shell', '☃️': 'snowman', '🌲': 'pine', '🎄': 'pine', '🪐': 'planet', '🌟': 'star', '⭐': 'star', '☘️': 'clover', '🍀': 'clover',
    '🏮': 'lamp', '🎋': 'bamboo', '🌴': 'palm', '❄️': 'pine', '🏯': 'pagoda', '⛩️': 'pagoda', '🍓': 'lolly', '🍩': 'lolly', '🍪': 'lolly', '🎂': 'lolly', '🍦': 'lolly',
  };
  const say1 = (key, sound) => ({ press: (c) => { sound(); api.hop(c.el, 'wiggle'); }, tap: who(() => { pose('happy', 1400, 'hop'); line(key, 0.9); }) });

  // ⭐ fairy's wishes: something different every time
  const W0 = () => sceneRect().width, H0 = () => sceneRect().height;
  const rainOf = (list, n, size = 24) => { for (let i = 0; i < n; i++) setTimeout(() => { const x = 20 + Math.random() * (W0() - 40); fly(list[i % list.length], [x, -30], [x + 30, H0() * 0.9], 1300, { spin: 300, size }); }, i * 120); };
  const WISHES = [
    () => { rainbow(); pose('happy', 1500, 'binky'); },
    () => { rainOf(['⭐', '🌟', '✨'], 14); pose('laugh', 1500, 'hop'); },
    () => { prop('crown', 8000); prop('flower', 8000); pose('happy', 1500, 'proud', 1200); },
    () => { rainOf(['🥕'], 10, 28); setTimeout(() => { api.setTemp('eat', 1600); sfx.crunch(); }, 1400); },
    () => { rainOf(['❄️'], 14); prop('snowcap', 3000); pose('laugh', 1500, 'shiver', 1400); },
    () => { rainOf(['💖', '💗', '💕'], 12); api.hearts(...head(), 6); pose('happy', 1500, 'hug'); },
  ];
  let lastWish = -1;

  const E = {
    '🧚': {
      press: (c) => { sfx.magic(); api.fxAt(c.x, c.y, ['✨', '💫'], 6, 'spark'); },
      tap: who(() => { api.setTemp('happy', 2000); line('fairy', 0.9); }),
      double: who(() => {
        const a = begin('tiny');
        sfx.magic();
        api.fxAt(...head(), ['✨', '💫'], 8, 'spark');
        hold(a, 'tiny');
        line('tiny', 1);
        at(a, 2900, () => { L.classList.remove('tiny'); a.cls.delete('tiny'); sfx.boing(); api.fxAt(...head(), ['✨'], 5, 'spark'); });
        at(a, 3500, end);
      }),
      long: who((c) => {
        let i;
        do { i = Math.floor(Math.random() * WISHES.length); } while (i === lastWish);
        lastWish = i;
        api.fxAt(c.x, c.y, ['✨', '💫'], 10, 'spark');
        sfx.chime();
        setTimeout(() => { if (!api.free()) return; WISHES[i](); line('fairyWish', 1, 0); api.reward(); }, 600);
      }),
    },
    '🛷': { press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); }, tap: R.ice.tap },
    '🍄': say1('mushroom', () => sfx.pop()),
    // ⭐ balloon: Lucky jumps for it; it pops and grows back; hold it and he floats away, then comes down on his umbrella
    '🎈': {
      press: (c) => { sfx.pop(); api.hop(c.el, 'floaty', 2400); },
      tap: who(() => { pose('laugh', 1200, 'bigjump', 1100); line('balloon', 0.9); }),
      double: (c) => {
        sfx.bonk();
        api.fxAt(c.x, c.y, ['🎉', '🎊', '✨'], 9, 'spark');
        c.el.classList.add('popped');
        setTimeout(() => { c.el.classList.remove('popped'); api.hop(c.el, 'regrow', 900); sfx.pop(); }, 1800);
        if (api.free()) { pose('ok', 900, 'startle', 1100); line('balloonPop', 1); }
      },
      long: who((c) => {
        const a = begin('balloonRide');
        go(nextTo(c.el, 12), 600);
        at(a, 650, () => { c.el.classList.add('popped'); prop('balloonUp', 5200); hold(a, 'balloonfly'); api.setTemp('laugh', 2000); line('balloonFly', 1); sfx.whoosh(); });
        at(a, 2800, () => {
          unprop('hand', true);
          sfx.bonk();
          api.fxAt(...head(), ['💥', '✨'], 4, 'spark');
          prop('umbrella', 3000);
          L.classList.remove('balloonfly');
          a.cls.delete('balloonfly');
          hold(a, 'parachute', 2700);
          api.setTemp('ok', 1500);
          line('parachute', 1);
        });
        at(a, 5600, () => { c.el.classList.remove('popped'); api.hop(c.el, 'regrow', 900); api.reward(); end(); });
      }),
    },
    '👽': { press: (c) => { sfx.magic(); api.hop(c.el, 'wiggle'); }, tap: who(() => { pose('happy', 1500, 'wave', 1200); line('alien', 0.9); }) },
    // ⭐ UFO: it beeps, an alien waves; hold it and the tractor beam lifts Lucky up
    '🛸': {
      press: (c) => { sfx.whirr(); api.hop(c.el, 'hover', 1600); },
      tap: who(() => { sfx.beep(false); setTimeout(() => sfx.beep(true), 220); pose('ok', 1200, 'startle', 1100); line('alien', 0.8); }),
      double: (c) => { popUp('👽', c.x, c.y - 30, 2200, 34, 'pop-rise'); sfx.magic(); if (api.free()) pose('happy', 1500, 'wave', 1200); },
      long: who((c) => {
        const a = begin('beam'), [ux, uy] = centerOf(c.el);
        go(clamp(pct(ux), 26, 74), 700);
        at(a, 750, () => {
          const beam = document.createElement('div');
          beam.className = 'beam';
          beam.style.left = ux + 'px';
          beam.style.top = uy + 'px';
          beam.style.height = Math.max(60, api.luckyPoint(0.5, 0.98)[1] - uy) + 'px';
          ui.fx.appendChild(beam);
          setTimeout(() => beam.remove(), 3300);
          sfx.whirr();
          hold(a, 'beamup');
          api.setTemp('ok', 2000);
          line('beamUp', 1);
        });
        at(a, 3300, () => { L.classList.remove('beamup'); a.cls.delete('beamup'); pose('laugh', 1500, 'land', 900); line('beamDown', 1); api.reward(); });
        at(a, 4300, end);
      }),
    },
    '🎐': { press: (c) => { sfx.chime(); api.hop(c.el, 'wiggle'); }, tap: () => {} },
  };

  function forDecor(it) {
    if (it.k === 'decor') return D[it.id] || { press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); } };
    const base = E[it.id] || R[EMOJI[it.id]];
    const fallback = { press: (c) => { sfx.tap(); api.hop(c.el, 'wiggle'); }, tap: who(() => line('sticker', 0.3, 30000)) };
    if (!base) return fallback;
    // a sticker wiggles instead of the scene animation
    return { ...base, press: (c) => { base.press?.(c); api.hop(c.el, 'wiggle'); } };
  }

  // ---------- reactions to Tali's jokes: [ms until Lucky can comment, what he does] ----------
  const sideOf = () => sceneRect().width + 30;
  const JOKE_DO = {
    laugh: [1500, () => { pose('laugh', 1800, 'roll', 1500); }],
    dizzy: [1600, () => { prop('dizzy', 2600); pose('tired', 2000, 'squash', 700); sfx.bonk(); }],
    sleepy: [1900, () => { api.setTemp('sleep', 2000); sfx.yawn(); api.fxAt(...head(), ['💤'], 3, 'spark'); }],
    specs: [1500, () => { prop('specs', 5000); pose('happy', 1600, 'listen', 1600); }],
    shades: [1300, () => { prop('shades', 6000); pose('happy', 1500, 'proud', 1200); }],
    helmet: [1300, () => { prop('helmet', 7000); sfx.zip(); pose('happy', 1500, 'proud', 1200); }],
    heli: [2300, () => { sfx.whirr(); pose('laugh', 2400, 'heli'); }],
    float: [2800, () => { sfx.magic(); pose('laugh', 3300, 'zeroG', 3500); }],
    binky: [1200, () => { sfx.sparkle(); pose('laugh', 1400, 'binky'); api.fxAt(...head(), ['✨'], 4, 'spark'); }],
    bigjump: [1200, () => { sfx.boing(); pose('laugh', 1400, 'bigjump', 1100); }],
    shake: [1300, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); spray(...api.luckyPoint(0.5, 0.45), ['✨', '💫']); }],
    wet: [2600, () => { const a = begin('jokeWet'); api.fxAt(...head(), ['💧'], 8, 'drop'); sfx.rain(); getWet(a, 1700); at(a, 2800, end); }],
    eat: [1500, () => { const [x, y] = api.luckyPoint(1.1, 0.2); fly('🥕', [x, y], mouth(), 500, { spin: 200, size: 28 }); setTimeout(() => { api.setTemp('eat', 1600); sfx.crunch(); }, 500); }],
    lolly: [1300, () => { prop('lolly', 4000); api.setTemp('eat', 1500); sfx.lick(); }],
    cheese: [1300, () => { prop('cheese', 3500); api.setTemp('laugh', 1500); sfx.pop(); }],
    coins: [1900, () => { prop('coins', 2400); sfx.jig(); pose(null, 0, 'jig', 1900); }],
    coconut: [1400, () => { prop('coconut', 3500); api.setTemp('eat', 1500); sfx.slurp(); }],
    pearl: [1300, () => { prop('pearl', 3500); sfx.chime(); api.fxAt(...paw(), ['✨'], 4, 'spark'); }],
    clover: [1300, () => { prop('crown', 8000); sfx.magic(); pose('happy', 1500, 'proud', 1200); }],
    flower: [1200, () => { prop('flower', 20000); sfx.sparkle(); api.setTemp('happy', 1500); }],
    butterfly: [2300, () => { prop('butterfly', 2300); api.setTemp('laugh', 2200); setTimeout(() => { unprop('nose', true); fly('🦋', nose(), [sideOf(), 40], 1100, { arc: 60, size: 28 }); }, 2200); }],
    crown: [1300, () => { prop('crown', 6000); pose('happy', 1500, 'proud', 1200); }],
    umbrella: [1500, () => { const [hx, hy] = head(); prop('umbrella', 4500); api.fxAt(hx, hy - 70, ['💧'], 8, 'drop'); sfx.rain(); api.setTemp('happy', 1600); }],
    shiver: [1600, () => { prop('snowcap', 3000); api.hop(L, 'shiver', 1500); sfx.bubble(); }],
    hide: [2400, () => { const a = begin('jokeHide'); hold(a, 'hiding'); at(a, 1600, () => { L.classList.remove('hiding'); a.cls.delete('hiding'); sfx.boing(); pose('laugh', 1200, 'hop'); }); at(a, 2400, end); }],
    vanish: [2500, () => { const a = begin('jokeVanish'); sfx.magic(); hold(a, 'vanish'); at(a, 1800, () => { L.classList.remove('vanish'); a.cls.delete('vanish'); sfx.pop(); api.fxAt(...head(), ['✨'], 5, 'spark'); }); at(a, 2500, end); }],
    startle: [1200, () => { pose('ok', 1000, 'startle', 1100); api.hop(L, 'hop'); }],
    chase: [2100, () => { pose('laugh', 2200, 'chase', 2100); }],
    hug: [1300, () => { sfx.happy(); pose('happy', 1500, 'hug'); api.hearts(...head(), 5); }],
    bow: [1500, () => { pose('happy', 1600, 'bow', 1500); }],
    wave: [1400, () => { pose('happy', 1500, 'wave', 1200); api.fxAt(...feet(), ['💦'], 3, 'spark'); sfx.splash(); }],
    climb: [1800, () => { pose('laugh', 1800, 'climb', 1800); }],
    clap: [1100, () => { pose('laugh', 1200, 'clap'); sfx.pop(); setTimeout(() => sfx.pop(), 300); }],
    proud: [1300, () => { pose('happy', 1500, 'proud', 1200); api.fxAt(...head(), ['✨'], 3, 'spark'); }],
    music: [2200, () => { pose('laugh', 2200, 'dance', 2200); api.fxAt(...head(), ['🎵', '🎶'], 5, 'spark'); sfx.trumpet(); }],
    rainbow: [1600, () => { rainbow(); sfx.magic(); pose('happy', 1500, 'hop'); }],
    sneeze: [1400, () => { api.setTemp('sleep', 400); setTimeout(() => { sfx.sneeze(); pose('laugh', 1200, 'sneeze'); api.fxAt(...nose(), ['💨', '✨'], 4, 'spark'); }, 400); }],
    sniff: [1500, () => { pose('happy', 1500, 'sniff', 1500); sfx.sniff(); }],
    slip: [1900, () => { pose('ok', 700, 'slip', 1800); setTimeout(() => { sfx.bonk(); api.setTemp('laugh', 1200); }, 650); }],
    spin: [1600, () => { pose('laugh', 1500, 'pirouette', 1500); sfx.magic(); }],
  };

  // ---------- idioms acted out literally: [ms the scene takes, what happens] ----------
  const W = () => sceneRect().width;
  const ground = () => api.luckyPoint(0.5, 0.97)[1];
  const IDIOM_SHOW = {
    catsDogs: [2700, () => {
      prop('umbrella', 3200);
      pose('ok', 1500, 'startle', 1100);
      for (let i = 0; i < 12; i++) setTimeout(() => { const x = 20 + Math.random() * (W() - 40); fly(i % 2 ? '🐶' : '🐱', [x, -30], [x + 20, ground()], 900, { spin: 180, size: 30 }); }, i * 150);
      sfx.rain();
    }],
    butterflies: [2300, () => {
      pose('ok', 2000, 'drum', 1000);
      const [x, y] = api.luckyPoint(0.5, 0.75);
      for (let i = 0; i < 6; i++) setTimeout(() => fly('🦋', [x, y], [x + (Math.random() * 240 - 120), y - 180 - Math.random() * 80], 1300, { arc: 40, size: 26 }), i * 170);
      sfx.magic();
    }],
    horses: [2400, () => {
      pose('ok', 2000, 'strain', 1800);
      sfx.gallop();
      for (let i = 0; i < 3; i++) setTimeout(() => fly('🐎', [W() + 60, ground() - 30 - i * 14], [-80, ground() - 30 - i * 14], 1300, { size: 58 }), i * 280);
    }],
    cake: [1900, () => {
      const at0 = api.luckyPoint(1.0, 0.8);
      popUp('🍰', ...at0, 900, 40);
      setTimeout(() => { fly('🍰', at0, mouth(), 450, { size: 32 }); }, 700);
      setTimeout(() => { api.setTemp('eat', 1400); sfx.crunch(); }, 1150);
    }],
    allEars: [1900, () => { pose('happy', 1900, 'bigears', 1900); api.fxAt(...earPt(), ['👂', '✨'], 4, 'spark'); sfx.boing(); }],
    moon: [2300, () => { popUp('🌙', W() / 2, sceneRect().height * 0.22, 2300, 64); sfx.magic(); pose('laugh', 2100, 'moonjump', 2100); }],
    bananas: [2400, () => {
      pose('laugh', 2400, 'zoom', 2300);
      const [x, y] = head();
      for (let i = 0; i < 8; i++) setTimeout(() => fly('🍌', [x, y], [Math.random() * W(), Math.random() * sceneRect().height * 0.6], 800, { spin: 360, size: 28 }), i * 120);
      sfx.whoosh();
    }],
    weather: [2600, () => {
      const [hx, hy] = head();
      fly('☁️', [hx + 120, hy - 90], [hx, hy - 55], 600, { size: 56, stay: 2000, cls: 'rain-cloud' });
      setTimeout(() => { api.fxAt(hx, hy - 35, ['💧'], 8, 'drop'); sfx.rain(); }, 600);
      pose('sad', 2600, 'shiver', 1600);
    }],
    hay: [2400, () => {
      popUp('🌾', ...api.luckyPoint(0.5, 0.92), 2400, 90);
      pose('laugh', 900, 'bigjump', 1100);
      setTimeout(() => { api.setTemp('sleep', 1300); sfx.yawn(); api.fxAt(...head(), ['💤'], 3, 'spark'); }, 1100);
    }],
    log: [2200, () => {
      popUp('🪵', ...api.luckyPoint(0.95, 0.9), 2200, 60);
      api.setTemp('sleep', 1500);
      api.fxAt(...head(), ['💤', '💤'], 3, 'spark');
      setTimeout(() => { sfx.yawn(); pose('happy', 800, 'hop'); }, 1500);
    }],
    earlyBird: [2700, () => {
      const [gx, gy] = api.luckyPoint(1.15, 0.97);
      popUp('🪱', gx, gy - 8, 1500, 26, 'pop-rise');
      fly('🐦', [-40, 60], [gx, gy - 30], 1000, { arc: 30, size: 34, stay: 400 });
      setTimeout(() => fly('🐦', [gx, gy - 30], [W() + 40, 30], 1100, { arc: 60, size: 34 }), 1400);
      pose('ok', 2000, 'listen', 2000);
      setTimeout(() => sfx.chime(), 1000);
    }],
    fish: [2200, () => {
      popUp('🐟', ...api.luckyPoint(1.1, 0.95), 2200, 40, 'flop');
      api.fxAt(...api.luckyPoint(1.1, 0.95), ['💦'], 4, 'spark');
      sfx.splash();
      pose('ok', 1500, 'startle', 1100);
    }],
    catBag: [2100, () => {
      const at0 = api.luckyPoint(0.95, 0.82);
      popUp('👜', ...at0, 1800, 44);
      setTimeout(() => { fly('🐱', at0, [at0[0] + 90, at0[1] - 140], 800, { arc: 80, size: 34 }); sfx.pop(); }, 600);
      pose('ok', 1600, 'startle', 1100);
    }],
    littleBird: [2500, () => {
      const [ex, ey] = earPt();
      fly('🐦', [-40, ey - 60], [ex - 10, ey - 18], 900, { arc: 40, size: 30, stay: 1100 });
      setTimeout(() => fly('🐦', [ex - 10, ey - 18], [-40, 30], 900, { arc: 50, size: 30 }), 2000);
      setTimeout(() => sfx.chime(), 900);
      pose('happy', 2300, 'listen', 2300);
    }],
    bee: [2300, () => {
      sfx.buzz();
      const [x, y] = api.luckyPoint(0.5, 0.4);
      [[-1, -0.6], [1, -0.2], [-1, 0.3]].forEach(([d, dy], i) => setTimeout(() => fly('🐝', [x - d * 160, y + dy * 100], [x + d * 180, y - dy * 80], 1100, { arc: 60, size: 26 }), i * 350));
      pose('laugh', 1900, 'jig', 1900);
    }],
    cucumber: [2100, () => { prop('cukes', 3500); api.setTemp('happy', 2100); hold2('bask', 2100); sfx.chime(); }],
    couchPotato: [2600, () => {
      popUp('🛋️', ...api.luckyPoint(-0.05, 0.85), 2600, 70);
      popUp('🥔', ...api.luckyPoint(-0.05, 0.72), 2400, 34);
      api.setTemp('tired', 1400);
      hold2('bask', 1300);
      setTimeout(() => { sfx.boing(); pose('laugh', 1200, 'bigjump', 1100); }, 1400);
    }],
    pigs: [2500, () => { fly('🐷', [-50, 120], [W() + 50, 70], 2000, { arc: 70, size: 48 }); sfx.magic(); pose('laugh', 2000, 'binky'); }],
    frogThroat: [1900, () => {
      pose('ok', 900, 'squash', 700);
      sfx.croak();
      fly('🐸', mouth(), [mouth()[0] + 110, ground() - 10], 800, { arc: 70, size: 30, stay: 700 });
    }],
    biteOff: [2300, () => {
      const at0 = api.luckyPoint(1.15, 0.5);
      fly('🥕', [at0[0] + 60, at0[1] - 40], mouth(), 600, { size: 90 });
      setTimeout(() => { api.setTemp('eat', 1600); sfx.crunch(); hold2('strain', 1400); }, 600);
      setTimeout(() => sfx.crunch(), 1200);
    }],
    blueMoon: [2300, () => { popUp('🌕', W() / 2, sceneRect().height * 0.22, 2300, 64, 'pop-stay blue-moon'); sfx.magic(); pose('happy', 1800, 'proud', 1200); }],
    clouds: [2600, () => {
      const [hx, hy] = head();
      [[-70, -20], [0, -55], [70, -20]].forEach(([dx, dy], i) => fly('☁️', [hx + dx * 3, hy + dy - 60], [hx + dx, hy + dy], 700, { size: 44, stay: 1500 - i * 100, cls: 'rain-cloud' }));
      api.setTemp('sleep', 1700);
      hold2('levitate', 1700);
      setTimeout(() => { sfx.boing(); pose('ok', 900, 'startle', 1000); }, 1800);
    }],
  };
  // a pose class for a while, outside a scene
  function hold2(cls, ms) { L.classList.add(cls); setTimeout(() => L.classList.remove(cls), ms); }

  // ---------- wiring ----------
  function run(table, kind, el, p) {
    const fn = table?.[kind];
    if (!fn || !api.ok()) return;
    const [x, y] = api.sceneXY(p);
    if (kind === 'press' && el.matches('[data-tap]')) api.hop(el, 'tapped');
    fn({ el, x, y, p });
  }

  gestures(ui.bg, (t) => t.closest('[data-tap]') || t.closest('.sky-pet'), (kind, el, p) => {
    const id = el.classList.contains('sky-pet') ? 'skypet' : el.dataset.tap;
    run(R[id], kind, el, p);
  });

  return {
    // a tap on Lucky while he hides: 'You found me!' (true if handled)
    luckyTap: () => !!act?.onLuckyTap?.(),
    // decorations: main.js passes the layout item
    decor: (kind, el, it, p) => run(forDecor(it), kind, el, p),
    line, prop, unprop, setSticky, clearProps, fly, popUp, spray, end,
    busy: () => !!act,
    // Tali's joke: Lucky listens to the question, then laughs and does something that fits.
    // Returns how long to wait before Lucky's comment (0 when he can't take part right now).
    think() {
      if (!api.free()) return;
      pose('ok', 1800, 'listen', 1700);
      popUp('🤔', ...api.luckyPoint(0.82, 0.02), 1600, 30);
    },
    // an idiom scene; returns how long it takes (0 if Lucky can't take part now)
    idiomShow(key) {
      if (!api.free()) return 0;
      end();
      const [ms, fn] = IDIOM_SHOW[key] || [0, () => {}];
      fn();
      return ms;
    },
    // tongue twisters: careful when slow, bouncy when fast, zooming when super fast
    twistPose(speed) {
      if (!api.free()) return;
      if (speed < 1) pose('happy', 2500, 'listen', 2500);
      else if (speed < 1.5) pose('laugh', 1500, 'hop');
      else pose('laugh', 2000, 'dance', 2000);
    },
    laughAt(name) {
      if (!api.free()) return 0;
      end();
      sfx.happy();
      pose('laugh', 1200, 'lol', 1000);
      api.fxAt(...head(), ['😂', '🤣'], 3, 'spark');
      const [ms, fn] = JOKE_DO[name] || JOKE_DO.laugh;
      setTimeout(() => { if (api.free()) fn(); }, 800);
      return 800 + ms;
    },
    // the frog's riddle: Lucky thinks in his reading glasses
    thinking(on) {
      if (on) { prop('specs', Infinity); L.classList.add('think'); }
      else { L.classList.remove('think'); if (worn.eyes?.id === 'specs') unprop('eyes'); }
    },
    // A caught visitor: what happens depends on who it is (and for butterflies, on luck). x, y: where it was caught.
    visitor(kind, x, y) {
      if (!api.free()) return false;
      const a = begin('visitor'), w = sceneRect().width, off = [w + 40, 30];
      const away = (e, from, ms = 1100) => fly(e, from, off, ms, { arc: 60, size: 28 });
      const V = {
        nose: () => {
          prop('net', 1300);
          sfx.whoosh();
          api.hop(L, 'hop');
          at(a, 500, () => { prop('butterfly', 2600); api.setTemp('laugh', 2500); line('noseFly', 0.9, 20000); });
          at(a, 3000, () => { unprop('nose', true); away('🦋', nose()); });
        },
        ear: () => {
          fly('🦋', [x, y], earPt(), 700, { arc: 40, size: 26, stay: 2200 });
          at(a, 700, () => { pose('happy', 2100, 'listen', 2100); line('earFly', 1, 0); });
          at(a, 2900, () => away('🦋', earPt()));
        },
        circle: () => {
          const [hx, hy] = head(), pts = [[hx - 90, hy + 10], [hx, hy - 60], [hx + 90, hy + 10], [hx, hy + 70], [hx - 90, hy + 10]];
          let from = [x, y];
          pts.forEach((p, i) => { const f = from; at(a, i * 450, () => fly('🦋', f, p, 450, { size: 26 })); from = p; });
          at(a, 300, () => { pose('laugh', 2400, 'pirouette', 1500); line('dizzyFly', 1, 0); });
          at(a, pts.length * 450, () => { away('🦋', pts[pts.length - 1]); prop('dizzy', 2000); });
        },
        miss: () => {
          prop('net', 1400);
          sfx.whoosh();
          at(a, 300, () => { pose('ok', 700, 'slip', 1800); });
          at(a, 1000, () => sfx.bonk());
          at(a, 1700, () => { prop('butterfly', 2400); api.setTemp('laugh', 2200); line('missFly', 1, 0); });
          at(a, 4000, () => { unprop('nose', true); away('🦋', nose()); });
        },
        family: () => {
          const [hx, hy] = head();
          [[-110, -20], [0, -80], [110, -20]].forEach(([dx, dy], i) => at(a, i * 250, () => fly('🦋', [x, y], [hx + dx, hy + dy], 800, { arc: 40, size: 26, stay: 1600 })));
          at(a, 700, () => { pose('happy', 2000, 'clap'); api.hearts(hx, hy, 5); line('family', 1, 0); });
          at(a, 2700, () => [[-110, -20], [0, -80], [110, -20]].forEach(([dx, dy]) => away('🦋', [hx + dx, hy + dy])));
        },
        spots: () => {
          fly('🐞', [x, y], paw(), 700, { size: 24, stay: 4300 });
          at(a, 700, () => pose('happy', 3600, 'listen', 3400));
          for (let i = 1; i <= 7; i++) at(a, 500 + i * 430, () => api.say([count(i)]));
          at(a, 4000, () => { line('ladybird', 1, 0); api.fxAt(...paw(), ['🍀', '✨'], 4, 'spark'); });
          at(a, 5000, () => away('🐞', paw()));
        },
        bee: () => {
          const [hx, hy] = head();
          sfx.buzz();
          [[hx - 80, hy], [hx + 80, hy - 40], [hx - 60, hy + 60]].forEach((p, i) => at(a, i * 350, () => fly('🐝', i ? [hx, hy] : [x, y], p, 350, { size: 24 })));
          at(a, 300, () => { api.setTemp('ok', 1800); go(Math.random() < 0.5 ? 30 : 70, 450); hold(a, 'scared', 1500); line('beeChase', 1, 0); });
          at(a, 1100, () => away('🐝', [hx - 60, hy + 60], 800));
        },
        sing: () => {
          const top = api.luckyPoint(0.5, 0.02);
          fly('🐦', [x, y], top, 700, { arc: 40, size: 30, stay: 2600 });
          at(a, 700, () => {
            [784, 988, 880, 1175, 988].forEach((f, i) => setTimeout(() => sfx.note(f), i * 260));
            api.fxAt(top[0], top[1] - 10, ['🎵', '🎶'], 5, 'spark');
            pose('happy', 2400, 'sway', 1300);
            line('birdSong', 1, 0);
          });
          at(a, 3300, () => away('🐦', top));
        },
        feather: () => {
          away('🐦', [x, y], 900);
          fly('🪶', [x, y], nose(), 1700, { arc: -20, spin: 90, size: 26 });
          at(a, 1700, () => api.setTemp('sleep', 450));
          at(a, 2150, () => { sfx.sneeze(); pose('laugh', 1300, 'sneeze'); api.fxAt(...nose(), ['💨', '🪶'], 3, 'spark'); line('feather', 1, 0); });
        },
        splash: () => {
          fly('🐠', [x, y], api.luckyPoint(0.5, 0.35), 600, { arc: 70, spin: 200, size: 32 });
          at(a, 600, () => { sfx.splash(); spray(...api.luckyPoint(0.5, 0.35)); line('fishSplash', 1, 0); getWet(a, 1800); });
        },
        tongue: () => {
          fly('❄️', [x, y], mouth(), 900, { spin: 180, size: 26 });
          at(a, 200, () => api.setTemp('eat', 1800));
          at(a, 900, () => { sfx.lick(); api.fxAt(...mouth(), ['✨'], 3, 'spark'); line('snowflake', 1, 0); });
        },
        wish: () => { api.setTemp('happy', 2600); api.fxAt(...head(), ['✨', '🌟'], 6, 'spark'); sfx.chime(); line('wish', 1, 0); },
        alien: () => { popUp('👽', x, y + 20, 2400, 36, 'pop-rise'); sfx.magic(); pose('happy', 1600, 'wave', 1200); line('alien', 1, 0); },
        kite: () => { popUp('🪁', x, Math.max(40, y - 30), 3200, 42, 'kite-loop'); pose('laugh', 2200, 'sway', 1300); sfx.whoosh(); line('kite', 1, 0); },
        pop: () => { sfx.bonk(); api.fxAt(x, y, ['🎉', '🎊', '✨'], 9, 'spark'); pose('ok', 800, 'startle', 1100); at(a, 900, () => api.setTemp('laugh', 1400)); line('balloonPop', 1, 0); },
        sweet: () => { fly('🍬', [x, y], mouth(), 600, { spin: 300, size: 26 }); at(a, 600, () => { api.setTemp('eat', 1600); sfx.crunch(); line('sweetCatch', 1, 0); }); },
        unicorn: () => {
          rainbow(4600);
          fly('🦄', [x, y], [w + 50, 50], 1500, { arc: 70, size: 44 });
          for (let i = 0; i < 6; i++) at(a, i * 200, () => api.floatFx(x + (w - x) * (i / 6), y - 10 * i, '✨', 'spark'));
          sfx.magic();
          pose('laugh', 1500, 'binky');
          line('unicorn', 1, 0);
          api.reward();
        },
        dragon: () => {
          popUp('🐉', x, y, 2200, 46);
          at(a, 500, () => { api.fxAt(x, y, ['✨', '🎇', '💫'], 10, 'spark'); sfx.sneeze(); });
          pose('ok', 900, 'startle', 1100);
          at(a, 1100, () => { api.setTemp('laugh', 1500); line('dragon', 1, 0); });
          api.reward();
        },
        owl: () => { popUp('🦉', x, y, 2600, 42); sfx.note(330); setTimeout(() => sfx.note(294), 450); pose('happy', 1800, 'listen', 1800); line('owl', 1, 0); },
      };
      (V[kind] || V.nose)();
      at(a, 5600, end);
      return true;
    },
    // Real bunny habits for quiet moments: grooming, a stretch, a flop, sniffing, nibbling, zoomies
    fidget() {
      if (!api.free() || act) return;
      const all = ['groom', 'stretch', 'flop', 'sniff', 'nibble', 'look', 'zoomies'];
      let k;
      do { k = all[Math.floor(Math.random() * all.length)]; } while (k === lastFidget);
      lastFidget = k;
      const talk = api.active() && Math.random() < 0.3; // a word about it only when she's playing
      if (k === 'groom') { pose('happy', 1800, 'groom', 1600); api.fxAt(...head(), ['✨'], 2, 'spark'); if (talk) line('groomFact', 1, 60000); }
      if (k === 'stretch') { pose('sleep', 1500, 'stretchUp', 1600); setTimeout(() => sfx.yawn(), 500); if (talk) line('stretch', 1, 60000); }
      if (k === 'flop') { const a = begin('flop'); pose('happy', 2600); hold(a, 'flop', 2600); sfx.puff(); if (talk) line('flopFact', 1, 60000); at(a, 2700, end); }
      if (k === 'sniff') { pose('ok', 1500, 'sniff', 1500); sfx.sniff(); }
      if (k === 'nibble') { pose('eat', 1600, 'squash', 700); sfx.crunch(); api.fxAt(...feet(), ['🌱'], 2, 'spark'); if (talk) line('nibble', 1, 60000); }
      if (k === 'look') { pose('ok', 1500, 'look', 1500); }
      if (k === 'zoomies') { pose('laugh', 2300, 'zoom', 2300); sfx.whoosh(); if (talk) line('zoomies', 1, 60000); }
    },
    // Tali: double tap - spins after his tail, long press - belly rub
    dog(kind, body) {
      if (!api.ok()) return;
      if (kind === 'double') { sfx.bark(); api.hop(body, 'dogspin', 1400); line('spin', 1, 8000, 'dog'); }
      if (kind === 'long') { sfx.happy(); api.hop(body, 'belly', 2000); api.hearts(...centerOf(body), 4); line('belly', 1, 8000, 'dog'); api.reward(); }
    },
    // the animal cloud of the day in the sky (from the 'Sharp eyes' mission)
    sky(emoji) {
      ui.bg.querySelector('.sky-pet')?.remove();
      if (!emoji) return;
      const s = document.createElement('div');
      s.className = 'sky-pet';
      s.textContent = emoji;
      ui.bg.appendChild(s);
    },
  };
}
