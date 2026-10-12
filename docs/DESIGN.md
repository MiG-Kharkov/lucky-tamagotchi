# 🎨 Game design

A Tamagotchi for a girl in the top classes of primary school, at a school in Ireland. Her family is from Ukraine
and lived in Thailand before Ireland. The pet is **Lucky**, a ginger lop-eared bunny: he is
drawn after her own bunny, Lucky. Sometimes **Tali**, the family's real chihuahua (tiny, white with black spots), and
the **riddle frog** come to visit. Lucky and Tali are boys.

She is not little any more, so the game is pitched a little older: harder games with records to beat, a cheekier
Lucky, the English she hears in the schoolyard, and the holidays of her own family.

## Principles

| Principle | How |
|---|---|
| Nothing irreversible | Lucky never gets ill or dies; stats never drop below 15% |
| No guilt | After a break he says "I missed you!"; no streaks to lose |
| Watching is free, binging isn't | Just looking at Lucky costs nothing; only active play counts |
| Breaks | 15 minutes of active play, then an hour of rest (Lucky naps in his garden). After 60 minutes a day he rests until the morning. Both come with a minute's notice ("Soon I'll need a rest", said again 20 s before): it waits until Lucky can really say it (not over a question or a joke), and he lies down at least 45 s after it, even when a game ran past the limit. At night (22:00–07:00) he sleeps |
| Life off the screen | Ninja missions and caring for a real bunny happen in the real world |
| A clear finish line | "Today's plan": four small jobs, then a celebration and "go and play outside" |
| No manipulation | No ads, purchases, push notifications, online features or data collection |

## Language

The UI and Lucky's speech are **always English**. A small Russian translation is shown under every line
and is spoken when the bubble is tapped. British/Irish English (colour, favourite, "Grand!"),
with occasional Irish (Gaeilge) bonus words.

She has been at English-speaking schools for years, so the phrases of the day and Chat with Lucky are not beginner
English: they are how people talk in Ireland ("Fair play to you!", "I'm only messing!", "It's lashing!", answering
with the verb: "Will you have a cup of tea?" "I will!"), sayings ("Don't spill the beans!", "A storm in a teacup"),
and the questions she really gets asked: where she's from, what languages she speaks, when her birthday is, her pets.
The riddle frog has harder riddles too.

The family's other languages come with their holidays: on her birthday, at Songkran and on Ukrainian Independence Day
Lucky also says the greeting in Ukrainian or Thai, in those languages' voices (how it sounds and what it means are
shown in brackets).

## Mood

Four tiers derived from the stats (food, joy, clean, energy):

| Tier | When | Behaviour |
|---|---|---|
| 😢 low | any stat < 30% | quiet lines, sometimes sulks ("Wash me first!"), won't play games when very hungry |
| 🙂 ok | average < 62% | calm lines |
| 😊 happy | average ≥ 62% | cheerful lines |
| 🤩 max | food, joy, clean ≥ 78%, energy ≥ 45% | thrilled lines, binkies on his own |

Decay rates were tuned with a week-long simulation: with caring play Lucky is sad ~10% of the time
(mostly before feeding), happy ~70%, thrilled ~18%. Line choice is not rigid: 70% about unmet needs,
then mood-based lines and general topics, and 3% rare lines. Reactions to actions depend on the mood
(feeding a hungry bunny, washing a mucky one, game results, Tali's arrival).

## Talking

- **One thing at a time on the screen.** A window (a level-up, a present, a sticker) never opens over a game or a
  mission, it waits until that is over; a hint never sits on top of a window; a chat with lines (Tali's joke, a saying,
  a tongue twister) waits while a sheet or a window covers the scene; nothing automatic (chatter, a question, the frog,
  Tali arriving, the surprise, the mood check-in) starts in the middle of Lucky's scene; while Tali tells a joke Lucky
  doesn't run off to a scene. Leaving the scene (Wash, Decorate, a game, a mission, sleep) ends whatever was going on.
  In a big jump the bubble steps aside while Lucky is up there.
- **Lines:** ~720 of Lucky's lines (chatter, care, the scenes, holidays, the sensei, tricks) plus scenes with Tali;
  his last 60 lines are not repeated, and a reaction with a single line is not said again within two minutes (he
  still moves every time). A tap's word waits a moment for a second tap, so a double tap answers on its own.
- **One visitor at a time:** the frog waits until Tali has gone home, the mood check-in comes after the first half
  minute, and Tali comes only when the child has touched the screen in the last 30 seconds.
- **Lucky's questions** (at most every 4 minutes, up to 8 a day). Lucky's lines are voiced; the child's
  answer choices are text only, so they can be shuffled without new recordings:
  favourite things, "would you rather", guess what I'm thinking, "do you know…?", guess my mood,
  "tap my ears / nose / tummy", choose-your-path adventures.
- **Tali's visits:** he drops by while the child plays, not at set times, so there is nothing to miss:
  in the day's first session always (after 1.5–3.5 minutes of play), in later sessions 60% of the time,
  at most 3 visits a day and 40 minutes apart. He stays about 6 minutes, never at night or while Lucky sleeps,
  and brings one present a day.
- **Tali's jokes** (102, 14 of them knock-knock): one when he arrives, more with the 😂 button next to him
  (3 a visit), and a cheering-up one when Lucky is sad. A joke is a small scene: the question (Lucky tilts his head),
  the punchline with a *ba-dum-tss*, Lucky laughs, does something that fits (glasses for a clever joke, soaked
  for a wet one, hiding for a ghost) and comments. In knock-knock jokes Lucky plays along ("Who's there?").
  Taps on Lucky don't talk over a joke. The Russian line explains the pun. New jokes come first, and heard ones
  go to the **joke book** in the collection (tap to hear it again).
- **Sayings acted out** (22 idioms): Lucky uses one where it fits, acts it out literally, then explains what it means,
  and the Russian line gives the Russian saying for the same thing. Examples: *raining cats and dogs* when a cloud
  is tapped (cats and dogs fall on his umbrella), *hold your horses* after lots of quick taps, *a piece of cake*
  after a great game, *I'm all ears* before Tali's joke (his ears grow), *slept like a log* in the morning,
  *a fish out of water* in a new world, *cool as a cucumber* after ninja breathing, *couch potatoes* after a long
  day of play. At most 3 a day, each one not again for 3 days, new ones first.
- **Tongue twisters** (22): Tali's 👅 button (2 a visit). Lucky says the twister slowly 🐢, faster 🐇 and super fast 🚀
  (the same clip played faster, so his voice goes squeaky), gets his tongue in a knot, Tali laughs, and Lucky invites
  the child to try it out loud.
- The collection's **English** tab keeps jokes, tongue twisters (play at any of the three speeds) and sayings
  (tap one and Lucky acts it out again).
- **Super things** (9, they glow): the ball (keepy-uppy: Lucky counts out loud, best score kept), the house
  (hide and seek, peekaboo in the window, tidying up, a knock-knock joke, a nap), the tent (a ghost story, marshmallows
  on a campfire), the snowman (a snowball fight; he throws back and wobbles after three hits), the rocket (a souvenir
  from space, fireworks, a trip to the moon), the pond (the frog jumps on Lucky's head; fishing with a random catch),
  the balloon (pops and grows back; carries Lucky up, he comes down on his umbrella), the UFO (a tractor beam) and the
  fairy (Lucky shrinks; a different wish each time). Ordinary things keep their simpler reactions.
- **Visitors** fly by every 2–3 minutes of play, different in each world and each with its own flight and ending:
  butterflies (on his nose or ear, circling his head, a missed catch, a whole family), a ladybird (Lucky counts its
  seven spots out loud), a bee, a bird that sings on his head or drops a feather, a fish that splashes him, a snowflake
  on his tongue, shooting stars, a UFO, a kite, a balloon, sweets, an owl in the evening, and rarely a unicorn or a
  baby dragon. The same visitor never comes twice in a row.
- **Bunny habits:** in quiet moments (no taps for a while) Lucky grooms, stretches, flops over, sniffs, nibbles grass,
  looks around, does zoomies, digs a little hole, scratches his ears or does a binky, with a word about real rabbits
  now and then.
- **Chats with Tali are acted out:** a "WOOF!" in the middle of ninja training makes Lucky jump with his ears up, the
  scene goes dark when they talk about the dark, a bone pops up over Tali, they race, Lucky digs, sneaks and tries to
  wag his tail. Rare gags: a boop that ends in a sneeze, a hug so tight he gets squashed, ears that start spinning from
  a good pat, a thump that gives Tali a fright, a tickle that makes him flop over.
- **Stickers come alive:** the ladybird is counted, the bee chases Lucky, fish splash him, the unicorn leaves a rainbow,
  the rocket counts down, the telescope dreams of the moon, the sledge gives him a ride.
- Petting, the daily present (different wrapping; it pops up, floats down on a parachute, is dropped by a bird or dug
  up) and Tali's arrival (runs, jumps, digs, spins or skates in) vary too.
- **Riddle frog** 🐸: about 2 days in 3, after 3 minutes of play; a riddle with choices and a sticker for the right answer.
- **Living scene:** sun, clouds (rain), trees (petals), flowers (butterflies), gong, palm, crab, sheep, pot of gold…
  Butterflies fly by; a daily surprise present.
- **Gestures on Lucky** depend on where and how. Each one has several ways to answer, picked by weight and never the
  same twice in a row (`js/tricks.js`); what a touch gives for the game (joy, hearts, badge counters) doesn't depend on
  the way:

  | | Tap | Double tap | Long press |
  |---|---|---|---|
  | Head / body | pat, hop, clap, wave by his cheek, shimmy, twirl, bounce, hands on hips; a wink, a blush, heart or star eyes; rarely helicopter ears | binky, backflip, ninja jump, star jump, spin | hug (now and then too tight), bunny loaf, a cosy doze, melting |
  | Tummy | jiggle, giggle, a drum roll, a cheeky shimmy | drum, a bongo solo | tummy rub, a flop |
  | Feet | paw wiggle, tiptoes, tap-dancing | thump (a real bunny warning; Tali gets a fright), tap dance | thump |
  | Paws | high five, wave, clap | double high five, clap | paw shake |
  | Tail | wag, look back, chase it | chase, wag | "Gently! A bunny's tail is very delicate." |
  | Nose | sneeze, a sneeze that never comes, three sneezes | boop, a clown's honk, a sneeze | bunny kiss, a blown kiss |
  | Ears | wiggle (3 taps = helicopter) | | ear massage |

  A stroke with a finger makes him purr (bunnies really purr by grinding their teeth), melt, stretch or roll over, and
  lots of strokes give him static fluff. A swipe up makes him jump, down squashes him flat as a pancake, sideways he
  slides, dodges or kicks. Six quick taps tickle him.
- **Rare tricks:** now and then a gesture becomes a big trick instead: Super Bunny's flight (a cape, off one side and
  back from the other, a superhero landing), the Cheshire bunny (only the grin stays; tap it), ninja clones (find the
  real one), a bunny out of a hat, a giant who stomps and then goes tiny, a balloon bunny, Robo-Bunny, a handstand, a
  statue that mustn't laugh, a disco, a cartwheel that goes wrong, peekaboo, meditation, a quick change into one of his
  own outfits (only ones she has), a spin till he's dizzy. Each fits certain gestures (a double tap, a long press, a
  stroke, a swipe). At most one in about 50 seconds, none in the first 20 seconds, the last six don't come back soon,
  and only when the screen is free: no line playing, no question, sheet, window, hint, chat or scene. A trick is a
  scene: a sheet or a window ends it, and nothing automatic starts while it plays. Its line comes when Lucky is at rest,
  so the bubble never covers him.
- **Lucky's face** is a separate layer: 16 expressions (ok, happy, laugh, eat, sleep, tired, sad, wink, cheeky, shy,
  surprised, star eyes, heart eyes, dizzy, grin, sly). A new expression swaps only the eyes and the mouth, so his other
  animations keep running. His front paws are drawn in front of him, so old moves use them too: he claps, waves,
  washes his face, puts his paws on his hips, hugs, grabs his cheeks when startled, blows a kiss, dances.
- **Scene antics:** every tappable thing answers a tap, a double tap and a long press, and Lucky often joins in:
  sunglasses from the sun, a rain cloud that soaks him (he shakes dry), an umbrella, a rainbow, sniffing flowers,
  a flower behind his ear, hide and seek behind a tree, running from the crab, a coconut on the head, a snowball
  for the snowman, a space helmet, an Irish jig for the gold… Decorations join in too (the ball, the house, the rocket).
  Props are drawn on a separate layer over Lucky, so they don't reset his animations. Each line has its own cooldown,
  so he comments without chattering.

## Actions and games

| Action | Mechanics |
|---|---|
| 🥕 Feed | 5 foods with real bunny facts; at most 3 treats a day |
| 🎈 Play | Carrot Rain (a caught pizza takes a point away: bunnies can't eat it), Ninja Memory, Copy Lucky, Chat with Lucky (English Q&A). All but Chat with Lucky have three difficulties, stars and records, like the holiday games: Carrot Rain lasts 30, 45 or 60 seconds and falls faster, Memory has 6, 8 or 10 pairs, Copy Lucky's tunes grow to 10, 16 or 24 notes. A game starts on Normal; with three stars the next difficulty is suggested. While a holiday is on, its three games take the first three's place (below); Chat with Lucky stays. 3 games a day, 15 minutes between games, Back before starting doesn't use a game. Each game gives up to 8 hearts (24 a day), so all three count. You can't lose |
| 🫧 Wash | Rub Lucky with a finger |
| 🥷 Dojo | A daily real-world ninja mission (pick one of two), caring for a real bunny, ninja breathing |
| 🎀 Collection | Outfits, places, home decorations, sticker albums, badges |
| ✏️ Decorate | Drag items and stickers anywhere, resize, flip, delete. Each world has its own layout; lower items stand in front of Lucky. The tray has categories (⭐ super, 🏡 home, 🌍 this world, 🗺️ other worlds, 📒 sticker albums) and a grid; a decoration already on the scene is marked ✓ and selected when tapped again |
| 💬 Phrase of the day | A conversational phrase (all of them in turn, each once in 51 days) and a 3-question quiz: today's phrase and the ones from 3 and 10 days ago come back |
| 🌙 Put to bed | Voluntary end of the session, with a bonus |

Every third day or so Lucky asks how the child feels (every day was too much); if sad or cross, he offers ninja
breathing. His questions lean to "would you rather", quizzes and little stories; "tap my nose" is gone.

**Holiday games** (`js/arcade.js`, `js/holigames.js`): three for each holiday. Two or three minutes long, they speed up
smoothly and in waves every 30 seconds, and count points: a combo of good catches or hits raises a multiplier (×2 from
6, ×3 from 14, ×4 from 25) that a mistake resets; mistakes cost points but never end the game. The difficulty (easy,
normal, hard: time, speed, how much comes and how many hazards) is chosen on the start card and remembered per game.
The end card shows 1–3 stars against the game's target for that difficulty, the points and the best; a new best is
celebrated. Hearts come from the points against the target, as before.

| Kind | How it plays | Games |
|---|---|---|
| Shooter | Lucky follows the finger and fires on his own; targets come down alone or three in a row, a friend crosses (don't hit it), hazards drop (dodge or shoot them), treats and power-ups fall (rapid fire, three shots, a shield, a magnet), a boss with a health bar every few waves | Ghost Zapper, Snow Storm, Balloon Pop, Cupid's Arrows, Leprechaun's Gold, Water Fight |
| Catcher | Something sails along the top dropping things; catch the good ones in the basket, not the bad; rushes of many; power-ups (magnet, double points, slow motion, a big basket) | Santa's Presents, Birthday Presents (not the socks!), Love Letters, Egg Catch, The Elephant's Bucket, Sunflower Field |
| Whack | Things peek out of pumpkins, cakes, shamrocks or grass for a moment; tap the right ones, a golden one is worth more, leave the decoy | Pumpkin Peekaboo, Blow Out the Candles, Leprechaun Hide-and-Seek, Egg Hunt |
| Fireworks | Rockets rise from the town; a tap near the top of the flight is a perfect burst, and a burst sets off the rockets next to it | Fireworks |
| Runner | The world runs by; tap to hop, again in the air to hop higher; collect coins or eggs (in arcs), power-ups (balloons to fly, a magnet, a rainbow star) | Rainbow Run, Bunny Hop, Splash Dash, Wheat Field Run |
| Memory | Pairs (6, 8 or 10 by difficulty); pairs in a row score more, fewer moves and less time add a bonus | Spooky, Party, Heart and Ukrainian Memory |
| Copy me | The pads play a tune a note more each round | Jingle Bells; Birthday Song on eight pads ("Happy Birthday to You": two lines on Easy, three on Normal, the whole song on Hard) |

## Ninja missions

The doing happens in the real room; the phone is only the sensei. Each day offers two missions for different skills,
one of them counts. Lucky reads the mission out loud and guides it:

| Kind | Game element |
|---|---|
| Count (hops, star jumps, squats, punches) | Lucky counts out loud on the beat and does the move too |
| Hold (heron, tree pose, statue) | A ring timer while Lucky counts the seconds |
| Ninja sneak | Move on *Sneak!*, freeze on *Freeze!* at random moments (the phone can lie on the table) |
| Freeze dance | Music plays and stops at random; everyone freezes |
| Hunt (3 pink things, something red/blue/yellow, things that start with B) | Tap a circle for each find and pick it from a grid of English words. Items that don't fit (a spoon for B) get a gentle "try another" |
| Look (a cloud like an animal, count the birds, listen with eyes closed) | The "I'm back" button wakes up after some real time; the animal cloud then floats in Lucky's sky for the day |
| Make (a ninja mask, a paper star or plane, a drawing) | After real time, tell Lucky the colour; he wears the mask you drew for the rest of the day |

Rewards: a stamp on the ninja scroll, +1 in one of six skills (speed, balance, stealth, sharp eyes, creativity, calm)
and a step towards the next belt (3 stamps per belt).

## Progress

- Hearts from care (daily caps per category) raise the level. Every level up to 27 brings something new; after the
  last sticker the later levels bring bonus hearts (what the end of the collection should bring is an open question).
- Belts: white → … → black → **Pink Master Belt** (3 missions per belt, ~3 weeks). Lucky's headband matches the current belt.
- **Wardrobe:** 28 items in 4 slots (head, face, neck, costume), combinable. From levels, presents with rarity
  (common / rare / gold) and complete albums.
- **8 worlds** by level, each with its own tappable details and Decorate items.
- **11 decorations**, **60 stickers in 6 albums** (a full album gives a special item), **37 badges**, the English tab (jokes, tongue twisters, sayings).
- Pacing, measured with a 60-day model of the real tables: all stickers in about 3 weeks; the last world in 4 weeks
  with two sessions a day and 6 weeks with one; the level items in 5–9 weeks. An hour a day earns only about twice
  what 12 minutes do. Two stickers in three come from the album closest to done, so the albums fill one after another
  (about every three days) instead of all at once. Rewards arrive by days, not minutes.

## Holidays

The family's year: Halloween, Christmas, New Year, **her birthday** (7 January, from `config.js`), Valentine's Day,
St Patrick's Day, Easter, **Songkran** (the Thai New Year, 13–15 April) and **Ukrainian Independence Day** (24
August), with **St Nicholas Day** (6 December, as in Ukraine) inside the Christmas weeks. Three weeks before Halloween
and Christmas, two before St Patrick's Day and Easter, a week before New Year, Valentine's Day and Independence Day and
four days before her birthday and Songkran, the whole game is dressed up for it from the first day; the last week and
the day itself add their own things. Parents can switch it off; Turbo previews each holiday.

- **On every screen:** the worlds (pumpkins, a cauldron, ghosts and bats; a tree, presents and a snowman; fireworks and
  a clock; a birthday cake with candles, presents, balloons and cupcakes; heart balloons, roses and a mailbox; shamrocks,
  a rainbow and the leprechaun's coins; eggs, chicks and tulips; an elephant, water pistols, buckets and a silver bowl
  for the blessing; sunflowers, wheat, the flag, kalyna and varenyky), the top of the scene (a cobweb with a spider,
  fairy lights, tinsel, a HAPPY BIRTHDAY banner, bunting, a garland of jasmine and marigolds, an embroidered towel), and
  the interface: the
  holiday's colours and a pattern on the level bar and the stat bars, little decorations on the level card, stat cards
  and action buttons (snow on every card at Christmas), the scene's frame, the main buttons, sheets, windows, the
  level-up present, hints, questions and games. Lucky wears his holiday hat everywhere, the Play button shows the
  holiday, Tali has an accessory, and the daily surprise and presents come in holiday wrapping.
- **Everything holiday answers taps** (a tap, a double tap, a long press), and Lucky joins in: a pumpkin lights up, gets a
  new face or is full of sweets; the potion turns Lucky another colour; the tree takes its star from him; a present
  opens with a toy; the clock counts down to midnight with fireworks; the mailbox sends him a love letter; the pot of
  gold makes him dance a jig; a tap blows out the birthday candles (and "Happy Birthday" plays); the elephant soaks him
  and he shakes himself dry; sunflowers turn to the sun. Easter eggs and the leprechaun's coins are hidden in every
  world to be found.
- **The holiday calendar:** a button on the scene shows the days to go. A window opens each day (a treat and two
  hearts), the holiday's own window holds a present. Windows she missed wait for her (the hearts keep their daily
  cap); a present left in the holiday's window is kept for a week after the day, and Lucky hands it over on the next
  visit.
- **Moments:** Tali comes trick-or-treating at Halloween, a ghost going past dims the scene, Cupid flies by, New Year's
  Day starts with a countdown and fireworks. On her birthday Lucky greets her (in Ukrainian and Thai too) and gives her
  a card from him and Tali with what they have done together: days, jokes, missions, stickers, her belt (never her
  age). On St Nicholas Day there is a present under the pillow (kept for her until Christmas Eve if she comes later).
  Holiday greetings and chatter, holiday visitors and stickers.
- **Holiday games** take the usual games' place (see Actions and games).

Nothing in the rules or the care changes. The calendar and the holiday games add about 5–10% hearts in the season.
The greeting of the day, Tali's holiday lines and trick-or-treat (on his first visit of the day) belong to the last
week and the day itself, so they don't repeat for three weeks.

## Parents' area

⚙️ → password (a default one until the parent sets their own inside; the recovery password from the README always works). Inside: session length,
rest time, games per day, daily limit, bedtime, wake-up time, sound, voice, translation, "we have a real bunny",
holiday decorations, today's stats and mood, change the parent password, Wake Lucky (also cancels the rest of the night), invite Tali, sound test,
**Standard / Turbo**, and Start over (double confirmation).
