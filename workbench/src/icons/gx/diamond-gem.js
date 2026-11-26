// Surgical-precision icon module: fdsi-diamond-gem (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, bloatPoly, facePoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "diamond-gem",
  slug: "diamond-gem",
  name: "High-Roller Diamond Gem (6 Individual facePoly Facet Shapes in Solid!)",
  area: "gx",
  order: 216,
  desc: "FIXED SOLID (Zero Knocked-Out Lines!): Solid is built from 6 independent, rounded polygon facet shapes via facePoly() separated by a 1.6px padding gap!",
  meta: {
      "slug": "diamond-gem",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Gemstone cluster slots, high-volatility games, and diamond jackpot tiers.",
      "tags": [
          "diamond",
          "gem",
          "jewel",
          "crystal",
          "slots",
          "jackpot",
          "luxury"
      ]
  },
  build: ({ b, r, s }) => {
      const T0 = [6.5, 4.5], T1 = [17.5, 4.5], GR = [21.0, 9.5], B = [12.0, 20.5], GL = [3.0, 9.5];
      const G = bloatPoly([T0, T1, GR, B, GL], Math.min(r * 0.55, 1.3), b, { minEdge: 4.5 });
      const A = G.anchors;
      const gy = (A[4][1] + A[2][1]) / 2;
      const GM1 = [9.2, gy], GM2 = [14.8, gy];
      const girdle = `M${P(A[4])}L${P(A[2])}`;
      const facets = `M${P(A[0])}L${P(GM1)}L${P(A[3])}M${P(A[1])}L${P(GM2)}L${P(A[3])}`;

      // SOLID MODE: 6 Individual Rounded Facet Shapes via facePoly (outer edges offset -h, shared inner seams offset +h, every corner rounded by rI = 0.55)!
      const h = s * 0.44, rO = Math.min(r * 0.55, 1.2) + h, rI = 0.5;
      // Top 3 crown facets: Left [T0, GM1, GL], Center [T0, T1, GM2, GM1], Right [T1, GR, GM2]
      const fTopL = facePoly([T0, GM1, GL],     { offset: [h, h, -h],     r: [rO, rI, rO],     bulge: 0 });
      const fTopM = facePoly([T0, T1, GM2, GM1],{ offset: [-h, h, h, h],  r: [rI, rI, rI, rI], bulge: [b*0.5, 0, 0, 0] });
      const fTopR = facePoly([T1, GR, GM2],     { offset: [-h, h, h],     r: [rO, rO, rI],     bulge: 0 });
      // Bottom 3 pavilion facets: Left [GL, GM1, B], Center [GM1, GM2, B], Right [GM2, GR, B]
      const fBotL = facePoly([GL, GM1, B],      { offset: [h, h, -h],     r: [rO, rI, rO],     bulge: [0, 0, b*0.4] });
      const fBotM = facePoly([GM1, GM2, B],     { offset: [h, h, h],      r: [rI, rI, rI],     bulge: 0 });
      const fBotR = facePoly([GM2, GR, B],      { offset: [h, -h, h],     r: [rI, rO, rO],     bulge: [0, b*0.4, 0] });

      return {
        keylines: drawKeylines([], [...A, GM1, GM2]),
        line: `<path d="${G.d}"/><path d="${girdle}${facets}"/>`,
        solid: {
          // 6 separate, self-contained rounded facet shapes — ZERO mask cut lines!
          faces: [fTopL, fTopM, fTopR, fBotL, fBotM, fBotR]
        },
        duotone: { tone: [G.d], secondary: [girdle, facets], line: `<path d="${G.d}"/>` }
      };
    }
};
