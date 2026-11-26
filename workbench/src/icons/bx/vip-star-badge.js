// Surgical-precision icon module: fdsi-vip-star-badge (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { polar, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-74-vip-star-rosette",
  slug: "vip-star-badge",
  name: "#74. VIP Loyalty Tier Badge (8-Point Bloated Rosette + Filled 5-Point Star Window)",
  area: "bx",
  order: 107,
  desc: "8-point bloated starburst rosette (R_out=9.4, R_in=7.4) + centered 5-point VIP star inside (filled in Line, crisp negative-space cutout in Solid!).",
  meta: {
      "slug": "vip-star-badge",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Loyalty level-up badge, achievement rosette, and featured reward.",
      "tags": [
          "vip",
          "star",
          "rosette",
          "badge",
          "loyalty",
          "achievement",
          "reward",
          "level"
      ]
  },
  build: () => {
      const rosPts = Array.from({ length: 16 }, (_, i) => polar(12.0, 12.0, i % 2 === 0 ? 9.4 : 7.4, -90 + i * 22.5));
      const rosette = bloatPoly(rosPts, 0.55, 0, { minEdge: 99 });
      const starPts = Array.from({ length: 10 }, (_, i) => polar(12.0, 12.2, i % 2 === 0 ? 4.4 : 1.95, -90 + i * 36));
      const star = bloatPoly(starPts, 0.25, 0, { minEdge: 99 });
      return {
        keylines: drawKeylines([[12, 12, 9.4], [12, 12, 7.4], [12, 12.2, 4.4]], [[12, 12]]),
        line: `<path d="${rosette.d}"/><path d="${star.d}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [rosette.d],
          holeExact: [star.d]
        },
        duotone: { tone: [rosette.d], line: `<path d="${rosette.d}"/><path d="${star.d}" fill="currentColor" stroke="none"/>` }
      };
    }
};
