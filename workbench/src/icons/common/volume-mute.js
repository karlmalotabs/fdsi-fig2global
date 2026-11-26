// Surgical-precision icon module: fdsi-volume-mute (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-92-volume-mute",
  slug: "volume-mute",
  name: "#92. Mute / Sound Off (2-Part Padded Speaker Horn + Crisp 'X' Cross)",
  area: "common",
  order: 125,
  desc: "Companion to #91 Sound On: Bloated speaker horn on the left (x=3.4..13.2) + crisp 4.8×4.8px 'X' mute cross on the right (x=16.0..20.8, y=9.6..14.4).",
  meta: {
      "slug": "volume-mute",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Mute live stream audio, casino game music, or sound effects.",
      "tags": [
          "mute",
          "silent",
          "volume-off",
          "audio",
          "speaker",
          "quiet"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const hornPts = [[3.4, 9.2], [7.6, 9.2], [13.2, 5.0], [13.2, 19.0], [7.6, 14.8], [3.4, 14.8]];
      const H = bloatPoly(hornPts, [cr, 0.35, cr, cr, 0.35, cr], b * 0.35, { minEdge: 2.0 });
      const xCross = `M16.0 9.6L20.8 14.4M20.8 9.6L16.0 14.4`;
      const driver = bloatRect({ x: 3.2, y: 9.0, w: 3.6, h: 6.0, r: 0.9, b: b * 0.2 });
      const cone = bloatPoly([[8.2, 8.6], [13.6, 4.6], [13.6, 19.4], [8.2, 15.4]], [0.7, cr, cr, 0.7], b * 0.35, { minEdge: 2.0 });
      return {
        keylines: drawKeylines([], [...H.anchors, [16.0, 9.6], [20.8, 14.4]]),
        line: `<path d="${H.d}"/><path d="${xCross}"/>`,
        solid: {
          face: [driver.d, cone.d],
          stroke: [xCross]
        },
        duotone: { tone: [H.d], secondary: [xCross], line: `<path d="${H.d}"/><path d="${xCross}"/>` }
      };
    }
};
