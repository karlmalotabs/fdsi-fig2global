// Surgical-precision icon module: fdsi-gold-bullion (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-144-gold-ingot",
  slug: "gold-bullion",
  name: "#144. Gold Bullion Stack (3 Separate Padded Trapezoidal Gold Ingots in 1-on-2 Pyramid!)",
  area: "payments",
  order: 177,
  desc: "FIXED BULLION SILHOUETTE: Replaced the single trapezoid + rays (which looked like a lamp) with a classic Fort Knox 1-on-2 pyramid stack of 3 beveled trapezoidal gold bullion bars!",
  meta: {
      "slug": "gold-bullion",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "High-value treasury reserve, VIP bankroll, or jackpot bullion tier.",
      "tags": [
          "gold",
          "bullion",
          "ingot",
          "bars",
          "treasury",
          "wealth",
          "vip",
          "reserve"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      // Top-center gold ingot (y=6.2..12.0):
      const topM = bloatPoly([[8.8, 6.2], [15.2, 6.2], [16.8, 12.0], [7.2, 12.0]], cr, b * 0.3, { minEdge: 1.8 });
      // Bottom-left gold ingot (y=13.8..19.6):
      const botL = bloatPoly([[4.0, 13.8], [10.0, 13.8], [11.4, 19.6], [2.6, 19.6]], cr, b * 0.3, { minEdge: 1.8 });
      // Bottom-right gold ingot (y=13.8..19.6):
      const botR = bloatPoly([[14.0, 13.8], [20.0, 13.8], [21.4, 19.6], [12.6, 19.6]], cr, b * 0.3, { minEdge: 1.8 });
      return {
        keylines: drawKeylines([], [...topM.anchors, ...botL.anchors, ...botR.anchors]),
        line: `<path d="${topM.d}"/><path d="${botL.d}"/><path d="${botR.d}"/>`,
        solid: {
          // 3 separate, self-contained rounded trapezoidal gold ingots!
          face: [topM.d, botL.d, botR.d]
        },
        duotone: {
          tone: [botL.d, botR.d],
          secondary: [topM.d],
          line: `<path d="${topM.d}"/><path d="${botL.d}"/><path d="${botR.d}"/>`
        }
      };
    }
};
