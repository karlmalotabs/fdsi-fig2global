// Surgical-precision icon module: fdsi-goalie-mask (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-105-goalie-mask",
  slug: "goalie-mask",
  name: "#105. Ice Hockey Goalie Mask (Contoured Mask Shield + 2 Angled Eye Windows + Vent Slots)",
  area: "sb",
  order: 138,
  desc: "Contoured hockey goalie mask shield (x=4.4..19.6, y=3.4..20.6) with 2 inward-slanted eye openings and 2 breathing vent slots at the chin.",
  meta: {
      "slug": "goalie-mask",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Hockey goaltender saves, shutouts, and goalie player prop markets.",
      "tags": [
          "goalie",
          "mask",
          "goaltender",
          "hockey",
          "saves",
          "shutout",
          "nhl"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.65, 1.6);
      const maskPts = [[6.4, 3.6], [17.6, 3.6], [19.6, 10.4], [16.8, 18.4], [12.0, 20.6], [7.2, 18.4], [4.4, 10.4]];
      const M = bloatPoly(maskPts, [cr, cr, 1.4, 1.2, 1.2, 1.2, 1.4], b * 0.4, { minEdge: 2.5 });
      const eyeL = bloatPoly([[6.8, 9.2], [10.6, 10.2], [10.6, 12.6], [6.8, 11.8]], 0.45, 0, { minEdge: 1.5 });
      const eyeR = bloatPoly([[17.2, 9.2], [17.2, 11.8], [13.4, 12.6], [13.4, 10.2]], 0.45, 0, { minEdge: 1.5 });
      const vents = `M10.2 15.4V17.4M13.8 15.4V17.4`;
      const vHole1 = capsule(10.2, 15.2, 10.2, 17.6, 0.82);
      const vHole2 = capsule(13.8, 15.2, 13.8, 17.6, 0.82);
      return {
        keylines: drawKeylines([], M.anchors),
        line: `<path d="${M.d}"/><path d="${eyeL.d}" fill="currentColor" stroke="none"/><path d="${eyeR.d}" fill="currentColor" stroke="none"/><path d="${vents}"/>`,
        solid: {
          fill: [M.d],
          holeExact: [eyeL.d, eyeR.d, vHole1, vHole2]
        },
        duotone: { tone: [M.d], secondary: [vents], line: `<path d="${M.d}"/><path d="${eyeL.d}" fill="currentColor" stroke="none"/><path d="${eyeR.d}" fill="currentColor" stroke="none"/><path d="${vents}"/>` }
      };
    }
};
