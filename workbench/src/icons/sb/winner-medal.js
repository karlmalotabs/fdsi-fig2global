// Surgical-precision icon module: fdsi-winner-medal (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { polar, circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-42-winner-medal",
  slug: "winner-medal",
  name: "#42. Gold Medal / Podium Winner (3 Separate Padded Shapes — 2 Ribbon Flaps + Star Medallion)",
  area: "sb",
  order: 75,
  desc: "Circular winner medallion (cx=12, cy=14.4, R=5.8) with filled 5-point star + 2 V-ribbon lapels above (y=3.2..9.4). Solid: 3 separate padded shapes (Left Ribbon, Right Ribbon, Medallion with Star cutout)!",
  meta: {
      "slug": "winner-medal",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Podium finish, gold medal winner, and top-3 placement markets.",
      "tags": [
          "medal",
          "gold",
          "winner",
          "podium",
          "first-place",
          "olympic",
          "award"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.75);
      const med = circleD(12.0, 14.4, 5.8);
      const medSolid = circleD(12.0, 14.4, 6.1);
      // 5-point star centered at (12.0, 14.4, R_out=3.2, R_in=1.45):
      const starPts = Array.from({ length: 10 }, (_, i) => polar(12.0, 14.4, i % 2 === 0 ? 3.25 : 1.45, -90 + i * 36));
      const star = bloatPoly(starPts, 0.22, 0, { minEdge: 99 });
      // V-ribbons in Line mode:
      const ribbonsLine = `M6.2 3.4L9.4 9.2M17.8 3.4L14.6 9.2M10.2 3.4L12.0 8.6L13.8 3.4H6.2M13.8 3.4H17.8`;
      // Solid mode: 2 separate padded ribbon polygons above the medallion (`ribL`, `ribR`) with 1.6px gap above medallion!
      const ribL = bloatPoly([[5.8, 3.2], [10.6, 3.2], [11.2, 7.2], [8.0, 8.0]], cr, b * 0.2, { minEdge: 1.8 });
      const ribR = bloatPoly([[13.4, 3.2], [18.2, 3.2], [16.0, 8.0], [12.8, 7.2]], cr, b * 0.2, { minEdge: 1.8 });
      return {
        keylines: drawKeylines([[12, 14.4, 5.8], [12, 14.4, 3.25]], [[5.8, 3.2], [18.2, 3.2], [12, 14.4]]),
        line: `<path d="${ribbonsLine}"/><path d="${med}"/><path d="${star.d}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [ribL.d, ribR.d, medSolid],
          holeExact: [star.d]
        },
        duotone: {
          tone: [med],
          secondary: [ribbonsLine],
          line: `<path d="${ribbonsLine}"/><path d="${med}"/><path d="${star.d}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
