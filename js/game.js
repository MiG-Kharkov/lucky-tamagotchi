// Mini-games. Shared shell: start screen with Back, ✕ during play, result screen.
// Each game is run(ctx) → { stop(): score, cleanup() }. You can't lose, only score less.
// The usual four are played on ordinary days; while a holiday is on, its three games (holigames.js) take their place.
// The games with a target (all but Chat with Lucky) have a difficulty to choose (easy, normal, hard), count points and
// end with ctx.finish(points): stars, the best score at that difficulty, a record; the game's 0-30 score (for hearts)
// is the points against the game's target.

import { PHRASES, DIALOGS, T } from './i18n.js';
import { speak } from './sound.js';
import { LEVEL_IDS } from './arcade.js';
import { HOLIDAY_GAMES } from './holigames.js';

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

// The usual games have the three difficulties too: Carrot Rain lasts longer and falls faster, Memory has more pairs,
// Copy Lucky's tunes grow longer (targets: as for the holiday games of the same kind)
const MEMORY_THEME = { faces: ['🐰', '🥕', '🌸', '🥷', '🐶', '🍓', '🦋', '⭐', '🍀', '🌈'], back: '🐾' };
export const GAMES = [
  { id: 'catch', emoji: '🥕', energy: 12, great: 24, target: { easy: 300, normal: 450, hard: 600 }, run: (ctx) => runCatch(ctx) },
  { id: 'memory', emoji: '🧠', energy: 6, great: 24, target: { easy: 550, normal: 800, hard: 1100 }, run: (ctx) => runMemory(ctx, MEMORY_THEME) },
  { id: 'simon', emoji: '🎵', energy: 6, great: 24, target: { easy: 360, normal: 550, hard: 800 }, run: (ctx) => runSimon(ctx, {}) },
  { id: 'talk', emoji: '🗣️', energy: 5, great: 12, run: runTalk },
];

// the holiday games run their kind with the holiday's theme at the chosen difficulty
for (const list of Object.values(HOLIDAY_GAMES)) {
  for (const gm of list) {
    gm.great = 24;
    gm.holiday = true;
    gm.run = (ctx) => (gm.kind === 'memory' ? runMemory(ctx, gm.theme) : gm.kind === 'simon' ? runSimon(ctx, gm.theme) : gm.kind(ctx, gm.theme, ctx.level));
  }
}
export { HOLIDAY_GAMES };

const LEVEL_ICON = { easy: '🐢', normal: '🐇', hard: '🚀' };
// stars from the points: three at the target, two from 55% of it, one for playing
export const starsOf = (points, target) => (points >= target ? 3 : points >= target * 0.55 ? 2 : 1);
const scoreOf = (points, target) => Math.round(30 * Math.min(1, points / target));

// level: the difficulty chosen last time; bestOf(level): the best points there; onLevel(level): remember the choice;
// onRecord(level, points): true when it's a new best. onStart(): the game has begun (it counts from here);
// onScore(score): the game is over, keep what it earned (right away, before the end card is closed);
// onEnd(score): the end card is closed (or the game was left)
export function openGame(host, game, { tr, sfx, lang, translate = true, svgOk, svgHappy, svgSad, level = 'normal', bestOf = () => 0, onLevel, onRecord, onStart, onScore, onCancel, onEnd }) {
  const levels = !!game.target;
  const hint = 'g_' + game.id + '_hint', hintSub = translate ? T(lang === 'ru' ? 'en' : 'ru', hint) : '';
  host.innerHTML = `<div class="game g-${game.id}${game.holiday ? ' g-holiday' : ''}">
    <div class="game-stage"></div>
    <div class="game-hud"><button class="g-exit" aria-label="close">✕</button><span class="g-info" hidden></span></div>
    <div class="game-card"><div class="game-emoji">${game.emoji}</div><h2>${tr('g_' + game.id)}</h2><p>${tr(hint)}${hintSub ? `<small class="g-sub">${hintSub}</small>` : ''}</p>
      ${levels ? `<div class="g-levels">${LEVEL_IDS.map((l) => `<button class="g-level${l === level ? ' on' : ''}" data-l="${l}"><b>${LEVEL_ICON[l]}</b>${tr('lvl_' + l)}</button>`).join('')}</div><p class="g-best"></p>` : ''}
      <div class="row"><button class="btn big pink g-start">${tr('start')}</button></div>
      <div class="row"><button class="btn ghost g-cancel">${tr('back')}</button></div>
    </div>
  </div>`;
  const stage = host.querySelector('.game-stage');
  const card = host.querySelector('.game-card');
  const info = host.querySelector('.g-info');
  let inst = null, ended = false, final = 0;
  // the end card's button wakes up after a moment, so a tap meant for the game doesn't close it unseen
  const doneButton = () => { const b = card.querySelector('.row .btn'); b.disabled = true; setTimeout(() => { b.disabled = false; }, 700); b.onclick = () => onEnd(final); };
  // the best points at this difficulty; three stars here already: the next difficulty is suggested
  const showBest = () => {
    const el = card.querySelector('.g-best'), b = bestOf(level), next = LEVEL_IDS[LEVEL_IDS.indexOf(level) + 1];
    if (!el) return;
    const up = next && b >= game.target[level];
    el.innerHTML = (b ? `🏆 ${tr('gBest', { n: b })}` : '') + (up ? `<br><span class="g-next">⭐⭐⭐ ${tr('gTryNext', { x: tr('lvl_' + next) })}</span>` : '');
    card.querySelectorAll('.g-level').forEach((x) => x.classList.toggle('suggest', !!up && x.dataset.l === next));
  };
  showBest();
  card.querySelectorAll('.g-level').forEach((b) => {
    b.onclick = () => { sfx.tap(); level = b.dataset.l; card.querySelectorAll('.g-level').forEach((x) => x.classList.toggle('on', x === b)); onLevel?.(level); showBest(); };
  });

  const ctx = {
    stage, sfx, lang, tr, svgOk, svgHappy, svgSad,
    get level() { return level; },
    info: (html) => { info.hidden = false; info.innerHTML = html; },
    // the holiday games end with their points
    finish: (points) => {
      if (ended) return;
      ended = true;
      const target = game.target[level];
      final = scoreOf(points, target);
      inst?.cleanup();
      onScore?.(final);
      const stars = starsOf(points, target), record = onRecord?.(level, points);
      sfx.levelup();
      card.innerHTML = `<div class="g-stars">${[1, 2, 3].map((i) => `<i class="${i <= stars ? 'on' : ''}">⭐</i>`).join('')}</div>
        <h2>${tr('gPoints', { n: points })}</h2>
        ${record ? `<p class="g-record">🏆 ${tr('gNewBest')}</p>` : `<p class="g-best">🏆 ${tr('gBest', { n: bestOf(level) })}</p>`}
        <div class="row"><button class="btn big pink">${tr('done')}</button></div>`;
      card.hidden = false;
      doneButton();
    },
    end: (score, msg) => {
      if (ended) return;
      ended = true;
      final = score;
      inst?.cleanup();
      onScore?.(final);
      sfx.happy();
      card.innerHTML = `<div class="game-emoji">🎉</div><h2>${msg}</h2><div class="row"><button class="btn big pink">${tr('done')}</button></div>`;
      card.hidden = false;
      doneButton();
    },
  };

  card.querySelector('.g-start').onclick = () => { if (inst) return; card.hidden = true; sfx.happy(); onStart?.(); inst = game.run(ctx); };
  card.querySelector('.g-cancel').onclick = () => { sfx.tap(); onCancel(); };
  host.querySelector('.g-exit').onclick = () => {
    sfx.tap();
    if (!inst) return onCancel();          // not started yet: the attempt is not used up
    if (ended) return onEnd(final);
    ended = true;
    const got = inst.stop();               // left mid-game: the score so far counts
    final = levels ? scoreOf(got, game.target[level]) : got;
    onScore?.(final);
    onEnd(final);
  };
}

// ---------- Carrot Rain ----------

// Pizza is not for bunnies: catching it takes a point away
const DROPS = [{ e: '🥕', pts: 1, w: 55 }, { e: '🍓', pts: 2, w: 20 }, { e: '💗', pts: 1, w: 15 }, { e: '🌟', pts: 3, w: 10 }, { e: '🍕', pts: -1, w: 16 }];
const DROPS_W = DROPS.reduce((s, i) => s + i.w, 0);
// how long it rains and how fast things fall at each difficulty
const CATCH_LEVEL = { easy: { secs: 30, speed: 1 }, normal: { secs: 45, speed: 1.15 }, hard: { secs: 60, speed: 1.3 } };

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

// points: ten for each one caught (a carrot 1, a strawberry 2, a star 3; pizza takes one away)
function runCatch(ctx) {
  const { stage, sfx } = ctx;
  const { secs: CATCH_SECONDS, speed } = CATCH_LEVEL[ctx.level] || CATCH_LEVEL.easy;
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
      items.push({ ...it, x: 24 + Math.random() * (W - 48), y: -40, vy: H * (0.26 + Math.random() * 0.1 + Math.min(t, 30) * 0.004) * speed, size: 34 + Math.random() * 10, rot: Math.random() * 6 });
      spawnIn = (0.4 + Math.random() * 0.4) / speed;
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
    if (t >= CATCH_SECONDS) return ctx.finish(score * 10);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  const cleanup = () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  return { cleanup, stop: () => { cleanup(); return score * 10; } };
}

// ---------- Ninja Memory ----------

function runMemory(ctx, theme) {
  const { stage, sfx } = ctx;
  const pairs = { easy: 6, normal: 8, hard: 10 }[ctx.level] || 8;
  const set = shuffle(theme.faces).slice(0, pairs);
  const cards = shuffle([...set, ...set]);
  let open = [], moves = 0, found = 0, lock = false, points = 0, streak = 0;
  const t0 = performance.now();
  const timers = [];
  // the time bonus counts only the time the cards are on the screen (not in the background, not turned sideways)
  const sideways = matchMedia('(orientation: landscape) and (max-height: 540px)');
  let away = 0, awaySince = 0;
  const onAway = () => {
    const off = document.hidden || sideways.matches;
    if (off && !awaySince) awaySince = performance.now();
    else if (!off && awaySince) { away += performance.now() - awaySince; awaySince = 0; }
  };
  document.addEventListener('visibilitychange', onAway);
  sideways.addEventListener?.('change', onAway);
  stage.innerHTML = `<div class="mem mem-${pairs}">${cards.map((e, i) => `<button class="mem-card" data-i="${i}"><span class="mc-back">${theme.back}</span><span class="mc-face">${e}</span></button>`).join('')}</div>`;
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${ctx.tr('memMoves', { n: moves })}`);
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
        // pairs found one after another are worth more
        streak++;
        points += 40 * Math.min(streak, 5);
        hud();
        if (++found === set.length) {
          const secs = (performance.now() - t0 - away) / 1000;
          points += Math.max(0, pairs * 30 - (moves - pairs) * 10) + Math.max(0, Math.round(pairs * 25 - secs * 2));
          hud(); // the bonus shows in the pill too, so it matches the end card
          timers.push(setTimeout(() => ctx.finish(points), 700));
        }
      } else {
        streak = 0;
        lock = true;
        timers.push(setTimeout(() => { a.classList.remove('flip'); c.classList.remove('flip'); lock = false; }, 850));
      }
    };
  });
  const cleanup = () => { timers.forEach(clearTimeout); document.removeEventListener('visibilitychange', onAway); sideways.removeEventListener?.('change', onAway); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Copy Lucky ----------

function runSimon(ctx, theme) {
  const { stage, sfx } = ctx;
  const pads = theme.pads || [
    { e: '🌸', c: '#FF7AB8', f: 523 }, { e: '🦋', c: '#9B7BFF', f: 659 },
    { e: '⭐', c: '#FFD23F', f: 784 }, { e: '🍀', c: '#4CD37B', f: 988 },
  ];
  // a theme with a song can set how much of it each level plays (the whole song on Hard)
  const MAX = (theme.max || { easy: 10, normal: 16, hard: 24 })[ctx.level] || 16;
  const pace = { easy: 1.1, normal: 1, hard: 0.8 }[ctx.level] || 1;
  let points = 0;
  stage.innerHTML = `<div class="simon">
    <div class="simon-lucky">${ctx.svgOk}</div>
    <div class="simon-msg"></div>
    <div class="simon-grid${pads.length > 4 ? ' many' : ''}">${pads.map((p, i) => `<button class="pad" data-i="${i}" style="--c:${p.c}">${p.e}</button>`).join('')}</div>
  </div>`;
  const btns = [...stage.querySelectorAll('.pad')];
  const msg = stage.querySelector('.simon-msg');
  let seq = [], pos = 0, accepting = false, best = 0;
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const hud = () => ctx.info(`⭐ ${points} &nbsp;🎵 ${best}`);
  hud();

  // a pad lights up for its note. Each pad has one timer and lights again from the start, and while Lucky plays
  // the flash is shorter than the gap: seven E's in a row are seven flashes, not one long glow
  const off = [];
  function flash(i, ms = 380) {
    const b = btns[i];
    clearTimeout(off[i]);
    b.classList.remove('lit');
    void b.offsetWidth;
    b.classList.add('lit');
    sfx.note(pads[i].f);
    off[i] = setTimeout(() => b.classList.remove('lit'), ms);
    timers.push(off[i]);
  }

  function nextRound() {
    seq.push(theme.melody ? theme.melody[seq.length % theme.melody.length] : Math.floor(Math.random() * pads.length));
    pos = 0;
    accepting = false;
    msg.textContent = ctx.tr('simonWatch');
    const gap = Math.max(300, (700 - seq.length * 25) * pace);
    seq.forEach((i, k) => later(() => flash(i, Math.min(380, gap - 120)), 500 + k * gap));
    later(() => { accepting = true; msg.textContent = ctx.tr('simonYour'); }, 500 + seq.length * gap);
  }

  btns.forEach((b) => {
    b.onclick = () => {
      if (!accepting) return;
      const i = Number(b.dataset.i);
      flash(i);
      if (i !== seq[pos]) {
        accepting = false;
        later(() => ctx.finish(points), 500);
        return;
      }
      if (++pos < seq.length) return;
      accepting = false;
      best = seq.length;
      points += best * 10;
      hud();
      if (best >= MAX) later(() => ctx.finish(points + 200), 600);
      else { msg.textContent = '⭐'; later(nextRound, 800); }
    };
  });
  later(nextRound, 400);
  const cleanup = () => timers.forEach(clearTimeout);
  return { cleanup, stop: () => { cleanup(); return points; } };
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
