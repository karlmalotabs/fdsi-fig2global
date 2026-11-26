// Surgical-precision icon module: fdsi-ice-skate (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-104-ice-skate",
  slug: "ice-skate",
  name: "#104. Figure Skating / Ice Skate (2 Separate Padded Shapes — High-Ankle Boot + Rocker Blade)",
  area: "sb",
  order: 137,
  desc: "High-ankle bloated skate boot (x=5.0..19.2, y=3.6..15.2) + steel ice blade below (x=4.2..20.4, y=18.8) with front curved toe-loop and vertical stanchions.",
  meta: {
      "slug": "ice-skate",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Figure skating, speed skating, and short-track winter ice markets.",
      "tags": [
          "ice-skate",
          "skating",
          "blade",
          "boot",
          "figure-skating",
          "speed-skating",
          "winter"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      // L-shaped skate boot polygon (ankle cuff x=5.2..11.8, y=3.8..10.2 curving forward to rounded toe at x=19.2, y=10.2..15.0):
      const bootPts = [
        [5.2, 3.8], [11.8, 3.8], [12.4, 9.6],
        [18.8, 10.6], [19.2, 15.0], [5.2, 15.0]
      ];
      const boot = bloatPoly(bootPts, [cr, cr, 0.6, 1.5, cr, cr], b * 0.35, { minEdge: 2.0 });
      const blade = `M7.4 15.0V18.8M15.4 15.0V18.8M4.2 18.8H18.4A2.0 2.0 0 0 0 20.4 16.8`;
      return {
        keylines: drawKeylines([], [...boot.anchors, [4.2, 18.8], [18.4, 18.8]]),
        line: `<path d="${boot.d}"/><path d="${blade}"/>`,
        solid: {
          fill: [boot.d],
          stroke: [blade]
        },
        duotone: { tone: [boot.d], secondary: [blade], line: `<path d="${boot.d}"/><path d="${blade}"/>` }
      };
    }
};
