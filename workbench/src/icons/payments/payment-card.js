// Surgical-precision icon module: fdsi-payment-card (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-05-payment-card",
  slug: "payment-card",
  name: "#5. Credit / Debit Card (2-Part Split Card — Upper Band + Lower Body with Chip, Like Betslip)",
  area: "payments",
  order: 38,
  desc: "Built like Betslip & Crown: 2 separate padded shapes in Solid — Upper Card Header Band (y=4.5..8.8) + Lower Card Body (y=10.6..19.5) with EMV chip cutout.",
  meta: {
      "slug": "payment-card",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Pay or withdraw using Visa, Mastercard, or debit/credit cards.",
      "tags": [
          "card",
          "credit-card",
          "debit-card",
          "visa",
          "mastercard",
          "payment",
          "emv"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 0.3, 2.2);
      const C = bloatRect({ x: 2.8, y: 4.5, w: 18.4, h: 15.0, r: cr, b });
      const stripe = spanLine(C, 9.5, b * 0.4);
      const chipLine = `M6.6 14.5H10.6`;
      // Solid: 2 separate padded shapes (Upper Card Header + Lower Card Body separated by 1.8px magnetic stripe gap!)
      const topBand = bloatRect({ x: 2.8, y: 4.5, w: 18.4, h: 4.3, r: [cr, cr, 0.8, 0.8], b: b * 0.4 });
      const botBody = bloatRect({ x: 2.8, y: 10.6, w: 18.4, h: 8.9, r: [0.8, 0.8, cr, cr], b: b * 0.5 });
      const chipHole = bloatRect({ x: 6.2, y: 13.6, w: 4.6, h: 3.0, r: 0.8, b: 0.1 });
      return {
        keylines: drawKeylines([], [...topBand.anchors, ...botBody.anchors]),
        line: `<path d="${C.d}"/><path d="${stripe}"/><path d="${chipLine}"/>`,
        solid: {
          face: [topBand.d, botBody.d],
          holeExact: [chipHole.d]
        },
        duotone: { tone: [botBody.d], secondary: [stripe, chipLine], line: `<path d="${C.d}"/><path d="${stripe}"/><path d="${chipLine}"/>` }
      };
    }
};
