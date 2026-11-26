// Surgical-precision icon module: fdsi-vip-diamond-crown (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-132-vip-crown-gem",
  slug: "vip-diamond-crown",
  name: "#132. VIP Diamond Crown (2 Separate Padded Crown Shapes + Center Diamond Cutout)",
  area: "bx",
  order: 165,
  desc: "Royal 3-peak crown (upper crown + separate lower plinth bar) featuring a centered diamond gem window (`diamondCut`) inside the main crown body!",
  meta: {
      "slug": "vip-diamond-crown",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Diamond VIP elite tier, personal account manager, and luxury rewards.",
      "tags": [
          "crown",
          "diamond",
          "vip",
          "elite",
          "luxury",
          "loyalty",
          "high-roller"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.8);
      const pts = [[3.0, 7.0], [7.5, 11.4], [12.0, 4.6], [16.5, 11.4], [21.0, 7.0], [19.2, 19.6], [4.8, 19.6]];
      const K = bloatPoly(pts, [cr, cr, cr, cr, cr, 1.6, 1.6], b, { minEdge: 4, edgeBulge: [0, 0, 0, 0, 1, 1, 1] });
      const band = spanLine(K, 16.0, b * 0.6);
      const gem = bloatPoly([[12.0, 9.6], [14.2, 12.0], [12.0, 14.4], [9.8, 12.0]], 0.3, 0, { minEdge: 1.5 });
      const upperCrown = bloatPoly(
        [[2.6, 6.6], [7.5, 11.2], [12.0, 4.2], [16.5, 11.2], [21.4, 6.6], [19.8, 15.0], [4.2, 15.0]],
        [0.7, 0.7, 0.7, 0.7, 0.7, 1.3, 1.3],
        b * 0.8,
        { minEdge: 4, edgeBulge: [0, 0, 0, 0, 1, 0.4, 1] }
      );
      const lowerBase = bloatRect({ x: 4.4, y: 16.8, w: 15.2, h: 3.6, r: 1.4, b: b * 0.5 });
      return {
        keylines: drawKeylines([], [...K.anchors, [12, 12]]),
        line: `<path d="${K.d}"/><path d="${band}"/><path d="${gem.d}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [upperCrown.d, lowerBase.d],
          holeExact: [gem.d]
        },
        duotone: { tone: [K.d], secondary: [band], line: `<path d="${K.d}"/><path d="${band}"/><path d="${gem.d}" fill="currentColor" stroke="none"/>` }
      };
    }
};
