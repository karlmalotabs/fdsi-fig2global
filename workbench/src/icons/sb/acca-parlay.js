// Surgical-precision icon module: fdsi-acca-parlay (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, roundOpen, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-acca-parlay",
  slug: "acca-parlay",
  name: "Accumulator / Parlay (2-Step Rising Trend Arrow + 2 Anchor Nodes)",
  area: "sb",
  order: 30,
  desc: "Bold rising multi-leg parlay trajectory (M4.2 17.8 L10.2 11.8 L14.0 15.2 L20.0 6.8) + bold arrowhead at (20.2, 6.5). Clean, spacious, zero cramped circles.",
  meta: {
      "slug": "acca-parlay",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Accumulator (Acca) and multi-leg parlay bets across multiple events.",
      "tags": [
          "acca",
          "accumulator",
          "parlay",
          "multi",
          "combo",
          "trend",
          "legs"
      ]
  },
  build: ({ r }) => {
      const trend = roundOpen([[4.0, 18.0], [10.0, 11.8], [13.8, 15.4], [20.0, 6.8]], Math.min(r * 0.4, 0.8));
      const head = `M14.8 6.6H20.2V12.0`;
      const dot1 = circleD(4.0, 18.0, 1.8);
      const dot2 = circleD(10.0, 11.8, 1.8);
      // In Solid mode, fill a bold rising polygon card below or bold nodes + thick trend stroke
      const badge = bloatRect({ x: 3.0, y: 4.0, w: 18.0, h: 16.0, r: 2.2, b: 0.25 });
      const trendCut = roundOpen([[5.8, 16.2], [10.2, 11.6], [13.4, 14.6], [18.0, 8.4]], 0.7);
      const headCut = `M14.2 8.2H18.2V12.2`;
      return {
        keylines: drawKeylines([], [[4.0, 18.0], [10.0, 11.8], [13.8, 15.4], [20.0, 6.8]]),
        line: `<path d="${trend}"/><path d="${head}"/><path d="${dot1}" fill="currentColor" stroke="none"/><path d="${dot2}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [badge.d],
          cut: [trendCut, headCut]
        },
        duotone: { tone: [badge.d], secondary: [trend, head], line: `<path d="${trend}"/><path d="${head}"/>` }
      };
    }
};
