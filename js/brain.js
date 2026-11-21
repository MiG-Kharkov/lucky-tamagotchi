// Brain games: four puzzles in the spirit of the Brain Evolution test (memory, a chain of sums, same-colour
// rectangles, who's who by features), made simple and friendly for a child. No time pressure except in Squares, no
// points taken away, three difficulties. They are not part of the rounds of games: she can play them as much as she
// likes (the hearts they give have a daily cap in main.js). Lucky sits in a corner and plays along.
// Each game is run(ctx) → { stop(): points, cleanup() } and ends with ctx.finish(points) (see game.js).

const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// Lucky in the corner: his face and a word now and then ([ru, en]; English, the Russian under it when translating)
function luckyCorner(ctx) {
  const box = document.createElement('div');
  box.className = 'bg-lucky';
  box.innerHTML = `<div class="bgl-pic">${ctx.svgOk}</div><div class="bgl-say" hidden></div>`;
  ctx.stage.appendChild(box);
  const pic = box.querySelector('.bgl-pic'), bubble = box.querySelector('.bgl-say');
  let t = 0;
  return {
    say(pair, face = 'ok') {
      pic.innerHTML = face === 'happy' ? ctx.svgHappy : face === 'sad' ? ctx.svgSad : ctx.svgOk;
      pic.classList.remove('hop');
      void pic.offsetWidth;
      if (face === 'happy') pic.classList.add('hop');
      if (!pair) return;
      const [ru, en] = pair;
      bubble.innerHTML = `${ctx.lang === 'ru' ? ru : en}${ctx.translate ? `<small>${ctx.lang === 'ru' ? en : ru}</small>` : ''}`;
      bubble.hidden = false;
      clearTimeout(t);
      t = setTimeout(() => { bubble.hidden = true; }, 2600);
    },
    stop() { clearTimeout(t); },
  };
}

const YAY = [['Ура!', 'Hooray!'], ['Отлично!', 'Brilliant!'], ['Вот это да!', 'Wow!'], ['Умница!', 'Clever you!'], ['Точно!', 'Spot on!']];
const OOPS = [['Почти!', 'Almost!'], ['Ничего, бывает!', "Never mind, it happens!"], ['Попробуй ещё!', 'Try again!'], ['Я бы тоже ошибся!', "I'd have got that wrong too!"]];

// ---------- Remember! (a field of shapes: remember it, then find all the ones asked for) ----------
const COLORS = [['pink', '#FF5FA2', ['розовые', 'pink']], ['blue', '#4D9BFF', ['синие', 'blue']], ['green', '#3DBA63', ['зелёные', 'green']], ['yellow', '#FFC21A', ['жёлтые', 'yellow']]];
const SHAPES = [['circle', ['кружочки', 'circles']], ['square', ['квадратики', 'squares']], ['triangle', ['треугольники', 'triangles']], ['star', ['звёздочки', 'stars']]];
const MOTIONS = [['still', ['неподвижные', 'still']], ['bounce', ['прыгающие', 'bouncing']], ['spin', ['крутящиеся', 'spinning']]];
const shapeSvg = (shape, color) => {
  const inner = shape === 'circle' ? `<circle cx="20" cy="20" r="15" fill="${color}"/>`
    : shape === 'square' ? `<rect x="6" y="6" width="28" height="28" rx="5" fill="${color}"/>`
      : shape === 'triangle' ? `<path d="M20 4 L36 34 H4Z" fill="${color}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`
        : `<path d="M20 3 l4.9 10 11 1.6 -8 7.8 1.9 11 -9.8 -5.2 -9.8 5.2 1.9 -11 -8 -7.8 11 -1.6z" fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 40 40">${inner}<circle cx="15" cy="15" r="3" fill="#fff" opacity=".45"/></svg>`;
};

function runRemember(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { cols: 3, rows: 3, n: [3, 4], show: 7, feats: ['color', 'shape'] }, normal: { cols: 4, rows: 3, n: [4, 5], show: 7, feats: ['color', 'shape', 'motion', 'color+shape'] },
    hard: { cols: 4, rows: 4, n: [5, 7], show: 6, feats: ['color', 'shape', 'motion', 'color+shape', 'shape+motion'] } }[ctx.level] || {};
  const ROUNDS = 4, timers = [];
  let round = 0, points = 0, phase = 'show', field = [], want = [], left = 0, wrong = 0, ticker = 0;
  stage.innerHTML = `<div class="bg-wrap"><p class="bg-q"></p><div class="bg-grid rem" style="--cols:${L.cols}"></div><button class="btn pink bg-ready">${ctx.tr('bgReady')}</button></div>`;
  const grid = stage.querySelector('.bg-grid'), q = stage.querySelector('.bg-q'), ready = stage.querySelector('.bg-ready');
  const lucky = luckyCorner(ctx);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${round + 1}/${ROUNDS}`);
  const text = (pair) => (ctx.lang === 'ru' ? pair[0] : pair[1]);
  function newRound() {
    phase = 'show';
    hud();
    const cells = L.cols * L.rows, n = rnd(L.n[0], L.n[1]);
    const motions = L.feats.some((f) => f.includes('motion'));
    const spots = shuffle([...Array(cells).keys()]).slice(0, n);
    field = Array(cells).fill(null);
    spots.forEach((i) => { field[i] = { color: pick(COLORS)[0], shape: pick(SHAPES)[0], motion: motions ? pick(MOTIONS)[0] : 'still' }; });
    // the question: a feature (or two) of the first shape, so at least one fits
    const kind = pick(L.feats), first = field[spots[0]];
    const fits = (f) => kind.split('+').every((k) => f[k] === first[k]);
    want = field.map((f, i) => (f && fits(f) ? i : -1)).filter((i) => i >= 0);
    left = want.length;
    wrong = 0;
    // "pink stars", "bouncing shapes": the colour or the motion, then the shape (or just "shapes")
    const keys = kind.split('+'), word = { color: COLORS.find((c) => c[0] === first.color)[2], motion: MOTIONS.find((m) => m[0] === first.motion)[1] };
    const noun = keys.includes('shape') ? SHAPES.find((sh) => sh[0] === first.shape)[1] : ['фигурки', 'shapes'];
    const parts = [...keys.filter((k) => k !== 'shape').map((k) => word[k]), noun];
    grid.innerHTML = field.map((f, i) => `<button class="bg-cell" data-i="${i}">${f ? `<span class="rem-shape m-${f.motion}">${shapeSvg(f.shape, COLORS.find((c) => c[0] === f.color)[1])}</span>` : ''}<span class="rem-cover">🐾</span></button>`).join('');
    let secs = L.show;
    q.innerHTML = `🧠 ${ctx.tr('bgRemember')} <b class="bg-secs">${secs}</b>`;
    ready.hidden = false;
    clearInterval(ticker);
    ticker = setInterval(() => { secs--; const s = q.querySelector('.bg-secs'); if (s) s.textContent = secs; if (secs <= 0) ask(parts); }, 1000);
    ready.onclick = () => { sfx.tap(); ask(parts); };
    grid.querySelectorAll('.bg-cell').forEach((b) => { b.onclick = () => tapCell(b); });
  }
  function ask(parts) {
    if (phase !== 'show') return;
    clearInterval(ticker);
    phase = 'ask';
    ready.hidden = true;
    grid.classList.add('covered');
    want.forEach((i) => { grid.querySelector(`[data-i="${i}"]`).dataset.w = '1'; }); // (for the tests)
    const what = parts.map(text).join(' ');
    q.innerHTML = `🔍 ${ctx.tr('bgFindAll', { x: `<b>${what}</b>` })} <span class="bg-left">${ctx.tr('bgLeft', { n: left })}</span>`;
  }
  function tapCell(b) {
    if (phase !== 'ask' || b.classList.contains('open') || b.classList.contains('miss')) return;
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
      if (wrong === 1) lucky.say(pick(OOPS), 'sad');
    }
    hud();
    const l = q.querySelector('.bg-left');
    if (l) l.textContent = ctx.tr('bgLeft', { n: left });
    if (left > 0) return;
    // the round is over: everything is shown again for a moment
    phase = 'done';
    const perfect = !wrong;
    if (perfect) { points += 150; sfx.happy(); lucky.say(pick(YAY), 'happy'); }
    hud();
    timers.push(setTimeout(() => {
      grid.classList.remove('covered');
      grid.querySelectorAll('.bg-cell').forEach((c) => { if (want.includes(+c.dataset.i)) c.classList.add('good'); });
    }, 400));
    timers.push(setTimeout(() => { grid.classList.remove('covered'); if (++round >= ROUNDS) ctx.finish(points); else newRound(); }, 2200));
  }
  lucky.say(['Запоминай хорошенько!', 'Remember them well!']);
  newRound();
  const cleanup = () => { clearInterval(ticker); timers.forEach(clearTimeout); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Number chain (each answer starts the next sum) ----------
function runChain(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { start: [2, 10], max: 20, op: [1, 9], ops: '+-' }, normal: { start: [5, 20], max: 50, op: [2, 19], ops: '+-' }, hard: { start: [10, 30], max: 100, op: [3, 25], ops: '+-*' } }[ctx.level] || {};
  const STEPS = 8, timers = [];
  let n = rnd(L.start[0], L.start[1]), step = 0, points = 0, input = '', cur = null, missed = false;
  stage.innerHTML = `<div class="bg-wrap"><div class="ch-trail"></div><p class="ch-sum"></p><div class="ch-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, ''].map((k) => `<button class="ch-key${k === '' ? ' blank' : ''}" data-k="${k}">${k}</button>`).join('')}</div></div>`;
  const trail = stage.querySelector('.ch-trail'), sum = stage.querySelector('.ch-sum');
  const lucky = luckyCorner(ctx);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${step + 1}/${STEPS}`);
  function next() {
    // a sum that stays between 0 and the level's top, different from the last number
    for (let k = 0; k < 200; k++) {
      const op = L.ops[rnd(0, L.ops.length - 1)];
      if (op === '*') { const b = rnd(2, 5); if (n * b <= L.max && n > 1) { cur = { a: n, op: '×', b, r: n * b }; break; } continue; }
      const b = rnd(L.op[0], L.op[1]);
      const r = op === '+' ? n + b : n - b;
      if (r >= 0 && r <= L.max && r !== n) { cur = { a: n, op: op === '+' ? '+' : '−', b, r }; break; }
    }
    input = '';
    missed = false;
    show();
    hud();
  }
  const show = () => { sum.innerHTML = `${cur.a} ${cur.op} ${cur.b} = <b class="ch-in${input ? '' : ' empty'}">${input || '?'}</b>`; };
  function key(k) {
    if (step >= STEPS) return;
    sfx.tap();
    if (k === '⌫') { input = input.slice(0, -1); show(); return; }
    if (input.length >= 3) return;
    input += k;
    show();
    if (input.length < String(cur.r).length) return;
    if (+input === cur.r) {
      points += missed ? 100 : 150;
      sfx.catch();
      trail.insertAdjacentHTML('beforeend', `<span class="ch-link">${cur.r}</span>`);
      if (!missed && Math.random() < 0.5) lucky.say(pick(YAY), 'happy'); else lucky.say(null, 'happy');
      n = cur.r;
      step++;
      if (step >= STEPS) { hud(); timers.push(setTimeout(() => ctx.finish(points), 700)); return; }
      next();
    } else {
      missed = true;
      sum.classList.remove('shake');
      void sum.offsetWidth;
      sum.classList.add('shake');
      lucky.say(pick(OOPS), 'sad');
      timers.push(setTimeout(() => { input = ''; show(); }, 500));
    }
  }
  stage.querySelectorAll('.ch-key:not(.blank)').forEach((b) => { b.onclick = () => key(b.dataset.k); });
  trail.innerHTML = `<span class="ch-link first">${n}</span>`;
  lucky.say(['Каждый ответ — начало следующего примера!', 'Each answer starts the next sum!']);
  next();
  const cleanup = () => { timers.forEach(clearTimeout); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Squares (tap two opposite corners of a rectangle whose four corners are the same colour) ----------
const TILES = ['#FF5FA2', '#4D9BFF', '#3DBA63', '#FFC21A', '#9B7BFF'];
function runSquares(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { cols: 5, rows: 6, colors: 3, secs: 60 }, normal: { cols: 6, rows: 7, colors: 4, secs: 75 }, hard: { cols: 6, rows: 8, colors: 5, secs: 90 } }[ctx.level] || {};
  const timers = [];
  let grid = [], sel = null, points = 0, secs = L.secs, idleAt = Date.now(), over = false, ticker = 0;
  const color = () => rnd(0, L.colors - 1);
  for (let r = 0; r < L.rows; r++) grid.push(Array.from({ length: L.cols }, color));
  stage.innerHTML = `<div class="bg-wrap"><p class="bg-q">🟪 ${ctx.tr('bgSquaresHint')}</p><div class="bg-grid sq" style="--cols:${L.cols}"></div></div>`;
  const box = stage.querySelector('.bg-grid');
  const lucky = luckyCorner(ctx);
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
  // never stuck: if there are fewer than two rectangles, four corners are painted to make one
  const ensure = () => {
    for (let k = 0; k < 10 && rects().length < 2; k++) {
      const r1 = rnd(0, L.rows - 2), r2 = rnd(r1 + 1, L.rows - 1), c1 = rnd(0, L.cols - 2), c2 = rnd(c1 + 1, L.cols - 1), v = color();
      grid[r1][c1] = grid[r1][c2] = grid[r2][c1] = grid[r2][c2] = v;
    }
  };
  const draw = (fresh = []) => {
    box.innerHTML = grid.map((row, r) => row.map((v, c) => `<button class="sq-tile${fresh.includes(r * 100 + c) ? ' drop' : ''}" data-r="${r}" data-c="${c}" style="--c:${TILES[v]}"></button>`).join('')).join('');
    box.querySelectorAll('.sq-tile').forEach((b) => { b.onclick = () => tap(+b.dataset.r, +b.dataset.c, b); });
  };
  function tap(r, c, b) {
    if (over) return;
    idleAt = Date.now();
    box.querySelectorAll('.hint').forEach((x) => x.classList.remove('hint'));
    if (!sel) { sel = [r, c]; b.classList.add('sel'); sfx.tap(); return; }
    const [r0, c0] = sel;
    sel = null;
    if (r0 === r && c0 === c) { draw(); return; }
    const v = grid[r0][c0], ok = r0 !== r && c0 !== c && grid[r][c] === v && grid[r0][c] === v && grid[r][c0] === v;
    if (!ok) { sfx.tap(); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); draw(); if (Math.random() < 0.4) lucky.say(pick(OOPS), 'sad'); return; }
    // the rectangle pops: its cells go, the ones above fall, new ones come from the top
    const [ra, rb, ca, cb] = [Math.min(r0, r), Math.max(r0, r), Math.min(c0, c), Math.max(c0, c)];
    const cells = (rb - ra + 1) * (cb - ca + 1);
    points += cells * 10 + (cells >= 9 ? 50 : 0);
    sfx.catch();
    if (cells >= 9) { sfx.happy(); lucky.say(pick(YAY), 'happy'); }
    const fresh = [];
    for (let col = ca; col <= cb; col++) {
      const keep = [];
      for (let row = 0; row < L.rows; row++) if (row < ra || row > rb) keep.push(grid[row][col]);
      const add = L.rows - keep.length;
      for (let row = 0; row < L.rows; row++) { grid[row][col] = row < add ? color() : keep[row - add]; if (row < add) fresh.push(row * 100 + col); }
    }
    ensure();
    hud();
    draw(fresh);
  }
  ensure();
  draw();
  hud();
  lucky.say(['Найди четыре одинаковых уголка!', 'Find four corners of the same colour!']);
  ticker = setInterval(() => {
    if (over) return;
    secs--;
    hud();
    // stuck for a while: a rectangle's corners glow
    if (Date.now() - idleAt > 8000 && !box.querySelector('.hint')) {
      const [r1, c1, r2, c2] = pick(rects());
      [[r1, c1], [r2, c2]].forEach(([r, c]) => box.querySelector(`.sq-tile[data-r="${r}"][data-c="${c}"]`)?.classList.add('hint'));
    }
    if (secs <= 0) { over = true; clearInterval(ticker); sfx.levelup(); timers.push(setTimeout(() => ctx.finish(points), 600)); }
  }, 1000);
  const cleanup = () => { clearInterval(ticker); timers.forEach(clearTimeout); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// ---------- Who's who? (find the one bunny with all the features asked for) ----------
const EARS = [['up', ['ушки торчком', 'ears up']], ['lop', ['висячие ушки', 'lop ears']]];
const FURS = [['ginger', '#F4A261', ['рыжий', 'ginger']], ['white', '#FFFFFF', ['белый', 'white']], ['grey', '#B8B8C8', ['серый', 'grey']], ['brown', '#9A6B4A', ['шоколадный', 'brown']]];
const MARKS = [['plain', ['без пятнышек', 'no spots']], ['spots', ['в пятнышках', 'with spots']], ['stripe', ['с полоской', 'with a stripe']]];
const THINGS = [['none', ['без украшений', 'nothing on']], ['bow', ['с бантиком', 'with a bow']], ['hat', ['в шляпе', 'in a hat']], ['glasses', ['в очках', 'in glasses']]];
const FEATURES = { ears: EARS, fur: FURS, mark: MARKS, thing: THINGS };
const wordOf = (k, v) => { const it = FEATURES[k].find((x) => x[0] === v); return k === 'fur' ? it[2] : it[1]; };
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

function runWho(ctx) {
  const { stage, sfx } = ctx;
  const L = { easy: { n: 6, ask: [2, 2] }, normal: { n: 8, ask: [3, 3] }, hard: { n: 10, ask: [3, 4] } }[ctx.level] || {};
  const ROUNDS = 6, timers = [];
  let round = 0, points = 0, target = null, keys = [], tries = 0, locked = false;
  stage.innerHTML = `<div class="bg-wrap"><p class="bg-q who-q"></p><div class="bg-grid who"></div></div>`;
  const q = stage.querySelector('.who-q'), box = stage.querySelector('.bg-grid');
  const lucky = luckyCorner(ctx);
  const hud = () => ctx.info(`⭐ ${points} &nbsp;${round + 1}/${ROUNDS}`);
  const text = (pair) => (ctx.lang === 'ru' ? pair[0] : pair[1]);
  const randomBunny = () => ({ ears: pick(EARS)[0], fur: pick(FURS)[0], mark: pick(MARKS)[0], thing: pick(THINGS)[0] });
  const fits = (b) => keys.every((k) => b[k] === target[k]);
  function newRound() {
    locked = false;
    tries = 0;
    hud();
    target = randomBunny();
    keys = shuffle(Object.keys(FEATURES)).slice(0, rnd(L.ask[0], L.ask[1]));
    // the others: none fits all the features asked for, but most share some, so she has to look
    const others = [];
    for (let k = 0; others.length < L.n - 1 && k < 400; k++) {
      const b = randomBunny();
      if (fits(b)) continue;
      if (keys.filter((key) => b[key] === target[key]).length < keys.length - 1 && Math.random() < 0.6) continue;
      others.push(b);
    }
    while (others.length < L.n - 1) { const b = randomBunny(); if (!fits(b)) others.push(b); }
    const all = shuffle([target, ...others]);
    q.innerHTML = `🔎 ${ctx.tr('bgWho')} ${keys.map((k) => `<span class="who-chip">${text(wordOf(k, target[k]))}</span>`).join('')}`;
    box.innerHTML = all.map((b, i) => `<button class="who-bunny" data-i="${i}"${b === target ? ' data-ok="1"' : ''}>${bunnySvg(b)}</button>`).join('');
    box.querySelectorAll('.who-bunny').forEach((el) => { el.onclick = () => choose(all[+el.dataset.i], el); });
  }
  function choose(b, el) {
    if (locked) return;
    if (fits(b)) {
      locked = true;
      el.classList.add('right');
      points += tries ? 100 : 200;
      sfx.catch();
      lucky.say(tries ? null : pick(YAY), 'happy');
      hud();
      timers.push(setTimeout(() => { if (++round >= ROUNDS) ctx.finish(points); else newRound(); }, 1100));
      return;
    }
    // not this one: Lucky says which feature is different
    tries++;
    el.classList.add('wrong');
    sfx.tap();
    const k = keys.find((key) => b[key] !== target[key]);
    lucky.say([`Не этот: смотри — ${wordOf(k, target[k])[0]}!`, `Not this one: look for ${wordOf(k, target[k])[1]}!`], 'sad');
  }
  lucky.say(['Найди кролика по приметам!', 'Find the bunny that fits the clues!']);
  newRound();
  const cleanup = () => { timers.forEach(clearTimeout); lucky.stop(); };
  return { cleanup, stop: () => { cleanup(); return points; } };
}

// targets: three stars at the target, two from 55% of it (game.js starsOf)
export const BRAIN_GAMES = [
  { id: 'bmem', emoji: '🧠', brain: true, energy: 2, great: 24, target: { easy: 1400, normal: 1800, hard: 2200 }, run: runRemember },
  { id: 'bchain', emoji: '🔢', brain: true, energy: 2, great: 24, target: { easy: 1050, normal: 1050, hard: 1050 }, run: runChain },
  { id: 'bsquares', emoji: '🟪', brain: true, energy: 2, great: 24, target: { easy: 500, normal: 650, hard: 800 }, run: runSquares },
  { id: 'bwho', emoji: '🔎', brain: true, energy: 2, great: 24, target: { easy: 1000, normal: 1050, hard: 1100 }, run: runWho },
];

export const BRAIN_CSS = `
.bg-wrap { position: absolute; inset: 64px 10px 10px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.bg-q { margin: 0; text-align: center; font-weight: 800; font-size: 16px; color: var(--ink); background: #fffd; border-radius: 14px; padding: 8px 12px; box-shadow: var(--shadow); }
.bg-q b { color: var(--pink-d); }
.bg-left { display: block; font-size: 13px; color: var(--muted); }
.bg-grid { display: grid; grid-template-columns: repeat(var(--cols, 4), 1fr); gap: 7px; width: min(100%, 360px); }
.bg-grid.shake, .ch-sum.shake { animation: shake .4s; }
.bg-cell { position: relative; aspect-ratio: 1; border-radius: 14px; background: #fff; box-shadow: var(--shadow); padding: 8px; }
.rem-shape { display: block; width: 100%; height: 100%; }
.rem-shape svg { width: 100%; height: 100%; }
.rem-shape.m-bounce { animation: remBounce .8s ease-in-out infinite; }
.rem-shape.m-spin { animation: remSpin 2.2s linear infinite; }
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
.ch-sum { margin: 6px 0; font-size: 40px; font-weight: 900; color: var(--ink); background: #fff; border-radius: 20px; padding: 10px 22px; box-shadow: var(--shadow); }
.ch-in { color: var(--pink-d); } .ch-in.empty { color: #D9CDE3; }
.ch-keys { display: grid; grid-template-columns: repeat(3, 72px); gap: 8px; margin-top: 4px; }
.ch-key { height: 56px; border-radius: 16px; background: #fff; box-shadow: var(--shadow); font-size: 26px; font-weight: 800; color: var(--ink); }
.ch-key:active { transform: scale(.94); background: #FFE3F0; }
.ch-key.blank { visibility: hidden; }
.bg-grid.sq { gap: 4px; width: min(100%, 330px); }
.sq-tile { aspect-ratio: 1; border-radius: 9px; background: var(--c); box-shadow: inset 0 -4px 0 #0002, inset 0 3px 0 #fff6; }
.sq-tile.sel { outline: 4px solid #fff; transform: scale(.9); box-shadow: 0 0 0 7px var(--c), inset 0 -4px 0 #0002; }
.sq-tile.hint { animation: sqHint .7s ease-in-out infinite alternate; }
.sq-tile.drop { animation: sqDrop .35s ease-out; }
@keyframes sqHint { to { transform: scale(.82); filter: brightness(1.25); } }
@keyframes sqDrop { from { transform: translateY(-60%); opacity: .2; } }
.who-chip { display: inline-block; margin: 3px 3px 0; padding: 3px 9px; border-radius: 12px; background: #FFE3F0; color: var(--pink-d); font-size: 14px; }
.bg-grid.who { grid-template-columns: repeat(3, 1fr); gap: 8px; width: min(100%, 330px); }
.who-bunny { aspect-ratio: 60 / 76; border-radius: 16px; background: #fff; box-shadow: var(--shadow); padding: 6px; }
.who-bunny svg { width: 100%; height: 100%; }
.who-bunny.wrong { opacity: .35; transform: scale(.92); }
.who-bunny.right { box-shadow: 0 0 0 4px #3DBA63, var(--shadow); animation: whoHop .5s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes whoHop { 50% { transform: translateY(-12%); } }
.bg-lucky { position: absolute; left: 6px; bottom: 6px; width: 78px; z-index: 3; pointer-events: none; }
.bgl-pic svg { width: 100%; height: auto; display: block; }
.bgl-pic.hop { animation: whoHop .5s cubic-bezier(.3, 1.6, .5, 1); }
.bgl-say { position: absolute; left: 70px; bottom: 44px; width: max-content; max-width: 210px; background: #fff; border-radius: 14px; padding: 7px 10px; font-weight: 800; font-size: 14px; color: var(--ink); box-shadow: var(--shadow); }
.bgl-say small { display: block; font-weight: 600; font-size: 11.5px; color: var(--muted); }
.bgl-say[hidden] { display: none; }
`;
