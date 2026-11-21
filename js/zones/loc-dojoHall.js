// The dojo's second place: the hall inside. A wooden training dummy that spins back, a big taiko drum, a calligraphy
// scroll (a brush stroke turns into a carrot), a bonsai to trim, and a paper sliding door with a ninja's shadow behind it.

// the floor's planks run towards a point far behind the back wall
const plank = (xb) => `M${xb} 500 L${(200 + (xb - 200) * 5 / 3).toFixed(1)} 700`;
// a paper panel of the sliding door: glowing paper, lattice, a wooden kick plate, the frame and the finger pull
const panel = (u, x, pull) => `<rect x="${x}" y="368" width="44" height="126" fill="url(#${u}p)"/>
  <g stroke="#C98E5A" stroke-width="2">${[x + 15, x + 29].map((lx) => `<path d="M${lx} 370 V468"/>`).join('')}${[388, 408, 428, 448].map((ly) => `<path d="M${x} ${ly} H${x + 44}"/>`).join('')}</g>
  <rect x="${x}" y="468" width="44" height="26" fill="#E2AE78"/><path d="M${x + 4} 476 H${x + 40} M${x + 4} 486 H${x + 40}" stroke="#C98E5A" stroke-width="1.6"/>
  <rect x="${x}" y="368" width="44" height="126" fill="none" stroke="#A86B3C" stroke-width="4"/>
  <ellipse cx="${x + pull}" cy="430" rx="2.6" ry="5" fill="#8C5A3C"/>`;

export default {
  id: 'dojoHall',
  world: 'dojo',
  name: ['Зал додзё', 'The dojo hall'],
  spots: { L: [162, 690], R: [252, 692], l: [118, 696], r: [386, 514], sky: 300 },
  arrive: [
    ['Зал додзё! Обувь снимаем… ой, у меня её и нет.', "The dojo hall! Shoes off… oh wait, I don't wear any."],
    ['Тут тихо и тепло, фонарики светятся. Идеально для тренировки!', "It's warm and quiet in here, and the lanterns are glowing. Perfect for training!"],
  ],

  lines: {
    dojoHallChop: [['Кия! Кия! Ниндзя-удар лапкой!', 'Hi-yah! Hi-yah! A ninja paw chop!'], ['Раз, два, три! Держись, деревянный друг!', 'One, two, three! Hold on tight, wooden friend!'], ['Тренируюсь каждый день. Скоро получу чёрный пояс по морковке!', "I train every day. Soon I'll get a black belt in carrots!"]],
    dojoHallBonk: [['Ай! Он развернулся и стукнул меня в ответ!', 'Ouch! It spun round and bonked me back!'], ['Бум! Эта деревяшка сильнее, чем кажется…', 'Bonk! That block of wood is tougher than it looks…']],
    dojoHallDodge: [['Мимо! Ниндзя всегда уворачивается!', 'Missed me! A ninja always dodges!']],
    dojoHallCombo: [['Сто ударов! Ну, почти сто. Спасибо за тренировку!', 'A hundred chops! Well, almost a hundred. Thanks for the practice!'], ['Поклон сопернику. Так делают все настоящие мастера.', "A bow to my partner. That's what all real masters do."]],
    dojoHallDrum: [['Дон-дон-дон! Это японский барабан тайко.', 'Don-don-don! This is a Japanese taiko drum.'], ['Бум-бум! Чувствуешь, как дрожит пол?', 'Boom-boom! Can you feel the floor shaking?'], ['Я барабанщик! Кролики отлично стучат лапами.', "I'm a drummer! Bunnies are brilliant at thumping."]],
    dojoHallBoom: [['Ого, как громко! У меня уши подпрыгнули!', "Whoa, that's loud! My ears jumped!"]],
    dojoHallEcho: [['Ты стучишь, а я хлопаю! Дон-дон, хлоп-хлоп!', 'You drum, I clap! Don-don, clap-clap!']],
    dojoHallSolo: [['Барабанное соло! Повязку на лоб, и поехали!', 'Drum solo! Headband on, and here we go!']],
    dojoHallSoloEnd: [['Та-дам! Аплодисменты барабанщику!', 'Ta-dah! A round of applause for the drummer!']],
    dojoHallCarrot: [['Один взмах кисточкой… и иероглиф стал морковкой! Хрум!', 'One stroke of the brush… and it turned into a carrot! Crunch!'], ['По-японски морковка — «ниндзин». Почти как ниндзя!', "In Japanese, a carrot is 'ninjin'. Almost like 'ninja'!"]],
    dojoHallProverb: [['Мудрость ниндзя: тише крадёшься — больше морковки найдёшь.', 'Ninja wisdom: the quieter you sneak, the more carrots you find.'], ['Мудрость ниндзя: упал семь раз — встань восемь.', 'Ninja wisdom: fall down seven times, get up eight.'], ['Мудрость ниндзя: даже длинный путь начинается с одного прыжка.', 'Ninja wisdom: even the longest journey starts with a single hop.']],
    dojoHallRoll: [['Вжух! Свиток свернулся сам. Секретный ниндзя-свиток!', 'Whoosh! The scroll rolled itself up. A secret ninja scroll!']],
    dojoHallZen: [['Смотрю на свиток и дышу… Вдох — морковка. Выдох — морковка.', 'I look at the scroll and breathe… In: carrot. Out: carrot.']],
    dojoHallTrim: [['Чик-чик! Бонсай стригут крошечными ножницами.', 'Snip-snip! You trim a bonsai with teeny-tiny scissors.'], ['Стрижка для деревца! Аккуратно, как в парикмахерской.', 'A haircut for the little tree! Careful, just like at the hairdresser.']],
    dojoHallLeaf: [['Листик сел мне на нос! Не чихать… апчхи!', "A leaf landed on my nose! Don't sneeze… achoo!"]],
    dojoHallBonsai: [['Это деревце меньше меня, а ему, может, сто лет!', 'This tree is smaller than me, but it might be a hundred years old!'], ['Бонсай — настоящее дерево, только очень маленькое.', 'A bonsai is a real tree, just a very, very small one.']],
    dojoHallTreePose: [['Смотри, я тоже бонсай! Маленький и пушистый.', "Look, I'm a bonsai too! Small and fluffy."]],
    dojoHallBlossom: [['Немножко воды… и бонсай расцвёл! Это крошечная сакура.', "A little water… and the bonsai's in bloom! It's a tiny cherry tree."]],
    dojoHallShadow: [['Видела? За дверью тень! Настоящий ниндзя!', 'Did you see that? A shadow behind the door! A real ninja!'], ['Кто там крадётся на цыпочках? Только ниндзя так умеют.', "Who's tiptoeing out there? Only ninjas can sneak like that."]],
    dojoHallPeek: [['Ку-ку! Это ниндзя играет с нами в прятки.', 'Peekaboo! A ninja is playing hide and seek with us.']],
    dojoHallPuppet: [['Театр теней! Это я, с ушками. Даже тень у меня милая.', "Shadow puppets! That's me, ears and all. Even my shadow is cute."]],
    dojoHallPetal: [['Лепесток сакуры на носу! Говорят, это к удаче… апчхи!', "A cherry blossom petal on my nose! They say it's lucky… achoo!"]],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBD3E1"/><stop offset="1" stop-color="#FFEFE4"/></linearGradient>
<linearGradient id="${u}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4D09C"/><stop offset="1" stop-color="#E6B178"/></linearGradient>
<linearGradient id="${u}o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB3D6"/><stop offset="1" stop-color="#FFEAF3"/></linearGradient>
<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset="1" stop-color="#FFEEDD"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".85"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}l"><stop offset="0" stop-color="#FFF6DC" stop-opacity=".75"/><stop offset="1" stop-color="#FFF6DC" stop-opacity="0"/></radialGradient>
<clipPath id="${u}c"><circle cx="200" cy="326" r="50"/></clipPath>
<clipPath id="${u}d"><rect x="14" y="370" width="88" height="98"/></clipPath>
<clipPath id="${u}e"><rect x="14" y="368" width="88" height="126"/></clipPath></defs>
<rect width="400" height="700" fill="url(#${u}w)"/>
<rect width="400" height="194" fill="#C08A5C"/><path d="M0 50 H400 M0 104 H400 M0 156 H400" stroke="#A97549" stroke-width="4"/>
<rect y="194" width="400" height="40" fill="#FFF4E6"/>
<g stroke="#D9A574" stroke-width="2">${Array.from({ length: 15 }, (_, i) => `<path d="M${14 + i * 27} 196 V232"/>`).join('')}<path d="M0 214 H400"/></g>
${[54, 146, 254, 346].map((x) => `<g transform="translate(${x} 214)">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-5" r="4.4" fill="#FFB3D0" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#FFE07A"/></g>`).join('')}
<rect y="190" width="400" height="6" fill="#A86B3C"/>
<rect y="234" width="400" height="16" fill="#A86B3C"/><rect y="234" width="400" height="4" fill="#C98E5A"/>
<rect x="114" y="462" width="286" height="30" fill="#E8B985"/><path d="M114 462 H400" stroke="#C98E5A" stroke-width="4"/><path d="M114 477 H400" stroke="#DDA874" stroke-width="2"/>
<rect x="0" y="250" width="8" height="250" fill="#B9794A"/><rect x="104" y="250" width="10" height="250" fill="#B9794A"/><rect x="106" y="250" width="3" height="250" fill="#D39A62"/>
<rect x="286" y="250" width="10" height="250" fill="#B9794A"/><rect x="288" y="250" width="3" height="250" fill="#D39A62"/><rect x="394" y="250" width="6" height="250" fill="#B9794A"/>
<rect x="22" y="300" width="70" height="28" rx="4" fill="#8C5A3C"/><rect x="25" y="303" width="64" height="22" rx="3" fill="none" stroke="#C98E5A" stroke-width="1.6"/>
<g stroke="#FFF1DA" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M36 308 v12 M31 311 h10 M31 317 h10 M42 309 q3 6 0 12"/><path d="M66 308 v13 M62 312 h8 M61 320 h11 M74 309 q4 4 2 12 M77 314 h4"/></g>
<path d="M306 300 H386" stroke="#8C5A3C" stroke-width="5" stroke-linecap="round"/><circle cx="306" cy="300" r="4" fill="#6E4329"/><circle cx="386" cy="300" r="4" fill="#6E4329"/>
${[['#FFFFFF', 318], ['#FFD23F', 336], ['#FF7AB8', 354], ['#2E2A33', 372]].map(([c, x]) => `<path d="M${x - 5} 298 h10 v30 l-3 8 -2 -6 -2 6 -3 -8z" fill="${c}" stroke="${c === '#FFFFFF' ? '#E6D6DC' : '#0002'}" stroke-width="1"/>`).join('')}
<circle cx="200" cy="326" r="50" fill="url(#${u}o)"/>
<g clip-path="url(#${u}c)">
  <path d="M146 380 L198 314 L250 380Z" fill="#E4B6E6"/><path d="M186 329 L198 314 L210 329 L203 326 L198 332 L193 326Z" fill="#fff"/>
  <path d="M148 366 Q176 354 200 362 Q226 352 252 364 V380 H148Z" fill="#F7B3CE"/>
  <path d="M254 290 Q232 294 218 286 M236 292 Q230 306 216 312" stroke="#8C5A3C" stroke-width="4" fill="none" stroke-linecap="round"/>
  <g fill="#FF9EC7"><circle cx="220" cy="284" r="8"/><circle cx="236" cy="294" r="9"/><circle cx="216" cy="312" r="7"/><circle cx="250" cy="286" r="8"/><circle cx="228" cy="306" r="6"/></g>
  <g fill="#FFC6DE"><circle cx="234" cy="291" r="3.5"/><circle cx="219" cy="282" r="3"/><circle cx="215" cy="310" r="2.6"/></g>
  ${[[176, 262], [214, 258], [236, 266], [196, 254], [252, 258]].map(([x, y], i) => `<ellipse class="ldh-pt amb" style="animation-delay:-${i * 1.25}s" cx="${x}" cy="${y}" rx="3.6" ry="2.4" fill="#FF9EC7"/>`).join('')}
</g>
<circle cx="200" cy="326" r="50" fill="none" stroke="#A86B3C" stroke-width="7"/><circle cx="200" cy="326" r="45" fill="none" stroke="#D39A62" stroke-width="1.6"/>
${[132, 268].map((x) => `<circle class="ldh-glow amb" cx="${x}" cy="290" r="46" fill="url(#${u}g)"/>`).join('')}
${[132, 268].map((x, i) => `<g class="ldh-lamp amb${i ? ' l2' : ''}"><path d="M${x} 250 V264" stroke="#3A2A3E" stroke-width="2"/>
  <rect x="${x - 9}" y="262" width="18" height="6" rx="2" fill="#3A2A3E"/><ellipse cx="${x}" cy="290" rx="18" ry="24" fill="#FF7398"/>
  <ellipse cx="${x - 4}" cy="288" rx="9" ry="17" fill="#FFB0C4" opacity=".75"/>
  <path d="M${x - 15} 278 Q${x} 282 ${x + 15} 278 M${x - 18} 290 Q${x} 294 ${x + 18} 290 M${x - 15} 302 Q${x} 306 ${x + 15} 302" stroke="#E2577D" stroke-width="1.5" fill="none" opacity=".7"/>
  <rect x="${x - 9}" y="312" width="18" height="6" rx="2" fill="#3A2A3E"/><path d="M${x} 318 V330" stroke="#FFC23D" stroke-width="3" stroke-linecap="round"/></g>`).join('')}
<rect y="492" width="400" height="8" fill="#A86B3C"/>
<rect y="500" width="400" height="200" fill="url(#${u}f)"/>
<g stroke="#D9A46C" stroke-width="2">${Array.from({ length: 13 }, (_, i) => `<path d="${plank(-40 + i * 40)}"/>`).join('')}</g>
<g stroke="#F8DDB0" stroke-width="2" opacity=".8"><path d="M30 540 l-5 22 M300 520 l3 14 M356 620 l6 28 M84 640 l-7 30 M330 676 l4 20"/></g>
<ellipse cx="200" cy="596" rx="200" ry="80" fill="url(#${u}l)"/>
<path d="M140 524 H260 L291 690 H109Z" fill="#F7A6C3"/><path d="M147 530 H253 L280 683 H120Z" fill="none" stroke="#FFD3E2" stroke-width="3"/>
<path d="M109 690 H291 V696 H109Z" fill="#E487AB"/>
<g data-tap="hallDoor"><rect x="8" y="356" width="98" height="170" fill="transparent"/>
  <g clip-path="url(#${u}e)"><rect x="14" y="368" width="88" height="126" fill="url(#${u}o)"/>
  <rect x="14" y="462" width="88" height="32" fill="#9BD48F"/>
  <path d="M80 494 V420" stroke="#8C5A3C" stroke-width="7" stroke-linecap="round"/>
  <g fill="#FF9EC7"><circle cx="68" cy="410" r="17"/><circle cx="90" cy="404" r="15"/><circle cx="80" cy="388" r="15"/></g><g fill="#FFC6DE"><circle cx="76" cy="384" r="4.5"/><circle cx="88" cy="400" r="3.6"/></g></g>
  <rect class="ldh-gap" x="60" y="380" width="38" height="66" fill="none"/>
  ${panel(u, 14, 38)}
  <g class="ldh-slide">${panel(u, 58, 6)}</g>
  <g clip-path="url(#${u}d)">
    <g class="ldh-bun" fill="#6B4A64"><g opacity=".4"><circle cx="80" cy="414" r="13"/><ellipse cx="80" cy="444" rx="14" ry="12"/><circle cx="66" cy="452" r="4"/>
      <g class="ldh-bunear"><ellipse cx="66" cy="424" rx="5.5" ry="15" transform="rotate(24 66 424)"/><ellipse cx="94" cy="424" rx="5.5" ry="15" transform="rotate(-24 94 424)"/></g>
      <path d="M77 400 q3 -7 6 0" fill="none" stroke="#6B4A64" stroke-width="2.4" stroke-linecap="round"/><circle cx="85" cy="413" r="2" fill="#FFF6EC"/><circle cx="75" cy="413" r="2" fill="#FFF6EC"/></g></g>
    <g class="ldh-ninja" fill="#6B4A64" stroke="#6B4A64" stroke-linecap="round" stroke-linejoin="round"><g opacity=".42" transform="translate(-14 468) scale(.95)">
      <circle cx="0" cy="-80" r="10" stroke="none"/><path d="M-8 -84 Q-20 -90 -26 -80 Q-18 -84 -8 -80Z M-8 -80 Q-18 -76 -22 -66 Q-14 -74 -7 -77Z" stroke="none"/>
      <path d="M-9 -70 Q0 -74 9 -70 L11 -36 Q0 -32 -11 -36Z" stroke="none"/>
      <path d="M-8 -66 L-20 -52 L-12 -46 M8 -66 L20 -76 L26 -70 M-5 -36 L-12 -16 L-4 -2 M5 -36 L14 -18 L24 -10" stroke-width="6" fill="none"/></g></g>
  </g>
  <rect x="8" y="360" width="98" height="8" fill="#A86B3C"/><rect x="8" y="494" width="98" height="6" fill="#A86B3C"/>
  <ellipse cx="56" cy="518" rx="38" ry="6" fill="#000" opacity=".1"/>
  <path d="M22 512 Q24 503 44 502 Q70 499 88 505 Q96 512 85 518 Q60 524 36 521 Q20 519 22 512Z" fill="#C9BFCF"/><path d="M32 508 Q50 503 72 505" stroke="#E4DCE8" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<g data-tap="hallScroll"><rect x="304" y="354" width="66" height="174" fill="transparent"/>
  <path d="M337 358 L320 374 M337 358 L354 374" stroke="#8C5A3C" stroke-width="1.6"/><circle cx="337" cy="358" r="2.6" fill="#6E4329"/>
  <g class="ldh-scroll"><rect x="312" y="372" width="50" height="6" rx="3" fill="#8C5A3C"/>
    <g class="ldh-paper"><rect x="314" y="376" width="46" height="86" fill="#F59BBC"/><rect x="314" y="376" width="46" height="7" fill="#E77EA5"/>
      <rect x="320" y="385" width="34" height="70" fill="#FFF9EF"/>
      <g stroke="#2E2A33" stroke-linecap="round" fill="none" transform="translate(337 389) scale(.76) translate(-337 -304)"><path d="M330 312 Q337 310 344 311" stroke-width="3"/><path d="M337 304 Q338 312 337 320" stroke-width="3.4"/>
        <path d="M326 320 Q337 317 349 319" stroke-width="3.6"/><path d="M331 324 l2 4 M344 324 l-2 4" stroke-width="2.6"/>
        <path d="M328 331 Q337 329 347 330" stroke-width="3.2"/><path d="M325 338 Q337 335 350 337" stroke-width="3.8"/><path d="M337 330 Q338 342 336 352" stroke-width="3.6"/></g>
      <rect x="345" y="445" width="6" height="6" rx="1" fill="#E2313B"/>
      <g class="ldh-ink" stroke="#2E2A33" stroke-linecap="round" fill="none"><path d="M327 430 Q337 436 342 450" stroke-width="4.5"/><path d="M327 430 l-2 -6 M327 430 l-6 -2" stroke-width="2.2"/></g>
      <rect x="310" y="458" width="54" height="7" rx="3.5" fill="#6E4329"/><circle cx="310" cy="461.5" r="3.6" fill="#8C5A3C"/><circle cx="364" cy="461.5" r="3.6" fill="#8C5A3C"/></g></g>
  <ellipse cx="337" cy="499" rx="34" ry="3.5" fill="#000" opacity=".1"/>
  <rect x="306" y="476" width="62" height="6" rx="2" fill="#B9794A"/><rect x="306" y="476" width="62" height="2.2" rx="1" fill="#D39A62"/>
  <rect x="311" y="481" width="5" height="18" fill="#9A6340"/><rect x="358" y="481" width="5" height="18" fill="#9A6340"/>
  <rect x="313" y="468" width="20" height="9" rx="3" fill="#3A2A3E"/><ellipse cx="323" cy="471" rx="6" ry="2" fill="#5A4A5E"/>
  <path d="M340 474 L362 468" stroke="#E2C27A" stroke-width="3" stroke-linecap="round"/><path d="M362 468 l7 -3 -5 5z" fill="#2E2A33"/>
  <ellipse cx="338" cy="524" rx="32" ry="5" fill="#000" opacity=".1"/>
  <path d="M314 506 Q338 501 362 506 L368 520 Q338 527 308 520Z" fill="#E46F9C"/><path d="M318 508 Q338 504 358 508" stroke="#F79CC0" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g fill="#FFD23F"><circle cx="314" cy="506" r="2.4"/><circle cx="362" cy="506" r="2.4"/><circle cx="308" cy="520" r="2.4"/><circle cx="368" cy="520" r="2.4"/></g></g>
<g data-tap="hallDrum"><rect x="4" y="530" width="100" height="90" fill="transparent"/>
  <ellipse cx="54" cy="614" rx="44" ry="6" fill="#000" opacity=".12"/>
  <path d="M24 612 L54 578 L84 612 M31 603 H77" stroke="#6E4329" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M90 610 L98 568 M84 612 L88 572" stroke="#D9A86A" stroke-width="4" stroke-linecap="round"/>
  <g class="ldh-drum"><path d="M60 537 Q32 535 20 541 Q11 566 20 591 Q32 597 60 595Z" fill="#C2532F"/>
    <path d="M31 538 Q24 566 31 594 M46 536 Q40 566 46 596" stroke="#9E3F24" stroke-width="3" fill="none"/><path d="M22 551 Q17 566 22 581" stroke="#E07A52" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="38" cy="566" r="5.5" fill="none" stroke="#FFD23F" stroke-width="2.4"/>
    <ellipse cx="62" cy="566" rx="25" ry="30" fill="#8A3522"/><ellipse cx="62" cy="566" rx="20.5" ry="25.5" fill="#FFF1DA"/><ellipse cx="57" cy="557" rx="8" ry="10" fill="#fff" opacity=".6"/>
    ${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return `<circle cx="${(62 + Math.cos(a) * 22.8).toFixed(1)}" cy="${(566 + Math.sin(a) * 27.8).toFixed(1)}" r="1.5" fill="#3A2A3E"/>`; }).join('')}
    <g transform="translate(63 567) scale(.78 .92)">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-6" r="5.6" fill="#FF8AB6" transform="rotate(${a})"/>`).join('')}<circle r="3.4" fill="#FFE07A"/></g></g></g>
<g data-tap="hallDummy"><rect x="300" y="532" width="98" height="166" fill="transparent"/>
  <ellipse cx="352" cy="694" rx="42" ry="6" fill="#000" opacity=".12"/><ellipse cx="352" cy="686" rx="30" ry="8" fill="#8C5A3C"/>
  <g class="ldh-dum">
    <path d="M344 648 Q326 654 322 668 L318 680" stroke="#B9794A" stroke-width="9" fill="none" stroke-linecap="round"/>
    <rect x="334" y="540" width="36" height="146" rx="18" fill="#D39A62"/><rect x="359" y="548" width="7" height="130" rx="3.5" fill="#B9794A" opacity=".55"/>
    <rect x="340" y="552" width="5" height="116" rx="2.5" fill="#F2C998" opacity=".85"/><path d="M335 614 H369 M335 642 H369" stroke="#B9794A" stroke-width="2"/>
    <rect x="334" y="552" width="36" height="6" fill="#FF5C8A"/><path d="M369 555 Q382 550 388 558 Q380 556 370 559Z M369 557 Q378 564 380 574 Q374 564 369 560Z" fill="#FF5C8A"/>
    <circle cx="345" cy="570" r="2.6" fill="#5A3A2A"/><circle cx="359" cy="570" r="2.6" fill="#5A3A2A"/><path d="M346 578 q6 5 12 0" stroke="#5A3A2A" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="340" cy="577" rx="3.5" ry="2" fill="#FF8FB0" opacity=".7"/><ellipse cx="364" cy="577" rx="3.5" ry="2" fill="#FF8FB0" opacity=".7"/>
    <g class="ldh-arms" stroke="#B9794A" stroke-width="8" stroke-linecap="round"><path d="M338 592 L310 582"/><path d="M338 602 L312 610"/><path d="M338 628 L306 630"/></g>
    <g fill="#E2B080"><circle cx="310" cy="582" r="4"/><circle cx="312" cy="610" r="4"/><circle cx="306" cy="630" r="4"/></g></g></g>
<g data-tap="hallBonsai"><rect x="6" y="622" width="100" height="78" fill="transparent"/>
  <ellipse cx="56" cy="696" rx="42" ry="4" fill="#000" opacity=".12"/>
  <rect x="18" y="684" width="76" height="6" rx="2" fill="#8C5A3C"/><rect x="18" y="684" width="76" height="2.2" rx="1" fill="#B07A4E"/><rect x="24" y="689" width="5" height="9" fill="#6E4329"/><rect x="83" y="689" width="5" height="9" fill="#6E4329"/>
  <path d="M31 668 H81 L75 684 H37Z" fill="#4F7FB8"/><rect x="28" y="664" width="56" height="6" rx="3" fill="#6B96CC"/><path d="M39 674 H52" stroke="#8FB4E0" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="56" cy="665" rx="24" ry="3" fill="#6BAF5B"/>
  <path d="M56 665 Q47 656 56 648 Q64 642 56 634 M57 648 Q68 646 76 640 M53 658 Q42 654 36 646" stroke="#7A4A2C" stroke-width="5.5" fill="none" stroke-linecap="round"/>
  <g class="ldh-foliage"><ellipse cx="35" cy="646" rx="16" ry="8" fill="#5DAE5A"/><ellipse cx="78" cy="638" rx="17" ry="9" fill="#5DAE5A"/><ellipse cx="56" cy="630" rx="16" ry="8" fill="#5DAE5A"/>
    <ellipse cx="32" cy="643" rx="9" ry="4" fill="#8BD27A"/><ellipse cx="75" cy="634" rx="10" ry="4.5" fill="#8BD27A"/><ellipse cx="53" cy="626.5" rx="9" ry="4" fill="#8BD27A"/>
    <g class="ldh-blooms" fill="#FF8AB6">${[[27, 646], [41, 642], [70, 638], [84, 634], [88, 642], [50, 630], [62, 626], [35, 650]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g></g></g>
</svg>`,

  css: `
.ldh-pt { transform-box: fill-box; transform-origin: center; }
.ldh-pt.amb { animation: ldhPetal 6.25s linear infinite; }
@keyframes ldhPetal { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(-56px, 150px) rotate(420deg); } }
.ldh-glow.amb { animation: ldhGlow 3.2s ease-in-out infinite; }
@keyframes ldhGlow { 50% { opacity: .55; } }
.ldh-lamp { transform-box: fill-box; transform-origin: 50% 0; }
.ldh-lamp.amb { animation: ldhLamp 5s ease-in-out infinite; }
.ldh-lamp.amb.l2 { animation-delay: -2.5s; }
@keyframes ldhLamp { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
[data-tap="hallDoor"].tapped, [data-tap="hallScroll"].tapped, [data-tap="hallDummy"].tapped { animation: ldhNudge .45s ease-in-out; }
@keyframes ldhNudge { 35% { transform: translateY(-3px); } 70% { transform: translateY(1px); } }
[data-tap="hallDrum"].tapped { animation: ldhBoom .35s ease-out; }
.ldh-dum { transform-box: view-box; transform-origin: 352px 686px; }
.ldh-dum.ldhwobble { animation: ldhWobble .45s ease-in-out; }
@keyframes ldhWobble { 30% { transform: rotate(5deg); } 65% { transform: rotate(-3deg); } }
.ldh-dum.ldhspin { animation: ldhSpin 1.2s ease-in-out; }
.ldh-dum.ldhspin2 { animation: ldhSpin .6s linear 2; }
@keyframes ldhSpin { 25% { transform: scaleX(.08); } 50% { transform: scaleX(-1); } 75% { transform: scaleX(.08); } }
.ldh-dum.ldhbow { animation: ldhBow 1.4s ease-in-out; }
@keyframes ldhBow { 30%, 70% { transform: rotate(-10deg); } }
.ldh-drum { transform-box: fill-box; transform-origin: 50% 50%; }
.ldh-drum.ldhboom { animation: ldhBoom .3s ease-out; }
@keyframes ldhBoom { 30% { transform: scale(1.05, .96); } }
.ldh-drum.ldhboom2 { animation: ldhBoom2 .6s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes ldhBoom2 { 30% { transform: scale(1.12, .9); } }
.ldh-scroll, .ldh-paper { transform-box: fill-box; transform-origin: 50% 0; }
.ldh-scroll.ldhsway { animation: ldhSway 1.6s ease-in-out; }
@keyframes ldhSway { 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } }
.ldh-paper.ldhroll { animation: ldhRoll 1.8s ease-in-out; }
@keyframes ldhRoll { 35%, 55% { transform: scaleY(.06); } }
.ldh-ink path { stroke-dasharray: 80; stroke-dashoffset: 80; }
.ldh-ink.ldhpaint { animation: ldhInkOut 2.2s linear; }
.ldh-ink.ldhpaint path { animation: ldhPaint 2.2s ease-out; }
@keyframes ldhPaint { 0% { stroke-dashoffset: 80; } 45%, 100% { stroke-dashoffset: 0; } }
@keyframes ldhInkOut { 0%, 78% { opacity: 1; } 100% { opacity: 0; } }
.ldh-foliage { transform-box: fill-box; transform-origin: 50% 100%; }
.ldh-foliage.ldhsnip { animation: ldhSnip .3s ease-out; }
@keyframes ldhSnip { 40% { transform: scale(.95, 1.05); } }
.ldh-foliage.ldhsway { animation: ldhTreeSway 1.6s ease-in-out; }
@keyframes ldhTreeSway { 25% { transform: skewX(-5deg); } 75% { transform: skewX(5deg); } }
.ldh-blooms { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; }
.ldh-blooms.ldhbloom { animation: ldhBloom 4s ease-in-out; }
@keyframes ldhBloom { 0% { opacity: 0; transform: scale(.3); } 15%, 85% { opacity: 1; transform: scale(1); } 100% { opacity: 0; } }
.ldh-ninja { display: none; }
.ldh-ninja.ldhsneak { display: inline; animation: ldhSneak 2.6s ease-in-out; }
@keyframes ldhSneak { 0% { transform: translate(0, 0); } 25% { transform: translate(46px, -4px); } 50% { transform: translate(92px, 0); } 75% { transform: translate(138px, -4px); } 100% { transform: translate(190px, 0); } }
.ldh-slide.ldhopen { animation: ldhOpen 2.6s ease-in-out; }
@keyframes ldhOpen { 18%, 78% { transform: translateX(-42px); } }
.ldh-bun { opacity: 0; }
.ldh-bun.ldhpuppet { animation: ldhPuppet 2.8s ease-in-out; }
@keyframes ldhPuppet { 15%, 85% { opacity: 1; } }
.ldh-bunear { transform-box: fill-box; transform-origin: 50% 0; }
.ldh-bun.ldhpuppet .ldh-bunear { animation: ldhEar .3s ease-in-out 6 alternate; }
@keyframes ldhEar { to { transform: rotate(8deg) scaleY(.9); } }
`,

  props: (h) => ({
    dojoHallBand: { slot: 'head', art: () => `<path d="M60 64 Q100 42 140 64" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M62 68 Q100 47 138 68" stroke="#FFD3E2" stroke-width="2" fill="none"/>
      <circle cx="100" cy="53" r="5.5" fill="#FF5C8A"/><path d="M62 62 Q46 52 34 58 Q46 60 54 68 Q42 70 36 82 Q50 74 62 68Z" fill="#fff" stroke="#F3E3EA" stroke-width="1"/>` },
    dojoHallSticks: { slot: 'hand', art: () => `<g stroke="#D9A86A" stroke-width="6" stroke-linecap="round"><path d="M150 170 L184 118"/><path d="M50 170 L16 118"/></g><circle cx="184" cy="118" r="4.5" fill="#C8955A"/><circle cx="16" cy="118" r="4.5" fill="#C8955A"/>` },
    dojoHallBrush: { slot: 'hand', art: () => `<path d="M152 172 L176 120" stroke="#E2C27A" stroke-width="6" stroke-linecap="round"/><path d="M158 160 l5 2 M166 142 l5 2" stroke="#C9A55A" stroke-width="2.4"/>
      <path d="M171 121 Q174 106 186 96 Q187 112 180 125Z" fill="#2E2A33"/>` },
    dojoHallScissors: { slot: 'hand', art: () => h.em(162, 156, 30, '✂️') },
    dojoHallLeaf: { slot: 'nose', art: () => '<g transform="translate(103 99) rotate(-30)"><path d="M-12 0 Q0 -10 12 0 Q0 10 -12 0Z" fill="#5DAE5A"/><path d="M-11 0 H10" stroke="#3E8E3E" stroke-width="1.4"/></g>' },
  }),

  reactions: (R, k) => {
    const { api, sfx, who, oneOf, begin, end, at, hold, go, pose, prop, fly, popUp, line, centerOf, nextTo, head, nose, mouth } = k;
    const part = (c, sel) => c.el.querySelector(sel) || c.el;
    const spot = (c, sel) => centerOf(part(c, sel));

    // the training dummy: chops; it spins round and bonks him back; a combo ending with a bow
    const hit = (c, cls) => { sfx.whoosh(); pose('ok', 500, cls, cls === 'kick' ? 1000 : 600); setTimeout(() => { sfx.tap(); api.hop(part(c, '.ldh-dum'), 'ldhwobble', 450); api.fxAt(...spot(c, '.ldh-arms'), ['💥'], 1, 'spark'); }, 220); };
    const chop = (c) => {
      const a = begin('ldhChop');
      go(nextTo(c.el, 34), 700);
      [800, 1350, 1900].forEach((d, i) => at(a, d, () => hit(c, i === 1 ? 'kick' : 'throw')));
      at(a, 1000, () => line('dojoHallChop', 1, 0));
      at(a, 2700, () => { pose('happy', 1400, 'proud', 1200); api.reward(); });
      at(a, 3800, end);
    };
    const bonk = (c) => {
      const a = begin('ldhBonk');
      go(nextTo(c.el, 34), 700);
      at(a, 800, () => { sfx.whoosh(); pose('ok', 700, 'kick', 1000); });
      at(a, 1050, () => { sfx.tap(); api.hop(part(c, '.ldh-dum'), 'ldhspin', 1200); });
      at(a, 1650, () => { sfx.bonk(); prop('bump', 2800); pose('dizzy', 1700, 'squash', 700); api.fxAt(...head(), ['💫'], 3, 'spark'); line('dojoHallBonk', 1, 0); });
      at(a, 3400, () => api.setTemp('laugh', 1300));
      at(a, 3900, end);
    };
    R.hallDummy = {
      press: () => sfx.knock(),
      tap: who(oneOf('dojoHallDummy', chop, bonk)),
      double: (c) => {
        api.hop(part(c, '.ldh-dum'), 'ldhspin2', 1200);
        sfx.whoosh();
        setTimeout(() => sfx.whoosh(), 600);
        if (api.free()) { pose('laugh', 1400, 'dodge', 1100); line('dojoHallDodge', 1); }
      },
      long: who((c) => {
        const a = begin('ldhCombo');
        go(nextTo(c.el, 34), 700);
        prop('dojoHallBand', 6000);
        [800, 1100, 1400, 1700, 2000, 2300].forEach((d) => at(a, d, () => hit(c, 'throw')));
        at(a, 2800, () => { pose('happy', 1600, 'bow', 1500); api.hop(part(c, '.ldh-dum'), 'ldhbow', 1400); sfx.gong(); line('dojoHallCombo', 1, 0); });
        at(a, 4300, () => { api.hearts(...head(), 3); api.reward(); });
        at(a, 4800, end);
      }),
    };

    // the taiko drum: a rhythm, a boom that makes his ears jump, an echo, a drum solo
    const drumEl = (c) => part(c, '.ldh-drum');
    const don = (c, big) => { sfx.stamp(); api.hop(drumEl(c), big ? 'ldhboom2' : 'ldhboom', big ? 600 : 300); };
    const rhythm = (c) => {
      const a = begin('ldhDrum');
      go(nextTo(c.el, 28), 700);
      at(a, 750, () => { prop('dojoHallSticks', 2900); line('dojoHallDrum', 1, 0); });
      // don, don, do-ko, don!
      [950, 1350, 1750, 1900, 2250].forEach((d, i) => at(a, d, () => { don(c, i === 4); if (i !== 3) pose(null, 0, 'drum', 900); api.fxAt(...spot(c, '.ldh-drum'), ['🎵', '🎶'], 1, 'spark'); }));
      at(a, 2700, () => { pose('happy', 1400, 'proud', 1200); api.reward(); });
      at(a, 3700, end);
    };
    const loud = (c) => {
      don(c, true);
      setTimeout(() => sfx.stamp(), 120);
      api.floatFx(c.x, c.y, '', 'ripple');
      pose('surprised', 1600, 'bigears', 1900);
      line('dojoHallBoom', 1);
    };
    R.hallDrum = {
      press: (c) => don(c),
      tap: who(oneOf('dojoHallDrum', rhythm, loud)),
      double: (c) => {
        setTimeout(() => don(c), 200);
        if (!api.free()) return;
        setTimeout(() => {
          if (!api.free()) return;
          pose('happy', 1600, 'clap', 700);
          sfx.clap();
          setTimeout(() => sfx.clap(), 350);
          line('dojoHallEcho', 1);
        }, 650);
      },
      long: who((c) => {
        const a = begin('ldhSolo');
        go(nextTo(c.el, 28), 700);
        at(a, 700, () => { prop('dojoHallBand', 6400); prop('dojoHallSticks', 5800); line('dojoHallSolo', 1, 0); });
        // faster and faster
        [1100, 1500, 1900, 2200, 2500, 2700, 2900, 3100, 3250, 3400, 3550, 3700, 3800, 3900, 4000].forEach((d, i) => at(a, d, () => {
          if (i % 3 === 2) { sfx.drum(); api.hop(drumEl(c), 'ldhboom', 300); } else don(c);
          if (i % 2 === 0) pose(null, 0, 'drum', 900);
          if (i % 3 === 0) api.fxAt(...spot(c, '.ldh-drum'), ['🎵', '🎶', '💥'], 2, 'spark');
        }));
        at(a, 4400, () => { don(c, true); sfx.gong(); pose('stars', 1800, 'bigjump', 1100); api.fxAt(...head(), ['✨', '🌟'], 6, 'spark'); });
        at(a, 5400, () => { pose('laugh', 1600, 'bow', 1500); line('dojoHallSoloEnd', 1, 0); api.hearts(...head(), 4); api.reward(); });
        at(a, 6700, end);
      }),
    };

    // the scroll: a brush stroke that turns into a carrot; a ninja proverb; it rolls up; a calm moment in front of it
    const paint = (c) => {
      const a = begin('ldhPaint');
      go(nextTo(c.el), 700);
      at(a, 750, () => { prop('dojoHallBrush', 2400); pose('ok', 1400, 'tilt', 1400); });
      at(a, 950, () => { sfx.zip(); api.hop(part(c, '.ldh-ink'), 'ldhpaint', 2200); });
      at(a, 2700, () => { const p = spot(c, '.ldh-ink'); sfx.pop(); fly('🥕', p, mouth(), 650, { arc: 50, spin: 240, size: 28 }); });
      at(a, 3350, () => { api.setTemp('eat', 1800); sfx.crunch(); line('dojoHallCarrot', 1, 0); api.boost('hunger', 2); api.reward(); });
      at(a, 4500, end);
    };
    const proverb = (c) => {
      api.hop(part(c, '.ldh-scroll'), 'ldhsway', 1600);
      api.fxAt(...spot(c, '.ldh-paper'), ['✨'], 2, 'spark');
      pose('smug', 2600, 'think', 2600);
      line('dojoHallProverb', 1);
    };
    R.hallScroll = {
      press: (c) => { sfx.tap(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('dojoHallScroll', paint, proverb)),
      double: (c) => {
        api.hop(part(c, '.ldh-paper'), 'ldhroll', 1800);
        sfx.zip();
        setTimeout(() => sfx.zip(), 900);
        if (api.free()) { pose('laugh', 1400, 'startle', 1100); line('dojoHallRoll', 1); }
      },
      long: who(() => {
        const a = begin('ldhZen');
        pose('sleep', 3800);
        hold(a, 'meditate', 3600);
        sfx.chime();
        api.fxAt(...head(), ['✨'], 3, 'spark');
        line('dojoHallZen', 1, 0);
        api.boost('energy', 1);
        at(a, 3700, () => { api.setTemp('happy', 1400); api.reward(); });
        at(a, 4000, end);
      }),
    };

    // the bonsai: a trim with tiny scissors (a leaf lands on his nose), a fact, a bonsai pose, it blossoms
    const snip = () => { sfx.tick(); setTimeout(() => sfx.tick(), 90); };
    const trim = (c) => {
      const a = begin('ldhTrim');
      go(nextTo(c.el), 700);
      at(a, 750, () => { prop('dojoHallScissors', 1900); line('dojoHallTrim', 1, 0); });
      [900, 1300, 1700].forEach((d) => at(a, d, () => { snip(); api.hop(part(c, '.ldh-foliage'), 'ldhsnip', 300); api.fxAt(...spot(c, '.ldh-foliage'), ['🍃'], 1, 'drop'); }));
      at(a, 2100, () => fly('🍃', spot(c, '.ldh-foliage'), nose(), 900, { arc: 50, spin: 160, size: 20 }));
      at(a, 3000, () => { prop('dojoHallLeaf', 1800); pose('surprised', 1300, 'tilt', 1400); line('dojoHallLeaf', 1, 0); });
      at(a, 4300, () => api.setTemp('sleep', 400));
      at(a, 4700, () => { sfx.sneeze(); pose('laugh', 1400, 'sneeze'); k.unprop('nose'); api.fxAt(...nose(), ['🍃', '💨'], 3, 'spark'); });
      at(a, 5600, end);
    };
    const fact = (c) => {
      api.hop(part(c, '.ldh-foliage'), 'ldhsway', 1600);
      sfx.chime();
      pose('happy', 1800, 'tilt', 1400);
      line('dojoHallBonsai', 1);
    };
    R.hallBonsai = {
      press: (c) => { sfx.tick(); api.fxAt(c.x, c.y, ['🍃'], 2, 'spark'); },
      tap: who(oneOf('dojoHallBonsai', trim, fact)),
      double: who(() => {
        const a = begin('ldhTree');
        pose('happy', 2400);
        hold(a, 'balance', 2400);
        api.fxAt(...head(), ['🍃', '🌿'], 5, 'spark');
        sfx.grow();
        line('dojoHallTreePose', 1);
        at(a, 2500, end);
      }),
      long: who((c) => {
        const a = begin('ldhBloom');
        go(nextTo(c.el), 700);
        at(a, 750, () => { prop('wateringCan', 1700); pose('happy', 1700); });
        [900, 1200, 1500].forEach((d) => at(a, d, () => { const [x, y] = spot(c, '.ldh-foliage'); api.fxAt(x, y - 30, ['💧'], 2, 'drop'); sfx.bubble(); }));
        at(a, 1900, () => { api.hop(part(c, '.ldh-blooms'), 'ldhbloom', 4000); sfx.grow(); sfx.magic(); pose('surprised', 1000, 'startle', 1100); line('dojoHallBlossom', 1, 0); });
        at(a, 2700, () => { api.fxAt(...head(), ['🌸'], 6, 'drop petal-fx'); prop('petals', 3200); api.setTemp('happy', 1800); api.reward(); });
        at(a, 4300, end);
      }),
    };

    // the paper door: a ninja's shadow tiptoes past; peekaboo; shadow puppets; hide and seek behind it
    const shadow = (c) => {
      api.hop(part(c, '.ldh-ninja'), 'ldhsneak', 2600);
      sfx.taps();
      setTimeout(() => { if (!api.free()) return; pose('surprised', 1700, 'startle', 1100); line('dojoHallShadow', 1); }, 900);
    };
    const peek = (c) => {
      const a = begin('ldhPeek');
      sfx.zip();
      api.hop(part(c, '.ldh-slide'), 'ldhopen', 2600);
      at(a, 500, () => { popUp('🥷', ...spot(c, '.ldh-gap'), 1700, 34, 'pop-stay'); sfx.boing(); });
      at(a, 700, () => { pose('laugh', 1800, 'peek', 1400); line('dojoHallPeek', 1, 0); });
      at(a, 2050, () => sfx.zip());
      at(a, 2800, end);
    };
    R.hallDoor = {
      press: () => sfx.knock(),
      tap: who(oneOf('dojoHallDoor', shadow, peek)),
      double: (c) => {
        api.hop(part(c, '.ldh-bun'), 'ldhpuppet', 2800);
        sfx.magic();
        if (api.free()) { pose('happy', 1800, 'wave', 1200); line('dojoHallPuppet', 1); }
      },
      long: who((c) => { sfx.zip(); api.hop(part(c, '.ldh-slide'), 'ldhopen', 2600); k.hideGame(begin('hide'), c.el); }),
    };
  },

  visitors: [
    { e: '🌸', w: 3, path: 'float', end: ['dojoHallPetal', 'wish'] },
    { e: '🐦', w: 2, path: 'glide', end: ['sing', 'feather'], flip: true },
  ],
  endings: (k) => ({
    // a cherry blossom petal lands on his nose: it's lucky… achoo!
    dojoHallPetal: (a, x, y) => {
      const { api, sfx, at, fly, pose, line, nose } = k;
      fly('🌸', [x, y], nose(), 1000, { arc: 40, spin: 200, size: 22, stay: 2100 });
      at(a, 1000, () => { pose('surprised', 1600, 'tilt', 1400); line('dojoHallPetal', 1, 0); });
      at(a, 2700, () => api.setTemp('sleep', 400));
      at(a, 3100, () => { sfx.sneeze(); pose('laugh', 1500, 'sneeze'); api.fxAt(...nose(), ['🌸'], 6, 'spark'); });
    },
  }),
};
