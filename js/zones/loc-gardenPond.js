// The garden's second place: the pond. A mother duck and her ducklings, a wooden bridge (Poohsticks!), water lilies
// to hop across (a butterfly), a weeping willow to hide behind, a little rowing boat on the bank.

const quack = (sfx) => { sfx.honk(); setTimeout(() => sfx.honk(), 180); };

export default {
  id: 'gardenPond',
  world: 'garden',
  name: ['Пруд', 'The pond'],
  spots: { L: [44, 500], R: [368, 560], l: [22, 666], r: [384, 664], sky: 300 },
  arrive: [
    ['Пруд! Тут живут утки, и вода такая блестящая.', 'The pond! Ducks live here, and the water is so sparkly.'],
    ['Тихо… Слышишь, как квакают и крякают?', 'Shh… Can you hear the croaking and the quacking?'],
  ],

  lines: {
    gardenPondQuack: [['Кря-кря! Мама-утка ведёт утят на прогулку.', 'Quack-quack! Mother Duck is taking her ducklings for a swim.'], ['Утята плывут за мамой по порядку: раз, два, три!', 'The ducklings follow their mum in a line: one, two, three!']],
    gardenPondDuckling: [['Ой, утёнок сел мне на голову! Я теперь утиная мама?', "Oh, a duckling sat on my head! Am I a mother duck now?"]],
    gardenPondDive: [['Утки ныряют: только хвостики торчат!', 'The ducks are diving: just their tails are sticking up!']],
    gardenPondFeed: [['Утят нельзя кормить хлебом. Я дам им горошка!', "You mustn't feed ducks bread. I'll give them some peas!"]],
    gardenPondBoatRow: [['Гребу-гребу! Я капитан Лаки!', "Row, row! I'm Captain Lucky!"], ['Плывём по пруду! Держись крепче!', 'Sailing across the pond! Hold on tight!']],
    gardenPondBoatRock: [['Лодка качается! Ой, немножко брызг.', 'The boat is rocking! Oops, a little splash.']],
    gardenPondPaperBoat: [['Я сложил бумажный кораблик. Плыви, кораблик!', 'I folded a paper boat. Off you sail, little boat!']],
    gardenPondFish: [['Клюёт! Ой, это старый ботинок!', "A bite! Oh, it's an old boot!"], ['Рыбка! Плыви обратно, мы просто знакомимся.', "A fish! Off you go, we were only saying hello."]],
    gardenPondSticks: [['Играем в «палочки»! Бросаем с моста — чья приплывёт первой?', "Let's play Poohsticks! We drop them off the bridge: whose comes out first?"]],
    gardenPondSticksWin: [['Моя палочка первая! Ура!', 'My stick came out first! Hooray!'], ['Твоя победила! Давай ещё раз?', 'Yours won! Shall we go again?']],
    gardenPondBridge: [['Топ-топ по мостику! Он скрипит, как старый дедушка.', 'Stomp, stomp on the bridge! It creaks like an old grandpa.']],
    gardenPondMirror: [['Смотри, в воде ещё один кролик! Ой, это же я.', "Look, there's another bunny in the water! Oh, it's me."]],
    gardenPondSing: [['Сижу на мостике, болтаю лапками и пою.', "Sitting on the bridge, swinging my feet and singing."]],
    gardenPondBloom: [['Кувшинка распустилась! Она открывается утром, а вечером засыпает.', 'The water lily opened! It opens in the morning and closes in the evening.']],
    gardenPondButterfly: [['Бабочка с кувшинки села мне на нос! Не чихать, не чихать…', "A butterfly from the lily landed on my nose! Don't sneeze, don't sneeze…"]],
    gardenPondHop: [['Прыг по листикам! Ой, мокро!', 'Hop across the lily pads! Oops, wet!']],
    gardenPondCrown: [['Венок из кувшинок! Я водяной принц.', "A crown of water lilies! I'm the prince of the pond."]],
    gardenPondWillow: [['Ива плачет? Нет, она просто так растёт: ветки вниз.', "Is the willow crying? No, it just grows like that, with its branches hanging down."]],
    gardenPondLeaves: [['Листики сыплются, как дождик!', 'The leaves are falling like rain!']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6FF"/><stop offset=".75" stop-color="#FFE9F4"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FC6F0"/><stop offset="1" stop-color="#4DA8DC"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="256" cy="226" r="56" fill="url(#${u}g)"/><circle cx="256" cy="226" r="27" fill="#FFE066"/></g>
${h.cloud(180, 270, 0.7)}${h.cloud(40, 320, 0.55, 'slow')}
<path d="M0 410 Q120 376 240 402 T400 392 V700 H0Z" fill="#A9E39B"/>
<path d="M0 430 Q200 412 400 436 V506 Q300 520 200 510 Q100 504 0 524Z" fill="url(#${u}w)"/>
<path d="M0 520 Q70 514 116 556 Q126 616 66 650 Q24 662 0 652Z" fill="url(#${u}w)"/>
<g class="gp-ripples amb" stroke="#fff" stroke-width="2" fill="none" opacity=".55"><path d="M170 462 q14 -5 28 0"/><path d="M230 482 q12 -4 24 0"/><path d="M40 590 q10 -4 20 0"/></g>
<path d="M0 524 Q100 504 200 510 Q300 520 400 506 V700 H0Z" fill="#8ED87E"/><path d="M0 652 Q24 662 66 650 Q126 616 116 556 Q70 514 0 520Z" fill="url(#${u}w)"/>
<g data-tap="pondWillow"><rect x="296" y="268" width="104" height="186" fill="transparent"/>
  <path d="M352 452 Q348 380 360 330" stroke="#8C5A3C" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M356 350 Q330 330 318 300 M360 336 Q384 312 398 300" stroke="#8C5A3C" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="356" cy="300" rx="56" ry="34" fill="#7CC46E"/>
  <g class="gp-branches" stroke="#6BB85E" stroke-width="5" fill="none" stroke-linecap="round">${[302, 316, 330, 344, 358, 372, 386, 398].map((x, i) => `<path d="M${x} ${300 + (i % 2) * 8} Q${x - 4} ${360} ${x + 2} ${410 + (i % 3) * 14}"/>`).join('')}</g></g>
<g data-tap="pondBridge"><rect x="10" y="392" width="140" height="66" fill="transparent"/>
  <path d="M14 452 Q80 396 146 452" stroke="#A86B3C" stroke-width="10" fill="none"/>
  <path d="M14 436 Q80 380 146 436" stroke="#C98E5A" stroke-width="5" fill="none"/>
  ${[30, 52, 74, 96, 118].map((x) => `<path d="M${x} ${x < 80 ? 440 - (x - 14) * 0.62 : 440 - (146 - x) * 0.62} v18" stroke="#C98E5A" stroke-width="4"/>`).join('')}</g>
<g data-tap="pondDucks"><rect x="298" y="446" width="100" height="56" fill="transparent"/>
  <g class="gp-ducks amb">
  <g transform="translate(318 476)"><ellipse rx="16" ry="10" fill="#fff"/><circle cx="12" cy="-10" r="8" fill="#fff"/><path d="M19 -10 l8 2 -8 3z" fill="#FF9F43"/><circle cx="14" cy="-12" r="1.6" fill="#3A2216"/><path d="M-16 -2 q-6 -6 -2 -10 q4 4 4 8" fill="#fff"/></g>
  ${[[350, 484], [372, 488], [392, 486]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.55)"><ellipse rx="16" ry="10" fill="#FFE066"/><circle cx="12" cy="-10" r="8" fill="#FFE066"/><path d="M19 -10 l8 2 -8 3z" fill="#FF9F43"/><circle cx="14" cy="-12" r="2" fill="#3A2216"/></g>`).join('')}
  </g></g>
<g data-tap="pondLily"><rect x="0" y="532" width="120" height="118" fill="transparent"/>
  ${[[30, 560, 18], [78, 590, 15], [36, 622, 16]].map(([x, y, r]) => `<path d="M${x} ${y} m${-r} 0 a${r} ${r * 0.55} 0 1 0 ${r * 2} 0 a${r} ${r * 0.55} 0 1 0 ${-r * 2} 0 M${x} ${y} l${r} ${-r * 0.3}" fill="#4CB050" stroke="#3E9A44" stroke-width="1.5"/>`).join('')}
  <g class="gp-lily" transform="translate(78 584)"><path d="M0 0 l-8 -10 l4 -2 l4 6 l4 -6 l4 2z M0 0 l-12 -4 l2 -4 l10 4z M0 0 l12 -4 l-2 -4 l-10 4z" fill="#FFB3D6"/><circle cy="-3" r="3" fill="#FFE066"/></g>
  <path d="M108 560 v-40 M114 566 v-34 M102 568 v-28" stroke="#5E9A4A" stroke-width="3"/><ellipse cx="108" cy="518" rx="3.5" ry="9" fill="#8C5A3C"/><ellipse cx="114" cy="530" rx="3" ry="8" fill="#8C5A3C"/></g>
<g data-tap="pondBoat"><rect x="296" y="578" width="104" height="70" fill="transparent"/>
  <ellipse cx="348" cy="640" rx="46" ry="6" fill="#000" opacity=".12"/>
  <path d="M302 606 Q348 644 394 606 L388 600 H308Z" fill="#E2513B"/><path d="M308 600 H388" stroke="#fff" stroke-width="4"/><path d="M314 616 Q348 636 384 616" stroke="#B23A2B" stroke-width="3" fill="none"/>
  <path d="M318 596 L296 584 M378 596 L398 586" stroke="#A86B3C" stroke-width="4" stroke-linecap="round"/><text x="348" y="624" font-size="10" font-weight="800" text-anchor="middle" fill="#fff">LUCKY</text></g>
${h.flower(150, 684, '#FF7AB8', 0.85)}${h.flower(258, 690, '#FFD23F', 0.85)}
</svg>`,

  css: `
.gp-ripples.amb { animation: gpRipple 4s ease-in-out infinite; }
@keyframes gpRipple { 50% { transform: translateX(10px); opacity: .25; } }
.gp-ducks.amb { animation: gpDucks 6s ease-in-out infinite; }
@keyframes gpDucks { 50% { transform: translateX(-10px); } }
[data-tap="pondDucks"].gpswim .gp-ducks { animation: gpSwim 2.6s ease-in-out; }
@keyframes gpSwim { 50% { transform: translateX(-60px); } }
[data-tap="pondDucks"].gpdive .gp-ducks { transform-box: fill-box; transform-origin: 50% 100%; animation: gpDive 1.6s ease-in-out; }
@keyframes gpDive { 30%, 70% { transform: rotate(-60deg) translateY(6px); } }
[data-tap="pondBoat"].gprock { transform-box: fill-box; transform-origin: 50% 100%; animation: gpRock .5s ease-in-out 4 alternate; }
@keyframes gpRock { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }
[data-tap="pondLily"].gpbloom .gp-lily { transform-box: fill-box; transform-origin: 50% 100%; animation: gpBloom 1.6s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes gpBloom { 40% { transform: scale(1.8); } }
[data-tap="pondWillow"].gpsway .gp-branches { transform-box: fill-box; transform-origin: 50% 0; animation: gpSway 1.4s ease-in-out 2 alternate; }
@keyframes gpSway { from { transform: skewX(-6deg); } to { transform: skewX(6deg); } }
[data-tap="pondBridge"].gpthud { animation: gpThud .3s ease-in-out 3; }
@keyframes gpThud { 50% { transform: translateY(2px); } }
`,

  props: (h) => ({
    gardenPondDuckling: { slot: 'head', art: () => `<g transform="translate(100 34) scale(.9)"><ellipse rx="14" ry="9" fill="#FFE066"/><circle cx="10" cy="-9" r="7" fill="#FFE066"/><path d="M16 -9 l7 2 -7 3z" fill="#FF9F43"/><circle cx="12" cy="-11" r="1.8" fill="#3A2216"/></g>` },
    gardenPondBoat: { slot: 'feet', art: () => `<path d="M24 176 Q100 232 176 176 L168 168 H32Z" fill="#E2513B"/><path d="M32 168 H168" stroke="#fff" stroke-width="5"/><path d="M40 170 L4 150 M160 170 L196 150" stroke="#A86B3C" stroke-width="6" stroke-linecap="round"/>` },
    gardenPondLilyCrown: { slot: 'head', art: () => [[70, 50], [100, 40], [130, 50]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 0 l-8 -10 l4 -2 l4 6 l4 -6 l4 2z M0 0 l-12 -4 l2 -4 l10 4z M0 0 l12 -4 l-2 -4 l-10 4z" fill="#FFB3D6"/><circle cy="-3" r="3" fill="#FFE066"/></g>`).join('') + '<path d="M62 54 Q100 36 138 54" stroke="#4CB050" stroke-width="4" fill="none"/>' },
  }),

  reactions: (R, k) => {
    const { api, sfx, who, oneOf, begin, end, at, hold, go, pose, prop, fly, popUp, line, centerOf, nextTo, head, nose, mouth, feet, sceneRect } = k;
    const swim = (c) => { api.hop(c.el, 'gpswim', 2600); quack(sfx); setTimeout(() => { if (api.free()) { pose('happy', 1500, 'wave', 1200); line('gardenPondQuack', 1); } }, 500); };
    const duckling = (c) => {
      const a = begin('gpDuckling');
      quack(sfx);
      fly('🐥', [c.x + 30, c.y], head(), 700, { arc: 60, size: 26 });
      at(a, 700, () => { prop('gardenPondDuckling', 2800); pose('surprised', 1500, 'balance', 2000); line('gardenPondDuckling', 1, 0); });
      at(a, 3400, () => { fly('🐥', head(), [c.x + 30, c.y], 700, { arc: 50, size: 26 }); api.setTemp('laugh', 1400); });
      at(a, 4100, end);
    };
    R.pondDucks = {
      press: () => sfx.honk(),
      tap: who(oneOf('gardenPondDucks', swim, duckling)),
      double: (c) => { api.hop(c.el, 'gpdive', 1600); sfx.splash(); api.fxAt(c.x, c.y, ['💦'], 4, 'spark'); if (api.free()) { pose('laugh', 1400, 'hop'); line('gardenPondDive', 1); } },
      long: who((c) => {
        const a = begin('gpFeed');
        go(nextTo(c.el), 700);
        at(a, 750, () => { [0, 200, 400].forEach((d) => at(a, d, () => fly('🟢', k.paw(), [c.x + (Math.random() * 40 - 20), c.y], 500, { arc: 30, size: 10 }))); line('gardenPondFeed', 1, 0); });
        at(a, 1600, () => { quack(sfx); api.hop(c.el, 'gpswim', 2600); api.hearts(c.x, c.y - 20, 3); api.reward(); });
        at(a, 3200, end);
      }),
    };

    // the boat: a row across the pond, it rocks, a paper boat; a long press goes fishing
    const row = () => {
      const a = begin('gpRow');
      prop('gardenPondBoat', 3600);
      hold(a, 'sway', 3400);
      sfx.splash();
      line('gardenPondBoatRow', 1, 0);
      [800, 1600, 2400].forEach((d) => at(a, d, () => { sfx.splash(); api.fxAt(...feet(), ['💧'], 3, 'spark'); }));
      at(a, 3700, () => { api.reward(); end(); });
    };
    const rock = (c) => { api.hop(c.el, 'gprock', 2000); sfx.splash(); setTimeout(() => { if (api.free()) { pose('laugh', 1400, 'hop'); line('gardenPondBoatRock', 1); } }, 300); };
    R.pondBoat = {
      press: () => sfx.knock(),
      tap: who(oneOf('gardenPondBoat', row, rock)),
      double: (c) => { popUp('⛵', c.x - 60, c.y - 20, 2600, 30, 'pop-stay'); sfx.whoosh(); if (api.free()) { pose('happy', 1500, 'wave', 1200); line('gardenPondPaperBoat', 1); } },
      long: who((c) => {
        const a = begin('gpFish');
        prop('rod', 3600);
        pose('happy', 2000, 'listen', 2000);
        sfx.whoosh();
        at(a, 1800, () => { const boot = Math.random() < 0.5; popUp(boot ? '👢' : '🐟', c.x - 40, c.y - 50, 1800, 34, 'pop-rise'); sfx.splash(); api.setTemp(boot ? 'surprised' : 'laugh', 1600); line(k.LUCKY.antics.gardenPondFish.slice(boot ? 0 : 1, boot ? 1 : 2), 1, 0); api.reward(); });
        at(a, 3800, end);
      }),
    };

    // the bridge: Poohsticks (two sticks race under the bridge), stomping, the reflection, singing
    const sticks = (c) => {
      const a = begin('gpSticks');
      const [bx, by] = centerOf(c.el);
      line('gardenPondSticks', 1, 0);
      at(a, 900, () => { fly('🪵', [bx - 20, by - 20], [bx - 10, by + 30], 500, { size: 18 }); fly('🥢', [bx + 20, by - 20], [bx + 10, by + 30], 500, { size: 18 }); sfx.splash(); });
      at(a, 2600, () => {
        const mine = Math.random() < 0.5;
        popUp(mine ? '🪵' : '🥢', bx + 50, by + 40, 1600, 26, 'pop-rise');
        sfx.happy();
        pose('laugh', 1500, 'binky');
        line(k.LUCKY.antics.gardenPondSticksWin.slice(mine ? 0 : 1, mine ? 1 : 2), 1, 0);
        api.reward();
      });
      at(a, 4200, end);
    };
    const stomp = (c) => { api.hop(c.el, 'gpthud', 900); sfx.thump(); setTimeout(() => sfx.thump(), 300); if (api.free()) { pose('laugh', 1400, 'stomp', 900); line('gardenPondBridge', 1); } };
    R.pondBridge = {
      press: () => sfx.knock(),
      tap: who(oneOf('gardenPondBridge', sticks, stomp)),
      double: who(() => { pose('surprised', 1500, 'look', 1500); popUp('🐰', ...feet(), 1800, 40, 'pop-stay mirror'); line('gardenPondMirror', 1); }),
      long: who(() => { pose('happy', 3000, 'sway', 1300); [0, 600, 1200].forEach((d) => setTimeout(() => sfx.note(523 + d / 3), d)); api.fxAt(...head(), ['🎵', '🎶'], 4, 'spark'); line('gardenPondSing', 1); }),
    };

    // the water lilies: one opens, a butterfly on his nose; hopping across the pads; a crown
    const bloom = (c) => { api.hop(c.el, 'gpbloom', 1600); sfx.chime(); setTimeout(() => { if (api.free()) { pose('happy', 1500, 'proud', 1200); line('gardenPondBloom', 1); } }, 400); };
    const butterfly = (c) => {
      const a = begin('gpButterfly');
      fly('🦋', [c.x, c.y - 30], nose(), 900, { arc: 50, size: 22, stay: 2000 });
      at(a, 900, () => { pose('ok', 2000, 'tilt', 1400); line('gardenPondButterfly', 1, 0); });
      at(a, 2800, () => { sfx.sneeze(); pose('laugh', 1400, 'sneeze'); fly('🦋', nose(), [sceneRect().width + 30, 40], 900, { arc: 40, size: 22 }); });
      at(a, 3800, end);
    };
    R.pondLily = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['💧'], 3, 'spark'); },
      tap: who(oneOf('gardenPondLily', bloom, butterfly)),
      double: who((c) => {
        const a = begin('gpHop');
        go(nextTo(c.el, 10), 600);
        [600, 1100, 1600].forEach((d) => at(a, d, () => { pose('laugh', 600, 'hop', 500); sfx.boing(); api.fxAt(...feet(), ['💦'], 2, 'spark'); }));
        at(a, 2100, () => { sfx.splash(); line('gardenPondHop', 1, 0); k.getWet(a, 1600); });
        at(a, 4400, end);
      }),
      long: who(() => { prop('gardenPondLilyCrown', 12000); sfx.magic(); pose('happy', 1600, 'proud', 1200); line('gardenPondCrown', 1); api.reward(); }),
    };

    // the willow: its branches sway; behind them is a perfect place to hide
    R.pondWillow = {
      press: () => sfx.whoosh(),
      tap: who(oneOf('gardenPondWillow', (c) => { api.hop(c.el, 'gpsway', 2800); sfx.whoosh(); setTimeout(() => { if (api.free()) { pose('happy', 1300, 'sway', 1300); line('gardenPondWillow', 1); } }, 300); },
        (c) => { api.fxAt(c.x, c.y, ['🍃', '🌿'], 8, 'drop'); sfx.whoosh(); if (api.free()) { pose('laugh', 1400, 'hop'); line('gardenPondLeaves', 1); } })),
      double: (c) => { api.hop(c.el, 'gpsway', 2800); api.fxAt(c.x, c.y, ['🍃'], 6, 'drop'); sfx.whoosh(); },
      long: who((c) => k.hideGame(begin('hide'), c.el)),
    };
  },

  visitors: [
    { e: '🦆', w: 3, path: 'glide', end: ['sing', 'feather'], flip: true },
    { e: '🦋', w: 2, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'] },
  ],
};
