// Surgical-precision icon module: fdsi-plinko (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-68-plinko-pyramid",
  slug: "plinko",
  name: "#68. Plinko Peg Pyramid (Bottom 3 Multiplier Buckets Filled in Both Outline & Solid!)",
  area: "gx",
  order: 101,
  desc: "FIXED OUTLINE: The 3 bottom multiplier buckets (`b1..b3`) are now filled solid in Outline mode too (matching Solid mode 1:1), with the outlined drop ball at the crown and 5 bounce pegs!",
  meta: {
      "slug": "plinko",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Plinko peg-drop arcade game with multiplier buckets at the base.",
      "tags": [
          "plinko",
          "pegs",
          "pyramid",
          "drop",
          "multiplier",
          "arcade",
          "instant-win"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.4, 0.85);
      const ball = circleD(12.0, 4.8, 2.1);
      const ballSolid = circleD(12.0, 4.8, 2.4);
      const pegCoords = [[9.2, 9.8], [14.8, 9.8], [6.4, 13.8], [12.0, 13.8], [17.6, 13.8]];
      const pegs = pegCoords.map(([x, y]) => circleD(x, y, 1.2)).join("");
      const pegsSolid = pegCoords.map(([x, y]) => circleD(x, y, 1.35));
      const b1 = bloatRect({ x: 3.4,  y: 17.4, w: 4.8, h: 3.2, r: cr, b: b * 0.25 });
      const b2 = bloatRect({ x: 9.6,  y: 17.4, w: 4.8, h: 3.2, r: cr, b: b * 0.25 });
      const b3 = bloatRect({ x: 15.8, y: 17.4, w: 4.8, h: 3.2, r: cr, b: b * 0.25 });
      const bucketsFilled = `<path d="${b1.d}" fill="currentColor" stroke="none"/><path d="${b2.d}" fill="currentColor" stroke="none"/><path d="${b3.d}" fill="currentColor" stroke="none"/>`;
      return {
        keylines: drawKeylines([[12, 4.8, 2.1], ...pegCoords.map(([x, y]) => [x, y, 1.2])], [...b1.anchors, ...b3.anchors]),
        line: `<path d="${ball}"/><path d="${pegs}" fill="currentColor" stroke="none"/>${bucketsFilled}`,
        solid: {
          face: [ballSolid, ...pegsSolid, b1.d, b2.d, b3.d]
        },
        duotone: {
          tone: [ball],
          secondary: [],
          line: `<path d="${ball}"/><path d="${pegs}" fill="currentColor" stroke="none"/>${bucketsFilled}`
        }
      };
    }
};
