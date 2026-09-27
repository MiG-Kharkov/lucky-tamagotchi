// Ninja missions: real things to do away from the screen, with Lucky as the sensei.
// Texts are [ru, en] pairs; mission texts and palette words are voiced (tools/gen-voices.mjs).
//
// kinds:
//   count  - Lucky counts the moves out loud and does them too        { n, pace (ms), move }
//   hold   - hold a pose while Lucky counts the seconds               { secs, pose, quiet? }
//   freeze - Ninja sneak: move on 'Sneak!', freeze on 'Freeze!'       { secs }
//   dance  - Freeze dance: dance to the music, freeze when it stops   { secs }
//   hunt   - find things at home and tell Lucky what you found        { palette, slots | labels }
//   look   - look (or listen), then tell Lucky what you noticed       { palette, result, secs?, multi? }
//   make   - make something, then tell Lucky about it                 { palette, result }
//   breath - slow breathing together                                  { cycles }

export const SKILLS = {
  speed: { emoji: '⚡', name: ['Скорость', 'Speed'] },
  balance: { emoji: '🦩', name: ['Равновесие', 'Balance'] },
  stealth: { emoji: '🥷', name: ['Скрытность', 'Stealth'] },
  eyes: { emoji: '👁️', name: ['Зоркость', 'Sharp eyes'] },
  art: { emoji: '🎨', name: ['Творчество', 'Creativity'] },
  calm: { emoji: '🧘', name: ['Спокойствие', 'Calm'] },
};

const I = (e, ru, en, extra = {}) => ({ e, w: [ru, en], ...extra });

// What she can pick after a hunt, a look or a craft. bad: doesn't fit the task (Lucky explains, it isn't counted)
export const PALETTES = {
  things: [
    I('🧸', 'Мишка!', 'A teddy!'), I('👕', 'Футболка!', 'A T-shirt!'), I('🧦', 'Носочки!', 'Socks!'), I('📚', 'Книжка!', 'A book!'),
    I('✏️', 'Карандаш!', 'A pencil!'), I('🎀', 'Бантик!', 'A ribbon!'), I('🧴', 'Бутылочка!', 'A bottle!'), I('🪥', 'Зубная щётка!', 'A toothbrush!'),
    I('🎒', 'Рюкзак!', 'A school bag!'), I('🥤', 'Стаканчик!', 'A cup!'), I('🧣', 'Шарф!', 'A scarf!'), I('🌸', 'Цветок!', 'A flower!'),
    I('🍎', 'Яблоко!', 'An apple!'), I('🧽', 'Губка!', 'A sponge!'), I('🖍️', 'Мелок!', 'A crayon!'), I('🪴', 'Растение!', 'A plant!'),
    I('🥄', 'Ложка!', 'A spoon!'), I('🔑', 'Ключ!', 'A key!'), I('🪙', 'Монетка!', 'A coin!'), I('✨', 'Что-то особенное!', 'Something special!'),
  ],
  b: [
    I('🏀', 'Мяч! Ball.', 'A ball!'), I('📘', 'Книга! Book.', 'A book!'), I('🍌', 'Банан! Banana.', 'A banana!'), I('🛏️', 'Кровать! Bed.', 'A bed!'),
    I('🎒', 'Сумка! Bag.', 'A bag!'), I('🧸', 'Мишка! По-английски bear.', 'A bear!'), I('🥣', 'Миска! Bowl.', 'A bowl!'), I('📦', 'Коробка! Box.', 'A box!'),
    I('🔘', 'Пуговица! Button.', 'A button!'), I('🧺', 'Корзинка! Basket.', 'A basket!'), I('🛁', 'Ванна! Bath.', 'A bath!'), I('🍞', 'Хлеб! Bread.', 'Bread!'),
    I('🥄', 'Ложка', 'A spoon', { bad: true }), I('🍎', 'Яблоко', 'An apple', { bad: true }), I('🧦', 'Носок', 'A sock', { bad: true }), I('🪑', 'Стул', 'A chair', { bad: true }),
  ],
  round: [
    I('🍽️', 'Тарелка!', 'A plate!'), I('⏰', 'Часы!', 'A clock!'), I('🔘', 'Пуговица!', 'A button!'), I('🪙', 'Монетка!', 'A coin!'),
    I('🍪', 'Печенье!', 'A biscuit!'), I('🏀', 'Мяч!', 'A ball!'), I('🍊', 'Апельсин!', 'An orange!'), I('🍩', 'Пончик!', 'A doughnut!'),
    I('🥁', 'Барабан!', 'A drum!'), I('🧶', 'Клубок!', 'A ball of wool!'),
    I('📚', 'Книжка', 'A book', { bad: true }), I('📦', 'Коробка', 'A box', { bad: true }), I('✏️', 'Карандаш', 'A pencil', { bad: true }), I('🥄', 'Ложка', 'A spoon', { bad: true }),
  ],
  animals: [
    I('🐰', 'Зайчик!', 'A bunny!'), I('🐶', 'Собачка!', 'A dog!'), I('🐱', 'Котик!', 'A cat!'), I('🐳', 'Кит!', 'A whale!'),
    I('🐉', 'Дракон!', 'A dragon!'), I('🦋', 'Бабочка!', 'A butterfly!'), I('🐘', 'Слон!', 'An elephant!'), I('🦕', 'Динозавр!', 'A dinosaur!'),
    I('🐟', 'Рыбка!', 'A fish!'), I('🐦', 'Птичка!', 'A bird!'), I('🐴', 'Лошадка!', 'A horse!'), I('🐌', 'Улитка!', 'A snail!'),
  ],
  numbers: [
    I('0️⃣', 'Ни одной', 'None', { n: 0 }), I('1️⃣', 'Одна!', 'One!', { n: 1 }), I('2️⃣', 'Две!', 'Two!', { n: 2 }),
    I('3️⃣', 'Три!', 'Three!', { n: 3 }), I('4️⃣', 'Четыре!', 'Four!', { n: 4 }), I('🔢', 'Больше пяти!', 'More than five!', { n: 6 }),
  ],
  sounds: [
    I('🐦', 'Птицы!', 'Birds!'), I('🚗', 'Машины!', 'Cars!'), I('🌬️', 'Ветер!', 'The wind!'), I('🗣️', 'Голоса!', 'Voices!'),
    I('🎵', 'Музыка!', 'Music!'), I('🌧️', 'Дождь!', 'Rain!'), I('🐶', 'Собака лает!', 'A dog barking!'), I('⏰', 'Тиканье часов!', 'A clock ticking!'),
    I('👣', 'Шаги!', 'Footsteps!'), I('🤫', 'Тишина!', 'Silence!'),
  ],
  colours: [
    I('🩷', 'Розовая!', 'Pink!', { c: '#FF5FA2' }), I('🔴', 'Красная!', 'Red!', { c: '#FF3B4E' }), I('🟠', 'Оранжевая!', 'Orange!', { c: '#FF9F43' }),
    I('🟡', 'Жёлтая!', 'Yellow!', { c: '#FFD23F' }), I('🟢', 'Зелёная!', 'Green!', { c: '#3CBF6B' }), I('🔵', 'Синяя!', 'Blue!', { c: '#4D9BFF' }),
    I('🟣', 'Фиолетовая!', 'Purple!', { c: '#9B6BFF' }), I('⚫', 'Чёрная!', 'Black!', { c: '#2E2A33' }), I('🌈', 'Радужная!', 'Rainbow!', { c: 'rainbow' }),
  ],
  far: [
    I('🐢', 'Недалеко', 'Not very far', { far: 0 }), I('🐇', 'Довольно далеко!', 'Quite far!', { far: 1 }), I('🚀', 'Супер-далеко!', 'Super far!', { far: 2 }),
  ],
};

export const MISSIONS = [
  // ⚡ speed: Lucky counts, she moves
  { id: 'hops', kind: 'count', skill: 'speed', emoji: '🐰', n: 10, pace: 1100, move: 'hop', text: ['Сделай со мной 10 кроличьих прыжков!', 'Do 10 bunny hops with me!'] },
  { id: 'star', kind: 'count', skill: 'speed', emoji: '⭐', n: 8, pace: 1400, move: 'star', text: ['8 прыжков «звёздочкой»: руки и ноги в стороны!', '8 star jumps: arms and legs out like a star!'] },
  { id: 'squats', kind: 'count', skill: 'speed', emoji: '🌀', n: 6, pace: 2600, move: 'squat', text: ['6 медленных приседаний, как пружинка.', '6 slow squats, like a spring.'] },
  { id: 'punch', kind: 'count', skill: 'speed', emoji: '👊', n: 12, pace: 850, move: 'punch', text: ['12 ниндзя-ударов руками. Кия!', '12 ninja punches. Hi-yah!'] },
  { id: 'frogJumps', kind: 'count', skill: 'speed', emoji: '🐸', n: 6, pace: 1800, move: 'frog', text: ['6 больших лягушачьих прыжков!', '6 big frog jumps!'] },
  { id: 'run', kind: 'count', skill: 'speed', emoji: '🏃', n: 20, pace: 600, move: 'run', text: ['Беги на месте, пока я считаю до 20!', 'Run on the spot while I count to 20!'] },
  // 🦩 balance: hold a pose
  { id: 'heron', kind: 'hold', skill: 'balance', emoji: '🦩', secs: 15, pose: 'oneleg', text: ['Постой на одной ноге, как цапля, пока я считаю до 15.', 'Stand on one leg like a heron while I count to 15.'] },
  { id: 'tree', kind: 'hold', skill: 'balance', emoji: '🌳', secs: 12, pose: 'oneleg', text: ['Поза дерева: ступня на колене, ладошки вместе. 12 секунд!', 'Tree pose: foot on your knee, hands together. 12 seconds!'] },
  { id: 'plane', kind: 'hold', skill: 'balance', emoji: '✈️', secs: 10, pose: 'plane', text: ['Самолётик: руки в стороны, одна нога назад. 10 секунд!', 'Aeroplane: arms out, one leg back. 10 seconds!'] },
  { id: 'tiptoe', kind: 'hold', skill: 'balance', emoji: '🙆', secs: 10, pose: 'stretch', text: ['Встань на носочки и тянись к небу 10 секунд.', 'Stand on tiptoe and reach for the sky for 10 seconds.'] },
  // 🥷 stealth: games that use your ears, not the screen
  { id: 'sneak', kind: 'freeze', skill: 'stealth', emoji: '🥷', secs: 30, text: ['Ниндзя-крадучись: иди, когда я скажу «Крадись!», и замри на «Замри!».', "Ninja sneak: move when I say 'Sneak!', freeze when I say 'Freeze!'"] },
  { id: 'freezeDance', kind: 'dance', skill: 'stealth', emoji: '💃', secs: 30, text: ['Танец-замри! Танцуй под музыку и замри, когда она остановится.', 'Freeze dance! Dance to the music and freeze when it stops.'] },
  { id: 'statue', kind: 'hold', skill: 'stealth', emoji: '🗿', secs: 20, pose: 'statue', text: ['Ниндзя-статуя: замри на 20 секунд. Даже не хихикай!', 'Ninja statue: freeze for 20 seconds. Not even a giggle!'] },
  // 👁️ sharp eyes: hunts and looking out of the window
  { id: 'pink', kind: 'hunt', skill: 'eyes', emoji: '🩷', palette: 'things', slots: 3, text: ['Найди дома 3 розовые вещи.', 'Find 3 pink things at home.'] },
  { id: 'rby', kind: 'hunt', skill: 'eyes', emoji: '🔴', palette: 'things', labels: [['Красное', 'Red'], ['Синее', 'Blue'], ['Жёлтое', 'Yellow']], text: ['Найди что-нибудь красное, синее и жёлтое.', 'Find something red, something blue and something yellow.'] },
  { id: 'letterB', kind: 'hunt', skill: 'eyes', emoji: '🅱️', palette: 'b', slots: 3, text: ['Найди 3 вещи, которые по-английски начинаются на B.', 'Find 3 things that start with B.'] },
  { id: 'round', kind: 'hunt', skill: 'eyes', emoji: '⭕', palette: 'round', slots: 3, text: ['Найди 3 круглые вещи.', 'Find 3 round things.'] },
  { id: 'soft', kind: 'hunt', skill: 'eyes', emoji: '🧸', palette: 'things', labels: [['Мягкое', 'Soft'], ['Крошечное', 'Tiny'], ['Блестящее', 'Shiny']], text: ['Найди что-нибудь мягкое, крошечное и блестящее.', 'Find something soft, something tiny and something shiny.'] },
  { id: 'cloud', kind: 'look', skill: 'eyes', emoji: '☁️', palette: 'animals', result: 'cloud', text: ['Посмотри в окно и найди облако, похожее на зверя.', 'Look out of the window and find a cloud that looks like an animal.'] },
  { id: 'birds', kind: 'look', skill: 'eyes', emoji: '🐦', palette: 'numbers', result: 'birds', text: ['Посмотри в окно минутку. Сколько птиц ты увидишь?', 'Look out of the window for a minute. How many birds can you spot?'] },
  // 🎨 creativity: make something real
  { id: 'mask', kind: 'make', skill: 'art', emoji: '🖍️', palette: 'colours', result: 'mask', text: ['Нарисуй на бумаге ниндзя-маску для Лаки.', 'Draw a ninja mask for Lucky on paper.'] },
  { id: 'paperStar', kind: 'make', skill: 'art', emoji: '📄', palette: 'colours', result: 'star', text: ['Сложи из бумаги ниндзя-звезду.', 'Fold a paper ninja star.'] },
  { id: 'drawPet', kind: 'make', skill: 'art', emoji: '🎨', palette: 'animals', result: 'drawing', text: ['Нарисуй своё любимое животное.', 'Draw your favourite animal.'] },
  { id: 'planeFly', kind: 'make', skill: 'art', emoji: '🛩️', palette: 'far', result: 'plane', text: ['Сложи бумажный самолётик и запусти его 3 раза.', 'Fold a paper plane and fly it 3 times.'] },
  // 🧘 calm
  { id: 'breath', kind: 'breath', skill: 'calm', emoji: '🌬️', cycles: 5, text: ['Ниндзя-тишина: 5 медленных вдохов вместе со мной.', 'Ninja silence: 5 slow breaths with me.'] },
  { id: 'listen', kind: 'look', skill: 'calm', emoji: '👂', palette: 'sounds', result: 'sounds', secs: 20, multi: 3, text: ['Закрой глаза на 20 секунд и послушай. Что ты услышала?', 'Close your eyes for 20 seconds and listen. What did you hear?'] },
  { id: 'water', kind: 'hold', skill: 'calm', emoji: '💧', secs: 20, pose: 'sip', quiet: true, text: ['Выпей стакан воды — ниндзя заботятся о себе.', 'Drink a glass of water. Ninjas look after themselves.'] },
];
