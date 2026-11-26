// Surgical-precision icon module: fdsi-rg-session-timer (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-80-tournament-hourglass",
  slug: "rg-session-timer",
  name: "#80. Casino Tournament Timer (4 Separate Padded Shapes — Top Cap + 2 Glass Bulbs + Bottom Cap)",
  area: "bx",
  order: 113,
  desc: "Companion to #18 RG Hourglass: 2 thick bloated wooden frame bars (y=3.0..5.6 & y=18.4..21.0) + 2 separate padded triangular glass bulbs (`topBulb`, `botBulb`).",
  meta: {
      "slug": "rg-session-timer",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Responsible Gaming session reality-check reminder and play duration tracker.",
      "tags": [
          "responsible-gaming",
          "rg",
          "session",
          "timer",
          "hourglass",
          "reality-check",
          "duration"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      const topCap = bloatRect({ x: 4.4, y: 3.0,  w: 15.2, h: 2.6, r: 0.85, b: b * 0.2 });
      const botCap = bloatRect({ x: 4.4, y: 18.4, w: 15.2, h: 2.6, r: 0.85, b: b * 0.2 });
      const topBulbLine = bloatPoly([[6.4, 5.6], [17.6, 5.6], [12.0, 11.6]], [0.4, 0.4, cr], b * 0.3, { minEdge: 2.0 });
      const botBulbLine = bloatPoly([[12.0, 12.4], [17.6, 18.4], [6.4, 18.4]], [cr, 0.4, 0.4], b * 0.3, { minEdge: 2.0 });
      // Solid: 4 Separate Padded Shapes (Top Bar + Upper Bulb + Lower Bulb + Bottom Bar)!
      const topBulbSolid = bloatPoly([[6.8, 6.8], [17.2, 6.8], [12.0, 11.5]], [0.65, 0.65, cr], b * 0.3, { minEdge: 2.0 });
      const botBulbSolid = bloatPoly([[12.0, 12.5], [17.2, 17.2], [6.8, 17.2]], [cr, 0.65, 0.65], b * 0.3, { minEdge: 2.0 });
      return {
        keylines: drawKeylines([], [...topCap.anchors, ...botCap.anchors, [12, 12]]),
        line: `<path d="${topBulbLine.d}"/><path d="${botBulbLine.d}"/><path d="${topCap.d}"/><path d="${botCap.d}"/>`,
        solid: {
          face: [topCap.d, topBulbSolid.d, botBulbSolid.d, botCap.d]
        },
        duotone: {
          tone: [topBulbLine.d, botBulbLine.d],
          secondary: [topCap.d, botCap.d],
          line: `<path d="${topBulbLine.d}"/><path d="${botBulbLine.d}"/><path d="${topCap.d}"/><path d="${botCap.d}"/>`
        }
      };
    }
};
