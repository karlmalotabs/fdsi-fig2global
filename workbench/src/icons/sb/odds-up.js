// Surgical-precision icon module: fdsi-odds-up (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-53-odds-up",
  slug: "odds-up",
  name: "#53. Price / Odds Drifting Up (2 Separate Padded Shapes — Equilateral Up Triangle + Base Bar)",
  area: "sb",
  order: 86,
  desc: "Bold bloated upward indicator triangle (apex at (12.0, 4.2), base at y=14.4) + separate horizontal indicator bar below (y=18.8). Solid: 2 separate padded shapes!",
  meta: {
      "slug": "odds-up",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Odds lengthening / drifting upward indicator on live price updates.",
      "tags": [
          "odds-up",
          "drifting",
          "higher",
          "increase",
          "triangle",
          "up",
          "price-change"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.1);
      const tri = bloatPoly([[12.0, 4.2], [19.6, 14.4], [4.4, 14.4]], cr, b * 0.4, { minEdge: 3.0 });
      const barLine = `M5.2 19.0H18.8`;
      const barSolid = bloatRect({ x: 4.8, y: 17.4, w: 14.4, h: 3.0, r: 1.1, b: b * 0.25 });
      return {
        keylines: drawKeylines([], [...tri.anchors, [5.2, 19.0], [18.8, 19.0]]),
        line: `<path d="${tri.d}"/><path d="${barLine}"/>`,
        solid: { face: [tri.d, barSolid.d] },
        duotone: { tone: [tri.d], secondary: [barLine], line: `<path d="${tri.d}"/><path d="${barLine}"/>` }
      };
    }
};
