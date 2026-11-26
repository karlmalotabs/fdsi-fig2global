// Surgical-precision icon module: fdsi-weightlifting-barbell (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-39-weightlifting-barbell",
  slug: "weightlifting-barbell",
  name: "#39. Weightlifting / Barbell (4 Separate Padded Weight Plates + Center Bar)",
  area: "sb",
  order: 72,
  desc: "Horizontal barbell shaft (x=2.2..21.8, y=12.0) + 2 inner tall weight plates (h=13.2) and 2 outer shorter weight plates (h=8.4). Solid: 4 separate padded plates + center bar!",
  meta: {
      "slug": "weightlifting-barbell",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Olympic weightlifting, powerlifting, and CrossFit strength competitions.",
      "tags": [
          "weightlifting",
          "barbell",
          "weights",
          "plates",
          "strength",
          "gym",
          "olympic"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const inL  = bloatRect({ x: 6.2, y: 5.4, w: 3.0, h: 13.2, r: cr, b: b * 0.3 });
      const inR  = bloatRect({ x: 14.8, y: 5.4, w: 3.0, h: 13.2, r: cr, b: b * 0.3 });
      const outL = bloatRect({ x: 2.8, y: 7.8, w: 2.6, h: 8.4, r: cr * 0.85, b: b * 0.25 });
      const outR = bloatRect({ x: 18.6, y: 7.8, w: 2.6, h: 8.4, r: cr * 0.85, b: b * 0.25 });
      const bar = `M9.2 12.0H14.8`;
      return {
        keylines: drawKeylines([], [...inL.anchors, ...inR.anchors]),
        line: `<path d="${inL.d}"/><path d="${inR.d}"/><path d="${outL.d}"/><path d="${outR.d}"/><path d="${bar}"/>`,
        solid: {
          face: [inL.d, inR.d, outL.d, outR.d],
          stroke: [bar]
        },
        duotone: { tone: [inL.d, inR.d], secondary: [outL.d, outR.d, bar], line: `<path d="${inL.d}"/><path d="${inR.d}"/><path d="${outL.d}"/><path d="${outR.d}"/><path d="${bar}"/>` }
      };
    }
};
