# Changelog

All notable changes to Lucky. The format follows [Keep a Changelog](https://keepachangelog.com),
and versions follow [semantic versioning](https://semver.org).

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

[1.1.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/MiG-Kharkov/lucky-tamagotchi/releases/tag/v1.0.0
