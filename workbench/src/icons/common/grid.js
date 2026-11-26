// Surgical-precision icon module: fdsi-grid (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-bento-grid",
  slug: "grid",
  name: "Bento Category Grid (4 Padded Bloated Squares)",
  area: "common",
  order: 10,
  desc: "Four synchronized 6.8×6.8 bloated squares separated by a 2.8px channel across Line, Solid, and Duotone.",
  meta: {
      "slug": "grid",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Switch to grid layout view or open the app/lobby category launcher.",
      "tags": [
          "grid",
          "bento",
          "dashboard",
          "tiles",
          "view",
          "layout",
          "categories",
          "lobby"
      ],
      "status": "approved"
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.65, 1.7), bb = b * 0.45;
      const g1 = bloatRect({ x: 3.6, y: 3.6, w: 6.8, h: 6.8, r: cr, b: bb });
      const g2 = bloatRect({ x: 13.6, y: 3.6, w: 6.8, h: 6.8, r: cr, b: bb });
      const g3 = bloatRect({ x: 3.6, y: 13.6, w: 6.8, h: 6.8, r: cr, b: bb });
      const g4 = bloatRect({ x: 13.6, y: 13.6, w: 6.8, h: 6.8, r: cr, b: bb });
      return {
        keylines: drawKeylines([], [[7, 7], [17, 7], [7, 17], [17, 17]]),
        line: `<path d="${g1.d}"/><path d="${g2.d}"/><path d="${g3.d}"/><path d="${g4.d}"/>`,
        solid: { fill: [g1.d, g2.d, g3.d, g4.d] },
        duotone: { tone: [g2.d, g3.d], secondary: [g2.d, g3.d], line: `<path d="${g1.d}"/><path d="${g4.d}"/>` }
      };
    }
};
