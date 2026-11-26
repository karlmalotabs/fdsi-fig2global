// Surgical-precision icon module: fdsi-podium-ranks (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-57-podium-ranks",
  slug: "podium-ranks",
  name: "#57. Leaderboard / Podium 1-2-3 (3 Separate Padded Stepped Podium Blocks)",
  area: "sb",
  order: 90,
  desc: "3 stepped winner podium columns: Left 2nd-Place (x=3.2..8.2, y=10.6..20.2), Center 1st-Place (x=9.5..14.5, y=5.4..20.2), Right 3rd-Place (x=15.8..20.8, y=13.6..20.2).",
  meta: {
      "slug": "podium-ranks",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "1st, 2nd, 3rd podium finish, each-way places, and tournament leaderboards.",
      "tags": [
          "podium",
          "leaderboard",
          "ranks",
          "1-2-3",
          "top-3",
          "standings",
          "places"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      // Line mode: stepped podium blocks sharing vertical walls, or 3 crisp bloated columns!
      const p1 = bloatRect({ x: 9.4,  y: 5.4,  w: 5.2, h: 14.8, r: [cr, cr, 0.8, 0.8], b: b * 0.35 });
      const p2 = bloatRect({ x: 3.0,  y: 10.4, w: 5.0, h: 9.8,  r: [cr, cr, 0.8, 0.8], b: b * 0.35 });
      const p3 = bloatRect({ x: 16.0, y: 13.4, w: 5.0, h: 6.8,  r: [cr, cr, 0.8, 0.8], b: b * 0.35 });
      return {
        keylines: drawKeylines([], [...p1.anchors, ...p2.anchors, ...p3.anchors]),
        line: `<path d="${p1.d}"/><path d="${p2.d}"/><path d="${p3.d}"/>`,
        solid: {
          // 3 separate, self-contained padded podium columns!
          face: [p2.d, p1.d, p3.d]
        },
        duotone: { tone: [p1.d], secondary: [p2.d, p3.d], line: `<path d="${p1.d}"/><path d="${p2.d}"/><path d="${p3.d}"/>` }
      };
    }
};
