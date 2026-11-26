// Surgical-precision icon module: fdsi-road-cycling (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "road-cycling",
  slug: "road-cycling",
  name: "Road Cycling (Tapered Tangent-Hull Torso & Limbs — Open Wheels in All Modes!)",
  area: "sb",
  order: 202,
  desc: "FIXED WHEELS: Bike wheels stay open outlined rings in Duotone & Color mode while the cyclist's helmeted head and aero torso are colored!",
  meta: {
      "slug": "road-cycling",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Tour de France, Giro d'Italia, andUCI World Tour road cycling stage markets.",
      "tags": [
          "cycling",
          "bike",
          "bicycle",
          "tour-de-france",
          "peloton",
          "uci"
      ]
  },
  build: () => {
      const wL = circleD(5.8, 17.2, 3.5), wR = circleD(18.2, 17.2, 3.5);
      const head = circleD(15.2, 4.6, 2.2);
      const torsoHull = tangentHull2([12.4, 7.8], 1.35, [8.0, 11.2], 1.0);
      const arm = `M12.4 7.8L15.0 10.6H18.0`;
      const leg = roundOpen([[8.0, 11.2], [12.0, 14.0], [10.2, 18.0]], 1.4);
      const lineStr = `<path d="${wL}"/><path d="${wR}"/><path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${arm}"/><path d="${leg}" stroke-width="2.0"/>`;
      return {
        keylines: drawKeylines([[5.8, 17.2, 3.5], [18.2, 17.2, 3.5], [15.2, 4.6, 2.2], [12.4, 7.8, 1.35], [8.0, 11.2, 1.0]], torsoHull.pts),
        line: lineStr,
        solid: {
          fill: [head],
          face: [torsoHull.d],
          tubes: [[arm, 1.85], [leg, 2.1]],
          stroke: [wL, wR]
        },
        duotone: {
          tone: [head],
          secondary: [wL, wR],
          line: `<path d="${head}"/><path d="${torsoHull.d}" fill="currentColor" stroke="none"/><path d="${arm}"/><path d="${leg}" stroke-width="2.0"/>`
        },
        color: (dark) => `<path d="${head}" fill="${dark ? '#b45309' : '#fde047'}" stroke="none"/><path d="${wL}" stroke="${dark ? '#38bdf8' : '#0284c7'}"/><path d="${wR}" stroke="${dark ? '#38bdf8' : '#0284c7'}"/><path d="${head}"/><path d="${torsoHull.d}" fill="${dark ? '#fb7185' : '#e11d48'}" stroke="none"/><path d="${arm}"/><path d="${leg}" stroke-width="2.0"/>`
      };
    }
};
