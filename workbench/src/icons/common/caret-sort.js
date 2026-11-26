// Surgical-precision icon module: fdsi-caret-sort (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-caret-sort",
  slug: "caret-sort",
  name: "Caret Sort Up/Down (Compact Selector)",
  area: "common",
  order: 8,
  desc: "Compact stacked micro carets (x=8.8..15.2, y=6.2..9.5 and y=14.5..17.8) for table headers and select inputs.",
  meta: {
      "slug": "caret-sort",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Bidirectional sort indicator for sortable table columns and list headers.",
      "tags": [
          "caret",
          "sort",
          "order",
          "table",
          "column",
          "ascending",
          "descending",
          "filter"
      ],
      "status": "approved"
  },
  build: ({ b, r }) => {
      const up = `M8.8 9.5L12.0 6.2L15.2 9.5`;
      const dn = `M8.8 14.5L12.0 17.8L15.2 14.5`;
      const tUp = bloatPoly([[8.5, 9.8], [12.0, 6.0], [15.5, 9.8]], Math.min(r * 0.25, 0.5), b * 0.2, { minEdge: 3 });
      const tDn = bloatPoly([[8.5, 14.2], [15.5, 14.2], [12.0, 18.0]], Math.min(r * 0.25, 0.5), b * 0.2, { minEdge: 3 });
      return {
        keylines: drawKeylines([[12, 12, 6.0]], [[12, 6.2], [12, 17.8], [8.8, 9.5], [15.2, 9.5]]),
        line: `<path d="${up}"/><path d="${dn}"/>`,
        solid: { face: [tUp.d, tDn.d] },
        duotone: { tone: [tDn.d], secondary: [dn], line: `<path d="${up}"/>` }
      };
    }
};
