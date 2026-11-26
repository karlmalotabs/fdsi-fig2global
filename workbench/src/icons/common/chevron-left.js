// Surgical-precision icon module: fdsi-chevron-left (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-81-chevron-left",
  slug: "chevron-left",
  name: "#81. Chevron Left (Compact 12×12 Zone — Matches Chevron Right/Down)",
  area: "common",
  order: 114,
  desc: "Compact 5×10px directional chevron centered at (12, 12) (M14.5 7.0 L9.5 12.0 L14.5 17.0) with soft corner fillet.",
  meta: {
      "slug": "chevron-left",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Navigate back to the previous screen, step, or carousel item.",
      "tags": [
          "chevron",
          "left",
          "back",
          "previous",
          "return",
          "arrow",
          "navigate"
      ]
  },
  build: ({ r }) => {
      const ch = roundOpen([[14.5, 7.0], [9.5, 12.0], [14.5, 17.0]], Math.min(r * 0.35, 0.7));
      return {
        keylines: drawKeylines([[12, 12, 6.0]], [[14.5, 7.0], [9.5, 12.0], [14.5, 17.0]]),
        line: `<path d="${ch}"/>`,
        solid: { stroke: [ch] },
        duotone: { secondary: [ch], line: `<path d="${ch}"/>` }
      };
    }
};
