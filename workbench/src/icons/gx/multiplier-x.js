// Surgical-precision icon module: fdsi-multiplier-x (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { polar, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-79-multiplier-x-badge",
  slug: "multiplier-x",
  name: "#79. Crash / Slot Multiplier Badge (Bloated Octagonal Shield + Bold 'X' Cross)",
  area: "gx",
  order: 112,
  desc: "Regular 8-sided bloated multiplier shield (R=9.4 rotated 22.5°) + centered 'X' multiplier mark (M8.8 8.8 L15.2 15.2 M15.2 8.8 L8.8 15.2). Solid: filled shield with 'X' cut!",
  meta: {
      "slug": "multiplier-x",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Win multiplier badges (2x–10,000x) in tumbling slots and crash games.",
      "tags": [
          "multiplier",
          "x",
          "win",
          "boost",
          "tumbling",
          "slots",
          "crash"
      ]
  },
  build: ({ b, r }) => {
      const octPts = Array.from({ length: 8 }, (_, i) => polar(12.0, 12.0, 9.4, 22.5 + i * 45));
      const oct = bloatPoly(octPts, Math.min(r * 0.45, 1.0), b * 0.35, { minEdge: 2.5 });
      const xMark = `M9.0 9.0L15.0 15.0M15.0 9.0L9.0 15.0`;
      return {
        keylines: drawKeylines([[12, 12, 9.4]], [[9, 9], [15, 15], [15, 9], [9, 15]]),
        line: `<path d="${oct.d}"/><path d="${xMark}"/>`,
        solid: { fill: [oct.d], cut: [xMark] },
        duotone: { tone: [oct.d], secondary: [xMark], line: `<path d="${oct.d}"/><path d="${xMark}"/>` }
      };
    }
};
