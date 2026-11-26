// Surgical-precision icon module: fdsi-slip-ticket (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-slip-ticket",
  slug: "slip-ticket",
  name: "Betslip Ticket (2-Part Split Ticket + 3 Selection Rows)",
  area: "sb",
  order: 23,
  desc: "2 separate padded ticket shapes in Solid (Upper Stub y=3.2..8.6 + Lower Body y=10.4..20.8) with a header line in the stub + 2 selection rows (full + short) in the lower body.",
  meta: {
      "slug": "slip-ticket",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Active betslip containing selected wagers, stakes, and potential payout.",
      "tags": [
          "betslip",
          "ticket",
          "wager",
          "selections",
          "coupon",
          "stake",
          "bet"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.65, 1.5);
      const T = bloatRect({ x: 4.8, y: 3.2, w: 14.4, h: 17.6, r: cr, b });
      const tearSeam = spanLine(T, 9.4, b * 0.4);
      const stubLine = `M8.6 6.2H12.8`;
      const row1 = `M8.4 13.6H15.6`;
      const row2 = `M8.4 17.0H13.4`;
      // Solid mode: 2 Separate Padded Rounded Shapes (Upper Stub + Lower Body) with crisp capsule row windows!
      const upperStub = bloatRect({ x: 4.8, y: 3.2, w: 14.4, h: 5.4, r: [cr, cr, 0.9, 0.9], b: b * 0.45 });
      const lowerBody = bloatRect({ x: 4.8, y: 10.4, w: 14.4, h: 10.4, r: [0.9, 0.9, cr, cr], b: b * 0.55 });
      const hStub = capsule(8.6, 6.0, 12.8, 6.0, 0.9);
      const hRow1 = capsule(8.4, 13.8, 15.6, 13.8, 0.95);
      const hRow2 = capsule(8.4, 17.2, 13.4, 17.2, 0.95);
      return {
        keylines: drawKeylines([], [...upperStub.anchors, ...lowerBody.anchors]),
        line: `<path d="${T.d}"/><path d="${tearSeam}"/><path d="${stubLine}"/><path d="${row1}"/><path d="${row2}"/>`,
        solid: {
          face: [upperStub.d, lowerBody.d],
          holeExact: [hStub, hRow1, hRow2]
        },
        duotone: { tone: [lowerBody.d], secondary: [tearSeam, stubLine, row1, row2], line: `<path d="${T.d}"/><path d="${tearSeam}"/><path d="${stubLine}"/><path d="${row1}"/><path d="${row2}"/>` }
      };
    }
};
