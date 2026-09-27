// Гардероб Лаки: 4 слота, вещи можно сочетать. Координаты — как у Лаки (viewBox 0 0 200 210):
// голова — центр (100,90), глаза (80,90) и (120,90), нос (100,104), подбородок ~137, тело — центр (100,152).
// Слои: back (за телом), body (поверх тела), under (под глазами), over (поверх лица), neck, head (на голове).

export const SLOTS = ['head', 'face', 'neck', 'body'];

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.round(Math.min(255, v * k)).toString(16).padStart(2, '0');
  return '#' + c(n >> 16) + c((n >> 8) & 255) + c(n & 255);
}

const star5 = (cx, cy, r, fill) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
};
const heart = (cx, cy, s, fill, extra = '') => `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 6 C-10 -2 -8 -12 0 -7 C8 -12 10 -2 0 6Z" fill="${fill}" ${extra}/>`;
const flowerDot = (x, y, c) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cy="-5" r="4.6" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="3.4" fill="#FFF3A8"/></g>`;

// rarity: common — за уровни, rare — в подарках, gold — редкие подарки и альбомы
export const WEAR = [
  // ---------- голова ----------
  { id: 'headband', slot: 'head', level: 2, name: ['Ниндзя-повязка', 'Ninja headband'],
    art: (belt) => {
      const white = belt === '#FFFFFF';
      const edge = white ? ' stroke="#D9C8DC" stroke-width="1.5"' : ` stroke="${shade(belt, belt === '#FF9F43' ? 0.62 : 0.75)}" stroke-width="${belt === '#FF9F43' ? 2.4 : 1.5}"`;
      return { head: `<path d="M50 72 Q100 48 150 72 L150 84 Q100 60 50 84Z" fill="${belt}"${edge}/>
        <path d="M152 74 q22 -8 32 2 q-14 1 -30 8z" fill="${belt}"${edge}/><path d="M152 80 q18 8 24 22 q-12 -8 -26 -14z" fill="${shade(belt, 0.92)}"${edge}/>
        <circle cx="152" cy="78" r="7" fill="${white ? '#E4D8E6' : shade(belt, 0.8)}"/>
        <circle cx="100" cy="62" r="7.5" fill="${white ? '#FF5FA2' : '#fff'}"/>${star5(100, 62.5, 5.5, white ? '#fff' : belt)}` };
    } },
  { id: 'bow', slot: 'head', level: 3, name: ['Бантик', 'Bow'],
    art: () => ({ head: `<g transform="translate(68 52) rotate(-18)"><path d="M0 0 L-20 -13 Q-24 0 -20 13Z" fill="#FF5FA2"/><path d="M0 0 L20 -13 Q24 0 20 13Z" fill="#FF5FA2"/>
      <path d="M-4 -2 L-16 -8 M4 -2 L16 -8" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/><circle r="6" fill="#E23D86"/></g>` }) },
  { id: 'flowers', slot: 'head', level: 5, name: ['Венок', 'Flower crown'],
    art: () => ({ head: `<path d="M54 70 Q100 36 146 70" stroke="#5BBE5E" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${[[60, 64, '#FF7AB8'], [76, 52, '#FFD23F'], [100, 46, '#FF5FA2'], [124, 52, '#B78CFF'], [140, 64, '#FF7AB8']].map(([x, y, c]) => flowerDot(x, y, c)).join('')}` }) },
  { id: 'crown', slot: 'head', level: 10, name: ['Корона', 'Crown'],
    art: () => ({ head: `<path d="M72 50 L78 22 L91 38 L100 14 L109 38 L122 22 L128 50Z" fill="#FFD23F" stroke="#E6A800" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="100" cy="40" r="4.5" fill="#FF4F9A"/><circle cx="84" cy="44" r="3" fill="#6FD3FF"/><circle cx="116" cy="44" r="3" fill="#6FD3FF"/>` }) },
  { id: 'pompom', slot: 'head', level: 18, name: ['Шапка с помпоном', 'Bobble hat'],
    art: () => ({ head: `<path d="M54 66 Q100 4 146 66Z" fill="#FF7AB8"/><path d="M68 54 l7 -12 M88 44 l4 -14 M112 44 l-4 -14 M132 54 l-7 -12" stroke="#FFB3D6" stroke-width="4" stroke-linecap="round"/>
      <rect x="52" y="58" width="96" height="15" rx="7.5" fill="#FFD1E6"/><circle cx="100" cy="16" r="12" fill="#fff"/><circle cx="96" cy="12" r="4" fill="#FFE9F4"/>` }) },
  { id: 'party', slot: 'head', level: 21, name: ['Праздничный колпак', 'Party hat'],
    art: () => ({ head: `<g transform="rotate(14 118 40)"><path d="M100 56 L118 0 L136 56Z" fill="#8B6CFF"/><path d="M106 40 L130 40 M110 26 L126 26 M114 13 L122 13" stroke="#FFD23F" stroke-width="5" stroke-linecap="round"/>
      <circle cx="118" cy="0" r="7.5" fill="#FF5FA2"/></g>` }) },
  { id: 'carrotHat', slot: 'head', rarity: 'rare', name: ['Шапка-морковка', 'Carrot hat'],
    art: () => ({ head: `<g transform="rotate(-10 100 40)"><path d="M76 54 Q100 -22 124 54Z" fill="#FF8A2B" stroke="#E06B12" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M84 40 h14 M104 30 h12 M92 16 h10" stroke="#E06B12" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M100 -10 q-14 -12 -8 -22 q6 10 8 14 q0 -14 10 -20 q2 14 -10 28z" fill="#4CB84C"/></g>` }) },
  { id: 'frogHat', slot: 'head', rarity: 'rare', name: ['Шапка-лягушка', 'Frog hat'],
    art: () => ({ head: `<path d="M52 64 Q100 6 148 64 Q100 52 52 64Z" fill="#6CCB5F"/>
      <circle cx="76" cy="32" r="13" fill="#6CCB5F"/><circle cx="124" cy="32" r="13" fill="#6CCB5F"/>
      <circle cx="76" cy="31" r="8" fill="#fff"/><circle cx="124" cy="31" r="8" fill="#fff"/><circle cx="78" cy="32" r="4" fill="#222"/><circle cx="122" cy="32" r="4" fill="#222"/>
      <path d="M86 50 q14 9 28 0" stroke="#3E8E37" stroke-width="3" fill="none" stroke-linecap="round"/>` }) },
  { id: 'viking', slot: 'head', level: 19, name: ['Шлем викинга', 'Viking helmet'],
    art: () => ({ head: `<path d="M60 50 q-24 -8 -22 -38 q12 18 30 24z M140 50 q24 -8 22 -38 q-12 18 -30 24z" fill="#FFF6DD" stroke="#D8CBA8" stroke-width="2"/>
      <path d="M56 64 Q100 8 144 64Z" fill="#B7BDCA"/><rect x="54" y="57" width="92" height="12" rx="6" fill="#8C93A3"/>
      <circle cx="72" cy="63" r="2.5" fill="#E6E9EF"/><circle cx="100" cy="63" r="2.5" fill="#E6E9EF"/><circle cx="128" cy="63" r="2.5" fill="#E6E9EF"/>` }) },
  { id: 'chefHat', slot: 'head', rarity: 'rare', name: ['Колпак повара', "Chef's hat"],
    art: () => ({ head: `<g fill="#fff" stroke="#E5DDE8" stroke-width="2"><circle cx="78" cy="34" r="17"/><circle cx="100" cy="22" r="21"/><circle cx="122" cy="34" r="17"/></g>
      <rect x="70" y="32" width="60" height="18" fill="#fff"/><rect x="68" y="46" width="64" height="12" rx="3" fill="#fff" stroke="#E5DDE8" stroke-width="2"/>` }) },
  { id: 'unicorn', slot: 'head', rarity: 'gold', name: ['Рог единорога', 'Unicorn horn'],
    art: () => ({ head: `<path d="M91 52 L100 0 L109 52Z" fill="#FFE9F6" stroke="#FF8CC6" stroke-width="2" stroke-linejoin="round"/>
      <path d="M93 42 l14 -5 M95 29 l11 -4 M97 16 l7 -3" stroke="#FF8CC6" stroke-width="2" stroke-linecap="round"/>
      ${flowerDot(80, 54, '#B78CFF')}${flowerDot(120, 54, '#FFD23F')}` }) },

  // ---------- лицо ----------
  { id: 'glasses', slot: 'face', level: 6, name: ['Очки-звёздочки', 'Star glasses'],
    art: () => ({ over: `${[80, 120].map((cx) => `<path d="M${cx} 72 l5.3 11 12 1.6 -8.8 8.4 2.2 12 -10.7 -5.8 -10.7 5.8 2.2 -12 -8.8 -8.4 12 -1.6z" fill="#FF9BD0" fill-opacity=".35" stroke="#FF3E8E" stroke-width="3.2" stroke-linejoin="round"/>`).join('')}
      <path d="M92 86 q8 -5 16 0" stroke="#FF3E8E" stroke-width="3" fill="none"/>` }) },
  { id: 'mask', slot: 'face', level: 8, name: ['Ниндзя-маска', 'Ninja mask'],
    art: () => ({ under: `<path d="M47 78 Q100 66 153 78 L153 102 Q100 92 47 102Z" fill="#E8408F"/>
      <path d="M152 84 q22 -8 32 2 q-14 1 -30 8z M152 92 q18 8 24 22 q-12 -8 -26 -14z" fill="#FF6FB0"/>` }) },
  { id: 'bigGlasses', slot: 'face', level: 17, name: ['Огромные очки', 'Giant glasses'],
    art: () => ({ over: `<path d="M63 88 L48 84 M137 88 L152 84" stroke="#3A2A3E" stroke-width="4" stroke-linecap="round"/>
      <circle cx="80" cy="90" r="18" fill="#DDF3FF" fill-opacity=".3" stroke="#3A2A3E" stroke-width="4.5"/><circle cx="120" cy="90" r="18" fill="#DDF3FF" fill-opacity=".3" stroke="#3A2A3E" stroke-width="4.5"/>
      <path d="M97 87 q3 -4 6 0" stroke="#3A2A3E" stroke-width="4" fill="none"/><path d="M70 80 l6 -4 M110 80 l6 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>` }) },
  { id: 'heartGlasses', slot: 'face', level: 23, name: ['Очки-сердечки', 'Heart glasses'],
    art: () => ({ over: `${heart(80, 92, 1.9, '#FF5FA2', 'fill-opacity=".45" stroke="#E23D86" stroke-width="1.6"')}${heart(120, 92, 1.9, '#FF5FA2', 'fill-opacity=".45" stroke="#E23D86" stroke-width="1.6"')}
      <path d="M95 88 q5 -4 10 0" stroke="#E23D86" stroke-width="3" fill="none"/>` }) },
  { id: 'moustache', slot: 'face', rarity: 'rare', name: ['Усы', 'Moustache'],
    art: () => ({ over: `<path d="M100 108 c-6 -6 -18 -8 -26 -2 c-6 4 -11 -1 -13 -5 c0 11 10 17 23 15 c8 -1 12 -4 16 -6 c4 2 8 5 16 6 c13 2 23 -4 23 -15 c-2 4 -7 9 -13 5 c-8 -6 -20 -4 -26 2z" fill="#3A2216"/>` }) },
  { id: 'clownNose', slot: 'face', rarity: 'rare', name: ['Клоунский нос', 'Clown nose'],
    art: () => ({ over: `<circle cx="100" cy="104" r="10" fill="#FF3B4E"/><circle cx="96.5" cy="100.5" r="3.2" fill="#fff" opacity=".65"/>` }) },
  { id: 'eyepatch', slot: 'face', rarity: 'gold', name: ['Пиратская повязка', 'Pirate eyepatch'],
    art: () => ({ over: `<path d="M52 70 L150 100" stroke="#222" stroke-width="3.5"/><ellipse cx="120" cy="90" rx="15" ry="13" fill="#222"/>
      <path d="M113 86 l5 4 -5 4 M127 86 l-5 4 5 4" stroke="#fff" stroke-width="1.8" fill="none" opacity=".8"/>` }) },

  // ---------- шея ----------
  { id: 'scarf', slot: 'neck', level: 12, name: ['Ниндзя-шарф', 'Ninja scarf'],
    art: () => ({ neck: `<path d="M58 128 Q100 150 142 128 L144 142 Q100 164 56 142Z" fill="#FF5FA2"/>
      <path d="M58 133 Q100 155 142 133" stroke="#FFD1E6" stroke-width="3" fill="none" stroke-dasharray="6 7"/>
      <path d="M116 146 l12 36 -13 3 -8 -35z" fill="#FF7AB8"/><path d="M116 182 v7 M121 181 v7 M126 180 v7" stroke="#FF5FA2" stroke-width="2.4" stroke-linecap="round"/>` }) },
  { id: 'bowtie', slot: 'neck', level: 14, name: ['Бабочка', 'Bow tie'],
    art: () => ({ neck: `<path d="M100 140 L80 128 Q76 140 80 152Z M100 140 L120 128 Q124 140 120 152Z" fill="#8B6CFF"/>
      <circle cx="86" cy="136" r="2" fill="#fff"/><circle cx="84" cy="146" r="2" fill="#fff"/><circle cx="114" cy="136" r="2" fill="#fff"/><circle cx="116" cy="146" r="2" fill="#fff"/>
      <rect x="95" y="135" width="10" height="10" rx="3" fill="#6B4FE0"/>` }) },
  { id: 'lei', slot: 'neck', rarity: 'rare', name: ['Цветочные бусы', 'Flower necklace'],
    art: () => ({ neck: [[62, 130, '#FF7AB8'], [74, 139, '#FFD23F'], [87, 145, '#FF5FA2'], [100, 147, '#B78CFF'], [113, 145, '#FF7AB8'], [126, 139, '#FFD23F'], [138, 130, '#FF5FA2']].map(([x, y, c]) => flowerDot(x, y, c)).join('') }) },
  { id: 'bell', slot: 'neck', rarity: 'rare', name: ['Колокольчик', 'Bell collar'],
    art: () => ({ neck: `<path d="M60 130 Q100 150 140 130 L140 139 Q100 159 60 139Z" fill="#4D9BFF"/>
      <path d="M92 150 Q100 136 108 150 L110 158 H90Z" fill="#FFD23F" stroke="#E6A800" stroke-width="2"/><circle cx="100" cy="159" r="2.6" fill="#E6A800"/>` }) },
  { id: 'medal', slot: 'neck', rarity: 'gold', name: ['Медаль ниндзя', 'Ninja medal'],
    art: () => ({ neck: `<path d="M84 130 L100 158 L116 130" stroke="#4D9BFF" stroke-width="8" fill="none" stroke-linejoin="round"/>
      <circle cx="100" cy="164" r="12" fill="#FFD23F" stroke="#E6A800" stroke-width="3"/>${star5(100, 164.5, 7, '#fff')}` }) },

  // ---------- костюм ----------
  { id: 'cape', slot: 'body', level: 20, name: ['Плащ героя', 'Hero cape'],
    art: () => ({ back: `<path d="M60 126 Q30 178 38 202 L162 202 Q170 178 140 126Z" fill="#E23D86"/><path d="M60 126 Q44 170 52 200" stroke="#FF7AB8" stroke-width="3" fill="none" opacity=".7"/>`,
      neck: `<path d="M64 130 Q100 146 136 130" stroke="#E23D86" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="100" cy="140" r="7" fill="#FFD23F" stroke="#E6A800" stroke-width="2"/>` }) },
  { id: 'tutu', slot: 'body', level: 24, name: ['Пачка балерины', 'Tutu'],
    art: () => ({ body: `<path d="M46 174 Q100 156 154 174 L164 190 Q150 184 140 192 Q128 184 116 192 Q104 184 92 192 Q80 184 68 192 Q56 184 44 192 Q34 186 36 190Z" fill="#FFB3D6" stroke="#FF8CC6" stroke-width="2"/>
      <path d="M50 172 Q100 156 150 172" stroke="#FF5FA2" stroke-width="5" fill="none"/>` }) },
  { id: 'jersey', slot: 'body', rarity: 'gold', name: ['Ирландская футболка', 'Irish jersey'],
    art: () => ({ body: `<path d="M50 140 Q100 118 150 140 L154 182 Q100 196 46 182Z" fill="#1FA05A"/>
      <path d="M82 128 Q100 138 118 128" stroke="#fff" stroke-width="4" fill="none"/>
      <g transform="translate(100 160)" fill="#fff"><circle cx="0" cy="-7" r="6"/><circle cx="-6.5" cy="1" r="6"/><circle cx="6.5" cy="1" r="6"/><path d="M0 2 q2 8 5 12" stroke="#fff" stroke-width="2.5" fill="none"/></g>` }) },
  { id: 'fairy', slot: 'body', rarity: 'gold', name: ['Крылья феи', 'Fairy wings'],
    art: () => ({ back: `<g fill="#D8F0FF" fill-opacity=".85" stroke="#9FD0FF" stroke-width="2">
      <path d="M62 132 Q6 84 14 146 Q20 176 60 158Z"/><path d="M62 160 Q22 170 30 196 Q52 204 66 172Z"/>
      <path d="M138 132 Q194 84 186 146 Q180 176 140 158Z"/><path d="M138 160 Q178 170 170 196 Q148 204 134 172Z"/></g>
      <circle cx="30" cy="130" r="3" fill="#fff"/><circle cx="170" cy="130" r="3" fill="#fff"/>` }) },
  { id: 'dragon', slot: 'body', rarity: 'gold', name: ['Крылья дракона', 'Dragon wings'],
    art: () => ({ back: `<g fill="#9B6BFF" stroke="#6B4FE0" stroke-width="2" stroke-linejoin="round">
      <path d="M62 136 L18 96 L26 124 L8 124 L24 144 L10 152 L56 166Z"/><path d="M138 136 L182 96 L174 124 L192 124 L176 144 L190 152 L144 166Z"/></g>` }) },
];

export const WEAR_BY_ID = Object.fromEntries(WEAR.map((w) => [w.id, w]));

// Собрать слои одежды для рисунка Лаки
export function wearLayers(wear = {}, belt = '#FF4F9A') {
  const out = { back: '', body: '', under: '', over: '', neck: '', head: '' };
  for (const slot of SLOTS) {
    const w = WEAR_BY_ID[wear[slot]];
    if (!w) continue;
    const a = w.art(belt);
    for (const k in a) out[k] += a[k];
  }
  return out;
}
