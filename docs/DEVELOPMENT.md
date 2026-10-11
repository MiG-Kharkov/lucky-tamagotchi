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
| `?debug` | Exposes `window.game` in the console (`S()` state, `loop()`, `save()`, `visitorNow()`, `askById(id)` / `ask(id)`, `mission(id)`, `game(id)`, `sound()`, `laugh(action)`, `idiom(id)`, `twister()`, `visitorEnd(kind)`, `fidget()`, `chat(i)` / `prank(i)` (a chat or prank with Tali, acted out), `event('halloween:3')` (show a holiday at a stage, `null` for the calendar), `tricks()` / `trick(name)` (Lucky's rare tricks), `touch(gesture, part, dir)` (one way of answering a touch), `startHoliday(game)` (start a holiday game; while it runs `arcade()` shows its insides), `frog()`, `dog()`, `modal(title)`, `toast(html)`, `talk(steps, keep)`, `now()` (mode, chat, scene, windows)) |
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
| `js/main.js` | Game logic and UI: speech rules, care actions, taps on Lucky, questions, visitors, decorate mode, dojo, collection, parents' area, main loop |
| `js/antics.js` | Gestures (tap / double / long / stroke / swipe) and the scene antics: what every thing does and how Lucky joins in, props, the scene tools (`kit`) |
| `js/tricks.js` | Lucky's tricks: the ways he answers each touch on each part of him, and the rare big tricks |
| `js/ninja.js` | The ninja mission screen: counting, holds, sneak and freeze dance, hunts, look and make |
| `js/missions.js` | Mission list, skills and the pick grids (with English words) |
| `js/jokes.js` | Tali's jokes: question/answer and knock-knock, with Lucky's reaction and comment |
| `js/english.js` | Sayings Lucky acts out (where each one fits, what it means, the Russian equivalent) and tongue twisters |
| `js/events.js` | Holidays: dates (Easter is worked out), how many days before each one decorations start, stages, holiday stickers |
| `js/arcade.js` | The holiday games' engine: a canvas core (loop that pauses when hidden, touch, emoji sprites, sparkles, time bar) and the kinds: shooter, catcher, whack, fireworks, runner; difficulties |
| `js/holigames.js` | The holiday games: three per holiday, each a kind with a theme (pictures, sounds, hazards, boss) and its point targets |
| `js/state.js` | Saved state, stat decay, daily limits, levels, mood tiers, parent password storage, Turbo snapshot |
| `js/i18n.js` | All texts as `[ru, en]` pairs: UI strings, Lucky's lines, jokes, missions, phrases, talk-game dialogues |
| `js/dialogs.js` | Lucky's questions with answer choices, stories, riddle frog |
| `js/wardrobe.js` | 28 outfit items (SVG layers per slot) |
| `js/content.js` | Worlds, decorations, sticker albums, badges |
| `js/art.js` | SVG art: Lucky (with his 16 expressions), Tali, 8 worlds + night, decorations, belts, icon, Lucky's props |
| `js/game.js` | Mini-games and their shared shell (difficulty, stars, records for the holiday games; the memory and copy-me games serve both) |
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

## Decorations

Positions in `S.layout` are in % of the 400×700 background picture (`artBox` in `main.js`), not of the visible scene.
The picture is drawn bottom-aligned and scaled to cover, and the decoration layers get the same box, so items stay on
the same spot of the picture when the scene's height changes. In Decorate the whole scene is shown scaled down above
the tray (`editScale`). Saves from before 1.6.1 (`layoutV` 1) are converted once at start.

## Lucky's drawing and tricks

- `art.lucky()` draws him; the eyes (`.face-eyes`) and the mouth (`.face-mouth`) are separate groups, so a new
  expression is `art.setLuckyFace()` (`renderLucky` in `main.js` does it): nothing else is redrawn and the running
  animations go on. A full redraw (an outfit change) restarts the animations of the parts, so set the face or outfit
  first and add an animation class after it.
- The parts animations move: `.head`, `.ear-l`/`.ear-r`, `.face-eyes`, `.nose`, `.body`, `.tummy`, `.feet`, `.paws`
  (`.paw-l`/`.paw-r`, drawn last so they can go in front of his face) and `.tail`. CSS offsets for the paws are in the
  drawing's units (viewBox 0 0 200 210).
- `#lucky` is centred with a negative margin, not `transform: translateX(-50%)`: a transform turns with him, and
  every spin swung him a body width to the side. Animations use the individual `translate`, `rotate` and `scale`
  properties.
- Props go on two layers: `.l-props` over him and `.l-back` behind him (a prop with `back: true`, like the hero cape).
- `tricks.js`: each gesture and part has a list of ways `[weight, key, show, ok?]`; the same way never comes twice in a
  row. `show()` returns the line it wants (main.js says it with its usual cadence). What a touch means for the game
  stays in `main.js`. A rare trick is an antics scene (`kit.begin` … `kit.end`): it starts only when `quiet()` (nothing
  else on the screen), anything that covers the scene ends it, and its line comes when Lucky is at rest.
  `act.onLuckyTap` lets a trick take a tap (the statue laughs, the grin comes back, the real Lucky among the clones).
- Classes that lift Lucky into the bubble's place are listed in `AIR` in `main.js`: while one is on, the bubble steps
  aside. Add a new high jump there.
- Watch out for class names that already style other things: `.fly` is the flying food, for example.

## One thing at a time

- `leaveMain(mode)` is the way out of the scene (Wash, Decorate, a game, a mission): it ends a question, Lucky's
  scene, a chat and a waiting line.
- `showModal` doesn't open a window during a game or a mission, `closeGame` opens what waited; `toast` waits while a
  window is open. A window or a sheet ends Lucky's scene (`antics.end`).
- A chat (`talk`) waits up to 30 s while a sheet or a window is open (`nextStep`); a step that throws ends the chat.
- Everything automatic in the main loop checks `antics.busy()`, and Lucky joins a world scene only when `talking()` is
  false (no joke, saying or tongue twister going on).
- While a game, a mission or sleep fills the screen, `body.covered` hides `#app`, so the scene isn't drawn.

## Holidays

`js/events.js` lists the holidays. Each one starts `lead` days before its date and stays `after` days after it. From the
first day it is stage 3 (everything), `days <= 7` adds the last week's extras, and stage 4 is the day itself (1 and 2
are the quieter looks of earlier versions, still reachable in Turbo previews). `main.js` checks the calendar every minute
(`updateEvent`: the scene is redrawn only when the look changes) and sets `body.ev-<id>` plus `ev-s1`…`ev-s4`.

- **The interface:** each holiday sets custom properties on `body.ev-<id>.ev-s3` (`--ev-1`, `--ev-ink`, `--ev-card`,
  `--ev-line`, `--ev-pat` for the bars, `--ev-bar`, `--ev-btn`, `--ev-head`, `--ev-reveal`, `--ev-a1…a5` and `--ev-s1…s4`
  for the decorations on the action buttons and stat cards); the `.ev-s3 …` rules in `style.css` use them everywhere.
  A new screen gets the holiday look by using those properties. `luckyPic()` draws Lucky with his holiday hat away from
  the scene.
- **The pictures** are drawn in `art.js` (`eventScene`, `eventTop`) as a layer over the world in the same 400×700
  picture, so they line up. Taps go through to the world underneath except on holiday things (`data-tap="ev…"`, eggs,
  coins), which `antics.js` answers. Keep them outside the middle of the picture (about x 70–330, y 395–665), where
  Lucky covers them.
- **The calendar** (`openCalendar` in `main.js`) keeps the opened days in `S.calendar['<id>-<year>']`.
- **Holiday games:** `HOLIDAY_GAMES` in `holigames.js`. A game is `{ id, emoji, kind, energy, target: { easy, normal,
  hard }, theme }`; its name and hint are `g_<id>` and `g_<id>_hint` in `STR`. `kind` is a function from `arcade.js` or
  `'memory'` / `'simon'`. The shell (`openGame`) shows the difficulty, and `ctx.finish(points)` ends it: stars from the
  target, the best in `S.games.best['<id>:<level>']`, hearts from `points / target`. Targets were set from a bot that
  plays like a quick child; a child should reach three stars with good play.

- Nothing in the rules changes. Holiday lines live in `LUCKY.holiday` and `DOG.holiday` (greetings in the last week, on
  the eve and on the day, chatter), the holiday things' words in `LUCKY.antics`.
- Holiday stickers (Decorate gets a holiday category from stage 2) show only while their holiday is on and come back
  next year; parents can switch the decorations off. In Turbo the 🎃 tool previews each holiday in turn.
- New JS modules must also go into `ASSETS` in `sw.js`, or the game breaks offline.

## Voices

Lines are pre-recorded with Google Cloud Text-to-Speech, Chirp 3 HD voices: Lucky is **Fenrir**,
Tali is **Orus**, the frog is **Charon**. 2,879 MP3 files, ~29 MB. If a line has no clip
(a new line, or a changed name), the game automatically uses the device's built-in voice.

- **After editing texts** in `js/i18n.js`, `js/dialogs.js`, `js/jokes.js`, `js/english.js` or `js/missions.js`, run `node tools/gen-voices.mjs`.
  It records only new and changed lines and removes clips that are no longer used.
  The Google key is read from `.env.local` (`GOOGLE_TTS_KEY=...`). This file is git-ignored.
  Never commit or share it.
- **Google returned 429** (per-minute quota): wait a minute and run the script again.
- A word in the other language ("Привет!" on the English side) is read by that language's voice (`voiceLang` in
  `tools/tts.mjs`).
- **Change a voice or pitch:** `js/voicekey.js` → `VOICES`. `rate` is the playback speed-up; higher means a higher voice.
  If you change `voice`, delete `audio/` and record everything again.
- **Compare voices:** `node tools/voice-trial.mjs`, then open `/voice-trial/`.

## Parents' area

- The parents' area opens with the default password from [`js/config.js`](../js/config.js) (`CONFIG.parent.password`)
  until a parent sets their own inside. Only the hash of that one is stored, on the device (`lucky-parent-v2`),
  and Start over keeps it. The recovery password (`CONFIG.parent.recovery`, also in the README) always works.
- Older versions let whoever opened ⚙️ first create the password, which could be the child. That data (`lucky-parent-v1`)
  is removed on start, so the default password works again after the update.
- **Turbo** mode removes all limits for testing and showing, with tools for levels, visitors, questions, naps,
  a new day, sayings, holidays and Lucky's rare tricks. The real progress is saved before Turbo and restored when it is
  switched off.

## Screen Time (iPhone)

- **Only this game in the browser:** Settings → Screen Time → Content & Privacy Restrictions →
  App Store, Media, Web & Games → Web Content → **Only Approved Websites** → add the game's address.
- **Time limit:** Screen Time → App Limits → Add Limit → **Websites** → the game's address.
- Don't switch Safari off completely: Home Screen web apps run on Safari and would stop opening too.

## Testing

There is no test framework in the repo. During development the game was checked with Playwright scripts
(iPhone emulation, muted audio) covering care actions, questions, the frog, Turbo, the parent password,
limits, voice clip coverage, every gesture on every scene thing and every mission kind (with Playwright's fake clock),
every way Lucky answers a touch and every rare trick, and overlaps: whether a visible bubble ever covers his head,
whether a trick starts when something is on the screen, and whether a sheet or a window ends it.
When changing speech or audio code, check on a real iPhone: first-tap audio unlock, silent switch,
switching to another app and back (the sound must come back on the next tap), returning after a call, and offline mode.
In Turbo mode the waits inside missions are 2 seconds, which is handy for checking them by hand.
