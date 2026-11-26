// Surgical-precision icon module: fdsi-motocross-bike (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-115-speedway-wheel",
  slug: "motocross-bike",
  name: "#115. Speedway / Motocross Dirt Bike (Open Wheels + Colored Rider in Duotone & Color!)",
  area: "sb",
  order: 148,
  desc: "FIXED WHEELS: Removed wheels from `duotone.tone` so the dirt-bike wheels stay open rings in Duotone and Color!",
  meta: {
      "slug": "motocross-bike",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Speedway GP, MXGP motocross, and supercross dirt-bike racing.",
      "tags": [
          "speedway",
          "motocross",
          "dirt-bike",
          "motorcycle",
          "mxgp",
          "supercross"
      ]
  },
  build: () => {
      const wR = circleD(5.6,  17.2, 3.3);
      const wF = circleD(18.4, 14.8, 3.3);
      const headLine  = circleD(11.4, 4.4, 2.0);
      const headSolid = circleD(11.4, 4.4, 2.25);
      const torso = tangentHull2([10.2, 8.0], 1.45, [7.8, 12.0], 1.05);
      const bike =
        `M10.2 8.0L14.6 7.8` +
        `M14.2 6.8L18.4 14.8` +
        `M15.4 9.6L20.6 9.6` +
        `M5.6 17.2L10.4 13.0L15.4 9.6` +
        `M4.0 12.2L10.4 13.0`;
      const lineStr = `<path d="${wR}"/><path d="${wF}"/><path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${bike}"/>`;
      return {
        keylines: drawKeylines([[5.6, 17.2, 3.3], [18.4, 14.8, 3.3], [11.4, 4.4, 2.0]], [[14.2, 6.8], [20.6, 9.6], [4.0, 12.2]]),
        line: lineStr,
        solid: {
          face: [headSolid, torso.d],
          stroke: [wR, wF, bike]
        },
        duotone: {
          tone: [headLine],
          secondary: [wR, wF, bike],
          line: `<path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/>`
        },
        color: (dark) => `<path d="${headLine}" fill="${dark ? '#b45309' : '#fde047'}" stroke="none"/><path d="${wR}" stroke="${dark ? '#fb923c' : '#ea580c'}"/><path d="${wF}" stroke="${dark ? '#fb923c' : '#ea580c'}"/><path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${bike}"/>`
      };
    }
};
