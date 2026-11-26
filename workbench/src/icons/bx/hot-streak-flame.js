// Surgical-precision icon module: fdsi-hot-streak-flame (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "hot-flame",
  slug: "hot-streak-flame",
  name: "Hot Streak Flame (Squash-Style Inner Teardrop Window in Solid)",
  area: "bx",
  order: 198,
  desc: "FIXED SOLID: Uses the approved Squash Racket solid pattern — filled outer flame hull with a bold, rounded inner flame window.",
  meta: {
      "slug": "hot-streak-flame",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Trending hot game, player winning streak, or popular market indicator.",
      "tags": [
          "flame",
          "fire",
          "hot",
          "trending",
          "popular",
          "streak",
          "burn"
      ]
  },
  build: () => {
      const flame =
        `M5.5 14.0` +
        `A6.5 6.5 0 0 0 18.5 14.0` +
        `A11.5 11.5 0 0 0 13.0 2.8` +
        `A6.5 6.5 0 0 0 10.2 9.8` +
        `A4.5 4.5 0 0 1 7.8 6.8` +
        `A9.5 9.5 0 0 0 5.5 14.0Z`;
      const coreLine =
        `M9.2 15.0A2.8 2.8 0 0 0 14.8 15.0A5.5 5.5 0 0 0 12.0 9.8A5.5 5.5 0 0 0 9.2 15.0Z`;
      const coreHole =
        `M8.6 15.0A3.4 3.4 0 0 0 15.4 15.0A6.2 6.2 0 0 0 12.0 9.0A6.2 6.2 0 0 0 8.6 15.0Z`;
      return {
        keylines: drawKeylines([[12, 14.0, 6.5], [12, 15.0, 2.8]], [[5.5, 14.0], [18.5, 14.0], [13.0, 2.8], [7.8, 6.8]]),
        line: `<path d="${flame}"/><path d="${coreLine}"/>`,
        solid: { fill: [flame], holeExact: [coreHole] },
        duotone: { tone: [flame], secondary: [coreLine], line: `<path d="${flame}"/><path d="${coreLine}" fill="currentColor" stroke="none"/>` }
      };
    }
};
