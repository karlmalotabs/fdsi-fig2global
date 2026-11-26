// Surgical-precision icon module: fdsi-info (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-88-info-circle",
  slug: "info",
  name: "#88. Info Circle (Exact R=9.0 Circle + Vertical 'i' Stem & Top Dot)",
  area: "common",
  order: 121,
  desc: "Outer circle (cx=12, cy=12, R=9.0) + vertical 'i' stem (M12.0 11.4 V16.8) + top dot at (12.0, 7.8, r=1.05). Solid: filled disc with capsule stem & dot cutouts!",
  meta: {
      "slug": "info",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Display market rules, bet settlement terms, or contextual tooltip information.",
      "tags": [
          "info",
          "information",
          "details",
          "rules",
          "tooltip",
          "about",
          "help"
      ]
  },
  build: () => {
      const outer = circleD(12.0, 12.0, 9.0);
      const outerSolid = circleD(12.0, 12.0, 9.2);
      const stem = `M12.0 11.4V16.8`;
      const dot = circleD(12.0, 7.8, 1.05);
      const stemHole = capsule(12.0, 11.4, 12.0, 16.8, 0.95);
      const dotHole = circleD(12.0, 7.8, 1.25);
      return {
        keylines: drawKeylines([[12, 12, 9.0], [12, 7.8, 1.05]], [[12, 11.4], [12, 16.8], [12, 7.8]]),
        line: `<path d="${outer}"/><path d="${stem}"/><path d="${dot}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [outerSolid], holeExact: [stemHole, dotHole] },
        duotone: { tone: [outer], secondary: [stem], line: `<path d="${outer}"/><path d="${stem}"/><path d="${dot}" fill="currentColor" stroke="none"/>` }
      };
    }
};
