# Changelog

All notable changes to Lucky. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [semantic versioning](https://semver.org).

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

[1.1.1]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/releases/tag/v1.0.0
