// Surgical-precision icon module: fdsi-golf-pin (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-26-golf-pin",
  slug: "golf-pin",
  name: "#26. Golf Flag & Putting Green (Triangular Pennant + Pin + Putting Hole Arc)",
  area: "sb",
  order: 59,
  desc: "Vertical flagstick (x=8.5, y=3.5..19.5) + bloated pennant flag triangle pointing right to (19.5, 7.8) + elliptical putting green base arc.",
  meta: {
      "slug": "golf-pin",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "PGA Tour, Majors, and Ryder Cup golf outright and 3-ball markets.",
      "tags": [
          "golf",
          "pin",
          "flag",
          "green",
          "hole",
          "pga",
          "masters"
      ]
  },
  build: ({ b, r }) => {
      const flag = bloatPoly([[8.5, 3.8], [19.4, 7.8], [8.5, 11.8]], [0.5, Math.min(r * 0.45, 0.9), 0.5], b * 0.35, { minEdge: 2.5 });
      const flagSolid = bloatPoly([[10.2, 3.8], [19.8, 7.8], [10.2, 11.8]], [0.7, 0.9, 0.7], b * 0.35, { minEdge: 2.5 });
      const pole = `M8.5 3.6V19.6`;
      const green = `M3.8 18.2A8.2 2.6 0 1 0 20.2 18.2`;
      return {
        keylines: drawKeylines([], [[8.5, 3.8], [19.4, 7.8], [8.5, 11.8], [8.5, 19.6]]),
        line: `<path d="${flag.d}"/><path d="${pole}"/><path d="${green}"/>`,
        solid: {
          face: [flagSolid.d],
          stroke: [pole, green]
        },
        duotone: { tone: [flag.d], secondary: [pole, green], line: `<path d="${flag.d}"/><path d="${pole}"/><path d="${green}"/>` }
      };
    }
};
