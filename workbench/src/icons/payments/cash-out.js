// Surgical-precision icon module: fdsi-cash-out (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-cash-out",
  slug: "cash-out",
  name: "Cash Out (2 Non-Overlapping Shapes — Banknote Card Above + Bold Return Arrow Below)",
  area: "payments",
  order: 28,
  desc: "ZERO overlapping arrow knockouts! Upper bloated banknote card (x=3.2..20.8, y=3.5..13.5) with bold center coin hole + separate outgoing return arrow below (y=17.8).",
  meta: {
      "slug": "cash-out",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Settle an open bet early for an instant guaranteed real-money return.",
      "tags": [
          "cash-out",
          "early-settlement",
          "return",
          "banknote",
          "payout",
          "instant",
          "settle"
      ]
  },
  build: ({ b, r }) => {
      const N = bloatRect({ x: 3.2, y: 3.5, w: 17.6, h: 10.0, r: Math.min(r + 0.3, 2.0), b });
      const coin = circleD(12.0, 8.5, 2.4);
      const coinHole = circleD(12.0, 8.5, 2.6);
      // Separate, non-overlapping return arrow underneath (y=15.2..21.2) — zero collision with the banknote!
      const arr = `M5.5 18.0H18.5M15.0 14.8L18.6 18.0L15.0 21.2`;
      return {
        keylines: drawKeylines([[12.0, 8.5, 2.4]], [...N.anchors, [18.6, 18.0]]),
        line: `<path d="${N.d}"/><path d="${coin}"/><path d="${arr}"/>`,
        solid: {
          fill: [N.d],
          holeExact: [coinHole],
          stroke: [arr]
        },
        duotone: { tone: [N.d], secondary: [coin, arr], line: `<path d="${N.d}"/><path d="${coin}"/><path d="${arr}"/>` }
      };
    }
};
