// Personalise the game: names used in texts and speech.
// After changing them, regenerate the voice clips (see README → "Make it yours"),
// otherwise lines with the new names fall back to the device's built-in voice.
export const CONFIG = {
  // birthday: [month, day]. The game dresses up for it like for a holiday (events.js); the year is never needed
  child: { en: 'Liza', ru: 'Лиза', birthday: [1, 7] },
  dog: { en: 'Tali', ru: 'Тали' },
  // Parents' area. The default password works until a parent sets their own inside the parents' area.
  // The recovery password always works: it's written in the README for when the parent's password is forgotten.
  // Both are case-insensitive.
  parent: { password: 'mango42', recovery: 'carrot-rescue-2026' },
};
