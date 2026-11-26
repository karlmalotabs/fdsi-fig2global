// Surgical-precision icon module: fdsi-formula-1-car (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "formula-one",
  slug: "formula-1-car",
  name: "Formula 1 Bolide (Symmetric Top-Down Aero Plan)",
  area: "sb",
  order: 211,
  desc: "Wide swept front wing, needle nose cone, 4 exposed racing slicks on wishbone struts, coke-bottle sidepods, cockpit helmet, and rear wing.",
  meta: {
      "slug": "formula-1-car",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Formula 1 open-wheel bolide for Grand Prix race, podium, and fastest lap.",
      "tags": [
          "formula-1",
          "f1",
          "bolide",
          "race-car",
          "motorsport",
          "grand-prix"
      ]
  },
  build: ({ b }) => {
      const bodyPts = [
        [10.8, 3.2], [13.2, 3.2], [13.6, 9.2], [15.8, 11.0],
        [15.2, 16.5], [13.5, 18.2], [10.5, 18.2], [8.8, 16.5],
        [8.2, 11.0], [10.4, 9.2]
      ];
      const B = bloatPoly(bodyPts, [0.5, 0.5, 0.8, 1.4, 1.4, 0.8, 0.8, 1.4, 1.4, 0.8], b * 0.5, { minEdge: 3.0 });
      const frontWing = `M4.5 4.8L9.5 3.2H14.5L19.5 4.8`;
      const rearWing = `M6.0 20.5H18.0`;
      const rearWingFill = `M6.0 19.2H18.0V21.2H6.0Z`;
      const tFL = bloatRect({ x: 3.5, y: 6.5, w: 3.2, h: 4.5, r: 1.0, b: 0 });
      const tFR = bloatRect({ x: 17.3, y: 6.5, w: 3.2, h: 4.5, r: 1.0, b: 0 });
      const tRL = bloatRect({ x: 3.2, y: 14.2, w: 3.5, h: 5.0, r: 1.1, b: 0 });
      const tRR = bloatRect({ x: 17.3, y: 14.2, w: 3.5, h: 5.0, r: 1.1, b: 0 });
      const struts = `M6.7 8.8H10.4M13.6 8.8H17.3M6.7 16.8H9.2M14.8 16.8H17.3`;
      const helmet = circleD(12, 12.8, 1.35);
      return {
        keylines: drawKeylines([[12, 12.8, 1.35]], B.anchors),
        line: `<path d="${B.d}"/><path d="${frontWing}"/><path d="${rearWing}"/><path d="${struts}"/>` +
              `<path d="${tFL.d}" fill="currentColor" stroke="none"/><path d="${tFR.d}" fill="currentColor" stroke="none"/>` +
              `<path d="${tRL.d}" fill="currentColor" stroke="none"/><path d="${tRR.d}" fill="currentColor" stroke="none"/>` +
              `<path d="${helmet}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [B.d],
          holeExact: [circleD(12, 12.8, 1.6)],
          face: [rearWingFill, tFL.d, tFR.d, tRL.d, tRR.d],
          stroke: [frontWing, struts]
        },
        duotone: {
          tone: [B.d],
          secondary: [frontWing, rearWing, struts],
          line: `<path d="${B.d}"/><path d="${tFL.d}" fill="currentColor" stroke="none"/><path d="${tFR.d}" fill="currentColor" stroke="none"/>` +
                `<path d="${tRL.d}" fill="currentColor" stroke="none"/><path d="${tRR.d}" fill="currentColor" stroke="none"/><path d="${helmet}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
