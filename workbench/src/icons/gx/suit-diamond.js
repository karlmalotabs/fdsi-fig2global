// Surgical-precision icon module: fdsi-suit-diamond (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-142-suit-diamond",
  slug: "suit-diamond",
  name: "#142. Diamond Suit (Concave-Curved Casino Rhombus — Companion to Spade, Club & Heart)",
  area: "gx",
  order: 175,
  desc: "Classic French playing-card Diamond suit from (12.0, 3.2) -> (19.6, 12.0) -> (12.0, 20.8) -> (4.4, 12.0) with subtle concave inward-curved edges (`edgeBulge: -0.35`).",
  meta: {
      "slug": "suit-diamond",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Diamond rhombus card suit for poker tables, card filters, and suit bets.",
      "tags": [
          "diamond",
          "rhombus",
          "suit",
          "cards",
          "poker",
          "red",
          "casino"
      ]
  },
  build: ({ r }) => {
      const cr = Math.min(r * 0.35, 0.7);
      const D = bloatPoly([[12.0, 3.2], [19.6, 12.0], [12.0, 20.8], [4.4, 12.0]], cr, 0.35, {
        inset: 0,
        minEdge: 2.0,
        edgeBulge: [-1, -1, -1, -1]
      });
      return {
        keylines: drawKeylines([], [[12, 3.2], [19.6, 12], [12, 20.8], [4.4, 12]]),
        line: `<path d="${D.d}"/>`,
        solid: { fill: [D.d] },
        duotone: { tone: [D.d], line: `<path d="${D.d}"/>` }
      };
    }
};
