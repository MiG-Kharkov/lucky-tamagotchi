// Worlds, decorations, sticker albums and badges. Names are [ru, en] pairs.

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
];

// Stickers: 6 albums of 10. A complete album gives a special item
export const ALBUMS = [
  { id: 'garden', name: ['Сад', 'Garden'], reward: 'lei', stickers: ['🌸', '🌻', '🌷', '🦋', '🐞', '🐝', '🍀', '🐣', '🌈', '🪁'] },
  { id: 'sweets', name: ['Сладости', 'Sweets'], reward: 'chefHat', stickers: ['🍓', '🧁', '🍩', '🍭', '🍬', '🍪', '🎂', '🍦', '🫐', '🎀'] },
  { id: 'ninja', name: ['Ниндзя', 'Ninja'], reward: 'medal', stickers: ['🥷', '⭐', '🥋', '🏯', '🎋', '🐉', '🏮', '🍙', '🎎', '🎍'] },
  { id: 'sea', name: ['Море', 'Sea'], reward: 'eyepatch', stickers: ['🐚', '🐬', '🐠', '🐙', '🦀', '🐳', '🦭', '🐢', '⚓', '💎'] },
  { id: 'space', name: ['Космос', 'Space'], reward: 'dragon', stickers: ['🌙', '🚀', '🪐', '🌠', '👽', '🛸', '☄️', '🌍', '🔭', '🎈'] },
  { id: 'ireland', name: ['Ирландия', 'Ireland'], reward: 'jersey', stickers: ['☘️', '🐑', '🏰', '🎻', '🧚', '🦊', '🌧️', '🫖', '🐴', '🦄'] },
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
  ['belt3', '🟢', ['Зелёный пояс', 'Green belt'], 'belt', 3],
  ['beltPink', '🩷', ['Розовый мастер', 'Pink master'], 'belt', 7],
  ['stickers30', '📒', ['Коллекционер', 'Collector'], 'stickers', 30],
  ['album1', '📚', ['Первый альбом', 'First album'], 'albums', 1],
];
