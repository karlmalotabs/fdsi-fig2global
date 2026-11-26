// Surgical-precision icon module: fdsi-chevron-right (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-chevron-right",
  slug: "chevron-right",
  name: "Chevron Right (Compact 12×12 Zone)",
  area: "common",
  order: 3,
  desc: "Scaled to the 12×12 optical glyph zone (x=9.5..14.5, y=7..17 — 5×10px footprint so it never overpowers 20×20 objects).",
  meta: {
      "slug": "chevron-right",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Navigate forward, drill down into a sub-menu, or advance to the next item.",
      "tags": [
          "chevron",
          "right",
          "next",
          "forward",
          "arrow",
          "navigate",
          "drilldown",
          "breadcrumb"
      ]
  },
  build: ({ s }) => {
      const ch = `M9.5 7.0L14.5 12.0L9.5 17.0`;
      return {
        keylines: drawKeylines([[12, 12, 5.5]], [[9.5, 7.0], [14.5, 12.0], [9.5, 17.0]]),
        line: `<path d="${ch}"/>`,
        solid: { tubes: [[ch, s + 0.55]] },
        duotone: { tone: [`M9.5 7.0L14.5 12.0L9.5 17.0Z`], line: `<path d="${ch}"/>` }
      };
    }
};
