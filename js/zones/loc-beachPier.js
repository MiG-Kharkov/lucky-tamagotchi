// The seaside's second place, a little further along the beach: a wooden pier going out to sea (Lucky jumps off it;
// a cheeky seagull sits on its last post), a red-and-white lighthouse on the rocks, a striped beach hut to change in,
// a sandcastle, and a message in a bottle washed up on the sand.

// a seagull sitting, facing right (the pier's post, Lucky's head)
const GULL_SIT = `<ellipse cx="0" cy="0" rx="10" ry="6.5" fill="#fff" stroke="#DCE3EC" stroke-width="1"/><path d="M-9 1 l-8 -2 3 5z" fill="#4A5468"/>
  <path d="M-8 -2 q8 -5 16 0 q-6 4 -16 2z" fill="#C9D2DE"/><circle cx="9" cy="-7" r="5" fill="#fff" stroke="#DCE3EC" stroke-width="1"/>
  <path d="M13.5 -7.5 l6.5 1.8 -6.5 2.2z" fill="#FFB347"/><circle cx="18" cy="-5.2" r=".9" fill="#E8413A"/><circle cx="10.5" cy="-8.2" r="1.2" fill="#2A2730"/>
  <path d="M-2 6 v4.5 M3 6 v4.5" stroke="#FFB347" stroke-width="1.8" stroke-linecap="round"/>`;
// a seagull flying, facing left (fly() turns it to where it flies)
const GULL_FLY = `<path d="M11 3 l13 -5 -3 9z" fill="#fff" stroke="#D5DCE6" stroke-width="1"/><path d="M2 0 Q-2 -15 -12 -19 Q-5 -9 -7 1Z" fill="#C9D2DE"/>
  <ellipse cx="0" cy="2" rx="14" ry="7.5" fill="#fff" stroke="#D5DCE6" stroke-width="1"/><circle cx="-13" cy="-2" r="6.5" fill="#fff" stroke="#D5DCE6" stroke-width="1"/>
  <path d="M-19 -2.5 l-8 2 8 2.6z" fill="#FFB347"/><circle cx="-24.5" cy=".2" r="1" fill="#E8413A"/><circle cx="-14.5" cy="-3.5" r="1.4" fill="#2A2730"/>
  <path d="M3 2 Q9 -14 25 -20 Q15 -5 13 4Z" fill="#E3E9F1"/><path d="M25 -20 q-6 1 -8 5 l5 0z" fill="#4A5468"/>`;
const gullSvg = (w = '1.5em') => `<svg viewBox="-30 -23 60 40" style="width:${w};height:auto;display:block;overflow:visible">${GULL_FLY}</svg>`;
// the bottle with a note, lying on its side
const BOTTLE = `<rect x="-26" y="-10" width="38" height="20" rx="9" fill="#8FE3C4" fill-opacity=".92" stroke="#5FC7A3" stroke-width="1.2"/>
  <rect x="10" y="-5" width="14" height="10" rx="3" fill="#8FE3C4" fill-opacity=".92" stroke="#5FC7A3" stroke-width="1.2"/><rect x="23" y="-4" width="7" height="8" rx="2" fill="#C98E5A"/>
  <rect x="-20" y="-5" width="24" height="9" rx="4.5" fill="#FFF6E0"/><path d="M-8 -5 v9" stroke="#FF5FA2" stroke-width="2"/>
  <path d="M-20 -6.5 h22" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".75"/>`;
const bottleSvg = (w = '1.8em') => `<svg viewBox="-28 -12 60 24" style="width:${w};height:auto;display:block;overflow:visible">${BOTTLE}</svg>`;
const BALL = `<circle r="20" fill="#FF5FA2"/><path d="M0 0 L0 -20 A20 20 0 0 1 20 0Z M0 0 L0 20 A20 20 0 0 1 -20 0Z" fill="#fff"/><path d="M0 0 L20 0 A20 20 0 0 1 0 20Z" fill="#FFD23F"/><circle r="3.5" fill="#fff" stroke="#FF5FA2" stroke-width="1.5"/>`;
const ballSvg = (w = '1em') => `<svg viewBox="-21 -21 42 42" style="width:${w};height:auto;display:block">${BALL}</svg>`;
// something drawn, flown with fly(): a bird faces where it flies (drawn facing left)
const drawnFly = (fly, svg, from, to, ms, opts, turn = false) => {
  const s = fly('', from, to, ms, opts);
  s.innerHTML = svg;
  if (turn && to[0] > from[0]) s.firstChild.style.transform = 'scaleX(-1)';
  return s;
};

// the pier: its deck rises from the beach (left) out over the sea
const deckTop = (x) => 446 - (x + 4) * (44 / 186);
const deckBot = (x) => deckTop(x) + 14 - (x + 4) * (7 / 186);
const railH = (x) => 24 - (x + 4) * (10 / 186);
// the lighthouse's tower: a red-and-white cone from y 270 to 480 (its lantern sits above, up in the sky)
const hw = (y) => 17 + (y - 270) * (10 / 210);
const band = (y0, y1, c) => `<path d="M${336 - hw(y0)} ${y0} H${336 + hw(y0)} L${336 + hw(y1)} ${y1} H${336 - hw(y1)}Z" fill="${c}"/>`;
// sandcastle towers: a bucket shape with battlements on top
const merlons = (x0, x1, y) => { let s = ''; for (let x = x0; x + 4 <= x1 + 0.5; x += 7) s += `<rect x="${x}" y="${y - 6}" width="4.5" height="7" rx="1" fill="#F7CF8B"/>`; return s; };
const bucket = (xl, xr, top, bot, d = 3) => `<path d="M${xl} ${bot} L${xl + d} ${top} H${xr - d} L${xr} ${bot}Z" fill="#F7CF8B"/>${merlons(xl + d, xr - d - 4, top)}
  <path d="M${xl + 1} ${top + (bot - top) * 0.4} H${xr - 1} M${xl + 0.5} ${top + (bot - top) * 0.72} H${xr - 0.5}" stroke="#E8B868" stroke-width="1.6"/>`;

export default {
  id: 'beachPier',
  world: 'beach',
  name: ['Пирс и маяк', 'The pier'],
  spots: { L: [40, 548], R: [360, 500], l: [22, 668], r: [384, 668], sky: 300 },
  arrive: [
    ['Пирс и маяк! Отсюда видно всё море.', 'The pier and the lighthouse! You can see the whole sea from here.'],
    ['Чайки кричат, волны шумят… Пахнет морем и приключениями!', 'Seagulls calling, waves splashing… It smells like the sea and adventures!'],
  ],

  lines: {
    beachPierBeam: [['Маяк светит кораблям, чтобы они не налетели на скалы.', "The lighthouse shines for the ships so they don't hit the rocks."],
      ['У каждого маяка свой ритм вспышек. Так моряки узнают, где они.', "Every lighthouse has its own flash pattern. That's how sailors know where they are."],
      ['Луч бежит по кругу: вжух… вжух… Красота!', 'The beam goes round and round: whoosh… whoosh… Beautiful!']],
    beachPierHorn: [['Бу-у-у! Это туманный горн. В тумане его слышно издалека.', "Boooo! That's the foghorn. In the fog you can hear it from far away."],
      ['Ого, какой громкий! У меня даже уши подпрыгнули.', 'Whoa, so loud! Even my ears jumped.']],
    beachPierBlink: [['Маяк мне подмигнул! Подмигиваю в ответ.', "The lighthouse winked at me! I'm winking back."]],
    beachPierWatch: [['Смотрю в подзорную трубу… Корабль на горизонте!', 'Looking through my telescope… A ship on the horizon!'],
      ['Смотрю в подзорную трубу… Ой, кит пускает фонтан!', 'Looking through my telescope… Oh, a whale is blowing a fountain!']],
    beachPierTower: [['Ещё одна башня! Теперь мой замок самый высокий на пляже.', 'One more tower! Now my castle is the tallest on the beach.'],
      ['Башенка готова, и флажок на ней! Король песка доволен.', 'The tower is done, with a flag on top! The King of Sand is pleased.']],
    beachPierWashed: [['Ой, волна смыла замок! Ничего, построим новый, ещё лучше.', "Oh no, a wave washed the castle away! Never mind, we'll build a better one."],
      ['Море тоже любит песочные замки. Только забирает их себе!', 'The sea loves sandcastles too. It just keeps them for itself!']],
    beachPierCrab: [['В замке поселился краб! Добро пожаловать, Ваше Крабейшество!', 'A crab has moved into the castle! Welcome, Your Crabjesty!']],
    beachPierKnight: [['Ведёрко вместо шлема! Я рыцарь песочного замка.', "A bucket for a helmet! I'm the knight of the sandcastle."]],
    beachPierChanging: [['Не подглядывать! Я переодеваюсь.', "No peeking! I'm getting changed."], ['Минуточку! Кролик переодевается.', 'Just a minute! Bunny getting changed.']],
    beachPierSwimsuit: [['Та-да! Полосатый купальник, как сто лет назад!', 'Ta-da! A stripy swimsuit, like they wore a hundred years ago!'],
      ['Ну как я вам? Самый модный кролик на пляже!', 'How do I look? The most stylish bunny on the beach!']],
    beachPierArmbands: [['Нарукавники надел! Теперь я непотопляемый кролик.', "Arm bands on! Now I'm an unsinkable bunny."],
      ['В нарукавниках плыву как поплавок: буль-буль, но не тону!', "In arm bands I float like a cork: bob, bob, but I don't sink!"]],
    beachPierBall: [['Пляжный мяч! Держу на голове, как морской котик.', 'A beach ball! Balancing it on my head like a sea lion.']],
    beachPierJump: [['Бомбочкой с пирса! Плюх!', 'Cannonball off the pier! Splash!'], ['Раз, два, три… прыгаю! Ух, водичка бодрит!', "One, two, three… jump! Brr, the water's chilly!"]],
    beachPierGull: [['Эй! Чайка утащила мою морковку! Вот нахалка!', 'Hey! The seagull pinched my carrot! The cheek of it!'],
      ['Чайки такие хитрые: стащат еду прямо из лап!', "Seagulls are so sneaky: they'll snatch food right out of your paws!"]],
    beachPierSkim: [['Пускаю блинчики! Камушек прыгнул четыре раза!', 'Skimming stones! The pebble bounced four times!']],
    beachPierBuoy: [['Спасательный круг! Спасатель Лаки на посту.', 'A lifebuoy! Lifeguard Lucky on duty.']],
    beachPierNote: [['В записке: «Кто найдёт, тот мой новый друг!» Ура, это я!', "The note says: 'Whoever finds this is my new friend!' Yay, that's me!"],
      ['Записка: «Привет из Ирландии! У нас тоже море и чайки».', "A note: 'Hello from Ireland! We've got the sea and seagulls too.'"],
      ['Тут написано: «Ешьте больше морковки». Подпись: Лаки. Ой, это же я писал!', "It says: 'Eat more carrots.' Signed: Lucky. Oh, I wrote this one!"]],
    beachPierMap: [['В бутылке карта сокровищ! Крестик… прямо тут!', 'A treasure map in the bottle! X marks the spot… right here!']],
    beachPierTreasure: [['Копаю-копаю… Клад! Монетка и… морковка!', 'Dig, dig… Treasure! A coin and… a carrot!']],
    beachPierHoot: [['Если дуть в горлышко, бутылка гудит, как пароход! Ту-ту!', 'Blow across the top and a bottle hoots like a steamboat! Toot-toot!']],
    beachPierReply: [['Пишу ответ: «Привет! Я Лаки, у меня всё отлично». Плыви, бутылочка!', "I'm writing back: 'Hi! I'm Lucky and I'm doing great.' Off you float, bottle!"]],
    beachPierGullHead: [['Чайка села мне на голову! Я теперь маяк для чаек?', 'A seagull landed on my head! Am I a lighthouse for seagulls now?']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD3FF"/><stop offset="1" stop-color="#FFE9C9"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FA9E0"/><stop offset="1" stop-color="#8FE0F7"/></linearGradient>
<linearGradient id="${u}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF6B0" stop-opacity="0"/><stop offset="1" stop-color="#FFF6B0" stop-opacity=".95"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="236" cy="236" r="50" fill="url(#${u}g)"/><circle cx="236" cy="236" r="25" fill="#FFD23F"/></g>
${h.cloud(160, 258, 0.52)}${h.cloud(26, 302, 0.48, 'slow')}
<g class="lbp-gulls amb" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M96 350 q7 -7 14 0 q7 -7 14 0"/><path d="M200 344 q5 -5 10 0 q5 -5 10 0"/></g>
<rect x="0" y="372" width="400" height="130" fill="url(#${u}w)"/><path d="M0 373 H400" stroke="#fff" stroke-width="2" opacity=".45"/>
<g class="lbp-boat amb"><path d="M214 371 h22 l-3 5 h-16z" fill="#fff"/><path d="M225 369 V350 L236 367Z" fill="#fff"/><path d="M224 367 L216 356 V367Z" fill="#FF7AB8"/></g>
<g class="lbp-waves amb" stroke="#fff" stroke-width="3" fill="none"><path d="M-40 404 q20 -9 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" opacity=".6"/>
<path d="M-20 446 q20 -9 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" opacity=".45"/></g>
<path d="M0 488 Q200 468 400 494 V700 H0Z" fill="#FFE1A8"/><path d="M0 488 Q200 468 400 494 L400 504 Q200 478 0 498Z" fill="#fff" opacity=".55"/>
<path d="M0 612 Q120 596 230 606 T400 600 V700 H0Z" fill="#FFD893" opacity=".7"/>
<g data-tap="pierDeck"><rect x="36" y="458" width="36" height="84" fill="transparent"/>
  <ellipse cx="54" cy="540" rx="16" ry="3.5" fill="#000" opacity=".12"/><rect x="50" y="472" width="8" height="68" rx="2" fill="#A86B3C"/><path d="M52 476 v62" stroke="#C98E5A" stroke-width="2"/>
  <rect x="36" y="460" width="36" height="15" rx="4" fill="#2E77D0"/><path d="M54 463 v9 M50 466 h8 M48.5 468.5 q5.5 5.5 11 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g class="lbp-buoy"><path d="M54 479 v4" stroke="#8C5A3C" stroke-width="2"/><circle cx="54" cy="500" r="13" fill="none" stroke="#E8413A" stroke-width="7"/><circle cx="54" cy="500" r="13" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="10.2"/>
  <path d="M45 491 q9 -6 18 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/></g></g>
<g data-tap="pierDeck"><rect x="36" y="364" width="150" height="80" fill="transparent"/>
  ${[[24, 490, 8], [84, 472, 7], [122, 460, 6], [160, 450, 5]].map(([x, b, w]) => `<rect x="${x - w / 2}" y="${deckBot(x) - 2}" width="${w}" height="${b - deckBot(x) + 2}" rx="2" fill="#8C5A3C"/>${x > 30 ? `<ellipse cx="${x}" cy="${b}" rx="${w + 4}" ry="2" fill="none" stroke="#fff" stroke-width="1.6" opacity=".7"/>` : ''}`).join('')}
  <path d="M-4 446 L182 402 L182 409 L-4 460Z" fill="#A86B3C"/><path d="M-4 446 L182 402" stroke="#D9A066" stroke-width="4"/>
  <g stroke="#A86B3C" stroke-linecap="round">${[8, 46, 84, 122, 160, 180].map((x) => `<path d="M${x} ${deckTop(x)} V${deckTop(x) - railH(x)}" stroke-width="${4 - x / 90}"/>`).join('')}</g>
  <path d="M-4 422 L182 388" stroke="#C98E5A" stroke-width="4" stroke-linecap="round"/><path d="M-4 435 L182 396" stroke="#C98E5A" stroke-width="2.6" stroke-linecap="round"/>
  <g class="lbp-gull"><g transform="translate(180 375) scale(1.3)"><g class="lbp-gullbob amb">${GULL_SIT}</g></g></g></g>
<path class="lbp-beam" d="M336 245 L130 209 L130 281Z" fill="url(#${u}b)"/><circle class="lbp-glow" cx="336" cy="245" r="40" fill="url(#${u}g)"/>
<g data-tap="pierLighthouse"><rect x="310" y="200" width="52" height="72" fill="transparent"/>
  <rect x="322" y="232" width="28" height="26" rx="3" fill="#FFF3A8"/><circle class="lbp-lamp amb" cx="336" cy="245" r="8" fill="#FFD23F"/>
  <path d="M331 232 V257 M341 232 V257" stroke="#3A3F5C" stroke-width="2"/>
  <path d="M316 262 v-8 M326 262 v-8 M336 262 v-8 M346 262 v-8 M356 262 v-8 M314 254 H358" stroke="#3A3F5C" stroke-width="2" stroke-linecap="round"/>
  <rect x="312" y="261" width="48" height="9" rx="3" fill="#3A3F5C"/>
  <path d="M318 234 Q336 206 354 234Z" fill="#E8413A"/><path d="M324 228 Q330 216 338 212" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"/>
  <path d="M336 210 v-7" stroke="#3A3F5C" stroke-width="2.4" stroke-linecap="round"/><circle cx="336" cy="209" r="3.5" fill="#3A3F5C"/></g>
<g data-tap="pierLighthouse"><rect x="306" y="270" width="60" height="212" fill="transparent"/>
  ${[270, 312, 354, 396, 438].map((y, i) => band(y, y + 42, i % 2 ? '#fff' : '#E8413A')).join('')}
  <path d="M${336 + hw(270) - 6} 270 L${336 + hw(480) - 9} 480 H${336 + hw(480)} L${336 + hw(270)} 270Z" fill="#000" opacity=".08"/>
  <rect x="332" y="326" width="8" height="14" rx="4" fill="#5A7FA6"/><rect x="332" y="410" width="8" height="14" rx="4" fill="#5A7FA6"/>
  <path d="M329 480 V466 a7 7 0 0 1 14 0 V480Z" fill="#5A3A4A"/></g>
<g><ellipse cx="372" cy="490" rx="32" ry="16" fill="#7D8FA8"/><ellipse cx="308" cy="494" rx="26" ry="13" fill="#8FA1B8"/><ellipse cx="340" cy="498" rx="32" ry="11" fill="#A3B3C7"/>
  <ellipse cx="394" cy="502" rx="16" ry="9" fill="#A3B3C7"/><ellipse cx="288" cy="504" rx="11" ry="6" fill="#B4C2D3"/>
  <path d="M292 486 q10 -6 22 -4 M358 478 q12 -5 24 0 M326 494 q10 -4 20 -2" stroke="#C8D4E2" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M276 508 Q340 500 404 510" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/></g>
<g data-tap="pierCastle"><g transform="translate(0 16)"><rect x="4" y="528" width="100" height="120" fill="transparent"/>
  <ellipse cx="58" cy="638" rx="52" ry="7" fill="#000" opacity=".1"/>
  <path d="M6 638 Q56 654 106 638" stroke="#8FE0F7" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g class="lbp-castle"><ellipse cx="56" cy="628" rx="50" ry="11" fill="#F2C27A"/>
  <rect x="34" y="596" width="44" height="33" fill="#FAD798"/>${merlons(35, 74, 596)}
  ${bucket(12, 40, 584, 630)}${bucket(72, 100, 584, 630)}${bucket(44, 68, 562, 598)}
  <g class="lbp-newtower">${bucket(78, 94, 560, 586, 2)}<path d="M86 552 V536" stroke="#8C5A3C" stroke-width="1.8"/><path d="M86 536 l12 4 -12 4z" fill="#36C5F0"/></g>
  <path d="M56 556 V538" stroke="#8C5A3C" stroke-width="2"/><path class="lbp-flag amb" d="M56 538 l14 5 -14 5z" fill="#FF5FA2"/>
  <path class="lbp-gate" d="M48 629 V617 a8 8 0 0 1 16 0 V629Z" fill="#C9954E"/>
  <path class="lbp-keep" d="M53 580 v-5 a3 3 0 0 1 6 0 v5z" fill="#C9954E"/><path d="M23 604 v-5 a3 3 0 0 1 6 0 v5z M83 604 v-5 a3 3 0 0 1 6 0 v5z" fill="#C9954E"/>
  <path d="M40 612 l3 -6 3 6z" fill="#FFB3D6"/><circle cx="72" cy="610" r="2.4" fill="#fff"/><circle cx="18" cy="618" r="2" fill="#fff"/></g>
  <path d="M98 642 l3 -14" stroke="#8C5A3C" stroke-width="2.4" stroke-linecap="round"/><path d="M99 626 q-6 -4 -4 -10 l9 2 q2 6 -5 8z" fill="#FF8A2B"/></g></g>
<g data-tap="pierHut"><g transform="translate(0 22)"><rect x="300" y="512" width="90" height="124" fill="transparent"/>
  <ellipse cx="345" cy="634" rx="46" ry="6" fill="#000" opacity=".12"/>
  <rect x="304" y="622" width="82" height="8" rx="2" fill="#C98E5A"/><path d="M310 630 v4 M380 630 v4" stroke="#8C5A3C" stroke-width="3"/>
  ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${310 + i * 10}" y="548" width="10" height="74" fill="${i % 2 ? '#fff' : '#4FC3F7'}"/>`).join('')}
  <rect x="310" y="548" width="70" height="6" fill="#000" opacity=".08"/>
  <rect x="333" y="568" width="24" height="54" rx="3" fill="#5A3A4A"/>
  <g class="lbp-door"><rect x="333" y="568" width="24" height="54" rx="3" fill="#FFD23F"/><circle cx="345" cy="582" r="5" fill="#BFE9FF" stroke="#fff" stroke-width="1.5"/><circle cx="352" cy="598" r="1.8" fill="#C98E5A"/></g>
  <path d="M312 562 h13 v32 h-13z" fill="#FF8FC0"/><path d="M312 571 h13 M312 585 h13" stroke="#fff" stroke-width="2.4"/><circle cx="318.5" cy="561" r="2" fill="#8C5A3C"/>
  <path d="M345 510 V492" stroke="#8C5A3C" stroke-width="2"/><path class="lbp-flag amb" d="M345 492 l14 4 -14 5z" fill="#FFD23F"/>
  <path d="M302 552 L345 510 L388 552Z" fill="#FF6B6B"/><path d="M300 553 L345 509 L390 553" stroke="#fff" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M345 543 l-7 -6 a4 4 0 0 1 7 -4 a4 4 0 0 1 7 4z" fill="#fff"/></g></g>
<g data-tap="pierBottle"><rect x="114" y="660" width="96" height="38" fill="transparent"/>
  <ellipse cx="162" cy="688" rx="46" ry="7" fill="#F2C98A" opacity=".8"/>
  <path d="M124 694 q-8 -12 0 -20 q2 8 6 10 q-2 -10 6 -14 q0 10 -4 22z" fill="#5BBF6A"/>
  <g transform="translate(164 680) rotate(-12)"><g class="lbp-bottle">${BOTTLE}</g></g>
  <path d="M200 690 l2 -5 2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3z" fill="#FF9F43"/></g>
<path d="M92 690 q8 -14 16 0z" fill="#FFB3D6"/><path d="M96 690 l4 -9 M100 690 v-10 M104 690 l-4 -9" stroke="#FF7AB8" stroke-width="1.2"/>
<path d="M268 690 l2.5 -6 2.5 6 6 0 -5 3.5 2 6 -5.5 -3.5 -5.5 3.5 2 -6 -5 -3.5z" fill="#FFB347"/>
</svg>`,

  css: `
.lbp-waves.amb { animation: lbpWaves 5s ease-in-out infinite; }
@keyframes lbpWaves { 50% { transform: translateX(14px); } }
.lbp-boat.amb { animation: lbpBoat 26s ease-in-out infinite alternate; }
@keyframes lbpBoat { to { transform: translateX(-70px); } }
.lbp-gulls.amb { animation: lbpGulls 7s ease-in-out infinite; }
@keyframes lbpGulls { 50% { transform: translate(18px, -8px); } }
.lbp-lamp.amb { animation: lbpLamp 2.4s ease-in-out infinite; }
@keyframes lbpLamp { 50% { opacity: .5; } }
.lbp-flag.amb { transform-box: fill-box; transform-origin: 0 50%; animation: lbpFlag 1.6s ease-in-out infinite; }
@keyframes lbpFlag { 50% { transform: scaleX(.8) skewY(6deg); } }
.lbp-gullbob.amb { transform-box: fill-box; transform-origin: 50% 100%; animation: lbpGullBob 4.5s ease-in-out infinite; }
@keyframes lbpGullBob { 0%, 70%, 100% { transform: none; } 78% { transform: rotate(-12deg); } 88% { transform: rotate(5deg); } }
.lbp-beam, .lbp-glow { pointer-events: none; opacity: 0; }
.lbp-beam { transform-box: view-box; transform-origin: 336px 245px; }
.lbp-beam.lbpsweep { animation: lbpSweep 2.6s ease-in-out; }
@keyframes lbpSweep { 0% { opacity: 0; transform: scaleX(1); } 12% { opacity: .95; } 50% { opacity: .95; transform: scaleX(-1); } 88% { opacity: .95; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
.lbp-glow.lbpblink { animation: lbpBlink .45s ease-in-out 6 alternate; }
@keyframes lbpBlink { to { opacity: 1; } }
[data-tap="pierLighthouse"].lbphorn { transform-box: fill-box; transform-origin: 50% 100%; animation: lbpHorn .12s linear 8 alternate; }
@keyframes lbpHorn { from { transform: translateX(-1.5px); } to { transform: translateX(1.5px); } }
.lbp-newtower { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); }
[data-tap="pierCastle"].lbpbuilt .lbp-newtower { animation: lbpBuild 7s cubic-bezier(.3, 1.4, .5, 1); }
@keyframes lbpBuild { 0% { transform: scaleY(0); } 10%, 90% { transform: scaleY(1); } 100% { transform: scaleY(0); } }
.lbp-castle { transform-box: fill-box; transform-origin: 50% 100%; }
[data-tap="pierCastle"].lbpwashed .lbp-castle { animation: lbpWashed 4.6s ease-in-out; }
@keyframes lbpWashed { 12%, 55% { transform: scale(1.18, .16); opacity: .75; } 100% { transform: none; opacity: 1; } }
.lbp-door { transform-box: fill-box; transform-origin: 0 50%; }
[data-tap="pierHut"].lbpopen .lbp-door { animation: lbpDoor 1.4s ease-in-out; }
@keyframes lbpDoor { 20%, 75% { transform: scaleX(.12); } }
[data-tap="pierHut"].lbpshake { transform-box: fill-box; transform-origin: 50% 100%; animation: lbpShake .3s ease-in-out 5; }
@keyframes lbpShake { 25% { transform: rotate(-2deg); } 75% { transform: rotate(2deg); } }
[data-tap="pierBottle"].lbpheld .lbp-bottle, .lbp-gull.lbpaway, .lbp-buoy.lbpaway { visibility: hidden; }
.lbp-bottle { transform-box: fill-box; transform-origin: 50% 50%; }
[data-tap="pierBottle"].lbpwobble .lbp-bottle { animation: lbpWobble .3s ease-in-out 4 alternate; }
@keyframes lbpWobble { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
[data-tap="pierBottle"].lbpgone .lbp-bottle { animation: lbpGone 9s ease-in-out; }
@keyframes lbpGone { 0%, 100% { opacity: 1; transform: none; } 6%, 82% { opacity: 0; transform: translateY(-8px) scale(.5); } }
`,

  props: (h) => ({
    // an old-fashioned red-and-white striped swimsuit (his paws stay in front)
    beachPierSwimsuit: { slot: 'body', art: () => {
      const d = 'M64 137 Q100 146 136 137 Q148 152 150 172 Q100 206 50 172 Q52 152 64 137Z';
      return `<clipPath id="lbpSuit"><path d="${d}"/></clipPath><path d="${d}" fill="#fff"/>
      <g clip-path="url(#lbpSuit)" fill="#E8413A">${[139, 151, 163, 175, 187, 199].map((y) => `<rect x="40" y="${y}" width="120" height="6"/>`).join('')}</g>
      <path d="${d}" fill="none" stroke="#D63A33" stroke-width="1.5"/><path d="M70 146 q30 8 60 0" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>
      ${[84, 116].map((x) => `<ellipse cx="${x}" cy="177" rx="11" ry="9" fill="#FFDDB6"/><path d="M${x - 4} 184 v-3 M${x} 185 v-3 M${x + 4} 184 v-3" stroke="#E9B98C" stroke-width="1.6" stroke-linecap="round"/>`).join('')}`;
    } },
    // orange arm bands on both front paws
    beachPierArmbands: { slot: 'arms', art: () => [84, 116].map((x) => `<rect x="${x - 15}" y="157" width="30" height="16" rx="8" fill="#FF8A2B"/>
      <rect x="${x - 15}" y="162" width="30" height="5" fill="#FFB067"/><path d="M${x - 9} 160 h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
      <rect x="${x + 6}" y="153" width="4" height="5" rx="1" fill="#E06B12"/>`).join('') },
    // a sand bucket worn upside down: a knight's helmet
    beachPierBucket: { slot: 'head', art: () => `<path d="M76 0 H124 L134 48 H66Z" fill="#FF5C4D"/><path d="M78 14 H122" stroke="#FF8A80" stroke-width="3"/>
      <path d="M84 6 L79 40" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/><rect x="62" y="43" width="76" height="10" rx="5" fill="#E8413A"/>
      <path d="M66 48 Q48 72 62 92" stroke="#FFD23F" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M106 24 l2.5 -6 2.5 6 6 .3 -5 3.6 2 6 -5.5 -3.6 -5.5 3.6 2 -6 -5 -3.6z" fill="#FFD23F"/>
      <g fill="#F2C27A"><circle cx="94" cy="-3" r="2.4"/><circle cx="104" cy="-6" r="1.8"/><circle cx="112" cy="-2" r="2"/></g>` },
    // the lighthouse keeper's cap and his telescope
    beachPierCap: { slot: 'head', art: () => `<path d="M66 42 Q62 14 100 10 Q138 14 134 42Z" fill="#fff"/><path d="M76 20 Q100 12 124 20" stroke="#E3E9F1" stroke-width="4" fill="none"/>
      <rect x="66" y="33" width="68" height="11" rx="3" fill="#24345C"/><path d="M70 43 Q100 60 130 43Z" fill="#1E2440"/>
      <g stroke="#FFD23F" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M100 18 v12 M95 21 h10 M94 26 q6 6 12 0"/></g>` },
    beachPierSpyglass: { slot: 'hand', art: () => `<g transform="rotate(-18 122 92)"><rect x="118" y="84" width="30" height="15" rx="3" fill="#C98E5A"/><rect x="146" y="81" width="26" height="21" rx="3" fill="#E0A84E"/>
      <rect x="170" y="78" width="10" height="27" rx="3" fill="#B87A2E"/><path d="M122 88 h22 M150 86 h18" stroke="#fff" stroke-width="2" opacity=".55" stroke-linecap="round"/></g>
      <path d="M156 160 q8 -30 4 -54" stroke="#FFDDB6" stroke-width="10" fill="none" stroke-linecap="round"/>` },
    // the pier's lifebuoy round his tummy
    beachPierBuoy: { slot: 'body', art: () => `<path d="M34 156 A66 20 0 0 0 166 156" fill="none" stroke="#E8413A" stroke-width="15" stroke-linecap="round"/>
      <path d="M34 156 A66 20 0 0 0 166 156" fill="none" stroke="#fff" stroke-width="15" stroke-dasharray="18 22" stroke-dashoffset="-10"/>
      <path d="M46 164 q54 22 108 0" stroke="#fff" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"/>` },
    beachPierCarrot: { slot: 'hand', art: () => h.em(158, 156, 34, '🥕') },
    beachPierNote: { slot: 'hand', art: () => h.em(158, 156, 38, '📜') },
    beachPierMap: { slot: 'hand', art: () => h.em(158, 154, 40, '🗺️') },
    // the bottle held up to his mouth, to blow across its top
    beachPierBottle: { slot: 'hand', art: () => `<g transform="translate(112 156) rotate(-90)">${BOTTLE}</g>` },
    beachPierGull: { slot: 'head', art: () => `<g transform="translate(100 24) scale(2.1)">${GULL_SIT}</g>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, mouth, feet, paw, sceneRect, spray, getWet } = k;
    const said = (key, i) => k.LUCKY.antics[key].slice(i, i + 1);
    // a part of a thing, or a point of the picture (400×700), in the scene's pixels
    const spot = (c, sel) => { const e = c.el.querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    const svgPt = (c, x, y) => {
      const m = c.el.ownerSVGElement?.getScreenCTM(), s = sceneRect();
      return m ? [m.a * x + m.e - s.left, m.d * y + m.f - s.top] : [c.x, c.y];
    };
    const off = (y = 40) => [sceneRect().width + 50, y];
    // the parts that belong together: the lighthouse's lantern and tower, the pier and its lifebuoy post
    const inPic = (c, sel) => c.el.ownerSVGElement?.querySelector(sel) || c.el;
    const allOf = (c) => [...(c.el.ownerSVGElement?.querySelectorAll(`[data-tap="${c.el.dataset.tap}"]`) || [c.el])];
    const lampAt = (c) => centerOf(inPic(c, '.lbp-lamp'));
    const away = (a, el) => { el.classList.add('lbpaway'); onEnd(a, () => el.classList.remove('lbpaway')); };

    // the lighthouse: its light sweeps round, the foghorn, it winks at him; a long press: Lucky keeps watch
    // she sees the light first, then Lucky talks (his speech bubble would cover the top of the picture)
    const sweep = (c) => {
      const a = begin('lbpSweep');
      api.hop(inPic(c, '.lbp-beam'), 'lbpsweep', 2700);
      sfx.chime();
      [500, 1700].forEach((d) => at(a, d, () => sfx.whoosh()));
      at(a, 300, () => pose('happy', 3000, 'tilt', 1400));
      at(a, 2500, () => line('beachPierBeam', 1, 0));
      at(a, 3000, end);
    };
    const horn = (c) => {
      const a = begin('lbpHorn'), [lx, ly] = lampAt(c);
      allOf(c).forEach((g) => api.hop(g, 'lbphorn', 1100));
      sfx.gong();
      sfx.rumble();
      at(a, 800, () => sfx.gong());
      api.fxAt(lx - 20, ly, ['💨', '☁️'], 6, 'spark');
      at(a, 250, () => pose('surprised', 1600, 'startle', 1000));
      at(a, 1300, () => line('beachPierHorn', 1, 0));
      at(a, 2000, end);
    };
    R.pierLighthouse = {
      press: (c) => { sfx.ding(); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('beachPierLighthouse', sweep, horn)),
      double: who((c) => {
        const a = begin('lbpBlink'), lamp = lampAt(c);
        api.hop(inPic(c, '.lbp-glow'), 'lbpblink', 2800);
        [0, 900, 1800].forEach((d) => at(a, d, () => { sfx.ding(); api.fxAt(...lamp, ['✨'], 2, 'spark'); }));
        at(a, 450, () => pose('wink', 700, 'tilt', 1400));
        at(a, 2300, () => line('beachPierBlink', 1, 0));
        at(a, 1350, () => api.setTemp('wink', 700));
        at(a, 2250, () => api.setTemp('happy', 1300));
        at(a, 3200, end);
      }),
      long: who((c) => {
        const a = begin('lbpWatch');
        prop('beachPierCap', 7000);
        sfx.whoosh();
        at(a, 400, () => { prop('beachPierSpyglass', 4000); pose('ok', 1600, 'stretchUp', 1600); });
        at(a, 1900, () => {
          const whale = Math.random() < 0.5, [x, y] = svgPt(c, 186, 372);
          popUp(whale ? '🐳' : '🚢', x, y, 3400, 34, 'pop-stay');
          if (whale) { sfx.splash(); api.fxAt(x, y - 22, ['💦'], 4, 'spark'); } else sfx.honk();
          pose('surprised', 1300, 'startle', 1000);
          at(a, 700, () => api.setTemp('stars', 1600));
          at(a, 1500, () => { line(said('beachPierWatch', whale ? 1 : 0), 1, 0); api.reward(); });
        });
        at(a, 5000, end);
      }),
    };

    // the sandcastle: he adds a tower, a wave washes it away; a crab moves in; a long press: the bucket for a helmet
    const tower = (c) => {
      const a = begin('lbpTower');
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { hold(a, 'dig', 1800); sfx.puff(); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); });
      at(a, 1500, () => { api.hop(c.el, 'lbpbuilt', 7000); sfx.grow(); });
      at(a, 2300, () => {
        const [tx, ty] = spot(c, '.lbp-newtower');
        api.fxAt(tx, ty - 16, ['✨', '⭐'], 4, 'spark');
        sfx.sparkle();
        pose('happy', 1800, 'proud', 1200);
        line('beachPierTower', 1, 0);
        api.reward();
      });
      at(a, 3700, end);
    };
    const wash = (c) => {
      const a = begin('lbpWash'), [cx, cy] = centerOf(c.el);
      fly('🌊', [-70, cy + 10], [cx + 30, cy + 10], 900, { size: 84 });
      at(a, 700, () => { sfx.splash(); api.hop(c.el, 'lbpwashed', 4600); api.fxAt(cx, cy, ['💦', '💧'], 6, 'spark'); });
      at(a, 1000, () => pose('surprised', 1200, 'startle', 1000));
      at(a, 2000, () => { pose('laugh', 1600, 'hop'); line('beachPierWashed', 1, 0); });
      at(a, 3400, end);
    };
    R.pierCastle = {
      press: (c) => { sfx.puff(); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('beachPierCastle', tower, wash)),
      double: who((c) => {
        const a = begin('lbpCrab'), gate = spot(c, '.lbp-gate'), win = spot(c, '.lbp-keep');
        fly('🦀', [gate[0] + 80, gate[1] + 34], gate, 900, { size: 24 });
        [0, 300, 600].forEach((d) => at(a, d, () => sfx.tap()));
        at(a, 1000, () => { popUp('🦀', win[0], win[1] - 10, 2800, 26, 'pop-stay'); sfx.pop(); pose('surprised', 1200, 'startle', 1000); });
        at(a, 1800, () => { pose('laugh', 1800, 'bow'); line('beachPierCrab', 1, 0); });
        at(a, 3800, end);
      }),
      long: who((c) => {
        const a = begin('lbpKnight');
        fly('🪣', [c.x, c.y], head(), 700, { arc: 60, spin: 180, size: 30 });
        at(a, 700, () => {
          prop('beachPierBucket', 8000);
          sfx.bonk();
          api.fxAt(...head(), ['✨'], 3, 'drop');
          pose('grin', 1800, 'proud', 1200);
          line('beachPierKnight', 1, 0);
          api.reward();
        });
        at(a, 2300, end);
      }),
    };

    // the beach hut: he goes in and pops out in a stripy swimsuit or in arm bands; a beach ball; hide and seek
    const change = (outfit, key) => (c) => {
      const a = begin('lbpChange'), door = spot(c, '.lbp-door');
      go(nextTo(c.el, 16), 700);
      at(a, 750, () => { api.hop(c.el, 'lbpopen', 1400); sfx.knock(); });
      at(a, 1000, () => { hold(a, 'vanish', 2100); line('beachPierChanging', 1, 0); });
      at(a, 1500, () => { api.hop(c.el, 'lbpshake', 1600); sfx.whoosh(); api.fxAt(...door, ['🩱', '🩳', '🧦'], 5, 'spark'); });
      at(a, 2400, () => sfx.zip());
      at(a, 3100, () => {
        api.hop(c.el, 'lbpopen', 1400);
        sfx.boing();
        prop(outfit, 9000);
        pose('grin', 2000, 'starjump', 800);
        line(key, 1, 0);
        api.reward();
      });
      at(a, 4700, end);
    };
    R.pierHut = {
      press: () => sfx.knock(),
      tap: who(oneOf('beachPierHut', change('beachPierSwimsuit', 'beachPierSwimsuit'), change('beachPierArmbands', 'beachPierArmbands'))),
      double: who((c) => {
        const a = begin('lbpBall'), door = spot(c, '.lbp-door');
        api.hop(c.el, 'lbpopen', 1400);
        at(a, 300, () => { drawnFly(fly, ballSvg(), door, k.api.luckyPoint(0.5, 0.02), 700, { arc: 80, spin: 360, size: 36 }); sfx.boing(); });
        at(a, 1000, () => { prop('ball', 2700); pose('laugh', 2500, 'balance', 2500); line('beachPierBall', 1, 0); });
        at(a, 3700, () => { unprop('hand', true); drawnFly(fly, ballSvg(), api.luckyPoint(0.5, 0.02), door, 700, { arc: 60, spin: -360, size: 36 }); sfx.boing(); api.setTemp('happy', 1200); });
        at(a, 4500, end);
      }),
      long: who((c) => { api.hop(c.el, 'lbpopen', 1400); k.hideGame(begin('hide'), c.el); }),
    };

    // the pier: he jumps off into the sea, or the seagull pinches his carrot; skimming stones; the lifebuoy
    const jump = (c) => {
      const a = begin('lbpJump');
      go(nextTo(c.el, 6), 700);
      at(a, 750, () => { pose('grin', 900, 'crouch', 600); line('beachPierJump', 1, 0); });
      at(a, 1350, () => { sfx.boing(); pose('laugh', 1100, 'bigjump', 1100); });
      at(a, 2250, () => { sfx.splash(); spray(...api.luckyPoint(0.5, 0.7)); k.puddle(3800); getWet(a, 1800); });
      at(a, 4700, () => { api.reward(); end(); });
    };
    const steal = (c) => {
      const a = begin('lbpGull'), gull = inPic(c, '.lbp-gull'), perch = centerOf(gull);
      prop('beachPierCarrot', 1800);
      pose('happy', 1200);
      sfx.pop();
      at(a, 800, () => { api.setTemp('eat', 800); away(a, gull); drawnFly(fly, gullSvg(), perch, paw(), 600, { arc: 40, size: 40 }, true); sfx.honk(); });
      at(a, 1400, () => {
        unprop('hand', true);
        drawnFly(fly, gullSvg(), paw(), off(40), 1100, { arc: 60, size: 40 }, true);
        fly('🥕', [paw()[0] + 6, paw()[1] + 8], off(52), 1100, { arc: 60, size: 20 });
        pose('surprised', 1300, 'startle', 1000);
      });
      at(a, 2300, () => { api.setTemp('sad', 1000); line('beachPierGull', 1, 0); });
      at(a, 3300, () => { api.setTemp('laugh', 1400); drawnFly(fly, gullSvg(), [-50, perch[1] - 60], perch, 1300, { arc: 30, size: 40 }, true); });
      at(a, 4600, end);
    };
    R.pierDeck = {
      press: (c) => { sfx.knock(); api.fxAt(c.x, c.y, ['💧'], 2, 'spark'); },
      tap: who(oneOf('beachPierDeck', jump, steal)),
      double: who((c) => {
        const a = begin('lbpSkim');
        const pts = [[222, 440], [246, 420], [266, 405], [282, 393], [294, 385]].map(([x, y]) => svgPt(c, x, y));
        pose('happy', 3000, 'throw', 600);
        sfx.whoosh();
        let from = paw();
        pts.forEach((p, i) => {
          const f = from, t0 = 250 + i * 330;
          at(a, t0, () => fly('🪨', f, p, 330, { arc: i ? 26 - i * 5 : 70, size: 16 - i * 2 }));
          at(a, t0 + 330, () => { api.fxAt(...p, ['💦'], i < 4 ? 2 : 4, 'spark'); if (i < 4) sfx.bubble(); else sfx.splash(); });
          from = p;
        });
        at(a, 2150, () => { pose('laugh', 1600, 'binky'); line('beachPierSkim', 1, 0); api.reward(); });
        at(a, 3500, end);
      }),
      long: who((c) => {
        const a = begin('lbpBuoy'), buoy = inPic(c, '.lbp-buoy'), b = centerOf(buoy);
        buoy.classList.add('lbpaway');
        setTimeout(() => buoy.classList.remove('lbpaway'), 7400);
        fly('🛟', b, api.luckyPoint(0.5, 0.74), 700, { arc: 70, spin: 360, size: 34 });
        at(a, 700, () => {
          prop('beachPierBuoy', 7000);
          sfx.boing();
          pose('happy', 2200, 'proud', 1200);
          line('beachPierBuoy', 1, 0);
          api.reward();
        });
        at(a, 1700, () => { sfx.note(1568); setTimeout(() => sfx.note(1568), 200); });
        at(a, 2800, end);
      }),
    };

    // the message in a bottle: a friendly note, or a treasure map; it hoots like a ship; a long press writes back
    const read = (c) => {
      const a = begin('lbpRead');
      api.hop(c.el, 'lbpwobble', 1300);
      sfx.pop();
      fly('📜', [c.x, c.y], paw(), 600, { arc: 60, size: 24 });
      at(a, 600, () => { prop('beachPierNote', 4200); pose('happy', 3600, 'tilt', 1400); line('beachPierNote', 1, 0); api.reward(); });
      at(a, 4000, end);
    };
    const map = (c) => {
      const a = begin('lbpMap');
      api.hop(c.el, 'lbpwobble', 1300);
      sfx.pop();
      fly('🗺️', [c.x, c.y], paw(), 600, { arc: 60, size: 26 });
      at(a, 600, () => { prop('beachPierMap', 2200); pose('surprised', 1600, 'startle', 1000); line('beachPierMap', 1, 0); });
      at(a, 2800, () => { hold(a, 'dig', 1800); sfx.puff(); api.fxAt(...feet(), ['💨'], 4, 'spark'); });
      at(a, 3400, () => { sfx.puff(); api.fxAt(...feet(), ['💨'], 3, 'spark'); });
      at(a, 4500, () => {
        const [fx, fy] = feet();
        popUp('🪙', fx - 34, fy - 16, 2400, 26, 'pop-rise');
        popUp('🥕', fx + 34, fy - 16, 2400, 30, 'pop-rise');
        sfx.fanfare();
        pose('stars', 1800, 'binky');
        line('beachPierTreasure', 1, 0);
        api.reward();
      });
      at(a, 6200, end);
    };
    R.pierBottle = {
      press: (c) => { sfx.bubble(); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('beachPierBottle', read, map)),
      double: who((c) => {
        const a = begin('lbpHoot');
        c.el.classList.add('lbpheld');
        onEnd(a, () => c.el.classList.remove('lbpheld'));
        prop('beachPierBottle', 2700);
        pose('ok', 1300, 'puff', 900);
        [300, 700, 1100].forEach((d, i) => at(a, d, () => { sfx.note([196, 175, 147][i]); api.fxAt(...mouth(), ['💨', '🎵'], 2, 'spark'); }));
        at(a, 1400, () => { pose('laugh', 1400, 'hop'); line('beachPierHoot', 1, 0); });
        at(a, 2700, () => { unprop('hand'); end(); });
      }),
      long: who((c) => {
        const a = begin('lbpReply'), sea = svgPt(c, 250, 420);
        prop('beachPierNote', 2400);
        pose('happy', 2200, 'tilt', 1400);
        api.fxAt(...paw(), ['✏️', '💌'], 3, 'spark');
        sfx.tick();
        line('beachPierReply', 1, 0);
        at(a, 2500, () => {
          api.hop(c.el, 'lbpgone', 9000);
          drawnFly(fly, bottleSvg(), paw(), sea, 1100, { arc: 120, spin: 320, size: 34 });
          sfx.whoosh();
          pose('happy', 1400, 'throw', 600);
        });
        at(a, 3600, () => { sfx.splash(); api.fxAt(...sea, ['💦'], 4, 'spark'); pose('happy', 1600, 'wave', 1200); api.reward(); });
        at(a, 5000, end);
      }),
    };
  },

  visitors: [
    // no seagull emoji: the guest is drawn
    { e: '🐦', html: gullSvg('1.5em'), w: 3, path: 'glide', end: ['beachPierGullHead', 'feather'], flip: true },
    { e: '🐟', w: 3, path: 'jump', end: ['splash'], flip: true },
  ],

  // the seagull lands on his head: a lighthouse for seagulls
  endings: (k) => ({
    beachPierGullHead: (a, x, y) => {
      const { api, sfx, at, fly, prop, unprop, pose, line, head, sceneRect } = k;
      drawnFly(fly, gullSvg(), [x, y], head(), 800, { arc: 50, size: 40 }, true);
      at(a, 800, () => { prop('beachPierGull', 2800); sfx.honk(); pose('surprised', 1400, 'balance', 2400); line('beachPierGullHead', 1, 0); });
      at(a, 2000, () => api.setTemp('laugh', 1600));
      at(a, 3600, () => { unprop('head', true); drawnFly(fly, gullSvg(), head(), [sceneRect().width + 50, 30], 1000, { arc: 60, size: 40 }, true); sfx.honk(); });
    },
  }),
};
