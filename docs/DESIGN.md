# 🎨 Game design

A Tamagotchi for a girl who goes to an English-speaking school. The pet is **Lucky**, a ginger lop-eared bunny.
Sometimes **Tali** (a tiny white chihuahua with black spots) and the **riddle frog** come to visit.
Lucky and Tali are boys.

## Principles

| Principle | How |
|---|---|
| Nothing irreversible | Lucky never gets ill or dies; stats never drop below 15% |
| No guilt | After a break he says "I missed you!"; no streaks to lose |
| Watching is free, binging isn't | Just looking at Lucky costs nothing; only active play counts |
| Breaks | 15 minutes of active play, then an hour of rest (Lucky naps in his garden). After 60 minutes a day he rests until the morning. At night (22:00–07:00) he sleeps |
| Life off the screen | Ninja missions and caring for a real bunny happen in the real world |
| A clear finish line | "Today's plan": four small jobs, then a celebration and "go and play outside" |
| No manipulation | No ads, purchases, push notifications, online features or data collection |

## Language

The UI and Lucky's speech are **always English**. A small Russian translation is shown under every line
and is spoken when the bubble is tapped. British/Irish English (colour, favourite, "Grand!"),
with occasional Irish (Gaeilge) bonus words.

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

- **Lines:** ~330 of Lucky's lines plus scenes with Tali; recent lines are not repeated.
- **Lucky's questions** (at most every 4 minutes, up to 8 a day). Lucky's lines are voiced; the child's
  answer choices are text only, so they can be shuffled without new recordings:
  favourite things, "would you rather", guess what I'm thinking, "do you know…?", guess my mood,
  "tap my ears / nose / tummy", choose-your-path adventures.
- **Riddle frog** 🐸: about 2 days in 3, after 3 minutes of play; a riddle with choices and a sticker for the right answer.
- **Living scene:** sun, clouds (rain), trees (petals), flowers (butterflies), gong, palm, crab, sheep, pot of gold…
  Butterflies fly by; a daily surprise present.
- **Gestures:** long press = hug, double tap = binky, ear tap, nose = sneeze, three ear taps = helicopter, many taps = tickle.

## Actions and games

| Action | Mechanics |
|---|---|
| 🥕 Feed | 5 foods with real bunny facts; at most 3 treats a day |
| 🎈 Play | Carrot Rain, Ninja Memory, Copy Lucky, Chat with Lucky (English Q&A). 3 games a day, 15 minutes between games, Back before starting doesn't use a game. You can't lose |
| 🫧 Wash | Rub Lucky with a finger |
| 🥷 Dojo | Daily real-world ninja mission, caring for a real bunny, ninja breathing |
| 🎀 Collection | Outfits, places, home decorations, sticker albums, badges |
| ✏️ Decorate | Drag items and stickers anywhere, resize, flip, delete. Each world has its own layout; lower items stand in front of Lucky |
| 💬 Phrase of the day | A conversational phrase and a 3-question quiz |
| 🌙 Put to bed | Voluntary end of the session, with a bonus |

Once a day Lucky asks how the child feels; if sad or cross, he offers ninja breathing.

## Progress

- Hearts from care (daily caps per category) raise the level (up to 30). Every level brings something.
- Belts: white → … → black → **Pink Master Belt** (3 missions per belt, ~3 weeks). Lucky's headband matches the current belt.
- **Wardrobe:** 28 items in 4 slots (head, face, neck, costume), combinable. From levels, presents with rarity
  (common / rare / gold) and complete albums.
- **8 worlds** by level, each with its own tappable details and Decorate items.
- **11 decorations**, **60 stickers in 6 albums** (a full album gives a special item), **34 badges**.
- Pacing: stickers ~3.5 weeks, level items ~6 weeks, the last world ~1.5 months. Rewards arrive by days, not minutes.

## Parents' area

⚙️ → password (created on the device on first use, with a one-time recovery code). Inside: session length,
rest time, games per day, daily limit, bedtime, wake-up time, sound, voice, translation, "we have a real bunny",
today's stats and mood, Wake Lucky (also cancels the rest of the night), invite Tali, sound test,
**Standard / Turbo**, and Start over (double confirmation).
