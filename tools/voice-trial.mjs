// Пробные записи голосов: node tools/voice-trial.mjs
import fs from 'node:fs';
import { synth, apiKey } from './tts.mjs';

const OUT = new URL('../voice-trial/', import.meta.url).pathname;
const LINES = {
  lucky: {
    ru: ['Привет, Лиза! Я так рад тебя видеть!', 'Кия! Я кролик-ниндзя!', 'Хи-хи, щекотно! Ещё погладь!'],
    en: ["Hi, Liza! I'm so happy to see you!", "Hi-yah! I'm a ninja bunny!", 'Tee-hee, that tickles! More pets, please!'],
  },
  dog: {
    ru: ['Гав! Привет, Лиза!', 'Я маленький, но смелый!', 'Бежим наперегонки!'],
    en: ['Woof! Hi, Liza!', "I'm small but brave!", "Let's race!"],
  },
};
const VOICES = { lucky: ['Puck', 'Leda', 'Zephyr', 'Fenrir'], dog: ['Fenrir', 'Puck', 'Aoede', 'Orus'] };

const key = apiKey();
const list = [];
for (const who of Object.keys(VOICES)) {
  for (const voice of VOICES[who]) {
    for (const lang of ['ru', 'en']) {
      for (const [i, text] of LINES[who][lang].entries()) {
        const file = `${who}-${voice}-${lang}-${i}.mp3`;
        fs.writeFileSync(OUT + file, await synth(text, lang, voice, {}, key));
        list.push({ who, voice, lang, text, file });
      }
    }
  }
  console.log(who, 'готово');
}
fs.writeFileSync(OUT + 'list.json', JSON.stringify(list, null, 1));
console.log('файлов:', list.length);
