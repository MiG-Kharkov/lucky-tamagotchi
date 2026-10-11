// Holidays. For a few weeks before each one the worlds slowly fill with decorations, a little more every week,
// and on the day itself everything is out. Only pictures change: the rules, the timings and the voice stay the same.
// Stages: 1 three weeks before (a few small things), 2 two weeks before (more), 3 the last week (everything: Lucky's
// hat, Tali's bow, the interface, holiday visitors and stickers), 4 the day itself (and the days after it).

const DAY = 864e5;

// Easter Sunday (Western, as in Ireland): the anonymous Gregorian algorithm
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  return new Date(y, Math.floor(n / 31) - 1, (n % 31) + 1);
}

// lead: how many days before the day the decorations start; after: how many days after it they stay.
// stickers: holiday stickers for Decorate (they show only while their holiday is on, and come back next year).
// gift: the daily surprise and the present boxes in the last week.
export const EVENTS = [
  { id: 'halloween', icon: '🎃', name: ['Хэллоуин', 'Halloween'], date: (y) => new Date(y, 9, 31), lead: 21, after: 1,
    stickers: ['🎃', '👻', '🦇', '🕸️', '🧹', '🍬'], gift: ['🎃', '🍬', '🧺'], confetti: ['#FF8A1F', '#7B3FB8', '#2E2A33', '#FFD23F', '#9BE15D'] },
  { id: 'christmas', icon: '🎄', name: ['Рождество', 'Christmas'], date: (y) => new Date(y, 11, 25), lead: 21, after: 1,
    stickers: ['🎄', '🎁', '⛄', '🔔', '🧦', '🎅', '🦌', '🍪'], gift: ['🎁', '🎁', '🧦'], confetti: ['#E2313B', '#2E9E4E', '#FFD23F', '#FFFFFF', '#6FD3FF'] },
  { id: 'newyear', icon: '🎆', name: ['Новый год', 'New Year'], date: (y) => new Date(y, 0, 1), lead: 5, after: 6,
    stickers: ['🎆', '🎉', '🎊', '🎈', '🕛', '🎄', '✨'], gift: ['🎁', '🎉'], confetti: ['#FFD23F', '#C0C8D6', '#FF5FA2', '#8B6CFF', '#6FD3FF'] },
  { id: 'valentine', icon: '💝', name: ['День святого Валентина', "Valentine's Day"], date: (y) => new Date(y, 1, 14), lead: 7, after: 0,
    stickers: ['💌', '💝', '💘', '🌹', '🧸', '💐'], gift: ['💝', '💌'], confetti: ['#FF5FA2', '#E2313B', '#FFB3D6', '#FFFFFF', '#B78CFF'] },
  { id: 'patrick', icon: '☘️', name: ['День святого Патрика', "St Patrick's Day"], date: (y) => new Date(y, 2, 17), lead: 14, after: 0,
    stickers: ['☘️', '🍀', '🌈', '🪙', '🎩', '🎻'], gift: ['🪙', '🍀'], confetti: ['#2E9E4E', '#FFFFFF', '#FF8A1F', '#FFD23F', '#9BE15D'] },
  { id: 'easter', icon: '🐣', name: ['Пасха', 'Easter'], date: easter, lead: 14, after: 1,
    stickers: ['🥚', '🐣', '🧺', '🌷', '🐰', '🦋'], gift: ['🧺', '🥚'], confetti: ['#FFB3D6', '#B5E8FF', '#FFF2A8', '#C7F2B5', '#D9C7FF'] },
];
export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

// Emoji that exist only as holiday stickers (the others are ordinary stickers too and always show)
export function holidayOnly(regular) {
  const all = new Set(regular);
  return new Set(EVENTS.flatMap((e) => e.stickers).filter((x) => !all.has(x)));
}

// calendar days, so a time change doesn't move a holiday
const dayNo = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
const stageFor = (days) => (days <= 0 ? 4 : days <= 7 ? 3 : days <= 14 ? 2 : 1);

// The holiday that is on today with its stage and how many days are left (0 on the day), or null.
// If two overlap (an early Easter and St Patrick's Day) the one further along wins.
export function eventOn(now = new Date()) {
  const today = dayNo(now);
  let best = null;
  for (const ev of EVENTS) {
    for (const y of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]) {
      const days = dayNo(ev.date(y)) - today;
      if (days > ev.lead || days < -ev.after) continue;
      const it = { ...ev, days, stage: stageFor(days) };
      if (!best || it.stage > best.stage || (it.stage === best.stage && it.days < best.days)) best = it;
    }
  }
  return best;
}

// A holiday shown on purpose (Turbo preview): 'halloween' or 'halloween:2'
export function eventPreview(spec) {
  const [id, n] = String(spec).split(':');
  const ev = EVENT_BY_ID[id];
  return ev ? { ...ev, days: 0, stage: Math.min(4, Math.max(1, Number(n) || 4)), preview: true } : null;
}
