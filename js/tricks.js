// Lucky's tricks: how he answers a touch. Every gesture on every part of him has several ways to answer, picked by
// weight and never the same twice in a row. Now and then, when nothing else is on the screen, a rare big trick
// instead (at most one in SPECIAL_GAP): Super Bunny's flight, the Cheshire grin, ninja clones, a bunny out of a hat…
// main.js keeps what a touch means for the game (fun, hearts, counters); this file is only the show.
//
// A way returns the line it would like said (main.js says it with its usual cadence), or nothing.
// A rare trick is a scene (antics.js begin/end): anything that covers the screen ends it, and nothing automatic
// starts while it plays. Its line comes when Lucky is back on the ground, so the bubble never hides him.

import { LUCKY } from './i18n.js';
import { sfx } from './sound.js';

const SPECIAL_GAP = 50e3, FIRST_SPECIAL = 20e3;
// how likely a gesture turns into a rare trick (when the screen is free and the last one was long enough ago)
const SPECIAL_CHANCE = { tap: 0.05, double: 0.12, long: 0.14, stroke: 0.12, up: 0.3, down: 0.15, side: 0.25 };
const pick = (a) => a[Math.floor(Math.random() * a.length)];

// api (from main.js): kit (antics.js scene tools), ui, setTemp(face, ms), hop(el, cls, ms), fxAt, hearts, floatFx,
// quiet() - nothing else is on the screen right now, clearBubble(), luckyArt(face), outfits() - outfits she has that
// Lucky isn't wearing, dressUp(id | null), wearing(id), dogEl(), helicopter(), sneeze(), thump(), chase(), say(list)
export function createTricks(api) {
  const { kit, ui } = api;
  const L = ui.lucky;
  const T = LUCKY.tricks, A = LUCKY.antics;
  const { begin, end, at, hold, onEnd, pose, prop, line, popUp, head, nose, feet } = kit;
  const face = (f, ms) => api.setTemp(f, ms);
  const move = (cls, ms) => api.hop(L, cls, ms);
  const center = () => api.luckyPoint(0.5, 0.5);
  const pawUp = () => api.luckyPoint(0.78, 0.42);
  const drop = (a, cls) => { L.classList.remove(cls); a.cls.delete(cls); };
  const swap = (a, from, to, ms) => { drop(a, from); hold(a, to, ms); };
  const poof = () => { sfx.poof(); api.fxAt(...center(), ['💨', '✨', '💨'], 7, 'spark'); };
  const ears = () => L.querySelectorAll('.ear').forEach((e) => api.hop(e, 'wiggle'));
  const later = (ms, fn) => setTimeout(fn, ms);
  // the recorded line that has these English words in it ([] if it was changed), like lineWith in antics.js
  const said = (list, words) => list.filter((x) => x[1].includes(words)).slice(0, 1);

  // ---------- everyday ways: short (under 2.5 s), only classes, faces, sounds and sparkles ----------
  // [weight, key, show() → a line list or nothing, ok?() - only when it fits]
  const binky = () => { sfx.sparkle(); face('laugh', 1400); move('binky', 1000); for (let i = 0; i < 4; i++) later(i * 90, () => api.floatFx(head()[0] + Math.random() * 100 - 50, head()[1], '✨', 'spark')); return LUCKY.binky; };
  const PET_BODY = [
    [3, 'hop', () => { face(pick(['laugh', 'laugh', 'happy']), 1100); move('hop', 600); }],
    [2, 'clap', () => { face('laugh', 1100); move('clap', 900); sfx.clap(); later(350, sfx.clap); }],
    [1, 'sway', () => { face('happy', 1300); move('sway', 1400); }],
    [1, 'proud', () => { face('smug', 1300); move('proud', 1300); }],
    [2, 'wave', () => { face('happy', 1300); move('wave', 1300); }],
    [1, 'shimmy', () => { face('laugh', 1000); move('shimmy', 900); }],
    [1, 'bounce', () => { face('laugh', 1000); move('bounce', 900); sfx.boing(); }],
    [0.8, 'twirl', () => { face('laugh', 900); move('twirl', 800); sfx.whoosh(); }],
    [0.6, 'shy', () => { face('shy', 1700); move('shy', 1700); return T.shy; }],
    [0.6, 'wink', () => { face('wink', 1500); move('hop', 600); sfx.squeak(); return T.wink; }],
    [0.5, 'hearts', () => { face('hearts', 1600); move('proud', 1300); api.hearts(...head(), 5); }],
    [0.5, 'stars', () => { face('stars', 1500); move('bounce', 900); sfx.sparkle(); api.fxAt(...head(), ['✨', '⭐'], 4, 'spark'); }],
  ];
  const WAYS = {
    tap: {
      body: PET_BODY,
      head: [
        [4, 'pat', () => { face('happy', 1100); move('pat', 600); }],
        [1, 'ears', () => { face('laugh', 1000); ears(); }],
        [1, 'tilt', () => { face('happy', 1400); move('tilt', 1400); }],
        [0.8, 'shy', () => { face('shy', 1700); move('shy', 1700); return T.shy; }],
        [0.8, 'hearts', () => { face('hearts', 1600); move('pat', 600); api.hearts(...head(), 4); }],
        // patted so well his ears start spinning (it says its own line)
        [0.35, 'heli', () => { api.helicopter(); return null; }],
      ],
      tummy: [
        [4, 'jiggle', () => { face(pick(['laugh', 'laugh', 'happy']), 1100); move('jiggle', 700); }],
        [2, 'giggle', () => { face('laugh', 1400); move('lol', 1000); return A.giggle; }],
        [1, 'drum', () => { face('laugh', 1000); move('drum', 900); sfx.drum(); }],
        [0.8, 'cheeky', () => { face('cheeky', 1400); move('shimmy', 900); }],
      ],
      feet: [
        [3, 'paws', () => { face('laugh', 900); move('paws', 600); sfx.tap(); return A.paws; }],
        [1, 'tiptoe', () => { face('happy', 1400); move('stretchUp', 1600); }],
        [1, 'taps', () => { face('grin', 1200); move('tapdance', 1300); sfx.taps(); }],
      ],
      tail: [
        [3, 'wag', () => { face('surprised', 800); move('tailwag', 1300); later(700, () => face('laugh', 1000)); sfx.boing(); return [...T.tail, ...kit.chatLine('pom-pom')]; }],
        [1, 'look', () => { face('surprised', 1200); move('look', 1500); }],
        [1, 'chase', () => { api.chase(); return LUCKY.tail; }],
      ],
      paw: [
        [3, 'highfive', () => { face('grin', 1300); move('highfive', 1000); later(330, () => { sfx.clap(); api.fxAt(...pawUp(), ['✨', '⭐'], 4, 'spark'); }); return T.highFive; }],
        [1, 'wave', () => { face('happy', 1300); move('wave', 1300); }],
        [1, 'clap', () => { face('laugh', 1100); move('clap', 900); sfx.clap(); later(350, sfx.clap); }],
      ],
      // the nose: a sneeze (it says its own line), one that never comes ("Ah… ah… Oh, it's gone!"), or three in a row
      nose: [
        [6.5, 'sneeze', () => { api.sneeze(); return null; }],
        [2, 'nearly', () => { face('sleep', 1300); sfx.note(880); later(500, () => sfx.note(988)); move('sniff', 1500); later(1400, () => face('surprised', 900)); return T.fakeSneeze; }],
        [1.5, 'triple', () => {
          face('sleep', 450);
          sfx.note(880);
          [450, 950, 1450].forEach((d, i) => later(d, () => { sfx.sneeze(); move('sneeze', 450); api.fxAt(...nose(), ['💨', '✨'], 3 + i * 2, 'spark'); face('laugh', 700); }));
          later(1500, () => { if (api.free()) api.say(LUCKY.sneeze); });
          return null;
        }],
      ],
    },
    double: {
      body: [
        [4, 'binky', binky],
        [1.5, 'backflip', () => { face('laugh', 1300); move('backflip', 1000); sfx.whoosh(); later(750, () => { sfx.thump(); api.fxAt(...feet(), ['💨'], 3, 'spark'); }); return T.backflip; }],
        [1.5, 'ninjajump', () => { face('laugh', 1400); move('bigjump', 1100); sfx.whoosh(); return A.ninjaJump; }],
        [1, 'starjump', () => { face('stars', 1200); move('starjump', 800); sfx.boing(); api.fxAt(...head(), ['⭐'], 3, 'spark'); return LUCKY.binky; }],
        [1, 'spin', () => { face('laugh', 1500); move('pirouette', 1500); sfx.magic(); return A.spin; }],
      ],
      nose: [
        [4, 'boop', () => { face('laugh', 1000); move('boop', 800); sfx.squeak(); return A.boop; }],
        // a boop… and it tickles: achoo! (it says its own line)
        [0.9, 'sneeze', () => { api.sneeze(); return null; }],
        [1, 'honk', () => { prop('clownNose', 3200); face('grin', 2000); move('bounce', 900); sfx.honk(); later(450, sfx.honk); return LUCKY.wearSay.clownNose; }],
      ],
      tummy: [
        [4, 'drum', () => { face('laugh', 1200); move('drum', 1000); sfx.drum(); return A.drum; }],
        [1, 'bongo', () => { face('stars', 2000); move('drum', 1000); later(950, () => move('drum', 1000)); [0, 450, 900, 1350].forEach((d) => later(d, sfx.drum)); api.fxAt(...head(), ['🎵', '🎶'], 4, 'spark'); return A.drum; }],
      ],
      feet: [
        [3, 'thump', () => { api.thump(); return null; }],
        [1.5, 'tapdance', () => { face('grin', 1600); move('tapdance', 1300); sfx.taps(); later(700, sfx.taps); return T.tapDance; }],
      ],
      tail: [
        [2, 'chase', () => { api.chase(); return LUCKY.tail; }],
        [1, 'wag', () => { face('laugh', 1200); move('tailwag', 1300); sfx.boing(); return kit.chatLine('pom-pom'); }],
      ],
      paw: [
        [2, 'highten', () => { face('stars', 1400); move('highten', 1000); later(330, () => { sfx.clap(); api.fxAt(...head(), ['✨', '⭐'], 6, 'spark'); }); return T.highFive; }],
        [1, 'clap', () => { face('laugh', 1100); move('clap', 900); sfx.clap(); later(350, sfx.clap); }],
      ],
    },
    long: {
      body: [
        [4, 'hug', () => null], // main.js hugs (and says its line)
        [1, 'loaf', () => { face('happy', 2600); move('loaf', 2600); sfx.purr(); return T.loaf; }],
        [1, 'cosy', () => { face('sleep', 2600); move('melt', 2400); sfx.yawn(); later(600, () => api.floatFx(...head(), '💤', 'spark')); later(1300, () => api.floatFx(...head(), '💤', 'spark')); return T.cosy; }],
        [1, 'melt', () => { face('hearts', 2400); move('melt', 2400); sfx.purr(); api.hearts(...head(), 5); }],
      ],
      nose: [
        [3, 'kiss', () => { face('happy', 1500); move('kiss', 1000); sfx.kiss(); api.floatFx(...nose(), '💗'); return A.kiss; }],
        [1, 'blowkiss', () => { face('wink', 1600); move('kiss', 1000); later(600, () => { sfx.kiss(); kit.fly('💋', nose(), [nose()[0] + 60, nose()[1] - 120], 900, { size: 30, arc: 30 }); }); return A.kiss; }],
      ],
      tummy: [
        [3, 'roll', () => { face('laugh', 2200); move('roll', 1400); sfx.happy(); return A.tummyRub; }],
        [1, 'flop', () => { face('laugh', 2400); move('flop', 2600); sfx.puff(); return A.flopFact; }],
      ],
      tail: [
        [1, 'gentle', () => { face('shy', 1800); move('tailwag', 1300); sfx.squeak(); return T.tailGentle; }],
      ],
      paw: [
        [1, 'shake', () => { face('grin', 1600); move('pawshake', 1400); later(300, sfx.tap); later(650, sfx.tap); return T.pawShake; }],
      ],
    },
    stroke: {
      body: [
        [4, 'purr', () => { face('happy', 1800); move('purr'); sfx.purr(); return A.purr; }],
        [1, 'melt', () => { face('hearts', 2200); move('melt', 2400); sfx.purr(); return A.purr; }],
        [1, 'stretch', () => { face('sleep', 1500); move('stretchUp', 1600); later(400, sfx.yawn); return A.stretch; }],
        [0.8, 'roll', () => { face('laugh', 2000); move('roll', 1400); sfx.happy(); return said(A.purr, 'more strokes'); }],
        // stroked over and over: his fur crackles and fluffs up
        [3, 'static', () => { face('surprised', 1500); move('static', 1500); sfx.crackle(); api.fxAt(...head(), ['⚡', '✨'], 6, 'spark'); later(1300, () => face('laugh', 1200)); return [...A.fluffy, ...A.sparkly]; }, () => strokes() >= 3],
      ],
    },
    swipe: {
      up: [
        [3, 'jump', () => { face('laugh', 1400); move('bigjump', 1100); sfx.whoosh(); return A.ninjaJump; }],
        [1, 'starjump', () => { face('stars', 1200); move('starjump', 800); sfx.boing(); return said(LUCKY.facts, 'metre'); }],
      ],
      down: [
        [3, 'pancake', () => { face('surprised', 1300); move('pancake', 1300); sfx.puff(); later(950, sfx.boing); return T.pancake; }],
        [1, 'duck', () => { face('laugh', 1000); move('squash', 700); sfx.boing(); }],
      ],
      side: [
        [2, 'slide', (dir) => { face('laugh', 1400); move(dir === 'left' ? 'slideL' : 'slideR', 1400); sfx.whoosh(); return A.slide; }],
        [1, 'dodge', () => { face('grin', 1200); move('dodge', 1100); sfx.whoosh(); return A.dodge; }],
        [1, 'kick', () => { face('laugh', 1100); move('kick', 1000); sfx.whoosh(); return A.kick; }],
      ],
    },
  };
  WAYS.double.head = WAYS.double.body;
  WAYS.long.head = WAYS.long.body;

  const lastKey = {};
  function choose(slot, list) {
    const ok = list.filter((w) => !w[3] || w[3]());
    const pool = ok.filter((w) => w[1] !== lastKey[slot]);
    const use = pool.length ? pool : ok.length ? ok : list;
    let r = Math.random() * use.reduce((sum, w) => sum + w[0], 0);
    const w = use.find((x) => (r -= x[0]) < 0) || use[0];
    lastKey[slot] = w[1];
    return w;
  }

  // strokes in the last 15 s (many of them make static)
  let strokeTimes = [];
  const strokes = () => { const now = Date.now(); strokeTimes = strokeTimes.filter((t) => now - t < 15e3); return strokeTimes.length; };

  // ---------- rare big tricks ----------
  let nextSpecialAt = Date.now() + FIRST_SPECIAL;
  const recentSpecials = [];
  const outfitLine = (id) => LUCKY.wearSay[id];

  function superhero() {
    const a = begin('superhero');
    if (!api.wearing('cape')) { prop('heroCape', 4900); onEnd(a, () => kit.unprop('cape')); }
    face('grin', 4800);
    hold(a, 'crouch');
    sfx.zip();
    at(a, 650, () => { swap(a, 'crouch', 'heroflight'); sfx.whoosh(); });
    at(a, 1500, () => sfx.whoosh());
    at(a, 2500, () => sfx.whoosh());
    at(a, 3350, () => { swap(a, 'heroflight', 'herolanding', 900); sfx.stomp(); api.fxAt(...feet(), ['💨'], 6, 'spark'); });
    at(a, 3750, () => { face('grin', 1800); line(outfitLine('cape'), 1, 0); });
    at(a, 5000, end);
  }

  function cheshire() {
    const a = begin('cheshire');
    face('grin', 7000);
    sfx.magic();
    hold(a, 'cheshire');
    at(a, 1500, () => line(T.cheshire, 1, 0));
    const back = () => {
      if (a.back) return true;
      a.back = true;
      swap(a, 'cheshire', 'reappear', 800);
      sfx.sparkle();
      face('laugh', 1600);
      api.fxAt(...center(), ['✨'], 6, 'spark');
      line(A.back, 1, 0);
      at(a, 1800, end);
      return true;
    };
    a.onLuckyTap = back; // a tap on the grin brings him back
    at(a, 5600, back);
  }

  function makeClone(side) {
    const r = L.getBoundingClientRect(), s = kit.sceneRect();
    const w = r.width * 0.7, half = w / 2;
    const cx = Math.max(half + 4, Math.min(s.width - half - 4, r.left - s.left + r.width / 2 + side * r.width * 0.46));
    const d = document.createElement('div');
    d.className = 'lucky-clone';
    d.innerHTML = api.luckyArt('smug');
    Object.assign(d.style, { left: cx - half + 'px', top: r.bottom - s.top - w * 1.05 + 'px', width: w + 'px' });
    d.onclick = (e) => { e.stopPropagation(); sfx.puff(); gone(d); };
    ui.scene.appendChild(d);
    return d;
  }
  const gone = (d) => { if (!d.isConnected || d.classList.contains('out')) return; d.style.animationDelay = ''; d.classList.add('out'); setTimeout(() => d.remove(), 450); };

  function clones() {
    const a = begin('clones');
    poof();
    face('smug', 5600);
    const c = [makeClone(-1), makeClone(1)];
    onEnd(a, () => c.forEach(gone));
    at(a, 450, () => { sfx.whoosh(); hold(a, 'shuffle'); c.forEach((d, i) => { d.style.animationDelay = i * 0.25 + 's'; d.classList.add('shuffle'); }); });
    at(a, 1100, () => line(T.clones, 1, 0));
    // the real one is found with a tap
    a.onLuckyTap = () => {
      if (a.found) return true;
      a.found = true;
      c.forEach(gone);
      drop(a, 'shuffle');
      sfx.sparkle();
      face('laugh', 1600);
      move('hop', 600);
      api.hearts(...head(), 5);
      line(A.found, 1, 0);
      at(a, 1700, end);
      return true;
    };
    at(a, 5200, () => { if (!a.found) { c.forEach(gone); sfx.poof(); } });
    at(a, 5700, end);
  }

  function hat() {
    const a = begin('hat');
    const [x, y] = feet();
    const h = popUp('', x, y - 26, 4700, 96, 'pop-stay hat-fx');
    h.innerHTML = '<span class="hat-in">🎩</span>';
    onEnd(a, () => h.remove());
    sfx.magic();
    face('smug', 900);
    at(a, 500, () => { hold(a, 'intohat'); sfx.whoosh(); });
    at(a, 1400, () => { h.classList.add('wobble'); sfx.boing(); api.fxAt(x, y - 70, ['✨'], 4, 'spark'); });
    at(a, 2300, () => { sfx.sparkle(); api.fxAt(x, y - 70, ['✨', '⭐'], 6, 'spark'); });
    at(a, 2800, () => { h.classList.remove('wobble'); swap(a, 'intohat', 'outofhat', 900); face('grin', 2200); sfx.boing(); });
    at(a, 3750, () => line(T.outOfHat, 1, 0));
    at(a, 5000, end);
  }

  function giant() {
    const a = begin('giant');
    face('surprised', 1300);
    sfx.grow();
    hold(a, 'giant');
    const stomp = () => { move('stomp', 500); sfx.stomp(); api.hop(ui.scene, 'quake', 450); api.fxAt(...feet(), ['💨'], 3, 'spark'); };
    at(a, 900, () => { face('grin', 1800); stomp(); });
    at(a, 1600, stomp);
    at(a, 2400, () => { swap(a, 'giant', 'tiny'); sfx.shrink(); face('surprised', 1000); });
    at(a, 3000, () => { face('laugh', 2000); line(A.tiny, 1, 0); });
    at(a, 4900, () => { drop(a, 'tiny'); sfx.boing(); move('hop', 600); });
    at(a, 5500, end);
  }

  function balloon() {
    const a = begin('balloon');
    face('surprised', 2400);
    sfx.grow();
    hold(a, 'puff');
    at(a, 700, () => line(T.balloon, 1, 0));
    at(a, 2500, () => {
      swap(a, 'puff', 'deflate', 1700);
      sfx.deflate();
      face('dizzy', 2600);
      for (let i = 0; i < 7; i++) at(a, i * 220, () => api.floatFx(...center(), '💨', 'spark'));
    });
    at(a, 4250, () => { prop('dizzy', 1600); move('squash', 700); sfx.bonk(); });
    at(a, 5600, end);
  }

  function robot() {
    const a = begin('robot');
    face('ok', 3400);
    hold(a, 'robot');
    sfx.robot();
    at(a, 400, () => line(T.robot, 1, 0));
    at(a, 1300, sfx.robot);
    at(a, 2300, sfx.robot);
    at(a, 3300, () => { drop(a, 'robot'); face('laugh', 1500); move('hop', 600); sfx.happy(); });
    at(a, 4100, end);
  }

  function handstand() {
    const a = begin('handstand');
    face('grin', 3000);
    hold(a, 'handstand');
    sfx.boing();
    at(a, 1100, () => line(T.handstand, 1, 0));
    at(a, 2900, () => face('dizzy', 1600)); // all the blood went to his head
    at(a, 3300, sfx.boing);
    at(a, 3700, () => { drop(a, 'handstand'); move('squash', 700); });
    at(a, 4700, end);
  }

  function statue() {
    const a = begin('statue');
    face('ok', 6200);
    sfx.freeze();
    hold(a, 'statue');
    at(a, 400, () => line(T.statue, 1, 0));
    // a tap makes him laugh; and he can't hold it for long anyway
    const crack = () => {
      if (a.cracked) return true;
      a.cracked = true;
      drop(a, 'statue');
      face('laugh', 2200);
      move('lol', 1000);
      sfx.happy();
      api.hearts(...head(), 5);
      line(LUCKY.tickle, 1, 0);
      at(a, 2300, end);
      return true;
    };
    a.onLuckyTap = crack;
    at(a, 5300, () => { if (!a.cracked) { face('cheeky', 700); move('purr', 600); } });
    at(a, 6000, crack);
  }

  function disco() {
    const a = begin('disco');
    const s = kit.sceneRect();
    const ball = popUp('🪩', s.width / 2, 34, 4700, 44, 'pop-stay disco-ball');
    const lights = document.createElement('div');
    lights.className = 'fx-disco';
    ui.fx.appendChild(lights);
    onEnd(a, () => { lights.remove(); ball.remove(); });
    sfx.disco();
    face('stars', 4300);
    hold(a, 'disco');
    at(a, 500, () => line(T.disco, 1, 0));
    const dog = api.dogEl();
    if (dog) { at(a, 700, () => api.hop(dog, 'dogspin', 1400)); at(a, 2600, () => api.hop(dog, 'dogspin', 1400)); }
    at(a, 4300, () => { drop(a, 'disco'); face('laugh', 1200); move('proud', 1200); });
    at(a, 4800, end);
  }

  function cartwheel() {
    const a = begin('cartwheel');
    face('grin', 900);
    hold(a, 'cartwheel', 2000);
    sfx.whoosh();
    at(a, 800, () => { sfx.bonk(); face('dizzy', 1300); api.fxAt(...center(), ['💫'], 3, 'spark'); });
    at(a, 2100, () => { face('laugh', 1800); line(said(LUCKY.questions, 'cartwheel'), 1, 0); });
    at(a, 3900, end);
  }

  function peekaboo() {
    const a = begin('peekaboo');
    face('happy', 2000);
    hold(a, 'peek');
    sfx.squeak();
    at(a, 1700, () => { drop(a, 'peek'); face('laugh', 1600); move('bounce', 900); sfx.boing(); line(A.boo, 1, 0); });
    at(a, 3400, end);
  }

  function meditate() {
    const a = begin('meditate');
    face('sleep', 3800);
    hold(a, 'meditate');
    sfx.chime();
    at(a, 1800, sfx.chime);
    at(a, 3600, () => { drop(a, 'meditate'); face('happy', 1600); line(A.meditate, 1, 0); });
    at(a, 5000, end);
  }

  function dressUp() {
    const list = api.outfits().filter((w) => outfitLine(w.id));
    if (!list.length) return false;
    const w = pick(list);
    const a = begin('dressup');
    poof();
    api.dressUp(w.id);
    onEnd(a, () => api.dressUp(null));
    at(a, 150, () => { pose('happy', 2400, 'proud', 1200); line(outfitLine(w.id), 1, 0); });
    at(a, 3900, () => { poof(); api.dressUp(null); });
    at(a, 4400, end);
    return true;
  }

  function spinOut() {
    const a = begin('spinout');
    face('laugh', 1500);
    hold(a, 'spinout', 1400);
    sfx.whirr();
    at(a, 1400, () => { face('dizzy', 2200); prop('dizzy', 2000); hold(a, 'balance', 1800); });
    at(a, 1700, () => line(A.dizzyFly, 1, 0));
    at(a, 3700, end);
  }

  // which gestures can turn into which trick
  const SPECIALS = {
    superhero: [superhero, 'double up'],
    cheshire: [cheshire, 'stroke long'],
    clones: [clones, 'double side'],
    hat: [hat, 'long double down'],
    giant: [giant, 'up tap'],
    balloon: [balloon, 'stroke long'],
    robot: [robot, 'tap double'],
    handstand: [handstand, 'double up'],
    statue: [statue, 'long tap'],
    disco: [disco, 'tap double'],
    cartwheel: [cartwheel, 'side double'],
    peekaboo: [peekaboo, 'tap long'],
    meditate: [meditate, 'long stroke'],
    dressup: [dressUp, 'tap long'],
    spinout: [spinOut, 'side'],
  };

  // A rare trick for this gesture, if the screen is free and it is time; 'any' (Turbo, tests) skips the dice
  function special(on, force = false) {
    if (!api.quiet()) return false;
    const now = Date.now();
    if (!force && (now < nextSpecialAt || Math.random() > (SPECIAL_CHANCE[on] || 0))) return false;
    const names = Object.keys(SPECIALS).filter((k) => on === 'any' || SPECIALS[k][1].split(' ').includes(on));
    const fresh = names.filter((k) => !recentSpecials.includes(k));
    const order = (fresh.length ? fresh : names).sort(() => Math.random() - 0.5);
    for (const k of order) {
      api.clearBubble(); // nothing written stays over the trick
      if (SPECIALS[k][0]() === false) continue; // (no outfit to try on)
      recentSpecials.push(k);
      while (recentSpecials.length > 6) recentSpecials.shift();
      nextSpecialAt = now + SPECIAL_GAP;
      return k;
    }
    return false;
  }

  // A touch on Lucky: gesture is tap, double, long, stroke or swipe; part is where (body, head, tummy, feet, tail, paw,
  // nose, ear). Returns { key, say, special }: the way he answered, the line it wants, and whether a rare trick played.
  function touch(gesture, part, p = {}) {
    if (gesture === 'stroke') strokeTimes.push(Date.now());
    const on = gesture === 'swipe' ? (p.dir === 'up' ? 'up' : p.dir === 'down' ? 'down' : 'side') : gesture;
    // rare tricks come from the body and the head, a long press on the tummy, any stroke and any swipe
    const big = gesture === 'swipe' || gesture === 'stroke' || part === 'body' || part === 'head' || (part === 'tummy' && gesture === 'long');
    if (big) {
      const k = special(on);
      if (k) return { key: k, say: null, special: true };
    }
    const slot = gesture === 'swipe' ? on : gesture === 'stroke' ? 'body' : part; // a stroke is a stroke wherever it is
    const list = gesture === 'swipe' ? WAYS.swipe[on] : WAYS[gesture]?.[slot];
    if (!list) return { key: '', say: null, special: false };
    const w = choose(gesture + ':' + slot, list);
    return { key: w[1], say: w[2](p.dir) || null, special: false };
  }

  return { touch, special, names: () => Object.keys(SPECIALS), force: (k) => { api.clearBubble(); return SPECIALS[k]?.[0]() !== false; } };
}
