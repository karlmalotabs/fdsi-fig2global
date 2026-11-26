// Surgical-precision icon module: fdsi-bank-transfer (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-06-bank-building",
  slug: "bank-transfer",
  name: "#6. Bank / Wire Transfer (5 Separate Padded Shapes — Roof Pediment + 3 Pillars + Plinth)",
  area: "payments",
  order: 39,
  desc: "Classical bank facade: Bloated triangular pediment roof (y=3.0..8.8) + 3 vertical columns (x=5.6, 12.0, 18.4) + base plinth bar (y=17.4..20.6). Solid: 5 separate padded shapes!",
  meta: {
      "slug": "bank-transfer",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Direct bank wire, Open Banking, or instant ACH/SEPA bank transfer.",
      "tags": [
          "bank",
          "wire",
          "transfer",
          "sepa",
          "ach",
          "building",
          "institution",
          "iban"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      const roof = bloatPoly([[12.0, 3.0], [21.0, 8.6], [3.0, 8.6]], [cr, 0.7, 0.7], b * 0.35, { minEdge: 3.0 });
      const base = bloatRect({ x: 3.2, y: 17.4, w: 17.6, h: 3.2, r: 0.9, b: b * 0.3 });
      const colsLine = `M6.5 8.8V17.2M12.0 8.8V17.2M17.5 8.8V17.2`;
      // Solid: 3 separate padded pillar rectangles between y=10.2 and y=16.0 (1.4px clear of roof and base!)
      const col1 = bloatRect({ x: 5.2, y: 10.2, w: 2.8, h: 5.8, r: 0.75, b: 0.15 });
      const col2 = bloatRect({ x: 10.6, y: 10.2, w: 2.8, h: 5.8, r: 0.75, b: 0.15 });
      const col3 = bloatRect({ x: 16.0, y: 10.2, w: 2.8, h: 5.8, r: 0.75, b: 0.15 });
      return {
        keylines: drawKeylines([], [...roof.anchors, ...base.anchors]),
        line: `<path d="${roof.d}"/><path d="${base.d}"/><path d="${colsLine}"/>`,
        solid: { face: [roof.d, col1.d, col2.d, col3.d, base.d] },
        duotone: { tone: [roof.d, base.d], secondary: [colsLine], line: `<path d="${roof.d}"/><path d="${base.d}"/><path d="${colsLine}"/>` }
      };
    }
};
