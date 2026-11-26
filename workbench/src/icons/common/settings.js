// Surgical-precision icon module: fdsi-settings (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { polar, circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-settings-gear",
  slug: "settings",
  name: "Settings Gear (8-Lobed Concave-Bloat Contour + r=3.2 Core)",
  area: "common",
  order: 18,
  desc: "8-vertex regular polygon with inward concave valley bloat + r=3.2 center bearing ring (punched as a hole in Solid).",
  meta: {
      "slug": "settings",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Open account preferences, odds format configuration, or application settings.",
      "tags": [
          "settings",
          "gear",
          "cog",
          "preferences",
          "options",
          "configuration",
          "system"
      ],
      "status": "todo"
  },
  build: ({ r }) => {
      const raw = Array.from({ length: 8 }, (_, i) => polar(12, 12, 8.8, -22.5 + i * 45));
      const G = bloatPoly(raw, Math.min(r, 1.9), -0.32, { minEdge: 2.5, inset: -0.25 });
      const core = circleD(12, 12, 3.1);
      return {
        keylines: drawKeylines([[12, 12, 8.8], [12, 12, 3.1]], G.anchors),
        line: `<path d="${G.d}"/><path d="${core}"/>`,
        solid: { fill: [G.d], holeExact: [circleD(12, 12, 3.5)] },
        duotone: { tone: [G.d], secondary: [core], line: `<path d="${G.d}"/><path d="${core}"/>` }
      };
    }
};
