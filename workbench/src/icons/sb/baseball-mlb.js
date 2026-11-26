// Surgical-precision icon module: fdsi-baseball-mlb (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, arcPath, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b-23-baseball-mlb",
  slug: "baseball-mlb",
  name: "#23. Baseball / MLB (R=9.0 Sphere + 2 Symmetric C-Curve Stitching Seams)",
  area: "sb",
  order: 56,
  desc: "Exact R=9.0 sphere with 2 symmetric C-curve stitching arcs centered at (3.2, 12) and (20.8, 12), clipped inside the ball boundary.",
  meta: {
      "slug": "baseball-mlb",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "MLB, NPB, and international baseball moneyline, run line, and total markets.",
      "tags": [
          "baseball",
          "mlb",
          "ball",
          "stitches",
          "home-run",
          "inning",
          "pitcher"
      ]
  },
  build: () => {
      const ball = circleD(12.0, 12.0, 9.0);
      const ballSolid = circleD(12.0, 12.0, 9.2);
      const seamL = arcPath(3.2, 12.0, 6.8, -56, 56);
      const seamR = arcPath(20.8, 12.0, 6.8, 124, 236);
      const ticksL = `M6.6 8.2L8.4 9.0M7.4 12.0H9.4M6.6 15.8L8.4 15.0`;
      const ticksR = `M17.4 8.2L15.6 9.0M16.6 12.0H14.6M17.4 15.8L15.6 15.0`;
      const uidB = "bb6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidB}"><path d="${ball}"/></clipPath></defs>` +
                    `<path d="${ball}"/><g clip-path="url(#${uidB})"><path d="${seamL}"/><path d="${seamR}"/><path d="${ticksL}"/><path d="${ticksR}"/></g>`;
      return {
        keylines: drawKeylines([[12, 12, 9.0], [3.2, 12, 6.8], [20.8, 12, 6.8]], [[12, 12]]),
        line: lineM,
        solid: { fill: [ballSolid], cut: [seamL, seamR] },
        duotone: { tone: [ball], secondary: [seamL, seamR, ticksL, ticksR], line: lineM }
      };
    }
};
