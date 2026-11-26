// Surgical-precision icon module: fdsi-triathlon-loops (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-117-triathlon-loops",
  slug: "triathlon-loops",
  name: "#117. Triathlon (3 Trefoil-Arranged Motion Rings — Swim · Bike · Run)",
  area: "sb",
  order: 150,
  desc: "3 symmetric interlocking circular discipline rings at Top (12.0, 7.8, R=4.4), Bottom-Left (8.2, 14.4, R=4.4), and Bottom-Right (15.8, 14.4, R=4.4).",
  meta: {
      "slug": "triathlon-loops",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Ironman and Olympic triathlon (swim, bike, run) endurance events.",
      "tags": [
          "triathlon",
          "ironman",
          "swim-bike-run",
          "rings",
          "endurance",
          "olympic"
      ]
  },
  build: () => {
      const cT = circleD(12.0, 7.8, 4.4);
      const cL = circleD(8.2,  14.4, 4.4);
      const cR = circleD(15.8, 14.4, 4.4);
      // Solid: 3 distinct padded circular discipline discs (like Shamrock Clover!) with center negative-space holes!
      const dT = circleD(12.0, 6.8, 3.8) + circleD(12.0, 6.8, 1.7);
      const dL = circleD(7.6,  14.8, 3.8) + circleD(7.6,  14.8, 1.7);
      const dR = circleD(16.4, 14.8, 3.8) + circleD(16.4, 14.8, 1.7);
      return {
        keylines: drawKeylines([[12, 7.8, 4.4], [8.2, 14.4, 4.4], [15.8, 14.4, 4.4]], [[12, 7.8], [8.2, 14.4], [15.8, 14.4]]),
        line: `<path d="${cT}"/><path d="${cL}"/><path d="${cR}"/>`,
        solid: { face: [dT, dL, dR] },
        duotone: { tone: [cT, cL, cR], line: `<path d="${cT}"/><path d="${cL}"/><path d="${cR}"/>` }
      };
    }
};
