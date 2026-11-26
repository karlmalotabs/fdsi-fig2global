// Surgical-precision icon module: fdsi-chevron-up (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-82-chevron-up",
  slug: "chevron-up",
  name: "#82. Chevron Up (Compact 12×12 Zone — Matches Chevron Down)",
  area: "common",
  order: 115,
  desc: "Compact 10×5px upward chevron centered at (12, 12) (M7.0 14.5 L12.0 9.5 L17.0 14.5) with soft corner fillet.",
  meta: {
      "slug": "chevron-up",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Collapse an open accordion section, fold content, or scroll to top.",
      "tags": [
          "chevron",
          "up",
          "collapse",
          "fold",
          "less",
          "top",
          "accordion"
      ]
  },
  build: ({ r }) => {
      const ch = roundOpen([[7.0, 14.5], [12.0, 9.5], [17.0, 14.5]], Math.min(r * 0.35, 0.7));
      return {
        keylines: drawKeylines([[12, 12, 6.0]], [[7.0, 14.5], [12.0, 9.5], [17.0, 14.5]]),
        line: `<path d="${ch}"/>`,
        solid: { stroke: [ch] },
        duotone: { secondary: [ch], line: `<path d="${ch}"/>` }
      };
    }
};
