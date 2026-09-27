// Voice clip generation with Google Cloud Text-to-Speech (Chirp 3 HD).
// The key is read from .env.local (GOOGLE_TTS_KEY) and never printed.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));

export function apiKey() {
  const env = fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8');
  const m = env.match(/GOOGLE_TTS_KEY=(\S+)/);
  if (!m) throw new Error('GOOGLE_TTS_KEY is missing in .env.local');
  return m[1];
}

export const LANG = { ru: 'ru-RU', en: 'en-GB' };

export async function synth(text, lang, voice, { rate = 1 } = {}, key = apiKey()) {
  const code = LANG[lang];
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: code, name: `${code}-Chirp3-HD-${voice}` },
        audioConfig: { audioEncoding: 'MP3', speakingRate: rate, sampleRateHertz: 24000 },
      }),
    });
    const j = await r.json();
    if (r.ok) return Buffer.from(j.audioContent, 'base64');
    if (attempt >= 4 || r.status < 429) throw new Error(`${r.status} ${j.error?.message}`);
    await new Promise((res) => setTimeout(res, 1500 * attempt));
  }
}
