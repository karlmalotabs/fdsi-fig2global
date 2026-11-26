// Surgical-precision icon module: fdsi-chevron-down (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-chevron-down",
  slug: "chevron-down",
  name: "Chevron Down (Compact 12×12 Zone)",
  area: "common",
  order: 4,
  desc: "Compact 10×5px downward chevron (x=7..17, y=9.5..14.5) optically centered at (12, 12).",
  meta: {
      "slug": "chevron-down",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Expand accordion section, open dropdown menu, or reveal additional options.",
      "tags": [
          "chevron",
          "down",
          "expand",
          "open",
          "dropdown",
          "accordion",
          "more"
      ],
      "status": "approved"
  },
  build: ({ s }) => {
      const ch = `M7.0 9.5L12.0 14.5L17.0 9.5`;
      return {
        keylines: drawKeylines([[12, 12, 5.5]], [[7.0, 9.5], [12.0, 14.5], [17.0, 9.5]]),
        line: `<path d="${ch}"/>`,
        solid: { tubes: [[ch, s + 0.55]] },
        duotone: { tone: [`M7.0 9.5L12.0 14.5L17.0 9.5Z`], line: `<path d="${ch}"/>` }
      };
    }
};
