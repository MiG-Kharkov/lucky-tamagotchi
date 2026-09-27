// Lucky's questions with answer choices. Everything is a [ru, en] pair.
// Lucky's and the frog's lines are voiced; the child's answer choices are text only, so they can be shuffled freely.

// Lucky's generic replies
export const REPLY = {
  like: [['Отличный выбор!', 'Great choice!'], ['О, мне тоже нравится!', 'Ooh, I like that too!'], ['Классно! Запомню.', "Cool! I'll remember that."], ['Интересно! Ты у меня особенная.', "Interesting! You're so special."]],
  right: [['Правильно! Ты такая умная!', "That's right! You're so clever!"], ['Да! Угадала!', 'Yes! You guessed it!'], ['Точно! Молодец!', 'Exactly! Well done!']],
  wrong: [['Не-а! Попробуй ещё!', 'Nope! Try again!'], ['Почти! Ещё разок?', 'Almost! One more try?'], ['Хи-хи, нет! Угадывай дальше!', 'Tee-hee, no! Keep guessing!']],
  funny: [['Ха-ха, вот это да!', 'Ha-ha, wow!'], ['Я бы тоже так выбрал!', "I'd choose that too!"], ['Смешно! Представляю это!', 'Funny! I can picture it!']],
};

export const ASKS = [
  // ---------- what do you like ----------
  { id: 'colour', kind: 'pref', q: ['Какой твой любимый цвет?', "What's your favourite colour?"], show: 3,
    opts: [['Розовый', 'Pink'], ['Голубой', 'Blue'], ['Фиолетовый', 'Purple'], ['Зелёный', 'Green'], ['Жёлтый', 'Yellow'], ['Красный', 'Red']],
    special: { Pink: ['Розовый! Мой любимый тоже! Ну, после рыжего.', 'Pink! My favourite too! Well, after ginger.'] } },
  { id: 'animal', kind: 'pref', q: ['Какое твоё любимое животное?', "What's your favourite animal?"], show: 3,
    opts: [['Кролик', 'A bunny'], ['Собака', 'A dog'], ['Кошка', 'A cat'], ['Лошадь', 'A horse'], ['Панда', 'A panda'], ['Дельфин', 'A dolphin']],
    special: { 'A bunny': ['Кролик? Это же я! Ура!', "A bunny? That's me! Hooray!"], 'A dog': ['Как {dog}! Он будет рад.', "Like {dog}! He'll be so happy."] } },
  { id: 'breakfast', kind: 'pref', q: ['Что ты больше любишь на завтрак?', 'What do you like for breakfast?'], show: 3,
    opts: [['Блинчики', 'Pancakes'], ['Кашу', 'Porridge'], ['Тосты', 'Toast'], ['Хлопья', 'Cereal'], ['Фрукты', 'Fruit']] },
  { id: 'weekend', kind: 'pref', q: ['Что ты любишь делать в выходные?', 'What do you like doing at the weekend?'], show: 3,
    opts: [['Гулять на улице', 'Play outside'], ['Рисовать', 'Draw'], ['Читать', 'Read'], ['Ходить в гости', 'Visit friends'], ['Танцевать', 'Dance']] },
  { id: 'power', kind: 'pref', q: ['Если бы у тебя была суперсила, какая?', 'If you had a superpower, what would it be?'], show: 3,
    opts: [['Летать', 'Flying'], ['Быть невидимкой', 'Being invisible'], ['Говорить с животными', 'Talking to animals'], ['Суперскорость', 'Super speed']],
    special: { 'Talking to animals': ['Тогда мы бы болтали целый день!', 'Then we could chat all day long!'] } },
  { id: 'season', kind: 'pref', q: ['Какое время года тебе нравится больше всего?', 'Which season do you like best?'], show: 4,
    opts: [['Весна', 'Spring'], ['Лето', 'Summer'], ['Осень', 'Autumn'], ['Зима', 'Winter']] },
  { id: 'school', kind: 'pref', q: ['Что было лучше всего в школе сегодня?', 'What was the best thing at school today?'], show: 3,
    opts: [['Перемена', 'Break time'], ['Рисование', 'Art'], ['Математика', 'Maths'], ['Мои друзья', 'My friends'], ['Урок ирландского', 'Irish class'], ['Физкультура', 'PE']] },

  // ---------- would you rather (silly dilemmas) ----------
  { id: 'wyr-fly', kind: 'wyr', q: ['Что лучше: летать как птица или плавать как рыба?', 'Would you rather fly like a bird or swim like a fish?'],
    opts: [['Летать', 'Fly'], ['Плавать', 'Swim']],
    replies: [['Полетели! Только держи меня крепче.', "Let's fly! Just hold on to me tight."], ['Буль-буль! Я буду кролик-водолаз.', "Glug-glug! I'll be a diving bunny."]] },
  { id: 'wyr-hat', kind: 'wyr', q: ['Что лучше: шапка-морковка или шапка-торт?', 'Would you rather wear a carrot hat or a cake hat?'],
    opts: [['Шапка-морковка', 'A carrot hat'], ['Шапка-торт', 'A cake hat']],
    replies: [['Я бы её съел прямо с головы!', "I'd eat it right off my head!"], ['Со свечками? Только не задуй мои ушки!', "With candles? Don't blow out my ears!"]] },
  { id: 'wyr-hop', kind: 'wyr', q: ['Что лучше: прыгать как кролик или бегать как {dog}?', 'Would you rather hop like a bunny or run like {dog}?'],
    opts: [['Прыгать', 'Hop'], ['Бегать', 'Run']],
    replies: [['Прыг-скок! Ты настоящая крольчиха!', "Hop-hop! You're a real bunny!"], ['Топ-топ-топ! {dog} будет гордиться.', 'Pitter-patter! {dog} would be proud.']] },
  { id: 'wyr-home', kind: 'wyr', q: ['Что лучше: жить в замке или в домике на дереве?', 'Would you rather live in a castle or a treehouse?'],
    opts: [['В замке', 'A castle'], ['На дереве', 'A treehouse']],
    replies: [['Тогда я буду королевский кролик!', "Then I'll be the royal bunny!"], ['Только лестницу сделаем для моих лапок!', "Let's build a ladder for my paws!"]] },
  { id: 'wyr-food', kind: 'wyr', q: ['Что лучше: мороженое на завтрак или пицца на ужин?', 'Would you rather have ice cream for breakfast or pizza for dinner?'],
    opts: [['Мороженое на завтрак', 'Ice cream for breakfast'], ['Пицца на ужин', 'Pizza for dinner']],
    replies: [['Брр, холодное утро! Но вкусное.', 'Brr, a chilly morning! But tasty.'], ['С морковкой, пожалуйста!', 'With carrots on top, please!']] },
  { id: 'wyr-size', kind: 'wyr', q: ['Что лучше: быть маленькой как мышка или большой как слон?', 'Would you rather be tiny like a mouse or big like an elephant?'],
    opts: [['Как мышка', 'Tiny'], ['Как слон', 'Big']],
    replies: [['Тогда ты сможешь спать у меня в ушке!', 'Then you could nap in my ear!'], ['Ого! Я буду кататься у тебя на хоботе!', "Wow! I'll ride on your trunk!"]] },

  // ---------- guess what I'm thinking of ----------
  { id: 'g-carrot', kind: 'guess', q: ['Угадай, о чём я думаю! Оно оранжевое и хрустит.', "Guess what I'm thinking of! It's orange and crunchy."],
    right: ['Морковка', 'A carrot'], wrong: [['Яблоко', 'An apple'], ['Мяч', 'A ball'], ['Луна', 'The moon'], ['Ботинок', 'A shoe']] },
  { id: 'g-moon', kind: 'guess', q: ['Угадай! Оно светит ночью в небе.', 'Guess! It shines in the sky at night.'],
    right: ['Луна', 'The moon'], wrong: [['Морковка', 'A carrot'], ['Облако', 'A cloud'], ['Кроссовок', 'A trainer']] },
  { id: 'g-bunny', kind: 'guess', q: ['Угадай! У него длинные уши и пушистый хвостик.', 'Guess! It has long ears and a fluffy tail.'],
    right: ['Кролик', 'A bunny'], wrong: [['Рыбка', 'A fish'], ['Змея', 'A snake'], ['Птичка', 'A bird']] },
  { id: 'g-rain', kind: 'guess', q: ['Угадай! Он падает с неба, и от него мокро.', 'Guess! It falls from the sky and makes you wet.'],
    right: ['Дождь', 'Rain'], wrong: [['Торт', 'A cake'], ['Звёзды', 'Stars'], ['Носок', 'A sock']] },
  { id: 'g-pencil', kind: 'guess', q: ['Угадай! Им пишут в школе.', 'Guess! You write with it at school.'],
    right: ['Карандаш', 'A pencil'], wrong: [['Ложка', 'A spoon'], ['Носок', 'A sock'], ['Банан', 'A banana']] },
  { id: 'g-ears', kind: 'guess', q: ['Угадай! Сколько у меня ушек?', 'Guess! How many ears do I have?'],
    right: ['Два', 'Two'], wrong: [['Три', 'Three'], ['Десять', 'Ten'], ['Одно', 'One']] },
  { id: 'g-grass', kind: 'guess', q: ['Угадай! Она зелёная, и кролики её обожают.', 'Guess! It is green and bunnies love it.'],
    right: ['Трава', 'Grass'], wrong: [['Лягушка', 'A frog'], ['Дракон', 'A dragon'], ['Машина', 'A car']] },

  // ---------- do you know? ----------
  { id: 'k-hay', kind: 'quiz', q: ['Знаешь, что кролики едят больше всего?', 'Do you know what bunnies eat the most?'],
    right: ['Сено', 'Hay'], wrong: [['Шоколад', 'Chocolate'], ['Пиццу', 'Pizza'], ['Чипсы', 'Crisps']],
    ok: ['Да! Сено — это самое главное!', 'Yes! Hay is the most important!'], no: ['Ха-ха, нет! Больше всего кролики едят сено.', 'Ha-ha, no! Bunnies eat hay the most.'] },
  { id: 'k-irish', kind: 'quiz', q: ['Знаешь, как сказать «спасибо» по-ирландски?', 'Do you know how to say thank you in Irish?'],
    right: ['Go raibh maith agat', 'Go raibh maith agat'], wrong: [['Merci', 'Merci'], ['Gracias', 'Gracias'], ['Danke', 'Danke']],
    ok: ['Ого! Ты знаешь ирландский!', 'Wow! You know Irish!'], no: ['Почти! По-ирландски это Go raibh maith agat.', 'Almost! In Irish it is Go raibh maith agat.'] },
  { id: 'k-paws', kind: 'quiz', q: ['Знаешь, сколько лап у {dog}?', 'Do you know how many paws {dog} has?'],
    right: ['Четыре', 'Four'], wrong: [['Две', 'Two'], ['Шесть', 'Six'], ['Сто', 'A hundred']],
    ok: ['Правильно, четыре лапы!', 'Right, four paws!'], no: ['Нет, у {dog} четыре лапы! Топ-топ.', 'No, {dog} has four paws! Pitter-patter.'] },
  { id: 'k-belt', kind: 'quiz', q: ['Знаешь, какой пояс самый главный у кролика-ниндзя?', 'Do you know the top belt for a ninja bunny?'],
    right: ['Розовый', 'Pink'], wrong: [['Серый', 'Grey'], ['В горошек', 'Spotty'], ['Полосатый', 'Stripy']],
    ok: ['Да! Розовый пояс мастера!', 'Yes! The Pink Master Belt!'], no: ['Хи-хи, нет! Самый главный — розовый!', 'Tee-hee, no! The top one is pink!'] },
  { id: 'k-binky', kind: 'quiz', q: ['Знаешь, что делают кролики, когда очень рады?', 'Do you know what bunnies do when they are really happy?'],
    right: ['Прыгают бинки', 'A binky jump'], wrong: [['Лают', 'They bark'], ['Поют оперу', 'They sing opera'], ['Спят', 'They sleep']],
    ok: ['Да, бинки! Смотри!', 'Yes, a binky! Watch!'], no: ['Ха-ха, нет! Кролики прыгают бинки.', 'Ha-ha, no! Bunnies do a binky jump.'], binky: true },

  // ---------- guess my mood ----------
  { id: 'mood', kind: 'mood', q: ['Угадай, какое у меня сейчас настроение?', 'Can you guess how I feel right now?'] },

  // ---------- tap me ----------
  { id: 't-ears', kind: 'touch', target: 'ears', q: ['Можешь нажать на мои ушки?', 'Can you tap my ears?'] },
  { id: 't-nose', kind: 'touch', target: 'nose', q: ['Где мой носик? Нажми на него!', 'Where is my nose? Tap it!'] },
  { id: 't-tummy', kind: 'touch', target: 'body', q: ['Пощекочи мне животик!', 'Tickle my tummy!'] },

  // ---------- adventures ----------
  { id: 'story-adventure', kind: 'story', start: 'a0' },
  { id: 'story-party', kind: 'story', start: 'p0' },
];

export const MOOD_OPTS = {
  happy: ['😊 Весёлый', '😊 Happy'], sad: ['😢 Грустный', '😢 Sad'], hungry: ['🥕 Голодный', '🥕 Hungry'],
  sleepy: ['😴 Сонный', '😴 Sleepy'], mucky: ['🫧 Грязнуля', '🫧 Mucky'],
};

export const MOOD_REPLY = {
  right: [['Да! Ты меня так хорошо понимаешь!', 'Yes! You understand me so well!'], ['Точно! Как ты догадалась?', 'Exactly! How did you know?']],
  happy: [['Не-а! На самом деле я очень счастлив!', "Nope! Actually I'm really happy!"]],
  sad: [['Не совсем… Мне немножко скучно.', "Not quite… I'm a little bit bored."]],
  hungry: [['Не совсем. На самом деле я голодный!', "Not quite. Actually, I'm hungry!"]],
  sleepy: [['Почти! На самом деле я сонный. Ааах.', "Almost! Actually I'm sleepy. Yawn."]],
  mucky: [['Не совсем. Я немножко грязнуля!', "Not quite. I'm a bit mucky!"]],
};

export const TOUCH_REPLY = {
  right: [['Да! Хи-хи, щекотно!', 'Yes! Tee-hee, that tickles!'], ['Правильно! Ты молодец!', 'Right! Well done!']],
  ears: [['Хи-хи, это мои ушки!', "Tee-hee, those are my ears!"]],
  head: [['Это моя голова! Носик пониже.', "That's my head! My nose is a bit lower."]],
  body: [['Хи-хи, это мой животик!', "Tee-hee, that's my tummy!"]],
  nose: [['Апчхи! Это мой носик!', "Achoo! That's my nose!"]],
};

// Choose-your-path stories
export const STORY = {
  a0: { say: ['Пойдём в приключение! Куда отправимся?', "Let's go on an adventure! Where shall we go?"],
    opts: [[['В лес', 'The forest'], 'f1'], [['На море', 'The seaside'], 'b1'], [['В космос', 'Space'], 's1']] },
  f1: { say: ['Мы в лесу. Ой, кто-то шуршит в кустах! Кто это?', "We're in the forest. Oh, something is rustling in the bushes! Who is it?"],
    opts: [[['Ёжик', 'A hedgehog'], 'f2'], [['Медведь', 'A bear'], 'f3']] },
  f2: { say: ['Это ёжик! Он дал нам яблочко. Вот повезло!', "It's a hedgehog! He gave us an apple. How lucky!"] },
  f3: { say: ['Медведь? Ой-ой! Ниндзя-прыжок и бежим домой! Уф, успели!', 'A bear? Uh-oh! Ninja jump and run home! Phew, we made it!'] },
  b1: { say: ['Мы на море! Что будем делать?', "We're at the seaside! What shall we do?"],
    opts: [[['Строить замок из песка', 'Build a sandcastle'], 'b2'], [['Плавать', 'Swim'], 'b3']] },
  b2: { say: ['Мы построили замок из песка! А я в нём король-кролик.', 'We built a sandcastle! And I am the bunny king.'] },
  b3: { say: ['Я плыву по-кроличьи! Буль-буль… лучше вернусь на песок.', "I'm doing the bunny paddle! Glug-glug… I'd better get back on the sand."] },
  s1: { say: ['Ракета взлетает! Три, два, один! Куда летим?', 'The rocket is taking off! Three, two, one! Where to?'],
    opts: [[['На Луну', 'The Moon'], 's2'], [['К звезде', 'A star'], 's3']] },
  s2: { say: ['Мы на Луне! Морковки тут нет, зато сколько кратеров для прыжков!', 'We are on the Moon! No carrots here, but so many craters to hop in!'] },
  s3: { say: ['Мы долетели до звезды. Она нам подмигнула! Пора домой.', 'We reached a star. It winked at us! Time to go home.'] },
  p0: { say: ['Давай устроим вечеринку! Что возьмём?', "Let's have a party! What shall we bring?"],
    opts: [[['Торт', 'A cake'], 'p1'], [['Шарики', 'Balloons'], 'p2'], [['Музыку', 'Music'], 'p3']] },
  p1: { say: ['Морковный торт! Я задую свечки ушками.', "A carrot cake! I'll blow out the candles with my ears."] },
  p2: { say: ['Шарики! Ой, один меня поднял! Я летаю!', "Balloons! Oh, one is lifting me up! I'm flying!"] },
  p3: { say: ['Включай! Смотри, как я танцую ниндзя-диско!', "Turn it on! Watch me do the ninja disco!"] },
};

// The riddle frog: a rare visitor with her own voice
export const FROG = {
  hello: [['Ква! Я лягушка-загадушка. Отгадаешь мою загадку?', "Ribbit! I'm the riddle frog. Can you solve my riddle?"]],
  right: [['Ква-ква! Правильно! Ты умница!', 'Ribbit-ribbit! Correct! Clever you!'], ['Ква! Угадала! Вот это голова!', 'Ribbit! You got it! What a clever girl!']],
  wrong: [['Ква… нет! Попробуй ещё.', 'Ribbit… no! Try again.'], ['Ква-ква, не то! Думай ещё.', 'Ribbit-ribbit, not that one! Think again.']],
  bye: [['Ква! Мне пора в пруд. Пока!', 'Ribbit! Time to hop back to my pond. Bye!']],
  riddles: [
    { q: ['Что можно поймать, но нельзя бросить?', "What can you catch but can't throw?"], right: ['Простуду', 'A cold'], wrong: [['Мяч', 'A ball'], ['Рыбку', 'A fish']] },
    { q: ['Что становится мокрым, когда сушит?', 'What gets wetter the more it dries?'], right: ['Полотенце', 'A towel'], wrong: [['Шапка', 'A hat'], ['Солнце', 'The sun']] },
    { q: ['У чего есть зубы, но оно не кусается?', 'What has teeth but cannot bite?'], right: ['Расчёска', 'A comb'], wrong: [['Акула', 'A shark'], ['Собака', 'A dog']] },
    { q: ['Что всегда впереди, но никогда не приходит?', 'What is always coming but never arrives?'], right: ['Завтра', 'Tomorrow'], wrong: [['Автобус', 'A bus'], ['Поезд', 'A train']] },
    { q: ['У чего есть шея, но нет головы?', 'What has a neck but no head?'], right: ['Бутылка', 'A bottle'], wrong: [['Жираф', 'A giraffe'], ['Змея', 'A snake']] },
    { q: ['Что можно разбить, даже не трогая?', 'What can you break without touching it?'], right: ['Обещание', 'A promise'], wrong: [['Чашку', 'A cup'], ['Яйцо', 'An egg']] },
  ],
};
