// Northern lights (level 47): an arctic evening under the aurora. The lights change colour (Lucky glows along), a fox
// runs by and sets them alight, they become Lucky's scarf and dance with him. A polar bear hugs, sneezes snow, rolls a
// snowball and naps; an ice hole for fishing (a fish, a boot, a mitten, a crab), with a seal or a lost penguin; a
// reindeer to ride, with a glowing nose and jingling bells; and an arctic hare, Lucky's snow-white cousin.

// the colours the lights take in turn: the ribbons' top, middle and bright lower edge, the far ribbon, Lucky's glow
const PAL = [
  { s: ['#7B5CFF', '#3FE6A6', '#B8FFE0'], b: ['#B07CFF', '#FF7AD0'], glow: '#5CFFB4' },
  { s: ['#5C6BFF', '#FF6FC8', '#FFD6F1'], b: ['#6E8CFF', '#5CE1FF'], glow: '#FF7AD0' },
  { s: ['#4E7BFF', '#A77BFF', '#EADCFF'], b: ['#3FE6A6', '#B8FFE0'], glow: '#B58CFF' },
  { s: ['#5C5CFF', '#3FD8F0', '#D4FBFF'], b: ['#FF8AD8', '#C07CFF'], glow: '#5CE8FF' },
];
const palCss = PAL.map((p, i) => {
  const s = i ? `svg.za-c${i} ` : '';
  return `${s}.za-s0 { stop-color: ${p.s[0]}; } ${s}.za-s1 { stop-color: ${p.s[1]}; } ${s}.za-s2 { stop-color: ${p.s[2]}; }
${s}.za-b0 { stop-color: ${p.b[0]}; } ${s}.za-b1 { stop-color: ${p.b[1]}; } ${s}.za-rim { stroke: ${p.s[2]}; }`;
}).join('\n');

// ---------- the picture ----------
const f = (n) => n.toFixed(1);
const rnd = (i) => { const v = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return v - Math.floor(v); };
// a curtain of light: thin vertical rays standing on a wavy lower edge, shorter towards the ends
function curtain(x0, x1, edge, h, grad, seed) {
  const rays = [], pts = [];
  for (let x = x0, i = 0; x < x1; x += 6, i++) {
    const t = Math.max(0, Math.sin(Math.PI * (x - x0 + 3) / (x1 - x0))) ** 0.7, y0 = edge(x), y1 = edge(x + 6);
    const hh = h(x) * t * (0.72 + 0.28 * rnd(seed + i)), op = 0.55 + 0.45 * rnd(seed + i + 40);
    rays.push(`<path d="M${x} ${f(y0)} L${x + 6.6} ${f(y1)} L${x + 6.6} ${f(y1 - hh)} L${x} ${f(y0 - hh)}Z" fill="url(#@${grad})" opacity="${op.toFixed(2)}"/>`);
  }
  for (let x = x0; x <= x1; x += 6) pts.push(`${x} ${f(edge(x))}`);
  return { rays: rays.join(''), edge: 'M' + pts.join(' L') };
}
const R1 = curtain(-30, 432, (x) => 360 - 0.08 * (x - 200) + 15 * Math.sin(0.021 * x + 0.4) + 6 * Math.sin(0.057 * x + 1.3), (x) => 128 + 22 * Math.sin(0.013 * x + 2), 'a', 1);
const R2 = curtain(-40, 330, (x) => 292 + 0.06 * (x - 100) + 12 * Math.sin(0.03 * x + 2.2), () => 96, 'b', 200);
const R3 = curtain(170, 436, (x) => 384 - 0.12 * (x - 300) + 8 * Math.sin(0.045 * x), () => 74, 'b', 400);

// the far hills: dark, with snowy tops lit by the lights
const MT = [[0, 428], [26, 410], [48, 418], [78, 394], [104, 412], [122, 404], [156, 384], [186, 408], [210, 400], [238, 412], [268, 388], [300, 410], [334, 396], [368, 414], [400, 402]];
const MT_RIDGE = 'M' + MT.map((p) => p.join(' ')).join(' L');
const MT_PATH = MT_RIDGE + ' V470 H0Z';
const MT_CAPS = [3, 6, 10, 12].map((i) => {
  const [px, py] = MT[i], k = 0.42, [lx, ly] = MT[i - 1].map((v, j) => [px, py][j] + (v - [px, py][j]) * k), [rx, ry] = MT[i + 1].map((v, j) => [px, py][j] + (v - [px, py][j]) * k);
  return `M${px} ${py} L${f(rx)} ${f(ry)} L${f(px + (rx - px) * 0.5)} ${f(ry - 2.5)} L${px} ${f(Math.max(ly, ry) + 1.5)} L${f(px + (lx - px) * 0.5)} ${f(ly - 2.5)} L${f(lx)} ${f(ly)}Z`;
}).join(' ');
const star4 = (x, y, r, cls = '') => `<path${cls ? ` class="${cls}"` : ''} d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="#fff"/>`;
// the tiny stars all over the sky, and the bigger ones that answer taps
const dots = Array.from({ length: 50 }, (_, i) => { const x = f(rnd(i + 300) * 400), y = f(6 + rnd(i + 500) * 404); return `<circle${i % 4 ? '' : ` class="twinkle t${i % 3}"`} cx="${x}" cy="${y}" r="${(0.6 + rnd(i) * 1.1).toFixed(2)}" fill="#fff" opacity="${(0.35 + rnd(i + 9) * 0.6).toFixed(2)}"/>`; }).join('');
// (not in the top left corner: the scene's buttons are there)
const tapStars = [[178, 214, 5], [262, 204, 4.5], [330, 230, 5.5], [382, 262, 4.5], [386, 330, 4], [158, 252, 4]]
  .map(([x, y, r], i) => `<g data-tap="star"><circle cx="${x}" cy="${y}" r="13" fill="transparent"/>${star4(x, y, r, `twinkle t${i % 3}`)}</g>`).join('');
const sparkles = [[134, 606, 3], [262, 536, 2.5], [208, 676, 3], [118, 520, 2.2], [292, 610, 2.6], [176, 560, 2], [244, 640, 2.2], [60, 476, 2]]
  .map(([x, y, r], i) => star4(x, y, r, `twinkle t${i % 3}`)).join('');

// the reindeer, facing right: in the picture and (bigger, saddled) under Lucky when he rides it
const deerHead = (glow) => `<g class="za-dhead"><g class="za-dnod${glow ? '' : ' amb'}">
  <path d="M32 -50 q-15 -8 -20 1 q9 5 20 1z" fill="#8F5A39"/>
  <g stroke="#E3C08C" stroke-width="4" stroke-linecap="round" fill="none"><path d="M36 -54 Q30 -74 16 -86 M30 -70 Q20 -71 13 -64 M24 -80 Q27 -91 22 -98"/>
  <path d="M46 -55 Q50 -77 40 -96 M48 -72 Q56 -76 58 -86 M44 -86 Q37 -91 35 -98"/></g>
  <ellipse cx="42" cy="-44" rx="14" ry="11.5" fill="#A86E47"/><ellipse cx="54" cy="-38" rx="9.5" ry="7.5" fill="#C9946A"/>
  <ellipse cx="47" cy="-40" rx="3.5" ry="2.2" fill="#FF9DB0" opacity=".55"/>
  <circle cx="44" cy="-48" r="2.7" fill="#2A1B1E"/><circle cx="45" cy="-49" r="1" fill="#fff"/>
  <path d="M53 -33 q3 3 7 1" stroke="#6B3E1E" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle class="za-dmouth" cx="56" cy="-34" r="1.5" fill="transparent"/>
  <circle class="za-halo" cx="61" cy="-39" r="12" fill="#FF6B5A"/><circle class="za-dnose" cx="61" cy="-39" r="5" fill="#E8413A"/><circle cx="59.5" cy="-40.5" r="1.6" fill="#fff" opacity=".8"/>
  <path d="M34 -55 Q40 -58 48 -55" class="za-rim" stroke-width="1.6" fill="none" opacity=".6" stroke-linecap="round"/></g></g>`;
const deerBody = `<path d="M-26 22 v52 M12 22 v52" stroke="#7A4E33" stroke-width="8" stroke-linecap="round"/>
  <path d="M-15 26 v50 M23 26 v50" stroke="#8C5A3C" stroke-width="9" stroke-linecap="round"/>
  <path d="M-19.5 76 h9 M18.5 76 h9 M-30 72 h8 M8 72 h8" stroke="#3A2A2E" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="-38" cy="8" rx="6" ry="7" fill="#F4EADC"/>
  <path d="M18 8 Q22 -24 34 -40 L48 -32 Q40 -10 36 16Z" fill="#A86E47"/>
  <ellipse cx="0" cy="18" rx="38" ry="22" fill="#A86E47"/><ellipse cx="2" cy="32" rx="26" ry="7" fill="#E6D0B0"/>
  <path d="M40 -26 Q50 -8 42 14 Q37 7 32 9 Q40 -6 40 -26Z" fill="#EFE3CF"/>
  <path d="M-34 0 Q-10 -8 18 -2" class="za-rim" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/>`;
const deerBells = `<g class="za-bells"><path d="M22 -2 Q33 5 45 -6" stroke="#E2313B" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${[[27, 3], [35, 4], [43, -2]].map(([x, y]) => `<g class="za-bell"><circle cx="${x}" cy="${y + 3}" r="3.6" fill="#FFD23F" stroke="#D9A400" stroke-width="1.2"/><circle cx="${x - 1}" cy="${y + 2}" r="1" fill="#fff"/></g>`).join('')}</g>`;
const rideDeer = `<g transform="translate(100 190) scale(1.55)">${deerBody}
  <path d="M-22 -2 Q0 -8 22 -2 L20 12 Q0 8 -20 12Z" fill="#E2313B"/><path d="M-21 10 Q0 6 21 10" stroke="#FFD23F" stroke-width="2" fill="none"/>
  <path d="M24 2 Q34 -30 52 -52 L66 -42 Q50 -14 40 14Z" fill="#A86E47"/><path d="M50 -36 Q60 -16 46 10 Q42 4 38 6 Q50 -12 50 -36Z" fill="#EFE3CF"/>
  ${deerBells}<g transform="translate(16 -10)">${deerHead(true)}</g></g>`;

export default {
  id: 'aurora',
  level: 47,
  name: ['Северное сияние', 'Northern lights'],
  emoji: ['🌌', '🐻‍❄️', '🦌', '🦭', '🧊'],
  spots: { L: [28, 414], R: [372, 446], l: [130, 692], r: [272, 694], sky: 300 },
  arrive: [
    ['Северное сияние! Небо светится зелёным и розовым!', 'The northern lights! The whole sky is glowing green and pink!'],
    ['Брр, тут холодно! Зато какое небо! Загадывай желание.', "Brr, it's chilly here! But look at that sky! Make a wish."],
  ],

  lines: {
    auroraColor: [['Сияние поменяло цвет, и я вместе с ним!', 'The lights changed colour, and so did I!'], ['Смотри, я свечусь, как северное сияние!', "Look, I'm glowing like the northern lights!"],
      ['Сияние бывает, когда частицы от Солнца заставляют воздух светиться.', 'The northern lights happen when tiny bits from the Sun make the air glow.']],
    auroraFox: [['В Финляндии сияние зовут лисьим огнём: лиса метёт искры хвостом!', "In Finland it's called fox fire: a fox sweeps sparks into the sky with its tail!"],
      ['Лиса пробежала, и небо вспыхнуло! Вот это хвост!', 'A fox ran by and the sky lit up! What a tail!']],
    auroraScarf: [['Я поймал кусочек северного сияния! Теперь это мой шарф.', "I caught a piece of the northern lights! Now it's my scarf."]],
    auroraDance: [['Сияние танцует! И я танцую!', 'The northern lights are dancing! So am I!'], ['Говорят, если посвистеть, сияние начинает танцевать. Работает!', 'They say if you whistle, the northern lights start to dance. It works!']],
    auroraBearHug: [['Обнимашки с белым медведем! Он мягкий и тёплый.', "A polar bear hug! He's so soft and warm."], ['А ты знала? Под белой шубой у медведя чёрная кожа!', 'Did you know? Under all that white fur, a polar bear has black skin!']],
    auroraBearSneeze: [['Будь здоров, мишка! Теперь я снежный кролик.', "Bless you, bear! Now I'm a snow bunny."], ['Апчхи! Медведь чихнул, и я теперь сугроб!', "Achoo! The bear sneezed, and now I'm a snowdrift!"]],
    auroraSnowball: [['Катаем снежный ком! Он уже больше меня!', "We're rolling a snowball! It's already bigger than me!"]],
    auroraBearNap: [['Тсс… Мишка уснул. Он как большая тёплая подушка.', "Shh… The bear's asleep. He's like a big warm pillow."]],
    auroraFishStart: [['Тихо… Рыбалка на льду. Посмотрим, кто клюнет.', "Shh… Ice fishing. Let's see who bites."]],
    auroraFish: [['Рыбка! Красивая. Плыви обратно, расти большой!', 'A fish! A pretty one. Swim back and grow big!'], ['Клюёт! Ой, какая серебристая!', "A bite! Ooh, it's all silvery!"]],
    auroraBoot: [['Ботинок?! Кто-то тут рыбачил в одном ботинке.', 'A boot?! Someone went fishing here in just one boot.']],
    auroraMitten: [['Варежка! Кто-то потерял. Вторая, наверно, у рыб.', 'A mitten! Someone lost it. The fish must have the other one.']],
    auroraCrab: [['Краб! Ой-ой, только не за ухо!', 'A crab! Uh-oh, not my ear!']],
    auroraSeal: [['Тюлень! Он вынырнул подышать.', 'A seal! It came up for a breath of air.'], ['Привет, тюлень! Какие у тебя усищи!', 'Hi, seal! What amazing whiskers!']],
    auroraPenguin: [['Пингвин? Ты заблудился! Пингвины живут на юге!', "A penguin? You're lost! Penguins live way down south!"]],
    auroraFishJump: [['Рыбка выпрыгнула! Ты куда? Тут же холодно!', "A fish jumped out! Where are you going? It's cold out here!"]],
    auroraBigPull: [['Тянем-потянем… Там кто-то огромный!', "Heave-ho… It's something huge!"]],
    auroraTiny: [['Столько тянул… ради такой малявки! Плыви, расти большой.', 'All that pulling… for this tiddler! Off you go, grow big.']],
    auroraRide: [['Но-о, олень! Поскакали!', "Giddy-up, reindeer! Let's go!"], ['Я еду на олене! Держусь за рога!', "I'm riding a reindeer! Holding on to the antlers!"]],
    auroraNose: [['У оленя светится нос! Бип — и у меня тоже!', "The reindeer's nose is glowing! Boop, and now mine is too!"]],
    auroraCarrot: [['Держи, олень, морковку! Отдаю от всего сердца… почти.', "Here's a carrot, reindeer! From the bottom of my heart… mostly."]],
    auroraAntlers: [['Смотри, я тоже олень! Динь-динь!', "Look, I'm a reindeer too! Jingle, jingle!"], ['А ты знала? У оленей рога каждый год вырастают заново!', 'Did you know? Reindeer grow brand-new antlers every year!']],
    auroraHareBoop: [['Белый зайчик! Привет, братишка! Давай потрёмся носиками.', "A snow-white bunny! Hi, cousin! Let's boop noses."], ['Это заяц-беляк. Мы почти родственники!', "It's an arctic hare. We're practically family!"]],
    auroraHareBinky: [['Кто выше прыгнет? Беляк, ты чемпион!', 'Who can jump higher? You win, snow bunny!']],
    auroraHareRace: [['Наперегонки! Ого, полярный заяц бегает быстро, как машина!', 'Race you! Whoa, arctic hares run as fast as a car!']],
    auroraHareHide: [['Куда он делся? Белый на белом снегу — не видно!', "Where did he go? White on white snow, he's invisible!"],
      ['Зимой беляк белый, а летом серый. Вот бы и мне так!', 'Hares like him are white in winter and brown in summer. I wish I could do that!']],
    auroraOwl: [['Сова села мне на голову! Наверно, мои уши похожи на ветку.', 'An owl landed on my head! My ears must look like a branch.']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060924"/><stop offset=".45" stop-color="#11154C"/><stop offset=".8" stop-color="#20266A"/><stop offset="1" stop-color="#2D4686"/></linearGradient>
<radialGradient id="${u}g" cx=".5" cy=".5" r=".5"><stop offset="0" class="za-s1" stop-color="#3FE6A6" stop-opacity=".34"/><stop offset="1" class="za-s1" stop-color="#3FE6A6" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B2350"/><stop offset="1" stop-color="#245A9A"/></linearGradient>
<clipPath id="${u}c"><ellipse cx="2" cy="4" rx="25" ry="9.5"/></clipPath></defs>
<rect width="400" height="470" fill="url(#${u}s)"/>
<g pointer-events="none">${dots}</g>
<!-- the whole sky answers as the lights (its middle well above the speech bubble) -->
<g data-tap="aurora"><rect x="20" y="80" width="360" height="300" fill="transparent"/>
  <defs><linearGradient id="${u}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="za-s0" stop-color="#7B5CFF" stop-opacity="0"/><stop offset=".42" class="za-s0" stop-color="#7B5CFF" stop-opacity=".3"/>
    <stop offset=".8" class="za-s1" stop-color="#3FE6A6" stop-opacity=".72"/><stop offset="1" class="za-s2" stop-color="#B8FFE0" stop-opacity=".95"/></linearGradient>
  <linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="za-b0" stop-color="#B07CFF" stop-opacity="0"/><stop offset=".55" class="za-b0" stop-color="#B07CFF" stop-opacity=".3"/>
    <stop offset="1" class="za-b1" stop-color="#FF7AD0" stop-opacity=".7"/></linearGradient>
  <linearGradient id="${u}e" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="za-s2" stop-color="#B8FFE0" stop-opacity="0"/><stop offset=".25" class="za-s2" stop-color="#B8FFE0"/><stop offset=".75" class="za-s2" stop-color="#B8FFE0"/><stop offset="1" class="za-s2" stop-color="#B8FFE0" stop-opacity="0"/></linearGradient></defs>
  <g class="za-ribs">
    <g class="za-rib za-r2 amb">${R2.rays.replaceAll('@', u)}<path d="${R2.edge}" stroke="url(#${u}e)" stroke-width="2" fill="none" opacity=".45"/></g>
    <g class="za-rib za-r3 amb">${R3.rays.replaceAll('@', u)}<path d="${R3.edge}" stroke="url(#${u}e)" stroke-width="2" fill="none" opacity=".5"/></g>
    <g class="za-rib za-r1 amb">${R1.rays.replaceAll('@', u)}<path class="za-burst" d="${R1.edge}" stroke="url(#${u}e)" stroke-width="12" fill="none" opacity=".22" stroke-linecap="round"/>
      <path d="${R1.edge}" stroke="url(#${u}e)" stroke-width="2.6" fill="none" opacity=".9"/><path class="za-shim amb" d="${R1.edge}" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/></g>
  </g></g>
${tapStars}
<path d="${MT_PATH}" fill="#1B2360"/><path d="${MT_CAPS}" fill="#C9D8FF" opacity=".9"/>
<path d="${MT_RIDGE}" class="za-rim" stroke-width="1.5" fill="none" opacity=".4" stroke-linejoin="round"/>
<path d="M0 446 Q100 430 200 438 T400 434 V700 H0Z" fill="#A9B8E2"/>
<ellipse class="za-refl amb" cx="200" cy="444" rx="250" ry="30" fill="url(#${u}g)"/>
<g transform="translate(-30 452)"><g class="za-fox"><g class="za-foxb"><path d="M-30 -6 Q-46 -18 -40 -2 Q-36 6 -20 2Z" fill="#F4F7FF"/><ellipse cx="-8" cy="-2" rx="15" ry="6.5" fill="#F4F7FF"/>
  <path d="M-18 2 l-6 7 M-14 3 l-2 8 M2 2 l4 8 M6 1 l7 6" stroke="#E3E9F7" stroke-width="3" stroke-linecap="round"/>
  <circle cx="9" cy="-7" r="6" fill="#F4F7FF"/><path d="M5 -11 l1 -7 4 5z M10 -12 l3 -6 2 6z" fill="#F4F7FF"/><path d="M13 -6 l8 2 -8 2z" fill="#F4F7FF"/>
  <circle cx="20.5" cy="-4" r="1.3" fill="#2A2436"/><circle cx="11" cy="-8" r="1.1" fill="#2A2436"/></g></g></g>
<path d="M0 494 Q110 474 220 486 T400 480 V700 H0Z" fill="#C6D2F2"/>
<path d="M0 584 Q200 560 400 588 V700 H0Z" fill="#DDE5FA"/>
<path d="M0 652 Q200 638 400 656 V700 H0Z" fill="#EBF0FD"/>
<path d="M0 497 Q110 477 220 489 T400 483 M0 587 Q200 563 400 591 M0 655 Q200 641 400 659" stroke="#fff" stroke-width="2.5" fill="none" opacity=".55"/>
<path d="M150 530 q40 -10 80 0 q-40 6 -80 0z M30 604 q34 -8 70 0 q-34 5 -70 0z M250 572 q30 -8 64 0 q-30 5 -64 0z" fill="#B7C5EC" opacity=".6"/>
<g fill="#B4C2EA" opacity=".8">${[[318, 682], [290, 676], [262, 684], [234, 677]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="2"/><ellipse cx="${x - 9}" cy="${y - 3}" rx="2" ry="1.4"/><ellipse cx="${x - 9}" cy="${y + 3}" rx="2" ry="1.4"/>`).join('')}</g>
<g pointer-events="none">${sparkles}</g>
<g data-tap="reindeer"><rect x="0" y="412" width="106" height="178" fill="transparent"/><g transform="translate(40 508) scale(.94)">
  <ellipse cx="4" cy="80" rx="42" ry="6" fill="#000" opacity=".14"/>${deerBody}${deerBells}${deerHead(false)}</g></g>
<g data-tap="iceHole"><rect x="0" y="602" width="108" height="90" fill="transparent"/><g transform="translate(54 652)">
  <ellipse cx="0" cy="6" rx="52" ry="22" fill="#B9DDF5"/><ellipse cx="-8" cy="0" rx="36" ry="12" fill="#D8EEFC"/>
  <path d="M-44 8 l10 -3 6 5 M30 16 l8 -6 9 2 M-20 20 l6 -4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse class="za-hole" cx="2" cy="4" rx="25" ry="9.5" fill="url(#${u}w)"/>
  <g clip-path="url(#${u}c)"><g class="za-swim amb"><path d="M-8 5 q7 -4 13 0 q-6 4 -13 0z M5 5 l5 -3 v6z" fill="#7FB4F0" opacity=".75"/></g>
    <path d="M-12 1 q8 -3 16 0" stroke="#8FD0FF" stroke-width="1.4" fill="none" opacity=".7"/></g>
  <ellipse cx="2" cy="4" rx="26.5" ry="11" stroke="#fff" stroke-width="3" fill="none"/>
  <g transform="translate(38 -10)"><ellipse cx="0" cy="14" rx="12" ry="3" fill="#000" opacity=".1"/><path d="M-9 -6 h18 l-2 19 h-14z" fill="#4D8FDB"/><path d="M-9 -6 h18" stroke="#3B74BC" stroke-width="2.4"/>
    <path d="M1 -6 L-6 -16 Q1 -12 7 -17Z" fill="#FF8F5A"/><path d="M-6 0 h12" stroke="#fff" stroke-width="1.4" opacity=".6"/></g></g></g>
<g data-tap="polarBear"><rect x="298" y="462" width="102" height="150" fill="transparent"/><g transform="translate(349 544) scale(.95)">
  <ellipse cx="4" cy="64" rx="48" ry="7" fill="#000" opacity=".14"/>
  <g class="za-bbody"><ellipse cx="10" cy="18" rx="40" ry="46" fill="#EEF2FC"/><path d="M34 -14 Q52 14 44 52 Q40 22 26 -8Z" fill="#D9E1F4" opacity=".8"/>
  <ellipse cx="26" cy="44" rx="22" ry="19" fill="#E2E8F7"/><ellipse cx="16" cy="60" rx="17" ry="7" fill="#EEF2FC"/>
  <ellipse cx="-6" cy="26" rx="26" ry="32" fill="#F8FAFF"/>
  <rect x="-31" y="18" width="19" height="44" rx="9.5" fill="#F2F5FD"/><rect x="-12" y="22" width="19" height="42" rx="9.5" fill="#F8FAFF"/>
  <path class="za-bpaw" d="M-28 60 v3 M-22 61 v3 M-16 60 v3 M-8 62 v3 M-2 63 v3 M4 62 v3" stroke="#C9D2EA" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M-30 -12 Q0 -24 40 -12" class="za-rim" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/></g>
  <g class="za-bhead"><g class="za-btilt amb">
    <circle cx="-36" cy="-50" r="8.5" fill="#EEF2FC"/><circle cx="-36" cy="-50" r="4.2" fill="#D3DAEE"/><circle cx="-4" cy="-54" r="8.5" fill="#EEF2FC"/><circle cx="-4" cy="-54" r="4.2" fill="#D3DAEE"/>
    <ellipse cx="-20" cy="-30" rx="27" ry="24" fill="#F8FAFF"/><path d="M-44 -42 Q-24 -60 0 -46" class="za-rim" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>
    <ellipse cx="-35" cy="-19" rx="15" ry="11" fill="#fff"/><ellipse cx="-8" cy="-24" rx="5" ry="3" fill="#FFB3C6" opacity=".55"/>
    <ellipse class="za-bnose" cx="-45" cy="-24" rx="6" ry="4.5" fill="#2A2436"/><ellipse cx="-47" cy="-25.5" rx="2" ry="1.2" fill="#fff" opacity=".7"/>
    <path d="M-45 -20 v3 M-45 -17 q-3 4 -7 1 M-45 -17 q4 5 9 1" stroke="#2A2436" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <g class="za-beyes"><circle cx="-31" cy="-38" r="3.3" fill="#2A2436"/><circle cx="-30" cy="-39" r="1.1" fill="#fff"/><circle cx="-13" cy="-38" r="3.3" fill="#2A2436"/><circle cx="-12" cy="-39" r="1.1" fill="#fff"/></g>
    <path class="za-bshut" d="M-35 -38 q4 3 8 0 M-17 -38 q4 3 8 0" stroke="#2A2436" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M-46 -8 Q-18 4 10 -8 L12 0 Q-18 13 -47 0Z" fill="#E2313B"/><path d="M-36 -5 l2 8 M-24 -2 l1 8 M-12 -2 l0 8 M0 -4 l-1 8" stroke="#fff" stroke-width="2.6" opacity=".9"/>
    <path d="M0 -2 l-4 26 l10 1 l3 -25z" fill="#E2313B"/><path d="M-3 12 l9 1" stroke="#fff" stroke-width="2.6"/><path d="M-4 24 v4 M0 25 v4 M4 25 v4" stroke="#E2313B" stroke-width="1.6"/>
  </g></g></g></g>
<g data-tap="snowHare"><rect x="320" y="610" width="80" height="84" fill="transparent"/><g transform="translate(360 664)"><g class="za-hare">
  <ellipse cx="2" cy="26" rx="30" ry="5" fill="#000" opacity=".12"/>
  <ellipse cx="8" cy="8" rx="24" ry="19" fill="#FBFCFF"/><path d="M22 -6 Q34 8 26 22" class="za-rim" stroke-width="1.8" fill="none" opacity=".55" stroke-linecap="round"/>
  <circle cx="31" cy="6" r="6" fill="#fff"/><ellipse cx="12" cy="24" rx="16" ry="5" fill="#EEF2FC"/><ellipse cx="-12" cy="24" rx="6" ry="4" fill="#F4F7FF"/><ellipse cx="-2" cy="25" rx="6" ry="4" fill="#F4F7FF"/>
  <g class="za-hhead"><g transform="rotate(-10 -12 -22)"><ellipse cx="-12" cy="-38" rx="5.5" ry="16" fill="#FBFCFF"/><ellipse cx="-12" cy="-36" rx="2.6" ry="11" fill="#FFD3DF"/><path d="M-16.8 -46 A5.5 16 0 0 1 -7.2 -46 Q-12 -48.5 -16.8 -46Z" fill="#3A3346"/></g>
    <g transform="rotate(14 -2 -22)"><ellipse cx="-2" cy="-38" rx="5.5" ry="16" fill="#F2F5FD"/><path d="M-6.8 -46 A5.5 16 0 0 1 2.8 -46 Q-2 -48.5 -6.8 -46Z" fill="#3A3346"/></g>
    <circle cx="-12" cy="-10" r="14" fill="#FBFCFF"/><circle cx="-18" cy="-12" r="2.5" fill="#2A2436"/><circle cx="-17.3" cy="-12.8" r=".9" fill="#fff"/>
    <ellipse cx="-12" cy="-5" rx="3.6" ry="2.2" fill="#FFB3C6" opacity=".55"/><path d="M-26 -7 l3 -2 v4z" fill="#FF8FB0"/>
    <path d="M-24 -5 l-9 -2 M-24 -4 l-9 2" stroke="#C9D2EA" stroke-width=".9"/></g></g></g></g>
${h.snow(10)}
</svg>`,

  css: `
${palCss}
.za-s0, .za-s1, .za-s2, .za-b0, .za-b1 { transition: stop-color 1s; }
.za-rim { transition: stroke 1s; }
.za-rib { transform-box: fill-box; transform-origin: 50% 100%; }
.za-r1.amb { animation: zaRib 9s ease-in-out infinite; }
.za-r2.amb { animation: zaRib 12s ease-in-out -4s infinite reverse; }
.za-r3.amb { animation: zaRib 7.5s ease-in-out -2s infinite; }
@keyframes zaRib { 0%, 100% { transform: translateX(-6px) skewX(-3deg); opacity: .82; } 50% { transform: translateX(5px) skewX(3deg) scaleY(1.06); opacity: 1; } }
.za-shim.amb { stroke-dasharray: 26 110; animation: zaShim 5s linear infinite; }
@keyframes zaShim { to { stroke-dashoffset: -680; } }
.za-refl.amb { animation: zaRefl 9s ease-in-out infinite; }
@keyframes zaRefl { 50% { opacity: .6; } }
[data-tap="aurora"].tapped { animation: zaTap .6s ease-out; }
@keyframes zaTap { 40% { opacity: .7; } }
[data-tap="aurora"].za-shift { animation: zaShift 1.4s ease-in-out; }
@keyframes zaShift { 25% { opacity: .3; } }
.za-ribs { transform-box: fill-box; transform-origin: 50% 100%; }
.za-flare .za-ribs { animation: zaFlare 1.6s ease-in-out; }
@keyframes zaFlare { 35% { transform: scaleY(1.16); } }
.za-flare .za-burst { animation: zaBurst 1.6s ease-in-out; }
@keyframes zaBurst { 35% { opacity: .75; stroke-width: 22px; } }
[data-tap="aurora"].za-dance .za-rib { animation: zaDance .8s ease-in-out infinite alternate !important; }
@keyframes zaDance { from { transform: translateX(-12px) skewX(-9deg) scaleY(.96); } to { transform: translateX(12px) skewX(9deg) scaleY(1.12); } }
.lucky.za-glow .l-art { filter: drop-shadow(0 0 8px var(--za-glow, #5CFFB4)) drop-shadow(0 0 18px var(--za-glow, #5CFFB4)) brightness(1.08); }
.lucky.za-ride { bottom: 13%; animation: zaGallop .34s ease-in-out infinite; }
@keyframes zaGallop { 50% { translate: 0 -3%; rotate: -2deg; } }
.za-fox { opacity: 0; pointer-events: none; }
.za-fox.za-run { animation: zaFoxRun 2.6s linear; }
@keyframes zaFoxRun { 0% { opacity: 1; transform: translateX(0); } 97% { opacity: 1; } 100% { opacity: 0; transform: translateX(500px); } }
.za-run .za-foxb { animation: zaFoxHop .26s ease-in-out infinite alternate; }
@keyframes zaFoxHop { to { transform: translateY(-5px) rotate(-4deg); } }
.za-bells .za-bell { transform-box: fill-box; transform-origin: 50% 0; }
.za-jingle .za-bell { animation: zaBell .18s ease-in-out 5 alternate; }
@keyframes zaBell { from { transform: rotate(-22deg); } to { transform: rotate(22deg); } }
.za-dnod, .za-dhead, .za-btilt, .za-bhead, .za-bbody, .za-hhead, .za-hare { transform-box: fill-box; }
.za-dnod.amb { transform-origin: 20% 90%; animation: zaNod 6s ease-in-out infinite; }
@keyframes zaNod { 0%, 70%, 100% { transform: none; } 78% { transform: rotate(-5deg); } 88% { transform: rotate(3deg); } }
.za-halo { opacity: 0; }
.za-noseglow .za-halo { animation: zaHalo .7s ease-in-out infinite alternate; }
.za-noseglow .za-dnose { fill: #FF5040; }
.za-lnose { animation: zaHalo .7s ease-in-out infinite alternate; }
@keyframes zaHalo { from { opacity: .2; } to { opacity: .75; } }
.za-dhead { transform-origin: 20% 90%; }
.za-munch .za-dhead { animation: zaMunch .3s ease-in-out 4 alternate; }
@keyframes zaMunch { to { transform: rotate(5deg) translateY(2px); } }
[data-tap="reindeer"], [data-tap="polarBear"] { transition: opacity .4s; }
[data-tap="reindeer"].tapped, [data-tap="polarBear"].tapped { animation: zaPress .5s ease-in-out; transform-origin: 50% 100%; }
@keyframes zaPress { 40% { transform: scale(1.05, .95); } }
.za-away { opacity: 0; }
.za-btilt.amb { transform-origin: 50% 100%; animation: zaTilt 7s ease-in-out infinite; }
@keyframes zaTilt { 0%, 60%, 100% { transform: none; } 70%, 85% { transform: rotate(-6deg); } }
.za-bhead { transform-origin: 60% 100%; }
.za-bshut { opacity: 0; }
.za-sniffs .za-bhead { animation: zaSniff .8s ease-in-out; }
@keyframes zaSniff { 60% { transform: rotate(8deg) translateY(-3px); } }
.za-sneeze .za-bhead { animation: zaSneeze .6s ease-out; }
@keyframes zaSneeze { 30% { transform: rotate(-12deg) translateX(-5px); } }
[data-tap="polarBear"].za-hug { animation: zaHug 1s ease-in-out; transform-origin: 50% 100%; }
@keyframes zaHug { 30%, 60% { transform: scale(1.06, .95); } }
.za-nap .za-beyes { opacity: 0; }
.za-nap .za-bshut { opacity: 1; }
.za-nap .za-bhead { animation: zaDoze 4s ease-in-out; }
@keyframes zaDoze { 15%, 85% { transform: rotate(10deg) translateY(4px); } }
.za-bbody { transform-origin: 50% 100%; }
.za-nap .za-bbody { animation: zaBreathe 1.6s ease-in-out infinite; }
@keyframes zaBreathe { 50% { transform: scale(1.02, 1.035); } }
.za-swim.amb { animation: zaSwim 3.2s ease-in-out infinite alternate; }
@keyframes zaSwim { from { transform: translateX(-16px); } to { transform: translateX(14px); } }
.za-hare { transform-origin: 50% 100%; }
[data-tap="snowHare"].za-hboop .za-hare { animation: zaHBoop 1.2s ease-in-out; }
@keyframes zaHBoop { 30%, 70% { transform: translateX(-6px) rotate(-6deg); } }
[data-tap="snowHare"].za-hbinky .za-hare { animation: zaHBinky .9s cubic-bezier(.3, 1.3, .5, 1) 2; }
@keyframes zaHBinky { 45% { transform: translateY(-34px) rotate(-18deg); } }
[data-tap="snowHare"].za-hrun .za-hare { animation: zaHRun 2.2s ease-in-out; }
@keyframes zaHRun { 45% { transform: translateX(-250px); } 50% { transform: translateX(-250px) scaleX(-1); } 95% { transform: translateX(0) scaleX(-1); } 100% { transform: none; } }
[data-tap="snowHare"].za-hhide .za-hare { animation: zaHHide 3.2s ease-in-out; }
@keyframes zaHHide { 12%, 85% { opacity: .1; transform: scale(.94); } }
`,

  props: (h) => ({
    // a ribbon of the lights as a scarf, in the colour they had (arg: the palette's number)
    auroraScarf: { slot: 'body', art: (i = 0) => { const p = PAL[i] || PAL[0]; return `<g opacity=".95"><path d="M60 124 Q100 146 140 124 L143 138 Q100 162 57 138Z" fill="${p.glow}" opacity=".35" transform="translate(0 -2) scale(1 1.08)"/>
      <path d="M62 126 Q100 146 138 126 L140 137 Q100 158 60 137Z" fill="${p.s[1]}"/><path d="M64 129 Q100 148 136 129" stroke="${p.s[2]}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M118 138 Q128 160 120 190 L132 192 Q140 162 130 136Z" fill="${p.s[1]}"/><path d="M123 146 Q130 164 125 186" stroke="${p.s[2]}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M120 190 l-2 8 M125 191 l0 8 M130 192 l2 8" stroke="${p.s[0]}" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="84" cy="138" r="2" fill="#fff"/><circle cx="106" cy="142" r="1.6" fill="#fff"/><circle cx="127" cy="170" r="1.6" fill="#fff"/></g>`; } },
    // the reindeer under him (behind his picture): dir 1 faces right, -1 left
    auroraDeer: { slot: 'feet', back: true, art: (dir = 1) => `<g transform="${dir < 0 ? 'translate(200 0) scale(-1 1)' : ''}">${rideDeer}</g>` },
    auroraAntlers: { slot: 'head', art: () => `<g stroke="#D9B27C" stroke-width="6" stroke-linecap="round" fill="none"><path d="M78 46 Q66 20 48 6 M68 28 Q54 28 46 36 M60 18 Q62 4 56 -4"/>
      <path d="M122 46 Q134 20 152 6 M132 28 Q146 28 154 36 M140 18 Q138 4 144 -4"/></g>
      <g stroke="#F2D8AE" stroke-width="2" stroke-linecap="round" fill="none"><path d="M76 40 Q68 22 54 10 M124 40 Q132 22 146 10"/></g>
      <path d="M88 52 Q100 60 112 52" stroke="#E2313B" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="100" cy="58" r="5" fill="#FFD23F" stroke="#D9A400" stroke-width="1.5"/>` },
    auroraNose: { slot: 'nose', art: () => `<circle class="za-lnose" cx="100" cy="104" r="17" fill="#FF6B5A" opacity=".35"/><circle cx="100" cy="104" r="9.5" fill="#FF3B3B"/><circle cx="96.5" cy="100.5" r="3" fill="#fff" opacity=".7"/>` },
    // the fishing rod in his other paw (the ice hole is to his left)
    auroraRod: { slot: 'hand', art: () => `<g transform="translate(200 0) scale(-1 1)">${h.em(166, 128, 46, '🎣')}</g>` },
    auroraFishHand: { slot: 'hand', art: () => h.em(42, 162, 18, '🐟') },
    auroraOwlHead: { slot: 'head', art: () => h.em(100, 22, 48, '🦉') },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, nose, paw, sceneRect, pick } = k;
    const svgOf = (el) => el.ownerSVGElement || el;
    // a point of the picture (400×700) in the scene's pixels
    const pt = (el, x, y) => {
      const m = svgOf(el).getScreenCTM?.(), s = sceneRect();
      if (!m) return [x, y];
      const p = new DOMPoint(x, y).matrixTransform(m);
      return [p.x - s.left, p.y - s.top];
    };
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    // a class for a while (its animation may be on the thing's parts, so not api.hop: that one ends with the press's bounce)
    const flag = (el, cls, ms) => {
      if (!el) return;
      const t = (el._za ||= {});
      clearTimeout(t[cls]);
      el.classList.remove(cls);
      void el.getBoundingClientRect();
      el.classList.add(cls);
      t[cls] = setTimeout(() => el.classList.remove(cls), ms);
    };
    const jingle = () => [1568, 1976, 1760, 2093].forEach((fq, i) => setTimeout(() => sfx.note(fq), i * 90));
    const hum = () => { sfx.note(147); setTimeout(() => sfx.note(123), 240); };

    // ---------- the northern lights ----------
    const palOf = (el) => +(svgOf(el).dataset.zaPal || 0);
    const setPal = (el, i) => {
      const s = svgOf(el);
      s.classList.remove('za-c' + palOf(el));
      s.dataset.zaPal = i;
      if (i) s.classList.add('za-c' + i);
    };
    const glow = (a, i, ms) => { L.style.setProperty('--za-glow', PAL[i].glow); hold(a, 'za-glow', ms); };
    // the lights change colour, and Lucky glows in the new one
    const recolour = (c) => {
      const a = begin('auroraColor'), i = (palOf(c.el) + 1) % PAL.length;
      api.hop(c.el, 'za-shift', 1500);
      sfx.magic();
      at(a, 350, () => setPal(c.el, i));
      at(a, 600, () => { glow(a, i, 3200); pose('surprised', 1000, 'stretchUp', 1600); api.fxAt(...head(), ['✨'], 5, 'spark'); sfx.chime(); });
      at(a, 1500, () => { api.setTemp('happy', 2200); line('auroraColor', 1, 0); api.reward(); });
      at(a, 3900, end);
    };
    // an arctic fox runs along the snow, its tail sweeps sparks up, and the sky flares
    const foxFire = (c) => {
      const a = begin('auroraFox'), fox = svgOf(c.el).querySelector('.za-fox');
      flag(fox, 'za-run', 2700);
      sfx.whoosh();
      pose('surprised', 1800, 'tilt', 1400);
      for (let i = 1; i <= 6; i++) at(a, i * 360, () => api.fxAt(...pt(c.el, -60 + i * 69, 440), ['✨'], 2, 'spark'));
      at(a, 2300, () => { flag(c.el, 'za-flare', 1700); sfx.chime(); pose('laugh', 1600, 'binky'); line('auroraFox', 1, 0); });
      at(a, 4200, end);
    };
    R.aurora = {
      press: (c) => { sfx.note(pick([1047, 1175, 1319, 1568])); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('auroraSky', recolour, foxFire)),
      // he catches a ribbon of light, and it becomes his scarf
      double: who((c) => {
        const a = begin('auroraScarf'), i = palOf(c.el);
        pose('happy', 1500, 'stretchUp', 1600);
        sfx.magic();
        [0, 120, 240].forEach((d, n) => at(a, d, () => fly('✨', [c.x + (n - 1) * 30, c.y], api.luckyPoint(0.5, 0.62), 700, { size: 24, spin: 180 })));
        at(a, 950, () => { prop('auroraScarf', 10000, i); sfx.chime(); glow(a, i, 1800); pose('happy', 2000, 'proud', 1200); line('auroraScarf', 1, 0); api.reward(); });
        at(a, 2900, end);
      }),
      // the lights dance, changing colour, and Lucky dances with them
      long: who((c) => {
        const a = begin('auroraDance'), i0 = palOf(c.el);
        flag(c.el, 'za-dance', 5000);
        sfx.disco();
        api.setTemp('laugh', 4600);
        hold(a, 'disco', 4600);
        L.style.setProperty('--za-glow', PAL[i0].glow);
        hold(a, 'za-glow', 4800);
        line('auroraDance', 1, 0);
        for (let n = 1; n <= 6; n++) {
          at(a, n * 700, () => {
            const i = (i0 + n) % PAL.length;
            setPal(c.el, i);
            L.style.setProperty('--za-glow', PAL[i].glow);
            api.fxAt(...head(), ['✨', '🎵'], 2, 'spark');
          });
        }
        at(a, 4900, () => { pose('happy', 1600, 'bow', 1500); api.reward(); });
        at(a, 6200, end);
      }),
    };

    // ---------- the polar bear ----------
    const bearHug = (c) => {
      const a = begin('auroraHug');
      go(56, 700); // close, but not in front of him
      at(a, 750, () => { api.hop(c.el, 'za-hug', 1100); pose('happy', 2200, 'hug'); api.hearts(...head(), 5); hum(); line('auroraBearHug', 1, 0); api.reward(); });
      at(a, 2800, end);
    };
    // a big sniff… and a sneeze that blows snow all over Lucky
    const bearSneeze = (c) => {
      const a = begin('auroraSneeze');
      flag(c.el, 'za-sniffs', 900);
      sfx.sniff();
      at(a, 850, () => {
        const [x, y] = part(c, '.za-bnose'), [hx, hy] = head();
        flag(c.el, 'za-sneeze', 700);
        sfx.sneeze();
        for (let i = 0; i < 7; i++) fly('❄️', [x, y], [hx - 60 + i * 20, hy + 10 + (i % 3) * 18], 480, { size: 14 + (i % 3) * 5, spin: 120 });
      });
      at(a, 1300, () => { prop('snowcap', 3400); prop('earSnow', 3400); hold(a, 'shiver', 900); api.setTemp('surprised', 1200); sfx.puff(); });
      at(a, 2300, () => { api.setTemp('laugh', 1600); line('auroraBearSneeze', 1, 0); });
      at(a, 3500, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); unprop('earsnow'); });
      at(a, 4600, end);
    };
    R.polarBear = {
      press: (c) => { sfx.puff(); api.fxAt(c.x, c.y, ['❄️'], 2, 'spark'); },
      tap: who(oneOf('auroraBear', bearHug, bearSneeze)),
      // the bear rolls a snowball over, it grows on the way; Lucky kicks it back, bigger still
      double: who((c) => {
        const a = begin('auroraSnowball'), [bx, by] = part(c, '.za-bpaw'), to = api.luckyPoint(0.98, 0.86);
        api.hop(c.el, 'za-hug', 1100);
        sfx.puff();
        const b1 = fly('⚪', [bx, by], to, 1000, { spin: -540, size: 18 });
        b1.animate([{ fontSize: '18px' }, { fontSize: '40px' }], { duration: 1000, fill: 'forwards' });
        at(a, 900, () => { pose('laugh', 1300, 'kick', 1000); line('auroraSnowball', 1, 0); });
        at(a, 1300, () => {
          sfx.whoosh();
          const b2 = fly('⚪', to, [bx, by - 30], 900, { spin: 540, size: 40, arc: 30 });
          b2.animate([{ fontSize: '40px' }, { fontSize: '64px' }], { duration: 900, fill: 'forwards' });
        });
        at(a, 2200, () => { sfx.puff(); api.hop(c.el, 'za-hug', 1100); api.fxAt(bx, by - 40, ['❄️'], 8, 'spark'); hum(); pose('laugh', 1500, 'clap'); api.reward(); });
        at(a, 3300, end);
      }),
      // the bear dozes off and Lucky snuggles up to him
      long: who((c) => {
        const a = begin('auroraNap'), [x, y] = part(c, '.za-bhead');
        go(56, 700);
        at(a, 600, () => { flag(c.el, 'za-nap', 4300); sfx.yawn(); });
        at(a, 1200, () => { pose('sleep', 3000, 'loaf', 2600); sfx.sleep(); line('auroraBearNap', 1, 0); });
        [1400, 2600, 3800].forEach((d) => at(a, d, () => popUp('💤', x - 20, y - 26, 1300, 22, 'pop-rise')));
        at(a, 4500, () => { pose('happy', 1600, 'stretchUp', 1600); api.hearts(...head(), 4); api.reward(); });
        at(a, 5600, end);
      }),
    };

    // ---------- the ice hole ----------
    const CATCH = [['🐟', 'auroraFish'], ['👢', 'auroraBoot'], ['🧤', 'auroraMitten'], ['🦀', 'auroraCrab']];
    let lastCatch = '';
    const fishing = (c) => {
      const a = begin('auroraFishing'), [x, y] = part(c, '.za-hole');
      go(nextTo(c.el, 22), 700);
      at(a, 750, () => { prop('auroraRod', 4400); api.setTemp('happy', 1800); line('auroraFishStart', 1, 0); });
      at(a, 1300, () => popUp('🔴', x, y, 1500, 14, 'bobber'));
      at(a, 2800, () => {
        let it;
        do it = pick(CATCH); while (it[0] === lastCatch);
        lastCatch = it[0];
        sfx.splash();
        api.fxAt(x, y, ['💦', '❄️'], 4, 'spark');
        popUp(it[0], x, y - 24, 2200, 42, 'pop-rise');
        pose(it[0] === '🦀' ? 'surprised' : 'laugh', 1800, 'bigjump', 1100);
        line(it[1], 1, 0);
        if (it[0] === '🐟') api.reward();
      });
      at(a, 5000, end);
    };
    // someone comes up for air: a seal, or now and then a penguin who is very lost
    const comeUp = (c) => {
      const [x, y] = part(c, '.za-hole'), lost = Math.random() < 0.3;
      sfx.splash();
      api.fxAt(x, y, ['💦'], 4, 'spark');
      popUp(lost ? '🐧' : '🦭', x, y - 6, 2800, 44, 'pop-rise');
      setTimeout(() => (lost ? sfx.squeak() : sfx.bark()), 500);
      pose('surprised', 1200, 'startle', 1100);
      setTimeout(() => { if (!api.free()) return; pose(lost ? 'laugh' : 'happy', 1600, 'wave', 1200); line(lost ? 'auroraPenguin' : 'auroraSeal', 1); }, 800);
    };
    R.iceHole = {
      press: (c) => { sfx.splash(); api.floatFx(c.x, c.y, '', 'ripple'); },
      tap: who(oneOf('auroraHole', fishing, comeUp)),
      // a fish leaps out and dives back in
      double: (c) => {
        const [x, y] = part(c, '.za-hole');
        sfx.splash();
        fly('🐟', [x - 14, y], [x + 14, y], 1000, { arc: 130, spin: 300, size: 30 });
        setTimeout(() => { sfx.splash(); api.fxAt(x, y, ['💦'], 5, 'spark'); }, 1000);
        if (api.free()) { pose('surprised', 1200, 'startle', 1100); setTimeout(() => { if (api.free()) { pose('laugh', 1400, 'clap'); line('auroraFishJump', 1); } }, 1000); }
      },
      // the big pull… for the tiniest fish
      long: who((c) => {
        const a = begin('auroraBigFish'), [x, y] = part(c, '.za-hole');
        go(nextTo(c.el, 22), 700);
        at(a, 750, () => { prop('auroraRod', 2400); hold(a, 'strain', 2000); api.setTemp('sad', 2000); line('auroraBigPull', 1, 0); });
        [900, 1500, 2100].forEach((d) => at(a, d, () => { sfx.splash(); api.fxAt(x, y, ['💦'], 3, 'spark'); }));
        at(a, 2800, () => { sfx.pop(); prop('auroraFishHand', 2600); api.fxAt(x, y, ['💦'], 3, 'spark'); pose('surprised', 1200, 'startle', 1100); });
        at(a, 3800, () => { api.setTemp('laugh', 1800); line('auroraTiny', 1, 0); api.reward(); });
        at(a, 5300, () => { unprop('hand', true); fly('🐟', api.luckyPoint(0.21, 0.77), [x, y], 600, { arc: 50, spin: 200, size: 14 }); });
        at(a, 5900, () => { sfx.splash(); end(); });
      }),
    };

    // ---------- the reindeer ----------
    const ride = (c) => {
      const a = begin('auroraRide');
      go(nextTo(c.el, 24), 700);
      at(a, 750, () => {
        c.el.classList.add('za-away');
        onEnd(a, () => c.el.classList.remove('za-away'));
        prop('auroraDeer', 3800);
        hold(a, 'za-ride', 3600);
        jingle();
        api.setTemp('laugh', 3400);
        line('auroraRide', 1, 0);
      });
      at(a, 1100, () => { go(70, 1300); sfx.gallop(); });
      at(a, 1900, jingle);
      at(a, 2500, () => { prop('auroraDeer', 2000, -1); go(44, 1200); sfx.gallop(); });
      at(a, 4300, () => { unprop('feet'); c.el.classList.remove('za-away'); pose('happy', 1500, 'proud', 1200); jingle(); api.reward(); });
      at(a, 5300, end);
    };
    // the reindeer's nose lights up… and Lucky's own nose catches the glow
    const noseGlow = (c) => {
      const a = begin('auroraNose');
      flag(c.el, 'za-noseglow', 4200);
      sfx.magic();
      pose('surprised', 1000, 'tilt', 1400);
      at(a, 900, () => { pose('happy', 1000, 'boop', 700); sfx.squeak(); });
      at(a, 1400, () => { prop('auroraNose', 6000); sfx.chime(); api.fxAt(...nose(), ['✨'], 4, 'spark'); pose('laugh', 1800, 'proud', 1200); line('auroraNose', 1, 0); });
      at(a, 3200, end);
    };
    R.reindeer = {
      press: (c) => { jingle(); flag(c.el, 'za-jingle', 1000); },
      tap: who(oneOf('auroraDeer', ride, noseGlow)),
      // a carrot for the reindeer (Lucky's own, so it's a big deal)
      double: who((c) => {
        const a = begin('auroraTreat');
        pose('happy', 1000, 'throw', 600);
        at(a, 200, () => fly('🥕', api.luckyPoint(0.22, 0.76), part(c, '.za-dmouth'), 700, { arc: 60, spin: -200, size: 24 }));
        at(a, 900, () => { flag(c.el, 'za-munch', 1300); sfx.crunch(); const [x, y] = part(c, '.za-dmouth'); api.hearts(x, y - 10, 3); });
        at(a, 1300, () => { pose('happy', 1800, 'clap'); line('auroraCarrot', 1, 0); api.reward(); });
        at(a, 2900, end);
      }),
      // antlers and a bell for Lucky: now he's a reindeer too
      long: who((c) => {
        const a = begin('auroraAntlers');
        prop('auroraAntlers', 9000);
        jingle();
        flag(c.el, 'za-jingle', 1000);
        pose('happy', 1600, 'proud', 1200);
        line('auroraAntlers', 1, 0);
        at(a, 1300, () => { pose('laugh', 1800, 'hop'); jingle(); });
        at(a, 1900, () => api.hop(L, 'hop'));
        at(a, 2600, () => { api.reward(); end(); });
      }),
    };

    // ---------- the arctic hare, Lucky's snow-white cousin ----------
    const hareBoop = (c) => {
      const a = begin('auroraHare');
      go(nextTo(c.el, 18), 700);
      at(a, 750, () => { flag(c.el, 'za-hboop', 1300); pose('happy', 1800, 'boop', 700); sfx.kiss(); });
      at(a, 1200, () => { api.hearts(...head(), 4); line('auroraHareBoop', 1, 0); api.reward(); });
      at(a, 2800, end);
    };
    const hareBinky = (c) => {
      flag(c.el, 'za-hbinky', 1900);
      sfx.boing();
      pose('laugh', 1800, 'binky');
      setTimeout(() => { if (!api.free()) return; sfx.sparkle(); pose('laugh', 1500, 'binky'); line('auroraHareBinky', 1); }, 900);
    };
    R.snowHare = {
      press: (c) => { sfx.thump(); api.fxAt(c.x, c.y + 10, ['❄️'], 2, 'spark'); },
      tap: who(oneOf('auroraHare', hareBoop, hareBinky)),
      // a race: the hare dashes across the snow and back, Lucky zooms around
      double: who((c) => {
        const a = begin('auroraHareRace');
        flag(c.el, 'za-hrun', 2300);
        sfx.whoosh();
        pose('laugh', 2200, 'zoom', 2200);
        at(a, 400, () => line('auroraHareRace', 1));
        at(a, 2400, end);
      }),
      // white on white: the hare disappears against the snow
      long: who((c) => {
        const a = begin('auroraHareHide');
        flag(c.el, 'za-hhide', 3300);
        sfx.whoosh();
        at(a, 500, () => { pose('surprised', 2200, 'tilt', 1400); line('auroraHareHide', 1, 0); });
        at(a, 3200, () => { sfx.thump(); pose('laugh', 1500, 'binky'); api.fxAt(...centerOf(c.el), ['❄️', '✨'], 5, 'spark'); api.reward(); });
        at(a, 4300, end);
      }),
    };
  },

  visitors: [
    { e: '🦉', w: 2, path: 'glide', end: ['owl', 'auroraOwl'], flip: true },
    { e: '❄️', w: 3, path: 'fall', end: ['tongue', 'flakes'] },
    { e: '🌠', w: 1, path: 'streak', end: ['wish', 'starhead'] },
  ],
  endings: (k) => ({
    // the owl lands on his head for a moment
    auroraOwl: (a, x, y) => {
      const { at, fly, prop, unprop, pose, sfx, line, head, sceneRect } = k;
      fly('🦉', [x, y], head(), 800, { arc: 50, size: 40 });
      at(a, 800, () => { prop('auroraOwlHead', 2800); sfx.note(330); setTimeout(() => sfx.note(294), 450); pose('surprised', 2600, 'balance', 2600); line('auroraOwl', 1, 0); });
      at(a, 3600, () => { unprop('head', true); fly('🦉', head(), [sceneRect().width + 40, 30], 1100, { arc: 60, size: 40 }); k.api.setTemp('laugh', 1400); });
    },
  }),
};
