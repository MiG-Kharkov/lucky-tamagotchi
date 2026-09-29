# Changelog

All notable changes to Lucky. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [semantic versioning](https://semver.org).

## [1.6.1] – 2026-09-29

### Fixed
- **Things no longer move after Decorate.** They are placed on the background picture itself, so they stay on the same
  spot of grass or sky whatever the scene's height. Layouts from earlier versions are converted once and keep their
  place.
- **Decorate shows the whole scene**, scaled down above the tray, instead of cutting its top off, so high things
  (a balloon, the rainbow) can be seen and moved. What you see is where things end up.
- **The tray keeps one height** on every tab, however many things a category has (it scrolls inside). The scene no
  longer jumps when switching tabs.
- Lucky's speech bubble no longer blocks dragging while decorating.

## [1.6.0] – 2026-09-29

### Added
- **Super things:** 9 decorations and stickers glow and have their own fun on tap, double tap and long press:
  - ball: keepy-uppy with a best score;
  - house: peekaboo and tidying up;
  - tent: a ghost story and marshmallows;
  - snowman: a snowball fight;
  - rocket: souvenirs and fireworks;
  - pond: the frog jumps on Lucky's head, and fishing with a random catch;
  - balloon: a ride up, then down on the umbrella;
  - UFO: a tractor beam;
  - fairy: shrinking and random wishes.
- **Visitors for every world**, each with its own flight and ending: butterflies with five endings, a ladybird whose
  spots Lucky counts, a bee, a bird, a fish, snowflakes, shooting stars, a UFO, a kite, a balloon, sweets, an owl in the
  evening, and rarely a unicorn or a baby dragon.
- **Bunny habits** in quiet moments: grooming, stretching, flopping, sniffing, nibbling, looking around, zoomies.

### Changed
- **Decorate tray:** categories (super, home, this world, other worlds, sticker albums) and a two-row grid instead of
  one long row.
  - Placed decorations are marked, and tapping one again selects it instead of adding a copy.
  - Locked decorations show their level.
- More variety in petting reactions, in how the daily present arrives and in how Tali comes in.

## [1.5.0] – 2026-09-28

### Added
- **Sayings acted out:** 22 English idioms. Lucky uses them where they fit, acts them out literally, then explains
  what they mean. The Russian translation gives the Russian saying. Some examples:
  - *it's raining cats and dogs* when a cloud is tapped;
  - *hold your horses* after lots of quick taps;
  - *I'm all ears* before Tali's joke;
  - *cool as a cucumber* after ninja breathing.
  - At most 3 a day.
- **Tongue twisters:** Tali's new 👅 button. Lucky says a twister slowly, faster and super fast (squeaky!), gets his
  tongue in a knot, and invites the child to try. 22 twisters, 2 a visit.
- The collection's **English** tab: jokes, tongue twisters (play at three speeds) and sayings (tap for Lucky to act
  it out again). Two new badges.
- **Carrot Rain:** a falling pizza. Catching it takes a point away, because bunnies can't eat pizza.

## [1.4.0] – 2026-09-28

### Added
- **Tali's jokes:** 102 kids' jokes, 14 of them knock-knock jokes where Lucky plays along.
  - Tali tells one when he arrives, more with the 😂 button next to him (3 a visit), and cheers Lucky up when he's sad.
  - After the punchline (with a *ba-dum-tss*), Lucky laughs, does something that fits the joke and comments.
  - Puns are explained in the Russian translation.
- **Joke book** in the collection: heard jokes, tap one to hear it again. A new badge for 25 jokes.

### Changed
- **Tali comes much more often:** during play instead of a 3-hour window at a random time.
  - The first session of the day always gets a visit; later sessions get one 60% of the time.
  - At most 3 visits a day, 40 minutes apart, about 6 minutes each, never at night.
- Tali's present comes once a day.
- Taps on Lucky no longer cut a joke short; he still reacts, just without talking over Tali.

## [1.3.0] – 2026-09-27

### Changed
- **Parent password, simpler and safer:** the parents' area opens with a default password until a parent sets their own
  inside (no need to repeat the old one). A recovery password, written in the README, always works.
  The one-time recovery code is gone.
- The password created on first open by earlier versions is removed on update: the child could have created it
  by opening ⚙️ first. After the update the default password works until you set your own.

## [1.2.0] – 2026-09-27

### Added
- **Ninja missions, reimagined:** Lucky is the sensei. Pick one of two missions a day:
  - he counts your moves out loud and does them too;
  - holds come with a ring timer;
  - *Ninja sneak* ("Sneak!" / "Freeze!") and *Freeze dance* with music;
  - hunts at home with a grid of English words (and "that doesn't start with B!");
  - look out of the window: the animal cloud you saw floats in Lucky's sky for the day;
  - make a ninja mask: Lucky wears your colour all day.
  - Six ninja skills with stars, a scroll of stamps and a stamp animation.
- **Every thing in the worlds answers a tap, a double tap and a long press**, and Lucky joins in:
  sunglasses, a rain cloud that soaks him (he shakes dry), an umbrella, a rainbow, sniffing flowers,
  hide and seek, running from the crab, a coconut bonk with dizzy stars, snowballs, a top hat, a space helmet,
  a hula ring, an Irish jig and more. Decorations and stickers join in too.
- **Lucky's body parts:** head pats, tummy giggles and drums, foot thumps, nose boops, a bunny kiss,
  an ear massage and purring when you stroke him.
- **Tali:** double tap to spin after his tail, hold for a belly rub.
- The riddle frog makes Lucky put on his thinking glasses; a caught butterfly sits on his nose.
- About 600 new voice clips and new sound effects (rain, splash, sniff, bonk, thump, purr, freeze-dance music).

### Fixed
- **Sound after switching apps on iPhone:** it now comes back on the next tap (a fresh audio context
  instead of the stuck one); a line that couldn't play is replayed.
- Clouds no longer hide under the 💬 and ✏️ buttons, and small things (crab, flowers, clover) are easier to hit.

## [1.1.1] – 2026-09-27

### Fixed
- **Animations on iPhone:** with *Reduce Motion* switched on in iOS settings, taps on Lucky and the scene
  (hop, ear wiggle, helicopter ears, flowers, sun, candy and the rest) now animate again.
  Only the slow background loops (clouds, petals, snow, waves) stay still.
- **Ear wiggle** on a single ear tap now plays on iPhone as well.
- **Turning the phone:** the game stays portrait. In landscape a "Please turn your phone upright" screen is shown,
  and the scene is redrawn neatly after turning back.
- **Decorate:** a removed decoration (for example Lucky's house) can be added back from Collection → Home.
- The **rainbow** decoration no longer blocks taps on Lucky and the scene outside Decorate mode.
- The **sun, planet and clouds** sit lower, so they are visible on iPhone screens and not cut off at the top.

## [1.1.0] – 2026-09-27

### Added
- **Wake Lucky at night:** in the parents' area, *Wake Lucky* now also cancels the rest of tonight's sleep.
  The next night he sleeps on schedule again.
- **Sound test** in the parents' area with a short diagnostics line.
- **Version and build** shown at the bottom of the parents' area.

### Fixed
- Voices now play with the iPhone **silent switch** on (Audio Session API, plus a silent-track fallback on older iOS).
- **Helicopter ears** now really spin like a propeller on iPhone (Safari didn't start the animation after a redraw).

### Changed
- All code comments, tool messages and developer docs are in English.
- The Home Screen app is named **Lucky**.
- Deploy workflow uses the current GitHub Actions versions (no more Node.js 20 warning).

## [1.0.0] – 2026-09-27

First public release: care and four moods, Lucky's questions with answer choices, four mini-games,
ninja dojo with real-world missions, 28-item wardrobe, 8 worlds, decorate mode, 60 stickers in 6 albums,
34 badges, Tali the dog and the riddle frog, pre-recorded English/Russian voices, healthy-play limits and
a password-protected parents' area with a recovery code and Turbo mode.

[1.6.1]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/releases/tag/v1.0.0
