// How a game goes, as a little moving picture on its card: a finger plays a few seconds of it, with the game's own
// pictures (the holiday games bring theirs). One picture for each kind of game: catch, zap, tap-what-peeks, pairs,
// copy-me, hop, fireworks, and the chat. No words, so it says the same in any language; the rules are under it.
// kind: 'catch' | 'shoot' | 'whack' | 'pairs' | 'copy' | 'run' | 'fire' | 'talk'; t: the game's theme (or {})

const bad = (e) => `<span class="gd-bad">${e}<i>✕</i></span>`;

export function cardDemo(kind, t = {}) {
  const good = t.good?.[0]?.e, nope = t.bad?.[0]?.e;
  let html = '';
  switch (kind) {
    case 'catch':
      // the basket follows the finger under a good thing; the bad one falls past
      html = `<span class="gd-a gd-item">${good || '🥕'}</span>${bad(nope || '🍕')}<span class="gd-a gd-basket">${t.basket || '🐰'}</span><span class="gd-a gd-yes">+5</span><span class="gd-hand">👆</span>`;
      break;
    case 'shoot':
      html = `<span class="gd-a gd-target">${t.targets?.[0]?.e || '👻'}</span><span class="gd-a gd-boom">✨</span>${t.friend ? bad(t.friend.e) : ''}<span class="gd-a gd-shot">${t.shot || '⭐'}</span><span class="gd-a gd-me">🐰</span><span class="gd-hand">👆</span>`;
      break;
    case 'whack':
      html = `<span class="gd-a gd-peek">${t.good?.[0]?.e || '👻'}</span><span class="gd-a gd-peek2">${bad(nope || '🐈')}</span>${[0, 1, 2].map((i) => `<span class="gd-spot s${i}">${t.spot || '🕳️'}</span>`).join('')}<span class="gd-a gd-boom">✨</span><span class="gd-hand">👆</span>`;
      break;
    case 'pairs': {
      const [a, b] = t.faces || ['🐰', '🥕'], back = t.back || '🐾';
      html = [a, b, a, b].map((f, i) => `<span class="gd-card c${i}"><b>${back}</b><b class="face">${f}</b></span>`).join('') + '<span class="gd-hand">👆</span>';
      break;
    }
    case 'copy': {
      const pads = t.pads || [{ e: '🌸', c: '#FF7AB8' }, { e: '🦋', c: '#9B7BFF' }, { e: '⭐', c: '#FFD23F' }, { e: '🍀', c: '#4CD37B' }];
      html = `<span class="gd-ear">🐰🎵</span>${pads.slice(0, 4).map((p, i) => `<span class="gd-pad p${i}" style="--c:${p.c}">${p.e}</span>`).join('')}<span class="gd-hand">👆</span>`;
      break;
    }
    case 'run':
      html = `<span class="gd-ground"></span><span class="gd-a gd-coin">${t.items?.[0]?.e || '🥕'}</span><span class="gd-a gd-rock">${t.obstacles?.[0]?.e || '🪨'}</span><span class="gd-a gd-runner">🐰</span><span class="gd-hand">👆</span>`;
      break;
    case 'fire':
      html = `<span class="gd-a gd-rocket">🚀</span><span class="gd-a gd-burst">🎆</span><span class="gd-hand">👆</span>`;
      break;
    case 'talk':
      html = `<span class="gd-q">Hi! 👋</span><span class="gd-opt o1">Hello!</span><span class="gd-opt o2">Thank you!</span><span class="gd-a gd-yes">✓</span><span class="gd-hand">👆</span>`;
      break;
    default:
      return '';
  }
  return `<div class="g-demo d-${kind}" aria-hidden="true">${html}</div>`;
}

// One 3.6 s loop for all; each kind times its parts in it
export const HOWTO_CSS = `
.g-demo { position: relative; width: 240px; height: 112px; margin: 2px auto 10px; border-radius: 18px; overflow: hidden; background: linear-gradient(#E3F2FF, #FFF0F8); box-shadow: inset 0 0 0 2px #0000000f; }
.g-demo > span { position: absolute; line-height: 1; font-size: 30px; animation-duration: 3.6s; animation-iteration-count: infinite; animation-timing-function: ease-in-out; }
.g-demo .gd-hand { z-index: 4; font-size: 30px; filter: drop-shadow(0 2px 3px #0005); }
.g-demo .gd-yes { color: #2E9E4E; font-weight: 900; font-size: 22px; opacity: 0; }
.gd-bad { position: absolute; line-height: 1; font-size: 28px; }
.gd-bad i { position: absolute; right: -8px; top: -6px; font-style: normal; font-size: 14px; font-weight: 900; color: #fff; background: #E2313B; border-radius: 50%; width: 17px; height: 17px; display: grid; place-items: center; }
/* catch */
.d-catch .gd-item { left: 62%; top: -30%; animation-name: gdFall; }
.d-catch .gd-bad { left: 14%; top: -30%; animation: gdFallBad 3.6s linear infinite; }
.d-catch .gd-basket { left: 18%; bottom: 6px; font-size: 34px; animation-name: gdSlide; }
.d-catch .gd-yes { left: 66%; bottom: 46px; animation-name: gdPop; }
.d-catch .gd-hand { left: 20%; bottom: -14px; animation-name: gdSlideHand; }
@keyframes gdFall { 0%, 15% { top: -30%; opacity: 1; } 55% { top: 52%; opacity: 1; } 58%, 100% { top: 56%; opacity: 0; } }
@keyframes gdFallBad { 0%, 30% { top: -30%; } 95%, 100% { top: 110%; } }
@keyframes gdSlide { 0%, 12% { left: 18%; } 42%, 88% { left: 60%; } 100% { left: 18%; } }
@keyframes gdSlideHand { 0%, 12% { left: 20%; } 42%, 88% { left: 62%; } 100% { left: 20%; } }
@keyframes gdPop { 0%, 56% { opacity: 0; transform: translateY(0); } 62% { opacity: 1; } 85% { opacity: 1; transform: translateY(-14px); } 92%, 100% { opacity: 0; } }
/* shoot */
.d-shoot .gd-target { left: 58%; top: 10px; animation-name: gdHit; }
.d-shoot .gd-boom { left: 58%; top: 8px; opacity: 0; animation-name: gdBoom; }
.d-shoot .gd-bad { left: 14%; top: 12px; }
.d-shoot .gd-me { left: 30%; bottom: 6px; animation-name: gdSlideS; }
.d-shoot .gd-shot { left: 62%; bottom: 30px; font-size: 18px; opacity: 0; animation-name: gdShot; }
.d-shoot .gd-hand { left: 32%; bottom: -16px; animation-name: gdSlideSH; }
@keyframes gdSlideS { 0%, 10% { left: 30%; } 30%, 90% { left: 58%; } 100% { left: 30%; } }
@keyframes gdSlideSH { 0%, 10% { left: 32%; } 30%, 90% { left: 60%; } 100% { left: 32%; } }
@keyframes gdShot { 0%, 32% { bottom: 30px; opacity: 0; } 34% { opacity: 1; } 50% { bottom: 78px; opacity: 1; } 52%, 100% { bottom: 80px; opacity: 0; } }
@keyframes gdHit { 0%, 50% { opacity: 1; transform: none; } 54%, 92% { opacity: 0; transform: scale(.3); } 100% { opacity: 1; } }
@keyframes gdBoom { 0%, 50% { opacity: 0; transform: scale(.4); } 56% { opacity: 1; transform: scale(1.3); } 75%, 100% { opacity: 0; transform: scale(1.5); } }
/* whack */
.d-whack .gd-spot { bottom: 6px; font-size: 34px; z-index: 2; }
.d-whack .s0 { left: 10%; } .d-whack .s1 { left: 42%; } .d-whack .s2 { left: 74%; }
.d-whack .gd-peek { left: 44%; bottom: 10px; z-index: 1; animation-name: gdPeek; }
.d-whack .gd-peek2 { left: 76%; bottom: 10px; z-index: 1; animation-name: gdPeek2; }
.d-whack .gd-peek2 .gd-bad { position: static; display: inline-block; position: relative; }
.d-whack .gd-boom { left: 44%; bottom: 40px; opacity: 0; animation-name: gdBoom2; }
.d-whack .gd-hand { left: 46%; bottom: -40px; animation-name: gdTapW; }
@keyframes gdPeek { 0%, 10% { bottom: 10px; } 22%, 40% { bottom: 44px; opacity: 1; } 44%, 100% { bottom: 10px; opacity: 0; } }
@keyframes gdPeek2 { 0%, 55% { bottom: 10px; } 66%, 86% { bottom: 44px; } 94%, 100% { bottom: 10px; } }
@keyframes gdBoom2 { 0%, 40% { opacity: 0; transform: scale(.4); } 46% { opacity: 1; transform: scale(1.3); } 62%, 100% { opacity: 0; transform: scale(1.5); } }
@keyframes gdTapW { 0%, 14% { bottom: -40px; } 30% { bottom: 26px; transform: none; } 38% { bottom: 26px; transform: scale(.8); } 44% { bottom: 26px; transform: none; } 60%, 100% { bottom: -40px; } }
/* pairs */
.d-pairs .gd-card { top: 24px; width: 44px; height: 60px; border-radius: 10px; background: #fff; box-shadow: 0 3px 0 #0001, 0 0 0 2px #E8DDF0; font-size: 26px; }
.d-pairs .gd-card b { position: absolute; inset: 0; display: grid; place-items: center; }
.d-pairs .gd-card .face { opacity: 0; }
.d-pairs .c0 { left: 14px; } .d-pairs .c1 { left: 68px; } .d-pairs .c2 { left: 122px; } .d-pairs .c3 { left: 176px; }
.d-pairs .c0, .d-pairs .c2 { animation-name: gdMatch; }
.d-pairs .c0 .face { animation: gdFlip0 3.6s infinite; } .d-pairs .c2 .face { animation: gdFlip2 3.6s infinite; }
.d-pairs .c0 b:not(.face) { animation: gdBack0 3.6s infinite; } .d-pairs .c2 b:not(.face) { animation: gdBack2 3.6s infinite; }
.d-pairs .gd-hand { left: 26px; top: 70px; animation-name: gdTapP; }
@keyframes gdFlip0 { 0%, 16% { opacity: 0; } 20%, 90% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes gdBack0 { 0%, 16% { opacity: 1; } 20%, 90% { opacity: 0; } 94%, 100% { opacity: 1; } }
@keyframes gdFlip2 { 0%, 42% { opacity: 0; } 46%, 90% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes gdBack2 { 0%, 42% { opacity: 1; } 46%, 90% { opacity: 0; } 94%, 100% { opacity: 1; } }
@keyframes gdMatch { 0%, 50% { box-shadow: 0 3px 0 #0001, 0 0 0 2px #E8DDF0; } 56%, 88% { box-shadow: 0 0 0 4px #3DBA63; } }
@keyframes gdTapP { 0%, 8% { left: 26px; transform: none; } 16% { left: 26px; transform: scale(.8); } 20% { left: 26px; transform: none; } 34% { left: 134px; transform: none; } 42% { left: 134px; transform: scale(.8); } 46%, 80% { left: 134px; transform: none; } 100% { left: 26px; } }
/* copy me */
.d-copy .gd-ear { left: 8px; top: 8px; font-size: 18px; animation-name: gdEar; }
.d-copy .gd-pad { top: 34px; width: 44px; height: 44px; border-radius: 12px; background: var(--c); display: grid; place-items: center; font-size: 24px; opacity: .55; box-shadow: 0 3px 0 #0002; }
.d-copy .p0 { left: 20px; } .d-copy .p1 { left: 74px; } .d-copy .p2 { left: 128px; } .d-copy .p3 { left: 182px; }
.d-copy .p1 { animation-name: gdLight1; } .d-copy .p3 { animation-name: gdLight3; }
.d-copy .gd-hand { left: 84px; top: 112px; animation-name: gdTapC; }
@keyframes gdEar { 0%, 40% { opacity: 1; } 46%, 100% { opacity: .25; } }
@keyframes gdLight1 { 0%, 6% { opacity: .55; transform: none; } 9%, 16% { opacity: 1; transform: scale(1.12); } 20%, 52% { opacity: .55; transform: none; } 55%, 62% { opacity: 1; transform: scale(1.12); } 66%, 100% { opacity: .55; transform: none; } }
@keyframes gdLight3 { 0%, 22% { opacity: .55; transform: none; } 25%, 32% { opacity: 1; transform: scale(1.12); } 36%, 72% { opacity: .55; transform: none; } 75%, 82% { opacity: 1; transform: scale(1.12); } 86%, 100% { opacity: .55; transform: none; } }
@keyframes gdTapC { 0%, 40% { left: 84px; top: 112px; } 50% { left: 84px; top: 60px; transform: none; } 55% { transform: scale(.8); } 60% { left: 84px; top: 60px; transform: none; } 70% { left: 192px; top: 60px; } 75% { transform: scale(.8); } 80%, 88% { left: 192px; top: 60px; transform: none; } 100% { left: 84px; top: 112px; } }
/* hop */
.d-run .gd-ground { left: 0; right: 0; bottom: 0; height: 18px; background: repeating-linear-gradient(90deg, #7ACB6B 0 16px, #6BBE5C 16px 32px); animation: gdGround 1.2s linear infinite; }
.d-run .gd-runner { left: 30px; bottom: 16px; font-size: 32px; animation-name: gdHop; transform: scaleX(-1); }
.d-run .gd-rock { bottom: 16px; left: 110%; animation: gdRock 3.6s linear infinite; }
.d-run .gd-coin { top: 18px; left: 110%; font-size: 22px; animation: gdCoin 3.6s linear infinite; }
.d-run .gd-hand { left: 170px; top: 116px; animation-name: gdTapR; }
@keyframes gdGround { to { background-position: -32px 0; } }
@keyframes gdHop { 0%, 34% { bottom: 16px; } 46% { bottom: 64px; } 60%, 100% { bottom: 16px; } }
@keyframes gdRock { from { left: 110%; } to { left: -20%; } }
@keyframes gdCoin { 0% { left: 110%; opacity: 1; } 42% { left: 18%; opacity: 1; } 44%, 100% { left: 14%; opacity: 0; } }
@keyframes gdTapR { 0%, 22% { top: 116px; transform: none; } 30% { top: 56px; transform: none; } 35% { transform: scale(.8); } 40% { top: 56px; transform: none; } 55%, 100% { top: 116px; } }
/* fireworks */
.d-fire { background: linear-gradient(#1B1F5C, #4A3290); }
.d-fire .gd-rocket { left: 104px; bottom: -40px; animation-name: gdRocket; animation-timing-function: ease-out; }
.d-fire .gd-burst { left: 96px; top: 6px; font-size: 44px; opacity: 0; animation-name: gdBurst; }
.d-fire .gd-hand { left: 150px; top: 116px; animation-name: gdTapF; }
@keyframes gdRocket { 0% { bottom: -40px; opacity: 1; } 44% { bottom: 66px; opacity: 1; } 46%, 100% { bottom: 66px; opacity: 0; } }
@keyframes gdBurst { 0%, 45% { opacity: 0; transform: scale(.3); } 52% { opacity: 1; transform: scale(1.2); } 80% { opacity: .9; transform: scale(1.4); } 90%, 100% { opacity: 0; } }
@keyframes gdTapF { 0%, 18% { left: 150px; top: 116px; transform: none; } 40% { left: 112px; top: 34px; transform: none; } 45% { transform: scale(.8); } 50%, 60% { left: 112px; top: 34px; transform: none; } 80%, 100% { left: 150px; top: 116px; } }
/* chat */
.d-talk .gd-q { left: 12px; top: 10px; font-size: 18px; font-weight: 800; background: #fff; border-radius: 14px; padding: 6px 12px; box-shadow: var(--shadow); }
.d-talk .gd-opt { top: 60px; font-size: 15px; font-weight: 800; background: #fff; border-radius: 12px; padding: 7px 10px; box-shadow: 0 3px 0 #0001; color: var(--ink); }
.d-talk .o1 { left: 12px; animation-name: gdRight; } .d-talk .o2 { left: 104px; }
.d-talk .gd-yes { left: 78px; top: 40px; animation-name: gdPop; }
.d-talk .gd-hand { left: 30px; top: 116px; animation-name: gdTapT; }
@keyframes gdRight { 0%, 50% { box-shadow: 0 3px 0 #0001; } 56%, 88% { box-shadow: 0 0 0 3px #3DBA63; } }
@keyframes gdTapT { 0%, 25% { top: 116px; transform: none; } 45% { top: 76px; transform: none; } 50% { transform: scale(.8); } 55%, 70% { top: 76px; transform: none; } 90%, 100% { top: 116px; } }
`;
