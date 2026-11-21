// Village (level 53): Grandma's summer village in Ukraine. A white hut with a thatched roof and a stork's nest on it,
// a wattle fence with clay pots and a rooster, a sweep well, a cherry tree, sunflowers and the wheat field far away.

// a sunflower head: two rings of petals around a brown middle full of seeds
const sfHead = (x, y, r) => {
  const ring = (n, c, off, k) => Array.from({ length: n }, (_, i) => `<ellipse cx="${x}" cy="${(y - r * k).toFixed(1)}" rx="${(r * 0.3).toFixed(1)}" ry="${(r * 0.5).toFixed(1)}" fill="${c}" transform="rotate(${(off + (i * 360) / n).toFixed(1)} ${x} ${y})"/>`).join('');
  const seeds = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return `<circle cx="${(x + Math.cos(a) * r * 0.42).toFixed(1)}" cy="${(y + Math.sin(a) * r * 0.42).toFixed(1)}" r="${(r * 0.07).toFixed(1)}"/>`; }).join('');
  return ring(14, '#F2A516', 13, 1.05) + ring(14, '#FFCB2E', 0, 1) + `<circle cx="${x}" cy="${y}" r="${(r * 0.66).toFixed(1)}" fill="#6B3E1F"/>`
    + `<circle cx="${x}" cy="${y}" r="${(r * 0.36).toFixed(1)}" fill="#55301A"/><g fill="#9A6A3A">${seeds}</g>`;
};
// a whole sunflower: stem, two leaves and a head that can turn to the sun
const sunflower = (x, y, r, d) => `<g class="zv-sf amb" style="animation-delay:${d}s">
  <path d="M${x} ${y + r} Q${x - 5} ${y + 60} ${x + 2} 706" stroke="#4E9A3E" stroke-width="${(r * 0.3).toFixed(1)}" fill="none"/>
  <path d="M${x - 1} ${y + 44} q-24 -8 -28 10 q20 6 28 -10z" fill="#5DB04A"/><path d="M${x} ${y + 70} q24 -10 30 6 q-20 8 -30 -6z" fill="#4E9A3E"/>
  <g class="zv-sfh">${sfHead(x, y, r)}</g></g>`;

// a pair of cherries on their stems (x, y: where the stems meet)
const cherries = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -9 q-1 5 -4 9 M0 -9 q2 5 4 10" stroke="#3B6E2A" stroke-width="1.3" fill="none"/>
  <circle cx="-4" cy="0" r="4.6" fill="#D62839"/><circle cx="4" cy="1" r="4.6" fill="#C21F31"/><circle cx="-5.5" cy="-1.5" r="1.3" fill="#fff" opacity=".8"/></g>`;

// the stork in flight, facing right, centred on 0 0 (in the picture and as a flying effect)
const FLYER = `<path d="M-20 4 L-58 9 M-20 6 L-56 13" stroke="#E5533D" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M-24 2 L-38 -1 L-30 8Z" fill="#fff"/><ellipse cx="-4" cy="3" rx="24" ry="8.5" fill="#fff"/>
  <path d="M-26 6 Q-6 13 14 6" stroke="#2B2A30" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M16 0 Q28 -6 36 -6" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>
  <circle cx="38" cy="-6" r="5.5" fill="#fff"/><path d="M42 -8.5 L63 -3.5 L42 -3Z" fill="#E5533D"/><circle cx="39.5" cy="-7.5" r="1.3" fill="#222"/>
  <g class="zv-wing"><path d="M-16 1 Q-14 -30 2 -42 Q14 -34 10 0Z" fill="#fff"/><path d="M-14 -16 Q-10 -36 2 -42 Q6 -30 -2 -14Z" fill="#2B2A30"/></g>`;
const flyerSvg = (flip) => `<svg viewBox="-62 -46 128 64" width="2.4em" height="1.2em" style="display:block;overflow:visible${flip ? ';transform:scaleX(-1)' : ''}">${FLYER}</svg>`;
// a stork flying from one point of the scene to another, as a flying effect
const storkFx = (k, from, to, ms, stay = 0) => {
  const s = k.fly('', from, to, ms, { size: 44, stay });
  s.innerHTML = flyerSvg(to[0] < from[0]);
  return s;
};

// sounds: cock-a-doodle-doo, a cluck, the stork clattering its beak
const crowSong = (sfx) => [[0, 587], [140, 698], [280, 880], [440, 880], [600, 784]].forEach(([d, f]) => setTimeout(() => sfx.note(f), d));
const cluck = (sfx) => { sfx.note(620); setTimeout(() => sfx.note(540), 130); };
const clatter = (sfx, n = 9) => { for (let i = 0; i < n; i++) setTimeout(() => sfx.tick(), i * 60); };

export default {
  id: 'village',
  level: 53,
  name: ['Село', 'Village'],
  emoji: ['🌻', '🐓', '🍒', '🏡', '🪣'],
  spots: { L: [26, 690], R: [378, 692], l: [134, 694], r: [270, 694], sky: 300 },
  arrive: [
    ['Привіт, село! Як тут гарно!', "Hello, village! It's so lovely here!"],
    ['Село! Пахнет вишнями, подсолнухами и бабушкиными пирожками!', "The village! It smells of cherries, sunflowers and Grandma's pies!"],
  ],

  lines: {
    villageSmoke: [['Из трубы дымок — значит, бабушка что-то печёт!', "Smoke from the chimney means Grandma's baking something!"], ['Чую-чую: пирожки с вишней! Мой нос не ошибается.', 'Sniff, sniff: cherry pies! My nose is never wrong.']],
    villageVarenyky: [['Вареники з вишнями! Смачного всім!', 'Cherry varenyky! Enjoy your meal, everyone!'], ['Вареники с вишней и сметанкой! Бабушка, спасибо!', 'Cherry varenyky with sour cream! Thank you, Grandma!'], ['Один вареник с вишней — и во рту сразу лето!', 'One cherry varenyk and my mouth tastes like summer!']],
    villageCat: [['Котик на окошке! Он тут главный по сметане.', "A kitty in the window! He's in charge of the sour cream."]],
    villageWhitewash: [['Белю хату! Ой… теперь я тоже беленький!', "I'm whitewashing the hut! Oops… now I'm white too!"]],
    villageStorkClack: [['Аисты не поют, а щёлкают клювом: тра-та-та!', "Storks don't sing, they clatter their beaks: rat-a-tat!"], ['Тра-та-та! Это аист так здоровается.', "Rat-a-tat! That's how a stork says hello."]],
    villageStorkGift: [['Аист облетел всё село и принёс мне вишенку!', 'The stork flew around the whole village and brought me a cherry!'], ['Спасибо, аист! Говорят, аисты приносят счастье.', 'Thank you, stork! They say storks bring happiness.']],
    villageOneLeg: [['Аист стоит на одной ноге. Я тоже так могу… почти!', 'The stork stands on one leg. I can do that too… almost!']],
    villageStorkNest: [['Привіт, лелеко! Лелека на хаті — щастя в хаті!', 'Hello, stork! A stork on the roof means happiness in the home!']],
    villageBucket: [['Колодезная вода — самая холодная на свете! Бр-р, вкусно!', 'Well water is the coldest in the world! Brr, delicious!'], ['Тяну-тяну ведро… Есть! Глоточек холодной водички.', 'Pull, pull the bucket… got it! A sip of cold water.']],
    villageFrog: [['Ой! Лягушка в ведре! Ты тоже пришла попить?', 'Whoa! A frog in the bucket! Did you come for a drink too?'], ['Ква! Лягушка выпрыгнула из ведра. Я чуть не выпрыгнул из шубки!', 'Ribbit! A frog jumped out of the bucket. I nearly jumped out of my fur!']],
    villageSplash: [['Ух, холодная! Зато в жару — самое то!', "Whoa, that's cold! But perfect on a hot day!"]],
    villageEcho: [['Ау-у! Колодец отвечает: у-у-у… Это эхо!', "Hello-o! The well answers: o-o-o… It's an echo!"]],
    villageCherryEat: [['Вишня прямо с ветки! Кисленькая и сладкая сразу.', 'A cherry straight from the branch! Sour and sweet at once.'], ['Ам! Самая спелая вишенка — моя!', 'Yum! The ripest cherry is mine!']],
    villageEarrings: [['Вишнёвые серёжки! Красиво, правда?', 'Cherry earrings! Pretty, right?'], ['Смотри, у меня серёжки из вишен! И красиво, и вкусно.', 'Look, cherry earrings! Pretty and tasty.']],
    villageCherryRain: [['Вишнепад! Лови-лови!', "It's raining cherries! Catch them!"]],
    villageClimb: [['Самая спелая вишня — всегда на самой верхушке!', 'The ripest cherry is always right at the top!']],
    villageCrow: [['Кукареку! Петух — самый громкий будильник в селе!', 'Cock-a-doodle-doo! The rooster is the loudest alarm clock in the village!'], ['Кукареку! Ой, у меня ушки подпрыгнули!', 'Cock-a-doodle-doo! Whoa, my ears jumped!']],
    villageCrowBack: [['Ку-ка-ре-ку! Ну как, похоже? Петух, кажется, обиделся.', "Cock-a-doodle-doo! Did I get it right? I think the rooster's offended."], ['Кукареку! Теперь тут целых два петуха.', 'Cock-a-doodle-doo! Now there are two roosters here.']],
    villageFeather: [['Апчхи! Петух подарил мне пёрышко… прямо в нос!', 'Achoo! The rooster gave me a feather… right up my nose!']],
    villageWakeUp: [['Я только задремал… Уже утро? Петух, ну ты и громкий!', "I'd only just dozed off… Is it morning already? Rooster, you're so loud!"]],
    villageSunTurn: [['Подсолнухи поворачиваются за солнышком. И я тоже!', 'Sunflowers turn to follow the sun. Me too!'], ['Подсолнух — потому что всегда смотрит на солнце!', "No wonder it's called a sunflower: it always looks at the sun!"]],
    villageSeeds: [['Семечки! Щёлк-щёлк… не оторваться!', "Sunflower seeds! Crack, crack… I can't stop!"], ['В одном подсолнухе может быть тысяча семечек! Мне хватит до вечера.', 'One sunflower can hold a thousand seeds! That should last me till evening.']],
    villageSunFace: [['Угадай, кто это? Подсолнух с ушами!', 'Guess who? A sunflower with ears!']],
    villageStorkVisit: [['Аист принёс мне подарок… морковку! Вот это доставка!', "The stork brought me a present… a carrot! Now that's a delivery!"]],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC6FF"/><stop offset=".5" stop-color="#B8E4FF"/><stop offset=".62" stop-color="#FFF0C4"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9DC7C"/><stop offset="1" stop-color="#EDB548"/></linearGradient>
<linearGradient id="${u}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0CD76"/><stop offset="1" stop-color="#D4A24B"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="204" cy="238" r="56" fill="url(#${u}g)"/><circle cx="204" cy="238" r="26" fill="#FFD84D"/></g>
${h.cloud(356, 222, 0.4, 'slow')}${h.cloud(22, 302, 0.5)}
<g fill="#5DAF5C"><ellipse cx="146" cy="390" rx="8" ry="26"/><ellipse cx="162" cy="396" rx="6" ry="20"/><ellipse cx="216" cy="394" rx="7" ry="22"/></g>
<path d="M0 410 Q100 396 200 402 T400 398 V480 H0Z" fill="url(#${u}f)"/>
<path d="M0 422 Q100 410 200 416 T400 412 M0 436 Q100 425 200 430 T400 426" stroke="#E2A73E" stroke-width="2" fill="none" opacity=".55"/>
<path d="M0 458 Q110 446 220 452 T400 450 V700 H0Z" fill="#A8DC82"/>
<g transform="translate(30 0)"><g data-tap="hata" class="zv-hut"><rect x="238" y="424" width="134" height="86" fill="transparent"/>
  <ellipse cx="322" cy="506" rx="84" ry="6" fill="#000" opacity=".1"/>
  <rect x="252" y="396" width="144" height="104" rx="6" fill="#FFFDF6"/>
  <rect class="zv-fresh" x="252" y="396" width="144" height="104" rx="6" fill="#fff" opacity="0"/>
  <path d="M254 488 H394" stroke="#4F8FE0" stroke-width="3"/>
  <rect x="248" y="494" width="152" height="12" rx="4" fill="#CF8A52"/><path d="M251 496 H397" stroke="#E0A26C" stroke-width="2"/>
  <rect x="269" y="438" width="7" height="26" rx="2" fill="#4F8FE0"/><rect x="314" y="438" width="7" height="26" rx="2" fill="#4F8FE0"/>
  <path d="M272.5 444 v14 M317.5 444 v14" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 3"/>
  <rect x="276" y="436" width="38" height="30" rx="3" fill="#3F7FD0"/><rect x="280" y="440" width="30" height="22" fill="#6B4636"/>
  <g class="zv-cl"><rect x="280" y="440" width="15" height="22" fill="#BFE7FF"/><path d="M280 451 H295 M294 440 V462" stroke="#3F7FD0" stroke-width="2"/><path d="M283 444 l5 -2" stroke="#fff" stroke-width="2" opacity=".8"/></g>
  <g class="zv-cr"><rect x="295" y="440" width="15" height="22" fill="#BFE7FF"/><path d="M295 451 H310 M296 440 V462" stroke="#3F7FD0" stroke-width="2"/></g>
  <rect x="270" y="463" width="50" height="5" rx="2" fill="#F2E6CF"/>
  <g class="zv-plate"><ellipse cx="295" cy="462" rx="13" ry="3.4" fill="#fff" stroke="#4F8FE0" stroke-width="1.4"/>
    <path d="M285 461 q4 -8 8 0z M291 460 q4 -9 8 0z M297 461 q4 -8 8 0z" fill="#FFF1D2" stroke="#E2C390" stroke-width=".8"/><circle cx="302" cy="459" r="1.3" fill="#D62839"/><circle cx="288" cy="459" r="1.2" fill="#D62839"/></g>
  <g class="zv-hand"><path d="M309 444 Q304 452 300 456" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M308 448 l-3 4" stroke="#D62839" stroke-width="2"/><circle cx="298" cy="457" r="3.6" fill="#F4C7A1"/></g>
  <path d="M327 474 q-2 -12 2 -24" stroke="#3E8E5A" stroke-width="1.6" fill="none"/><path d="M327 464 q-6 -2 -7 -7 q6 1 7 7z M328 456 q6 -2 7 -7 q-6 1 -7 7z" fill="#3E8E5A"/>
  <g fill="#D62839"><circle cx="329" cy="447" r="2.2"/><circle cx="325" cy="450" r="2"/><circle cx="332" cy="451" r="2"/></g>
  <rect x="336" y="440" width="26" height="54" rx="2" fill="#8A5A3B" stroke="#3F7FD0" stroke-width="2.5"/><path d="M349 442 V492" stroke="#744A30" stroke-width="1.4"/><circle cx="341" cy="468" r="1.8" fill="#FFD23F"/></g>
<g data-tap="hata"><rect x="336" y="304" width="14" height="30" rx="2" fill="#FFFDF6"/><rect x="333" y="300" width="20" height="6" rx="2" fill="#E9E1D2"/>
  <path d="M234 424 Q236 414 246 410 L282 330 Q322 318 362 330 L398 410 Q408 414 410 424 Q322 436 234 424Z" fill="url(#${u}t)"/>
  <path d="M252 418 L286 336 M274 424 L298 330 M298 428 L310 326 M322 430 L322 322 M346 428 L334 326 M370 424 L348 330 M392 418 L358 336" stroke="#C4923F" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  <path d="M284 330 Q322 318 360 330" stroke="#B9863A" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M236 423 Q322 435 408 423" stroke="#B9863A" stroke-width="3" fill="none" opacity=".6"/></g>
<g class="zv-smokes">${[0, 1, 2].map((i) => `<circle class="zv-puff amb" cx="343" cy="292" r="${5 + i}" fill="#fff" opacity="0" style="animation-delay:${-i * 1.5}s"/>`).join('')}
  ${[0, 1, 2].map((i) => `<circle class="zv-big" cx="343" cy="290" r="${8 + i * 2}" fill="#fff" opacity="0" style="animation-delay:${i * 0.3}s"/>`).join('')}</g></g>
<g transform="translate(360 -86) scale(-1 1)"><rect x="31" y="384" width="6" height="26" fill="#8A5A3B"/><ellipse cx="34" cy="386" rx="21" ry="5" fill="none" stroke="#6B4628" stroke-width="2.5"/><path d="M14 386 H54 M24 382 L44 390 M24 390 L44 382" stroke="#6B4628" stroke-width="1.5"/>
  <g data-tap="stork"><rect x="-14" y="280" width="86" height="112" fill="transparent"/>
  <g class="zv-chicks"><circle cx="24" cy="368" r="4" fill="#F4F4F4"/><path d="M27 366 l5 -1 -4 3z" fill="#333"/><circle cx="25" cy="366.5" r=".9" fill="#222"/>
    <circle cx="14" cy="369" r="3.5" fill="#ECECEC"/><path d="M17 367.5 l4 -1 -3 3z" fill="#333"/><circle cx="15" cy="368" r=".8" fill="#222"/></g>
  <ellipse cx="34" cy="376" rx="23" ry="7" fill="#8B6239"/>
  <path d="M13 374 L55 378 M15 379 L51 370 M19 370 L55 381 M12 377 q22 7 46 0" stroke="#6B4628" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g class="zv-bird"><g class="zv-stand">
    <path d="M33 352 L32 372" stroke="#E5533D" stroke-width="2.6" stroke-linecap="round"/><path class="zv-leg2" d="M41 352 L42 372" stroke="#E5533D" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M20 340 L9 347 L22 347Z" fill="#fff"/>
    <path d="M18 340 Q24 328 40 328 Q54 330 52 342 Q48 354 34 354 Q20 352 18 340Z" fill="#fff"/>
    <path d="M15 341 Q20 353 36 354 Q28 346 31 336 Q22 334 15 341Z" fill="#2B2A30"/><path d="M28 335 Q38 332 47 337" stroke="#E4E4EA" stroke-width="2" fill="none"/>
    <g class="zv-shead amb"><path d="M46 334 Q51 322 50 312" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="51" cy="310" r="6" fill="#fff"/>
      <path d="M55 306.5 L75 311.5 L55 310.5Z" fill="#E5533D"/><path class="zv-jaw" d="M55 310.5 L73 313 L55 312.5Z" fill="#C93A27"/><circle cx="52.5" cy="308.5" r="1.4" fill="#222"/></g></g>
    <g class="zv-flyer" transform="translate(36 338)">${FLYER}</g></g></g></g>
<g transform="translate(400 0) scale(-1 1)"><g data-tap="sweepWell"><rect x="298" y="330" width="102" height="178" fill="transparent"/>
  <ellipse cx="342" cy="504" rx="46" ry="6" fill="#000" opacity=".12"/>
  <path d="M384 502 V372" stroke="#8A5A3B" stroke-width="8" stroke-linecap="round"/><path d="M381 374 l-5 -12 M387 374 l5 -12" stroke="#8A5A3B" stroke-width="4" stroke-linecap="round"/>
  <g class="zv-pole"><path d="M314 339 L406 382" stroke="#9A6B45" stroke-width="5" stroke-linecap="round"/><rect x="390" y="370" width="16" height="13" rx="3" fill="#8F8A94" transform="rotate(25 398 376)"/></g>
  <ellipse cx="338" cy="452" rx="34" ry="6" fill="#3B2A22"/>
  <g class="zv-rope"><path d="M316 340 V426" stroke="#7A5A3A" stroke-width="1.6"/>
    <g class="zv-pail"><path d="M307 427 q9 -10 18 0" stroke="#666" stroke-width="1.4" fill="none"/><path d="M305 427 h22 l-2 18 h-18z" fill="#A8743F"/><path d="M305 432 h22 M306 440 h20" stroke="#7E5230" stroke-width="1.6"/></g></g>
  ${[0, 1, 2, 3].map((i) => `<rect x="300" y="${452 + i * 12}" width="76" height="12" rx="6" fill="${i % 2 ? '#B07A45' : '#9C6838'}"/><circle cx="302" cy="${458 + i * 12}" r="5.5" fill="#D2A272"/><circle cx="302" cy="${458 + i * 12}" r="2.2" fill="#A97A4A"/><circle cx="374" cy="${458 + i * 12}" r="5.5" fill="#D2A272"/>`).join('')}
  <path d="M310 455 h30 M330 467 h34 M312 479 h24 M340 491 h26" stroke="#7E5230" stroke-width="1.4" opacity=".5"/></g></g>
<path d="M0 566 Q200 540 400 566 V700 H0Z" fill="#95D271"/>
<g stroke="#8A5A3B" stroke-width="5" stroke-linecap="round">${[4, 32, 60, 88, 116, 144, 172].map((x) => `<path d="M${x} 550 V610"/>`).join('')}</g>
${[0, 1, 2, 3].map((i) => `<path d="M-6 ${562 + i * 12} q14 ${i % 2 ? 5 : -5} 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" stroke="${i % 2 ? '#A06D42' : '#B7834F'}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
<path d="M-4 556 Q90 552 186 556" stroke="#8A5A3B" stroke-width="5" fill="none" stroke-linecap="round"/>
<g transform="translate(88 539)"><path d="M-6 -20 h12 q7 6 6 15 q-2 6 -6 8 v4 h3 v4 h-18 v-4 h3 v-4 q-4 -2 -6 -8 q-1 -9 6 -15z" fill="#C8693F"/><path d="M-9 -12 q9 4 18 0" stroke="#E5895C" stroke-width="2" fill="none"/><ellipse cx="-4" cy="-13" rx="2" ry="4" fill="#fff" opacity=".35"/></g>
<g transform="translate(116 541)"><path d="M-5 -16 h10 q6 5 5 12 q-2 5 -5 7 v3 h2 v3 h-14 v-3 h2 v-3 q-3 -2 -5 -7 q-1 -7 5 -12z" fill="#F3E3C3"/><path d="M-7 -8 q7 3 14 0" stroke="#4F8FE0" stroke-width="2.4" fill="none"/></g>
<g transform="translate(4 52)"><g data-tap="rooster"><rect x="0" y="426" width="68" height="80" fill="transparent"/><g class="zv-roo">
  <path d="M22 478 Q4 462 8 440 Q14 458 28 466Z" fill="#2F5E8C"/><path d="M24 482 Q2 476 0 454 Q10 470 28 474Z" fill="#3E8E5A"/><path d="M26 484 Q12 486 4 474 Q16 480 30 478Z" fill="#2B2A30"/>
  <path d="M28 494 L26 504 M36 494 L38 504" stroke="#F2A93B" stroke-width="2.6" stroke-linecap="round"/>
  <ellipse cx="32" cy="482" rx="16" ry="12.5" fill="#D9542C"/><path d="M20 480 Q30 472 42 480 Q36 492 22 488Z" fill="#A8401F"/>
  <path d="M38 476 Q40 460 48 456 Q54 460 52 470 Q48 480 40 484Z" fill="#F2A93B"/>
  <g class="zv-rhead"><circle cx="50" cy="456" r="7.5" fill="#E8692F"/><path d="M44 450 q0 -6 4 -5 q1 -6 5 -3 q3 -5 6 0 q2 3 -2 6z" fill="#E8312F"/>
    <path d="M57 455 l7 2 -7 3z" fill="#FFB52E"/><path d="M54 461 q2 7 -2 8 q-3 -3 -1 -8z" fill="#E8312F"/><circle cx="52" cy="454" r="1.6" fill="#222"/><circle cx="52.5" cy="453.5" r=".5" fill="#fff"/></g></g></g></g>
<g transform="translate(0 30)"><g data-tap="cherryTree"><rect x="300" y="476" width="100" height="196" fill="transparent"/>
  <ellipse cx="356" cy="668" rx="42" ry="6" fill="#000" opacity=".12"/>
  <path d="M346 670 Q350 630 348 592 Q342 568 328 554 L334 549 Q348 562 353 580 Q360 562 374 552 L379 558 Q363 572 359 596 Q357 634 364 670Z" fill="#8A5A3B"/>
  <g class="zv-crown"><circle cx="328" cy="530" r="30" fill="#3E9B4B"/><circle cx="366" cy="512" r="34" fill="#46A852"/><circle cx="392" cy="542" r="24" fill="#3E9B4B"/>
    <circle cx="352" cy="552" r="28" fill="#3A9447"/><circle cx="318" cy="560" r="18" fill="#3A9447"/>
    <circle cx="356" cy="498" r="14" fill="#62C267" opacity=".7"/><circle cx="322" cy="518" r="10" fill="#62C267" opacity=".6"/><circle cx="388" cy="530" r="8" fill="#62C267" opacity=".5"/>
    ${[[322, 530], [346, 516], [374, 532], [392, 554], [334, 558], [362, 562], [384, 512], [312, 554], [354, 540]].map(([x, y]) => cherries(x, y)).join('')}
    <g class="zv-top">${cherries(368, 488, 1.3)}</g></g></g></g>
<g data-tap="sunflowers"><rect x="0" y="604" width="100" height="96" fill="transparent"/>${sunflower(26, 630, 19, 0)}${sunflower(10, 674, 12, -2.6)}${sunflower(72, 654, 15, -1.3)}</g>
${h.flower(160, 686, '#FF7AB8', 0.8)}${h.flower(212, 694, '#fff', 0.7)}${h.flower(252, 686, '#FFD23F', 0.8)}
</svg>`,

  css: `
[data-tap="hata"].tapped, [data-tap="sweepWell"].tapped, [data-tap="cherryTree"].tapped, [data-tap="sunflowers"].tapped { animation: zvTap .5s cubic-bezier(.3, 1.6, .5, 1); }
[data-tap="sunflowers"] { transform-origin: 50% 100%; }
@keyframes zvTap { 40% { transform: scale(1.05); } }
.zv-puff.amb { transform-box: fill-box; transform-origin: center; animation: zvSmoke 4.5s linear infinite; }
@keyframes zvSmoke { 0% { opacity: 0; transform: translate(0, 0) scale(.5); } 15% { opacity: .75; } 100% { opacity: 0; transform: translate(-14px, -50px) scale(1.9); } }
.zv-smokes.zvpuff .zv-big { transform-box: fill-box; transform-origin: center; animation: zvSmoke 1.8s ease-out backwards; }
[data-tap="hata"].zvwindow .zv-cl, [data-tap="hata"].zvpeek .zv-cl { transform-box: fill-box; transform-origin: 0 50%; animation: zvOpen 6s ease-in-out; }
[data-tap="hata"].zvwindow .zv-cr, [data-tap="hata"].zvpeek .zv-cr { transform-box: fill-box; transform-origin: 100% 50%; animation: zvOpen 6s ease-in-out; }
[data-tap="hata"].zvpeek .zv-cl, [data-tap="hata"].zvpeek .zv-cr { animation-duration: 2.8s; }
@keyframes zvOpen { 8%, 88% { transform: scaleX(.12); } }
.zv-plate, .zv-hand { opacity: 0; }
[data-tap="hata"].zvwindow .zv-plate { animation: zvPlate 6s ease-in-out; }
@keyframes zvPlate { 0%, 16% { opacity: 0; transform: translateY(-5px); } 30%, 90% { opacity: 1; transform: none; } }
[data-tap="hata"].zvwindow .zv-hand { animation: zvHand 6s ease-in-out; }
@keyframes zvHand { 0%, 8% { opacity: 0; transform: translate(6px, -8px); } 16%, 28% { opacity: 1; transform: none; } 38%, 100% { opacity: 0; transform: translate(6px, -8px); } }
[data-tap="hata"].zv-taken .zv-plate { visibility: hidden; }
[data-tap="hata"].zvfresh .zv-fresh { animation: zvFresh 1.6s ease-in-out; }
@keyframes zvFresh { 50% { opacity: .95; } }
.zv-flyer { display: none; }
[data-tap="stork"].zvfly .zv-stand { display: none; }
[data-tap="stork"].zvfly .zv-flyer { display: inline; }
[data-tap="stork"].zvfly .zv-bird { transform-box: fill-box; transform-origin: 50% 50%; animation: zvLoop 3.6s ease-in-out; }
@keyframes zvLoop { 0% { transform: translate(0, -6px); } 18% { transform: translate(60px, -34px); } 38% { transform: translate(120px, -16px); }
  44% { transform: translate(124px, 0) scaleX(-1); } 62% { transform: translate(80px, 66px) scaleX(-1); } 80% { transform: translate(-30px, 30px) scaleX(-1); }
  88% { transform: translate(-12px, 6px); } 100% { transform: translate(0, -6px); } }
.zv-wing { transform-box: fill-box; transform-origin: 50% 100%; animation: zvWing .38s ease-in-out infinite alternate; }
@keyframes zvWing { to { transform: scaleY(-.5); } }
.zv-shead.amb { transform-box: view-box; transform-origin: 46px 336px; animation: zvNod 7s ease-in-out infinite; }
@keyframes zvNod { 0%, 78%, 100% { transform: none; } 84% { transform: rotate(16deg); } 90% { transform: rotate(-4deg); } }
[data-tap="stork"].zvclack .zv-shead { animation: zvClack 1.5s ease-in-out; }
@keyframes zvClack { 20%, 75% { transform: rotate(-72deg); } }
[data-tap="stork"].zvclack .zv-jaw { transform-box: fill-box; transform-origin: 0 50%; animation: zvJaw .1s linear .3s 10 alternate; }
@keyframes zvJaw { to { transform: rotate(16deg); } }
[data-tap="stork"].zvoneleg .zv-leg2 { transform-box: fill-box; transform-origin: 50% 0; animation: zvLeg 2.8s ease-in-out; }
@keyframes zvLeg { 12%, 86% { transform: rotate(-70deg) scaleY(.55); } }
.zv-chicks { opacity: 0; }
[data-tap="stork"].zvchicks .zv-chicks { animation: zvChicks 3.8s ease-in-out; }
@keyframes zvChicks { 0%, 100% { opacity: 0; transform: translateY(6px); } 14%, 86% { opacity: 1; transform: none; } 30%, 60% { transform: translateY(-2px); } }
[data-tap="sweepWell"].zvdip .zv-pole { transform-box: view-box; transform-origin: 384px 372px; animation: zvDip 1.8s ease-in-out; }
@keyframes zvDip { 35%, 58% { transform: rotate(-16deg); } }
[data-tap="sweepWell"].zvdip .zv-rope { animation: zvRope 1.8s ease-in-out; }
@keyframes zvRope { 35%, 58% { transform: translate(-6px, 21px); } }
[data-tap="sweepWell"].zv-nopail .zv-pail { visibility: hidden; }
[data-tap="cherryTree"].zvshake .zv-crown { transform-box: fill-box; transform-origin: 50% 100%; animation: zvShake .9s ease-in-out; }
@keyframes zvShake { 20% { transform: rotate(-3deg); } 45% { transform: rotate(3deg); } 70% { transform: rotate(-1.5deg); } }
[data-tap="cherryTree"].zvpick .zv-top { visibility: hidden; }
[data-tap="rooster"].zvcrow .zv-rhead { transform-box: view-box; transform-origin: 44px 468px; animation: zvCrowHead 1.4s ease-in-out; }
@keyframes zvCrowHead { 20%, 70% { transform: rotate(-24deg) translateY(-3px); } }
[data-tap="rooster"].zvcrow .zv-roo { transform-box: fill-box; transform-origin: 50% 100%; animation: zvPuffUp 1.4s ease-in-out; }
@keyframes zvPuffUp { 20%, 70% { transform: scale(1.08); } }
[data-tap="rooster"].zvflap .zv-roo { transform-box: fill-box; transform-origin: 50% 100%; animation: zvFlap 1.2s ease-in-out; }
@keyframes zvFlap { 10%, 50% { transform: translateY(-10px) rotate(-6deg); } 30%, 70% { transform: translateY(0) rotate(6deg); } }
[data-tap="rooster"].zvhuff .zv-rhead { transform-box: view-box; transform-origin: 44px 468px; animation: zvHuff 1.2s ease-in-out; }
@keyframes zvHuff { 15%, 45%, 75% { transform: rotate(-10deg); } 30%, 60%, 90% { transform: rotate(8deg); } }
.zv-sf.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: zvSway 4.2s ease-in-out infinite alternate; }
@keyframes zvSway { from { transform: rotate(-1.6deg); } to { transform: rotate(1.6deg); } }
[data-tap="sunflowers"].zvturn .zv-sfh { transform-box: fill-box; transform-origin: center; animation: zvTurn 3s ease-in-out; }
@keyframes zvTurn { 30%, 75% { transform: rotate(20deg) scaleX(.8); } }
`,

  props: () => {
    const pair = (x, y) => `<path d="M${x} ${y} q-2 9 -6 15 M${x} ${y} q3 9 6 16" stroke="#3B6E2A" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M${x} ${y} q6 -6 12 -2 q-6 5 -12 2z" fill="#4CAF50"/>
      <circle cx="${x - 6}" cy="${y + 19}" r="6.5" fill="#D62839"/><circle cx="${x + 6}" cy="${y + 20}" r="6.5" fill="#C21F31"/><circle cx="${x - 8}" cy="${y + 17}" r="1.8" fill="#fff" opacity=".85"/><circle cx="${x + 4}" cy="${y + 18}" r="1.8" fill="#fff" opacity=".85"/>`;
    return {
      villageCherryEars: { slot: 'earrings', art: () => pair(38, 146) + pair(162, 146) },
      villagePlate: { slot: 'hand', art: () => `<g transform="translate(154 166)"><ellipse rx="26" ry="8" fill="#fff" stroke="#4F8FE0" stroke-width="2.4"/><ellipse rx="18" ry="4.6" fill="none" stroke="#9CC3F0" stroke-width="1.2"/>
        <path d="M-17 0 q7 -14 14 0z M-7 -2 q7 -15 14 0z M3 0 q7 -14 14 0z" fill="#FFF1D2" stroke="#E2C390" stroke-width="1.2"/><circle cx="9" cy="-4" r="2.4" fill="#D62839"/><circle cx="-11" cy="-3" r="2" fill="#D62839"/><ellipse cy="-12" rx="5" ry="3" fill="#fff"/></g>` },
      villageBucket: { slot: 'hand', art: () => `<g transform="translate(156 160)"><path d="M-14 -12 q14 -18 28 0" stroke="#666" stroke-width="2" fill="none"/><path d="M-15 -12 h30 l-3 26 h-24z" fill="#A8743F"/>
        <path d="M-15 -4 h30 M-14 6 h28" stroke="#7E5230" stroke-width="2.4"/><ellipse cy="-12" rx="15" ry="4" fill="#6FC6FF"/><ellipse cx="-4" cy="-13" rx="5" ry="1.4" fill="#fff" opacity=".7"/></g>` },
      villageSunflower: { slot: 'hand', art: () => `<path d="M160 196 Q158 170 146 150" stroke="#4E9A3E" stroke-width="5" fill="none" stroke-linecap="round"/>${sfHead(142, 140, 20)}` },
      villageSunFace: { slot: 'eyes', art: () => `<path d="M112 150 Q132 162 152 168" stroke="#4E9A3E" stroke-width="7" fill="none" stroke-linecap="round"/>${sfHead(100, 100, 38)}` },
      villageComb: { slot: 'head', art: () => `<path d="M80 52 q-3 -14 8 -15 q0 -13 12 -11 q5 -12 15 -4 q11 -3 10 9 q8 3 3 21z" fill="#E8312F"/><path d="M89 44 q4 -6 10 -4" stroke="#fff" stroke-width="2" opacity=".5" fill="none" stroke-linecap="round"/>` },
      villageBrush: { slot: 'hand', art: () => `<g transform="rotate(-24 156 168)"><rect x="152" y="98" width="7" height="76" rx="3" fill="#B07A45"/><path d="M144 104 q11 -34 23 0 q-2 6 -11 6 q-10 0 -12 -6z" fill="#F4EBDD"/>
        <path d="M150 100 q5 -20 12 0" stroke="#fff" stroke-width="2" fill="none"/><circle cx="148" cy="112" r="2.4" fill="#fff"/><circle cx="160" cy="116" r="1.8" fill="#fff"/></g>` },
      villageWhite: { slot: 'body', art: () => `<g fill="#fff" stroke="#E6E0D6" stroke-width="1.2">${[[66, 60, 9], [132, 56, 8], [46, 120, 10], [156, 128, 9], [90, 160, 11], [126, 176, 9], [102, 44, 7], [70, 180, 8], [114, 112, 5]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${x + r}" cy="${y - r * 0.7}" r="${(r * 0.35).toFixed(1)}"/>`).join('')}</g>` },
    };
  },

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, nose, mouth, feet, paw, sceneRect, getWet, spray, hideGame } = k;
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    // a class on the thing for the length of a scene, gone however the scene ends
    const mark = (a, c, cls) => { c.el.classList.add(cls); onEnd(a, () => c.el.classList.remove(cls)); };
    const ears = () => L.querySelectorAll('.ear').forEach((x) => api.hop(x, 'wiggle'));
    // a class on a thing for a while (not api.hop: the end of its own press bounce would take the class off at once)
    const play = (el, cls, ms) => {
      el.classList.remove(cls);
      void el.getBoundingClientRect();
      el.classList.add(cls);
      clearTimeout(el['zv' + cls]);
      el['zv' + cls] = setTimeout(() => el.classList.remove(cls), ms);
    };

    // ----- the hut: smoke from the chimney, varenyky on the windowsill, the cat, whitewash -----
    // (the hut is two tap groups, walls and roof: its moving parts are in the walls)
    const hut = (c) => c.el.ownerSVGElement?.querySelector('.zv-hut') || c.el;
    const smoke = (c) => {
      const sm = c.el.ownerSVGElement?.querySelector('.zv-smokes');
      if (sm) play(sm, 'zvpuff', 2600);
      sfx.puff();
      setTimeout(() => sfx.puff(), 400);
      pose('happy', 1800, 'sniff', 1500);
      sfx.sniff();
      setTimeout(() => { if (api.free()) line('villageSmoke', 1); }, 500);
    };
    // the window opens, Grandma's hand puts a plate of cherry varenyky on the sill; Lucky sniffs, and it's his
    const varenyky = (c) => {
      const a = begin('villageVarenyky'), h = hut(c);
      play(h, 'zvwindow', 6200);
      sfx.sparkle();
      at(a, 1300, () => { pose('surprised', 900, 'sniff', 1500); sfx.sniff(); });
      at(a, 2600, () => { mark(a, { el: h }, 'zv-taken'); sfx.pop(); fly('🥟', part({ el: h }, '.zv-plate'), paw(), 600, { arc: 50, size: 24 }); });
      at(a, 3200, () => { prop('villagePlate', 2800); api.setTemp('eat', 2400); sfx.yum(); line('villageVarenyky', 1, 0); api.boost('hunger', 2); api.reward(); });
      at(a, 5600, end);
    };
    R.hata = {
      press: () => sfx.knock(),
      tap: who(oneOf('villageHut', smoke, varenyky)),
      // the cat looks out of the window
      double: (c) => {
        const h = hut(c);
        play(h, 'zvpeek', 2800);
        const [x, y] = part({ el: h }, '.zv-cr');
        setTimeout(() => { popUp('🐱', x - 6, y + 4, 2000, 26, 'pop-rise'); sfx.squeak(); setTimeout(() => sfx.purr(), 400); }, 250);
        setTimeout(() => { if (!api.free()) return; pose('happy', 1500, 'wave', 1200); line('villageCat', 1); }, 600);
      },
      // he whitewashes the hut… and himself
      long: who((c) => {
        const a = begin('villageWhitewash'), h = hut(c), wall = () => part({ el: h }, '.zv-fresh');
        go(nextTo(h, 24), 800);
        at(a, 850, () => { prop('villageBrush', 2200); pose('happy', 2000, 'wave', 2000); });
        [1000, 1450, 1900].forEach((d) => at(a, d, () => { sfx.puff(); api.fxAt(...wall(), ['🤍', '✨'], 2, 'spark'); }));
        at(a, 1400, () => play(h, 'zvfresh', 1600));
        at(a, 2600, () => { prop('villageWhite', 2400); api.fxAt(...head(), ['🤍'], 5, 'drop'); pose('surprised', 1200, 'startle', 1100); line('villageWhitewash', 1, 0); });
        at(a, 4100, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('body'); api.fxAt(...head(), ['🤍', '✨'], 6, 'spark'); api.setTemp('laugh', 1500); api.reward(); });
        at(a, 5400, end);
      }),
    };

    // ----- the stork on the roof -----
    const clack = (c) => {
      play(c.el, 'zvclack', 1500);
      setTimeout(() => clatter(sfx, 10), 300);
      setTimeout(() => { if (!api.free()) return; pose('laugh', 1800, 'clap', 1500); line('villageStorkClack', 1); }, 700);
    };
    // it flies a circle over the village and drops him a cherry on the way back
    const circle = (c) => {
      const a = begin('villageStorkFly');
      mark(a, c, 'zvfly');
      sfx.whoosh();
      pose('happy', 2000, 'look', 1500);
      at(a, 2250, () => {
        const b = c.el.querySelector('.zv-bird'), from = b ? centerOf(b) : [c.x, c.y];
        fly('🍒', from, paw(), 650, { arc: -10, spin: 200, size: 26 });
      });
      at(a, 2900, () => { prop('cherry', 2200); api.setTemp('eat', 1800); sfx.crunch(); line('villageStorkGift', 1, 0); api.reward(); });
      at(a, 3700, () => { c.el.classList.remove('zvfly'); sfx.whoosh(); });
      at(a, 4800, end);
    };
    R.stork = {
      press: (c) => { clatter(sfx, 3); api.fxAt(c.x, c.y, ['🪶'], 1, 'drop'); },
      tap: who(oneOf('villageStork', clack, circle)),
      // the stork stands on one leg… and so does Lucky, nearly
      double: who((c) => {
        const a = begin('villageOneLeg');
        play(c.el, 'zvoneleg', 2800);
        at(a, 400, () => { hold(a, 'balance', 1900); api.setTemp('ok', 1900); line('villageOneLeg', 1, 0); });
        at(a, 2400, () => { pose('laugh', 1500, 'slip', 1400); sfx.boing(); });
        at(a, 3900, end);
      }),
      // stork chicks look out of the nest: a stork on the roof brings happiness to the home
      long: who((c) => {
        const a = begin('villageNest');
        play(c.el, 'zvchicks', 3800);
        [300, 520, 900, 1120].forEach((d) => setTimeout(() => sfx.squeak(), d));
        at(a, 500, () => { pose('happy', 3000, 'clap', 1500); api.hearts(...part(c, '.zv-chicks'), 4); line('villageStorkNest', 1, 0); api.reward(); });
        at(a, 3900, end);
      }),
    };

    // ----- the sweep well: a bucket of cold water (and sometimes a frog in it) -----
    const pull = (a, c) => {
      go(nextTo(c.el, 22), 800);
      at(a, 850, () => { play(c.el, 'zvdip', 1800); hold(a, 'strain', 1500); api.setTemp('ok', 1500); });
      at(a, 1500, () => { sfx.splash(); api.fxAt(...part(c, '.zv-pail'), ['💧'], 3, 'spark'); });
      at(a, 2500, () => { mark(a, c, 'zv-nopail'); prop('villageBucket', 2600); sfx.splash(); api.fxAt(...paw(), ['💧', '💦'], 3, 'spark'); });
    };
    const drink = (c) => {
      const a = begin('villageWell');
      pull(a, c);
      at(a, 3000, () => { api.setTemp('eat', 1600); sfx.slurp(); line('villageBucket', 1, 0); api.boost('energy', 1); api.reward(); });
      at(a, 4700, end);
    };
    const frog = (c) => {
      const a = begin('villageFrog');
      pull(a, c);
      at(a, 2900, () => { sfx.croak(); fly('🐸', paw(), head(), 500, { arc: 60, size: 30, stay: 1100 }); });
      at(a, 3400, () => { pose('surprised', 1600, 'startle', 1100); ears(); line('villageFrog', 1, 0); });
      at(a, 4500, () => { sfx.croak(); unprop('hand'); fly('🐸', head(), [sceneRect().width + 40, feet()[1]], 900, { arc: 80, size: 30 }); api.setTemp('laugh', 1500); });
      at(a, 5400, end);
    };
    R.sweepWell = {
      press: (c) => { sfx.bubble(); api.fxAt(...part(c, '.zv-pail'), ['💧'], 2, 'drop'); },
      tap: who(oneOf('villageWell', drink, frog)),
      // a whole bucket over his head on a hot day
      double: who((c) => {
        const a = begin('villageSplash');
        go(nextTo(c.el, 22), 800);
        at(a, 850, () => { mark(a, c, 'zv-nopail'); prop('villageBucket', 700); pose('happy', 700, 'hop'); });
        at(a, 1500, () => { unprop('hand', true); fly('🪣', paw(), head(), 300, { spin: 160, size: 30, stay: 300 }); });
        at(a, 1800, () => { sfx.splash(); spray(...head()); line('villageSplash', 1, 0); getWet(a, 1800); api.boost('clean', 2); });
        at(a, 4500, end);
      }),
      // "Hello-o!" down the well, and the echo answers
      long: who((c) => {
        const a = begin('villageEcho');
        go(nextTo(c.el, 18), 800);
        at(a, 850, () => { pose('happy', 1200, 'stretchUp', 1200); line('villageEcho', 1, 0); });
        const [x, y] = part(c, '.zv-pail');
        [1500, 2100, 2700].forEach((d, i) => at(a, d, () => { sfx.note(523 - i * 30); popUp('〰️', x + 10, y - 10 - i * 24, 1000, 40 - i * 8, 'pop-rise'); }));
        at(a, 1700, () => pose('happy', 2000, 'listen', 2000));
        at(a, 3900, () => { pose('laugh', 1400, 'hop'); api.reward(); });
        at(a, 4900, end);
      }),
    };

    // ----- the cherry tree: a cherry to eat, cherry earrings, a cherry shower, the top one -----
    const eat = (c) => {
      const a = begin('villageCherry');
      go(nextTo(c.el, 20), 700);
      at(a, 750, () => { play(c.el, 'zvshake', 900); sfx.pop(); fly('🍒', [c.x, c.y - 30], mouth(), 600, { arc: 40, spin: 200, size: 24 }); });
      at(a, 1350, () => { api.setTemp('eat', 1800); sfx.crunch(); line('villageCherryEat', 1, 0); api.boost('hunger', 1); api.reward(); });
      at(a, 2900, end);
    };
    // two pairs of cherries hung on the tips of his ears, like earrings
    const earrings = (c) => {
      const a = begin('villageEarrings');
      const [lx, ly] = api.luckyPoint(0.19, 0.76), [rx] = api.luckyPoint(0.81, 0.76);
      play(c.el, 'zvshake', 900);
      fly('🍒', [c.x, c.y - 20], [lx, ly], 700, { arc: 70, size: 22 });
      fly('🍒', [c.x, c.y - 20], [rx, ly], 600, { arc: 50, size: 22 });
      at(a, 750, () => { prop('villageCherryEars', 15000); sfx.chime(); pose('happy', 1800, 'proud', 1200); ears(); line('villageEarrings', 1, 0); api.reward(); });
      at(a, 2300, end);
    };
    R.cherryTree = {
      press: (c) => { sfx.pop(); api.fxAt(c.x, c.y, ['🍒', '🍃'], 2, 'drop'); },
      tap: who(oneOf('villageCherryTree', eat, earrings)),
      double: (c) => {
        play(c.el, 'zvshake', 900);
        sfx.rain();
        api.fxAt(c.x, c.y - 30, ['🍒', '🍒', '🍃'], 9, 'drop');
        if (api.free()) { prop('cherry', 2600); pose('laugh', 2000, 'bounce', 800); line('villageCherryRain', 1); }
      },
      // up the tree for the ripest one at the very top
      long: who((c) => {
        const a = begin('villageClimb');
        go(nextTo(c.el, 16), 700);
        at(a, 750, () => { pose('happy', 1800, 'climb', 1800); sfx.whoosh(); api.fxAt(c.x, c.y - 40, ['🍃'], 4, 'drop'); });
        at(a, 1900, () => { const [x, y] = part(c, '.zv-top'); mark(a, c, 'zvpick'); sfx.pop(); fly('🍒', [x, y], mouth(), 600, { arc: 30, spin: 180, size: 30 }); });
        at(a, 2500, () => { api.setTemp('eat', 1800); sfx.crunch(); api.fxAt(...head(), ['✨'], 4, 'spark'); line('villageClimb', 1, 0); api.reward(); });
        at(a, 4000, end);
      }),
    };

    // ----- the rooster on the fence -----
    const crow = (c) => {
      play(c.el, 'zvcrow', 1400);
      crowSong(sfx);
      api.fxAt(...part(c, '.zv-rhead'), ['🎵', '🎶'], 4, 'spark');
      pose('surprised', 1000, 'startle', 1100);
      ears();
      setTimeout(() => { if (!api.free()) return; api.setTemp('laugh', 1500); line('villageCrow', 1); }, 800);
    };
    // Lucky crows back, with a comb of his own; the rooster is not amused
    const crowBack = (c) => {
      const a = begin('villageCrowBack');
      prop('villageComb', 4200);
      pose('happy', 1600, 'stretchUp', 1600);
      at(a, 300, () => { crowSong(sfx); api.fxAt(...head(), ['🎵', '🎶'], 4, 'spark'); });
      at(a, 1300, () => { play(c.el, 'zvhuff', 1200); cluck(sfx); });
      at(a, 1500, () => { api.setTemp('laugh', 1800); line('villageCrowBack', 1, 0); });
      at(a, 3700, end);
    };
    R.rooster = {
      press: (c) => { cluck(sfx); api.fxAt(c.x, c.y - 10, ['🪶'], 1, 'drop'); },
      tap: who(oneOf('villageRooster', crow, crowBack)),
      // the rooster flaps, and a feather lands right on his nose
      double: who((c) => {
        const a = begin('villageFeather');
        play(c.el, 'zvflap', 1200);
        cluck(sfx);
        fly('🪶', [c.x, c.y - 10], nose(), 1500, { arc: -20, spin: 90, size: 24 });
        at(a, 1500, () => api.setTemp('sleep', 450));
        at(a, 1950, () => { sfx.sneeze(); pose('laugh', 1300, 'sneeze'); api.fxAt(...nose(), ['💨', '🪶'], 3, 'spark'); line('villageFeather', 1, 0); });
        at(a, 3400, end);
      }),
      // Lucky dozes off in the sun… and the rooster wakes him up
      long: who((c) => {
        const a = begin('villageNap');
        api.setTemp('sleep', 2500);
        hold(a, 'loaf', 2500);
        sfx.yawn();
        at(a, 700, () => { sfx.sleep(); api.fxAt(...head(), ['💤'], 3, 'spark'); });
        at(a, 2300, () => { play(c.el, 'zvcrow', 1400); crowSong(sfx); api.fxAt(...part(c, '.zv-rhead'), ['🎵', '📢'], 4, 'spark'); });
        at(a, 2700, () => { pose('surprised', 1200, 'bigjump', 1100); ears(); });
        at(a, 3700, () => { api.setTemp('laugh', 1800); line('villageWakeUp', 1, 0); api.boost('energy', 1); });
        at(a, 5400, end);
      }),
    };

    // ----- the sunflowers -----
    const turn = (c) => {
      play(c.el, 'zvturn', 3000);
      sfx.chime();
      pose('happy', 2600, 'stretchUp', 1600);
      api.fxAt(...head(), ['☀️', '✨'], 3, 'spark');
      setTimeout(() => { if (api.free()) line('villageSunTurn', 1); }, 300);
    };
    const seeds = (c) => {
      const a = begin('villageSeeds');
      go(nextTo(c.el, 22), 700);
      at(a, 750, () => { prop('villageSunflower', 3000); api.setTemp('eat', 2800); line('villageSeeds', 1, 0); });
      [950, 1350, 1750, 2150].forEach((d) => at(a, d, () => { sfx.crunch(); api.fxAt(...mouth(), ['✨'], 1, 'spark'); }));
      at(a, 2300, () => { api.boost('hunger', 1); api.reward(); });
      at(a, 3600, end);
    };
    R.sunflowers = {
      press: (c) => { sfx.pop(); api.floatFx(c.x, c.y - 10, '🐝', 'fly-up'); },
      tap: who(oneOf('villageSunflowers', turn, seeds)),
      // a sunflower in front of his face: guess who?
      double: who(() => {
        const a = begin('villageSunFace');
        prop('villageSunFace', 2600);
        sfx.pop();
        pose('happy', 2600, 'sway', 1300);
        line('villageSunFace', 1, 0);
        at(a, 2700, () => { sfx.boing(); pose('laugh', 1500, 'hop'); api.fxAt(...head(), ['🌻', '✨'], 4, 'spark'); });
        at(a, 3800, end);
      }),
      // hide and seek among the sunflowers
      long: who((c) => hideGame(begin('hide'), c.el)),
    };
  },

  visitors: [
    { e: '🕊️', w: 2, path: 'glide', end: ['villageStork'], flip: true },
    { e: '🐝', w: 2, path: 'zigzag', end: ['bee'] },
  ],

  endings: (k) => ({
    // the stork brings Lucky a present, wrapped: a carrot!
    villageStork: (a, x, y) => {
      const { api, at, fly, popUp, pose, sfx, line, paw, head, sceneRect } = k;
      const [hx, hy] = head(), top = [hx + 20, Math.max(50, hy - 80)];
      storkFx(k, [x, y], top, 900, 500);
      at(a, 900, () => { sfx.whoosh(); fly('🎁', top, paw(), 600, { spin: 40, size: 28, stay: 300 }); storkFx(k, top, [sceneRect().width + 80, 30], 1300); });
      at(a, 1500, () => { sfx.pop(); popUp('🥕', ...paw(), 1800, 34, 'pop-rise'); pose('surprised', 900, 'startle', 1100); });
      at(a, 2300, () => { pose('laugh', 1800, 'binky'); line('villageStorkVisit', 1, 0); api.reward(); });
    },
  }),
};
