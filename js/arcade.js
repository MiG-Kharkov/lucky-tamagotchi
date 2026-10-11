// The holiday games' engine: an arcade core (a canvas, a loop that pauses when the app is hidden, touch, emoji sprites,
// sparkles, floating points, a time bar) and the kinds of game built on it: a shooter, a catcher, a whack-a-mole,
// fireworks and a runner. Each lasts two or three minutes, speeds up as it goes, and counts points with combos;
// you can't lose, only score less. The themes in holigames.js give each its pictures, sounds and twists.
//
// A kind is kind(ctx, theme, level) → { stop() → points, cleanup() }; at the end it calls ctx.finish(points).

export const LEVEL_IDS = ['easy', 'normal', 'hard'];
// time: seconds; speed: from → to over the game; dense: how much comes; bad: how many hazards; boss: its strength
export const LEVELS = {
  easy: { time: 120, speed: [0.65, 1.2], dense: 0.75, bad: 0.55, boss: 0.7 },
  normal: { time: 150, speed: [0.85, 1.65], dense: 1, bad: 1, boss: 1 },
  hard: { time: 180, speed: [1.05, 2.15], dense: 1.25, bad: 1.35, boss: 1.35 },
};

const rnd = (a, b) => a + Math.random() * (b - a);
const pickW = (list) => { let r = Math.random() * list.reduce((s, x) => s + (x.w ?? 1), 0); return list.find((x) => (r -= x.w ?? 1) < 0) || list[0]; };
const one = (x) => (Array.isArray(x) ? x[Math.floor(Math.random() * x.length)] : x);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const FONT = 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif';
// a rounded rectangle path (ctx.roundRect is missing in Safari before 16)
function rrect(g, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui';

// ---------- the core ----------
function core(ctx, game) {
  const { stage } = ctx;
  stage.innerHTML = '<canvas class="arcade"></canvas>';
  const canvas = stage.querySelector('canvas'), g = canvas.getContext('2d');
  const A = { W: 0, H: 0, dpr: 1, t: 0, g, parts: [], texts: [], shake: 0, k: 1 };
  const sprites = new Map();
  const resize = () => {
    A.dpr = Math.min(window.devicePixelRatio || 1, 2);
    A.W = stage.clientWidth; A.H = stage.clientHeight;
    canvas.width = Math.round(A.W * A.dpr); canvas.height = Math.round(A.H * A.dpr);
    canvas.style.width = A.W + 'px'; canvas.style.height = A.H + 'px';
    g.setTransform(A.dpr, 0, 0, A.dpr, 0, 0);
    A.k = clamp(Math.min(A.W / 390, A.H / 700), 0.8, 1.35); // sizes follow the screen
    sprites.clear();
    game.resize?.();
  };
  // emoji are drawn once into a small canvas and then copied: much faster than text on every frame
  A.sprite = (e, size) => {
    const k = e + '|' + Math.round(size);
    let c = sprites.get(k);
    if (!c) {
      const px = Math.ceil(size * 1.3 * A.dpr);
      c = document.createElement('canvas');
      c.width = c.height = px;
      const x = c.getContext('2d');
      x.font = `${Math.round(size * A.dpr)}px ${EMOJI_FONT}`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(e, px / 2, px / 2 + size * A.dpr * 0.06);
      sprites.set(k, c);
    }
    return c;
  };
  A.emoji = (e, x, y, size, { rot = 0, alpha = 1, sx = 1 } = {}) => {
    const c = A.sprite(e, size), s = c.width / A.dpr;
    g.save();
    g.globalAlpha = alpha;
    g.translate(x, y);
    if (rot) g.rotate(rot);
    if (sx !== 1) g.scale(sx, 1);
    g.drawImage(c, -s / 2, -s / 2, s, s);
    g.restore();
  };
  A.image = (img, x, y, w, h, { alpha = 1, rot = 0 } = {}) => {
    if (!img.complete) return;
    g.save();
    g.globalAlpha = alpha;
    g.translate(x, y);
    if (rot) g.rotate(rot);
    g.drawImage(img, -w / 2, -h / 2, w, h);
    g.restore();
  };
  // sparkles: emoji or coloured dots flying out
  A.burst = (x, y, list, n = 8, { speed = 160, size = 18, life = 0.8, gravity = 260 } = {}) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = rnd(0.4, 1) * speed;
      A.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.4, e: one(list), size: size * rnd(0.7, 1.2), life, max: life, gravity, rot: rnd(-3, 3) });
    }
  };
  A.float = (x, y, text, color = '#fff', size = 22) => A.texts.push({ x, y, text, color, size, life: 0.9 });
  const drawParts = (dt) => {
    for (const p of A.parts) {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.gravity * dt; p.rot *= 0.98;
      const al = clamp(p.life / p.max, 0, 1);
      if (p.e.startsWith('#')) { g.globalAlpha = al; g.fillStyle = p.e; g.beginPath(); g.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
      else A.emoji(p.e, p.x, p.y, p.size, { rot: p.rot * (1 - al), alpha: al });
    }
    A.parts = A.parts.filter((p) => p.life > 0);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const t of A.texts) {
      t.life -= dt; t.y -= 50 * dt;
      g.globalAlpha = clamp(t.life / 0.6, 0, 1);
      g.font = `900 ${t.size}px ${FONT}`;
      g.lineWidth = 4; g.strokeStyle = '#0006'; g.strokeText(t.text, t.x, t.y);
      g.fillStyle = t.color; g.fillText(t.text, t.x, t.y);
      g.globalAlpha = 1;
    }
    A.texts = A.texts.filter((t) => t.life > 0);
  };
  // the time bar along the top
  // the time left: a bar under the buttons along the top
  A.timeBar = (left, total) => {
    const w = A.W - 32, k = clamp(left / total, 0, 1);
    g.fillStyle = '#FFFFFF55';
    rrect(g, 16, 66, w, 7, 4); g.fill();
    g.fillStyle = left < 10 ? '#FF5C5C' : '#FFE066';
    rrect(g, 16, 66, Math.max(8, w * k), 7, 4); g.fill();
  };
  A.shadowText = (text, x, y, size, color = '#fff') => {
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `900 ${size}px ${FONT}`;
    g.lineWidth = 5; g.strokeStyle = '#0007'; g.strokeText(text, x, y);
    g.fillStyle = color; g.fillText(text, x, y);
  };
  // touch: where the finger is (x, y), and taps. Lucky follows the first finger only (another thumb resting on the
  // screen doesn't pull him away); in the tapping games (game.taps) every finger's tap counts. A finished game is deaf.
  let raf = 0, last = 0, running = true, paused = false, finger = null;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (!running || paused) return;
    if (finger === null) { finger = e.pointerId; A.down = true; } else if (!game.taps) return;
    game.down?.(...pos(e));
  });
  canvas.addEventListener('pointermove', (e) => { if (running && ((A.down && e.pointerId === finger) || e.pointerType === 'mouse')) game.move?.(...pos(e)); });
  const up = (e) => { if (e.pointerId !== finger) return; finger = null; A.down = false; if (running) game.up?.(...pos(e)); };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  // the loop; it pauses while the app is hidden or the phone is turned sideways (the "turn your phone" cover is up)
  const sideways = matchMedia('(orientation: landscape) and (max-height: 540px)');
  const frame = (now) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!paused) {
      A.t += dt;
      g.save();
      if (A.shake > 0) { A.shake -= dt; g.translate(rnd(-4, 4), rnd(-3, 3)); }
      game.frame(dt);
      drawParts(dt);
      g.restore();
    }
    raf = requestAnimationFrame(frame);
  };
  const onVis = () => { paused = document.hidden || sideways.matches; last = performance.now(); };
  document.addEventListener('visibilitychange', onVis);
  sideways.addEventListener?.('change', onVis);
  window.addEventListener('resize', resize);
  A.start = () => { resize(); onVis(); raf = requestAnimationFrame(frame); };
  A.cleanup = () => {
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up);
    document.removeEventListener('visibilitychange', onVis);
    sideways.removeEventListener?.('change', onVis);
  };
  return A;
}

// the background: a sky gradient, the theme's far-away things drifting slowly, a ground strip
function backdrop(A, th) {
  const far = Array.from({ length: th.far?.n || 0 }, (_, i) => ({ x: Math.random(), y: Math.random() * 0.7, s: rnd(0.6, 1.2), v: rnd(0.01, 0.03), e: one(th.far.e), ph: i }));
  const stars = Array.from({ length: th.stars || 0 }, () => ({ x: Math.random(), y: Math.random() * 0.6, r: rnd(0.8, 2.2), ph: rnd(0, 6) }));
  let hillX = 0;
  return (dt, run = 0) => {
    const { g, W, H } = A;
    const grd = g.createLinearGradient(0, 0, 0, H);
    th.bg.forEach((c, i) => grd.addColorStop(i / (th.bg.length - 1), c));
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);
    for (const st of stars) { g.globalAlpha = 0.45 + Math.sin(A.t * 2 + st.ph) * 0.4; g.fillStyle = '#fff'; g.beginPath(); g.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1;
    if (th.moon) { g.fillStyle = '#FFF3C4'; g.beginPath(); g.arc(W * 0.8, H * 0.13, Math.min(W, H) * 0.07, 0, Math.PI * 2); g.fill(); g.fillStyle = '#F2E3A0'; g.beginPath(); g.arc(W * 0.78, H * 0.12, Math.min(W, H) * 0.014, 0, Math.PI * 2); g.fill(); }
    // far hills that roll by slowly (the runner)
    if (th.hills) {
      hillX = (hillX + run * 0.25 * dt) % (W * 1.5);
      th.hills.forEach((c, i) => {
        g.fillStyle = c;
        g.beginPath();
        g.moveTo(0, H);
        const base = H * (0.66 + i * 0.07), amp = H * (0.07 - i * 0.015), off = hillX * (1 + i * 0.6);
        for (let x = 0; x <= W; x += 12) g.lineTo(x, base - Math.sin((x + off) / (W * 0.32) + i * 2) * amp);
        g.lineTo(W, H);
        g.closePath();
        g.fill();
      });
    }
    for (const f of far) {
      f.x += f.v * dt;
      if (f.x > 1.1) f.x = -0.1;
      A.emoji(f.e, f.x * W, f.y * H + Math.sin(A.t + f.ph) * 6, 26 * f.s, { alpha: th.far.alpha ?? 0.35 });
    }
    if (th.ground) { g.fillStyle = th.ground; g.beginPath(); g.moveTo(0, H - 46); g.quadraticCurveTo(W / 2, H - 80, W, H - 46); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill(); }
  };
}

// tests (?debug) can look inside a running game to play it like a child would
const peek = (get) => { if (typeof window !== 'undefined' && window.game) window.game.arcade = get; };
const svgImage = (svg) => { const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return img; };
const mmss = (s) => { const n = Math.max(0, Math.ceil(s)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; };
const DROPPER_Y = 112; // the catcher's dropper sails under the score pill and the time bar
const POWER_ICON = { rapid: '⚡', triple: '✳️', magnet: '🧲', shield: '🛡️', slow: '🐢', double: '✖️2', big: '⬆️', fly: '🎈', star: '🌟' };

// HUD in the game's info pill: points, the combo multiplier, time left and the powers that are on
function hud(ctx, points, mult, left, powers) {
  const on = Object.entries(powers).filter(([, v]) => v > 0).map(([k]) => POWER_ICON[k] || '').join(' ');
  const html = `⭐ ${points}${mult > 1 ? ` <b class="g-mult">×${mult}</b>` : ''} &nbsp;⏱ ${mmss(left)}${on ? ' &nbsp;' + on : ''}`;
  if (html !== ctx.hudNow) { ctx.hudNow = html; ctx.info(html); }
}
// every 30 seconds a new wave: it says so, and the speed goes up (the speed itself grows smoothly too)
function waves(A, ctx, onWave) {
  let next = 30, n = 1;
  return () => { if (A.t >= next) { next += 30; n++; A.float(A.W / 2, A.H * 0.3, ctx.tr('gWave', { n }), '#9BF6FF', 34); playSfx(ctx, 'whoosh'); onWave?.(n); } };
}
// combo → multiplier: ×2 from 6 in a row, ×3 from 14, ×4 from 25
const multOf = (combo) => (combo >= 25 ? 4 : combo >= 14 ? 3 : combo >= 6 ? 2 : 1);
const playSfx = (ctx, name, ...a) => { const f = ctx.sfx[name]; if (f) f(...a); };

// ---------- the shooter: Lucky follows your finger and fires up at what comes down ----------
export function shooter(ctx, th, lvName) {
  const lv = LEVELS[lvName] || LEVELS.normal;
  const game = {};
  const A = core(ctx, game);
  const sky = backdrop(A, th);
  const img = { ok: svgImage(ctx.svgOk), happy: svgImage(ctx.svgHappy), sad: svgImage(ctx.svgSad) };
  const P = { x: 0, tx: 0, size: 90, stun: 0, happy: 0 };
  const pw = { rapid: 0, triple: 0, magnet: 0, shield: 0, slow: 0 };
  let shots = [], foes = [], drops = [], points = 0, combo = 0, fireIn = 0, spawnIn = 1.2, friendIn = rnd(14, 22), powerIn = rnd(10, 16), boss = null, bosses = 0;
  let nextBoss = lv.time * 0.3, lastTick = 0, ended = false;
  const total = lv.time;
  const speed = () => (lv.speed[0] + (lv.speed[1] - lv.speed[0]) * clamp(A.t / total, 0, 1)) * (pw.slow > 0 ? 0.55 : 1);
  // Hard is faster and longer, with more hazards and stronger bosses, but no more crowded than Normal and the things
  // take as many hits as on Normal: one Lucky can shoot only so fast (he fires a little faster on Hard).
  const hard = lvName === 'hard';
  const crowd = (sp) => (hard ? LEVELS.normal.dense * Math.min(sp, LEVELS.normal.speed[1]) : lv.dense * sp);
  const fireGap = hard ? 0.24 : 0.28;
  game.resize = () => { P.size = clamp(A.W * 0.26, 84, 124); if (!P.x) P.x = P.tx = A.W / 2; };
  game.down = (x) => { P.tx = x; };
  game.move = (x) => { P.tx = x; };
  const py = () => A.H - P.size * 0.62 - 26;
  const wave = waves(A, ctx, () => { for (let i = 0; i < 5; i++) spawn(i); });
  const add = (pts, x, y) => {
    const m = multOf(combo), got = Math.round(pts * m);
    points += got;
    A.float(x, y, `+${got}`, m > 1 ? '#FFE066' : '#fff', m > 1 ? 24 : 20);
    if (m > multOf(combo - 1)) { A.float(A.W / 2, A.H * 0.4, `×${m}!`, '#FFE066', 40); playSfx(ctx, 'chime'); }
  };
  const lose = (pts, x, y) => { points = Math.max(0, points - pts); combo = 0; A.float(x, y, `−${pts}`, '#FF8080', 22); };
  function spawn(slot = -1) {
    const f = pickW(th.targets), size = (f.size || 44) * 1.18 * A.k;
    const hp = f.hp || 1;
    // a group now and then: three in a row
    const n = slot < 0 && Math.random() < 0.22 ? 3 : 1, x0 = slot >= 0 ? (A.W / 6) * (slot + 1) : rnd(size, A.W - size * (n > 1 ? 3 : 1));
    for (let i = 0; i < n; i++) foes.push({ ...f, x: clamp(x0 + i * size * 1.15, size / 2, A.W - size / 2), y: -size - i * 18, size, hp, ph: rnd(0, 6), dir: Math.random() < 0.5 ? -1 : 1, kind: 'target', flash: 0 });
    // now and then a hazard falls too
    if (th.hazards && Math.random() < 0.28 * lv.bad) {
      const h = pickW(th.hazards), hs = (h.size || 38);
      foes.push({ ...h, x: rnd(hs, A.W - hs), y: -hs, size: hs * 1.15 * A.k, hp: 1, ph: 0, dir: 1, kind: 'hazard', flash: 0, top: 0 });
    }
  }
  function fire() {
    const angles = pw.triple > 0 ? [-0.22, 0, 0.22] : [0];
    for (const a of angles) shots.push({ x: P.x, y: py() - P.size * 0.45, vx: Math.sin(a) * 620, vy: -Math.cos(a) * 620 });
    if (Math.random() < 0.3) playSfx(ctx, 'tap');
  }
  function power(p, x, y) {
    pw[p.kind] = p.kind === 'shield' ? 1 : 8;
    A.float(x, y - 20, POWER_ICON[p.kind] + '!', '#9BF6FF', 30);
    A.burst(x, y, ['✨', '⭐'], 10);
    playSfx(ctx, 'sparkle');
  }
  function startBoss() {
    const b = th.boss, size = clamp(A.W * 0.36, 110, 170), hp = Math.round(b.hp * lv.boss * (1 + bosses * 0.35));
    boss = { ...b, x: A.W / 2, y: -size, size, hp, max: hp, vx: 70, dropIn: 2, flash: 0, enter: true };
    A.float(A.W / 2, A.H * 0.35, th.bossName ? ctx.tr(th.bossName) : '!!!', '#FFE066', 30);
    playSfx(ctx, 'whoosh');
    playSfx(ctx, 'gong');
  }
  function bossDown() {
    bosses++;
    const m = multOf(combo), got = Math.round(th.boss.pts * m);
    points += got;
    A.float(boss.x, boss.y, `+${got}`, '#FFE066', 36);
    A.burst(boss.x, boss.y, th.boss.burst || ['✨', '⭐', '💥'], 24, { speed: 260, size: 26 });
    for (let i = 0; i < 9; i++) drops.push({ e: one(th.drop.e), pts: th.drop.pts, x: boss.x + rnd(-60, 60), y: boss.y + rnd(-30, 20), vy: rnd(40, 90), size: 36 * A.k });
    A.shake = 0.4;
    playSfx(ctx, 'levelup');
    boss = null;
    nextBoss = A.t + lv.time * 0.3;
  }
  peek(() => ({ kind: 'shooter', P: { ...P, y: py() }, foes, drops, boss, points }));
  game.frame = (dt) => {
    const { g, W, H } = A;
    const sp = speed(), left = total - A.t;
    sky(dt);
    for (const k in pw) if (k !== 'shield') pw[k] = Math.max(0, pw[k] - dt);
    // Lucky
    P.x += (clamp(P.tx, P.size * 0.4, W - P.size * 0.4) - P.x) * Math.min(1, dt * 12);
    P.stun -= dt; P.happy -= dt;
    if (P.stun <= 0) { fireIn -= dt; if (fireIn <= 0) { fireIn = pw.rapid > 0 ? 0.12 : fireGap; fire(); } }
    // what comes down
    if (!boss) { spawnIn -= dt * crowd(sp); if (spawnIn <= 0) { spawn(); spawnIn = rnd(0.4, 0.8); } }
    else { spawnIn -= dt * crowd(sp) * 0.35; if (spawnIn <= 0) { spawn(); spawnIn = rnd(0.8, 1.3); } }
    wave();
    if (!boss && A.t >= nextBoss && left > 12) startBoss();
    friendIn -= dt;
    if (th.friend && friendIn <= 0) { friendIn = rnd(16, 26); const right = Math.random() < 0.5; foes.push({ e: th.friend.e, kind: 'friend', x: right ? -30 : W + 30, y: H * rnd(0.25, 0.5), size: 50 * A.k, dir: right ? 1 : -1, hp: 1, ph: 0, flash: 0 }); }
    powerIn -= dt;
    if (th.powers && powerIn <= 0) { powerIn = rnd(14, 22); const p = one(th.powers); drops.push({ ...p, power: true, x: rnd(40, W - 40), y: -30, vy: 90, size: 42 * A.k }); }
    // shots
    for (const s of shots) { s.x += s.vx * dt; s.y += s.vy * dt; A.emoji(th.shot, s.x, s.y, 22 * A.k); }
    shots = shots.filter((s) => s.y > -20 && !s.hit);
    // foes move
    for (const f of foes) {
      f.flash -= dt;
      if (f.kind === 'friend') f.x += f.dir * 90 * dt;
      else if (f.move === 'zigzag') { f.x += f.dir * 110 * dt * sp; if (f.x < f.size / 2) f.dir = 1; else if (f.x > W - f.size / 2) f.dir = -1; f.y += (f.v || 60) * dt * sp; }
      else if (f.move === 'drift') { f.x += Math.sin(A.t * 1.6 + f.ph) * 40 * dt; f.y += (f.v || 60) * dt * sp; }
      else if (f.move === 'drop') { f.top = 0; f.y += (f.v || 200) * dt * Math.min(sp, 1.6); }
      else f.y += (f.v || 55) * dt * sp;
      if (f.move === 'drop') { g.strokeStyle = '#FFFFFF88'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(f.x, 0); g.lineTo(f.x, f.y - f.size / 2); g.stroke(); }
      A.emoji(f.e, f.x, f.y, f.size, { alpha: f.flash > 0 ? 0.5 : 1, sx: f.kind === 'friend' ? -f.dir : 1 });
    }
    // shots hit things
    for (const s of shots) {
      for (const f of foes) {
        if (f.dead || Math.abs(s.x - f.x) > f.size * 0.45 || Math.abs(s.y - f.y) > f.size * 0.45) continue;
        s.hit = true;
        if (f.kind === 'friend') { f.dead = true; lose(15, f.x, f.y); A.burst(f.x, f.y, ['💨'], 4); playSfx(ctx, 'bonk'); P.stun = 0.4; break; }
        f.hp--; f.flash = 0.12;
        if (f.hp > 0) { playSfx(ctx, 'tap'); break; }
        f.dead = true;
        if (f.kind === 'hazard') { add(3, f.x, f.y); A.burst(f.x, f.y, ['💨', '✨'], 5); playSfx(ctx, 'pop'); break; }
        combo++;
        add(f.pts, f.x, f.y);
        A.burst(f.x, f.y, th.hit || ['✨', '⭐'], 7);
        playSfx(ctx, th.killSfx || 'pop');
        if (th.drop && Math.random() < (f.drops ?? th.drop.chance)) drops.push({ e: one(th.drop.e), pts: th.drop.pts, x: f.x, y: f.y, vy: 70, size: 36 * A.k });
        break;
      }
      if (boss && !s.hit && Math.abs(s.x - boss.x) < boss.size * 0.42 && Math.abs(s.y - boss.y) < boss.size * 0.42) {
        s.hit = true; boss.hp--; boss.flash = 0.08;
        if (boss.hp <= 0) bossDown(); else if (Math.random() < 0.35) playSfx(ctx, 'tap');
      }
    }
    // things reach Lucky or the ground
    const ly = py();
    for (const f of foes) {
      if (f.dead) continue;
      if (f.kind === 'hazard' && Math.abs(f.x - P.x) < P.size * 0.42 && Math.abs(f.y - ly) < P.size * 0.45) {
        f.dead = true;
        if (pw.shield > 0) { pw.shield = 0; A.burst(f.x, f.y, ['🫧', '✨'], 8); playSfx(ctx, 'bubble'); }
        else { P.stun = 0.9; lose(10, P.x, ly - P.size * 0.6); A.shake = 0.25; playSfx(ctx, 'bonk'); }
      }
      if (f.y > H + 40) { f.dead = true; if (f.kind === 'target') combo = 0; }
      if (f.kind === 'friend' && (f.x < -40 || f.x > W + 40)) f.dead = true;
    }
    foes = foes.filter((f) => !f.dead);
    // drops: treats to catch, and powers
    for (const d of drops) {
      if (pw.magnet > 0 && !d.power) { d.x += (P.x - d.x) * Math.min(1, dt * 3); d.y += (ly - d.y) * Math.min(1, dt * 1.5); }
      d.y += (d.vy || 70) * dt * (0.8 + sp * 0.3);
      A.emoji(d.e, d.x, d.y, d.size, { rot: Math.sin(A.t * 4 + d.x) * 0.2 });
      if (Math.abs(d.x - P.x) < P.size * 0.5 && Math.abs(d.y - ly) < P.size * 0.5) {
        d.got = true;
        if (d.power) power(d, d.x, d.y);
        else { add(d.pts, d.x, d.y); P.happy = 0.35; playSfx(ctx, 'catch'); }
      }
    }
    drops = drops.filter((d) => !d.got && d.y < H + 40);
    // the boss
    if (boss) {
      if (boss.enter) { boss.y += 90 * dt; if (boss.y >= Math.max(110, H * 0.2)) boss.enter = false; }
      else { boss.x += boss.vx * dt * sp; if (boss.x < boss.size / 2) boss.vx = Math.abs(boss.vx); else if (boss.x > W - boss.size / 2) boss.vx = -Math.abs(boss.vx); boss.y = Math.max(110, H * 0.2) + Math.sin(A.t * 1.3) * 18; }
      boss.dropIn -= dt;
      if (!boss.enter && boss.dropIn <= 0 && th.hazards) { boss.dropIn = rnd(1.4, 2.2) / lv.bad; const h = one(th.hazards); foes.push({ ...h, x: boss.x, y: boss.y + boss.size * 0.4, size: h.size || 38, hp: 1, kind: 'hazard', ph: 0, dir: 1, flash: 0 }); }
      boss.flash -= dt;
      A.emoji(boss.e, boss.x, boss.y, boss.size, { alpha: boss.flash > 0 ? 0.6 : 1, rot: Math.sin(A.t * 2) * 0.08 });
      if (boss.crown) A.emoji(boss.crown, boss.x, boss.y - boss.size * 0.52, boss.size * 0.36);
      const bw = boss.size * 1.1, k = boss.hp / boss.max;
      g.fillStyle = '#0006'; rrect(g, boss.x - bw / 2, boss.y + boss.size * 0.55, bw, 9, 5); g.fill();
      g.fillStyle = k > 0.5 ? '#7CF27C' : k > 0.25 ? '#FFD23F' : '#FF6B6B'; rrect(g, boss.x - bw / 2, boss.y + boss.size * 0.55, Math.max(6, bw * k), 9, 5); g.fill();
    }
    // Lucky himself (a bubble while the shield is on)
    const face = P.stun > 0 ? img.sad : P.happy > 0 ? img.happy : img.ok;
    if (pw.shield > 0) { g.fillStyle = '#9BF6FF33'; g.strokeStyle = '#9BF6FFAA'; g.lineWidth = 3; g.beginPath(); g.arc(P.x, ly, P.size * 0.62, 0, Math.PI * 2); g.fill(); g.stroke(); }
    A.image(face, P.x + (P.stun > 0 ? Math.sin(A.t * 50) * 4 : 0), ly, P.size, P.size * 1.05, { alpha: P.stun > 0 && Math.floor(A.t * 12) % 2 ? 0.5 : 1 });
    // time
    A.timeBar(left, total);
    if (left < 10 && Math.floor(left) !== lastTick) { lastTick = Math.floor(left); playSfx(ctx, 'tick'); }
    hud(ctx, points, multOf(combo), left, pw);
    if (left <= 0 && !ended) { ended = true; ctx.finish(points); }
  };
  A.start();
  return { cleanup: A.cleanup, stop: () => { A.cleanup(); return points; } };
}

// ---------- the catcher: something at the top drops things; Lucky catches the good ones in his basket ----------
export function catcher(ctx, th, lvName) {
  const lv = LEVELS[lvName] || LEVELS.normal;
  const game = {};
  const A = core(ctx, game);
  const sky = backdrop(A, th);
  const img = { ok: svgImage(ctx.svgOk), happy: svgImage(ctx.svgHappy), sad: svgImage(ctx.svgSad) };
  const P = { x: 0, tx: 0, size: 90, stun: 0, happy: 0 };
  const pw = { magnet: 0, double: 0, big: 0, slow: 0 };
  const dropper = { x: 0, dir: 1 };
  let items = [], points = 0, combo = 0, dropIn = 1, rushIn = 28, rush = 0, powerIn = rnd(10, 15), lastTick = 0, ended = false;
  const total = lv.time;
  const speed = () => (lv.speed[0] + (lv.speed[1] - lv.speed[0]) * clamp(A.t / total, 0, 1)) * (pw.slow > 0 ? 0.55 : 1);
  game.resize = () => { P.size = clamp(A.W * 0.26, 84, 124); if (!P.x) P.x = P.tx = dropper.x = A.W / 2; };
  game.down = (x) => { P.tx = x; };
  game.move = (x) => { P.tx = x; };
  const py = () => A.H - P.size * 0.6 - 24;
  const wave = waves(A, ctx);
  peek(() => ({ kind: 'catcher', P: { ...P, y: py() }, items, points }));
  game.frame = (dt) => {
    const { g, W, H } = A;
    const sp = speed(), left = total - A.t;
    sky(dt);
    for (const k in pw) pw[k] = Math.max(0, pw[k] - dt);
    // the dropper sails along the top
    dropper.x += dropper.dir * (60 + 40 * sp) * dt;
    if (dropper.x < 40) dropper.dir = 1; else if (dropper.x > W - 40) dropper.dir = -1;
    if (th.dropper) A.emoji(th.dropper, dropper.x, DROPPER_Y + Math.sin(A.t * 2) * 6, 66 * A.k, { sx: th.dropperFlip ? -dropper.dir : 1 });
    wave();
    // a rush now and then: lots at once
    rushIn -= dt;
    if (rushIn <= 0) { rushIn = rnd(24, 32); rush = 4; A.float(W / 2, H * 0.32, th.rushText ? ctx.tr(th.rushText) : '!!!', '#FFE066', 32); playSfx(ctx, 'fanfare'); }
    rush -= dt;
    dropIn -= dt * lv.dense * sp * (rush > 0 ? 2.6 : 1);
    if (dropIn <= 0) {
      dropIn = rnd(0.36, 0.7);
      const bad = th.bad && Math.random() < 0.18 * lv.bad && rush <= 0;
      const it = bad ? one(th.bad) : pickW(th.good);
      // mostly from the dropper, sometimes from anywhere in the sky
      const fromTop = !th.dropper || Math.random() < 0.3;
      items.push({ ...it, bad, x: fromTop ? rnd(30, W - 30) : dropper.x + rnd(-20, 20), y: fromTop ? -30 : DROPPER_Y + 28, vy: rnd(120, 170), size: (it.size || 40) * 1.15 * A.k, rot: rnd(-1, 1) });
    }
    powerIn -= dt;
    if (th.powers && powerIn <= 0) { powerIn = rnd(14, 22); const p = one(th.powers); items.push({ ...p, power: true, x: rnd(40, W - 40), y: -30, vy: 110, size: 44 * A.k, rot: 0 }); }
    // Lucky
    P.x += (clamp(P.tx, P.size * 0.4, W - P.size * 0.4) - P.x) * Math.min(1, dt * 12);
    P.stun -= dt; P.happy -= dt;
    const ly = py(), reach = P.size * (pw.big > 0 ? 0.85 : 0.5);
    for (const it of items) {
      if (pw.magnet > 0 && !it.bad && !it.power) it.x += (P.x - it.x) * Math.min(1, dt * 2.5);
      it.y += it.vy * dt * sp;
      it.rot += dt;
      A.emoji(it.e, it.x, it.y, it.size, { rot: Math.sin(it.rot * 2) * 0.25 });
      if (P.stun <= 0 && Math.abs(it.x - P.x) < reach && Math.abs(it.y - (ly - P.size * 0.2)) < P.size * 0.35) {
        it.got = true;
        if (it.power) { pw[it.kind] = 8; A.float(it.x, it.y - 20, POWER_ICON[it.kind] + '!', '#9BF6FF', 30); A.burst(it.x, it.y, ['✨', '⭐'], 10); playSfx(ctx, 'sparkle'); }
        else if (it.bad) { P.stun = 0.7; combo = 0; points = Math.max(0, points - 10); A.float(it.x, it.y, '−10', '#FF8080', 22); A.shake = 0.2; playSfx(ctx, 'bonk'); }
        else {
          combo++;
          const m = multOf(combo) * (pw.double > 0 ? 2 : 1), got = it.pts * m;
          points += got;
          A.float(it.x, it.y - 10, `+${got}`, m > 1 ? '#FFE066' : '#fff', m > 1 ? 24 : 20);
          if (multOf(combo) > multOf(combo - 1)) { A.float(W / 2, H * 0.4, `×${multOf(combo)}!`, '#FFE066', 40); playSfx(ctx, 'chime'); }
          A.burst(it.x, it.y, th.hit || ['✨'], it.pts >= 15 ? 10 : 4, { speed: 120, size: 16 });
          P.happy = 0.35;
          playSfx(ctx, it.pts >= 15 ? 'sparkle' : 'catch');
        }
      } else if (it.y > H + 30) { it.got = true; if (!it.bad && !it.power) combo = 0; }
    }
    items = items.filter((it) => !it.got);
    const face = P.stun > 0 ? img.sad : P.happy > 0 ? img.happy : img.ok;
    A.image(face, P.x + (P.stun > 0 ? Math.sin(A.t * 50) * 4 : 0), ly, P.size, P.size * 1.05);
    A.emoji(th.basket || '🧺', P.x, ly + P.size * 0.3, P.size * (pw.big > 0 ? 0.95 : 0.62));
    A.timeBar(left, total);
    if (left < 10 && Math.floor(left) !== lastTick) { lastTick = Math.floor(left); playSfx(ctx, 'tick'); }
    hud(ctx, points, multOf(combo) * (pw.double > 0 ? 2 : 1), left, pw);
    if (left <= 0 && !ended) { ended = true; ctx.finish(points); }
  };
  A.start();
  return { cleanup: A.cleanup, stop: () => { A.cleanup(); return points; } };
}

// ---------- whack: things pop up from their spots for a moment; tap the right ones, leave the others ----------
export function whacker(ctx, th, lvName) {
  const lv = LEVELS[lvName] || LEVELS.normal;
  const total = Math.round(lv.time * 0.8);
  const game = {};
  const A = core(ctx, game);
  const sky = backdrop(A, th);
  const cols = lvName === 'hard' ? 4 : 3, rows = lvName === 'easy' ? 3 : 4;
  let spots = [], points = 0, combo = 0, popIn = 0.8, lastTick = 0, ended = false;
  const speed = () => lv.speed[0] + (lv.speed[1] - lv.speed[0]) * clamp(A.t / total, 0, 1);
  game.taps = true;
  game.resize = () => {
    const top = A.H * 0.2, bottom = A.H - 70, gw = A.W / cols, gh = (bottom - top) / rows, old = spots;
    spots = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) spots.push({ x: gw * (c + 0.5), y: top + gh * (r + 0.6), size: Math.min(gw, gh) * 0.7, up: old[spots.length]?.up || null });
  };
  game.down = (x, y) => {
    for (const s of spots) {
      const u = s.up;
      if (!u || u.hit || Math.abs(x - s.x) > s.size * 0.6 || Math.abs(y - (s.y - s.size * 0.35)) > s.size * 0.7) continue;
      u.hit = true;
      u.hitAt = u.t;
      if (u.bad) { combo = 0; points = Math.max(0, points - 15); A.float(s.x, s.y - s.size * 0.6, '−15', '#FF8080', 24); A.shake = 0.2; playSfx(ctx, 'bonk'); }
      else {
        combo++;
        const m = multOf(combo), got = u.pts * m;
        points += got;
        A.float(s.x, s.y - s.size * 0.7, `+${got}`, m > 1 ? '#FFE066' : '#fff', m > 1 ? 26 : 22);
        if (m > multOf(combo - 1)) { A.float(A.W / 2, A.H * 0.12, `×${m}!`, '#FFE066', 40); playSfx(ctx, 'chime'); }
        A.burst(s.x, s.y - s.size * 0.4, th.hit || ['✨', '⭐'], u.pts >= 25 ? 12 : 6);
        playSfx(ctx, u.pts >= 25 ? 'sparkle' : th.hitSfx || 'pop');
      }
      return;
    }
  };
  peek(() => ({ kind: 'whacker', spots, points }));
  game.frame = (dt) => {
    const sp = speed(), left = total - A.t;
    sky(dt);
    popIn -= dt * lv.dense * sp;
    if (popIn <= 0) {
      popIn = rnd(0.5, 0.95);
      const free = spots.filter((s) => !s.up);
      const n = Math.min(free.length, sp > 1.4 && Math.random() < 0.35 ? 2 : 1);
      for (let i = 0; i < n; i++) {
        const s = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        const bad = th.bad && Math.random() < 0.2 * lv.bad, gold = !bad && Math.random() < 0.08;
        const it = bad ? one(th.bad) : gold ? th.gold : pickW(th.good);
        s.up = { ...it, bad, t: 0, life: rnd(1.3, 1.7) / sp, hit: false };
      }
    }
    for (const s of spots) {
      A.emoji(th.spot, s.x, s.y, s.size);
      const u = s.up;
      if (!u) continue;
      u.t += dt;
      const k = u.hit ? Math.max(0, 1 - (u.t - u.hitAt) / 0.25) : Math.min(1, u.t / 0.15, (u.life - u.t) / 0.15);
      A.emoji(u.e, s.x, s.y - s.size * 0.42 * clamp(k, 0, 1), s.size * 0.78, { alpha: clamp(k * 1.5, 0, 1) });
      if (u.t >= u.life || (u.hit && k <= 0)) { if (!u.hit && !u.bad) combo = 0; s.up = null; }
    }
    A.timeBar(left, total);
    if (left < 10 && Math.floor(left) !== lastTick) { lastTick = Math.floor(left); playSfx(ctx, 'tick'); }
    hud(ctx, points, multOf(combo), left, {});
    if (left <= 0 && !ended) { ended = true; ctx.finish(points); }
  };
  A.start();
  return { cleanup: A.cleanup, stop: () => { A.cleanup(); return points; } };
}

// ---------- fireworks: rockets rise; tap one near the top of its flight for the best burst; bursts set off others ----------
export function fireworks(ctx, th, lvName) {
  const lv = LEVELS[lvName] || LEVELS.normal;
  const game = {};
  const A = core(ctx, game);
  const sky = backdrop(A, th);
  let rockets = [], sparks = [], points = 0, combo = 0, launchIn = 0.6, lastTick = 0, ended = false, farIn = 0.5;
  const wave = waves(A, ctx);
  // the town's roofs along the bottom, and little fireworks far away that go off by themselves
  const roofs = Array.from({ length: 14 }, (_, i) => ({ w: rnd(0.06, 0.11), h: rnd(0.05, 0.13), win: Math.random() < 0.7, i }));
  let far = [];
  const total = lv.time;
  const COLORS = ['#FFD23F', '#FF5FA2', '#6FD3FF', '#9BE15D', '#FF922E', '#B78CFF'];
  const speed = () => lv.speed[0] + (lv.speed[1] - lv.speed[0]) * clamp(A.t / total, 0, 1);
  function boom(r, quality) {
    r.dead = true;
    const c = r.gold ? '#FFE066' : r.color, n = r.gold ? 46 : 30;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, v = rnd(110, 200) * (r.gold ? 1.3 : 1) * A.k; sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: Math.random() < 0.25 ? '#FFFFFF' : c, life: 1.2, max: 1.2 }); }
    A.burst(r.x, r.y, ['✨'], r.gold ? 6 : 3, { speed: 90, size: 18 });
    combo++;
    const m = multOf(combo), base = quality === 'perfect' ? 12 : quality === 'good' ? 7 : 3, got = base * m * (r.gold ? 2 : 1);
    points += got;
    A.float(r.x, r.y - 30, quality === 'perfect' ? ctx.tr('gPerfect') : `+${got}`, quality === 'perfect' ? '#FFE066' : '#fff', quality === 'perfect' ? 28 : 22);
    if (quality === 'perfect') A.float(r.x, r.y - 2, `+${got}`, '#fff', 20);
    if (m > multOf(combo - 1)) { A.float(A.W / 2, A.H * 0.15, `×${m}!`, '#FFE066', 40); playSfx(ctx, 'chime'); }
    playSfx(ctx, 'sparkle');
    // a big burst sets off the rockets right next to it
    for (const o of rockets) if (!o.dead && Math.hypot(o.x - r.x, o.y - r.y) < (r.gold ? 140 : 90)) setTimeout(() => { if (!o.dead && !ended) boom(o, 'good'); }, 120);
  }
  game.taps = true;
  game.down = (x, y) => {
    let best = null, bd = 70;
    for (const r of rockets) { if (r.dead) continue; const d = Math.hypot(r.x - x, r.y - y); if (d < bd) { bd = d; best = r; } }
    if (!best) return;
    // the slower it goes, the closer to the top: that's the best moment
    const k = Math.abs(best.vy) / best.v0;
    boom(best, k < 0.25 ? 'perfect' : k < 0.55 ? 'good' : 'early');
  };
  peek(() => ({ kind: 'fireworks', rockets, points }));
  game.frame = (dt) => {
    const { g, W, H } = A;
    const sp = speed(), left = total - A.t;
    sky(dt);
    farIn -= dt;
    if (farIn <= 0) { farIn = rnd(0.6, 1.4); far.push({ x: rnd(0.1, 0.9) * W, y: rnd(0.12, 0.45) * H, c: one(COLORS), t: 0 }); }
    for (const f of far) {
      f.t += dt;
      const r = f.t * 60 * A.k;
      g.globalAlpha = Math.max(0, 0.5 - f.t * 0.45);
      g.strokeStyle = f.c; g.lineWidth = 2;
      for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; g.beginPath(); g.moveTo(f.x + Math.cos(a) * r * 0.5, f.y + Math.sin(a) * r * 0.5); g.lineTo(f.x + Math.cos(a) * r, f.y + Math.sin(a) * r); g.stroke(); }
      g.globalAlpha = 1;
    }
    far = far.filter((f) => f.t < 1.1);
    let rx = 0;
    g.fillStyle = '#120F33';
    for (const r of roofs) { const w = r.w * W, h = r.h * H; g.fillRect(rx, H - h, w + 1, h); if (r.win) { g.fillStyle = '#FFE08A'; g.fillRect(rx + w * 0.3, H - h * 0.7, w * 0.18, h * 0.16); g.fillRect(rx + w * 0.6, H - h * 0.45, w * 0.18, h * 0.16); g.fillStyle = '#120F33'; } rx += w; if (rx > W) break; }
    launchIn -= dt * lv.dense * sp;
    wave();
    if (launchIn <= 0) {
      launchIn = rnd(0.5, 1);
      // a salvo now and then: two or three together
      const n = Math.random() < 0.3 + (sp - 1) * 0.3 ? (Math.random() < 0.4 ? 3 : 2) : 1;
      for (let i = 0; i < n; i++) {
        const v0 = rnd(H * 0.85, H * 1.15);
        rockets.push({ x: rnd(40, W - 40), y: H + 10, vy: -v0, v0, color: one(COLORS), gold: Math.random() < 0.08, dead: false, trail: [] });
      }
    }
    const grav = H * 0.75;
    for (const r of rockets) {
      if (r.dead) continue;
      r.vy += grav * dt * (0.7 + sp * 0.3);
      r.y += r.vy * dt * (0.7 + sp * 0.3);
      r.trail.push([r.x + rnd(-1, 1), r.y]);
      if (r.trail.length > 10) r.trail.shift();
      r.trail.forEach(([x, y], i) => { g.globalAlpha = i / 12; g.fillStyle = r.gold ? '#FFE066' : '#FFE9A8'; g.beginPath(); g.arc(x, y + 12, 3.4 * A.k, 0, Math.PI * 2); g.fill(); });
      g.globalAlpha = 1;
      A.emoji(r.gold ? '🌟' : '🎇', r.x, r.y, (r.gold ? 42 : 34) * A.k);
      // falling back without a tap: it fizzles
      if (r.vy > 0 && r.vy > r.v0 * 0.35) { r.dead = true; combo = 0; A.burst(r.x, r.y, ['💨'], 3, { speed: 40, size: 16 }); }
    }
    rockets = rockets.filter((r) => !r.dead);
    for (const s of sparks) {
      s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 90 * dt; s.vx *= 0.985;
      g.globalAlpha = clamp(s.life / s.max, 0, 1); g.fillStyle = s.c; g.beginPath(); g.arc(s.x, s.y, 3.4 * A.k, 0, Math.PI * 2); g.fill();
    }
    g.globalAlpha = 1;
    sparks = sparks.filter((s) => s.life > 0);
    A.timeBar(left, total);
    if (left < 10 && Math.floor(left) !== lastTick) { lastTick = Math.floor(left); playSfx(ctx, 'tick'); }
    hud(ctx, points, multOf(combo), left, {});
    if (left <= 0 && !ended) { ended = true; ctx.finish(points); }
  };
  A.start();
  return { cleanup: A.cleanup, stop: () => { ended = true; A.cleanup(); return points; } };
}

// ---------- the runner: the world runs by; tap to hop over what's in the way (tap again in the air to hop higher) ----------
export function runner(ctx, th, lvName) {
  const lv = LEVELS[lvName] || LEVELS.normal;
  const game = {};
  const A = core(ctx, game);
  const sky = backdrop(A, { ...th, ground: null });
  const wave = waves(A, ctx);
  const img = { ok: svgImage(ctx.svgOk), happy: svgImage(ctx.svgHappy), sad: svgImage(ctx.svgSad) };
  const P = { x: 0, y: 0, vy: 0, size: 80, jumps: 0, stun: 0, happy: 0 };
  const pw = { fly: 0, star: 0, magnet: 0 };
  let things = [], points = 0, combo = 0, dist = 0, nextObs = 1.6, nextItem = 0.8, powerIn = rnd(14, 20), lastTick = 0, ended = false;
  const total = lv.time;
  const speed = () => lv.speed[0] + (lv.speed[1] - lv.speed[0]) * clamp(A.t / total, 0, 1);
  const groundY = () => A.H - Math.max(110, A.H * 0.2);
  game.resize = () => { P.size = clamp(A.W * 0.25, 84, 120); P.x = A.W * 0.24; if (!P.y) P.y = groundY(); };
  game.taps = true;
  game.down = () => {
    if (pw.fly > 0) { P.vy = -A.H * 0.55; return; }
    if (P.jumps >= 2) return;
    P.vy = -A.H * (P.jumps ? 0.95 : 1.15);
    P.jumps++;
    playSfx(ctx, 'boing');
  };
  peek(() => ({ kind: 'runner', P, things, points }));
  game.frame = (dt) => {
    const { g, W, H } = A;
    const sp = speed(), left = total - A.t, run = W * 0.42 * sp;
    sky(dt, run);
    wave();
    for (const k in pw) pw[k] = Math.max(0, pw[k] - dt);
    // the ground, scrolling
    dist += run * dt;
    const gy = groundY();
    const top = gy + P.size * 0.45;
    g.fillStyle = th.ground || '#7CCB5C';
    g.fillRect(0, top, W, H - top);
    g.fillStyle = th.ground2 || '#6AB84E';
    for (let x = -(dist % 46); x < W + 46; x += 46) { g.beginPath(); g.moveTo(x, top); g.lineTo(x + 8, top - 9); g.lineTo(x + 16, top); g.fill(); }
    g.fillStyle = th.path || '#E9D7A8';
    g.fillRect(0, top + 26, W, 14);
    g.fillStyle = '#0000000d';
    for (let x = -((dist * 1.0) % 70); x < W; x += 70) g.fillRect(x, top + 30, 26, 5);
    // things come in from the right
    nextObs -= dt * sp * lv.dense;
    if (nextObs <= 0) {
      nextObs = rnd(1.15, 2) / Math.min(1.3, 0.8 + lv.bad * 0.25);
      const o = pickW(th.obstacles), os = (o.size || 40) * 1.25 * A.k;
      things.push({ ...o, kind: 'obs', x: W + 40, y: top - os * 0.42 - (o.air ? H * 0.2 : 0), size: os });
    }
    nextItem -= dt * sp;
    if (nextItem <= 0) {
      nextItem = rnd(0.45, 0.85);
      const it = pickW(th.items), high = Math.random() < 0.45, is = (it.size || 34) * 1.2 * A.k;
      // coins in a little arc now and then
      const n = Math.random() < 0.25 ? 4 : 1;
      for (let i = 0; i < n; i++) things.push({ ...it, kind: 'item', x: W + 40 + i * is * 1.2, y: gy - (high ? rnd(H * 0.18, H * 0.3) : rnd(10, 40)) - (n > 1 ? Math.sin((i / (n - 1)) * Math.PI) * 50 : 0), size: is });
    }
    powerIn -= dt;
    if (th.powers && powerIn <= 0) { powerIn = rnd(16, 24); const p = one(th.powers); things.push({ ...p, kind: 'power', x: W + 40, y: gy - H * 0.2, size: 46 * A.k }); }
    // Lucky hops
    P.stun -= dt; P.happy -= dt;
    P.vy += H * (pw.fly > 0 ? 1.4 : 3.1) * dt;
    P.y += P.vy * dt;
    const ceil = 80 + P.size * (pw.fly > 0 ? 1.3 : 0.6); // below the score and the time bar, balloons and all
    if (P.y < ceil) { P.y = ceil; P.vy = Math.max(0, P.vy); }
    if (P.y >= gy) { P.y = gy; P.vy = 0; P.jumps = 0; }
    if (pw.fly > 0) P.y = Math.min(P.y, gy);
    for (const t of things) {
      t.x -= run * dt;
      if (pw.magnet > 0 && t.kind === 'item') { t.x += (P.x - t.x) * Math.min(1, dt * 2); t.y += (P.y - P.size * 0.3 - t.y) * Math.min(1, dt * 2); }
      A.emoji(t.e, t.x, t.y + (t.kind !== 'obs' ? Math.sin(A.t * 4 + t.x * 0.02) * 4 : 0), t.size);
      const near = Math.abs(t.x - P.x) < (t.size + P.size) * 0.34 && Math.abs(t.y - (P.y - P.size * 0.15)) < (t.size + P.size) * 0.36;
      if (!near || t.done) continue;
      t.done = true;
      if (t.kind === 'obs') {
        if (pw.star > 0) { A.burst(t.x, t.y, ['💥', '✨'], 8); points += 5; playSfx(ctx, 'pop'); continue; }
        P.stun = 0.8; combo = 0; points = Math.max(0, points - 10); A.float(P.x, P.y - P.size, '−10', '#FF8080', 22); A.shake = 0.2; playSfx(ctx, 'bonk');
      } else if (t.kind === 'power') { pw[t.power] = t.power === 'star' ? 5 : 6; A.float(t.x, t.y - 20, POWER_ICON[t.power] + '!', '#9BF6FF', 30); A.burst(t.x, t.y, ['✨', '⭐'], 10); playSfx(ctx, 'sparkle'); }
      else {
        combo++;
        const m = multOf(combo), got = t.pts * m;
        points += got;
        A.float(t.x, t.y - 16, `+${got}`, m > 1 ? '#FFE066' : '#fff', m > 1 ? 24 : 20);
        if (m > multOf(combo - 1)) { A.float(W / 2, H * 0.3, `×${m}!`, '#FFE066', 40); playSfx(ctx, 'chime'); }
        A.burst(t.x, t.y, th.hit || ['✨'], t.pts >= 15 ? 10 : 4, { speed: 120, size: 16 });
        P.happy = 0.35;
        playSfx(ctx, t.pts >= 15 ? 'sparkle' : 'catch');
      }
    }
    things = things.filter((t) => t.x > -60 && !(t.done && t.kind !== 'obs'));
    const face = P.stun > 0 ? img.sad : P.happy > 0 ? img.happy : img.ok;
    if (pw.star > 0) { g.fillStyle = `hsla(${(A.t * 300) % 360}, 90%, 70%, .35)`; g.beginPath(); g.arc(P.x, P.y - P.size * 0.1, P.size * 0.6, 0, Math.PI * 2); g.fill(); }
    if (pw.fly > 0) { A.emoji('🎈', P.x - P.size * 0.25, P.y - P.size * 0.95, P.size * 0.45, { rot: Math.sin(A.t * 3) * 0.15 }); A.emoji('🎈', P.x + P.size * 0.2, P.y - P.size * 1.05, P.size * 0.42, { rot: Math.sin(A.t * 3 + 1) * 0.15 }); }
    A.image(face, P.x, P.y - P.size * 0.1, P.size, P.size * 1.05, { rot: P.vy < 0 ? -0.12 : P.y < gy ? 0.08 : Math.sin(A.t * 16) * 0.05, alpha: P.stun > 0 && Math.floor(A.t * 12) % 2 ? 0.5 : 1 });
    A.timeBar(left, total);
    if (left < 10 && Math.floor(left) !== lastTick) { lastTick = Math.floor(left); playSfx(ctx, 'tick'); }
    hud(ctx, points, multOf(combo), left, pw);
    if (left <= 0 && !ended) { ended = true; ctx.finish(points); }
  };
  A.start();
  return { cleanup: A.cleanup, stop: () => { A.cleanup(); return points; } };
}
