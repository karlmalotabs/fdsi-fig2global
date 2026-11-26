// Surgical-precision icon module: fdsi-odds-boost (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-odds-boost",
  slug: "odds-boost",
  name: "Odds Boost (Thick 45° Diagonal Arrow + 2 Bold Separate Padded Trail Bars Behind)",
  area: "sb",
  order: 25,
  desc: "3 separate padded shapes in Solid: Thick 45° diagonal arrow polygon pointing to (20.4, 3.6) + 2 bold 45° rounded capsule trail bars behind the tail (zero thin hairlines!).",
  meta: {
      "slug": "odds-boost",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Enhanced odds price boost with higher payout on selected markets.",
      "tags": [
          "odds-boost",
          "price-boost",
          "enhanced",
          "arrow",
          "rocket",
          "super-boost",
          "value"
      ]
  },
  build: ({ b, r }) => {
      // Bold 45° diagonal arrow polygon (tip at (20.4, 3.6), shaft base centered at (10.2, 13.8)):
      const arrowPts = [
        [20.4, 3.6],   // Tip
        [19.0, 12.2],  // Right wing tip
        [16.8, 10.0],  // Right inner neck
        [11.8, 15.0],  // Right shaft base
        [8.8, 12.0],   // Left shaft base
        [13.8, 7.0],   // Left inner neck
        [11.6, 4.8]    // Left wing tip
      ];
      const cr = Math.min(r * 0.38, 0.75);
      const A = bloatPoly(arrowPts, [cr, cr, 0.35, cr, cr, 0.35, cr], b * 0.4, { minEdge: 2.2 });
      // 2 bold 45° diagonal trail bars behind the shaft base (well separated by 3.2px):
      // Trail 1 (upper-left): (3.6, 14.8) -> (6.8, 11.6)
      // Trail 2 (lower-right): (9.2, 20.4) -> (12.4, 17.2)
      // Plus center tail boost bar in Line:
      const trailLines = `M3.8 14.6L7.0 11.4M9.4 20.2L12.6 17.0`;
      const trailCap1 = capsule(3.8, 14.6, 7.0, 11.4, 1.25);
      const trailCap2 = capsule(9.4, 20.2, 12.6, 17.0, 1.25);
      return {
        keylines: drawKeylines([], [[20.4, 3.6], [19.0, 12.2], [11.6, 4.8], [3.8, 14.6], [9.4, 20.2]]),
        line: `<path d="${A.d}"/><path d="${trailLines}"/>`,
        solid: {
          // 3 distinct, self-contained padded solid shapes!
          face: [A.d, trailCap1, trailCap2]
        },
        duotone: { tone: [A.d], secondary: [trailLines], line: `<path d="${A.d}"/><path d="${trailLines}"/>` }
      };
    }
};
