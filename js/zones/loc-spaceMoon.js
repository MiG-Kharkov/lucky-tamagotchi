// The moon (a second place of space): grey dust and craters, the blue Earth rising over the horizon in the black starry
// sky (with a telescope pointed at it), a little lander with its flag, a moon rover, an alien's glass greenhouse where
// glowing space carrots grow, and a wide crater right in front of Lucky for low-gravity jumps.
// Lucky's speech bubble covers the sky while he talks, so everything that answers taps also has a part down on the
// ground, beside him (the Earth has its telescope).

// a crater in the dust (only a picture): a light rim, a dark bowl, its far wall in shade and its near wall lit;
// see-through, so it suits every band of dust
const f1 = (n) => +n.toFixed(1);
const crater = (x, y, r) => { const rx = f1(r * 0.76), ry = f1(r * 0.24), iy = f1(r * 0.13);
  return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${f1(r * 0.36)}" fill="#fff" opacity=".22"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3A3360" opacity=".3"/>
<path d="M${f1(x - rx)} ${y} a${rx} ${ry} 0 0 1 ${f1(2 * rx)} 0 a${rx} ${iy} 0 0 0 ${f1(-2 * rx)} 0z" fill="#3A3360" opacity=".28"/>
<path d="M${f1(x - rx)} ${y} a${rx} ${ry} 0 0 0 ${f1(2 * rx)} 0 a${rx} ${iy} 0 0 1 ${f1(-2 * rx)} 0z" fill="#fff" opacity=".2"/>`; };
// a pebble
const rock = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="1" rx="12" ry="2" fill="#000" opacity=".1"/>
<path d="M-11 0 Q-12 -9 -3 -11 Q6 -13 10 -5 Q13 0 11 0Z" fill="#C9C5DB"/><path d="M-6 -8 Q-2 -11 3 -10" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
// a bunny's footprint in the dust (Lucky's trail from the greenhouse back over the plain)
const print = (x, y, s, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})" fill="#9D97B7"><ellipse rx="3.2" ry="5.6"/><circle cx="-3" cy="-7.4" r="1.6"/><circle cx="0" cy="-8.8" r="1.6"/><circle cx="3" cy="-7.4" r="1.6"/></g>`;
// the Earth (drawn round 318,306, radius 34): its land and clouds are drawn twice, one Earth-width apart, so they can
// turn round without a seam
const EW = 72;
const land = (o, ie) => `<g transform="translate(${o} 0)" fill="#62D38A">
<path d="M298 282 Q304 276 312 279 Q318 281 316 287 Q322 288 320 294 Q314 298 308 296 Q302 298 298 293 Q294 288 298 282Z"/>
<path d="M304 300 Q312 297 318 302 Q322 310 318 318 Q314 328 308 330 Q304 324 304 316 Q298 308 304 300Z"/>
<path d="M332 278 Q340 274 348 280 Q350 288 344 292 Q340 296 342 300 Q336 300 334 292 Q328 286 332 278Z"/>
<path d="M342 304 Q348 304 350 310 Q350 320 344 330 Q340 326 340 318 Q338 310 342 304Z"/>
<ellipse${ie ? ' class="lsm-ie"' : ''} cx="292" cy="284" rx="2.6" ry="3.4" fill="#8CFFA0"/></g>`;
const clouds = (o) => `<g transform="translate(${o} 0)" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".8">
<path d="M287 297 q8 -3 16 0"/><path d="M322 316 q7 -3 14 0"/><path d="M300 334 q6 -2 12 0"/><path d="M330 289 q5 -2 10 0"/></g>`;
// the little alien gardener: three eyes, two antennae, a waving hand
const alien = `<path d="M344 508 l-3 -7 M352 508 l3 -7" stroke="#6FD47F" stroke-width="1.6" stroke-linecap="round"/><circle cx="341" cy="500" r="2.2" fill="#C8FF9E"/><circle cx="355" cy="500" r="2.2" fill="#C8FF9E"/>
<ellipse cx="348" cy="526" rx="7" ry="6" fill="#7FDF90"/><path class="lsm-arm" d="M354 524 q5 -3 7 -9" stroke="#7FDF90" stroke-width="3" stroke-linecap="round" fill="none"/>
<ellipse cx="348" cy="515" rx="9.5" ry="8.5" fill="#8CE99A"/><ellipse cx="345" cy="511" rx="3" ry="2" fill="#fff" opacity=".4"/>
${[[344, 516], [352, 516], [348, 510]].map(([x, y]) => `<g class="lsm-eye"><circle cx="${x}" cy="${y}" r="2.5" fill="#fff"/><circle cx="${x}" cy="${y + 0.3}" r="1.3" fill="#2E3350"/></g>`).join('')}
<path d="M345 520.5 q3 2.4 6 0" stroke="#2E6B3E" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
// a glowing space carrot in the greenhouse bed
const carrot = (x, y, cls) => `<g class="lsm-carrot ${cls}"><path d="M${x - 5} ${y - 3} h10 l-5 13z" fill="#FF9F43"/><path d="M${x - 3} ${y} h4" stroke="#E07B1E" stroke-width="1.2"/>
<path d="M${x} ${y - 3} q-6 -8 -3 -13 q2 6 3 9 q0 -9 5 -12 q1 7 -3 12 q5 -6 9 -4 q-4 5 -9 8" fill="#8CF59A"/></g>`;

export default {
  id: 'spaceMoon',
  world: 'space',
  name: ['Луна', 'The moon'],
  spots: { L: [26, 546], R: [380, 562], l: [20, 692], r: [386, 692], sky: 300 },
  arrive: [
    ['Луна! Тут всё серое, а Земля в небе голубая-голубая.', 'The moon! Everything here is grey, and the Earth in the sky is so blue.'],
    ['Мы на Луне! Прыгать тут в шесть раз легче. Проверим?', "We're on the moon! Jumping is six times easier here. Shall we try?"],
  ],

  lines: {
    spaceMoonWave: [['Привет, Земля! Эй, дома, видите, как я машу?', 'Hello, Earth! Hey, everyone at home, can you see me waving?'],
      ['Помаши Земле со мной! Там все, кого мы любим.', 'Wave at the Earth with me! Everyone we love is over there.'],
      ['Земля отсюда как голубой шарик. Это потому, что на ней так много воды.', "From here the Earth looks like a blue marble. That's because it's mostly water."]],
    spaceMoonIreland: [['Вижу Ирландию! Вон тот маленький зелёный островок.', 'I can see Ireland! That little green island over there.'],
      ['Ирландия! Отсюда она не больше горошины. Привет, школа!', "Ireland! From here it's no bigger than a pea. Hi, school!"]],
    spaceMoonKiss: [['Воздушный поцелуй домой! Ему лететь почти четыреста тысяч километров.', 'A kiss for home! It has to fly nearly four hundred thousand kilometres.']],
    spaceMoonScope: [['Смотрю в телескоп на Ирландию… Над ней тучи. Как обычно!', "I'm looking at Ireland through the telescope… Clouds over it. As usual!"]],
    spaceMoonFlag: [['На Луне нет ветра, поэтому флаг держит палочка сверху. Иначе он бы повис.', 'There is no wind on the moon, so a rod holds the flag out. Otherwise it would droop.'],
      ['Посадочный модуль! На таком люди прилетали на Луну. Внутри тесно, как в шкафу.', "A lunar lander! People landed on the moon in one. It's as cramped as a wardrobe inside."]],
    spaceMoonStep: [['Это маленький прыжок для кролика, но огромный скачок для всех кроликов!', "That's one small hop for a bunny, one giant leap for bunnykind!"]],
    spaceMoonLiftoff: [['Верхушка модуля улетает домой, а низ остаётся на Луне навсегда!', 'The top of the lander flies home, and the bottom stays on the moon forever!']],
    spaceMoonCarrotFlag: [['Ставлю свой флаг! Объявляю Луну морковной территорией!', 'Planting my own flag! I declare the moon carrot territory!']],
    spaceMoonDrive: [['Лунный вездеход, поехали! Би-бип, посторонитесь!', "Moon buggy, let's go! Beep-beep, coming through!"],
      ['Я за рулём! Права? Какие права, тут даже дорог нет.', "I'm driving! A licence? What licence, there aren't even any roads here."]],
    spaceMoonBump: [['Ой, кратер! Бум-бум… Хорошо, что я пристегнулся.', 'Whoa, a crater! Bump-bump… Good thing I buckled up.']],
    spaceMoonRoverSolo: [['Вездеход поехал сам! Им управляют с Земли по радио, как игрушечной машинкой.', 'The rover drove off by itself! People on Earth steer it by radio, like a toy car.']],
    spaceMoonBeep: [['Бип-буп! Вездеход передаёт на Землю: тут теперь живёт кролик.', 'Beep-boop! The rover is telling Earth that a bunny lives here now.']],
    spaceMoonRock: [['Вездеход нашёл мне лунный камушек! Ему около четырёх миллиардов лет.', "The rover found me a moon rock! It's about four billion years old."]],
    spaceMoonHigh: [['На Луне я вешу в шесть раз меньше! Видала, как высоко?', 'On the moon I weigh six times less! Did you see how high I went?'],
      ['Прыг! А вниз лечу медленно-медленно. Это лунное притяжение!', "Boing! And I float down slowly, slowly. That's moon gravity!"],
      ['Дома я так не прыгаю! Тут притяжение слабее в шесть раз.', "I can't jump like this at home! Gravity here is six times weaker."]],
    spaceMoonPrints: [['Мои следы останутся тут на миллионы лет! На Луне нет ветра, их не сдует.', "My footprints will stay here for millions of years! There's no wind to blow them away."],
      ['Топ-топ! Самые первые кроличьи следы на Луне.', 'Hop, hop! The very first bunny footprints on the moon.']],
    spaceMoonFlip: [['Сальто! На Луне это проще простого.', "A somersault! On the moon it's a piece of cake."]],
    spaceMoonThrow: [['Бросок! Ого, улетел за горизонт! На Луне всё летит в шесть раз дальше.', 'Throw! Whoa, it flew over the horizon! Things go six times farther on the moon.']],
    spaceMoonShare: [['Инопланетянин угостил меня космической морковкой! Она светится!', 'The alien shared a space carrot with me! It glows!'],
      ['Спасибо, зелёный друг! Хрум… У меня теперь уши светятся?', 'Thanks, green friend! Crunch… Are my ears glowing now?']],
    spaceMoonGrow: [['Под куполом есть воздух и вода, поэтому морковка растёт даже на Луне!', 'The dome keeps air and water inside, so carrots can grow even on the moon!'],
      ['Космическая морковка светится, чтобы её было видно ночью. А ночь тут две недели!', 'Space carrots glow so you can find them at night. A night here lasts two weeks!']],
    spaceMoonAlien: [['Привет, инопланетянин! Он подмигивает мне всеми тремя глазами.', "Hi, alien! He's winking at me with all three eyes."]],
    spaceMoonAntennae: [['Инопланетянин подарил мне антенны! Теперь я ловлю сигналы с Земли.', 'The alien gave me antennae! Now I can pick up signals from Earth.']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03041A"/><stop offset=".42" stop-color="#0A0C2E"/><stop offset=".62" stop-color="#1E1A4C"/></linearGradient>
<radialGradient id="${u}eg"><stop offset=".5" stop-color="#7FD0FF" stop-opacity=".45"/><stop offset="1" stop-color="#7FD0FF" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}eo" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#8EDCFF"/><stop offset=".6" stop-color="#3B8FE8"/><stop offset="1" stop-color="#2862C4"/></radialGradient>
<clipPath id="${u}ec"><circle cx="318" cy="306" r="34"/></clipPath>
<clipPath id="${u}hz"><path d="M0 0 H400 V414 Q370 404 330 416 Q282 398 228 420 Q186 404 140 418 Q96 400 58 420 Q26 410 0 432Z"/></clipPath>
<radialGradient id="${u}cg"><stop offset="0" stop-color="#C8FF9E" stop-opacity=".9"/><stop offset="1" stop-color="#C8FF9E" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".45"/><stop offset="1" stop-color="#9FE3FF" stop-opacity=".14"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<path d="M-30 236 Q190 330 430 262" stroke="#B9A8FF" stroke-width="70" stroke-linecap="round" fill="none" opacity=".06"/>
<path d="M-30 236 Q190 330 430 262" stroke="#D7CCFF" stroke-width="22" stroke-linecap="round" fill="none" opacity=".05"/>
<g fill="#fff" opacity=".55">${Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 53 + 17) % 400}" cy="${212 + ((i * 37) % 190)}" r="${i % 4 ? 0.7 : 1.1}"/>`).join('')}</g>
${h.stars(26)}
<g transform="translate(330 306) rotate(-16)"><path d="M-19 0 a19 5 0 0 1 38 0" stroke="#FFD27A" stroke-width="2.4" fill="none" opacity=".9"/><circle r="10" fill="#C99BFF"/><path d="M-8 -4 q8 -5 16 0" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/><path d="M-19 0 a19 5 0 0 0 38 0" stroke="#FFD27A" stroke-width="2.4" fill="none"/></g>
<path d="M0 432 Q26 410 58 420 Q96 400 140 418 Q186 404 228 420 Q282 398 330 416 Q370 404 400 414 V700 H0Z" fill="#CDC9DF"/>
<path d="M150 412 q14 -6 28 0 M282 404 q12 -5 24 0 M350 410 q9 -4 18 0" stroke="#B3AECA" stroke-width="2" fill="none" stroke-linecap="round"/>
<path d="M0 424 Q200 406 400 430 V700 H0Z" fill="#BAB5CF"/><path d="M0 424 Q200 406 400 430" stroke="#E4E1F1" stroke-width="2" fill="none" opacity=".8"/>
${crater(240, 432, 13)}${crater(286, 452, 9)}${crater(130, 456, 8)}
${[[324, 484, 0.78, 10], [335, 472, 0.74, 16], [326, 461, 0.7, 10], [335, 451, 0.66, 16], [327, 442, 0.62, 10], [334, 434, 0.58, 16]].map(([x, y, s, r]) => print(x, y, s, r)).join('')}
<path d="M0 486 Q200 462 400 492 V700 H0Z" fill="#AAA5C2"/>
${rock(374, 562, 0.9)}${rock(28, 500, 0.6)}
<g data-tap="moonEarth" class="lsm-scope"><rect x="46" y="430" width="60" height="104" fill="transparent"/>
  <ellipse cx="80" cy="530" rx="26" ry="3.6" fill="#000" opacity=".12"/>
  <path d="M80 472 L60 528 M80 472 L80 532 M80 472 L100 528" stroke="#8C87A6" stroke-width="3.4" stroke-linecap="round"/>
  <g transform="translate(80 468) rotate(-114)"><g class="lsm-tube">
    <rect x="-24" y="-7" width="46" height="14" rx="5" fill="#6C7BE0"/><rect x="18" y="-9.5" width="12" height="19" rx="4" fill="#4F5EC8"/><ellipse cx="30" cy="0" rx="1.8" ry="7.4" fill="#BFE9FF"/>
    <rect x="-6" y="-8" width="6" height="16" rx="1.5" fill="#FFD23F"/><rect x="-33" y="-4" width="10" height="8" rx="2.4" fill="#2E3350"/>
    <path d="M-20 -3.5 H16" stroke="#fff" stroke-width="2" opacity=".4" stroke-linecap="round"/></g></g>
  <circle cx="80" cy="470" r="4.4" fill="#A6A0BF"/></g>
<g data-tap="moonEarth"><rect x="38" y="340" width="86" height="78" fill="transparent"/>
  <g clip-path="url(#${u}hz)"><g transform="translate(80 392) scale(1.18) translate(-318 -306)">
  <circle class="lsm-halo amb" cx="318" cy="306" r="58" fill="url(#${u}eg)"/>
  <circle class="lsm-shine" cx="318" cy="306" r="42" fill="none" stroke="#CFF0FF" stroke-width="4"/>
  <circle class="lsm-globe" cx="318" cy="306" r="34" fill="url(#${u}eo)"/>
  <g clip-path="url(#${u}ec)">
    <g class="lsm-land">${land(-EW)}${land(0, true)}</g>
    <g class="lsm-clouds amb">${clouds(0)}${clouds(EW)}</g>
    <ellipse cx="318" cy="273" rx="13" ry="3.6" fill="#F4FBFF"/>
    <path d="M318 272 A34 34 0 0 1 318 340 A16 34 0 0 0 318 272Z" fill="#0A1236" opacity=".3"/></g>
  <circle cx="318" cy="306" r="34" fill="none" stroke="#BFE9FF" stroke-width="2" opacity=".6"/>
  <ellipse cx="305" cy="291" rx="9" ry="5" fill="#fff" opacity=".35" transform="rotate(-35 305 291)"/></g></g></g>
<path d="M0 568 Q200 544 400 574 V700 H0Z" fill="#9B95B5"/>
${rock(304, 690, 0.7)}${crater(354, 694, 12)}
<g data-tap="moonFlag"><rect x="0" y="546" width="104" height="114" fill="transparent"/>
  <ellipse cx="54" cy="654" rx="54" ry="5" fill="#000" opacity=".14"/>
  <g transform="translate(-9.3 253) scale(.95)">
  <path d="M14 418 V316" stroke="#ECEAF5" stroke-width="3" stroke-linecap="round"/><path d="M14 318 H42" stroke="#ECEAF5" stroke-width="2.4" stroke-linecap="round"/>
  <g class="lsm-flagcloth"><path d="M15 319 H42 V342 Q36 339 29 342 Q22 345 15 342Z" fill="#6FB8FF"/><path d="M25 319 V343 M33 319 V341" stroke="#5AA2EC" stroke-width="1.2"/>
    <circle cx="28" cy="330" r="6.5" fill="#fff"/><circle cx="28" cy="330" r="4.8" fill="#3B8FE8"/><path d="M25 327 q3 -2 5 1 q-1 3 -4 3z M29 332 q2 0 2 2 l-2 1z" fill="#62D38A"/></g>
  <g class="lsm-myflag"><g><path d="M104 418 V312" stroke="#ECEAF5" stroke-width="3" stroke-linecap="round"/><path d="M78 314 H104" stroke="#ECEAF5" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M78 315 H103 V336 Q97 333 90 336 Q84 339 78 336Z" fill="#FFF3E0"/><path d="M82 331 L96 320 L99 325Z" fill="#FF8A2B"/><path d="M87 327 l2 2 M92 323 l2 2" stroke="#E06B12" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M97 322 q1 -5 -1 -7 M97 322 q4 -3 7 -1" stroke="#4CB84C" stroke-width="1.8" fill="none" stroke-linecap="round"/></g></g>
  <g stroke="#D8D5E6" stroke-width="3.4" stroke-linecap="round" fill="none"><path d="M38 398 L20 416 M94 398 L112 416 M50 402 L46 416 M82 402 L86 416"/></g>
  <path d="M100 401 L109 414 M101 405 h6 M104 410 h6" stroke="#D8D5E6" stroke-width="1.6" stroke-linecap="round"/>
  <g fill="#ECEAF5"><ellipse cx="20" cy="417" rx="8" ry="2.8"/><ellipse cx="112" cy="417" rx="8" ry="2.8"/><ellipse cx="46" cy="417" rx="6" ry="2.4"/><ellipse cx="86" cy="417" rx="6" ry="2.4"/></g>
  <path d="M60 403 l-5 9 h20 l-5 -9z" fill="#9C97B4"/>
  <path d="M34 380 H98 L102 385 V399 L98 404 H34 L30 399 V385Z" fill="#F2B33D"/>
  <path d="M37 383 H60 V401 H37Z M72 383 H95 V401 H72Z" fill="#FFD66B"/><path d="M41 389 l6 4 l5 -3 l5 3 M76 392 l5 -4 l6 5 l5 -3" stroke="#E09A2A" stroke-width="1.4" fill="none" stroke-linejoin="round"/>
  <g class="lsm-ascent">
    <path class="lsm-flame" d="M58 382 Q66 414 74 382Z" fill="#FFB347"/><path class="lsm-flame" d="M62 382 Q66 400 70 382Z" fill="#FFF3A8"/>
    <path d="M40 381 L38 366 Q38 352 52 349 H80 Q94 352 94 366 L92 381Z" fill="#EEECF6"/><path d="M82 381 L85 350 Q94 354 94 366 L92 381Z" fill="#D9D6E8"/>
    <path d="M50 358 H64 L62 368 H52Z" fill="#2E3350"/><path d="M53 360 h4 l-1 3 h-3z" fill="#fff" opacity=".7"/>
    <rect x="66" y="368" width="11" height="12" rx="2" fill="#C9C5DB"/><circle cx="74" cy="374" r="1.3" fill="#8C87A6"/>
    <rect x="32" y="362" width="6" height="7" rx="1.5" fill="#BDB8D2"/><rect x="94" y="362" width="6" height="7" rx="1.5" fill="#BDB8D2"/>
    <path d="M80 349 L86 338" stroke="#D8D5E6" stroke-width="2"/><path d="M80 337 Q87 345 95 334" fill="#EEECF6" stroke="#C9C5DB" stroke-width="1.2"/></g></g></g>
<g data-tap="moonGreenhouse"><rect x="300" y="488" width="72" height="62" fill="transparent"/>
  <g transform="translate(-35.84 -60.8) scale(1.12)">
  <ellipse cx="332" cy="542" rx="38" ry="5" fill="#000" opacity=".14"/>
  <g class="lsm-cglow amb"><circle cx="318" cy="522" r="11" fill="url(#${u}cg)"/><circle cx="333" cy="519" r="11" fill="url(#${u}cg)"/></g>
  <g class="lsm-alienup"><g class="lsm-alien amb">${alien}</g></g>
  ${carrot(318, 526, 'lsm-c1')}${carrot(333, 523, 'lsm-c2')}
  <path d="M302 530 Q332 522 362 530 V534 H302Z" fill="#8A6450"/><path d="M308 529 q3 -2 6 0 M340 527 q3 -2 6 0" stroke="#A27A62" stroke-width="1.4" fill="none"/>
  <path d="M300 532 A32 32 0 0 1 364 532Z" fill="url(#${u}gd)"/>
  <path d="M332 500 V532 M311 508 Q318 519 316 532 M353 508 Q346 519 348 532 M302 520 Q332 512 362 520" stroke="#E8F6FF" stroke-width="1.2" fill="none" opacity=".55"/>
  <path d="M300 532 A32 32 0 0 1 364 532" stroke="#E8F6FF" stroke-width="2.4" fill="none" opacity=".9"/>
  <path d="M308 518 Q312 506 323 503" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/>
  <rect x="297" y="530" width="70" height="10" rx="5" fill="#CFCBE0"/><path d="M300 537 H364" stroke="#B3AECA" stroke-width="1.4"/>
  <g class="lsm-blink amb"><circle cx="306" cy="535" r="2" fill="#7CF08A"/><circle cx="358" cy="535" r="2" fill="#FF6F9A"/></g></g></g>
<g data-tap="moonRover"><rect x="298" y="574" width="100" height="94" fill="transparent"/>
  <ellipse cx="350" cy="664" rx="48" ry="5" fill="#000" opacity=".14"/>
  <g class="lsm-rover">
    <path d="M318 652 L334 634 L350 652 M350 652 L366 634 L382 652" stroke="#8C87A6" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M324 616 L382 610 L384 617 L326 621Z" fill="#3E6FD8"/><path d="M340 615 v5 M354 614 v5 M368 612 v5" stroke="#8FB6FF" stroke-width="1.2"/>
    <rect x="310" y="618" width="80" height="22" rx="7" fill="#F2F0F8"/><rect x="310" y="631" width="80" height="9" rx="4.5" fill="#D9D6E8"/>
    <rect x="334" y="622" width="32" height="8" rx="3" fill="#F2B33D"/><path d="M340 622 v8 M350 622 v8 M360 622 v8" stroke="#E09A2A" stroke-width="1"/>
    <circle class="lsm-blink amb" cx="382" cy="625" r="2.2" fill="#FF5E62"/>
    <path d="M384 618 V600" stroke="#C9C5DB" stroke-width="2.4"/>
    <g class="lsm-dish amb"><path d="M374 598 Q385 608 396 593" fill="#ECEAF5" stroke="#C9C5DB" stroke-width="1.4"/><path d="M385 600 l3 -9" stroke="#C9C5DB" stroke-width="1.4"/><circle cx="388" cy="590" r="1.6" fill="#FF8A2B"/></g>
    <path d="M318 618 V596" stroke="#C9C5DB" stroke-width="3.4" stroke-linecap="round"/>
    <g class="lsm-head"><rect x="304" y="580" width="26" height="16" rx="6" fill="#F2F0F8"/><rect x="304" y="590" width="26" height="6" rx="3" fill="#D9D6E8"/>
      <g class="lsm-eyes"><circle cx="311" cy="587" r="4.2" fill="#2E3350"/><circle cx="323" cy="587" r="4.2" fill="#2E3350"/><circle cx="312.4" cy="585.6" r="1.5" fill="#fff"/><circle cx="324.4" cy="585.6" r="1.5" fill="#fff"/></g></g>
    ${[318, 350, 382].map((x) => `<g class="lsm-wheel"><circle cx="${x}" cy="652" r="11" fill="#4E4870"/><path d="M${x} 642 v20 M${x - 10} 652 h20" stroke="#6A6390" stroke-width="2.4"/><circle cx="${x}" cy="652" r="4.6" fill="#CFCBE0"/></g>`).join('')}</g></g>
<g data-tap="moonCrater"><rect x="108" y="662" width="186" height="38" fill="transparent"/>
  <ellipse cx="192" cy="686" rx="84" ry="19" fill="#B9B4CE"/>
  <path d="M108 686 a84 19 0 0 0 168 0 a84 13 0 0 1 -168 0z" fill="#A6A0BF"/>
  <path d="M112 684 a80 16 0 0 1 160 0" stroke="#E6E3F3" stroke-width="2.2" fill="none" opacity=".85"/>
  <ellipse cx="192" cy="686" rx="68" ry="12.5" fill="#7A7498"/>
  <path d="M124 686 a68 12.5 0 0 1 136 0 a68 5 0 0 0 -136 0z" fill="#5C5680"/>
  <path d="M124 686 a68 12.5 0 0 0 136 0 a68 7 0 0 1 -136 0z" fill="#ABA5C6"/>
  <ellipse class="lsm-cdust" cx="192" cy="680" rx="54" ry="8" fill="#E2DFF0"/>
  ${rock(116, 678, 0.55)}${rock(270, 680, 0.5)}</g>
</svg>`,

  css: `
.lsm-clouds.amb { animation: lsmDrift 50s linear infinite; }
@keyframes lsmDrift { from { transform: translateX(-72px); } to { transform: translateX(0); } }
.lsm-halo.amb, .lsm-cglow.amb { animation: lsmHalo 4s ease-in-out infinite; }
@keyframes lsmHalo { 50% { opacity: .5; } }
.lsm-shine { opacity: 0; }
[data-tap="moonEarth"].lsmshine .lsm-shine { transform-box: fill-box; transform-origin: center; animation: lsmShine 1.6s ease-out; }
@keyframes lsmShine { 0% { opacity: 0; transform: scale(.8); } 30% { opacity: .9; } 100% { opacity: 0; transform: scale(1.5); } }
[data-tap="moonEarth"].lsmturn .lsm-land { animation: lsmTurn 2.2s ease-in-out; }
@keyframes lsmTurn { from { transform: translateX(0); } to { transform: translateX(72px); } }
[data-tap="moonEarth"].lsmturn .lsm-clouds { animation: lsmDrift 2.2s ease-in-out; }
[data-tap="moonEarth"].lsmturn .lsm-ie { transform-box: fill-box; transform-origin: center; animation: lsmIe .4s ease-in-out 2.2s 4 alternate; }
@keyframes lsmIe { to { transform: scale(1.8); fill: #EFFF8E; } }
[data-tap="moonEarth"].lsmlook .lsm-tube { transform-origin: 0 0; animation: lsmTube 1.6s ease-in-out; }
@keyframes lsmTube { 30%, 70% { transform: rotate(-9deg); } }
[data-tap="moonFlag"].lsmlift .lsm-ascent { animation: lsmLift 3.4s ease-in-out; }
@keyframes lsmLift { 8% { transform: translateY(2px); opacity: 1; } 40%, 60% { transform: translateY(-180px); opacity: 0; } 100% { transform: none; opacity: 1; } }
.lsm-flame { opacity: 0; }
[data-tap="moonFlag"].lsmlift .lsm-flame { animation: lsmFlame 3.4s linear; }
@keyframes lsmFlame { 6%, 40% { opacity: 1; } 42%, 58% { opacity: 0; } 60%, 94% { opacity: 1; } 100% { opacity: 0; } }
.lsm-myflag { visibility: hidden; }
[data-tap="moonFlag"].lsmplanted .lsm-myflag { visibility: visible; }
[data-tap="moonFlag"].lsmplanted .lsm-myflag > g { transform-box: fill-box; transform-origin: 50% 100%; animation: lsmPlant .6s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes lsmPlant { from { transform: scaleY(0); } }
.lsm-blink.amb { animation: lsmBlink 1.4s steps(1) infinite; }
@keyframes lsmBlink { 50% { opacity: .15; } }
.lsm-dish.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: lsmDish 6s ease-in-out infinite; }
@keyframes lsmDish { 50% { transform: rotate(-16deg); } }
[data-tap="moonRover"].lsmroll .lsm-rover { animation: lsmRoll 3s ease-in-out; }
@keyframes lsmRoll { 35% { transform: translateX(-46px); } 42% { transform: translate(-50px, -8px) rotate(5deg); } 50% { transform: translateX(-54px); } 100% { transform: none; } }
[data-tap="moonRover"].lsmroll .lsm-wheel, .lsm-pwheel { transform-box: fill-box; transform-origin: center; animation: lsmWheel .6s linear 5; }
.lsm-pwheel { animation-iteration-count: infinite; }
@keyframes lsmWheel { to { transform: rotate(-360deg); } }
[data-tap="moonRover"].lsmbeep .lsm-head { transform-box: fill-box; transform-origin: 50% 100%; animation: lsmLook 1.8s ease-in-out; }
@keyframes lsmLook { 20%, 40% { transform: rotate(-14deg); } 60%, 80% { transform: rotate(12deg); } }
[data-tap="moonRover"].lsmbeep .lsm-eyes { transform-box: fill-box; transform-origin: center; animation: lsmWink .45s ease-in-out 4; }
[data-tap="moonRover"].lsmscoop .lsm-head { transform-box: fill-box; transform-origin: 50% 100%; animation: lsmNod 1.4s ease-in-out; }
@keyframes lsmNod { 30%, 70% { transform: translateY(12px) rotate(-10deg); } }
.lsm-away { visibility: hidden; }
.lsm-alien.amb { animation: lsmBob 3.2s ease-in-out infinite; }
@keyframes lsmBob { 50% { transform: translateY(1.5px); } }
[data-tap="moonGreenhouse"].lsmpop .lsm-alienup { animation: lsmPop 2.6s ease-in-out; }
@keyframes lsmPop { 20%, 80% { transform: translateY(-7px); } }
[data-tap="moonGreenhouse"].lsmpop .lsm-arm, [data-tap="moonGreenhouse"].lsmwink .lsm-arm { transform-box: fill-box; transform-origin: 0 100%; animation: lsmWave .4s ease-in-out 5 alternate; }
@keyframes lsmWave { to { transform: rotate(-35deg); } }
[data-tap="moonGreenhouse"].lsmwink .lsm-eye { transform-box: fill-box; transform-origin: center; animation: lsmWink .5s ease-in-out 3; }
@keyframes lsmWink { 50% { transform: scaleY(.1); } }
[data-tap="moonGreenhouse"].lsmgrow .lsm-carrot { transform-box: fill-box; transform-origin: 50% 100%; animation: lsmGrow 1.6s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes lsmGrow { 40% { transform: scale(1.45); } }
.lsm-cdust { opacity: 0; }
[data-tap="moonCrater"].lsmpuff .lsm-cdust { transform-box: fill-box; transform-origin: 50% 100%; animation: lsmPuff 1.4s ease-out; }
@keyframes lsmPuff { 20% { opacity: .7; } 100% { opacity: 0; transform: translateY(-14px) scale(1.4); } }
.lsm-antball { animation: lsmHalo 1.4s ease-in-out infinite; }
/* Lucky's moon moves; 'moonjump' rides along with the high ones only so that the speech bubble steps aside */
.lucky.lsm-high, .lucky.lsm-high.moonjump { animation: lsmHigh 4.4s ease-in-out; }
@keyframes lsmHigh {
  8% { translate: 0 2%; scale: 1.08 .9; rotate: 0deg; } 24% { translate: 0 -92%; scale: .96 1.05; rotate: -8deg; }
  34% { translate: 2% -96%; scale: 1 1; rotate: 6deg; } 62% { translate: -2% -52%; rotate: -5deg; } 86% { translate: 0 -4%; rotate: 0deg; }
  92% { translate: 0 1%; scale: 1.08 .92; } 100% { translate: 0 0; scale: 1 1; rotate: 0deg; } }
.lucky.lsm-flip, .lucky.lsm-flip.moonjump { animation: lsmFlip 2.6s ease-in-out; }
@keyframes lsmFlip {
  10% { translate: 0 2%; scale: 1.06 .92; rotate: 0deg; } 50% { translate: 0 -60%; scale: 1 1; rotate: -200deg; } 86% { translate: 0 -3%; rotate: -360deg; }
  93% { translate: 0 1%; scale: 1.06 .94; rotate: -360deg; } 100% { translate: 0 0; scale: 1 1; rotate: -360deg; } }
.lucky.lsm-drive { animation: lsmDrive .28s ease-in-out infinite; }
@keyframes lsmDrive { 50% { translate: 0 -1.2%; } }
.lucky.lsm-bump, .lucky.lsm-bump.lsm-drive { animation: lsmBump .9s ease-in-out; }
@keyframes lsmBump { 30% { translate: 0 -20%; rotate: -8deg; } 60% { translate: 0 -5%; rotate: 5deg; } 80% { translate: 0 1%; rotate: 0deg; scale: 1.05 .95; } 100% { translate: 0 0; scale: 1 1; } }
.lucky.lsm-glow .l-art { filter: drop-shadow(0 0 8px #B6FF8E) drop-shadow(0 0 18px #7CFFD4) brightness(1.06); }
.fly-fx.lsm-glowfx { filter: drop-shadow(0 0 5px #B6FF8E) drop-shadow(0 0 12px #7CFFD4); }
.fly-fx.lsm-print { filter: grayscale(1) brightness(.7); opacity: .7; }
`,

  props: () => ({
    // Lucky at the wheel of the rover: the tub in front of him, the camera head at the front, the dish at the back
    spaceMoonRover: { slot: 'feet', art: () => `<path d="M34 194 L67 170 L100 194 L133 170 L166 194" stroke="#8C87A6" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M22 150 V112" stroke="#C9C5DB" stroke-width="5" stroke-linecap="round"/><rect x="2" y="92" width="40" height="24" rx="9" fill="#F2F0F8"/>
      <circle cx="14" cy="104" r="6.5" fill="#2E3350"/><circle cx="30" cy="104" r="6.5" fill="#2E3350"/><circle cx="16" cy="101.5" r="2.2" fill="#fff"/><circle cx="32" cy="101.5" r="2.2" fill="#fff"/>
      <path d="M182 150 V118" stroke="#C9C5DB" stroke-width="4"/><path d="M166 118 Q182 134 200 110" fill="#ECEAF5" stroke="#C9C5DB" stroke-width="2"/>
      <rect x="10" y="144" width="180" height="40" rx="14" fill="#F2F0F8"/><rect x="10" y="170" width="180" height="14" rx="7" fill="#D9D6E8"/>
      <rect x="64" y="152" width="72" height="14" rx="5" fill="#F2B33D"/><path d="M82 152 v14 M100 152 v14 M118 152 v14" stroke="#E09A2A" stroke-width="1.6"/><circle cx="174" cy="158" r="4" fill="#FF5E62"/>
      ${[34, 100, 166].map((x) => `<g class="lsm-pwheel"><circle cx="${x}" cy="194" r="16" fill="#4E4870"/><path d="M${x} 180 v28 M${x - 14} 194 h28" stroke="#6A6390" stroke-width="3"/><circle cx="${x}" cy="194" r="7" fill="#CFCBE0"/></g>`).join('')}` },
    // the alien's present: two antennae with glowing balls
    spaceMoonAntennae: { slot: 'head', art: () => `<path d="M86 46 Q80 26 68 13 M114 46 Q120 26 132 13" stroke="#7FDF90" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M76 52 Q100 38 124 52" stroke="#7FDF90" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="lsm-antball"><circle cx="66" cy="10" r="8" fill="#C8FF9E"/><circle cx="134" cy="10" r="8" fill="#C8FF9E"/></g><circle cx="63" cy="7" r="2.6" fill="#fff"/><circle cx="131" cy="7" r="2.6" fill="#fff"/>` },
    // his own flag: a carrot on it, and a rod along the top (there's no wind to hold it out)
    spaceMoonCarrotFlag: { slot: 'hand', art: () => `<path d="M160 206 V36" stroke="#ECEAF5" stroke-width="4" stroke-linecap="round"/><path d="M160 38 H206" stroke="#ECEAF5" stroke-width="3" stroke-linecap="round"/>
      <path d="M161 39 H206 V72 Q195 68 184 72 Q172 76 161 71Z" fill="#FFF3E0"/><path d="M170 66 L193 46 L199 54Z" fill="#FF8A2B"/><path d="M180 60 l3 3 M187 54 l3 3" stroke="#E06B12" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M196 50 q2 -8 -2 -11 M196 50 q6 -5 10 -3 M196 50 q7 1 8 6" stroke="#4CB84C" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="160" cy="34" r="3.5" fill="#FFD23F"/>` },
    // a moon rock in his paw
    spaceMoonRock: { slot: 'hand', art: () => `<g transform="translate(158 158)"><path d="M-15 6 Q-18 -8 -6 -12 Q6 -18 14 -8 Q20 2 12 10 Q0 16 -15 6Z" fill="#B5B0CB"/>
      <circle cx="-4" cy="-2" r="3.4" fill="#948EAE"/><circle cx="7" cy="4" r="2.2" fill="#948EAE"/><circle cx="4" cy="-9" r="1.6" fill="#948EAE"/>
      <path d="M-10 -6 Q-6 -11 0 -12" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/></g>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, who, oneOf, begin, end, at, hold, onEnd, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, mouth, feet, paw, sceneRect } = k;
    const part = (el, sel) => { const e = el.querySelector(sel); return e ? centerOf(e) : centerOf(el); };
    const hide = (a, el) => { if (!el) return; el.classList.add('lsm-away'); onEnd(a, () => el.classList.remove('lsm-away')); };
    const dust = (x, y, n = 4) => api.fxAt(x, y, ['💨'], n, 'spark');

    // ---------- the Earth in the sky, and the telescope pointed at it (both answer as the Earth) ----------
    const sky = (c) => c.el.ownerSVGElement?.querySelector('[data-tap="moonEarth"]:not(.lsm-scope)') || c.el;
    const scope = (c) => c.el.ownerSVGElement?.querySelector('[data-tap="moonEarth"].lsm-scope') || c.el;
    const earth = (c) => part(sky(c), '.lsm-globe');
    const waveHome = (c) => {
      api.hop(sky(c), 'lsmshine', 1600);
      sfx.chime();
      api.hearts(...earth(c), 3);
      pose('happy', 1800, 'wave', 1200);
      line('spaceMoonWave', 1);
    };
    // the Earth turns round, and there is Ireland
    const ireland = (c) => {
      const a = begin('lsmIreland');
      api.hop(sky(c), 'lsmturn', 4000);
      sfx.whirr();
      pose('ok', 2200, 'tilt', 1400);
      at(a, 2300, () => {
        const [x, y] = part(sky(c), '.lsm-ie');
        popUp('☘️', x + 2, y - 20, 2600, 30);
        sfx.sparkle();
        pose('laugh', 1600, 'binky');
        line('spaceMoonIreland', 1, 0);
        api.reward();
      });
      at(a, 3800, end);
    };
    R.moonEarth = {
      press: (c) => { sfx.note(880); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('spaceMoonEarth', waveHome, ireland)),
      // a kiss blown home
      double: who((c) => {
        const a = begin('lsmKiss'), to = earth(c);
        pose('happy', 1800, 'kiss', 1000);
        sfx.kiss();
        at(a, 400, () => fly('💖', mouth(), to, 1100, { arc: 70, size: 22 }));
        at(a, 1500, () => { api.hearts(...to, 4); api.hop(sky(c), 'lsmshine', 1600); sfx.chime(); line('spaceMoonKiss', 1, 0); });
        at(a, 2600, end);
      }),
      // a look through the telescope: clouds over Ireland, as usual
      long: who((c) => {
        const a = begin('lsmScope'), s = scope(c);
        go(nextTo(s, 24), 700);
        at(a, 750, () => { api.hop(s, 'lsmlook', 1600); sfx.whirr(); pose('ok', 1700, 'peek', 1700); });
        at(a, 1800, () => { const [x, y] = earth(c); popUp('🌧️', x + 6, y - 14, 2600, 28); sfx.rain(); });
        at(a, 2100, () => { pose('laugh', 1800); line('spaceMoonScope', 1, 0); api.reward(); });
        at(a, 4300, end);
      }),
    };

    // ---------- the lander and its flag ----------
    const salute = (c) => {
      api.fxAt(...part(c.el, '.lsm-flagcloth'), ['✨', '⭐'], 4, 'spark');
      sfx.trumpet();
      pose('happy', 1800, 'proud', 1200);
      line('spaceMoonFlag', 1);
    };
    // up the lander's ladder and down again: one small hop for a bunny
    const smallStep = (c) => {
      const a = begin('lsmStep');
      go(nextTo(c.el), 700);
      at(a, 750, () => { hold(a, 'climb', 1400); sfx.taps(); });
      at(a, 2200, () => { pose('happy', 2100, 'moonjump', 2100); sfx.boing(); });
      at(a, 4300, () => { sfx.thump(); dust(...feet()); pose('laugh', 1800, 'proud', 1200); line('spaceMoonStep', 1, 0); api.reward(); });
      at(a, 5600, end);
    };
    R.moonFlag = {
      press: (c) => { sfx.knock(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('spaceMoonFlag', salute, smallStep)),
      // the top of the lander blasts off… and lands back, it's a toy one
      double: (c) => {
        api.hop(c.el, 'lsmlift', 3400);
        sfx.launch();
        const [x, y] = part(c.el, '.lsm-ascent');
        dust(x, y + 30, 5);
        setTimeout(() => { sfx.puff(); dust(x, y + 30, 4); }, 3100);
        if (api.free()) { pose('surprised', 1200, 'startle', 1100); setTimeout(() => { if (api.free()) { pose('laugh', 1500, 'clap'); line('spaceMoonLiftoff', 1); } }, 900); }
      },
      // he plants his own carrot flag next to the lander's
      long: who((c) => {
        const a = begin('lsmPlant');
        go(nextTo(c.el), 700);
        at(a, 750, () => { prop('spaceMoonCarrotFlag', 3600); pose('ok', 1600, 'dig', 1800); sfx.puff(); dust(...feet(), 5); });
        at(a, 1500, () => { sfx.puff(); dust(...feet(), 3); });
        at(a, 2500, () => { sfx.fanfare(); pose('happy', 2200, 'proud', 1200); line('spaceMoonCarrotFlag', 1, 0); api.hearts(...head(), 4); api.reward(); });
        at(a, 4300, () => { unprop('hand'); api.hop(c.el, 'lsmplanted', 20000); sfx.pop(); });
        at(a, 4700, end);
      }),
    };

    // ---------- the moon rover ----------
    // Lucky drives it off, bumps over a crater and parks it again
    const drive = (c) => {
      const a = begin('lsmDrive'), park = nextTo(c.el);
      go(park, 700);
      onEnd(a, () => unprop('feet'));
      at(a, 750, () => { hide(a, c.el.querySelector('.lsm-rover')); prop('spaceMoonRover', 9000); sfx.beep(true); pose('happy', 1200, 'hop'); });
      at(a, 1300, () => { hold(a, 'lsm-drive', 4800); sfx.rumble(); go(30, 1800); line('spaceMoonDrive', 1, 0); });
      at(a, 3300, () => { hold(a, 'lsm-bump', 900); sfx.boing(); dust(...feet(), 5); pose('surprised', 900); });
      at(a, 4300, () => { api.setTemp('laugh', 1800); sfx.rumble(); go(park, 1600); line('spaceMoonBump', 1, 0); });
      at(a, 6100, () => { sfx.beep(false); api.reward(); });
      at(a, 6300, end);
    };
    // it drives off by itself: someone on Earth is steering it
    const solo = (c) => {
      api.hop(c.el, 'lsmroll', 3000);
      sfx.whirr();
      setTimeout(() => sfx.beep(true), 1300);
      setTimeout(() => { if (api.free()) { pose('laugh', 1800, 'tilt', 1400); line('spaceMoonRoverSolo', 1); } }, 500);
    };
    R.moonRover = {
      press: () => sfx.beep(true),
      tap: who(oneOf('spaceMoonRover', drive, solo)),
      double: (c) => {
        api.hop(c.el, 'lsmbeep', 1800);
        sfx.robot();
        [300, 650].forEach((d, i) => setTimeout(() => sfx.beep(i === 0), d));
        if (api.free()) { pose('laugh', 1900, 'jig', 1900); line('spaceMoonBeep', 1); }
      },
      // the rover looks down, finds a moon rock and hands it to Lucky
      long: who((c) => {
        const a = begin('lsmRock');
        go(nextTo(c.el), 700);
        at(a, 750, () => { api.hop(c.el, 'lsmscoop', 1400); sfx.whirr(); });
        at(a, 1300, () => dust(...part(c.el, '.lsm-head'), 3));
        at(a, 2000, () => { prop('spaceMoonRock', 3800); sfx.pop(); api.fxAt(...paw(), ['✨'], 3, 'spark'); pose('happy', 2000, 'proud', 1200); line('spaceMoonRock', 1, 0); api.reward(); });
        at(a, 4200, end);
      }),
    };

    // ---------- the wide crater in front of Lucky: low gravity ----------
    // a super-high jump, then floating down slowly, slowly
    const high = () => {
      const a = begin('lsmHigh');
      hold(a, 'lsm-high', 4400);
      hold(a, 'moonjump', 4400);
      sfx.boing();
      pose('laugh', 4200);
      dust(...feet(), 4);
      at(a, 950, () => sfx.whoosh());
      at(a, 4150, () => { sfx.thump(); dust(...feet(), 5); });
      at(a, 4500, () => { line('spaceMoonHigh', 1, 0); api.reward(); });
      at(a, 5600, end);
    };
    // hop, hop, hop along the rim: footprints that stay for millions of years
    const prints = () => {
      const a = begin('lsmPrints');
      [40, 48, 56].forEach((x, i) => {
        at(a, i * 650, () => go(x, 450));
        at(a, i * 650 + 380, () => { pose(null, 0, 'hop', 500); sfx.boing(); const [fx, fy] = feet(); popUp('🐾', fx, fy + 4, 5200, 20, 'pop-stay lsm-print'); });
      });
      at(a, 2000, () => { pose('happy', 1800, 'proud', 1200); line('spaceMoonPrints', 1, 0); });
      at(a, 3300, end);
    };
    R.moonCrater = {
      press: (c) => { sfx.puff(); api.hop(c.el, 'lsmpuff', 1400); },
      tap: who(oneOf('spaceMoonCrater', high, prints)),
      // a slow-motion somersault
      double: who(() => {
        const a = begin('lsmFlip');
        hold(a, 'lsm-flip', 2600);
        hold(a, 'moonjump', 2600);
        sfx.whoosh();
        api.setTemp('laugh', 2600);
        at(a, 2300, () => { sfx.thump(); dust(...feet(), 3); });
        at(a, 2650, () => { line('spaceMoonFlip', 1, 0); });
        at(a, 3300, end);
      }),
      // a ball thrown on the moon flies six times farther: over the horizon
      long: who(() => {
        const a = begin('lsmThrow'), w = sceneRect().width;
        pose('happy', 900, 'throw', 700);
        at(a, 300, () => { sfx.whoosh(); fly('🎾', paw(), [w + 30, 20], 1700, { arc: 150, spin: 720, size: 24 }); });
        at(a, 900, () => { pose('surprised', 2400, 'peek', 2000); });
        at(a, 1500, () => line('spaceMoonThrow', 1, 0));
        at(a, 3600, end);
      }),
    };

    // ---------- the alien's greenhouse ----------
    // the alien pops up and shares a glowing carrot
    const share = (c) => {
      const a = begin('lsmShare');
      go(nextTo(c.el), 700);
      at(a, 700, () => { api.hop(c.el, 'lsmpop', 2600); sfx.magic(); });
      at(a, 1300, () => { fly('🥕', part(c.el, '.lsm-c1'), mouth(), 700, { arc: 60, spin: 300, size: 24, cls: 'lsm-glowfx' }); sfx.whoosh(); });
      at(a, 2000, () => { api.setTemp('eat', 1800); sfx.crunch(); hold(a, 'lsm-glow', 3000); api.boost('hunger', 2); });
      at(a, 2300, () => { line('spaceMoonShare', 1, 0); api.reward(); });
      at(a, 4800, end);
    };
    const grow = (c) => {
      api.hop(c.el, 'lsmgrow', 1600);
      sfx.grow();
      const [x, y] = part(c.el, '.lsm-c1');
      api.fxAt(x + 8, y - 10, ['✨'], 5, 'spark');
      setTimeout(() => { if (api.free()) { pose('happy', 1600, 'clap'); line('spaceMoonGrow', 1); } }, 400);
    };
    R.moonGreenhouse = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('spaceMoonGreenhouse', share, grow)),
      // the alien winks with all three eyes and waves
      double: (c) => {
        api.hop(c.el, 'lsmwink', 1600);
        sfx.magic();
        if (api.free()) { pose('happy', 1600, 'wave', 1200); line('spaceMoonAlien', 1); }
      },
      // the alien's present: antennae
      long: who((c) => {
        const a = begin('lsmAntennae');
        api.hop(c.el, 'lsmpop', 2600);
        sfx.magic();
        at(a, 500, () => fly('✨', part(c.el, '.lsm-alien'), head(), 600, { size: 26 }));
        at(a, 1100, () => { prop('spaceMoonAntennae', 12000); sfx.sparkle(); pose('happy', 1600, 'proud', 1200); line('spaceMoonAntennae', 1, 0); api.reward(); });
        at(a, 2700, end);
      }),
    };
  },

  visitors: [
    { e: '🌠', w: 3, path: 'streak', end: ['wish', 'starhead'] },
    { e: '🛸', w: 2, path: 'glide', end: ['alien', 'beam'] },
  ],
};
