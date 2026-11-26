// Surgical-precision icon module: fdsi-hi-lo (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-157-hi-lo-card",
  slug: "hi-lo",
  name: "#157. Hi-Lo Arcade Card Game (3 Separate Padded Shapes — Up Triangle + Center Bar + Down Triangle)",
  area: "gx",
  order: 190,
  desc: "Built like #53/#54 Odds Up/Down: Bloated Upward 'HI' Triangle (y=3.0..9.6) + Center Card Divider Bar (y=11.0..13.0) + Bloated Downward 'LO' Triangle (y=14.4..21.0)!",
  meta: {
      "slug": "hi-lo",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Hi-Lo arcade card game predicting whether the next card is higher or lower.",
      "tags": [
          "hi-lo",
          "high-low",
          "up-down",
          "predict",
          "arcade",
          "cards"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const upTri = bloatPoly([[12.0, 3.0], [18.6, 9.6], [5.4, 9.6]], cr, b * 0.35, { minEdge: 2.5 });
      const dnTri = bloatPoly([[5.4, 14.4], [18.6, 14.4], [12.0, 21.0]], cr, b * 0.35, { minEdge: 2.5 });
      const midLine = `M4.4 12.0H19.6`;
      const midSolid = capsule(4.4, 12.0, 19.6, 12.0, 0.95);
      return {
        keylines: drawKeylines([], [...upTri.anchors, ...dnTri.anchors]),
        line: `<path d="${upTri.d}"/><path d="${midLine}"/><path d="${dnTri.d}"/>`,
        solid: { face: [upTri.d, midSolid, dnTri.d] },
        duotone: { tone: [upTri.d], secondary: [midLine, dnTri.d], line: `<path d="${upTri.d}"/><path d="${midLine}"/><path d="${dnTri.d}"/>` }
      };
    }
};
