// Lucky and Tali play together: eight short games on the main scene, and the child takes part in each.
// "🐾 Play together" offers three of them (new ones first). main.js runs a game with a kit g:
//   g.layer             a layer over the scene for the game's own things (buttons, bushes, a goal…)
//   g.W(), g.H()        the scene's size in px
//   g.luckyAt(fx, fy), g.dogAt(fx, fy)   a point on Lucky / Tali (fractions of their box), in scene px
//   g.pose(face, ms, cls, clsMs)          Lucky's face and move;  g.dogDo(cls, ms)  Tali's move
//   g.luckyTo(pct, ms), g.dogTo(pct, ms)  walk them to x (% of the scene, their middle); both come back at the end
//   g.luckyLane(bottomPct, scale), g.dogLane(bottomPct)   race lanes (both come back at the end)
//   g.say(who, key)     a line from LINES (who: 'lucky' or 'dog'); returns how long it takes
//   g.at(ms, fn)        a timer that stops when the game ends;  g.every(ms, fn) → stop()
//   g.btn(html, x, y, onTap, cls)        a tappable thing on the layer, centred at x, y (px)
//   g.fly, g.popUp, g.fxAt, g.hearts, g.sfx, g.luckyPic(face), g.dogPic(face)
//   g.done(stars)       the game is over (0–3 stars: how well it went; every game gives something)

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
const BUSH = '<svg viewBox="0 0 100 80" width="100%" height="100%"><ellipse cx="50" cy="76" rx="44" ry="5" fill="#000" opacity=".12"/><g fill="#4CB050"><circle cx="28" cy="50" r="24"/><circle cx="52" cy="36" r="28"/><circle cx="74" cy="52" r="22"/><rect x="10" y="50" width="80" height="26" rx="12"/></g><g fill="#6CCB5F"><circle cx="40" cy="34" r="10"/><circle cx="62" cy="28" r="8"/></g></svg>';
const TAIL = '<svg class="tg-tail" viewBox="0 0 40 40" width="100%" height="100%"><path d="M8 36 Q10 14 30 6" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M8 36 Q10 14 30 6" stroke="#F2EEE8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="20" cy="18" r="3" fill="#2A2730"/></svg>';
const MOUND = '<svg viewBox="0 0 100 50" width="100%" height="100%"><ellipse cx="50" cy="46" rx="46" ry="5" fill="#000" opacity=".12"/><path d="M6 46 Q20 8 50 6 Q80 8 94 46Z" fill="#A9744A"/><path d="M22 30 q8 -6 14 -2 M58 22 q8 -4 14 2 M40 40 q6 -4 12 0" stroke="#8C5A3C" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';

export const LINES = {
  lucky: {
    tgFetchThrow: [['Апорт, Тали!', 'Fetch, Tali!'], ['Лови мячик!', 'Catch the ball!'], ['Далеко-далеко!', 'Far, far away!']],
    tgFetchCarrot: [['Морковка? Мне? Тали, ты лучший!', "A carrot? For me? Tali, you're the best!"]],
    tgHideCount: [['Раз, два, три, четыре, пять… Я иду искать!', "One, two, three, four, five… Ready or not, here I come!"]],
    tgHideMiss: [['Тут никого. Ищем дальше!', 'Nobody here. Keep looking!'], ['Пусто! Где же он?', "Empty! Where is he?"]],
    tgHideFound: [['Нашли! Хвостик его выдал!', 'Found you! Your tail gave you away!'], ['Попался, Тали!', 'Gotcha, Tali!']],
    tgGoal: [['Гол! Гол! Го-о-ол!', 'Goal! Goal! Go-o-oal!'], ['Прямо в угол! Вот это удар!', 'Right into the corner! What a shot!']],
    tgSaved: [['Ой, поймал! Тали, ты настоящий вратарь.', "Oh, he caught it! Tali, you're a real goalie."]],
    tgTugGo: [['Тяни-тяни! Помогай мне!', 'Pull, pull! Help me!']],
    tgTugWin: [['Мы победили! Сила кроличьих лап!', 'We won! The power of bunny paws!']],
    tgTugDraw: [['Ничья! Оба в траве. Ха-ха!', "It's a draw! We both fell in the grass. Ha-ha!"]],
    tgDanceMine: [['Моя очередь! Повторяю!', 'My turn! Copy that!']],
    tgDanceOops: [['Ой, запутался в лапах! Ещё раз!', 'Oops, I tripped over my paws! Again!']],
    tgDanceAll: [['А теперь все вместе! Дискотека!', "And now all together! Disco time!"]],
    tgDigBone: [['Косточка! Это для Тали.', "A bone! That's for Tali."]],
    tgDigCarrot: [['Морковка! Это для меня!', "A carrot! That's for me!"]],
    tgDigBoot: [['Старый ботинок? Кто его тут закопал?', 'An old boot? Who buried that here?']],
    tgDigHearts: [['Сердечки! Настоящий клад!', 'Hearts! A real treasure!']],
    tgRaceGo: [['Жми быстрее, помогай мне бежать!', 'Tap fast, help me run!']],
    tgRaceWin: [['Я первый! Кроличья скорость!', 'I won! Bunny speed!']],
    tgRaceLose: [['Тали быстрее. В следующий раз догоню!', "Tali was faster. I'll catch him next time!"]],
    tgRacePhoto: [['Фотофиниш! Ничья! Мы оба чемпионы!', "Photo finish! It's a tie! We're both champions!"]],
    tgPhotoGo: [['Корчим рожицы! Лови момент!', "Let's pull funny faces! Catch the moment!"]],
    tgPhotoDone: [['Вот это фото! Повесим на холодильник.', "What a photo! Let's put it on the fridge."], ['Мы такие смешные! Самое лучшее фото.', "We look so funny! The best photo ever."]],
  },
  dog: {
    tgFetchBack: [['Гав! Принёс!', 'Woof! Got it!'], ['Ещё, ещё! Бросай ещё!', 'Again, again! Throw it again!']],
    tgFetchSock: [['Мячик не нашёл, зато нашёл носок!', "Couldn't find the ball, but I found a sock!"]],
    tgFetchStick: [['Мячик потерялся. Вот палка, тоже хорошая!', 'The ball got lost. Here is a stick, just as good!']],
    tgHideGo: [['Закрой глаза, я прячусь!', "Close your eyes, I'm hiding!"]],
    tgHideOut: [['Ха! Ты меня нашла!', 'Ha! You found me!']],
    tgKeeper: [['Я вратарь! Ни один мяч не пройдёт!', "I'm the goalie! No ball gets past me!"]],
    tgTugGo: [['Р-р-р! Шарфик мой!', 'Grrr! The scarf is mine!']],
    tgDanceShow: [['Смотри и повторяй!', 'Watch and copy!']],
    tgDigGo: [['Копаю-копаю! Тут что-то есть!', "Digging, digging! There's something here!"]],
    tgRaceGo: [['На старт! Внимание! Марш!', 'Ready! Steady! Go!']],
    tgRaceWin: [['Гав! Я победил! Лапы-ракеты!', 'Woof! I won! Rocket paws!']],
    tgPhotoCheese: [['Скажи «сыр»!', 'Say cheese!']],
  },
};

// ---------- the games ----------

// Fetch: tap the ball, Lucky throws it, Tali runs after it and brings back… something
const fetch = {
  id: 'fetch', e: '🎾', name: ['Апорт', 'Fetch'], hint: ['Брось мяч, Тали принесёт', 'Throw the ball, Tali brings it back'],
  run(g) {
    let round = 0;
    const finds = shuffle([['🎾', 'tgFetchBack'], ['🧦', 'tgFetchSock'], ['🪵', 'tgFetchStick']]).slice(0, 2);
    const next = () => {
      if (round === 3) return g.done(3);
      const [px, py] = g.luckyAt(0.82, 0.62);
      const b = g.btn('🎾', px, py, () => {
        b.remove();
        g.say('lucky', 'tgFetchThrow');
        g.pose('happy', 1200, 'throw', 900);
        g.sfx.whoosh();
        const far = round % 2 ? [-40, g.H() * 0.25] : [g.W() + 40, g.H() * 0.2];
        g.fly('🎾', [px, py], far, 900, { arc: 120, spin: 540, size: 34 });
        g.at(500, () => { g.dogDo('tgRunOff', 1800); g.sfx.gallop(); });
        g.at(2300, () => {
          const last = round === 2, [item, key] = last ? ['🥕', null] : finds[round] || ['🎾', 'tgFetchBack'];
          const [dx, dy] = g.dogAt(0.3, 0.55);
          g.popUp(item, dx, dy, 1500, 34, 'pop-stay');
          g.sfx.bark();
          if (key) g.say('dog', key);
          if (last) {
            g.at(900, () => { g.fly('🥕', [dx, dy], g.luckyAt(0.5, 0.56), 600, { arc: 50, spin: 200, size: 30 }); });
            g.at(1500, () => { g.pose('eat', 1800); g.sfx.crunch(); g.say('lucky', 'tgFetchCarrot'); g.hearts(...g.luckyAt(0.5, 0.2), 5); });
          }
          round++;
          g.at(last ? 3800 : 2200, next);
        });
      }, 'tg-ball pulse');
    };
    next();
  },
};

// Hide and seek: Tali hides behind one of three bushes; his tail gives him away (later and later)
const hide = {
  id: 'hide', e: '🌳', name: ['Прятки', 'Hide and seek'], hint: ['Найди Тали за кустами', 'Find Tali behind the bushes'],
  run(g) {
    let round = 0, firstTry = 0;
    g.say('dog', 'tgHideGo');
    const play = () => {
      if (round === 3) { g.dogDo('tgBack', 900); g.at(900, () => g.done(firstTry)); return; }
      if (round === 0) g.dogDo('tgHide', 400000); // once: hiding him again each round would flash him for a moment
      // a row of bushes on the hill, above Lucky's head
      const W = g.W(), H = g.H(), y = H * 0.44, xs = [W * 0.18, W * 0.5, W * 0.82], spot = Math.floor(Math.random() * 3);
      let missed = false, over = false;
      const bushes = xs.map((x, i) => g.btn(BUSH, x, y, () => {
        if (over) return;
        if (i !== spot) {
          missed = true;
          g.sfx.puff();
          bushes[i].classList.add('tg-shake');
          g.fxAt(x, y - 20, ['🍃'], 3, 'drop');
          g.say('lucky', 'tgHideMiss');
          setTimeout(() => bushes[i]?.classList.remove('tg-shake'), 600);
          return;
        }
        over = true;
        if (!missed) firstTry++;
        g.sfx.bark();
        g.popUp('🐶', x, y - 30, 1600, 52, 'pop-rise');
        g.say('dog', 'tgHideOut');
        g.at(700, () => { g.pose('laugh', 1500, 'binky'); g.say('lucky', 'tgHideFound'); });
        g.at(2400, () => { bushes.forEach((b) => b.remove()); round++; play(); });
      }, 'tg-bush'));
      // the tail shows at once in the first round, later in the next ones; a giggle helps
      g.at([300, 1800, 3200][round], () => { if (over) return; const t = document.createElement('div'); t.className = 'tg-tailbox'; t.innerHTML = TAIL; bushes[spot].appendChild(t); g.sfx.squeak(); });
      if (round === 0) g.at(600, () => g.say('lucky', 'tgHideCount'));
    };
    g.at(1200, play);
  },
};

// Football: Tali in goal. He leans one way before he dives: kick to the other corner
const football = {
  id: 'football', e: '⚽', name: ['Футбол', 'Football'], hint: ['Бей в угол, где нет вратаря', "Kick into the corner the goalie isn't in"],
  run(g) {
    let kick = 0, goals = 0;
    g.say('dog', 'tgKeeper');
    const W = g.W(), H = g.H();
    const [gx, gy] = g.dogAt(0.5, 0.45);
    const goal = g.btn('<div class="tg-goal"></div>', gx, gy, () => {}, 'tg-goalbox');
    const shoot = () => {
      if (kick === 3) { goal.remove(); return g.done(goals); }
      const lean = Math.random() < 0.5 ? 'L' : 'R';
      let shot = false;
      g.at(700, () => g.dogDo('tgLean' + lean, 1400));
      const corner = (side) => {
        if (shot) return;
        shot = true;
        tl.remove(); tr.remove();
        const [bx, by] = g.luckyAt(0.7, 0.9), tx = gx + (side === 'L' ? -1 : 1) * W * 0.12, ty = gy - H * 0.06;
        g.pose('happy', 1200, 'hop', 600); // the ninja 'kick' turns him upside down: a hop reads as a kick here
        g.sfx.bonk();
        g.fly('⚽', [bx, by], [tx, ty], 600, { arc: 40, spin: 720, size: 30 });
        g.dogDo('tgDive' + lean, 900);
        g.at(650, () => {
          if (side !== lean) { goals++; g.sfx.fanfare(); g.fxAt(tx, ty, ['🎉', '⭐', '✨'], 8, 'spark'); g.say('lucky', 'tgGoal'); g.pose('laugh', 1600, 'binky'); }
          else { g.sfx.catch(); g.say('lucky', 'tgSaved'); g.pose('surprised', 1400, 'startle', 1100); }
        });
        kick++;
        g.at(2600, shoot);
      };
      const tl = g.btn('🎯', gx - W * 0.12, gy - H * 0.06, () => corner('L'), 'tg-target');
      const tr = g.btn('🎯', gx + W * 0.12, gy - H * 0.06, () => corner('R'), 'tg-target');
    };
    g.at(1400, shoot);
  },
};

// Tug of war with a scarf: tap fast to help Lucky; it always ends with somebody (or both) in the grass
const tug = {
  id: 'tug', e: '🧣', name: ['Перетягивание', 'Tug of war'], hint: ['Жми быстро, помогай Лаки', 'Tap fast to help Lucky'],
  run(g) {
    let pos = 0, over = false;
    const [lx, ly] = g.luckyAt(0.85, 0.62), [dx] = g.dogAt(0.2, 0.6);
    const rope = g.btn('<div class="tg-rope"><i class="tg-knot"></i></div>', (lx + dx) / 2, ly, () => {}, 'tg-ropebox');
    rope.style.width = Math.max(60, dx - lx) + 'px';
    const knot = rope.querySelector('.tg-knot');
    const bar = g.btn('<div class="tg-meter"><i></i></div>', g.W() / 2, g.H() * 0.12, () => {}, 'tg-meterbox');
    const fill = bar.querySelector('i');
    const show = () => { knot.style.left = 50 - pos / 2 + '%'; fill.style.width = 50 + pos / 2 + '%'; };
    g.say('dog', 'tgTugGo');
    g.at(1300, () => g.say('lucky', 'tgTugGo'));
    g.pose('ok', 9000, 'strain', 9000);
    g.dogDo('tgPull', 9000);
    const pull = g.btn('💪', g.W() / 2, g.H() * 0.92, () => { if (over) return; pos = Math.min(100, pos + 7); g.sfx.tap(); show(); if (pos >= 100) finish(); }, 'tg-big pulse');
    const stop = g.every(120, () => { if (over) return; pos = Math.max(-100, pos - 2.2 - Math.random() * 1.6); show(); if (pos <= -100) finish(); });
    g.at(9000, () => finish());
    function finish() {
      if (over) return;
      over = true;
      stop();
      pull.remove();
      g.pose('ok', 10, null);
      const win = pos > 25, draw = !win && pos > -60;
      g.sfx.thump();
      if (win || draw) g.dogDo('tgFlop', 1600);
      if (!win) g.pose('laugh', 1800, 'flop', 1600);
      else g.pose('laugh', 1800, 'binky');
      g.at(500, () => { rope.remove(); bar.remove(); g.say('lucky', win ? 'tgTugWin' : 'tgTugDraw'); });
      g.at(2600, () => g.done(win ? 3 : draw ? 2 : 1));
    }
  },
};

// Dance-off: Tali shows moves, the child repeats them with the buttons, Lucky dances them; then a disco
const MOVES = [['🌀', 'pirouette', 'dogspin'], ['⬆️', 'bigjump', 'hop'], ['〰️', 'shimmy', 'tgWiggle']];
const dance = {
  id: 'dance', e: '💃', name: ['Танцевальный баттл', 'Dance-off'], hint: ['Повтори движения Тали', "Copy Tali's moves"],
  run(g) {
    let round = 0, right = 0;
    const W = g.W(), H = g.H();
    const pads = MOVES.map(([e], i) => g.btn(e, W * (0.28 + i * 0.22), H * 0.93, () => press(i), 'tg-pad'));
    let seq = [], want = 0, listening = false;
    const light = (i) => { pads[i].classList.add('on'); setTimeout(() => pads[i].classList.remove('on'), 450); };
    const show = () => {
      if (round === 3) return finale();
      seq = [...seq, Math.floor(Math.random() * 3)];
      want = 0;
      listening = false;
      g.say('dog', 'tgDanceShow');
      seq.forEach((m, k) => g.at(1300 + k * 1100, () => { light(m); g.dogDo(MOVES[m][2], 1000); g.sfx.note([523, 659, 784][m]); }));
      g.at(1300 + seq.length * 1100, () => { listening = true; g.say('lucky', 'tgDanceMine'); });
    };
    function press(i) {
      if (!listening) return;
      light(i);
      g.sfx.note([523, 659, 784][i]);
      g.pose('laugh', 900, MOVES[i][1], 900);
      if (i !== seq[want]) {
        listening = false;
        g.pose('dizzy', 1400, 'spinout', 1100);
        g.say('lucky', 'tgDanceOops');
        round++;
        g.at(2200, show);
        return;
      }
      want++;
      if (want === seq.length) { listening = false; right++; round++; g.sfx.sparkle(); g.at(1300, show); }
    }
    function finale() {
      pads.forEach((p) => p.remove());
      g.say('lucky', 'tgDanceAll');
      g.sfx.disco();
      g.pose('laugh', 3200, 'disco', 3200);
      g.dogDo('dogspin', 1400);
      g.at(1500, () => g.dogDo('hop', 600));
      g.at(2100, () => g.dogDo('dogspin', 1400));
      g.fxAt(W / 2, H * 0.3, ['🎵', '🎶', '✨'], 8, 'spark');
      g.at(3600, () => g.done(right));
    }
    show();
  },
};

// Treasure: Tali digs three holes, the child picks one; then the others are shown
const PRIZES = [['🦴', 'tgDigBone'], ['🥕', 'tgDigCarrot'], ['👢', 'tgDigBoot'], ['💖', 'tgDigHearts']];
const dig = {
  id: 'dig', e: '🦴', name: ['Клад', 'Treasure hunt'], hint: ['Выбери ямку', 'Pick a hole'],
  run(g) {
    let round = 0, stars = 1;
    g.say('dog', 'tgDigGo');
    const play = () => {
      if (round === 2) return g.done(Math.min(3, stars));
      g.dogDo('tgDig', 1600);
      g.sfx.puff();
      const W = g.W(), H = g.H(), y = H * 0.84, prizes = shuffle(PRIZES).slice(0, 3);
      let picked = false;
      const mounds = [0.2, 0.5, 0.8].map((fx, i) => g.btn(MOUND, W * fx, y, () => {
        if (picked) return;
        picked = true;
        const [e, key] = prizes[i];
        g.sfx.pop();
        g.popUp(e, W * fx, y - 34, 2600, 44, 'pop-rise');
        g.say('lucky', key);
        if (e === '💖') { stars += 2; g.hearts(W * fx, y - 30, 6); g.sfx.levelup(); }
        else if (e === '🦴') { stars++; g.dogDo('hop', 600); g.sfx.bark(); }
        else if (e === '🥕') { stars++; g.pose('eat', 1600); g.sfx.crunch(); }
        else { g.pose('laugh', 1600, 'hop'); g.dogDo('sneeze', 600); }
        g.at(1500, () => prizes.forEach(([o], k) => { if (k !== i) g.popUp(o, W * [0.2, 0.5, 0.8][k], y - 26, 1400, 30); }));
        g.at(3200, () => { mounds.forEach((m) => m.remove()); round++; play(); });
      }, 'tg-mound'));
      g.at(200, () => mounds.forEach((m, k) => setTimeout(() => m.classList.add('up'), k * 250)));
    };
    g.at(1200, play);
  },
};

// Race: 3-2-1 to the flag; tap fast to help Lucky. Sometimes a photo finish
const race = {
  id: 'race', e: '🏁', name: ['Гонка', 'Race'], hint: ['Жми быстро, чтобы Лаки бежал', 'Tap fast to make Lucky run'],
  run(g) {
    let me = 16, tali = 16, over = false, started = false;
    const W = g.W(), H = g.H();
    const flag = g.btn('🏁', W * 0.9, H * 0.5, () => {}, 'tg-flag');
    g.luckyLane(30, 0.62); // two lanes: Lucky a little further back, Tali in front
    g.dogLane(3);
    g.luckyTo(me, 700);
    g.dogTo(tali, 700);
    g.say('lucky', 'tgRaceGo');
    ['3', '2', '1'].forEach((n, i) => g.at(1600 + i * 800, () => { g.popUp(n, W * 0.62, H * 0.56, 760, 84, 'tg-count'); g.sfx.beep(false); }));
    g.at(4000, () => { g.popUp('GO!', W * 0.62, H * 0.56, 900, 64, 'tg-count'); g.sfx.beep(true); g.say('dog', 'tgRaceGo'); started = true; });
    const go = g.btn('🏃', W / 2, H * 0.92, () => { if (!started || over) return; me = Math.min(84, me + 2.6); g.luckyTo(me, 160); g.sfx.tap(); if (me >= 84) finish(); }, 'tg-big pulse');
    const tick = g.every(200, () => {
      if (!started || over) return;
      // Tali keeps a steady pace and slows near the end when Lucky is far behind, so it stays close
      const gap = me - tali;
      tali = Math.min(84, tali + 1.6 + Math.random() * 0.9 + (gap > 10 ? 0.6 : 0) - (gap < -12 ? 0.8 : 0));
      g.dogTo(tali, 200);
      if (tali >= 84) finish();
    });
    g.at(4000 + 14000, () => finish());
    function finish() {
      if (over) return;
      over = true;
      tick();
      go.remove();
      const d = me - tali;
      g.at(400, () => {
        flag.remove();
        if (Math.abs(d) < 3) { g.popUp('📸', W / 2, H * 0.35, 1600, 54, 'pop-stay'); g.sfx.chime(); g.say('lucky', 'tgRacePhoto'); g.pose('laugh', 1600, 'binky'); g.dogDo('hop', 600); g.at(2400, () => g.done(3)); }
        else if (d > 0) { g.sfx.fanfare(); g.say('lucky', 'tgRaceWin'); g.pose('laugh', 1600, 'binky'); g.at(2400, () => g.done(3)); }
        else { g.sfx.bark(); g.say('dog', 'tgRaceWin'); g.dogDo('dogspin', 1400); g.at(1800, () => { g.say('lucky', 'tgRaceLose'); g.pose('happy', 1400); }); g.at(4200, () => g.done(1)); }
      });
    }
  },
};

// Photo: they pull funny faces in turn; the child presses 📸 to catch the moment and gets a picture to keep
const FACES = [['laugh', 'hop'], ['wink', 'tilt'], ['cheeky', 'shimmy'], ['surprised', 'startle'], ['stars', 'proud'], ['grin', 'bigears'], ['smug', 'peek']];
const DOG_FACES = ['tgTongue', 'tgTilt', 'sneeze', 'hop', 'perk'];
const photo = {
  id: 'photo', e: '📸', name: ['Фото на память', 'Photo time'], hint: ['Поймай смешной момент', 'Catch a funny moment'],
  run(g) {
    let face = FACES[0], shot = false;
    g.say('lucky', 'tgPhotoGo');
    const stop = g.every(800, () => {
      if (shot) return;
      face = pick(FACES.filter((f) => f !== face));
      g.pose(face[0], 900, face[1], 700);
      g.dogDo(pick(DOG_FACES), 700);
    });
    const W = g.W(), H = g.H();
    g.at(1200, () => g.say('dog', 'tgPhotoCheese'));
    const snap = () => {
      if (shot) return;
      shot = true;
      stop();
      cam.remove();
      g.sfx.zip();
      g.layer.insertAdjacentHTML('beforeend', '<div class="tg-flash"></div>');
      const date = new Date().toLocaleDateString(document.documentElement.lang === 'ru' ? 'ru-RU' : 'en-IE', { day: 'numeric', month: 'long' });
      g.at(500, () => {
        const card = g.btn(`<div class="tg-polaroid"><div class="tg-pic"><div class="tg-pl">${g.luckyPic(face[0])}</div><div class="tg-pd">${g.dogPic('happy')}</div></div><p>Lucky & Tali · ${date}</p></div>`, W / 2, H * 0.42, () => {}, 'tg-photo');
        g.sfx.sparkle();
        g.say('lucky', 'tgPhotoDone');
        g.at(3800, () => { card.classList.add('away'); });
        g.at(4400, () => g.done(3));
      });
    };
    const cam = g.btn('📸', W / 2, H * 0.92, snap, 'tg-big pulse');
    g.at(15000, snap);
  },
};

export const TOGETHER = [fetch, hide, football, tug, dance, dig, race, photo];

// ---------- running a game ----------
// api (from main.js): scene, lucky (Lucky's element), dog (Tali's box), sfx, hop(el, cls, ms), setTemp(face, ms),
// say(list, who) → ms, fly, popUp, fxAt(x, y, list, n, cls), hearts(x, y, n), luckyPoint(fx, fy), luckyPic(face),
// dogPic(face), onDone(stars | null)
export function playTogether(game, api) {
  const { scene, lucky: L, dog: D, sfx } = api;
  const timers = [], stops = [];
  let over = false;
  const layer = document.createElement('div');
  layer.className = 'tg-layer';
  scene.appendChild(layer);
  scene.classList.add('tg-on');
  const rect = () => scene.getBoundingClientRect();
  const body = () => D.querySelector('.dog-body');
  const boxAt = (el, fx, fy) => { const r = el.getBoundingClientRect(), s = rect(); return [r.left - s.left + r.width * fx, r.top - s.top + r.height * fy]; };
  const lines = (who, key) => (who === 'dog' ? api.DOG : api.LUCKY.antics)[key];
  const g = {
    layer, sfx,
    W: () => rect().width,
    H: () => rect().height,
    luckyAt: (fx, fy) => api.luckyPoint(fx, fy),
    dogAt: (fx, fy) => (body() ? boxAt(body(), fx, fy) : [rect().width * 0.8, rect().height * 0.7]),
    pose: (face, ms, cls, clsMs) => { if (face) api.setTemp(face, ms); if (cls) api.hop(L, cls, clsMs); },
    dogDo: (cls, ms) => { const b = body(); if (b) api.hop(b, cls, ms); },
    luckyTo: (pct, ms = 600) => { L.style.setProperty('--go', ms + 'ms'); L.style.left = pct + '%'; if (ms > 250) api.hop(L, 'walk', ms + 150); },
    luckyLane: (bottomPct, scale) => { L.style.bottom = bottomPct + '%'; L.style.scale = scale; },
    dogLane: (bottomPct) => { D.style.transition = 'bottom .5s'; D.style.bottom = bottomPct + '%'; },
    dogTo: (pct, ms = 600) => { D.style.transition = `right ${ms}ms linear`; D.style.right = `calc(${100 - pct}% - ${D.offsetWidth / 2}px)`; },
    say: (who, key) => (lines(who, key) ? api.say(lines(who, key), who) : 0),
    at: (ms, fn) => { timers.push(setTimeout(() => { if (!over) fn(); }, ms)); },
    every: (ms, fn) => { const id = setInterval(() => { if (!over) fn(); }, ms); stops.push(id); return () => clearInterval(id); },
    btn: (html, x, y, onTap, cls = '') => {
      const b = document.createElement('button');
      b.className = 'tg-btn ' + cls;
      b.innerHTML = html;
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      b.onclick = (e) => { e.stopPropagation(); if (!over) onTap(e); };
      layer.appendChild(b);
      return b;
    },
    fly: api.fly, popUp: api.popUp, fxAt: api.fxAt, hearts: api.hearts,
    luckyPic: api.luckyPic, dogPic: api.dogPic,
    done: (stars) => finish(stars),
  };
  function finish(stars) {
    if (over) return;
    over = true;
    timers.forEach(clearTimeout);
    stops.forEach(clearInterval);
    layer.classList.add('tg-out');
    setTimeout(() => layer.remove(), 400);
    scene.classList.remove('tg-on');
    L.style.left = '';
    L.style.bottom = '';
    L.style.scale = '';
    D.style.right = '';
    D.style.bottom = '';
    setTimeout(() => { D.style.transition = ''; }, 700);
    const b = body();
    if (b) [...b.classList].filter((c) => c.startsWith('tg')).forEach((c) => b.classList.remove(c));
    api.onDone(stars);
  }
  const x = document.createElement('button');
  x.className = 'tg-x';
  x.setAttribute('aria-label', 'close');
  x.textContent = '✕';
  x.onclick = (e) => { e.stopPropagation(); sfx.tap(); finish(null); };
  layer.appendChild(x);
  game.run(g);
  return { cancel: () => finish(null), on: () => !over };
}

// The games in the order to offer them: ones not played yet first (in a random order), then the ones played longest ago
export function offerGames(played = []) {
  const fresh = shuffle(TOGETHER.filter((t) => !played.includes(t.id)));
  const old = played.map((id) => TOGETHER.find((t) => t.id === id)).filter(Boolean);
  return [...fresh, ...old];
}

// the games' look (main.js adds it to the page)
export const CSS = `
.tg-layer { position: absolute; inset: 0; z-index: 8; pointer-events: none; }
.tg-layer > * { pointer-events: auto; }
.tg-layer.tg-out { opacity: 0; transition: opacity .35s; }
.scene.tg-on .dog > button, .scene.tg-on .dog > .pill { display: none; }
/* a game is a clean stage: the decorations step away for a moment and come back after it */
.decor { transition: opacity .4s; }
.scene.tg-on .decor, .scene.tg-on .hunt { opacity: 0; pointer-events: none !important; }
.scene.tg-on .decor * { pointer-events: none !important; }
.tg-btn { position: absolute; transform: translate(-50%, -50%); border: 0; background: none; padding: 0; font-size: 44px; line-height: 1; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.tg-btn.pulse { animation: tgPulse 1.1s ease-in-out infinite; }
@keyframes tgPulse { 50% { transform: translate(-50%, -50%) scale(1.14); } }
.tg-big { width: 74px; height: 74px; border-radius: 50%; background: #fff; box-shadow: 0 6px 18px #0002; font-size: 40px; }
.tg-x { position: absolute; top: 8px; right: 8px; width: 38px; height: 38px; border-radius: 50%; border: 0; background: #fffd; box-shadow: 0 2px 8px #0002; font-size: 18px; color: #8A6A8E; }
.tg-bush { width: 27%; aspect-ratio: 100 / 80; }
.tg-bush.tg-shake { animation: tgShake .5s ease-in-out; }
@keyframes tgShake { 25% { transform: translate(-50%, -50%) rotate(-6deg); } 75% { transform: translate(-50%, -50%) rotate(6deg); } }
.tg-tailbox { position: absolute; right: -4%; top: 4%; width: 30%; aspect-ratio: 1; pointer-events: none; }
.tg-tail { transform-origin: 20% 90%; animation: wag .3s ease-in-out infinite alternate; }
.tg-goalbox { pointer-events: none !important; width: 52%; }
.tg-goal { width: 100%; aspect-ratio: 2.1; border: 6px solid #fff; border-bottom: 0; border-radius: 6px 6px 0 0;
  background: repeating-linear-gradient(0deg, #fff6 0 2px, transparent 2px 14px), repeating-linear-gradient(90deg, #fff6 0 2px, transparent 2px 14px); box-shadow: 0 0 0 2px #0001; }
.tg-target { font-size: 40px; animation: tgPulse 1s ease-in-out infinite; }
.tg-ropebox { pointer-events: none !important; height: 14px; }
.tg-rope { position: relative; width: 100%; height: 12px; border-radius: 5px; background: repeating-linear-gradient(90deg, #FF5FA2 0 12px, #fff 12px 20px); box-shadow: 0 2px 4px #0002; }
.tg-knot { position: absolute; left: 50%; top: 50%; width: 18px; height: 18px; margin: -9px 0 0 -9px; border-radius: 50%; background: #FFD23F; border: 3px solid #fff; transition: left .12s; }
.tg-meterbox { pointer-events: none !important; }
.tg-meter { width: min(64vw, 260px); height: 16px; border-radius: 8px; background: #8FD0FF; overflow: hidden; box-shadow: 0 2px 8px #0002; border: 3px solid #fff; }
.tg-meter i { display: block; height: 100%; width: 50%; background: #FF5FA2; transition: width .12s; }
.tg-pad { width: 58px; height: 58px; border-radius: 50%; background: #fff; box-shadow: 0 4px 12px #0002; font-size: 32px; transition: transform .15s, background .15s; }
.tg-pad.on { transform: translate(-50%, -50%) scale(1.22); background: #FFE066; }
.tg-mound { width: 25%; aspect-ratio: 2; transform: translate(-50%, -50%) scale(0); transition: transform .4s cubic-bezier(.3, 1.6, .5, 1); }
.tg-mound.up { transform: translate(-50%, -50%) scale(1); }
.tg-flag { font-size: 52px; pointer-events: none !important; }
.fly-fx.tg-count { font-weight: 900; color: #fff; text-shadow: 0 3px 0 #FF5FA2, 0 0 12px #0003; font-family: inherit; transform: translate(-50%, -50%); animation: tgCount var(--ms) ease-out forwards; }
@keyframes tgCount { from { transform: translate(-50%, -50%) scale(1.6); opacity: 0; } 25% { transform: translate(-50%, -50%) scale(1); opacity: 1; } 80% { opacity: 1; } to { opacity: 0; } }
.tg-flash { position: absolute; inset: 0; background: #fff; animation: tgFlash .5s ease-out forwards; pointer-events: none; }
@keyframes tgFlash { from { opacity: 1; } to { opacity: 0; } }
.tg-photo { width: min(72%, 290px); pointer-events: none !important; animation: tgPhotoIn .5s cubic-bezier(.3, 1.4, .5, 1); }
@keyframes tgPhotoIn { from { transform: translate(-50%, -50%) scale(.3) rotate(-20deg); opacity: 0; } }
.tg-photo.away { transition: transform .5s ease-in, opacity .5s; transform: translate(-50%, -160%) scale(.4) rotate(10deg); opacity: 0; }
.tg-polaroid { background: #fff; padding: 10px 10px 4px; border-radius: 4px; box-shadow: 0 10px 30px #0003; transform: rotate(-3deg); }
.tg-pic { display: flex; align-items: flex-end; background: linear-gradient(#9AD8FF, #FFE3F1); border-radius: 2px; padding: 8px 4px 2px; }
.tg-pl { width: 56%; } .tg-pd { width: 44%; } .tg-pl svg, .tg-pd svg { width: 100%; height: auto; display: block; }
.tg-polaroid p { margin: 6px 0 2px; font-size: 15px; color: #6A4A6E; text-align: center; font-weight: 700; }
.dog-body.tgRunOff { animation: tgRunOff 1.8s ease-in-out; }
@keyframes tgRunOff { 35%, 65% { transform: translateX(160%); opacity: 0; } }
.dog-body.tgHide { opacity: 0; transform: scale(.6); transition: opacity .3s, transform .3s; }
.dog-body.tgBack { animation: enter 1s cubic-bezier(.3, 1.3, .5, 1); }
.dog-body.tgLeanL { transform: rotate(-12deg); transition: transform .3s; } .dog-body.tgLeanR { transform: rotate(12deg); transition: transform .3s; }
.dog-body.tgDiveL { animation: tgDiveL .9s ease-out; } .dog-body.tgDiveR { animation: tgDiveR .9s ease-out; }
@keyframes tgDiveL { 40% { transform: translate(-55%, -10%) rotate(-50deg); } 70% { transform: translate(-50%, 0) rotate(-80deg); } }
@keyframes tgDiveR { 40% { transform: translate(55%, -10%) rotate(50deg); } 70% { transform: translate(50%, 0) rotate(80deg); } }
.dog-body.tgPull { animation: tgPull .5s ease-in-out infinite alternate; transform-origin: 50% 100%; }
@keyframes tgPull { from { transform: rotate(8deg) translateX(4%); } to { transform: rotate(14deg) translateX(8%); } }
.dog-body.tgFlop { animation: tgFlop 1.6s ease-in-out; transform-origin: 50% 100%; }
@keyframes tgFlop { 25%, 75% { transform: rotate(70deg) translate(10%, 10%); } }
.dog-body.tgWiggle { animation: tgWiggle .2s ease-in-out 5 alternate; }
@keyframes tgWiggle { from { transform: skewX(-8deg); } to { transform: skewX(8deg); } }
.dog-body.tgDig { animation: tgDig .25s ease-in-out 6 alternate; transform-origin: 50% 100%; }
@keyframes tgDig { from { transform: rotate(-6deg) translateY(4%); } to { transform: rotate(6deg); } }
.dog-body.tgTongue { animation: tgTongue .7s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes tgTongue { 40% { transform: scale(1.12, .9); } }
.dog-body.tgTilt .dog-head { animation: tgTilt .7s ease-in-out; }
@keyframes tgTilt { 50% { transform: rotate(-18deg); } }
`;

// ---------- Tali's visits: how he arrives, little moments while he is here, how he leaves ----------
// Each scene is a function of a kit k and returns chat steps for main.js talk(): k.line(who, key) is a timed line
// from TALI_LINES, a function step returns how long to wait. k: line, dogDo(cls, ms), pose(face, ms, cls, clsMs),
// fly, popUp, fxAt, hearts, sfx, luckyAt(fx, fy), dogAt(fx, fy), dogWear(emoji, ms)
export const TALI_LINES = {
  lucky: {
    taliBall: [['Мячик! Потом обязательно поиграем!', "A ball! We'll play with it later, for sure!"]],
    taliBooed: [['Ай! Тали, ты меня напугал!', 'Eek! Tali, you scared me!']],
    taliCool: [['Какие очки! Ты самый модный пёс!', "What shades! You're the coolest dog around!"]],
    taliNote: [['Тут написано: «Лаки, ты лучший!» Подпись… Тали!', "It says: 'Lucky, you're the best!' Signed… Tali!"]],
    taliDizzy: [['Ха-ха! У Тали кружится голова!', "Ha-ha! Tali's head is spinning!"]],
    taliBoop: [['Нос к носу! Бип!', 'Nose to nose! Boop!']],
    taliChase: [['Бабочка! Лови её, Тали!', 'A butterfly! Catch it, Tali!']],
    taliStick: [['Палочка? Мне? Спасибо, буду хранить!', "A stick? For me? Thank you, I'll keep it!"]],
    taliNapLucky: [['Тсс… Тали уснул. Говорим шёпотом.', "Shh… Tali's fallen asleep. Let's whisper."]],
    taliSnack: [['Перекус! Мне морковку, Тали косточку.', 'Snack time! A carrot for me, a bone for Tali.']],
    taliCalled: [['Тали, кажется, тебя зовут домой!', "Tali, I think they're calling you home!"]],
  },
  dog: {
    taliBallHi: [['Смотри, что я нашёл!', 'Look what I found!']],
    taliBoo: [['Бу-у!', 'Boo!']],
    taliShades: [['Привет, крутой кролик!', 'Hey there, cool bunny!']],
    taliLetter: [['Тебе письмо! Срочное!', "A letter for you! It's urgent!"]],
    taliWhee: [['Кувырок! Ой… Всё кружится!', 'A somersault! Whoa… Everything is spinning!']],
    taliStickGift: [['Это тебе! Самая лучшая палка!', "This is for you! The best stick ever!"]],
    taliYawn: [['Ох, я так набегался… Пойду посплю дома.', "Phew, I've run so much… I'll go home for a nap."]],
    taliMum: [['Это меня! Бегу-бегу!', "That's me! Coming, coming!"]],
    taliBallBye: [['Мячик! Догоню! Пока-пока!', "A ball! I'll catch it! Bye-bye!"]],
  },
};

// how he arrives (the entry animation, then a little scene); a joke straight away only some of the time
export const ARRIVALS = [
  { entry: 'enter', steps: (k) => [k.line('dog', 'taliBallHi'), () => { k.fly('🎾', k.dogAt(0.3, 0.5), k.luckyAt(0.6, 0.92), 700, { arc: 40, spin: 400, size: 26 }); k.sfx.boing(); return 800; },
    () => { k.pose('laugh', 1200, 'kick', 900); k.fly('🎾', k.luckyAt(0.6, 0.92), k.dogAt(0.4, 0.4), 700, { arc: 60, spin: 400, size: 26 }); k.sfx.bonk(); return 900; }, k.line('lucky', 'taliBall')] },
  { entry: 'tgSneak', steps: (k) => [() => 400, () => { k.dogDo('hop', 600); k.sfx.bark(); return 100; }, k.line('dog', 'taliBoo'), () => { k.pose('surprised', 1400, 'startle', 1100); return 700; }, k.line('lucky', 'taliBooed')] },
  { entry: 'enter', steps: (k) => [() => { k.dogWear('😎', 9000); k.sfx.sparkle(); return 500; }, k.line('dog', 'taliShades'), k.line('lucky', 'taliCool')] },
  { entry: 'enterJump', steps: (k) => [k.line('dog', 'taliLetter'), () => { k.fly('✉️', k.dogAt(0.3, 0.45), k.luckyAt(0.7, 0.7), 700, { arc: 50, size: 28, stay: 2600 }); k.sfx.pop(); return 900; },
    () => { k.pose('happy', 2600, 'think', 2000); return 300; }, k.line('lucky', 'taliNote'), () => { k.hearts(...k.luckyAt(0.5, 0.2), 4); return 300; }] },
  { entry: 'enterSpin', steps: (k) => [k.line('dog', 'taliWhee'), () => { k.popUp('💫', ...k.dogAt(0.5, 0.05), 1800, 30, 'pop-stay'); k.dogDo('tgWiggle', 1000); return 600; }, () => { k.pose('laugh', 1400, 'hop'); return 100; }, k.line('lucky', 'taliDizzy')] },
  { entry: 'enterSkate', steps: () => [] },
  { entry: 'enterDig', steps: () => [] },
];

// little moments while he is here, now and then, when nobody is busy
export const MOMENTS = [
  (k) => [() => { k.pose('happy', 1600, 'boop', 900); k.dogDo('tgTongue', 700); k.sfx.kiss(); k.hearts(...k.luckyAt(0.85, 0.4), 4); return 600; }, k.line('lucky', 'taliBoop')],
  (k) => [() => { k.fly('🦋', [-30, k.luckyAt(0.5, 0.1)[1]], k.dogAt(0.5, -0.4), 2200, { arc: 60, size: 26 }); return 900; }, k.line('lucky', 'taliChase'),
    () => { k.dogDo('hop', 600); k.pose('laugh', 1400, 'bigjump', 1100); k.sfx.boing(); return 900; }, () => { k.dogDo('hop', 600); k.sfx.bark(); return 600; }],
  (k) => [k.line('dog', 'taliStickGift'), () => { k.fly('🪵', k.dogAt(0.3, 0.5), k.luckyAt(0.78, 0.78), 700, { arc: 40, size: 28, stay: 1800 }); k.sfx.pop(); return 800; },
    () => { k.pose('happy', 1600, 'proud', 1200); return 200; }, k.line('lucky', 'taliStick')],
  (k) => [() => { k.dogDo('tgNap', 6000); k.sfx.yawn(); return 900; }, () => { k.popUp('💤', ...k.dogAt(0.6, 0.1), 2600, 28, 'pop-rise'); return 400; }, k.line('lucky', 'taliNapLucky'),
    () => { k.popUp('💤', ...k.dogAt(0.6, 0.1), 2400, 24, 'pop-rise'); return 2600; }],
  (k) => [() => { k.fly('🥕', [k.luckyAt(0.5, 0.1)[0], -40], k.luckyAt(0.5, 0.56), 800, { size: 28 }); k.fly('🦴', [k.dogAt(0.5, 0)[0], -40], k.dogAt(0.3, 0.5), 800, { size: 28 }); return 900; },
    () => { k.pose('eat', 1800); k.sfx.crunch(); k.dogDo('tgTongue', 700); return 300; }, k.line('lucky', 'taliSnack')],
];

// how he leaves: [steps before the run home, the run]
export const DEPARTURES = [
  null, // the usual "Bye!" and off he runs
  (k) => [() => { k.dogDo('tgNap', 1800); k.sfx.yawn(); return 600; }, k.line('dog', 'taliYawn')],
  (k) => [() => { k.dogDo('perk', 1400); k.sfx.note(880); return 700; }, k.line('lucky', 'taliCalled'), k.line('dog', 'taliMum')],
  (k) => [() => { k.fly('⚽', k.luckyAt(0.4, 0.95), [k.dogAt(0.5, 0.9)[0] + 200, k.dogAt(0.5, 0.9)[1]], 1200, { spin: 720, size: 26 }); k.sfx.bonk(); return 400; }, k.line('dog', 'taliBallBye')],
];

export const TALI_CSS = `
.dog-body.tgSneak { animation: tgSneak 1.9s ease-out; }
@keyframes tgSneak { from { transform: translateX(120%) scaleY(.8); } 70% { transform: translateX(10%) scaleY(.8); } to { transform: none; } }
.dog-body.tgNap { animation: tgNap 6s ease-in-out; transform-origin: 50% 100%; }
@keyframes tgNap { 10%, 90% { transform: rotate(-8deg) scaleY(.9); } }
.dog-wear { position: absolute; left: 50%; top: 18%; transform: translate(-50%, -50%); font-size: calc(var(--dw, 120px) * .32); pointer-events: none; animation: popIn .4s cubic-bezier(.3, 1.6, .5, 1); }
`;
