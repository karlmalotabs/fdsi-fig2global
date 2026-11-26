// Surgical-precision icon module: fdsi-rowing-scull (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-101-rowing-scull",
  slug: "rowing-scull",
  name: "#101. Rowing / Scull (Solid Matches Line with Solid Head — Stick-Figure Rower + Boat + Oar)",
  area: "sb",
  order: 134,
  desc: "FIXED SOLID: Solid now keeps the exact same crisp boat hull & oar geometry as Line mode while filling the rower's head solid (matching Road Cycling & Skiing)!",
  meta: {
      "slug": "rowing-scull",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Olympic rowing, single sculls, eights, and University Boat Race markets.",
      "tags": [
          "rowing",
          "scull",
          "oar",
          "boat",
          "crew",
          "regatta",
          "water-sports"
      ]
  },
  build: () => {
      const headLine = circleD(10.8, 5.4, 2.1);
      const headSolid = circleD(10.8, 5.4, 2.35);
      const torso = tangentHull2([9.8, 9.4], 1.65, [7.6, 13.6], 1.15);
      const arm = `M9.8 9.4L14.4 10.6`;
      const hull = `M2.6 15.6Q12.0 18.8 21.4 15.6Z`;
      // Split the hull stroke cleanly around the diagonal oar (x=14.4..18.0) so zero mask is needed and Solid/Line share the exact same crisp paths!
      const hullLeft  = `M2.6 15.6H14.2M2.6 15.6Q8.0 17.5 14.6 17.2`;
      const hullRight = `M18.0 15.6H21.4Q19.8 16.4 18.2 16.8`;
      const oar = `M13.6 9.6L18.4 19.6`;
      return {
        keylines: drawKeylines([[10.8, 5.4, 2.1], [9.8, 9.4, 1.65], [7.6, 13.6, 1.15]], [[2.6, 15.6], [21.4, 15.6], [18.4, 19.6]]),
        line: `<path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${arm}"/><path d="${hullLeft}"/><path d="${hullRight}"/><path d="${oar}"/>`,
        solid: {
          face: [headSolid, torso.d],
          stroke: [arm, hullLeft, hullRight, oar]
        },
        duotone: {
          tone: [hull, torso.d],
          secondary: [oar, arm],
          line: `<path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${arm}"/><path d="${hullLeft}"/><path d="${hullRight}"/><path d="${oar}"/>`
        }
      };
    }
};
