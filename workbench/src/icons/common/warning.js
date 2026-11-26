// Surgical-precision icon module: fdsi-warning (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-89-warning-triangle",
  slug: "warning",
  name: "#89. Warning / Alert Triangle (Bloated Equilateral Hazard Triangle + Exclamation Cut)",
  area: "common",
  order: 122,
  desc: "Bloated equilateral triangle (apex at (12.0, 3.6), base at (3.0, 19.6)–(21.0, 19.6)) + vertical exclamation bar & bottom dot.",
  meta: {
      "slug": "warning",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Alert the user to suspended markets, stake limits, or important notices.",
      "tags": [
          "warning",
          "alert",
          "caution",
          "error",
          "danger",
          "exclamation",
          "notice",
          "limit"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.65, 1.6);
      const tri = bloatPoly([[12.0, 3.6], [21.0, 19.6], [3.0, 19.6]], cr, b * 0.45, { minEdge: 3.5 });
      const bar = `M12.0 9.6V13.8`;
      const dot = circleD(12.0, 16.8, 1.0);
      const barHole = capsule(12.0, 9.4, 12.0, 13.8, 0.95);
      const dotHole = circleD(12.0, 16.8, 1.2);
      return {
        keylines: drawKeylines([[12, 16.8, 1.0]], tri.anchors),
        line: `<path d="${tri.d}"/><path d="${bar}"/><path d="${dot}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [tri.d], holeExact: [barHole, dotHole] },
        duotone: { tone: [tri.d], secondary: [bar], line: `<path d="${tri.d}"/><path d="${bar}"/><path d="${dot}" fill="currentColor" stroke="none"/>` }
      };
    }
};
