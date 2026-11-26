// Surgical-precision icon module: fdsi-live-stream (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, capsule, bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-live-stream",
  slug: "live-stream",
  name: "Live Stream / Watch & Bet (2 Separate Padded Shapes — Screen + Stand)",
  area: "sb",
  order: 22,
  desc: "2 elements only: Bloated widescreen monitor (x=3.0..21.0, y=3.8..16.8) with a large centered Play triangle window + separate padded base bar below (y=19.2..21.0).",
  meta: {
      "slug": "live-stream",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Watch live match video stream directly inside the sportsbook event view.",
      "tags": [
          "live-stream",
          "watch",
          "video",
          "tv",
          "play",
          "monitor",
          "broadcast"
      ]
  },
  build: ({ b, r }) => {
      const S = bloatRect({ x: 3.0, y: 3.8, w: 18.0, h: 13.0, r: Math.min(r + 0.4, 2.4), b });
      // Large, unmistakable play triangle centered at (12.3, 10.3)
      const P = bloatPoly([[9.6, 7.2], [15.8, 10.3], [9.6, 13.4]], Math.min(r * 0.4, 0.8), b * 0.25, { minEdge: 3.0 });
      const PSolid = bloatPoly([[9.4, 6.9], [16.2, 10.3], [9.4, 13.7]], 0.85, 0.15, { minEdge: 3.0 });
      const standLine = `M7.5 20.0H16.5`;
      // Solid: 2nd separate padded pill shape for the base (2.2px gap below screen!)
      const standPill = capsule(7.5, 19.8, 16.5, 19.8, 1.15);
      return {
        keylines: drawKeylines([], [...S.anchors, ...P.anchors]),
        line: `<path d="${S.d}"/><path d="${P.d}"/><path d="${standLine}"/>`,
        solid: {
          face: [S.d, standPill],
          holeExact: [PSolid.d]
        },
        duotone: { tone: [S.d], secondary: [P.d, standLine], line: `<path d="${S.d}"/><path d="${P.d}"/><path d="${standLine}"/>` }
      };
    }
};
