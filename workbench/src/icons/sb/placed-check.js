// Surgical-precision icon module: fdsi-placed-check (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { roundOpen, bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-placed-check",
  slug: "placed-check",
  name: "Placed Bet (2-Part Split Ticket — Separate Upper Stub + Lower Body with Bold Checkmark)",
  area: "sb",
  order: 24,
  desc: "Matches Betslip Ticket: 2 separate padded shapes in Solid — Upper Ticket Header Stub (y=3.2..8.6) + Lower Ticket Body (y=10.4..20.8) with 1 bold confirmed checkmark cut inside.",
  meta: {
      "slug": "placed-check",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Confirmed and settled bet ticket in the player's open or settled bets.",
      "tags": [
          "placed-bet",
          "settled",
          "confirmed",
          "ticket",
          "check",
          "wager",
          "receipt"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.65, 1.5);
      const T = bloatRect({ x: 4.8, y: 3.2, w: 14.4, h: 17.6, r: cr, b });
      const tearSeam = spanLine(T, 9.4, b * 0.4);
      const chk = roundOpen([[8.8, 15.2], [11.2, 17.6], [15.6, 12.8]], Math.min(r * 0.35, 0.65));
      // Solid mode: 2 Separate Padded Rounded Shapes (Upper Stub + Lower Body) + bold checkmark cut!
      const upperStub = bloatRect({ x: 4.8, y: 3.2, w: 14.4, h: 5.4, r: [cr, cr, 0.9, 0.9], b: b * 0.45 });
      const lowerBody = bloatRect({ x: 4.8, y: 10.4, w: 14.4, h: 10.4, r: [0.9, 0.9, cr, cr], b: b * 0.55 });
      return {
        keylines: drawKeylines([], [...upperStub.anchors, ...lowerBody.anchors, [8.8, 15.2], [11.2, 17.6], [15.6, 12.8]]),
        line: `<path d="${T.d}"/><path d="${tearSeam}"/><path d="${chk}"/>`,
        solid: {
          face: [upperStub.d, lowerBody.d],
          cut: [chk]
        },
        duotone: { tone: [lowerBody.d], secondary: [tearSeam, chk], line: `<path d="${T.d}"/><path d="${tearSeam}"/><path d="${chk}"/>` }
      };
    }
};
