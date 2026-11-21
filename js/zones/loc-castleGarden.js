// The castle's second place: the stone garden inside the castle walls. Raked white gravel with rocks, a koi pond with
// stepping stones, a stone lantern (a moth comes to its light), a bamboo deer-scarer that fills, tips and clacks, and
// a cherry tree. The castle's keep looks over the wall.

// the bamboo's hollow "tok!"
const clack = (sfx) => { sfx.tick(); sfx.note(330); };

// a koi seen from above, facing right, about 38 long: c its colour, s its spot
const koi = (c, s) => `<path d="M-13 0 L-22 -6 Q-19 0 -22 6Z" fill="${c}"/><path d="M2 -5 q-2 -6 -8 -6 M2 5 q-2 6 -8 6" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M-14 0 Q-6 -7 6 -6 Q14 -5 16 0 Q14 5 6 6 Q-6 7 -14 0Z" fill="${c}"/><ellipse cx="1" cy="-.5" rx="5.5" ry="3" fill="${s}"/>
  <circle cx="12" cy="-2.6" r="1" fill="#3A2216"/><circle cx="12" cy="2.6" r="1" fill="#3A2216"/>`;
// a cherry blossom
const bloom = (x, y) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-3" r="2.6" fill="#fff" transform="rotate(${a})"/>`).join('')}<circle r="1.4" fill="#FF7AB8"/></g>`;
// a pagoda roof (the same curve as the castle's), w: half its width
const roof = (cx, y, w, c) => `<path d="M${cx - w} ${y} Q${cx} ${y - w * 0.66} ${cx + w} ${y} L${cx + w * 0.7} ${y - 6} Q${cx} ${y - w * 0.52} ${cx - w * 0.7} ${y - 6}Z" fill="${c}"/>`;
// a garden rock with a little moss on top
const rock = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="#A9A2B0"/><ellipse cx="${x - r * 0.2}" cy="${y - r * 0.3}" rx="${r * 0.55}" ry="${r * 0.26}" fill="#C7C0CC"/><ellipse cx="${x + r * 0.25}" cy="${y - r * 0.45}" rx="${r * 0.35}" ry="${r * 0.16}" fill="#9CCB86"/>`;

export default {
  id: 'castleGarden',
  world: 'castle',
  name: ['Сад камней', 'The stone garden'],
  spots: { L: [40, 504], R: [370, 640], l: [22, 660], r: [384, 660], sky: 300 },
  arrive: [
    ['Сад камней! Тут так тихо, что слышно, как журчит вода.', "The stone garden! It's so quiet you can hear the water trickling."],
    ['Тсс… Это японский сад. Тут даже камешки причёсаны!', 'Shh… This is a Japanese garden. Even the pebbles have their hair combed!'],
  ],

  lines: {
    castleGardenKoi: [['Карпы кои приплыли ко мне! Думают, у меня есть угощение.', 'The koi swam over to me! They think I have treats.'], ['Кои живут очень долго, некоторые больше пятидесяти лет!', 'Koi live a really long time. Some live for more than fifty years!']],
    castleGardenKoiJump: [['Плюх! Карп выпрыгнул! Говорят, кто перепрыгнет водопад, станет драконом.', 'Splash! A koi jumped! They say a koi that leaps up a waterfall becomes a dragon.'], ['Ух ты, карп-прыгун! Тренируется стать драконом.', "Whoa, a jumping koi! It's practising to become a dragon."]],
    castleGardenKoiSplash: [['Карп махнул хвостом, и я весь мокрый! Это он так шутит?', 'The koi flicked its tail and soaked me! Is that a fishy joke?']],
    castleGardenStones: [['Ой-ой-ой! Устоял! Чуть не искупался с карпами.', 'Whoa-whoa-whoa! Made it! I nearly went for a swim with the koi.']],
    castleGardenRake: [['В японском саду камешки — это море, а большие камни — острова.', 'In a Japanese garden, the gravel is the sea and the big rocks are islands.'], ['Рисую граблями волны. Монахи делают так каждое утро.', 'I rake waves into the gravel. Monks do this every morning.']],
    castleGardenCarrot: [['Смотри, я нарисовал морковку! Самый важный узор в саду.', 'Look, I drew a carrot! The most important pattern in the garden.'], ['Морковка из камешков! Жалко, что её нельзя съесть.', "A carrot made of pebbles! Shame you can't eat it."]],
    castleGardenCrunch: [['Хруст-хруст! Камешки хрустят, как чипсы.', 'Crunch, crunch! The gravel sounds like crisps.']],
    castleGardenBreathe: [['Посидим тихо. Вдох… и выдох…', "Let's sit quietly. Breathe in… and out…"]],
    castleGardenCalm: [['Как спокойно. Теперь я дзен-кролик.', "So calm. I'm a zen bunny now."]],
    castleGardenLantern: [['Каменный фонарь зажёгся! Раньше в нём горела свечка.', 'The stone lantern is lit! Long ago, a candle burned inside.'], ['Тёплый огонёк в каменном домике. Уютно!', 'A warm little light in a stone house. So cosy!']],
    castleGardenMoth: [['Прилетел мотылёк! Мотыльки обожают огоньки.', 'A moth came! Moths just love little lights.'], ['Мотыльки летят на свет, а учёные до сих пор спорят, почему.', 'Moths fly to lights, and scientists still argue about why.']],
    castleGardenStatue: [['Я тоже каменный фонарь. Не шевелюсь… Ой, ухо чешется!', "I'm a stone lantern too. Not moving… Oh no, my ear's itchy!"]],
    castleGardenFireflies: [['Светлячки! В Японии летом ходят смотреть на светлячков.', 'Fireflies! In Japan, people go out on summer nights just to watch them.']],
    castleGardenClack: [['Тук! Ой, я подпрыгнул! Этот бамбук пугает оленей, а не кроликов!', 'Clack! Oops, I jumped! This bamboo is meant to scare deer, not bunnies!'], ['Это японская пугалка для оленей. Меня она тоже пугает!', "It's a Japanese deer-scarer. It scares me too!"]],
    castleGardenWait: [['Сейчас стукнет… Три, два, один…', "It's about to clack… Three, two, one…"]],
    castleGardenWaitClack: [['Ну вот! Ждал-ждал, и всё равно подпрыгнул!', 'There it goes! I was waiting for it, and I still jumped!']],
    castleGardenSip: [['Холодная водичка из бамбука! Вкусно.', 'Cold water from the bamboo! Yum.']],
    castleGardenRhythm: [['Тук… тук… тук! Бамбуковый барабан, а я танцую!', "Clack… clack… clack! A bamboo drum, and I'm dancing!"]],
    castleGardenPetals: [['Сакура цветёт всего неделю. Надо успеть полюбоваться!', 'Cherry blossoms only last about a week. We have to enjoy them now!'], ['Лепестки летят, как розовый снег!', 'The petals are falling like pink snow!']],
    castleGardenNose: [['Лепесток сел мне на нос! Поймать лепесток — к удаче.', 'A petal landed on my nose! Catching a petal brings good luck.']],
    castleGardenTwirl: [['Лепестковый дождик! Я кружусь, кружусь!', "A rain of petals! I'm spinning and spinning!"]],
    castleGardenHanami: [['Ханами — это пикник под сакурой. Данго и зелёный чай!', 'Hanami is a picnic under the cherry tree. Dango and green tea!']],
    castleGardenPetalVisit: [['Лепесток прилетел прямо мне на нос. Пф-ф! Лети дальше!', 'A petal flew right onto my nose. Pfff! Off you go!']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9EC7"/><stop offset=".7" stop-color="#FFD6A5"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8EDBF5"/><stop offset="1" stop-color="#58B2E2"/></linearGradient>
<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF6EE"/><stop offset="1" stop-color="#EFE5D6"/></linearGradient>
<radialGradient id="${u}l"><stop offset="0" stop-color="#FFE58A" stop-opacity=".95"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}m"><stop offset="0" stop-color="#FFF6D6"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<circle cx="96" cy="262" r="54" fill="url(#${u}m)"/><circle cx="96" cy="262" r="24" fill="#FFF0C4"/>
<g fill="#fff" opacity=".55"><rect x="236" y="226" width="78" height="7" rx="3.5"/><rect x="258" y="239" width="46" height="6" rx="3"/><rect x="18" y="312" width="64" height="6" rx="3"/></g>
<g opacity=".9"><rect x="166" y="318" width="68" height="44" fill="#FBEFF2"/><rect x="178" y="280" width="44" height="40" fill="#FBEFF2"/><rect x="188" y="248" width="24" height="34" fill="#FBEFF2"/>
  ${roof(200, 324, 50, '#7E6A88')}${roof(200, 286, 36, '#7E6A88')}${roof(200, 254, 24, '#7E6A88')}<path d="M196 238 L200 226 L204 238Z" fill="#7E6A88"/>
  <path d="M174 330 h52 M184 292 h32" stroke="#FF8DB8" stroke-width="3"/><rect x="180" y="338" width="10" height="12" fill="#8C7896"/><rect x="210" y="338" width="10" height="12" fill="#8C7896"/><rect x="195" y="298" width="10" height="12" fill="#8C7896"/><rect x="196" y="262" width="8" height="10" fill="#8C7896"/></g>
<path d="M62 362 C56 344 74 332 66 304" stroke="#7A5236" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M64 336 C50 332 40 330 30 326 M68 322 C80 318 88 316 98 312" stroke="#7A5236" stroke-width="4" fill="none" stroke-linecap="round"/>
<g fill="#6FAE6A"><ellipse cx="32" cy="322" rx="24" ry="10"/><ellipse cx="96" cy="308" rx="22" ry="9"/><ellipse cx="64" cy="296" rx="20" ry="9"/><ellipse cx="60" cy="350" rx="30" ry="10"/></g>
<g fill="#86C27E"><ellipse cx="28" cy="318" rx="12" ry="4"/><ellipse cx="92" cy="304" rx="11" ry="4"/><ellipse cx="60" cy="292" rx="10" ry="4"/></g>
<rect x="0" y="372" width="400" height="58" fill="#FFF6EE"/><rect x="0" y="374" width="400" height="7" fill="#F2E0DA"/>
<path d="M0 412 H400 V430 H0Z" fill="#DCD2DC"/><path d="M0 421 H400 ${[30, 90, 150, 210, 270, 330, 390].map((x) => `M${x} 412 V421 M${x - 30} 421 V430`).join(' ')}" stroke="#C6BAC8" stroke-width="1.5"/>
<path d="M-6 377 H406 L398 362 H2Z" fill="#3A2A3E"/><rect x="0" y="356" width="400" height="7" rx="3" fill="#4E3D58"/>
<path d="${Array.from({ length: 20 }, (_, i) => `M${10 + i * 20} 366 v9`).join(' ')}" stroke="#4E3D58" stroke-width="2"/>
<path d="M138 401 l8 -13 8 13z" fill="#3A2A3E"/><circle cx="262" cy="395" r="6" fill="#3A2A3E"/>
<path d="M0 430 H400 V700 H0Z" fill="#9BD48F"/>
<g fill="#8BC77F"><ellipse cx="120" cy="446" rx="16" ry="4"/><ellipse cx="300" cy="444" rx="18" ry="4"/><ellipse cx="216" cy="440" rx="12" ry="3"/></g>
<g><ellipse cx="126" cy="438" rx="26" ry="16" fill="#7CC46E"/><ellipse cx="120" cy="432" rx="14" ry="6" fill="#9CD88A"/><ellipse cx="282" cy="440" rx="22" ry="14" fill="#7CC46E"/><ellipse cx="278" cy="434" rx="12" ry="5" fill="#9CD88A"/>
  ${[[112, 440], [130, 430], [140, 444], [272, 442], [290, 434], [296, 446]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#FF8DB8"/>`).join('')}</g>
<path d="M0 470 Q100 456 200 462 Q300 468 400 456 V700 H0Z" fill="url(#${u}g)"/>
<path d="M0 470 Q100 456 200 462 Q300 468 400 456" stroke="#86C47A" stroke-width="4" fill="none"/>
<g stroke="#E6DACA" stroke-width="2" fill="none">${[486, 500, 514, 528, 542, 556, 570, 584, 598, 612, 626, 640].map((y) => `<path d="M0 ${y} q25 -4 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0"/>`).join('')}</g>
<path d="M0 512 Q58 498 104 518 Q134 544 124 590 Q112 640 58 650 Q22 656 0 648Z" fill="url(#${u}w)"/>
<path d="M6 520 Q56 510 96 526" stroke="#fff" stroke-width="2.5" fill="none" opacity=".45" stroke-linecap="round"/>
<g stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"><ellipse class="lcg-rip amb" cx="44" cy="604" rx="14" ry="5"/><ellipse class="lcg-rip amb lcg-rip2" cx="100" cy="590" rx="11" ry="4"/></g>
<path d="M0 512 Q58 498 104 518 Q134 544 124 590 Q112 640 58 650 Q22 656 0 648" stroke="#D6D0DA" stroke-width="5" fill="none"/>
${[[10, 508, 12], [104, 518, 11], [130, 578, 10], [80, 647, 11], [30, 653, 9]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.6}" fill="#B9B2C0"/><ellipse cx="${x - 2}" cy="${y - 2}" rx="${r * 0.55}" ry="${r * 0.25}" fill="#D6D0DA"/>`).join('')}
<ellipse cx="122" cy="634" rx="13" ry="6" fill="#B3ACBB"/><ellipse cx="120" cy="632" rx="10" ry="4" fill="#D2CCD6"/>
${rock(112, 480, 12)}${rock(296, 478, 14)}
<g data-tap="zenKoi"><rect x="0" y="500" width="104" height="154" fill="transparent"/>
  ${[[0, 50, 534, 12, '#FF9A3D', '#fff'], [1, 92, 564, 196, '#fff', '#E8413A'], [2, 40, 628, -14, '#FFC94D', '#fff']].map(([i, x, y, r, c, s]) => `<g class="lcg-swim lcg-s${i}"><g transform="translate(${x} ${y}) rotate(${r})"><g class="lcg-drift amb lcg-d${i}">${koi(c, s)}</g></g></g>`).join('')}
  ${[[24, 574], [58, 598], [92, 618]].map(([x, y]) => `<ellipse cx="${x}" cy="${y + 2}" rx="14" ry="6.5" fill="#9E97A6"/><ellipse cx="${x}" cy="${y}" rx="13" ry="6" fill="#C7C0CC"/><ellipse cx="${x - 3}" cy="${y - 1.5}" rx="6" ry="2.2" fill="#DCD6E0"/>`).join('')}
  <g transform="translate(50 534)"><g class="lcg-jumper">${koi('#FF9A3D', '#fff')}</g></g>
  <circle class="lcg-splash" cx="84" cy="558" r="1" fill="transparent"/></g>
<g data-tap="zenLantern"><rect x="44" y="430" width="52" height="68" fill="transparent"/><g transform="translate(0 16)">
  <ellipse cx="68" cy="478" rx="32" ry="5" fill="#000" opacity=".12"/>
  <path d="M46 476 L50 462 H86 L90 476Z" fill="#A9A2B0"/><path d="M50 462 H86 L82 457 H54Z" fill="#C7C0CC"/>
  <rect x="61" y="424" width="14" height="34" fill="#BDB6C4"/><rect x="59" y="438" width="18" height="4" rx="1.5" fill="#A9A2B0"/><path d="M64 428 v26" stroke="#fff" stroke-width="2" opacity=".35"/>
  <path d="M46 426 L52 415 H84 L90 426Z" fill="#B3ACBB"/><rect x="46" y="425" width="44" height="4" rx="1.5" fill="#A9A2B0"/></g></g>
<g data-tap="zenLantern" class="lcg-lamp"><rect x="36" y="344" width="64" height="86" fill="transparent"/><g transform="translate(0 16)">
  <circle class="lcg-halo" cx="68" cy="396" r="38" fill="url(#${u}l)"/>
  <rect x="52" y="380" width="32" height="35" rx="2" fill="#C7C0CC"/>
  <rect class="lcg-window" x="60" y="387" width="16" height="20" rx="1.5" fill="#5A4A66"/><rect class="lcg-light" x="60" y="387" width="16" height="20" rx="1.5" fill="#FFD66B"/>
  <path d="M55 384 v27" stroke="#fff" stroke-width="2" opacity=".35"/>
  <path d="M30 385 Q38 380 45 378 L58 358 H78 L91 378 Q98 380 106 385 Q68 377 30 385Z" fill="#B3ACBB"/><path d="M58 358 H78 L84 367 H52Z" fill="#D2CCD6"/>
  <ellipse cx="46" cy="380" rx="5" ry="2" fill="#9CCB86"/><ellipse cx="89" cy="378" rx="4" ry="1.8" fill="#9CCB86"/>
  <ellipse cx="68" cy="357" rx="9" ry="3" fill="#A9A2B0"/>
  <path d="M68 334 Q78 344 74 351 Q71 355 68 355 Q65 355 62 351 Q58 344 68 334Z" fill="#C7C0CC"/><path d="M66 341 q-3 5 -1 9" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55"/>
  <g transform="translate(68 398) scale(1.3)"><g class="lcg-moth"><g class="lcg-wing"><path d="M0 0 q-9 -8 -11 1 q5 5 11 -1z M0 0 q9 -8 11 1 q-5 5 -11 -1z" fill="#F4E9DA"/><path d="M0 0 q-6 2 -7 7 M0 0 q6 2 7 7" stroke="#E2D3BE" stroke-width="2.4" stroke-linecap="round"/></g><ellipse rx="1.8" ry="4.5" fill="#9C8571"/></g></g></g></g>
<g data-tap="zenSakura"><rect x="330" y="436" width="14" height="60" fill="transparent"/>
  <ellipse cx="337" cy="494" rx="22" ry="4.5" fill="#000" opacity=".12"/>
  <path d="M337 496 C336 476 336 456 338 436" stroke="#8C5A3C" stroke-width="13" fill="none" stroke-linecap="round"/></g>
<g data-tap="zenSakura"><rect x="290" y="256" width="110" height="148" fill="transparent"/><rect x="300" y="404" width="46" height="32" fill="transparent"/>
  <path d="M338 442 C340 420 342 398 348 376" stroke="#8C5A3C" stroke-width="13" fill="none" stroke-linecap="round"/>
  <path d="M339 422 C326 414 314 406 304 396 M343 400 C358 390 376 384 394 372" stroke="#8C5A3C" stroke-width="6" fill="none" stroke-linecap="round"/>
  <g fill="#FF9EC7"><circle cx="304" cy="396" r="12"/><circle cx="314" cy="404" r="8"/></g>${bloom(304, 394)}
  <g class="lcg-crown"><g fill="#FF9EC7"><circle cx="322" cy="326" r="30"/><circle cx="352" cy="298" r="36"/><circle cx="384" cy="296" r="30"/><circle cx="386" cy="338" r="26"/><circle cx="340" cy="350" r="28"/><circle cx="368" cy="354" r="26"/><circle cx="306" cy="362" r="18"/><circle cx="392" cy="378" r="14"/></g>
    <g fill="#FFC2DC"><circle cx="340" cy="288" r="14"/><circle cx="378" cy="284" r="11"/><circle cx="314" cy="316" r="10"/><circle cx="362" cy="334" r="9"/></g>
    ${[[328, 340], [356, 314], [392, 318], [306, 352], [372, 372], [348, 276], [384, 352], [330, 302]].map(([x, y]) => bloom(x, y)).join('')}</g></g>
<g class="lcg-petals">${[[318, 372], [352, 384], [384, 370], [336, 396], [300, 380]].map(([x, y], i) => `<ellipse class="lcg-pf amb lcg-pf${i}" cx="${x}" cy="${y}" rx="4.5" ry="3" fill="#FFB3D6"/>`).join('')}</g>
<g data-tap="zenFountain"><rect x="302" y="494" width="98" height="136" fill="transparent"/>
  <ellipse cx="352" cy="624" rx="48" ry="6" fill="#000" opacity=".12"/>
  <path d="M392 498 V620" stroke="#5FAF4C" stroke-width="7" stroke-linecap="round"/><path d="M388 540 h8 M388 584 h8" stroke="#3E8A34" stroke-width="2.5"/>
  <path d="M404 506 L377 512" stroke="#6FBF5A" stroke-width="7" stroke-linecap="round"/><ellipse cx="377" cy="512" rx="2" ry="3.5" fill="#3E7A34" transform="rotate(-12 377 512)"/>
  <path class="lcg-drip amb" d="M377 517 V535" stroke="#D6F3FF" stroke-width="2.6" stroke-dasharray="3 5" stroke-linecap="round"/>
  <path d="M346 552 V618" stroke="#5FAF4C" stroke-width="6" stroke-linecap="round"/><path d="M342 596 h8" stroke="#3E8A34" stroke-width="2.5"/>
  <ellipse cx="312" cy="588" rx="14" ry="9" fill="#A9A2B0"/><ellipse cx="309" cy="584" rx="7" ry="3.5" fill="#C7C0CC"/>
  <ellipse cx="374" cy="610" rx="25" ry="13" fill="#A9A2B0"/><ellipse cx="374" cy="602" rx="23" ry="8" fill="#C7C0CC"/><ellipse class="lcg-basin" cx="374" cy="603" rx="17" ry="5" fill="#7FD3F0"/><path d="M365 602 q6 -2 12 0" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7"/>
  <path class="lcg-pour" d="M381 574 Q385 588 377 600" stroke="#D6F3FF" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g transform="translate(346 556)"><g class="lcg-bob amb"><g class="lcg-tube"><rect x="-40" y="-9" width="80" height="18" fill="transparent"/>
    <rect x="-38" y="-7" width="76" height="14" rx="6" fill="#7CC76A"/><path d="M-34 -3 H30" stroke="#A8E096" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="-8" y="-7.5" width="4" height="15" rx="1.5" fill="#5FAF4C"/><ellipse cx="37" cy="0" rx="3" ry="7" fill="#3E7A34"/></g></g></g>
  <circle cx="346" cy="556" r="3.2" fill="#3E7A34"/></g>
<g data-tap="zenGravel"><rect x="0" y="656" width="400" height="44" fill="transparent"/>
  <path d="M76 668 H324 M70 680 H330 M76 692 H324" stroke="#E0D2BE" stroke-width="2.2" stroke-linecap="round"/>
  ${[[38, 680], [362, 682]].map(([x, y]) => `<g class="lcg-ring" fill="none" stroke="#E0D2BE" stroke-width="2.2"><ellipse cx="${x}" cy="${y}" rx="32" ry="15"/><ellipse cx="${x}" cy="${y}" rx="23" ry="10.5"/></g>${rock(x, y, 13)}`).join('')}
  <g fill="none" stroke="#CDBBA2" stroke-width="2.4" stroke-linecap="round">${[666, 678, 690].map((y, i) => `<path class="lcg-wave lcg-w${i}" d="M110 ${y} q15 -5 30 0 t30 0 t30 0 t30 0 t30 0 t30 0"/>`).join('')}</g>
  <g class="lcg-carrot" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M172 680 Q180 668 202 670 L238 680 L202 690 Q180 692 172 680Z" stroke="#F0A35E" stroke-width="3"/>
    <path d="M190 674 l3 5 M206 672 l3 5 M220 677 l3 4" stroke="#F0A35E" stroke-width="2.4"/><path d="M172 680 l-12 -10 M172 680 l-14 -1 M172 680 l-11 8" stroke="#7DBB6A" stroke-width="3"/></g></g>
</svg>`,

  css: `
.lcg-rip.amb { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgRip 3.2s ease-out infinite; }
.lcg-rip.lcg-rip2 { animation-delay: -1.6s; }
@keyframes lcgRip { 0% { transform: scale(.3); opacity: .9; } 100% { transform: scale(1.5); opacity: 0; } }
.lcg-drift.amb { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgDrift 6s ease-in-out infinite; }
.lcg-drift.lcg-d1 { animation-duration: 7s; animation-delay: -2s; }
.lcg-drift.lcg-d2 { animation-duration: 5.5s; animation-delay: -4s; }
@keyframes lcgDrift { 50% { transform: translate(7px, 1px) rotate(7deg); } }
.lcg-swim { transform-box: fill-box; transform-origin: 50% 50%; }
[data-tap="zenKoi"].tapped { animation: lcgPress .5s ease-in-out; }
@keyframes lcgPress { 40% { transform: scale(1.06); } }
[data-tap="zenKoi"].lcggather .lcg-s0 { animation: lcgGather0 2.6s ease-in-out; }
[data-tap="zenKoi"].lcggather .lcg-s1 { animation: lcgGather1 2.6s ease-in-out; }
[data-tap="zenKoi"].lcggather .lcg-s2 { animation: lcgGather2 2.6s ease-in-out; }
@keyframes lcgGather0 { 35%, 70% { transform: translate(28px, 26px); } }
@keyframes lcgGather1 { 35%, 70% { transform: translate(2px, 18px); } }
@keyframes lcgGather2 { 35%, 70% { transform: translate(34px, -22px); } }
[data-tap="zenKoi"].lcgflick .lcg-swim { animation: lcgFlick .25s ease-in-out 4 alternate; }
@keyframes lcgFlick { to { transform: rotate(16deg); } }
.lcg-jumper { opacity: 0; }
[data-tap="zenKoi"].lcgjump .lcg-jumper { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgJump 1.4s ease-in-out; }
[data-tap="zenKoi"].lcgjump .lcg-s0 { animation: lcgAway 1.4s linear; }
@keyframes lcgJump { 0% { opacity: 0; transform: rotate(12deg); } 8% { opacity: 1; } 50% { transform: translate(16px, -42px) rotate(30deg) scale(1.6); } 90% { opacity: 1; } 100% { opacity: 0; transform: translate(34px, 24px) rotate(50deg) scale(.8); } }
@keyframes lcgAway { 6%, 94% { opacity: 0; } }
.lcg-light, .lcg-halo, .lcg-moth, .lcg-pour { opacity: 0; }
.lcg-lamp.lcglit .lcg-light, .lcg-lamp.lcglit .lcg-halo, .lcg-lamp.lcgmoth .lcg-light, .lcg-lamp.lcgmoth .lcg-halo { animation: lcgLit 4.2s ease-in-out; }
@keyframes lcgLit { 12%, 85% { opacity: 1; } }
.lcg-lamp.lcgmoth .lcg-moth { animation: lcgMoth 4.2s ease-in-out; }
.lcg-lamp.lcgmoth .lcg-wing { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgFlap .12s ease-in-out infinite alternate; }
@keyframes lcgMoth { 0% { opacity: 0; transform: translate(-46px, -50px); } 15% { opacity: 1; transform: translate(-18px, -16px); } 30% { transform: translate(18px, -20px); }
  45% { transform: translate(20px, 12px); } 60% { transform: translate(-16px, 14px); } 75% { transform: translate(-20px, -12px); } 88% { opacity: 1; transform: translate(6px, -24px); } 100% { opacity: 0; transform: translate(50px, -60px); } }
@keyframes lcgFlap { to { transform: scaleX(.35); } }
.lcg-crown.lcgshake { transform-box: fill-box; transform-origin: 50% 100%; animation: lcgShake .3s ease-in-out 4 alternate; }
@keyframes lcgShake { from { transform: rotate(-2.5deg); } to { transform: rotate(2.5deg); } }
.lcg-petals { pointer-events: none; }
.lcg-pf.amb { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgPetal 7s linear infinite; }
.lcg-pf.lcg-pf1 { animation-delay: -1.4s; } .lcg-pf.lcg-pf2 { animation-delay: -2.8s; } .lcg-pf.lcg-pf3 { animation-delay: -4.2s; } .lcg-pf.lcg-pf4 { animation-delay: -5.6s; }
@keyframes lcgPetal { 0% { transform: translate(0, 0) rotate(0); opacity: 0; } 10%, 80% { opacity: 1; } 100% { transform: translate(-44px, 150px) rotate(320deg); opacity: 0; } }
.lcg-tube { transform-box: fill-box; transform-origin: 50% 50%; transform: rotate(-28deg); }
.lcg-bob.amb { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgBob 4.5s ease-in-out infinite; }
@keyframes lcgBob { 50% { transform: rotate(4deg); } }
.lcg-drip.amb { animation: lcgDrip .5s linear infinite; }
@keyframes lcgDrip { to { stroke-dashoffset: -8; } }
[data-tap="zenFountain"].lcgtip .lcg-tube { animation: lcgTip 2.6s ease-in-out; }
@keyframes lcgTip { 0% { transform: rotate(-28deg); } 52% { transform: rotate(-18deg); } 60%, 78% { transform: rotate(26deg); } 86% { transform: rotate(-33deg); } 92% { transform: rotate(-25deg); } 100% { transform: rotate(-28deg); } }
[data-tap="zenFountain"].lcgtip .lcg-pour { animation: lcgPour 2.6s linear; }
@keyframes lcgPour { 0%, 60% { opacity: 0; } 63%, 78% { opacity: 1; } 82%, 100% { opacity: 0; } }
[data-tap="zenFountain"].lcgknock .lcg-tube { animation: lcgKnock .5s ease-out; }
@keyframes lcgKnock { 30% { transform: rotate(-12deg); } 65% { transform: rotate(-33deg); } 100% { transform: rotate(-28deg); } }
[data-tap="zenGravel"].tapped { animation: lcgSink .4s ease-in-out; }
@keyframes lcgSink { 40% { transform: translateY(2px); } }
.lcg-wave { stroke-dasharray: 200; stroke-dashoffset: 200; }
[data-tap="zenGravel"].lcgrake .lcg-wave { animation: lcgWave 4.4s ease-in-out forwards; }
[data-tap="zenGravel"].lcgrake .lcg-w1 { animation-delay: .4s; }
[data-tap="zenGravel"].lcgrake .lcg-w2 { animation-delay: .8s; }
@keyframes lcgWave { 0% { stroke-dashoffset: 200; opacity: 1; } 45%, 85% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
.lcg-carrot path { stroke-dasharray: 160; stroke-dashoffset: 160; }
[data-tap="zenGravel"].lcgcarrot .lcg-carrot path { animation: lcgDraw 5s ease-in-out forwards; }
@keyframes lcgDraw { 0% { stroke-dashoffset: 160; opacity: 1; } 40%, 85% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
[data-tap="zenGravel"].lcgcalm .lcg-ring { transform-box: fill-box; transform-origin: 50% 50%; animation: lcgRing 3.6s ease-in-out 2; }
@keyframes lcgRing { 50% { transform: scale(1.14); opacity: .5; } }
`,

  props: () => ({
    castleGardenRake: { slot: 'hand', art: () => `<path d="M172 54 L150 200" stroke="#C98E5A" stroke-width="5" stroke-linecap="round"/><path d="M170 66 l-2 12" stroke="#fff" stroke-width="2" opacity=".5"/>
      <rect x="122" y="196" width="56" height="7" rx="3" fill="#A86B3C"/><path d="M126 203 v8 M136 203 v8 M146 203 v8 M156 203 v8 M166 203 v8 M175 203 v8" stroke="#A86B3C" stroke-width="3" stroke-linecap="round"/>` },
    castleGardenPetalNose: { slot: 'nose', art: () => `<g transform="translate(100 99) rotate(-24) scale(1.4)"><path d="M0 8 C-9 2 -8 -8 -3 -9 L0 -5 L3 -9 C8 -8 9 2 0 8Z" fill="#FFB3D6" stroke="#FF8DBB" stroke-width="1"/>
      <path d="M0 6 V-3" stroke="#FF8DBB" stroke-width="1" stroke-linecap="round"/><ellipse cx="-3" cy="0" rx="1.6" ry="3" fill="#fff" opacity=".6"/></g>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, nose, mouth, feet, paw } = k;
    // the middle of a part of a thing (the lantern's window, the basin), or where it was touched
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };

    // the koi pond: the koi swim over, one jumps (a koi that leaps a waterfall becomes a dragon), a splash; stepping stones
    const gather = (c) => {
      api.hop(c.el, 'lcggather', 2600);
      [0, 260, 520].forEach((d) => setTimeout(() => sfx.bubble(), d));
      const [x, y] = part(c, '.lcg-s1');
      setTimeout(() => api.fxAt(x, y, ['💧', '✨'], 4, 'spark'), 900);
      setTimeout(() => { if (api.free()) { pose('happy', 1600, 'wave', 1200); line('castleGardenKoi', 1); } }, 400);
    };
    const jump = (c) => {
      api.hop(c.el, 'lcgjump', 1500);
      sfx.whoosh();
      const [x, y] = part(c, '.lcg-splash');
      setTimeout(() => { sfx.splash(); api.fxAt(x, y, ['💦'], 4, 'spark'); }, 1200);
      pose('surprised', 1200, 'startle', 1100);
      setTimeout(() => { if (api.free()) { api.setTemp('laugh', 1500); line('castleGardenKoiJump', 1); } }, 600);
    };
    R.zenKoi = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['💧'], 3, 'spark'); },
      tap: who(oneOf('castleGardenKoi', gather, jump)),
      // a koi flicks its tail, and Lucky gets soaked
      double: who((c) => {
        const a = begin('lcgSplash');
        api.hop(c.el, 'lcgflick', 1000);
        sfx.splash();
        const from = part(c, '.lcg-s1');
        [0.3, 0.5, 0.7].forEach((fx, i) => at(a, i * 90, () => fly('💧', from, api.luckyPoint(fx, 0.3), 500, { arc: 60, size: 22 })));
        at(a, 550, () => { sfx.splash(); line('castleGardenKoiSplash', 1, 0); k.getWet(a, 1800); });
        at(a, 3700, end);
      }),
      // hop, hop, hop across the stepping stones; a wobble on the last one, and a koi jumps by
      long: who((c) => {
        const a = begin('lcgStones');
        [42, 35, 28].forEach((p, i) => at(a, i * 650, () => { go(p, 450); pose('happy', 700, 'hop', 600); sfx.boing(); api.fxAt(...feet(), ['💦'], 2, 'spark'); }));
        at(a, 2000, () => { pose('surprised', 1700); hold(a, 'balance', 1700); line('castleGardenStones', 1, 0); });
        at(a, 3700, () => { api.hop(c.el, 'lcgjump', 1500); sfx.whoosh(); pose('laugh', 1500, 'binky'); api.reward(); });
        at(a, 4900, () => { const [x, y] = part(c, '.lcg-splash'); sfx.splash(); api.fxAt(x, y, ['💦'], 4, 'spark'); });
        at(a, 5300, end);
      }),
    };

    // the raked gravel: waves, a carrot drawn with the rake, crunchy steps; a quiet moment to breathe
    const raking = (a) => {
      prop('castleGardenRake', 3800);
      [0, 1300, 2600].forEach((d) => at(a, d, () => { pose(null, 0, 'sway', 1300); sfx.sniff(); }));
    };
    const rake = (c) => {
      const a = begin('lcgRake');
      raking(a);
      api.setTemp('happy', 3800);
      api.hop(c.el, 'lcgrake', 5400);
      line('castleGardenRake', 1, 0);
      at(a, 3900, end);
    };
    const carrot = (c) => {
      const a = begin('lcgCarrot');
      raking(a);
      api.setTemp('ok', 2400);
      api.hop(c.el, 'lcgcarrot', 5200);
      at(a, 2300, () => {
        const [x, y] = part(c, '.lcg-carrot');
        api.fxAt(x, y - 10, ['✨', '🥕'], 5, 'spark');
        sfx.sparkle();
        pose('laugh', 1600, 'clap', 1200);
        line('castleGardenCarrot', 1, 0);
        api.reward();
      });
      at(a, 4000, end);
    };
    R.zenGravel = {
      press: (c) => { sfx.crunch(); api.fxAt(c.x, c.y - 8, ['🪨'], 2, 'spark'); },
      tap: who(oneOf('castleGardenGravel', rake, carrot)),
      double: who(() => {
        pose('laugh', 1500, 'tapdance', 1200);
        sfx.crunch();
        setTimeout(() => sfx.crunch(), 450);
        api.fxAt(...feet(), ['🪨', '💨'], 4, 'spark');
        line('castleGardenCrunch', 1);
      }),
      // breathe in, breathe out: eyes closed, the rings round the rocks breathe too
      long: who((c) => {
        const a = begin('lcgBreathe');
        pose('sleep', 7300, 'meditate', 3600);
        api.hop(c.el, 'lcgcalm', 7300);
        line('castleGardenBreathe', 1, 0);
        [0, 1800, 3600, 5400].forEach((d, i) => at(a, d, () => { api.floatFx(...api.luckyPoint(0.5, 0.55), '', 'ripple'); if (i % 2) sfx.puff(); }));
        at(a, 3600, () => api.hop(L, 'meditate', 3600));
        at(a, 7300, () => { pose('happy', 1800, 'stretchUp', 1600); sfx.chime(); line('castleGardenCalm', 1, 0); api.boost('energy', 1); api.reward(); });
        at(a, 8700, end);
      }),
    };

    // the stone lantern: it lights up, a moth comes to the light; Lucky plays a stone lantern; fireflies
    // (two groups answer: its foot and its top, where the light is)
    const lamp = (c) => c.el.ownerSVGElement?.querySelector('.lcg-lamp') || c.el;
    const light = (c) => {
      const a = begin('lcgLight');
      api.hop(lamp(c), 'lcglit', 4200);
      sfx.chime();
      hold(a, 'glow', 2600);
      api.setTemp('happy', 2400);
      line('castleGardenLantern', 1, 0);
      at(a, 2700, end);
    };
    const moth = (c) => {
      const a = begin('lcgMoth');
      api.hop(lamp(c), 'lcgmoth', 4200);
      sfx.note(523);
      pose('ok', 2600, 'listen', 2600);
      at(a, 900, () => line('castleGardenMoth', 1, 0));
      at(a, 2700, () => pose('laugh', 1400, 'tilt', 1400));
      at(a, 3800, end);
    };
    R.zenLantern = {
      press: (c) => { sfx.tap(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('castleGardenLantern', light, moth)),
      double: who(() => {
        const a = begin('lcgStatue');
        pose('ok', 2400);
        hold(a, 'statue', 2300);
        line('castleGardenStatue', 1, 0);
        at(a, 2400, () => { L.querySelectorAll('.ear').forEach((x) => api.hop(x, 'wiggle')); sfx.boing(); pose('laugh', 1500, 'jiggle', 900); });
        at(a, 3400, end);
      }),
      long: who((c) => {
        const a = begin('lcgFireflies');
        const l = lamp(c), w = l.querySelector('.lcg-window');
        api.hop(l, 'lcglit', 4200);
        sfx.magic();
        const from = w ? centerOf(w) : [c.x, c.y], [hx, hy] = head();
        [[-90, -10], [70, -50], [100, 30], [-60, 60], [0, -80], [-110, 30], [40, 70]].forEach(([dx, dy], i) =>
          at(a, 200 + i * 160, () => fly('✨', from, [hx + dx, hy + dy], 900, { arc: 40, size: 16, stay: 1600 })));
        at(a, 600, () => { pose('stars', 2400, 'listen', 2400); line('castleGardenFireflies', 1, 0); });
        at(a, 2600, () => { hold(a, 'glow', 1300); api.hearts(hx, hy, 3); sfx.sparkle(); api.reward(); });
        at(a, 4000, end);
      }),
    };

    // the bamboo deer-scarer: it fills, tips, pours and knocks back on its stone; Lucky jumps every time
    const tip = (c) => {
      api.hop(c.el, 'lcgtip', 2700);
      const [bx, by] = part(c, '.lcg-basin');
      setTimeout(() => { sfx.splash(); api.fxAt(bx, by - 6, ['💧'], 3, 'spark'); }, 1650);
      setTimeout(() => clack(sfx), 2240);
    };
    const knock = (c) => {
      const a = begin('lcgClack');
      tip(c);
      pose('ok', 2200, 'tilt', 1400);
      at(a, 2240, () => pose('surprised', 900, 'startle', 1100));
      at(a, 2900, () => { api.setTemp('laugh', 1500); line('castleGardenClack', 1, 0); });
      at(a, 3800, end);
    };
    // he stays where he is, so the bamboo stays in sight
    const wait = (c) => {
      const a = begin('lcgWait');
      pose('ok', 3000, 'listen', 3000);
      line('castleGardenWait', 1, 0);
      at(a, 300, () => tip(c));
      at(a, 2540, () => pose('surprised', 900, 'bigjump', 1100));
      at(a, 3500, () => { api.setTemp('laugh', 1600); line('castleGardenWaitClack', 1, 0); api.reward(); });
      at(a, 4800, end);
    };
    R.zenFountain = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['💧'], 2, 'spark'); },
      tap: who(oneOf('castleGardenFountain', knock, wait)),
      // drops from the spout, caught with his tongue
      double: who((c) => {
        const a = begin('lcgSip');
        const from = part(c, '.lcg-drip');
        api.setTemp('eat', 2200);
        [0, 350, 700].forEach((d) => at(a, d, () => fly('💧', from, mouth(), 500, { arc: 50, size: 18 })));
        [500, 850, 1200].forEach((d) => at(a, d, () => sfx.lick()));
        at(a, 1300, () => { pose('happy', 1500, 'sniff', 1500); sfx.slurp(); line('castleGardenSip', 1, 0); });
        at(a, 2800, end);
      }),
      // clack, clack, clack: a bamboo drum, and Lucky dances to it
      long: who((c) => {
        const a = begin('lcgRhythm');
        const [tx, ty] = part(c, '.lcg-tube');
        line('castleGardenRhythm', 1, 0);
        [0, 600, 1200, 1800, 2400].forEach((d, i) => at(a, d, () => {
          api.hop(c.el, 'lcgknock', 500);
          clack(sfx);
          api.fxAt(tx, ty - 20, ['🎵', '🎶'], 1, 'spark');
          pose(i % 2 ? 'laugh' : 'happy', 700, i < 3 ? 'drum' : 'tapdance', 1200);
        }));
        at(a, 3000, () => { pose('laugh', 1500, 'binky'); api.reward(); });
        at(a, 4000, end);
      }),
    };

    // the cherry tree: petals fall, one lands on his nose; a twirl in a rain of petals; a hanami picnic
    // (it answers on its trunk and on its crown, two groups: the crown is the one that shakes)
    const crown = (c) => c.el.ownerSVGElement?.querySelector('.lcg-crown');
    const shake = (c) => { const e = crown(c); if (e) api.hop(e, 'lcgshake', 1300); };
    const top = (c) => { const e = crown(c); return e ? centerOf(e) : [c.x, c.y]; };
    const petals = (c) => {
      shake(c);
      api.fxAt(...top(c), ['🌸'], 10, 'drop petal-fx');
      sfx.whoosh();
      setTimeout(() => { if (api.free()) { pose('happy', 1500, 'sway', 1300); line('castleGardenPetals', 1); } }, 300);
    };
    const catchOne = (c) => {
      const a = begin('lcgNose');
      fly('🌸', top(c), nose(), 1600, { arc: -40, spin: 220, size: 20 });
      pose('ok', 1600, 'tilt', 1400);
      at(a, 1600, () => { prop('castleGardenPetalNose', 2200); pose('surprised', 2000); sfx.sparkle(); line('castleGardenNose', 1, 0); api.reward(); });
      at(a, 3800, () => { unprop('nose', true); sfx.puff(); fly('🌸', nose(), [k.sceneRect().width + 30, 60], 1100, { arc: 50, spin: 300, size: 20 }); pose('laugh', 1400, 'hop'); });
      at(a, 4400, end);
    };
    R.zenSakura = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['🌸'], 4, 'drop petal-fx'); },
      tap: who(oneOf('castleGardenSakura', petals, catchOne)),
      double: who((c) => {
        shake(c);
        const [hx, hy] = head();
        api.fxAt(hx, hy - 70, ['🌸'], 12, 'drop petal-fx');
        sfx.whoosh();
        setTimeout(() => sfx.magic(), 300);
        pose('laugh', 2000, 'pirouette', 1500);
        prop('petals', 4500);
        line('castleGardenTwirl', 1);
      }),
      long: who((c) => {
        const a = begin('lcgHanami');
        go(nextTo(c.el), 700);
        let cup = [0, 0], dango = [0, 0];
        at(a, 750, () => {
          const [fx, fy] = feet();
          cup = [fx + 66, fy - 16]; dango = [fx - 66, fy - 16];
          popUp('🍵', ...cup, 3400, 30);
          popUp('🍡', ...dango, 900, 32);
          sfx.pop();
          pose('happy', 1400, 'clap', 1000);
          line('castleGardenHanami', 1, 0);
        });
        at(a, 1600, () => fly('🍡', dango, mouth(), 600, { arc: 40, size: 30 }));
        at(a, 2200, () => { api.setTemp('eat', 1800); sfx.crunch(); api.boost('hunger', 1); api.fxAt(...head(), ['🌸'], 6, 'drop petal-fx'); });
        at(a, 3300, () => { fly('🍵', cup, paw(), 500, { size: 26 }); sfx.slurp(); pose('happy', 1500, 'sway', 1300); api.reward(); });
        at(a, 4600, end);
      }),
    };
  },

  visitors: [
    { e: '🌸', w: 3, path: 'fall', end: ['castleGardenPetal', 'wish'] },
    { e: '🐦', w: 2, path: 'glide', end: ['sing', 'feather'], flip: true },
  ],

  endings: (k) => ({
    // a petal floats down onto his nose; he blows it away
    castleGardenPetal: (a, x, y) => {
      const { at, fly, prop, unprop, pose, sfx, line, nose, sceneRect } = k;
      fly('🌸', [x, y], nose(), 900, { arc: 30, spin: 160, size: 20 });
      at(a, 900, () => { prop('castleGardenPetalNose', 2200); pose('surprised', 1800, 'tilt', 1400); line('castleGardenPetalVisit', 1, 0); });
      at(a, 3100, () => { unprop('nose', true); sfx.puff(); fly('🌸', nose(), [sceneRect().width + 30, 60], 1100, { arc: 50, spin: 300, size: 20 }); pose('laugh', 1400, 'hop'); });
    },
  }),
};
