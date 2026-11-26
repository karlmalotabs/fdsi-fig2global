// Surgical-precision icon module: fdsi-football-soccer (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "soccer-ball",
  slug: "football-soccer",
  name: "3D Isometric Telstar Ball (Continuous Sphere + Pentagon & Seam Cutouts)",
  area: "sb",
  order: 207,
  desc: "FIXED SOLID: Matches Boxing Glove / Shield pattern — continuous r=9 sphere with central pentagon hole and curved spherical seam cuts.",
  meta: {
      "slug": "football-soccer",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Premier League, Champions League, and World Cup football (soccer) markets.",
      "tags": [
          "football",
          "soccer",
          "ball",
          "premier-league",
          "champions-league",
          "fifa"
      ]
  },
  build: ({ b, r }) => {
      const cx = 12, cy = 12, R = 9;
      const ball = circleD(cx, cy, R);
      const pPts = [[11.2, 7.2], [14.2, 9.4], [13.0, 13.0], [9.2, 13.0], [8.0, 9.4]];
      const P5 = bloatPoly(pPts, Math.min(r * 0.35, 0.7), b * 0.4, { minEdge: 2.2, inset: 0.4 });
      const A = P5.anchors;
      const rPts = [-108, -5, 72, 130, -152].map(d => polar(cx, cy, R, d));
      const seams = `M${P(A[0])}Q10.5 4.8 ${P(rPts[0])}M${P(A[1])}Q17.5 9.8 ${P(rPts[1])}M${P(A[2])}Q15.2 16.5 ${P(rPts[2])}M${P(A[3])}Q6.8 15.8 ${P(rPts[3])}M${P(A[4])}Q5.5 8.2 ${P(rPts[4])}`;
      return {
        keylines: drawKeylines([[12, 12, 9], [11.1, 10.5, 3.5]], [...A, ...rPts]),
        line: `<path d="${ball}"/><path d="${P5.d}" fill="currentColor" stroke="none"/><path d="${seams}"/>`,
        solid: { fill: [ball], hole: [P5.d], cut: [seams] },
        duotone: { tone: [ball], secondary: [seams], line: `<path d="${ball}"/><path d="${P5.d}" fill="currentColor" stroke="none"/>` }
      };
    }
};
