// Surgical-precision icon module: fdsi-roulette-wheel (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "roulette-wheel",
  slug: "roulette-wheel",
  name: "Roulette Wheel (Squash-Style Donut Window + Cross Spokes in Solid)",
  area: "gx",
  order: 214,
  desc: "FIXED SOLID: Matches Squash Racket — filled outer wheel with a clean interior donut window, solid center turret, and 4 radial spokes.",
  meta: {
      "slug": "roulette-wheel",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "European, American, and Lightning Roulette live and RNG wheel games.",
      "tags": [
          "roulette",
          "wheel",
          "table-games",
          "casino",
          "spin",
          "pockets"
      ]
  },
  build: () => {
      const outer = circleD(12, 12, 9), inner = circleD(12, 12, 3.0);
      const pts = [45, 135, -45, -135].flatMap(d => [polar(12, 12, 3.0, d), polar(12, 12, 9, d)]);
      const spokes = [45, 135, -45, -135].map(deg => `M${P(polar(12, 12, 3.0, deg))}L${P(polar(12, 12, 9, deg))}`).join("");
      const solidSpokes = [45, 135, -45, -135].map(deg => `M${P(polar(12, 12, 3.0, deg))}L${P(polar(12, 12, 6.2, deg))}`).join("");
      return {
        keylines: drawKeylines([[12, 12, 9], [12, 12, 3.0]], pts),
        line: `<path d="${outer}"/><path d="${inner}"/><path d="${spokes}"/>`,
        solid: {
          fill: [outer],
          holeExact: [circleD(12, 12, 6.0)],
          over: [circleD(12, 12, 2.8)],
          stroke: [solidSpokes]
        },
        duotone: { tone: [outer], secondary: [spokes], line: `<path d="${outer}"/><path d="${inner}" fill="currentColor"/>` }
      };
    }
};
