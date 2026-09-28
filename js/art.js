import { wearLayers, WEAR_BY_ID } from './wardrobe.js';

// SVG art: Lucky (ginger lop-eared bunny), Tali (chihuahua), scenes, belts.

let uidN = 0;
const uid = () => 'a' + (++uidN);

const INK = '#3A2216';

function luckyEyes(face) {
  const eye = (cx) => `<circle cx="${cx}" cy="90" r="10.5" fill="${INK}"/>
    <circle cx="${cx + 4}" cy="85.5" r="3.8" fill="#fff"/><circle cx="${cx - 3}" cy="94" r="1.7" fill="#fff"/>`;
  const arc = (cx, up) => `<path d="M${cx - 10} ${up ? 93 : 89} q10 ${up ? -12 : 10} 20 0" stroke="${INK}" stroke-width="4.2" fill="none" stroke-linecap="round"/>`;
  switch (face) {
    case 'happy':
    case 'laugh':
      return arc(80, true) + arc(120, true);
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
  switch (face) {
    case 'laugh':
    case 'eat':
      return `<path d="M91 113 q9 14 18 0z" fill="#C8456B"/><rect x="96.5" y="112.5" width="7" height="5" rx="1.5" fill="#fff"/>
        <path d="M100 108 v4" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/>`;
    case 'sad':
      return `<path d="M100 108 v4" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/><path d="M92 120 q8 -7 16 0" stroke="#8A4526" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    case 'sleep':
      return `<path d="M100 108 v3" stroke="#8A4526" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="100" cy="115" rx="3" ry="2.5" fill="#C8456B" opacity=".8"/>`;
    default:
      return base;
  }
}

// wear is { head, face, neck, body }; outfit (a single item) is kept for old saves
export function lucky({ face = 'ok', wear = null, outfit = null, belt = '#FF4F9A' } = {}) {
  const u = uid();
  if (!wear) wear = outfit && WEAR_BY_ID[outfit] ? { [WEAR_BY_ID[outfit].slot]: outfit } : {};
  const W = wearLayers(wear, belt);
  return `<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" class="lucky-svg">
<defs>
  <radialGradient id="${u}f" cx="42%" cy="32%" r="72%"><stop offset="0" stop-color="#FFC47E"/><stop offset=".55" stop-color="#F59A45"/><stop offset="1" stop-color="#DD7629"/></radialGradient>
  <radialGradient id="${u}e" cx="50%" cy="25%" r="85%"><stop offset="0" stop-color="#F9A452"/><stop offset="1" stop-color="#D26A24"/></radialGradient>
  <linearGradient id="${u}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFC7D8"/><stop offset="1" stop-color="#FF9DBB"/></linearGradient>
</defs>
<ellipse cx="100" cy="202" rx="64" ry="7" fill="#000" opacity=".13"/>
${W.back}
<g class="body">
  <ellipse cx="100" cy="152" rx="57" ry="48" fill="url(#${u}f)"/>
  <ellipse class="tummy" cx="100" cy="161" rx="33" ry="31" fill="#FFEBD3"/>
  <g class="feet"><ellipse cx="67" cy="194" rx="23" ry="10" fill="#FFEBD3"/><ellipse cx="133" cy="194" rx="23" ry="10" fill="#FFEBD3"/>
  <path d="M58 194 v-3 M64 196 v-4 M136 196 v-4 M142 194 v-3" stroke="#E9C29A" stroke-width="2" stroke-linecap="round"/></g>
  <ellipse cx="84" cy="177" rx="11" ry="9" fill="#FFDDB6"/><ellipse cx="116" cy="177" rx="11" ry="9" fill="#FFDDB6"/>
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
  ${luckyEyes(face)}
  <ellipse cx="72" cy="108" rx="10" ry="6.5" fill="#FF7FA8" opacity=".55"/><ellipse cx="128" cy="108" rx="10" ry="6.5" fill="#FF7FA8" opacity=".55"/>
  <ellipse cx="91" cy="111" rx="11" ry="9" fill="#FFEBD3"/><ellipse cx="109" cy="111" rx="11" ry="9" fill="#FFEBD3"/>
  <g class="nose"><circle cx="100" cy="104" r="13" fill="transparent"/><path d="M93.5 101 q6.5 -4.5 13 0 q-2 6.5 -6.5 7.5 q-4.5 -1 -6.5 -7.5z" fill="#FF6F9A"/></g>
  ${luckyMouth(face)}
  <path d="M80 110 l-18 -3 M80 114 l-17 3 M120 110 l18 -3 M120 114 l17 3" stroke="#D99A6C" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>
  <g pointer-events="none"><g class="w-face">${W.over}</g>${W.neck}<g class="w-head">${W.head}</g></g>
</g>
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
<g data-tap="sun"><circle cx="325" cy="245" r="70" fill="url(#${u}g)"/><circle cx="325" cy="245" r="32" fill="#FFE066"/></g>
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
<g data-tap="sun"><circle cx="320" cy="250" r="62" fill="#FFF3A8" opacity=".35"/><circle cx="320" cy="250" r="32" fill="#FFD23F"/></g>
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
  ball: { slot: 'hand', art: () => `<g transform="translate(100 18)"><circle r="20" fill="#FF5FA2"/><path d="M0 0 L0 -20 A20 20 0 0 1 20 0Z M0 0 L0 20 A20 20 0 0 1 -20 0Z" fill="#fff"/><path d="M0 0 L20 0 A20 20 0 0 1 0 20Z" fill="#FFD23F"/><circle r="3.5" fill="#fff" stroke="#FF5FA2" stroke-width="1.5"/></g>` },
  clover: { slot: 'mouth', art: () => em(100, 124, 24, '☘️') },
  hay: { slot: 'mouth', art: () => em(100, 124, 28, '🌾') },
  butterfly: { slot: 'nose', art: () => em(100, 98, 30, '🦋') },
  wet: { slot: 'body', art: () => `<g class="pp-drip" fill="#6FC6FF" stroke="#fff" stroke-width="1">${[[70, 58], [128, 54], [44, 118], [156, 126], [86, 150], [120, 170], [100, 46], [62, 176]].map(([x, y]) => drop(x, y)).join('')}</g>` },
  ring: { slot: 'body', art: () => `<ellipse class="pp-ring" cx="100" cy="158" rx="76" ry="15" fill="none" stroke="#FFD23F" stroke-width="7"/>` },
  dizzy: { slot: 'fx', art: () => `<g transform="translate(100 24) scale(1 .4)"><g class="pp-orbit">${[0, 90, 180, 270].map((a) => { const r = (a * Math.PI) / 180; return starPath(Math.cos(r) * 34, Math.sin(r) * 34, 0.6); }).join('')}</g></g>` },
  bump: { slot: 'bump', art: () => `<ellipse cx="118" cy="44" rx="11" ry="9" fill="#FF9DBB" stroke="#E86A92" stroke-width="2"/><path d="M113 40 q4 -3 8 0" stroke="#fff" stroke-width="2" fill="none"/>` },
};
