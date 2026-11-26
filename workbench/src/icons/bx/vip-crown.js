// Surgical-precision icon module: fdsi-vip-crown (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "royal-crown",
  slug: "vip-crown",
  name: "Royal VIP Crown (2 Independent Rounded Solid Shapes — Crown & Base)",
  area: "bx",
  order: 217,
  desc: "FIXED SOLID (Zero Knocked-Out Lines!): Solid is built from 2 separate, self-contained rounded shapes (Upper 3-Peak Crown + Lower Headband Plinth) with a 1.7px padding gap!",
  meta: {
      "slug": "vip-crown",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "VIP loyalty club, royal tier status, and exclusive high-roller rewards.",
      "tags": [
          "crown",
          "vip",
          "royal",
          "loyalty",
          "king",
          "tier",
          "exclusive",
          "premium"
      ]
  },
  build: ({ b, r, s }) => {
      const pts = [[3, 7], [7.5, 11.8], [12, 5], [16.5, 11.8], [21, 7], [19, 19.5], [5, 19.5]];
      const cr = Math.min(r * 0.35, 0.8);
      const K = bloatPoly(pts, [cr, cr, cr, cr, cr, Math.min(r, 1.8), Math.min(r, 1.8)], b, { minEdge: 4, edgeBulge: [0, 0, 0, 0, 1, 1, 1] });
      const band = spanLine(K, 15.8, b * 0.7);

      // SOLID MODE: 2 Separate, Self-Contained Rounded Shapes with 1.7px Padding Between Them!
      // Shape 1: Upper 3-Peak Crown stopping at y = 14.8 (with rounded bottom-left and bottom-right corners!)
      const upperCrown = bloatPoly(
        [[2.6, 6.6], [7.5, 11.5], [12, 4.5], [16.5, 11.5], [21.4, 6.6], [19.8, 14.8], [4.2, 14.8]],
        [0.7, 0.7, 0.7, 0.7, 0.7, 1.4, 1.4],
        b * 0.8,
        { minEdge: 4, edgeBulge: [0, 0, 0, 0, 1, 0.4, 1] }
      );
      // Shape 2: Lower Headband Plinth from y = 16.6 to y = 20.4 (1.8px below upperCrown!)
      const lowerBase = bloatRect({ x: 4.4, y: 16.6, w: 15.2, h: 3.8, r: 1.5, b: b * 0.5 });

      return {
        keylines: drawKeylines([], K.anchors),
        line: `<path d="${K.d}"/><path d="${band}"/>`,
        solid: {
          // 2 distinct rounded solid shapes — ZERO mask cut lines!
          face: [upperCrown.d, lowerBase.d]
        },
        duotone: { tone: [K.d], secondary: [band], line: `<path d="${K.d}"/>` }
      };
    }
};
