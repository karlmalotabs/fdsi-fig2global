// Surgical-precision icon module: fdsi-caret-down (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-caret-down",
  slug: "caret-down",
  name: "Caret Down (Micro 8×8 Zone)",
  area: "common",
  order: 6,
  desc: "Micro 7×3.5px inline dropdown caret (x=8.5..15.5, y=10.2..13.8). Closes into a crisp rounded triangle in Solid.",
  meta: {
      "slug": "caret-down",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Compact inline dropdown indicator for select inputs, filters, and compact menus.",
      "tags": [
          "caret",
          "down",
          "select",
          "dropdown",
          "picker",
          "menu",
          "inline"
      ],
      "status": "approved"
  },
  build: ({ b, r }) => {
      const lineC = `M8.5 10.2L12.0 13.8L15.5 10.2`;
      const tri = bloatPoly([[8.0, 9.8], [16.0, 9.8], [12.0, 14.2]], Math.min(r * 0.3, 0.6), b * 0.3, { minEdge: 3 });
      return {
        keylines: drawKeylines([[12, 12, 4.0]], [[8.5, 10.2], [12.0, 13.8], [15.5, 10.2]]),
        line: `<path d="${lineC}"/>`,
        solid: { fill: [tri.d] },
        duotone: { tone: [tri.d], line: `<path d="${lineC}"/>` }
      };
    }
};
