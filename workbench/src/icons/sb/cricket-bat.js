// Surgical-precision icon module: fdsi-cricket-bat (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-24-cricket-bat",
  slug: "cricket-bat",
  name: "#24. Cricket Bat & Ball (3 Separate Padded Shapes — Blade + Cane Handle + Ball)",
  area: "sb",
  order: 57,
  desc: "45° angled bloated cricket bat blade + cylindrical cane handle + separate leather cricket ball at (17.8, 16.8). Solid: 3 separate padded shapes!",
  meta: {
      "slug": "cricket-bat",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "International Test, ODI, T20, and IPL cricket bat-and-ball markets.",
      "tags": [
          "cricket",
          "bat",
          "ball",
          "ipl",
          "t20",
          "ashes",
          "wicket"
      ]
  },
  build: ({ b, r }) => {
      // 45° Cricket bat blade from shoulder (9.5, 6.5)-(12.5, 9.5) down to toe (17.5, 14.5)-(14.5, 17.5)... wait:
      // Let's orient the bat blade from bottom-left toe (4.5, 16.5)-(7.5, 19.5) up-right to shoulder (13.2, 10.8)-(10.2, 7.8),
      // and the cane handle extending up-right from (11.7, 9.3) to (19.6, 3.4)!
      // Wait: pure 45° axis from bottom-left (4.2, 19.8) to top-right (19.8, 4.2):
      // Blade runs from toe center (5.8, 18.2) to shoulder center (13.6, 10.4), half-width = 2.4px along normal (-0.707, -0.707) -> (-1.7, -1.7) and (+1.7, +1.7):
      const bladePts = [
        [4.1, 16.5],  // Toe top-left
        [11.9, 8.7],  // Shoulder top-left
        [15.3, 12.1], // Shoulder bottom-right
        [7.5, 19.9]   // Toe bottom-right
      ];
      const cr = Math.min(r * 0.45, 0.95);
      const blade = bloatPoly(bladePts, [cr, 0.7, 0.7, cr], b * 0.35, { minEdge: 2.5 });
      const handleLine = `M13.6 10.4L19.6 4.4`;
      const handleCap = capsule(14.8, 9.2, 19.8, 4.2, 1.15);
      const ball = circleD(18.0, 17.2, 2.5);
      const ballSolid = circleD(18.0, 17.2, 2.8);
      return {
        keylines: drawKeylines([[18.0, 17.2, 2.5]], [...bladePts, [19.6, 4.4]]),
        line: `<path d="${blade.d}"/><path d="${handleLine}"/><path d="${ball}"/>`,
        solid: { face: [blade.d, handleCap, ballSolid] },
        duotone: { tone: [blade.d, ball], secondary: [handleLine], line: `<path d="${blade.d}"/><path d="${handleLine}"/><path d="${ball}"/>` }
      };
    }
};
