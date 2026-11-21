// Carrot farm (level 32): a carrot bed where Lucky pulls carrots (sometimes a giant one), a scarecrow with a crow,
// a haystack to dive into and hide in, a hen that lays eggs, and a barn with a cow, a pig and a horse inside.

const cluck = (sfx) => { sfx.note(660); setTimeout(() => sfx.note(520), 120); setTimeout(() => sfx.note(600), 240); };

export default {
  id: 'farm',
  level: 32,
  name: ['Морковная ферма', 'Carrot farm'],
  emoji: ['🥕', '🐔', '🌾', '🚜', '🐮'],
  spots: { L: [26, 660], R: [384, 470], l: [140, 690], r: [262, 692], sky: 300 },
  arrive: [
    ['Морковная ферма! Тут морковки больше, чем я съем за всю жизнь!', 'The carrot farm! There are more carrots here than I could eat in my whole life!'],
    ['Ферма! Слышишь? Ко-ко-ко и му-у!', 'A farm! Can you hear that? Cluck-cluck and moo!'],
  ],

  lines: {
    farmPull: [['Тяну-потянул… вытянул! Хрум!', 'Pull… pull… got it! Crunch!'], ['Свежая морковка прямо с грядки!', 'A fresh carrot, straight from the garden!'], ['Самая вкусная морковка — та, что сам вырастил.', 'The tastiest carrot is the one you grew yourself.']],
    farmGiantPull: [['Тянем-потянем… вытянуть не можем!', "Heave-ho… it won't come out!"]],
    farmGiant: [['Ого! Гигантская морковка! Мне её на неделю хватит!', "Whoa! A giant carrot! It'll last me a week!"], ['Вот это морковища! Больше меня!', "What a whopper! It's bigger than me!"]],
    farmCarrotDance: [['Морковки танцуют! И я с ними!', 'The carrots are dancing! Me too!']],
    farmWater: [['Полью грядку, и вырастет ещё больше морковки!', "I'll water the bed and even more carrots will grow!"], ['Расти, морковка, большая и сладкая!', 'Grow, little carrot, big and sweet!']],
    farmCrowShoo: [['Кыш, ворона! Это моя морковка!', 'Shoo, crow! That carrot is mine!'], ['Ворона улетела. Пугало, ты совсем не страшное!', "The crow flew away. Scarecrow, you're not scary at all!"]],
    farmScarecrow: [['Смотри, я тоже пугало! Страшно?', "Look, I'm a scarecrow too! Scary?"]],
    farmCrowHead: [['Эй! Я не пугало, я кролик! Слезай с моей головы!', "Hey! I'm not a scarecrow, I'm a bunny! Get off my head!"]],
    farmScareWave: [['Пугало мне машет! Привет, соломенный друг!', 'The scarecrow is waving at me! Hi, straw friend!']],
    farmStrawHat: [['Соломенная шляпа! Теперь я настоящий фермер.', "A straw hat! Now I'm a real farmer."]],
    farmHayDive: [['Прыг в сено! Мягко, как в облаке.', 'Into the hay! Soft as a cloud.'], ['Сено везде! Даже в ушах.', 'Hay everywhere! Even in my ears.']],
    farmHaySneeze: [['Апчхи! Сено щекочет нос!', 'Achoo! The hay tickles my nose!']],
    farmHayRoll: [['Кувырок со стога! Ещё разок!', 'A roll down the haystack! One more time!']],
    farmEgg: [['Ко-ко-ко! Курочка снесла яичко!', 'Cluck-cluck! The hen laid an egg!'], ['Тёплое яичко! Курочка, ты молодец.', 'A warm egg! Well done, hen.']],
    farmChickenDance: [['Танец курочки! Крылышки, клювик и хлоп-хлоп!', 'The chicken dance! Wings, beak and clap-clap!']],
    farmChick: [['Цыплёнок вылупился! Пи-пи-пи!', 'A chick has hatched! Cheep-cheep!']],
    farmHenHead: [['Курочка села мне на голову! Я теперь гнездо?', 'The hen is sitting on my head! Am I a nest now?']],
    farmMoo: [['Му-у! Привет, корова!', 'Moo! Hello, cow!'], ['Корова говорит, что молоко сегодня особенно вкусное.', "The cow says the milk is extra tasty today."]],
    farmPig: [['Хрю-хрю! Поросёнок в грязи — и очень счастлив!', 'Oink-oink! A muddy piggy, and a very happy one!']],
    farmHorse: [['Иго-го! Лошадка поскакала!', 'Neigh! There goes the horse!']],
    farmTractor: [['Би-бип! Трактор едет! Посторонись!', 'Beep-beep! Tractor coming through!']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#94D6FF"/><stop offset=".75" stop-color="#FFF1C9"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="292" cy="236" r="64" fill="url(#${u}g)"/><circle cx="292" cy="236" r="30" fill="#FFD84D"/></g>
${h.cloud(110, 262, 0.8)}${h.cloud(214, 318, 0.62, 'slow')}
<path d="M0 418 Q90 376 190 404 T400 392 V700 H0Z" fill="#B9E6A0"/>
<g data-tap="barn"><rect x="6" y="314" width="112" height="130" fill="transparent"/>
  <path d="M8 364 L62 318 L116 364Z" fill="#B23A2B"/><path d="M8 364 L62 318 L116 364" stroke="#fff" stroke-width="4" fill="none" stroke-linejoin="round"/>
  <rect x="14" y="362" width="96" height="80" fill="#D9493A"/>
  <path d="M14 380 H110 M14 400 H110 M14 420 H110" stroke="#C13F31" stroke-width="2"/>
  <rect x="52" y="336" width="20" height="18" rx="2" fill="#FFF3D6" stroke="#fff" stroke-width="2"/><path d="M62 336 V354 M52 345 H72" stroke="#B23A2B" stroke-width="2"/>
  <g class="zf-door"><rect x="40" y="394" width="44" height="48" fill="#F7E8D0" stroke="#fff" stroke-width="3"/><path d="M42 396 L82 440 M82 396 L42 440" stroke="#fff" stroke-width="4"/></g>
  <rect x="44" y="398" width="36" height="42" fill="#5A2E22" opacity=".0"/></g>
<path d="M0 456 Q200 424 400 460 V700 H0Z" fill="#9FDB7E"/>
<g stroke="#C99B6A" stroke-width="5" stroke-linecap="round">${[130, 160, 190, 220, 250, 280].map((x) => `<path d="M${x} ${442 + Math.abs(x - 205) * 0.05} v-24"/>`).join('')}<path d="M126 428 H284 M126 440 H284" stroke-width="4"/></g>
<g data-tap="scarecrow"><rect x="300" y="322" width="92" height="152" fill="transparent"/>
  <rect x="343" y="356" width="5" height="116" fill="#9A6B4A"/><rect x="304" y="376" width="84" height="5" rx="2" fill="#9A6B4A"/>
  <path d="M326 382 H366 L370 430 Q346 438 322 430Z" fill="#4D8FDB"/><path d="M334 382 V432 M346 382 V436 M358 382 V432 M324 400 H368 M324 416 H369" stroke="#3B74BC" stroke-width="2"/>
  <path d="M304 372 l-8 -6 M304 380 l-10 2 M304 386 l-7 7 M388 372 l8 -6 M388 380 l10 2 M388 386 l7 7" stroke="#E7B94F" stroke-width="3" stroke-linecap="round"/>
  <circle cx="345" cy="356" r="17" fill="#F2D29B"/><path d="M338 352 l4 4 M342 352 l-4 4 M348 352 l4 4 M352 352 l-4 4" stroke="#6B4A2E" stroke-width="2"/><path d="M337 364 q8 6 16 0" stroke="#6B4A2E" stroke-width="2" fill="none"/>
  <ellipse cx="345" cy="342" rx="28" ry="6" fill="#E7B94F"/><path d="M330 342 Q332 322 345 322 Q358 322 360 342Z" fill="#E7B94F"/><rect x="331" y="334" width="28" height="5" fill="#D9493A"/>
  <g class="zf-crow amb"><ellipse cx="381" cy="368" rx="10" ry="8" fill="#2A2730"/><circle cx="389" cy="361" r="6" fill="#2A2730"/><path d="M394 361 l7 2 -7 2z" fill="#FFB347"/><circle cx="390" cy="359" r="1.5" fill="#fff"/><path d="M372 368 l-8 4 8 0z" fill="#2A2730"/></g></g>
<path d="M0 520 Q200 494 400 524 V700 H0Z" fill="#88CF68"/>
<g data-tap="hay"><rect x="296" y="496" width="104" height="98" fill="transparent"/><g transform="translate(-6 0)">
  <path d="M298 592 Q302 512 352 502 Q402 512 406 592Z" fill="#F2C55C"/>
  <path d="M312 560 q8 -24 20 -36 M330 590 q4 -40 18 -70 M352 590 q2 -40 -2 -80 M372 590 q-2 -36 -16 -64 M392 586 q-6 -26 -18 -44" stroke="#D8A53B" stroke-width="2.4" fill="none"/>
  <path d="M300 592 q50 -10 104 0" stroke="#C99332" stroke-width="3" fill="none"/></g></g>
<g data-tap="carrots"><rect x="0" y="534" width="112" height="96" fill="transparent"/>
  <path d="M2 618 Q4 560 56 552 Q108 560 110 618Z" fill="#8C5A3C"/><path d="M10 584 Q56 572 102 584 M8 604 Q56 592 104 604" stroke="#6E4329" stroke-width="3" fill="none"/>
  ${[[24, 572], [56, 566], [88, 572], [18, 594], [50, 588], [82, 592], [40, 610], [72, 610]].map(([x, y], i) => `<g class="zf-top"><path d="M${x - 4} ${y + 2} l4 -4 4 4z" fill="#FF8A2B"/><path d="M${x} ${y - 2} q-7 -12 -3 -18 q3 8 3 12 q0 -12 6 -16 q1 9 -3 16 q6 -8 11 -6 q-5 6 -11 12" fill="${i === 1 ? '#3FAE4A' : '#55C25E'}" transform="${i === 1 ? `translate(${x} ${y}) scale(1.5) translate(${-x} ${-y})` : ''}"/></g>`).join('')}</g>
<g data-tap="hen"><rect x="316" y="612" width="76" height="72" fill="transparent"/>
  <ellipse cx="354" cy="676" rx="30" ry="6" fill="#000" opacity=".12"/>
  <path d="M330 664 q-2 -26 22 -30 q26 -2 30 22 q2 12 -12 14 q-24 4 -40 -6z" fill="#FFF6EA"/>
  <path d="M372 646 q14 -10 16 -26 q-10 4 -14 12z" fill="#F4E2C8"/><path d="M336 650 q12 6 26 2" stroke="#E9D3B5" stroke-width="3" fill="none"/>
  <circle cx="336" cy="636" r="12" fill="#FFF6EA"/><path d="M330 624 q2 -8 6 -4 q2 -7 6 -2 q4 -5 5 3z" fill="#E8413A"/>
  <path d="M325 636 l-8 3 8 3z" fill="#FFB347"/><circle cx="333" cy="634" r="2" fill="#2A2730"/><path d="M330 644 q2 6 6 4" fill="#E8413A"/>
  <path d="M346 676 v6 M360 676 v6" stroke="#FFB347" stroke-width="3" stroke-linecap="round"/></g>
${h.flower(150, 684, '#FFD23F', 0.85)}${h.flower(258, 690, '#FF7AB8', 0.85)}${h.flower(206, 694, '#fff', 0.7)}
</svg>`,

  css: `
[data-tap="hen"].henlay { transform-origin: 50% 100%; animation: zfHenLay .9s ease-in-out; }
@keyframes zfHenLay { 30% { transform: scale(1.12, .84); } 60% { transform: scale(.94, 1.12) translateY(-4px); } }
[data-tap="hen"].henflap { animation: zfHenFlap 1.2s ease-in-out; }
@keyframes zfHenFlap { 10%, 50% { transform: translateY(-10px) rotate(-7deg); } 30%, 70% { transform: translateY(0) rotate(7deg); } }
[data-tap="carrots"].carrotwiggle .zf-top { transform-box: fill-box; transform-origin: 50% 100%; animation: zfCarrot .28s ease-in-out 6 alternate; }
@keyframes zfCarrot { from { transform: rotate(-12deg); } to { transform: rotate(12deg) translateY(-3px); } }
[data-tap="carrots"].carrotgrow .zf-top { transform-box: fill-box; transform-origin: 50% 100%; animation: zfGrow 1.4s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes zfGrow { 40% { transform: scale(1.35); } }
[data-tap="scarecrow"].scwave { transform-origin: 50% 100%; animation: zfScWave 1.5s ease-in-out; }
@keyframes zfScWave { 20%, 60% { transform: rotate(-5deg); } 40%, 80% { transform: rotate(5deg); } }
[data-tap="barn"].barnopen .zf-door { transform-box: fill-box; transform-origin: 0 50%; animation: zfDoor 2.6s ease-in-out; }
@keyframes zfDoor { 15%, 80% { transform: scaleX(.12); } }
[data-tap="hay"].hayshake { transform-origin: 50% 100%; animation: zfHay .8s ease-in-out; }
@keyframes zfHay { 25% { transform: scale(1.06, .94); } 60% { transform: scale(.97, 1.04); } }
.zf-crow.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: zfCrowBob 3.4s ease-in-out infinite; }
@keyframes zfCrowBob { 0%, 70%, 100% { transform: none; } 78% { transform: rotate(-14deg); } 88% { transform: rotate(6deg); } }
[data-tap="scarecrow"].crowgone .zf-crow { visibility: hidden; }
.fly-fx.zf-crowfx { filter: brightness(.2); }
.zf-away { visibility: hidden; }
`,

  props: (h) => ({
    strawHat: { slot: 'head', art: () => `<ellipse cx="100" cy="44" rx="46" ry="9" fill="#E7B94F"/><path d="M74 44 Q76 12 100 12 Q124 12 126 44Z" fill="#F2C95C"/>
      <rect x="75" y="32" width="50" height="7" fill="#D9493A"/><path d="M60 46 q40 8 80 0" stroke="#D3A23B" stroke-width="2" fill="none"/>` },
    hayHead: { slot: 'head', art: () => `<g stroke="#E7B94F" stroke-width="3" stroke-linecap="round" fill="none"><path d="M78 40 l-8 -14 M86 36 l-2 -16 M96 34 l2 -18 M106 34 l6 -16 M116 38 l10 -12 M90 40 l-14 -6 M110 40 l14 -6"/></g>` },
    crowHead: { slot: 'head', art: () => `<g transform="translate(104 30)"><ellipse rx="13" ry="10" fill="#2A2730"/><circle cx="10" cy="-9" r="7.5" fill="#2A2730"/><path d="M16 -9 l9 3 -9 3z" fill="#FFB347"/><circle cx="11" cy="-11" r="1.8" fill="#fff"/><path d="M-12 2 l-10 5 10 1z" fill="#2A2730"/><path d="M-4 9 v6 M4 9 v6" stroke="#FFB347" stroke-width="2.4"/></g>` },
    henHead: { slot: 'head', art: () => h.em(100, 26, 46, '🐔') },
    giantCarrot: { slot: 'hand', art: () => `<g transform="rotate(-24 150 120)"><path d="M136 70 Q150 64 164 70 L152 200 Q150 206 148 200Z" fill="#FF8A2B" stroke="#E06B12" stroke-width="2.5"/>
      <path d="M140 96 h10 M144 124 h12 M146 152 h8" stroke="#E06B12" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M150 68 q-16 -20 -8 -36 q6 14 8 22 q0 -22 14 -30 q2 20 -12 38 q12 -14 22 -12 q-8 10 -22 20" fill="#4CB84C"/></g>` },
    wateringCan: { slot: 'hand', art: () => `<g transform="translate(150 150) rotate(16)"><path d="M-18 -16 h30 l4 32 h-38z" fill="#4DB3E6"/><path d="M12 -8 l26 -16 4 4 -26 20z" fill="#3A9BCF"/><ellipse cx="41" cy="-22" rx="5" ry="7" fill="#3A9BCF" transform="rotate(-30 41 -22)"/>
      <path d="M-18 -10 q-14 0 -14 12 q0 10 12 10" stroke="#3A9BCF" stroke-width="4" fill="none"/></g>` },
    egg: { slot: 'hand', art: () => h.em(158, 160, 30, '🥚') },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, hold, go, pose, prop, fly, popUp, line, centerOf, nextTo, head, mouth, feet, sceneRect } = k;

    // a carrot straight from the bed into his mouth
    const pull = (c) => {
      const a = begin('farmPull');
      go(nextTo(c.el), 700);
      at(a, 750, () => { hold(a, 'strain', 900); api.setTemp('ok', 900); });
      at(a, 1500, () => { sfx.pop(); fly('🥕', [c.x, c.y], mouth(), 520, { arc: 70, spin: 260, size: 28 }); });
      at(a, 2050, () => { api.setTemp('eat', 1800); sfx.crunch(); line('farmPull', 1, 0); api.boost('hunger', 2); api.reward(); });
      at(a, 3200, end);
    };
    // the giant one: he pulls and pulls, then falls back holding a carrot bigger than himself
    const giant = (c) => {
      const a = begin('farmGiant');
      go(nextTo(c.el), 700);
      at(a, 750, () => { hold(a, 'strain', 1700); api.setTemp('sad', 1700); api.hop(c.el, 'hayshake', 800); line('farmGiantPull', 1, 0); });
      at(a, 1600, () => api.hop(c.el, 'hayshake', 800));
      at(a, 2500, () => { sfx.pop(); sfx.boing(); prop('giantCarrot', 4000); pose('surprised', 1200, 'bigjump', 1100); api.fxAt(c.x, c.y, ['💥', '🌱'], 5, 'spark'); });
      at(a, 3500, () => { api.setTemp('laugh', 1800); line('farmGiant', 1, 0); api.reward(); });
      at(a, 5200, end);
    };
    R.carrots = {
      press: (c) => { sfx.pop(); api.fxAt(c.x, c.y, ['🌱', '🥕'], 3, 'spark'); },
      tap: who(oneOf('farmCarrots', pull, giant)),
      double: (c) => {
        api.hop(c.el, 'carrotwiggle', 1800);
        sfx.happy();
        if (api.free()) { pose('laugh', 2200, 'dance', 2200); line('farmCarrotDance', 1); }
      },
      // he waters the bed and the carrots shoot up
      long: who((c) => {
        const a = begin('farmWater');
        go(nextTo(c.el), 700);
        at(a, 750, () => { prop('wateringCan', 2600); pose('happy', 2600); line('farmWater', 1); });
        [900, 1300, 1700].forEach((d) => at(a, d, () => { api.fxAt(c.x, c.y - 30, ['💧'], 4, 'drop'); sfx.splash(); }));
        at(a, 2300, () => { api.hop(c.el, 'carrotgrow', 1500); popUp('🌱', c.x, c.y - 30, 1500, 30, 'pop-rise'); sfx.grow(); api.reward(); });
        at(a, 3600, end);
      }),
    };

    // the crow flies off the scarecrow's arm
    const crowEl = (c) => c.el.querySelector('.zf-crow');
    const crowAt = (c) => { const e = crowEl(c); return e ? centerOf(e) : [c.x, c.y]; };
    const crowAway = (c, ms = 4000) => {
      c.el.classList.add('crowgone');
      setTimeout(() => c.el.classList.remove('crowgone'), ms);
    };
    const shoo = (c) => {
      const [x, y] = crowAt(c), w = sceneRect().width;
      crowAway(c);
      sfx.honk();
      fly('🐦', [x, y], [w + 40, 40], 1500, { arc: 90, size: 26, cls: 'zf-crowfx' });
      pose('ok', 900, 'startle', 1100);
      setTimeout(() => { if (!api.free()) return; api.setTemp('laugh', 1600); line('farmCrowShoo', 1); }, 600);
    };
    // Lucky stands like a scarecrow, and the crow takes him for one
    const copy = (c) => {
      const a = begin('farmScare');
      prop('strawHat', 5200);
      pose('ok', 2600, 'statue', 2600);
      line('farmScarecrow', 1, 0);
      at(a, 2000, () => { const [x, y] = crowAt(c); crowAway(c, 4200); sfx.whoosh(); fly('🐦', [x, y], head(), 700, { arc: 60, size: 26, cls: 'zf-crowfx' }); });
      at(a, 2700, () => { k.unprop('head', true); prop('crowHead', 1800); sfx.honk(); pose('surprised', 1600, 'startle', 1100); line('farmCrowHead', 1, 0); });
      at(a, 4500, () => { const [x, y] = crowAt(c); fly('🐦', head(), [x, y], 700, { arc: 50, size: 26, cls: 'zf-crowfx' }); api.setTemp('laugh', 1400); });
      at(a, 5300, end);
    };
    R.scarecrow = {
      press: () => sfx.tap(),
      tap: who(oneOf('farmScarecrow', shoo, copy)),
      double: (c) => { api.hop(c.el, 'scwave', 1600); sfx.whoosh(); if (api.free()) { pose('happy', 1500, 'wave', 1200); line('farmScareWave', 1); } },
      long: who(() => { prop('strawHat', 12000); sfx.magic(); pose('happy', 1600, 'proud', 1200); line('farmStrawHat', 1); api.reward(); }),
    };

    // into the hay: hay on his head and in his mouth
    const dive = (c) => {
      const a = begin('farmDive');
      go(nextTo(c.el, 12), 700);
      at(a, 700, () => { sfx.puff(); api.hop(c.el, 'hayshake', 800); hold(a, 'squash', 600); api.fxAt(c.x, c.y - 20, ['🌾'], 8, 'drop'); });
      at(a, 1300, () => { prop('hayHead', 3600); prop('hay', 3000); pose('laugh', 2000, 'hop'); line('farmHayDive', 1, 0); api.reward(); });
      at(a, 3400, end);
    };
    const sneeze = () => {
      api.fxAt(...k.nose(), ['🌾'], 3, 'spark');
      api.setTemp('sleep', 500);
      setTimeout(() => { sfx.sneeze(); pose('laugh', 1400, 'sneeze'); line('farmHaySneeze', 1); }, 450);
    };
    R.hay = {
      press: (c) => { sfx.puff(); api.fxAt(c.x, c.y, ['🌾'], 4, 'spark'); },
      tap: who(oneOf('farmHay', dive, sneeze)),
      double: who((c) => {
        const a = begin('farmRoll');
        go(nextTo(c.el, 14), 700);
        at(a, 750, () => { sfx.whoosh(); pose('laugh', 1800, 'roll', 1200); api.fxAt(...feet(), ['🌾'], 5, 'spark'); line('farmHayRoll', 1); });
        at(a, 2200, end);
      }),
      // hide and seek in the hay
      long: who((c) => k.hideGame(begin('hide'), c.el)),
    };

    // the hen lays an egg; it sometimes hatches
    const lay = (c) => {
      api.hop(c.el, 'henlay', 900);
      cluck(sfx);
      setTimeout(() => { popUp('🥚', c.x + 22, c.y + 18, 2200, 26); sfx.pop(); }, 700);
      setTimeout(() => { if (!api.free()) return; pose('surprised', 1400, 'startle', 1100); line('farmEgg', 1); api.reward(); }, 800);
    };
    const flap = (c) => {
      api.hop(c.el, 'henflap', 1200);
      cluck(sfx);
      api.fxAt(c.x, c.y - 10, ['🪶'], 5, 'drop');
      setTimeout(() => { if (!api.free()) return; pose('laugh', 2200, 'dance', 2200); line('farmChickenDance', 1); }, 300);
    };
    R.hen = {
      press: () => sfx.note(640),
      tap: who(oneOf('farmHen', lay, flap)),
      double: (c) => {
        popUp('🥚', c.x + 22, c.y + 14, 700, 26);
        setTimeout(() => { popUp('🐣', c.x + 22, c.y + 4, 2000, 30, 'pop-rise'); sfx.happy(); api.hearts(c.x, c.y, 3); }, 650);
        setTimeout(() => { if (!api.free()) return; pose('happy', 1500, 'clap'); line('farmChick', 1); }, 800);
      },
      // the hen flies up and sits on his head
      long: who((c) => {
        const a = begin('farmHenHead');
        c.el.classList.add('zf-away');
        k.onEnd(a, () => c.el.classList.remove('zf-away'));
        cluck(sfx);
        fly('🐔', [c.x, c.y], head(), 700, { arc: 70, size: 40 });
        at(a, 700, () => { prop('henHead', 2400); pose('surprised', 2200, 'balance', 2200); line('farmHenHead', 1, 0); });
        at(a, 3100, () => { k.unprop('head', true); fly('🐔', head(), [c.x, c.y], 700, { arc: 60, size: 40 }); cluck(sfx); api.setTemp('laugh', 1400); });
        at(a, 3800, end);
      }),
    };

    // the barn door opens: the cow or the pig looks out
    const door = (c) => { const e = c.el.querySelector('.zf-door'); return e ? centerOf(e) : [c.x, c.y]; };
    const peek = (who2, key, sound) => (c) => {
      api.hop(c.el, 'barnopen', 2600);
      const [x, y] = door(c);
      setTimeout(() => { popUp(who2, x, y - 6, 2000, 38, 'pop-rise'); sound(); }, 350);
      setTimeout(() => { if (!api.free()) return; pose('happy', 1500, 'wave', 1200); line(key, 1); }, 700);
    };
    const moo = () => { sfx.note(147); setTimeout(() => sfx.note(131), 260); };
    const oink = () => { sfx.squeak(); setTimeout(() => sfx.squeak(), 220); };
    R.barn = {
      press: () => sfx.knock(),
      tap: who(oneOf('farmBarn', peek('🐮', 'farmMoo', moo), peek('🐷', 'farmPig', oink))),
      double: (c) => {
        api.hop(c.el, 'barnopen', 2600);
        const [x, y] = door(c), w = sceneRect().width;
        setTimeout(() => { sfx.gallop(); fly('🐴', [x, y], [w + 60, y + 40], 1700, { size: 44 }); }, 300);
        setTimeout(() => { if (api.free()) { pose('laugh', 1500, 'hop'); line('farmHorse', 1); } }, 700);
      },
      // the tractor drives past, and Lucky waves
      long: who(() => {
        const [, fy] = feet(), w = sceneRect().width;
        sfx.rumble();
        fly('🚜', [-70, fy - 20], [w + 70, fy - 20], 3000, { size: 58 });
        setTimeout(() => { sfx.beep(false); setTimeout(() => sfx.beep(false), 250); }, 900);
        pose('happy', 2600, 'wave', 1200);
        line('farmTractor', 1);
      }),
    };
  },

  visitors: [
    { e: '🐤', w: 3, path: 'jump', end: ['chick'] },
    { e: '🦋', w: 2, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'] },
    { e: '🐝', w: 2, path: 'zigzag', end: ['bee'] },
  ],
};
