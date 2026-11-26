// Surgical-precision icon module: fdsi-handball-throw (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-32-handball-throw",
  slug: "handball-throw",
  name: "#32. Handball / Throw Athlete (Precision Stick-Figure Grammar — Hollow Head + Tapered Torso + Ball)",
  area: "sb",
  order: 65,
  desc: "Matches our praised Stick-Figure Athletes: Hollow head (12.8, 5.4, r=2.2) + tangentHull2 arched torso + cocked throwing arm holding ball at (4.5, 5.5) + airborne stride legs.",
  meta: {
      "slug": "handball-throw",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "European EHF Champions League and World Championship team handball.",
      "tags": [
          "handball",
          "throw",
          "athlete",
          "ehf",
          "indoor",
          "team-sports"
      ]
  },
  build: () => {
      const headLine = circleD(12.8, 5.4, 2.2);
      const headSolid = circleD(12.8, 5.4, 2.4);
      const ball = circleD(4.6, 5.2, 1.8);
      const torso = tangentHull2([11.8, 9.6], 1.75, [10.2, 14.2], 1.2);
      const arms = roundOpen([[5.4, 8.2], [8.8, 9.8], [11.8, 9.6], [15.4, 8.2], [18.4, 10.2]], 1.2);
      const leadLeg = roundOpen([[10.2, 14.2], [14.6, 15.8], [16.8, 19.8]], 1.2);
      const trailLeg = roundOpen([[10.2, 14.2], [6.8, 16.8], [4.2, 19.6]], 1.2);
      return {
        keylines: drawKeylines([[12.8, 5.4, 2.2], [4.6, 5.2, 1.8], [11.8, 9.6, 1.75], [10.2, 14.2, 1.2]], [[16.8, 19.8], [4.2, 19.6]]),
        line: `<path d="${headLine}"/><path d="${ball}" fill="currentColor" stroke="none"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${arms}"/><path d="${leadLeg}"/><path d="${trailLeg}"/>`,
        solid: {
          face: [headSolid, ball, torso.d],
          tubes: [[arms, 1.9], [leadLeg, 2.0], [trailLeg, 2.0]]
        },
        duotone: {
          tone: [torso.d, headSolid],
          secondary: [ball],
          line: `<path d="${headLine}"/><path d="${ball}" fill="currentColor" stroke="none"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${arms}"/><path d="${leadLeg}"/><path d="${trailLeg}"/>`
        }
      };
    }
};
