# 🛠️ Developer notes

Lucky is a PWA in plain HTML, CSS and JavaScript: no build step, no dependencies.
Game design and mechanics are described in [DESIGN.md](DESIGN.md); the public overview is in the [README](../README.md).

## Run locally

```bash
python3 -m http.server 8123
```

Open <http://localhost:8123>. Useful query parameters:

| Parameter | What it does |
|---|---|
| `?debug` | Exposes `window.game` in the console (`S()` state, `loop()`, `save()`, `visitorNow()`, `askById(id)`) |
| `?mute` | No sound effects and no voice (for automated tests; settings are not changed) |

On `localhost` / plain `http` the service worker is **not** registered and any old cache is removed,
so the browser never mixes old and new files during development.

### Quick look on an iPhone (same Wi-Fi)

1. Run the server on the Mac as above.
2. On the iPhone open `http://<Mac IP>:8123` in Safari (`ipconfig getifaddr en0` prints the IP).

Offline mode needs https, so this is only for quick checks.

## Project structure

| Path | What's inside |
|---|---|
| `index.html` | The page, Content-Security-Policy, layout skeleton |
| `css/style.css` | All styles and animations |
| `js/main.js` | Game logic and UI: speech rules, care actions, questions, visitors, decorate mode, collection, parents' area, main loop |
| `js/state.js` | Saved state, stat decay, daily limits, levels, mood tiers, parent password storage, Turbo snapshot |
| `js/i18n.js` | All texts as `[ru, en]` pairs: UI strings, Lucky's lines, jokes, missions, phrases, talk-game dialogues |
| `js/dialogs.js` | Lucky's questions with answer choices, stories, riddle frog |
| `js/wardrobe.js` | 28 outfit items (SVG layers per slot) |
| `js/content.js` | Worlds, decorations, sticker albums, badges |
| `js/art.js` | SVG art: Lucky, Tali, 8 worlds + night, decorations, belts, icon |
| `js/game.js` | Mini-games and their shared shell |
| `js/sound.js` | Web Audio effects, voice clip playback, built-in voice fallback, iOS audio unlock |
| `js/voicekey.js` | Clip ids (shared with the generator) and voice settings |
| `js/config.js` | Child's and dog's names |
| `js/version.js` | Game version (semver) and build |
| `sw.js` | Service worker (offline cache) |
| `audio/` | Pre-recorded voice clips + `manifest.json` |
| `tools/` | Voice generation scripts |
| `.github/workflows/pages.yml` | Deploy to GitHub Pages |

## Publishing

Every push to `main` deploys to GitHub Pages via GitHub Actions. The workflow copies only the game files
and stamps the service-worker cache name with the commit hash, so phones pick up each release automatically.
Nothing needs to be bumped by hand.

Players install the game from Safari with **Share → Add to Home Screen**. Progress is stored on the device
(`localStorage`) and belongs to that Home Screen app and that web address.

## Versioning and releases

Lucky uses [semantic versioning](https://semver.org): `MAJOR.MINOR.PATCH`.
- **PATCH** (1.1.**1**): bug fixes only.
- **MINOR** (1.**2**.0): new features, content or behaviour that stays compatible with existing saves.
- **MAJOR** (**2**.0.0): changes that break existing saves or change the game substantially.

The version lives in one place, [`js/version.js`](../js/version.js), and is shown at the bottom of the
parents' area together with the build (commit hash, stamped by the deploy workflow).

To release:
1. Bump `VERSION` in `js/version.js`.
2. Add a section to [`CHANGELOG.md`](../CHANGELOG.md).
3. Commit, then tag: `git tag -a v1.2.0 -m "Lucky 1.2.0"`.
4. Push the commit and the tag: `git push --follow-tags`.

## Voices

Lines are pre-recorded with Google Cloud Text-to-Speech, Chirp 3 HD voices: Lucky is **Fenrir**,
Tali is **Orus**, the frog is **Charon**. About 1250 MP3 files, ~15 MB. If a line has no clip
(a new line, or a changed name), the game automatically uses the device's built-in voice.

- **After editing texts** in `js/i18n.js` or `js/dialogs.js`, run `node tools/gen-voices.mjs`.
  It records only new and changed lines and removes clips that are no longer used.
  The Google key is read from `.env.local` (`GOOGLE_TTS_KEY=...`). This file is git-ignored.
  Never commit or share it.
- **Google returned 429** (per-minute quota): wait a minute and run the script again.
- **Change a voice or pitch:** `js/voicekey.js` → `VOICES`. `rate` is the playback speed-up; higher means a higher voice.
  If you change `voice`, delete `audio/` and record everything again.
- **Compare voices:** `node tools/voice-trial.mjs`, then open `/voice-trial/`.

## Parents' area

- The password is created on each device on first use and stored only there, as a hash.
  A one-time **recovery code** is shown right after. There is deliberately no reset without the code,
  so a child can't take over the settings.
- **Turbo** mode removes all limits for testing and showing, with tools for levels, visitors, questions, naps and
  a new day. The real progress is saved before Turbo and restored when it is switched off.

## Screen Time (iPhone)

- **Only this game in the browser:** Settings → Screen Time → Content & Privacy Restrictions →
  App Store, Media, Web & Games → Web Content → **Only Approved Websites** → add the game's address.
- **Time limit:** Screen Time → App Limits → Add Limit → **Websites** → the game's address.
- Don't switch Safari off completely: Home Screen web apps run on Safari and would stop opening too.

## Testing

There is no test framework in the repo. During development the game was checked with Playwright scripts
(iPhone emulation, muted audio) covering care actions, questions, the frog, Turbo, password recovery,
limits and voice clip coverage. When changing speech or audio code, check on a real iPhone:
first-tap audio unlock, silent switch, returning after a call, and offline mode.
