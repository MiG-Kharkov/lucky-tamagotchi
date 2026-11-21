// The worlds from level 32 on. Each lives in its own module (js/zones/<id>.js) with everything it needs, and the
// game picks them up from here: the world list (content.js), the picture and holiday spots (art.js), Lucky's lines
// (i18n.js, so the voice tool records them), what its things do (antics.js) and its flying guests (main.js).
//
// A zone module has no imports and exports one object:
//   id, level, name: [ru, en]
//   emoji: [...]                stickers for Decorate, available once the world is open
//   spots: { L, R, l, r, sky }  where holiday things stand (two big spots, two small ones; the height bats fly at)
//   arrive: [[ru, en], ...]     what Lucky says on arriving
//   lines: { key: [[ru, en]] }  Lucky's lines for its scenes, added to LUCKY.antics; every key starts with the id
//   art: (u, h) => svg          the 400×700 picture; u: a unique id prefix for gradients; h: art helpers
//                               (svgOpen, cloud, flower, stars, snow, tapG, at, em). Things that answer taps are
//                               groups with data-tap="<thing>"; the middle (x 105–300, y 420–655) is where Lucky stands
//   css: '...'                  its own animations (ambient loops get the class "amb": Reduce Motion stops them)
//   props: (h) => ({ id: { slot, art } })   things Lucky wears or holds in its scenes (Lucky's viewBox 0 0 200 210)
//   reactions: (R, k) => {}     R.<thing> = { press, tap, double, long } for each of its things; k: the antics kit
//   visitors: [{ e, w, path, end: [...], html? }]  flying guests (paths and endings as in main.js VISITORS; html: drawn
//                               instead of the emoji)
//   endings: (k) => ({ name: (a, x, y) => {} })   new endings for its guests (a: the scene from k.begin)
//   wear: '<prop id>'           optional: a prop (slot 'zone') Lucky wears all the time in this world
import farm from './farm.js';
import reef from './reef.js';
import jungle from './jungle.js';
import dino from './dino.js';

export const ZONES = [farm, reef, jungle, dino];
export const ZONE_IDS = new Set(ZONES.map((z) => z.id));
