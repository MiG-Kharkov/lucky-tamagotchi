// The winter world's second place: the ice rink. A frozen lake under fairy lights on the firs: Lucky skates, spins and
// lands on his fluffy bottom; a sledging hill (a sled that sometimes goes without him); a hot chocolate stall (a foam
// moustache, flying marshmallows); a snow fort with a snowball fight; and an ice sculpture of a bunny that looks like him.

// fairy lights: a wire that sags between points, with a coloured bulb every few steps
const BULBS = ['#FFD23F', '#FF5FA2', '#6FD3FF', '#8BE07A', '#FF922E'];
let bulbN = 0;
const bulb = (x, y) => { const i = bulbN++; return `<circle class="lwr-bulb amb lwr-b${i % 3}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${BULBS[i % 5]}"/>`; };
const festoon = (pts, sag, step = 0.2) => {
  let wire = '', bulbs = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], cx = (x0 + x1) / 2, cy = Math.max(y0, y1) + sag;
    wire += `M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1} `;
    for (let t = step / 2; t < 1; t += step) {
      const q = 1 - t;
      bulbs += bulb(q * q * x0 + 2 * q * t * cx + t * t * x1, q * q * y0 + 2 * q * t * cy + t * t * y1 + 3);
    }
  }
  return `<path d="${wire}" stroke="#4A5A6A" stroke-width="1.3" fill="none" opacity=".7"/>${bulbs}`;
};
// a soft fir: three rounded tiers with snow along their edges and a few lights
const fir = (x, y, s, lights = []) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="2" width="8" height="10" fill="#8C5A3C"/>
  <path d="M0 -38 C10 -22 20 -8 35 6 Q0 15 -35 6 C-20 -8 -10 -22 0 -38Z" fill="#2F8A5E"/><path d="M-35 6 Q0 15 35 6" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M0 -58 C8 -44 16 -32 27 -20 Q0 -12 -27 -20 C-16 -32 -8 -44 0 -58Z" fill="#37996A"/><path d="M-27 -20 Q0 -12 27 -20" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M0 -76 C6 -64 12 -54 20 -44 Q0 -38 -20 -44 C-12 -54 -6 -64 0 -76Z" fill="#3FA674"/><path d="M-20 -44 Q0 -38 20 -44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${lights.map(([lx, ly], i) => `<circle class="lwr-bulb amb lwr-b${i % 3}" cx="${lx}" cy="${ly}" r="3" fill="${BULBS[(i + 2) % 5]}"/>`).join('')}</g>`;
// a four-pointed sparkle
const spark = (x, y, r, cls) => `<path class="${cls}" d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z" fill="#fff"/>`;
// a marshmallow (there is no emoji for one), for fly()
const mallowSvg = (pink) => `<svg viewBox="0 0 20 20" style="width:1em;height:1em;display:block"><rect x="3" y="4" width="14" height="12" rx="5" fill="${pink ? '#FFC9DE' : '#fff'}" stroke="${pink ? '#F59BC0' : '#E3D6CC'}" stroke-width="1.6"/><ellipse cx="8" cy="7.5" rx="3" ry="1.6" fill="#fff" opacity=".8"/></svg>`;
// the robin on the stall's roof (facing left)
const ROBIN = `<path d="M6 1 l10 5 -2 -7z" fill="#6E5240"/><ellipse rx="9.5" ry="7.5" fill="#8C6A4E"/><circle cx="-6" cy="-6" r="5.6" fill="#8C6A4E"/>
  <path d="M-11.5 -5 q1 9 9 9.5 q5 -2 3 -8 q-5 -4 -12 -1.5z" fill="#F2703A"/><path d="M-11.4 -8 l-4.6 1.8 4.6 1.6z" fill="#3A2A20"/>
  <circle cx="-7.4" cy="-7.6" r="1.4" fill="#1E1A22"/><path d="M2 -4 q5 1 7 5" stroke="#6E5240" stroke-width="1.6" fill="none"/><path d="M-2 7 v3.5 M2 7 v3.5" stroke="#6B4A2E" stroke-width="1.4"/>`;

export default {
  id: 'winterRink',
  world: 'winter',
  name: ['Каток', 'The ice rink'],
  spots: { L: [40, 548], R: [362, 552], l: [130, 664], r: [384, 668], sky: 300 },
  arrive: [
    ['Каток! Лёд гладкий, как зеркало. Где мои коньки?', 'The ice rink! The ice is smooth as a mirror. Where are my skates?'],
    ['Пахнет горячим шоколадом! И огоньки на ёлках горят.', 'It smells of hot chocolate! And the fairy lights are on.'],
  ],

  lines: {
    winterRinkSkate: [['Вжух! Я катаюсь, как настоящий фигурист!', 'Whoosh! I skate like a real figure skater!'], ['Скольжу-скольжу! Лапки сами едут!', 'Sliding along! My paws are going all by themselves!'],
      ['Знаешь, почему коньки скользят? Под ними тонкий слой воды!', "Do you know why skates glide? There's a thin layer of water under them!"]],
    winterRinkSpin: [['Кручусь, как волчок! Ой, всё кружится…', "Spinning like a top! Oh, everything's going round…"], ['Это называется «пируэт»! Красиво?', "That's called a pirouette! Pretty, right?"]],
    winterRinkFall: [['Бух! Прямо на попу. Хорошо, что она пушистая!', "Bump! Right on my bottom. Good thing it's fluffy!"], ['Упал? Нет, это я так отдыхаю. Ха-ха!', "Did I fall? No, I'm just having a little rest. Ha-ha!"]],
    winterRinkShow: [['Показательное выступление! Музыку, пожалуйста!', 'And now, my big show! Music, please!']],
    winterRinkScore: [['Судьи ставят десять! Спасибо, спасибо!', 'The judges give me ten! Thank you, thank you!']],
    winterRinkSled: [['Ух-ху! С горки быстрее ветра!', 'Wheee! Down the hill, faster than the wind!'], ['Держись крепче! Поехали!', 'Hold on tight! Here we go!']],
    winterRinkRunaway: [['Эй, санки, подождите! Вы уехали без меня!', 'Hey, wait, sled! You went without me!']],
    winterRinkRoll: [['Кубарем с горки! Бух в сугроб. Теперь я снежный кролик.', "Tumbling down the hill! Plop, into a snowdrift. Now I'm a snow bunny."]],
    winterRinkClimb: [['Вниз — пять секунд, а наверх — пять минут! Но оно того стоит.', "Down takes five seconds, up takes five minutes! But it's worth it."]],
    winterRinkCocoa: [['Горячий шоколад для кроликов — из морковки! Ой, у меня пенные усы.', "Bunny hot chocolate is made of carrots! Oops, I've got a foam moustache."],
      ['Ммм, тёплое и сладкое! Смотри, у меня усы, как у дедушки.', "Mmm, warm and sweet! Look, I've got a moustache like a grandpa."],
      ['Настоящий шоколад кроликам нельзя. А морковное какао — можно!', "Real chocolate isn't for bunnies. But carrot cocoa is fine!"]],
    winterRinkMallow: [['Зефирки летят! Ам! Ам! Поймал!', 'Flying marshmallows! Chomp! Chomp! Got them!']],
    winterRinkSmell: [['Чуешь, как пахнет? Корица и ваниль!', 'Can you smell that? Cinnamon and vanilla!']],
    winterRinkServe: [['Один горячий шоколад для тебя! С двойными зефирками.', 'One hot chocolate for you! With extra marshmallows.']],
    winterRinkAmbush: [['Снежки! Кто там прячется за крепостью?', "Snowballs! Who's hiding behind that fort?"], ['Снежная битва! Ой, попали!', 'A snowball fight! Oof, got me!']],
    winterRinkThrow: [['Бросок! Ага, белый флаг: они сдаются!', 'Throw! Aha, a white flag: they give up!'], ['Мои снежки самые меткие! Сдаётесь?', 'My snowballs never miss! Do you give up?']],
    winterRinkDuck: [['Мимо, мимо! Меня не поймать!', "Missed me, missed me! You can't catch me!"]],
    winterRinkKing: [['Я король снежной крепости! Ура-а!', "I'm the king of the snow fort! Hooray!"]],
    winterRinkStatue: [['Ледяной кролик! Какой красавец… Погоди, это же я!', "An ice bunny! How handsome… wait, that's me!"], ['Кто-то вырезал меня изо льда! Даже уши похожи.', 'Someone carved me out of ice! Even the ears are right.'],
      ['Ледяные скульптуры вырезают… бензопилой! Представляешь?', 'Ice sculptures are carved with… a chainsaw! Can you imagine?']],
    winterRinkFreeze: [['Тсс, я тоже статуя. Угадай, кто из нас ледяной?', "Shh, I'm a statue too. Guess which one of us is made of ice?"]],
    winterRinkWiggle: [['Он пошевелил ушами? Ледяное волшебство!', 'Did it just wiggle its ears? Ice magic!']],
    winterRinkPolish: [['Полирую до блеска! Теперь он сверкает, как бриллиант.', 'Polishing it up! Now it sparkles like a diamond.']],
  },

  // Lucky stands on the rink. Its things are where a tap always reaches them: the hill and the fort down the left side,
  // the stall and the sculpture down the right, the ice also in a strip in front of his feet (his speech bubble covers
  // the back of the picture while he talks). The two small rects first in the hill's and the stall's names lie under
  // their own pictures, away from the arrows: the first spot found for each, a tap there always reaches it
  art: (u, h) => { bulbN = 0; return `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9CBFF"/><stop offset=".72" stop-color="#F1F6FF"/></linearGradient>
<linearGradient id="${u}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9E9FF"/><stop offset=".55" stop-color="#ACDBF6"/><stop offset="1" stop-color="#C4E6FA"/></linearGradient>
<linearGradient id="${u}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4FCFF"/><stop offset="1" stop-color="#A4D8F4"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6C8"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></radialGradient>
<clipPath id="${u}k"><ellipse cx="350" cy="590" rx="30" ry="24"/><ellipse cx="350" cy="552" rx="26" ry="22"/><ellipse cx="326" cy="566" rx="8.5" ry="21" transform="rotate(12 326 566)"/><ellipse cx="374" cy="566" rx="8.5" ry="21" transform="rotate(-12 374 566)"/></clipPath></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="182" cy="232" r="48" fill="url(#${u}g)"/><circle cx="182" cy="232" r="21" fill="#FFE58A"/></g>
${h.cloud(236, 250, 0.45)}${h.cloud(322, 232, 0.4, 'slow')}
<path d="M0 404 L58 350 L104 380 L182 322 L250 378 L318 340 L400 392 V700 H0Z" fill="#DCE8FB"/>
<path d="M182 322 L202 342 L192 340 L182 350 L174 339 L164 341Z M318 340 L334 355 L325 354 L318 362 L311 353 L303 354Z" fill="#fff"/>
<path d="M0 420 Q200 402 400 422 V700 H0Z" fill="#F4F8FF"/>
${fir(150, 438, 0.8, [[-12, -30], [10, -16], [-22, 0], [16, 4], [0, -52]])}${fir(246, 440, 0.84, [[10, -30], [-12, -12], [20, 2], [-6, -54]])}${fir(198, 434, 1.06, [[-8, -60], [12, -36], [-16, -24], [6, -6], [-26, 4], [24, 2]])}${fir(286, 446, 0.55)}
<g data-tap="rinkHill"><rect x="12" y="506" width="48" height="40" fill="transparent"/></g>
<g data-tap="rinkCocoa"><rect x="340" y="512" width="48" height="28" fill="transparent"/></g>
<g data-tap="rinkIce">
  <path d="M200 446 C318 446 384 516 384 600 C384 676 330 716 200 716 C70 716 16 676 16 600 C16 516 82 446 200 446Z" fill="url(#${u}i)" stroke="#fff" stroke-width="6"/>
  <path d="M200 456 C306 456 370 520 372 596" stroke="#E6F5FF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M104 520 C150 490 230 540 290 504 M90 690 C150 664 250 700 318 676" stroke="#fff" stroke-width="1.8" fill="none" opacity=".75"/>
  <path d="M118 482 l40 -10 M262 480 l36 -9 M140 684 l30 -7 M250 690 l26 -6" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
  <g class="lwr-glint amb">${spark(126, 500, 6, '')}${spark(282, 470, 6, '')}${spark(176, 676, 5, '')}${spark(292, 684, 5, '')}</g></g>
<g data-tap="rinkHill"><rect x="0" y="300" width="72" height="252" fill="transparent"/>
  <path d="M-30 624 V420 C-12 362 18 318 60 316 C102 314 130 356 148 408 C158 436 150 456 128 470 C108 484 98 530 96 624Z" fill="#FAFDFF" stroke="#D3E3F7" stroke-width="2"/>
  <path d="M60 316 C102 314 130 356 148 408 C158 436 150 456 128 470 C112 480 104 500 100 520 C110 470 132 440 128 404 C122 362 96 326 60 316Z" fill="#E3EEFB"/>
  <path d="M66 324 C92 340 116 380 122 430 M76 322 C102 340 126 380 132 428" stroke="#D2E2F6" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  ${fir(18, 420, 0.42)}${fir(30, 376, 0.32)}${fir(56, 470, 0.36)}
  <path d="M122 378 v30" stroke="#8C5A3C" stroke-width="3" stroke-linecap="round"/>
  <g class="lwr-sled"><g transform="translate(70 312) rotate(16)"><path d="M-18 3 H14 q7 0 7 -7" stroke="#8C5A3C" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-10 -1 v4 M6 -1 v4" stroke="#8C5A3C" stroke-width="2.4"/>
    <rect x="-16" y="-7" width="30" height="7" rx="2.5" fill="#E2513B"/><path d="M-14 -4.5 H12" stroke="#fff" stroke-width="1.6" opacity=".6"/></g></g>
  <circle class="lwr-foot" cx="124" cy="440" r="1" fill="none"/></g>
<g pointer-events="none">${festoon([[122, 380], [150, 376], [198, 352], [246, 375], [296, 386]], 14, 0.25)}<path d="M296 384 v40" stroke="#8C5A3C" stroke-width="3" stroke-linecap="round"/></g>
<g data-tap="rinkCocoa"><rect x="296" y="384" width="104" height="166" fill="transparent"/><g transform="translate(0 106)">
  <ellipse cx="350" cy="434" rx="52" ry="6" fill="#000" opacity=".12"/>
  <rect x="308" y="356" width="84" height="76" fill="#D9A06A"/><path d="M308 404 H392 M308 418 H392" stroke="#C4884F" stroke-width="2"/>
  <rect x="316" y="370" width="68" height="26" rx="3" fill="#7A4A30"/><rect x="318" y="372" width="64" height="22" rx="2" fill="#FFD9A0" opacity=".28"/>
  <path d="M296 362 L350 324 L404 362Z" fill="#B23A2B"/>
  <path d="M314 350 L350 324 L386 350 Q378 356 370 350 Q362 357 354 350 Q346 357 338 350 Q330 356 322 350 Q318 354 314 350Z" fill="#fff"/>
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${302 + i * 14} 362 h14 v7 a7 7 0 0 1 -14 0z" fill="${i % 2 ? '#fff' : '#E2513B'}"/>`).join('')}
  ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle class="lwr-bulb amb lwr-b${i % 3}" cx="${302 + i * 13.7}" cy="378" r="2.6" fill="${BULBS[i % 5]}"/>`).join('')}
  <path d="M350 324 V310" stroke="#8C5A3C" stroke-width="3"/><circle cx="350" cy="300" r="13" fill="#FFF6EA" stroke="#A86B3C" stroke-width="2.5"/>
  <rect x="343" y="296" width="11" height="10" rx="2.5" fill="#8C5A3C"/><path d="M354 298 q4 0 4 3 q0 3 -4 3" stroke="#8C5A3C" stroke-width="1.8" fill="none"/><path d="M346 292 q-2 -3 0 -5 M351 292 q2 -3 0 -5" stroke="#C4884F" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <rect x="302" y="394" width="96" height="9" rx="2.5" fill="#A86B3C"/>
  <g class="lwr-mug"><rect x="320" y="378" width="19" height="17" rx="4.5" fill="#E2513B"/><path d="M339 382 q7 0 7 5.5 q0 5.5 -7 5.5" stroke="#E2513B" stroke-width="3" fill="none"/>
    <ellipse cx="329.5" cy="378.5" rx="9.5" ry="3" fill="#7A4A30"/><rect x="322" y="372" width="7" height="7" rx="2.5" fill="#fff" stroke="#E8DCD0"/><rect x="329" y="373" width="7" height="6" rx="2.5" fill="#FFC9DE"/>
    <path d="M326 389 c0 -3 3.5 -3 3.5 0 c0 -3 3.5 -3 3.5 0 c0 2 -3.5 4 -3.5 4 c0 0 -3.5 -2 -3.5 -4z" fill="#fff"/></g>
  <g class="lwr-steam amb" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"><path d="M326 366 q-5 -6 0 -11 q5 -5 0 -10"/><path d="M334 364 q5 -6 0 -11 q-5 -5 0 -10"/></g>
  <path d="M358 384 h22 v7 q0 4 -4 4 h-14 q-4 0 -4 -4z" fill="#C3CAD6"/><rect x="356" y="381" width="26" height="4" rx="2" fill="#AEB6C4"/><path d="M376 381 l8 -12" stroke="#8C5A3C" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M310 432 v8 M390 432 v8" stroke="#A86B3C" stroke-width="4"/>
  <g class="lwr-robin amb"><g transform="translate(318 336)">${ROBIN}</g></g></g></g>
<g data-tap="rinkFort"><rect x="0" y="552" width="104" height="140" fill="transparent"/><g transform="translate(0 34)">
  <ellipse cx="54" cy="650" rx="56" ry="6" fill="#000" opacity=".1"/>
  <g class="lwr-flag"><path d="M90 590 V528" stroke="#8C5A3C" stroke-width="3" stroke-linecap="round"/><path d="M91 529 q12 2 22 8 q-10 4 -22 8z" fill="#FF5FA2"/></g>
  ${[[2, 624, 34, 24], [36, 624, 34, 24], [70, 624, 32, 24], [2, 600, 18, 24], [20, 600, 34, 24], [54, 600, 34, 24], [88, 600, 14, 24],
    [2, 576, 34, 24], [36, 576, 34, 24], [70, 576, 32, 24], [2, 556, 24, 22], [42, 556, 24, 22], [80, 556, 22, 22]].map(([x, y, w, hh]) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="7" fill="#DDEAFA"/><rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${hh - 6}" rx="6" fill="#fff"/>`).join('')}
  <path d="M10 562 q7 -3 14 0 M50 562 q7 -3 14 0" stroke="#EEF5FE" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <g fill="#fff" stroke="#D2E3F8" stroke-width="1.6"><circle cx="14" cy="644" r="7.5"/><circle cx="30" cy="644" r="7.5"/><circle cx="22" cy="632" r="7.5"/></g></g></g>
<g data-tap="rinkStatue"><rect x="300" y="556" width="100" height="136" fill="transparent"/><g transform="translate(2 40)">
  <ellipse cx="350" cy="649" rx="44" ry="5" fill="#000" opacity=".1"/>
  <rect x="314" y="614" width="72" height="34" rx="5" fill="#DCEEFC"/><rect x="314" y="614" width="72" height="9" rx="4.5" fill="#fff"/><path d="M322 632 h16 M350 640 h20" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
  <g class="lwr-ice" stroke="#B4DDF4" stroke-width="1.4">
    <circle cx="379" cy="600" r="9" fill="url(#${u}c)"/>
    <ellipse cx="350" cy="590" rx="30" ry="24" fill="url(#${u}c)"/>
    <ellipse cx="334" cy="611" rx="12" ry="5" fill="#E9F7FF"/><ellipse cx="366" cy="611" rx="12" ry="5" fill="#E9F7FF"/>
    <path d="M343 533 q3.5 -8 7 -1.5 q3.5 -6.5 7 1.5" fill="#E9F7FF"/>
    <ellipse cx="350" cy="552" rx="26" ry="22" fill="url(#${u}c)"/>
    <g class="lwr-ear"><ellipse cx="326" cy="566" rx="8.5" ry="21" transform="rotate(12 326 566)" fill="url(#${u}c)"/></g>
    <g class="lwr-ear"><ellipse cx="374" cy="566" rx="8.5" ry="21" transform="rotate(-12 374 566)" fill="url(#${u}c)"/></g></g>
  <ellipse cx="350" cy="596" rx="16" ry="14" fill="#fff" opacity=".45"/>
  <circle cx="341" cy="550" r="2.8" fill="#7DB8E0"/><circle cx="359" cy="550" r="2.8" fill="#7DB8E0"/><circle cx="342" cy="549" r=".9" fill="#fff"/><circle cx="360" cy="549" r=".9" fill="#fff"/>
  <path d="M346 557 q4 -2.5 8 0 q-1.4 3.6 -4 4 q-2.6 -.4 -4 -4z" fill="#8CC6EA"/><path d="M346 565 q4 3 8 0" stroke="#8CC6EA" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M334 540 q5 -9 14 -10 M330 582 q3 -9 12 -11" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g clip-path="url(#${u}k)"><g class="lwr-sweep"><path d="M296 520 h16 l-32 112 h-16z" fill="#fff" opacity=".85"/></g></g>
  ${spark(318, 530, 6, 'lwr-spark amb')}${spark(386, 548, 5, 'lwr-spark amb s1')}${spark(330, 600, 4.5, 'lwr-spark amb s2')}${spark(372, 620, 4, 'lwr-spark amb s1')}</g></g>
<g data-tap="rinkIce"><rect x="104" y="670" width="192" height="30" fill="transparent"/></g>
<g pointer-events="none">${h.snow(14)}</g>
</svg>`; },

  css: `
.lwr-bulb.amb { animation: lwrBulb 1.8s ease-in-out infinite; }
.lwr-bulb.lwr-b1 { animation-delay: -.6s; } .lwr-bulb.lwr-b2 { animation-delay: -1.2s; }
@keyframes lwrBulb { 50% { opacity: .35; } }
.lwr-steam.amb { animation: lwrSteam 2.6s ease-in-out infinite; }
@keyframes lwrSteam { 0% { transform: translateY(4px); opacity: 0; } 40% { opacity: .9; } 100% { transform: translateY(-10px); opacity: 0; } }
.lwr-robin.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: lwrRobin 3.8s ease-in-out infinite; }
@keyframes lwrRobin { 0%, 70%, 100% { transform: none; } 76% { transform: rotate(-12deg); } 84% { transform: rotate(6deg); } }
.lwr-spark { transform-box: fill-box; transform-origin: 50% 50%; }
.lwr-spark.amb { animation: lwrSpark 2.4s ease-in-out infinite; }
.lwr-spark.s1 { animation-delay: -.8s; } .lwr-spark.s2 { animation-delay: -1.6s; }
@keyframes lwrSpark { 0%, 100% { transform: scale(.3); opacity: .2; } 50% { transform: scale(1); opacity: 1; } }
.lwr-glint.amb { animation: lwrGlint 3.2s ease-in-out infinite; }
@keyframes lwrGlint { 50% { opacity: .25; } }
[data-tap="rinkIce"].tapped, [data-tap="rinkHill"].tapped { animation: lwrTap .5s ease-out; }
@keyframes lwrTap { 40% { transform: scale(1.03); } }
[data-tap="rinkIce"].lwrflash .lwr-glint { animation: lwrFlash .5s ease-in-out 3; }
@keyframes lwrFlash { 50% { opacity: 1; transform: translateY(-2px); } }
[data-tap="rinkHill"].lwrslide .lwr-sled { animation: lwrSlide 2s ease-in; }
.lwr-sled { transform-box: fill-box; transform-origin: 50% 50%; }
@keyframes lwrSlide { 0% { transform: none; } 15% { transform: translate(24px, 15px) rotate(8deg); } 28% { transform: translate(49px, 46px) rotate(26deg); }
  40% { transform: translate(65px, 73px) rotate(34deg); } 50% { transform: translate(90px, 124px) rotate(30deg); opacity: 1; }
  52%, 88% { transform: translate(90px, 124px); opacity: 0; } 90% { transform: none; opacity: 0; } 100% { opacity: 1; } }
[data-tap="rinkHill"].lwrgone .lwr-sled { visibility: hidden; }
[data-tap="rinkCocoa"].lwrpuff .lwr-steam { transform-box: fill-box; transform-origin: 50% 100%; animation: lwrPuff 1.4s ease-out; }
@keyframes lwrPuff { 0% { transform: none; opacity: 1; } 100% { transform: translateY(-24px) scale(1.7); opacity: 0; } }
[data-tap="rinkCocoa"].lwrgone .lwr-mug { visibility: hidden; }
[data-tap="rinkFort"].lwrshake { transform-origin: 50% 100%; animation: lwrShake .25s ease-in-out 4; }
@keyframes lwrShake { 25% { transform: rotate(-1.5deg); } 75% { transform: rotate(1.5deg); } }
.lwr-flag { transform-box: fill-box; transform-origin: 0 100%; }
[data-tap="rinkFort"].lwrwave .lwr-flag { animation: lwrWave .3s ease-in-out 6 alternate; }
@keyframes lwrWave { from { transform: rotate(-6deg); } to { transform: rotate(6deg) scaleX(.9); } }
.lwr-sweep { opacity: 0; }
[data-tap="rinkStatue"].lwrshine .lwr-sweep { animation: lwrSweep 1.2s ease-in-out; }
@keyframes lwrSweep { 0% { opacity: 1; transform: none; } 100% { opacity: 1; transform: translateX(132px); } }
.lwr-ear { transform-box: fill-box; transform-origin: 50% 0; }
[data-tap="rinkStatue"].lwrears .lwr-ear { animation: lwrEar .3s ease-in-out 4 alternate; }
@keyframes lwrEar { from { transform: rotate(-16deg); } to { transform: rotate(16deg); } }
/* his own skating sway: the game's .skate class also places Tali's skateboard (it would move him down) */
.lucky.lwr-skate { animation: lwrSkate 1s ease-in-out; }
@keyframes lwrSkate { 30% { rotate: -10deg; translate: 0 -2%; } 70% { rotate: 8deg; translate: 0 -1%; } }
.lucky.lwr-frost .l-art { filter: grayscale(1) sepia(1) hue-rotate(165deg) saturate(1.7) brightness(1.18); }
`,

  props: () => ({
    winterRinkSkates: { slot: 'feet', art: () => [67, 133].map((x) => `<g><path d="M${x - 22} 198 q0 -14 14 -15 h16 q14 1 14 15 z" fill="#fff" stroke="#D6E3F2" stroke-width="2"/>
      <path d="M${x - 6} 186 l6 4 6 -4 M${x - 6} 191 l6 4 6 -4" stroke="#FF5FA2" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M${x - 14} 198 v5 M${x + 14} 198 v5" stroke="#9AA8BA" stroke-width="3"/><path d="M${x - 24} 205 H${x + 22} q7 0 6 -7" stroke="#B8C4D4" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>`).join('') },
    winterRinkMug: { slot: 'hand', art: () => `<g transform="translate(158 158)"><path d="M10 -4 q10 0 10 8 q0 8 -10 8" stroke="#E2513B" stroke-width="4.5" fill="none"/><rect x="-13" y="-12" width="25" height="26" rx="6" fill="#E2513B"/>
      <ellipse cx="-0.5" cy="-12" rx="12.5" ry="4" fill="#7A4A30"/><rect x="-10" y="-20" width="9" height="9" rx="3" fill="#fff" stroke="#E8DCD0"/><rect x="0" y="-19" width="9" height="8" rx="3" fill="#FFC9DE"/>
      <path d="M-6 2 c0 -4 5 -4 5 0 c0 -4 5 -4 5 0 c0 3 -5 6 -5 6 c0 0 -5 -3 -5 -6z" fill="#fff"/>
      <g class="lwr-steam amb" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-6 -24 q-5 -6 0 -11 q5 -5 0 -10"/><path d="M4 -26 q5 -6 0 -11 q-5 -5 0 -10"/></g></g>` },
    // the king of the snow fort: a gold crown with snowballs on its points
    winterRinkCrown: { slot: 'head', art: () => `<g transform="rotate(-8 100 40)"><path d="M72 50 L70 22 L84 36 L92 16 L100 32 L108 16 L116 36 L130 22 L128 50Z" fill="#FFD23F" stroke="#E6A800" stroke-width="2" stroke-linejoin="round"/>
      <rect x="71" y="44" width="58" height="8" rx="3" fill="#FFC21A" stroke="#E6A800" stroke-width="1.5"/><circle cx="86" cy="48" r="2.6" fill="#FF5FA2"/><circle cx="100" cy="48" r="2.8" fill="#6FD3FF"/><circle cx="114" cy="48" r="2.6" fill="#FF5FA2"/>
      <g fill="#fff" stroke="#DCE8FB" stroke-width="1"><circle cx="70" cy="21" r="3.6"/><circle cx="92" cy="15" r="3.6"/><circle cx="108" cy="15" r="3.6"/><circle cx="130" cy="21" r="3.6"/></g></g>` },
    winterRinkFoam: { slot: 'mouth', art: () => `<path d="M100 110 q-6 -6 -15 -4 q-9 3 -10 12 q7 -5 13 -1 q7 2 12 -7z M100 110 q6 -6 15 -4 q9 3 10 12 q-7 -5 -13 -1 q-7 2 -12 -7z" fill="#FFF1DE" stroke="#A8693F" stroke-width="2" stroke-linejoin="round"/>
      <path d="M84 110 q5 -2 9 0 M107 110 q5 -2 9 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  }),

  reactions: (R, k) => {
    const { api, L, sfx, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, topOf, nextTo, head, mouth, feet, paw, sceneRect } = k;
    const partOf = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };

    // the ice: he skates across and back, spins till he's dizzy, lands on his bottom; a long press is a whole show
    const skate = () => {
      const a = begin('lwrSkate'), first = Math.random() < 0.5 ? 30 : 70;
      prop('winterRinkSkates', 3600);
      go(first, 1000);
      hold(a, 'lwr-skate', 1000);
      sfx.whoosh();
      api.setTemp('laugh', 3000);
      line('winterRinkSkate', 1, 0);
      at(a, 1100, () => { go(100 - first, 1300); api.hop(L, 'lwr-skate', 1000); sfx.whoosh(); api.fxAt(...feet(), ['✨', '❄️'], 3, 'spark'); });
      at(a, 2500, () => { api.reward(); end(); });
    };
    const spin = () => {
      const a = begin('lwrSpin');
      prop('winterRinkSkates', 3400);
      pose('laugh', 1600, 'spinout', 1400);
      sfx.whirr();
      api.fxAt(...feet(), ['✨', '❄️'], 6, 'spark');
      at(a, 1450, () => { prop('dizzy', 2000); api.setTemp('dizzy', 1800); line('winterRinkSpin', 1, 0); });
      at(a, 3200, end);
    };
    R.rinkIce = {
      press: (c) => { sfx.sparkle(); api.fxAt(c.x, c.y, ['✨', '❄️'], 4, 'spark'); },
      tap: who(oneOf('winterRinkIce', skate, spin)),
      double: who((c) => {
        const a = begin('lwrFall');
        api.hop(c.el, 'lwrflash', 1500);
        pose('surprised', 700, 'slip', 1800);
        at(a, 600, () => { sfx.bonk(); api.fxAt(...feet(), ['💫', '❄️'], 5, 'spark'); api.setTemp('laugh', 2000); line('winterRinkFall', 1, 0); });
        at(a, 2100, end);
      }),
      long: who(() => {
        const a = begin('lwrShow'), [hx, hy] = head();
        prop('winterRinkSkates', 7200);
        line('winterRinkShow', 1, 0);
        [523, 659, 784, 659, 523, 659, 784, 1047].forEach((f, i) => at(a, i * 320, () => sfx.note(f)));
        at(a, 300, () => { go(30, 900); api.hop(L, 'lwr-skate', 1000); api.setTemp('happy', 2400); });
        at(a, 1300, () => { go(70, 1200); api.hop(L, 'lwr-skate', 1000); sfx.whoosh(); api.fxAt(...feet(), ['✨'], 3, 'spark'); });
        at(a, 2600, () => { go(50, 800); });
        at(a, 3400, () => { pose('laugh', 1600, 'pirouette', 1500); sfx.magic(); api.fxAt(...feet(), ['✨', '❄️'], 6, 'spark'); });
        at(a, 5000, () => { pose('happy', 2200, 'bow', 1500); });
        at(a, 5600, () => {
          [-90, 0, 90].forEach((dx, i) => at(a, i * 200, () => { popUp('🔟', hx + dx, hy - 30 + Math.abs(dx) / 3, 2200, 32, 'pop-rise'); sfx.pop(); }));
          sfx.fanfare();
          api.hearts(hx, hy, 5);
          line('winterRinkScore', 1, 0);
          api.reward();
        });
        at(a, 7600, end);
      }),
    };

    // the sledging hill: down on the sled; the sled runs off without him; rolling down into a snowdrift; the long climb
    const sledDown = (a, to, ms) => {
      prop('sled', ms + 300);
      hold(a, 'sled', ms);
      api.setTemp('laugh', ms);
      sfx.whoosh();
      go(to, ms);
      [0, ms / 2].forEach((d) => at(a, d, () => api.fxAt(...feet(), ['❄️', '💨'], 4, 'spark')));
    };
    const ride = (c) => {
      const a = begin('lwrSled');
      go(28, 600);
      at(a, 650, () => {
        c.el.classList.add('lwrgone');
        onEnd(a, () => c.el.classList.remove('lwrgone'));
        fly('🛷', partOf(c, '.lwr-sled'), feet(), 500, { arc: 30, size: 40 });
      });
      at(a, 1150, () => { sledDown(a, 72, 1600); line('winterRinkSled', 1, 0); });
      at(a, 2850, () => { unprop('feet'); pose('happy', 1500, 'proud', 1200); api.reward(); });
      at(a, 4000, end);
    };
    const runaway = (c) => {
      const a = begin('lwrRunaway');
      api.hop(c.el, 'lwrslide', 2000);
      sfx.whoosh();
      at(a, 400, () => { pose('surprised', 1400, 'startle', 1100); line('winterRinkRunaway', 1, 0); });
      at(a, 1000, () => { const [x, y] = partOf(c, '.lwr-foot'); fly('🛷', [x, y], [sceneRect().width + 60, feet()[1] - 20], 1300, { size: 40 }); sfx.whoosh(); });
      at(a, 1300, () => { go(74, 900); hold(a, 'scared', 900); });
      at(a, 2400, () => { pose('laugh', 1500, 'hop'); });
      at(a, 3400, end);
    };
    R.rinkHill = {
      press: (c) => { sfx.puff(); api.fxAt(c.x, c.y, ['❄️'], 4, 'spark'); },
      tap: who(oneOf('winterRinkHill', ride, runaway)),
      double: who(() => {
        const a = begin('lwrRoll');
        go(28, 600);
        at(a, 650, () => { pose('laugh', 1400, 'roll', 1400); go(62, 1300); sfx.whoosh(); api.fxAt(...feet(), ['❄️'], 5, 'spark'); });
        at(a, 2000, () => { sfx.puff(); prop('snowcap', 2800); api.fxAt(...head(), ['❄️'], 8, 'spark'); hold(a, 'squash', 700); api.setTemp('surprised', 900); });
        at(a, 2700, () => { api.setTemp('laugh', 1600); line('winterRinkRoll', 1, 0); });
        at(a, 4300, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); });
        at(a, 5300, end);
      }),
      long: who((c) => {
        const a = begin('lwrClimb');
        go(26, 700);
        at(a, 750, () => {
          c.el.classList.add('lwrgone');
          onEnd(a, () => c.el.classList.remove('lwrgone'));
          hold(a, 'climb', 1800);
          api.setTemp('tired', 1900);
          line('winterRinkClimb', 1, 0);
          [0, 450, 900, 1350].forEach((d) => at(a, d, () => sfx.tap()));
        });
        at(a, 2700, () => sledDown(a, 74, 1500));
        at(a, 4300, () => { unprop('feet'); pose('happy', 1500, 'binky'); api.reward(); });
        at(a, 5400, end);
      }),
    };

    // the hot chocolate stall: a mug and a foam moustache; marshmallows to catch; the smell; a mug for her
    const mugAt = (c) => partOf(c, '.lwr-mug');
    const drink = (c) => {
      const a = begin('lwrCocoa');
      c.el.classList.add('lwrgone');
      onEnd(a, () => c.el.classList.remove('lwrgone'));
      fly('☕', mugAt(c), paw(), 700, { arc: 50, size: 28 });
      at(a, 700, () => { prop('winterRinkMug', 2000); api.setTemp('eat', 1700); sfx.slurp(); });
      at(a, 1500, () => sfx.slurp());
      at(a, 2400, () => { unprop('hand'); prop('winterRinkFoam', 3600); pose('laugh', 1800, 'hop'); line('winterRinkCocoa', 1, 0); api.reward(); });
      at(a, 4800, end);
    };
    const mallows = (c) => {
      const a = begin('lwrMallow'), from = mugAt(c);
      line('winterRinkMallow', 1, 0);
      [0, 650, 1300].forEach((d, i) => {
        at(a, d, () => { const s = fly('', from, mouth(), 650, { arc: 80, spin: 220, size: 22 }); s.innerHTML = mallowSvg(i === 1); sfx.whoosh(); });
        at(a, d + 650, () => { api.setTemp('eat', 550); sfx.crunch(); });
      });
      at(a, 2500, () => { pose('happy', 1500, 'binky'); api.reward(); });
      at(a, 3500, end);
    };
    R.rinkCocoa = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['💨'], 2, 'spark'); },
      tap: who(oneOf('winterRinkCocoa', drink, mallows)),
      double: (c) => {
        api.hop(c.el, 'lwrpuff', 1400);
        sfx.bubble();
        const [x, y] = mugAt(c);
        api.hearts(x, y - 20, 2);
        if (api.free()) { pose('happy', 2000, 'sniff', 1500); line('winterRinkSmell', 1); }
      },
      long: who((c) => {
        const a = begin('lwrServe');
        go(nextTo(c.el), 700);
        at(a, 750, () => { prop('winterRinkMug', 1800); pose('happy', 2000, 'proud', 1200); sfx.ding(); line('winterRinkServe', 1, 0); });
        at(a, 2500, () => {
          unprop('hand');
          const { width: w, height: hh } = sceneRect();
          popUp('☕', w / 2, hh * 0.76, 2400, 64, 'pop-stay');
          api.hearts(w / 2, hh * 0.66, 4);
          sfx.happy();
          api.reward();
        });
        at(a, 3800, end);
      }),
    };

    // the snow fort: snowballs fly from behind it; he throws back (a white flag!); he ducks a volley; king of the fort
    const fortAt = (c) => { const [x, y] = topOf(c.el); return [x, y + 24]; };
    const ambush = (c) => {
      const a = begin('lwrAmbush'), from = fortAt(c), [hx, hy] = head();
      sfx.whoosh();
      fly('⚪', from, [hx + 90, hy - 30], 600, { arc: 60, size: 20 });
      at(a, 500, () => { sfx.whoosh(); fly('⚪', from, [hx - 80, hy + 20], 600, { arc: 50, size: 20 }); pose('surprised', 1200, 'dodge', 1100); });
      at(a, 1200, () => { sfx.whoosh(); fly('⚪', from, head(), 550, { arc: 50, size: 22 }); });
      at(a, 1750, () => { sfx.puff(); prop('snowcap', 2400); api.fxAt(...head(), ['❄️'], 6, 'spark'); hold(a, 'shiver', 900); api.setTemp('laugh', 1800); line('winterRinkAmbush', 1, 0); });
      at(a, 3500, () => { sfx.shake(); api.hop(L, 'shakeOff', 1200); unprop('head'); });
      at(a, 4600, end);
    };
    const throwBack = (c) => {
      const a = begin('lwrThrow'), [fx, fy] = fortAt(c);
      pose('cheeky', 1400, 'throw', 600);
      at(a, 200, () => { sfx.whoosh(); fly('⚪', paw(), [fx, fy], 600, { arc: 80, size: 22 }); });
      at(a, 800, () => { sfx.puff(); api.fxAt(fx, fy, ['❄️'], 6, 'spark'); api.hop(c.el, 'lwrshake', 1000); });
      at(a, 1400, () => { popUp('🏳️', fx - 14, fy - 14, 2200, 30, 'pop-rise'); sfx.ding(); });
      at(a, 1700, () => { pose('laugh', 1500, 'binky'); line('winterRinkThrow', 1, 0); api.reward(); });
      at(a, 3200, end);
    };
    R.rinkFort = {
      press: (c) => { sfx.puff(); api.fxAt(c.x, c.y, ['❄️'], 3, 'spark'); },
      tap: who(oneOf('winterRinkFort', ambush, throwBack)),
      double: who((c) => {
        const a = begin('lwrDuck'), from = fortAt(c), w = sceneRect().width;
        hold(a, 'crouch', 1500);
        api.setTemp('surprised', 1400);
        [0, 250, 500, 750].forEach((d, i) => at(a, d, () => { sfx.whoosh(); fly('⚪', from, [w + 30, head()[1] - 50 - i * 14], 800, { arc: 50, size: 20 }); }));
        at(a, 1600, () => { pose('laugh', 1500, 'binky'); line('winterRinkDuck', 1, 0); });
        at(a, 2800, end);
      }),
      long: who((c) => {
        const a = begin('lwrKing');
        go(nextTo(c.el, 8), 700);
        at(a, 750, () => { hold(a, 'climb', 1800); [0, 500, 1000].forEach((d) => at(a, d, () => sfx.tap())); });
        at(a, 2500, () => { prop('winterRinkCrown', 6000); api.hop(c.el, 'lwrwave', 1800); sfx.fanfare(); pose('happy', 2000, 'proud', 1200); line('winterRinkKing', 1, 0); api.reward(); });
        at(a, 4300, end);
      }),
    };

    // the ice sculpture: a bunny just like Lucky. It gleams; he freezes into a statue too; it wiggles its ears; polishing
    const shine = (c) => {
      api.hop(c.el, 'lwrshine', 1300);
      sfx.sparkle();
      api.fxAt(c.x, c.y, ['✨'], 5, 'spark');
      setTimeout(() => { if (api.free()) { pose('happy', 1600, 'proud', 1200); line('winterRinkStatue', 1); } }, 400);
    };
    const freeze = () => {
      const a = begin('lwrFreeze');
      sfx.magic();
      hold(a, 'statue', 2800);
      hold(a, 'lwr-frost', 2800);
      api.setTemp('ok', 2800);
      api.fxAt(...head(), ['❄️', '✨'], 5, 'spark');
      line('winterRinkFreeze', 1, 0);
      at(a, 2900, () => { sfx.sneeze(); pose('laugh', 1500, 'sneeze'); });
      at(a, 4000, end);
    };
    R.rinkStatue = {
      press: (c) => { sfx.chime(); api.fxAt(c.x, c.y, ['✨'], 4, 'spark'); },
      tap: who(oneOf('winterRinkStatue', shine, freeze)),
      double: (c) => {
        api.hop(c.el, 'lwrears', 1300);
        sfx.boing();
        if (!api.free()) return;
        pose('surprised', 1500, 'startle', 1100);
        line('winterRinkWiggle', 1);
        setTimeout(() => { if (api.free()) { api.setTemp('cheeky', 1400); L.querySelectorAll('.ear').forEach((x) => api.hop(x, 'wiggle')); } }, 1300);
      },
      long: who((c) => {
        const a = begin('lwrPolish');
        go(nextTo(c.el, 16), 700);
        [800, 1300, 1800].forEach((d) => at(a, d, () => { pose('happy', 700, 'pat', 500); sfx.squeak(); api.fxAt(c.x, c.y, ['✨', '🫧'], 3, 'spark'); }));
        at(a, 2400, () => { api.hop(c.el, 'lwrshine', 1300); sfx.sparkle(); api.fxAt(c.x, c.y, ['✨', '💎'], 6, 'spark'); pose('happy', 1600, 'proud', 1200); line('winterRinkPolish', 1, 0); api.reward(); });
        at(a, 3800, end);
      }),
    };
  },

  visitors: [
    { e: '❄️', w: 3, path: 'fall', end: ['tongue', 'flakes'] },
    { e: '🐦', w: 2, path: 'glide', end: ['sing'], flip: true },
  ],
};
