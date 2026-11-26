// Surgical-precision icon module: fdsi-sailing-yacht (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-103-sailing-yacht",
  slug: "sailing-yacht",
  name: "#103. Sailing / Regatta Yacht (3 Separate Padded Shapes — Main Sail + Jib Sail + Boat Hull)",
  area: "sb",
  order: 136,
  desc: "Built like Crown & Diamond: 3 separate, self-contained rounded shapes in Solid — Large Right Main Sail (y=3.4..14.6) + Left Jib Sail (y=6.2..14.6) + Lower Boat Hull (y=16.4..20.4)!",
  meta: {
      "slug": "sailing-yacht",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "America's Cup, SailGP, and Olympic yachting regatta markets.",
      "tags": [
          "sailing",
          "yacht",
          "boat",
          "regatta",
          "americas-cup",
          "wind",
          "water-sports"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      const mainSail = bloatPoly([[11.8, 3.4], [19.8, 14.4], [11.8, 14.4]], [0.65, cr, 0.6], b * 0.3, {
        minEdge: 2.5,
        edgeBulge: [0.9, 0, 0]
      });
      const jibSail = bloatPoly([[9.4, 6.2], [9.4, 14.4], [4.2, 14.4]], [0.6, 0.55, cr], b * 0.25, {
        minEdge: 2.0,
        edgeBulge: [0, 0, 0.7]
      });
      const hull = bloatPoly([[3.4, 16.6], [20.6, 16.6], [18.2, 20.4], [5.8, 20.4]], [0.7, 0.7, cr, cr], b * 0.3, { minEdge: 2.0 });
      return {
        keylines: drawKeylines([], [...mainSail.anchors, ...jibSail.anchors, ...hull.anchors]),
        line: `<path d="${mainSail.d}"/><path d="${jibSail.d}"/><path d="${hull.d}"/>`,
        solid: {
          face: [mainSail.d, jibSail.d, hull.d]
        },
        duotone: { tone: [mainSail.d, hull.d], secondary: [jibSail.d], line: `<path d="${mainSail.d}"/><path d="${jibSail.d}"/><path d="${hull.d}"/>` }
      };
    }
};
