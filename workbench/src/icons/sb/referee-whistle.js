// Surgical-precision icon module: fdsi-referee-whistle (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-43-referee-whistle",
  slug: "referee-whistle",
  name: "#43. Referee Whistle (Exact Circle Pea-Chamber + Tangent Mouthpiece + Sound Ticks)",
  area: "sb",
  order: 76,
  desc: "Constructed from Pea-Chamber Circle (9.0, 13.8, R=5.4) + horizontal upper mouthpiece extending to (20.6, 8.4)–(20.6, 12.2) with top air-vent notch + inner pea circle (r=2.0)!",
  meta: {
      "slug": "referee-whistle",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Match officiating markets, fouls committed, and referee stoppage specials.",
      "tags": [
          "whistle",
          "referee",
          "umpire",
          "foul",
          "official",
          "stoppage"
      ]
  },
  build: () => {
      // Exact geometric whistle silhouette:
      // Chamber center at (9.0, 13.8, R=5.4 -> top of circle is at y = 8.4, bottom at y = 19.2, left at x = 3.6!).
      // Top edge runs horizontally from (9.0, 8.4) to air-vent notch (13.4, 8.4) -> (14.6, 10.2) -> (15.8, 8.4) -> mouthpiece tip (20.4, 8.4),
      // down to (20.4, 11.8), then tangent back to the chamber circle at (14.2, 12.4)!
      const whistle =
        `M9.0 8.4` +
        `H13.2L14.4 10.2L15.6 8.4H19.6` +
        `A1.0 1.0 0 0 1 20.6 9.4` +
        `V11.2` +
        `A1.0 1.0 0 0 1 19.6 12.2` +
        `H14.16` +
        `A5.4 5.4 0 1 1 9.0 8.4Z`;
      const innerHole = circleD(9.0, 13.8, 2.1);
      const innerHoleSolid = circleD(9.0, 13.8, 2.4);
      const soundTicks = `M14.4 5.6V3.4M17.4 6.2L18.8 4.4M11.4 6.2L10.0 4.4`;
      return {
        keylines: drawKeylines([[9.0, 13.8, 5.4], [9.0, 13.8, 2.1]], [[9.0, 8.4], [20.6, 9.4], [14.4, 10.2]]),
        line: `<path d="${whistle}"/><path d="${innerHole}"/><path d="${soundTicks}"/>`,
        solid: {
          fill: [whistle],
          holeExact: [innerHoleSolid],
          stroke: [soundTicks]
        },
        duotone: { tone: [whistle], secondary: [innerHole, soundTicks], line: `<path d="${whistle}"/><path d="${innerHole}"/><path d="${soundTicks}"/>` }
      };
    }
};
