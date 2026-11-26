// Surgical-precision icon module: fdsi-mystery-box (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-131-mystery-box",
  slug: "mystery-box",
  name: "#131. Mystery Box / Prize Drop (2-Part Padded Box Lid & Body + Large Unobstructed '?' Inside!)",
  area: "bx",
  order: 164,
  desc: "FIXED '?' LEGIBILITY: Replaced the isometric V-seam (which collided with the '?') with a 2-part Mystery Box (Upper Lid Bar y=3.6..7.6 + Spacious Lower Box y=7.6..20.6) so the '?' has 13px of unobstructed room!",
  meta: {
      "slug": "mystery-box",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Mystery prize box drop with surprise free spins, cash, or free bets.",
      "tags": [
          "mystery",
          "box",
          "prize-drop",
          "surprise",
          "gift",
          "question",
          "reward"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      const lid = bloatRect({ x: 3.2, y: 3.6, w: 17.6, h: 4.0, r: cr, b: b * 0.3 });
      const box = bloatRect({ x: 4.4, y: 7.6, w: 15.2, h: 12.8, r: [0.6, 0.6, cr, cr], b: b * 0.35 });
      const boxSolid = bloatRect({ x: 4.4, y: 9.2, w: 15.2, h: 11.4, r: [0.9, 0.9, cr, cr], b: b * 0.35 });
      // Large, unobstructed question mark inside the lower box:
      const qHook = `M9.9 11.8A2.1 2.1 0 1 1 13.4 13.4C12.6 14.0 12.0 14.5 12.0 15.3`;
      const qHookSolid = `M9.9 12.4A2.1 2.1 0 1 1 13.4 14.0C12.6 14.6 12.0 15.0 12.0 15.8`;
      const qDot  = circleD(12.0, 17.8, 0.95);
      const qDotHole = circleD(12.0, 18.2, 1.15);
      return {
        keylines: drawKeylines([[12, 11.8, 2.1], [12, 17.8, 0.95]], [...lid.anchors, ...box.anchors]),
        line: `<path d="${box.d}"/><path d="${lid.d}"/><path d="${qHook}"/><path d="${qDot}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [lid.d, boxSolid.d],
          cut: [qHookSolid],
          holeExact: [qDotHole]
        },
        duotone: { tone: [box.d], secondary: [lid.d, qHook], line: `<path d="${box.d}"/><path d="${lid.d}"/><path d="${qHook}"/><path d="${qDot}" fill="currentColor" stroke="none"/>` }
      };
    }
};
