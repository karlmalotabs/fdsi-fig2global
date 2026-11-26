// Surgical-precision icon module: fdsi-keno-board (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-156-keno-board",
  slug: "keno-board",
  name: "#156. Keno / Lotto Number Grid (Bloated Board + 2×2 Number Spots — 2 Hit + 2 Open)",
  area: "gx",
  order: 189,
  desc: "Bloated Keno card (x=3.6..20.4, y=3.6..20.4) containing a 2×2 grid of lottery number circles (Top-Left & Bottom-Right filled hit spots, Top-Right & Bottom-Left open)!",
  meta: {
      "slug": "keno-board",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Keno and lottery number selection board with matched hit spots.",
      "tags": [
          "keno",
          "board",
          "grid",
          "numbers",
          "lottery",
          "picks",
          "draws"
      ]
  },
  build: ({ b, r }) => {
      const B = bloatRect({ x: 3.6, y: 3.6, w: 16.8, h: 16.8, r: Math.min(r + 0.4, 2.4), b });
      const cTL = circleD(8.8,  8.8,  2.0);
      const cTR = circleD(15.2, 8.8,  2.0);
      const cBL = circleD(8.8,  15.2, 2.0);
      const cBR = circleD(15.2, 15.2, 2.0);
      // In Solid mode: punch all 4 circles (`r=2.3`), and place solid inner dots (`r=1.0`) in Top-Left & Bottom-Right via `over`!
      return {
        keylines: drawKeylines([[8.8, 8.8, 2.0], [15.2, 8.8, 2.0], [8.8, 15.2, 2.0], [15.2, 15.2, 2.0]], B.anchors),
        line: `<path d="${B.d}"/><path d="${cTL}" fill="currentColor" stroke="none"/><path d="${cTR}"/><path d="${cBL}"/><path d="${cBR}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [B.d],
          holeExact: [circleD(8.8, 8.8, 2.4), circleD(15.2, 8.8, 2.2), circleD(8.8, 15.2, 2.2), circleD(15.2, 15.2, 2.4)],
          over: [circleD(8.8, 8.8, 1.15), circleD(15.2, 15.2, 1.15)]
        },
        duotone: { tone: [B.d], secondary: [cTR, cBL], line: `<path d="${B.d}"/><path d="${cTL}" fill="currentColor" stroke="none"/><path d="${cTR}"/><path d="${cBL}"/><path d="${cBR}" fill="currentColor" stroke="none"/>` }
      };
    }
};
