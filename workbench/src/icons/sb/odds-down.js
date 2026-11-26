// Surgical-precision icon module: fdsi-odds-down (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-54-odds-down",
  slug: "odds-down",
  name: "#54. Price / Odds Shortening Down (2 Separate Padded Shapes — Top Bar + Equilateral Down Triangle)",
  area: "sb",
  order: 87,
  desc: "Companion to Odds Up: Separate top horizontal indicator bar (y=5.0) + bold bloated downward indicator triangle (y=9.6..19.8). Solid: 2 separate padded shapes!",
  meta: {
      "slug": "odds-down",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Odds shortening / dropping downward indicator on live price updates.",
      "tags": [
          "odds-down",
          "shortening",
          "lower",
          "decrease",
          "triangle",
          "down",
          "price-change"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.1);
      const barLine = `M5.2 5.0H18.8`;
      const barSolid = bloatRect({ x: 4.8, y: 3.6, w: 14.4, h: 3.0, r: 1.1, b: b * 0.25 });
      const tri = bloatPoly([[4.4, 9.6], [19.6, 9.6], [12.0, 19.8]], cr, b * 0.4, { minEdge: 3.0 });
      return {
        keylines: drawKeylines([], [...tri.anchors, [5.2, 5.0], [18.8, 5.0]]),
        line: `<path d="${barLine}"/><path d="${tri.d}"/>`,
        solid: { face: [barSolid.d, tri.d] },
        duotone: { tone: [tri.d], secondary: [barLine], line: `<path d="${barLine}"/><path d="${tri.d}"/>` }
      };
    }
};
