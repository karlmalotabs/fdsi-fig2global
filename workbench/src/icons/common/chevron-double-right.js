// Surgical-precision icon module: fdsi-chevron-double-right (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-chevron-double",
  slug: "chevron-double-right",
  name: "Double Chevrons (Compact 12×12 Zone)",
  area: "common",
  order: 5,
  desc: "Twin compact 4.5×9px chevrons (x=6.8..11.3 and x=12.2..16.7, y=7.5..16.5) with 5.4px parallel spacing.",
  meta: {
      "slug": "chevron-double-right",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Fast-forward, skip to last page, or collapse/expand a side navigation panel.",
      "tags": [
          "chevron",
          "double",
          "fast-forward",
          "skip",
          "last",
          "sidebar",
          "collapse"
      ],
      "status": "approved"
  },
  build: ({ s }) => {
      const c1 = `M6.8 7.5L11.3 12.0L6.8 16.5`;
      const c2 = `M12.2 7.5L16.7 12.0L12.2 16.5`;
      return {
        keylines: drawKeylines([[12, 12, 6.0]], [[6.8, 7.5], [11.3, 12.0], [12.2, 7.5], [16.7, 12.0]]),
        line: `<path d="${c1}"/><path d="${c2}"/>`,
        solid: { tubes: [[c1, s + 0.4], [c2, s + 0.4]] },
        duotone: { secondary: [c1], line: `<path d="${c2}"/>` }
      };
    }
};
