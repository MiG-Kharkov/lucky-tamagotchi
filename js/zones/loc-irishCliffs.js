// The Irish hills' second place: the cliffs over the Atlantic. Green headlands with sheer stone faces and the waves
// below, puffins on the edge, a thatched white cottage with a turf fire smoking, a harp (Ireland's symbol, on its
// coins), an old stone circle on the far headland, and a rain cloud that keeps changing its mind (four seasons in a day).

// a puffin's low growl
const grunt = (sfx) => { sfx.note(196); setTimeout(() => sfx.note(165), 150); };
// a little air in D on the harp, a lullaby, and a run up all the strings
const AIR = [587, 659, 740, 880, 740, 659, 587, 494, 587];
const LULLABY = [440, 587, 554, 440, 370, 440, 294];
const GLISS = [392, 440, 494, 523, 587, 659, 740, 784, 880, 988, 1047];

// the puffin (no emoji for it): black back, white front, a striped orange beak; facing left, feet at 0 0
const PUFFIN = `<path d="M8 -12 l10 4 -3 -10z" fill="#1E1A22"/><ellipse cx="3" cy="-15" rx="11" ry="13.5" fill="#1E1A22"/>
  <path d="M-4 -4 v3 M4 -4 v3" stroke="#FF7A1A" stroke-width="2.4"/><path d="M-5 -1.5 l-5 2.5 h8z M3 -1.5 l-3 2.5 h8z" fill="#FF7A1A"/>
  <path d="M-6 -25 Q-12 -14 -7 -5 Q-1 1 6 -3 Q-1 -12 1 -25Z" fill="#fff"/><path d="M6 -22 q8 6 6 17 q-7 -4 -9 -12z" fill="#3A3542"/>
  <circle cx="-3" cy="-31" r="9" fill="#1E1A22"/><ellipse cx="-5.5" cy="-30" rx="6.6" ry="6.4" fill="#EEECF0"/>
  <path d="M-11 -23.5 Q-4 -19.5 3 -23.5" stroke="#1E1A22" stroke-width="3" fill="none"/>
  <path d="M-10.5 -35.5 Q-22 -34 -24 -27 Q-17 -24 -10.5 -25Z" fill="#FF6A2B"/><path d="M-10.5 -35.5 Q-13 -30 -10.5 -25 L-9 -25 Q-11.5 -30 -9 -35.5Z" fill="#5E6B7A"/>
  <path d="M-14.5 -34.6 Q-16.5 -30 -14.5 -25.3" stroke="#FFD23F" stroke-width="1.8" fill="none"/>
  <circle cx="-6.5" cy="-32" r="2.5" fill="none" stroke="#E8413A" stroke-width=".9"/><circle cx="-6.5" cy="-32" r="1.7" fill="#1E1A22"/><circle cx="-6" cy="-32.6" r=".6" fill="#fff"/>
  <path d="M-8 -35.2 l1.5 -2.4 1.5 2.4" stroke="#5E6B7A" stroke-width=".9" fill="none"/>`;
const puffinSvg = (w = '1.3em') => `<svg viewBox="-26 -42 46 46" style="width:${w};height:auto;display:block;overflow:visible">${PUFFIN}</svg>`;
// a drawn puffin for fly(): it faces where it flies (or left, towards Lucky, when it lands beside him)
const puffinFly = (fly, from, to, ms, opts, faceLeft = false) => {
  const s = fly('', from, to, ms, opts);
  s.innerHTML = puffinSvg();
  if (to[0] > from[0] && !faceLeft) s.firstChild.style.transform = 'scaleX(-1)';
  return s;
};

// a rough standing stone, its foot at x y (lean: how far its top leans; cut: a slanted top)
const stone = (x, y, w, hgt, c, lean = 0, cut = 0) => {
  const pts = [[x - w / 2, y], [x - w / 2 + lean * 0.4 - 0.6, y - hgt * 0.82], [x - w * 0.12 + lean, y - hgt], [x + w / 2 + lean * 0.5, y - hgt * (0.78 - cut)], [x + w / 2 + 0.5, y]];
  const d = 'M' + pts.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(' L') + 'Z';
  return `<path class="lic-st" d="${d}" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M${(x - w / 2 + 1.6).toFixed(1)} ${y - 1} L${(x - w / 2 + lean * 0.4 + 1).toFixed(1)} ${(y - hgt * 0.8).toFixed(1)}" stroke="#fff" stroke-width="1.6" opacity=".4" stroke-linecap="round"/>
  <path d="M${(x + w / 2 - 1.4).toFixed(1)} ${y - 1} L${(x + w / 2 + lean * 0.5 - 1.2).toFixed(1)} ${(y - hgt * (0.74 - cut)).toFixed(1)}" stroke="#000" stroke-width="2" opacity=".1" stroke-linecap="round"/>`;
};
// the stone circle on the far headland (its middle at 96 cy), back stones first; a long low stone lies at the back,
// as in the old circles
const circleStones = (cy) => {
  const H = [18, 13, 22, 15, 20, 12, 24, 16, 17], W = [8, 10, 7, 9, 8, 11, 8, 9, 10], LEAN = [-1, 2, 0, -2, 1, 0, -1, 2, 1], CUT = [0, 0.2, 0, 0.25, 0, 0.15, 0, 0.3, 0];
  const list = Array.from({ length: 9 }, (_, i) => {
    const t = (i / 9) * Math.PI * 2 + 0.3, front = (Math.sin(t) + 1) / 2;
    return { x: 96 + Math.cos(t) * 50, y: cy + Math.sin(t) * 7, w: W[i] * (0.85 + front * 0.3), hgt: H[i] * (0.8 + front * 0.35), c: front > 0.5 ? '#B9B3AC' : '#A7A19B', lean: LEAN[i], cut: CUT[i] };
  }).sort((p, q) => p.y - q.y);
  const one = (o) => stone(o.x, o.y, o.w, o.hgt, o.c, o.lean, o.cut);
  const back = list.filter((o) => o.y <= cy), front = list.filter((o) => o.y > cy);
  return { back: `<path d="M86 ${cy - 6} Q87 ${cy - 13} 96 ${cy - 13} Q106 ${cy - 13} 108 ${cy - 6}Z" fill="#A7A19B" stroke="#A7A19B" stroke-width="2" stroke-linejoin="round"/>` + back.map(one).join(''),
    front: front.map((o) => `<ellipse cx="${(o.x + 2).toFixed(1)}" cy="${o.y.toFixed(1)}" rx="${(o.w * 0.7).toFixed(1)}" ry="1.6" fill="#000" opacity=".14"/>` + one(o)).join('') };
};
// the harp's strings: parallel, from the neck down to the soundbox
const harpStrings = () => {
  const q = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * t * (1 - t) * b + t * t * c;
  return Array.from({ length: 9 }, (_, i) => {
    const t = 0.18 + i * 0.09, nx = q(t, 322, 352, 388), ny = q(t, 532, 506, 520) + 4, dx = -0.38;
    const s = (331 + (ny - 540) * 0.07 - nx) / (dx - 0.07);
    return `<path class="lic-str" d="M${nx.toFixed(1)} ${ny.toFixed(1)} L${(nx + dx * s).toFixed(1)} ${(ny + s).toFixed(1)}" style="animation-delay:${(i * 0.05).toFixed(2)}s"/>`;
  }).join('');
};
// a dry-stone wall: rows of grey stones
const wall = (x0, x1, y, k) => {
  const n = Math.round((x1 - x0) / 11), cs = ['#BDB8B1', '#A8A39C', '#CAC5BE', '#B2ADA6'];
  const row = (dy, r, off) => Array.from({ length: n }, (_, i) => {
    const x = x0 + off + i * ((x1 - x0) / n), yy = y + dy + (x - x0) * k + Math.sin(i * 2.3) * 1.2;
    return `<ellipse cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" rx="${(r + (i % 3)).toFixed(1)}" ry="${(r * 0.62).toFixed(1)}" fill="${cs[(i + off) % 4]}"/>`;
  }).join('');
  return `<path d="M${x0} ${y + 9} L${x1} ${y + 9 + (x1 - x0) * k}" stroke="#000" stroke-width="5" opacity=".08" stroke-linecap="round"/>${row(4, 6.5, 0)}${row(-3, 5.5, 5)}${row(-9, 4.5, 2)}`;
};

export default {
  id: 'irishCliffs',
  world: 'irish',
  name: ['Утёсы', 'The cliffs'],
  spots: { L: [30, 610], R: [362, 490], l: [20, 668], r: [386, 670], sky: 300 },
  arrive: [
    ['Утёсы! Внизу шумит океан, а наверху гуляют тупики.', 'The cliffs! The ocean roars below, and puffins stroll on top.'],
    ['Не подходи к краю! Тут ветер сдует любого кролика.', 'Not too close to the edge! This wind could blow a bunny away.'],
  ],

  lines: {
    irishCliffsWaddle: [['Тупики ходят вперевалочку, как официанты во фраках!', 'Puffins waddle like tiny waiters in tuxedos!'],
      ['Топ-топ вдоль обрыва! Я тоже хожу вперевалочку.', 'Waddle, waddle! Look, I can waddle too.'],
      ['Тупики — морские клоуны. Ты посмотри на их клювы!', 'Puffins are the clowns of the sea. Look at those beaks!']],
    irishCliffsDive: [['Плюх! Тупик нырнул и вынырнул с рыбкой.', 'Splash! The puffin dived and came back up with a fish.'],
      ['Тупик может унести в клюве десять рыбок сразу!', 'Puffins can carry ten fish in their beak at once!']],
    irishCliffsRub: [['Тупики здороваются, потираясь клювами. А я — носиком!', 'Puffins say hello by rubbing beaks. Like a nose boop!']],
    irishCliffsBeak: [['У меня клюв, как у тупика! Я теперь морской кролик.', "Look, a puffin beak! I'm a sea bunny now."]],
    irishCliffsScone: [['Скон с подоконника, с вареньем и сливками!', 'A scone from the windowsill, with jam and cream!'],
      ['Тёплый скон! Ирландские бабушки пекут самые вкусные.', 'A warm scone! Irish grannies bake the best ones.']],
    irishCliffsTurf: [['М-м, пахнет торфом! Так пахнет ирландский домик.', 'Mmm, a turf fire! The smell of an Irish cottage.'],
      ['Дымок из трубы — значит, в доме тепло и уютно.', "Smoke from the chimney: it's warm and cosy inside."]],
    irishCliffsDoor: [['В Ирландии говорят: сто тысяч приветствий!', 'In Ireland they say: a hundred thousand welcomes!'],
      ['Дверь-половинка! Верх открыт, а куры не зайдут.', 'A half-door! The top opens, but the hens stay out.']],
    irishCliffsKettle: [['Ставлю чайник! В Ирландии чай помогает от всего.', 'Put the kettle on! In Ireland, tea fixes everything.']],
    irishCliffsHarp: [['Я играю на арфе! Дзинь-дилинь, настоящая ирландская мелодия.', "I'm playing the harp! Plink-plonk, a proper Irish tune."],
      ['Тихонько перебираю струны… Красиво, правда?', "I'm gently plucking the strings… Pretty, isn't it?"]],
    irishCliffsHarpCoin: [['Арфа — символ Ирландии. Она даже на монетах!', "The harp is Ireland's symbol. It's even on the coins!"]],
    irishCliffsGliss: [['Вжу-у-ух по всем струнам! Это называется глиссандо.', "Whoosh, across all the strings! That's called a glissando."]],
    irishCliffsLullaby: [['Колыбельная на арфе… так нежно, что я засыпаю.', "A harp lullaby… so soft, I'm falling asleep."]],
    irishCliffsCircle: [['Я был в каменном круге! Видела радугу?', 'I was inside the stone circle! Did you see the rainbow?'],
      ['Этим камням тысячи лет. И они всё ещё волшебные!', 'These stones are thousands of years old. Still magic!']],
    irishCliffsEcho: [['Ау-у! …ау… ау… Камни мне отвечают!', 'Hello-o! …hello… hello… The stones are answering me!']],
    irishCliffsHum: [['Камни гудят? У меня даже ушки дрожат!', 'Are the stones humming? My ears are tingling!']],
    irishCliffsWish: [['Загадываю желание в круге камней… Никому ни слова!', "A wish in the stone circle… Don't tell anyone!"]],
    irishCliffsSeasons: [['Дождь, солнце, опять дождь! Четыре времени года за один день.', 'Rain, sun, rain again! Four seasons in one day.'],
      ['Ирландская погода: не нравится — подожди пять минут!', "Irish weather: don't like it? Wait five minutes!"]],
    irishCliffsSoftDay: [['Просто морось. Ирландцы зовут это «мягкий денёк»!', 'Just a drizzle. The Irish call this a soft day!']],
    irishCliffsSunOut: [['Солнце вышло! В Ирландии все сразу бегут на улицу!', "The sun's out! In Ireland, everyone runs outside at once!"]],
    irishCliffsSideways: [['Ух, ветер! Тут даже дождь идёт боком!', 'Whoa, the wind! Here even the rain goes sideways!']],
    irishCliffsPuffinFish: [['Рыбка для меня? Спасибо, но я больше по морковке!', "A fish for me? Thanks, but I'm more of a carrot bunny!"]],
    irishCliffsPuffinHead: [['Тупик сел мне на голову! Я теперь утёс?', 'A puffin landed on my head! Am I a cliff now?']],
  },

  // Lucky's box (x 72–328, y 396–665) takes the taps there, and his speech bubble covers the sky while he talks: the
  // things in the back each have a second way in down in the free corners (an ogham stone of the circle, a creel of
  // turf from the cottage, the puddle the rain left), first in the page so they are the ones the tests tap
  art: (u, h) => {
    const st = circleStones(364);
    return `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#84CBFF"/><stop offset=".55" stop-color="#C6E9FF"/><stop offset="1" stop-color="#EAF7FF"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#62B9E8"/><stop offset=".5" stop-color="#3F9CD8"/><stop offset="1" stop-color="#2F86C6"/></linearGradient>
<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#84D672"/><stop offset="1" stop-color="#55B454"/></linearGradient>
<linearGradient id="${u}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A0958B"/><stop offset="1" stop-color="#776C64"/></linearGradient>
<linearGradient id="${u}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D07A"/><stop offset="1" stop-color="#D3A04A"/></linearGradient>
<radialGradient id="${u}h"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient>
<radialGradient id="${u}m"><stop offset="0" stop-color="#FFF4B8" stop-opacity=".95"/><stop offset="1" stop-color="#FFF4B8" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g class="lic-gulls amb" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"><path class="lic-gull amb" d="M306 232 q7 -7 14 0 q7 -7 14 0"/><path class="lic-gull amb" d="M346 254 q5 -5 10 0 q5 -5 10 0" style="animation-delay:-.6s"/></g>
<rect y="372" width="400" height="330" fill="url(#${u}w)"/>
<path d="M0 373 H400" stroke="#fff" stroke-width="1.5" opacity=".5"/>
<path d="M214 373 L225 356 L230 362 L238 348 L250 373Z" fill="#8FB0CB"/>
<g class="lic-waves amb" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"><path d="M200 390 q8 -4 16 0 M258 386 q8 -4 16 0 M206 418 q10 -5 20 0 M150 466 q10 -5 20 0 M30 472 q10 -5 20 0 M92 500 q10 -5 20 0 M14 624 q10 -5 20 0"/></g>
<path d="M0 548 Q60 542 120 544 L128 552 L120 606 Q60 610 0 608Z" fill="url(#${u}r)"/>
<path d="M0 563 Q60 558 124 561 M0 579 Q60 574 122 577 M0 594 Q60 590 120 593" stroke="#5E554D" stroke-width="2.2" fill="none" opacity=".45"/><path d="M30 550 l-2 22 M64 548 l2 32 M94 548 l-2 24 M46 580 l1 26" stroke="#5E554D" stroke-width="1.6" opacity=".35"/>
<path d="M120 544 L128 552 L120 606 L112 606 Q118 574 114 545Z" fill="#574E48" opacity=".45"/>
<path class="lic-foam amb" d="M-8 609 q11 -5 22 0 t22 0 t22 0 t22 0 t22 0 t22 0" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".9" style="animation-delay:-1.4s"/>
<g class="lic-spray amb" fill="#fff"><circle cx="114" cy="600" r="5.5"/><circle cx="123" cy="591" r="4"/><circle cx="105" cy="592" r="3.5"/><circle cx="118" cy="582" r="2.5"/></g>
<path d="M0 532 Q52 522 100 526 Q124 530 130 549 Q122 554 114 551 Q60 544 0 555Z" fill="#6FC560"/><path d="M0 532 Q52 522 100 526 Q124 530 130 549" stroke="#9EDC8B" stroke-width="2" fill="none"/>
${[[84, 527], [96, 529], [108, 532], [118, 537], [126, 543]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#FF8FC0"/><circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`).join('')}
<circle class="lic-m-sea" cx="52" cy="612" r="1" fill="none"/>
<path d="M180 500 Q222 416 290 398 L400 392 V540 H180Z" fill="#8ED57F"/>
<path d="M214 462 Q290 422 400 414" stroke="#B3AEA6" stroke-width="4" stroke-dasharray="5 2.6" stroke-linecap="round" fill="none"/><path d="M334 400 Q330 440 320 482" stroke="#B3AEA6" stroke-width="3.5" stroke-dasharray="5 2.6" stroke-linecap="round" fill="none"/>
<path d="M0 648 Q44 622 96 602 Q144 576 192 532 Q252 494 330 486 Q372 484 400 486 V700 H0Z" fill="url(#${u}g)"/>
<path d="M0 648 Q44 622 96 602 Q144 576 192 532 Q252 494 330 486 Q372 484 400 486" stroke="#4E9F48" stroke-width="3" fill="none" opacity=".55"/>
<g fill="#9C958E"><path d="M58 616 q5 -8 12 -3 q2 4 -2 5z"/><path d="M100 596 q4 -6 10 -2 q1 3 -2 4z"/></g>
${wall(184, 400, 506, -0.03)}
<g stroke="#4FA64C" stroke-width="2" stroke-linecap="round" opacity=".6">${[[86, 650], [318, 516], [228, 540], [368, 518], [40, 690], [212, 690], [120, 652]].map(([x, y]) => `<path d="M${x} ${y} l-3 -7 M${x + 3} ${y} l0 -8 M${x + 6} ${y} l3 -7"/>`).join('')}</g>
<g data-tap="cliffCottage" class="lic-creel"><rect x="244" y="656" width="74" height="44" fill="transparent"/>
  <ellipse cx="281" cy="697" rx="33" ry="3.5" fill="#000" opacity=".12"/>
  ${[[258, 668, -14, '#5E3E2C'], [276, 664, 6, '#6E4A33'], [294, 667, -6, '#5E3E2C'], [266, 674, 4, '#7A563C'], [286, 674, -3, '#6E4A33']].map(([x, y, r, c]) => `<rect x="${x - 9}" y="${y - 5}" width="18" height="10" rx="3" fill="${c}" transform="rotate(${r} ${x} ${y})"/>`).join('')}
  <path d="M251 676 L311 676 L305 698 Q281 702 257 698Z" fill="#C08A4E"/>
  <path d="M254 684 H308 M256 692 H306" stroke="#9A6A35" stroke-width="1.6"/><path d="M263 676 l1 22 M273 676 l.5 24 M283 676 v24 M293 676 l-.5 23 M302 676 l-1 21" stroke="#A87640" stroke-width="1.4"/>
  <path d="M250 676 H312" stroke="#9A6A35" stroke-width="3.2" stroke-linecap="round"/></g>
<g data-tap="cliffStones" class="lic-ogham"><rect x="6" y="604" width="52" height="72" fill="transparent"/>
  <ellipse cx="32" cy="668" rx="19" ry="3.6" fill="#000" opacity=".14"/>
  <path d="M20 668 Q16 640 20 618 L27 606 Q34 603 41 611 Q45 640 43 668Z" fill="#B3ADA6" stroke="#B3ADA6" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M23 663 Q20 640 24 620" stroke="#fff" stroke-width="2" opacity=".4" fill="none" stroke-linecap="round"/>
  <path d="M41 614 Q44 640 42 666" stroke="#857E78" stroke-width="1.4" fill="none"/>
  <path d="M42 660 h5 M42 656 h5 M42 652 h5 M37 644 h5 M37 640 h5 M38 632 h8 M41 624 l5 -2 M41 620 l5 -2 M41 616 l5 -2" stroke="#857E78" stroke-width="1.5" stroke-linecap="round"/>
  <g fill="#DCD47C" opacity=".85"><circle cx="27" cy="630" r="1.6"/><circle cx="31" cy="648" r="1.3"/><circle cx="25" cy="655" r="1"/></g>
  <path d="M18 668 q5 -6 9 -1 q4 -5 8 0 q4 -6 9 1" fill="#8CCB78"/></g>
<g data-tap="cliffRain" class="lic-puddle"><rect x="104" y="668" width="94" height="32" fill="transparent"/>
  <ellipse cx="151" cy="686" rx="42" ry="10" fill="#6FB6E2"/><ellipse cx="151" cy="684.5" rx="36" ry="7.2" fill="#A6DAF7"/>
  <path d="M126 682 q9 -3 17 0 M160 687 q7 -2 13 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".75"/>
  <g fill="none" stroke="#fff" stroke-width="1.4">${[[136, 686, 0], [166, 684, -1.2], [151, 688, -2.1]].map(([x, y, d]) => `<ellipse class="lic-ring amb" cx="${x}" cy="${y}" rx="7" ry="2.2" style="animation-delay:${d}s"/>`).join('')}</g></g>
<path d="M0 372 Q90 366 176 370 L190 376 L185 434 Q92 440 0 438Z" fill="url(#${u}r)"/>
<path d="M0 388 Q90 382 186 386 M0 404 Q90 398 186 402 M0 420 Q90 415 185 418" stroke="#62584F" stroke-width="2" fill="none" opacity=".45"/><path d="M42 376 l-1 26 M98 372 l1 30 M152 376 l-1 28 M70 406 l1 28 M126 404 l-1 30 M20 410 l1 24" stroke="#62584F" stroke-width="1.5" opacity=".35"/>
<path d="M12 397 q18 -5 34 -1 M104 413 q16 -4 30 0 M60 383 q12 -3 22 0" stroke="#7CC56A" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>
<g fill="#fff" opacity=".9"><circle cx="24" cy="394" r="1.5"/><circle cx="33" cy="393" r="1.5"/><circle cx="116" cy="410" r="1.5"/><circle cx="68" cy="380" r="1.4"/><circle cx="124" cy="409" r="1.4"/></g>
<path d="M176 370 L190 376 L185 434 L177 434 Q180 404 176 372Z" fill="#5F564F" opacity=".45"/>
<path class="lic-foam amb" d="M-6 438 q12 -5 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>
<path d="M0 356 Q60 346 120 349 Q168 352 192 369 Q188 376 178 374 Q90 367 0 376Z" fill="#7CCB69"/><path d="M0 356 Q60 346 120 349 Q168 352 192 369" stroke="#A8E292" stroke-width="2" fill="none"/>
<g data-tap="cliffStones" class="lic-circle"><rect x="40" y="326" width="140" height="56" fill="transparent"/>
  <ellipse class="lic-glow" cx="96" cy="356" rx="70" ry="24" fill="url(#${u}m)"/>
  <ellipse cx="96" cy="366" rx="44" ry="5" fill="#8FD47A"/>
  ${st.back}
  <g transform="translate(96 367) scale(1.1)"><g class="lic-mini"><ellipse rx="7" ry="1.6" fill="#000" opacity=".15"/><ellipse cy="-5" rx="5.5" ry="5" fill="#F29A4A"/><ellipse cy="-4" rx="3" ry="3" fill="#FFE3C4"/>
    <circle cy="-12" r="5" fill="#F4A65A"/><path d="M-4 -15 q-5 2 -5 8 q2 1 3 -1z M4 -15 q5 2 5 8 q-2 1 -3 -1z" fill="#E0823A"/><circle cx="-1.8" cy="-12.5" r=".8" fill="#3A2216"/><circle cx="1.8" cy="-12.5" r=".8" fill="#3A2216"/></g></g>
  ${st.front}
  <g fill="#E3DA7E" opacity=".8"><circle cx="58" cy="361" r="1.3"/><circle cx="131" cy="364" r="1.2"/><circle cx="96" cy="368" r="1.4"/></g></g>
<g data-tap="cliffPuffins"><rect x="4" y="500" width="66" height="54" fill="transparent"/>
  <ellipse cx="38" cy="541" rx="33" ry="3.4" fill="#000" opacity=".12"/>
  <g class="lic-flock">
  <g transform="translate(60 534) scale(.72)"><g class="lic-pf lic-pf3"><g class="lic-bob amb" style="animation-delay:-.8s">${PUFFIN}
    <g class="lic-fish"><path d="M-22 -26 q-7 -4 -13 0 q6 4 13 0z" fill="#BFD6E8"/><path d="M-35 -26 l-4 -3 v6z" fill="#BFD6E8"/><circle cx="-24" cy="-26.4" r=".7" fill="#2A2730"/></g></g></g></g>
  <g transform="translate(17 541) scale(-.84 .84)"><g class="lic-pf lic-pf1"><g class="lic-bob amb">${PUFFIN}</g></g></g>
  <g transform="translate(45 540) scale(.84)"><g class="lic-pf lic-pf2"><g class="lic-bob amb" style="animation-delay:-1.7s">${PUFFIN}</g></g></g>
  </g></g>
<g data-tap="cliffCottage" class="lic-home"><rect x="256" y="278" width="136" height="114" fill="transparent"/><g transform="translate(0 -48)">
  <g class="lic-smokes">${[0, 1, 2].map((i) => `<circle class="lic-puff amb" cx="288" cy="342" r="${5 + i}" fill="#fff" opacity="0" style="animation-delay:${-i * 1.7}s"/>`).join('')}
    ${[0, 1, 2, 3].map((i) => `<circle class="lic-big" cx="288" cy="340" r="${7 + i * 2}" fill="#F4F1EC" style="animation-delay:${i * 0.35}s"/>`).join('')}</g>
  <ellipse cx="326" cy="443" rx="68" ry="5" fill="#000" opacity=".12"/>
  <rect x="280" y="346" width="16" height="34" fill="#C3BBB0"/><rect x="278" y="342" width="20" height="6" rx="2" fill="#A9A095"/><rect x="282" y="344" width="5" height="3" fill="#4A403A"/>
  <rect x="360" y="350" width="14" height="30" fill="#C3BBB0"/><rect x="358" y="346" width="18" height="6" rx="2" fill="#A9A095"/>
  <rect x="272" y="390" width="112" height="50" rx="3" fill="#FFFDF6"/><path d="M272 436 H384" stroke="#E7DECD" stroke-width="6"/>
  <path d="M266 396 Q264 382 278 374 L292 354 Q328 343 364 354 L378 374 Q392 382 390 396 Q328 404 266 396Z" fill="url(#${u}t)"/>
  <path d="M280 388 L296 360 M292 392 L304 356 M306 394 L312 352 M320 396 L322 350 M334 396 L332 350 M348 395 L342 351 M362 393 L352 355 M376 390 L360 360" stroke="#C48F3E" stroke-width="2" stroke-linecap="round" opacity=".6"/>
  <path d="M292 355 Q328 344 364 355" stroke="#B7843A" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path d="M298 361 l5 -5 5 5 5 -5 5 5 5 -5 5 5 5 -5 5 5 5 -5 5 5 5 -5 5 5" stroke="#B7843A" stroke-width="1.6" fill="none" opacity=".8"/>
  <path d="M268 395 Q328 403 388 395" stroke="#B7843A" stroke-width="3" fill="none" opacity=".55"/>
  <rect x="278" y="404" width="24" height="17" rx="2" fill="#FFE2A0"/><path d="M290 404 V421 M278 412.5 H302" stroke="#fff" stroke-width="2"/><path d="M281 409 l5 -3" stroke="#fff" stroke-width="1.6" opacity=".8"/>
  <rect x="274" y="420" width="32" height="4" rx="1" fill="#E7DECD"/>
  <path d="M279 414.5 h7 v3.5 q0 2.4 -3.5 2.4 q-3.5 0 -3.5 -2.4z" fill="#fff"/><path d="M286 416 q2.6 0 2.4 2 q-.4 1.6 -2.6 1.2" stroke="#fff" stroke-width="1.2" fill="none"/><path d="M280.5 415.6 h4" stroke="#3E9B5A" stroke-width="1"/>
  <path class="lic-steam amb" d="M281.5 412 q-2 -3 0 -6 M284.5 412 q2 -3 0 -6" stroke="#fff" stroke-width="1.2" fill="none" opacity=".8"/>
  <g class="lic-scone"><ellipse cx="297" cy="418.6" rx="5" ry="2.6" fill="#DDA358"/><ellipse cx="297" cy="416.8" rx="4" ry="1.8" fill="#F0C27A"/><ellipse cx="297" cy="415.6" rx="2.6" ry="1.1" fill="#FFF8EA"/><circle cx="297" cy="415" r="1.1" fill="#D62839"/></g>
  <rect x="313" y="404" width="23" height="36" rx="2" fill="#4A3127"/><rect class="lic-hearth" x="315" y="406" width="19" height="16" fill="#FFB347"/>
  <g class="lic-door"><rect x="313" y="404" width="23" height="18" rx="2" fill="#D62839"/><path d="M317 408 h15 v10 h-15z" stroke="#B51E2E" stroke-width="1.4" fill="none"/></g>
  <rect x="313" y="422" width="23" height="18" fill="#C92233"/><path d="M313 422 H336" stroke="#9E1A28" stroke-width="1.6"/><circle cx="332" cy="430" r="1.5" fill="#FFD23F"/>
  <rect x="346" y="405" width="17" height="15" rx="2" fill="#FFE2A0"/><path d="M354.5 405 V420 M346 412.5 H363" stroke="#fff" stroke-width="2"/><rect x="344" y="419" width="21" height="3.5" rx="1" fill="#E7DECD"/>
  <path d="M369 432 v-8 h10 v8z" fill="#C96A3B"/><g fill="#E2313B"><circle cx="371" cy="421" r="2.6"/><circle cx="376" cy="420" r="2.6"/><circle cx="373.6" cy="417" r="2.4"/></g><path d="M370 424 q4 -2 8 0" stroke="#3E9B5A" stroke-width="2" fill="none"/>
  <g><path d="M256 440 h16 v-6 h-16z" fill="#6B4A35"/><path d="M258 434 h12 v-6 h-12z" fill="#7E5A40"/><path d="M261 428 h7 v-5 h-7z" fill="#6B4A35"/><path d="M256 437 h16 M258 431 h12" stroke="#55382A" stroke-width="1"/></g></g></g>
<g data-tap="cliffHarp"><rect x="312" y="512" width="88" height="148" fill="transparent"/><g transform="translate(33 0) scale(.92 1)">
  <ellipse cx="350" cy="652" rx="40" ry="6" fill="#000" opacity=".12"/>
  <path d="M312 651 Q314 638 346 638 Q380 638 382 651 Q348 659 312 651Z" fill="#ABA59E"/><path d="M318 642 Q346 634 376 642" stroke="#8CCB78" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M318 534 Q325 528 333 536 L341 642 Q333 649 322 645Z" fill="#C98545"/><path d="M323 538 L328 640" stroke="#E5A766" stroke-width="2.4" stroke-linecap="round"/>
  <g fill="#FFD23F">${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${(333 + i * 1.2).toFixed(1)}" cy="${552 + i * 16}" r="1.6"/>`).join('')}</g>
  <g stroke="#FFF2C0" stroke-width="1.3" stroke-linecap="round">${harpStrings()}</g>
  <path d="M320 534 Q352 506 388 520" stroke="#B8733A" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M326 526 Q352 508 382 516" stroke="#D9955A" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M388 521 C402 562 388 612 338 644" stroke="#A86530" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M392 540 C398 572 386 606 352 632" stroke="#C47E42" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${[0.3, 0.62].map((t) => { const b = (a, b2, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b2 + 3 * (1 - t) * t * t * c + t ** 3 * d; return `<circle cx="${b(388, 402, 388, 338).toFixed(1)}" cy="${b(521, 562, 612, 644).toFixed(1)}" r="4" fill="#FFD23F"/>`; }).join('')}
  <circle cx="388" cy="520" r="6" fill="#FFD23F"/><path d="M388 520 m-3 0 a3 3 0 1 1 3 3" stroke="#D9A21A" stroke-width="1.4" fill="none"/></g></g>
<g data-tap="cliffRain" class="lic-skyg"><rect x="76" y="234" width="176" height="98" fill="transparent"/><g transform="translate(0 -16)">
  <g class="lic-sun"><circle cx="216" cy="280" r="40" fill="url(#${u}h)"/><circle cx="216" cy="280" r="20" fill="#FFD84D"/></g>
  <g class="lic-cl">
    <g stroke="#7FB4DE" stroke-width="2.4" stroke-linecap="round"><g class="lic-drizzle amb" opacity=".8"><path d="M114 328 l-3 9 M136 332 l-3 9 M158 328 l-3 9 M180 332 l-3 9"/></g>
      <g class="lic-pour" stroke="#5E9ED6" stroke-width="2.8"><path d="M108 330 l-4 13 M124 336 l-4 13 M140 330 l-4 13 M156 336 l-4 13 M172 330 l-4 13 M188 336 l-4 13 M204 330 l-4 13"/></g></g>
    <rect x="104" y="312" width="108" height="16" rx="8" fill="#A7B5C4"/><g fill="#B8C5D2"><circle cx="118" cy="306" r="21"/><circle cx="148" cy="292" r="28"/><circle cx="182" cy="300" r="23"/><circle cx="204" cy="312" r="15"/><rect x="104" y="304" width="108" height="18" rx="9"/></g>
    <g fill="#D3DCE6"><circle cx="142" cy="285" r="15"/><circle cx="176" cy="292" r="11"/><circle cx="116" cy="301" r="10"/></g>
    </g></g></g>
${h.flower(66, 686, '#FF8FC0', 0.8)}${h.flower(330, 694, '#FFB3D6', 0.75)}
</svg>`;
  },

  css: `
.lic-gulls.amb { animation: licGulls 16s ease-in-out infinite; }
@keyframes licGulls { 50% { transform: translate(-26px, 8px); } }
.lic-gull.amb { transform-box: fill-box; transform-origin: center; animation: licGull 1.1s ease-in-out infinite alternate; }
@keyframes licGull { to { transform: scaleY(.5) translateY(2px); } }
.lic-drizzle.amb { animation: licDrizzle 1.6s linear infinite; }
@keyframes licDrizzle { 0% { transform: translateY(-4px); opacity: 0; } 30% { opacity: .85; } 100% { transform: translateY(12px); opacity: 0; } }
.lic-waves.amb { animation: licWaves 5s ease-in-out infinite; }
@keyframes licWaves { 50% { transform: translateX(8px); opacity: .3; } }
.lic-foam.amb { animation: licFoam 3.2s ease-in-out infinite; }
@keyframes licFoam { 50% { transform: translateX(-7px); opacity: .45; } }
.lic-spray.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: licSpray 4.6s ease-out infinite; }
@keyframes licSpray { 0%, 68% { transform: scale(.2); opacity: 0; } 76% { transform: scale(1); opacity: .95; } 100% { transform: scale(1.3) translateY(-6px); opacity: 0; } }
.lic-puff.amb { transform-box: fill-box; transform-origin: center; animation: licSmoke 5.1s linear infinite; }
@keyframes licSmoke { 0% { opacity: 0; transform: translate(0, 0) scale(.5); } 15% { opacity: .75; } 100% { opacity: 0; transform: translate(-18px, -58px) scale(2); } }
.lic-steam.amb { animation: licSteam 2.4s ease-in-out infinite; }
@keyframes licSteam { 0% { opacity: 0; transform: translateY(1px); } 40% { opacity: .9; } 100% { opacity: 0; transform: translateY(-3px); } }
.lic-ring.amb { transform-box: fill-box; transform-origin: center; animation: licRing 3.2s ease-out infinite; }
@keyframes licRing { 0% { transform: scale(.2); opacity: 0; } 15% { opacity: .9; } 100% { transform: scale(1.5); opacity: 0; } }
.lic-puddle.licrings .lic-ring { animation-duration: .9s; }
.lic-bob.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: licBob 3.6s ease-in-out infinite; }
@keyframes licBob { 0%, 70%, 100% { transform: none; } 80% { transform: rotate(-8deg); } 90% { transform: rotate(4deg); } }
.lic-big, .lic-pour, .lic-fish, .lic-glow, .lic-mini, .lic-hearth { opacity: 0; }
.lic-mini, .lic-glow { transition: opacity .5s; }
[data-tap="cliffCottage"].licsmoke .lic-big { transform-box: fill-box; transform-origin: center; animation: licSmokeBig 2.2s ease-out backwards; }
@keyframes licSmokeBig { 0% { opacity: 0; transform: scale(.4); } 20% { opacity: .9; } 100% { opacity: 0; transform: translate(-22px, -74px) scale(2.4); } }
[data-tap="cliffCottage"].licdoor .lic-door { transform-box: fill-box; transform-origin: 0 50%; animation: licDoor 2.8s ease-in-out; }
@keyframes licDoor { 15%, 80% { transform: scaleX(.12); } }
[data-tap="cliffCottage"].licdoor .lic-hearth { animation: licHearth 2.8s ease-in-out; }
@keyframes licHearth { 15%, 80% { opacity: .85; } }
[data-tap="cliffCottage"].licsill .lic-scone { transform-box: fill-box; transform-origin: 50% 100%; animation: licTake 2.8s ease-in-out; }
@keyframes licTake { 12% { transform: translateY(-3px) scale(1.4); opacity: 1; } 24%, 86% { transform: translateY(-6px); opacity: 0; } 100% { opacity: 1; } }
[data-tap="cliffPuffins"].licwaddle .lic-pf { transform-box: fill-box; transform-origin: 50% 100%; animation: licWaddle .34s ease-in-out 7 alternate; }
@keyframes licWaddle { from { transform: rotate(-9deg); } to { transform: rotate(9deg); } }
[data-tap="cliffPuffins"].licwaddle .lic-flock { animation: licWalk 2.4s ease-in-out; }
@keyframes licWalk { 45%, 55% { transform: translateX(-8px); } }
[data-tap="cliffPuffins"].licdive .lic-pf3 { transform-box: fill-box; transform-origin: 50% 50%; animation: licDive 2.8s ease-in-out; }
@keyframes licDive { 12% { transform: translate(-4px, -12px) rotate(-30deg); opacity: 1; } 30% { transform: translate(-8px, 80px) rotate(-170deg); opacity: 1; } 34%, 62% { transform: translate(-8px, 92px) rotate(-180deg); opacity: 0; } 66% { transform: translate(-2px, 70px); opacity: 0; } 78% { transform: translate(0, -14px); opacity: 1; } 90% { transform: translate(0, 2px); } }
[data-tap="cliffPuffins"].licdive .lic-fish { animation: licFish 2.8s linear; }
@keyframes licFish { 0%, 70% { opacity: 0; } 76%, 96% { opacity: 1; } 100% { opacity: 0; } }
[data-tap="cliffPuffins"].licrub .lic-pf1, [data-tap="cliffPuffins"].licrub .lic-pf2 { transform-box: fill-box; transform-origin: 50% 100%; animation: licRub .3s ease-in-out 6 alternate; }
@keyframes licRub { from { transform: rotate(-4deg); } to { transform: rotate(-16deg) translateY(-1px); } }
[data-tap="cliffHarp"].licpluck .lic-str { animation: licStr .12s linear infinite alternate; }
@keyframes licStr { to { transform: translateX(.9px); } }
[data-tap="cliffHarp"].licgliss .lic-str { animation: licGliss .8s ease-out backwards; }
@keyframes licGliss { 0% { stroke: #FFF2C0; } 25% { stroke: #FFD23F; stroke-width: 2.6; } 100% { stroke: #FFF2C0; } }
[data-tap="cliffStones"].licglow .lic-glow { animation: licGlow 2.6s ease-in-out; }
@keyframes licGlow { 25%, 75% { opacity: 1; } }
[data-tap="cliffStones"].licglow .lic-st { animation: licStone 2.6s ease-in-out; }
@keyframes licStone { 25%, 75% { fill: #ECE6D2; } }
[data-tap="cliffStones"].licin .lic-mini, [data-tap="cliffStones"].licin .lic-glow { opacity: 1; }
[data-tap="cliffRain"].licpour .lic-pour { animation: licPour .5s linear 4; }
@keyframes licPour { 0% { opacity: 0; transform: translateY(-6px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(18px); } }
[data-tap="cliffRain"].licsun .lic-cl { animation: licAside 3s ease-in-out; }
@keyframes licAside { 25%, 75% { transform: translateX(-50px); } }
[data-tap="cliffRain"].licsun .lic-sun { transform-box: fill-box; transform-origin: center; animation: licShine 3s ease-in-out; }
@keyframes licShine { 25%, 75% { transform: scale(1.25); } }
[data-tap="cliffRain"].licdrizzle .lic-cl { animation: licFloat 2.4s ease-in-out; }
@keyframes licFloat { 50% { transform: translateY(-5px); } }
[data-tap="cliffRain"].licwind .lic-cl { transform-box: fill-box; transform-origin: 50% 50%; animation: licGust 2.6s ease-in-out; }
@keyframes licGust { 20% { transform: translateX(20px) skewX(-8deg); } 50% { transform: translateX(-10px); } 80% { transform: translateX(14px) skewX(-5deg); } }
`,

  props: () => ({
    // a pretend puffin beak on his nose, on an elastic
    irishCliffsBeak: { slot: 'nose', art: () => `<path d="M88 100 Q66 98 52 90 M112 100 Q134 98 148 90" stroke="#fff" stroke-width="1.6" fill="none" opacity=".75"/>
      <path d="M87 99 Q100 88 113 99 Q107 121 100 127 Q93 121 87 99Z" fill="#FF6A2B"/><path d="M87 99 Q100 88 113 99 Q100 95 87 99Z" fill="#5E6B7A"/>
      <path d="M90 104 Q100 98 110 104" stroke="#FFD23F" stroke-width="3" fill="none"/><path d="M95 110 q5 3 10 0" stroke="#E04E1A" stroke-width="1.6" fill="none" opacity=".7"/>` },
    // a scone with cream and jam
    irishCliffsScone: { slot: 'hand', art: () => `<g transform="translate(156 160)"><path d="M-15 4 Q-16 -8 -10 -10 H10 Q16 -8 15 4 Q0 9 -15 4Z" fill="#DDA358"/>
      <ellipse cy="-9" rx="12" ry="4.6" fill="#F0C27A"/><path d="M-10 -10 Q-5 -18 1 -13 Q7 -19 11 -10Z" fill="#FFF8EA"/><circle cx="1" cy="-14" r="3.6" fill="#D62839"/><circle cx="0" cy="-15" r="1" fill="#fff" opacity=".7"/></g>` },
    // a cup of tea on a saucer, steaming
    irishCliffsTea: { slot: 'hand', art: () => `<g transform="translate(156 158)"><ellipse cy="10" rx="18" ry="4.5" fill="#fff" stroke="#E3D9E6" stroke-width="1.5"/>
      <path d="M12 -2 q9 0 8 6 q-1 5 -9 4" stroke="#fff" stroke-width="3.2" fill="none"/><path d="M-12 -6 H12 Q12 9 0 10 Q-12 9 -12 -6Z" fill="#fff" stroke="#E3D9E6" stroke-width="1.5"/>
      <ellipse cy="-6" rx="12" ry="3" fill="#B5703A"/><path d="M-11.5 0 H11.5" stroke="#3E9B5A" stroke-width="2"/>
      <path d="M-4 -12 q-4 -6 0 -12 q4 -6 0 -12 M5 -12 q4 -6 0 -12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".85"/></g>` },
    // a puffin sitting on his head
    irishCliffsPuffinHead: { slot: 'head', art: () => `<g transform="translate(106 48) scale(1.15)">${PUFFIN}</g>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, line, centerOf, nextTo, head, paw, sceneRect } = k;
    const partAt = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    // the thing itself when its second way in was tapped (the creel → the cottage, the ogham stone → the circle)
    const main = (c, low, sel) => (c.el.classList.contains(low) && c.el.ownerSVGElement?.querySelector(sel)) || c.el;
    const home = (c) => ({ ...c, el: main(c, 'lic-creel', '.lic-home') });
    const ring = (c) => ({ ...c, el: main(c, 'lic-ogham', '.lic-circle') });

    // the puffins: they waddle along the edge, one dives for a fish; they rub beaks; Lucky gets a puffin beak
    const waddle = (c) => {
      const a = begin('licWaddle');
      api.hop(c.el, 'licwaddle', 2500);
      grunt(sfx);
      [0, 340, 680, 1020, 1360].forEach((d) => at(a, d, () => sfx.tap()));
      pose('laugh', 2300, 'sidestep', 2200);
      line('irishCliffsWaddle', 1, 0);
      at(a, 2400, end);
    };
    const dive = (c) => {
      const a = begin('licDive');
      const [sx, sy] = partAt(c, '.lic-pf3');
      const sea = c.el.ownerSVGElement?.querySelector('.lic-m-sea');
      const [wx, wy] = sea ? centerOf(sea) : [sx - 30, sy + 90];
      api.hop(c.el, 'licdive', 2900);
      sfx.whoosh();
      pose('surprised', 1300, 'startle', 1100);
      at(a, 850, () => { sfx.splash(); api.fxAt(wx, wy - 10, ['💦', '🌊'], 5, 'spark'); });
      at(a, 2100, () => { grunt(sfx); pose('laugh', 1500, 'clap'); line('irishCliffsDive', 1, 0); api.reward(); });
      at(a, 3300, end);
    };
    R.cliffPuffins = {
      press: (c) => { grunt(sfx); api.fxAt(c.x, c.y - 10, ['🪶'], 2, 'spark'); },
      tap: who(oneOf('irishCliffsPuffins', waddle, dive)),
      double: (c) => {
        api.hop(c.el, 'licrub', 1900);
        grunt(sfx);
        const [x, y] = partAt(c, '.lic-pf1');
        setTimeout(() => api.hearts(x + 14, y - 16, 3), 400);
        if (api.free()) { pose('happy', 1800, 'boop', 700); line('irishCliffsRub', 1); }
      },
      long: who((c) => {
        const a = begin('licBeak');
        go(nextTo(c.el), 700);
        at(a, 750, () => { prop('irishCliffsBeak', 4600); sfx.pop(); pose('laugh', 2400, 'sidestep', 2200); line('irishCliffsBeak', 1, 0); api.hop(c.el, 'licwaddle', 2500); });
        at(a, 1400, () => grunt(sfx));
        at(a, 3200, () => { api.hearts(...head(), 3); api.reward(); });
        at(a, 4400, end);
      }),
    };

    // the cottage: a scone from the windowsill, the turf smoke, the half-door, a cup of tea
    const scone = (c) => {
      const a = begin('licScone');
      const from = partAt(c, '.lic-scone');
      api.hop(c.el, 'licsill', 2900);
      sfx.sparkle();
      at(a, 450, () => fly('✨', from, paw(), 650, { arc: 60, size: 22 }));
      at(a, 1100, () => { prop('irishCliffsScone', 2800); sfx.pop(); pose('happy', 1000, 'proud', 900); });
      at(a, 2000, () => { api.setTemp('eat', 1600); sfx.crunch(); line('irishCliffsScone', 1, 0); api.boost('hunger', 1); api.reward(); });
      at(a, 3900, end);
    };
    const turf = (c) => {
      const a = begin('licTurf');
      api.hop(c.el, 'licsmoke', 2600);
      sfx.crackle();
      at(a, 400, () => { pose('happy', 1600, 'sniff', 1500); sfx.sniff(); });
      at(a, 1500, () => { api.setTemp('happy', 1800); line('irishCliffsTurf', 1, 0); });
      at(a, 3000, end);
    };
    R.cliffCottage = {
      press: (c) => { if (c.el.classList.contains('lic-creel')) { sfx.thump(); api.fxAt(c.x, c.y - 10, ['✨'], 2, 'spark'); return; } sfx.knock(); api.fxAt(c.x - 30, c.y - 40, ['💨'], 2, 'spark'); },
      tap: who((c) => oneOf('irishCliffsCottage', scone, turf)(home(c))),
      double: (c0) => {
        const c = home(c0);
        api.hop(c.el, 'licdoor', 2900);
        sfx.knock();
        setTimeout(() => sfx.knock(), 200);
        const [x, y] = partAt(c, '.lic-door');
        setTimeout(() => { sfx.chime(); api.hearts(x, y - 6, 3); }, 550);
        who(() => { const a = begin('licDoor'); pose('happy', 1600, 'wave', 1200); at(a, 1300, () => line('irishCliffsDoor', 1, 0)); at(a, 2000, end); })(c);
      },
      // the kettle goes on: a cup of tea for Lucky
      long: who((c) => {
        const a = begin('licTea');
        api.hop(home(c).el, 'licsmoke', 2600);
        [0, 250, 500].forEach((d) => at(a, d, () => sfx.bubble()));
        at(a, 800, () => { sfx.ding(); prop('irishCliffsTea', 3800); pose('happy', 2600, 'proud', 1200); });
        at(a, 1600, () => line('irishCliffsKettle', 1, 0));
        at(a, 2300, () => { sfx.slurp(); api.setTemp('eat', 1200); });
        at(a, 3200, () => { api.hearts(...head(), 3); api.reward(); });
        at(a, 4600, end);
      }),
    };

    // the harp: a little Irish air; the harp on Irish coins; a glissando; a lullaby that sends him to sleep
    const play = (c) => {
      const a = begin('licHarp');
      go(nextTo(c.el, 18), 700);
      at(a, 750, () => {
        api.hop(c.el, 'licpluck', 2700);
        AIR.forEach((f, i) => at(a, i * 280, () => { sfx.note(f); if (i % 2 === 0) api.fxAt(c.x, c.y - 30, ['🎵', '🎶'], 1, 'spark'); }));
        pose('happy', 2900, 'sway', 1300);
        line('irishCliffsHarp', 1, 0);
      });
      at(a, 2100, () => pose('happy', 1500, 'sway', 1300));
      at(a, 3500, () => { api.reward(); end(); });
    };
    const coin = (c) => {
      sfx.note(784);
      fly('🪙', [c.x, c.y - 20], paw(), 650, { arc: 60, spin: 360, size: 26, stay: 1200 });
      setTimeout(() => { sfx.catch(); api.fxAt(...paw(), ['✨'], 3, 'spark'); }, 650);
      pose('happy', 2200, 'proud', 1200);
      line('irishCliffsHarpCoin', 1);
    };
    R.cliffHarp = {
      press: (c) => { sfx.note(659); api.floatFx(c.x, c.y - 20, '🎵', 'fly-up'); },
      tap: who(oneOf('irishCliffsHarp', play, coin)),
      double: (c) => {
        api.hop(c.el, 'licgliss', 1500);
        GLISS.forEach((f, i) => setTimeout(() => sfx.note(f), i * 55));
        api.fxAt(c.x, c.y - 20, ['✨', '🎶'], 5, 'spark');
        if (api.free()) { pose('laugh', 1500, 'twirl', 800); line('irishCliffsGliss', 1); }
      },
      long: who((c) => {
        const a = begin('licLullaby');
        go(nextTo(c.el, 18), 700);
        at(a, 750, () => {
          api.hop(c.el, 'licpluck', 3400);
          LULLABY.forEach((f, i) => at(a, i * 480, () => sfx.note(f)));
          pose('happy', 1800, 'sway', 1300);
          api.fxAt(c.x, c.y - 30, ['🎵'], 3, 'spark');
          line('irishCliffsLullaby', 1, 0);
        });
        at(a, 2500, () => { api.setTemp('tired', 1100); sfx.yawn(); });
        at(a, 3600, () => { api.setTemp('sleep', 1500); api.fxAt(...head(), ['💤'], 2, 'spark'); });
        at(a, 5100, () => { sfx.boing(); pose('surprised', 1000, 'startle', 1100); api.reward(); });
        at(a, 6000, end);
      }),
    };

    // the stone circle: Lucky appears in the middle of it (and a rainbow), an echo, a hum, a wish
    const middle = (c) => {
      const a = begin('licCircle');
      onEnd(a, () => c.el.classList.remove('licin'));
      sfx.magic();
      hold(a, 'vanish', 3500);
      api.fxAt(...head(), ['✨'], 5, 'spark');
      at(a, 400, () => { c.el.classList.add('licin'); const [x, y] = partAt(c, '.lic-mini'); api.fxAt(x, y - 10, ['✨'], 4, 'spark'); });
      at(a, 1000, () => { k.rainbow(4200); sfx.chime(); });
      at(a, 3000, () => c.el.classList.remove('licin'));
      at(a, 3300, () => { sfx.pop(); api.fxAt(...head(), ['✨'], 5, 'spark'); pose('laugh', 1400, 'binky'); line('irishCliffsCircle', 1, 0); api.reward(); });
      at(a, 4400, end);
    };
    const echo = (c) => {
      const a = begin('licEcho');
      pose('happy', 2600, 'listen', 2400);
      sfx.note(659);
      setTimeout(() => sfx.note(523), 220);
      line('irishCliffsEcho', 1, 0);
      const [rx, ry] = centerOf(c.el);
      [900, 1600].forEach((d) => at(a, d, () => { sfx.note(659); setTimeout(() => sfx.note(523), 200); api.floatFx(rx, ry, '', 'ripple'); }));
      at(a, 2800, end);
    };
    R.cliffStones = {
      press: (c) => { sfx.chime(); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who((c) => oneOf('irishCliffsStones', middle, echo)(ring(c))),
      double: (c) => {
        api.hop(ring(c).el, 'licglow', 2700);
        sfx.purr();
        api.fxAt(c.x, c.y - 10, ['✨'], 5, 'spark');
        who(() => { const a = begin('licHum'); pose('surprised', 1900, 'bigears', 1900); at(a, 1200, () => line('irishCliffsHum', 1, 0)); at(a, 2000, end); })(c);
      },
      long: who((c) => {
        const a = begin('licWish');
        api.hop(ring(c).el, 'licglow', 2700);
        sfx.magic();
        hold(a, 'meditate', 3500);
        api.setTemp('sleep', 3300);
        at(a, 1500, () => line('irishCliffsWish', 1, 0));
        at(a, 1200, () => api.fxAt(...head(), ['✨', '🌟'], 6, 'spark'));
        at(a, 3500, () => { sfx.chime(); pose('happy', 1500, 'binky'); api.hearts(...head(), 4); api.reward(); });
        at(a, 4600, end);
      }),
    };

    // the rain cloud: Irish weather. Rain, sun, rain again; a soft day; the sun comes out; rain going sideways.
    // The puddle it left answers the same way (the sky is under Lucky's speech bubble while he talks)
    const sky = (c) => (c.el.classList.contains('lic-puddle') && c.el.ownerSVGElement?.querySelector('.lic-skyg')) || c.el;
    const rings = (c, ms) => { const p = c.el.ownerSVGElement?.querySelector('.lic-puddle'); if (p) api.hop(p, 'licrings', ms); };
    const seasons = (c) => {
      const a = begin('licSeasons');
      const [hx, hy] = head();
      api.hop(sky(c), 'licpour', 2000);
      rings(c, 2000);
      sfx.rain();
      api.fxAt(hx, hy - 40, ['💧'], 10, 'drop');
      at(a, 500, () => { prop('wet', 1700); hold(a, 'wet', 1500); api.setTemp('sad', 1300); });
      at(a, 2000, () => { api.hop(sky(c), 'licsun', 3000); sfx.shake(); unprop('body'); api.hop(L, 'shakeOff', 1200); k.spray(...api.luckyPoint(0.5, 0.45)); });
      at(a, 2700, () => { sfx.sparkle(); pose('happy', 1800, 'stretchUp', 1600); api.reward(); });
      at(a, 4300, () => { api.fxAt(hx, hy - 40, ['💧'], 4, 'drop'); rings(c, 1200); pose('surprised', 900, 'startle', 1100); line('irishCliffsSeasons', 1, 0); });
      at(a, 5300, end);
    };
    const soft = (c) => {
      const a = begin('licSoft');
      const [hx, hy] = head();
      api.hop(sky(c), 'licdrizzle', 2400);
      rings(c, 2400);
      sfx.bubble();
      [0, 450, 900].forEach((d) => at(a, d, () => api.fxAt(hx, hy - 30, ['💧'], 2, 'drop')));
      pose('happy', 2200, 'tilt', 1400);
      line('irishCliffsSoftDay', 1, 0);
      at(a, 2500, end);
    };
    R.cliffRain = {
      press: (c) => {
        if (c.el.classList.contains('lic-puddle')) { sfx.splash(); api.fxAt(c.x, c.y - 6, ['💦'], 3, 'spark'); return; }
        sfx.bubble();
        api.fxAt(c.x, c.y + 20, ['💧'], 3, 'drop');
      },
      tap: who(oneOf('irishCliffsRain', seasons, soft)),
      double: (c) => {
        const s2 = sky(c);
        api.hop(s2, 'licsun', 3000);
        sfx.sparkle();
        const e = s2.querySelector('.lic-sun'), [x, y] = e ? centerOf(e) : [c.x, c.y];
        setTimeout(() => api.fxAt(x, y, ['☀️', '✨'], 4, 'spark'), 500);
        who(() => { const a = begin('licSunOut'); at(a, 900, () => pose('laugh', 1500, 'binky')); at(a, 1600, () => line('irishCliffsSunOut', 1, 0)); at(a, 2300, end); })(c);
      },
      // a gale: the rain flies sideways past him and his ears flap
      long: who((c) => {
        const a = begin('licWind');
        const w = sceneRect().width, [, hy] = head();
        api.hop(sky(c), 'licwind', 2700);
        rings(c, 2700);
        sfx.whoosh();
        for (let i = 0; i < 10; i++) at(a, i * 150, () => { const y = hy - 50 + (i % 5) * 45; fly(i % 3 ? '💧' : '💨', [-24, y], [w + 24, y + 30], 800, { size: i % 3 ? 18 : 26 }); });
        at(a, 200, () => { pose('surprised', 2300, 'balance', 2400); L.querySelectorAll('.ear').forEach((e) => api.hop(e, 'wiggle')); line('irishCliffsSideways', 1, 0); });
        at(a, 700, () => sfx.whoosh());
        at(a, 1300, () => { sfx.rain(); L.querySelectorAll('.ear').forEach((e) => api.hop(e, 'wiggle')); });
        at(a, 2800, () => { pose('laugh', 1400, 'shakeOff', 1200); sfx.shake(); api.reward(); });
        at(a, 3900, end);
      }),
    };
  },

  visitors: [
    // no puffin emoji exists: the guest is drawn (html)
    { e: '🐧', html: puffinSvg(), w: 3, path: 'glide', end: ['irishCliffsPuffinFish', 'irishCliffsPuffinHead'], flip: true },
    { e: '🌈', w: 2, path: 'float', end: ['wish'] },
  ],

  // the puffin brings Lucky a fish (he'd rather have a carrot), or lands on his head
  endings: (k) => {
    const puffin = (from, to, ms, opts, faceLeft) => puffinFly(k.fly, from, to, ms, opts, faceLeft);
    const off = () => [k.sceneRect().width + 50, 30];
    return {
      irishCliffsPuffinFish: (a, x, y) => {
        const perch = k.api.luckyPoint(1.02, 0.86);
        puffin([x, y], perch, 800, { arc: 50, size: 34, stay: 2700 }, true);
        k.at(a, 850, () => { grunt(k.sfx); k.fly('🐟', perch, k.paw(), 500, { arc: 30, spin: 200, size: 22, stay: 1000 }); });
        k.at(a, 1350, () => k.pose('surprised', 1100, 'startle', 1100));
        k.at(a, 1900, () => { k.api.setTemp('laugh', 1800); k.line('irishCliffsPuffinFish', 1, 0); });
        k.at(a, 2700, () => k.fly('🐟', k.paw(), perch, 500, { arc: 30, size: 22 }));
        k.at(a, 3500, () => { puffin(perch, off(), 1000, { arc: 60, size: 34 }); k.sfx.whoosh(); k.api.reward(); });
      },
      irishCliffsPuffinHead: (a, x, y) => {
        puffin([x, y], k.head(), 700, { arc: 50, size: 34 });
        k.at(a, 700, () => { k.prop('irishCliffsPuffinHead', 2900); grunt(k.sfx); k.pose('surprised', 1500, 'balance', 2000); k.line('irishCliffsPuffinHead', 1, 0); });
        k.at(a, 2300, () => k.api.setTemp('laugh', 1200));
        k.at(a, 3600, () => { k.unprop('head', true); puffin(k.head(), off(), 1000, { arc: 60, size: 34 }); k.sfx.whoosh(); });
      },
    };
  },
};
