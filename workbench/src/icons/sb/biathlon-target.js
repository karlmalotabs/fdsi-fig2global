// Surgical-precision icon module: fdsi-biathlon-target (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-111-biathlon-target",
  slug: "biathlon-target",
  name: "#111. Biathlon / Shooting Target Plate (Bloated Housing + 3 Knockdown Target Windows + Stand)",
  area: "sb",
  order: 144,
  desc: "Landscape biathlon target housing (x=2.8..21.2, y=6.2..15.8) containing 3 bold knockdown target discs (r=1.85 at x=6.8, 12.0, 17.2) + base stand.",
  meta: {
      "slug": "biathlon-target",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Winter biathlon cross-country skiing and rifle shooting target markets.",
      "tags": [
          "biathlon",
          "target",
          "shooting",
          "winter-sports",
          "knockdown",
          "ibu"
      ]
  },
  build: ({ b, r }) => {
      const B = bloatRect({ x: 2.8, y: 6.2, w: 18.4, h: 9.6, r: Math.min(r + 0.3, 2.1), b });
      const d1 = circleD(7.0,  11.0, 1.75);
      const d2 = circleD(12.0, 11.0, 1.75);
      const d3 = circleD(17.0, 11.0, 1.75);
      const stand = `M12.0 15.8V20.0M8.2 20.0H15.8`;
      return {
        keylines: drawKeylines([[7.0, 11.0, 1.75], [12.0, 11.0, 1.75], [17.0, 11.0, 1.75]], B.anchors),
        line: `<path d="${B.d}"/><path d="${d1}"/><path d="${d2}" fill="currentColor" stroke="none"/><path d="${d3}"/><path d="${stand}"/>`,
        solid: {
          fill: [B.d],
          holeExact: [circleD(7.0, 11.0, 1.95), circleD(12.0, 11.0, 1.95), circleD(17.0, 11.0, 1.95)],
          stroke: [stand]
        },
        duotone: { tone: [B.d], secondary: [stand], line: `<path d="${B.d}"/><path d="${d1}"/><path d="${d2}" fill="currentColor" stroke="none"/><path d="${d3}"/><path d="${stand}"/>` }
      };
    }
};
