// Dino valley (level 41): a friendly volcano that blows smoke rings and erupts popcorn, a long-necked brachiosaurus
// (a slide, a sneeze, a nose-boop), a big egg with a baby dinosaur inside, a rock with a fossil bone to dig out, and
// giant footprints across the valley. Guests: a baby brontosaurus, a little T. rex and a falling pterodactyl egg.

const cheep = (sfx) => { sfx.note(1320); setTimeout(() => sfx.note(1660), 110); setTimeout(() => sfx.note(1480), 220); };
const roar = (sfx) => { sfx.rumble(); setTimeout(() => sfx.note(220), 150); setTimeout(() => sfx.note(175), 330); };

// a fern: fronds of little leaflets fanning out from one point
const frond = (len, rot, c, n = 7) => {
  let leaves = '';
  for (let i = 1; i <= n; i++) {
    const y = (-len * i) / (n + 1), w = 11 * (1 - i / (n + 2)) + 3;
    leaves += `<path d="M0 ${y.toFixed(1)} q${(-w * 0.5).toFixed(1)} ${(-w * 0.1).toFixed(1)} ${-w.toFixed(1)} ${(-w * 0.7).toFixed(1)} q${(w * 0.7).toFixed(1)} ${(w * 0.05).toFixed(1)} ${w.toFixed(1)} ${(w * 0.7).toFixed(1)}z`
      + `M0 ${y.toFixed(1)} q${(w * 0.5).toFixed(1)} ${(-w * 0.1).toFixed(1)} ${w.toFixed(1)} ${(-w * 0.7).toFixed(1)} q${(-w * 0.7).toFixed(1)} ${(w * 0.05).toFixed(1)} ${-w.toFixed(1)} ${(w * 0.7).toFixed(1)}z"/>`;
  }
  return `<g transform="rotate(${rot})"><path d="M0 0 V${-len}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><g fill="${c}">${leaves}</g></g>`;
};
const fern = (x, y, s = 1, c = '#4FAE58', flip = 1) => `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})" pointer-events="none">${frond(42, -60, c, 5)}${frond(56, -32, c)}${frond(64, -6, c)}${frond(56, 22, c)}${frond(42, 50, c, 5)}</g>`;
// a tree fern far away: a thin trunk and a crown of fronds
const treeFern = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" pointer-events="none"><path d="M0 0 Q-4 -34 2 -66" stroke="#B08A68" stroke-width="7" fill="none" stroke-linecap="round"/>
  <g transform="translate(2 -66)">${frond(40, -84, c, 6)}${frond(44, -44, c)}${frond(46, -6, c)}${frond(44, 34, c)}${frond(40, 76, c, 6)}</g></g>`;
// a three-toed footprint pressed into the grass
const print = (x, y, r) => `<g class="zd-print" transform="translate(${x} ${y}) rotate(${r})"><g fill="#6E9F45">
  <ellipse cx="0" cy="7" rx="10" ry="8.5"/><ellipse cx="-11" cy="-8" rx="4.6" ry="9.5" transform="rotate(-26 -11 -8)"/><ellipse cx="0" cy="-13" rx="4.8" ry="10.5"/>
  <ellipse cx="11" cy="-8" rx="4.6" ry="9.5" transform="rotate(26 11 -8)"/></g><ellipse cx="0" cy="9" rx="6" ry="4" fill="#64933E"/></g>`;

// drawn guests and treats that fly about (in a fly span: 1em is its size)
const PTERO = `<svg viewBox="-50 -34 100 64" width="1.6em" height="1em" style="display:block;overflow:visible">
<g class="zd-pw"><path d="M-4 -4 Q-20 -30 -48 -18 Q-36 -12 -32 -4 Q-20 -8 -6 6Z" fill="#F08A63"/><path d="M-10 -6 Q-24 -16 -38 -14" stroke="#D9714D" stroke-width="1.6" fill="none"/></g>
<g class="zd-pw zd-pw2"><path d="M4 -4 Q22 -32 48 -20 Q36 -12 32 -4 Q20 -8 6 6Z" fill="#FFA47E"/><path d="M10 -6 Q24 -18 38 -16" stroke="#E5875E" stroke-width="1.6" fill="none"/></g>
<ellipse cx="0" cy="4" rx="9" ry="12" fill="#FFB892"/><ellipse cx="-1" cy="8" rx="5.5" ry="7" fill="#FFE3CC"/>
<path d="M-3 15 l-3 6 M3 15 l2 6" stroke="#E5875E" stroke-width="2.2" stroke-linecap="round"/>
<path d="M2 -16 L20 -25 L6 -8Z" fill="#F08A63"/><circle cx="-4" cy="-12" r="8.5" fill="#FFB892"/><path d="M-10 -15 L-32 -9 L-10 -7Z" fill="#FFD36E"/>
<circle cx="-6" cy="-14" r="2.2" fill="#2E2A33"/><circle cx="-5.3" cy="-14.8" r=".8" fill="#fff"/><ellipse cx="-2" cy="-8" rx="2.6" ry="1.6" fill="#FF8FA3" opacity=".75"/>
</svg>`;
// the baby dinosaur in its eggshell pants (faces left; flip: faces right)
const baby = (flip) => `<svg viewBox="-24 -24 48 46" width="1.05em" height="1em" style="display:block${flip ? ';transform:scaleX(-1)' : ''}">
<path d="M8 4 Q22 2 23 -8 Q22 10 6 12Z" fill="#86D27F"/><rect x="-7" y="10" width="5.5" height="10" rx="2.7" fill="#73C06C"/><rect x="4" y="10" width="5.5" height="10" rx="2.7" fill="#73C06C"/>
<ellipse cx="2" cy="5" rx="12" ry="9.5" fill="#86D27F"/><path d="M-10 9 l3 -4 3 4 3 -4 3 4 3 -4 3 4 3 -4 3 4 Q2 20 -10 9Z" fill="#FFF3DA"/>
<path d="M-6 -15 l3 -6 3 6z M1 -11 l3 -6 3 6z M7 -5 l3 -6 3 5z" fill="#FFB45E"/><ellipse cx="-8" cy="-6" rx="10" ry="8.5" fill="#86D27F"/>
<circle cx="-11" cy="-8" r="2.2" fill="#2E2A33"/><circle cx="-10.3" cy="-8.7" r=".8" fill="#fff"/><ellipse cx="-7" cy="-3" rx="2.4" ry="1.5" fill="#FF9FB0" opacity=".7"/>
<path d="M-17 -3 q3 2.4 6 0" stroke="#3F8A44" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`;
const CORN = `<svg viewBox="-12 -12 24 24" width="1em" height="1em" style="display:block"><g fill="#FFF9EC" stroke="#EBCB8B" stroke-width="1.2">
<circle cx="-4.5" cy="-1" r="6"/><circle cx="4" cy="-3.5" r="6"/><circle cx="1" cy="4" r="6.5"/></g><path d="M-2 7 q3 3 6 0" fill="#FFC94D"/></svg>`;
const AMMO = (s = 1) => `<g transform="scale(${s})"><circle r="16" fill="#E9CC9E"/><path d="M-13 0 a13 13 0 0 1 26 0 a10 10 0 0 1 -20 0 a7 7 0 0 1 14 0 a4 4 0 0 1 -8 0" stroke="#B98E5A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${[0, 40, 80, 120, 160, 200, 240].map((a) => `<path d="M0 -13 v4" stroke="#CDA772" stroke-width="1.6" transform="rotate(${a})"/>`).join('')}</g>`;
const ammoArt = `<svg viewBox="-18 -18 36 36" width="1em" height="1em" style="display:block">${AMMO()}</svg>`;
const flipped = (e) => `<span style="display:inline-block;transform:scaleX(-1)">${e}</span>`;
// fly a drawing instead of an emoji
const flyArt = (fly, art, from, to, ms, o) => { const s = fly('', from, to, ms, o); s.innerHTML = art; return s; };

// the egg: an egg shape cut in two along a zigzag, so its top can come off
const EGG = 'M54 490 C74 490 85 518 85 540 C85 560 71 572 54 572 C37 572 23 560 23 540 C23 518 34 490 54 490Z';
const ZZ = Array.from({ length: 13 }, (_, i) => `${16 + i * 6.5} ${i % 2 ? 521 : 529}`);
const eggSpots = '<ellipse cx="40" cy="548" rx="6.5" ry="4.8" fill="#8FD3B6"/><ellipse cx="67" cy="556" rx="5" ry="4" fill="#F7B58A"/><ellipse cx="72" cy="534" rx="4" ry="3.2" fill="#8FD3B6"/>'
  + '<ellipse cx="54" cy="563" rx="3.4" ry="2.6" fill="#8FD3B6"/><ellipse cx="62" cy="504" rx="5" ry="4" fill="#F7B58A"/><ellipse cx="44" cy="514" rx="4" ry="3" fill="#8FD3B6"/>';

export default {
  id: 'dino',
  level: 41,
  name: ['Долина динозавров', 'Dino valley'],
  emoji: ['🦕', '🦖', '🌋', '🥚', '🦴'],
  spots: { L: [24, 642], R: [378, 650], l: [74, 690], r: [328, 692], sky: 300 },
  arrive: [
    ['Долина динозавров! Не бойся, они тут все добрые.', "Dino valley! Don't worry, they're all friendly here."],
    ['Ого, вулкан и динозавры! Хорошо, что они едят папоротник, а не кроликов.', 'Whoa, a volcano and dinosaurs! Good thing they eat ferns, not bunnies.'],
  ],

  lines: {
    dinoRings: [['Вулкан пускает колечки дыма! А я так не умею… Пф-ф!', "The volcano is blowing smoke rings! I can't do that… Pfff!"], ['Колечко, ещё колечко! Вулкан, да ты фокусник!', 'One ring, two rings! Volcano, you are a magician!']],
    dinoPopcorn: [['Вулкан извергает попкорн! Лучший вулкан на свете!', 'The volcano is erupting popcorn! Best volcano ever!'], ['Попкорн прямо с неба! Ловлю ртом. Ам!', 'Popcorn straight from the sky! Catching it in my mouth. Yum!'], ['Это не лава, это попкорн! Тёпленький и хрустящий.', "That's not lava, it's popcorn! Warm and crunchy."]],
    dinoHic: [['Вулкан икает! Ик! Ой… теперь и я тоже.', 'The volcano has hiccups! Hic! Oh no… now I have them too.']],
    dinoMarsh: [['Поджарю зефирку на тёплом вулкане. Мм, с хрустящей корочкой!', "I'll toast a marshmallow on the warm volcano. Mmm, crispy!"]],
    dinoSlide: [['Ух! Шея динозавра — лучшая горка в долине!', "Wheee! A dinosaur's neck is the best slide in the valley!"], ['Залез по шее… и вжух вниз! Ещё раз!', 'Up the neck… and whoosh, down I go! Again!']],
    dinoSneeze: [['Будь здоров, великан! Ну и ветер от твоего чиха!', 'Bless you, big guy! What a windy sneeze!'], ['Апчхи! Динозавр чихнул, а листик прилетел ко мне.', 'Achoo! The dinosaur sneezed, and a leaf landed on me.']],
    dinoBoop: [['Буп! Динозавр чмокнул меня в макушку.', 'Boop! The dinosaur kissed the top of my head.'], ['Буп! Привет, длинношеий друг.', 'Boop! Hello, my long-necked friend.']],
    dinoFeed: [['Брахиозавр съедал сотни килограммов листьев в день! Вот это салатик.', 'A brachiosaurus ate hundreds of kilos of leaves a day! That is a lot of salad.']],
    dinoHatch: [['Вылупился! Привет, малыш! Я твой… дядя Лаки.', "It hatched! Hello, little one! I'm your… Uncle Lucky."], ['Тук-тук! Кто там? Динозаврик!', "Knock-knock! Who's there? A baby dinosaur!"]],
    dinoWobble: [['Яйцо качается! Кто-то там очень торопится.', 'The egg is wobbling! Someone in there is in a hurry.'], ['Ой, покатилось! Стой, яйцо, ты куда?', 'Whoa, it is rolling! Stop, egg, where are you going?']],
    dinoBabyHop: [['Он думает, что я его мама! Ладно, буду мамой-кроликом.', "He thinks I'm his mum! Fine, I'll be a bunny mum."]],
    dinoWarm: [['Тсс, я грею яйцо. Как наседка, только пушистее.', "Shh, I'm keeping the egg warm. Like a hen, only fluffier."]],
    dinoBone: [['Кость динозавра! Любая собака обзавидуется.', 'A dinosaur bone! Any dog would be so jealous.'], ['Нашёл косточку! Ей больше шестидесяти миллионов лет.', "I found a bone! It's more than sixty million years old."]],
    dinoAmmonite: [['Аммонит! Ему миллионы лет. Он старше всех учителей вместе взятых!', "An ammonite! It's millions of years old. Older than all the teachers put together!"]],
    dinoLizard: [['Живой динозавр! Ну… ящерка. Почти считается.', 'A real live dinosaur! Well… a lizard. Close enough.']],
    dinoPrints: [['Прыг в след! Моя лапка поместилась в один его палец.', 'Hop into the footprint! My whole foot fits in one of its toes.'], ['Прыг, прыг, прыг! Иду по следам динозавра.', 'Hop, hop, hop! Following the dinosaur footprints.']],
    dinoTiny: [['Чьи это следы? Рядом с ними я совсем крошечный!', 'Whose footprints are these? Next to them I feel tiny!']],
    dinoStomp: [['Топ-топ! Я тоже динозавр. Очень пушистый.', "Stomp, stomp! I'm a dinosaur too. A very fluffy one."]],
    dinoRex: [['Р-р-р! Встречайте: Лакизавр Рекс!', 'Rawr! Meet Luckysaurus Rex!']],
    dinoHug: [['Маленький бронтозаврик! Он хочет обниматься.', 'A baby brontosaurus! He wants a cuddle.']],
    dinoRoar: [['Тираннозаврик хочет дать пять… а лапки коротковаты!', 'The little T. rex wants a high five… but his arms are too short!']],
    dinoPtero: [['Поймал! Мама-птеродактиль, вот твоё яйцо!', 'Got it! Mummy pterodactyl, here is your egg!']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC08F"/><stop offset=".55" stop-color="#FFE4B8"/><stop offset=".75" stop-color="#FFF2D6"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF3A0"/><stop offset="1" stop-color="#FFF3A0" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}v"><stop offset="0" stop-color="#FFA060" stop-opacity=".9"/><stop offset="1" stop-color="#FFA060" stop-opacity="0"/></radialGradient>
<clipPath id="${u}et"><path d="M0 470 H110 V${ZZ[12].split(' ')[1]} L${[...ZZ].reverse().join(' L')} L0 ${ZZ[0].split(' ')[1]}Z"/></clipPath>
<clipPath id="${u}eb"><path d="M0 600 H110 V${ZZ[12].split(' ')[1]} L${[...ZZ].reverse().join(' L')} L0 ${ZZ[0].split(' ')[1]}Z"/></clipPath></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="338" cy="234" r="46" fill="url(#${u}g)"/><circle cx="338" cy="234" r="23" fill="#FFE070"/></g>
<path d="M0 404 Q46 372 104 394 Q150 410 200 400 Q262 384 318 398 Q364 410 400 386 V700 H0Z" fill="#F4CDA6"/>
${treeFern(104, 444, 0.78, '#8FC27A')}${treeFern(312, 440, 0.7, '#8FC27A')}
<g data-tap="volcano"><rect x="116" y="180" width="180" height="240" fill="transparent"/>
  <ellipse class="zd-glow" cx="206" cy="306" rx="64" ry="36" fill="url(#${u}v)"/>
  <g class="zd-smoke" fill="#FFF8F0">${[0, 1, 2].map(() => '<g class="amb" opacity=".8"><circle cx="200" cy="292" r="7"/><circle cx="208" cy="287" r="9"/><circle cx="215" cy="293" r="6"/></g>').join('')}</g>
  <g class="zd-rings">${[0, 1, 2].map(() => '<ellipse class="zd-ring" cx="206" cy="298" rx="14" ry="5" fill="none" stroke="#FFFDF8" stroke-width="4"/>').join('')}</g>
  <g class="zd-cone">
    <path d="M104 440 C142 398 165 350 180 314 Q206 302 232 314 C247 350 270 398 308 440Z" fill="#B97A6C"/>
    <path d="M104 440 C142 398 165 350 180 314 Q188 310 196 309 C182 350 164 398 148 440Z" fill="#CE978A"/>
    <path d="M308 440 C270 398 247 350 232 314 Q228 312 224 311 C238 356 260 402 282 440Z" fill="#A2685C"/>
    <path d="M180 314 Q206 302 232 314 L237 324 Q234 335 228 326 Q224 341 217 328 Q211 339 205 328 Q199 343 193 328 Q187 337 183 326 Q177 333 175 323Z" fill="#FF8E5E"/>
    <path d="M187 316 Q206 309 225 316" stroke="#FFC08F" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse class="zd-crater" cx="206" cy="311" rx="24" ry="6" fill="#7A4B44"/><ellipse cx="206" cy="312" rx="16" ry="3.4" fill="#FF9E6A"/>
    <g class="zd-shut" stroke="#5B3530" stroke-width="3" fill="none" stroke-linecap="round"><path d="M184 368 q6 5 12 0"/><path d="M216 368 q6 5 12 0"/></g>
    <g class="zd-open"><circle cx="190" cy="368" r="5.2" fill="#3A2420"/><circle cx="222" cy="368" r="5.2" fill="#3A2420"/><circle cx="191.8" cy="366.2" r="1.7" fill="#fff"/><circle cx="223.8" cy="366.2" r="1.7" fill="#fff"/></g>
    <ellipse cx="177" cy="381" rx="8" ry="4.5" fill="#FF9B8A" opacity=".6"/><ellipse cx="235" cy="381" rx="8" ry="4.5" fill="#FF9B8A" opacity=".6"/>
    <path d="M198 382 q8 7 16 0" stroke="#5B3530" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g></g>
<path d="M0 434 Q100 410 200 428 T400 420 V700 H0Z" fill="#BADB80"/>
${fern(92, 400, 0.8, '#5FB560')}
<g data-tap="fossil"><rect x="2" y="370" width="104" height="100" fill="transparent"/>
  <ellipse cx="54" cy="466" rx="50" ry="6" fill="#000" opacity=".12"/>
  <path d="M6 466 C0 434 12 398 42 388 C68 378 96 390 102 416 C108 440 104 460 96 466Z" fill="#C4AE9B"/>
  <path d="M12 432 C14 406 32 392 56 390 C40 398 26 410 20 434Z" fill="#D9C8B6"/>
  <path d="M96 466 C104 446 104 428 98 414 C100 440 90 458 66 466Z" fill="#AF9886"/>
  <path d="M76 448 l6 -5 7 3 M12 454 l9 2 M44 400 l6 4" stroke="#A48D7B" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g class="zd-ammo"><g transform="translate(30 444)"><circle r="11" fill="#B39C89"/><path d="M-9 0 a9 9 0 0 1 18 0 a7 7 0 0 1 -14 0 a5 5 0 0 1 10 0 a3 3 0 0 1 -6 0" stroke="#8E7967" stroke-width="1.8" fill="none"/></g></g>
  <g transform="translate(66 420) rotate(-22)"><ellipse cx="0" cy="1" rx="27" ry="10" fill="#A8917E"/>
    <g class="zd-bone"><g fill="#FFF5E2"><rect x="-17" y="-4.5" width="34" height="9" rx="4"/><circle cx="-18" cy="-4.5" r="5.5"/><circle cx="-18" cy="4.5" r="5.5"/><circle cx="18" cy="-4.5" r="5.5"/><circle cx="18" cy="4.5" r="5.5"/></g>
    <path d="M-14 3 H14" stroke="#EAD7B5" stroke-width="2" stroke-linecap="round"/></g></g></g>
<path d="M0 508 Q200 480 400 512 V700 H0Z" fill="#A6D06A"/>
<path d="M0 604 Q200 582 400 606 V700 H0Z" fill="#92C55C"/>
${fern(398, 470, 0.72, '#5FB560', -1)}
<g data-tap="brachio"><rect x="302" y="326" width="98" height="286" fill="transparent"/><rect x="268" y="334" width="36" height="48" fill="transparent"/>
  <ellipse cx="352" cy="606" rx="46" ry="7" fill="#000" opacity=".12"/>
  <path d="M380 516 C398 530 400 572 386 598 C383 603 377 600 379 594 C390 568 386 544 366 534Z" fill="#6DBBA6"/>
  <rect x="318" y="548" width="15" height="54" rx="7" fill="#5FAE98"/><rect x="362" y="548" width="15" height="54" rx="7" fill="#5FAE98"/>
  <g class="zd-neck"><g class="zd-sway amb">
    <path d="M334 524 C318 474 298 424 306 376" stroke="#7CCBB4" stroke-width="24" fill="none" stroke-linecap="round"/>
    <g fill="#62B49B"><ellipse cx="322" cy="470" rx="4" ry="3"/><ellipse cx="312" cy="438" rx="3.4" ry="2.6"/><ellipse cx="312" cy="406" rx="3" ry="2.4"/></g>
    <g class="zd-bhead"><path d="M282 352 q14 -16 28 -2" fill="#7CCBB4"/><ellipse cx="296" cy="364" rx="23" ry="15" fill="#7CCBB4"/>
      <ellipse class="zd-blink amb" cx="300" cy="358" rx="4" ry="4.2" fill="#2E2A33"/><circle cx="301.4" cy="356.4" r="1.4" fill="#fff"/>
      <circle cx="278" cy="359" r="1.8" fill="#4E9C86"/><path d="M279 369 q8 6 17 1" stroke="#4E9C86" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="305" cy="368" rx="5" ry="3" fill="#FF9FB0" opacity=".7"/></g>
  </g></g>
  <ellipse cx="352" cy="532" rx="42" ry="30" fill="#7CCBB4"/>
  <path d="M316 546 Q352 566 388 546 Q380 562 352 563 Q324 562 316 546Z" fill="#B5E6D4"/>
  <g fill="#62B49B"><ellipse cx="352" cy="514" rx="7" ry="4.5"/><ellipse cx="372" cy="526" rx="5" ry="3.5"/><ellipse cx="335" cy="521" rx="4" ry="3"/></g>
  <rect x="330" y="550" width="17" height="54" rx="8" fill="#7CCBB4"/><rect x="372" y="550" width="17" height="54" rx="8" fill="#7CCBB4"/>
  <path d="M334 601 h3 M340 601 h3 M376 601 h3 M382 601 h3" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>
<g data-tap="dinoEgg"><rect x="4" y="482" width="102" height="118" fill="transparent"/>
  <ellipse cx="54" cy="594" rx="48" ry="6" fill="#000" opacity=".12"/>
  ${fern(14, 580, 0.42, '#4FAE58')}${fern(94, 580, 0.42, '#4FAE58', -1)}
  <ellipse cx="54" cy="570" rx="46" ry="13" fill="#A97A49"/>
  <g class="zd-wob amb"><g class="zd-egg">
    <g class="zd-baby"><path d="M44 516 l4 -8 4 8z M52 513 l4 -9 4 9z M60 516 l4 -8 4 8z" fill="#FFB45E"/>
      <ellipse cx="54" cy="530" rx="16" ry="14" fill="#86D27F"/><ellipse cx="54" cy="537" rx="10" ry="6" fill="#C9F0B8"/>
      <circle cx="48" cy="526" r="3.2" fill="#2E2A33"/><circle cx="60" cy="526" r="3.2" fill="#2E2A33"/><circle cx="49" cy="525" r="1.1" fill="#fff"/><circle cx="61" cy="525" r="1.1" fill="#fff"/>
      <ellipse cx="43" cy="533" rx="3" ry="2" fill="#FF9FB0" opacity=".7"/><ellipse cx="65" cy="533" rx="3" ry="2" fill="#FF9FB0" opacity=".7"/>
      <path d="M50 537 q4 3 8 0" stroke="#3F8A44" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>
    <g clip-path="url(#${u}eb)"><path d="${EGG}" fill="#FFF3DA"/>${eggSpots}</g>
    <g class="zd-eggTop"><g clip-path="url(#${u}et)"><path d="${EGG}" fill="#FFF3DA"/>${eggSpots}<ellipse cx="40" cy="510" rx="5" ry="10" fill="#fff" opacity=".75" transform="rotate(20 40 510)"/></g></g>
  </g></g>
  <path d="M8 568 Q54 594 100 568 Q98 590 54 597 Q10 590 8 568Z" fill="#C8955C"/>
  <path d="M14 576 Q54 596 94 576 M22 587 Q54 600 86 587 M8 568 l-6 -5 M100 568 l6 -6 M30 584 l-8 -10 M80 584 l8 -11" stroke="#A97A49" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>
<g data-tap="tracks"><rect x="120" y="660" width="174" height="40" fill="transparent"/>${print(150, 688, 84)}${print(206, 676, 96)}${print(262, 688, 84)}</g>
${fern(-4, 702, 0.7, '#3FA050')}${fern(404, 702, 0.66, '#3FA050', -1)}
</svg>`,

  css: `
[data-tap="volcano"].tapped, [data-tap="brachio"].tapped { transform-origin: 50% 100%; animation: zdBump .6s ease-in-out; }
@keyframes zdBump { 40% { transform: scale(1.03, .97); } 70% { transform: scale(.99, 1.02); } }
@keyframes zdHold { to { opacity: 1; } }
.zd-smoke .amb { transform-box: fill-box; transform-origin: center; animation: zdSmoke 4.5s ease-out infinite; }
.zd-smoke .amb:nth-child(2) { animation-delay: -1.5s; }
.zd-smoke .amb:nth-child(3) { animation-delay: -3s; }
@keyframes zdSmoke { 0% { opacity: 0; transform: translate(0, 14px) scale(.4); } 25% { opacity: .85; } 100% { opacity: 0; transform: translate(12px, -50px) scale(1.5); } }
.zd-ring { opacity: 0; transform-box: fill-box; transform-origin: center; }
.zd-open { opacity: 0; }
.zd-glow { opacity: 0; transition: opacity .6s; }
[data-tap="volcano"].zdrings { animation: zdHold 2.7s; }
[data-tap="volcano"].zdrings .zd-ring { animation: zdRing 1.7s ease-out both; }
[data-tap="volcano"].zdrings .zd-ring:nth-child(2) { animation-delay: .45s; }
[data-tap="volcano"].zdrings .zd-ring:nth-child(3) { animation-delay: .9s; }
@keyframes zdRing { 0% { opacity: 0; transform: translateY(0) scale(.5); } 15% { opacity: .95; } 100% { opacity: 0; transform: translateY(-120px) scale(2.4); } }
[data-tap="volcano"].zderupt { animation: zdHold 3.4s; }
[data-tap="volcano"].zderupt .zd-cone { transform-box: fill-box; transform-origin: 50% 100%; animation: zdErupt 1.8s ease-in-out; }
@keyframes zdErupt { 0%, 100% { transform: none; } 8%, 24%, 40% { transform: translateX(-2px); } 16%, 32% { transform: translateX(2px); }
  50% { transform: scale(1.05, .93); } 60% { transform: scale(.96, 1.07) translateY(-4px); } 75% { transform: none; } }
[data-tap="volcano"].zderupt .zd-glow, [data-tap="volcano"].zdwarm .zd-glow { opacity: 1; }
[data-tap="volcano"].zderupt .zd-shut, [data-tap="volcano"].zdhic .zd-shut { opacity: 0; }
[data-tap="volcano"].zderupt .zd-open, [data-tap="volcano"].zdhic .zd-open { opacity: 1; }
[data-tap="volcano"].zdhic { animation: zdHold 1.9s; }
[data-tap="volcano"].zdhic .zd-cone { transform-box: fill-box; transform-origin: 50% 100%; animation: zdHic .6s ease-out 3; }
@keyframes zdHic { 30% { transform: scale(.97, 1.05) translateY(-3px); } 60% { transform: scale(1.02, .98); } }
[data-tap="volcano"].zdwarm { animation: zdHold 2.6s; }
.zd-neck, .zd-sway { transform-box: view-box; transform-origin: 332px 522px; }
.zd-sway.amb { animation: zdSway 6s ease-in-out infinite; }
@keyframes zdSway { 50% { transform: rotate(-2deg); } }
.zd-blink.amb { transform-box: fill-box; transform-origin: center; animation: zdBlink 4.6s infinite; }
@keyframes zdBlink { 0%, 92%, 100% { transform: none; } 95% { transform: scaleY(.1); } }
.zd-bhead { transform-box: fill-box; transform-origin: 85% 70%; }
[data-tap="brachio"].zdlower { animation: zdHold 2.8s; }
[data-tap="brachio"].zdlower .zd-neck { animation: zdLower 2.8s ease-in-out; }
@keyframes zdLower { 30%, 70% { transform: rotate(-30deg); } }
[data-tap="brachio"].zdbow { animation: zdHold 2.8s; }
[data-tap="brachio"].zdbow .zd-neck { animation: zdBow 2.8s ease-in-out; }
[data-tap="brachio"].zdbow .zd-bhead { animation: zdBowHead 2.8s ease-in-out; }
@keyframes zdBow { 20%, 72% { transform: rotate(-90deg); } }
@keyframes zdBowHead { 20%, 72% { transform: rotate(80deg); } }
[data-tap="brachio"].zdsneeze { animation: zdHold 1.5s; }
[data-tap="brachio"].zdsneeze .zd-bhead { animation: zdSneeze 1.5s ease-in-out; }
@keyframes zdSneeze { 35% { transform: rotate(16deg) scale(1.06); } 48% { transform: rotate(-20deg) translateX(-4px); } 64% { transform: rotate(5deg); } }
[data-tap="brachio"].zdchew { animation: zdHold 1.4s; }
[data-tap="brachio"].zdchew .zd-bhead { animation: zdChew .35s ease-in-out 4; }
@keyframes zdChew { 50% { transform: scale(1.05, .93) rotate(4deg); } }
.zd-wob.amb { transform-box: view-box; transform-origin: 54px 572px; animation: zdWob 7s ease-in-out infinite; }
@keyframes zdWob { 0%, 84%, 100% { transform: none; } 87% { transform: rotate(-5deg); } 90% { transform: rotate(4deg); } 93% { transform: rotate(-2deg); } }
.zd-egg { transform-box: view-box; transform-origin: 54px 572px; }
.zd-eggTop { transform-box: fill-box; transform-origin: center; transition: transform .35s ease-out; }
.zd-baby { transform-box: fill-box; transform-origin: 50% 100%; }
[data-tap="dinoEgg"].zdhatch { animation: zdHold 4.2s; }
[data-tap="dinoEgg"].zdhatch .zd-egg { animation: zdShake .45s ease-in-out 2; }
[data-tap="dinoEgg"].zdhatch .zd-eggTop { animation: zdTop 4.2s ease-in-out both; }
[data-tap="dinoEgg"].zdhatch .zd-baby { animation: zdBaby 4.2s ease-in-out both; }
@keyframes zdShake { 25% { transform: rotate(-7deg); } 75% { transform: rotate(7deg); } }
@keyframes zdTop { 0%, 21% { transform: none; } 28%, 84% { transform: translate(-12px, -44px) rotate(-32deg); } 96%, 100% { transform: none; } }
@keyframes zdBaby { 0%, 22% { transform: none; } 30% { transform: translateY(-22px); } 36%, 80% { transform: translateY(-17px); } 92%, 100% { transform: none; } }
[data-tap="dinoEgg"].zdwig { animation: zdHold .9s; }
[data-tap="dinoEgg"].zdwig .zd-egg { animation: zdShake .3s ease-in-out 3; }
[data-tap="dinoEgg"].zdroll { animation: zdHold 2.4s; }
[data-tap="dinoEgg"].zdroll .zd-egg { transform-origin: 54px 532px; animation: zdRoll 2.4s ease-in-out; }
@keyframes zdRoll { 10% { transform: rotate(-10deg); } 22% { transform: rotate(10deg); } 48%, 62% { transform: translate(22px, 8px) rotate(78deg); }
  70% { transform: translate(22px, 8px) rotate(70deg); } 88% { transform: translate(4px, 0) rotate(-6deg); } 100% { transform: none; } }
[data-tap="dinoEgg"].zd-out .zd-eggTop { transform: translate(-12px, -44px) rotate(-32deg); }
[data-tap="dinoEgg"].zd-out .zd-baby { visibility: hidden; }
[data-tap="fossil"].zdrock { transform-origin: 50% 100%; animation: zdRock .6s ease-in-out; }
@keyframes zdRock { 25% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } 75% { transform: rotate(-1deg); } }
[data-tap="fossil"].zd-nobone .zd-bone, [data-tap="fossil"].zd-noammo .zd-ammo { visibility: hidden; }
.zd-pw { transform-box: fill-box; transform-origin: 100% 100%; animation: zdFlap .26s ease-in-out infinite alternate; }
.zd-pw2 { transform-origin: 0 100%; }
@keyframes zdFlap { to { transform: scaleY(-.3); } }
/* the slide: tiny Lucky (scaled from his feet) walks to the tail, up onto the back, then slides down the lowered neck */
.lucky.zdclimb { animation: zdClimb 2s ease-in-out forwards; }
@keyframes zdClimb { 0% { translate: 0 0; } 12% { translate: 14% -3%; } 24% { translate: 28% 0; } 36% { translate: 42% -3%; } 48% { translate: 56% 0; }
  60% { translate: 71% -21%; } 74% { translate: 66% -32%; } 87% { translate: 59% -45%; } 100% { translate: 52% -55%; } }
.lucky.zdslide { animation: zdSlide 1.3s ease-in forwards; }
@keyframes zdSlide { 0% { translate: 52% -55%; rotate: 0deg; } 14% { translate: 50% -54%; rotate: -18deg; } 70% { translate: 6% -40%; rotate: -18deg; }
  86% { translate: 2% -6%; rotate: 0deg; } 93% { translate: 0 -4%; } 100% { translate: 0 0; rotate: 0deg; } }
.lucky.zdhop { animation: zdHop .5s cubic-bezier(.3, 1.4, .5, 1); }
@keyframes zdHop { 45% { translate: 0 -16%; } }
`,

  props: (h) => ({
    // a bone in his mouth, like a puppy
    dinoBone: { slot: 'mouth', art: () => `<g transform="translate(100 128) rotate(-6)"><g fill="#FFF5E2"><rect x="-26" y="-5" width="52" height="10" rx="5"/>
      <circle cx="-27" cy="-5" r="7"/><circle cx="-27" cy="5" r="7"/><circle cx="27" cy="-5" r="7"/><circle cx="27" cy="5" r="7"/></g>
      <path d="M-22 4 H22" stroke="#EAD7B5" stroke-width="2.4" stroke-linecap="round"/></g>` },
    dinoAmmo: { slot: 'hand', art: () => `<g transform="translate(158 156)">${AMMO(1.15)}</g>` },
    // Luckysaurus Rex: green spikes along the top of his head
    dinoHood: { slot: 'head', art: () => {
      const P = (deg, k, add = 0) => { const t = (deg * Math.PI) / 180; return `${(100 + Math.sin(t) * (55 * k + add)).toFixed(1)} ${(90 - Math.cos(t) * (47 * k + add)).toFixed(1)}`; };
      const sp = [-52, -26, 0, 26, 52].map((d, i) => `<path d="M${P(d - 11, 0.94)} L${P(d, 1, i === 2 ? 26 : 21)} L${P(d + 11, 0.94)}Z"/>`).join('');
      return `<g fill="#6CCB6A" stroke="#55B455" stroke-width="3" stroke-linejoin="round">${sp}</g><g fill="#A8E6A0">${[-26, 0, 26].map((d) => { const t = (d * Math.PI) / 180; return `<circle cx="${(100 + Math.sin(t) * 60).toFixed(1)}" cy="${(90 - Math.cos(t) * 52).toFixed(1)}" r="2.4"/>`; }).join('')}</g>`;
    } },
    dinoLeaf: { slot: 'head', art: () => `<g transform="rotate(-24 122 38)">${h.em(122, 38, 30, '🍃')}</g>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, fly, line, centerOf, nextTo, pct, head, mouth, feet, paw, sceneRect, clamp } = k;
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    const art = (a, from, to, ms, o) => flyArt(fly, a, from, to, ms, o);
    const quake = () => { const s = L.closest('.scene'); if (s) api.hop(s, 'quake', 450); };

    // ----- the volcano: smoke rings, a popcorn eruption, hiccups, a toasted marshmallow
    const rings = (c) => {
      const a = begin('dinoRings');
      api.hop(c.el, 'zdrings', 2700);
      [0, 450, 900].forEach((d) => at(a, d, () => sfx.puff()));
      pose('surprised', 1500);
      at(a, 500, () => line('dinoRings', 1, 0));
      at(a, 1800, () => pose('grin', 1100, 'puff', 1100));
      at(a, 2900, () => { const [mx, my] = mouth(); fly('💨', [mx, my], [mx - 30, my - 90], 900, { size: 26 }); sfx.deflate(); pose('laugh', 1500, 'hop'); });
      at(a, 3900, end);
    };
    // the volcano rumbles and pops: popcorn rains all over the valley, and some lands right in his mouth
    const erupt = (c) => {
      const a = begin('dinoPopcorn'), w = sceneRect().width, [, fy] = feet();
      api.hop(c.el, 'zderupt', 3400);
      sfx.rumble();
      pose('surprised', 1400, 'startle', 1100);
      at(a, 850, () => sfx.puff());
      for (let i = 0; i < 14; i++) {
        at(a, 950 + i * 120, () => {
          const [cx, cy] = part(c, '.zd-crater'), toMouth = i % 4 === 2;
          const to = toMouth ? mouth() : [w * (0.04 + Math.random() * 0.92), fy - 16 + Math.random() * 40];
          sfx.pop();
          art(CORN, [cx, cy], to, 900 + Math.random() * 300, { arc: 40 + Math.random() * 50, spin: 240, size: toMouth ? 22 : 15 + Math.random() * 9, stay: toMouth ? 0 : 700 });
        });
      }
      at(a, 2000, () => { api.setTemp('eat', 2400); sfx.crunch(); line('dinoPopcorn', 1, 0); });
      at(a, 2700, () => { sfx.crunch(); api.reward(); });
      at(a, 3700, () => pose('laugh', 1400, 'hop'));
      at(a, 4500, end);
    };
    R.volcano = {
      press: (c) => { sfx.puff(); api.fxAt(...part(c, '.zd-crater'), ['💨'], 3, 'spark'); },
      tap: who(oneOf('dinoVolcano', rings, erupt)),
      // the volcano hiccups three times… and Lucky catches the hiccups too
      double: (c) => {
        api.hop(c.el, 'zdhic', 1900);
        const [cx, cy] = part(c, '.zd-crater');
        [0, 600, 1200].forEach((d) => setTimeout(() => { sfx.hic(); api.fxAt(cx, cy - 6, ['💨'], 2, 'spark'); }, d));
        if (!api.free() || api.talking()) return;
        const a = begin('dinoHic');
        at(a, 1800, () => { sfx.hic(); pose('surprised', 700, 'hic', 400); });
        at(a, 2400, () => { sfx.hic(); pose('laugh', 1700, 'hic', 400); line('dinoHic', 1, 0); });
        at(a, 3600, end);
      },
      long: who((c) => {
        const a = begin('dinoMarsh');
        prop('marsh', 4400);
        pose('happy', 1700, 'stretchUp', 1600);
        hold(a, 'glow', 2200);
        api.hop(c.el, 'zdwarm', 2600);
        at(a, 300, () => { sfx.crackle(); api.fxAt(...api.luckyPoint(0.92, 0.46), ['✨', '💨'], 4, 'spark'); });
        at(a, 2200, () => { api.setTemp('eat', 2000); sfx.yum(); line('dinoMarsh', 1, 0); api.reward(); });
        at(a, 4200, end);
      }),
    };

    // ----- the brachiosaurus: a slide down its neck, a windy sneeze, a nose-boop, a snack of leaves
    const bhead = (c) => part(c, '.zd-bhead');
    // he shrinks, climbs up the tail onto its back, the dinosaur lays its neck down to the ground… and down he slides
    const slide = (c) => {
      const a = begin('dinoSlide');
      sfx.shrink();
      api.setTemp('ok', 2600);
      hold(a, 'tiny', 5300);
      at(a, 600, () => { hold(a, 'zdclimb'); [0, 400, 800, 1200, 1600].forEach((d) => at(a, d, () => sfx.tap())); });
      at(a, 2700, () => { api.hop(c.el, 'zdbow', 2800); sfx.whoosh(); });
      at(a, 3300, () => { L.classList.remove('zdclimb'); a.cls.delete('zdclimb'); hold(a, 'zdslide'); pose('laugh', 2200); sfx.whoosh(); });
      at(a, 4550, () => { sfx.boing(); api.fxAt(...feet(), ['💨', '🌿'], 4, 'spark'); line('dinoSlide', 1, 0); api.reward(); });
      at(a, 5300, () => sfx.grow());
      at(a, 6000, end);
    };
    const sneeze = (c) => {
      const a = begin('dinoSneeze');
      api.hop(c.el, 'zdsneeze', 1500);
      sfx.sniff();
      at(a, 650, () => {
        const [hx, hy] = bhead(c);
        sfx.sneeze();
        for (let i = 0; i < 7; i++) fly(i % 3 ? '🍃' : '💨', [hx - 24, hy + 4], [hx - 110 - Math.random() * 130, hy + 30 + Math.random() * 150], 800, { spin: 200, size: 20 + Math.random() * 8 });
        fly('🍃', [hx - 24, hy + 4], head(), 750, { arc: 30, spin: 300, size: 26 });
      });
      at(a, 800, () => pose('surprised', 1000, 'startle', 1100));
      at(a, 1400, () => prop('dinoLeaf', 3200));
      at(a, 1800, () => { pose('laugh', 1700); line('dinoSneeze', 1, 0); });
      at(a, 3300, end);
    };
    R.brachio = {
      press: (c) => { sfx.note(147); api.fxAt(c.x, c.y, ['🌿'], 2, 'spark'); },
      tap: who(oneOf('dinoBrachio', slide, sneeze)),
      // it lowers its long neck and boops him on the head
      double: who((c) => {
        const a = begin('dinoBoop');
        go(56, 500);
        at(a, 300, () => api.hop(c.el, 'zdlower', 2800));
        at(a, 950, () => pose('happy', 1600, 'stretchUp', 1600));
        at(a, 1500, () => { const [hx, hy] = head(); sfx.kiss(); api.hop(L, 'boop', 700); api.hearts(hx - 46, hy - 6, 4); line('dinoBoop', 1, 0); api.reward(); });
        at(a, 2500, () => pose('hearts', 1600, 'hop'));
        at(a, 3500, end);
      }),
      long: who((c) => {
        const a = begin('dinoFeed');
        go(58, 700);
        at(a, 750, () => pose('happy', 1600, 'stretchUp', 1600));
        at(a, 900, () => { const [hx, hy] = bhead(c); fly('🌿', paw(), [hx - 14, hy + 6], 700, { arc: 50, spin: -60, size: 28 }); sfx.whoosh(); });
        at(a, 1600, () => { api.hop(c.el, 'zdchew', 1400); [0, 350, 700, 1050].forEach((d) => at(a, d, () => sfx.crunch())); });
        at(a, 2300, () => { pose('laugh', 1800, 'clap'); api.hearts(...bhead(c), 4); line('dinoFeed', 1, 0); api.reward(); });
        at(a, 3900, end);
      }),
    };

    // ----- the egg: it hatches (the baby peeks out), or wobbles and rolls; the baby hops around Lucky
    const eggAt = (c) => part(c, '.zd-egg');
    const hatch = (c) => {
      const a = begin('dinoHatch');
      api.hop(c.el, 'zdhatch', 4200);
      sfx.knock();
      at(a, 260, () => sfx.knock());
      at(a, 950, () => { const [ex, ey] = eggAt(c); sfx.pop(); cheep(sfx); api.fxAt(ex, ey - 40, ['✨'], 4, 'spark'); });
      at(a, 1150, () => pose('surprised', 900, 'startle', 1100));
      at(a, 1900, () => { const [ex, ey] = eggAt(c); cheep(sfx); pose('happy', 2000, 'clap'); api.hearts(ex, ey - 30, 4); line('dinoHatch', 1, 0); api.reward(); });
      at(a, 3800, end);
    };
    const roll = (c) => {
      const a = begin('dinoWobble');
      api.hop(c.el, 'zdroll', 2400);
      [0, 250, 500].forEach((d) => at(a, d, () => sfx.knock()));
      at(a, 1100, () => sfx.boing());
      at(a, 600, () => pose('surprised', 1100, 'startle', 1100));
      at(a, 1400, () => { pose('laugh', 1600, 'hop'); line('dinoWobble', 1, 0); });
      at(a, 2700, end);
    };
    R.dinoEgg = {
      press: (c) => { sfx.knock(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('dinoEgg', hatch, roll)),
      double: who((c) => {
        const a = begin('dinoBaby'), [ex, ey] = eggAt(c);
        c.el.classList.add('zd-out');
        onEnd(a, () => c.el.classList.remove('zd-out'));
        sfx.pop();
        cheep(sfx);
        const pts = [api.luckyPoint(0.06, 0.9), api.luckyPoint(0.5, 1), api.luckyPoint(0.94, 0.9), api.luckyPoint(0.5, 1), api.luckyPoint(0.06, 0.9)];
        let from = [ex, ey - 24];
        pts.forEach((p, i) => {
          const f = from;
          at(a, 150 + i * 520, () => { art(baby(p[0] > f[0]), f, p, 500, { arc: 40, size: 46, stay: i === pts.length - 1 ? 260 : 40 }); if (i % 2 === 0) cheep(sfx); else sfx.boing(); });
          from = p;
        });
        at(a, 450, () => pose('laugh', 2600, 'pirouette', 1500));
        at(a, 1500, () => { api.hearts(...head(), 4); line('dinoBabyHop', 1, 0); });
        const back = 150 + pts.length * 520;
        at(a, back, () => art(baby(false), pts[pts.length - 1], [ex, ey - 16], 600, { arc: 40, size: 46 }));
        at(a, back + 600, () => { c.el.classList.remove('zd-out'); cheep(sfx); api.reward(); });
        at(a, back + 1100, end);
      }),
      // he keeps the egg warm like a hen… and it hatches
      long: who((c) => {
        const a = begin('dinoWarm');
        go(26, 800);
        at(a, 850, () => { hold(a, 'loaf', 2600); api.setTemp('sleep', 2600); sfx.purr(); line('dinoWarm', 1, 0); });
        at(a, 1600, () => api.hearts(...eggAt(c), 3));
        at(a, 2800, () => { api.hop(c.el, 'zdwig', 900); sfx.knock(); });
        at(a, 3300, () => { go(44, 600); pose('surprised', 1000); });
        at(a, 3900, () => api.hop(c.el, 'zdhatch', 4200));
        at(a, 4950, () => { sfx.pop(); cheep(sfx); pose('hearts', 2000, 'binky'); api.hearts(...eggAt(c), 4); api.reward(); });
        at(a, 6200, end);
      }),
    };

    // ----- the rock with a fossil: he digs out a bone or an ammonite; a lizard lives in it; hide and seek behind it
    const dig = (kind) => (c) => {
      const a = begin('dinoDig'), bone = kind === 'bone';
      go(nextTo(c.el, 8), 700);
      at(a, 750, () => {
        hold(a, 'dig', 1800);
        [0, 450, 900, 1350].forEach((d) => at(a, d, () => { sfx.tap(); api.fxAt(...part(c, bone ? '.zd-bone' : '.zd-ammo'), ['💨', '🪨'], 2, 'spark'); }));
      });
      at(a, 2600, () => {
        const from = part(c, bone ? '.zd-bone' : '.zd-ammo'), cls = bone ? 'zd-nobone' : 'zd-noammo';
        c.el.classList.add(cls);
        setTimeout(() => c.el.classList.remove(cls), 6000);
        sfx.pop();
        if (bone) fly('🦴', from, mouth(), 600, { arc: 60, spin: 360, size: 30 });
        else art(ammoArt, from, paw(), 600, { arc: 60, spin: 360, size: 30 });
      });
      at(a, 3200, () => { prop(bone ? 'dinoBone' : 'dinoAmmo', 3400); pose('happy', 2600, 'proud', 1200); api.fxAt(...head(), ['✨'], 4, 'spark'); line(bone ? 'dinoBone' : 'dinoAmmonite', 1, 0); api.reward(); });
      at(a, 5000, end);
    };
    R.fossil = {
      press: (c) => { sfx.tap(); api.fxAt(c.x, c.y, ['🪨', '✨'], 2, 'spark'); },
      tap: who(oneOf('dinoFossil', dig('bone'), dig('ammonite'))),
      double: (c) => {
        api.hop(c.el, 'zdrock', 700);
        sfx.knock();
        const [, fy] = feet(), w = sceneRect().width;
        setTimeout(() => { sfx.zip(); const s = fly('', [c.x, c.y + 10], [w + 50, fy + 4], 1500, { size: 34 }); s.innerHTML = flipped('🦎'); }, 350);
        if (!api.free() || api.talking()) return;
        const a = begin('dinoLizard');
        at(a, 650, () => pose('surprised', 900, 'startle', 1100));
        at(a, 1300, () => { pose('laugh', 1600, 'hop'); line('dinoLizard', 1, 0); });
        at(a, 2500, end);
      },
      long: who((c) => k.hideGame(begin('hide'), c.el)),
    };

    // ----- the giant footprints: he hops from one to the next, feels tiny next to them, stomps, turns into a T. rex
    const hopIn = (c) => {
      const a = begin('dinoPrints');
      const xs = [...c.el.querySelectorAll('.zd-print')].map((e) => clamp(pct(centerOf(e)[0]), 26, 74));
      xs.forEach((x, i) => at(a, i * 700, () => {
        go(x, 500);
        pose('happy', 800, 'zdhop', 500);
        at(a, 400, () => { sfx.thump(); api.fxAt(...feet(), ['💨'], 2, 'spark'); });
      }));
      at(a, 2200, () => { pose('laugh', 1600); line('dinoPrints', 1, 0); api.reward(); });
      at(a, 3400, end);
    };
    const tiny = () => {
      const a = begin('dinoTiny');
      [0, 550, 1100].forEach((d) => at(a, d, () => { sfx.stomp(); quake(); }));
      at(a, 200, () => pose('surprised', 1400, 'startle', 1100));
      at(a, 1700, () => { hold(a, 'tiny', 2200); api.setTemp('shy', 2200); line('dinoTiny', 1, 0); });
      at(a, 4300, end);
    };
    R.tracks = {
      press: (c) => { sfx.thump(); api.fxAt(c.x, c.y, ['💨'], 2, 'spark'); },
      tap: who(oneOf('dinoTracks', hopIn, tiny)),
      double: who(() => {
        const a = begin('dinoStomp');
        [0, 550, 1100].forEach((d) => at(a, d, () => { pose('grin', 700, 'stomp', 500); sfx.stomp(); quake(); api.fxAt(...feet(), ['💨'], 3, 'spark'); }));
        at(a, 200, () => line('dinoStomp', 1, 0));
        at(a, 1800, () => pose('laugh', 1400, 'hop'));
        at(a, 2600, end);
      }),
      long: who(() => {
        const a = begin('dinoRex');
        sfx.magic();
        prop('dinoHood', 9000);
        api.fxAt(...head(), ['✨'], 5, 'spark');
        at(a, 600, () => { pose('grin', 2600, 'stomp', 500); sfx.stomp(); quake(); roar(sfx); line('dinoRex', 1, 0); api.reward(); });
        at(a, 1200, () => { api.hop(L, 'stomp', 500); sfx.stomp(); quake(); });
        at(a, 1900, () => pose('laugh', 1500, 'proud', 1200));
        at(a, 3300, end);
      }),
    };
  },

  visitors: [
    { e: '🦕', w: 3, path: 'jump', end: ['dinoHug'], flip: true },
    { e: '🦖', w: 2, path: 'jump', end: ['dinoRoar'], flip: true },
    { e: '🥚', w: 2, path: 'fall', end: ['dinoPtero'] },
  ],

  endings: (k) => {
    const { api, sfx, at, fly, pose, line, head, paw, sceneRect } = k;
    return {
      // a baby brontosaurus hops to his feet for a cuddle
      dinoHug: (a, x, y) => {
        const to = api.luckyPoint(0.04, 0.86);
        fly('🦕', [x, y], to, 900, { arc: 60, size: 54, stay: 2500 });
        at(a, 900, () => { sfx.squeak(); pose('happy', 2200, 'hug'); api.hearts(...to, 5); line('dinoHug', 1, 0); api.reward(); });
        at(a, 3400, () => fly('🦕', to, [-60, to[1]], 1000, { arc: 40, size: 54 }));
      },
      // a little T. rex wants a high five, but its arms are too short
      dinoRoar: (a, x, y) => {
        const to = api.luckyPoint(0.98, 0.84), w = sceneRect().width;
        fly('🦖', [x, y], to, 800, { arc: 60, size: 54, stay: 3100 });
        at(a, 800, () => { sfx.squeak(); setTimeout(() => sfx.squeak(), 160); pose('surprised', 900, 'startle', 1100); });
        at(a, 1600, () => { pose('laugh', 2200, 'highfive', 1200); line('dinoRoar', 1, 0); api.reward(); });
        at(a, 3900, () => { const s = fly('', to, [w + 60, to[1]], 900, { arc: 40, size: 54 }); s.innerHTML = flipped('🦖'); });
      },
      // he catches a falling egg, and mummy pterodactyl swoops down to take it home
      dinoPtero: (a, x, y) => {
        const p = paw(), [hx, hy] = head(), top = [hx + 64, Math.max(60, hy - 44)], under = [top[0] - 4, top[1] + 40];
        fly('🥚', [x, y], p, 600, { arc: 30, size: 30, stay: 1700 });
        at(a, 600, () => { sfx.catch(); pose('surprised', 1200, 'startle', 1100); });
        at(a, 1100, () => { sfx.whoosh(); flyArt(fly, PTERO, [sceneRect().width + 60, 20], top, 1100, { arc: 20, size: 84, stay: 1400 }); });
        // he holds the egg up to her
        at(a, 2300, () => { fly('🥚', p, under, 450, { arc: 20, size: 28, stay: 850 }); sfx.happy(); pose('happy', 2200, 'stretchUp', 1600); });
        at(a, 2700, () => { api.hearts(...top, 5); line('dinoPtero', 1, 0); api.reward(); });
        at(a, 3600, () => {
          sfx.whoosh();
          flyArt(fly, PTERO, top, [-110, 10], 1400, { size: 84 });
          fly('🥚', under, [-114, 50], 1400, { size: 28 });
          pose('happy', 1500, 'wave', 1200);
        });
      },
    };
  },
};
