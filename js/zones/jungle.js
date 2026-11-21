// Jungle (level 38): a waterfall that works as a shower (with a rainbow in the spray and a secret cave behind it),
// a liana for a Tarzan swing, a parrot that repeats English words (and sometimes gets them hilariously wrong),
// a monkey with a banana and a hibiscus bush. Guests: a toucan and butterflies.

// a pointed leaf from (x, y), pointing down before it is turned by r degrees
const leaf = (x, y, l, w, r, c, v = '#ffffff40') => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 C${w} ${l * 0.25} ${w} ${l * 0.7} 0 ${l} C${-w} ${l * 0.7} ${-w} ${l * 0.25} 0 0Z" fill="${c}"/><path d="M0 2 V${l - 3}" stroke="${v}" stroke-width="1.5"/></g>`;
// a big leaf with side veins
const bigLeaf = (x, y, l, w, r, c, v = '#ffffff38') => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 C${w} ${l * 0.18} ${w * 1.1} ${l * 0.68} 0 ${l} C${-w * 1.1} ${l * 0.68} ${-w} ${l * 0.18} 0 0Z" fill="${c}"/>
  <path d="M0 2 V${l - 4}" stroke="${v}" stroke-width="2"/>${[0.22, 0.4, 0.58, 0.76].map((t) => `<path d="M0 ${l * t} q${w * 0.4} ${l * 0.04} ${w * 0.75} ${l * 0.1} M0 ${l * t} q${-w * 0.4} ${l * 0.04} ${-w * 0.75} ${l * 0.1}" stroke="${v}" stroke-width="1.4" fill="none"/>`).join('')}</g>`;
// a hibiscus flower: five round petals, a dark heart and a long stamen
const hibiscus = (x, y, s, c, d, cls = '') => `<g transform="translate(${x} ${y}) scale(${s})"><g${cls ? ` class="${cls}"` : ''}>${[0, 72, 144, 216, 288].map((a) => `<path d="M0 0 C-11 -4 -14 -20 -2 -23 C2 -24 6 -23 8 -20 C13 -12 8 -3 0 0Z" fill="${c}" transform="rotate(${a})"/>`).join('')}
  <circle r="6" fill="${d}"/><path d="M0 0 Q6 -6 12 -13" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="12" cy="-13" r="2.6" fill="#FFD23F"/></g></g>`;
// the toucan (no emoji for it): black, a white-yellow bib and a huge orange beak; facing left, in a 64×48 box
const TOUCAN = `<path d="M44 32 l14 12 5 -5z" fill="#1E1A22"/><ellipse cx="40" cy="28" rx="15" ry="12.5" fill="#1E1A22"/>
  <path d="M42 22 q14 3 15 15 q-10 -1 -16 -8z" fill="#3A3542"/><circle cx="30" cy="17" r="10" fill="#1E1A22"/>
  <path d="M22 19 q-1 14 14 19 q-5 -11 -2 -21z" fill="#FFF0A8"/><path d="M36 38 q6 4 11 0" fill="#E8413A"/>
  <path d="M23 10 C12 6 2 11 0 22 C7 17 15 18 23 21Z" fill="#FFB020"/><path d="M0 22 C7 20 15 21 23 21 L23 19 C15 18 7 17 0 22Z" fill="#FF7A1A"/>
  <path d="M1 21 q2 -6 6 -9" stroke="#E8413A" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M15 8 q2 6 1 12" stroke="#2BA84A" stroke-width="2" fill="none"/>
  <circle cx="31" cy="15" r="3.8" fill="#6FD3FF"/><circle cx="31" cy="15" r="1.8" fill="#1E1A22"/><circle cx="31.8" cy="14.2" r=".6" fill="#fff"/>
  <path d="M36 39 v5 M42 39 v5" stroke="#6FA8DC" stroke-width="2.2" stroke-linecap="round"/>`;
const toucanSvg = (w = '1.4em') => `<svg viewBox="0 0 64 48" style="width:${w};height:auto;display:block;overflow:visible">${TOUCAN}</svg>`;
// a drawn bird for fly(): it faces where it flies (or left, towards Lucky, when it lands next to him)
const birdFly = (fly, svg, from, to, ms, opts, faceLeft = false) => {
  const s = fly('', from, to, ms, opts);
  s.innerHTML = svg;
  if (to[0] > from[0] && !faceLeft) s.firstChild.style.transform = 'scaleX(-1)';
  return s;
};
// the guest that is drawn as a toucan in the jungle
const TOUCAN_E = '🐦';
// the scarlet macaw: tail, body, wings and feet; its head (facing left) is separate, so it can turn
const PARROT_BODY = `<path d="M378 452 L390 500 L382 499 L371 456Z" fill="#3B8BEA"/><path d="M372 454 L378 504 L369 501 L365 456Z" fill="#E8413A"/>
  <ellipse cx="374" cy="436" rx="15" ry="22" fill="#E8413A" transform="rotate(14 374 436)"/>
  <path d="M376 420 q17 12 9 42 q-13 -6 -17 -24z" fill="#FFD23F"/><path d="M381 440 q9 12 2 28 q-11 -4 -13 -16z" fill="#3B8BEA"/><path d="M384 446 q4 8 0 18" stroke="#2F6FC4" stroke-width="2" fill="none"/>
  <path d="M368 458 v8 M377 459 v8" stroke="#8A8A92" stroke-width="3" stroke-linecap="round"/>`;
const PARROT_HEAD = `<circle cx="366" cy="410" r="13" fill="#E8413A"/><ellipse cx="359" cy="410" rx="6.5" ry="7.5" fill="#FFF4EC"/>
  <circle cx="360" cy="408" r="2.6" fill="#2A2730"/><circle cx="361" cy="407" r=".9" fill="#fff"/>
  <path d="M354 403 q-13 0 -13 13 q5 -5 13 -3z" fill="#F4EBDD"/><path d="M352 414 q-3 6 3 7 q2 -3 3 -6z" fill="#3A3640"/>`;
const parrotSvg = () => `<svg viewBox="340 394 54 112" style="width:1em;height:auto;display:block;overflow:visible">${PARROT_BODY}${PARROT_HEAD}</svg>`;

// what the parrot says back: the words Lucky teaches it (in the order of jungleParrotTeach), and its mistakes
// (in the order of jungleParrotTrick and jungleParrotOops)
const TEACH = ['Hello! Hello!', 'Banana! Ba-na-na!', 'Thank you! Squawk!', 'Friend! Friend!'];
const TRICK = ['Parrot! Parrot!', 'Polly is the best!'];

const LINES = {
  jungleShower: [['Душ под водопадом! Ля-ля-ля, я всегда пою в душе!', 'A waterfall shower! La-la-la, I always sing in the shower!'], ['Самый большой душ на свете! И вода тёплая.', "The biggest shower in the world! And the water's warm."], ['Водопад моет уши лучше любой ванны!', 'A waterfall washes ears better than any bath!']],
  jungleRainbow: [['Радуга в брызгах водопада! Солнце и вода нарисовали её вместе.', 'A rainbow in the waterfall spray! The sun and the water painted it together.'], ['Смотри, радуга! Каждая капелька работает как маленькая призма.', 'Look, a rainbow! Every tiny drop works like a little prism.']],
  jungleFrog: [['Ой! Лягушка прыгнула мне на голову! Ква-ква, соседка!', 'Whoa! A frog jumped on my head! Ribbit, neighbour!'], ['Лягушка думает, что я кувшинка. А я не кувшинка, я кролик!', "The frog thinks I'm a lily pad. I'm not a lily pad, I'm a bunny!"]],
  jungleCave: [['За водопадом секретная пещера! Найди меня!', "There's a secret cave behind the waterfall! Find me!"], ['Прячусь за водопадом. Тут меня никто не найдёт… или найдёт?', "I'm hiding behind the waterfall. Nobody will find me here… or will they?"]],
  jungleTarzan: [['А-а-а-а-а! Я Лаки, король джунглей!', 'Aaah-ah-ah-aaah! Me Lucky, king of the jungle!'], ['А-а-а-а-а! Смотри, я лечу, как Тарзан!', "Aaah-ah-ah-aaah! Look, I'm flying like Tarzan!"]],
  jungleYell: [['А-а-а-а-а!', 'Aaah-ah-ah-aaah!']],
  jungleSplashdown: [['Плюх! Я целился в травку, а попал в пруд!', 'Splash! I was aiming for the grass and landed in the pool!'], ['Приводнение! Тарзан из меня пока что мокрый.', "Splashdown! So far I'm a rather soggy Tarzan."]],
  jungleSnake: [['Ой! У этой лианы есть глаза! Это змея! Простите, госпожа змея.', "Eek! This vine has eyes! It's a snake! Sorry, Mrs Snake."], ['Я думал, это лиана, а это змея! Она просто висела и отдыхала.', 'I thought it was a vine, but it was a snake! She was just hanging around.']],
  jungleSwing: [['Качели в джунглях! Выше, выше! Ух!', 'A jungle swing! Higher, higher! Wheee!'], ['Лиана — лучшие качели на свете!', 'A vine is the best swing in the world!']],
  jungleParrotTeach: [['Попугай, скажи по-английски «привет»!', "Parrot, say 'hello'!"], ['Повторяй за мной, попугай: «банан» по-английски!', 'Repeat after me, parrot: banana!'], ['Попугай, как будет «спасибо» по-английски?', "Parrot, can you say 'thank you'?"], ['Попугай, а «друг» по-английски знаешь?', "Parrot, do you know the word 'friend'?"]],
  jungleParrotTrick: [['Попугай, скажи по-английски «морковка»!', "Parrot, say 'carrot'!"], ['Попугай, скажи: «Лаки — лучший кролик»!', 'Parrot, say: Lucky is the best bunny!']],
  jungleParrotOops: [['Каррот, а не паррот! Морковка, а не попугай!', 'Carrot, not parrot! Close, but no carrot for you!'], ['Эй! Кто такая Полли? А, это ты. Ладно, ты лучший попугай.', "Hey! Who's Polly? Oh, it's you. Fine, you're the best parrot."]],
  jungleParrotGood: [['Молодец, попугай! Он учит английский быстрее меня.', 'Good parrot! He learns English faster than me.'], ['Ура! Попугай теперь знает новое слово.', 'Hooray! The parrot knows a new word now.']],
  jungleParrotPirate: [['Попугай у меня на плече! Теперь я кролик-пират. Йо-хо-хо!', "A parrot on my shoulder! Now I'm a pirate bunny. Arrr!"]],
  jungleParrotDance: [['Попугай танцует! Попугаи правда умеют танцевать под музыку.', 'The parrot is dancing! Parrots really can dance to a beat, you know.'], ['Танцуем с попугаем! Крылья вверх, ушки вверх!', 'Dancing with the parrot! Wings up, ears up!']],
  jungleSlip: [['Ой-ой! Банановая кожура! Самый старый трюк в джунглях!', 'Whoa! A banana peel! The oldest trick in the jungle!'], ['Обезьянка, это не смешно! Ну ладно, немножко смешно.', "Monkey, that's not funny! Okay, it's a little bit funny."]],
  jungleBanana: [['Обезьянка поделилась бананом! Для кролика это лакомство, как конфетка.', "The monkey shared a banana! For a bunny it's a treat, like a sweet."], ['Спасибо, обезьянка! Делиться — это по-дружески.', 'Thanks, monkey! Sharing is what friends do.']],
  jungleFaces: [['Обезьянка корчит рожицы! Смотри, я тоже умею. Бе-е-е!', 'The monkey is pulling faces! Look, I can do it too. Bleh!'], ['Кто смешнее: я или обезьянка? По-моему, ничья!', "Who's funnier, me or the monkey? I think it's a tie!"]],
  jungleCopy: [['Обезьянка всё повторяет за мной! Я прыгну — и она прыгнет.', 'Monkey see, monkey do! Whatever I do, the monkey does too.']],
  jungleHibiscus: [['Цветок за ушком! Очень по-тропически.', 'A flower behind my ear! Very tropical.'], ['Гибискус за ухом! Я теперь самый нарядный кролик в джунглях.', "A hibiscus behind my ear! Now I'm the fanciest bunny in the jungle."]],
  jungleSneeze: [['Нюх-нюх… Апчхи! Цветок пощекотал мне нос!', 'Sniff, sniff… achoo! The flower tickled my nose!'], ['Какой аромат… Апчхи! Слишком много аромата!', 'What a smell… achoo! Too much smell!']],
  jungleBloom: [['Цветы распустились! Джунгли устроили для нас шоу.', 'The flowers are blooming! The jungle is putting on a show for us.']],
  jungleHula: [['На Гавайях такое цветочное ожерелье называют «лей». Алоха!', 'In Hawaii a flower necklace like this is called a lei. Aloha!'], ['Цветочное ожерелье и танец хула! Алоха!', 'A flower necklace and a hula dance! Aloha!']],
  jungleToucan: [['Тукан! Клюв огромный, а внутри лёгкий, как губка.', "A toucan! Its beak is huge, but inside it's light as a sponge."]],
  jungleToucanBerry: [['Тукан подкинул мне ягодку! Туканы так и едят: подбросят и поймают.', 'The toucan tossed me a berry! Toucans eat like that: toss and catch.']],
};

export default {
  id: 'jungle',
  level: 38,
  name: ['Джунгли', 'Jungle'],
  emoji: ['🦜', '🐒', '🍌', '🌺', '🌴'],
  spots: { L: [22, 690], R: [382, 692], l: [126, 694], r: [276, 694], sky: 300 },
  arrive: [
    ['Джунгли! Тут жарко, влажно и всё-всё зелёное!', "The jungle! It's hot, steamy and green, green, green!"],
    ['Слышишь? Шумит водопад, кричит попугай. Добро пожаловать в джунгли!', 'Hear that? A waterfall and a squawking parrot. Welcome to the jungle!'],
  ],
  lines: LINES,

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C4"/><stop offset=".42" stop-color="#DDF2A6"/><stop offset="1" stop-color="#A9DC8C"/></linearGradient>
<radialGradient id="${u}g" cx="52%" cy="30%" r="40%"><stop offset="0" stop-color="#FFFBE0"/><stop offset="1" stop-color="#FFFBE0" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9FBFF"/><stop offset="1" stop-color="#93DDF6"/></linearGradient>
<linearGradient id="${u}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBE0" stop-opacity=".75"/><stop offset="1" stop-color="#FFFBE0" stop-opacity="0"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/><rect width="400" height="560" fill="url(#${u}g)"/>
<g fill="#C3E7A2"><rect x="138" y="200" width="9" height="270" rx="4"/><rect x="262" y="190" width="11" height="280" rx="5"/></g>
<path d="M0 470 V352 q18 -34 46 -22 q12 -34 50 -26 q20 -30 54 -10 q26 -26 58 -2 q26 -28 58 -4 q28 -24 60 4 q26 -14 54 16 V470Z" fill="#B3DF94"/>
<g class="zj-rays amb" fill="url(#${u}r)"><path d="M168 186 L190 186 L168 600 L112 600Z"/><path d="M206 186 L224 186 L262 600 L212 600Z"/><path d="M236 186 L250 186 L330 600 L294 600Z"/></g>
<path d="M0 476 V420 q24 -26 54 -12 q22 -22 52 -4 q30 -18 60 2 q30 -16 62 2 q30 -18 60 0 q30 -16 58 4 q28 -12 54 10 V476Z" fill="#9AD47F"/>
${bigLeaf(124, 478, 120, 26, 196, '#78C566')}${bigLeaf(110, 480, 96, 22, 222, '#6BBC5C')}${bigLeaf(140, 482, 80, 20, 168, '#86CD70')}
${bigLeaf(290, 480, 124, 28, 164, '#78C566')}${bigLeaf(306, 482, 96, 22, 140, '#6BBC5C')}${bigLeaf(272, 484, 78, 20, 190, '#86CD70')}
<path d="M0 462 Q200 432 400 464 V700 H0Z" fill="#92D06F"/>
<path d="M0 540 Q200 512 400 546 V700 H0Z" fill="#82C863"/>
<path d="M0 612 Q200 594 400 616 V700 H0Z" fill="#75BF57"/>
${[[118, 600, 0.9], [292, 606, 1], [204, 470, 0.7], [70, 476, 0.6], [330, 482, 0.6]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})">${leaf(0, 0, 34, 8, 150, '#5DB758')}${leaf(0, 0, 38, 9, 180, '#4FAE52')}${leaf(0, 0, 34, 8, 210, '#5DB758')}</g>`).join('')}
<path d="M378 700 C372 620 376 540 384 470 C390 400 386 300 392 150 H404 V700Z" fill="#9A6B4A"/>
<path d="M389 650 q-4 -40 2 -80 M392 540 q-3 -40 1 -90 M394 400 q-3 -40 1 -80" stroke="#86593A" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M318 150 C312 230 332 300 324 370 C318 420 338 450 335 480" stroke="#5E8A33" stroke-width="6" fill="none" stroke-linecap="round"/>
${[[317, 210, 55], [324, 262, -55], [326, 318, 55], [322, 392, -55], [332, 440, 55]].map(([x, y, r], i) => leaf(x, y, 15, 6, r, i % 2 ? '#4FAE52' : '#6CC562')).join('')}
<path d="M392 488 C370 486 346 483 316 476" stroke="#8C5A3C" stroke-width="9" stroke-linecap="round" fill="none"/>
${leaf(316, 476, 24, 8, 70, '#4FAE5C')}${leaf(318, 476, 22, 7, 120, '#5CBD62')}${leaf(324, 480, 20, 7, 20, '#4FAE5C')}
<g stroke="#79A646" stroke-width="3" fill="none" stroke-linecap="round"><path d="M128 150 C120 200 140 240 130 290 C126 310 134 320 130 334"/><path d="M276 150 C286 196 268 236 278 276 C282 292 276 300 278 310"/></g>
${[[126, 214, 40], [134, 254, -40], [128, 300, 40], [280, 200, -40], [272, 240, 40], [280, 284, -40]].map(([x, y, r]) => leaf(x, y, 15, 6, r, '#62C068')).join('')}
${hibiscus(130, 336, 0.42, '#FF7AA8', '#D81B60')}${hibiscus(278, 312, 0.38, '#FFB347', '#E06B12')}
${bigLeaf(10, 150, 120, 28, -26, '#3F9A50')}${bigLeaf(70, 140, 110, 26, 14, '#4FAE5C')}${bigLeaf(120, 130, 96, 22, -8, '#5CBD62')}
${bigLeaf(214, 130, 84, 22, 20, '#4FAE5C')}${bigLeaf(300, 140, 104, 26, -18, '#5CBD62')}${bigLeaf(366, 140, 120, 28, 22, '#3F9A50')}${bigLeaf(400, 180, 110, 26, 40, '#4FAE5C')}
<g data-tap="waterfall"><g class="zj-wf" transform="translate(0 24)"><rect x="0" y="298" width="108" height="264" fill="transparent"/>
  <path d="M-4 560 L-4 320 Q4 302 22 306 Q34 294 52 300 Q72 292 90 302 Q106 306 110 324 L114 530 Q60 546 -4 540Z" fill="#AAA497"/>
  <path d="M-4 320 Q4 302 22 306 Q34 294 52 300 L50 540 Q20 544 -4 540Z" fill="#B9B4A8" opacity=".6"/>
  <path d="M6 360 q10 -6 18 2 M90 350 q8 -4 14 4 M8 430 q12 -6 20 2 M92 446 q8 -6 14 2 M4 490 q10 -4 16 4 M94 500 q6 -4 12 2" stroke="#8E887C" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-4 320 Q4 302 22 306 Q34 294 52 300 Q72 292 90 302 Q106 306 110 324 Q92 316 78 320 Q62 312 46 318 Q26 312 12 320 Q2 316 -4 326Z" fill="#6CC05A"/>
  <path class="zj-water" d="M30 308 Q54 302 80 308 L86 530 Q56 536 24 530Z" fill="url(#${u}w)"/>
  <g class="zj-streaks amb" stroke="#fff" stroke-linecap="round" fill="none" opacity=".85"><path d="M38 310 L33 526" stroke-width="3"/><path d="M52 306 L52 530" stroke-width="2.4"/><path d="M66 308 L72 528" stroke-width="3"/></g>
  <ellipse class="zj-pool" cx="56" cy="540" rx="58" ry="16" fill="#4FBDE6"/><ellipse cx="58" cy="537" rx="44" ry="9" fill="#8ADCF5"/>
  <ellipse class="zj-ripple amb" cx="56" cy="540" rx="34" ry="8" fill="none" stroke="#fff" stroke-width="2"/>
  <g class="zj-bow" fill="none" stroke-width="3">${['#FF6B8B', '#FFA24C', '#FFE066', '#6FD68A', '#6FB8FF', '#A98BFF'].map((c, i) => `<path d="M${12 + i * 3} 528 A${44 - i * 3} ${40 - i * 3} 0 0 1 ${100 - i * 3} 528" stroke="${c}"/>`).join('')}</g>
  <g class="zj-foam amb" fill="#fff"><circle cx="28" cy="530" r="7"/><circle cx="41" cy="533" r="9"/><circle cx="56" cy="531" r="8"/><circle cx="70" cy="533" r="9"/><circle cx="83" cy="530" r="7"/></g>
  <ellipse cx="4" cy="552" rx="15" ry="8" fill="#9C968A"/><ellipse cx="106" cy="550" rx="13" ry="7" fill="#9C968A"/><path d="M-6 548 q8 -6 16 -2 M98 546 q6 -4 12 -1" stroke="#C9C4B8" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <g transform="translate(100 318) scale(.7)">${leaf(0, 0, 34, 8, 150, '#4FAE52')}${leaf(0, 0, 38, 9, 190, '#5DB758')}</g><g transform="translate(6 322) scale(.6)">${leaf(0, 0, 34, 8, 170, '#4FAE52')}${leaf(0, 0, 34, 8, 220, '#5DB758')}</g></g></g>
<g data-tap="liana"><rect x="314" y="486" width="64" height="116" fill="transparent"/>
  <g class="zj-vine amb"><path d="M335 480 C329 512 351 532 342 558 C338 572 346 582 344 592" stroke="#5E8A33" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M333 482 C327 512 349 532 340 558" stroke="#8DBA55" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M344 592 q-10 8 -3 15 q9 3 8 -7" stroke="#5E8A33" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M327 478 q8 -9 16 0" stroke="#4E7A2A" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${[[336, 500, -55], [346, 524, 55], [341, 550, -55], [345, 574, 55]].map(([x, y, r], i) => leaf(x, y, 19, 7, r, i % 2 ? '#4FAE52' : '#6CC562')).join('')}</g></g>
<g data-tap="parrot"><g transform="translate(-6 14)"><rect x="326" y="384" width="74" height="86" fill="transparent"/>
  <g class="zj-parrot">${PARROT_BODY}
  <g class="zj-phead amb">${PARROT_HEAD}</g></g></g></g>
<g data-tap="hibiscus"><rect x="294" y="606" width="106" height="84" fill="transparent"/>
  <ellipse cx="348" cy="686" rx="52" ry="6" fill="#000" opacity=".12"/>
  ${bigLeaf(348, 688, 84, 22, 132, '#3E9F52')}${bigLeaf(348, 688, 84, 22, 228, '#3E9F52')}${bigLeaf(348, 688, 90, 24, 172, '#4DB45E')}${bigLeaf(348, 688, 78, 20, 198, '#46AA58')}${bigLeaf(348, 688, 60, 18, 108, '#5CC46A')}${bigLeaf(348, 688, 60, 18, 252, '#5CC46A')}
  ${hibiscus(322, 634, 0.95, '#FF4F6E', '#B3123F', 'zj-hib')}${hibiscus(374, 628, 0.9, '#FF7AA8', '#C2185B', 'zj-hib')}${hibiscus(352, 660, 0.85, '#FF8A3D', '#C2410C', 'zj-hib')}</g>
<g data-tap="monkey"><rect x="0" y="594" width="106" height="96" fill="transparent"/>
  <ellipse cx="54" cy="686" rx="40" ry="6" fill="#000" opacity=".12"/>
  <g transform="translate(54 686) scale(-.92 .92) translate(-356 -686)">
  <path d="M316 686 q2 -24 40 -26 q38 2 42 26z" fill="#8C6A4A"/><path d="M318 672 q38 -22 78 0 q-6 -13 -39 -15 q-33 2 -39 15z" fill="#6CC05A"/>
  <g class="zj-mk"><path class="zj-mtail amb" d="M374 654 q28 -2 26 -30 q-2 -14 -12 -10" stroke="#8A5634" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="356" cy="638" rx="22" ry="24" fill="#9A6440"/><ellipse cx="354" cy="644" rx="13" ry="15" fill="#F2D3AE"/>
  <ellipse cx="340" cy="662" rx="10" ry="5.5" fill="#F2D3AE"/><ellipse cx="370" cy="662" rx="10" ry="5.5" fill="#F2D3AE"/>
  <path d="M374 632 q9 14 -2 24" stroke="#9A6440" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="333" cy="600" r="9" fill="#9A6440"/><circle cx="333" cy="600" r="5" fill="#F2D3AE"/><circle cx="377" cy="600" r="9" fill="#9A6440"/><circle cx="377" cy="600" r="5" fill="#F2D3AE"/>
  <circle cx="355" cy="602" r="21" fill="#9A6440"/><path d="M341 603 q0 -13 9 -13 q5 0 5 5 q0 -5 5 -5 q9 0 9 13 q0 16 -14 16 q-14 0 -14 -16z" fill="#F2D3AE"/>
  <g class="zj-mf1"><circle cx="349" cy="600" r="2.8" fill="#2A2730"/><circle cx="361" cy="600" r="2.8" fill="#2A2730"/><circle cx="350" cy="599" r=".9" fill="#fff"/><circle cx="362" cy="599" r=".9" fill="#fff"/>
  <path d="M353 606 h.1 M357 606 h.1" stroke="#6B4A2E" stroke-width="2.2" stroke-linecap="round"/><path d="M348 611 q7 6 14 0" stroke="#6B4A2E" stroke-width="2" fill="none" stroke-linecap="round"/></g>
  <g class="zj-mf2"><path d="M345 597 l5 3 -5 3 M365 597 l-5 3 5 3" stroke="#2A2730" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M346 608 q9 11 18 0z" fill="#6B2E2E"/><path d="M351 611 q4 10 8 0z" fill="#FF7FA8"/></g>
  <g class="zj-banana"><path d="M314 620 q-3 -19 12 -28 q-4 13 0 28 q-6 4 -12 0z" fill="#FFD84D"/><path d="M318 620 q-1 -14 6 -22" stroke="#F2B92E" stroke-width="2" fill="none"/><path d="M325 593 l3 -5" stroke="#8C6A2E" stroke-width="3" stroke-linecap="round"/></g>
  <path d="M338 632 q-14 -2 -17 -14" stroke="#9A6440" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="321" cy="617" r="5" fill="#F2D3AE"/></g></g></g>
${h.flower(150, 686, '#FF5FA2', 0.85)}${h.flower(256, 690, '#FFD23F', 0.85)}${h.flower(204, 696, '#fff', 0.7)}
</svg>`,

  css: `
.zj-rays.amb { animation: zjRays 7s ease-in-out infinite; }
@keyframes zjRays { 50% { opacity: .45; } }
.zj-streaks { stroke-dasharray: 18 14; }
.zj-streaks.amb { animation: zjFall .7s linear infinite; }
@keyframes zjFall { to { stroke-dashoffset: -32; } }
.zj-foam { transform-box: fill-box; transform-origin: 50% 70%; }
.zj-foam.amb { animation: zjFoam 1.1s ease-in-out infinite; }
@keyframes zjFoam { 50% { transform: scale(1.08, .9); } }
.zj-ripple.amb { transform-box: fill-box; transform-origin: center; animation: zjRipple 2.4s ease-out infinite; }
@keyframes zjRipple { from { transform: scale(.4); opacity: .9; } to { transform: scale(1.3); opacity: 0; } }
.zj-bow { opacity: .28; transition: opacity .7s; }
.zj-vine { transform-box: view-box; transform-origin: 335px 480px; }
.zj-vine.amb { animation: zjVine 5s ease-in-out infinite; }
@keyframes zjVine { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3.5deg); } }
.zj-phead { transform-box: fill-box; transform-origin: 70% 90%; }
.zj-phead.amb { animation: zjPHead 4.5s ease-in-out infinite; }
@keyframes zjPHead { 0%, 70%, 100% { transform: none; } 76% { transform: rotate(-16deg); } 84% { transform: rotate(10deg); } 92% { transform: rotate(-5deg); } }
.zj-mtail { transform-box: fill-box; transform-origin: 0 100%; }
.zj-mtail.amb { animation: zjTail 3s ease-in-out infinite; }
@keyframes zjTail { 50% { transform: rotate(-14deg); } }
.zj-mf2 { opacity: 0; }
.zj-mk, .zj-parrot { transform-box: fill-box; transform-origin: 50% 100%; }
[data-tap="hibiscus"] .zj-hib { transform-box: fill-box; transform-origin: center; }
.zj-gone { visibility: hidden; }

g[data-tap="waterfall"].tapped { animation: zjPress .45s ease-in-out; }
@keyframes zjPress { 40% { transform: scale(1.04); } }
.zj-wf.zj-gush .zj-water { transform-box: fill-box; transform-origin: 50% 0; animation: zjGush .45s ease-in-out 6 alternate; }
@keyframes zjGush { to { transform: scaleX(1.22); } }
.zj-wf.zj-gush .zj-foam { animation: zjFoamBig .45s ease-in-out 6 alternate; }
@keyframes zjFoamBig { to { transform: scale(1.3, 1.25); } }
.zj-wf.zj-bowon .zj-bow { opacity: .95; }
g[data-tap="liana"].tapped { animation: none; }
.zj-vine.zj-wiggle { animation: zjWiggle .3s ease-in-out 4 alternate; }
@keyframes zjWiggle { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
.zj-vine.zj-swingback { animation: zjSwingBack 1.8s ease-out; }
@keyframes zjSwingBack { 0% { transform: rotate(40deg); } 30% { transform: rotate(-20deg); } 55% { transform: rotate(10deg); } 80% { transform: rotate(-4deg); } }
.zj-parrot.zj-squawk { animation: zjSquawk .28s ease-in-out 4 alternate; }
@keyframes zjSquawk { to { transform: scale(1.06, .94) rotate(-5deg); } }
.zj-parrot.zj-dance { animation: zjDance .4s ease-in-out 8 alternate; }
@keyframes zjDance { from { transform: rotate(-9deg); } to { transform: rotate(9deg) translateY(-5px); } }
.zj-mk.zj-throw { animation: zjThrow .6s ease-in-out; }
@keyframes zjThrow { 40% { transform: rotate(-10deg); } 70% { transform: rotate(6deg); } }
.zj-mk.zj-munch { animation: zjMunch .22s ease-in-out 4 alternate; }
@keyframes zjMunch { to { transform: scale(1.04, .95); } }
.zj-mk.zj-silly .zj-mf1 { opacity: 0; }
.zj-mk.zj-silly .zj-mf2 { opacity: 1; }
.zj-mk.zj-silly { animation: zjSilly .35s ease-in-out 6 alternate; }
@keyframes zjSilly { from { transform: rotate(-7deg); } to { transform: rotate(7deg) scale(1.05, .95); } }
.zj-mk.zj-mjump { animation: zjMJump 1s ease-in-out; }
@keyframes zjMJump { 40% { transform: translateY(-36px) scale(.96, 1.06); } 70% { transform: none; } 82% { transform: scale(1.08, .9); } }
.zj-mk.zj-mspin { transform-origin: 50% 60%; animation: zjMSpin .8s ease-in-out; }
@keyframes zjMSpin { to { transform: rotate(360deg); } }
.zj-mk.zj-mclap { animation: zjMunch .2s ease-in-out 6 alternate; }
[data-tap="monkey"].zj-nobanana .zj-banana { visibility: hidden; }
.zj-hib.zj-bloom { animation: zjBloom 1.6s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes zjBloom { 40% { transform: scale(1.4) rotate(24deg); } }

.lucky.zj-fly { animation: zjFly 1.3s ease-in-out; }
@keyframes zjFly { 0% { translate: 0 0; rotate: 0deg; } 45% { translate: 0 -28%; rotate: 14deg; } 80% { translate: 0 -6%; rotate: 4deg; } 100% { translate: 0 0; rotate: 0deg; } }
.lucky.zj-pendulum { transform-origin: 50% -70%; animation: zjPendulum 1.6s ease-in-out infinite; }
@keyframes zjPendulum { 0%, 100% { rotate: 10deg; } 50% { rotate: -10deg; } }
.lucky.zj-behind { opacity: .4; scale: .88; filter: blur(1.4px) saturate(.75); }
.fly-fx.zj-say { background: #fff; color: #3A2A3E; font-weight: 800; padding: .35em .65em; border-radius: 1em; white-space: nowrap; box-shadow: 0 3px 10px #0002; }
.fly-fx.zj-say::after { content: ''; position: absolute; right: 16px; top: -7px; border: 7px solid transparent; border-top: 0; border-bottom-color: #fff; }
`,

  props: (h) => ({
    jungleLiana: { slot: 'hand', art: () => `<path d="M152 170 C162 120 150 40 160 -40 C168 -120 154 -200 162 -300" stroke="#6E9B3C" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${[[158, 110, 50], [155, 30, -50], [163, -50, 50], [158, -130, -50], [161, -210, 50]].map(([x, y, r]) => leaf(x, y, 18, 7, r, '#5DBB5A')).join('')}` },
    jungleBanana: { slot: 'hand', art: () => h.em(158, 156, 34, '🍌') },
    jungleFrogHead: { slot: 'head', art: () => h.em(100, 30, 42, '🐸') },
    jungleParrotShoulder: { slot: 'shoulder', art: () => `<g transform="translate(${160 - 372 * 0.8} ${132 - 467 * 0.8}) scale(.8)">${PARROT_BODY}${PARROT_HEAD}</g>` },
    jungleToucanHead: { slot: 'head', art: () => `<g transform="translate(62 -14) scale(1.2)">${TOUCAN}</g>` },
    jungleHibiscusEar: { slot: 'ear', art: () => hibiscus(152, 58, 0.72, '#FF4F6E', '#B3123F') },
    jungleLei: { slot: 'neck', art: () => [[62, 128, '#FF4F6E'], [74, 138, '#FFD23F'], [87, 144, '#FF7AA8'], [100, 146, '#fff'], [113, 144, '#FF8A3D'], [126, 138, '#FF4F6E'], [138, 128, '#FFD23F']]
      .map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-4.5" r="4.2" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#FFE66D"/></g>`).join('') },
  }),

  reactions: (R, k) => {
    const { api, sfx, who, oneOf, pickWay, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, rainbow, spray, getWet, puddle, line, centerOf, nextTo, sceneRect, head, nose, feet, paw, found } = k;
    const partAt = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    const away = (c, a, cls = 'zj-gone') => { c.el.classList.add(cls); onEnd(a, () => c.el.classList.remove(cls)); };
    // a class on the part that moves (not on the whole thing: its press bounce would end the class too early)
    const hopIn = (c, sel, cls, ms) => api.hop(c.el.querySelector(sel) || c.el, cls, ms);


    // ---------- the waterfall ----------
    // a shower under the waterfall, with a song; then he shakes dry
    const shower = (c) => {
      const a = begin('jungleShower');
      go(nextTo(c.el, 6), 700);
      at(a, 750, () => {
        hopIn(c, '.zj-wf', 'zj-gush', 2800);
        sfx.rain();
        const [hx, hy] = head();
        api.fxAt(hx, hy - 40, ['💧', '💦'], 12, 'drop');
        getWet(a, 2900);
        pose('happy', 2800);
        line('jungleShower', 1, 0);
      });
      at(a, 1300, () => {
        [523, 659, 784, 659, 523].forEach((f, i) => setTimeout(() => sfx.note(f), i * 230));
        api.fxAt(...head(), ['🎵', '🎶'], 4, 'spark');
      });
      at(a, 2000, () => api.fxAt(...head(), ['💧'], 8, 'drop'));
      at(a, 4800, end);
    };
    // the sun shines into the spray: a rainbow
    const fallsRainbow = (c) => {
      hopIn(c, '.zj-wf', 'zj-bowon', 4200);
      hopIn(c, '.zj-wf', 'zj-gush', 2700);
      sfx.splash();
      api.fxAt(c.x, c.y + 60, ['💦', '✨'], 6, 'spark');
      rainbow(4200);
      setTimeout(() => sfx.chime(), 300);
      setTimeout(() => { if (!api.free()) return; pose('laugh', 2000, 'binky'); line('jungleRainbow', 1); api.reward(); }, 500);
    };
    // a frog jumps out of the pool onto his head
    const frog = (c) => {
      const a = begin('jungleFrog'), pool = partAt(c, '.zj-pool');
      sfx.croak();
      fly('🐸', pool, head(), 700, { arc: 80, size: 34 });
      at(a, 700, () => { prop('jungleFrogHead', 2800); pose('surprised', 1400, 'startle', 1100); line('jungleFrog', 1, 0); });
      at(a, 1500, () => sfx.croak());
      at(a, 2300, () => api.setTemp('laugh', 1400));
      at(a, 3300, () => { unprop('head', true); fly('🐸', head(), pool, 700, { arc: 70, size: 34 }); sfx.croak(); });
      at(a, 4000, () => { sfx.splash(); api.fxAt(...pool, ['💦'], 4, 'spark'); });
      at(a, 4300, end);
    };
    // hide and seek in the secret cave behind the water: a tap on him finds him
    const cave = (c) => {
      const a = begin('hide');
      go(26, 800);
      at(a, 800, () => {
        hold(a, 'zj-behind', 4500);
        hopIn(c, '.zj-wf', 'zj-gush', 4500);
        sfx.splash();
        line('jungleCave', 1, 0);
        a.onLuckyTap = () => found(a, 'zj-behind');
      });
      at(a, 2600, () => api.fxAt(...head(), ['💧'], 6, 'drop'));
      at(a, 5300, () => {
        if (a.found) return;
        a.onLuckyTap = null;
        sfx.boing();
        spray(...head());
        pose('laugh', 1400, 'hop');
        line('boo', 1, 0);
        at(a, 1000, end);
      });
    };
    R.waterfall = {
      press: (c) => { sfx.splash(); api.fxAt(c.x, c.y, ['💧', '💦'], 4, 'drop'); },
      tap: who(oneOf('jungleFalls', shower, fallsRainbow)),
      double: who(frog),
      long: who(cave),
    };

    // ---------- the liana ----------
    // he grabs the liana, yells like Tarzan and flies across: onto his feet, or into the pool
    const tarzan = (wet) => (c) => {
      const a = begin('jungleTarzan');
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { away(c, a); prop('jungleLiana', 3200); hold(a, 'strain', 500); api.setTemp('happy', 2600); sfx.whoosh(); });
      at(a, 1300, () => { hold(a, 'zj-fly', 1300); go(wet ? 26 : 34, 1300); sfx.whoosh(); line(wet ? 'jungleYell' : 'jungleTarzan', 1, 0); });
      at(a, 2600, () => {
        unprop('hand');
        c.el.classList.remove('zj-gone');
        hopIn(c, '.zj-vine', 'zj-swingback', 1800);
        if (wet) {
          sfx.splash();
          spray(...feet());
          puddle(3400);
          getWet(a, 2200);
          line('jungleSplashdown', 1, 0);
        } else {
          sfx.thump();
          api.fxAt(...feet(), ['💨'], 3, 'spark');
          pose('grin', 1800, 'squash', 700);
          api.reward();
        }
      });
      at(a, wet ? 5200 : 3900, end);
    };
    R.liana = {
      press: (c) => { sfx.whoosh(); hopIn(c, '.zj-vine', 'zj-wiggle', 1200); },
      tap: who(oneOf('jungleLiana', tarzan(false), tarzan(true))),
      // the liana has eyes: it was a snake all along
      double: (c) => {
        hopIn(c, '.zj-vine', 'zj-wiggle', 1200);
        const [x, y] = partAt(c, 'rect');
        popUp('🐍', x, y, 2200, 40, 'pop-rise');
        sfx.puff();
        setTimeout(() => sfx.puff(), 300);
        if (api.free()) pose('surprised', 1200, 'startle', 1100);
        setTimeout(() => { if (!api.free()) return; api.setTemp('laugh', 1600); line('jungleSnake', 1); }, 600);
      },
      // a jungle swing: back and forth on the liana
      long: who((c) => {
        const a = begin('jungleSwing');
        go(nextTo(c.el, 18), 700);
        at(a, 750, () => { away(c, a); prop('jungleLiana', 4200); hold(a, 'zj-pendulum', 3200); api.setTemp('laugh', 3200); line('jungleSwing', 1, 0); });
        [0, 800, 1600, 2400].forEach((d) => at(a, 950 + d, () => sfx.whoosh()));
        at(a, 4000, () => { unprop('hand'); c.el.classList.remove('zj-gone'); hopIn(c, '.zj-vine', 'zj-swingback', 1800); pose('happy', 1400, 'hop'); api.reward(); });
        at(a, 4900, end);
      }),
    };

    // ---------- the parrot ----------
    const parrotFly = (from, to, ms, opts) => birdFly(fly, parrotSvg(), from, to, ms, opts);
    const squawk = () => { sfx.squeak(); setTimeout(() => sfx.squeak(), 170); };
    // the parrot's words in a speech bubble under its beak
    const parrotSays = (c, word, ms = 2400) => {
      const [hx, hy] = partAt(c, '.zj-phead'), w = sceneRect().width;
      hopIn(c, '.zj-parrot', 'zj-squawk', 1200);
      squawk();
      const s = popUp(word, hx, hy + 54, ms, 19, 'pop-stay zj-say'), half = s.offsetWidth / 2;
      s.style.left = Math.max(half + 6, Math.min(hx + 22 - half, w - half - 6)) + 'px';
    };
    // Lucky teaches it an English word, and the parrot says it back
    const teach = (c) => {
      const a = begin('jungleTeach'), i = pickWay('jungleTeachWord', TEACH.length);
      pose('happy', 2000, 'tilt', 1400);
      line([LINES.jungleParrotTeach[i]], 1, 0);
      at(a, 2300, () => parrotSays(c, TEACH[i]));
      at(a, 3300, () => { pose('laugh', 1600, 'clap', 700); line('jungleParrotGood', 1, 0); api.reward(); });
      at(a, 4400, end);
    };
    // …or gets it hilariously wrong
    const trick = (c) => {
      const a = begin('jungleTeach'), i = pickWay('jungleTrickWord', TRICK.length);
      pose('happy', 2000, 'tilt', 1400);
      line([LINES.jungleParrotTrick[i]], 1, 0);
      at(a, 2300, () => parrotSays(c, TRICK[i], 2800));
      at(a, 3100, () => { pose('surprised', 900, 'startle', 1100); });
      at(a, 3700, () => { api.setTemp('laugh', 2400); line([LINES.jungleParrotOops[i]], 1, 0); });
      at(a, 5200, end);
    };
    R.parrot = {
      press: (c) => { squawk(); hopIn(c, '.zj-parrot', 'zj-squawk', 1200); api.fxAt(c.x, c.y, ['🪶'], 2, 'spark'); },
      tap: who(oneOf('jungleParrot', teach, trick)),
      // the parrot sits on his shoulder: a pirate bunny
      double: who((c) => {
        const a = begin('jungleParrotPirate'), from = partAt(c, '.zj-parrot'), perch = () => api.luckyPoint(0.8, 0.5);
        away(c, a);
        squawk();
        parrotFly(from, perch(), 700, { arc: 60, size: 46 });
        at(a, 700, () => { prop('jungleParrotShoulder', 3000); pose('grin', 2800, 'proud', 1200); line('jungleParrotPirate', 1, 0); });
        at(a, 2100, () => { squawk(); const [x, y] = api.luckyPoint(0.84, 0.66); popUp('Arrr!', x, y, 1500, 19, 'pop-stay zj-say'); });
        at(a, 3700, () => { unprop('shoulder', true); parrotFly(perch(), from, 700, { arc: 60, size: 46 }); squawk(); api.setTemp('laugh', 1400); });
        at(a, 4400, end);
      }),
      // a dance party: parrots really can dance to a beat
      long: who((c) => {
        const a = begin('jungleParrotDance');
        hopIn(c, '.zj-parrot', 'zj-dance', 3400);
        sfx.disco();
        pose('laugh', 3200, 'dance', 2200);
        line('jungleParrotDance', 1, 0);
        at(a, 800, () => api.fxAt(c.x, c.y - 20, ['🎵', '🎶'], 4, 'spark'));
        at(a, 2000, () => { api.fxAt(...head(), ['🎵', '✨'], 4, 'spark'); api.reward(); });
        at(a, 3500, end);
      }),
    };

    // ---------- the monkey ----------
    const ooh = () => [740, 988, 740, 988].forEach((f, i) => setTimeout(() => sfx.note(f), i * 110));
    // the monkey eats its banana and throws the peel under Lucky's feet: whoops!
    const peel = (c) => {
      const a = begin('jungleSlip');
      hopIn(c, '.zj-mk', 'zj-munch', 1000);
      sfx.crunch();
      at(a, 1000, () => {
        away(c, a, 'zj-nobanana');
        hopIn(c, '.zj-mk', 'zj-throw', 700);
        sfx.whoosh();
        const [fx, fy] = feet();
        fly('🍌', partAt(c, '.zj-banana'), [fx - 20, fy - 6], 650, { arc: 60, spin: 300, size: 26, stay: 2000 });
      });
      at(a, 1700, () => { sfx.boing(); pose('surprised', 1300, 'slip', 1800); });
      at(a, 2700, () => { sfx.bonk(); api.fxAt(...head(), ['💫', '⭐'], 4, 'spark'); });
      at(a, 3000, () => { api.setTemp('laugh', 1800); line('jungleSlip', 1, 0); ooh(); });
      at(a, 4500, end);
    };
    // it shares its banana: a sweet treat
    const share = (c) => {
      const a = begin('jungleBanana');
      away(c, a, 'zj-nobanana');
      hopIn(c, '.zj-mk', 'zj-throw', 700);
      ooh();
      fly('🍌', partAt(c, '.zj-banana'), paw(), 700, { arc: 70, spin: 360, size: 28 });
      at(a, 700, () => { prop('jungleBanana', 3000); sfx.catch(); pose('happy', 800, 'hop'); });
      at(a, 1300, () => { api.setTemp('eat', 1800); sfx.yum(); line('jungleBanana', 1, 0); api.boost('hunger', 2); api.reward(); });
      at(a, 3400, end);
    };
    R.monkey = {
      press: (c) => { ooh(); hopIn(c, '.zj-mk', 'zj-munch', 900); },
      tap: who(oneOf('jungleMonkey', peel, share)),
      // the monkey pulls a face, and Lucky pulls one back
      double: (c) => {
        hopIn(c, '.zj-mk', 'zj-silly', 2400);
        ooh();
        setTimeout(() => { if (!api.free()) return; pose('cheeky', 2200, 'bigears', 1900); sfx.boing(); line('jungleFaces', 1); }, 800);
      },
      // monkey see, monkey do: whatever Lucky does, the monkey does too
      long: who((c) => {
        const a = begin('jungleCopy');
        line('jungleCopy', 1, 0);
        [['bigjump', 'zj-mjump', 1100], ['twirl', 'zj-mspin', 900], ['clap', 'zj-mclap', 800]].forEach(([mv, mm, ms], i) => {
          at(a, 600 + i * 1500, () => { pose('happy', ms, mv, ms); sfx.boing(); });
          at(a, 1200 + i * 1500, () => { hopIn(c, '.zj-mk', mm, ms + 200); ooh(); });
        });
        at(a, 5200, () => { pose('laugh', 1500, 'binky'); api.hearts(...head(), 3); api.reward(); });
        at(a, 6200, end);
      }),
    };

    // ---------- the hibiscus ----------
    // a flower behind his ear
    const tuck = (c) => {
      fly('🌺', [c.x, c.y], api.luckyPoint(0.76, 0.26), 600, { arc: 40, size: 24 });
      setTimeout(() => { prop('jungleHibiscusEar', 9000); sfx.chime(); pose('happy', 1500, 'proud', 1200); line('jungleHibiscus', 1); api.reward(); }, 600);
    };
    // a big sniff… achoo!
    const sniff = (c) => {
      const a = begin('jungleSniff');
      go(nextTo(c.el, 14), 700);
      at(a, 750, () => { pose('happy', 1200, 'sniff', 1500); sfx.sniff(); });
      at(a, 1850, () => api.setTemp('sleep', 400));
      at(a, 2250, () => { sfx.sneeze(); pose('laugh', 1400, 'sneeze', 600); api.fxAt(...nose(), ['🌺', '💨'], 4, 'spark'); line('jungleSneeze', 1, 0); });
      at(a, 3400, end);
    };
    R.hibiscus = {
      press: (c) => { sfx.pop(); api.fxAt(c.x, c.y, ['🌺'], 3, 'spark'); },
      tap: who(oneOf('jungleHibiscus', tuck, sniff)),
      // the flowers open wide and butterflies fly out
      double: (c) => {
        c.el.querySelectorAll('.zj-hib').forEach((e) => api.hop(e, 'zj-bloom', 1600));
        sfx.grow();
        api.fxAt(c.x, c.y - 20, ['🌺', '🌸'], 5, 'drop petal-fx');
        [0, 250].forEach((d, i) => setTimeout(() => fly('🦋', [c.x, c.y], [c.x + 60 + i * 50, c.y - 160 - i * 40], 1400, { arc: 30, size: 22 }), d));
        if (api.free()) { pose('happy', 1800, 'twirl', 800); line('jungleBloom', 1); }
      },
      // a flower necklace and a hula dance
      long: who(() => {
        const a = begin('jungleHula');
        prop('jungleLei', 4400);
        sfx.magic();
        hold(a, 'hula', 3000);
        api.setTemp('happy', 3200);
        line('jungleHula', 1, 0);
        at(a, 400, () => [523, 587, 659, 784, 659, 587, 523].forEach((f, i) => setTimeout(() => sfx.note(f), i * 260)));
        at(a, 3000, () => { api.hearts(...head(), 4); api.reward(); });
        at(a, 3700, end);
      }),
    };
  },

  visitors: [
    // no toucan emoji exists: the guest is drawn (html)
    { e: TOUCAN_E, html: toucanSvg(), w: 2, path: 'glide', end: ['jungleToucan', 'jungleToucanBerry'], flip: true },
    { e: '🦋', w: 3, path: 'flutter', end: ['nose', 'ear', 'circle', 'family'] },
  ],

  // the toucan, drawn: it sits on his head for a moment, or tosses him a berry
  endings: (k) => {
    const toucan = (from, to, ms, opts, faceLeft) => birdFly(k.fly, toucanSvg(), from, to, ms, opts, faceLeft);
    const off = () => [k.sceneRect().width + 50, 30];
    return {
      jungleToucan: (a, x, y) => {
        toucan([x, y], k.head(), 700, { arc: 50, size: 40 });
        k.at(a, 700, () => { k.prop('jungleToucanHead', 3000); k.pose('surprised', 1200, 'startle', 1100); k.line('jungleToucan', 1, 0); });
        k.at(a, 1900, () => k.api.setTemp('happy', 1800));
        k.at(a, 3600, () => { k.unprop('head', true); toucan(k.head(), off(), 1000, { arc: 60, size: 40 }); });
      },
      jungleToucanBerry: (a, x, y) => {
        const [hx, hy] = k.head(), perch = [Math.min(hx + 90, k.sceneRect().width - 30), hy - 20];
        toucan([x, y], perch, 700, { arc: 40, size: 40, stay: 1900 }, true);
        k.at(a, 900, () => { k.fly('🫐', perch, k.mouth(), 800, { arc: 90, spin: 360, size: 20 }); k.sfx.whoosh(); k.api.setTemp('surprised', 800); });
        k.at(a, 1700, () => { k.api.setTemp('eat', 1600); k.sfx.yum(); k.line('jungleToucanBerry', 1, 0); });
        k.at(a, 2600, () => toucan(perch, off(), 1000, { arc: 60, size: 40 }));
      },
    };
  },
};
