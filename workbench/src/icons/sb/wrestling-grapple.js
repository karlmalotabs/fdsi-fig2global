// Surgical-precision icon module: fdsi-wrestling-grapple (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-116-wrestling-grapple",
  slug: "wrestling-grapple",
  name: "#116. Olympic Wrestling Lockup (2 Wrestlers Leaning Inward Head-to-Head with Braced Stance)",
  area: "sb",
  order: 149,
  desc: "REWORKED POSE: Two wrestlers leaning INWARD head-to-head ((9.2, 5.4) & (14.8, 5.4)), shoulders driving forward with locked grapple arms at (12.0, 10.6), and both back & front legs braced on the mat!",
  meta: {
      "slug": "wrestling-grapple",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Olympic freestyle and Greco-Roman wrestling bout markets.",
      "tags": [
          "wrestling",
          "grapple",
          "lockup",
          "freestyle",
          "greco-roman",
          "combat",
          "olympic"
      ]
  },
  build: () => {
      const hL = circleD(9.2,  5.4, 1.95), hLS = circleD(9.2,  5.4, 2.2);
      const hR = circleD(14.8, 5.4, 1.95), hRS = circleD(14.8, 5.4, 2.2);
      const tL = tangentHull2([7.6,  8.8], 1.5, [5.2,  13.6], 1.1);
      const tR = tangentHull2([16.4, 8.8], 1.5, [18.8, 13.6], 1.1);
      const grappleArms = roundOpen([[7.6, 8.8], [12.0, 10.8], [16.4, 8.8]], 1.0);
      const legL_back  = `M5.2 13.6L3.0 19.8`;
      const legL_front = roundOpen([[5.2, 13.6], [8.8, 16.0], [8.8, 19.8]], 1.0);
      const legR_back  = `M18.8 13.6L21.0 19.8`;
      const legR_front = roundOpen([[18.8, 13.6], [15.2, 16.0], [15.2, 19.8]], 1.0);
      const limbs = `${grappleArms}${legL_back}${legL_front}${legR_back}${legR_front}`;
      return {
        keylines: drawKeylines([[9.2, 5.4, 1.95], [14.8, 5.4, 1.95], [7.6, 8.8, 1.5], [16.4, 8.8, 1.5]], [[12, 10.8], [3.0, 19.8], [21.0, 19.8]]),
        line: `<path d="${hL}"/><path d="${hR}"/><path d="${tL.d}" fill="currentColor" stroke="none"/><path d="${tR.d}" fill="currentColor" stroke="none"/><path d="${limbs}"/>`,
        solid: {
          face: [hLS, hRS, tL.d, tR.d],
          stroke: [limbs]
        },
        duotone: {
          tone: [tL.d, tR.d, hLS, hRS],
          secondary: [limbs],
          line: `<path d="${hL}"/><path d="${hR}"/><path d="${tL.d}" fill="currentColor" stroke="none"/><path d="${tR.d}" fill="currentColor" stroke="none"/><path d="${limbs}"/>`
        }
      };
    }
};
