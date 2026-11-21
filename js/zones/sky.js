// Sky islands (level 44): Lucky's island floats above a sea of clouds. A little island with a waterfall pours into
// the clouds, a rainbow runs from it down to Lucky's island and works as a slide, a hot-air balloon is tied to a post,
// and two cloud sheep (fluffy clouds with legs) float about on the grass.

// the seven colours of the rainbow, and a note for each (do, re, mi, fa, sol, la, ti)
const BOW = ['#FF5E62', '#FF9F43', '#FFDD57', '#5FD38A', '#5CC8FF', '#4F7BFF', '#A57CFF'];
const NOTES = [523, 587, 659, 698, 784, 880, 988];
// the rainbow slide: from under the little island down to a cloud on Lucky's island
const SLIDE = 'M94 352 C94 440, 76 536, 20 616';

// a cloud sheep: a fluffy cloud with a face and four legs, facing left (about 72 × 52)
const sheepArt = () => `<path d="M-14 12 v13 M-5 14 v13 M6 14 v13 M15 12 v13" stroke="#7683A6" stroke-width="3.6" stroke-linecap="round"/>
<g fill="#E1ECF9"><circle cx="-14" cy="9" r="12"/><circle cx="4" cy="11" r="14"/><circle cx="20" cy="8" r="11"/></g>
<g fill="#fff"><circle cx="-16" cy="0" r="13"/><circle cx="-3" cy="-9" r="15"/><circle cx="13" cy="-6" r="14"/><circle cx="23" cy="3" r="11"/><circle cx="3" cy="4" r="14"/></g>
<circle cx="-6" cy="-14" r="5" fill="#fff" opacity=".9"/><path d="M4 -18 q8 -4 14 2" stroke="#E1ECF9" stroke-width="2" fill="none"/>
<ellipse cx="-36" cy="-7" rx="6" ry="3" fill="#8592B5" transform="rotate(-25 -36 -7)"/><ellipse cx="-29" cy="0" rx="9" ry="11" fill="#8592B5"/><ellipse cx="-20" cy="-8" rx="5" ry="2.6" fill="#8592B5" transform="rotate(25 -20 -8)"/>
<circle cx="-27" cy="-11" r="6" fill="#fff"/><circle cx="-32" cy="-1" r="2.1" fill="#2E3350"/><circle cx="-25" cy="-1" r="2.1" fill="#2E3350"/>
<circle cx="-32.6" cy="-1.8" r=".8" fill="#fff"/><circle cx="-25.6" cy="-1.8" r=".8" fill="#fff"/><ellipse cx="-28.5" cy="6" rx="2.4" ry="1.4" fill="#5E6A8C"/>
<circle cx="-35" cy="4" r="2" fill="#FF9DBB" opacity=".75"/><circle cx="-22" cy="4" r="2" fill="#FF9DBB" opacity=".75"/>`;
const sheepSvg = (w) => `<svg viewBox="-40 -26 76 54" width="${w}" height="${Math.round((w * 54) / 76)}" style="display:block">${sheepArt()}</svg>`;

// a little island far away, in the haze
const far = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".8"><path d="M-30 0 Q0 -7 30 0 Q22 12 8 20 Q2 32 -4 20 Q-22 12 -30 0Z" fill="#C7D5E8"/>
<path d="M-31 0 Q0 -9 31 0 Q0 6 -31 0Z" fill="#AEE0B4"/><circle cx="-10" cy="-8" r="7" fill="#9ED6A8"/><circle cx="-3" cy="-6" r="5" fill="#9ED6A8"/></g>`;

export default {
  id: 'sky',
  level: 44,
  name: ['Небесные острова', 'Sky islands'],
  emoji: ['☁️', '🎈', '🌈', '🪁', '🕊️'],
  spots: { L: [30, 672], R: [382, 672], l: [150, 690], r: [254, 692], sky: 300 },
  arrive: [
    ['Небесные острова! Мы выше облаков, а под лапками всё равно травка.', "The sky islands! We're above the clouds, and there's still grass under my paws."],
    ['Ух ты, острова летают! Держись крепче, тут высоко!', "Whoa, the islands are floating! Hold on tight, it's high up here!"],
  ],

  lines: {
    skyBag: [['Бух! Мешок с песком упал. Шар стал легче и рвётся в небо!', 'Thud! A sandbag fell off. The balloon is lighter now and wants to fly!'], ['Осторожно, мешок! Хорошо, что не на мою голову.', 'Watch out, sandbag! Good thing it missed my head.']],
    skyRope: [['Ой-ой, шар меня поднимает! Всё, хватит, я передумал!', "Uh-oh, the balloon is lifting me! Okay, that's enough, I changed my mind!"], ['Держу верёвку! Шар хочет улететь, а я не пускаю.', "I've got the rope! The balloon wants to fly away, but I won't let it."]],
    skyBurner: [['Фух! Горячий воздух поднимается вверх, и шар вместе с ним.', 'Fwoosh! Hot air goes up, and the balloon goes up with it.']],
    skyRide: [['Полетели! Эй, внизу, привет! Я на воздушном шаре!', "Up we go! Hello down there! I'm in a hot-air balloon!"], ['Сверху всё такое маленькое! Даже облака внизу.', 'Everything looks so tiny from up here! Even the clouds are below me.']],
    skyLand: [['Мягкая посадка! Капитан Лаки полёт закончил.', 'Soft landing! Captain Lucky has finished the flight.']],
    skyMist: [['Солнце плюс брызги — и вот радуга! Это наука, но похоже на волшебство.', "Sunshine plus spray makes a rainbow! It's science, but it looks like magic."], ['Водопад сделал радугу! Специально для нас.', 'The waterfall made a rainbow! Just for us.']],
    skyDrop: [['Поймал капельку! Самая свежая вода, прямо с неба.', 'Caught a drop! The freshest water, straight from the sky.'], ['Кап! Прямо на язык. Холодненькая!', 'Plip! Right on my tongue. Nice and cold!']],
    skyFish: [['Рыбка выпрыгнула из водопада! Тут даже рыбы летают.', 'A fish jumped out of the waterfall! Even the fish fly up here.']],
    skyFishing: [['Порыбачу в облаках. Интересно, что тут клюёт?', 'Time to fish in the clouds. I wonder what bites up here?']],
    skyTrout: [['Радужная форель! Такая рыба правда есть, честное слово!', "A rainbow trout! That's a real fish, honest!"]],
    skySlide: [['Ура-а! Радужная горка! Ещё разок!', 'Wheee! A rainbow slide! One more time!'], ['Скатился по радуге! Теперь у меня хвостик всех цветов.', 'I slid down a rainbow! Now my tail is every colour.']],
    skyNotes: [['У каждого цвета своя нота! До, ре, ми, фа, соль, ля, си!', 'Every colour plays its own note! Do, re, mi, fa, so, la, ti!'], ['Радужный ксилофон! Я теперь музыкант.', "A rainbow xylophone! I'm a musician now."]],
    skyColours: [['Каждый охотник желает знать, где сидит фазан! Это цвета радуги.', 'Richard Of York Gave Battle In Vain! The first letters are the rainbow colours.']],
    skyGold: [['Говорят, в конце радуги спрятан клад. А тут золотая морковка!', "They say there's treasure at the end of a rainbow. This one has a golden carrot!"]],
    skyGoldYum: [['Хрум! Золотая, а на вкус как обычная. Но очень вкусная!', 'Crunch! It looks golden but tastes like a normal one. A very yummy one!']],
    skyCount: [['Одна, две облачные овечки… Ой, что-то спать захотелось.', "One cloud sheep, two cloud sheep… Oh, I'm getting sleepy."], ['Раз овечка, два овечка… Кто придумал считать овец перед сном? Работает!', 'One sheep, two sheep… who thought of counting sheep at bedtime? It works!']],
    skyCloudHat: [['Облачная шапка! Мягкая, пушистая и говорит «бе-е».', 'A cloud hat! Soft, fluffy, and it says baa.'], ['Овечка села мне на голову. Теперь я облачный кролик!', "A sheep is sitting on my head. Now I'm a cloud bunny!"]],
    skyBounce: [['Прыг-скок! Облачные овечки — лучший батут на свете!', 'Boing! Cloud sheep make the best trampoline ever!']],
    skyNap: [['Мягко, как в облаке… потому что это и есть облако. Посплю минутку.', 'Soft as a cloud… because it is a cloud. Just a little nap.']],
    skyTaxi: [['Облако-такси! До радуги, пожалуйста, и с ветерком!', 'A cloud taxi! To the rainbow, please, and step on it!']],
  },

  art: (u, h) => `${h.svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4EA5EC"/><stop offset=".44" stop-color="#8DCDF8"/><stop offset=".68" stop-color="#DDF2FF"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}w" gradientUnits="userSpaceOnUse" x1="0" y1="340" x2="0" y2="478"><stop offset="0" stop-color="#6CCBFF"/><stop offset="1" stop-color="#CFF0FF"/></linearGradient>
<linearGradient id="${u}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C69468"/><stop offset="1" stop-color="#8F6248"/></linearGradient>
<linearGradient id="${u}e" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF6F91"/><stop offset=".5" stop-color="#FF8FA6"/><stop offset="1" stop-color="#F0567C"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="232" cy="228" r="62" fill="url(#${u}g)"/><circle cx="232" cy="228" r="28" fill="#FFD84D"/></g>
<g class="zs-far amb">${far(186, 352, 0.9)}${far(272, 404, 0.62)}</g>
${h.cloud(160, 254, 0.6, 'slow')}
<g fill="#EEF8FF">${Array.from({ length: 12 }, (_, i) => `<circle cx="${i * 36 - 8}" cy="${458 + (i % 2) * 7}" r="${20 + (i % 3) * 5}"/>`).join('')}</g>
<g fill="#fff">${Array.from({ length: 12 }, (_, i) => `<circle cx="${i * 36 + 10}" cy="${470 + (i % 2) * 5}" r="${18 + ((i + 1) % 3) * 4}"/>`).join('')}</g>
<path d="M0 484 Q100 470 200 476 T400 482 V700 H0Z" fill="#9FE283"/>
<path d="M0 484 Q100 470 200 476 T400 482" stroke="#C8F2AE" stroke-width="4" fill="none"/>
<path d="M0 566 Q200 538 400 568 V700 H0Z" fill="#8AD66F"/>
<path d="M0 644 Q200 622 400 646 V700 H0Z" fill="#78C860"/>
<g stroke="#6CBF55" stroke-width="2.4" stroke-linecap="round" fill="none">${[[40, 520], [170, 506], [250, 512], [330, 530], [60, 600], [300, 596]].map(([x, y]) => `<path d="M${x} ${y} l-4 -8 M${x} ${y} l0 -10 M${x} ${y} l4 -8"/>`).join('')}</g>

<g class="zs-thing">
<g data-tap="skyFalls"><path d="M0 420 H40 L42 448 L68 450 V510 H0Z" fill="transparent"/>
  <path d="M10 420 C10 440 11 460 11 478 L33 478 C32 460 31 440 30 420Z" fill="url(#${u}w)"/>
  <g class="zs-fall amb" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"><path d="M14 420 V470" stroke-dasharray="10 18"/><path d="M20 420 V472" stroke-dasharray="14 14"/><path d="M26 420 V468" stroke-dasharray="8 20"/></g>
  <g class="zs-mistbow">${BOW.map((c, i) => `<path d="M${-6 + i * 3.4} 474 A${36 - i * 3.4} ${36 - i * 3.4} 0 0 1 ${66 - i * 3.4} 474" stroke="${c}" stroke-width="3.6" fill="none"/>`).join('')}</g>
  <ellipse cx="30" cy="506" rx="34" ry="4" fill="#000" opacity=".08"/>
  <g class="zs-mist"><g fill="#E6F1FC"><circle cx="12" cy="492" r="14"/><circle cx="34" cy="494" r="14"/><circle cx="54" cy="494" r="11"/></g>
    <g fill="#fff"><circle cx="6" cy="480" r="15"/><circle cx="26" cy="474" r="17"/><circle cx="48" cy="482" r="13"/><rect x="-4" y="482" width="66" height="16" rx="8"/></g>
    <path d="M10 474 q8 -8 18 -4" stroke="#CFF0FF" stroke-width="2.4" fill="none" stroke-linecap="round"/></g></g>
<g data-tap="skyFalls"><path d="M0 286 H128 V342 L104 380 L84 440 L46 404 L40 420 H0Z" fill="transparent"/>
  <path d="M4 340 Q64 332 124 340 Q118 364 100 382 Q86 400 78 434 Q64 404 46 390 Q16 368 4 340Z" fill="url(#${u}r)"/>
  <path d="M14 354 Q62 364 112 352 M32 376 Q62 384 96 374 M52 398 Q66 402 82 398" stroke="#A97A57" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M38 384 q-5 14 2 26 M92 378 q6 12 -1 24 M66 404 q-3 10 2 16" stroke="#6E8F45" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M2 340 Q64 320 126 338 Q122 346 110 347 Q64 352 14 348 Q4 346 2 340Z" fill="#7CCB62"/><path d="M10 337 Q64 322 118 335" stroke="#AEE890" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M82 334 v-20" stroke="#8C5A3C" stroke-width="5" stroke-linecap="round"/><circle cx="72" cy="312" r="11" fill="#55B65E"/><circle cx="94" cy="312" r="11" fill="#55B65E"/><circle cx="82" cy="302" r="15" fill="#62C56A"/><circle cx="77" cy="296" r="5" fill="#8FDC8A"/>
  <path d="M20 338 Q36 330 54 334" stroke="#7FD6FF" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path class="zs-water" d="M8 340 C7 370 9 400 10 421 L30 421 C29 400 27 370 25 340Z" fill="url(#${u}w)"/>
  <g class="zs-fall amb" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".85"><path d="M13 350 V420" stroke-dasharray="10 18"/><path d="M19 346 V420" stroke-dasharray="14 14"/><path d="M25 352 V420" stroke-dasharray="8 20"/></g></g>
</g>

<g data-tap="skyRainbow"><path class="zs-rbline" d="${SLIDE}" stroke="transparent" stroke-width="40" fill="none"/><rect x="0" y="596" width="60" height="50" fill="transparent"/>
  <g class="zs-bow7">${BOW.map((c, i) => `<path class="zs-stripe" d="${SLIDE}" transform="translate(${((3 - i) * 4).toFixed(1)} ${((3 - i) * 2).toFixed(1)})" stroke="${c}" stroke-width="4.8" fill="none"/>`).join('')}</g>
  <g fill="#fff"><circle cx="88" cy="350" r="9"/><circle cx="102" cy="352" r="10"/><circle cx="96" cy="344" r="8"/></g>
  <ellipse cx="22" cy="638" rx="34" ry="5" fill="#000" opacity=".1"/>
  <g fill="#fff"><circle cx="8" cy="624" r="13"/><circle cx="26" cy="618" r="16"/><circle cx="44" cy="628" r="11"/><rect x="4" y="624" width="44" height="12" rx="6"/></g>
  <path d="M10 632 q18 6 36 0" stroke="#E1ECF9" stroke-width="3" fill="none" stroke-linecap="round"/></g>

<g class="zs-thing">
<g data-tap="skyBalloon"><rect x="326" y="404" width="74" height="116" fill="transparent"/>
  <g class="zs-rope"><path class="zs-tether amb" d="M346 404 Q354 458 372 498" stroke="#8C6B4F" stroke-width="1.8" fill="none"/></g>
  <ellipse cx="372" cy="512" rx="12" ry="3" fill="#000" opacity=".12"/>
  <rect x="368" y="486" width="9" height="26" rx="2" fill="#9A6B4A"/><rect x="366" y="483" width="13" height="5" rx="2" fill="#7A5236"/>
  <path d="M367 494 h11" stroke="#8C6B4F" stroke-width="2.4"/></g>
<g class="zs-balwrap"><g class="zs-bal amb"><g data-tap="skyBalloon"><rect x="298" y="262" width="102" height="150" fill="transparent"/>
  <path d="M346 270 C312 270 302 300 306 324 C310 348 330 360 336 372 H356 C362 360 382 348 386 324 C390 300 380 270 346 270Z" fill="url(#${u}e)"/>
  <path d="M346 270 C326 270 320 300 322 324 C324 348 336 360 339 372 H353 C356 360 368 348 370 324 C372 300 366 270 346 270Z" fill="#FFE07A"/>
  <path d="M346 270 C338 270 335 300 336 324 C337 348 342 360 343 372 H349 C350 360 355 348 356 324 C357 300 354 270 346 270Z" fill="#6FC3FF"/>
  <path d="M306 318 Q346 330 386 318" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>
  <ellipse cx="324" cy="292" rx="7" ry="12" fill="#fff" opacity=".45" transform="rotate(24 324 292)"/>
  <rect x="334" y="370" width="24" height="6" rx="3" fill="#E2557A"/>
  <g class="zs-flame"><path d="M346 392 q-6 -8 0 -18 q6 10 0 18z" fill="#FFB347"/><path d="M346 390 q-3 -4 0 -9 q3 5 0 9z" fill="#FFE66D"/></g>
  <path d="M337 376 L335 386 M355 376 L357 386 M346 376 V386" stroke="#8C6B4F" stroke-width="1.4"/>
  <rect x="332" y="385" width="28" height="19" rx="3" fill="#C98E5A"/><path d="M332 391 H360 M332 397 H360 M339 385 V404 M346 385 V404 M353 385 V404" stroke="#A86F42" stroke-width="1.2"/>
  <rect x="330" y="383" width="32" height="5" rx="2.5" fill="#8C5A3C"/>
  <g class="zs-bag"><path d="M326 394 q-4 10 2 14 h8 q6 -4 2 -14z" fill="#C7A27A"/><path d="M327 395 h10" stroke="#8C6B4F" stroke-width="2"/></g>
  <g><path d="M366 394 q-4 10 2 14 h8 q6 -4 2 -14z" fill="#C7A27A"/><path d="M367 395 h10" stroke="#8C6B4F" stroke-width="2"/></g>
</g></g></g>
</g>

<g data-tap="skySheep"><rect x="302" y="524" width="98" height="150" fill="transparent"/>
  <ellipse cx="352" cy="606" rx="30" ry="5" fill="#000" opacity=".1"/><ellipse cx="364" cy="668" rx="24" ry="4" fill="#000" opacity=".1"/>
  <g transform="translate(354 560) scale(1.22)"><g class="zs-s1"><g class="zs-float amb">${sheepArt()}</g></g></g>
  <g transform="translate(366 628) scale(.92)"><g class="zs-s2"><g class="zs-float zs-late amb">${sheepArt()}</g></g></g></g>
${h.flower(98, 688, '#FFD23F', 0.8)}${h.flower(306, 690, '#FF7AB8', 0.8)}
</svg>`,

  css: `
[data-tap="skyBalloon"].tapped, [data-tap="skyFalls"].tapped, [data-tap="skyRainbow"].tapped { animation: zsTap .6s cubic-bezier(.3, 1.6, .5, 1); }
/* the waterfall and the balloon's rope are drawn in two parts: a press bounce would tear them apart */
[data-tap="skyFalls"].tapped, .zs-thing > [data-tap="skyBalloon"].tapped { animation: none; }
@keyframes zsTap { 40% { transform: scale(1.05); } }
.zs-bal.amb { animation: zsBob 4s ease-in-out infinite; }
@keyframes zsBob { 50% { transform: translateY(-4px); } }
.zs-rope, .zs-tether { transform-box: fill-box; transform-origin: 100% 100%; }
.zs-tether.amb { animation: zsTether 4s ease-in-out infinite; }
@keyframes zsTether { 50% { transform: scaleY(1.042); } }
.zs-balwrap, .zs-bag { transform-box: fill-box; transform-origin: 50% 50%; }
.zs-flame { opacity: 0; transform-box: fill-box; transform-origin: 50% 100%; }
.zs-flame.zs-flash { animation: zsFlame .5s ease-out; }
.zs-flame.zs-roar { animation: zsFlame .55s ease-out 3; }
@keyframes zsFlame { 0% { opacity: 0; transform: scale(.4); } 30% { opacity: 1; transform: scale(1.3); } 100% { opacity: 0; transform: scale(.8); } }
.zs-balwrap.zs-rise { animation: zsRise 1.8s ease-in-out; }
@keyframes zsRise { 40% { transform: translateY(-12px); } }
.zs-rope.zs-rise { animation: zsRopeRise 1.8s ease-in-out; }
@keyframes zsRopeRise { 40% { transform: scaleY(1.125); } }
.zs-bag.zs-drop { animation: zsBag 2.6s ease-in forwards; }
@keyframes zsBag { 22% { transform: translate(-3px, 98px) rotate(-16deg); } 27% { transform: translate(-3px, 92px) rotate(-8deg); } 32%, 85% { transform: translate(-3px, 98px) rotate(-12deg); opacity: 1; } 100% { transform: translate(-3px, 98px) rotate(-12deg); opacity: 0; } }
.zs-balwrap.zs-light { animation: zsLight 2.6s ease-in-out; }
@keyframes zsLight { 30% { transform: none; } 55% { transform: translateY(-16px); } }
.zs-rope.zs-light { animation: zsRopeLight 2.6s ease-in-out; }
@keyframes zsRopeLight { 30% { transform: none; } 55% { transform: scaleY(1.167); } }
.zs-balwrap.zs-tug { animation: zsTug 3.2s ease-in-out; }
@keyframes zsTug { 30%, 70% { transform: translateY(-26px); } 50% { transform: translateY(-30px) rotate(2deg); } }
.zs-rope.zs-tug { animation: zsRopeTug 3.2s ease-in-out; }
@keyframes zsRopeTug { 30%, 70% { transform: scaleY(1.27); } 50% { transform: scaleY(1.31); } }
.zs-gone { visibility: hidden; }
.zs-fall.amb path { animation: zsFall .9s linear infinite; }
@keyframes zsFall { to { stroke-dashoffset: -28; } }
.zs-far.amb { animation: zsFar 9s ease-in-out infinite; }
@keyframes zsFar { 50% { transform: translateY(-5px); } }
.zs-mistbow { opacity: 0; }
.zs-mistbow.zs-show { animation: zsBow 3.8s ease-in-out; }
@keyframes zsBow { 15%, 80% { opacity: .95; } }
.zs-stripe { transition: stroke-width .2s; }
.zs-stripe.zs-ding { stroke-width: 9px; filter: brightness(1.15); }
.zs-bow7.zs-glow { animation: zsGlow 2.4s ease-in-out; }
@keyframes zsGlow { 25%, 75% { filter: brightness(1.2) drop-shadow(0 0 6px #fff); } }
.zs-float.amb { animation: zsFloat 3.4s ease-in-out infinite; }
.zs-float.zs-late { animation-delay: -1.7s; }
@keyframes zsFloat { 50% { transform: translateY(-5px); } }
.zs-s1, .zs-s2 { transform-box: fill-box; transform-origin: 50% 100%; }
.zs-s1.zs-hop, .zs-s2.zs-hop { animation: zsHop .7s cubic-bezier(.3, 1.6, .5, 1); }
@keyframes zsHop { 40% { transform: translateY(-14px) scale(1.06, .96); } }
.fly-fx.zs-goldfx { filter: sepia(1) saturate(5) hue-rotate(-14deg) brightness(1.15) drop-shadow(0 0 6px #FFD23F); }
.fly-fx.zs-trout { animation: zsTrout .7s linear infinite; }
@keyframes zsTrout { to { filter: hue-rotate(360deg) saturate(1.6); } }
.fly-fx.zs-tramp { transform: translate(-50%, -50%); animation: zsTramp var(--ms, 2.6s) ease-in-out; }
@keyframes zsTramp { 0%, 18%, 30%, 50%, 62%, 78%, 90%, 100% { transform: translate(-50%, -50%); } 24%, 56%, 84% { transform: translate(-50%, -42%) scale(1.12, .84); } }
/* 'moonjump' rides along with Lucky's high moves only so that the speech bubble steps aside (main.js AIR) */
.lucky.zs-slide, .lucky.zs-slide.moonjump { animation: zsSlide 2.6s ease-in-out; }
@keyframes zsSlide {
  18% { translate: -26% -62%; rotate: -6deg; } 28% { translate: -28% -60%; rotate: 12deg; }
  62% { translate: -52% -6%; rotate: 26deg; } 72% { translate: -54% 0; rotate: 0deg; scale: 1.12 .88; }
  82% { translate: -52% -4%; scale: .96 1.05; } 100% { translate: 0 0; rotate: 0deg; scale: 1 1; } }
.lucky.zs-lift, .lucky.zs-lift.moonjump { animation: zsLiftL 3.2s ease-in-out; }
@keyframes zsLiftL { 30% { translate: 0 -14%; rotate: -4deg; } 50% { translate: 1% -17%; rotate: 5deg; } 70% { translate: 0 -12%; rotate: -3deg; } 86% { translate: 0 1%; rotate: 0deg; scale: 1.08 .92; } 100% { translate: 0 0; scale: 1 1; } }
.lucky.zs-boing, .lucky.zs-boing.moonjump { transform-origin: 50% 100%; animation: zsBoing 2.6s ease-in-out; }
@keyframes zsBoing {
  12% { translate: 0 -40%; } 24% { translate: 0 -19%; scale: 1.1 .9; } 40% { translate: 0 -56%; scale: .95 1.06; }
  56% { translate: 0 -19%; scale: 1.1 .9; } 70% { translate: 0 -50%; scale: .96 1.04; } 84% { translate: 0 -19%; scale: 1.08 .92; } 100% { translate: 0 0; scale: 1 1; } }
`,

  props: () => ({
    // the balloon's rope in his paw, going up to the balloon
    skyRope: { slot: 'hand', art: () => `<path d="M156 166 Q172 80 148 -60" stroke="#8C6B4F" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="156" cy="166" r="6" fill="#8C6B4F"/>` },
    // Lucky in the hot-air balloon: the basket in front of him, the balloon above his head
    skyBalloonRide: { slot: 'body', art: () => `<path d="M78 28 L56 152 M122 28 L144 152 M100 30 V60" stroke="#8C6B4F" stroke-width="2.4" fill="none"/>
      <path d="M100 -126 C46 -126 30 -80 36 -42 C42 -6 72 12 82 30 H118 C128 12 158 -6 164 -42 C170 -80 154 -126 100 -126Z" fill="#FF7D96"/>
      <path d="M100 -126 C68 -126 60 -80 62 -42 C64 -6 82 12 87 30 H113 C118 12 136 -6 138 -42 C140 -80 132 -126 100 -126Z" fill="#FFE07A"/>
      <path d="M100 -126 C88 -126 84 -80 85 -42 C86 -6 94 12 96 30 H104 C106 12 114 -6 115 -42 C116 -80 112 -126 100 -126Z" fill="#6FC3FF"/>
      <ellipse cx="66" cy="-88" rx="10" ry="18" fill="#fff" opacity=".45" transform="rotate(24 66 -88)"/><rect x="80" y="26" width="40" height="9" rx="4.5" fill="#E2557A"/>
      <rect x="50" y="150" width="100" height="56" rx="8" fill="#C98E5A"/><path d="M50 168 H150 M50 186 H150 M70 150 V206 M90 150 V206 M110 150 V206 M130 150 V206" stroke="#A86F42" stroke-width="2.4"/>
      <rect x="44" y="144" width="112" height="12" rx="6" fill="#8C5A3C"/>` },
    // a fishing rod with a float on its line (the 🎣 one already has a fish on it)
    skyRod: { slot: 'hand', art: () => `<path d="M150 178 L206 56" stroke="#8C5A3C" stroke-width="5" stroke-linecap="round"/><circle cx="162" cy="152" r="6" fill="#5A6480"/>
      <path d="M206 56 Q212 110 208 150" stroke="#fff" stroke-width="1.6" fill="none"/><circle cx="208" cy="150" r="6" fill="#FF5E62"/><path d="M202 150 h12" stroke="#fff" stroke-width="2.4"/>` },
    // the small cloud sheep sits on his head
    skyCloudHat: { slot: 'head', art: () => `<g transform="translate(102 26) scale(.95)">${sheepArt()}</g>` },
    // a little cloud under his paws: the cloud taxi
    skyCloudSeat: { slot: 'feet', art: () => `<g fill="#fff"><circle cx="58" cy="200" r="20"/><circle cx="86" cy="190" r="26"/><circle cx="118" cy="192" r="24"/><circle cx="146" cy="202" r="19"/><rect x="44" y="198" width="114" height="20" rx="10"/></g>
      <path d="M52 212 q48 10 100 0" stroke="#E1ECF9" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  }),

  reactions: (R, k) => {
    const { api, sfx, L, who, oneOf, begin, end, at, onEnd, hold, go, pose, prop, unprop, fly, popUp, line, centerOf, nextTo, head, mouth, feet, paw, sceneRect } = k;
    // a thing as a whole: the waterfall and the balloon have two tap areas each (low and high) in one group
    const whole = (c) => c.el.closest('.zs-thing') || c.el;
    const part = (c, sel) => { const e = whole(c).querySelector(sel); return e ? centerOf(e) : [c.x, c.y]; };
    // a point of the picture (in the picture's own units) on the scene
    const svgPt = (el, x, y) => { const m = el.getScreenCTM(), s = sceneRect(); return [m.a * x + m.c * y + m.e - s.left, m.b * x + m.d * y + m.f - s.top]; };
    // a point along the rainbow slide, t from 0 (the top) to 1 (the cloud at its foot)
    const along = (c, t) => {
      const p = c.el.querySelector('.zs-rbline');
      if (!p?.getPointAtLength) return [c.x, c.y];
      const q = p.getPointAtLength(p.getTotalLength() * t);
      return svgPt(p, q.x, q.y);
    };
    const hide = (a, el) => { if (!el) return; el.classList.add('zs-gone'); onEnd(a, () => el.classList.remove('zs-gone')); };
    // a reaction animates a part of the thing, not the thing itself (its own bounce on a press would cut it short)
    const anim = (c, sel, cls, ms) => whole(c).querySelectorAll(sel).forEach((e) => api.hop(e, cls, ms));

    // ---------- the hot-air balloon ----------
    // a sandbag drops off the basket; the balloon, lighter now, jumps up on its rope
    const sandbag = (c) => {
      const a = begin('skyBag'), [bx] = part(c, '.zs-bag'), [, gy] = svgPt(whole(c), 0, 504);
      anim(c, '.zs-bag', 'zs-drop', 2700);
      anim(c, '.zs-balwrap, .zs-rope', 'zs-light', 2700);
      at(a, 600, () => { sfx.thump(); api.fxAt(bx, gy, ['💨'], 3, 'spark'); pose('surprised', 1000, 'startle', 1100); });
      at(a, 1300, () => { api.setTemp('laugh', 1600); line('skyBag', 1, 0); });
      at(a, 2700, end);
    };
    // the balloon tugs at its rope: Lucky grabs it and is lifted off his paws for a moment
    const tug = (c) => {
      const a = begin('skyTug');
      go(nextTo(whole(c)), 700);
      at(a, 750, () => { prop('skyRope', 3400); anim(c, '.zs-balwrap, .zs-rope', 'zs-tug', 3300); sfx.whoosh(); });
      at(a, 900, () => { pose('surprised', 1600, 'zs-lift', 3200); hold(a, 'moonjump', 3000); line('skyRope', 1, 0); });
      at(a, 2500, () => api.setTemp('laugh', 1500));
      at(a, 3700, () => { sfx.thump(); api.fxAt(...feet(), ['💨'], 3, 'spark'); api.reward(); });
      at(a, 4300, end);
    };
    R.skyBalloon = {
      press: (c) => { sfx.puff(); anim(c, '.zs-flame', 'zs-flash', 600); },
      tap: who(oneOf('skyBalloon', sandbag, tug)),
      // the burner roars: the balloon swells and rises on its rope
      double: (c) => {
        anim(c, '.zs-flame', 'zs-roar', 1800);
        anim(c, '.zs-balwrap, .zs-rope', 'zs-rise', 1900);
        sfx.whoosh();
        [0, 550, 1100].forEach((d) => setTimeout(() => sfx.puff(), d));
        const [x, y] = part(c, '.zs-flame');
        api.fxAt(x, y - 10, ['✨'], 3, 'spark');
        if (api.free()) { pose('happy', 1600, 'clap'); line('skyBurner', 1); }
      },
      // the big ride: Lucky climbs into the basket and the balloon takes him up into the sky, then down again
      long: who((c) => {
        const a = begin('skyRide'), w = sceneRect().width;
        go(nextTo(whole(c)), 700);
        at(a, 750, () => { hide(a, whole(c).querySelector('.zs-balwrap')); hide(a, whole(c).querySelector('.zs-rope')); prop('skyBalloonRide', 6600); sfx.puff(); pose('happy', 1200, 'hop'); });
        at(a, 1300, () => { sfx.whoosh(); pose('laugh', 3000); hold(a, 'balloonfly'); line('skyRide', 1, 0); });
        at(a, 1700, () => fly('☁️', [w * 0.14, -30], [w * 0.1, sceneRect().height + 40], 1500, { size: 56 }));
        at(a, 2200, () => fly('☁️', [w * 0.88, -30], [w * 0.92, sceneRect().height + 40], 1400, { size: 44 }));
        at(a, 3800, () => { L.classList.remove('balloonfly'); a.cls.delete('balloonfly'); hold(a, 'parachute', 2700); sfx.puff(); pose('happy', 2600); });
        at(a, 6500, () => { pose('laugh', 1600, 'squash', 700); line('skyLand', 1, 0); api.reward(); });
        at(a, 7400, end);
      }),
    };

    // ---------- the little island with the waterfall ----------
    const mist = (c) => part(c, '.zs-mist');
    const fallTop = (c) => { const e = whole(c).querySelector('.zs-water'); return e ? svgPt(e, 18, 360) : [c.x, c.y]; };
    // sunshine in the spray: a little rainbow shows up at the foot of the waterfall
    const mistBow = (c) => {
      anim(c, '.zs-mistbow', 'zs-show', 3900);
      sfx.chime();
      const [x, y] = mist(c);
      api.fxAt(x + 10, y - 30, ['✨'], 4, 'spark');
      pose('laugh', 1500, 'binky');
      line('skyMist', 1);
      api.reward();
    };
    // a drop flies off the waterfall, and Lucky catches it on his tongue
    const drop = (c) => {
      const a = begin('skyDrop');
      api.setTemp('eat', 1800);
      fly('💧', fallTop(c), mouth(), 900, { arc: 50, size: 24 });
      at(a, 900, () => { sfx.lick(); api.fxAt(...mouth(), ['✨'], 3, 'spark'); pose('happy', 1500, 'hop'); line('skyDrop', 1, 0); });
      at(a, 2200, end);
    };
    R.skyFalls = {
      press: (c) => { sfx.splash(); api.fxAt(...mist(c), ['💧'], 3, 'drop'); },
      tap: who(oneOf('skyFalls', mistBow, drop)),
      // a fish jumps out of the waterfall and dives back into the clouds
      double: (c) => {
        const [x, y] = mist(c);
        sfx.splash();
        fly('🐟', [x, y], [x + 54, y + 6], 1100, { arc: 120, spin: 320, size: 30 });
        setTimeout(() => { sfx.splash(); api.fxAt(x + 54, y, ['💦'], 3, 'spark'); }, 1100);
        setTimeout(() => { if (!api.free()) return; pose('surprised', 1400, 'startle', 1100); line('skyFish', 1); }, 400);
      },
      // fishing off the edge of the island: a rainbow trout bites
      long: who((c) => {
        const a = begin('skyFishing');
        go(nextTo(whole(c)), 700);
        at(a, 750, () => { prop('skyRod', 5600); pose('ok', 1800, 'sniff', 1500); line('skyFishing', 1, 0); });
        at(a, 2700, () => { sfx.splash(); hold(a, 'strain', 900); api.setTemp('surprised', 900); api.fxAt(...mist(c), ['💦'], 3, 'spark'); });
        at(a, 3600, () => { sfx.pop(); fly('🐟', mist(c), paw(), 800, { arc: 90, spin: 360, size: 34, stay: 1900, cls: 'zs-trout' }); });
        at(a, 4400, () => { api.fxAt(...paw(), ['🌈', '✨'], 4, 'spark'); sfx.sparkle(); pose('laugh', 2000, 'proud', 1200); line('skyTrout', 1, 0); api.reward(); });
        at(a, 6300, () => { fly('🐟', paw(), mist(c), 800, { arc: 70, spin: -300, size: 30, cls: 'zs-trout' }); api.setTemp('happy', 1200); });
        at(a, 7100, () => { sfx.splash(); end(); });
      }),
    };

    // ---------- the rainbow slide ----------
    const stripes = (c) => [...c.el.querySelectorAll('.zs-stripe')];
    const slide = (c) => {
      const a = begin('skySlide');
      pose('happy', 1200, 'zs-slide', 2600);
      hold(a, 'moonjump', 2400);
      sfx.boing();
      line('skySlide', 1, 0);
      at(a, 750, () => { sfx.whoosh(); api.setTemp('laugh', 2400); });
      [0.3, 0.45, 0.6, 0.75, 0.9].forEach((t, i) => at(a, 700 + i * 160, () => api.floatFx(...along(c, t), i % 2 ? '✨' : '⭐', 'spark')));
      at(a, 1950, () => { sfx.thump(); api.fxAt(...along(c, 1), ['☁️', '✨'], 3, 'spark'); api.reward(); });
      at(a, 3000, end);
    };
    // every stripe rings its own note, from red to violet
    const notes = (c) => {
      const a = begin('skyNotes');
      stripes(c).forEach((s, i) => at(a, i * 230, () => {
        s.classList.add('zs-ding');
        setTimeout(() => s.classList.remove('zs-ding'), 260);
        sfx.note(NOTES[i]);
        api.floatFx(...along(c, 0.2 + i * 0.1), i % 2 ? '🎶' : '🎵', 'spark');
      }));
      pose('happy', 2400, 'sway', 1300);
      at(a, 1700, () => { pose('laugh', 1800, 'dance', 2200); line('skyNotes', 1, 0); });
      at(a, 3400, end);
    };
    R.skyRainbow = {
      press: (c) => { sfx.note(NOTES[Math.floor(Math.random() * NOTES.length)]); api.fxAt(c.x, c.y, ['✨'], 3, 'spark'); },
      tap: who(oneOf('skyRainbow', slide, notes)),
      // the rainbow shines, and Lucky knows how to remember its colours
      double: (c) => {
        anim(c, '.zs-bow7', 'zs-glow', 2500);
        sfx.magic();
        [0.15, 0.4, 0.65, 0.9].forEach((t, i) => setTimeout(() => api.floatFx(...along(c, t), '✨', 'spark'), i * 150));
        if (api.free()) { pose('happy', 2400, 'proud', 1200); line('skyColours', 1); }
      },
      // treasure at the end of the rainbow: a golden carrot
      long: who((c) => {
        const a = begin('skyGold'), [fx, fy] = along(c, 1);
        go(nextTo(c.el, 24), 700);
        at(a, 750, () => { pose('ok', 1800, 'dig', 1800); [0, 400, 800, 1200].forEach((d) => setTimeout(() => sfx.tap(), d)); api.fxAt(fx, fy, ['☁️', '💨'], 4, 'spark'); });
        at(a, 2600, () => { sfx.sparkle(); popUp('🥕', fx + 14, fy - 10, 1500, 40, 'pop-rise zs-goldfx'); api.fxAt(fx + 14, fy - 40, ['✨'], 5, 'spark'); pose('surprised', 1400, 'startle', 1100); line('skyGold', 1, 0); });
        at(a, 4000, () => fly('🥕', [fx + 14, fy - 50], mouth(), 600, { arc: 40, spin: 200, size: 34, cls: 'zs-goldfx' }));
        at(a, 4700, () => { api.setTemp('eat', 1800); sfx.crunch(); line('skyGoldYum', 1, 0); api.boost('hunger', 2); api.reward(); });
        at(a, 6200, end);
      }),
    };

    // ---------- the cloud sheep ----------
    const sheep = (c, n) => c.el.querySelector('.zs-s' + n);
    const sheepAt = (c, n) => { const e = sheep(c, n); return e ? centerOf(e) : [c.x, c.y]; };
    // a cloud sheep flying across the scene (drawn, not an emoji)
    const sheepFly = (from, to, ms, w, opts = {}) => { const s = fly('', from, to, ms, { size: 10, ...opts }); s.innerHTML = sheepSvg(w); return s; };
    // count them: each one hops when counted… and Lucky gets sleepy
    const count = (c) => {
      const a = begin('skyCount');
      [1, 2].forEach((n, i) => at(a, i * 800, () => {
        const e = sheep(c, n), [x, y] = sheepAt(c, n);
        if (e) api.hop(e, 'zs-hop', 800);
        sfx.baa();
        popUp(n === 1 ? '1️⃣' : '2️⃣', x, y - 50, 1100, 26);
      }));
      at(a, 400, () => pose('happy', 1400, 'listen', 1400));
      at(a, 1800, () => { api.setTemp('tired', 2200); sfx.yawn(); line('skyCount', 1, 0); });
      at(a, 3600, end);
    };
    // the small one floats over and sits on his head like a cloud hat
    const cloudHat = (c) => {
      const a = begin('skyHat'), e = sheep(c, 2), from = sheepAt(c, 2), [hx, hy] = head();
      hide(a, e);
      sfx.baa();
      sheepFly(from, [hx, hy - 20], 800, 64, { arc: 60 });
      at(a, 800, () => { prop('skyCloudHat', 3000); pose('surprised', 1200, 'balance', 2000); });
      at(a, 1300, () => { api.setTemp('laugh', 1800); line('skyCloudHat', 1, 0); });
      at(a, 3800, () => { unprop('head', true); sheepFly([hx, hy - 20], from, 800, 64, { arc: 50 }); sfx.baa(); });
      at(a, 4650, end);
    };
    R.skySheep = {
      press: (c) => { sfx.baa(); api.fxAt(c.x, c.y - 20, ['☁️'], 2, 'spark'); },
      tap: who(oneOf('skySheep', count, cloudHat)),
      // the big one is a trampoline: Lucky bounces on it, higher and higher
      double: who((c) => {
        const a = begin('skyBounce'), e = sheep(c, 1), from = sheepAt(c, 1), [fx, fy] = feet();
        hide(a, e);
        sfx.baa();
        sheepFly(from, [fx, fy - 4], 700, 140, { arc: 40 });
        at(a, 700, () => {
          const s = popUp('', fx, fy - 4, 2700, 10, 'zs-tramp');
          s.innerHTML = sheepSvg(140);
          pose('laugh', 2600, 'zs-boing', 2600);
          hold(a, 'moonjump', 2400);
          [620, 1450, 2180].forEach((d) => at(a, d, () => sfx.boing()));
          line('skyBounce', 1, 0);
        });
        at(a, 3400, () => { sheepFly([fx, fy - 4], from, 700, 110, { arc: 40 }); api.reward(); });
        at(a, 4150, end);
      }),
      // a nap on the softest pillow there is
      long: who((c) => {
        const a = begin('skyNap');
        go(nextTo(c.el, 16), 700);
        at(a, 750, () => { pose('happy', 1200, 'hug'); api.hearts(...head(), 4); sfx.baa(); });
        at(a, 1900, () => { api.setTemp('sleep', 2600); hold(a, 'loaf', 2600); sfx.sleep(); api.fxAt(...head(), ['💤'], 3, 'spark'); line('skyNap', 1, 0); api.boost('energy', 1); api.reward(); });
        at(a, 4600, () => pose('happy', 1400, 'stretchUp', 1600));
        at(a, 5600, end);
      }),
    };
  },

  visitors: [
    { e: '🪁', w: 2, path: 'float', end: ['kite'] },
    { e: '🐦', w: 2, path: 'glide', end: ['sing', 'feather'], flip: true },
    { e: '☁️', w: 2, path: 'float', end: ['skyTaxi'] },
  ],

  // a little cloud floats by: caught, it slides under Lucky and gives him a ride
  endings: (k) => ({
    skyTaxi: (a, x, y) => {
      const { api, sfx, at, fly, hold, pose, prop, unprop, line, feet, sceneRect } = k;
      const [fx, fy] = feet(), w = sceneRect().width;
      fly('☁️', [x, y], [fx, fy], 800, { arc: 40, size: 90 });
      at(a, 800, () => { prop('skyCloudSeat', 4600); sfx.puff(); pose('laugh', 3400); hold(a, 'levitate', 4200); line('skyTaxi', 1, 0); });
      at(a, 5000, () => { unprop('feet', true); fly('☁️', [fx, fy], [w + 60, fy - 120], 900, { size: 90 }); sfx.whoosh(); api.setTemp('happy', 1200); });
    },
  }),
};
