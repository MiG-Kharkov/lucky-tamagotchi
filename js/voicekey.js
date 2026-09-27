// Общий ключ записи для игры и для скрипта генерации: кто + язык + текст без эмодзи.

export function speechText(s) {
  return s.replace(/\p{Extended_Pictographic}|️|‍/gu, '').replace(/^[\s…]+/, '').replace(/\s+/g, ' ').trim();
}

export function clipId(who, lang, text) {
  const str = `${who}|${lang}|${speechText(text)}`;
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, '0');
}

// Голоса Google Chirp 3 HD и ускорение при проигрывании (делает голос выше)
export const VOICES = {
  lucky: { voice: 'Fenrir', rate: 1.1 },
  dog: { voice: 'Orus', rate: 1.25 },
  frog: { voice: 'Charon', rate: 1.05 },
};
