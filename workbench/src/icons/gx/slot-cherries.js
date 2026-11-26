// Surgical-precision icon module: fdsi-slot-cherries (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "slot-cherries",
  slug: "slot-cherries",
  name: "Slot Cherries (Exact Polar Stem Tangents + Leaf Lens)",
  area: "gx",
  order: 200,
  desc: "Twin r=3.6 cherry spheres at (7.5, 16.8) and (16.5, 16.8) with stems meeting their exact top polar points (-90°) and a symmetric vesica piscis leaf.",
  meta: {
      "slug": "slot-cherries",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Classic fruit machines, retro pub slots, and fruit symbol combinations.",
      "tags": [
          "cherries",
          "fruit",
          "classic-slots",
          "retro",
          "arcade",
          "berries"
      ]
  },
  build: () => {
      const c1 = [7.5, 16.8], c2 = [16.5, 16.8], R = 3.6;
      const b1 = circleD(c1[0], c1[1], R), b2 = circleD(c2[0], c2[1], R);
      const top1 = polar(c1[0], c1[1], R, -90), top2 = polar(c2[0], c2[1], R, -80);
      const apex = [13.5, 3.5];
      const stems = `M${P(top1)}C7.5 8.5 10.2 5.0 ${P(apex)}C14.2 8.2 15.8 10.5 ${P(top2)}`;
      // Vesica piscis leaf (two r=4.5 circular arcs intersecting from (13.5, 3.5) to (19.0, 5.5)):
      const leaf = `M13.5 3.5A4.2 4.2 0 0 1 19.2 5.2A4.2 4.2 0 0 1 13.5 3.5Z`;
      return {
        keylines: drawKeylines([[...c1, R], [...c2, R]], [top1, top2, apex]),
        line: `<path d="${stems}"/><path d="${leaf}"/><path d="${b1}"/><path d="${b2}"/>`,
        solid: {
          fill: [b1, b2],
          face: [leaf],
          holeExact: [circleD(6.4, 15.8, 0.9), circleD(15.4, 15.8, 0.9)],
          stroke: [stems]
        },
        duotone: {
          tone: [b1, b2, leaf],
          secondary: [stems, leaf],
          line: `<path d="${b1}"/><path d="${b2}"/>`
        }
      };
    }
};
