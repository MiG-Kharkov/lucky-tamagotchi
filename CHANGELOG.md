# Changelog

All notable changes to Lucky. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [semantic versioning](https://semver.org).

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

[1.4.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/releases/tag/v1.0.0
