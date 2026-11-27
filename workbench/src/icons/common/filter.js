// Surgical-precision icon module: fdsi-filter (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-filter-funnel",
  slug: "filter",
  name: "Filter Funnel (2 Separate Padded Solid Shapes — Upper Cone & Lower Spout, Like Crown)",
  area: "common",
  order: 19,
  desc: "FIXED SOLID (Matches Crown & Diamond): Solid is built from 2 separate, self-contained rounded shapes (Upper Tapered Cone + Lower Spout Stem) with a 1.8px padding gap between them!",
  meta: {
      "slug": "filter",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Filter events, markets, transactions, or casino games by criteria.",
      "tags": [
          "filter",
          "funnel",
          "refine",
          "narrow",
          "sort",
          "criteria",
          "facets"
      ],
      "status": "approved"
  },
  build: ({ b, r }) => {
      const pts = [[3.5, 4.5], [20.5, 4.5], [14.0, 12.6], [14.0, 19.8], [10.0, 19.8], [10.0, 12.6]];
      const cr = Math.min(r * 0.5, 1.1);
      const F = bloatPoly(pts, [cr, cr, cr * 0.7, cr, cr, cr * 0.7], b * 0.6, {
        minEdge: 3.5,
        edgeBulge: [0.8, 0.5, 0, 0, 0, 0.5]
      });
      const neckSeam = `M10.0 12.6H14.0`;
      // SOLID MODE: 2 Independent Rounded Shapes with 1.8px Padding Between Them (just like Royal Crown!):
      // Shape 1: Upper Tapered Funnel Cone (y = 4.0..12.0, rounded corners r=1.2)
      const upperCone = bloatPoly(
        [[3.0, 4.0], [21.0, 4.0], [14.5, 12.0], [9.5, 12.0]],
        [1.2, 1.2, 1.1, 1.1],
        b * 0.6,
        { minEdge: 3.5 }
      );
      // Shape 2: Separate Rounded Spout Stem below (y = 13.8..20.4, 1.8px clear below upperCone!)
      const lowerSpout = bloatRect({ x: 9.6, y: 13.8, w: 4.8, h: 6.6, r: 1.3, b: b * 0.3 });
      return {
        keylines: drawKeylines([], [...F.anchors, [10.0, 12.6], [14.0, 12.6]]),
        line: `<path d="${F.d}"/><path d="${neckSeam}"/>`,
        solid: {
          // 2 distinct rounded solid shapes — ZERO cut/hole lines!
          face: [upperCone.d, lowerSpout.d]
        },
        duotone: { tone: [upperCone.d], secondary: [neckSeam], line: `<path d="${F.d}"/><path d="${neckSeam}"/>` }
      };
    }
};
