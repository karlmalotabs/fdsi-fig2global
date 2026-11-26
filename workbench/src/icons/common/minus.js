// Surgical-precision icon module: fdsi-minus (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-86-minus-remove",
  slug: "minus",
  name: "#86. Minus / Collapse (Compact 12×12 Zone Horizontal Bar)",
  area: "common",
  order: 119,
  desc: "Horizontal 11px minus bar centered at (12, 12) (M6.5 12.0 H17.5).",
  meta: {
      "slug": "minus",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Decrease stake amount, remove item, or collapse section.",
      "tags": [
          "minus",
          "subtract",
          "decrease",
          "decrement",
          "remove",
          "collapse"
      ]
  },
  build: () => {
      const minus = `M6.5 12.0H17.5`;
      return {
        keylines: drawKeylines([[12, 12, 5.5]], [[6.5, 12], [17.5, 12]]),
        line: `<path d="${minus}"/>`,
        solid: { stroke: [minus] },
        duotone: { secondary: [minus], line: `<path d="${minus}"/>` }
      };
    }
};
