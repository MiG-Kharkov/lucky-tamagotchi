// Lucky's wardrobe: 4 slots, items can be combined. Coordinates match Lucky (viewBox 0 0 200 210):
// head centre (100,90), eyes (80,90) and (120,90), nose (100,104), chin ~137, body centre (100,152).
// Layers: back (behind the body), body (over the body), under (below the eyes), over (over the face), neck, head (on top).

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

// rarity: common from levels, rare from presents, gold from rare presents and albums
export const WEAR = [
  // ---------- head ----------
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
  // after level 30 (with the farm, the reef, the jungle and the dino valley)
  { id: 'sunhat', slot: 'head', level: 31, name: ['Соломенная шляпа', 'Straw hat'],
    art: () => ({ head: `<ellipse cx="100" cy="58" rx="54" ry="11" fill="#EFC25A"/><path d="M72 58 Q74 22 100 22 Q126 22 128 58Z" fill="#F7D06B"/>
      <path d="M73 48 Q100 54 127 48 L128 56 Q100 62 72 56Z" fill="#FF5FA2"/><path d="M52 60 q48 10 96 0" stroke="#D9A93A" stroke-width="2" fill="none"/>
      <path d="M84 30 q16 -4 32 0 M78 40 q22 -4 44 0" stroke="#E2B44C" stroke-width="2" fill="none"/>${flowerDot(126, 50, '#fff')}` }) },
  { id: 'safari', slot: 'head', level: 39, name: ['Шлем исследователя', "Explorer's hat"],
    art: () => ({ head: `<ellipse cx="100" cy="60" rx="52" ry="9" fill="#CDB77E"/><path d="M60 60 Q62 18 100 16 Q138 18 140 60Z" fill="#E7D7A4"/>
      <path d="M62 50 Q100 58 138 50 L139 58 Q100 66 61 58Z" fill="#7A5236"/><path d="M100 17 V58 M80 22 Q76 40 78 56 M120 22 Q124 40 122 56" stroke="#D6C38C" stroke-width="2" fill="none"/>
      <circle cx="100" cy="16" r="4" fill="#D6C38C"/>` }) },
  { id: 'dinoHood', slot: 'head', level: 42, name: ['Капюшон-динозавр', 'Dino hood'],
    art: () => ({ head: `<path d="M48 76 Q46 30 100 22 Q154 30 152 76 Q150 60 138 52 Q100 36 62 52 Q50 60 48 76Z" fill="#6CCB5F"/>
      <path d="M62 52 Q100 38 138 52" stroke="#4FAE45" stroke-width="3" fill="none"/>
      ${[[66, 34, -40], [82, 24, -20], [100, 20, 0], [118, 24, 20], [134, 34, 40]].map(([x, y, r]) => `<path d="M-8 4 L0 -12 L8 4Z" fill="#FF9F43" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')}
      <circle cx="80" cy="44" r="5" fill="#fff"/><circle cx="120" cy="44" r="5" fill="#fff"/><circle cx="81" cy="45" r="2.5" fill="#2A2730"/><circle cx="119" cy="45" r="2.5" fill="#2A2730"/>` }) },
  { id: 'cowboy', slot: 'head', rarity: 'gold', name: ['Ковбойская шляпа', 'Cowboy hat'],
    art: () => ({ head: `<path d="M40 50 Q48 66 100 66 Q152 66 160 50 Q150 58 100 58 Q50 58 40 50Z" fill="#A86B3C"/>
      <path d="M70 58 Q66 22 86 20 Q100 28 114 20 Q134 22 130 58Z" fill="#C2814A"/><path d="M70 50 Q100 56 130 50 L130 57 Q100 63 70 57Z" fill="#5A3A22"/>
      ${star5(100, 41, 7, '#FFD23F')}` }) },
  { id: 'ribbonWreath', slot: 'head', level: 55, name: ['Венок с лентами', 'Ribbon wreath'],
    art: () => ({ back: `${['#FF5FA2', '#FFD23F', '#4D9BFF', '#4CB84C', '#B78CFF'].map((c, i) => `<path d="M${132 + i * 3} 64 q${10 + i * 2} 40 ${2 + i * 5} ${84 - i * 6}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}`,
      head: `<path d="M54 66 Q100 34 146 66" stroke="#4CB84C" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${[[58, 62, '#E2313B'], [70, 52, '#FFD23F'], [84, 45, '#4D9BFF'], [100, 42, '#E2313B'], [116, 45, '#FF7AB8'], [130, 52, '#FFD23F'], [142, 62, '#E2313B']].map(([x, y, c]) => flowerDot(x, y, c)).join('')}` }) },
  { id: 'wizardHat', slot: 'head', rarity: 'gold', name: ['Шляпа волшебника', "Wizard's hat"],
    art: () => ({ head: `<ellipse cx="100" cy="58" rx="50" ry="9" fill="#5B3FB8"/><path d="M70 58 Q90 30 96 -8 Q106 6 112 2 Q114 30 130 58Z" fill="#6E4FD8"/>
      ${star5(98, 30, 7, '#FFD23F')}${star5(116, 46, 4.5, '#FFE9A8')}<circle cx="84" cy="44" r="2.5" fill="#FFE9A8"/><path d="M71 54 Q100 60 129 54" stroke="#FFD23F" stroke-width="4" fill="none"/>` }) },

  // ---------- face ----------
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
  { id: 'snorkel', slot: 'face', level: 36, name: ['Маска с трубкой', 'Snorkel mask'],
    art: () => ({ over: `<path d="M50 86 L44 84 M150 86 L156 84" stroke="#2A2730" stroke-width="4" stroke-linecap="round"/>
      <rect x="56" y="72" width="88" height="36" rx="16" fill="#BFE9FF" fill-opacity=".35" stroke="#FF8A2B" stroke-width="5"/>
      <path d="M68 80 l8 -4 M108 80 l8 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>
      <path d="M146 96 Q162 96 162 80 V30" stroke="#FFD23F" stroke-width="8" fill="none" stroke-linecap="round"/><rect x="155" y="22" width="14" height="10" rx="3" fill="#FF5FA2"/>` }) },
  { id: 'aviator', slot: 'face', level: 45, name: ['Лётные очки', 'Flying goggles'],
    art: () => ({ over: `<path d="M48 84 Q100 70 152 84" stroke="#7A5236" stroke-width="7" fill="none"/>
      <circle cx="80" cy="88" r="16" fill="#9FE3FF" fill-opacity=".45" stroke="#C98E5A" stroke-width="6"/><circle cx="120" cy="88" r="16" fill="#9FE3FF" fill-opacity=".45" stroke="#C98E5A" stroke-width="6"/>
      <path d="M96 86 h8" stroke="#C98E5A" stroke-width="5"/><path d="M71 80 l7 -4 M111 80 l7 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>` }) },
  { id: 'monocle', slot: 'face', level: 58, name: ['Монокль', 'Monocle'],
    art: () => ({ over: `<circle cx="120" cy="90" r="15" fill="#DDF3FF" fill-opacity=".3" stroke="#E6A800" stroke-width="4"/><path d="M134 96 q8 20 -4 44" stroke="#E6A800" stroke-width="2" fill="none"/>
      <path d="M112 82 l6 -3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>` }) },

  // ---------- neck ----------
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
  { id: 'binoculars', slot: 'neck', level: 40, name: ['Бинокль', 'Binoculars'],
    art: () => ({ neck: `<path d="M66 130 Q100 150 134 130" stroke="#7A5236" stroke-width="4" fill="none"/>
      <rect x="80" y="148" width="16" height="22" rx="5" fill="#3A3F4A"/><rect x="104" y="148" width="16" height="22" rx="5" fill="#3A3F4A"/><rect x="94" y="152" width="12" height="8" rx="2" fill="#5A606C"/>
      <circle cx="88" cy="171" r="6" fill="#6FD3FF" stroke="#3A3F4A" stroke-width="3"/><circle cx="112" cy="171" r="6" fill="#6FD3FF" stroke="#3A3F4A" stroke-width="3"/>
      <path d="M85 168 l3 -2 M109 168 l3 -2" stroke="#fff" stroke-width="1.6"/>` }) },
  { id: 'rainbowScarf', slot: 'neck', level: 57, name: ['Радужный шарф', 'Rainbow scarf'],
    art: () => ({ neck: `<defs><linearGradient id="wRbw" x1="0" x2="1">${['#FF6B8B', '#FFA24C', '#FFE066', '#6FD68A', '#6FB8FF', '#A98BFF'].map((c, i) => `<stop offset="${i / 5}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
      <path d="M58 128 Q100 150 142 128 L144 142 Q100 164 56 142Z" fill="url(#wRbw)"/>
      <path d="M118 146 l10 38 -14 3 -6 -37z" fill="url(#wRbw)"/><path d="M116 186 v7 M121 185 v7 M126 184 v7" stroke="#A98BFF" stroke-width="2.4" stroke-linecap="round"/>` }) },

  // ---------- costume ----------
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
  { id: 'overalls', slot: 'body', level: 33, name: ['Комбинезон фермера', "Farmer's dungarees"],
    art: () => ({ body: `<path d="M66 156 Q100 148 134 156 L140 190 Q100 202 60 190Z" fill="#4D8FDB"/>
      <path d="M76 132 L80 158 M124 132 L120 158" stroke="#4D8FDB" stroke-width="7" stroke-linecap="round"/>
      <circle cx="80" cy="158" r="3.6" fill="#FFD23F"/><circle cx="120" cy="158" r="3.6" fill="#FFD23F"/>
      <path d="M88 166 H112 V178 Q100 182 88 178Z" fill="#3B74BC"/><path d="M66 156 Q100 148 134 156" stroke="#3B74BC" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
      <path d="M96 168 v8" stroke="#FF8A2B" stroke-width="3" stroke-linecap="round"/><path d="M96 168 q-4 -6 0 -8 q4 2 0 8" fill="#4CB84C"/>` }) },
  { id: 'dinoSuit', slot: 'body', rarity: 'gold', name: ['Костюм динозавра', 'Dino costume'],
    art: () => ({ back: `<path d="M146 168 Q184 170 196 140 Q188 186 150 192Z" fill="#6CCB5F"/>
      ${[[40, 120, -60], [36, 142, -80], [40, 164, -100], [160, 120, 60], [164, 142, 80], [160, 164, 100], [182, 156, 30]].map(([x, y, r]) => `<path d="M-9 5 L0 -13 L9 5Z" fill="#FF9F43" transform="translate(${x} ${y}) rotate(${r})"/>`).join('')}`,
      body: `<path d="M74 152 Q100 144 126 152 Q132 176 100 192 Q68 176 74 152Z" fill="#B8EBA8" fill-opacity=".9"/>
      <path d="M78 162 H122 M76 172 H124 M82 182 H118" stroke="#8FD47C" stroke-width="2"/>` }) },
  { id: 'auroraCape', slot: 'body', level: 48, name: ['Плащ северного сияния', 'Northern lights cape'],
    art: () => ({ back: `<defs><linearGradient id="wAur" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5BF0B4"/><stop offset=".5" stop-color="#6FB8FF"/><stop offset="1" stop-color="#C77DFF"/></linearGradient></defs>
      <path d="M60 126 Q28 178 36 204 L164 204 Q172 178 140 126Z" fill="url(#wAur)"/>${[[50, 170], [70, 190], [150, 176], [132, 196], [44, 196]].map(([x, y]) => star5(x, y, 4, '#fff')).join('')}`,
      neck: `<path d="M64 130 Q100 146 136 130" stroke="#3E8FD6" stroke-width="7" fill="none" stroke-linecap="round"/>${star5(100, 141, 8, '#FFE9A8')}` }) },
  { id: 'butterfly', slot: 'body', level: 51, name: ['Крылья бабочки', 'Butterfly wings'],
    art: () => ({ back: `<g stroke="#8B4FD8" stroke-width="2.5"><path d="M70 138 Q-4 56 2 132 Q6 170 64 160Z" fill="#FFB347"/><path d="M66 164 Q10 168 18 202 Q46 214 70 176Z" fill="#FF7AB8"/>
      <path d="M130 138 Q204 56 198 132 Q194 170 136 160Z" fill="#FFB347"/><path d="M134 164 Q190 168 182 202 Q154 214 130 176Z" fill="#FF7AB8"/></g>
      <circle cx="22" cy="112" r="8" fill="#fff" opacity=".85"/><circle cx="178" cy="112" r="8" fill="#fff" opacity=".85"/><circle cx="30" cy="190" r="5" fill="#fff" opacity=".75"/><circle cx="170" cy="190" r="5" fill="#fff" opacity=".75"/>
      <circle cx="36" cy="132" r="4" fill="#8B4FD8" opacity=".6"/><circle cx="164" cy="132" r="4" fill="#8B4FD8" opacity=".6"/>` }) },
  { id: 'vyshyvanka', slot: 'body', level: 54, name: ['Вышиванка', 'Embroidered shirt'],
    art: () => ({ body: `<path d="M52 142 Q100 124 148 142 L152 184 Q100 198 48 184Z" fill="#FFFDF6" stroke="#EDE3D3" stroke-width="2"/>
      <path d="M100 132 V170" stroke="#E2313B" stroke-width="2"/>
      ${[146, 156, 166].map((y) => `<g transform="translate(100 ${y})"><path d="M-6 0 L0 -5 L6 0 L0 5Z" fill="#E2313B"/><path d="M-12 0 h3 M9 0 h3" stroke="#1E1E1E" stroke-width="2"/></g>`).join('')}
      <path d="M56 176 Q100 190 144 176" stroke="#E2313B" stroke-width="4" fill="none" stroke-dasharray="5 4"/><path d="M56 182 Q100 196 144 182" stroke="#1E1E1E" stroke-width="2" fill="none" stroke-dasharray="3 5"/>` }) },
  { id: 'grandMaster', slot: 'body', level: 60, name: ['Мантия Великого мастера', "Grand Master's robe"],
    art: () => ({ back: `<path d="M58 126 Q22 180 30 206 L170 206 Q178 180 142 126Z" fill="#8B4FD8"/><path d="M58 126 Q36 176 44 204" stroke="#FFD23F" stroke-width="4" fill="none"/><path d="M142 126 Q164 176 156 204" stroke="#FFD23F" stroke-width="4" fill="none"/>`,
      neck: `<path d="M62 130 Q100 150 138 130" stroke="#FFD23F" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="146" r="13" fill="#FF5FA2" stroke="#FFD23F" stroke-width="4"/>${star5(100, 146.5, 7.5, '#fff')}` }) },
];

export const WEAR_BY_ID = Object.fromEntries(WEAR.map((w) => [w.id, w]));

// Build the clothing layers for Lucky's drawing
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
