// Worlds, decorations, sticker albums and badges. Names are [ru, en] pairs.
import { ZONES } from './zones/index.js';

// Worlds unlock by level. props are the world's items for Decorate (emoji, available once the world is unlocked)
export const PLACES = [
  { id: 'garden', level: 1, name: ['Сад', 'Garden'], props: ['🌷', '🌼', '🍄', '🌲', '🪵', '🎈'] },
  { id: 'dojo', level: 4, name: ['Сакура-додзё', 'Sakura dojo'], props: ['🎋', '🏮', '🪷'] },
  { id: 'candy', level: 7, name: ['Конфетная страна', 'Candy land'], props: ['🍭', '🍬', '🧁'] },
  { id: 'beach', level: 10, name: ['Морской берег', 'Seaside'], props: ['🐚', '⛱️', '🦀', '🌴'] },
  { id: 'winter', level: 13, name: ['Зимняя сказка', 'Winter wonderland'], props: ['☃️', '❄️', '🛷', '🎄'] },
  { id: 'space', level: 16, name: ['Космос', 'Outer space'], props: ['🪐', '🛸', '🌟', '👽'] },
  { id: 'irish', level: 19, name: ['Ирландские холмы', 'Irish hills'], props: ['☘️', '🐑', '🧚', '🪨'] },
  { id: 'castle', level: 22, name: ['Замок ниндзя', 'Ninja castle'], props: ['🏯', '⛩️', '🎐'] },
  // the worlds after level 30 (js/zones)
  ...ZONES.map((z) => ({ id: z.id, level: z.level, name: z.name, props: z.emoji })),
];

// Picture decorations (SVG in art.decor)
export const DECOR = [
  { id: 'bowl', level: 5, name: ['Миска с сеном', 'Hay bowl'] },
  { id: 'hutch', level: 9, name: ['Домик Лаки', "Lucky's house"] },
  { id: 'lantern', level: 11, name: ['Японский фонарик', 'Paper lantern'] },
  { id: 'rainbow', level: 13, name: ['Радуга', 'Rainbow'] },
  { id: 'ball', level: 15, name: ['Мячик', 'Ball'] },
  { id: 'tent', level: 17, name: ['Палатка', 'Tent'] },
  { id: 'snowman', level: 18, name: ['Снеговик', 'Snowman'] },
  { id: 'igloo', level: 20, name: ['Иглу', 'Igloo'] },
  { id: 'rocket', level: 23, name: ['Ракета', 'Rocket'] },
  { id: 'castle', level: 25, name: ['Замок', 'Castle'] },
  { id: 'pond', level: 27, name: ['Пруд лягушки', "Frog's pond"] },
  { id: 'trampoline', level: 34, name: ['Батут', 'Trampoline'] },
  { id: 'chest', level: 37, name: ['Сундук с сокровищами', 'Treasure chest'] },
  { id: 'dinoEgg', level: 43, name: ['Яйцо динозавра', 'Dino egg'] },
  { id: 'swing', level: 46, name: ['Качели', 'Swing'] },
  { id: 'balloon', level: 49, name: ['Воздушный шар', 'Hot-air balloon'] },
  { id: 'mushroom', level: 52, name: ['Домик-грибок', 'Mushroom house'] },
  { id: 'telescope', level: 56, name: ['Телескоп', 'Telescope'] },
];

// Super things: few, with their own fun on tap, double tap and long press (antics.js); they glow in Decorate
export const SUPER = new Set(['rocket', 'hutch', 'ball', 'pond', 'snowman', 'tent', 'trampoline', 'chest', 'dinoEgg', 'swing', 'balloon', 'mushroom', 'telescope', '🎈', '🛸', '🧚']);

// Stickers: albums of 10. A complete album gives a special item
export const ALBUMS = [
  { id: 'garden', name: ['Сад', 'Garden'], reward: 'lei', stickers: ['🌸', '🌻', '🌷', '🦋', '🐞', '🐝', '🍀', '🐣', '🌈', '🪁'] },
  { id: 'sweets', name: ['Сладости', 'Sweets'], reward: 'chefHat', stickers: ['🍓', '🧁', '🍩', '🍭', '🍬', '🍪', '🎂', '🍦', '🫐', '🎀'] },
  { id: 'ninja', name: ['Ниндзя', 'Ninja'], reward: 'medal', stickers: ['🥷', '⭐', '🥋', '🏯', '🎋', '🐉', '🏮', '🍙', '🎎', '🎍'] },
  { id: 'sea', name: ['Море', 'Sea'], reward: 'eyepatch', stickers: ['🐚', '🐬', '🐠', '🐙', '🦀', '🐳', '🦭', '🐢', '⚓', '💎'] },
  { id: 'space', name: ['Космос', 'Space'], reward: 'dragon', stickers: ['🌙', '🚀', '🪐', '🌠', '👽', '🛸', '☄️', '🌍', '🔭', '🎈'] },
  { id: 'ireland', name: ['Ирландия', 'Ireland'], reward: 'jersey', stickers: ['☘️', '🐑', '🏰', '🎻', '🧚', '🦊', '🌧️', '🫖', '🐴', '🦄'] },
  { id: 'farm', name: ['Ферма', 'Farm'], reward: 'cowboy', stickers: ['🐔', '🐮', '🐷', '🐐', '🥕', '🌽', '🚜', '🌾', '🍎', '🦆'] },
  { id: 'wild', name: ['Джунгли и динозавры', 'Jungle and dinos'], reward: 'dinoSuit', stickers: ['🦕', '🦖', '🌋', '🦴', '🦜', '🐒', '🍌', '🐊', '🦥', '🌺'] },
  { id: 'magic', name: ['Небо и волшебство', 'Sky and magic'], reward: 'wizardHat', stickers: ['☁️', '🕊️', '🌌', '🦉', '🍄', '🔮', '🪄', '🌟', '🦌', '🎐'] },
];
export const STICKERS = ALBUMS.flatMap((a) => a.stickers);

// Achievement badges: stat is a counter in S.stats (or a derived one: days, level, belt, stickers, albums)
export const BADGES = [
  ['feed1', '🥕', ['Первый обед', 'First lunch'], 'feeds', 1],
  ['feed50', '🌾', ['Шеф-повар', 'Master chef'], 'feeds', 50],
  ['wash20', '🫧', ['Мастер пузырей', 'Bubble master'], 'washes', 20],
  ['hug25', '🤗', ['Обнимашкин', 'Cuddle champion'], 'hugs', 25],
  ['binky20', '✨', ['Звезда бинки', 'Binky star'], 'binkies', 20],
  ['sneeze10', '🤧', ['Будь здоров!', 'Bless you!'], 'sneezes', 10],
  ['tickle10', '😂', ['Щекотун', 'Tickle monster'], 'tickles', 10],
  ['games10', '🎈', ['Игрок', 'Player'], 'games', 10],
  ['great10', '🏆', ['Чемпион', 'Champion'], 'gamesGreat', 10],
  ['talk15', '🗣️', ['Полиглот', 'Polyglot'], 'talkRight', 15],
  ['quiz20', '🧠', ['Умница', 'Smarty'], 'quizRight', 20],
  ['asks20', '💬', ['Болтушка', 'Chatterbox'], 'asks', 20],
  ['frog5', '🐸', ['Разгадчица загадок', 'Riddle solver'], 'frogRight', 5],
  ['mission5', '🥷', ['Юный ниндзя', 'Young ninja'], 'missions', 5],
  ['mission20', '🥋', ['Ниндзя-мастер', 'Ninja master'], 'missions', 20],
  ['care10', '💗', ['Заботливое сердце', 'Caring heart'], 'care', 10],
  ['breath5', '🌬️', ['Спокойный ниндзя', 'Calm ninja'], 'breaths', 5],
  ['dog5', '🐶', ['Друг Тали', "Tali's friend"], 'dogVisits', 5],
  ['dogplay10', '🐾', ['Догонялки', 'Chase champion'], 'dogPlays', 10],
  ['bug15', '🦋', ['Ловец бабочек', 'Butterfly catcher'], 'bugs', 15],
  ['surprise10', '🎁', ['Счастливица', 'Lucky girl'], 'surprises', 10],
  ['decor10', '✏️', ['Дизайнер', 'Designer'], 'decorPlaced', 10],
  ['decor50', '🏡', ['Архитектор', 'Architect'], 'decorPlaced', 50],
  ['wear10', '👗', ['Модница', 'Fashion star'], 'wearChanges', 10],
  ['plan5', '📋', ['Всё успела!', 'All done!'], 'plans', 5],
  ['worlds5', '🌍', ['Путешественница', 'Explorer'], 'worlds', 5],
  ['days7', '📅', ['Неделя вместе', 'One week together'], 'days', 7],
  ['days30', '🗓️', ['Месяц вместе', 'A month together'], 'days', 30],
  ['level10', '🔟', ['Уровень 10', 'Level 10'], 'level', 10],
  ['level20', '🌟', ['Уровень 20', 'Level 20'], 'level', 20],
  ['level30', '🏅', ['Уровень 30', 'Level 30'], 'level', 30],
  ['level40', '💫', ['Уровень 40', 'Level 40'], 'level', 40],
  ['level50', '👑', ['Уровень 50', 'Level 50'], 'level', 50],
  ['level60', '🎇', ['Великий мастер', 'Grand Master'], 'level', 60],
  ['worlds10', '🧭', ['Покорительница миров', 'World traveller'], 'worlds', 10],
  ['worlds16', '🗺️', ['Все миры', 'Every world'], 'worlds', 16],
  ['belt3', '🟢', ['Зелёный пояс', 'Green belt'], 'belt', 3],
  ['beltPink', '🩷', ['Розовый мастер', 'Pink master'], 'belt', 7],
  ['stickers30', '📒', ['Коллекционер', 'Collector'], 'stickers', 30],
  ['stickers60', '📔', ['Большая коллекция', 'Big collection'], 'stickers', 60],
  ['stickers90', '🎖️', ['Великий коллекционер', 'Grand collector'], 'stickers', 90],
  ['album1', '📚', ['Первый альбом', 'First album'], 'albums', 1],
  ['album4', '🗂️', ['Четыре альбома', 'Four albums'], 'albums', 4],
  ['album9', '🏛️', ['Все альбомы', 'Every album'], 'albums', 9],
  ['jokes25', '😂', ['Хохотушка', 'Giggle champion'], 'jokes', 25],
  ['twisters10', '👅', ['Скороговорщица', 'Twister champion'], 'twisters', 10],
  ['tricks1', '🎯', ['Юный тренер', 'Young trainer'], 'tricks', 1],
  ['tricks6', '🎪', ['Цирк Лаки', "Lucky's circus"], 'tricks', 6],
  ['vet4', '🩺', ['Маленький доктор', 'Little vet'], 'checkups', 4],
  ['idioms10', '🎭', ['Знаток выражений', 'Saying explorer'], 'idioms', 10],
];
