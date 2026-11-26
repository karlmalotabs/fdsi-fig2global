// Surgical-precision icon module: fdsi-caret-left (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-84-caret-left",
  slug: "caret-left",
  name: "#84. Caret Left (Micro 8×8 Zone — Closes Into Rounded Triangle in Solid)",
  area: "common",
  order: 117,
  desc: "Micro 3.6×7px inline tree/menu caret (x=10.2..13.8, y=8.5..15.5). Closes into a crisp rounded triangle in Solid.",
  meta: {
      "slug": "caret-left",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Compact inline leftward indicator for RTL tree branches or inline steppers.",
      "tags": [
          "caret",
          "left",
          "previous",
          "back",
          "tree",
          "stepper",
          "inline"
      ]
  },
  build: ({ b, r }) => {
      const lineC = `M13.8 8.5L10.2 12.0L13.8 15.5`;
      const tri = bloatPoly([[14.2, 8.0], [14.2, 16.0], [9.8, 12.0]], Math.min(r * 0.3, 0.6), b * 0.3, { minEdge: 3 });
      return {
        keylines: drawKeylines([[12, 12, 4.0]], [[13.8, 8.5], [10.2, 12.0], [13.8, 15.5]]),
        line: `<path d="${lineC}"/>`,
        solid: { fill: [tri.d] },
        duotone: { tone: [tri.d], line: `<path d="${lineC}"/>` }
      };
    }
};
