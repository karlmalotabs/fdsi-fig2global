// Surgical-precision icon module: fdsi-alpine-skiing (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "downhill-skiing",
  slug: "alpine-skiing",
  name: "Downhill Skiing (Tangent-Hull Aero Torso + Soft Knee Rig)",
  area: "sb",
  order: 203,
  desc: "Tapered aero torso hull tangentHull2(shoulder(13.8,8.2,r=1.4), hip(9.2,11.2,r=1.05)) + roundOpen tuck leg + curved ski tip.",
  meta: {
      "slug": "alpine-skiing",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "FIS World Cup and Winter Olympic alpine downhill and slalom skiing.",
      "tags": [
          "skiing",
          "alpine",
          "downhill",
          "slalom",
          "snow",
          "winter-sports"
      ]
  },
  build: () => {
      const head = circleD(16.5, 5.0, 2.2);
      const torsoHull = tangentHull2([13.8, 8.2], 1.4, [9.2, 11.2], 1.05);
      const leg = roundOpen([[9.2, 11.2], [12.8, 14.8], [9.5, 18.0]], 1.4);
      const pole = `M13.2 8.8L4.8 12.5`;
      const skis = `M3.0 16.5L17.5 21.2Q19.5 21.8 20.6 19.8`;
      return {
        keylines: drawKeylines([[16.5, 5.0, 2.2], [13.8, 8.2, 1.4], [9.2, 11.2, 1.05]], torsoHull.pts),
        line: `<path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${leg}" stroke-width="2.1"/><path d="${pole}"/><path d="${skis}"/>`,
        solid: {
          fill: [head],
          face: [torsoHull.d],
          tubes: [[leg, 2.2]],
          stroke: [pole, skis]
        },
        duotone: {
          tone: [head, torsoHull.d],
          secondary: [skis, pole],
          line: `<path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${leg}" stroke-width="2.1"/>`
        }
      };
    }
};
