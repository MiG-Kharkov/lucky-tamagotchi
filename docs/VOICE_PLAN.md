# 🎙️ Voice plan: lines to record next

Everything in 1.7.0 (holidays, acted-out chats, living stickers, new endings) uses lines that are **already recorded**.
This file collects what would make it even better but **needs new recordings**: it waits for the Google TTS key.
Nothing here is in the game yet, so nothing plays with the robot voice.

## How to add them (when the key is there)

1. Put the pairs into `js/i18n.js` (the keys below are a suggestion: `LUCKY.holiday`, `DOG.holiday`, `LUCKY.antics.*`).
   `tools/gen-voices.mjs` records every list it walks, so anything under `LUCKY`, `DOG` and `LUCKY.antics` is picked up by itself.
2. Wire them where the "Where" column says (most are one `line(...)` call in `js/antics.js` or one `say(...)` in `js/main.js`).
3. `node tools/gen-voices.mjs`: it records only new and changed lines (Lucky: Fenrir, Tali: Orus).
   About 90 new pairs ≈ 180 clips ≈ 6,000 characters.
4. Check that every new line has its clip (no robot voice), listen to the new clips, then bump the version.

Russian lines follow the game's rules: the child is a girl (`нашла`, `молодец`), Lucky and Tali are boys,
`{name}` and `{dog}` only in the nominative case (they don't decline: "как у {name}" would come out wrong).

## 1. Holiday greetings and lines (Lucky unless noted)

Said once a day in the holiday's last week (stage 3) and on the day, the first time she opens the game; the rest now and then
in idle chatter. Suggested place: `greet()` and `idleTalk()` in `js/main.js`, behind `EV` (events.js).

| Holiday | When | RU | EN |
|---|---|---|---|
| Halloween | greeting | С Хэллоуином, {name}! Сладость или гадость? | Happy Halloween, {name}! Trick or treat? |
| Halloween | idle | Смотри, тыквы мне улыбаются! | Look, the pumpkins are smiling at me! |
| Halloween | idle | Я кролик-ведьма! Бу-у! | I'm a witch bunny! Boo-oo! |
| Halloween | Tali | Гав! Я самый страшный пёс! Хи-хи. | Woof! I'm the spookiest dog! Hee-hee. |
| Christmas | greeting | С Рождеством, {name}! | Merry Christmas, {name}! |
| Christmas | 24 Dec | Сегодня ночью придёт Санта! Тсс! | Santa is coming tonight! Shh! |
| Christmas | idle | Смотри, снег идёт! Всё стало белым. | Look, it's snowing! Everything is white. |
| Christmas | Tali | Я попросил у Санты большую косточку! | I asked Santa for a big bone! |
| New Year | greeting | С Новым годом, {name}! | Happy New Year, {name}! |
| New Year | idle | Давай загадаем желание на Новый год! | Let's make a wish for the new year! |
| New Year | 31 Dec | Сегодня ночью Новый год! Ура! | The New Year is tonight! Hooray! |
| Valentine's | greeting | С Днём святого Валентина! Я тебя люблю! | Happy Valentine's Day! I love you! |
| Valentine's | idle | Это сердечко для тебя! | This heart is for you! |
| St Patrick's | greeting | С Днём святого Патрика, {name}! | Happy St Patrick's Day, {name}! |
| St Patrick's | idle | Я кролик-лепрекон! Где моё золото? | I'm a leprechaun bunny! Where's my gold? |
| St Patrick's | Tali | Гав! Сегодня я зелёный пёс! | Woof! Today I'm a green dog! |
| Easter | greeting | С Пасхой! Давай искать яйца! | Happy Easter! Let's look for eggs! |
| Easter | idle | Где-то спрятаны яйца. Найдёшь? | Some eggs are hidden somewhere. Can you find them? |
| Easter | Tali | А я нашёл яйцо… и съел. Шучу! | I found an egg… and ate it. Only joking! |

## 2. Holiday things that are silent today

They act out already, a line would make them complete. Place: the sticker or visitor in `js/antics.js`.

| Thing | RU | EN | Today |
|---|---|---|---|
| 🎃 pumpkin, a ghost pops out | Кто там в тыкве? Ой, привидение! | Who's in the pumpkin? Oh, a little ghost! | "Boo! Did I scare you?" |
| 🧹 broom ride | Я лечу на метле! Ух! | I'm flying on a broom! Whee! | "Up, up and away!" |
| 🕸️ cobweb | Ой, паутина! Липкая! | Eek, a cobweb! It's sticky! | silent |
| 🔔 bell | Динь-дон! Колокольчик звенит! | Ding-dong! Jingle bells! | silent |
| 🦌 reindeer | Олень! А можно мне в сани к Санте? | A reindeer! Can I ride with Santa? | silent |
| 🕛 midnight clock | Тик-так… С Новым годом! | Tick-tock… Happy New Year! | silent (then fireworks) |
| 🎊 confetti | Конфетти! Это праздник! | Confetti! It's a party! | silent |
| ✨ sparkles | Я весь сверкаю! | I'm all sparkly! | silent |
| 💘 Cupid's heart | Сердечко прилетело прямо ко мне! | A heart flew right to me! | silent |
| 🎩 hat sticker | Новая шляпа! Я похож на лепрекона? | A new hat! Do I look like a leprechaun? | silent |
| 🎻 fiddle | Сыграем ирландскую мелодию! | Let's play an Irish tune! | silent |
| 🐣 chick (visitor, sticker) | Пи-пи! Привет, цыплёнок! | Peep-peep! Hello, little chick! | silent |
| 🥚 golden egg | Золотое яйцо! Вот это находка! | A golden egg! What a find! | "Treasure! Look how it shines!" |
| 👻 ghost visitor | Ой! Привидение! Ну, я тебя тоже напугаю: бу! | Eek! A ghost! Well, I'll scare you too: boo! | "Boo! Did I scare you?" |
| 🎅 Santa visitor | Санта! Я загадаю желание! | Santa! I'll make a wish! | "I'm making a wish…" |
| 💌 love letter | Письмо! Тут написано: «Я тебя люблю»! | A letter! It says "I love you"! | "I love you!" |

## 3. New scenes from 1.7.0 that would like their own words

| Scene | RU | EN | Today |
|---|---|---|---|
| Ball thrown at the screen, caught | Поймала! Отличный бросок! | You caught it! Great catch! | "Hooray! Well done, {name}!" |
| Counting the stars (star, tap) | Три звезды! Загадывай желание! | Three stars! Make a wish! | counts, then silent |
| Header into the goal | Удар головой! Гол! Ура! | already recorded ("Header! Goal!") | ok |
| Crab copied sideways | Смотри, я тоже хожу боком! | Look, I can walk sideways too! | "The little crab runs sideways!…" |
| Hug for the snowman, then cold | Брр! Снеговик такой холодный! | Brr! The snowman is so cold! | silent after the first line |
| Tali startled by a thump | (Tali) Ой! Кто стучит? | (Tali) Eek! Who's knocking? | bark only |
| Rare gag: hug so tight he squashes | Ой! Слишком крепко! | Oof! Too tight! | silent |
| Rare gag: flop after tickling | Всё… я упал от смеха! | That's it… I fell over laughing! | silent |
| Digging (bunny habit) | Копаю норку! Кролики так делают. | I'm digging a burrow! Bunnies do that. | uses the chat line "Bunnies are the best diggers!" |

## 4. Fixes to lines that are already recorded

| Where | Today | Better | Why |
|---|---|---|---|
| `js/jokes.js:34` (purple) | «…розовый, как у {name}!» | «…розовый, как у тебя!» | the name doesn't decline: "как у Лиза" |
| `DOG.jokesOut` (ru) | «Все шутки на сегодня кончились!» | «Шутки пока кончились! Выучу новые.» | the limit is per visit, not per day |
| `CHATS[9]` | RU voice reads "Hello!", EN voice reads «Привет!» | record the foreign word with the matching voice | each clip is read by the other language's voice |

## 5. Sound effects (no key needed: they are synthesised in `js/sound.js`)

Planned too, but left for later on purpose (this release changes pictures only):

| Effect | Where |
|---|---|
| a soft "ooo-ooo" for ghosts | 👻 visitor and sticker, the pumpkin ghost |
| sleigh bells | Santa's sleigh crossing the sky, the 🔔 sticker, the 🦌 reindeer |
| a firework whistle and crackle | New Year bursts, 🎆 and 🕛 stickers |
| an egg crack and a chick's peep | the Easter egg hunt, 🥚 and 🐣 |
| a little harp chord for hearts | 💌 💘 💝, the heart balloons |
| a fiddle phrase (jig) | 🎻, the leprechaun |
