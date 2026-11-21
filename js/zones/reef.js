// Coral reef (level 35): under the sea in a bubble helmet. A glowing jellyfish, corals where a little clownfish
// hides, a giant clam with a pearl, a sea turtle that works as a taxi and a sunken pirate chest.

// seaweed that sways (d: a head start, so the strands don't move in step)
const weed = (x, y, h, c, d = 0, w = 8) => `<g class="zr-weed amb" style="animation-delay:-${d}s"><path d="M${x} ${y} q-11 ${-h / 4} 0 ${-h / 2} q11 ${-h / 4} 0 ${-h / 2}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/></g>`;
// a bubble rising from the bottom to the top
const bub = (x, y, r, d) => `<g class="zr-bub amb" style="animation-delay:-${d}s"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".2" stroke="#fff" stroke-opacity=".85" stroke-width="1.5"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.3}" fill="#fff"/></g>`;
// a small fish of the school far away
const far = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="9" ry="4.5"/><path d="M8 0 l7 -5 v10z"/></g>`;
// the fur standing up after a jellyfish zap: spikes around the head and the body (Lucky's coordinates)
const spikes = (cx, cy, rx, ry, from, to, n, len) => Array.from({ length: n }, (_, i) => {
  const a = ((from + ((to - from) * i) / (n - 1)) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return `M${(cx + rx * c).toFixed(1)} ${(cy + ry * s).toFixed(1)} L${(cx + (rx + len) * c).toFixed(1)} ${(cy + (ry + len) * s).toFixed(1)}`;
}).join(' ');
// the pearls of a necklace along a curve
const pearls = (n) => Array.from({ length: n }, (_, i) => {
  const t = i / (n - 1), x = 64 + 72 * t, y = 140 + 4 * 18 * t * (1 - t);
  return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.2" fill="#FFF7FC" stroke="#E3D2EC" stroke-width="1.2"/><circle cx="${(x - 1.6).toFixed(1)}" cy="${(y - 1.8).toFixed(1)}" r="1.5" fill="#fff"/>`;
}).join('');

export default {
  id: 'reef',
  level: 35,
  name: ['Коралловый риф', 'Coral reef'],
  emoji: ['🐠', '🪸', '🐢', '🫧', '🐙'],
  spots: { L: [20, 600], R: [386, 572], l: [134, 692], r: [268, 694], sky: 300 },
  wear: 'reefHelmet',
  arrive: [
    ['Коралловый риф! Буль-буль… А я дышу в своём пузыре!', 'The coral reef! Blub-blub… and I can breathe in my bubble!'],
    ['Под водой! Смотри, сколько рыбок! Я как настоящий водолаз.', "Under the sea! Look at all the fish! I'm a real diver."],
  ],

  lines: {
    reefGlow: [['Мы светимся! Теперь мне и фонарик не нужен.', "We're glowing! Now I don't even need a torch."], ['Некоторые медузы светятся сами, как ночники.', 'Some jellyfish make their own light, like little night-lights.'], ['Смотри, я тоже свечусь! Я кролик-светлячок.', "Look, I'm glowing too! I'm a firefly bunny."]],
    reefZap: [['Ай! Медуза щиплется! У меня вся шерсть дыбом!', 'Ouch! The jellyfish zapped me! All my fur is standing up!'], ['Бз-з-з! Медуза, ты что, на батарейках?', 'Bzzzt! Jellyfish, do you run on batteries?']],
    reefDisco: [['Медуза-дискотека! Все цвета радуги!', 'A jellyfish disco! Every colour of the rainbow!']],
    reefJellyUp: [['Медуза вместо воздушного шарика! Я всплываю!', "A jellyfish instead of a balloon! I'm floating up!"]],
    reefTaxi: [['Такси! До конца рифа, пожалуйста!', 'Taxi! To the end of the reef, please!'], ['Черепаха-такси! Держусь крепче… Поехали!', 'The turtle taxi! Hold on tight… Off we go!']],
    reefTaxiBye: [['Спасибо за поездку! Сколько с меня? Одна морковка?', 'Thanks for the ride! How much is that? One carrot?'], ['Приехали! Самое уютное такси в океане.', 'Here we are! The comfiest taxi in the ocean.']],
    reefTurtleTry: [['Морские черепахи не прячутся в панцирь. Голова не помещается!', "Sea turtles can't hide in their shells. Their heads don't fit!"], ['Черепаха хотела спрятаться… Не вышло! Морские так не умеют.', "The turtle tried to hide… nope! Sea turtles can't do that."]],
    reefRoll: [['Черепаха кувыркается! И я тоже!', 'The turtle is doing a roll! Me too!']],
    reefTurtleOld: [['Морские черепахи живут больше ста лет. Обнимаю бабулю-черепаху!', 'Sea turtles can live over a hundred years. A hug for Granny Turtle!']],
    reefTreasure: [['Пиратский клад! Монеты, жемчуг… а морковки нет?', 'Pirate treasure! Coins, pearls… and no carrots?'], ['Сокровища! Под водой монетки падают медленно, как снежинки.', 'Treasure! Underwater, coins fall slowly, like snowflakes.']],
    reefNecklace: [['Жемчужное ожерелье! Ну как, я красавчик?', 'A pearl necklace! So, how do I look? Handsome?'], ['Примерю ожерелье. Очень по-королевски!', "I'll try on this necklace. Very royal!"]],
    reefMap: [['Карта сокровищ! Крестик стоит… прямо здесь. Уже нашли!', 'A treasure map! X marks the spot… right here. Found it already!']],
    reefPirate: [['Йо-хо-хо! Капитан Лаки, гроза морей!', 'Yo-ho-ho! Captain Lucky, terror of the seas!']],
    reefPeek: [['Ку-ку! Рыбка прячется в кораллах!', 'Peekaboo! A little fish is hiding in the coral!'], ['Вижу тебя, рыбка! Твой хвостик торчит.', 'I can see you, little fish! Your tail is sticking out.']],
    reefDart: [['Вжух! Какая быстрая рыбка! У меня голова кругом.', 'Whoosh! What a speedy fish! My head is spinning.'], ['Рыбка кружит вокруг меня! Ты быстрее черепахи-такси!', "The fish is zooming round me! You're faster than the turtle taxi!"]],
    reefCoral: [['Сколько рыбок! Коралл — это их дом.', 'So many fish! The coral is their home.'], ['Кораллы — не камни, а крошечные живые животные!', "Coral isn't rock, it's made of tiny living animals!"]],
    reefKiss: [['Чмок! Рыбка поцеловала мой шлем!', 'Mwah! A fish kissed my helmet!']],
    reefClamSnap: [['Ой! Ракушка захлопнулась! Чуть лапу не прищемила.', 'Whoa! The clam snapped shut! It nearly caught my paw.'], ['Эй, ракушка! Я только посмотреть хотел!', 'Hey, clam! I only wanted to look!']],
    reefBubbles: [['Пузыри! Ловлю и лопаю: чпок, чпок!', "Bubbles! I'll catch them and pop them: pop, pop!"], ['Ракушка пускает пузыри. Она что, смеётся?', 'The clam is blowing bubbles. Is she laughing?']],
    reefCastanets: [['Ракушка-кастаньеты! Оле!', 'Clam castanets! Olé!']],
    reefPearl: [['Жемчужина! Ракушка растила её слой за слоем много лет.', 'A pearl! The clam made it layer by layer, over many years.']],
    reefSchool: [['Целая стая рыбок! Они водят хоровод вокруг меня!', "A whole school of fish! They're swimming circles round me!"]],
    reefInk: [['Пф-ф! Осьминог брызнул чернилами и удрал. Хитрец!', 'Pfft! The octopus squirted ink and swam off. Sneaky!'], ['Хорошо, что я в шлеме! Осьминоги прячутся в облаке чернил.', "Good thing I've got a helmet! Octopuses hide in a cloud of ink."]],
    reefHug: [['Осьминог меня обнимает! Восемь лап — восемь обнимашек!', 'The octopus is hugging me! Eight arms, eight hugs!']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8F2E6"/><stop offset=".34" stop-color="#55CFDB"/><stop offset=".66" stop-color="#2A9FCB"/><stop offset="1" stop-color="#1D7DB6"/></linearGradient>
<linearGradient id="${u}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${u}d" gradientUnits="userSpaceOnUse" x1="0" y1="556" x2="0" y2="700"><stop offset="0" stop-color="#FCE9BA"/><stop offset="1" stop-color="#EFCA88"/></linearGradient>
<radialGradient id="${u}j" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#FFE6FB"/><stop offset=".6" stop-color="#F7A6EE"/><stop offset="1" stop-color="#D987F0"/></radialGradient>
<radialGradient id="${u}h"><stop offset="0" stop-color="#FFD2F7" stop-opacity=".85"/><stop offset="1" stop-color="#FFD2F7" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}w)"/>
<path d="M0 40 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>
<g class="zr-rays amb" pointer-events="none"><path d="M54 40 L92 40 L176 640 L104 640Z" fill="url(#${u}r)"/><path d="M160 40 L186 40 L246 600 L196 600Z" fill="url(#${u}r)"/>
  <path d="M246 40 L296 40 L330 660 L262 660Z" fill="url(#${u}r)"/><path d="M336 40 L356 40 L400 560 L374 560Z" fill="url(#${u}r)"/><path d="M4 40 L22 40 L52 560 L18 560Z" fill="url(#${u}r)"/></g>
<g class="zr-school amb" pointer-events="none" fill="#1E6F9F" opacity=".3">${far(430, 352)}${far(452, 342, 0.8)}${far(458, 364, 0.9)}${far(476, 352, 0.7)}${far(482, 372, 0.8)}${far(500, 346, 0.6)}</g>
<path d="M0 534 Q22 496 48 510 Q64 468 96 484 Q120 456 148 486 Q172 470 194 492 Q228 462 260 488 Q292 468 314 490 Q346 456 372 482 Q390 474 400 486 V600 H0Z" fill="#2A8FBE" opacity=".45"/>
<g fill="#2C88B6" opacity=".4"><path d="M168 500 q-6 -26 4 -44 m0 0 q-14 -4 -16 -18 m16 18 q10 -8 8 -22" stroke="#2C88B6" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M246 492 q-20 -40 0 -56 q20 16 0 56z"/></g>
<g pointer-events="none">${weed(132, 576, 96, '#2FAE7A', 0.6)}${weed(146, 578, 70, '#4CC98A', 2.1, 7)}${weed(262, 574, 104, '#2FAE7A', 1.4)}${weed(276, 578, 66, '#4CC98A', 3.2, 7)}${weed(210, 566, 48, '#3DBA80', 2.6, 6)}</g>
<path d="M0 574 Q90 548 200 562 T400 556 V700 H0Z" fill="url(#${u}d)"/>
<path d="M0 574 Q90 548 200 562 T400 556" stroke="#FFF6DC" stroke-width="4" fill="none" opacity=".75"/>
<g class="zr-caus amb" pointer-events="none" fill="#fff" opacity=".22"><ellipse cx="150" cy="606" rx="22" ry="5"/><ellipse cx="236" cy="620" rx="28" ry="5"/><ellipse cx="190" cy="660" rx="18" ry="4"/><ellipse cx="290" cy="676" rx="20" ry="4"/><ellipse cx="120" cy="650" rx="14" ry="3.5"/></g>
<path d="M118 630 q18 -6 36 0 t36 0 M226 646 q16 -5 32 0 t32 0 M150 684 q14 -4 28 0 t28 0" stroke="#E3BB78" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
<g pointer-events="none"><path d="M122 690 l3.5 -8 3.5 8 -8 -5 h9z" fill="#FF8A65" transform="rotate(-10 126 686)"/><path d="M286 692 q6 -12 12 0z" fill="#FFB3D0"/><path d="M289 692 l3 -9 3 9" stroke="#FF85B4" stroke-width="1.2" fill="none"/></g>
<g pointer-events="none">${bub(150, 640, 4, 0)}${bub(258, 650, 3, 2.4)}${bub(54, 620, 3.5, 4.1)}${bub(354, 560, 4.5, 1.3)}${bub(206, 600, 5, 5.4)}${bub(120, 660, 3, 3.3)}${bub(290, 610, 3.5, 6.2)}</g>

<g data-tap="jelly"><rect x="306" y="374" width="94" height="112" fill="transparent"/>
  <g transform="translate(296 92)"><g class="zr-jbob amb">
    <circle class="zr-halo amb" cx="54" cy="316" r="50" fill="url(#${u}h)"/>
    <circle class="zr-flash" cx="54" cy="316" r="50" fill="url(#${u}h)" opacity="0"/>
    <g class="zr-tent amb" fill="none" stroke-linecap="round">
      <path d="M32 330 q-7 14 0 27 q7 13 0 26 M76 330 q7 14 0 27 q-7 13 0 26" stroke="#F5A3EC" stroke-width="3.5"/>
      <path d="M44 333 q6 16 -1 31 q-6 14 2 30 M64 333 q-6 16 1 31 q6 14 -2 30" stroke="#C9A6FF" stroke-width="3.5"/>
      <path d="M51 333 q-5 18 3 34 q5 12 -1 24 M57 333 q5 18 -3 34" stroke="#FFD3F6" stroke-width="5"/></g>
    <path class="zr-bell" d="M18 330 Q15 284 54 284 Q93 284 90 330 Q81 337 72 331 Q63 338 54 331 Q45 338 36 331 Q27 337 18 330Z" fill="url(#${u}j)"/>
    <path d="M29 314 Q32 296 50 291" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".75"/>
    <circle cx="43" cy="313" r="3.3" fill="#5B2A63"/><circle cx="65" cy="313" r="3.3" fill="#5B2A63"/><circle cx="44.2" cy="311.8" r="1.1" fill="#fff"/><circle cx="66.2" cy="311.8" r="1.1" fill="#fff"/>
    <path d="M49 320 q5 5 10 0" stroke="#5B2A63" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="35" cy="321" rx="4.5" ry="2.8" fill="#FF6FB8" opacity=".5"/><ellipse cx="73" cy="321" rx="4.5" ry="2.8" fill="#FF6FB8" opacity=".5"/></g></g></g>

<g data-tap="coral"><rect x="0" y="424" width="104" height="172" fill="transparent"/><g>
  <g class="zr-fish"><g transform="translate(58 487)"><path d="M-14 0 l-11 -8 v16z" fill="#FF8A2B"/><path d="M-4 -9 q6 -8 14 -4 l-2 5z" fill="#FF8A2B"/>
    <ellipse rx="16" ry="10" fill="#FF8A2B"/><path d="M-5 -9.5 q3 9.5 0 19 M7 -8 q-3 8 0 16" stroke="#fff" stroke-width="3.6" fill="none"/>
    <path d="M-5 -9.5 q3 9.5 0 19 M7 -8 q-3 8 0 16" stroke="#2A2730" stroke-width=".8" fill="none" opacity=".5"/><circle cx="11" cy="-2" r="2.6" fill="#2A2730"/><circle cx="11.7" cy="-2.8" r=".9" fill="#fff"/></g></g>
  <g class="zr-cor">
    <path d="M4 580 Q-8 520 12 474 Q26 446 42 474 Q52 520 30 580Z" fill="#FFB27A"/><path d="M18 578 Q16 520 26 470 M18 540 Q8 520 6 500 M22 520 Q34 506 38 490" stroke="#FF9356" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g stroke="#FF6F91" stroke-width="12" stroke-linecap="round" fill="none"><path d="M52 588 V532 Q52 510 36 496 V474"/><path d="M52 550 Q70 536 76 514 V494"/><path d="M52 522 Q50 484 58 456 V440"/><path d="M36 498 Q22 490 18 474"/><path d="M76 514 Q90 504 92 486"/></g>
    <g fill="#FF9CB4"><circle cx="36" cy="472" r="7"/><circle cx="76" cy="492" r="7"/><circle cx="58" cy="438" r="7"/><circle cx="18" cy="472" r="7"/><circle cx="92" cy="484" r="7"/></g>
    <path d="M46 540 q4 -10 4 -24 M58 470 q2 -10 1 -18" stroke="#FFA3BA" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
    <g fill="none" stroke-linecap="round"><path d="M72 586 q-4 -12 -10 -16 M78 584 q-2 -14 -4 -22 M84 584 q2 -14 0 -24 M90 584 q4 -12 8 -20 M96 586 q6 -8 8 -14" stroke="#C78BFF" stroke-width="5"/></g>
    <g fill="#FF8FD0"><circle cx="62" cy="570" r="3.4"/><circle cx="74" cy="562" r="3.4"/><circle cx="84" cy="560" r="3.4"/><circle cx="98" cy="564" r="3.4"/><circle cx="104" cy="572" r="3.2"/></g>
    <path d="M8 590 Q8 570 26 570 Q44 570 44 590Z" fill="#B99AF0"/><path d="M14 584 q6 -8 12 0 t12 0 M18 577 q8 -5 16 0" stroke="#9E7EE6" stroke-width="2" fill="none"/></g></g></g>

<g data-tap="clam"><rect x="0" y="606" width="104" height="88" fill="transparent"/>
  <ellipse cx="52" cy="688" rx="46" ry="6" fill="#000" opacity=".12"/>
  <path d="M8 654 Q8 688 52 688 Q96 688 96 654Z" fill="#8F7BE8"/>
  <path d="M20 660 Q24 678 34 684 M36 660 Q38 680 44 686 M52 660 V688 M68 660 Q66 680 60 686 M84 660 Q80 678 70 684" stroke="#7A64D6" stroke-width="2.4" fill="none"/>
  <path d="M10 655 q7 -7 14 0 t14 0 t14 0 t14 0 t14 0 t14 0" stroke="#4FD4E0" stroke-width="6" fill="none" stroke-linecap="round"/>
  <g class="zr-pearl"><circle cx="52" cy="646" r="8" fill="#FFF7FC" stroke="#EADCF0" stroke-width="1.5"/><circle cx="49" cy="643" r="2.6" fill="#fff"/></g>
  <g class="zr-ctop"><g class="zr-cbreath amb">
    <path d="M8 654 Q8 616 52 616 Q96 616 96 654 Q89 648 82 654 Q75 648 67 654 Q59 648 52 654 Q45 648 37 654 Q29 648 22 654 Q15 648 8 654Z" fill="#A996F2"/>
    <path d="M52 649 V624 M52 649 L31 629 M52 649 L73 629 M52 649 L17 643 M52 649 L87 643" stroke="#9580EA" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M22 634 Q32 622 48 620" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".6"/></g></g></g>

<g data-tap="turtle"><rect x="300" y="488" width="100" height="84" fill="transparent"/>
  <g transform="translate(4 80)"><g class="zr-troll"><g class="zr-tswim amb">
    <g class="zr-shyp"><path class="zr-ff amb" d="M338 432 q-12 -22 -34 -26 q6 18 24 34z" fill="#78C489"/></g>
    <g class="zr-shyp"><path class="zr-bf amb" d="M380 462 q16 6 18 22 q-14 -2 -24 -14z" fill="#78C489"/></g>
    <g class="zr-thead"><ellipse cx="311" cy="447" rx="15" ry="11.5" fill="#9EDB8F"/><circle cx="305" cy="443" r="2.8" fill="#2A2730"/><circle cx="304.2" cy="442" r="1" fill="#fff"/>
      <path d="M300 451 q5 3 10 0" stroke="#2A2730" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="314" cy="451" rx="3.4" ry="2.2" fill="#FF9EB5" opacity=".6"/></g>
    <g class="zr-shell"><ellipse cx="353" cy="451" rx="37" ry="25" fill="#3F955C"/><ellipse cx="353" cy="447" rx="32" ry="20" fill="#6CC383"/>
      <path d="M341 437 l12 -6 12 6 v10 l-12 6 -12 -6z" fill="#58B074" stroke="#3F955C" stroke-width="2"/><path d="M329 447 l12 -10 M329 447 l12 7 M377 447 l-12 -10 M377 447 l-12 7 M353 453 v13" stroke="#3F955C" stroke-width="2"/>
      <path d="M330 438 q8 -11 22 -13" stroke="#fff" stroke-width="3" opacity=".55" fill="none" stroke-linecap="round"/><path d="M318 458 q35 18 70 0" stroke="#E9F2C0" stroke-width="4" fill="none" stroke-linecap="round"/></g>
    <g class="zr-shyp"><path class="zr-ff amb" d="M334 465 q-18 16 -36 18 q10 -16 28 -26z" fill="#8FD49C"/></g>
    <rect x="338" y="418" width="30" height="13" rx="4" fill="#FFD23F" stroke="#E6A800" stroke-width="1.5"/><text x="353" y="428" font-size="9" font-weight="900" text-anchor="middle" fill="#2A2730" font-family="system-ui, -apple-system, sans-serif">TAXI</text></g></g></g></g>

<g data-tap="treasure"><rect x="300" y="574" width="100" height="94" fill="transparent"/><g transform="translate(0 8)">
  <ellipse cx="352" cy="652" rx="46" ry="7" fill="#000" opacity=".12"/>
  <g transform="rotate(-5 352 620)">
    <ellipse class="zr-gleam" cx="350" cy="598" rx="36" ry="16" fill="#FFF3A8"/>
    <g><circle cx="330" cy="598" r="5" fill="#FFD23F"/><circle cx="342" cy="595" r="5" fill="#FFC21A"/><circle cx="354" cy="597" r="5.5" fill="#FFF7FC" stroke="#E6D6EA"/><circle cx="366" cy="595" r="5" fill="#FFD23F"/><circle cx="377" cy="598" r="5" fill="#FFF7FC" stroke="#E6D6EA"/><circle cx="348" cy="592" r="4.5" fill="#FFD23F"/></g>
    <rect x="314" y="600" width="74" height="48" rx="5" fill="#A86A3D"/><path d="M314 616 H388 M314 632 H388" stroke="#8E5530" stroke-width="2.5"/>
    <rect x="322" y="600" width="8" height="48" fill="#F2B632"/><rect x="372" y="600" width="8" height="48" fill="#F2B632"/>
    <rect x="344" y="603" width="14" height="16" rx="3" fill="#FFD23F" stroke="#D99A1E" stroke-width="1.5"/><path d="M351 608 v5" stroke="#6B4A2E" stroke-width="2.4" stroke-linecap="round"/>
    <g class="zr-lid"><path d="M312 602 Q312 574 351 574 Q390 574 390 602Z" fill="#BC7A47"/><path d="M326 579 V602 M376 579 V602" stroke="#F2B632" stroke-width="8"/>
      <path d="M312 602 H390" stroke="#8E5530" stroke-width="3"/><path d="M320 590 Q330 579 348 577" stroke="#fff" stroke-width="3" opacity=".4" fill="none" stroke-linecap="round"/>
      <g fill="#FFF7FC" stroke="#E3D2EC" stroke-width="1">${[[334, 604], [336, 611], [340, 617], [346, 620], [352, 618], [357, 613]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2"/>`).join('')}</g></g></g>
  <path d="M296 652 Q322 634 350 644 Q376 634 404 648 V664 H296Z" fill="url(#${u}d)"/>
  ${weed(392, 652, 46, '#2FAE7A', 1.8, 6)}</g></g>
</svg>`,

  css: `
.zr-rays { transform-box: view-box; transform-origin: 200px 40px; animation: zrRays 9s ease-in-out infinite alternate; }
@keyframes zrRays { from { transform: rotate(-2.5deg); opacity: .5; } to { transform: rotate(2.5deg); opacity: .85; } }
.zr-bub { animation: zrBub 8s linear infinite; }
@keyframes zrBub { 0% { transform: translate(0, 0); opacity: 0; } 8% { opacity: 1; } 50% { transform: translate(7px, -220px); } 85% { opacity: .9; } 100% { transform: translate(-4px, -440px); opacity: 0; } }
.zr-weed { transform-box: fill-box; transform-origin: 50% 100%; animation: zrWeed 4.4s ease-in-out infinite alternate; }
@keyframes zrWeed { from { transform: skewX(-7deg); } to { transform: skewX(7deg); } }
.zr-school { animation: zrSchool 34s linear infinite; }
@keyframes zrSchool { from { transform: translateX(0); } to { transform: translateX(-620px); } }
.zr-caus { animation: zrCaus 3.2s ease-in-out infinite alternate; }
@keyframes zrCaus { to { opacity: .06; } }
.zr-jbob { animation: zrJBob 3.6s ease-in-out infinite; }
@keyframes zrJBob { 50% { transform: translateY(-9px); } }
.zr-tent { transform-box: fill-box; transform-origin: 50% 0; animation: zrTent 1.7s ease-in-out infinite alternate; }
@keyframes zrTent { from { transform: skewX(6deg) scaleY(.95); } to { transform: skewX(-6deg) scaleY(1.05); } }
.zr-halo { transform-box: fill-box; transform-origin: center; animation: zrHalo 3s ease-in-out infinite; }
@keyframes zrHalo { 50% { opacity: .4; } }
.zr-flash { transform-box: fill-box; transform-origin: center; }
[data-tap="jelly"].zr-glowon .zr-flash { animation: zrFlash 2.6s ease-in-out; }
@keyframes zrFlash { 15%, 80% { opacity: 1; transform: scale(1.7); } }
[data-tap="jelly"].zr-disco .zr-bell { animation: zrDisco .6s linear 4; }
@keyframes zrDisco { 0%, 100% { fill: #FF8BD8; } 25% { fill: #7FE3FF; } 50% { fill: #FFE36B; } 75% { fill: #8CF59B; } }
.zr-tswim { transform-box: fill-box; transform-origin: center; animation: zrSwim 4s ease-in-out infinite; }
@keyframes zrSwim { 50% { transform: translate(-4px, -7px) rotate(-3deg); } }
.zr-ff { transform-box: fill-box; transform-origin: 100% 0; animation: zrFlipper 1.5s ease-in-out infinite alternate; }
.zr-bf { transform-box: fill-box; transform-origin: 0 0; animation: zrFlipper 1.5s ease-in-out infinite alternate-reverse; }
@keyframes zrFlipper { from { transform: rotate(-12deg); } to { transform: rotate(14deg); } }
.zr-thead, .zr-shyp, .zr-troll { transform-box: fill-box; transform-origin: center; }
[data-tap="turtle"].zr-try .zr-thead { transform-origin: 100% 50%; animation: zrTry 1.8s ease-in-out; }
@keyframes zrTry { 15%, 30% { transform: translateX(7px) scale(.82); } 40%, 50% { transform: translateX(9px) scale(.78, .9); } 62% { transform: translateX(-5px) scale(1.15); } 78% { transform: none; } }
[data-tap="turtle"].zr-try .zr-shyp { animation: zrTryF 1.8s ease-in-out; }
@keyframes zrTryF { 15%, 50% { transform: scale(.7); } 65% { transform: scale(1.1); } }
[data-tap="turtle"].zr-roll .zr-troll { animation: zrRoll 1.2s ease-in-out; }
@keyframes zrRoll { 50% { transform: translateY(-14px) rotate(-180deg); } 100% { transform: rotate(-360deg); } }
.zr-lid { transform-box: fill-box; transform-origin: 100% 100%; }
[data-tap="treasure"].zr-open .zr-lid { animation: zrLid 2s ease-in-out; }
@keyframes zrLid { 12%, 78% { transform: rotate(34deg); } }
.zr-gleam { opacity: 0; }
[data-tap="treasure"].zr-open .zr-gleam { animation: zrGleam 2s ease-in-out; }
@keyframes zrGleam { 15%, 75% { opacity: 1; } }
.zr-fish, .zr-cor { transform-box: fill-box; }
[data-tap="coral"].zr-peek .zr-fish { animation: zrPeek 2.6s ease-in-out; }
@keyframes zrPeek { 15%, 32% { transform: translateX(32px); } 44% { transform: none; } 58%, 74% { transform: translateX(32px); } 88% { transform: none; } }
[data-tap="coral"].zr-fishout .zr-fish, [data-tap="clam"].zr-nopearl .zr-pearl, .zr-away { visibility: hidden; }
[data-tap="coral"].zr-sway .zr-cor { transform-origin: 50% 100%; animation: zrSway 1.3s ease-in-out; }
@keyframes zrSway { 25% { transform: rotate(-4deg); } 70% { transform: rotate(4deg); } }
.zr-ctop, .zr-cbreath { transform-box: fill-box; transform-origin: 0 100%; }
.zr-cbreath { animation: zrBreathe 5.5s ease-in-out infinite; }
@keyframes zrBreathe { 0%, 68%, 100% { transform: none; } 78%, 88% { transform: rotate(-8deg); } }
[data-tap="clam"].zr-cshow .zr-ctop { animation: zrCShow 1.4s ease-in-out; }
@keyframes zrCShow { 18%, 72% { transform: rotate(-38deg); } 80% { transform: rotate(2deg); } 86% { transform: none; } }
[data-tap="clam"].zr-copen .zr-ctop { animation: zrCOpen 2.4s ease-in-out; }
@keyframes zrCOpen { 15%, 80% { transform: rotate(-32deg); } }
[data-tap="clam"].zr-chat .zr-ctop { animation: zrChat .3s ease-in-out 5; }
@keyframes zrChat { 50% { transform: rotate(-26deg); } }
.lucky.zr-glow .l-art { filter: drop-shadow(0 0 10px #FFB8F4) drop-shadow(0 0 22px #8FF0FF) brightness(1.08); }
.lucky.zr-zap .l-art { animation: zrZap .09s linear 12; filter: drop-shadow(0 0 4px #fff) drop-shadow(0 0 10px #9FF3FF); }
@keyframes zrZap { 50% { translate: 3px -2px; } }
.lucky.zr-ride { animation: zrRide 1.1s ease-in-out infinite; }
@keyframes zrRide { 50% { translate: 0 -3%; rotate: -2deg; } }
.lucky.zr-ride .l-art, .lucky.zr-ride .l-props { translate: 0 -12%; }
.pid-reefTurtle > g { transform-box: view-box; transform-origin: 50% 50%; transition: transform .35s; }
.pid-reefTurtle.zr-right > g { transform: scaleX(-1); }
.zr-pfl { transform-box: fill-box; transform-origin: 100% 0; animation: zrFlipper .5s ease-in-out infinite alternate; }
.zr-hb { animation: zrHb 3.4s ease-in infinite; }
@keyframes zrHb { 0% { transform: translate(0, 0); opacity: 0; } 15% { opacity: .9; } 100% { transform: translate(5px, -76px); opacity: 0; } }
.lucky:has(.pid-reefHelmet) .w-head, .lucky:has(.pid-reefHelmet) .pp.season { opacity: 0; }
`,

  props: (h) => ({
    // a clear glass bubble round his head, the sea showing through it
    reefHelmet: { slot: 'zone', art: () => `<circle cx="100" cy="92" r="80" fill="#BFF3FF" fill-opacity=".14" stroke="#EFFFFF" stroke-opacity=".95" stroke-width="3.5"/>
      <circle cx="100" cy="92" r="75.5" fill="none" stroke="#6FD6EE" stroke-opacity=".4" stroke-width="3"/>
      <path d="M40 66 Q54 32 92 19" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="152" cy="40" r="5.5" fill="#fff" opacity=".85"/><circle cx="163" cy="54" r="2.6" fill="#fff" opacity=".7"/>
      <path d="M158 134 Q150 150 134 160" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".45"/>
      <g fill="#fff" fill-opacity=".3" stroke="#fff" stroke-width="1.2"><circle class="zr-hb amb" cx="114" cy="126" r="3.2"/><circle class="zr-hb amb" cx="108" cy="128" r="2.2" style="animation-delay:-1.7s"/></g>` },
    // the fur standing up after the zap, with sparks
    reefFrizz: { slot: 'frizz', art: () => `<path d="${spikes(100, 90, 54, 46, 190, 350, 13, 15)} ${spikes(100, 152, 56, 47, -30, 20, 4, 12)} ${spikes(100, 152, 56, 47, 160, 210, 4, 12)}" stroke="#F59A45" stroke-width="5" stroke-linecap="round"/>
      <path d="${spikes(100, 90, 54, 46, 197, 343, 12, 9)}" stroke="#FFC47E" stroke-width="3" stroke-linecap="round"/>${h.em(34, 40, 22, '⚡')}${h.em(168, 46, 20, '⚡')}${h.em(178, 140, 16, '⚡')}` },
    // a pearl necklace from the pirate chest
    reefPearls: { slot: 'neck', art: () => `${pearls(11)}<circle cx="100" cy="167" r="7.5" fill="#FFD6EC" stroke="#E9A9CB" stroke-width="1.4"/><circle cx="97.5" cy="164.5" r="2.3" fill="#fff"/>` },
    // a pirate's eye patch
    reefEyepatch: { slot: 'eyes', art: () => `<path d="M48 70 Q90 58 108 82 M134 98 Q146 102 154 112" stroke="#2A1B2E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="121" cy="90" rx="16" ry="14" fill="#2A1B2E"/><path d="M115 85 l12 10 M127 85 l-12 10" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"/>` },
    // the jellyfish as a balloon: he holds it by a long tentacle
    reefJelly: { slot: 'hand', art: () => `<path d="M158 164 Q150 100 166 38" stroke="#F3A6EE" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g transform="translate(166 22) scale(1.25) translate(-166 -22)"><path d="M150 36 q-4 10 0 18 M182 36 q4 10 0 18 M160 38 q3 10 -1 18 M172 38 q-3 10 1 18" stroke="#C9A6FF" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M142 36 Q140 2 166 2 Q192 2 190 36 Q184 41 178 37 Q172 42 166 37 Q160 42 154 37 Q148 41 142 36Z" fill="#F7A6EE"/>
      <path d="M150 22 Q153 10 164 7" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".75"/>
      <circle cx="159" cy="22" r="2.4" fill="#5B2A63"/><circle cx="173" cy="22" r="2.4" fill="#5B2A63"/><path d="M162 28 q4 4 8 0" stroke="#5B2A63" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>` },
    // the turtle taxi under him (behind his drawing: he sits on her shell); she faces left, a class turns her round
    reefTurtle: { slot: 'ride', back: true, art: () => `<g><g class="zr-pfl"><path d="M44 206 q-24 14 -44 12 q14 -16 38 -22z" fill="#8FD49C"/></g><path d="M156 206 q20 8 28 22 q-18 0 -32 -12z" fill="#78C489"/>
      <ellipse cx="2" cy="190" rx="18" ry="14" fill="#9EDB8F"/><circle cx="-5" cy="186" r="3.2" fill="#2A2730"/><circle cx="-6" cy="185" r="1.1" fill="#fff"/><path d="M-12 195 q6 4 12 0" stroke="#2A2730" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="196" rx="84" ry="28" fill="#3F955C"/><ellipse cx="100" cy="191" rx="76" ry="22" fill="#6CC383"/>
      <path d="M86 182 l14 -7 14 7 v10 l-14 7 -14 -7z M44 190 l16 -9 M44 190 l16 8 M156 190 l-16 -9 M156 190 l-16 8" stroke="#3F955C" stroke-width="2.4" fill="#58B074"/>
      <path d="M22 206 q78 26 156 0" stroke="#E9F2C0" stroke-width="5" fill="none" stroke-linecap="round"/></g>` },
    // ink on the glass from the octopus
    reefInk: { slot: 'ink', art: () => `<g fill="#3B2752" opacity=".9"><circle cx="76" cy="74" r="15"/><circle cx="90" cy="64" r="8"/><circle cx="64" cy="88" r="7"/><path d="M70 86 q-2 16 2 22 q4 -6 2 -22z"/>
      <circle cx="130" cy="108" r="12"/><circle cx="142" cy="98" r="6"/><path d="M128 118 q-1 12 3 16 q3 -6 1 -16z"/><circle cx="104" cy="44" r="7"/><circle cx="114" cy="40" r="4"/><circle cx="58" cy="122" r="5"/></g>
      <g fill="#fff" opacity=".35"><circle cx="71" cy="69" r="3.5"/><circle cx="126" cy="104" r="3"/></g>` },
    // the octopus hugs him with all eight arms
    reefOctoHug: { slot: 'octo', art: () => `<g stroke="#B46BE0" stroke-width="8" fill="none" stroke-linecap="round">
      <path d="M76 30 Q44 26 30 52 q-6 12 4 16 M124 30 Q156 26 170 52 q6 12 -4 16"/><path d="M80 36 C40 48 16 86 22 118 q3 12 13 8 M120 36 C160 48 184 86 178 118 q-3 12 -13 8"/>
      <path d="M86 40 C30 64 8 150 46 172 Q76 186 106 172 M114 40 C170 64 192 150 154 172 Q124 186 94 172"/><path d="M92 42 Q84 56 70 58 q-8 0 -8 -7 M108 42 Q116 56 130 58 q8 0 8 -7"/></g>
      <g fill="#F4C8FF">${[[34, 64], [21, 96], [22, 132], [42, 164], [72, 179]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3"/><circle cx="${200 - x}" cy="${y}" r="2.3"/>`).join('')}</g>
      <ellipse cx="100" cy="14" rx="34" ry="28" fill="#C47EEB"/><path d="M78 4 Q86 -10 102 -12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>
      <circle cx="88" cy="18" r="4" fill="#3B2752"/><circle cx="112" cy="18" r="4" fill="#3B2752"/><circle cx="89.4" cy="16.6" r="1.4" fill="#fff"/><circle cx="113.4" cy="16.6" r="1.4" fill="#fff"/>
      <path d="M94 28 q6 5 12 0" stroke="#3B2752" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="80" cy="26" rx="5" ry="3" fill="#FF7FC0" opacity=".6"/><ellipse cx="120" cy="26" rx="5" ry="3" fill="#FF7FC0" opacity=".6"/>` },
  }),

  reactions: (R, k) => {
    const { api, L, sfx, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, feet, paw, sceneRect } = k;
    const freeNow = () => api.free() && !api.talking();
    // the middle of a part of the thing (the fish in the coral, the chest's lid)
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    // a class on the thing for the length of a scene, whatever way the scene ends
    const mark = (a, c, cls) => { c.el.classList.add(cls); onEnd(a, () => c.el.classList.remove(cls)); };

    // ----- the jellyfish: it glows (and Lucky with it), zaps him, has a disco, or becomes a balloon -----
    const glow = (c) => {
      const a = begin('reefGlow');
      api.hop(c.el, 'zr-glowon', 2600);
      sfx.magic();
      pose('stars', 2500, 'sway', 1300);
      hold(a, 'zr-glow', 2600);
      api.fxAt(...head(), ['✨', '💫'], 4, 'spark');
      line('reefGlow', 1, 0);
      api.reward();
      at(a, 2800, end);
    };
    // a tiny zap: his fur stands up, then he laughs
    const zap = (c) => {
      const a = begin('reefZap');
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { api.hop(c.el, 'zr-glowon', 1300); sfx.crackle(); fly('⚡', [c.x, c.y], head(), 260, { size: 26 }); });
      at(a, 1000, () => { sfx.buzz(); prop('reefFrizz', 2200); pose('surprised', 1400, 'startle', 1100); hold(a, 'zr-zap', 1100); line('reefZap', 1, 0); });
      at(a, 2400, () => pose('laugh', 1500, 'hop'));
      at(a, 3400, end);
    };
    R.jelly = {
      press: (c) => { sfx.note(1046); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('reefJelly', glow, zap)),
      double: (c) => {
        api.hop(c.el, 'zr-disco', 2600);
        sfx.disco();
        if (freeNow()) { pose('laugh', 2400, 'hula', 1800); line('reefDisco', 1); }
      },
      // he holds the jellyfish like a balloon and floats up
      long: who((c) => {
        const a = begin('reefJellyUp');
        mark(a, c, 'zr-away');
        onEnd(a, () => unprop('hand'));
        prop('reefJelly', 4400);
        sfx.whoosh();
        pose('laugh', 4000, 'levitate', 4200);
        line('reefJellyUp', 1, 0);
        api.reward();
        at(a, 4200, () => { unprop('hand'); sfx.pop(); });
        at(a, 4500, end);
      }),
    };

    // ----- the turtle taxi: a ride across the reef and back -----
    const facing = (right) => L.querySelector('.pid-reefTurtle')?.classList.toggle('zr-right', right);
    const taxi = (c) => {
      const a = begin('reefTaxi');
      const from = part(c, '.zr-shell');
      mark(a, c, 'zr-away');
      onEnd(a, () => unprop('ride'));
      sfx.whoosh();
      fly('🐢', from, feet(), 650, { arc: 40, size: 50 });
      at(a, 650, () => { prop('reefTurtle', 6000); hold(a, 'zr-ride', 5450); sfx.boing(); pose('happy', 2000); line('reefTaxi', 1, 0); });
      at(a, 1300, () => { go(27, 1500); api.fxAt(...feet(), ['🫧'], 3, 'spark'); });
      at(a, 2900, () => { facing(true); sfx.whoosh(); go(73, 2000); api.fxAt(...feet(), ['🫧'], 3, 'spark'); });
      at(a, 5000, () => { facing(false); go(50, 1000); });
      at(a, 6100, () => { unprop('ride'); fly('🐢', feet(), from, 650, { arc: 40, size: 50 }); pose('laugh', 1600, 'hop'); line('reefTaxiBye', 1, 0); api.reward(); });
      at(a, 6800, end);
    };
    // Lucky knocks on her shell: she tries to hide in it, and can't (sea turtles really can't)
    const knock = (c) => {
      const a = begin('reefKnock');
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { sfx.knock(); pose('ok', 900, 'pat'); });
      at(a, 1000, () => { sfx.knock(); api.hop(c.el, 'zr-try', 1800); });
      at(a, 2000, () => { sfx.boing(); pose('laugh', 1800, 'clap'); line('reefTurtleTry', 1, 0); });
      at(a, 3200, end);
    };
    R.turtle = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['🫧'], 3, 'spark'); },
      tap: who(oneOf('reefTurtle', taxi, knock)),
      double: (c) => {
        api.hop(c.el, 'zr-roll', 1300);
        sfx.whoosh();
        api.fxAt(c.x, c.y, ['🫧'], 4, 'spark');
        if (freeNow()) { pose('laugh', 1600, 'roll', 1400); line('reefRoll', 1); }
      },
      // a hug for the old turtle
      long: who((c) => {
        const a = begin('reefTurtleHug');
        go(nextTo(c.el, 16), 700);
        at(a, 750, () => { pose('hearts', 2200, 'hug'); api.hearts(...head(), 5); sfx.purr(); line('reefTurtleOld', 1, 0); api.reward(); });
        at(a, 1700, () => api.hop(L, 'hug'));
        at(a, 2900, end);
      }),
    };

    // ----- the pirate chest: treasure that sinks slowly, a pearl necklace, a map, a pirate -----
    const lid = (c) => part(c, '.zr-lid');
    const treasure = (c) => {
      api.hop(c.el, 'zr-open', 2000);
      sfx.sparkle();
      const [x, y] = lid(c), gy = feet()[1];
      ['🪙', '⚪', '🪙', '💎', '⚪', '🪙'].forEach((e, i) => {
        const up = [x - 20 - i * 24, y - 70 - (i % 2) * 34], down = [up[0] - 12, gy - 6 + (i % 3) * 8];
        setTimeout(() => fly(e, [x, y + 6], up, 550, { arc: 20, spin: 200, size: 20 }), 120 + i * 110);
        setTimeout(() => fly(e, up, down, 1700, { spin: 90, size: 20, stay: 400 }), 670 + i * 110);
      });
      if (!freeNow()) return;
      pose('stars', 2400, 'clap');
      line('reefTreasure', 1);
      api.reward();
    };
    const necklace = (c) => {
      const a = begin('reefNecklace');
      go(nextTo(c.el), 700);
      at(a, 750, () => { api.hop(c.el, 'zr-open', 2000); sfx.sparkle(); });
      at(a, 1150, () => {
        prop('reefPearls', 7000);
        sfx.chime();
        pose('happy', 2200, 'proud', 1200);
        api.fxAt(...api.luckyPoint(0.5, 0.72), ['✨'], 4, 'spark');
        line('reefNecklace', 1, 0);
        api.reward();
      });
      at(a, 2700, end);
    };
    R.treasure = {
      press: (c) => { sfx.knock(); api.fxAt(c.x, c.y, ['✨', '🫧'], 3, 'spark'); },
      tap: who(oneOf('reefTreasure', treasure, necklace)),
      // a treasure map: X marks the spot… right here
      double: (c) => {
        api.hop(c.el, 'zr-open', 2000);
        const [x, y] = lid(c);
        setTimeout(() => { popUp('🗺️', x - 14, y - 36, 2400, 40, 'pop-rise'); sfx.whoosh(); }, 250);
        if (!freeNow()) return;
        pose('surprised', 900);
        setTimeout(() => { if (api.free()) { pose('laugh', 1800, 'hop'); line('reefMap', 1); } }, 700);
      },
      long: who(() => { prop('reefEyepatch', 7000); sfx.jig(); pose('grin', 2400, 'jig', 1900); line('reefPirate', 1); api.reward(); }),
    };

    // ----- the coral: a little clownfish plays peekaboo, darts round Lucky, kisses his helmet -----
    const fishAt = (c) => part(c, '.zr-fish');
    const peek = (c) => {
      api.hop(c.el, 'zr-peek', 2600);
      sfx.note(880);
      setTimeout(() => sfx.note(988), 1500);
      if (!freeNow()) return;
      pose('laugh', 2400, 'peek', 1400);
      line('reefPeek', 1);
    };
    const dart = (c) => {
      const a = begin('reefDart');
      const home = fishAt(c), [hx, hy] = head();
      const pts = [home, [hx + 100, hy + 30], [hx, hy - 46], [hx - 100, hy + 30], [hx, hy + 100], [hx + 100, hy + 30], home];
      mark(a, c, 'zr-fishout');
      sfx.whoosh();
      pts.slice(1).forEach((p, i) => at(a, i * 330, () => fly('🐠', pts[i], p, 330, { size: 28 })));
      pose('surprised', 600);
      at(a, 300, () => { pose('laugh', 2200, 'pirouette', 1500); line('reefDart', 1, 0); });
      at(a, 1900, () => prop('dizzy', 1600));
      at(a, 2100, end);
    };
    R.coral = {
      press: (c) => { sfx.note(784); api.fxAt(c.x, c.y, ['🫧'], 3, 'spark'); },
      tap: who(oneOf('reefCoral', peek, dart)),
      // a cloud of tiny fish puffs out of the coral
      double: (c) => {
        api.hop(c.el, 'zr-sway', 1300);
        sfx.bubble();
        api.fxAt(c.x, c.y - 20, ['🐟', '🐠', '🫧'], 8, 'spark');
        if (freeNow()) { pose('surprised', 1400, 'startle', 1100); line('reefCoral', 1); }
      },
      long: who((c) => {
        const a = begin('reefKiss');
        const home = fishAt(c), glass = api.luckyPoint(0.64, 0.4);
        mark(a, c, 'zr-fishout');
        fly('🐠', home, glass, 700, { arc: 30, size: 30, stay: 1500 });
        at(a, 700, () => { sfx.kiss(); pose('hearts', 2200, 'tilt', 1400); api.hearts(...head(), 3); line('reefKiss', 1, 0); api.reward(); });
        at(a, 2200, () => { fly('🐠', glass, home, 700, { arc: 30, size: 30 }); popUp('💋', glass[0] - 10, glass[1], 1600, 22); });
        at(a, 2950, end);
      }),
    };

    // ----- the giant clam: it snaps shut, blows bubbles, plays castanets, gives him its pearl -----
    const snap = (c) => {
      const a = begin('reefSnap');
      go(nextTo(c.el), 700);
      at(a, 750, () => { api.hop(c.el, 'zr-cshow', 1400); sfx.sparkle(); pose('stars', 1000, 'sniff', 1200); });
      at(a, 1800, () => { sfx.clap(); api.fxAt(c.x, c.y - 10, ['💥'], 1, 'spark'); pose('surprised', 1000, 'startle', 1100); });
      at(a, 2500, () => { pose('laugh', 1500); line('reefClamSnap', 1, 0); });
      at(a, 3500, end);
    };
    const bubbles = (c) => {
      api.hop(c.el, 'zr-copen', 2400);
      const [x, y] = part(c, '.zr-pearl'), [, hy] = head();
      for (let i = 0; i < 6; i++) {
        setTimeout(() => { sfx.bubble(); fly('🫧', [x, y], [x + 40 + i * 22, hy + (i % 3) * 30], 1300, { arc: 20, size: 18 + (i % 3) * 8 }); }, 250 + i * 170);
      }
      if (!freeNow()) return;
      setTimeout(() => { if (!api.free()) return; pose('laugh', 2000, 'hop'); line('reefBubbles', 1); }, 500);
      setTimeout(() => { if (api.free()) { api.hop(L, 'clap'); sfx.pop(); } }, 1600);
    };
    R.clam = {
      press: (c) => { sfx.pop(); api.fxAt(c.x, c.y - 10, ['🫧'], 2, 'spark'); },
      tap: who(oneOf('reefClam', snap, bubbles)),
      double: (c) => {
        api.hop(c.el, 'zr-chat', 1600);
        [0, 300, 600, 900, 1200].forEach((d) => setTimeout(() => sfx.knock(), d + 100));
        if (freeNow()) { pose('laugh', 2000, 'tapdance', 2000); line('reefCastanets', 1); }
      },
      // the clam gives him its pearl
      long: who((c) => {
        const a = begin('reefPearl');
        go(nextTo(c.el), 700);
        at(a, 750, () => { api.hop(c.el, 'zr-copen', 2400); sfx.sparkle(); });
        at(a, 1150, () => { fly('⚪', part(c, '.zr-pearl'), paw(), 500, { arc: 40, size: 16 }); c.el.classList.add('zr-nopearl'); setTimeout(() => c.el.classList.remove('zr-nopearl'), 4600); });
        at(a, 1650, () => { prop('pearl', 3500); sfx.chime(); pose('stars', 2000, 'proud', 1200); api.fxAt(...paw(), ['✨'], 4, 'spark'); line('reefPearl', 1, 0); api.reward(); });
        at(a, 3300, end);
      }),
    };
  },

  visitors: [
    { e: '🐠', w: 3, path: 'glide', end: ['reefSchool', 'release'], flip: true },
    { e: '🐙', w: 2, path: 'float', end: ['reefInk', 'reefHug'] },
  ],

  endings: (k) => {
    const { api, L, sfx, at, fly, prop, unprop, pose, line, head, sceneRect } = k;
    const off = () => [sceneRect().width + 50, 50];
    return {
      // a whole school swims circles round him
      reefSchool: (a, x, y) => {
        const [hx, hy] = head(), cy = hy + 60, steps = 10, leg = 210;
        const ring = (t) => [hx + Math.cos(t) * 120, cy + Math.sin(t) * 86];
        pose('laugh', 2600, 'pirouette', 1500);
        line('reefSchool', 1, 0);
        for (let i = 0; i < 6; i++) {
          const fish = i % 2 ? '🐟' : '🐠', t0 = (i / 6) * Math.PI * 2;
          at(a, i * 60, () => fly(fish, [x, y], ring(t0), 450, { size: 24 }));
          for (let s = 0; s < steps; s++) {
            at(a, 450 + i * 60 + s * leg, () => fly(fish, ring(t0 + (s * Math.PI) / 4), ring(t0 + ((s + 1) * Math.PI) / 4), leg, { size: 24 }));
          }
          at(a, 450 + i * 60 + steps * leg, () => fly(fish, ring(t0 + (steps * Math.PI) / 4), off(), 900, { arc: 40, size: 24 }));
        }
        at(a, 1400, () => api.hearts(hx, hy, 4));
      },
      // the octopus squirts ink on his helmet and swims off; he shakes it off
      reefInk: (a, x, y) => {
        const [hx, hy] = head(), spot = [hx + 96, hy - 6];
        fly('🐙', [x, y], spot, 700, { arc: 40, size: 42, stay: 1500 });
        at(a, 700, () => { sfx.puff(); fly('⚫', spot, [hx, hy + 30], 260, { size: 26 }); });
        at(a, 960, () => { sfx.splash(); prop('reefInk', 2600); pose('surprised', 1600, 'startle', 1100); });
        at(a, 1500, () => line('reefInk', 1, 0));
        at(a, 2200, () => fly('🐙', spot, off(), 900, { arc: 30, size: 42 }));
        at(a, 3400, () => { unprop('ink'); sfx.shake(); api.hop(L, 'shakeOff', 1200); api.setTemp('laugh', 1500); });
      },
      // eight arms, eight hugs
      reefHug: (a, x, y) => {
        fly('🐙', [x, y], head(), 700, { arc: 50, size: 42 });
        at(a, 700, () => { prop('reefOctoHug', 3000); sfx.kiss(); pose('hearts', 2800, 'hug'); api.hearts(...head(), 6); line('reefHug', 1, 0); });
        at(a, 1800, () => api.hop(L, 'hug'));
        at(a, 3700, () => { unprop('octo', true); fly('🐙', head(), off(), 1000, { arc: 40, size: 42 }); });
      },
    };
  },
};
