// Surgical-precision icon module: fdsi-horse-racing (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "horse-knight",
  slug: "horse-racing",
  name: "Galloping Thoroughbred (Muscular Neck Throat + Equal 2.6px Parallel Far-Leg Spacing)",
  area: "sb",
  order: 194,
  desc: "REFINED: Smooth muscular throat curve (no pinched jowl notch) + identical 2.6px parallel spacing between each primary leg and its short far-side leg tick!",
  meta: {
      "slug": "horse-racing",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Thoroughbred flat, jump, and international festival horse racing.",
      "tags": [
          "horse-racing",
          "thoroughbred",
          "gallop",
          "racehorse",
          "equestrian",
          "derby"
      ]
  },
  build: () => {
      const torso =
        `M5.8 9.2` +
        `Q9.8 8.5 13.2 8.8` +                   // thick rounded equine back
        `A9.0 9.0 0 0 1 16.5 4.2` +             // muscular arched neck crest
        `L17.6 2.6L18.5 4.5` +                  // pricked ear
        `L21.5 6.8A1.1 1.1 0 0 1 20.4 8.8` +    // tapered muzzle
        `L17.4 8.6` +                           // clean lower jaw
        `Q15.8 10.2 15.6 13.2` +                // smooth muscular throat into deep chest (no weird jowl bump!)
        `C13.5 14.6 9.0 14.6 6.2 13.4` +        // full-bodied rounded barrel
        `A2.2 2.2 0 0 1 5.8 9.2Z`;
      // Muscular rear thigh circle (7.0, 12.2, r=2.2) tapering down-left into hock (4.6, 15.5, r=0.85):
      const hindThigh = tangentHull2([7.0, 12.2], 2.2, [4.6, 15.5], 0.85);
      // Primary legs (symmetric ±38° stride):
      const nearHind = `M4.6 15.5L2.5 18.2`;
      const nearFore = roundOpen([[14.8, 13.2], [17.0, 16.0], [18.4, 17.8]], 1.4);
      // 2 short straight far-side ticks at IDENTICAL 2.6px parallel centerline spacing from nearFore and nearHind:
      const farFore = `M12.6 15.4L13.9 17.1`;
      const farHind = `M7.2 15.8L5.9 17.5`;
      const tail = `M5.2 10.2A4.5 4.5 0 0 0 2.0 13.2`;
      return {
        keylines: drawKeylines([[7.0, 12.2, 2.2], [4.6, 15.5, 0.85], [13.2, 11.5, 2.6]], [[12.6, 15.4], [14.8, 13.2], [7.2, 15.8], [4.6, 15.5]]),
        line: `<path d="${torso}" fill="currentColor" stroke="none"/><path d="${hindThigh.d}" fill="currentColor" stroke="none"/><path d="${nearHind}"/><path d="${nearFore}"/><path d="${farFore}"/><path d="${farHind}"/><path d="${tail}"/>`,
        solid: {
          face: [torso, hindThigh.d],
          tubes: [
            [nearFore, 1.85], [nearHind, 1.8],
            [farFore, 1.6], [farHind, 1.6],
            [tail, 1.65]
          ]
        },
        duotone: {
          tone: [torso, hindThigh.d],
          secondary: [farFore, farHind, tail],
          line: `<path d="${torso}"/><path d="${hindThigh.d}" fill="currentColor" stroke="none"/><path d="${nearFore}"/><path d="${nearHind}"/>`
        }
      };
    }
};
