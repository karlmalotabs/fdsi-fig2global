// Surgical-precision icon module: fdsi-roulette-table (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-151-roulette-grid",
  slug: "roulette-table",
  name: "#151. Casino Roulette Table (Landscape Table Felt + Left Roulette Wheel + Right Betting Grid!)",
  area: "gx",
  order: 184,
  desc: "REBUILT AS REAL ROULETTE TABLE: Landscape casino table (x=2.6..21.4, y=5.0..19.0) featuring the circular Roulette Wheel on the left (7.8, 12.0, r=3.2) and the betting grid on the right!",
  meta: {
      "slug": "roulette-table",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Full Roulette table felt layout showing the wheel and inside/outside grid.",
      "tags": [
          "roulette",
          "table",
          "felt",
          "layout",
          "grid",
          "wheel",
          "casino"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 0.3, 2.2);
      const table = bloatRect({ x: 2.6, y: 5.0, w: 18.8, h: 14.0, r: cr, b });
      const wheel = circleD(7.8, 12.0, 3.2);
      const spokes = `M5.5 9.7L10.1 14.3M10.1 9.7L5.5 14.3`;
      const grid = `M13.6 8.4H18.4V15.6H13.6ZM13.6 12.0H18.4`;
      // Solid mode: 2 Separate Padded Table Halves (Left Wheel Section with wheel cutout + Right Grid Section with 2 betting windows)!
      const leftHalf  = bloatRect({ x: 2.6,  y: 5.0, w: 10.0, h: 14.0, r: [cr, 0.8, 0.8, cr], b: b * 0.45 });
      const rightHalf = bloatRect({ x: 14.2, y: 5.0, w: 7.2,  h: 14.0, r: [0.8, cr, cr, 0.8], b: b * 0.45 });
      const gWin1 = bloatRect({ x: 15.8, y: 8.2,  w: 3.6, h: 2.8, r: 0.6, b: 0 });
      const gWin2 = bloatRect({ x: 15.8, y: 13.0, w: 3.6, h: 2.8, r: 0.6, b: 0 });
      return {
        keylines: drawKeylines([[7.8, 12.0, 3.2]], [...table.anchors, [13.6, 8.4], [18.4, 15.6]]),
        line: `<path d="${table.d}"/><path d="${wheel}"/><path d="${spokes}"/><path d="${grid}"/>`,
        solid: {
          face: [leftHalf.d, rightHalf.d],
          holeExact: [circleD(7.8, 12.0, 3.5), gWin1.d, gWin2.d],
          over: [circleD(7.8, 12.0, 1.4)]
        },
        duotone: { tone: [table.d], secondary: [wheel, spokes, grid], line: `<path d="${table.d}"/><path d="${wheel}"/><path d="${spokes}"/><path d="${grid}"/>` }
      };
    }
};
