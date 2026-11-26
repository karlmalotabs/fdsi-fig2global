// Surgical-precision icon module: fdsi-caret-up (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-83-caret-up",
  slug: "caret-up",
  name: "#83. Caret Up (Micro 8×8 Zone — Closes Into Rounded Triangle in Solid)",
  area: "common",
  order: 116,
  desc: "Micro 7×3.6px inline caret (x=8.5..15.5, y=10.2..13.8). Closes into a crisp rounded triangle in Solid (matching Caret Down/Right).",
  meta: {
      "slug": "caret-up",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Compact inline upward indicator for ascending sort or open select menus.",
      "tags": [
          "caret",
          "up",
          "ascending",
          "sort",
          "select",
          "close",
          "inline"
      ]
  },
  build: ({ b, r }) => {
      const lineC = `M8.5 13.8L12.0 10.2L15.5 13.8`;
      const tri = bloatPoly([[8.0, 14.2], [12.0, 9.8], [16.0, 14.2]], Math.min(r * 0.3, 0.6), b * 0.3, { minEdge: 3 });
      return {
        keylines: drawKeylines([[12, 12, 4.0]], [[8.5, 13.8], [12.0, 10.2], [15.5, 13.8]]),
        line: `<path d="${lineC}"/>`,
        solid: { fill: [tri.d] },
        duotone: { tone: [tri.d], line: `<path d="${lineC}"/>` }
      };
    }
};
