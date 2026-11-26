// Surgical-precision icon module: fdsi-trash (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-15-trash-delete",
  slug: "trash",
  name: "#15. Trash / Clear Betslip (2 Separate Padded Shapes — Lid Bar + Tapered Bin)",
  area: "common",
  order: 48,
  desc: "Built like Filter Funnel & Crown: 2 separate padded shapes in Solid — Top Lid Bar with Handle (y=3.5..7.2) + Tapered Lower Bin (y=9.0..20.6) with 2 vertical slot holes!",
  meta: {
      "slug": "trash",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Remove a selection from the betslip or clear all saved items.",
      "tags": [
          "trash",
          "delete",
          "remove",
          "bin",
          "clear",
          "discard",
          "garbage"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      const bin = bloatPoly([[5.8, 6.8], [18.2, 6.8], [17.0, 20.4], [7.0, 20.4]], [0.6, 0.6, cr, cr], b * 0.45, { minEdge: 3.0 });
      const lidLine = `M3.8 6.8H20.2M9.2 6.8V4.6A1.2 1.2 0 0 1 10.4 3.4H13.6A1.2 1.2 0 0 1 14.8 4.6V6.8`;
      const slotsLine = `M10.2 11.0V16.4M13.8 11.0V16.4`;
      // Solid: 2 separate padded shapes (Lid Pill at y=4.6..7.4 + Lower Tapered Bin at y=9.2..20.6 — 1.8px gap!)
      const lidSolid = bloatPoly([
        [3.6, 5.2], [8.8, 5.2], [8.8, 3.2], [15.2, 3.2], [15.2, 5.2], [20.4, 5.2], [20.4, 7.6], [3.6, 7.6]
      ], [0.9, 0.2, 0.7, 0.7, 0.2, 0.9, 0.9, 0.9], b * 0.2, { minEdge: 1.5 });
      const binSolid = bloatPoly([[5.6, 9.4], [18.4, 9.4], [17.2, 20.6], [6.8, 20.6]], [0.9, 0.9, cr, cr], b * 0.45, { minEdge: 3.0 });
      const s1 = capsule(10.2, 12.2, 10.2, 17.2, 0.9);
      const s2 = capsule(13.8, 12.2, 13.8, 17.2, 0.9);
      return {
        keylines: drawKeylines([], bin.anchors),
        line: `<path d="${bin.d}"/><path d="${lidLine}"/><path d="${slotsLine}"/>`,
        solid: {
          face: [lidSolid.d, binSolid.d],
          holeExact: [s1, s2]
        },
        duotone: { tone: [bin.d], secondary: [lidLine, slotsLine], line: `<path d="${bin.d}"/><path d="${lidLine}"/><path d="${slotsLine}"/>` }
      };
    }
};
