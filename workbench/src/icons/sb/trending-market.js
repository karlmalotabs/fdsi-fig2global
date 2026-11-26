// Surgical-precision icon module: fdsi-trending-market (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, roundOpen, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-52-trending-market",
  slug: "trending-market",
  name: "#52. Hot / Trending Market (2 Separate Shapes — Rising Trend Arrow + Base Horizon Bar)",
  area: "sb",
  order: 85,
  desc: "Bold rising market trend polyline (M3.6 15.6 L9.4 9.8 L13.4 13.8 L20.2 7.0) with arrowhead at (20.4, 6.8) + separate horizontal baseline bar at y=20.0.",
  meta: {
      "slug": "trending-market",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Popular trending bets and fast-moving market movers.",
      "tags": [
          "trending",
          "popular",
          "chart",
          "rising",
          "market-mover",
          "hot"
      ]
  },
  build: ({ b, r }) => {
      const trend = roundOpen([[3.6, 15.6], [9.4, 9.8], [13.4, 13.8], [20.2, 7.0]], Math.min(r * 0.4, 0.8));
      const head = `M15.0 6.8H20.4V12.2`;
      const baseLine = `M3.6 20.0H20.4`;
      // Solid mode: Filled rising area polygon under the trend curve + separate base bar pill!
      const areaPoly = bloatPoly([
        [3.6, 16.4], [9.4, 10.6], [13.4, 14.6], [20.4, 7.6], [20.4, 16.8], [3.6, 16.8]
      ], [0.6, 0.7, 0.7, 0.6, 0.9, 0.9], b * 0.25, { minEdge: 2.0 });
      const basePill = capsule(3.6, 20.0, 20.4, 20.0, 1.05);
      return {
        keylines: drawKeylines([], [[3.6, 15.6], [9.4, 9.8], [13.4, 13.8], [20.4, 6.8]]),
        line: `<path d="${trend}"/><path d="${head}"/><path d="${baseLine}"/>`,
        solid: { face: [areaPoly.d, basePill] },
        duotone: { tone: [areaPoly.d], secondary: [baseLine], line: `<path d="${trend}"/><path d="${head}"/><path d="${baseLine}"/>` }
      };
    }
};
