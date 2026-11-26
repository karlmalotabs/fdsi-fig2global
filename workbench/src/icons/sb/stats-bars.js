// Surgical-precision icon module: fdsi-stats-bars (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-stats-bars",
  slug: "stats-bars",
  name: "Match Stats / Form Guide (3 Separate Padded Ascending Bar Columns)",
  area: "sb",
  order: 32,
  desc: "3 separate bloated vertical bar columns with 1.9px spacing between bars: Left (x=3.8..8.0), Mid (x=9.9..14.1), Right (x=16.0..20.2). Solid: 3 separate padded rounded bars.",
  meta: {
      "slug": "stats-bars",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Team form guide, head-to-head statistics, and league standings analytics.",
      "tags": [
          "stats",
          "statistics",
          "analytics",
          "chart",
          "bars",
          "form",
          "standings"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.25);
      const B1 = bloatRect({ x: 3.8, y: 13.0, w: 4.2, h: 7.2, r: cr, b: b * 0.4 });
      const B2 = bloatRect({ x: 9.9, y: 8.5, w: 4.2, h: 11.7, r: cr, b: b * 0.4 });
      const B3 = bloatRect({ x: 16.0, y: 4.0, w: 4.2, h: 16.2, r: cr, b: b * 0.4 });
      return {
        keylines: drawKeylines([], [...B1.anchors, ...B2.anchors, ...B3.anchors]),
        line: `<path d="${B1.d}"/><path d="${B2.d}"/><path d="${B3.d}"/>`,
        solid: { face: [B1.d, B2.d, B3.d] },
        duotone: { tone: [B1.d, B3.d], secondary: [B2.d], line: `<path d="${B1.d}"/><path d="${B2.d}"/><path d="${B3.d}"/>` }
      };
    }
};
