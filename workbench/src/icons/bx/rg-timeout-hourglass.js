// Surgical-precision icon module: fdsi-rg-timeout-hourglass (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-18-rg-hourglass",
  slug: "rg-timeout-hourglass",
  name: "#18. Responsible Gaming — Time-Out Hourglass (2 Separate Padded Glass Bulbs + Frame Caps)",
  area: "bx",
  order: 51,
  desc: "Top & Bottom horizontal frame caps (x=4.8..19.2) + Upper & Lower triangular glass bulbs meeting at waist (12, 12). Solid: 2 separate padded triangular bulbs + frame bars!",
  meta: {
      "slug": "rg-timeout-hourglass",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Responsible Gaming short time-out or cooling-off break timer.",
      "tags": [
          "responsible-gaming",
          "rg",
          "timeout",
          "hourglass",
          "cooling-off",
          "break",
          "timer",
          "limit"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      const topBulb = bloatPoly([[6.2, 4.2], [17.8, 4.2], [12.0, 11.4]], [0.6, 0.6, cr], b * 0.35, { minEdge: 2.5 });
      const botBulb = bloatPoly([[12.0, 12.6], [17.8, 19.8], [6.2, 19.8]], [cr, 0.6, 0.6], b * 0.35, { minEdge: 2.5 });
      const caps = `M4.6 3.8H19.4M4.6 20.2H19.4`;
      return {
        keylines: drawKeylines([], [...topBulb.anchors, ...botBulb.anchors]),
        line: `<path d="${topBulb.d}"/><path d="${botBulb.d}"/><path d="${caps}"/>`,
        solid: {
          face: [topBulb.d, botBulb.d],
          stroke: [caps]
        },
        duotone: { tone: [topBulb.d, botBulb.d], secondary: [caps], line: `<path d="${topBulb.d}"/><path d="${botBulb.d}"/><path d="${caps}"/>` }
      };
    }
};
