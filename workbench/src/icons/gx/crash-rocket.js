// Surgical-precision icon module: fdsi-crash-rocket (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "crash-rocket",
  slug: "crash-rocket",
  name: "Crash Game Rocket (Intersecting Ogive Arcs + Porthole)",
  area: "gx",
  order: 222,
  desc: "Pointed gothic-arch rocket hull formed by two intersecting r=14 circular arcs at 45° + delta fins + circular porthole window.",
  meta: {
      "slug": "crash-rocket",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Crash multiplier arcade games where players cash out before the rocket explodes.",
      "tags": [
          "crash",
          "rocket",
          "multiplier",
          "arcade",
          "instant-game",
          "blast",
          "space"
      ]
  },
  build: () => {
      // Fuselage ogive tilted at 45° from tail (6.5, 17.5) to nose cone apex (20.2, 3.8):
      const hull = `M6.5 14.0A13.5 13.5 0 0 1 20.2 3.8A13.5 13.5 0 0 1 10.0 17.5Z`;
      const fins = `M6.5 14.0L3.2 13.2L4.8 16.5M10.0 17.5L10.8 20.8L7.5 19.2`;
      const flame = `M5.5 16.5L3.0 21.0L7.5 18.5`;
      const window = circleD(13.8, 10.2, 1.8);
      return {
        keylines: drawKeylines([[13.8, 10.2, 1.8]], [[20.2, 3.8], [6.5, 14.0], [10.0, 17.5]]),
        line: `<path d="${hull}"/><path d="${fins}"/><path d="${flame}"/><path d="${window}"/>`,
        solid: { fill: [hull], holeExact: [circleD(13.8, 10.2, 2.1)], stroke: [fins, flame] },
        duotone: { tone: [hull], secondary: [fins, flame], line: `<path d="${hull}"/><path d="${window}" fill="currentColor" stroke="none"/>` }
      };
    }
};
