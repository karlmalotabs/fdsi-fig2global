// Surgical-precision icon module: fdsi-corner-flag (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-45-corner-flag",
  slug: "corner-flag",
  name: "#45. Corner Kick Flag (Waving Triangular Pennant + Slanted Pole + Touchline Base)",
  area: "sb",
  order: 78,
  desc: "Vertical/slanted corner flagpole (x=6.5, y=3.4..20.4) + bloated waving triangular pennant pointing right to (19.8, 7.6) + pitch touchline corner at base.",
  meta: {
      "slug": "corner-flag",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Total match corners, corner handicap, and race-to-X corners markets.",
      "tags": [
          "corner",
          "flag",
          "corner-kick",
          "set-piece",
          "football",
          "touchline"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const flag = bloatPoly([[6.5, 3.8], [19.6, 7.8], [6.5, 11.8]], [0.5, cr, 0.5], b * 0.4, {
        minEdge: 2.5,
        edgeBulge: [0.9, -0.6, 0]
      });
      const flagSolid = bloatPoly([[8.3, 3.8], [20.0, 7.8], [8.3, 11.8]], [0.75, cr, 0.75], b * 0.4, {
        minEdge: 2.5,
        edgeBulge: [0.9, -0.6, 0]
      });
      const pole = `M6.5 3.4V20.4M4.0 20.4H16.5`;
      return {
        keylines: drawKeylines([], [[6.5, 3.8], [19.6, 7.8], [6.5, 11.8], [6.5, 20.4]]),
        line: `<path d="${flag.d}"/><path d="${pole}"/>`,
        solid: {
          face: [flagSolid.d],
          stroke: [pole]
        },
        duotone: { tone: [flag.d], secondary: [pole], line: `<path d="${flag.d}"/><path d="${pole}"/>` }
      };
    }
};
