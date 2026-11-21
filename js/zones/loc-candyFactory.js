// The candy land's second place: the sweet factory. A chocolate river with a little waterfall (and a chocolate boat),
// a cupcake house with a gingerbread man inside, gummy bears that wobble and dance, an ice-cream machine and a conveyor
// belt of sweets. Lucky is a bunny: sweets are for looking at and laughing at (and the factory's carrot sweet is just
// a carrot).

// a gummy bear standing on (0, 0), about 42 tall
const bear = (c, d) => `<g opacity=".93"><circle cx="-7" cy="-37" r="4.6" fill="${c}"/><circle cx="7" cy="-37" r="4.6" fill="${c}"/>
  <ellipse cx="-11" cy="-17" rx="4" ry="6.5" fill="${c}" transform="rotate(28 -11 -17)"/><ellipse cx="11" cy="-17" rx="4" ry="6.5" fill="${c}" transform="rotate(-28 11 -17)"/>
  <ellipse cy="-13" rx="11" ry="12" fill="${c}"/><ellipse cx="-6" cy="-3" rx="5.5" ry="4" fill="${c}"/><ellipse cx="6" cy="-3" rx="5.5" ry="4" fill="${c}"/><circle cy="-29" r="10" fill="${c}"/></g>
  <ellipse cy="-12" rx="6" ry="7" fill="#fff" opacity=".2"/><ellipse cy="-26" rx="4.4" ry="3.2" fill="#fff" opacity=".3"/>
  <circle cx="-3.6" cy="-31" r="1.5" fill="${d}"/><circle cx="3.6" cy="-31" r="1.5" fill="${d}"/><ellipse cy="-27.5" rx="1.7" ry="1.2" fill="${d}"/>
  <path d="M-6 -35 q3 -4 7 -3.5 M-8 -18 q-1.5 5 .5 9" stroke="#fff" stroke-width="1.9" fill="none" stroke-linecap="round" opacity=".65"/>`;
const BEARS = { b1: ['#5FD068', '#2F8A3A'], b2: ['#FF5A76', '#B8233A'], b3: ['#FFB52E', '#B87A0C'] };
const SPRINKLE = ['#FF5FA2', '#FFD23F', '#6FD3FF', '#7BD88F', '#B78CFF', '#FF9F43'];
const sprinkle = (x, y, r, i) => `<rect x="${x - 4}" y="${y - 1.3}" width="8" height="2.6" rx="1.3" fill="${SPRINKLE[i % SPRINKLE.length]}" transform="rotate(${r} ${x} ${y})"/>`;

// the sweets riding the belt (small, sitting on its top at y 663)
const wrapped = (x, c, ends = c) => `<g transform="translate(${x} 657) scale(1.2)"><path d="M-10.5 -4 l5 4 -5 4z M10.5 -4 l-5 4 5 4z" fill="${ends}"/><ellipse rx="6.5" ry="5" fill="${c}"/><path d="M-2 -3 q2 3 0 6" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/></g>`;
const ON_BELT = [
  (x) => wrapped(x, '#FF5FA2'),
  (x) => `<g transform="translate(${x} 658) scale(1.2)"><ellipse rx="8" ry="5" fill="#E8A866"/><ellipse cy="-1.2" rx="7" ry="4" fill="#FF8CC6"/><ellipse cy="-1.2" rx="2.4" ry="1.3" fill="#C98E5A"/><path d="M-4 -3 l1.4 .8 M3 -3.2 l-1 1.2 M1 1 l1.4 .2" stroke="#fff" stroke-width="1"/></g>`,
  (x) => `<g transform="translate(${x} 658) scale(1.2)"><rect x="-7" y="-5" width="14" height="10" rx="1.5" fill="#6B3E22"/><path d="M-7 0 h14 M0 -5 v10" stroke="#5A321C" stroke-width="1.2"/><path d="M-5 -3.4 h3" stroke="#9C6646" stroke-width="1.2"/></g>`,
  (x) => `<g transform="translate(${x} 657) scale(1.2)"><ellipse cy="-3" rx="7" ry="3.2" fill="#9EE8C8"/><rect x="-6.5" y="-1.4" width="13" height="2.6" fill="#FFF4FA"/><ellipse cy="2.6" rx="7" ry="3.2" fill="#9EE8C8"/></g>`,
  (x) => wrapped(x, '#FF9F43', '#4CB84C'), // the carrot sweet
  (x) => `<g transform="translate(${x} 659) scale(1.2)"><path d="M0 2 H13" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="-4" cy="-1" r="6" fill="#9B7BFF"/><path d="M-4 -1 m-3 0 a3 3 0 1 1 3 3" stroke="#fff" stroke-width="1.5" fill="none"/></g>`,
  (x) => `<g transform="translate(${x} 657) scale(1.2)"><ellipse cy="-3" rx="7" ry="3.2" fill="#FFB3D6"/><rect x="-6.5" y="-1.4" width="13" height="2.6" fill="#FFF4FA"/><ellipse cy="2.6" rx="7" ry="3.2" fill="#FFB3D6"/></g>`,
  (x) => wrapped(x, '#B78CFF'),
];

export default {
  id: 'candyFactory',
  world: 'candy',
  name: ['Конфетная фабрика', 'The sweet factory'],
  spots: { L: [40, 470], R: [370, 480], l: [22, 652], r: [384, 652], sky: 300 },
  arrive: [
    ['Конфетная фабрика! Тут пахнет шоколадом и ванилью.', 'The sweet factory! It smells of chocolate and vanilla.'],
    ['Фабрика сладостей! Я только посмотреть, честное кроличье.', "A sweet factory! I'm only here to look, bunny's honour."],
  ],

  lines: {
    candyFactoryBoat: [['Шоколадный кораблик поплыл! Капитан, только не растай.', 'The chocolate boat is off! Captain, try not to melt.'],
      ['Плыви, кораблик! Шоколадная река — самая сладкая на свете.', 'Sail on, little boat! A chocolate river is the sweetest river in the world.'],
      ['Шоколад делают из какао-бобов. Они растут на деревьях, в больших стручках!', 'Chocolate is made from cocoa beans. They grow on trees, in big pods!']],
    candyFactoryBerry: [['Клубника в шоколаде — это тебе! Кроликам шоколад нельзя, я только понюхаю.', "A chocolate strawberry, for you! Bunnies can't have chocolate, I'll just sniff it."],
      ['Макаю клубничку в шоколад… Готово! Угощайся, а я посмотрю.', "Dipping a strawberry in chocolate… done! Help yourself, I'll just watch."]],
    candyFactorySplash: [['Плюх! У меня на носу шоколадная веснушка!', 'Splash! I got a chocolate freckle on my nose!']],
    candyFactoryRide: [['Плыву на шоколадной лодке! Гребу потихоньку, а то растает.', "Sailing a chocolate boat! Rowing gently, or it'll melt."]],
    candyFactorySprinkles: [['Дождик из посыпки! Я теперь кролик с посыпкой.', "It's raining sprinkles! I'm a sprinkled bunny now."],
      ['Разноцветная посыпка! Ловлю её ушами.', 'Rainbow sprinkles! Catching them with my ears.']],
    candyFactoryDoor: [['Тук-тук! В кексе живёт пряничный человечек. Привет, сосед!', 'Knock-knock! A gingerbread man lives in the cupcake. Hi, neighbour!'],
      ['Дверка открылась! Пряничный человечек машет нам.', 'The little door opened! The gingerbread man is waving at us.']],
    candyFactoryCherry: [['Вишенка на макушке! Теперь я тоже кекс.', "A cherry on top! Now I'm a cupcake too."]],
    candyFactoryWobble: [['Мармеладные мишки дрожат, как желе. Потому что они и есть желе!', 'Gummy bears wobble like jelly. Because they are jelly!'],
      ['Дрожь-дрожь! Смотри, я тоже так умею.', 'Wibble-wobble! Look, I can do it too.']],
    candyFactoryDance: [['Мишки танцуют! Лапку влево, лапку вправо!', 'The gummy bears are dancing! Left paw, right paw!'],
      ['Мармеладная дискотека! Танцуют все!', 'A gummy bear disco! Everybody dance!'],
      ['Самых первых мармеладных мишек так и звали: танцующие мишки!', 'The very first gummy bears were called dancing bears!']],
    candyFactoryGummyHead: [['Мишка запрыгнул мне на голову! Липкий, но очень дружелюбный.', 'A gummy bear jumped on my head! Sticky, but very friendly.']],
    candyFactoryHighFive: [['Дай пять! Ой, лапа прилипла. Мишки очень липкие друзья.', 'High five! Oops, my paw is stuck. Gummy bears are sticky friends.']],
    candyFactoryCone: [['Ж-ж-ж! Машина наполняет рожок. Клубничное, ванильное… морковное?', 'Whirr! The machine is filling a cone. Strawberry, vanilla… carrot?'],
      ['Рожок с горкой — это тебе! А я посмотрю.', "A cone piled high, just for you! I'll just watch."]],
    candyFactoryScoop: [['Плюх! Шарик мороженого прямо на голову! Очень холодная шапка.', 'Plop! A scoop right on my head! A very cold hat.'],
      ['Ой! Мороженое приземлилось на меня. Брр, уши мёрзнут!', 'Oops! The ice cream landed on me. Brr, my ears are freezing!']],
    candyFactoryCarrot: [['Морковное мороженое — для кроликов! Шучу, я только посмотрю.', "Carrot ice cream, just for bunnies! Joking, I'll only look."]],
    candyFactoryLever: [['Я дёрнул большой рычаг! Мороженое для всего класса! По одному, ладно?', 'I pulled the big lever! Ice cream for the whole class! One each, OK?']],
    candyFactoryCatch: [['Не та, не та… морковная! Поймал!', 'Not that one, not that one… the carrot one! Got it!'],
      ['Морковная конфета? Да это же просто морковка! Ещё лучше.', "A carrot sweet? It's just a carrot! Even better."]],
    candyFactoryFast: [['Лента едет слишком быстро! Ловлю, ловлю…', 'The belt is going too fast! Catch them, catch them…']],
    candyFactoryFastEnd: [['Уф! Пусть конфеты едут мимо. Сладкое — это угощение, а не обед.', 'Phew! Let the sweets ride by. Sweets are a treat, not lunch.']],
    candyFactoryCheck: [['Проверка качества: леденец идеальный! Одобрено.', 'Quality check: this lolly is perfect! Approved.']],
    candyFactoryBeltRide: [['Я еду по ленте! Я теперь конфета? Завяжите мне бантик!', "I'm riding the belt! Am I a sweet now? Tie a bow on me!"]],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C7B4FF"/><stop offset=".8" stop-color="#FFC6E6"/></linearGradient>
<linearGradient id="${u}c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A86E48"/><stop offset=".5" stop-color="#B98257"/><stop offset="1" stop-color="#9A6240"/></linearGradient>
<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E4126"/><stop offset="1" stop-color="#7E4C2E"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
${[[279, 232], [140, 276], [279, 318], [62, 282], [150, 212]].map(([x, y], i) => `<path class="twinkle t${i % 3}" d="M${x} ${y - 9} l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#fff"/>`).join('')}
<g class="lcf-smoke amb"><circle cx="112" cy="246" r="8" fill="#FFF3FA"/><circle cx="119" cy="236" r="10" fill="#FFF3FA"/><circle cx="110" cy="225" r="7" fill="#FFF3FA"/></g>
<g class="lcf-smoke s2 amb"><circle cx="28" cy="262" r="7" fill="#FFF3FA"/><circle cx="34" cy="252" r="9" fill="#FFF3FA"/><circle cx="26" cy="242" r="6" fill="#FFF3FA"/></g>
<rect x="103" y="262" width="18" height="44" fill="#fff"/>${[268, 284].map((y) => `<rect x="103" y="${y}" width="18" height="7" fill="#FF7AB8"/>`).join('')}<rect x="99" y="256" width="26" height="8" rx="3" fill="#FF5FA2"/>
<rect x="20" y="276" width="15" height="30" fill="#fff"/>${[282, 296].map((y) => `<rect x="20" y="${y}" width="15" height="6" fill="#9B7BFF"/>`).join('')}<rect x="16" y="270" width="23" height="8" rx="3" fill="#8B6CFF"/>
<rect x="-8" y="308" width="154" height="112" rx="8" fill="#FFE3F1"/><rect x="132" y="314" width="12" height="104" rx="5" fill="#FFD3EA"/>
<path d="M-10 314 V308 Q-10 301 -2 301 H142 Q150 301 150 308 V314 ${[7, 11, 6, 10, 8, 12, 7, 10, 6, 9].map((d) => `a8 ${d} 0 0 1 -16 0`).join(' ')}Z" fill="#FF8CC6"/>
<path d="M2 306 H138" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
<g class="lcf-wheel amb"><circle cx="24" cy="348" r="13" fill="#fff"/><path d="M24 348 m-8.5 0 a8.5 8.5 0 1 1 8.5 8.5 a5 5 0 1 1 -5 -5" stroke="#FF5FA2" stroke-width="3" fill="none" stroke-linecap="round"/></g>
${[84, 112].map((x) => `<path d="M${x} 366 V348 a9 9 0 0 1 18 0 V366Z" fill="#BFE9FF" stroke="#fff" stroke-width="3"/><path d="M${x + 4} 350 q2 -4 5 -5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/>`).join('')}
<path d="M92 406 V390 a15 15 0 0 1 30 0 V406Z" fill="#A0643E" stroke="#fff" stroke-width="3"/><path d="M107 376 V406" stroke="#8C5A3C" stroke-width="2"/>
<path d="M144 356 H306" stroke="#9EE8C8" stroke-width="10"/>${[146, 252, 288].map((x) => `<rect x="${x}" y="349" width="6" height="14" rx="2" fill="#6FD3B0"/>`).join('')}
<circle cx="57" cy="346" r="9" fill="#FF7AB8"/><path d="M57 348 V372" stroke="#FF9EC7" stroke-width="14"/><rect x="50" y="356" width="14" height="4" fill="#fff"/><rect x="47" y="370" width="20" height="8" rx="3" fill="#FF7AB8"/>
<path d="M0 414 Q70 396 140 406 T280 400 T400 396 V700 H0Z" fill="#F4B8E4"/>
<g data-tap="factoryCupcake"><g transform="translate(0 8)"><rect x="150" y="194" width="114" height="210" fill="transparent"/>
  <ellipse cx="207" cy="402" rx="50" ry="6" fill="#000" opacity=".12"/>
  <path d="M160 306 H254 L246 400 H168Z" fill="#FF7AB8"/><path d="${[[175, 177], [191, 192], [207, 207], [223, 222], [239, 237]].map(([a, b]) => `M${a} 306 L${b} 400`).join(' ')}" stroke="#FF5FA2" stroke-width="3.4"/>
  ${[178, 236].map((x) => `<circle cx="${x}" cy="342" r="7" fill="#FFF3A8" stroke="#fff" stroke-width="2.4"/><path d="M${x} 335 v14 M${x - 7} 342 h14" stroke="#fff" stroke-width="1.4"/>`).join('')}
  <path d="M193 400 V376 a14 14 0 0 1 28 0 V400Z" fill="#5A321C"/>
  <g class="lcf-ginger"><circle cx="207" cy="374" r="6.5" fill="#D9A066"/><path d="M201 381 h12 l1.5 14 h-4.5 l-1.5 -6 h-3 l-1.5 6 h-4.5z" fill="#D9A066"/>
    <path d="M201 383 l-6 4" stroke="#D9A066" stroke-width="3.6" stroke-linecap="round"/><path class="lcf-arm" d="M213 383 l7 -6" stroke="#D9A066" stroke-width="3.6" stroke-linecap="round"/>
    <circle cx="204.8" cy="373" r="1.2" fill="#3A2216"/><circle cx="209.2" cy="373" r="1.2" fill="#3A2216"/><path d="M204.5 377 q2.5 2 5 0" stroke="#fff" stroke-width="1.1" fill="none"/>
    <circle cx="207" cy="385" r="1.2" fill="#fff"/><circle cx="207" cy="390" r="1.2" fill="#fff"/></g>
  <g class="lcf-door"><path d="M193 400 V376 a14 14 0 0 1 28 0 V400Z" fill="#A0643E"/><path d="M207 362 V400" stroke="#8C5A3C" stroke-width="2"/><circle cx="215" cy="385" r="2.2" fill="#FFD23F"/></g>
  <g class="lcf-top"><path d="M154 310 Q152 286 172 282 H242 Q262 286 260 310 Q252 320 244 310 Q236 322 228 310 Q220 320 212 310 Q204 322 196 310 Q188 320 180 310 Q172 322 164 310 Q158 318 154 310Z" fill="#FFF4FA"/>
    <ellipse cx="207" cy="278" rx="46" ry="15" fill="#FFD6EA"/><ellipse cx="207" cy="258" rx="35" ry="13" fill="#FFC2E0"/><path d="M184 254 Q207 214 230 254Z" fill="#FFB0D6"/>
    ${[176, 238].map((x) => `<circle cx="${x}" cy="298" r="6.4" fill="#FFF3A8" stroke="#fff" stroke-width="2.2"/><path d="M${x} 292 v12 M${x - 6} 298 h12" stroke="#fff" stroke-width="1.3"/>`).join('')}
    ${[[190, 274, 30], [222, 270, -40], [205, 250, 70], [172, 280, -20], [242, 280, 50], [214, 288, 10], [196, 262, -60], [220, 256, 20], [186, 290, 40], [230, 292, -30], [207, 240, 80]].map(([x, y, r], i) => sprinkle(x, y, r, i)).join('')}
    <path d="M184 266 q8 -12 22 -13" stroke="#fff" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/></g>
  <g class="lcf-cherry"><path d="M207 222 q3 -14 14 -18" stroke="#4E9A3E" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="207" cy="230" r="10" fill="#E8313B"/><circle cx="203.5" cy="226.5" r="3" fill="#fff" opacity=".75"/></g>
  <g class="lcf-rain">${Array.from({ length: 18 }, (_, i) => sprinkle(156 + ((i * 37) % 104), 214 + ((i * 23) % 80), (i * 47) % 180, i)).join('')}</g></g></g>
<g data-tap="factoryIceCream"><rect x="294" y="200" width="106" height="206" fill="transparent"/>
  <ellipse cx="348" cy="405" rx="44" ry="5" fill="#000" opacity=".12"/>
  <g class="lcf-body"><rect x="314" y="380" width="10" height="24" rx="3" fill="#C9A0D9"/><rect x="372" y="380" width="10" height="24" rx="3" fill="#C9A0D9"/><path d="M319 396 H377" stroke="#C9A0D9" stroke-width="4"/>
    <rect x="304" y="268" width="88" height="118" rx="16" fill="#FFF6FB"/><rect x="380" y="278" width="8" height="100" rx="4" fill="#FBE0EE"/>
    <path d="M304 284 V280 Q304 268 320 268 H376 Q392 268 392 280 V284 ${[5, 8, 4, 7, 5, 8, 4, 6, 5, 7].map((d) => `a4.4 ${d} 0 0 1 -8.8 0`).join(' ')}Z" fill="#FF8CC6"/>
    ${[[322, '#FF9EC7'], [348, '#FFF1C1'], [374, '#9EE8C8']].map(([x, c]) => `<rect x="${x - 6}" y="290" width="12" height="5" rx="2" fill="#E6D6F0"/><circle cx="${x}" cy="304" r="9.5" fill="${c}"/><path d="M${x - 5} 300 q3 -4 7 -3" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')}
    <rect x="310" y="320" width="34" height="14" rx="5" fill="#F3E6FA"/><circle cx="317" cy="327" r="3.2" fill="#FF5FA2"/><circle cx="327" cy="327" r="3.2" fill="#FFD23F"/><circle class="lcf-light amb" cx="337" cy="327" r="3.2" fill="#7BD88F"/>
    <circle cx="326" cy="352" r="7" fill="#F3E6FA"/><path d="M326 352 l4 -3" stroke="#FF5FA2" stroke-width="2" stroke-linecap="round"/><path d="M326 378 c-7 -5 -5 -13 0 -9 c5 -4 7 4 0 9z" fill="#FF7AB8"/>
    <g class="lcf-nozzle"><rect x="350" y="318" width="22" height="8" rx="3" fill="#FF8CC6"/><path d="M355 326 H367 L364 338 H358Z" fill="#E6D6F0"/></g>
    <rect class="lcf-pour" x="359.5" y="338" width="3" height="16" rx="1.5" fill="#FF9EC7"/>
    <g class="lcf-cone"><path d="M350 356 H372 L361 382Z" fill="#F2C27B"/><path d="M354 362 l11 9 M358 358 l10 8 M368 362 l-11 9 M364 358 l-10 8" stroke="#D9A35A" stroke-width="1.3"/></g>
    <g class="lcf-swirl"><path d="M348 358 Q347 346 361 345 Q375 346 374 358Z" fill="#FF9EC7"/><path d="M352 347 Q361 334 370 347Z" fill="#FFB3D6"/><path d="M356 338 Q361 328 366 338Z" fill="#FF9EC7"/><path d="M353 353 q4 -4 9 -4" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/></g>
    <path d="M349 370 H373" stroke="#E6D6F0" stroke-width="4" stroke-linecap="round"/></g>
  <g class="lcf-lever"><path d="M388 300 L394 278" stroke="#B9A8F0" stroke-width="4" stroke-linecap="round"/><circle cx="394.5" cy="275" r="4.5" fill="#FF5FA2"/></g>
  <path d="M334 246 H362 L348 270Z" fill="#F2C27B"/><path d="M338 252 l12 10 M344 248 l10 8 M358 252 l-12 10 M352 248 l-10 8" stroke="#D9A35A" stroke-width="1.4"/>
  <circle cx="348" cy="236" r="15" fill="#FF9EC7"/><circle cx="348" cy="218" r="11" fill="#9EE8C8"/><circle cx="349" cy="205" r="4.5" fill="#E8313B"/><path d="M339 231 q4 -6 10 -6 M342 215 q3 -4 7 -4" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></g>
<path d="M0 450 Q110 428 210 446 T400 438 V700 H0Z" fill="#FFA6D5"/>
<path d="M0 548 Q200 520 400 552 V700 H0Z" fill="#FF8CC6"/>
<path d="M0 618 Q200 596 400 620 V700 H0Z" fill="#FF77BA"/>
${[[140, 470, '#fff'], [258, 478, '#FFE66D'], [204, 462, '#C7B4FF'], [118, 590, '#FFE66D'], [300, 580, '#fff'], [120, 640, '#C7B4FF'], [292, 646, '#FFE66D'], [380, 456, '#fff']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${c}"/>`).join('')}
${[[338, 520, '#9B7BFF'], [376, 530, '#7BD88F'], [356, 512, '#FF5FA2']].map(([x, y, c]) => `<path d="M${x - 9} ${y} q9 -22 18 0z" fill="${c}"/><path d="M${x - 3} ${y - 10} q2 -4 5 -5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`).join('')}
<g data-tap="factoryRiver"><rect x="0" y="372" width="96" height="292" fill="transparent"/>
  <path class="lcf-pool" d="M34 494 H80 C90 520 76 548 84 578 C90 604 96 630 100 664 H0 V592 C14 578 22 554 24 534 C26 514 28 504 34 494Z" fill="url(#${u}p)"/>
  <path d="M80 494 C90 520 76 548 84 578 C90 604 96 630 100 664 M0 592 C14 578 22 554 24 534 C26 514 28 504 34 494" stroke="#FFD0E8" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M42 512 C50 540 40 570 50 600 C58 626 62 646 66 664" stroke="#B57C52" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
  <g class="lcf-ripples amb" stroke="#C08A5E" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M52 528 q8 -4 16 0"/><path d="M14 620 q10 -4 20 0"/><path d="M66 632 q10 -4 20 0"/><path d="M32 560 q7 -3 14 0"/></g>
  <ellipse cx="74" cy="648" rx="10" ry="2.6" fill="#fff" opacity=".2"/><ellipse cx="22" cy="642" rx="8" ry="2.2" fill="#fff" opacity=".2"/>
  <path class="lcf-stream" d="M50 378 H66 C68 410 66 440 69 468 C70 482 72 492 74 502 H40 C42 490 44 480 46 468 C48 440 48 410 50 378Z" fill="url(#${u}c)"/>
  <path class="lcf-flow amb" d="M54 382 C54 420 52 460 47 498 M62 382 C62 420 63 460 67 498" stroke="#D9A274" stroke-width="2.2" stroke-dasharray="12 10" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M51 388 C50 420 49 450 46 480" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".3"/>
  <g class="lcf-splash"><ellipse cx="57" cy="503" rx="25" ry="7" fill="#A8754F"/><g fill="#FFF3E0"><circle cx="38" cy="500" r="5"/><circle cx="48" cy="504" r="5.5"/><circle cx="62" cy="505" r="5"/><circle cx="75" cy="500" r="4.4"/><circle cx="56" cy="496" r="3.6"/><circle cx="44" cy="492" r="2.2"/><circle cx="70" cy="491" r="2"/></g></g>
  <g class="lcf-boatwrap"><g class="lcf-boat amb"><path d="M16 596 Q42 618 68 596 L63 590 H21Z" fill="#5E3620"/><path d="M21 590 H63" stroke="#9C6646" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M31 594 v9 M42 594 v11 M53 594 v9" stroke="#4A2A18" stroke-width="1.8"/><path d="M42 590 V562" stroke="#F2C27B" stroke-width="2.6"/>
    <path d="M44 565 L61 586 H44Z" fill="#F2C27B"/><path d="M47 572 l6 8 M44 578 l4 5" stroke="#D9A35A" stroke-width="1.1"/><path d="M42 562 l-11 3.5 11 3.5z" fill="#FF5FA2"/></g></g></g>
<g data-tap="factoryGummies"><rect x="324" y="540" width="76" height="124" fill="transparent"/>
  <ellipse cx="362" cy="660" rx="38" ry="5" fill="#000" opacity=".12"/>
  <rect x="343" y="598" width="38" height="22" rx="9" fill="#FFF4FA"/><ellipse cx="362" cy="600" rx="19" ry="5" fill="#fff"/><path d="M348 610 q14 4 28 0" stroke="#FFC2E0" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${[['b1', 362, 600], ['b2', 344, 654], ['b3', 382, 656]].map(([b, x, y]) => `<g transform="translate(${x} ${y}) scale(1.1)"><g class="lcf-bear ${b}"><g class="lcf-idle amb">${bear(...BEARS[b])}</g></g></g>`).join('')}</g>
<g data-tap="factoryBelt"><rect x="0" y="658" width="400" height="42" fill="transparent"/>
  <rect x="-4" y="672" width="408" height="30" fill="#9B86D9"/><rect class="lcf-belttop" x="-4" y="663" width="408" height="11" rx="5" fill="#C9B8FF"/>
  <path class="lcf-beltlines amb" d="M-24 668.5 H424" stroke="#B19DF2" stroke-width="3" stroke-dasharray="10 14"/>
  ${Array.from({ length: 11 }, (_, i) => `<circle cx="${10 + i * 38}" cy="686" r="4.2" fill="#E2D8FF"/><circle cx="${10 + i * 38}" cy="686" r="1.6" fill="#7E68C2"/>`).join('')}
  <rect x="-4" y="694" width="408" height="6" fill="#7E68C2"/></g>
<g class="lcf-sweetsfast" pointer-events="none"><g class="lcf-sweets amb">${[0, 400, 800, 1200].map((dx) => ON_BELT.map((f, i) => f(dx + 24 + i * 50)).join('')).join('')}</g></g>
</svg>`,

  css: `
.lcf-smoke { transform-box: fill-box; transform-origin: 50% 100%; }
.lcf-smoke.amb { animation: lcfSmoke 4s ease-in-out infinite; }
.lcf-smoke.s2.amb { animation-delay: -2s; }
@keyframes lcfSmoke { 0% { transform: translateY(10px) scale(.7); opacity: 0; } 30% { opacity: .95; } 100% { transform: translateY(-24px) scale(1.15); opacity: 0; } }
.lcf-wheel.amb { transform-box: fill-box; transform-origin: center; animation: lcfSpin 10s linear infinite; }
@keyframes lcfSpin { to { transform: rotate(360deg); } }
.lcf-light.amb { animation: lcfBlink 1.4s steps(2) infinite; }
@keyframes lcfBlink { 50% { fill: #FFF6FB; } }
.lcf-flow.amb { animation: lcfFlow .7s linear infinite; }
@keyframes lcfFlow { to { stroke-dashoffset: -22; } }
.lcf-ripples.amb { animation: lcfRipple 3.6s ease-in-out infinite; }
@keyframes lcfRipple { 50% { transform: translateX(6px); opacity: .35; } }
.lcf-boat.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: lcfBob 3s ease-in-out infinite; }
@keyframes lcfBob { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg) translateY(-1px); } }
[data-tap="factoryRiver"].tapped, [data-tap="factoryIceCream"].tapped, [data-tap="factoryCupcake"].tapped { transform-origin: 50% 100%; animation: lcfTap .5s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes lcfTap { 40% { transform: scale(1.07); } }
[data-tap="factoryRiver"].lcfsail .lcf-boatwrap { animation: lcfSail 3s ease-in-out; }
@keyframes lcfSail { 35% { transform: translateX(20px); } 70% { transform: translateX(-8px); } }
[data-tap="factoryRiver"].lcfgush .lcf-stream { transform-box: fill-box; transform-origin: 50% 0; animation: lcfGush 1.4s ease-in-out; }
@keyframes lcfGush { 30%, 60% { transform: scaleX(1.4); } }
[data-tap="factoryRiver"].lcfgush .lcf-splash { transform-box: fill-box; transform-origin: 50% 100%; animation: lcfSplash 1.4s ease-out; }
@keyframes lcfSplash { 30% { transform: scale(1.5, 2.2); } }
[data-tap="factoryRiver"].lcf-noboat .lcf-boatwrap { visibility: hidden; }
.lcf-rain { opacity: 0; pointer-events: none; }
[data-tap="factoryCupcake"].lcfsprinkle .lcf-rain { animation: lcfRain 2.2s ease-in; }
@keyframes lcfRain { 0% { opacity: 1; transform: translateY(-46px); } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(54px); } }
[data-tap="factoryCupcake"].lcfsprinkle .lcf-top { transform-box: fill-box; transform-origin: 50% 100%; animation: lcfPuff .7s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes lcfPuff { 40% { transform: scale(1.12, .88); } }
[data-tap="factoryCupcake"].lcfopen .lcf-door { transform-box: fill-box; transform-origin: 0 50%; animation: lcfDoor 3s ease-in-out; }
@keyframes lcfDoor { 12%, 82% { transform: scaleX(.12); } }
[data-tap="factoryCupcake"].lcfopen .lcf-ginger { transform-box: fill-box; transform-origin: 50% 100%; animation: lcfGinger 3s ease-in-out; }
@keyframes lcfGinger { 18%, 78% { transform: scale(1.35); } }
[data-tap="factoryCupcake"].lcfopen .lcf-arm { transform-box: fill-box; transform-origin: 0 100%; animation: lcfWave .35s ease-in-out .5s 6 alternate; }
@keyframes lcfWave { from { transform: rotate(-25deg); } to { transform: rotate(35deg); } }
[data-tap="factoryCupcake"].lcf-nocherry .lcf-cherry { visibility: hidden; }
.lcf-bear { transform-box: fill-box; transform-origin: 50% 100%; }
.lcf-idle { transform-box: fill-box; transform-origin: 50% 100%; }
.lcf-idle.amb { animation: lcfIdle 3.3s ease-in-out infinite; }
.b2 > .lcf-idle.amb { animation-delay: -1.1s; } .b3 > .lcf-idle.amb { animation-delay: -2.2s; }
@keyframes lcfIdle { 0%, 78%, 100% { transform: none; } 86% { transform: scale(1.07, .93); } 93% { transform: scale(.96, 1.05); } }
[data-tap="factoryGummies"].lcfwobble .lcf-bear { animation: lcfWobble 1.4s ease-out; }
@keyframes lcfWobble { 10% { transform: scale(1.22, .78); } 25% { transform: scale(.84, 1.16); } 40% { transform: scale(1.1, .9); } 55% { transform: scale(.94, 1.06); } 70% { transform: scale(1.03, .97); } }
[data-tap="factoryGummies"].lcfdance .lcf-bear { animation: lcfDance .5s ease-in-out 5 alternate; }
[data-tap="factoryGummies"].lcfdance .lcf-bear.b2 { animation-delay: .15s; }
[data-tap="factoryGummies"].lcfdance .lcf-bear.b3 { animation-delay: .3s; }
@keyframes lcfDance { from { transform: rotate(-12deg); } to { transform: rotate(12deg) translateY(-9px); } }
[data-tap="factoryGummies"].lcfleap .lcf-bear.b1 { animation: lcfLeap .5s ease-in forwards; }
@keyframes lcfLeap { to { transform: translateY(-70px) scale(.6); opacity: 0; } }
[data-tap="factoryGummies"].lcf-nob1 .lcf-bear.b1, [data-tap="factoryGummies"].lcf-nob2 .lcf-bear.b2 { visibility: hidden; }
[data-tap="factoryGummies"].lcfback .lcf-bear { animation: lcfBack .5s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes lcfBack { from { transform: scale(.2); } }
.lcf-swirl { transform-box: fill-box; transform-origin: 50% 100%; transform: scale(0); }
[data-tap="factoryIceCream"].lcffill .lcf-swirl { animation: lcfSwirl 3s ease-in-out; }
@keyframes lcfSwirl { 0%, 15% { transform: scale(0); } 55%, 84% { transform: scale(1); } 100% { transform: scale(0); } }
.lcf-pour { opacity: 0; }
[data-tap="factoryIceCream"].lcffill .lcf-pour { animation: lcfPour 3s linear; }
@keyframes lcfPour { 10%, 52% { opacity: 1; } 58%, 100% { opacity: 0; } }
[data-tap="factoryIceCream"].lcf-orange .lcf-swirl path:not(:last-child), [data-tap="factoryIceCream"].lcf-orange .lcf-pour { fill: #FFA347; }
[data-tap="factoryIceCream"].lcf-nocone .lcf-cone, [data-tap="factoryIceCream"].lcf-nocone .lcf-swirl { visibility: hidden; }
[data-tap="factoryIceCream"].lcfshake .lcf-body { transform-box: fill-box; transform-origin: 50% 100%; animation: lcfShake .16s linear 6; }
@keyframes lcfShake { 25% { transform: rotate(-1.6deg); } 75% { transform: rotate(1.6deg); } }
[data-tap="factoryIceCream"].lcflever .lcf-lever { transform-box: fill-box; transform-origin: 0 100%; animation: lcfLever 1.4s ease-in-out; }
@keyframes lcfLever { 20%, 70% { transform: rotate(-60deg); } }
[data-tap="factoryBelt"].tapped { animation: lcfNudge .35s ease-in-out; }
@keyframes lcfNudge { 50% { transform: translateY(2px); } }
.lcf-beltlines.amb { animation: lcfLines 1.2s linear infinite; }
@keyframes lcfLines { to { stroke-dashoffset: 24; } }
.lcf-sweets.amb { animation: lcfRun 16s linear infinite; }
@keyframes lcfRun { to { transform: translateX(-400px); } }
.lcf-sweetsfast.lcffast { animation: lcfFast 2.4s ease-in-out; }
@keyframes lcfFast { to { transform: translateX(-800px); } }
.fly-fx.lcf-spr { font-weight: 900; }
.fly-fx.lcf-s0 { color: #FF5FA2; } .fly-fx.lcf-s1 { color: #FFD23F; } .fly-fx.lcf-s2 { color: #6FD3FF; } .fly-fx.lcf-s3 { color: #7BD88F; } .fly-fx.lcf-s4 { color: #B78CFF; }
.fly-fx.lcf-ball { color: #FF9EC7; }
`,

  props: () => ({
    // a strawberry dipped in chocolate (for her)
    candyFactoryBerry: { slot: 'hand', art: () => `<g transform="translate(164 146) rotate(-18)"><path d="M0 20 C-15 9 -14 -8 -8 -12 Q0 -15 8 -12 C14 -8 15 9 0 20Z" fill="#FF4F6B"/>
      ${[[-5, -6], [3, -8], [-1, -1], [6, -2]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1" ry="1.6" fill="#FFE066"/>`).join('')}
      <path d="M-13.6 2 Q0 7 13.6 2 C13 10 7 15 0 20 C-7 15 -13 10 -13.6 2Z" fill="#6B3E22"/><path d="M-8 7 q4 3 9 2" stroke="#9C6646" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M-9 -12 l4 -6 3 3 2 -7 2 7 3 -3 4 6z" fill="#4CB84C"/></g>` },
    candyFactoryFreckle: { slot: 'nose', art: () => '<ellipse cx="104" cy="101" rx="7" ry="6" fill="#6B3E22"/><circle cx="101.5" cy="98.8" r="2" fill="#fff" opacity=".45"/><path d="M107 105 q2 6 -.5 8 q-2.5 -2 .5 -8z" fill="#6B3E22"/>' },
    candyFactoryBoat: { slot: 'feet', art: () => `<path d="M24 176 Q100 232 176 176 L168 168 H32Z" fill="#5E3620"/><path d="M32 168 H168" stroke="#9C6646" stroke-width="6" stroke-linecap="round"/>
      <path d="M62 176 v26 M100 176 v32 M138 176 v26" stroke="#4A2A18" stroke-width="3"/><path d="M170 170 V126" stroke="#F2C27B" stroke-width="4"/><path d="M170 126 l22 8 -22 8z" fill="#FF5FA2"/>` },
    candyFactorySprinkles: { slot: 'head', art: () => [[78, 50, 30], [96, 43, -20], [112, 51, 60], [125, 45, 10], [88, 60, -50], [106, 62, 20], [70, 64, 70], [132, 61, -30], [56, 80, 40], [146, 82, -60], [48, 100, 15], [152, 104, -35]]
      .map(([x, y, r], i) => `<rect x="${x - 6}" y="${y - 2}" width="12" height="4" rx="2" fill="${SPRINKLE[i % SPRINKLE.length]}" transform="rotate(${r} ${x} ${y})"/>`).join('') },
    candyFactoryCherry: { slot: 'head', art: () => `<path d="M76 50 q2 -16 24 -16 q22 0 24 16 q-24 7 -48 0z" fill="#FFF4FA"/><path d="M86 40 q6 -5 14 -5" stroke="#FFD6EA" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M101 22 q3 -14 14 -18" stroke="#4E9A3E" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="101" cy="28" r="11" fill="#E8313B"/><circle cx="97" cy="24" r="3.2" fill="#fff" opacity=".75"/>` },
    candyFactoryGummy: { slot: 'head', art: () => `<g transform="translate(104 48) scale(1.15)">${bear(...BEARS.b1)}</g>` },
    candyFactoryGummyPaw: { slot: 'hand', art: () => `<g transform="translate(166 172) rotate(-20) scale(.85)">${bear(...BEARS.b2)}</g>` },
    candyFactoryScoop: { slot: 'head', art: () => `<path d="M68 54 Q66 18 100 16 Q134 18 132 54 q-6 6 -10 1 q-5 9 -11 1 q-5 8 -11 0 q-6 8 -11 0 q-5 7 -11 -1 q-5 5 -10 -1z" fill="#FF9EC7"/>
      <path d="M74 56 q1 12 4 15 q3 -4 0 -15z M124 56 q1 10 3 13 q3 -4 -1 -13z" fill="#FF9EC7"/><path d="M82 32 q8 -10 18 -10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
      ${[[90, 38, 30], [108, 30, -40], [116, 44, 60], [96, 48, -10]].map(([x, y, r], i) => `<rect x="${x - 4}" y="${y - 1.4}" width="8" height="2.8" rx="1.4" fill="${SPRINKLE[(i + 1) % SPRINKLE.length]}" transform="rotate(${r} ${x} ${y})"/>`).join('')}` },
    candyFactoryCone: { slot: 'hand', art: () => `<g transform="translate(160 140) rotate(14)"><path d="M-12 0 L0 34 L12 0Z" fill="#F2C27B"/><path d="M-8 6 l12 11 M-4 1 l11 10 M8 6 l-12 11 M4 1 l-11 10" stroke="#D9A35A" stroke-width="1.5"/>
      <circle cy="-6" r="13" fill="#FFA347"/><path d="M-2 -18 q-7 -10 -3 -15 q3 6 4 10 q2 -9 9 -11 q0 8 -7 13" fill="#4CB84C"/><path d="M-7 -11 q4 -4 9 -3" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".6"/></g>` },
    // tied with a bow like a real sweet
    candyFactoryBow: { slot: 'head', art: () => `<path d="M100 42 Q70 14 62 34 Q58 54 100 42Z M100 42 Q130 14 138 34 Q142 54 100 42Z" fill="#FF5FA2"/>
      <path d="M96 46 l-12 20 8 -2 3 7z M104 46 l12 20 -8 -2 -3 7z" fill="#E23D86"/><circle cx="100" cy="42" r="8" fill="#E23D86"/>
      ${[[74, 32], [82, 40], [126, 32], [118, 40], [70, 42], [130, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff" opacity=".85"/>`).join('')}` },
  }),

  reactions: (R, k) => {
    const { api, sfx, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, line, centerOf, nextTo, head, nose, mouth, feet, paw, sceneRect, pick } = k;
    const free = () => api.free() && !api.talking();
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    // a class on the thing for as long as the scene lasts (the boat he sails in, the cherry on his head)
    const away = (a, el, cls) => { el.classList.add(cls); onEnd(a, () => el.classList.remove(cls)); };
    // something handed to her: it flies out of the picture, towards her
    const toHer = (txt, from) => { const s = sceneRect(); fly(txt, from, [s.width / 2, s.height + 40], 800, { arc: 40, size: 48 }); };
    // little drops of chocolate splashing up
    const drops = (x, y, n) => { for (let i = 0; i < n; i++) fly('🟤', [x, y], [x + Math.random() * 70 - 35, y + Math.random() * 16 - 4], 520, { arc: 24 + Math.random() * 26, size: 8 + Math.random() * 4 }); };
    // back to the middle before a scene ends, so he isn't standing in front of the thing she taps next
    const home = () => go(50, 600);

    // ---------- the chocolate river: the boat sails, a strawberry dipped for her, a splash, a ride ----------
    const sail = (c) => {
      api.hop(c.el, 'lcfsail', 3000);
      sfx.bubble();
      setTimeout(() => sfx.bubble(), 800);
      setTimeout(() => { if (free()) { pose('happy', 1600, 'wave', 1200); line('candyFactoryBoat', 1); } }, 500);
    };
    const berry = (c) => {
      const a = begin('lcfBerry'), [px, py] = part(c, '.lcf-pool');
      go(nextTo(c.el, 14), 700);
      at(a, 750, () => { pose('ok', 1000, 'crouch', 900); fly('🍓', paw(), [px + 10, py - 6], 450, { arc: 30, size: 22 }); });
      at(a, 1200, () => { sfx.splash(); drops(px + 10, py - 6, 5); });
      at(a, 1550, () => { prop('candyFactoryBerry', 3600); sfx.pop(); pose('happy', 1500, 'sniff', 1500); line('candyFactoryBerry', 1, 0); });
      at(a, 3300, () => { pose('happy', 1500, 'proud', 1200); api.hearts(...head(), 3); api.reward(); });
      at(a, 4100, home);
      at(a, 4800, end);
    };
    R.factoryRiver = {
      press: (c) => { sfx.bubble(); drops(c.x, c.y, 3); },
      tap: who(oneOf('candyFactoryRiver', sail, berry)),
      // the waterfall gushes, and a drop of chocolate lands on his nose
      double: (c) => {
        api.hop(c.el, 'lcfgush', 1400);
        sfx.splash();
        const s = part(c, '.lcf-splash');
        drops(...s, 8);
        if (!free()) return;
        const a = begin('lcfFreckle');
        fly('🟤', s, nose(), 550, { arc: 70, size: 12 });
        at(a, 550, () => { prop('candyFactoryFreckle', 3000); sfx.pop(); pose('surprised', 1200, 'startle', 1100); });
        at(a, 1400, () => { pose('laugh', 1500, 'hop'); line('candyFactorySplash', 1, 0); });
        at(a, 2800, () => pose('ok', 1000, 'groom', 1200));
        at(a, 3800, end);
      },
      long: who((c) => {
        const a = begin('lcfRide');
        away(a, c.el, 'lcf-noboat');
        prop('candyFactoryBoat', 4000);
        hold(a, 'sway', 3600);
        sfx.splash();
        line('candyFactoryRide', 1, 0);
        [900, 1800, 2700].forEach((d) => at(a, d, () => { sfx.bubble(); drops(...feet(), 4); }));
        at(a, 3900, () => { api.reward(); end(); });
      }),
    };

    // ---------- the cupcake house: sprinkles rain, the door opens, the cherry on top; a long press: hide ----------
    const sprinkles = (c) => {
      const a = begin('lcfSprinkles'), top = part(c, '.lcf-cherry'), [hx, hy] = head();
      api.hop(c.el, 'lcfsprinkle', 2400);
      sfx.pop();
      for (let i = 0; i < 12; i++) at(a, i * 55, () => fly('▬', top, [hx + Math.random() * 130 - 65, hy - 10 + Math.random() * 40], 900, { arc: 110, spin: 300, size: 12, cls: `lcf-spr lcf-s${i % 5}` }));
      at(a, 250, () => sfx.sparkle());
      at(a, 950, () => { prop('candyFactorySprinkles', 5000); pose('laugh', 1800, 'shimmy', 800); line('candyFactorySprinkles', 1, 0); api.reward(); });
      at(a, 2800, end);
    };
    const door = (c) => {
      api.hop(c.el, 'lcfopen', 3000);
      sfx.knock();
      setTimeout(() => sfx.knock(), 220);
      setTimeout(() => sfx.happy(), 800);
      setTimeout(() => { if (free()) { pose('happy', 1600, 'wave', 1200); line('candyFactoryDoor', 1); } }, 900);
    };
    R.factoryCupcake = {
      press: (c) => { sfx.pop(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('candyFactoryCupcake', sprinkles, door)),
      double: who((c) => {
        const a = begin('lcfCherry'), from = part(c, '.lcf-cherry');
        away(a, c.el, 'lcf-nocherry');
        sfx.boing();
        fly('🍒', from, head(), 700, { arc: 80, size: 24, spin: 360 });
        at(a, 700, () => { prop('candyFactoryCherry', 2700); sfx.pop(); pose('surprised', 1000, 'squash', 700); });
        at(a, 1300, () => { pose('happy', 1600, 'proud', 1200); line('candyFactoryCherry', 1, 0); api.reward(); });
        at(a, 3400, () => { fly('🍒', head(), from, 700, { arc: 60, size: 24 }); sfx.boing(); api.setTemp('laugh', 1200); });
        at(a, 4100, end);
      }),
      long: who((c) => k.hideGame(begin('hide'), c.el)),
    };

    // ---------- the gummy bears: they wobble and dance; one jumps on his head; a sticky high five ----------
    const wobble = (c) => {
      api.hop(c.el, 'lcfwobble', 1500);
      sfx.boing();
      setTimeout(() => sfx.boing(), 260);
      setTimeout(() => { if (free()) { pose('laugh', 1500, 'jiggle', 700); line('candyFactoryWobble', 1); } }, 300);
    };
    const dance = (c) => {
      api.hop(c.el, 'lcfdance', 2900);
      [523, 659, 784, 659, 523, 784].forEach((f, i) => setTimeout(() => sfx.note(f), i * 330));
      setTimeout(() => { if (free()) { pose('happy', 2400, 'dance', 2400); line('candyFactoryDance', 1); } }, 200);
    };
    R.factoryGummies = {
      press: () => sfx.boing(),
      tap: who(oneOf('candyFactoryGummies', wobble, dance)),
      double: who((c) => {
        const a = begin('lcfGummyHead');
        api.hop(c.el, 'lcfleap', 600);
        sfx.boing();
        at(a, 450, () => { away(a, c.el, 'lcf-nob1'); prop('candyFactoryGummy', 3000); pose('surprised', 1400, 'balance', 2000); });
        at(a, 1100, () => line('candyFactoryGummyHead', 1, 0));
        at(a, 3300, () => { sfx.boing(); pose('laugh', 1300, 'hop'); });
        at(a, 3500, () => { end(); api.hop(c.el, 'lcfback', 600); });
      }),
      long: who((c) => {
        const a = begin('lcfHighFive');
        go(nextTo(c.el, 12), 700);
        at(a, 750, () => { pose('happy', 1000, 'highfive', 1000); api.hop(c.el, 'lcfwobble', 1500); sfx.clap(); });
        at(a, 1500, () => { away(a, c.el, 'lcf-nob2'); prop('candyFactoryGummyPaw', 1900); pose('surprised', 1300, 'strain', 1200); line('candyFactoryHighFive', 1, 0); });
        at(a, 3300, () => { sfx.shake(); pose('laugh', 1500, 'shakeOff', 1200); unprop('hand'); c.el.classList.remove('lcf-nob2'); api.hop(c.el, 'lcfback', 600); api.hearts(c.x, c.y - 20, 3); api.reward(); });
        at(a, 4100, home);
        at(a, 4800, end);
      }),
    };

    // ---------- the ice-cream machine: a cone fills up (for her), a scoop lands on his head, carrot ice cream, the big lever ----------
    const fill = (c) => {
      api.hop(c.el, 'lcffill', 3000);
      sfx.whirr();
      setTimeout(() => sfx.whirr(), 600);
      setTimeout(() => { if (free()) { pose('happy', 1800, 'clap'); line('candyFactoryCone', 1); } }, 500);
      setTimeout(() => { sfx.pop(); toHer('🍦', part(c, '.lcf-cone')); }, 2500);
    };
    const scoop = (c) => {
      const a = begin('lcfScoop');
      api.hop(c.el, 'lcfshake', 1000);
      sfx.whirr();
      at(a, 600, () => { sfx.pop(); fly('●', part(c, '.lcf-nozzle'), head(), 650, { arc: 90, size: 34, cls: 'lcf-ball' }); });
      at(a, 1250, () => { prop('candyFactoryScoop', 3200); sfx.splash(); pose('surprised', 1000, 'squash', 700); });
      at(a, 1900, () => { pose('laugh', 1600, 'shiver', 1200); line('candyFactoryScoop', 1, 0); });
      at(a, 3700, () => { sfx.shake(); pose('happy', 1200, 'shakeOff', 1200); unprop('head'); api.fxAt(...head(), ['❄️'], 3, 'spark'); });
      at(a, 4700, end);
    };
    R.factoryIceCream = {
      press: () => sfx.ding(),
      tap: who(oneOf('candyFactoryIceCream', fill, scoop)),
      double: who((c) => {
        const a = begin('lcfCarrot');
        away(a, c.el, 'lcf-orange');
        api.hop(c.el, 'lcffill', 3000);
        sfx.whirr();
        at(a, 1700, () => { const from = part(c, '.lcf-cone'); away(a, c.el, 'lcf-nocone'); fly('🍦', from, paw(), 450, { arc: 40, size: 28 }); });
        at(a, 2150, () => { prop('candyFactoryCone', 3200); sfx.pop(); pose('happy', 1600, 'proud', 1200); line('candyFactoryCarrot', 1, 0); });
        at(a, 3700, () => pose('laugh', 1400, 'hop'));
        at(a, 4900, end);
      }),
      long: who((c) => {
        const a = begin('lcfLever');
        go(nextTo(c.el, 16), 700);
        at(a, 750, () => { pose('ok', 900, 'strain', 900); api.hop(c.el, 'lcflever', 1600); sfx.knock(); });
        at(a, 1300, () => { api.hop(c.el, 'lcfshake', 1200); sfx.whirr(); sfx.rumble(); });
        [0, 220, 440, 660, 880, 1100].forEach((d, i) => at(a, 1500 + d, () => {
          const s = sceneRect();
          sfx.pop();
          fly('🍦', part(c, '.lcf-nozzle'), [s.width * (0.1 + i * 0.16), s.height * 0.9], 800, { arc: 120, size: 30, spin: 180 });
        }));
        at(a, 1900, () => { pose('laugh', 2000, 'bigjump', 1100); line('candyFactoryLever', 1, 0); });
        at(a, 3400, () => { api.hearts(...head(), 3); api.reward(); });
        at(a, 3900, home);
        at(a, 4600, end);
      }),
    };

    // ---------- the conveyor belt: catch the carrot one, too fast, a quality check, a ride ----------
    const ITEMS = ['🍬', '🍭', '🍫', '🍩', '🧁'];
    const CROSS = 2600; // ms for a sweet to ride across the scene
    const beltY = (c) => part(c, '.lcf-belttop')[1] - 10;
    // put something on the belt at the right edge; it rides to x (or off the left edge)
    const ride = (txt, y, x = -30, size = 22) => {
      const w = sceneRect().width, ms = ((w + 30 - x) / (w + 60)) * CROSS;
      fly(txt, [w + 30, y], [x, y], ms, { size });
      return ms;
    };
    const catchIt = (c) => {
      const a = begin('lcfCatch'), y = beltY(c), [px] = paw();
      pose('ok', 2000, 'think', 1800);
      [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 3).forEach((e, i) => at(a, i * 480, () => { ride(e, y); sfx.tick(); }));
      at(a, 1440, () => {
        const t = ride('🥕', y, px, 24);
        at(a, t, () => { sfx.catch(); pose('happy', 600, 'crouch', 500); fly('🥕', [px, y], mouth(), 450, { arc: 40, size: 26 }); });
        at(a, t + 450, () => { api.setTemp('eat', 1600); sfx.crunch(); line('candyFactoryCatch', 1, 0); api.boost('hunger', 2); api.reward(); });
        at(a, t + 2300, end);
      });
    };
    const tooFast = (c) => {
      const a = begin('lcfFast'), y = beltY(c), w = sceneRect().width;
      const sweets = c.el.ownerSVGElement?.querySelector('.lcf-sweetsfast');
      if (sweets) api.hop(sweets, 'lcffast', 2600);
      sfx.whirr();
      line('candyFactoryFast', 1, 0);
      [0, 450, 900, 1350].forEach((d, i) => at(a, 200 + d, () => { go(i % 2 ? 62 : 38, 380); fly(pick(ITEMS), [w + 30, y], [-30, y], 900, { size: 20 }); sfx.whoosh(); }));
      at(a, 2200, () => { prop('dizzy', 2400); pose('dizzy', 2200, 'squash', 700); sfx.bonk(); });
      at(a, 3000, () => line('candyFactoryFastEnd', 1, 0));
      at(a, 4100, home);
      at(a, 4800, end);
    };
    R.factoryBelt = {
      press: () => sfx.tick(),
      tap: who(oneOf('candyFactoryBelt', catchIt, tooFast)),
      // a lolly comes along: quality check, approved, back on the belt it goes
      double: who((c) => {
        const a = begin('lcfCheck'), y = beltY(c), [px] = paw();
        const t = ride('🍭', y, px, 26);
        pose('ok', 1200, 'tilt', 1200);
        at(a, t, () => { prop('lolly', 2600); sfx.catch(); pose('ok', 1400, 'think', 1400); line('candyFactoryCheck', 1, 0); });
        at(a, t + 1500, () => { sfx.stamp(); api.fxAt(...paw(), ['✅'], 1, 'spark'); pose('happy', 1400, 'proud', 1200); api.reward(); });
        at(a, t + 2700, () => { unprop('hand'); fly('🍭', paw(), [-30, y], 900, { size: 26 }); });
        at(a, t + 3300, end);
      }),
      // he sits on the belt like a sweet, rides along and gets a bow
      long: who(() => {
        const a = begin('lcfBeltRide');
        pose('happy', 800, 'hop');
        sfx.boing();
        at(a, 450, () => { hold(a, 'loaf', 2600); go(30, 2400); sfx.whirr(); line('candyFactoryBeltRide', 1, 0); });
        at(a, 2900, () => { prop('candyFactoryBow', 5000); sfx.magic(); pose('laugh', 1600, 'proud', 1200); api.hearts(...head(), 3); api.reward(); });
        at(a, 3800, home);
        at(a, 4500, end);
      }),
    };
  },

  visitors: [
    { e: '🍬', w: 3, path: 'float', end: ['sweet', 'lolly'] },
    { e: '🦋', w: 2, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'] },
  ],
};
