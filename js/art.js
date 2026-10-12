import { wearLayers, WEAR_BY_ID } from './wardrobe.js';

// SVG art: Lucky (ginger lop-eared bunny), Tali (chihuahua), scenes, belts.

let uidN = 0;
const uid = () => 'a' + (++uidN);

const INK = '#3A2216';

function luckyEyes(face) {
  const eye = (cx) => `<circle cx="${cx}" cy="90" r="10.5" fill="${INK}"/>
    <circle cx="${cx + 4}" cy="85.5" r="3.8" fill="#fff"/><circle cx="${cx - 3}" cy="94" r="1.7" fill="#fff"/>`;
  const arc = (cx, up) => `<path d="M${cx - 10} ${up ? 93 : 89} q10 ${up ? -12 : 10} 20 0" stroke="${INK}" stroke-width="4.2" fill="none" stroke-linecap="round"/>`;
  const brow = (cx, lift = 0) => `<path d="M${cx - 9} ${75 - lift} q9 -6 18 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const bigEye = (cx) => `<circle cx="${cx}" cy="89" r="12.5" fill="#fff" stroke="${INK}" stroke-width="2.6"/><circle cx="${cx}" cy="90" r="6.5" fill="${INK}"/><circle cx="${cx + 2.5}" cy="87" r="2.2" fill="#fff"/>`;
  // the inner .fx part of stars, hearts and spirals is what CSS animates (twinkle, beat, spin)
  const star = (cx) => `<g transform="translate(${cx} 90) scale(.82)"><path class="fx" d="M0 -14 l4.2 8.6 9.6 1.2 -7 6.6 1.8 9.4 -8.6 -4.6 -8.6 4.6 1.8 -9.4 -7 -6.6 9.6 -1.2z" fill="#FFD23F" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/></g>`;
  const heart = (cx) => `<g transform="translate(${cx} 91)"><g class="fx"><path d="M0 9 C-15 -2 -13 -17 0 -8 C13 -17 15 -2 0 9Z" fill="#FF4F7B" stroke="${INK}" stroke-width="2.2"/><ellipse cx="-5" cy="-6" rx="2.6" ry="1.8" fill="#fff" opacity=".8"/></g></g>`;
  const spiral = (cx) => `<g transform="translate(${cx} 90)"><path class="fx" d="M0 0 q4 -1 3 3 q-1 6 -7 4 q-7 -3 -4 -10 q4 -8 12 -4 q8 5 3 14" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/></g>`;
  switch (face) {
    case 'happy':
    case 'laugh':
    case 'grin':
      return arc(80, true) + arc(120, true);
    case 'smug': // sly: eyelids half down, looking aside
      return `<g class="eyes">${eye(83)}${eye(123)}</g>
        <path d="M68 86 a12 12 0 0 1 24 0z" fill="#F29A48"/><path d="M108 86 a12 12 0 0 1 24 0z" fill="#F29A48"/>
        <path d="M68 86.5 h24 M108 86.5 h24" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    case 'wink':
    case 'cheeky':
      return arc(80, true) + `<g class="eyes">${eye(120)}</g>`;
    case 'shy':
      return `<path d="M70 92 q10 7 20 0 M110 92 q10 7 20 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'surprised':
      return bigEye(80) + bigEye(120) + brow(80, 6) + brow(120, 6);
    case 'stars':
      return star(80) + star(120);
    case 'hearts':
      return heart(80) + heart(120);
    case 'dizzy':
      return spiral(80) + spiral(120);
    case 'sleep':
      return arc(80, false) + arc(120, false);
    case 'tired':
      return `<g>${eye(80)}${eye(120)}</g>
        <path d="M68 90 a12 12 0 0 1 24 0z" fill="#F29A48"/><path d="M108 90 a12 12 0 0 1 24 0z" fill="#F29A48"/>
        <path d="M68 90 h24 M108 90 h24" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    case 'sad':
      return `<g class="eyes">${eye(80)}${eye(120)}</g>
        <path d="M69 77 l17 -5 M131 77 l-17 -5" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
    default:
      return `<g class="eyes">${eye(80)}${eye(120)}</g>`;
  }
}

function luckyMouth(face) {
  const base = `<path d="M100 108 v4 M100 112 q-5 5 -10 1 M100 112 q5 5 10 1" stroke="#8A4526" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const blush = '<ellipse cx="71" cy="108" rx="12" ry="7" fill="#FF5C8A" opacity=".45"/><ellipse cx="129" cy="108" rx="12" ry="7" fill="#FF5C8A" opacity=".45"/>';
  switch (face) {
    case 'laugh':
    case 'eat':
    case 'stars':
    case 'wink':
      return `<path d="M91 113 q9 14 18 0z" fill="#C8456B"/><rect x="96.5" y="112.5" width="7" height="5" rx="1.5" fill="#fff"/>
        <path d="M100 108 v4" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/>`;
    case 'surprised':
      return '<path d="M100 108 v3" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="100" cy="118" rx="5" ry="6.5" fill="#C8456B"/>';
    case 'grin':
      return `<path d="M84 110 q16 19 32 0 q-16 7 -32 0z" fill="#C8456B" stroke="#8A4526" stroke-width="2" stroke-linejoin="round"/><path d="M87 112 q13 5 26 0" stroke="#fff" stroke-width="3.2" fill="none"/>
        <path d="M100 106 v4" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/>`;
    case 'cheeky':
      return base + '<path d="M94 113.5 q6 16 12 0z" fill="#FF7FA8" stroke="#C8456B" stroke-width="1.4"/><path d="M100 115 v6" stroke="#C8456B" stroke-width="1.2" opacity=".6"/>';
    case 'smug':
      return '<path d="M100 108 v4 M100 112 q-5 3 -10 2 M100 112 q7 2 13 -4" stroke="#8A4526" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    case 'dizzy':
      return '<path d="M100 108 v4" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/><path d="M89 117 q3 -4 6 0 t6 0 t6 0 t5 0" stroke="#8A4526" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    case 'shy':
    case 'hearts':
      return base + (face === 'shy' ? blush : '');
    case 'sad':
      return `<path d="M100 108 v4" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/><path d="M92 120 q8 -7 16 0" stroke="#8A4526" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    case 'sleep':
      return `<path d="M100 108 v3" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="100" cy="115" rx="3" ry="2.5" fill="#C8456B" opacity=".8"/>`;
    default:
      return base;
  }
}

// The expressions Lucky's face can show (moodFace() and setTemp() in main.js use these names)
export const LUCKY_FACES = ['ok', 'happy', 'laugh', 'eat', 'sleep', 'tired', 'sad', 'wink', 'cheeky', 'shy', 'surprised', 'stars', 'hearts', 'dizzy', 'grin', 'smug'];

// Only the eyes and the mouth change with the expression. They are separate groups, so a new face swaps just them:
// the rest of the drawing stays, and so do the animations running on it (Safari restarts those on a redraw).
export function setLuckyFace(root, face) {
  const eyes = root.querySelector('.face-eyes'), mouth = root.querySelector('.face-mouth');
  if (!eyes || !mouth) return false;
  eyes.setAttribute('class', 'face-eyes f-' + face);
  eyes.innerHTML = luckyEyes(face);
  mouth.innerHTML = luckyMouth(face);
  return true;
}

// wear is { head, face, neck, body }; outfit (a single item) is kept for old saves.
// Parts the animations move: .head, .ear-l/.ear-r, .face-eyes, .nose, .body, .tummy, .feet, .paw-l/.paw-r (in front
// of everything, so they can wave, clap or cover his eyes), .tail (the pom-pom peeking out on the right).
// extra: something drawn on top of him in his own coordinates (the holiday hat away from the scene)
export function lucky({ face = 'ok', wear = null, outfit = null, belt = '#FF4F9A', extra = '' } = {}) {
  const u = uid();
  if (!wear) wear = outfit && WEAR_BY_ID[outfit] ? { [WEAR_BY_ID[outfit].slot]: outfit } : {};
  const W = wearLayers(wear, belt);
  const paw = (cls, cx) => `<g class="paw ${cls}"><ellipse cx="${cx}" cy="177" rx="11" ry="9" fill="#FFDDB6"/><path d="M${cx - 4} 184 v-3 M${cx} 185 v-3 M${cx + 4} 184 v-3" stroke="#E9B98C" stroke-width="1.6" stroke-linecap="round"/></g>`;
  return `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" class="lucky-svg">
<defs>
  <radialGradient id="${u}f" cx="42%" cy="32%" r="72%"><stop offset="0" stop-color="#FFC47E"/><stop offset=".55" stop-color="#F59A45"/><stop offset="1" stop-color="#DD7629"/></radialGradient>
  <radialGradient id="${u}e" cx="50%" cy="25%" r="85%"><stop offset="0" stop-color="#F9A452"/><stop offset="1" stop-color="#D26A24"/></radialGradient>
  <linearGradient id="${u}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC7D8"/><stop offset="1" stop-color="#FF9DBB"/></linearGradient>
  <radialGradient id="${u}t" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFE3C4"/></radialGradient>
</defs>
<ellipse cx="100" cy="202" rx="64" ry="7" fill="#000" opacity=".13"/>
<g class="tail"><circle cx="157" cy="176" r="13" fill="url(#${u}t)"/><circle cx="165" cy="170" r="6" fill="#FFF8EE"/><circle cx="163" cy="183" r="5.5" fill="#FFEFDC"/></g>
${W.back}
<g class="body">
  <ellipse cx="100" cy="152" rx="57" ry="48" fill="url(#${u}f)"/>
  <ellipse class="tummy" cx="100" cy="161" rx="33" ry="31" fill="#FFEBD3"/>
  <path d="M90 140 q5 6 10 0 q5 6 10 0" stroke="#F3CFA6" stroke-width="2" fill="none" stroke-linecap="round" pointer-events="none"/>
  <g class="feet"><ellipse cx="67" cy="194" rx="23" ry="10" fill="#FFEBD3"/><ellipse cx="133" cy="194" rx="23" ry="10" fill="#FFEBD3"/>
  <path d="M58 194 v-3 M64 196 v-4 M136 196 v-4 M142 194 v-3" stroke="#E9C29A" stroke-width="2" stroke-linecap="round"/></g>
  ${W.body}
</g>
<g class="head">
  <path d="M86 47 q7 -15 14 -3 q7 -13 14 3" fill="#F59A45" stroke="#DD7629" stroke-width="2" stroke-linejoin="round"/>
  <ellipse cx="100" cy="90" rx="55" ry="47" fill="url(#${u}f)"/>
  <ellipse cx="100" cy="62" rx="22" ry="9" fill="#FFD29B" opacity=".45"/>
  <g class="w-under">${W.under}</g>
  <g class="ear ear-l"><ellipse cx="47" cy="106" rx="18.5" ry="45" transform="rotate(12 47 106)" fill="url(#${u}e)"/>
    <ellipse cx="49" cy="112" rx="8" ry="31" transform="rotate(12 49 112)" fill="url(#${u}i)" opacity=".6"/></g>
  <g class="ear ear-r"><ellipse cx="153" cy="106" rx="18.5" ry="45" transform="rotate(-12 153 106)" fill="url(#${u}e)"/>
    <ellipse cx="151" cy="112" rx="8" ry="31" transform="rotate(-12 151 112)" fill="url(#${u}i)" opacity=".6"/></g>
  <g class="face-eyes f-${face}">${luckyEyes(face)}</g>
  <ellipse cx="72" cy="108" rx="10" ry="6.5" fill="#FF7FA8" opacity=".55"/><ellipse cx="128" cy="108" rx="10" ry="6.5" fill="#FF7FA8" opacity=".55"/>
  <ellipse cx="91" cy="111" rx="11" ry="9" fill="#FFEBD3"/><ellipse cx="109" cy="111" rx="11" ry="9" fill="#FFEBD3"/>
  <g class="nose"><circle cx="100" cy="104" r="13" fill="transparent"/><path d="M93.5 101 q6.5 -4.5 13 0 q-2 6.5 -6.5 7.5 q-4.5 -1 -6.5 -7.5z" fill="#FF6F9A"/><ellipse cx="97.5" cy="101.6" rx="2.2" ry="1.2" fill="#fff" opacity=".55"/></g>
  <g class="face-mouth">${luckyMouth(face)}</g>
  <path d="M80 110 l-18 -3 M80 114 l-17 3 M120 110 l18 -3 M120 114 l17 3" stroke="#D99A6C" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
  <g pointer-events="none"><g class="w-face">${W.over}</g>${W.neck}<g class="w-head">${W.head}</g></g>
</g>
<g class="paws">${paw('paw-l', 84)}${paw('paw-r', 116)}</g>
${extra}
</svg>`;
}

export function dog({ face = 'ok' } = {}) {
  const u = uid();
  const happy = face === 'happy';
  const eye = (cx) => happy
    ? `<path d="M${cx - 9} 96 q9 -11 18 0" stroke="#1E1418" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : `<circle cx="${cx}" cy="94" r="10.5" fill="#4A2C1E"/><circle cx="${cx}" cy="95" r="6.5" fill="#1E1418"/>
       <circle cx="${cx + 3.5}" cy="90" r="3.6" fill="#fff"/><circle cx="${cx - 3}" cy="98" r="1.6" fill="#fff"/>`;
  return `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" class="dog-svg">
<defs><radialGradient id="${u}w" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EDE6F0"/></radialGradient></defs>
<ellipse cx="100" cy="202" rx="50" ry="7" fill="#000" opacity=".13"/>
<path class="tail" d="M134 156 q34 -8 28 -42 q-5 -9 -10 0 q3 24 -22 32z" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
<rect x="72" y="160" width="13" height="38" rx="6.5" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
<rect x="115" y="160" width="13" height="38" rx="6.5" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
<ellipse cx="100" cy="158" rx="40" ry="28" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
<ellipse cx="118" cy="152" rx="14" ry="10" fill="#2B2B33"/><circle cx="82" cy="166" r="5" fill="#2B2B33"/>
<rect x="84" y="168" width="13" height="32" rx="6.5" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
<rect x="103" y="168" width="13" height="32" rx="6.5" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
<g class="dog-head">
  <g class="ear"><path d="M66 82 L46 18 Q52 12 60 18 L98 62Z" fill="#2B2B33"/><path d="M68 74 L54 30 L90 62Z" fill="#FFB8CF"/></g>
  <g class="ear"><path d="M134 82 L154 18 Q148 12 140 18 L102 62Z" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/><path d="M132 74 L146 30 L110 62Z" fill="#FFB8CF"/></g>
  <ellipse cx="100" cy="96" rx="45" ry="38" fill="url(#${u}w)" stroke="#DCD2E0" stroke-width="2"/>
  <ellipse cx="120" cy="92" rx="18" ry="16" fill="#2B2B33"/>
  <circle cx="88" cy="67" r="5" fill="#2B2B33"/>
  ${eye(82)}${eye(118)}
  <ellipse cx="72" cy="110" rx="8" ry="5" fill="#FF8FB1" opacity=".5"/><ellipse cx="128" cy="110" rx="8" ry="5" fill="#FF8FB1" opacity=".5"/>
  <ellipse cx="100" cy="115" rx="17" ry="12" fill="#fff"/>
  <ellipse cx="100" cy="108" rx="7.5" ry="5.5" fill="#1E1418"/><ellipse cx="98" cy="106.5" rx="2.5" ry="1.5" fill="#fff" opacity=".6"/>
  <path d="M100 113 v4 M100 117 q-5 4 -9 0 M100 117 q5 4 9 0" stroke="#1E1418" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  ${happy ? '<path d="M96 119 q4 12 8 0z" fill="#FF6F9A"/>' : ''}
</g>
<path d="M66 128 q34 14 68 0 l0 9 q-34 14 -68 0z" fill="#FF4F9A"/>
<circle cx="100" cy="142" r="6" fill="#FFD23F" stroke="#E6A800" stroke-width="1.5"/>
</svg>`;
}

const flower = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g data-tap="flower"><circle r="16" fill="transparent"/>${[0, 72, 144, 216, 288].map((a) => `<circle cy="-5" r="4.2" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#FFE66D"/></g></g>`;
const cloud = (x, y, s, cls = '') => `<g transform="translate(${x} ${y}) scale(${s})"><g class="cloud ${cls}"><g data-tap="cloud"><circle cx="0" cy="0" r="22" fill="#fff"/><circle cx="24" cy="-10" r="26" fill="#fff"/><circle cx="50" cy="0" r="20" fill="#fff"/><rect x="0" y="0" width="50" height="20" fill="#fff"/></g></g></g>`;

export function scene(bg = 'garden') {
  const u = uid();
  const W = WORLDS[bg];
  if (W) return W(u);
  if (bg === 'dojo') {
    const petals = Array.from({ length: 10 }, (_, i) => `<ellipse class="petal p${i}" cx="${20 + i * 38}" cy="-10" rx="5" ry="3.5" fill="#FF9EC7"/>`).join('');
    return `<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC4E1"/><stop offset="1" stop-color="#FFF1E6"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<circle cx="90" cy="250" r="40" fill="#FF7AA8" opacity=".55"/>
<g data-tap="fuji"><path d="M120 470 L230 300 L340 470Z" fill="#E4B6E6"/><path d="M205 338 L230 300 L255 338 L242 332 L230 342 L218 332Z" fill="#fff"/></g>
<g fill="#FF5C8A" data-tap="gong"><rect x="24" y="318" width="152" height="150" fill="transparent"/><rect x="40" y="330" width="12" height="160"/><rect x="148" y="330" width="12" height="160"/><rect x="24" y="318" width="152" height="14" rx="4"/><rect x="36" y="350" width="128" height="9"/></g>
<rect x="0" y="470" width="400" height="230" fill="#F2D2A2"/>
<path d="M0 520 H400 M0 580 H400 M0 640 H400 M100 470 V700 M200 470 V700 M300 470 V700" stroke="#DDB47E" stroke-width="3"/>
<rect x="0" y="462" width="400" height="12" fill="#C98E5A"/>
<g data-tap="tree"><path d="M360 470 C356 400 340 360 312 330" stroke="#8C5A3C" stroke-width="14" fill="none" stroke-linecap="round"/>
<path d="M350 400 C330 390 300 395 285 380" stroke="#8C5A3C" stroke-width="7" fill="none" stroke-linecap="round"/>
<g fill="#FF9EC7"><circle cx="300" cy="320" r="40"/><circle cx="350" cy="300" r="44"/><circle cx="390" cy="340" r="40"/><circle cx="280" cy="370" r="28"/><circle cx="330" cy="350" r="34"/></g>
<g fill="#FFC2DC"><circle cx="315" cy="305" r="16"/><circle cx="365" cy="290" r="14"/><circle cx="380" cy="335" r="12"/></g></g>
${petals}
</svg>`;
  }
  if (bg === 'candy') {
    const sparkles = [[60, 90], [320, 70], [200, 140], [110, 230], [350, 200], [250, 40]].map(([x, y], i) => `<path class="twinkle t${i % 3}" d="M${x} ${y - 9} l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#fff"/>`).join('');
    const lolly = (x, y, c) => `<g data-tap="lolly"><rect x="${x - 3}" y="${y}" width="6" height="80" fill="#fff"/><circle cx="${x}" cy="${y}" r="26" fill="${c}"/><path d="M${x} ${y} m-16 0 a16 16 0 1 1 16 16 a10 10 0 1 1 -10 -10" stroke="#fff" stroke-width="4" fill="none"/></g>`;
    return `<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C7B4FF"/><stop offset="1" stop-color="#FFC6E6"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>${sparkles}
${cloud(130, 268, .9)}${cloud(262, 238, .78, 'slow')}
${lolly(70, 380, '#FF7AB8')}${lolly(340, 360, '#9B7BFF')}
<path d="M0 450 Q100 380 200 440 T400 420 V700 H0Z" fill="#FFA6D5"/>
<path d="M0 500 Q200 440 400 510 V700 H0Z" fill="#FF84C2"/>
<path d="M0 560 Q200 525 400 565 V700 H0Z" fill="#FF6FB4"/>
${[[40, 470, '#fff'], [120, 520, '#FFE66D'], [300, 490, '#fff'], [360, 540, '#C7B4FF'], [210, 480, '#FFE66D']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`).join('')}
</svg>`;
  }
  if (bg === 'night') {
    const stars = Array.from({ length: 24 }, (_, i) => { const x = (i * 97) % 400, y = 30 + ((i * 53) % 330); return `<g data-tap="star"><circle cx="${x}" cy="${y}" r="14" fill="transparent"/><circle class="twinkle t${i % 3}" cx="${x}" cy="${y}" r="${1.2 + (i % 3) * .7}" fill="#fff"/></g>`; }).join('');
    return `<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D1F4E"/><stop offset="1" stop-color="#5A4A8E"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>${stars}
<g data-tap="moon"><circle cx="310" cy="120" r="70" fill="#FFF3C4" opacity=".08"/><path d="M322 78 a44 44 0 1 0 30 70 a36 36 0 1 1 -30 -70z" fill="#FFF3C4"/></g>
<path d="M0 470 Q120 400 240 460 T400 440 V700 H0Z" fill="#3A3F78"/>
<path d="M0 530 Q200 470 400 540 V700 H0Z" fill="#2E3265"/>
</svg>`;
  }
  // garden
  const fl = [[30, 470, '#FF7AB8'], [70, 500, '#fff'], [120, 470, '#FF5FA2'], [300, 480, '#FFD23F'], [350, 505, '#FF7AB8'], [380, 470, '#fff'],
    [20, 560, '#FF5FA2'], [90, 590, '#FFD23F'], [330, 580, '#FF5FA2'], [380, 610, '#fff'], [60, 640, '#FF7AB8'], [350, 650, '#B78CFF']]
    .map(([x, y, c], i) => flower(x, y, c, 1 + (i % 3) * .25)).join('');
  return `<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6FF"/><stop offset=".7" stop-color="#FFDDF0"/></linearGradient>
<radialGradient id="${u}g"><stop offset="0" stop-color="#FFF6A8"/><stop offset="1" stop-color="#FFF6A8" stop-opacity="0"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="275" cy="245" r="70" fill="url(#${u}g)"/><circle cx="275" cy="245" r="32" fill="#FFE066"/></g>
${cloud(128, 266, .8)}${cloud(232, 334, .68, 'slow')}
<path d="M0 440 Q110 360 230 420 T400 395 V700 H0Z" fill="#B4EBA6"/>
<g data-tap="tree"><path d="M-10 420 C0 360 20 330 40 330" stroke="#9A6B4A" stroke-width="10" fill="none"/>
<g fill="#FFB3D6"><circle cx="40" cy="320" r="36"/><circle cx="72" cy="300" r="30"/><circle cx="10" cy="296" r="28"/></g>
<g fill="#FFD3E8"><circle cx="50" cy="305" r="12"/><circle cx="20" cy="290" r="9"/></g></g>
<path d="M0 485 Q200 425 400 490 V700 H0Z" fill="#86D97D"/>
<path d="M0 560 Q200 530 400 565 V700 H0Z" fill="#6FCB68"/>
${fl}
</svg>`;
}


// ---------- more worlds ----------
const svgOpen = '<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">';
const snow = (n, cls = 'snow') => Array.from({ length: n }, (_, i) => `<circle class="${cls} p${i % 10}" cx="${(i * 47) % 400}" cy="-10" r="${2 + (i % 3)}" fill="#fff"/>`).join('');
const stars = (n) => Array.from({ length: n }, (_, i) => { const x = (i * 83) % 400, y = 20 + ((i * 61) % 380); return `<g data-tap="star"><circle cx="${x}" cy="${y}" r="12" fill="transparent"/><circle class="twinkle t${i % 3}" cx="${x}" cy="${y}" r="${1 + (i % 3) * .8}" fill="#fff"/></g>`; }).join('');
const pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><g data-tap="pine"><rect x="-5" y="40" width="10" height="16" fill="#8C5A3C"/>
  <path d="M0 -40 L28 6 L14 6 L34 40 L-34 40 L-14 6 L-28 6Z" fill="#2E8B57"/><path d="M0 -40 L12 -20 Q0 -16 -12 -20Z M-14 6 Q0 12 14 6 L20 16 Q0 22 -20 16Z M-26 32 Q0 40 26 32 L34 40 L-34 40Z" fill="#fff"/></g></g>`;
const sheep = (x, y, s, flip = 1) => `<g transform="translate(${x} ${y}) scale(${s * flip} ${s})"><g data-tap="sheep">
  <rect x="-12" y="10" width="5" height="14" rx="2" fill="#3A2A3E"/><rect x="6" y="10" width="5" height="14" rx="2" fill="#3A2A3E"/>
  <g fill="#fff"><circle cx="-10" cy="0" r="12"/><circle cx="4" cy="-6" r="13"/><circle cx="14" cy="4" r="11"/><circle cx="-2" cy="8" r="12"/></g>
  <ellipse cx="-22" cy="-2" rx="8" ry="10" fill="#3A2A3E"/><circle cx="-24" cy="-4" r="1.8" fill="#fff"/></g></g>`;

const WORLDS = {
  beach: (u) => `${svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD3FF"/><stop offset="1" stop-color="#FFE9C9"/></linearGradient>
<linearGradient id="${u}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FA9E0"/><stop offset="1" stop-color="#8FE0F7"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<g data-tap="sun"><circle cx="275" cy="250" r="62" fill="#FFF3A8" opacity=".35"/><circle cx="275" cy="250" r="32" fill="#FFD23F"/></g>
${cloud(130, 266, .8)}
<path class="gull" d="M150 280 q10 -10 20 0 q10 -10 20 0" stroke="#fff" stroke-width="3" fill="none"/>
<rect data-tap="sea" x="0" y="380" width="400" height="110" fill="url(#${u}w)"/>
<g class="waves"><path d="M-40 400 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>
<path d="M-20 440 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/></g>
<path d="M0 470 Q200 450 400 480 V700 H0Z" fill="#FFE1A8"/><path d="M0 470 Q200 450 400 480 L400 492 Q200 464 0 484Z" fill="#fff" opacity=".6"/>
<g data-tap="palm"><path d="M52 480 C58 420 70 380 96 350" stroke="#9A6B4A" stroke-width="12" fill="none" stroke-linecap="round"/>
<g fill="#3BAA5E"><path d="M96 350 q-40 -20 -70 6 q34 -8 70 -6z"/><path d="M96 350 q-10 -44 -50 -54 q30 22 50 54z"/><path d="M96 350 q30 -40 70 -34 q-40 6 -70 34z"/><path d="M96 350 q46 0 64 30 q-34 -20 -64 -30z"/></g>
<circle cx="90" cy="358" r="7" fill="#8C5A3C"/><circle cx="102" cy="360" r="7" fill="#7A4A30"/></g>
<g data-tap="shell"><circle cx="300" cy="560" r="16" fill="transparent"/><path d="M288 566 q12 -26 24 0z" fill="#FFB3D6"/><path d="M292 566 l8 -18 M300 566 v-20 M308 566 l-8 -18" stroke="#FF7AB8" stroke-width="1.6"/></g>
<g data-tap="shell"><circle cx="70" cy="620" r="16" fill="transparent"/><path d="M70 606 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1z" fill="#FF9F43"/></g>
<g data-tap="crab" class="crab"><g transform="translate(340 600)"><circle r="30" fill="transparent"/><ellipse cx="0" cy="0" rx="18" ry="11" fill="#FF5C4D"/><circle cx="-6" cy="-12" r="3" fill="#222"/><circle cx="6" cy="-12" r="3" fill="#222"/>
<path d="M-6 -9 v-3 M6 -9 v-3" stroke="#FF5C4D" stroke-width="2"/><path d="M-18 -2 q-10 -10 -4 -16 M18 -2 q10 -10 4 -16 M-14 6 l-8 6 M14 6 l8 6 M-8 9 l-4 7 M8 9 l4 7" stroke="#FF5C4D" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>
</svg>`,

  winter: (u) => `${svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7D3FF"/><stop offset="1" stop-color="#F3F7FF"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
${cloud(240, 245, .8, 'slow')}
<path d="M0 420 L90 300 L160 390 L250 280 L400 430 V700 H0Z" fill="#DCE8FB"/><path d="M90 300 L115 334 L100 330 L90 344 L78 330 L68 330Z M250 280 L278 318 L262 314 L250 330 L238 314 L224 318Z" fill="#fff"/>
${pine(40, 420, 1.1)}${pine(355, 410, 1.3)}${pine(300, 440, .8)}
<path d="M0 470 Q200 430 400 480 V700 H0Z" fill="#F7FBFF"/><path d="M0 540 Q200 510 400 550 V700 H0Z" fill="#EAF2FE"/>
<g data-tap="ice"><ellipse cx="300" cy="600" rx="70" ry="18" fill="#BFE6FF"/><path d="M262 596 l16 -4 M300 606 l20 -6" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>
<g data-tap="snowman"><circle cx="70" cy="560" r="30" fill="#fff" stroke="#DCE8FB" stroke-width="2"/><circle cx="70" cy="512" r="21" fill="#fff" stroke="#DCE8FB" stroke-width="2"/>
<circle cx="63" cy="508" r="2.5" fill="#222"/><circle cx="77" cy="508" r="2.5" fill="#222"/><path d="M70 514 l14 3 -14 3z" fill="#FF8A2B"/>
<rect x="56" y="482" width="28" height="12" rx="2" fill="#3A2A3E"/><rect x="50" y="492" width="40" height="5" rx="2" fill="#3A2A3E"/><path d="M52 530 q18 10 36 0" stroke="#FF5FA2" stroke-width="6" fill="none" stroke-linecap="round"/></g>
${snow(22)}
</svg>`,

  space: (u) => `${svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1030"/><stop offset="1" stop-color="#3A2470"/></linearGradient>
<radialGradient id="${u}p" cx="35%" cy="35%"><stop offset="0" stop-color="#FFB3D6"/><stop offset="1" stop-color="#B05BD6"/></radialGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>${stars(30)}
<g data-tap="planet"><ellipse cx="300" cy="265" rx="64" ry="15" fill="none" stroke="#FFD23F" stroke-width="6" opacity=".8" transform="rotate(-15 300 265)"/>
<circle cx="300" cy="265" r="36" fill="url(#${u}p)"/><path d="M266 256 q34 13 68 -5" stroke="#fff" stroke-width="4" opacity=".35" fill="none"/></g>
<g data-tap="planet"><circle cx="70" cy="330" r="20" fill="#4D9BFF"/><path d="M58 322 q8 -6 14 2 q-2 10 -12 8z M74 336 q8 -4 10 4" fill="#4CD37B"/></g>
<path class="comet" d="M40 220 l60 20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
<path d="M0 480 Q200 440 400 490 V700 H0Z" fill="#8E86B8"/><path d="M0 560 Q200 530 400 570 V700 H0Z" fill="#7A72A6"/>
${[[70, 520, 26], [300, 600, 34], [180, 650, 20], [360, 520, 14]].map(([x, y, r]) => `<g data-tap="crater"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .35}" fill="#6A6394"/><ellipse cx="${x}" cy="${y - 2}" rx="${r * .8}" ry="${r * .25}" fill="#5B5586"/></g>`).join('')}
</svg>`,

  irish: (u) => `${svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD0FF"/><stop offset="1" stop-color="#E6F6FF"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
${cloud(130, 266, .8)}${cloud(252, 312, .7, 'slow')}
<g opacity=".85">${['#FF6B8B', '#FFA24C', '#FFE066', '#6FD68A', '#6FB8FF', '#A98BFF'].map((c, i) => `<path d="M${40 + i * 8} 470 A${160 - i * 8} ${160 - i * 8} 0 0 1 ${360 - i * 8} 470" stroke="${c}" stroke-width="8" fill="none"/>`).join('')}</g>
<path d="M0 420 Q100 360 200 410 T400 390 V700 H0Z" fill="#8ED87E"/>
<g data-tap="castle"><rect x="276" y="330" width="44" height="80" fill="#A8A4AE"/><path d="M276 330 h44 v-10 h-8 v6 h-7 v-6 h-7 v6 h-7 v-6 h-7 v6 h-8z" fill="#A8A4AE"/>
<path d="M292 410 v-22 a6 6 0 0 1 12 0 v22z" fill="#6A6574"/><rect x="286" y="346" width="6" height="10" fill="#6A6574"/><rect x="304" y="346" width="6" height="10" fill="#6A6574"/></g>
<path d="M0 470 Q200 410 400 480 V700 H0Z" fill="#5DBB63"/>
<path d="M0 500 q20 -8 40 -2 t40 0 t40 -4 t40 2 t40 -2 t40 2 t40 -4 t40 2 t40 0 t40 0" stroke="#A8A4AE" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M0 560 Q200 520 400 570 V700 H0Z" fill="#4CAF50"/>
<g data-tap="gold"><path d="M334 470 q-4 -16 16 -16 q20 0 16 16 q-2 12 -16 12 q-14 0 -16 -12z" fill="#2E2A33"/><rect x="332" y="452" width="36" height="6" rx="3" fill="#3A3640"/>
<circle cx="344" cy="450" r="5" fill="#FFD23F"/><circle cx="354" cy="447" r="5" fill="#FFD23F"/><circle cx="350" cy="452" r="5" fill="#FFC21A"/></g>
${sheep(80, 470, 1.2)}${sheep(250, 530, 1, -1)}
${[[40, 610], [120, 650], [210, 600], [330, 640], [370, 590]].map(([x, y]) => `<g transform="translate(${x} ${y})"><g data-tap="clover"><circle r="16" fill="transparent"/><g fill="#2E9E4E"><circle cy="-5" r="4.5"/><circle cx="-5" cy="1" r="4.5"/><circle cx="5" cy="1" r="4.5"/></g><path d="M0 3 q1 6 3 9" stroke="#2E9E4E" stroke-width="1.8" fill="none"/></g></g>`).join('')}
</svg>`,

  castle: (u) => `${svgOpen}
<defs><linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9EC7"/><stop offset=".7" stop-color="#FFD6A5"/></linearGradient></defs>
<rect width="400" height="700" fill="url(#${u}s)"/>
<circle cx="80" cy="250" r="36" fill="#FFF0C4" opacity=".8"/>
<g data-tap="pagoda"><rect x="150" y="300" width="100" height="150" fill="#FFF6EE"/><rect x="170" y="200" width="60" height="100" fill="#FFF6EE"/>
<path d="M120 310 Q200 270 280 310 L260 300 Q200 276 140 300Z" fill="#3A2A3E"/><path d="M146 212 Q200 176 254 212 L238 204 Q200 184 162 204Z" fill="#3A2A3E"/><path d="M176 130 L200 100 L224 130 Q200 120 176 130Z" fill="#3A2A3E"/>
<rect x="184" y="130" width="32" height="70" fill="#FFF6EE"/><path d="M160 306 h80 M176 210 h48" stroke="#FF5FA2" stroke-width="4"/>
<rect x="186" y="380" width="28" height="70" rx="3" fill="#8C5A3C"/><rect x="164" y="330" width="16" height="20" fill="#3A2A3E"/><rect x="220" y="330" width="16" height="20" fill="#3A2A3E"/><rect x="192" y="230" width="16" height="20" fill="#3A2A3E"/></g>
<g data-tap="bamboo"><g stroke="#6FBF5A" stroke-width="10" stroke-linecap="round"><path d="M340 470 V250"/><path d="M370 470 V200"/><path d="M315 470 V300"/></g>
<path d="M335 330 h10 M365 290 h10 M310 380 h10 M365 380 h10" stroke="#4E9A3E" stroke-width="3"/><path d="M340 280 q20 -10 30 -30 M370 240 q-24 -4 -34 -24" stroke="#6FBF5A" stroke-width="4" fill="none"/></g>
${[60, 110].map((x) => `<g data-tap="lamp"><path d="M${x} 360 v30" stroke="#3A2A3E" stroke-width="2"/><ellipse cx="${x}" cy="404" rx="14" ry="18" fill="#FF5C8A"/><rect x="${x - 8}" y="384" width="16" height="4" fill="#3A2A3E"/><rect x="${x - 8}" y="420" width="16" height="4" fill="#3A2A3E"/></g>`).join('')}
<path d="M0 470 Q200 450 400 470 V700 H0Z" fill="#9BD48F"/><path d="M130 700 Q170 580 200 470 L220 470 Q240 580 290 700Z" fill="#E8DCC8"/>
${Array.from({ length: 8 }, (_, i) => `<ellipse class="petal p${i}" cx="${30 + i * 48}" cy="-10" rx="5" ry="3.5" fill="#FF9EC7"/>`).join('')}
</svg>`,
};

export function belt(color, w = 120) {
  const dark = color === '#2E2A33';
  const edge = dark ? '#000' : color === '#FFFFFF' ? '#C9B8CC' : '#00000030';
  return `<svg viewBox="0 0 120 64" width="${w}" xmlns="http://www.w3.org/2000/svg">
<rect x="2" y="16" width="116" height="18" rx="5" fill="${color}" stroke="${edge}" stroke-width="2"/>
<path d="M50 34 L36 60 L48 60 L58 38Z M70 34 L84 60 L72 60 L62 38Z" fill="${color}" stroke="${edge}" stroke-width="2"/>
<rect x="48" y="12" width="24" height="26" rx="6" fill="${color}" stroke="${edge}" stroke-width="2"/>
<path d="M54 20 h12" stroke="${dark ? '#fff4' : '#0002'}" stroke-width="2" stroke-linecap="round"/>
</svg>`;
}

export function icon() {
  return `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="bgI" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB3D9"/><stop offset="1" stop-color="#FF6FB0"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#bgI)"/>
<g transform="translate(36 40) scale(2.2)">${lucky({ face: 'happy', wear: { head: 'headband' } }).replace(/<svg[^>]*>|<\/svg>/g, '')}</g>
</svg>`;
}

// Decorations for Lucky's home (separate pictures placed on the scene)
export function decor(id) {
  switch (id) {
    case 'bowl':
      return `<svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg">
<path d="M26 28 l-6 -18 M36 27 l-2 -22 M46 27 l3 -20 M56 27 l6 -19 M66 28 l9 -15 M40 26 l-12 -14 M60 26 l14 -8" stroke="#E8BF4F" stroke-width="3.2" stroke-linecap="round"/>
<ellipse cx="50" cy="28" rx="42" ry="8" fill="#FFB8D6"/>
<path d="M8 28 H92 Q88 60 50 60 Q12 60 8 28Z" fill="#FF6FB0"/>
<path d="M50 38 c-3 -5 -11 -2 -8 4 l8 7 8 -7 c3 -6 -5 -9 -8 -4z" fill="#fff"/>
<ellipse cx="50" cy="62" rx="34" ry="3" fill="#000" opacity=".1"/></svg>`;
    case 'hutch':
      return `<svg viewBox="0 0 120 124" xmlns="http://www.w3.org/2000/svg">
<rect x="12" y="46" width="96" height="72" rx="7" fill="#F4C48E"/>
<path d="M12 62 H108 M12 80 H108 M12 98 H108" stroke="#E0A86E" stroke-width="2"/>
<path d="M2 52 L60 8 L118 52 Q116 58 110 56 L60 20 L10 56 Q4 58 2 52Z" fill="#FF5FA2"/>
<path d="M14 50 L60 16 L106 50Z" fill="#FF84C0"/>
<path d="M38 118 V88 a22 22 0 0 1 44 0 V118Z" fill="#8C5A3C"/>
<circle cx="60" cy="34" r="9" fill="#fff"/><path d="M60 31 c-2 -3 -7 -1 -5 3 l5 4 5 -4 c2 -4 -3 -6 -5 -3z" fill="#FF5FA2"/>
<rect x="36" y="62" width="48" height="12" rx="4" fill="#fff"/>
<text x="60" y="71.5" font-size="9" font-weight="800" text-anchor="middle" fill="#E23D86" font-family="ui-rounded, system-ui">LUCKY</text></svg>`;
    case 'lantern':
      return `<svg viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg">
<path d="M30 0 V26" stroke="#8C5A3C" stroke-width="2"/>
<circle cx="30" cy="72" r="34" fill="#FFB347" opacity=".25"/>
<rect x="18" y="24" width="24" height="8" rx="3" fill="#3A2A3E"/>
<ellipse cx="30" cy="62" rx="24" ry="31" fill="#FF5C8A"/>
<path d="M8 50 Q30 56 52 50 M6 62 Q30 68 54 62 M8 74 Q30 80 52 74" stroke="#E23D6E" stroke-width="2" fill="none"/>
<ellipse cx="24" cy="54" rx="6" ry="12" fill="#fff" opacity=".3"/>
<rect x="18" y="90" width="24" height="8" rx="3" fill="#3A2A3E"/>
<path d="M26 98 v14 M30 98 v18 M34 98 v14" stroke="#FFD23F" stroke-width="2.4" stroke-linecap="round"/></svg>`;
    case 'rainbow':
      return `<svg viewBox="0 0 200 104" xmlns="http://www.w3.org/2000/svg">
${['#FF6B8B', '#FFA24C', '#FFE066', '#6FD68A', '#6FB8FF', '#A98BFF'].map((c, i) => `<path d="M${14 + i * 8} 96 A${86 - i * 8} ${86 - i * 8} 0 0 1 ${186 - i * 8} 96" stroke="${c}" stroke-width="8" fill="none" opacity=".85"/>`).join('')}
<g fill="#fff"><circle cx="18" cy="94" r="12"/><circle cx="32" cy="98" r="9"/><circle cx="6" cy="100" r="7"/><circle cx="182" cy="94" r="12"/><circle cx="168" cy="98" r="9"/><circle cx="194" cy="100" r="7"/></g></svg>`;
    case 'ball':
      return `<svg viewBox="0 0 60 64" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="30" cy="61" rx="20" ry="3" fill="#000" opacity=".12"/>
<circle cx="30" cy="30" r="28" fill="#FF5FA2"/>
<path d="M30 30 L30 2 A28 28 0 0 1 58 30Z M30 30 L30 58 A28 28 0 0 1 2 30Z" fill="#fff"/>
<path d="M30 30 L58 30 A28 28 0 0 1 30 58Z" fill="#FFD23F"/>
<circle cx="30" cy="30" r="5" fill="#fff" stroke="#FF5FA2" stroke-width="2"/>
<circle cx="19" cy="15" r="5" fill="#fff" opacity=".55"/></svg>`;
    case 'tent':
      return `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 6 L112 96 H8Z" fill="#FF7AB8"/><path d="M60 6 L86 96 H34Z" fill="#FFB3D6"/>
<path d="M60 40 L74 96 H46Z" fill="#8C5A3C"/><path d="M60 6 l0 -6" stroke="#8C5A3C" stroke-width="3"/><path d="M60 0 l14 5 -14 5z" fill="#FFD23F"/><ellipse cx="60" cy="97" rx="56" ry="3" fill="#000" opacity=".1"/></svg>`;
    case 'snowman':
      return `<svg viewBox="0 0 70 110" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="78" r="28" fill="#fff" stroke="#DCE8FB" stroke-width="2"/><circle cx="35" cy="36" r="20" fill="#fff" stroke="#DCE8FB" stroke-width="2"/>
<circle cx="28" cy="32" r="2.5" fill="#222"/><circle cx="42" cy="32" r="2.5" fill="#222"/><path d="M35 38 l13 3 -13 3z" fill="#FF8A2B"/><rect x="22" y="6" width="26" height="12" rx="2" fill="#3A2A3E"/><rect x="16" y="16" width="38" height="5" rx="2" fill="#3A2A3E"/>
<path d="M16 54 q19 10 38 0" stroke="#FF5FA2" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="35" cy="72" r="3" fill="#3A2A3E"/><circle cx="35" cy="86" r="3" fill="#3A2A3E"/></svg>`;
    case 'igloo':
      return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg"><path d="M6 76 A54 54 0 0 1 114 76Z" fill="#F4FAFF" stroke="#CFE2F7" stroke-width="2"/>
<path d="M14 58 H106 M24 40 H96 M40 26 H80 M36 58 V76 M60 40 V58 M84 58 V76 M48 26 V40 M72 26 V40" stroke="#CFE2F7" stroke-width="2"/><path d="M44 76 V60 A16 16 0 0 1 76 60 V76Z" fill="#6FA6D6"/></svg>`;
    case 'rocket':
      return `<svg viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg"><path d="M30 4 Q52 30 48 86 H12 Q8 30 30 4Z" fill="#fff" stroke="#DCD2E0" stroke-width="2"/><path d="M30 4 Q42 18 45 30 H15 Q18 18 30 4Z" fill="#FF5FA2"/>
<circle cx="30" cy="50" r="9" fill="#6FD3FF" stroke="#8B6CFF" stroke-width="3"/><path d="M12 70 L0 96 L14 88Z M48 70 L60 96 L46 88Z" fill="#8B6CFF"/><path class="flame" d="M18 88 Q30 124 42 88Z" fill="#FFB400"/></svg>`;
    case 'castle':
      return `<svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="80" height="66" fill="#FFD6EA"/><rect x="6" y="24" width="26" height="82" fill="#FFC2DF"/><rect x="88" y="24" width="26" height="82" fill="#FFC2DF"/>
<path d="M6 24 L19 2 L32 24Z M88 24 L101 2 L114 24Z" fill="#8B6CFF"/><path d="M20 40 h80 v-8 h-10 v5 h-10 v-5 h-10 v5 h-10 v-5 h-10 v5 h-10 v-5 h-10z" fill="#FFD6EA"/>
<path d="M48 106 V80 A12 12 0 0 1 72 80 V106Z" fill="#8C5A3C"/><rect x="14" y="44" width="10" height="14" rx="5" fill="#8B6CFF"/><rect x="96" y="44" width="10" height="14" rx="5" fill="#8B6CFF"/><path d="M19 2 v-2 l10 4 -10 4" fill="#FF5FA2"/></svg>`;
    case 'pond':
      return `<svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="70" cy="34" rx="66" ry="22" fill="#5BB8E8"/><ellipse cx="70" cy="30" rx="58" ry="16" fill="#7FD0F2"/>
<path d="M40 30 a12 7 0 1 0 22 2 l-10 -2z" fill="#4CAF50"/><circle cx="96" cy="30" r="9" fill="#FF9EC7"/><circle cx="96" cy="30" r="4" fill="#FFE066"/>
<g transform="translate(50 20)"><ellipse cx="0" cy="4" rx="9" ry="6" fill="#6CCB5F"/><circle cx="-4" cy="-2" r="3.5" fill="#6CCB5F"/><circle cx="4" cy="-2" r="3.5" fill="#6CCB5F"/><circle cx="-4" cy="-2" r="1.6" fill="#222"/><circle cx="4" cy="-2" r="1.6" fill="#222"/></g></svg>`;
    default:
      return '';
  }
}

// ---------- holidays (events.js): pictures laid over a world, in the same 400×700 picture so they line up ----------
// Taps go through to the world underneath, except on the holiday things themselves (data-tap="ev…", and the Easter
// eggs and leprechaun coins): each answers a tap, a double tap and a long press (antics.js), and Lucky joins in.
// week: the holiday's last week (a few more things); stage 4: the day itself.

// where holiday things stand in each world: two big spots (L, R) and two small ones (l, r) on the ground,
// kept away from the world's own things and from the middle where Lucky stands; sky: the height bats fly at
const SPOTS = {
  garden: { L: [44, 548], R: [356, 560], l: [20, 652], r: [382, 648], sky: 300 },
  dojo: { L: [36, 566], R: [362, 574], l: [18, 662], r: [384, 664], sky: 280 },
  candy: { L: [40, 566], R: [360, 572], l: [20, 660], r: [382, 652], sky: 300 },
  beach: { L: [24, 548], R: [376, 538], l: [22, 676], r: [384, 684], sky: 300 },
  winter: { L: [22, 646], R: [378, 548], l: [140, 684], r: [384, 668], sky: 300 },
  space: { L: [28, 604], R: [382, 600], l: [22, 672], r: [384, 676], sky: 330 },
  irish: { L: [22, 540], R: [384, 548], l: [18, 664], r: [386, 668], sky: 300 },
  castle: { L: [28, 532], R: [380, 606], l: [20, 662], r: [384, 668], sky: 280 },
  night: { L: [40, 602], R: [360, 606], l: [20, 666], r: [384, 668], sky: 300 },
};
const at = (x, y, s, inner, cls = '') => `<g transform="translate(${x} ${y}) scale(${s})"${cls ? ` class="${cls}"` : ''}>${inner}</g>`;
// a thing that answers taps: the tap target is an inner group, so its bounce doesn't undo the outer placement
const tapG = (id, inner, cls = '', attrs = '') => `<g data-tap="${id}"${cls ? ` class="${cls}"` : ''}${attrs}>${inner}</g>`;

// ----- Halloween -----
// jack-o'-lantern faces: a double tap carves a new one (antics.js swaps them)
export const PUMPKIN_FACES = [
  '<path d="M-14 -5 l6 -8 6 8z M2 -5 l6 -8 6 8z"/><path d="M-14 7 q14 11 28 0 l-4 -1 -3 4 -4 -3 -3 3 -4 -3 -3 3 -3 -4z"/>',
  '<circle cx="-7" cy="-6" r="4.5"/><circle cx="7" cy="-6" r="4.5"/><path d="M-11 5 q11 10 22 0 q-11 4 -22 0z"/>',
  '<path d="M-14 -9 l8 4 -8 4z M14 -9 l-8 4 8 4z"/><ellipse cy="8" rx="6" ry="5"/>',
  '<path d="M-13 -4 q4 -8 8 0z M5 -4 q4 -8 8 0z"/><path d="M-12 5 l4 4 4 -4 4 4 4 -4 4 4 -2 3 -16 0z"/>',
];
// a jack-o'-lantern; lit ones glow (always at night and on the day itself; a tap lights one for a moment)
const pumpkin = (x, y, s = 1, lit = false, face = 0) => at(x, y, s, tapG('evPumpkin', `<ellipse cy="22" rx="27" ry="5" fill="#000" opacity=".12"/>
  <path d="M-2 -17 q-2 -10 7 -14" stroke="#5B8A3C" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="-12" cy="2" rx="14" ry="19" fill="#E86E14"/><ellipse cx="12" cy="2" rx="14" ry="19" fill="#E86E14"/><ellipse cy="2" rx="13" ry="20" fill="#FF922E"/>
  <ellipse cx="-6" cy="-9" rx="4" ry="6" fill="#FFC27A" opacity=".55"/>
  <g class="ev-face" fill="${lit ? '#FFE066' : '#6E2F0A'}">${PUMPKIN_FACES[face % PUMPKIN_FACES.length]}</g>`, 'ev-pumpkin' + (lit ? ' lit' : '')));
// a bat flying across the sky (y: height, d: seconds for one crossing, delay: negative = already on its way)
const bat = (y, d, delay, s = 1) => `<g class="ev-bat" style="--y:${y}px;--d:${d}s;--delay:${delay}s"><g transform="scale(${s})">${tapG('evBat', `<circle r="20" fill="transparent"/>
  <path class="ev-wing" d="M0 0 q-10 -12 -24 -8 q6 4 4 10 q-6 -2 -10 2 q10 2 14 8 q4 -6 16 -6z M0 0 q10 -12 24 -8 q-6 4 -4 10 q6 -2 10 2 q-10 2 -14 8 q-4 -6 -16 -6z" fill="#3A2246"/>
  <ellipse cy="2" rx="5" ry="7" fill="#3A2246"/><path d="M-4 -4 l1 -5 2 4z M4 -4 l-1 -5 -2 4z" fill="#3A2246"/><circle cx="-2" r="1.2" fill="#FFE066"/><circle cx="2" r="1.2" fill="#FFE066"/>`)}</g></g>`;
// a friendly little ghost peeking out (put it before a pumpkin to have it behind)
const ghost = (x, y, s = 1) => at(x, y, s, tapG('evGhost', `<g class="ev-ghost"><path d="M-16 14 v-14 a16 16 0 0 1 32 0 v14 l-5.3 -5 -5.3 5 -5.4 -5 -5.3 5 -5.4 -5z" fill="#fff" stroke="#E6E0F0" stroke-width="1.5"/>
  <ellipse cx="-6" cy="-2" rx="2.6" ry="3.6" fill="#3A2246"/><ellipse cx="6" cy="-2" rx="2.6" ry="3.6" fill="#3A2246"/><ellipse cy="6" rx="3" ry="2.4" fill="#3A2246"/>
  <ellipse cx="-11" cy="3" rx="3" ry="2" fill="#FFB3D6" opacity=".7"/><ellipse cx="11" cy="3" rx="3" ry="2" fill="#FFB3D6" opacity=".7"/></g>`));
// a wrapped sweet (Lucky eats it; it comes back a little later)
const sweet = (x, y, c, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})">${tapG('evSweet', `<circle r="13" fill="transparent"/><path d="M-12 -5 l6 5 -6 5z M12 -5 l-6 5 6 5z" fill="${c}"/><ellipse rx="7" ry="5.5" fill="${c}"/><path d="M-3 -4 q3 4 0 8" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7"/>`, 'ev-sweet')}</g>`;
const candyCorn = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})">${tapG('evSweet', '<circle r="11" fill="transparent"/><path d="M0 -10 L8 8 Q0 11 -8 8Z" fill="#FFF6E0"/><path d="M-5.4 2 L5.4 2 L8 8 Q0 11 -8 8Z" fill="#FF922E"/><path d="M-2.6 -4 L2.6 -4 L5.4 2 L-5.4 2Z" fill="#FFD23F"/>', 'ev-sweet')}</g>`;
const witchHat = (x, y, s = 1) => at(x, y, s, `<ellipse rx="22" ry="5" fill="#5B2A86"/><path d="M-12 -1 Q-4 -30 10 -40 Q6 -22 12 -1Z" fill="#6E35A0"/><path d="M-12 -4 Q0 0 12 -4 L12 -1 Q0 3 -12 -1Z" fill="#FF922E"/>`);
// a bubbling cauldron of green potion
const cauldron = (x, y, s = 1) => at(x, y, s, tapG('evCauldron', `<ellipse cy="26" rx="30" ry="5" fill="#000" opacity=".14"/>
  <path d="M-18 18 l-7 9 M18 18 l7 9" stroke="#2E2A33" stroke-width="4" stroke-linecap="round"/>
  <path d="M-27 -6 q-2 32 27 32 q29 0 27 -32z" fill="#2E2A33"/><path d="M-18 4 q4 14 16 16" stroke="#4A4652" stroke-width="3" fill="none" stroke-linecap="round"/>
  <ellipse cy="-6" rx="28" ry="7.5" fill="#3A3640"/><ellipse cy="-7" rx="23" ry="5" fill="#6FD34E"/>
  <g class="ev-brew" fill="#B6F78E"><circle cx="-9" cy="-9" r="4"/><circle cx="5" cy="-11" r="3"/><circle cx="13" cy="-8" r="2.4"/></g>`, 'ev-cauldron'));

function halloweenScene(world, stage, week) {
  const p = SPOTS[world] || SPOTS.garden, lit = stage >= 4 || world === 'night';
  const back = [], front = [];
  back.push(bat(p.sky, 16, -3), bat(p.sky - 34, 12, -8, 0.8), bat(p.sky + 46, 19, -13, 0.7));
  back.push(ghost(p.L[0] + 8, p.L[1] - 34, 0.85));
  front.push(pumpkin(...p.L, 1, lit, 0), cauldron(p.R[0] - 8, p.R[1] + 6, 0.8), pumpkin(p.R[0] + 6, p.R[1] + 44, 0.62, lit, 1),
    pumpkin(...p.l, 0.6, lit, 3), pumpkin(...p.r, 0.62, lit, 2));
  front.push(sweet(p.L[0] + 22, p.L[1] + 24, '#FF5FA2', -20), candyCorn(p.R[0] - 18, p.R[1] + 32, 15), sweet(p.l[0] + 24, p.l[1] + 10, '#FFD23F', 10));
  // the world's own characters dress up too
  if (world === 'irish') front.push(witchHat(54, 456, 0.5), witchHat(272, 517, 0.45));
  if (world === 'beach') front.push(witchHat(340, 586, 0.36));
  if (week || stage >= 4) {
    back.push(ghost(p.R[0] - 10, p.R[1] - 46, 0.7), bat(p.sky + 12, 9, -2, 0.9));
    front.push(candyCorn(p.r[0] - 26, p.r[1] + 10, -10), sweet(p.l[0] + 42, p.l[1] + 16, '#8B6CFF', 25));
  }
  if (stage >= 4) back.push(bat(p.sky - 54, 11, -6, 0.6), ghost(200, p.sky - 60, 0.6));
  return back.join('') + front.join('');
}

// ----- Christmas and New Year -----
const xmasTree = (x, y, s = 1, star = false, garland = false) => at(x, y, s, tapG('evTree', `<ellipse cy="40" rx="30" ry="5" fill="#000" opacity=".12"/>
  <rect x="-5" y="26" width="10" height="14" fill="#8C5A3C"/>
  <path d="M0 -46 L22 -12 L12 -12 L30 14 L18 14 L36 30 L-36 30 L-18 14 L-30 14 L-12 -12 L-22 -12Z" fill="#2E9E4E"/>
  <path d="M0 -46 L12 -28 Q0 -24 -12 -28Z" fill="#3DBA63"/>
  ${garland ? '<path d="M-16 -6 Q2 2 18 -8 M-26 20 Q0 30 28 18" stroke="#FFD23F" stroke-width="2.4" fill="none"/>' : ''}
  <g class="ev-orn"><circle cx="-10" cy="-2" r="3.6" fill="#E2313B"/><circle cx="12" cy="6" r="3.6" fill="#FFD23F"/><circle cx="-16" cy="22" r="3.6" fill="#4D9BFF"/><circle cx="18" cy="24" r="3.6" fill="#E2313B"/><circle cx="2" cy="16" r="3.2" fill="#FF5FA2"/></g>
  <g class="ev-star${star ? '' : ' off'}">${starPath(0, -50, 0.62)}</g>`, 'ev-tree'));
const present = (x, y, s, c, r) => at(x, y, s, tapG('evPresent', `<ellipse cy="14" rx="18" ry="3.5" fill="#000" opacity=".12"/><rect x="-15" y="-12" width="30" height="26" rx="3" fill="${c}"/>
  <rect x="-3" y="-12" width="6" height="26" fill="${r}"/>
  <g class="ev-lid"><rect x="-17" y="-16" width="34" height="8" rx="2" fill="${c}"/><rect x="-3" y="-16" width="6" height="8" fill="${r}"/><path d="M0 -16 q-12 -12 -12 -2 q0 4 12 2 M0 -16 q12 -12 12 -2 q0 4 -12 2" stroke="${r}" stroke-width="3" fill="none"/></g>`, 'ev-present'));
const cane = (x, y, s = 1) => at(x, y, s, tapG('evCane', `<rect x="-6" y="-16" width="26" height="44" fill="transparent"/><path d="M0 26 V-8 a8 8 0 0 1 16 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M0 26 V-8 a8 8 0 0 1 16 0" stroke="#E2313B" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="4 5"/>`));
const santaHat = (x, y, s = 1) => at(x, y, s, `<path d="M-14 0 Q-4 -26 16 -22 Q8 -14 12 -2Z" fill="#E2313B"/><rect x="-16" y="-3" width="30" height="7" rx="3.5" fill="#fff"/><circle cx="17" cy="-22" r="4.5" fill="#fff"/>`);
// a snowman for the worlds without snow (the winter world has its own)
const snowman = (x, y, s = 1) => at(x, y, s, tapG('evSnowman', `<ellipse cy="34" rx="22" ry="4" fill="#000" opacity=".1"/><circle cy="16" r="19" fill="#fff" stroke="#DCE8FB" stroke-width="1.5"/><circle cy="-14" r="13" fill="#fff" stroke="#DCE8FB" stroke-width="1.5"/>
  <circle cx="-4.5" cy="-16" r="1.8" fill="#2E2A33"/><circle cx="4.5" cy="-16" r="1.8" fill="#2E2A33"/><path d="M0 -12 l9 2 -9 2z" fill="#FF8A2B"/>
  <path d="M-12 -3 q12 7 24 0 l-2 6 q-10 4 -20 0z" fill="#E2313B"/><circle cy="10" r="2" fill="#2E2A33"/><circle cy="19" r="2" fill="#2E2A33"/>
  <path d="M-18 6 l-14 -10 M18 6 l14 -10" stroke="#8C5A3C" stroke-width="2.4" stroke-linecap="round"/>`, 'ev-snowman'));
// ornaments on the pines of the winter world (they are drawn in the world itself)
const pineBaubles = (x, y, s) => at(x, y, s, `<g class="ev-orn"><circle cx="-8" cy="-8" r="3.2" fill="#E2313B"/><circle cx="10" cy="4" r="3.2" fill="#FFD23F"/><circle cx="-16" cy="22" r="3.2" fill="#4D9BFF"/><circle cx="16" cy="26" r="3.2" fill="#FF5FA2"/><circle cx="2" cy="14" r="3" fill="#FFD23F"/></g>`);
// a firework burst in the sky: rays that open and fade, again and again (d: its delay); a tap sets one off there
const burst = (x, y, c, d, s = 1) => at(x, y, s, tapG('evBurst', `<circle r="30" fill="transparent"/><g class="ev-burst" style="--delay:${d}s">${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${(Math.cos(a) * 6).toFixed(1)} ${(Math.sin(a) * 6).toFixed(1)} L${(Math.cos(a) * 26).toFixed(1)} ${(Math.sin(a) * 26).toFixed(1)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`; }).join('')}<circle r="3" fill="#fff"/></g>`));
// Santa's sleigh crossing the sky now and then (in the last week and on the day)
const sleigh = (y) => `<g class="ev-sleigh" style="--y:${y}px">${tapG('evSleigh', '<rect x="-4" y="-22" width="110" height="44" fill="transparent"/><text font-size="30" dominant-baseline="central">🦌🦌🛷</text>')}</g>`;
// the New Year clock, a little before midnight (a long press counts down to it)
const clock = (x, y, s = 1) => at(x, y, s, tapG('evClock', `<ellipse cy="34" rx="18" ry="3.5" fill="#000" opacity=".12"/><rect x="-4" y="14" width="8" height="20" fill="#8C5A3C"/>
  <circle r="20" fill="#FFF8E6" stroke="#E2A800" stroke-width="4"/><circle r="2.5" fill="#2E2A33"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${(Math.sin(a) * 15).toFixed(1)}" cy="${(-Math.cos(a) * 15).toFixed(1)}" r="1.4" fill="#8A5A00"/>`; }).join('')}
  <path class="ev-hand" d="M0 0 L0 -13" stroke="#2E2A33" stroke-width="2.6" stroke-linecap="round"/><path d="M0 0 L-5 -9" stroke="#2E2A33" stroke-width="3" stroke-linecap="round"/>`, 'ev-clock'));
// party balloons on a string (a tap pops one into confetti; it grows back)
const partyBalloon = (x, y, s, c) => at(x, y, s, tapG('evBalloon', `<path d="M0 0 q-5 -16 1 -30" stroke="#9A8AA0" stroke-width="1.4" fill="none"/>
  <g class="ev-bob"><ellipse cx="1" cy="-44" rx="12" ry="15" fill="${c}"/><path d="M-2 -29 l3 3 3 -3z" fill="${c}"/><ellipse cx="-4" cy="-50" rx="3" ry="5" fill="#fff" opacity=".45"/></g>`, 'ev-balloon'));

function christmasScene(world, stage, week) {
  const p = SPOTS[world] || SPOTS.garden, back = [], front = [];
  if (world !== 'winter') back.push(snow(18));
  front.push(xmasTree(p.L[0] + 6, p.L[1] - 18, 1, stage >= 4 || week, true), present(p.L[0] + 24, p.L[1] + 26, 0.75, '#E2313B', '#FFD23F'));
  if (world === 'winter') front.push(pineBaubles(40, 412, 1.1), pineBaubles(355, 398, 1.3), pineBaubles(300, 434, 0.8));
  else front.push(snowman(p.R[0] - 2, p.R[1] - 12, 0.85));
  front.push(present(p.R[0] - 18, p.R[1] + 34, 0.8, '#2E9E4E', '#E2313B'), present(p.R[0] + 16, p.R[1] + 40, 0.6, '#4D9BFF', '#fff'), cane(p.l[0] + 4, p.l[1] - 20, 0.8), cane(p.r[0] - 8, p.r[1] - 22, 0.7));
  if (world === 'irish') front.push(santaHat(52, 457, 0.55), santaHat(270, 518, 0.5));
  if (world === 'beach') front.push(santaHat(338, 588, 0.4));
  front.push(present(p.l[0] + 30, p.l[1] + 8, 0.55, '#FF5FA2', '#fff'));
  if (week || stage >= 4) back.push(sleigh(p.sky - 20));
  return back.join('') + front.join('');
}

function newYearScene(world, stage, week) {
  const p = SPOTS[world] || SPOTS.garden, back = [], front = [];
  back.push(burst(70, p.sky - 30, '#FFD23F', -0.5), burst(330, p.sky - 50, '#FF5FA2', -1.7, 0.9), burst(210, p.sky - 70, '#6FD3FF', -2.6, 0.8));
  front.push(xmasTree(p.L[0] + 6, p.L[1] - 18, 0.95, true, true), present(p.L[0] + 24, p.L[1] + 26, 0.7, '#8B6CFF', '#FFD23F'), clock(p.R[0] - 4, p.R[1] - 6, 0.9),
    present(p.R[0] + 14, p.R[1] + 40, 0.65, '#E2313B', '#fff'));
  front.push(partyBalloon(p.l[0] + 12, p.l[1] + 4, 0.8, '#FF5FA2'), partyBalloon(p.r[0] - 14, p.r[1] + 2, 0.75, '#FFD23F'));
  if (world !== 'winter') back.push(snow(12));
  if (week || stage >= 4) back.push(burst(130, p.sky + 10, '#9BE15D', -3.3, 0.7), burst(280, p.sky + 20, '#FF922E', -0.9, 0.75));
  if (stage >= 4 && world !== 'night') front.push(`<text class="ev-year" x="200" y="${p.sky - 40}" text-anchor="middle" font-size="44" font-weight="900" fill="#FFD23F" stroke="#E2A800" stroke-width="1.5">${new Date().getFullYear()}</text>`);
  return back.join('') + front.join('');
}

// ----- Valentine's Day -----
const HEART = 'M0 7 C-13 -3 -11 -16 0 -9 C11 -16 13 -3 0 7Z';
const heartBalloon = (x, y, s, c) => at(x, y, s, tapG('evHeartBalloon', `<path d="M0 0 q-6 -18 2 -34" stroke="#9A8AA0" stroke-width="1.4" fill="none"/><g class="ev-bob"><path transform="translate(2 -44) scale(1.6)" d="${HEART}" fill="${c}"/>
  <ellipse cx="-4" cy="-52" rx="3" ry="5" fill="#fff" opacity=".45"/></g>`, 'ev-balloon'));
// hearts drifting up from the grass, one after another
const risingHeart = (x, y, c, d, s = 1) => `<g class="ev-rise" style="--delay:${d}s">${tapG('evHeart', `<circle cx="${x}" cy="${y}" r="${14 * s}" fill="transparent"/><path transform="translate(${x} ${y}) scale(${s})" d="${HEART}" fill="${c}"/>`)}</g>`;
const rose = (x, y, s = 1) => at(x, y, s, tapG('evRose', `<rect x="-12" y="-30" width="24" height="44" fill="transparent"/><path d="M0 12 v-22" stroke="#2E9E4E" stroke-width="2.4"/><path d="M0 0 q8 -2 9 -9 q-7 1 -9 6" fill="#3DBA63"/>
  <circle cy="-14" r="8" fill="#E2313B"/><path d="M-5 -15 q5 -6 10 0 q-5 5 -10 0z M-3 -12 q3 3 6 0" stroke="#A5121D" stroke-width="1.4" fill="none"/>`, 'ev-rose'));
// a mailbox full of love letters (a tap sends one to Lucky)
const mailbox = (x, y, s = 1) => at(x, y, s, tapG('evMailbox', `<ellipse cy="38" rx="16" ry="3.5" fill="#000" opacity=".12"/><rect x="-3" y="4" width="6" height="34" fill="#8C5A3C"/>
  <path d="M-16 6 v-14 a16 12 0 0 1 32 0 v14z" fill="#FF5FA2"/><path d="M-16 6 h32" stroke="#E23D86" stroke-width="2"/><rect x="12" y="-14" width="3" height="16" fill="#E2313B"/><path d="M15 -14 h8 v6 h-8z" fill="#E2313B"/>
  <path transform="translate(0 -3) scale(.6)" d="${HEART}" fill="#fff"/>`, 'ev-mailbox'));
function valentineScene(world, stage, week) {
  const p = SPOTS[world] || SPOTS.garden, back = [], front = [];
  front.push(heartBalloon(p.L[0] + 4, p.L[1] + 18, 1, '#FF5FA2'), heartBalloon(p.R[0] - 18, p.R[1] + 18, 0.9, '#E2313B'), mailbox(p.R[0] + 8, p.R[1] + 4, 0.8));
  front.push(rose(p.l[0] + 10, p.l[1] - 4, 0.9), rose(p.l[0] + 28, p.l[1] + 4, 0.75), rose(p.r[0] - 12, p.r[1] - 4, 0.85));
  [[60, '#FF5FA2', -1], [150, '#E2313B', -3.2], [250, '#FF8FC0', -5.1], [340, '#FF5FA2', -2.2]].forEach(([x, c, d]) => back.push(risingHeart(x, 640, c, d, 0.9)));
  if (week || stage >= 4) front.push(heartBalloon(p.l[0] + 6, p.l[1] + 12, 0.7, '#B78CFF'), heartBalloon(p.r[0] - 6, p.r[1] + 12, 0.7, '#FF8FC0'));
  if (stage >= 4) [[100, '#FF8FC0', -4.2], [300, '#E2313B', -0.6], [200, '#FF5FA2', -6]].forEach(([x, c, d]) => back.push(risingHeart(x, 660, c, d, 0.7)));
  return back.join('') + front.join('');
}

// ----- St Patrick's Day -----
const leprechaunHat = (x, y, s = 1) => at(x, y, s, `<ellipse rx="20" ry="4.5" fill="#1E7A3A"/><path d="M-12 -1 L-10 -26 H10 L12 -1Z" fill="#2E9E4E"/><rect x="-11" y="-9" width="22" height="5" fill="#2E2A33"/><rect x="-4" y="-10" width="8" height="7" fill="none" stroke="#FFD23F" stroke-width="2"/>`);
const rainbowPot = (x, y, s = 1) => at(x, y, s, `${['#FF6B8B', '#FFA24C', '#FFE066', '#6FD68A', '#6FB8FF', '#A98BFF'].map((c, i) => `<path d="M${-58 + i * 5} 0 A${58 - i * 5} ${58 - i * 5} 0 0 1 ${58 - i * 5} 0" stroke="${c}" stroke-width="5" fill="none" opacity=".8"/>`).join('')}
  ${tapG('evPot', `<g transform="translate(46 -4)"><circle r="20" fill="transparent"/><path d="M-14 4 q-3 -12 14 -12 q17 0 14 12 q-2 9 -14 9 q-12 0 -14 -9z" fill="#2E2A33"/><rect x="-15" y="-10" width="30" height="5" rx="2.5" fill="#3A3640"/>
  <circle cx="-6" cy="-12" r="4" fill="#FFD23F"/><circle cx="3" cy="-14" r="4" fill="#FFC21A"/><circle cx="9" cy="-11" r="4" fill="#FFD23F"/></g>`)}`);
const clover3 = (x, y, r = 5) => `<g transform="translate(${x} ${y})">${tapG('evClover', `<circle r="${r * 2.2}" fill="transparent"/><g fill="#2E9E4E"><circle cy="${-r}" r="${r}"/><circle cx="${-r}" cy="${r * 0.3}" r="${r}"/><circle cx="${r}" cy="${r * 0.3}" r="${r}"/></g><path d="M0 ${r} q1 ${r} 3 ${r * 1.6}" stroke="#2E9E4E" stroke-width="1.6" fill="none"/>`)}</g>`;
// the leprechaun's gold coins, hidden around every world (found with a tap, like Easter eggs)
const coin = (x, y, i) => at(x, y, 1, `<g data-tap="coin" data-coin="${i}" class="ev-coin"><circle r="13" fill="transparent"/><ellipse cy="9" rx="8" ry="2" fill="#000" opacity=".12"/><circle r="8" fill="#FFD23F" stroke="#E6A800" stroke-width="2"/><path d="M-2.5 -3.5 q5 -2 5 3.5 q0 5 -5 3.5" stroke="#E6A800" stroke-width="1.6" fill="none"/></g>`);
function patrickScene(world, stage, week) {
  const p = SPOTS[world] || SPOTS.garden, front = [];
  front.push(clover3(p.L[0], p.L[1] + 10, 7), clover3(p.L[0] + 26, p.L[1] + 24, 5), clover3(p.R[0], p.R[1] + 14, 6), clover3(p.r[0] - 10, p.r[1], 5));
  if (world !== 'irish') front.push(rainbowPot(p.R[0] - 40, p.R[1] + 8, 0.75));
  if (world === 'irish') front.push(leprechaunHat(52, 458, 0.55), leprechaunHat(271, 519, 0.5));
  if (world === 'beach') front.push(leprechaunHat(338, 589, 0.42));
  front.push(clover3(p.l[0] + 8, p.l[1] + 6, 5), clover3(120, 676, 4), clover3(290, 682, 4));
  const hide = [[p.L[0] + 14, p.L[1] + 40], [p.r[0] - 30, p.r[1] + 6], [p.l[0] + 36, p.l[1] + 14], [96, 690], [306, 692]];
  const hunt = hide.slice(0, week || stage >= 4 ? 5 : 3).map(([x, y], i) => coin(x, y, i));
  return [front.join(''), hunt.join('')];
}

// ----- Easter: painted eggs hidden around the scene (an egg hunt: they can be found with a tap), a basket, chicks -----
const EGG_LOOKS = [['#FFB3D6', '#FF5FA2', 'zig'], ['#B5E8FF', '#4D9BFF', 'dots'], ['#FFF2A8', '#FF922E', 'band'], ['#C7F2B5', '#2E9E4E', 'zig'], ['#D9C7FF', '#8B6CFF', 'dots'], ['#FFE066', '#E2A800', 'gold']];
function egg(x, y, s, look, i) {
  const [base, line, kind] = look;
  const deco = kind === 'zig' ? `<path d="M-9 0 l3 -3 3 3 3 -3 3 3 3 -3 3 3" stroke="${line}" stroke-width="1.8" fill="none"/>`
    : kind === 'dots' ? `<g fill="${line}"><circle cx="-4" cy="-5" r="1.8"/><circle cx="4" cy="-2" r="1.8"/><circle cx="-3" cy="4" r="1.8"/><circle cx="5" cy="6" r="1.5"/></g>`
      : kind === 'band' ? `<path d="M-10 1 h20" stroke="${line}" stroke-width="3.2"/><path d="M-9 -4 h18" stroke="#fff" stroke-width="1.4"/>`
        : '<path d="M-3 -8 l2 3 3 1 -3 1 -2 3 -1 -3 -3 -1 3 -1z" fill="#fff" opacity=".9"/>';
  return at(x, y, s, `<g data-tap="egg" data-egg="${i}" class="ev-egg${kind === 'gold' ? ' gold' : ''}"><ellipse cy="13" rx="10" ry="2.5" fill="#000" opacity=".12"/><path d="M0 -14 C9 -14 12 0 11 4 C10 11 5 13 0 13 C-5 13 -10 11 -11 4 C-12 0 -9 -14 0 -14Z" fill="${base}" stroke="#fff" stroke-width="1"/>${deco}</g>`);
}
const chick = (x, y, s = 1) => at(x, y, s, tapG('evChick', `<circle cy="-2" r="14" fill="transparent"/><g class="ev-bob"><ellipse cy="2" rx="10" ry="9" fill="#FFE066"/><circle cy="-8" r="7" fill="#FFE066"/><circle cx="-2.5" cy="-9" r="1.2" fill="#3A2216"/><circle cx="2.5" cy="-9" r="1.2" fill="#3A2216"/>
  <path d="M-2 -6 l2 3 2 -3z" fill="#FF922E"/><path d="M-8 1 q-6 -2 -6 4 q4 -1 6 1" fill="#FFD23F"/></g>`));
const basket = (x, y, s = 1) => at(x, y, s, tapG('evBasket', `<ellipse cy="16" rx="26" ry="4" fill="#000" opacity=".12"/><path d="M-22 -2 a22 22 0 0 1 44 0" stroke="#C98E5A" stroke-width="3.5" fill="none"/>
  <g class="ev-inbasket"><ellipse cx="-10" cy="-2" rx="6" ry="8" fill="#FFB3D6"/><ellipse cx="2" cy="-4" rx="6" ry="8" fill="#B5E8FF"/><ellipse cx="13" cy="-2" rx="6" ry="8" fill="#FFF2A8"/></g>
  <path d="M-24 -2 h48 l-6 18 h-36z" fill="#E0A86E"/><path d="M-22 4 h44 M-20 10 h40" stroke="#C98E5A" stroke-width="2"/>`));
const tulip = (x, y, c, s = 1) => at(x, y, s, tapG('evTulip', `<rect x="-10" y="-34" width="20" height="36" fill="transparent"/><path d="M0 0 v-18" stroke="#2E9E4E" stroke-width="2.4"/><path d="M0 -6 q-7 -2 -8 -9 q6 1 8 7" fill="#3DBA63"/><path d="M-6 -26 q6 -8 12 0 q0 8 -6 9 q-6 -1 -6 -9z M-6 -26 l3 4 3 -6 3 6 3 -4" fill="${c}"/>`, 'ev-tulip'));
function easterScene(world, stage, week) {
  const p = SPOTS[world] || SPOTS.garden, back = [], front = [];
  // where the eggs hide: next to the big spots, in the corners, along the bottom
  const hide = [[p.L[0] + 22, p.L[1] + 28], [p.R[0] - 12, p.R[1] + 22], [p.l[0] + 6, p.l[1] + 10], [p.r[0] - 6, p.r[1] + 8], [118, 684], [286, 688]];
  const n = stage >= 4 ? 6 : week ? 5 : 4;
  const hunt = hide.slice(0, n).map(([x, y], i) => egg(x, y, 1, EGG_LOOKS[n === 6 && i === 5 ? 5 : i % 5], i));
  front.push(basket(p.L[0] + 2, p.L[1] - 4, 0.9));
  front.push(tulip(p.R[0] + 4, p.R[1] + 6, '#FF5FA2'), tulip(p.R[0] + 16, p.R[1] + 10, '#FFD23F', 0.85), tulip(p.L[0] - 12, p.L[1] + 26, '#B78CFF', 0.85));
  front.push(chick(p.l[0] + 40, p.l[1] - 10, 0.9), chick(p.r[0] - 40, p.r[1] - 12, 0.8));
  return [back.join('') + front.join(''), hunt.join('')];
}

// ----- the birthday: a cake with candles (a tap blows them out, a double tap lights them again), presents, balloons,
// cupcakes, confetti on the grass and a banner along the top -----
const cake = (x, y, s = 1) => at(x, y, s, tapG('evCake', `<ellipse cy="30" rx="36" ry="5" fill="#000" opacity=".12"/>
  <ellipse cy="26" rx="34" ry="6.5" fill="#F4F6FB" stroke="#D5DCE8" stroke-width="1.5"/>
  <rect x="-27" y="2" width="54" height="23" rx="5" fill="#FFF1DC"/>
  <path d="M-27 4 h54 v6 q-4.5 7 -9 0 q-4.5 8 -9 0 q-4.5 7 -9 0 q-4.5 8 -9 0 q-4.5 7 -9 0 q-4.5 8 -9 0z" fill="#FF8FC0"/>
  <rect x="-18" y="-14" width="36" height="17" rx="4" fill="#FFB3D6"/>
  <path d="M-18 -12 h36 v4 q-3 5 -6 0 q-3 6 -6 0 q-3 5 -6 0 q-3 6 -6 0 q-3 5 -6 0 q-3 6 -6 0z" fill="#fff"/>
  ${[[-19, 16, '#6FB8FF', 30], [-8, 20, '#FFD23F', -25], [5, 15, '#9BE15D', 50], [17, 19, '#B78CFF', 10], [-10, -1, '#FF5FA2', 60], [9, 0, '#6FB8FF', -40]]
    .map(([sx, sy, c, r]) => `<rect x="${sx - 3}" y="${sy - 1}" width="6" height="2.2" rx="1.1" fill="${c}" transform="rotate(${r} ${sx} ${sy})"/>`).join('')}
  ${[[-10, '#6FB8FF'], [0, '#FFD23F'], [10, '#9BE15D']].map(([cx, c]) => `<rect x="${cx - 2}" y="-28" width="4" height="14" rx="1.5" fill="${c}"/>
    <path d="M${cx - 2} -24.5 l4 -2 M${cx - 2} -19.5 l4 -2" stroke="#fff" stroke-width="1.2"/>
    <g class="ev-flame"><path d="M${cx} -39 q5 6 0 10 q-5 -4 0 -10z" fill="#FF9F1A"/><path d="M${cx} -35 q2.4 3 0 5.4 q-2.4 -2.4 0 -5.4z" fill="#FFF3B0"/></g>`).join('')}`, 'ev-cake'));
// a cupcake (Lucky eats it; a new one comes a little later)
const cupcake = (x, y, s = 1, c = '#FFB3D6') => at(x, y, s, tapG('evSweet', `<circle r="15" fill="transparent"/><path d="M-9 0 L-7 12 H7 L9 0Z" fill="#FFD39A"/>
  <path d="M-5.5 1 v10 M-2 1 v11 M2 1 v11 M5.5 1 v10" stroke="#E9A85E" stroke-width="1.2"/>
  <path d="M-10 1 q-2 -8 5 -9 q2 -6 5 -6 q3 0 5 6 q7 1 5 9z" fill="${c}"/><circle cy="-13" r="3" fill="#E2313B"/>
  <path d="M-5 -4 l2 -1 M2 -6 l2 1 M5 -1 l1.6 1.4" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`, 'ev-sweet', ' data-e="🧁" data-l="cupcake"'));
// a party hat for the world's own characters
const coneHat = (x, y, s, c) => at(x, y, s, `<path d="M-11 0 L0 -26 L11 0Z" fill="${c}"/><circle cx="-3" cy="-10" r="2" fill="#fff"/><circle cx="3" cy="-17" r="1.6" fill="#fff"/><circle cx="4" cy="-5" r="1.8" fill="#fff"/>
  <path d="M-11 0 Q0 4 11 0" stroke="#FFD23F" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cy="-27" r="3.6" fill="#FFD23F"/>`);
// confetti on the grass
const groundConfetti = () => Array.from({ length: 22 }, (_, i) => {
  const x = 14 + ((i * 71) % 372), y = 600 + ((i * 37) % 92), c = ['#FF5FA2', '#36C5F0', '#FFD23F', '#9BE15D', '#B78CFF'][i % 5];
  return i % 3 ? `<rect x="${x}" y="${y}" width="6" height="3" rx="1" fill="${c}" transform="rotate(${(i * 47) % 180} ${x + 3} ${y + 1.5})"/>` : `<circle cx="${x}" cy="${y}" r="2.4" fill="${c}"/>`;
}).join('');
function birthdayScene(world, stage) {
  const p = SPOTS[world] || SPOTS.garden, back = [groundConfetti()], front = [];
  front.push(cake(p.L[0] + 8, p.L[1] - 4, 1), present(p.L[0] + 36, p.L[1] + 30, 0.6, '#36C5F0', '#FFD23F'));
  front.push(partyBalloon(p.R[0] - 18, p.R[1] + 8, 0.95, '#FF5FA2'), partyBalloon(p.R[0] + 2, p.R[1] + 14, 0.85, '#36C5F0'), partyBalloon(p.R[0] + 18, p.R[1] + 6, 0.9, '#FFD23F'));
  front.push(present(p.R[0] - 4, p.R[1] + 40, 0.75, '#B78CFF', '#fff'), cupcake(p.l[0] + 14, p.l[1] - 2, 0.9), cupcake(p.r[0] - 14, p.r[1] - 2, 0.85, '#B5E8FF'));
  if (world === 'irish') front.push(coneHat(52, 458, 0.55, '#FF5FA2'), coneHat(271, 519, 0.5, '#36C5F0'));
  if (world === 'beach') front.push(coneHat(338, 589, 0.42, '#FFD23F'));
  if (stage >= 4) {
    front.push(partyBalloon(p.l[0] + 34, p.l[1] + 4, 0.7, '#9BE15D'), partyBalloon(p.r[0] - 34, p.r[1] + 2, 0.7, '#B78CFF'), present(p.r[0] - 4, p.r[1] + 14, 0.5, '#FF5FA2', '#fff'));
    [[90, '#FF5FA2', -1.4], [200, '#36C5F0', -4.6], [310, '#FFD23F', -2.8]].forEach(([bx, c, d]) => back.push(`<g class="ev-rise" style="--delay:${d}s">${partyBalloon(bx, 700, 0.7, c)}</g>`));
  }
  return back.join('') + front.join('');
}

// ----- Songkran, the Thai New Year: the water festival. An elephant with a trunk full of water, a silver bowl with
// flowers for the blessing, water pistols and buckets, frangipani flowers -----
const elephant = (x, y, s = 1, flip = 1) => at(x, y, s, tapG('evElephant', `<g transform="scale(${flip} 1)"><ellipse cx="2" cy="34" rx="34" ry="5" fill="#000" opacity=".12"/>
  <rect x="-12" y="14" width="10" height="20" rx="4" fill="#9AA6B5"/><rect x="18" y="14" width="10" height="20" rx="4" fill="#9AA6B5"/>
  <ellipse cx="8" cy="6" rx="27" ry="20" fill="#AEB9C7"/><rect x="-4" y="16" width="10" height="18" rx="4" fill="#AEB9C7"/><rect x="24" y="14" width="10" height="20" rx="4" fill="#AEB9C7"/>
  <path d="M33 0 q8 2 8 9" stroke="#9AA6B5" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-2 -12 h24 q3 0 3 3 v14 h-30 v-14 q0 -3 3 -3z" fill="#E2313B"/><path d="M-5 3 h30" stroke="#FFD23F" stroke-width="2.6"/>
  <g fill="#FFD23F"><circle cx="2" cy="-5" r="1.6"/><circle cx="10" cy="-5" r="1.6"/><circle cx="18" cy="-5" r="1.6"/></g>
  <circle cx="-20" cy="-6" r="15" fill="#B9C3D0"/>
  <path d="M-14 -18 q15 -5 16 10 q-1 13 -13 12 q-7 -9 -3 -22z" fill="#9AA6B5"/><path d="M-11 -13 q9 -2 10 7 q-1 8 -8 7" fill="#F2B8C6" opacity=".55"/>
  <path class="ev-trunk" d="M-31 0 q-8 -1 -9 -12 q-1 -9 5 -16" stroke="#B9C3D0" stroke-width="7.5" fill="none" stroke-linecap="round"/>
  <circle cx="-25" cy="-9" r="1.9" fill="#2E2A33"/><path d="M-29 5 q-4 4 -8 2" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <g class="ev-spray" fill="#5FC3EE">${[[-36, -36, 2.6], [-31, -44, 2], [-40, -46, 2.2], [-27, -38, 1.6], [-44, -40, 1.8]].map(([dx, dy, r]) => `<circle cx="${dx}" cy="${dy}" r="${r}"/>`).join('')}</g></g>`, 'ev-elephant'));
// the silver bowl of scented water with flowers in it (for pouring over the hands of older people for luck)
const waterBowl = (x, y, s = 1) => at(x, y, s, tapG('evBowl', `<ellipse cy="17" rx="26" ry="4" fill="#000" opacity=".12"/>
  <path d="M-24 -2 q2 18 24 18 q22 0 24 -18z" fill="#C9D3DE" stroke="#A9B4C2" stroke-width="1.5"/><path d="M-17 5 q9 7 21 4" stroke="#fff" stroke-width="2" fill="none" opacity=".75"/>
  <path d="M-6 16 h12 l3 4 h-18z" fill="#A9B4C2"/><ellipse cy="-2" rx="24" ry="5" fill="#7FD0F2"/>
  <g class="ev-petals">${[[-11, -3, '#FF8FC0'], [2, -1, '#FFD23F'], [12, -3, '#fff']].map(([fx, fy, c]) => `<g transform="translate(${fx} ${fy})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cy="-2.4" rx="1.8" ry="2.6" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="1.2" fill="#FF9F1A"/></g>`).join('')}</g>`, 'ev-bowl'));
// a toy water pistol: a tap squirts it
const waterGun = (x, y, s = 1, c = '#FF8A1F', flip = 1) => at(x, y, s, tapG('evWaterGun', `<rect x="-22" y="-22" width="46" height="42" fill="transparent"/><g transform="scale(${flip} 1)">
  <ellipse cy="18" rx="16" ry="3" fill="#000" opacity=".12"/><path d="M-10 2 l-5 14 h8 l4 -11z" fill="${c}"/><path d="M-2 4 q2 6 7 4" stroke="#2E2A33" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="-15" y="-7" width="32" height="11" rx="5.5" fill="${c}"/><rect x="15" y="-5" width="8" height="6" rx="2" fill="#2E2A33"/>
  <circle cx="-2" cy="-13" r="7.5" fill="#6FD0F5" stroke="#fff" stroke-width="1.6"/><path d="M-5 -15 q2 -3 5 -2" stroke="#fff" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>`, 'ev-gun'));
const bucket = (x, y, s = 1, c = '#36C5F0') => at(x, y, s, tapG('evBucket', `<ellipse cy="14" rx="16" ry="3" fill="#000" opacity=".12"/><path d="M-12 -10 q12 -16 24 0" stroke="#5A6472" stroke-width="2" fill="none"/>
  <path d="M-13 -8 L-10 13 H10 L13 -8Z" fill="${c}"/><ellipse cy="-8" rx="13" ry="3.4" fill="#7FD0F2" stroke="${c}" stroke-width="1.5"/><path d="M-11 0 h22" stroke="#fff" stroke-width="1.6" opacity=".5"/>`, 'ev-bucket'));
// frangipani (plumeria): white with a yellow heart, everywhere in Thailand
const plumeria = (x, y, s = 1) => at(x, y, s, tapG('evTulip', `<rect x="-14" y="-16" width="28" height="22" fill="transparent"/><path d="M-12 4 q4 -9 12 -6 q-6 4 -12 6z M12 4 q-4 -9 -12 -6 q6 4 12 6z" fill="#3DBA63"/>
  ${[[0, -6], [-9, -2], [8, -1]].map(([fx, fy], k) => `<g transform="translate(${fx} ${fy}) scale(${k ? 0.8 : 1})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cy="-4" rx="2.8" ry="4.4" fill="#fff" stroke="#F2E6C8" stroke-width=".6" transform="rotate(${a})"/>`).join('')}<circle r="2.2" fill="#FFD23F"/></g>`).join('')}`, 'ev-tulip'));
// a sand pagoda on the beach, with paper flags (built for Songkran)
const chedi = (x, y, s = 1) => at(x, y, s, `<ellipse cy="2" rx="16" ry="3.5" fill="#000" opacity=".1"/><path d="M-15 0 L-10 -10 H10 L15 0Z" fill="#EBCB8B"/><path d="M-9 -10 L-6 -20 H6 L9 -10Z" fill="#F2D7A0"/><path d="M-5 -20 L0 -34 L5 -20Z" fill="#EBCB8B"/>
  <path d="M0 -34 v-12" stroke="#8C5A3C" stroke-width="1.2"/><path d="M0 -46 l9 2.5 -9 2.5z" fill="#FF5FA2"/><path d="M-13 -2 v-12 M13 -2 v-12" stroke="#8C5A3C" stroke-width="1"/><path d="M-13 -14 l-7 2 7 2z" fill="#36C5F0"/><path d="M13 -14 l7 2 -7 2z" fill="#FFD23F"/>`);
function songkranScene(world, stage) {
  const p = SPOTS[world] || SPOTS.garden, front = [];
  front.push(elephant(p.L[0] + 18, p.L[1] - 8, 0.95));
  front.push(waterGun(p.R[0] + 2, p.R[1] - 10, 0.9, '#FF8A1F', -1), waterBowl(p.R[0] - 6, p.R[1] + 24, 0.85));
  front.push(plumeria(p.l[0] + 10, p.l[1] - 2), plumeria(p.r[0] - 12, p.r[1] - 4, 0.9), bucket(p.l[0] + 42, p.l[1] + 8, 0.75));
  if (world === 'beach') front.push(chedi(300, 640, 0.9), chedi(330, 652, 0.65));
  if (stage >= 4) front.push(waterGun(p.r[0] - 36, p.r[1] + 4, 0.75, '#9BE15D', -1), bucket(p.R[0] + 22, p.R[1] + 44, 0.6, '#FF5FA2'));
  return front.join('');
}

// ----- Ukrainian Independence Day: sunflowers under a blue sky, wheat, the blue and yellow flag, a branch of kalyna
// (guelder rose), a plate of varenyky, and an embroidered towel along the top -----
const sunflower = (x, y, s = 1, h = 44) => at(x, y, s, tapG('evSunflower', `<rect x="-17" y="${-h - 19}" width="34" height="${h + 23}" fill="transparent"/>
  <ellipse cy="2" rx="10" ry="2.5" fill="#000" opacity=".1"/><path d="M0 2 V${-h}" stroke="#3E9B3E" stroke-width="3.2"/>
  <path d="M0 ${-h * 0.35} q-12 -2 -15 -11 q10 0 15 8 M0 ${-h * 0.6} q12 -2 15 -10 q-10 0 -15 7" fill="#4CAF50"/>
  <g transform="translate(0 ${-h})"><g class="ev-sfhead">${Array.from({ length: 12 }, (_, i) => `<ellipse cy="-10.5" rx="3.6" ry="6.6" fill="${i % 2 ? '#FFC21A' : '#FFD23F'}" transform="rotate(${i * 30})"/>`).join('')}
  <circle r="7.5" fill="#6B3E1E"/><g fill="#8C5A2B"><circle cx="-2.5" cy="-2" r="1.3"/><circle cx="2.5" cy="-2" r="1.3"/><circle cy="2.5" r="1.3"/><circle cx="-3.5" cy="3" r="1"/><circle cx="3.5" cy="3" r="1"/></g></g></g>`, 'ev-sunflower'));
// a sheaf of wheat tied with a blue and yellow ribbon: ears with whiskers on a fan of stalks
const wheatEar = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})">${[0, 1, 2, 3, 4].map((k) => `<ellipse cx="-1.9" cy="${-k * 3.6}" rx="1.9" ry="3" fill="#E8B83A" transform="rotate(-28 -1.9 ${-k * 3.6})"/><ellipse cx="1.9" cy="${-k * 3.6}" rx="1.9" ry="3" fill="#F2C94C" transform="rotate(28 1.9 ${-k * 3.6})"/>`).join('')}
  <path d="M-3 -14 l-4 -7 M3 -14 l4 -7 M-2.6 -8 l-5 -5 M2.6 -8 l5 -5 M0 -16 v-8" stroke="#D9A72B" stroke-width=".8"/></g>`;
const wheat = (x, y, s = 1) => at(x, y, s, tapG('evWheat', `<rect x="-22" y="-58" width="44" height="62" fill="transparent"/><ellipse cy="2" rx="13" ry="2.5" fill="#000" opacity=".1"/>
  <g class="ev-stalks">${[[-18, -42, -24], [-9, -48, -11], [0, -51, 0], [9, -48, 11], [18, -42, 24]].map(([dx, top, r]) => `<path d="M${dx * 0.25} 2 L0 -12 Q${dx * 0.4} -${-top * 0.6} ${dx} ${top}" stroke="#D9A72B" stroke-width="1.6" fill="none"/>${wheatEar(dx, top, r)}`).join('')}</g>
  <path d="M-6 -13 h12" stroke="#0057B7" stroke-width="3.4"/><path d="M-6 -10 h12" stroke="#FFD700" stroke-width="3"/>`, 'ev-wheat'));
// the flag of Ukraine: blue for the sky, yellow for the fields of wheat
const uaFlag = (x, y, s = 1) => at(x, y, s, tapG('evFlag', `<rect x="-6" y="-62" width="44" height="66" fill="transparent"/><ellipse cy="2" rx="8" ry="2.5" fill="#000" opacity=".12"/>
  <rect x="-1.5" y="-58" width="3" height="60" rx="1.5" fill="#8C5A3C"/><circle cy="-59" r="3" fill="#FFD23F"/>
  <g class="ev-wave"><path d="M1.5 -56 q8 -4 16 0 t16 0 v11 q-8 -4 -16 0 t-16 0z" fill="#0057B7"/><path d="M1.5 -45 q8 -4 16 0 t16 0 v11 q-8 -4 -16 0 t-16 0z" fill="#FFD700"/></g>`, 'ev-flag'));
// a branch of kalyna with its red berries
const kalyna = (x, y, s = 1) => at(x, y, s, tapG('evKalyna', `<circle cy="-4" r="17" fill="transparent"/><path d="M-13 9 q9 -11 24 -15" stroke="#6B4A2B" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M3 -5 q6 -10 14 -8 q-2 8 -14 8z M-5 2 q-8 -9 -15 -5 q4 9 15 5z" fill="#4CAF50"/>
  <g fill="#E2313B">${[[-2, -8], [2, -11], [5, -7], [1, -4], [-4, -3], [6, -12], [-1, -13]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="2.6"/>`).join('')}</g><g fill="#fff" opacity=".6"><circle cx="1.2" cy="-11.8" r=".8"/><circle cx="-2.8" cy="-8.8" r=".8"/></g>`, 'ev-kalyna'));
// a plate of varenyky with cherries (Lucky's are with carrot, he says)
const varenyky = (x, y, s = 1) => at(x, y, s, tapG('evSweet', `<circle r="17" fill="transparent"/><ellipse cy="5" rx="17" ry="5.5" fill="#fff" stroke="#2E77D0" stroke-width="2"/>
  ${[[-7, 2], [3, 0], [9, 5]].map(([dx, dy]) => `<path d="M${dx - 6.5} ${dy + 2} q6.5 -10 13 0z" fill="#FFF3D6" stroke="#E8C88E" stroke-width="1"/>`).join('')}
  <circle cx="-2" cy="-4" r="2" fill="#B0123B"/><circle cx="1.5" cy="-5" r="2" fill="#C2185B"/>`, 'ev-sweet', ' data-e="🥟" data-l="varenyky"'));
// a flower wreath for the world's own characters
const smallVinok = (x, y, s) => at(x, y, s, `<path d="M-13 0 Q0 -10 13 0" stroke="#3E9B3E" stroke-width="2.4" fill="none"/>${[[-11, -1, '#E2313B'], [-5, -5, '#2E77D0'], [0, -6, '#FFD23F'], [5, -5, '#2E77D0'], [11, -1, '#E2313B']]
  .map(([fx, fy, c]) => `<circle cx="${fx}" cy="${fy}" r="3.2" fill="${c}"/>`).join('')}<path d="M12 1 q3 8 0 14 M14 0 q6 7 5 13" stroke="#0057B7" stroke-width="1.6" fill="none"/><path d="M13 1 q5 8 2 14" stroke="#FFD700" stroke-width="1.6" fill="none"/>`);
function ukraineScene(world, stage) {
  const p = SPOTS[world] || SPOTS.garden, front = [];
  front.push(sunflower(p.L[0] - 6, p.L[1] + 10, 1, 50), sunflower(p.L[0] + 16, p.L[1] + 18, 0.85, 40), wheat(p.L[0] + 40, p.L[1] + 26, 0.8));
  front.push(uaFlag(p.R[0] - 18, p.R[1] + 20, 0.95), sunflower(p.R[0] + 14, p.R[1] + 24, 0.8, 42));
  front.push(kalyna(p.l[0] + 14, p.l[1] - 2), varenyky(p.r[0] - 18, p.r[1] + 2, 0.9));
  if (world === 'irish') front.push(smallVinok(52, 455, 0.95), smallVinok(271, 516, 0.85));
  if (world === 'beach') front.push(smallVinok(338, 587, 0.7));
  if (stage >= 4) front.push(wheat(p.r[0] - 46, p.r[1] + 8, 0.65), sunflower(p.l[0] + 40, p.l[1] + 10, 0.7, 34));
  return front.join('');
}

// things along the top edge of the scene (HTML, so they stay at the top on every phone); the spider and the lights
// answer taps
const heartString = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 60 30"><path d="M0 3 Q30 9 60 3" stroke="#C8456B" stroke-width="1.2" fill="none"/><path transform="translate(15 14) scale(.8)" d="${HEART}" fill="#FF5FA2"/><path transform="translate(45 14) scale(.8)" d="${HEART}" fill="#E2313B"/><path d="M15 5 v4 M45 5 v4" stroke="#C8456B" stroke-width="1"/></svg>`;
  return `<div class="ev-bunting" style="background-image:url('data:image/svg+xml,${encodeURIComponent(svg)}');background-size:60px 30px"></div>`;
};
// a string of fairy lights: the bulbs twinkle one after another
const lights = (colors) => `<svg class="ev-lights" data-tap="evLights" viewBox="0 0 400 34" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><path d="M0 6 Q50 18 100 6 T200 6 T300 6 T400 6" stroke="#2E5E3A" stroke-width="1.6" fill="none"/>${
  Array.from({ length: 16 }, (_, i) => { const x = 12 + i * 25, y = 7 + Math.abs(Math.sin(((x % 100) / 100) * Math.PI)) * 9; return `<g transform="translate(${x} ${y.toFixed(1)})"><rect x="-2.5" y="-1" width="5" height="4" fill="#556"/><ellipse class="ev-bulb b${i % 3}" cy="8" rx="4.2" ry="6" fill="${colors[i % colors.length]}"/></g>`; }).join('')}</svg>`;
const tinsel = '<svg class="ev-tinsel" viewBox="0 0 400 26" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><path d="M0 6 Q25 22 50 6 T100 6 T150 6 T200 6 T250 6 T300 6 T350 6 T400 6" stroke="#FFD23F" stroke-width="5" fill="none" stroke-dasharray="2 2"/><path d="M0 4 Q25 18 50 4 T100 4 T150 4 T200 4 T250 4 T300 4 T350 4 T400 4" stroke="#D9DEE8" stroke-width="3" fill="none" stroke-dasharray="1 3"/></svg>';
const bunting = (colors) => {
  const fw = 30, w = colors.length * fw;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="30" viewBox="0 0 ${w} 30"><path d="M0 4 Q${w / 2} 9 ${w} 4" stroke="#8C5A3C" stroke-width="1.5" fill="none"/>${colors.map((c, i) => `<path d="M${i * fw + 2} 4 L${i * fw + fw - 2} 4 L${i * fw + fw / 2} 26Z" fill="${c}"/>`).join('')}</svg>`;
  return `<div class="ev-bunting" style="background-image:url('data:image/svg+xml,${encodeURIComponent(svg)}');background-size:${w}px 30px"></div>`;
};
const cobweb = '<svg class="ev-web" viewBox="0 0 100 100" aria-hidden="true"><g stroke="#fff" stroke-width="1.4" fill="none" opacity=".9"><path d="M0 0 L100 32 M0 0 L80 80 M0 0 L32 100 M0 0 L100 0 M0 0 L0 100"/><path d="M22 0 Q19 13 18 18 Q12 19 0 22 M46 0 Q40 26 37 37 Q26 40 0 46 M72 0 Q64 40 57 57 Q40 64 0 72"/></g></svg>';
// a banner of letters on pennants ("HAPPY BIRTHDAY"), once across the top
const BANNER_COLORS = ['#FF5FA2', '#36C5F0', '#FFD23F', '#9BE15D', '#B78CFF'];
const banner = (text) => {
  const ch = [...text], w = 400 / ch.length;
  return `<svg class="ev-banner" viewBox="0 0 400 46" preserveAspectRatio="xMidYMin meet" aria-hidden="true"><path d="M0 6 Q200 22 400 6" stroke="#8C5A3C" stroke-width="1.5" fill="none"/>${ch.map((c, i) => {
    const t = (i + 0.5) / ch.length, x = 400 * t, y = 6 + 32 * t * (1 - t);
    return c === ' ' ? '' : `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((t - 0.5) * -16).toFixed(1)})"><path d="M${(-w / 2 + 1.5).toFixed(1)} 0 H${(w / 2 - 1.5).toFixed(1)} V19 L0 28 L${(-w / 2 + 1.5).toFixed(1)} 19Z" fill="${BANNER_COLORS[i % BANNER_COLORS.length]}"/><text y="14.5" text-anchor="middle" font-size="${Math.min(15, w * 0.62).toFixed(1)}" font-weight="900" fill="#fff">${c}</text></g>`;
  }).join('')}</svg>`;
};
// a garland of jasmine and marigolds with hanging tassels (phuang malai), as in Thailand
const garland = () => `<svg class="ev-garland" viewBox="0 0 400 40" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><path d="M0 4 Q50 16 100 4 T200 4 T300 4 T400 4" stroke="#3DBA63" stroke-width="2" fill="none"/>${
  Array.from({ length: 33 }, (_, i) => { const x = i * 12.5, y = 4 + Math.abs(Math.sin(((x % 100) / 100) * Math.PI)) * 9; return `<circle cx="${x}" cy="${y.toFixed(1)}" r="${i % 3 ? 3.2 : 4.4}" fill="${i % 3 ? '#FFFDF2' : '#FFA41B'}" stroke="${i % 3 ? '#E6E0C8' : '#E08A00'}" stroke-width=".8"/>`; }).join('')}${
  [50, 150, 250, 350].map((x) => `<g class="ev-tassel" transform="translate(${x} 13)"><path d="M0 0 v12" stroke="#FFFDF2" stroke-width="2.4"/><circle cy="14" r="4" fill="#E2313B"/><path d="M-3 17 l-2 9 M0 18 v9 M3 17 l2 9" stroke="#FFD23F" stroke-width="1.4"/></g>`).join('')}</svg>`;
// a rushnyk: a towel with a red and black cross-stitch band, as on a vyshyvanka
const rushnyk = () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18"><rect width="24" height="18" fill="#FFFDF7"/><path d="M0 1.5 h24 M0 16.5 h24" stroke="#C62828" stroke-width="1.6"/><path d="M12 3 l6 6 -6 6 -6 -6z" fill="#C62828"/><path d="M12 6 l3 3 -3 3 -3 -3z" fill="#2E2A33"/><path d="M0 9 l3 -3 3 3 -3 3z M24 9 l-3 -3 -3 3 3 3z" fill="#C62828"/></svg>';
  return `<div class="ev-rushnyk" style="background-image:url('data:image/svg+xml,${encodeURIComponent(svg)}');background-size:24px 18px"></div>`;
};
const TOPS = {
  halloween: () => cobweb + '<div class="ev-spider" data-tap="evSpider"><span>🕷️</span></div>' + bunting(['#FF8A1F', '#3A2246', '#7B3FB8']),
  christmas: () => lights(['#E2313B', '#FFD23F', '#2E9E4E', '#4D9BFF']),
  newyear: () => tinsel + lights(['#FFD23F', '#FF5FA2', '#6FD3FF', '#9BE15D']),
  birthday: () => banner('HAPPY BIRTHDAY'),
  valentine: () => heartString(),
  patrick: () => bunting(['#2E9E4E', '#FFFFFF', '#FF8A1F']),
  easter: () => bunting(['#FFB3D6', '#B5E8FF', '#FFF2A8', '#C7F2B5']),
  songkran: () => garland(),
  ukraine: () => rushnyk() + bunting(['#0057B7', '#FFD700']),
};
const SCENES = { halloween: halloweenScene, christmas: christmasScene, newyear: newYearScene, birthday: birthdayScene, valentine: valentineScene, patrick: patrickScene,
  easter: easterScene, songkran: songkranScene, ukraine: ukraineScene };

// the holiday layer for a world ('night' for the sleep screen); empty when the holiday draws nothing there
// A scene gives its things, and the things to find (Easter eggs, the leprechaun's coins) apart: those are drawn in a
// layer above the decorations (main.js #hunt), so a decoration standing at its usual spot never hides one
const sceneParts = (id, world, stage, week) => { const out = SCENES[id]?.(world, stage, week) || ''; return Array.isArray(out) ? out : [out, '']; };
const layerSvg = (cls, svg) => (svg ? `<svg class="${cls}" viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${svg}</svg>` : '');
export function eventScene(id, world, stage, week = false) {
  return layerSvg('ev-layer', sceneParts(id, world, stage, week)[0]);
}
export function huntScene(id, world, stage, week = false) {
  return layerSvg('ev-hunt', sceneParts(id, world, stage, week)[1]);
}
export function eventTop(id, stage) {
  const html = stage >= 2 ? TOPS[id]?.(stage) || '' : '';
  return html ? `<div class="ev-top">${html}</div>` : '';
}

// ---------- props: things Lucky holds or wears for a moment (drawn in Lucky's coordinates, 200×210) ----------

const em = (x, y, size, ch) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${ch}</text>`;
const drop = (x, y) => `<path transform="translate(${x} ${y})" d="M0 -7 q6 8 0 11 q-6 -3 0 -11z"/>`;
const shamrock = (x, y, r = 5) => `<g transform="translate(${x} ${y})" fill="#2E9E4E"><circle cy="${-r}" r="${r}"/><circle cx="${-r}" cy="${r * 0.3}" r="${r}"/><circle cx="${r}" cy="${r * 0.3}" r="${r}"/></g>`;
const starPath = (x, y, k = 1, fill = '#FFD23F') => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 -16 l4.7 10 11 1.2 -8.2 7.5 2.3 10.8 -9.8 -5.6 -9.8 5.6 2.3 -10.8 -8.2 -7.5 11 -1.2z" fill="${fill}" stroke="#E6A800" stroke-width="2"/>`;
const MASK_FILL = { rainbow: 'url(#ppRainbow)' };

// slot: only one prop per slot at a time
export const PROPS = {
  shades: { slot: 'eyes', art: () => `<path d="M60 83 h36 v5 q0 14 -18 14 q-18 0 -18 -14z M104 83 h36 v5 q0 14 -18 14 q-18 0 -18 -14z" fill="#2A1B2E"/>
    <path d="M56 84 h88" stroke="#FF5FA2" stroke-width="4" stroke-linecap="round"/>
    <path d="M67 91 l9 -3 M111 91 l9 -3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>` },
  specs: { slot: 'eyes', art: () => `<g fill="#fff" fill-opacity=".22" stroke="#8C5A3C" stroke-width="3.2"><circle cx="80" cy="90" r="15"/><circle cx="120" cy="90" r="15"/></g>
    <path d="M95 88 q5 -5 10 0 M65 88 l-12 -4 M135 88 l12 -4" stroke="#8C5A3C" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M72 83 q4 -3 8 -2 M112 83 q4 -3 8 -2" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>` },
  mask: { slot: 'eyes', art: (c = '#2E2A33') => `<defs><linearGradient id="ppRainbow" x1="0" x2="1">${['#FF6B8B', '#FFA24C', '#FFE066', '#6FD68A', '#6FB8FF', '#A98BFF'].map((x, i) => `<stop offset="${i / 5}" stop-color="${x}"/>`).join('')}</linearGradient></defs>
    <path fill-rule="evenodd" d="M46 76 Q100 62 154 76 L154 104 Q100 92 46 104Z M67 90 a13 11 0 1 0 26 0 a13 11 0 1 0 -26 0Z M107 90 a13 11 0 1 0 26 0 a13 11 0 1 0 -26 0Z" fill="${MASK_FILL[c] || c}"/>
    <path d="M154 82 q16 -4 22 -16 M154 92 q18 2 26 -6" stroke="${MASK_FILL[c] || c}" stroke-width="6" fill="none" stroke-linecap="round"/>` },
  coins: { slot: 'eyes', art: () => em(80, 90, 26, '🪙') + em(120, 90, 26, '🪙') },
  cukes: { slot: 'eyes', art: () => em(80, 90, 28, '🥒') + em(120, 90, 28, '🥒') },
  rod: { slot: 'hand', art: () => em(166, 128, 46, '🎣') },
  marsh: { slot: 'hand', art: () => `<path d="M156 170 L182 108" stroke="#C98E5A" stroke-width="3" stroke-linecap="round"/>` + em(184, 102, 26, '🍡') },
  balloonUp: { slot: 'hand', art: () => `<path d="M154 168 Q170 110 162 36" stroke="#9A8AA0" stroke-width="1.6" fill="none"/>` + em(162, 20, 50, '🎈') },
  tophat: { slot: 'head', art: () => `<rect x="74" y="-2" width="52" height="40" rx="4" fill="#2A1B2E"/><rect x="62" y="34" width="76" height="9" rx="4" fill="#2A1B2E"/><rect x="74" y="25" width="52" height="7" fill="#FF5FA2"/>` },
  snowcap: { slot: 'head', art: () => `<g fill="#fff" stroke="#DCE8FB" stroke-width="1.5"><ellipse cx="100" cy="46" rx="30" ry="10"/><circle cx="86" cy="40" r="10"/><circle cx="104" cy="35" r="12"/><circle cx="119" cy="42" r="8"/>
    <ellipse cx="44" cy="68" rx="10" ry="5"/><ellipse cx="156" cy="68" rx="10" ry="5"/></g>` },
  helmet: { slot: 'head', art: () => `<circle cx="100" cy="94" r="70" fill="#BFE9FF" fill-opacity=".22" stroke="#fff" stroke-width="4"/>
    <path d="M50 62 q22 -32 58 -36" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/><path d="M100 24 v-14" stroke="#C9C2D6" stroke-width="3"/><circle cx="100" cy="8" r="5" fill="#FF5FA2"/>` },
  star: { slot: 'head', art: () => starPath(100, 28) },
  crown: { slot: 'head', art: () => [[66, 56], [82, 45], [100, 40], [118, 45], [134, 56]].map(([x, y]) => shamrock(x, y)).join('') },
  petals: { slot: 'head', art: () => `<g fill="#FF9EC7">${[[80, 50, 20], [118, 46, -30], [100, 40, 60], [46, 84, 10], [154, 96, -20], [64, 60, 45]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4" transform="rotate(${a} ${x} ${y})"/>`).join('')}</g>` },
  flower: { slot: 'ear', art: () => `<g transform="translate(148 58)">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-7" r="6" fill="#FF7AB8" transform="rotate(${a})"/>`).join('')}<circle r="4.5" fill="#FFE66D"/></g>` },
  net: { slot: 'hand', art: () => `<g class="pp-net"><path d="M150 176 L186 62" stroke="#C98E5A" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="190" cy="46" rx="20" ry="17" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="3.5"/><path d="M174 44 q16 34 32 0 M181 34 q9 30 18 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/></g>` },
  umbrella: { slot: 'hand', art: () => `<path d="M128 -6 L158 172 q2 10 -8 10" stroke="#8C5A3C" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M44 14 Q128 -84 212 14 Q191 2 170 14 Q149 2 128 14 Q107 2 86 14 Q65 2 44 14Z" fill="#FF5FA2"/>
    <g fill="#fff" opacity=".85"><circle cx="92" cy="-12" r="5"/><circle cx="128" cy="-26" r="5"/><circle cx="164" cy="-12" r="5"/></g><circle cx="128" cy="-36" r="4" fill="#8C5A3C"/>` },
  lolly: { slot: 'hand', art: () => em(162, 150, 44, '🍭') },
  coconut: { slot: 'hand', art: () => `<path d="M158 150 l16 -34" stroke="#FF5FA2" stroke-width="4" stroke-linecap="round"/>` + em(152, 168, 40, '🥥') },
  cherry: { slot: 'hand', art: () => em(100, 172, 34, '🍒') },
  cheese: { slot: 'hand', art: () => em(154, 168, 36, '🧀') },
  shield: { slot: 'hand', art: () => em(156, 164, 46, '🛡️') },
  pearl: { slot: 'hand', art: () => `<circle cx="154" cy="166" r="11" fill="#FFF6FB" stroke="#E6D6EA" stroke-width="2"/><circle cx="150" cy="162" r="3.5" fill="#fff"/>` },
  shell: { slot: 'hand', art: () => em(40, 80, 36, '🐚') },
  shellHand: { slot: 'hand', art: () => em(158, 160, 42, '🐚') },
  earSnow: { slot: 'earsnow', art: () => `<g fill="#fff" stroke="#DCE8FB" stroke-width="1.5"><ellipse cx="54" cy="64" rx="14" ry="7"/><circle cx="47" cy="59" r="6.5"/><circle cx="60" cy="60" r="5"/>
    <ellipse cx="146" cy="64" rx="14" ry="7"/><circle cx="153" cy="59" r="6.5"/><circle cx="140" cy="60" r="5"/><circle cx="38" cy="108" r="4"/><circle cx="162" cy="112" r="4"/><circle cx="44" cy="132" r="3"/></g>` },
  cloverEar: { slot: 'ear', art: () => `<path d="M152 66 q-3 9 -10 13" stroke="#2E9E4E" stroke-width="2.4" fill="none" stroke-linecap="round"/>${shamrock(152, 58, 6.5)}` },
  sled: { slot: 'feet', art: () => em(100, 194, 80, '🛷') },
  broom: { slot: 'feet', art: () => `<g transform="rotate(45 100 188)">${em(100, 190, 92, '🧹')}</g>` },
  // holiday hats (slot 'season': hidden while he wears a hat or has something on his head)
  witchHat: { slot: 'season', art: () => `<g transform="rotate(-8 100 48)"><ellipse cx="100" cy="49" rx="46" ry="9" fill="#5B2A86"/><path d="M75 47 Q90 -6 118 -28 Q110 6 125 47Z" fill="#6E35A0"/>
    <path d="M77 40 Q100 47 124 40 L125 47 Q100 54 76 47Z" fill="#FF922E"/><circle cx="118" cy="-26" r="4.5" fill="#FFE066"/><path d="M94 22 l3 -6 3 6 -6 -4 h6z" fill="#FFE066" opacity=".9"/></g>` },
  santaHat: { slot: 'season', art: () => `<g transform="rotate(-10 100 46)"><path d="M70 46 Q84 -4 124 -6 Q150 -4 156 26 Q140 8 128 16 Q132 32 130 46Z" fill="#E2313B"/>
    <path d="M100 4 Q112 -2 124 4" stroke="#FF6B73" stroke-width="3" fill="none" opacity=".7"/><rect x="66" y="40" width="70" height="14" rx="7" fill="#fff"/><circle cx="156" cy="28" r="9" fill="#fff"/></g>` },
  heartBand: { slot: 'season', art: () => `<path d="M62 62 Q100 22 138 62" stroke="#FF5FA2" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M78 42 q-6 -16 -16 -24 M122 42 q6 -16 16 -24" stroke="#C8456B" stroke-width="2" fill="none"/>
    <g class="pp-boing"><path transform="translate(60 16) scale(1.1)" d="${HEART}" fill="#E2313B"/><path transform="translate(140 16) scale(1.1)" d="${HEART}" fill="#FF5FA2"/></g>` },
  leprechaunHat: { slot: 'season', art: () => `<g transform="rotate(-8 100 46)"><ellipse cx="100" cy="47" rx="44" ry="9" fill="#1E7A3A"/><path d="M76 46 L80 -8 H120 L124 46Z" fill="#2E9E4E"/>
    <rect x="78" y="22" width="44" height="10" fill="#2E2A33"/><rect x="92" y="20" width="16" height="14" fill="none" stroke="#FFD23F" stroke-width="3.5"/>${shamrock(112, 4, 5)}</g>` },
  flowerCrown: { slot: 'season', art: () => `<path d="M58 66 Q100 34 142 66" stroke="#3DBA63" stroke-width="4" fill="none"/>${[[62, 62, '#FFB3D6'], [80, 48, '#FFF2A8'], [100, 43, '#B5E8FF'], [120, 48, '#FFB3D6'], [138, 62, '#D9C7FF']]
    .map(([x, y, c]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-5" r="4.5" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#FFD23F"/></g>`).join('')}` },
  partyHat: { slot: 'season', art: () => `<g transform="rotate(12 100 44)"><path d="M84 46 L104 -14 L124 46Z" fill="#8B6CFF"/><path d="M94 16 L114 16 M89 31 L119 31" stroke="#FFD23F" stroke-width="5"/>
    <path d="M80 44 Q104 52 128 44" stroke="#FF5FA2" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="104" cy="-16" r="6" fill="#FF5FA2"/>
    <path d="M104 -22 l-6 -10 M104 -22 l6 -10 M104 -22 v-12" stroke="#FFD23F" stroke-width="2.4" stroke-linecap="round"/></g>` },
  // the birthday: a polka-dot party hat with a pom-pom
  bdayHat: { slot: 'season', art: () => `<g transform="rotate(-14 100 46)"><path d="M80 48 L100 -12 L120 48Z" fill="#FF5FA2"/>
    <g fill="#fff"><circle cx="99" cy="6" r="3.4"/><circle cx="92" cy="26" r="3.4"/><circle cx="107" cy="20" r="3"/><circle cx="104" cy="38" r="3.4"/><circle cx="89" cy="42" r="2.6"/></g>
    <path d="M77 46 Q100 55 123 46" stroke="#36C5F0" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="100" cy="-14" r="7.5" fill="#FFD23F"/>
    <path d="M94 -18 l-4 -6 M100 -20 v-7 M106 -18 l4 -6" stroke="#36C5F0" stroke-width="2.4" stroke-linecap="round"/></g>` },
  // Songkran: swimming goggles pushed up for the water fight, and a frangipani behind the ear
  goggles: { slot: 'season', art: () => `<path d="M52 72 Q100 36 148 72" stroke="#2E77D0" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g transform="rotate(-3 100 52)"><rect x="71" y="42" width="25" height="17" rx="8.5" fill="#BFE9FF" fill-opacity=".9" stroke="#FF5FA2" stroke-width="4"/>
    <rect x="104" y="42" width="25" height="17" rx="8.5" fill="#BFE9FF" fill-opacity=".9" stroke="#FF5FA2" stroke-width="4"/><path d="M96 50 h8" stroke="#FF5FA2" stroke-width="4"/>
    <path d="M77 47 l6 -2 M110 47 l6 -2" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>
    <g transform="translate(150 70)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cy="-6" rx="4.4" ry="7" fill="#fff" stroke="#F2E6C8" stroke-width="1" transform="rotate(${a})"/>`).join('')}<circle r="3.6" fill="#FFD23F"/></g>` },
  // Independence Day: a vinok, a wreath of sunflowers, poppies and cornflowers with long ribbons
  vinok: { slot: 'season', art: () => `<g class="pp-ribbons">${[['#4CAF50', 'M143 62 q10 24 7 54'], ['#0057B7', 'M147 60 q14 22 12 58'], ['#FFD700', 'M151 58 q20 20 20 54'], ['#E2313B', 'M155 56 q24 16 28 46']]
    .map(([c, d]) => `<path d="${d}" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`).join('')}</g>
    <path d="M56 68 Q100 32 144 68" stroke="#3E9B3E" stroke-width="5" fill="none"/>
    ${[[60, 64, 'poppy'], [72, 52, 'corn'], [86, 45, 'poppy'], [114, 45, 'poppy'], [128, 52, 'corn'], [140, 64, 'poppy']].map(([x, y, k]) => k === 'poppy'
    ? `<g transform="translate(${x} ${y})">${[0, 90, 180, 270].map((a) => `<circle cy="-4" r="4.6" fill="#E2313B" transform="rotate(${a})"/>`).join('')}<circle r="2.6" fill="#2E2A33"/></g>`
    : `<g transform="translate(${x} ${y})">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cy="-4.4" rx="1.8" ry="3.6" fill="#2E77D0" transform="rotate(${a})"/>`).join('')}<circle r="1.8" fill="#1B4F9C"/></g>`).join('')}
    <g transform="translate(100 41)">${Array.from({ length: 12 }, (_, i) => `<ellipse cy="-8" rx="3" ry="5.4" fill="${i % 2 ? '#FFC21A' : '#FFD23F'}" transform="rotate(${i * 30})"/>`).join('')}<circle r="5.6" fill="#6B3E1E"/></g>
    <path d="M64 58 q-6 -6 -2 -12 q4 5 2 12z M136 58 q6 -6 2 -12 q-4 5 -2 12z" fill="#4CAF50"/>` },
  ball: { slot: 'hand', art: () => `<g transform="translate(100 18)"><circle r="20" fill="#FF5FA2"/><path d="M0 0 L0 -20 A20 20 0 0 1 20 0Z M0 0 L0 20 A20 20 0 0 1 -20 0Z" fill="#fff"/><path d="M0 0 L20 0 A20 20 0 0 1 0 20Z" fill="#FFD23F"/><circle r="3.5" fill="#fff" stroke="#FF5FA2" stroke-width="1.5"/></g>` },
  clover: { slot: 'mouth', art: () => em(100, 124, 24, '☘️') },
  hay: { slot: 'mouth', art: () => em(100, 124, 28, '🌾') },
  butterfly: { slot: 'nose', art: () => em(100, 98, 30, '🦋') },
  clownNose: { slot: 'nose', art: () => '<circle cx="100" cy="104" r="10" fill="#FF3B4E"/><circle cx="96.5" cy="100.5" r="3.2" fill="#fff" opacity=".65"/>' },
  // Super Bunny's cape hangs behind him (the props layer behind the drawing) and flies out in the flight
  heroCape: { slot: 'cape', back: true, art: () => `<g class="pp-cape"><path d="M70 126 Q26 172 30 206 L170 206 Q174 172 130 126Z" fill="#E2313B"/>
    <path d="M70 126 Q44 166 46 202" stroke="#FF7A7A" stroke-width="3" fill="none" opacity=".75"/></g>` },
  wet: { slot: 'body', art: () => `<g class="pp-drip" fill="#6FC6FF" stroke="#fff" stroke-width="1">${[[70, 58], [128, 54], [44, 118], [156, 126], [86, 150], [120, 170], [100, 46], [62, 176]].map(([x, y]) => drop(x, y)).join('')}</g>` },
  ring: { slot: 'body', art: () => `<ellipse class="pp-ring" cx="100" cy="158" rx="76" ry="15" fill="none" stroke="#FFD23F" stroke-width="7"/>` },
  dizzy: { slot: 'fx', art: () => `<g transform="translate(100 24) scale(1 .4)"><g class="pp-orbit">${[0, 90, 180, 270].map((a) => { const r = (a * Math.PI) / 180; return starPath(Math.cos(r) * 34, Math.sin(r) * 34, 0.6); }).join('')}</g></g>` },
  bump: { slot: 'bump', art: () => `<ellipse cx="118" cy="44" rx="11" ry="9" fill="#FF9DBB" stroke="#E86A92" stroke-width="2"/><path d="M113 40 q4 -3 8 0" stroke="#fff" stroke-width="2" fill="none"/>` },
};
