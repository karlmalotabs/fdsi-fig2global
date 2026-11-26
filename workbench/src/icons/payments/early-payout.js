// Surgical-precision icon module: fdsi-early-payout (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-early-payout",
  slug: "early-payout",
  name: "Early Payout / Instant Settlement (Circle + Filled Lightning Bolt in Line)",
  area: "payments",
  order: 29,
  desc: "Circular payout medallion (cx=12, cy=12, R=9.0) + crisp FILLED lightning bolt inside in Line & Duotone modes (and clean bolt window hole in Solid).",
  meta: {
      "slug": "early-payout",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Instant automatic payout when your team goes 2 goals ahead (2-Up Early Payout).",
      "tags": [
          "early-payout",
          "instant-win",
          "2-up",
          "lightning",
          "settled",
          "fast-payout"
      ]
  },
  build: () => {
      const disc = circleD(12, 12, 9.0);
      const discSolid = circleD(12, 12, 9.2);
      const boltPts = [[13.2, 5.6], [7.8, 12.8], [11.8, 12.8], [10.8, 18.4], [16.2, 11.2], [12.2, 11.2]];
      const B = bloatPoly(boltPts, 0.4, 0.12, { minEdge: 1.8 });
      return {
        keylines: drawKeylines([[12, 12, 9.0]], boltPts),
        line: `<path d="${disc}"/><path d="${B.d}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [discSolid], holeExact: [B.d] },
        duotone: { tone: [disc], secondary: [], line: `<path d="${disc}"/><path d="${B.d}" fill="currentColor" stroke="none"/>` }
      };
    }
};
