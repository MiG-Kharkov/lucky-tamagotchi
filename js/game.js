// Mini-games. Shared shell: start screen with Back, ✕ during play, result screen.
// Each game is run(ctx) → { stop(): score, cleanup() }. You can't lose, only score less.

import { PHRASES, DIALOGS } from './i18n.js';
import { speak } from './sound.js';

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

export const GAMES = [
  { id: 'catch', emoji: '🥕', energy: 12, great: 25, run: runCatch },
  { id: 'memory', emoji: '🧠', energy: 6, great: 22, run: runMemory },
  { id: 'simon', emoji: '🎵', energy: 6, great: 18, run: runSimon },
  { id: 'talk', emoji: '🗣️', energy: 5, great: 12, run: runTalk },
];

export function openGame(host, game, { tr, sfx, lang, svgOk, svgHappy, svgSad, onCancel, onEnd }) {
  host.innerHTML = `<div class="game g-${game.id}">
    <div class="game-stage"></div>
    <div class="game-hud"><button class="g-exit" aria-label="close">✕</button><span class="g-info" hidden></span></div>
    <div class="game-card"><div class="game-emoji">${game.emoji}</div><h2>${tr('g_' + game.id)}</h2><p>${tr('g_' + game.id + '_hint')}</p>
      <div class="row"><button class="btn big pink g-start">${tr('start')}</button></div>
      <div class="row"><button class="btn ghost g-cancel">${tr('back')}</button></div>
    </div>
  </div>`;
  const stage = host.querySelector('.game-stage');
  const card = host.querySelector('.game-card');
  const info = host.querySelector('.g-info');
  let inst = null, ended = false, final = 0;

  const ctx = {
    stage, sfx, lang, tr, svgOk, svgHappy, svgSad,
    info: (html) => { info.hidden = false; info.innerHTML = html; },
    end: (score, msg) => {
      if (ended) return;
      ended = true;
      final = score;
      inst?.cleanup();
      sfx.happy();
      card.innerHTML = `<div class="game-emoji">🎉</div><h2>${msg}</h2><div class="row"><button class="btn big pink">${tr('done')}</button></div>`;
      card.hidden = false;
      card.querySelector('button').onclick = () => onEnd(final);
    },
  };

  card.querySelector('.g-start').onclick = () => { card.hidden = true; sfx.happy(); inst = game.run(ctx); };
  card.querySelector('.g-cancel').onclick = () => { sfx.tap(); onCancel(); };
  host.querySelector('.g-exit').onclick = () => {
    sfx.tap();
    if (!inst) return onCancel();          // not started yet: the attempt is not used up
    if (ended) return onEnd(final);
    ended = true;
    onEnd(inst.stop());                    // left mid-game: count the score so far
  };
}

// ---------- Carrot Rain ----------

// Pizza is not for bunnies: catching it takes a point away
const DROPS = [{ e: '🥕', pts: 1, w: 55 }, { e: '🍓', pts: 2, w: 20 }, { e: '💗', pts: 1, w: 15 }, { e: '🌟', pts: 3, w: 10 }, { e: '🍕', pts: -1, w: 16 }];
const DROPS_W = DROPS.reduce((s, i) => s + i.w, 0);
const CATCH_SECONDS = 30;

function randomDrop() {
  let r = Math.random() * DROPS_W;
  for (const it of DROPS) { if ((r -= it.w) < 0) return it; }
  return DROPS[0];
}

function svgImage(svg) {
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  return img;
}

function runCatch(ctx) {
  const { stage, sfx } = ctx;
  stage.innerHTML = '<canvas></canvas>';
  const canvas = stage.querySelector('canvas');
  const g = canvas.getContext('2d');
  const imgOk = svgImage(ctx.svgOk), imgHappy = svgImage(ctx.svgHappy), imgYuck = svgImage(ctx.svgSad);
  let W = 0, H = 0;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    W = stage.clientWidth; H = stage.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const lw = () => Math.min(W * 0.3, 140);
  let lx = W / 2, target = W / 2, items = [], pops = [];
  let score = 0, t = 0, spawnIn = 0, happyFor = 0, yuckFor = 0, raf = 0, last = performance.now();
  const setTarget = (e) => { target = e.clientX - stage.getBoundingClientRect().left; };
  canvas.addEventListener('pointerdown', setTarget);
  canvas.addEventListener('pointermove', setTarget);
  const hud = () => ctx.info(`🥕 ${score} &nbsp; ⏱ ${Math.max(0, Math.ceil(CATCH_SECONDS - t))}`);
  hud();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;
    spawnIn -= dt;
    if (spawnIn <= 0) {
      const it = randomDrop();
      items.push({ ...it, x: 24 + Math.random() * (W - 48), y: -40, vy: H * (0.26 + Math.random() * 0.1 + t * 0.004), size: 34 + Math.random() * 10, rot: Math.random() * 6 });
      spawnIn = 0.4 + Math.random() * 0.4;
    }
    lx += (target - lx) * Math.min(1, dt * 12);
    const w = lw();
    const top = H - w * 1.05 - 60;

    const grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0, '#9ED8FF');
    grd.addColorStop(0.75, '#FFD9EE');
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#86D97D';
    g.beginPath(); g.moveTo(0, H - 70); g.quadraticCurveTo(W / 2, H - 120, W, H - 70); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();

    for (const it of items) {
      it.y += it.vy * dt;
      it.rot += dt;
      if (!it.done && it.y > top + w * 0.15 && it.y < top + w * 0.7 && Math.abs(it.x - lx) < w * 0.45) {
        it.done = true;
        if (it.pts < 0) {
          score = Math.max(0, score + it.pts);
          yuckFor = 0.6;
          happyFor = 0;
          pops.push({ x: it.x, y: top, life: 0.9, txt: '−1', bad: true });
          sfx.bonk();
        } else {
          score += it.pts;
          happyFor = 0.35;
          pops.push({ x: it.x, y: top, life: 0.8, txt: '+' + it.pts });
          sfx.catch();
        }
      }
      if (it.done) continue;
      g.save();
      g.translate(it.x, it.y);
      g.rotate(Math.sin(it.rot) * 0.3);
      g.font = `${it.size}px system-ui, "Apple Color Emoji"`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(it.e, 0, 0);
      g.restore();
    }
    items = items.filter((i) => !i.done && i.y < H + 50);

    happyFor -= dt;
    yuckFor -= dt;
    const img = yuckFor > 0 ? imgYuck : happyFor > 0 ? imgHappy : imgOk;
    const shake = yuckFor > 0 ? Math.sin(t * 60) * 6 : 0; // yuck, pizza!
    if (img.complete) g.drawImage(img, lx - w / 2 + shake, top, w, w * 1.05);

    for (const p of pops) {
      p.life -= dt;
      p.y -= 60 * dt;
      g.globalAlpha = Math.max(0, p.life / 0.8);
      g.font = 'bold 26px ui-rounded, system-ui';
      g.fillStyle = p.bad ? '#7A5A86' : '#FF3E8E';
      g.textAlign = 'center';
      g.fillText(p.txt, p.x, p.y);
      g.globalAlpha = 1;
    }
    pops = pops.filter((p) => p.life > 0);
    hud();
    if (t >= CATCH_SECONDS) return ctx.end(score, ctx.tr('gameEnd', { n: score }));
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  const cleanup = () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  return { cleanup, stop: () => { cleanup(); return score; } };
}

// ---------- Ninja Memory ----------

function runMemory(ctx) {
  const { stage, sfx } = ctx;
  const set = ['🐰', '🥕', '🌸', '🥷', '🐶', '🍓'];
  const cards = shuffle([...set, ...set]);
  let open = [], moves = 0, found = 0, lock = false;
  const timers = [];
  stage.innerHTML = `<div class="mem">${cards.map((e, i) => `<button class="mem-card" data-i="${i}"><span class="mc-back">🐾</span><span class="mc-face">${e}</span></button>`).join('')}</div>`;
  const hud = () => ctx.info(ctx.tr('memMoves', { n: moves }));
  hud();
  stage.querySelectorAll('.mem-card').forEach((b) => {
    b.onclick = () => {
      if (lock || b.classList.contains('flip')) return;
      b.classList.add('flip');
      sfx.tap();
      open.push(b);
      if (open.length < 2) return;
      moves++;
      hud();
      const [a, c] = open;
      open = [];
      if (cards[a.dataset.i] === cards[c.dataset.i]) {
        a.classList.add('match');
        c.classList.add('match');
        sfx.catch();
        if (++found === set.length) {
          timers.push(setTimeout(() => ctx.end(Math.max(6, Math.min(30, 30 - (moves - 6) * 2)), ctx.tr('memEnd', { n: moves })), 700));
        }
      } else {
        lock = true;
        timers.push(setTimeout(() => { a.classList.remove('flip'); c.classList.remove('flip'); lock = false; }, 850));
      }
    };
  });
  const cleanup = () => timers.forEach(clearTimeout);
  return { cleanup, stop: () => { cleanup(); return found * 2; } };
}

// ---------- Copy Lucky ----------

function runSimon(ctx) {
  const { stage, sfx } = ctx;
  const pads = [
    { e: '🌸', c: '#FF7AB8', f: 523 }, { e: '🦋', c: '#9B7BFF', f: 659 },
    { e: '⭐', c: '#FFD23F', f: 784 }, { e: '🍀', c: '#4CD37B', f: 988 },
  ];
  const MAX = 12;
  stage.innerHTML = `<div class="simon">
    <div class="simon-lucky">${ctx.svgOk}</div>
    <div class="simon-msg"></div>
    <div class="simon-grid">${pads.map((p, i) => `<button class="pad" data-i="${i}" style="--c:${p.c}">${p.e}</button>`).join('')}</div>
  </div>`;
  const btns = [...stage.querySelectorAll('.pad')];
  const msg = stage.querySelector('.simon-msg');
  let seq = [], pos = 0, accepting = false, best = 0;
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const hud = () => ctx.info(`🎵 ${best}`);
  hud();

  function flash(i) {
    btns[i].classList.add('lit');
    sfx.note(pads[i].f);
    later(() => btns[i].classList.remove('lit'), 380);
  }

  function nextRound() {
    seq.push(Math.floor(Math.random() * 4));
    pos = 0;
    accepting = false;
    msg.textContent = ctx.tr('simonWatch');
    const gap = Math.max(420, 700 - seq.length * 25);
    seq.forEach((i, k) => later(() => flash(i), 500 + k * gap));
    later(() => { accepting = true; msg.textContent = ctx.tr('simonYour'); }, 500 + seq.length * gap);
  }

  btns.forEach((b) => {
    b.onclick = () => {
      if (!accepting) return;
      const i = Number(b.dataset.i);
      flash(i);
      if (i !== seq[pos]) {
        accepting = false;
        later(() => ctx.end(best * 3, ctx.tr('simonEnd', { n: best })), 500);
        return;
      }
      if (++pos < seq.length) return;
      accepting = false;
      best = seq.length;
      hud();
      if (best >= MAX) later(() => ctx.end(best * 3, ctx.tr('simonEnd', { n: best })), 600);
      else { msg.textContent = '💗'; later(nextRound, 800); }
    };
  });
  later(nextRound, 400);
  const cleanup = () => timers.forEach(clearTimeout);
  return { cleanup, stop: () => { cleanup(); return best * 3; } };
}

// ---------- Chat with Lucky ----------
// Lucky asks a question out loud, the child picks one of three answers.

function runTalk(ctx) {
  const { stage, sfx, tr } = ctx;
  // Questions are always in English, the hint is in Russian
  const target = 1;
  const hintIdx = 0;
  const tLang = 'en';
  const ROUNDS = 5;
  const byEn = (en) => PHRASES.find((p) => p[1] === en);
  const all = DIALOGS.map(([q, a, topic]) => ({ q: byEn(q), a: byEn(a), topic })).filter((d) => d.q && d.a);
  const rounds = shuffle(all).slice(0, ROUNDS);
  let r = 0, score = 0, right = 0;
  const timers = [];

  function round() {
    const d = rounds[r];
    let tries = 0;
    const wrong = shuffle(all.filter((x) => x.topic !== d.topic)).slice(0, 2).map((x) => x.a);
    const opts = shuffle([d.a, ...wrong]);
    ctx.info(tr('talkRound', { n: r + 1, m: ROUNDS }));
    stage.innerHTML = `<div class="talk">
      <div class="talk-lucky">${ctx.svgOk}</div>
      <button class="talk-q"><span>${d.q[target]}</span> <span class="spk">🔊</span></button>
      <button class="talk-hint">${tr('talkHint')}</button><div class="talk-tr" hidden>${d.q[hintIdx]}</div>
      <div class="talk-opts">${opts.map((o, i) => `<button class="talk-opt" data-i="${i}">${o[target]}</button>`).join('')}</div>
    </div>`;
    const face = stage.querySelector('.talk-lucky');
    stage.querySelector('.talk-q').onclick = () => speak(d.q[target], tLang);
    stage.querySelector('.talk-hint').onclick = (e) => { sfx.tap(); e.currentTarget.hidden = true; stage.querySelector('.talk-tr').hidden = false; };
    timers.push(setTimeout(() => speak(d.q[target], tLang), 300));
    stage.querySelectorAll('.talk-opt').forEach((b) => {
      b.onclick = () => {
        if (b.disabled || stage.querySelector('.talk-opt.right')) return;
        const o = opts[b.dataset.i];
        speak(o[target], tLang);
        if (o !== d.a) {
          tries++;
          sfx.tap();
          b.disabled = true;
          b.classList.add('wrong');
          return;
        }
        b.classList.add('right');
        sfx.catch();
        face.innerHTML = ctx.svgHappy;
        if (tries === 0) right++;
        score += tries === 0 ? 3 : 1;
        r++;
        timers.push(setTimeout(() => (r < ROUNDS ? round() : ctx.end(score, tr('talkEnd', { n: right, m: ROUNDS }))), 2200));
      };
    });
  }
  round();
  const cleanup = () => timers.forEach(clearTimeout);
  return { cleanup, stop: () => { cleanup(); return score; } };
}
