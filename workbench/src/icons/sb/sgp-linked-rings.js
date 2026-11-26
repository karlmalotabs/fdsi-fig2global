// Surgical-precision icon module: fdsi-sgp-linked-rings (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, circleD, arcPath, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-c-51-sgp-linked-rings",
  slug: "sgp-linked-rings",
  name: "#51. Same Game Parlay / SGP (2 Interlocking Chain Stadium Rings with Over/Under Crossing)",
  area: "sb",
  order: 84,
  desc: "2 interlocking circular rings at Left (9.0, 12.0, R=5.8) and Right (15.0, 12.0, R=5.8) with an authentic over/under weave knockout so they interlock cleanly.",
  meta: {
      "slug": "sgp-linked-rings",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Same Game Parlay (SGP) and linked multi-market combinations.",
      "tags": [
          "sgp",
          "same-game-parlay",
          "linked",
          "rings",
          "chain",
          "combo",
          "multi"
      ]
  },
  build: ({ s }) => {
      const rL = circleD(9.0, 12.0, 5.8);
      const rR = circleD(15.0, 12.0, 5.8);
      // Right ring passes OVER Left ring at the top intersection (12.0, 7.0) and Left ring passes OVER Right ring at the bottom intersection (12.0, 17.0):
      const topArcR = arcPath(15.0, 12.0, 5.8, 180, 270);
      const botArcL = arcPath(9.0, 12.0, 5.8, 0, 90);
      const uidS = "sgp6_" + (nextUid());
      const lineM = `<defs>` +
                    `<mask id="${uidS}a" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${topArcR}" fill="none" stroke="#000" stroke-width="${f(s * 2.3)}" stroke-linecap="round"/></mask>` +
                    `<mask id="${uidS}b" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${botArcL}" fill="none" stroke="#000" stroke-width="${f(s * 2.3)}" stroke-linecap="round"/></mask>` +
                    `</defs>` +
                    `<path d="${rL}" mask="url(#${uidS}a)"/>` +
                    `<path d="${rR}" mask="url(#${uidS}b)"/>`;
      // Solid mode: Left Donut Ring + Right Donut Ring with the same clean over/under weave!
      const donutL = circleD(9.0, 12.0, 6.4) + circleD(9.0, 12.0, 3.8);
      const donutR = circleD(15.0, 12.0, 6.4) + circleD(15.0, 12.0, 3.8);
      const haloR = circleD(15.0, 12.0, 7.8);
      return {
        keylines: drawKeylines([[9.0, 12, 5.8], [15.0, 12, 5.8]], [[9, 12], [15, 12]]),
        line: lineM,
        solid: {
          face: [donutL],
          holeExact: [haloR, circleD(15.0, 12.0, 3.8)],
          over: [donutR]
        },
        duotone: { tone: [rL, rR], line: lineM }
      };
    }
};
