// Brain games: four puzzles in the spirit of the Brain Evolution test (memory, a chain of sums, same-colour
// rectangles, who's who by features), made simple and friendly for a child. No time pressure except in Squares, no
// points taken away, three difficulties. They are not part of the rounds of games: she can play them as much as she
// likes (the hearts they give have a daily cap in main.js). Lucky sits in a corner and plays along.
// Each game is run(ctx) → { stop(): points, cleanup() } and ends with ctx.finish(points) (see game.js).
//
// How to play: the first time she opens a game (and any time with "How to play" on its card, ctx.demo), Lucky plays a
// round himself, slowly: a finger shows each step and he says it out loud. In the game, when she is stuck for a few
// seconds, the finger shows the next move (in the chain, blocks to count). The questions show what to look for as a
// picture too. English first, the Russian small under it.

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const wait = (list, ms) => new Promise((r) => list.push(setTimeout(r, ms)));

// ---------- the features (Remember! and Who's who?) ----------
const COLORS = [['pink', '#FF5FA2', ['розовые', 'pink']], ['blue', '#4D9BFF', ['синие', 'blue']], ['green', '#3DBA63', ['зелёные', 'green']], ['yellow', '#FFC21A', ['жёлтые', 'yellow']]];
const SHAPES = [['circle', ['кружочки', 'circles']], ['square', ['квадратики', 'squares']], ['triangle', ['треугольники', 'triangles']], ['star', ['звёздочки', 'stars']]];
const MOTIONS = [['still', ['неподвижные', 'still']], ['bounce', ['прыгающие', 'bouncing']], ['spin', ['крутящиеся', 'spinning']]];
const EARS = [['up', ['ушки торчком', 'ears up']], ['lop', ['висячие ушки', 'lop ears']]];
const FURS = [['ginger', '#F4A261', ['рыжий', 'ginger']], ['white', '#FFFFFF', ['белый', 'white']], ['grey', '#B8B8C8', ['серый', 'grey']], ['brown', '#9A6B4A', ['шоколадный', 'brown']]];
const MARKS = [['plain', ['без пятнышек', 'no spots']], ['spots', ['в пятнышках', 'with spots']], ['stripe', ['с полоской', 'with a stripe']]];
const THINGS = [['none', ['без украшений', 'nothing on']], ['bow', ['с бантиком', 'with a bow']], ['hat', ['в шляпе', 'in a hat']], ['glasses', ['в очках', 'in glasses']]];
const FEATURES = { ears: EARS, fur: FURS, mark: MARKS, thing: THINGS };
const wordOf = (k, v) => { const it = FEATURES[k].find((x) => x[0] === v); return k === 'fur' ? it[2] : it[1]; };
// "not this one": what the right bunny has
const NOT = {
  'ears:up': ['у нашего ушки торчком', 'ours has its ears up'], 'ears:lop': ['у нашего висячие ушки', 'ours has lop ears'],
  'fur:ginger': ['наш рыжий', 'ours is ginger'], 'fur:white': ['наш белый', 'ours is white'], 'fur:grey': ['наш серый', 'ours is grey'], 'fur:brown': ['наш шоколадный', 'ours is brown'],
  'mark:plain': ['наш без пятнышек', 'ours has no spots'], 'mark:spots': ['наш в пятнышках', 'ours has spots'], 'mark:stripe': ['у нашего полоска', 'ours has a stripe'],
  'thing:none': ['на нашем ничего нет', 'ours has nothing on'], 'thing:bow': ['у нашего бантик', 'ours has a bow'], 'thing:hat': ['наш в шляпе', 'ours has a hat'], 'thing:glasses': ['наш в очках', 'ours has glasses'],
};

// Lucky's words in the brain games ([ru, en]); they are voiced (tools/gen-voices.mjs)
export const BRAIN_LINES = {
  yay: [['Ура!', 'Hooray!'], ['Отлично!', 'Brilliant!'], ['Вот это да!', 'Wow!'], ['Умница!', 'Clever you!'], ['Точно!', 'Spot on!']],
  oops: [['Почти!', 'Almost!'], ['Ничего, бывает!', 'Never mind, it happens!'], ['Попробуй ещё!', 'Try again!'], ['Я бы тоже ошибся!', "I'd have got that wrong too!"]],
  yourTurn: [['Вот так! Теперь ты!', "That's how! Now it's your turn!"]],
  remStart: [['Запоминай хорошенько!', 'Remember them well!']],
  remHow1: [['Смотри! Запомни, где какие фигурки.', 'Look! Remember where the shapes are.']],
  remHow2: [['Запомнила? Нажимай «Запомнила!».', "Remembered them? Tap 'Got it!'"]],
  remHow3: [['Фигурки спрятались! Теперь найди все розовые.', 'The shapes are hiding! Now find all the pink ones.']],
  remHow4: [['Нажимаю там, где они были. Нашёл!', 'I tap where they were. Found them!']],
  remHint: [['Подсказка: одна была вот здесь!', 'A hint: one was right here!']],
  chainStart: [['Каждый ответ — начало следующего примера!', 'Each answer starts the next sum!']],
  chainHow1: [['Смотри на пример. Сколько получится?', 'Look at the sum. What does it make?']],
  chainHow2: [['Не знаешь? Посчитай кубики!', 'Not sure? Count the blocks!']],
  chainHow3: [['Нажимаю ответ: пять!', 'I tap the answer: five!']],
  chainHow4: [['Ответ стал началом нового примера!', 'The answer starts the next sum!']],
  chainHint: [['Посчитай кубики, это поможет!', 'Count the blocks, they help!']],
  sqStart: [['Найди четыре одинаковых уголка!', 'Find four corners of the same colour!']],
  sqHow1: [['Смотри: четыре розовых квадратика — это уголки коробочки.', 'Look: four pink squares are the corners of a box.']],
  sqHow2: [['Нажимаю один уголок…', 'I tap one corner…']],
  sqHow3: [['…и уголок напротив. Хлоп!', '…and the corner across from it. Pop!']],
  sqHint: [['Подсказка: вот уголки одной коробочки!', 'A hint: here are the corners of a box!']],
  whoStart: [['Найди кролика по приметам!', 'Find the bunny that fits the clues!']],
  whoHow1: [['Читаем приметы. Нажми на примету, и мы проверим кроликов.', 'Read the clues. Tap a clue, and we check the bunnies.']],
  whoHow2: [['Серый? Кто не серый, тот не подходит.', "Grey? Whoever isn't grey can't be it."]],
  whoHow3: [['С бантиком? Остался только один кролик!', 'With a bow? Only one bunny is left!']],
  whoHint: [['Нажми на примету, я помогу проверить!', "Tap a clue, and I'll help you check!"]],
  whoNot: Object.fromEntries(Object.entries(NOT).map(([k, [ru, en]]) => [k, [[`Не этот: ${ru}!`, `Not this one: ${en}!`]]])),
};
const BL = BRAIN_LINES;

// ---------- what every brain game shares ----------

// Lucky in the corner: his face and a word now and then, said out loud (English; the Russian under it when translating)
function luckyCorner(ctx) {
  const box = document.createElement('div');
  box.className = 'bg-lucky';
  box.innerHTML = `<div class="bgl-pic">${ctx.svgOk}</div><div class="bgl-say" hidden></div>`;
  ctx.stage.appendChild(box);
  const pic = box.querySelector('.bgl-pic'), bubble = box.querySelector('.bgl-say');
  let t = 0;
  return {
    // pair: [ru, en]; hold: stays until the next word (the demo)
    say(pair, face = 'ok', hold = false) {
      pic.innerHTML = face === 'happy' ? ctx.svgHappy : face === 'sad' ? ctx.svgSad : ctx.svgOk;
      pic.classList.remove('hop');
      void pic.offsetWidth;
      if (face === 'happy') pic.classList.add('hop');
      if (!pair) return;
      const [ru, en] = pair;
      bubble.innerHTML = `${ctx.lang === 'ru' ? ru : en}${ctx.translate ? `<small>${ctx.lang === 'ru' ? en : ru}</small>` : ''}`;
      bubble.hidden = false;
      ctx.speak?.(pair);
      clearTimeout(t);
      if (!hold) t = setTimeout(() => { bubble.hidden = true; }, 3200);
    },
    stop() { clearTimeout(t); },
  };
}
const sayOne = (lucky, list, face, hold) => lucky.say(pick(list), face, hold);

// A finger that shows what to do: it moves to a thing and taps it
function coach(ctx) {
  const hand = document.createElement('div');
  hand.className = 'bg-hand';
  hand.hidden = true;
  hand.textContent = '👆';
  ctx.stage.appendChild(hand);
  const T = [];
  const centre = (el) => { const s = ctx.stage.getBoundingClientRect(), r = el.getBoundingClientRect(); return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2]; };
  return {
    async to(el, tap = true) {
      if (!el) return;
      const [x, y] = centre(el);
      if (hand.hidden) {
        hand.style.transition = 'none';
        hand.style.translate = `${x}px ${y + 70}px`;
        hand.hidden = false;
        void hand.offsetWidth;
        hand.style.transition = '';
      }
      hand.style.translate = `${x}px ${y}px`;
      await wait(T, 600);
      if (!tap) return;
      hand.classList.remove('tap');
      void hand.offsetWidth;
      hand.classList.add('tap');
      el.classList.remove('bg-ping');
      void el.offsetWidth;
      el.classList.add('bg-ping');
      await wait(T, 320);
    },
    hide() { hand.hidden = true; },
    stop() { T.forEach(clearTimeout); hand.hidden = true; },
  };
}

// The demo: her taps are held off, a "How to play" sign and a Skip button
function demoShield(ctx, onSkip) {
  const sh = document.createElement('div');
  sh.className = 'bg-shield';
  sh.innerHTML = `<span class="bg-demo-tag">👀 ${ctx.tr('howToPlay')}</span><button class="bg-skip">${ctx.tr('skip')} ⏭</button>`;
  ctx.stage.appendChild(sh);
  sh.querySelector('.bg-skip').onclick = (e) => { e.stopPropagation(); onSkip(); };
  return sh;
}

// Stuck for a while: one hint (again after the next move)
function idleWatch(ms, hint) {
  let at = Date.now(), given = false, on = true;
  const id = setInterval(() => { if (on && !given && Date.now() - at > ms) { given = true; hint(); } }, 500);
  return { reset() { at = Date.now(); given = false; }, pause(v) { on = !v; at = Date.now(); }, stop() { clearInterval(id); } };
}

// Runs the game's demo when asked (ctx.demo), then the game itself
function demoOrPlay(ctx, { demo, play, lucky, hand, demoT }) {
  let shield = null, on = false;
  const end = () => {
    if (!on) return;
    on = false;
    demoT.forEach(clearTimeout);
    demoT.length = 0;
    shield?.remove();
    hand.stop();
    ctx.howDone?.();
    play(true);
  };
  if (ctx.demo) {
    on = true;
    shield = demoShield(ctx, end);
    demo(() => on).then(() => end());
  } else play(false);
  return { get on() { return on; }, end };
}

// ---------- Remember! (a field of shapes: remember it, then find all the ones asked for) ----------
const shapeSvg = (shape, color) => {
  const inner = shape === 'circle' ? `<circle cx="20" cy="20" r="15" fill="${color}"/>`
    : shape === 'square' ? `<rect x="6" y="6" width="28" height="28" rx="5" fill="${color}"/>`
      : shape === 'triangle' ? `<path d="M20 4 L36 34 H4Z" fill="${color}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`
        : `<path d="M20 3 l4.9 10 11 1.6 -8 7.8 1.9 11 -9.8 -5.2 -9.8 5.2 1.9 -11 -8 -7.8 11 -1.6z" fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 40 40">${inner}<circle cx="15" cy="15" r="3" fill="#fff" opacity=".45"/></svg>`;
};
// what to look for, as a picture: the colour on two shapes (any shape), the shape in grey (any colour), the motion
const sampleOf = (keys, f) => {
  const color = keys.includes('color') ? COLORS.find((c) => c[0] === f.color)[1] : '#B9AACB';
  const shapes = keys.includes('shape') ? [f.shape] : ['circle', 'star'];
  const m = keys.includes('motion') ? f.motion : 'still';
  return `<span class="rem-sample">${shapes.map((s) => `<span class="rem-mini m-${m}">${shapeSvg(s, color)}</span>`).join('')}</span>`;
};

function runRemember(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { cols: 3, rows: 3, n: [3, 4], show: 7, feats: ['color', 'shape'] }, normal: { cols: 4, rows: 3, n: [4, 5], show: 7, feats: ['color', 'shape', 'motion', 'color+shape'] },
    hard: { cols: 4, rows: 4, n: [5, 7], show: 6, feats: ['color', 'shape', 'motion', 'color+shape', 'shape+motion'] } }[ctx.level] || {};
  const ROUNDS = 4, timers = [], demoT = [];
  let round = 0, points = 0, phase = 'show', field = [], want = [], left = 0, wrong = 0, ticker = 0, parts = [], sample = '';
  stage.innerHTML = `<div class="bg-wrap"><p class="bg-q"></p><div class="bg-grid rem" style="--cols:${L.cols}"></div><button class="btn pink bg-ready">${ctx.tr('bgReady')}</button></div>`;
  const grid = stage.querySelector('.bg-grid'), q = stage.querySelector('.bg-q'), ready = stage.querySelector('.bg-ready');
  const lucky = luckyCorner(ctx), hand = coach(ctx);
  const cell = (i) => grid.querySelector(`[data-i="${i}"]`);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${round + 1}/${ROUNDS}`);
  const text = (pair) => (ctx.lang === 'ru' ? pair[0] : pair[1]);
  const idle = idleWatch(7000, () => {
    if (phase !== 'ask' || flow.on) return;
    const i = want.find((x) => !cell(x).classList.contains('open'));
    if (i === undefined) return;
    lucky.say(BL.remHint[0]);
    hand.to(cell(i), false);
  });
  // preset (the demo): { kind, items: [[cell, shape]] }, the first item is the one asked about
  function newRound(preset) {
    phase = 'show';
    hud();
    hand.hide();
    const cells = L.cols * L.rows;
    let kind, first;
    field = Array(cells).fill(null);
    if (preset) {
      preset.items.forEach(([i, f]) => { field[i] = f; });
      kind = preset.kind;
      first = preset.items[0][1];
    } else {
      const n = rnd(L.n[0], L.n[1]), motions = L.feats.some((f) => f.includes('motion'));
      const spots = shuffle([...Array(cells).keys()]).slice(0, n);
      spots.forEach((i) => { field[i] = { color: pick(COLORS)[0], shape: pick(SHAPES)[0], motion: motions ? pick(MOTIONS)[0] : 'still' }; });
      // the question: a feature (or two) of the first shape, so at least one fits
      kind = pick(L.feats);
      first = field[spots[0]];
    }
    const fits = (f) => kind.split('+').every((k) => f[k] === first[k]);
    want = field.map((f, i) => (f && fits(f) ? i : -1)).filter((i) => i >= 0);
    left = want.length;
    wrong = 0;
    // "pink stars", "bouncing shapes": the colour or the motion, then the shape (or just "shapes")
    const keys = kind.split('+'), word = { color: COLORS.find((c) => c[0] === first.color)[2], motion: MOTIONS.find((m) => m[0] === first.motion)[1] };
    const noun = keys.includes('shape') ? SHAPES.find((sh) => sh[0] === first.shape)[1] : ['фигурки', 'shapes'];
    parts = [...keys.filter((k) => k !== 'shape').map((k) => word[k]), noun];
    sample = sampleOf(keys, first);
    grid.classList.remove('covered');
    grid.innerHTML = field.map((f, i) => `<button class="bg-cell" data-i="${i}">${f ? `<span class="rem-shape m-${f.motion}">${shapeSvg(f.shape, COLORS.find((c) => c[0] === f.color)[1])}</span>` : ''}<span class="rem-cover">🐾</span></button>`).join('');
    let secs = L.show;
    q.innerHTML = `🧠 ${ctx.tr('bgRemember')} ${preset ? '' : `<b class="bg-secs">${secs}</b>`}${ctx.trSub ? `<small class="bg-sub">${ctx.trSub('bgRemember')}</small>` : ''}`;
    ready.hidden = false;
    clearInterval(ticker);
    if (!preset) ticker = setInterval(() => { secs--; const s = q.querySelector('.bg-secs'); if (s) s.textContent = secs; if (secs <= 0) ask(); }, 1000);
    ready.onclick = () => { if (flow?.on) return; sfx.tap(); ask(); };
    grid.querySelectorAll('.bg-cell').forEach((b) => { b.onclick = () => tapCell(b); });
  }
  function ask() {
    if (phase !== 'show') return;
    clearInterval(ticker);
    phase = 'ask';
    ready.hidden = true;
    grid.classList.add('covered');
    want.forEach((i) => { cell(i).dataset.w = '1'; }); // (for the tests)
    const what = parts.map(text).join(' ');
    const sub = ctx.trSub ? `<small class="bg-sub">${ctx.trSub('bgFindAll', { x: parts.map((p) => p[0]).join(' ') })}</small>` : '';
    q.innerHTML = `${sample} ${ctx.tr('bgFindAll', { x: `<b>${what}</b>` })} <span class="bg-left">${ctx.tr('bgLeft', { n: left })}</span>${sub}`;
    idle.reset();
  }
  function tapCell(b) {
    if (phase !== 'ask' || b.classList.contains('open') || b.classList.contains('miss')) return;
    idle.reset();
    hand.hide();
    const i = +b.dataset.i;
    if (want.includes(i)) {
      b.classList.add('open');
      sfx.catch();
      points += 100;
      left--;
    } else {
      b.classList.add('miss');
      sfx.tap();
      wrong++;
      left--;
      if (wrong === 1) sayOne(lucky, BL.oops, 'sad');
    }
    hud();
    const l = q.querySelector('.bg-left');
    if (l) l.textContent = ctx.tr('bgLeft', { n: left });
    if (left > 0) return;
    // the round is over: everything is shown again for a moment
    phase = 'done';
    if (flow?.on) { setTimeout(() => grid.classList.remove('covered'), 400); return; } // the demo goes on by itself
    const perfect = !wrong;
    if (perfect) { points += 150; sfx.happy(); sayOne(lucky, BL.yay, 'happy'); }
    hud();
    timers.push(setTimeout(() => {
      grid.classList.remove('covered');
      grid.querySelectorAll('.bg-cell').forEach((c) => { if (want.includes(+c.dataset.i)) c.classList.add('good'); });
    }, 400));
    timers.push(setTimeout(() => { if (++round >= ROUNDS) ctx.finish(points); else newRound(); }, 2200));
  }
  // the demo: three shapes, two of them pink; Lucky remembers, taps "Got it!" and finds the pink ones
  async function demo(on) {
    const W = (ms) => wait(demoT, ms), cells = L.cols * L.rows;
    const spots = [1, L.cols + 2, cells - 2];
    newRound({ kind: 'color', items: [[spots[0], { color: 'pink', shape: 'star', motion: 'still' }], [spots[1], { color: 'blue', shape: 'circle', motion: 'still' }], [spots[2], { color: 'pink', shape: 'square', motion: 'still' }]] });
    lucky.say(BL.remHow1[0], 'ok', true);
    await W(900);
    for (const i of spots) { if (!on()) return; await hand.to(cell(i), false); await W(500); }
    await W(900);
    if (!on()) return;
    lucky.say(BL.remHow2[0], 'ok', true);
    await W(1600);
    if (!on()) return;
    await hand.to(ready);
    if (!on()) return;
    sfx.tap();
    ask();
    lucky.say(BL.remHow3[0], 'ok', true);
    await W(2800);
    for (const i of [spots[0], spots[2]]) { if (!on()) return; await hand.to(cell(i)); if (!on()) return; tapCell(cell(i)); await W(700); }
    lucky.say(BL.remHow4[0], 'happy', true);
    await W(2400);
  }
  const flow = demoOrPlay(ctx, {
    demo, lucky, hand, demoT,
    play: (afterDemo) => { round = 0; points = 0; lucky.say(afterDemo ? BL.yourTurn[0] : BL.remStart[0], afterDemo ? 'happy' : 'ok'); newRound(); },
  });
  const cleanup = () => { clearInterval(ticker); timers.forEach(clearTimeout); demoT.forEach(clearTimeout); idle.stop(); hand.stop(); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Number chain (each answer starts the next sum) ----------
// Blocks to count: a rod for each ten, a cube for each one
const blocks = (k, cls = '') => `<span class="ch-blk ${cls}">${'<i class="ten"></i>'.repeat(Math.floor(k / 10))}${'<i class="one"></i>'.repeat(k % 10)}</span>`;
function runChain(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { start: [2, 10], max: 20, op: [1, 9], ops: '+-' }, normal: { start: [5, 20], max: 50, op: [2, 19], ops: '+-' }, hard: { start: [10, 30], max: 100, op: [3, 25], ops: '+-*' } }[ctx.level] || {};
  const STEPS = 8, timers = [], demoT = [];
  let n = rnd(L.start[0], L.start[1]), step = 0, points = 0, input = '', cur = null, missed = false, helped = false;
  stage.innerHTML = `<div class="bg-wrap"><div class="ch-trail"></div><p class="ch-sum"></p><div class="ch-aid" hidden></div><div class="ch-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, ''].map((k) => `<button class="ch-key${k === '' ? ' blank' : ''}" data-k="${k}">${k}</button>`).join('')}</div></div>`;
  const trail = stage.querySelector('.ch-trail'), sum = stage.querySelector('.ch-sum'), aid = stage.querySelector('.ch-aid');
  const lucky = luckyCorner(ctx), hand = coach(ctx);
  const keyEl = (k) => stage.querySelector(`.ch-key[data-k="${k}"]`);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${step + 1}/${STEPS}`);
  // the blocks: both numbers to add, the taken ones crossed out, groups to multiply
  function showAid() {
    helped = true;
    const { a, b, op, r } = cur;
    aid.innerHTML = op === '+' ? `${blocks(a)}<b>+</b>${blocks(b, 'add')}` : op === '−' ? `${blocks(r)}${blocks(b, 'gone')}` : Array.from({ length: b }, () => blocks(a)).join('<b>+</b>');
    aid.hidden = false;
  }
  const idle = idleWatch(7000, () => { if (flow.on || input || aid.hidden === false) return; showAid(); lucky.say(BL.chainHint[0]); });
  function next(preset) {
    // a sum that stays between 0 and the level's top, different from the last number
    cur = preset || null;
    for (let k = 0; !cur && k < 200; k++) {
      const op = L.ops[rnd(0, L.ops.length - 1)];
      if (op === '*') { const b = rnd(2, 5); if (n * b <= L.max && n > 1) cur = { a: n, op: '×', b, r: n * b }; continue; }
      const b = rnd(L.op[0], L.op[1]);
      const r = op === '+' ? n + b : n - b;
      if (r >= 0 && r <= L.max && r !== n) cur = { a: n, op: op === '+' ? '+' : '−', b, r };
    }
    input = '';
    missed = false;
    helped = false;
    aid.hidden = true;
    show(step > 0);
    hud();
    idle.reset();
  }
  // the first number of a new sum is the last answer: it lands with a hop
  const show = (landed = false) => { sum.innerHTML = `<span class="ch-a${landed ? ' landed' : ''}">${cur.a}</span> ${cur.op} ${cur.b} = <b class="ch-in${input ? '' : ' empty'}">${input || '?'}</b>`; };
  function key(k) {
    if (step >= STEPS) return;
    sfx.tap();
    idle.reset();
    hand.hide();
    if (k === '⌫') { input = input.slice(0, -1); show(); return; }
    if (input.length >= 3) return;
    input += k;
    show();
    if (input.length < String(cur.r).length) return;
    if (+input === cur.r) {
      points += missed || helped ? 100 : 150;
      sfx.catch();
      trail.insertAdjacentHTML('beforeend', `<span class="ch-link">${cur.r}</span>`);
      if (!flow?.on) { if (!missed && Math.random() < 0.5) sayOne(lucky, BL.yay, 'happy'); else lucky.say(null, 'happy'); }
      n = cur.r;
      step++;
      if (flow?.on) return; // the demo sets its own next sum
      if (step >= STEPS) { hud(); timers.push(setTimeout(() => ctx.finish(points), 700)); return; }
      next();
    } else {
      missed = true;
      sum.classList.remove('shake');
      void sum.offsetWidth;
      sum.classList.add('shake');
      sayOne(lucky, BL.oops, 'sad');
      if (aid.hidden) showAid(); // a wrong answer: the blocks come out to help
      timers.push(setTimeout(() => { input = ''; show(); }, 500));
    }
  }
  stage.querySelectorAll('.ch-key:not(.blank)').forEach((b) => { b.onclick = () => key(b.dataset.k); });
  // the demo: 3 + 2 with the blocks, the answer 5 starts 5 − 1
  async function demo(on) {
    const W = (ms) => wait(demoT, ms);
    n = 3;
    trail.innerHTML = '<span class="ch-link first">3</span>';
    next({ a: 3, op: '+', b: 2, r: 5 });
    lucky.say(BL.chainHow1[0], 'ok', true);
    await W(800);
    await hand.to(sum, false);
    await W(1800);
    if (!on()) return;
    hand.hide();
    showAid();
    aid.classList.add('bg-ping');
    lucky.say(BL.chainHow2[0], 'ok', true);
    await W(2600);
    if (!on()) return;
    lucky.say(BL.chainHow3[0], 'ok', true);
    await W(900);
    await hand.to(keyEl(5));
    if (!on()) return;
    key('5');
    await W(700);
    next({ a: 5, op: '−', b: 1, r: 4 });
    await hand.to(sum.querySelector('.ch-a'), false);
    lucky.say(BL.chainHow4[0], 'happy', true);
    await W(2800);
    if (!on()) return;
    await hand.to(keyEl(4));
    if (!on()) return;
    key('4');
    await W(1200);
  }
  const flow = demoOrPlay(ctx, {
    demo, lucky, hand, demoT,
    play: (afterDemo) => {
      n = rnd(L.start[0], L.start[1]);
      step = 0;
      points = 0;
      trail.innerHTML = `<span class="ch-link first">${n}</span>`;
      lucky.say(afterDemo ? BL.yourTurn[0] : BL.chainStart[0], afterDemo ? 'happy' : 'ok');
      next();
    },
  });
  const cleanup = () => { timers.forEach(clearTimeout); demoT.forEach(clearTimeout); idle.stop(); hand.stop(); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Squares (tap two opposite corners of a rectangle whose four corners are the same colour) ----------
const TILES = ['#FF5FA2', '#4D9BFF', '#3DBA63', '#FFC21A', '#9B7BFF'];
function runSquares(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { cols: 5, rows: 6, colors: 3, secs: 60 }, normal: { cols: 6, rows: 7, colors: 4, secs: 75 }, hard: { cols: 6, rows: 8, colors: 5, secs: 90 } }[ctx.level] || {};
  const timers = [], demoT = [];
  let grid = [], sel = null, points = 0, secs = L.secs, over = false, ticker = 0, busy = false;
  const color = () => rnd(0, L.colors - 1);
  for (let r = 0; r < L.rows; r++) grid.push(Array.from({ length: L.cols }, color));
  const sub = ctx.trSub ? `<small class="bg-sub">${ctx.trSub('bgSquaresHint')}</small>` : '';
  stage.innerHTML = `<div class="bg-wrap"><p class="bg-q">🟪 ${ctx.tr('bgSquaresHint')}${sub}</p><div class="bg-grid sq" style="--cols:${L.cols}"></div></div>`;
  const box = stage.querySelector('.bg-grid');
  const lucky = luckyCorner(ctx), hand = coach(ctx);
  const tile = (r, c) => box.querySelector(`.sq-tile[data-r="${r}"][data-c="${c}"]`);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;⏱ ${secs}`);
  // all the rectangles there are now: [r1, c1, r2, c2]
  const rects = () => {
    const out = [];
    for (let r1 = 0; r1 < L.rows; r1++) for (let r2 = r1 + 1; r2 < L.rows; r2++) for (let c1 = 0; c1 < L.cols; c1++) for (let c2 = c1 + 1; c2 < L.cols; c2++) {
      const v = grid[r1][c1];
      if (grid[r1][c2] === v && grid[r2][c1] === v && grid[r2][c2] === v) out.push([r1, c1, r2, c2]);
    }
    return out;
  };
  // a new board: if there are fewer than two rectangles, four corners are painted to make one
  const ensureStart = () => {
    for (let k = 0; k < 10 && rects().length < 2; k++) {
      const r1 = rnd(0, L.rows - 2), r2 = rnd(r1 + 1, L.rows - 1), c1 = rnd(0, L.cols - 2), c2 = rnd(c1 + 1, L.cols - 1), v = color();
      grid[r1][c1] = grid[r1][c2] = grid[r2][c1] = grid[r2][c2] = v;
    }
  };
  // After a pop only the new tiles get colours; the rest of the board stays as it was. There is always a box to find:
  // random colours, tried a few times for two boxes; if not, a box with new corners whose other corners already share
  // a colour gets its new corners in that colour (at worst the new tiles' own corners: they always make one).
  function refill(cells) {
    const isNew = new Set(cells.map(([r, c]) => r * 100 + c));
    for (let k = 0; k < 40; k++) {
      cells.forEach(([r, c]) => { grid[r][c] = color(); });
      if (rects().length >= 2) return;
    }
    for (let k = 0; k < 2 && rects().length < 2; k++) {
      const options = [];
      for (let r1 = 0; r1 < L.rows; r1++) for (let r2 = r1 + 1; r2 < L.rows; r2++) for (let c1 = 0; c1 < L.cols; c1++) for (let c2 = c1 + 1; c2 < L.cols; c2++) {
        const corners = [[r1, c1], [r1, c2], [r2, c1], [r2, c2]], old = corners.filter(([r, c]) => !isNew.has(r * 100 + c));
        if (old.length === 4) continue;
        const v = old.length ? grid[old[0][0]][old[0][1]] : color();
        if (old.every(([r, c]) => grid[r][c] === v)) options.push({ corners, v, old: old.length });
      }
      if (!options.length) break;
      // the most old corners first: a box somewhere new, not the same one again
      const best = Math.max(...options.map((o) => o.old));
      const o = pick(options.filter((x) => x.old === best));
      o.corners.forEach(([r, c]) => { if (isNew.has(r * 100 + c)) grid[r][c] = o.v; });
    }
  }
  // the whole board; or after a pop only the new tiles, in their places (the rest isn't touched)
  const draw = (fresh = null) => {
    if (fresh && box.querySelector('.sq-tile')) {
      fresh.forEach(([r, c]) => { const t = tile(r, c); t.className = 'sq-tile'; t.style.setProperty('--c', TILES[grid[r][c]]); void t.offsetWidth; t.classList.add('new'); });
      return;
    }
    box.innerHTML = grid.map((row, r) => row.map((v, c) => `<button class="sq-tile" data-r="${r}" data-c="${c}" style="--c:${TILES[v]}"></button>`).join('')).join('');
    box.querySelectorAll('.sq-tile').forEach((b) => { b.onclick = () => tap(+b.dataset.r, +b.dataset.c, b); });
  };
  // a frame round a box: when it pops, and dashed for a hint
  function frame(r1, c1, r2, c2, cls) {
    const a = tile(Math.min(r1, r2), Math.min(c1, c2)), z = tile(Math.max(r1, r2), Math.max(c1, c2));
    if (!a || !z) return null;
    const bx = box.getBoundingClientRect(), ra = a.getBoundingClientRect(), rz = z.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'sq-frame ' + cls;
    Object.assign(f.style, { left: ra.left - bx.left - 3 + 'px', top: ra.top - bx.top - 3 + 'px', width: rz.right - ra.left + 6 + 'px', height: rz.bottom - ra.top + 6 + 'px' });
    f.style.setProperty('--c', TILES[grid[r1][c1]]);
    box.appendChild(f);
    return f;
  }
  const clearHint = () => { box.querySelectorAll('.hint').forEach((x) => x.classList.remove('hint')); box.querySelectorAll('.sq-frame.dash').forEach((x) => x.remove()); hand.hide(); };
  function tap(r, c, b) {
    if (over || busy) return;
    idle.reset();
    clearHint();
    if (!sel) { sel = [r, c]; b.classList.add('sel'); sfx.tap(); return; }
    const [r0, c0] = sel;
    sel = null;
    box.querySelectorAll('.sel').forEach((x) => x.classList.remove('sel'));
    if (r0 === r && c0 === c) return;
    const v = grid[r0][c0], ok = r0 !== r && c0 !== c && grid[r][c] === v && grid[r0][c] === v && grid[r][c0] === v;
    if (!ok) { sfx.tap(); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); if (Math.random() < 0.4) sayOne(lucky, BL.oops, 'sad'); return; }
    // the box pops: its tiles go, and new ones come in their places; nothing else moves
    const [ra, rb, ca, cb] = [Math.min(r0, r), Math.max(r0, r), Math.min(c0, c), Math.max(c0, c)];
    const cells = [];
    for (let row = ra; row <= rb; row++) for (let col = ca; col <= cb; col++) cells.push([row, col]);
    points += cells.length * 10 + (cells.length >= 9 ? 50 : 0);
    sfx.catch();
    if (cells.length >= 9 && !flow?.on) { sfx.happy(); sayOne(lucky, BL.yay, 'happy'); }
    frame(ra, ca, rb, cb, 'pop');
    cells.forEach(([row, col]) => tile(row, col)?.classList.add('gone'));
    busy = true;
    timers.push(setTimeout(() => {
      busy = false;
      refill(cells);
      hud();
      draw(cells);
    }, 330));
  }
  // stuck for a while: a box's frame, two of its corners glow and the finger points at one
  const idle = idleWatch(8000, () => {
    if (over || flow.on || busy) return;
    const [r1, c1, r2, c2] = pick(rects());
    [[r1, c1], [r2, c2]].forEach(([r, c]) => tile(r, c)?.classList.add('hint'));
    frame(r1, c1, r2, c2, 'dash');
    hand.to(tile(r1, c1), false);
    lucky.say(BL.sqHint[0]);
  });
  function startClock() {
    clearInterval(ticker);
    ticker = setInterval(() => {
      if (over) return;
      secs--;
      hud();
      if (secs <= 0) { over = true; clearInterval(ticker); sfx.levelup(); clearHint(); timers.push(setTimeout(() => ctx.finish(points), 600)); }
    }, 1000);
  }
  ensureStart();
  draw();
  hud();
  // the demo: a box with four pink corners; Lucky shows its frame, taps one corner, then the one across
  async function demo(on) {
    const W = (ms) => wait(demoT, ms);
    const r1 = 1, c1 = 1, r2 = Math.min(L.rows - 2, 4), c2 = Math.min(L.cols - 2, 3);
    grid[r1][c1] = grid[r1][c2] = grid[r2][c1] = grid[r2][c2] = 0;
    draw();
    lucky.say(BL.sqHow1[0], 'ok', true);
    await W(600);
    const f = frame(r1, c1, r2, c2, 'dash');
    for (const [r, c] of [[r1, c1], [r1, c2], [r2, c2], [r2, c1]]) { if (!on()) return; await hand.to(tile(r, c), false); await W(350); }
    await W(1200);
    if (!on()) return;
    lucky.say(BL.sqHow2[0], 'ok', true);
    await hand.to(tile(r1, c1));
    if (!on()) return;
    tap(r1, c1, tile(r1, c1));
    await W(1300);
    if (!on()) return;
    lucky.say(BL.sqHow3[0], 'happy', true);
    await hand.to(tile(r2, c2));
    if (!on()) return;
    f?.remove();
    tap(r2, c2, tile(r2, c2));
    await W(2200);
  }
  const flow = demoOrPlay(ctx, {
    demo, lucky, hand, demoT,
    play: (afterDemo) => { clearHint(); points = 0; secs = L.secs; hud(); lucky.say(afterDemo ? BL.yourTurn[0] : BL.sqStart[0], afterDemo ? 'happy' : 'ok'); idle.reset(); startClock(); },
  });
  const cleanup = () => { clearInterval(ticker); timers.forEach(clearTimeout); demoT.forEach(clearTimeout); idle.stop(); hand.stop(); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Who's who? (find the one bunny with all the features asked for) ----------
function bunnySvg(b) {
  const fur = FURS.find((f) => f[0] === b.fur)[1], dark = b.fur === 'white' ? '#E6DCEB' : 'rgba(0,0,0,.18)';
  const ears = b.ears === 'up'
    ? `<ellipse cx="22" cy="14" rx="6" ry="14" fill="${fur}" stroke="${dark}"/><ellipse cx="38" cy="14" rx="6" ry="14" fill="${fur}" stroke="${dark}"/><ellipse cx="22" cy="15" rx="3" ry="10" fill="#FFB3C7"/><ellipse cx="38" cy="15" rx="3" ry="10" fill="#FFB3C7"/>`
    : `<ellipse cx="13" cy="36" rx="6" ry="14" fill="${fur}" stroke="${dark}" transform="rotate(18 13 36)"/><ellipse cx="47" cy="36" rx="6" ry="14" fill="${fur}" stroke="${dark}" transform="rotate(-18 47 36)"/>`;
  const mark = b.mark === 'spots' ? `<circle cx="22" cy="58" r="4" fill="${dark}"/><circle cx="38" cy="62" r="5" fill="${dark}"/><circle cx="36" cy="30" r="3" fill="${dark}"/>`
    : b.mark === 'stripe' ? `<path d="M18 52 Q30 47 42 52" stroke="#FF5FA2" stroke-width="5" fill="none"/>` : '';
  const thing = b.thing === 'bow' ? `<path d="M30 22 l-8 -5 v10z M30 22 l8 -5 v10z" fill="#FF5FA2"/><circle cx="30" cy="22" r="2.5" fill="#E23D86"/>`
    : b.thing === 'hat' ? `<rect x="21" y="8" width="18" height="12" rx="2" fill="#3A2A3E"/><rect x="16" y="19" width="28" height="4" rx="2" fill="#3A2A3E"/>`
      : b.thing === 'glasses' ? `<circle cx="24" cy="36" r="5.5" fill="#fff" fill-opacity=".3" stroke="#3A2A3E" stroke-width="2"/><circle cx="36" cy="36" r="5.5" fill="#fff" fill-opacity=".3" stroke="#3A2A3E" stroke-width="2"/><path d="M29.5 36 h1" stroke="#3A2A3E" stroke-width="2"/>` : '';
  return `<svg viewBox="0 0 60 76">${b.ears === 'up' ? ears : ''}<ellipse cx="30" cy="58" rx="17" ry="15" fill="${fur}" stroke="${dark}"/><circle cx="30" cy="36" r="15" fill="${fur}" stroke="${dark}"/>${b.ears === 'lop' ? ears : ''}
    ${mark}<circle cx="24" cy="35" r="2.2" fill="#3A2216"/><circle cx="36" cy="35" r="2.2" fill="#3A2216"/><path d="M28 41 l2 2 2 -2z" fill="#FF7AA8"/>${thing}</svg>`;
}
// a clue as a picture: the fur as a colour, the rest on a little grey bunny ("no spots" and "nothing on" crossed out)
function clueIcon(k, v) {
  if (k === 'fur') return `<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="${FURS.find((f) => f[0] === v)[1]}" stroke="#0003" stroke-width="1.5"/></svg>`;
  const base = { ears: 'up', fur: 'grey', mark: 'plain', thing: 'none' };
  if (k === 'mark' && v === 'plain') return `<span class="who-no">${bunnySvg({ ...base, mark: 'spots' })}</span>`;
  if (k === 'thing' && v === 'none') return `<span class="who-no">${bunnySvg({ ...base, thing: 'hat' })}</span>`;
  return bunnySvg({ ...base, [k]: v });
}

function runWho(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { n: 6, ask: [2, 2] }, normal: { n: 8, ask: [3, 3] }, hard: { n: 10, ask: [3, 4] } }[ctx.level] || {};
  const ROUNDS = 6, timers = [], demoT = [];
  let round = 0, points = 0, target = null, keys = [], all = [], checks = new Set(), tries = 0, locked = false;
  stage.innerHTML = `<div class="bg-wrap"><p class="bg-q who-q"></p><div class="bg-grid who"></div></div>`;
  const q = stage.querySelector('.who-q'), box = stage.querySelector('.bg-grid');
  const lucky = luckyCorner(ctx), hand = coach(ctx);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${round + 1}/${ROUNDS}`);
  const text = (pair) => (ctx.lang === 'ru' ? pair[0] : pair[1]);
  const chip = (k) => q.querySelector(`.who-chip[data-k="${k}"]`);
  const randomBunny = () => ({ ears: pick(EARS)[0], fur: pick(FURS)[0], mark: pick(MARKS)[0], thing: pick(THINGS)[0] });
  const fits = (b) => keys.every((k) => b[k] === target[k]);
  // preset (the demo): { target, keys, others }
  function newRound(preset) {
    locked = false;
    tries = 0;
    checks = new Set();
    hud();
    hand.hide();
    let others = [];
    if (preset) ({ target, keys, others } = preset);
    else {
      target = randomBunny();
      keys = shuffle(Object.keys(FEATURES)).slice(0, rnd(L.ask[0], L.ask[1]));
      // the others: none fits all the features asked for, but most share some, so she has to look
      for (let k = 0; others.length < L.n - 1 && k < 400; k++) {
        const b = randomBunny();
        if (fits(b)) continue;
        if (keys.filter((key) => b[key] === target[key]).length < keys.length - 1 && Math.random() < 0.6) continue;
        others.push(b);
      }
      while (others.length < L.n - 1) { const b = randomBunny(); if (!fits(b)) others.push(b); }
    }
    all = shuffle([target, ...others]);
    q.innerHTML = `🔎 ${ctx.tr('bgWho')}${ctx.trSub ? ` <small class="bg-sub inline">${ctx.trSub('bgWho')}</small>` : ''}<span class="who-chips">${keys.map((k) => `<button class="who-chip" data-k="${k}"><span class="who-ic">${clueIcon(k, target[k])}</span><span>${text(wordOf(k, target[k]))}${ctx.translate ? `<small>${wordOf(k, target[k])[ctx.lang === 'ru' ? 1 : 0]}</small>` : ''}</span></button>`).join('')}</span>`;
    q.querySelectorAll('.who-chip').forEach((c) => { c.onclick = () => { if (!flow?.on) check(c.dataset.k); }; });
    box.innerHTML = all.map((b, i) => `<button class="who-bunny" data-i="${i}"${b === target ? ' data-ok="1"' : ''}>${bunnySvg(b)}</button>`).join('');
    box.querySelectorAll('.who-bunny').forEach((el) => { el.onclick = () => choose(all[+el.dataset.i], el); });
    idle.reset();
  }
  // a clue tapped: the bunnies without it step back (tap it again to bring them back)
  function check(k) {
    if (locked) return;
    sfx.tap();
    idle.reset();
    hand.hide();
    if (checks.has(k)) checks.delete(k); else checks.add(k);
    chip(k).classList.toggle('on', checks.has(k));
    box.querySelectorAll('.who-bunny').forEach((el) => { const b = all[+el.dataset.i]; el.classList.toggle('out', [...checks].some((kk) => b[kk] !== target[kk])); });
  }
  function choose(b, el) {
    if (locked) return;
    idle.reset();
    hand.hide();
    if (fits(b)) {
      locked = true;
      el.classList.add('right');
      sfx.catch();
      if (flow?.on) return; // the demo goes on by itself
      points += tries ? 100 : 200;
      if (tries) lucky.say(null, 'happy'); else sayOne(lucky, BL.yay, 'happy');
      hud();
      timers.push(setTimeout(() => { if (++round >= ROUNDS) ctx.finish(points); else newRound(); }, 1100));
      return;
    }
    // not this one: Lucky says which feature is different
    tries++;
    el.classList.add('wrong');
    sfx.tap();
    const k = keys.find((key) => b[key] !== target[key]);
    lucky.say(BL.whoNot[k + ':' + target[k]][0], 'sad');
  }
  // stuck: the finger points at a clue to tap
  const idle = idleWatch(8000, () => {
    if (locked || flow.on) return;
    const k = keys.find((x) => !checks.has(x));
    if (!k) return;
    hand.to(chip(k), false);
    lucky.say(BL.whoHint[0]);
  });
  // the demo: a grey bunny with a bow; Lucky taps "grey", then "with a bow", and one bunny is left
  async function demo(on) {
    const W = (ms) => wait(demoT, ms);
    const t = { ears: 'up', fur: 'grey', mark: 'plain', thing: 'bow' };
    const fakes = [{ fur: 'grey', thing: 'hat' }, { fur: 'white', thing: 'bow' }, { fur: 'ginger', thing: 'bow' }, { fur: 'grey', thing: 'none' }, { fur: 'brown', thing: 'glasses' },
      { fur: 'white', thing: 'none' }, { fur: 'grey', thing: 'glasses' }, { fur: 'ginger', thing: 'hat' }, { fur: 'brown', thing: 'bow' }];
    newRound({ target: t, keys: ['fur', 'thing'], others: fakes.slice(0, L.n - 1).map((f, i) => ({ ears: i % 2 ? 'lop' : 'up', mark: ['plain', 'spots', 'stripe'][i % 3], ...f })) });
    lucky.say(BL.whoHow1[0], 'ok', true);
    await W(2600);
    if (!on()) return;
    await hand.to(chip('fur'));
    if (!on()) return;
    check('fur');
    lucky.say(BL.whoHow2[0], 'ok', true);
    await W(2800);
    if (!on()) return;
    await hand.to(chip('thing'));
    if (!on()) return;
    check('thing');
    lucky.say(BL.whoHow3[0], 'happy', true);
    await W(2200);
    if (!on()) return;
    const el = box.querySelector('[data-ok="1"]');
    await hand.to(el);
    if (!on()) return;
    choose(target, el);
    await W(1600);
  }
  const flow = demoOrPlay(ctx, {
    demo, lucky, hand, demoT,
    play: (afterDemo) => { round = 0; points = 0; lucky.say(afterDemo ? BL.yourTurn[0] : BL.whoStart[0], afterDemo ? 'happy' : 'ok'); newRound(); },
  });
  const cleanup = () => { timers.forEach(clearTimeout); demoT.forEach(clearTimeout); idle.stop(); hand.stop(); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// targets: three stars at the target, two from 55% of it (game.js starsOf); how: a "How to play" demo
export const BRAIN_GAMES = [
  { id: 'bmem', emoji: '🧠', brain: true, how: true, energy: 2, great: 24, target: { easy: 1400, normal: 1800, hard: 2200 }, run: runRemember },
  { id: 'bchain', emoji: '🔢', brain: true, how: true, energy: 2, great: 24, target: { easy: 1050, normal: 1050, hard: 1050 }, run: runChain },
  { id: 'bsquares', emoji: '🟪', brain: true, how: true, energy: 2, great: 24, target: { easy: 500, normal: 650, hard: 800 }, run: runSquares },
  { id: 'bwho', emoji: '🔎', brain: true, how: true, energy: 2, great: 24, target: { easy: 1000, normal: 1050, hard: 1100 }, run: runWho },
];

export const BRAIN_CSS = `
.bg-wrap { position: absolute; inset: 64px 10px 10px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.bg-q { margin: 0; text-align: center; font-weight: 800; font-size: 16px; color: var(--ink); background: #fffd; border-radius: 14px; padding: 8px 12px; box-shadow: var(--shadow); }
.bg-q b { color: var(--pink-d); }
.bg-sub { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-top: 2px; }
.bg-sub.inline { display: inline; }
.bg-left { display: block; font-size: 13px; color: var(--muted); }
.bg-grid { position: relative; display: grid; grid-template-columns: repeat(var(--cols, 4), 1fr); gap: 7px; width: min(100%, 360px); }
.bg-grid.shake, .ch-sum.shake { animation: shake .4s; }
.bg-cell { position: relative; aspect-ratio: 1; border-radius: 14px; background: #fff; box-shadow: var(--shadow); padding: 8px; }
.rem-shape { display: block; width: 100%; height: 100%; }
.rem-shape svg, .rem-mini svg { width: 100%; height: 100%; display: block; }
.rem-sample { display: inline-flex; gap: 2px; vertical-align: middle; margin-right: 2px; }
.rem-mini { display: inline-block; width: 26px; height: 26px; }
.m-bounce { animation: remBounce .8s ease-in-out infinite; }
.m-spin { animation: remSpin 2.2s linear infinite; }
@keyframes remBounce { 50% { transform: translateY(-14%); } }
@keyframes remSpin { to { transform: rotate(360deg); } }
.rem-cover { position: absolute; inset: 0; display: none; place-items: center; font-size: 26px; border-radius: 14px; background: linear-gradient(#FFD1E6, #F3C7FF); }
.bg-grid.covered .rem-cover { display: grid; }
.bg-grid.covered .bg-cell.open .rem-cover { display: none; }
.bg-cell.miss::after { content: "✗"; position: absolute; inset: 0; display: grid; place-items: center; font-size: 30px; color: #E2313B; font-weight: 900; z-index: 2; }
.bg-cell.good { box-shadow: 0 0 0 3px #3DBA63, var(--shadow); }
.bg-cell.open { box-shadow: 0 0 0 3px #FFD23F, var(--shadow); }
.bg-ready[hidden] { display: none; }
.ch-trail { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; min-height: 30px; max-width: 340px; }
.ch-link { padding: 3px 9px; border-radius: 12px; background: #FFE9A8; font-weight: 800; font-size: 14px; color: #8A5A00; }
.ch-link:not(.first)::before { content: "🥕 "; }
.ch-sum { margin: 6px 0 0; font-size: 40px; font-weight: 900; color: var(--ink); background: #fff; border-radius: 20px; padding: 10px 22px; box-shadow: var(--shadow); }
.ch-a { display: inline-block; }
.ch-a.landed { color: #C77700; animation: chLand .6s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes chLand { from { transform: translateY(-60%) scale(1.4); } }
.ch-in { color: var(--pink-d); } .ch-in.empty { color: #D9CDE3; }
.ch-aid { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 8px; max-width: 350px; background: #fffc; border-radius: 14px; padding: 8px 12px; box-shadow: var(--shadow); animation: whoHop .4s; }
.ch-aid[hidden] { display: none; }
.ch-aid > b { align-self: center; font-size: 20px; color: var(--muted); }
.ch-blk { position: relative; display: inline-flex; flex-wrap: wrap; align-items: flex-end; gap: 3px; max-width: 150px; }
.ch-blk i { display: block; width: 15px; border-radius: 3px; background: #FF8A3D; box-shadow: inset 0 -2px 0 #0002; }
.ch-blk i.one { height: 15px; }
.ch-blk i.ten { height: 66px; background: repeating-linear-gradient(#FF8A3D 0 5.6px, #FFD9BF 5.6px 6.6px); }
.ch-blk.add i { background: #4D9BFF; } .ch-blk.add i.ten { background: repeating-linear-gradient(#4D9BFF 0 5.6px, #CFE3FF 5.6px 6.6px); }
.ch-blk.gone { opacity: .4; }
.ch-blk.gone::after { content: ""; position: absolute; left: -4px; right: -4px; top: 50%; height: 3px; border-radius: 2px; background: #E2313B; transform: rotate(-24deg); }
.ch-keys { display: grid; grid-template-columns: repeat(3, 72px); gap: 8px; margin-top: 4px; }
.ch-key { height: 56px; border-radius: 16px; background: #fff; box-shadow: var(--shadow); font-size: 26px; font-weight: 800; color: var(--ink); }
.ch-key:active { transform: scale(.94); background: #FFE3F0; }
.ch-key.blank { visibility: hidden; }
.bg-grid.sq { gap: 4px; width: min(100%, 330px); }
.sq-tile { aspect-ratio: 1; border-radius: 9px; background: var(--c); box-shadow: inset 0 -4px 0 #0002, inset 0 3px 0 #fff6; transition: transform .2s, opacity .2s; }
.sq-tile.sel { outline: 4px solid #fff; transform: scale(.9); box-shadow: 0 0 0 7px var(--c), inset 0 -4px 0 #0002; }
.sq-tile.hint { animation: sqHint .7s ease-in-out infinite alternate; }
.sq-tile.gone { transform: scale(.2); opacity: 0; }
.sq-tile.new { animation: sqNew .4s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes sqHint { to { transform: scale(.82); filter: brightness(1.25); } }
@keyframes sqNew { from { transform: scale(0); } }
.sq-frame { position: absolute; z-index: 2; border-radius: 12px; pointer-events: none; border: 4px solid #fff; box-shadow: 0 0 0 3px var(--c), 0 0 14px var(--c); }
.sq-frame.pop { animation: sqFrame .5s ease-out forwards; }
.sq-frame.dash { border: 4px dashed #fff; animation: sqDash 1s ease-in-out infinite alternate; }
@keyframes sqFrame { to { transform: scale(1.08); opacity: 0; } }
@keyframes sqDash { to { box-shadow: 0 0 0 5px var(--c), 0 0 20px var(--c); } }
.who-q { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 2px 6px; }
.who-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; width: 100%; margin-top: 4px; }
.who-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px 4px 5px; border-radius: 14px; background: #FFE3F0; color: var(--pink-d); font-size: 14px; font-weight: 800; text-align: left; line-height: 1.1; box-shadow: 0 2px 0 #F5B8D4; }
.who-chip small { display: block; font-size: 10.5px; font-weight: 600; color: var(--muted); }
.who-chip.on { background: #FFF; box-shadow: 0 0 0 2px #3DBA63; }
.who-chip.on::after { content: "✓"; color: #3DBA63; font-weight: 900; }
.who-ic { position: relative; display: inline-grid; place-items: center; width: 24px; height: 28px; }
.who-ic svg { width: 100%; height: 100%; }
.who-no { display: block; width: 100%; height: 100%; }
.who-no::after { content: ""; position: absolute; left: -2px; right: -2px; top: 50%; height: 3px; border-radius: 2px; background: #E2313B; transform: rotate(-40deg); }
.bg-grid.who { grid-template-columns: repeat(3, 1fr); gap: 8px; width: min(100%, 330px); }
.who-bunny { aspect-ratio: 60 / 76; border-radius: 16px; background: #fff; box-shadow: var(--shadow); padding: 6px; transition: opacity .3s, transform .3s; }
.who-bunny svg { width: 100%; height: 100%; }
.who-bunny.out { opacity: .25; transform: scale(.88); }
.who-bunny.wrong { opacity: .35; transform: scale(.92); }
.who-bunny.right { opacity: 1; transform: none; box-shadow: 0 0 0 4px #3DBA63, var(--shadow); animation: whoHop .5s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes whoHop { 50% { transform: translateY(-12%); } }
.bg-lucky { position: absolute; left: 6px; bottom: 6px; width: 78px; z-index: 9; pointer-events: none; }
.bgl-pic svg { width: 100%; height: auto; display: block; }
.bgl-pic.hop { animation: whoHop .5s cubic-bezier(.3, 1.6, .5, 1); }
.bgl-say { position: absolute; left: 70px; bottom: 44px; width: max-content; max-width: 230px; background: #fff; border-radius: 14px; padding: 7px 10px; font-weight: 800; font-size: 14px; color: var(--ink); box-shadow: var(--shadow); }
.bgl-say small { display: block; font-weight: 600; font-size: 11.5px; color: var(--muted); }
.bgl-say[hidden] { display: none; }
/* how to play: the finger, the demo's shield */
.bg-hand { position: absolute; left: -17px; top: -6px; z-index: 10; font-size: 42px; line-height: 1; pointer-events: none; transition: translate .55s ease-in-out; filter: drop-shadow(0 3px 4px #0005); }
.bg-hand[hidden] { display: none; }
.bg-hand.tap { animation: bgTap .32s ease-in-out; }
@keyframes bgTap { 50% { scale: .8; } }
.bg-ping { animation: bgPing .45s ease-out; }
@keyframes bgPing { from { box-shadow: 0 0 0 0 #FF5FA2aa; } to { box-shadow: 0 0 0 14px #FF5FA200; } }
.bg-shield { position: absolute; inset: 0; z-index: 8; }
.bg-demo-tag { position: absolute; top: 14px; left: 50%; transform: translateX(-50%); padding: 6px 14px; border-radius: 16px; background: #FFE066; color: #6B4A00; font-weight: 800; font-size: 14px; box-shadow: var(--shadow); white-space: nowrap; }
.bg-skip { position: absolute; right: 10px; bottom: 12px; padding: 8px 14px; border-radius: 16px; background: #fff; color: var(--muted); font-weight: 800; font-size: 14px; box-shadow: var(--shadow); }
`;
