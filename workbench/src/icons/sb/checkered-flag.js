// Surgical-precision icon module: fdsi-checkered-flag (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-113-checkered-flag",
  slug: "checkered-flag",
  name: "#113. Motorsport Checkered Flag (Solid Matches Line 1:1 — 2x2 Checkerboard Banner)",
  area: "sb",
  order: 146,
  desc: "FIXED SOLID: Solid renders the exact same crisp 2x2 alternating checkerboard banner + flagpole as Line mode!",
  meta: {
      "slug": "checkered-flag",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Motorsport race winner, pole position, and podium finish markets.",
      "tags": [
          "checkered-flag",
          "motorsport",
          "racing",
          "finish-line",
          "lap",
          "winner"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const F = bloatRect({ x: 5.0, y: 4.0, w: 15.2, h: 10.4, r: [0.4, cr, cr, 0.4], b: b * 0.3 });
      const grid = `M12.6 4.0V14.4M5.0 9.2H20.2`;
      const pole = `M5.0 3.4V20.6`;
      const sqTL = `M5.0 4.2H12.6V9.2H5.0Z`;
      const sqBR = `M12.6 9.2H20.2V14.2H12.6Z`;
      return {
        keylines: drawKeylines([], [...F.anchors, [12.6, 9.2], [5.0, 20.6]]),
        line: `<path d="${sqTL}" fill="currentColor" stroke="none"/><path d="${sqBR}" fill="currentColor" stroke="none"/><path d="${grid}"/><path d="${F.d}"/><path d="${pole}"/>`,
        solid: {
          face: [sqTL, sqBR],
          stroke: [grid, F.d, pole]
        },
        duotone: {
          tone: [F.d],
          secondary: [pole],
          line: `<path d="${sqTL}" fill="currentColor" stroke="none"/><path d="${sqBR}" fill="currentColor" stroke="none"/><path d="${grid}"/><path d="${F.d}"/><path d="${pole}"/>`
        }
      };
    }
};
