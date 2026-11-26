// Surgical-precision icon module: fdsi-receipt (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-08-receipt-statement",
  slug: "receipt",
  name: "#8. Transaction Receipt / Statement (Bloated Ticket + 3 Sawtooth Bottom Peaks + 2 Rows)",
  area: "payments",
  order: 41,
  desc: "Vertical statement receipt (x=5.0..19.0, y=3.2..20.8) with 3 clean sawtooth V-peaks along the bottom edge and 2 bold horizontal transaction rows.",
  meta: {
      "slug": "receipt",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "View itemized transaction statement, payment receipt, or account ledger.",
      "tags": [
          "receipt",
          "statement",
          "invoice",
          "history",
          "ledger",
          "transaction",
          "bill"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      const pts = [
        [5.0, 3.2], [19.0, 3.2], [19.0, 20.6],
        [16.7, 18.2], [14.3, 20.6], [12.0, 18.2], [9.7, 20.6], [7.3, 18.2], [5.0, 20.6]
      ];
      const R = bloatPoly(pts, [cr, cr, 0.35, 0.3, 0.35, 0.3, 0.35, 0.3, 0.35], b * 0.4, {
        minEdge: 2.0,
        edgeBulge: [0.6, 0.8, 0, 0, 0, 0, 0, 0, 0.8]
      });
      const rows = `M8.6 8.8H15.4M8.6 13.0H13.4`;
      const h1 = capsule(8.6, 8.8, 15.4, 8.8, 1.0);
      const h2 = capsule(8.6, 13.0, 13.4, 13.0, 1.0);
      return {
        keylines: drawKeylines([], [[5, 3.2], [19, 3.2], [12, 18.2], [5, 20.6], [19, 20.6]]),
        line: `<path d="${R.d}"/><path d="${rows}"/>`,
        solid: { fill: [R.d], holeExact: [h1, h2] },
        duotone: { tone: [R.d], secondary: [rows], line: `<path d="${R.d}"/><path d="${rows}"/>` }
      };
    }
};
