// Surgical-precision icon module: fdsi-flash-bet (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-129-flash-bet",
  slug: "flash-bet",
  name: "#129. Flash Bet / Next-60s Market (Bold High-Voltage Lightning Bolt + 2 Speed Trail Bars)",
  area: "sb",
  order: 162,
  desc: "Built like #5 Odds Boost: Bold bloated lightning bolt polygon (x=6.8..19.6, y=3.2..20.6) + 2 diagonal speed-trail capsules on the left!",
  meta: {
      "slug": "flash-bet",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Lightning-fast micro-markets settling in the next 60 seconds or next point.",
      "tags": [
          "flash-bet",
          "micro-betting",
          "instant",
          "lightning",
          "next-minute",
          "fast-market"
      ]
  },
  build: ({ b, r }) => {
      const boltPts = [[14.8, 3.2], [7.8, 12.6], [13.0, 12.6], [11.2, 20.6], [19.4, 11.0], [14.0, 11.0]];
      const B = bloatPoly(boltPts, Math.min(r * 0.25, 0.45), b * 0.15, { minEdge: 1.8 });
      const trailLines = `M3.4 9.6L6.0 7.0M3.4 16.6L6.4 13.6`;
      const t1 = capsule(3.4, 9.6, 6.0, 7.0, 1.05);
      const t2 = capsule(3.4, 16.6, 6.4, 13.6, 1.05);
      return {
        keylines: drawKeylines([], boltPts),
        line: `<path d="${B.d}"/><path d="${trailLines}"/>`,
        solid: { face: [B.d, t1, t2] },
        duotone: { tone: [B.d], secondary: [trailLines], line: `<path d="${B.d}"/><path d="${trailLines}"/>` }
      };
    }
};
