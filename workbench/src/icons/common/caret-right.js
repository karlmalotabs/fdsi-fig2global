// Surgical-precision icon module: fdsi-caret-right (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-caret-right",
  slug: "caret-right",
  name: "Caret Right (Micro 8×8 Zone)",
  area: "common",
  order: 7,
  desc: "Micro 3.5×7px inline tree/menu caret (x=10.2..13.8, y=8.5..15.5). Closes into a crisp rounded triangle in Solid.",
  meta: {
      "slug": "caret-right",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Compact inline tree-view or nested menu indicator showing a collapsed branch.",
      "tags": [
          "caret",
          "right",
          "tree",
          "branch",
          "submenu",
          "expand",
          "inline"
      ],
      "status": "approved"
  },
  build: ({ b, r }) => {
      const lineC = `M10.2 8.5L13.8 12.0L10.2 15.5`;
      const tri = bloatPoly([[9.8, 8.0], [14.2, 12.0], [9.8, 16.0]], Math.min(r * 0.3, 0.6), b * 0.3, { minEdge: 3 });
      return {
        keylines: drawKeylines([[12, 12, 4.0]], [[10.2, 8.5], [13.8, 12.0], [10.2, 15.5]]),
        line: `<path d="${lineC}"/>`,
        solid: { fill: [tri.d] },
        duotone: { tone: [tri.d], line: `<path d="${lineC}"/>` }
      };
    }
};
