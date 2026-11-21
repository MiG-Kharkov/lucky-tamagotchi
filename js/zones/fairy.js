// Fairy forest (level 50): a twilight forest under the moon. Glowing mushrooms that work as trampolines, a swarm of
// fireflies (one goes into a jar for a moment; together they make a heart), a fairy door in an old tree (the fairy
// asks riddles, sprinkles dust and lends Lucky her wings), a wise owl in the same tree, and bluebells that ring.

// the fairy's riddles: the question, a pause to think, the answer
const RIDDLES = [
  [['Фея спрашивает: у чего есть горлышко, но нет головы?', 'The fairy asks: what has a neck but no head?'],
    ['Знаю! Это бутылка!', 'I know! A bottle!']],
  [['Фея спрашивает: много зубов, а никого не кусает. Что это?', 'The fairy asks: what has lots of teeth but never bites?'],
    ['Расчёска! Фея, я угадал?', 'A comb! Did I get it right, fairy?']],
  [['Фея спрашивает: что становится больше, если из него брать?', 'The fairy asks: what gets bigger the more you take away?'],
    ['Яма! Уж мы, кролики, про ямки всё знаем.', 'A hole! We bunnies know all about holes.']],
];

// the swarm of fireflies over the bluebells, and where each one flies to make a heart
const FLIES = [[302, 388], [320, 372], [338, 398], [356, 376], [376, 390], [390, 416], [378, 444], [354, 456], [330, 446], [306, 430], [322, 416], [358, 422]];
const HEART_AT = [[346, 390], [330, 376], [312, 382], [305, 399], [314, 418], [329, 434], [346, 448], [363, 434], [378, 418], [387, 399], [380, 382], [362, 376]];
// each firefly flies to the heart point at the same angle round the middle, so they don't cross
const angle = ([x, y]) => Math.atan2(y - 412, x - 346);
const byAngle = (list) => list.map((p, i) => [angle(p), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const HEART = [];
const ORDER = byAngle(HEART_AT);
byAngle(FLIES).forEach((f, j) => { HEART[f] = HEART_AT[ORDER[j]]; });
// the glowing mushrooms change colour when Lucky bounces on them
const CAPS = ['#FF7FC4', '#6FE3FF', '#B58CFF', '#FFD84D', '#7CF0A6'];
// the light around a mushroom: its colour, paler
const pale = (c) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(c.slice(i, i + 2), 16) * 0.45 + 255 * 0.55).toString(16).padStart(2, '0')).join('');

const firefly = (u, x, y, i, r = 13) => `<g class="zf2-ffd amb" style="--d:${(-i * 0.73).toFixed(2)}s"><g class="zf2-ffb amb" style="--d:${(-i * 0.41).toFixed(2)}s">
  <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}f)"/><circle cx="${x}" cy="${y}" r="${(r * 0.42).toFixed(1)}" fill="#F4FF8A" opacity=".6"/><circle cx="${x}" cy="${y}" r="${(r * 0.25).toFixed(1)}" fill="#FFFFE8"/></g></g>`;
// a glowing mushroom: halo, stem, cap with spots (n: its number, for the colour change and the song)
const shroom = (u, n, x, y, r, c) => {
  const h = r * 0.82, sw = Math.max(3.5, r * 0.32), sh = r * 1.05;
  return `<g class="zf2-m zf2-m${n}"><defs><radialGradient id="${u}h${n}">${[[0, 0.9], [0.5, 0.55], [1, 0]].map(([o, a]) => `<stop class="zf2-stop" offset="${o}" stop-color="${pale(c)}" stop-opacity="${a}"/>`).join('')}</radialGradient></defs>
  <circle class="zf2-halo amb" cx="${x}" cy="${y - h * 0.4}" r="${r * 1.9}" fill="url(#${u}h${n})"/>
  <ellipse cx="${x}" cy="${y + sh}" rx="${r * 0.8}" ry="${Math.max(2, r * 0.12)}" fill="#000" opacity=".12"/>
  <path d="M${x - sw} ${y + 1} Q${x - sw - 2} ${y + sh * 0.6} ${x - sw + 1} ${y + sh} H${x + sw - 1} Q${x + sw + 2} ${y + sh * 0.6} ${x + sw} ${y + 1}Z" fill="#FFF3E2"/>
  <path d="M${x - sw * 0.4} ${y + 4} Q${x - sw * 0.6} ${y + sh * 0.6} ${x - sw * 0.3} ${y + sh - 2}" stroke="#fff" stroke-width="${Math.max(1.2, r * 0.07)}" fill="none" opacity=".8" stroke-linecap="round"/>
  <path d="M${x - r * 0.9} ${y} Q${x} ${y + h * 0.32} ${x + r * 0.9} ${y}Z" fill="#FFE3EE" opacity=".85"/>
  <path class="zf2-tint" d="M${x - r} ${y} A${r} ${h} 0 0 1 ${x + r} ${y} Q${x} ${y + h * 0.28} ${x - r} ${y}Z" fill="${c}"/>
  <g fill="#fff" opacity=".9"><ellipse cx="${x - r * 0.45}" cy="${y - h * 0.45}" rx="${r * 0.14}" ry="${r * 0.11}"/><ellipse cx="${x + r * 0.12}" cy="${y - h * 0.72}" rx="${r * 0.17}" ry="${r * 0.13}"/>
    <ellipse cx="${x + r * 0.58}" cy="${y - h * 0.32}" rx="${r * 0.12}" ry="${r * 0.1}"/><ellipse cx="${x - r * 0.08}" cy="${y - h * 0.24}" rx="${r * 0.09}" ry="${r * 0.07}"/></g>
  <path d="M${x - r * 0.72} ${y - h * 0.42} Q${x - r * 0.5} ${y - h * 0.88} ${x - r * 0.05} ${y - h * 0.96}" stroke="#fff" stroke-width="${Math.max(1.4, r * 0.09)}" opacity=".45" fill="none" stroke-linecap="round"/></g>`;
};
// a bluebell hanging from its stem (top at 0,0)
const bell = (x, y, r, c) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.25)"><g class="zf2-bell"><path d="M0 -3 V2" stroke="#3E8F5E" stroke-width="1.6"/>
  <path d="M-5 2 Q-6 8 -7.5 12 Q-5.5 11 -4 13.5 Q-2 11.5 0 13.5 Q2 11.5 4 13.5 Q5.5 11 7.5 12 Q6 8 5 2 Q0 -1 -5 2Z" fill="${c}"/>
  <path d="M-3 4 Q-4 8 -4.6 11" stroke="#fff" stroke-width="1.4" opacity=".5" fill="none" stroke-linecap="round"/></g></g>`;
// a stem that arches over, with bells along the arch
const stem = (bx, by, tx, ty, dir, bells) => `<g class="zf2-stem amb"><path d="M${bx} ${by} Q${bx - dir * 3} ${ty + 34} ${tx} ${ty} Q${tx + dir * 14} ${ty - 7} ${tx + dir * 26} ${ty + 9}" stroke="#4E9F63" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${bells.map(([dx, dy, r, c]) => bell(tx + dir * dx, ty + dy, r * dir, c)).join('')}</g>`;
// a tiny toadstool of the fairy ring
const mini = (x, y, c) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle cy="-5" r="7" fill="${c}" opacity=".2"/><rect x="-1.6" y="-6" width="3.2" height="6.5" rx="1.4" fill="#FFF3E2"/>
  <path d="M-5.5 -5 A5.5 4.6 0 0 1 5.5 -5Z" fill="${c}"/><circle cx="-1.6" cy="-7.4" r="1" fill="#fff"/><circle cx="2" cy="-6.6" r=".8" fill="#fff"/></g>`;

const hootSfx = (sfx, hi = 0) => { sfx.note(330 + hi); setTimeout(() => sfx.note(294 + hi), 420); };
const tune = (sfx, notes, gap) => notes.forEach((f, i) => setTimeout(() => sfx.note(f), i * gap));

export default {
  id: 'fairy',
  level: 50,
  name: ['Волшебный лес', 'Fairy forest'],
  emoji: ['🍄', '🧚', '🦉', '🌙', '✨'],
  spots: { L: [30, 654], R: [374, 578], l: [140, 692], r: [262, 692], sky: 300 },
  arrive: [
    ['Волшебный лес! Тут грибы светятся, а совы говорят «у-ху».', 'The fairy forest! The mushrooms glow here, and the owls say who-who.'],
    ['Тсс… Это волшебный лес. Кажется, за нами подглядывает фея!', "Shh… It's the fairy forest. I think a fairy is peeking at us!"],
  ],

  lines: {
    fairyBounce: [['Бу-унь! Грибы-батуты — лучшее, что есть в лесу!', 'Boing! Mushroom trampolines are the best thing in the forest!'],
      ['Прыг! Гриб поменял цвет! Он что, хамелеон?', 'Bounce! The mushroom changed colour! Is it a chameleon?'],
      ['Мягкий, как подушка, и пружинит! Ещё разок!', 'Soft as a pillow and super bouncy! One more time!']],
    fairySpores: [['Апчхи! Светящиеся споры! Теперь я тоже свечусь.', "Achoo! Glowing spores! Now I'm glowing too."],
      ['Эти грибы светятся сами! Это называется биолюминесценция.', "These mushrooms glow all by themselves! It's called bioluminescence."]],
    fairyShroomSong: [['Грибы поют! До-ре-ми!', 'The mushrooms are singing! Do-re-mi!'], ['Грибной оркестр! А я дирижёр.', "A mushroom orchestra! And I'm the conductor."]],
    fairyTrampoline: [['Выше, выше, ещё выше! И сальто!', 'Higher, higher, even higher! And a flip!'], ['Я почти достал до луны! Ну, почти-почти.', 'I nearly touched the moon! Well, nearly-nearly.']],
    fairyJar: [['Поймал светлячка! Смотри, как светится.', 'I caught a firefly! Look how it glows.'], ['Фонарик в банке! Только живой.', 'A lantern in a jar! A living one.']],
    fairyJarFree: [['Лети, маленький фонарик! Свети всем.', 'Off you go, little lantern! Light the way.'], ['Светлячкам лучше на свободе. Пока-пока!', 'Fireflies are happier free. Bye-bye!']],
    fairyNoseFly: [['Светлячок сел мне на нос! Я теперь ночник.', "A firefly landed on my nose! I'm a nightlight now."], ['Щекотно! Мой нос светится, как фонарик.', 'That tickles! My nose is shining like a torch.']],
    fairyHeart: [['Светлячки сложились в сердечко! Это мне?', 'The fireflies made a heart! Is it for me?'], ['Сердечко из светлячков! Я вас тоже люблю!', 'A firefly heart! I love you too, fireflies!']],
    fairySync: [['Раз, два… мигаем! Некоторые светлячки мигают все вместе.', 'One, two… blink! Some fireflies really do blink all together.'],
      ['Светлячки мигают, чтобы поговорить друг с другом.', 'Fireflies blink their lights to talk to each other.']],
    fairyRiddle: RIDDLES.map((r) => r[0]),
    fairyAnswer: RIDDLES.map((r) => r[1]),
    fairyDust: [['Фея посыпала меня пыльцой… Ой, я крошечный!', "The fairy sprinkled dust on me… Oops, I'm tiny!"], ['Волшебная пыльца! Я теперь размером с жёлудь.', "Fairy dust! Now I'm the size of an acorn."]],
    fairyBig: [['Фух, я снова нормального размера!', "Phew, I'm back to my normal size!"]],
    fairyWave: [['Фея помахала мне из окошка! Привет, фея!', 'The fairy waved at me from her window! Hi, fairy!'], ['Фея послала мне воздушный поцелуй!', 'The fairy blew me a kiss!']],
    fairyWings: [['Крылья феи! Смотри, я лечу!', "Fairy wings! Look, I'm flying!"], ['Я кролик-фея! Могу исполнить одно морковное желание.', "I'm a bunny fairy! I can grant one carrot wish."]],
    fairyHoot: [['Сова говорит «у-ху». Я тоже умею: у-ху!', 'The owl says who-who. I can do it too: who-who!'], ['У-ху, у-ху! Кажется, я теперь говорю по-совиному.', 'Who-who, who-who! I think I speak Owl now.']],
    fairyOwlTurn: [['Сова может повернуть голову почти совсем назад! А я нет.', "Owls can turn their heads almost all the way round! I can't."],
      ['Я тоже попробовал повернуть голову, как сова. Голова кружится!', 'I tried turning my head like the owl. Now I feel dizzy!']],
    fairyWink: [['Сова мне подмигнула! Подмигну в ответ.', "The owl winked at me! I'll wink back."], ['Сова подмигивает. Наверное, знает какой-то секрет!', 'The owl is winking. She must know a secret!']],
    fairyProfessor: [['Мудрая сова сделала меня профессором! Профессор Лаки.', 'The wise owl made me a professor! Professor Lucky.'], ['Сова говорит, я очень умный кролик. И это правда!', "The owl says I'm a very clever bunny. And it's true!"]],
    fairyBells: [['Колокольчики звенят! Говорят, так они зовут фей.', 'The bluebells are ringing! They say that calls the fairies.'],
      ['В Ирландии говорят: колокольчики звенят для фей.', 'In Ireland they say bluebells ring for the fairies.'],
      ['Динь-динь! Слышишь? Тише, феи слушают.', 'Ding-ding! Hear that? Shh, the fairies are listening.']],
    fairyBellDance: [['Колокольчики играют весёлую песенку! Танцуем!', "The bluebells are playing a happy tune! Let's dance!"], ['Динь-дон, динь-дон! Лапы сами танцуют.', 'Ding-dong, ding-dong! My paws are dancing by themselves.']],
    fairyBellWake: [['Динь-дон! Колокольчики разбудили всех светлячков!', 'Ding-dong! The bluebells woke up all the fireflies!']],
    fairyBellHat: [['Шляпка из колокольчика! Динь-дон, вот и я!', 'A bluebell hat! Ding-dong, here I come!'], ['Самая звонкая шляпа в лесу!', 'The jingliest hat in the forest!']],
    fairyWand: [['Фея коснулась меня волшебной палочкой! Я весь сверкаю.', "The fairy touched me with her wand! I'm all sparkly."], ['Я поймал фею! Или это она меня поймала? Волшебство!', 'I caught a fairy! Or did she catch me? Magic!']],
    fairyGlow: [['Светлячки облепили меня! Я теперь кролик-фонарик.', "The fireflies are all over me! I'm a bunny lantern now."]],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2D2A6E"/><stop offset=".36" stop-color="#5E4FAE"/><stop offset=".56" stop-color="#B07CC8"/><stop offset=".7" stop-color="#F3AFC6"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".6"/><stop offset="1" stop-color="#FFF6D6" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}f"><stop offset="0" stop-color="#FFFBB0" stop-opacity=".95"/><stop offset=".35" stop-color="#F2FF7A" stop-opacity=".45"/><stop offset="1" stop-color="#E8FF6A" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}d"><stop offset="0" stop-color="#FFE58A" stop-opacity=".85"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8DC" stop-opacity=".5"/><stop offset="1" stop-color="#FFF8DC" stop-opacity="0"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<circle class="zf2-moonglow amb" cx="246" cy="262" r="70" fill="url(#${u}g)"/><path d="M240 238 a25 25 0 1 0 28 38 a20 20 0 1 1 -28 -38z" fill="#FFF3C4"/>
<g pointer-events="none">${[[176, 222, 0], [222, 202, 1], [150, 300, 2], [296, 318, 1], [196, 290, 0], [280, 214, 2]].map(([x, y, t]) => `<circle class="twinkle t${t}" cx="${x}" cy="${y}" r="${1.5 + t * 0.4}" fill="#fff"/>`).join('')}</g>
<path d="M0 452 Q14 392 46 402 Q62 352 100 372 Q124 338 158 364 Q184 340 212 362 Q240 332 272 358 Q302 340 330 366 Q362 344 400 372 V700 H0Z" fill="#5B4FA0"/>
<path d="M0 492 Q30 440 66 452 Q96 420 132 446 Q166 424 204 446 Q240 420 276 444 Q314 424 346 450 Q378 432 400 446 V700 H0Z" fill="#48418C"/>
<path d="M0 520 Q110 486 210 500 T400 494 V700 H0Z" fill="#3D8A7C"/>
<path d="M352 220 Q346 330 352 430 Q356 500 334 542 Q352 536 368 546 Q386 536 404 544 V220Z" fill="#71525C"/>
<path d="M350 236 Q344 330 350 430 Q353 494 340 530" stroke="#957179" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>
<path d="M372 280 Q366 340 372 400 M388 430 Q382 480 390 520" stroke="#5E434D" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
<g fill="#2F6B66"><circle cx="362" cy="178" r="64"/><circle cx="300" cy="162" r="44"/><circle cx="412" cy="244" r="54"/><circle cx="320" cy="222" r="34"/></g>
<g fill="#3E8A7C"><circle cx="342" cy="150" r="28"/><circle cx="300" cy="150" r="18"/><circle cx="318" cy="214" r="14"/></g>
<path d="M0 566 Q200 528 400 562 V700 H0Z" fill="#48A283"/>
<path d="M-10 240 H74 Q66 340 76 440 Q84 540 104 588 Q114 606 140 616 Q110 612 92 606 Q82 618 60 614 Q40 606 22 618 Q6 612 -10 614Z" fill="#7D5A63"/>
<path d="M70 252 Q62 340 72 440 Q80 530 98 582" stroke="#A07E86" stroke-width="4" fill="none" opacity=".6" stroke-linecap="round"/>
<path d="M18 262 Q12 300 20 330 M52 270 Q46 300 50 318 M8 432 Q4 470 12 500 M86 470 Q90 520 98 556 M24 520 Q18 560 26 598" stroke="#684753" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M-10 604 Q16 590 40 606 Q20 614 -10 614Z M108 604 Q124 600 140 616 Q120 614 104 608Z" fill="#6CC487"/>
<g fill="#2F6B66"><circle cx="8" cy="188" r="72"/><circle cx="82" cy="166" r="56"/><circle cx="130" cy="212" r="40"/><circle cx="-20" cy="262" r="46"/><circle cx="54" cy="240" r="44"/></g>
<g fill="#3E8A7C"><circle cx="30" cy="160" r="34"/><circle cx="98" cy="148" r="26"/><circle cx="132" cy="200" r="18"/><circle cx="70" cy="226" r="16"/></g>
<g pointer-events="none"><path d="M62 270 Q52 300 60 326 Q68 352 54 378 M20 290 Q12 318 22 342" stroke="#3F8F5E" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${[[62, 280, 30, '#4FA36F'], [54, 296, -30, '#6CC487'], [58, 314, 40, '#4FA36F'], [64, 334, -20, '#6CC487'], [62, 352, 30, '#4FA36F'], [56, 370, -40, '#6CC487'], [18, 298, -30, '#6CC487'], [16, 316, 30, '#4FA36F'], [20, 334, -20, '#6CC487']]
    .map(([x, y, r, c]) => `<ellipse cx="${x + (r > 0 ? 5 : -5)}" cy="${y}" rx="6" ry="3.4" transform="rotate(${r} ${x} ${y})" fill="${c}"/>`).join('')}
  ${[[60, 306], [58, 344], [22, 326]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FFF3A0" opacity=".35"/><circle cx="${x}" cy="${y}" r="2.2" fill="#FFF8C8"/>`).join('')}</g>
<path class="zf2-beam amb" d="M232 246 L262 254 L250 700 L138 700Z" fill="url(#${u}b)" opacity=".7" pointer-events="none"/>
<path d="M0 630 Q200 606 400 634 V700 H0Z" fill="#56B88B"/>
<ellipse cx="204" cy="664" rx="130" ry="26" fill="#86DDA9" opacity=".35"/>
${Array.from({ length: 12 }, (_, i) => { const t = (i / 12) * Math.PI * 2; return mini(204 + Math.cos(t) * 96, 668 + Math.sin(t) * 16, ['#FF9EC9', '#B9A2FF', '#7FE0FF'][i % 3]); }).join('')}
<g pointer-events="none"><path d="M14 690 q-2 -14 -8 -20 M20 690 q0 -16 4 -24 M26 690 q3 -12 10 -16 M70 694 q-2 -10 -8 -14 M76 694 q2 -12 8 -16 M118 698 q-1 -9 -6 -12 M290 698 q1 -9 6 -12" stroke="#3F9C72" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${[[44, 664], [96, 650], [120, 690], [284, 686], [56, 690]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#FFF3A0" opacity=".3"/><circle cx="${x}" cy="${y}" r="2" fill="#FFF8C8"/>`).join('')}</g>
<g data-tap="fairyOwl"><g transform="translate(0 46)"><rect x="8" y="326" width="76" height="94" fill="transparent"/>
  <ellipse cx="44" cy="374" rx="27" ry="33" fill="#3A2532"/><ellipse cx="44" cy="374" rx="27" ry="33" fill="none" stroke="#5E414D" stroke-width="5"/>
  <g class="zf2-owl"><ellipse cx="44" cy="392" rx="19" ry="20" fill="#B9845A"/><ellipse cx="44" cy="398" rx="11" ry="12" fill="#F2D9B8"/>
    <path d="M38.5 391 l2.5 2.5 2.5 -2.5 M45.5 391 l2.5 2.5 2.5 -2.5 M42 398 l2.5 2.5 2.5 -2.5" stroke="#CFA071" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M26 386 Q20 398 28 410 Q33 398 31 384Z M62 386 Q68 398 60 410 Q55 398 57 384Z" fill="#9C6B46"/>
    <path d="M27 358 L24 340 L37 350Z M61 358 L64 340 L51 350Z" fill="#9C6B46"/><ellipse cx="44" cy="362" rx="20" ry="17" fill="#B9845A"/>
    <g class="zf2-face"><circle cx="36.5" cy="362" r="8.5" fill="#F7E7D0"/><circle cx="51.5" cy="362" r="8.5" fill="#F7E7D0"/>
      <circle cx="36.5" cy="362" r="5.6" fill="#FFC93C"/><circle cx="51.5" cy="362" r="5.6" fill="#FFC93C"/><circle cx="36.5" cy="362" r="3.3" fill="#2A1B2E"/><circle cx="51.5" cy="362" r="3.3" fill="#2A1B2E"/>
      <circle cx="37.9" cy="360.5" r="1.3" fill="#fff"/><circle cx="52.9" cy="360.5" r="1.3" fill="#fff"/>
      <ellipse class="zf2-lid amb" cx="36.5" cy="362" rx="6.4" ry="6.4" fill="#E2C49C"/><ellipse class="zf2-lid zf2-lidr amb" cx="51.5" cy="362" rx="6.4" ry="6.4" fill="#E2C49C"/>
      <path d="M41.5 367 L46.5 367 L44 372Z" fill="#F28C28"/></g></g>
  <path d="M15 400 Q44 418 73 400 L74 416 Q44 430 14 416Z" fill="#7D5A63"/><path d="M18 404 Q44 420 70 404" stroke="#A07E86" stroke-width="2" fill="none" opacity=".6"/>
  <path d="M38 404 v5 M41.5 405 v5 M46.5 405 v5 M50 404 v5" stroke="#F28C28" stroke-width="2.2" stroke-linecap="round"/></g></g>
<g data-tap="fairyDoor"><rect x="12" y="488" width="92" height="112" fill="transparent"/>
  <circle class="zf2-win amb" cx="52" cy="506" r="15" fill="#FFE58A" opacity=".3"/><circle cx="52" cy="506" r="8.5" fill="#FFE58A" stroke="#C9A36B" stroke-width="3"/><path d="M52 498 V514 M44 506 H60" stroke="#C9A36B" stroke-width="2"/>
  <path d="M27 589 V548 A25 25 0 0 1 77 548 V589Z" fill="#C9A36B"/><path d="M30 589 V548 A22 22 0 0 1 74 548" stroke="#E2C48C" stroke-width="2" fill="none" opacity=".7"/>
  <circle cx="52" cy="566" r="30" fill="url(#${u}d)"/><path d="M32 589 V548 A20 20 0 0 1 72 548 V589Z" fill="#FFE9A6"/>
  <g class="zf2-door"><path d="M32 589 V548 A20 20 0 0 1 72 548 V589Z" fill="#F0607E"/><path d="M45 531 V589 M59 531 V589" stroke="#D44A69" stroke-width="2"/>
    <path d="M37 547 A15 15 0 0 1 67 547" stroke="#FF9FB4" stroke-width="2" fill="none" opacity=".8"/><circle cx="65" cy="564" r="2.8" fill="#FFD23F"/></g>
  <rect x="25" y="587" width="54" height="7" rx="3.5" fill="#D6CFE8"/><rect x="31" y="593" width="42" height="6" rx="3" fill="#BDB4D6"/>
  <g transform="translate(92 600)"><circle class="zf2-win amb" cy="-9" r="14" fill="#FFE58A" opacity=".3"/><rect x="-5" y="-16" width="10" height="13" rx="2" fill="#FFE9A6" stroke="#5E414D" stroke-width="2"/>
    <path d="M-6.5 -17 h13 l-3 -4 h-7z" fill="#5E414D"/><rect x="-6" y="-4" width="12" height="3.5" rx="1.5" fill="#5E414D"/></g>
  ${mini(18, 600, '#FF6B6B')}</g>
<g data-tap="fairyBells"><rect x="292" y="478" width="106" height="80" fill="transparent"/>
  <g fill="#4FA36F"><path d="M308 556 Q302 530 296 516 Q312 532 318 556Z"/><path d="M330 557 Q330 526 322 508 Q340 528 338 557Z"/><path d="M372 557 Q378 530 392 514 Q384 536 382 557Z"/></g>
  ${stem(314, 556, 320, 498, 1, [[4, 4, 8, '#8C8CF5'], [14, 3, 0, '#A49BFF'], [24, 13, -24, '#8C8CF5']])}
  ${stem(338, 557, 342, 484, 1, [[3, 5, 10, '#A49BFF'], [13, 3, 0, '#8C8CF5'], [23, 13, -24, '#A49BFF']])}
  ${stem(358, 557, 360, 506, 1, [[4, 4, 8, '#8C8CF5'], [14, 3, 0, '#7E86F0'], [23, 13, -22, '#A49BFF']])}
  ${stem(330, 557, 318, 522, -1, [[4, 4, 8, '#A49BFF'], [13, 4, 0, '#8C8CF5']])}</g>
<g data-tap="fairyShroom"><rect x="294" y="590" width="106" height="100" fill="transparent"/>
  ${shroom(u, 1, 316, 664, 17, CAPS[1])}${shroom(u, 0, 352, 644, 34, CAPS[0])}${shroom(u, 2, 386, 670, 11, CAPS[2])}</g>
<g data-tap="fairyFlies"><rect x="290" y="360" width="110" height="116" fill="transparent"/>
  ${FLIES.map(([x, y], i) => `<g class="zf2-ff" style="--hx:${(HEART[i][0] - x).toFixed(1)}px;--hy:${(HEART[i][1] - y).toFixed(1)}px">${firefly(u, x, y, i)}</g>`).join('')}</g>
<g class="zf2-swarm" pointer-events="none">${[[150, 334], [204, 304], [248, 352], [176, 392], [230, 404], [118, 470], [24, 452], [134, 566], [272, 574], [110, 420], [144, 258], [268, 300], [92, 300], [200, 470], [12, 560]]
    .map(([x, y], i) => firefly(u, x, y, i + 5, 6.5)).join('')}</g>
</svg>`,

  css: `
.zf2-ffd.amb { animation: zf2Drift 7s ease-in-out var(--d, 0s) infinite; }
@keyframes zf2Drift { 25% { transform: translate(5px, -7px); } 50% { transform: translate(-3px, -12px); } 75% { transform: translate(-7px, -3px); } }
.zf2-ffb { transform-box: fill-box; transform-origin: center; }
.zf2-ffb.amb { animation: zf2Blink 2.8s ease-in-out var(--d, 0s) infinite; }
@keyframes zf2Blink { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }
.zf2-ff { transition: transform 1.1s ease-in-out; }
[data-tap="fairyFlies"].zf2-heart .zf2-ff { transform: translate(var(--hx), var(--hy)); }
[data-tap="fairyFlies"].zf2-heart .zf2-ffd { animation: none; }
[data-tap="fairyFlies"].zf2-heart .zf2-ffb { animation: none; opacity: 1; }
[data-tap="fairyFlies"].zf2-sync .zf2-ffb { animation: zf2Sync .8s ease-in-out 4; }
@keyframes zf2Sync { 0%, 100% { opacity: .2; } 50% { opacity: 1; transform: scale(1.35); } }
.zf2-flash .zf2-ffb { animation: zf2Flash .45s ease-in-out 3; }
@keyframes zf2Flash { 50% { opacity: 1; transform: scale(1.8); } }
.zf2-gone { visibility: hidden; }
.zf2-m { transform-box: fill-box; transform-origin: 50% 100%; }
.zf2-tint { transition: fill .6s; }
.zf2-stop { transition: stop-color .6s; }
.zf2-halo { transform-box: fill-box; transform-origin: center; }
.zf2-halo.amb { animation: zf2Pulse 3.4s ease-in-out infinite; }
@keyframes zf2Pulse { 50% { transform: scale(1.12); opacity: .7; } }
[data-tap="fairyShroom"].zf2-squash .zf2-m0 { animation: zf2Squash .75s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes zf2Squash { 25% { transform: scale(1.18, .72); } 60% { transform: scale(.94, 1.12); } }
[data-tap="fairyShroom"].zf2-song .zf2-m { animation: zf2Jump .45s ease-in-out; }
[data-tap="fairyShroom"].zf2-song .zf2-m0 { animation-delay: .3s; }
[data-tap="fairyShroom"].zf2-song .zf2-m2 { animation-delay: .6s; }
@keyframes zf2Jump { 40% { transform: translateY(-10px) scale(.95, 1.08); } 70% { transform: scale(1.08, .92); } }
.zf2-door { transform-box: fill-box; transform-origin: 0 50%; transition: transform .5s ease-in-out; }
[data-tap="fairyDoor"].zf2-open .zf2-door { transform: scaleX(.12); }
.zf2-win.amb { animation: zf2Flicker 3.6s ease-in-out infinite; }
@keyframes zf2Flicker { 0%, 100% { opacity: .25; } 40% { opacity: .5; } 55% { opacity: .3; } 70% { opacity: .55; } }
.zf2-owl { transform-box: fill-box; transform-origin: 50% 100%; }
[data-tap="fairyOwl"].zf2-hoot .zf2-owl { animation: zf2Hoot .45s ease-in-out 4 alternate; }
@keyframes zf2Hoot { to { transform: scale(1.07, .95); } }
.zf2-face { transform-box: fill-box; transform-origin: center; }
[data-tap="fairyOwl"].zf2-turn .zf2-face { animation: zf2Turn 2.4s ease-in-out; }
@keyframes zf2Turn { 18% { transform: translateX(-9px) scaleX(.35); opacity: 1; } 26%, 64% { transform: translateX(-11px) scaleX(.1); opacity: 0; } 74% { transform: translateX(-9px) scaleX(.35); opacity: 1; } 92% { transform: none; } }
.zf2-lid { transform-box: fill-box; transform-origin: 50% 0; transform: scaleY(0); }
.zf2-lid.amb { animation: zf2Lid 5.5s ease-in-out infinite; }
@keyframes zf2Lid { 0%, 90%, 100% { transform: scaleY(0); } 94% { transform: scaleY(1); } }
[data-tap="fairyOwl"].zf2-wink .zf2-lidr { animation: zf2Wink 1.2s ease-in-out; }
@keyframes zf2Wink { 15%, 70% { transform: scaleY(1); } }
.zf2-bell { transform-box: fill-box; transform-origin: 50% 0; }
[data-tap="fairyBells"].zf2-ring .zf2-bell { animation: zf2Ring .3s ease-in-out 8 alternate; }
[data-tap="fairyBells"].zf2-ringfast .zf2-bell { animation: zf2Ring .14s ease-in-out 12 alternate; }
@keyframes zf2Ring { from { transform: rotate(-18deg); } to { transform: rotate(18deg); } }
.zf2-stem { transform-box: fill-box; transform-origin: 50% 100%; }
.zf2-stem.amb { animation: zf2Sway 4.5s ease-in-out infinite; }
.zf2-stem.amb:nth-child(odd) { animation-delay: -2s; }
@keyframes zf2Sway { 50% { transform: rotate(3deg); } }
.zf2-beam.amb, .zf2-moonglow.amb { animation: zf2Beam 6s ease-in-out infinite; }
@keyframes zf2Beam { 50% { opacity: .45; } }
.fly-fx.zf2-bug { color: #FFF7A8; text-shadow: 0 0 6px #FFF06A, 0 0 14px #DFFF6A; }
.fly-fx.zf2-fairy { filter: drop-shadow(0 0 6px #FFF3B0); }
.zf2-wings { transform-box: view-box; transform-origin: 100px 140px; animation: zf2Flap .2s ease-in-out infinite alternate; }
@keyframes zf2Flap { to { transform: scaleX(.82); } }
`,

  props: () => ({
    // a jar with a firefly glowing inside
    fairyJar: { slot: 'hand', art: () => `<g transform="translate(160 146)"><circle r="22" fill="#FFF59D" opacity=".35"/>
      <rect x="-13" y="-14" width="26" height="31" rx="7" fill="#DDF4FF" fill-opacity=".45" stroke="#fff" stroke-width="2.5"/><rect x="-11" y="-20" width="22" height="7" rx="2" fill="#B98A5E"/>
      <circle cy="3" r="8" fill="#FFF59D" opacity=".65"/><circle cy="3" r="3.2" fill="#FFFDE6"/><path d="M-8 -7 v16" stroke="#fff" stroke-width="2.4" opacity=".6" stroke-linecap="round"/></g>` },
    // a firefly sitting on his nose
    fairyNoseFly: { slot: 'nose', art: () => `<circle cx="100" cy="100" r="17" fill="#FFF59D" opacity=".35"/><circle cx="100" cy="100" r="7.5" fill="#FFF59D" opacity=".75"/>
      <circle cx="100" cy="100" r="3.4" fill="#FFFDE6"/><ellipse cx="94.5" cy="94" rx="4.5" ry="2.4" fill="#fff" opacity=".75" transform="rotate(-30 94.5 94)"/><ellipse cx="105.5" cy="94" rx="4.5" ry="2.4" fill="#fff" opacity=".75" transform="rotate(30 105.5 94)"/>` },
    // the fairy's wings, behind him
    fairyWings: { slot: 'cape', back: true, art: () => `<g class="zf2-wings amb" stroke="#fff" stroke-width="2.4" stroke-linejoin="round">
      <path d="M100 128 Q62 30 12 18 Q-2 50 22 100 Q50 140 100 142Z" fill="#C9E8FF" fill-opacity=".88"/><path d="M100 128 Q138 30 188 18 Q202 50 178 100 Q150 140 100 142Z" fill="#C9E8FF" fill-opacity=".88"/>
      <path d="M100 146 Q44 146 14 186 Q44 210 100 154Z" fill="#F2C9FF" fill-opacity=".88"/><path d="M100 146 Q156 146 186 186 Q156 210 100 154Z" fill="#F2C9FF" fill-opacity=".88"/>
      <path d="M86 118 Q52 62 24 32 M114 118 Q148 62 176 32 M84 152 Q50 160 28 182 M116 152 Q150 160 172 182" stroke="#A9D4F5" stroke-width="1.8" fill="none"/>
      <g fill="#fff" stroke="none"><circle cx="30" cy="44" r="3.2"/><circle cx="170" cy="44" r="3.2"/><circle cx="44" cy="70" r="2"/><circle cx="156" cy="70" r="2"/><circle cx="34" cy="184" r="2.4"/><circle cx="166" cy="184" r="2.4"/></g></g>` },
    // the owl's graduation cap
    fairyCap: { slot: 'head', art: () => `<path d="M76 32 V46 Q100 54 124 46 V32Z" fill="#2E2440"/><path d="M46 28 L100 10 L154 28 L100 46Z" fill="#3A2E52"/>
      <path d="M58 28 L100 14 L142 28" stroke="#5A4C78" stroke-width="2" fill="none"/><path d="M100 28 L146 34 V56" stroke="#FFD23F" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="28" r="3.4" fill="#FFD23F"/><path d="M142 56 h8 l-1 9 h-6z" fill="#FFD23F"/>` },
    // an upside-down bluebell as a hat
    fairyBellHat: { slot: 'head', art: () => `<g transform="translate(100 44) scale(1.3) translate(-100 -44)"><path d="M100 4 q3 -10 13 -10" stroke="#3E8F5E" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M84 8 Q80 26 70 42 Q76 39 80 46 Q86 39 92 46 Q100 39 108 46 Q114 39 120 46 Q124 39 130 42 Q120 26 116 8 Q100 0 84 8Z" fill="#8C8CF5"/>
      <path d="M88 13 Q84 25 78 37" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="7" rx="11" ry="4.5" fill="#5FB878"/></g>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, pickWay, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, nose, paw, pick } = k;
    const part = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    const bug = (from, to, ms, o = {}) => fly('●', from, to, ms, { size: 12, cls: 'zf2-bug', ...o });

    // ---- the glowing mushrooms: trampolines that change colour ----
    let hue = 0;
    const paint = (c, n, col) => {
      c.el.querySelectorAll(`.zf2-m${n} .zf2-tint`).forEach((p) => p.setAttribute('fill', col));
      c.el.querySelectorAll(`.zf2-m${n} .zf2-stop`).forEach((p) => p.setAttribute('stop-color', pale(col)));
    };
    const recolour = (c, all = false) => {
      (all ? [0, 1, 2] : [0]).forEach((n, i) => paint(c, n, CAPS[(hue + i + 1) % CAPS.length]));
      hue = (hue + 1) % CAPS.length;
    };
    const cap = (c) => part(c, '.zf2-m0 path.zf2-tint');
    const squash = (c, all) => { api.hop(c.el, 'zf2-squash', 800); sfx.boing(); recolour(c, all); api.fxAt(...cap(c), ['✨', '💫'], 5, 'spark'); };
    // one big bounce off the mushroom
    const bounce = (c) => {
      const a = begin('fairyBounce');
      go(nextTo(c.el, 24), 700);
      at(a, 750, () => { squash(c); pose('laugh', 1800, 'bigjump', 1100); });
      at(a, 1500, () => { line('fairyBounce', 1, 0); api.reward(); });
      at(a, 2400, end);
    };
    // he sniffs it, the spores fly up his nose: a sneeze, and he glows
    const spores = (c) => {
      const a = begin('fairySpores');
      go(nextTo(c.el, 24), 700);
      at(a, 750, () => { pose('ok', 1000, 'sniff', 1000); sfx.sniff(); });
      at(a, 1100, () => { sfx.puff(); recolour(c); for (let i = 0; i < 4; i++) at(a, i * 120, () => fly('✨', cap(c), nose(), 650, { arc: 30, size: 14 })); });
      at(a, 1800, () => api.setTemp('sleep', 450));
      at(a, 2250, () => { sfx.sneeze(); pose('laugh', 1400, 'sneeze'); api.fxAt(...nose(), ['✨', '💫'], 6, 'spark'); });
      at(a, 2900, () => { hold(a, 'glow', 2600); sfx.magic(); api.setTemp('happy', 2400); line('fairySpores', 1, 0); api.reward(); });
      at(a, 5600, end);
    };
    R.fairyShroom = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('fairyShroom', bounce, spores)),
      // the mushrooms sing a scale, one after another, and change colour
      double: (c) => {
        api.hop(c.el, 'zf2-song', 1800);
        [1, 0, 2].forEach((n, i) => setTimeout(() => {
          sfx.note([523, 659, 784][i]);
          paint(c, n, CAPS[(hue + n + 2) % CAPS.length]);
        }, i * 300));
        setTimeout(() => { sfx.note(1047); api.fxAt(...cap(c), ['🎵', '✨'], 4, 'spark'); hue = (hue + 1) % CAPS.length; }, 900);
        if (api.free()) { pose('laugh', 2200, 'dance', 2200); line('fairyShroomSong', 1); }
      },
      // the trampoline show: higher and higher, then a backflip
      long: who((c) => {
        const a = begin('fairyTrampoline');
        go(nextTo(c.el, 24), 700);
        at(a, 750, () => { squash(c); pose('laugh', 1000, 'bounce', 800); });
        at(a, 1600, () => { squash(c); pose('laugh', 1200, 'bigjump', 1100); line('fairyTrampoline', 1, 0); });
        at(a, 2800, () => { squash(c, true); pose('laugh', 1200, 'backflip', 1000); });
        at(a, 3900, () => { pose('happy', 1600, 'proud', 1200); api.fxAt(...head(), ['⭐', '✨'], 6, 'spark'); sfx.chime(); api.reward(); });
        at(a, 5100, end);
      }),
    };

    // ---- the fireflies ----
    const flies = (c) => [...c.el.querySelectorAll('.zf2-ff')];
    // one of the swarm hides for the scene (it is in Lucky's paws or on his nose)
    const borrow = (a, c) => {
      const f = pick(flies(c)), from = centerOf(f);
      f.classList.add('zf2-gone');
      onEnd(a, () => f.classList.remove('zf2-gone'));
      return [f, from];
    };
    // he catches one in a jar, has a look, and lets it go
    const jar = (c) => {
      const a = begin('fairyJar'), [f, from] = borrow(a, c);
      pose('ok', 900, 'stretchUp', 1600);
      sfx.whoosh();
      bug(from, paw(), 900, { arc: 40 });
      at(a, 900, () => {
        prop('fairyJar', 6000);
        sfx.pop();
        pose('happy', 2400, 'proud', 1200);
        const ms = line('fairyJar', 1, 0) || 2600;
        at(a, Math.min(ms, 3400) + 300, () => {
          unprop('hand', true);
          bug(paw(), from, 1100, { arc: 50 });
          sfx.sparkle();
          pose('happy', 1800, 'wave', 1200);
          line('fairyJarFree', 1, 0);
          api.reward();
          at(a, 1100, () => f.classList.remove('zf2-gone'));
          at(a, 1500, end);
        });
      });
    };
    // one lands on his nose: a little nightlight
    const noseFly = (c) => {
      const a = begin('fairyNose'), [f, from] = borrow(a, c);
      bug(from, nose(), 1200, { arc: 60 });
      at(a, 300, () => pose('surprised', 1200, 'tilt', 1400));
      at(a, 1200, () => { prop('fairyNoseFly', 3000); sfx.sparkle(); pose('laugh', 2800, 'shimmy', 800); line('fairyNoseFly', 1, 0); });
      at(a, 4200, () => { unprop('nose', true); bug(nose(), from, 1000, { arc: 50 }); });
      at(a, 5200, () => f.classList.remove('zf2-gone'));
      at(a, 5300, end);
    };
    R.fairyFlies = {
      press: (c) => { sfx.note(pick([1319, 1568, 1760])); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('fairyFlies', jar, noseFly)),
      // they make a heart in the air
      double: (c) => {
        c.el.classList.add('zf2-heart');
        clearTimeout(c.el._zf2Heart);
        c.el._zf2Heart = setTimeout(() => c.el.classList.remove('zf2-heart'), 3400);
        sfx.magic();
        setTimeout(() => { api.hearts(...centerOf(c.el.querySelector('rect') || c.el), 5); sfx.happy(); }, 1200);
        setTimeout(() => { if (!api.free()) return; pose('hearts', 2400, 'clap'); line('fairyHeart', 1); api.reward(); }, 1100);
      },
      // they blink all together, and Lucky blinks with them
      long: who((c) => {
        const a = begin('fairySync');
        api.hop(c.el, 'zf2-sync', 3400);
        pose('happy', 3400, 'listen', 3000);
        [400, 1200, 2000, 2800].forEach((d, i) => at(a, d, () => { sfx.note([1319, 1568, 1319, 1568][i]); api.setTemp('sleep', 300); }));
        at(a, 300, () => line('fairySync', 1, 0));
        at(a, 3400, () => { api.fxAt(...centerOf(c.el), ['✨'], 8, 'spark'); sfx.chime(); pose('laugh', 1400, 'binky'); api.reward(); });
        at(a, 4500, end);
      }),
    };

    // ---- the fairy door ----
    const door = (c) => part(c, '.zf2-door');
    const open = (a, c) => { c.el.classList.add('zf2-open'); onEnd(a, () => c.el.classList.remove('zf2-open')); };
    // the fairy asks a riddle; Lucky thinks, then answers
    const riddle = (c) => {
      const a = begin('fairyRiddle'), i = pickWay('fairyRiddle', RIDDLES.length), [x, y] = door(c), [hx, hy] = head();
      const fp = [Math.max(x + 40, hx - 70), Math.max(40, hy - 30)];
      let fairy = null;
      open(a, c);
      sfx.magic();
      api.fxAt(x, y, ['✨'], 5, 'spark');
      at(a, 400, () => { fairy = fly('🧚', [x, y], fp, 800, { arc: 30, size: 34, stay: 20000, cls: 'zf2-fairy' }); });
      onEnd(a, () => fairy?.remove());
      at(a, 1200, () => {
        pose('surprised', 1200, 'listen', 1600);
        const ms = Math.min(line([RIDDLES[i][0]], 1, 0) || 4000, 5200);
        at(a, ms - 1400, () => { hold(a, 'think', 1700); api.setTemp('ok', 1700); popUp('🤔', ...api.luckyPoint(0.82, 0.02), 1600, 30); });
        at(a, ms + 400, () => {
          line([RIDDLES[i][1]], 1, 0);
          pose('laugh', 1600, 'binky');
          sfx.chime();
          api.fxAt(...fp, ['✨', '🌟'], 8, 'spark');
          api.reward();
          at(a, 1500, () => { fairy?.remove(); fly('🧚', fp, [x, y], 800, { arc: 30, size: 34, cls: 'zf2-fairy' }); });
          at(a, 2300, end);
        });
      });
    };
    // fairy dust: he shrinks to the size of an acorn, then grows back
    const dust = (c) => {
      const a = begin('fairyDust'), [x, y] = door(c), [hx, hy] = head(), fp = [hx + 30, Math.max(30, hy - 60)];
      open(a, c);
      sfx.magic();
      at(a, 300, () => fly('🧚', [x, y], fp, 800, { arc: 40, size: 32, stay: 1300, cls: 'zf2-fairy' }));
      at(a, 1100, () => { api.fxAt(hx, hy - 30, ['✨'], 10, 'drop'); sfx.sparkle(); });
      at(a, 1600, () => { hold(a, 'tiny'); sfx.shrink(); api.setTemp('surprised', 2200); line('fairyDust', 1, 0); });
      at(a, 2400, () => fly('🧚', fp, [x, y], 900, { arc: 40, size: 32, cls: 'zf2-fairy' }));
      at(a, 3300, () => c.el.classList.remove('zf2-open'));
      at(a, 4800, () => { L.classList.remove('tiny'); a.cls.delete('tiny'); sfx.grow(); pose('laugh', 1500, 'hop'); api.fxAt(...head(), ['✨'], 5, 'spark'); line('fairyBig', 1, 0); });
      at(a, 5600, end);
    };
    R.fairyDoor = {
      press: (c) => { sfx.knock(); api.fxAt(c.x, c.y, ['✨'], 2, 'spark'); },
      tap: who(oneOf('fairyDoor', riddle, dust)),
      // the fairy waves from her window and blows a kiss
      double: (c) => {
        const [x, y] = part(c, '.zf2-win');
        popUp('🧚', x, y - 4, 2400, 28, 'pop-rise');
        sfx.chime();
        setTimeout(() => { api.hearts(x, y - 24, 3); sfx.kiss(); }, 900);
        setTimeout(() => { if (!api.free()) return; pose('happy', 1600, 'wave', 1200); line('fairyWave', 1); }, 600);
      },
      // she lends him her wings: he flies
      long: who((c) => {
        const a = begin('fairyWings'), [x, y] = door(c);
        open(a, c);
        sfx.magic();
        at(a, 300, () => fly('🧚', [x, y], head(), 700, { arc: 50, size: 30, cls: 'zf2-fairy' }));
        at(a, 1000, () => { api.fxAt(...head(), ['✨', '🌟'], 10, 'drop'); sfx.sparkle(); prop('fairyWings', 5000); });
        at(a, 1400, () => { hold(a, 'levitate', 4200); api.setTemp('laugh', 4000); line('fairyWings', 1, 0); api.reward(); });
        at(a, 2600, () => c.el.classList.remove('zf2-open'));
        at(a, 5700, end);
      }),
    };

    // ---- the wise owl ----
    const owlHead = (c) => part(c, '.zf2-face');
    // it hoots, and Lucky hoots back
    const hoot = (c) => {
      const a = begin('fairyHoot');
      api.hop(c.el, 'zf2-hoot', 1900);
      hootSfx(sfx);
      pose('happy', 1400, 'listen', 1400);
      at(a, 1300, () => {
        hootSfx(sfx, 110);
        api.fxAt(...api.luckyPoint(0.5, 0.5), ['🎵'], 2, 'spark');
        pose('laugh', 1500, 'hop');
        line('fairyHoot', 1, 0);
      });
      at(a, 2600, end);
    };
    // it turns its head almost all the way round; Lucky tries too
    const turn = (c) => {
      const a = begin('fairyOwlTurn');
      api.hop(c.el, 'zf2-turn', 2600);
      sfx.whirr();
      at(a, 700, () => pose('surprised', 1300, 'look', 1500));
      at(a, 2200, () => { prop('dizzy', 2400); api.setTemp('dizzy', 2200); line('fairyOwlTurn', 1, 0); });
      at(a, 3200, end);
    };
    R.fairyOwl = {
      press: () => sfx.note(330),
      tap: who(oneOf('fairyOwl', hoot, turn)),
      double: (c) => {
        api.hop(c.el, 'zf2-wink', 1300);
        sfx.pop();
        setTimeout(() => { if (!api.free()) return; pose('wink', 1600, 'tilt', 1400); line('fairyWink', 1); }, 500);
      },
      // the owl makes him a professor: a cap and glasses
      long: who((c) => {
        const a = begin('fairyProfessor');
        api.hop(c.el, 'zf2-hoot', 1900);
        hootSfx(sfx);
        at(a, 700, () => { fly('🎓', owlHead(c), head(), 800, { arc: 60, size: 34, spin: 360 }); sfx.whoosh(); });
        at(a, 1500, () => { prop('fairyCap', 9000); prop('specs', 9000); sfx.chime(); pose('happy', 1800, 'proud', 1200); line('fairyProfessor', 1, 0); api.reward(); });
        at(a, 3000, end);
      }),
    };

    // ---- the bluebells ----
    // they ring, and Lucky listens (the fairies might be coming)
    const listen = (c) => {
      const a = begin('fairyBells');
      api.hop(c.el, 'zf2-ring', 2600);
      tune(sfx, [1568, 1319, 1175, 1047, 1175, 1319], 300);
      api.fxAt(c.x, c.y - 20, ['✨'], 4, 'spark');
      pose('happy', 2400, 'listen', 2200);
      line('fairyBells', 1, 0);
      at(a, 2400, end);
    };
    // they play a dance tune, and he dances
    const dance = (c) => {
      const a = begin('fairyBellDance');
      api.hop(c.el, 'zf2-ring', 2600);
      tune(sfx, [784, 988, 1175, 988, 784, 988, 1175, 1568], 240);
      pose('laugh', 2400, 'dance', 2400);
      at(a, 300, () => api.fxAt(...head(), ['🎵', '🎶'], 4, 'spark'));
      line('fairyBellDance', 1, 0);
      at(a, 2400, end);
    };
    R.fairyBells = {
      press: () => sfx.note(1568),
      tap: who(oneOf('fairyBells', listen, dance)),
      // a quick jingle wakes every firefly in the forest
      double: (c) => {
        api.hop(c.el, 'zf2-ringfast', 1800);
        tune(sfx, [1047, 1319, 1568, 2093], 120);
        api.fxAt(c.x, c.y - 20, ['✨'], 6, 'spark');
        const svg = c.el.ownerSVGElement;
        setTimeout(() => svg?.querySelectorAll('[data-tap="fairyFlies"], .zf2-swarm').forEach((g) => api.hop(g, 'zf2-flash', 1500)), 400);
        setTimeout(() => { if (!api.free()) return; pose('laugh', 1500, 'binky'); line('fairyBellWake', 1); }, 600);
      },
      // a bluebell for a hat
      long: who((c) => {
        const a = begin('fairyBellHat');
        go(nextTo(c.el, 22), 700);
        at(a, 750, () => { pose('ok', 700, 'sniff', 700); sfx.sniff(); api.hop(c.el, 'zf2-ring', 1200); });
        at(a, 1400, () => {
          prop('fairyBellHat', 12000);
          sfx.note(1568);
          setTimeout(() => sfx.note(1319), 300);
          api.fxAt(...head(), ['✨'], 5, 'spark');
          pose('happy', 1800, 'proud', 1200);
          line('fairyBellHat', 1, 0);
          api.reward();
        });
        at(a, 2800, end);
      }),
    };
  },

  visitors: [
    { e: '🧚', w: 2, path: 'flutter', end: ['fairyWand', 'wish'] },
    { e: '✨', w: 3, path: 'float', end: ['fairyGlow'] },
    { e: '🦉', w: 1, path: 'glide', end: ['owl'], flip: true },
  ],

  endings: (k) => ({
    // the fairy touches him with her wand: he sparkles and floats for a moment
    fairyWand: (a, x, y) => {
      const { api, sfx, at, hold, fly, pose, line, head, sceneRect } = k, [hx, hy] = head(), top = [hx + 40, Math.max(30, hy - 50)];
      fly('🧚', [x, y], top, 800, { arc: 40, size: 34, stay: 2300, cls: 'zf2-fairy' });
      at(a, 800, () => { api.fxAt(hx, hy - 30, ['✨', '🌟'], 10, 'drop'); sfx.magic(); });
      at(a, 1200, () => { hold(a, 'levitate', 4200); pose('happy', 3000); line('fairyWand', 1, 0); api.reward(); });
      at(a, 3100, () => fly('🧚', top, [sceneRect().width + 40, 30], 1100, { arc: 60, size: 34, cls: 'zf2-fairy' }));
    },
    // the sparkle was a swarm of fireflies: they settle on him, and he glows like a lantern
    fairyGlow: (a, x, y) => {
      const { api, sfx, at, hold, fly, pose, line, head, sceneRect } = k, [hx, hy] = head(), w = sceneRect().width;
      const pts = [[-56, 14], [44, -34], [64, 40], [-34, 62], [0, -56], [-60, -30]];
      pts.forEach(([dx, dy], i) => at(a, i * 150, () => fly('●', [x, y], [hx + dx, hy + dy], 900, { arc: 40, size: 12, stay: 2700 - i * 150, cls: 'zf2-bug' })));
      at(a, 1100, () => { hold(a, 'glow', 2500); pose('laugh', 2500, 'shimmy', 800); sfx.sparkle(); line('fairyGlow', 1, 0); api.reward(); });
      at(a, 3600, () => pts.forEach(([dx, dy], i) => fly('●', [hx + dx, hy + dy], [w + 30, 30 + i * 20], 1300, { arc: 40, size: 12, cls: 'zf2-bug' })));
    },
  }),
};
