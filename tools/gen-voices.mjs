// Record voice clips for all lines: node tools/gen-voices.mjs
// Lines that already have a clip are skipped, so after editing texts only new lines are recorded.
import fs from 'node:fs';
import { synth, apiKey } from './tts.mjs';
import { STR, LUCKY, DOG, CHATS, PRANKS, RIDDLES, PHRASES } from '../js/i18n.js';
import { clipId, speechText, VOICES } from '../js/voicekey.js';
import { REPLY, ASKS, MOOD_REPLY, TOUCH_REPLY, STORY, FROG } from '../js/dialogs.js';
import { MISSIONS, PALETTES } from '../js/missions.js';
import { JOKES } from '../js/jokes.js';
import { IDIOMS, TWISTERS } from '../js/english.js';

const OUT = new URL('../audio/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const NAMES = { ru: { name: STR.ru.kidDefault, dog: STR.ru.dogDefault }, en: { name: STR.en.kidDefault, dog: STR.en.dogDefault } };
const fill = (s, lang) => s.replaceAll('{name}', NAMES[lang].name).replaceAll('{dog}', NAMES[lang].dog);

const lines = new Map();
const add = (who, lang, text) => {
  const t = speechText(fill(text, lang));
  if (t) lines.set(clipId(who, lang, t), { who, lang, text: t });
};
const addPair = (who, [ru, en]) => { add(who, 'ru', ru); add(who, 'en', en); };
const walk = (who, o) => {
  if (Array.isArray(o) && typeof o[0] === 'string') addPair(who, o);
  else if (Array.isArray(o)) o.forEach((x) => walk(who, x));
  else if (o && typeof o === 'object') Object.values(o).forEach((x) => walk(who, x));
};

walk('lucky', LUCKY);
walk('lucky', RIDDLES);
walk('dog', DOG);
for (const chat of CHATS) for (const [who, ru, en] of chat) addPair(who, [ru, en]);
for (const pr of PRANKS) for (const [who, ru, en] of pr.lines) addPair(who, [ru, en]);
for (const p of PHRASES) addPair('lucky', p);
// Ninja missions: the mission itself and the words for what she found, saw or made
for (const m of MISSIONS) addPair('lucky', m.text);
for (const list of Object.values(PALETTES)) for (const it of list) addPair('lucky', it.w);
// Tali's jokes: Tali tells them, Lucky plays along in knock-knock jokes and comments
for (const j of JOKES) {
  if (j.q) addPair('dog', j.q);
  if (j.kk) { addPair('dog', j.kk); addPair('lucky', j.who); }
  addPair('dog', j.a);
  if (j.say) addPair('lucky', j.say);
}
// Fun English: Lucky's sayings (in context and what they mean) and tongue twisters (one clip, played at three speeds)
for (const it of IDIOMS) { addPair('lucky', it.say); addPair('lucky', it.mean); }
for (const tw of TWISTERS) addPair('lucky', tw.t);
for (const k of ['washHint', 'noGames', 'tooTired']) addPair('lucky', [STR.ru[k], STR.en[k]]);
// Lucky's questions: only Lucky's lines are voiced; answer choices are text
walk('lucky', REPLY);
walk('lucky', MOOD_REPLY);
walk('lucky', TOUCH_REPLY);
for (const d of ASKS) {
  if (d.q) addPair('lucky', d.q);
  for (const k of ['ok', 'no']) if (d[k]) addPair('lucky', d[k]);
  if (d.special) Object.values(d.special).forEach((x) => addPair('lucky', x));
  if (d.replies) d.replies.forEach((x) => addPair('lucky', x));
}
for (const n of Object.values(STORY)) addPair('lucky', n.say);
walk('frog', { hello: FROG.hello, right: FROG.right, wrong: FROG.wrong, bye: FROG.bye });
for (const r of FROG.riddles) addPair('frog', r.q);

const todo = [...lines].filter(([id]) => !fs.existsSync(`${OUT}${id}.mp3`));
console.log(`lines: ${lines.size}, to record: ${todo.length}`);

const key = apiKey();
let done = 0, failed = 0;
async function worker() {
  while (todo.length) {
    const [id, l] = todo.shift();
    try {
      fs.writeFileSync(`${OUT}${id}.mp3`, await synth(l.text, l.lang, VOICES[l.who].voice, {}, key));
    } catch (e) {
      failed++;
      console.log('error:', l.who, l.lang, l.text, '→', e.message);
    }
    if (++done % 50 === 0) console.log(`…${done}`);
  }
}
await Promise.all([worker(), worker(), worker()]);

// Remove clips for lines that are no longer in the game
let removed = 0;
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith('.mp3') && !lines.has(f.slice(0, -4))) { fs.unlinkSync(OUT + f); removed++; }
}

const ids = [...lines.keys()].filter((id) => fs.existsSync(`${OUT}${id}.mp3`)).sort();
fs.writeFileSync(`${OUT}manifest.json`, JSON.stringify(ids));
console.log(`done: ${ids.length} clips, errors: ${failed}, removed: ${removed}`);
