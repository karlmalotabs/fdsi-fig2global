// Surgical-precision icon module: fdsi-athletics-sprint (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "athletics-sprint",
  slug: "athletics-sprint",
  name: "Athletics Sprint (Tapered Tangent-Hull Torso + S-Sweep Arms)",
  area: "sb",
  order: 204,
  desc: "Tapered chest-to-waist tangentHull2((13.2,8.2,r=1.45), (8.8,13.4,r=1.0)) + roundOpen pump arms and stride legs.",
  meta: {
      "slug": "athletics-sprint",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Track and field 100m sprint, marathon, and Diamond League athletics.",
      "tags": [
          "athletics",
          "sprint",
          "running",
          "runner",
          "track",
          "marathon",
          "olympic"
      ]
  },
  build: () => {
      const head = circleD(15.8, 4.6, 2.25);
      const torsoHull = tangentHull2([13.2, 8.2], 1.45, [8.8, 13.4], 1.0);
      const arms = roundOpen([[6.8, 8.2], [10.2, 6.2], [13.2, 8.2], [15.8, 11.0], [19.2, 9.0]], 1.4);
      const leadLeg = roundOpen([[8.8, 13.4], [14.2, 14.8], [15.8, 20.5]], 1.5);
      const trailLeg = roundOpen([[8.8, 13.4], [5.8, 17.8], [2.8, 18.2]], 1.5);
      return {
        keylines: drawKeylines([[15.8, 4.6, 2.25], [13.2, 8.2, 1.45], [8.8, 13.4, 1.0]], torsoHull.pts),
        line: `<path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${arms}"/><path d="${leadLeg}" stroke-width="2.0"/><path d="${trailLeg}" stroke-width="2.0"/>`,
        solid: {
          fill: [head],
          face: [torsoHull.d],
          tubes: [[arms, 1.85], [leadLeg, 2.1], [trailLeg, 2.1]]
        },
        duotone: {
          tone: [head, torsoHull.d],
          secondary: [arms],
          line: `<path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${leadLeg}" stroke-width="2.0"/><path d="${trailLeg}" stroke-width="2.0"/>`
        }
      };
    }
};
