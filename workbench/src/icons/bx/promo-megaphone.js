// Surgical-precision icon module: fdsi-promo-megaphone (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-58-promo-megaphone",
  slug: "promo-megaphone",
  name: "#58. Promo / Announcement Megaphone (2 Separate Padded Shapes — Mouthpiece + Flared Horn)",
  area: "bx",
  order: 91,
  desc: "Built like Filter Funnel: Rear mouthpiece & handle (x=3.2..8.2) + flared acoustic horn cone opening to right (x=8.2..19.2, y=4.2..17.8) + 2 sound ticks!",
  meta: {
      "slug": "promo-megaphone",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Special promotional offer, price boost announcement, and news broadcast.",
      "tags": [
          "megaphone",
          "promotion",
          "announcement",
          "offer",
          "campaign",
          "news",
          "marketing"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.1);
      // Line mode: Flared horn + rear mouthpiece cap + lower pistol grip handle:
      const hornLine = bloatPoly([[3.6, 9.2], [18.4, 4.2], [18.4, 17.8], [3.6, 12.8]], [0.9, cr, cr, 0.9], b * 0.35, { minEdge: 2.5 });
      const seam = `M8.2 7.8V14.2`;
      const grip = `M5.6 13.4L7.2 19.6H10.2L9.0 14.5`;
      const waves = `M21.0 8.6L22.2 7.6M21.0 13.4L22.2 14.4`;
      // Solid mode: 3 Separate Padded Shapes (Rear Mouthpiece + Flared Horn Cone + Lower Pistol Grip)!
      const mouthSolid = bloatPoly([[3.2, 9.0], [7.2, 7.8], [7.2, 14.2], [3.2, 13.0]], [1.0, 0.6, 0.6, 1.0], b * 0.25, { minEdge: 2.0 });
      const coneSolid  = bloatPoly([[8.8, 7.2], [18.6, 4.0], [18.6, 18.0], [8.8, 14.8]], [0.7, cr, cr, 0.7], b * 0.35, { minEdge: 2.5 });
      const gripSolid  = bloatPoly([[5.2, 14.8], [8.6, 15.8], [9.8, 20.2], [6.6, 20.2]], 0.75, b * 0.2, { minEdge: 1.5 });
      return {
        keylines: drawKeylines([], [...hornLine.anchors, [7.2, 19.6]]),
        line: `<path d="${hornLine.d}"/><path d="${seam}"/><path d="${grip}"/><path d="${waves}"/>`,
        solid: {
          face: [mouthSolid.d, coneSolid.d, gripSolid.d],
          stroke: [waves]
        },
        duotone: { tone: [coneSolid.d], secondary: [seam, grip, waves], line: `<path d="${hornLine.d}"/><path d="${seam}"/><path d="${grip}"/><path d="${waves}"/>` }
      };
    }
};
