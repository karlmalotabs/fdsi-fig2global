// Surgical-precision icon module: fdsi-pitch-tracker (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, P, circleD, bloatRect, edgeY, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-pitch-tracker",
  slug: "pitch-tracker",
  name: "Match Pitch View (2 Separate Padded Pitch Halves + Center Circle)",
  area: "sb",
  order: 33,
  desc: "Simplified to 2 bold elements (no tiny penalty boxes): Bloated stadium pitch split by halfway line + bold center circle (r=3.0). Solid: 2 separate padded pitch halves with circular center cutout!",
  meta: {
      "slug": "pitch-tracker",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Live 2D match pitch visualizer showing ball possession and attacks.",
      "tags": [
          "pitch",
          "field",
          "tracker",
          "visualizer",
          "stadium",
          "football",
          "court"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 0.3, 2.2);
      const P = bloatRect({ x: 3.0, y: 5.0, w: 18.0, h: 14.0, r: cr, b });
      const midTop = `M12.0 ${f(edgeY(P.poly, 12, 'top'))}V9.0`;
      const midBot = `M12.0 15.0V${f(edgeY(P.poly, 12, 'bottom'))}`;
      const cCirc = circleD(12.0, 12.0, 3.0);
      // Solid: 2 separate padded pitch halves (Left Half x=3.0..11.0, Right Half x=13.0..21.0 — 2.0px gap!) + circular center cutout!
      const leftPitch = bloatRect({ x: 3.0, y: 5.0, w: 8.0, h: 14.0, r: [cr, 0.8, 0.8, cr], b: b * 0.45 });
      const rightPitch = bloatRect({ x: 13.0, y: 5.0, w: 8.0, h: 14.0, r: [0.8, cr, cr, 0.8], b: b * 0.45 });
      return {
        keylines: drawKeylines([[12, 12, 3.0]], P.anchors),
        line: `<path d="${P.d}"/><path d="${midTop}"/><path d="${midBot}"/><path d="${cCirc}"/>`,
        solid: {
          face: [leftPitch.d, rightPitch.d],
          holeExact: [circleD(12.0, 12.0, 3.8)],
          over: [circleD(12.0, 12.0, 2.3)]
        },
        duotone: { tone: [P.d], secondary: [midTop, midBot, cCirc], line: `<path d="${P.d}"/><path d="${midTop}"/><path d="${midBot}"/><path d="${cCirc}"/>` }
      };
    }
};
