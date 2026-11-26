// Surgical-precision icon module: fdsi-lacrosse-stick (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatPoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b2-109-lacrosse-stick",
  slug: "lacrosse-stick",
  name: "#109. Lacrosse Crosse & Ball (45° V-Head Pocket + Diamond Net + Ball)",
  area: "sb",
  order: 142,
  desc: "45° angled lacrosse crosse head (from throat (10.4, 13.6) flaring to top-right scoop (15.4, 3.6)–(20.4, 8.6)) with cross-pocket mesh + handle to (3.8, 20.2) + ball at (6.6, 7.2).",
  meta: {
      "slug": "lacrosse-stick",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "PLL, NLL, and NCAA lacrosse stick and ball match markets.",
      "tags": [
          "lacrosse",
          "crosse",
          "stick",
          "pocket",
          "net",
          "ball",
          "pll"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const headPts = [[10.4, 13.6], [14.6, 3.6], [20.4, 9.4], [10.4, 13.6]];
      const head = bloatPoly([[10.2, 13.8], [14.4, 3.6], [20.4, 9.6]], [0.6, cr, cr], b * 0.35, { minEdge: 2.5 });
      const innerPocket = bloatPoly([[12.2, 11.8], [15.0, 5.8], [18.2, 9.0]], 0.4, b * 0.2, { minEdge: 1.5 });
      const mesh = `M12.6 8.2L15.8 11.4M14.4 6.2L17.8 9.6`;
      const shaft = `M10.2 13.8L3.8 20.2`;
      const ball = circleD(6.6, 7.2, 2.1);
      const ballSolid = circleD(6.6, 7.2, 2.4);
      const uidLc = "lc6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidLc}"><path d="${head.d}"/></clipPath></defs>` +
                    `<path d="${head.d}"/><g clip-path="url(#${uidLc})"><path d="${mesh}"/></g><path d="${shaft}"/><path d="${ball}"/>`;
      return {
        keylines: drawKeylines([[6.6, 7.2, 2.1]], [...head.anchors, [3.8, 20.2]]),
        line: lineM,
        solid: {
          fill: [head.d],
          holeExact: [innerPocket.d],
          face: [ballSolid],
          stroke: [shaft, mesh]
        },
        duotone: { tone: [head.d, ball], secondary: [mesh, shaft], line: lineM }
      };
    }
};
