// Surgical-precision icon module: fdsi-bet-barcode (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-59-bet-barcode",
  slug: "bet-barcode",
  name: "#59. Retail Ticket Scanner / Barcode (4 Corner Viewfinder Brackets + Vertical Barcode Bars)",
  area: "sb",
  order: 92,
  desc: "4 outer scanner viewfinder L-brackets at corners (x=3.0..21.0, y=4.2..19.8) + 4 vertical barcode bars inside (x=7.0, 10.4, 13.6, 17.0).",
  meta: {
      "slug": "bet-barcode",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Retail shop betslip barcode scanner for checking or cashing out in-store tickets.",
      "tags": [
          "barcode",
          "scanner",
          "retail",
          "shop",
          "ticket-check",
          "in-store"
      ]
  },
  build: () => {
      const corners =
        `M3.2 8.2V5.6A1.4 1.4 0 0 1 4.6 4.2H7.4` +
        `M16.6 4.2H19.4A1.4 1.4 0 0 1 20.8 5.6V8.2` +
        `M20.8 15.8V18.4A1.4 1.4 0 0 1 19.4 19.8H16.6` +
        `M7.4 19.8H4.6A1.4 1.4 0 0 1 3.2 18.4V15.8`;
      const barsLine = `M7.2 8.0V16.0M10.4 8.0V16.0M13.6 8.0V16.0M16.8 8.0V16.0`;
      const b1 = capsule(7.0,  7.8, 7.0,  16.2, 1.15);
      const b2 = capsule(10.5, 7.8, 10.5, 16.2, 0.85);
      const b3 = capsule(13.6, 7.8, 13.6, 16.2, 1.15);
      const b4 = capsule(17.0, 7.8, 17.0, 16.2, 0.85);
      const bg = bloatRect({ x: 3.2, y: 4.2, w: 17.6, h: 15.6, r: 1.8, b: 0.2 });
      return {
        keylines: drawKeylines([], [[3.2, 4.2], [20.8, 4.2], [20.8, 19.8], [3.2, 19.8]]),
        line: `<path d="${corners}"/><path d="${barsLine}"/>`,
        solid: {
          face: [b1, b2, b3, b4],
          stroke: [corners]
        },
        duotone: { tone: [bg.d], secondary: [barsLine], line: `<path d="${corners}"/><path d="${barsLine}"/>` }
      };
    }
};
