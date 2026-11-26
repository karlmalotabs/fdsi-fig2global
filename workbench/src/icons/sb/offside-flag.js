// Surgical-precision icon module: fdsi-offside-flag (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-123-offside-flag",
  slug: "offside-flag",
  name: "#123. Assistant Referee Offside Flag (45° Upward Pole + Quartered 2×2 Diamond Flag)",
  area: "sb",
  order: 156,
  desc: "Linesman flag held at 45°: Diagonal handle & pole from (3.6, 20.4) to (15.6, 8.4) + bloated square flag banner (x=9.8..20.4, y=3.6..14.2) with quartered diagonal cross!",
  meta: {
      "slug": "offside-flag",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Total match offsides and player offside prop markets.",
      "tags": [
          "offside",
          "linesman",
          "flag",
          "assistant-referee",
          "football",
          "props"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      // Upright/angled offside flag with quartered 2x2 diamond squares (matches #113 Checkered Flag rule: Solid matches Line!):
      const F = bloatRect({ x: 6.4, y: 3.8, w: 13.8, h: 10.0, r: [0.4, cr, cr, 0.4], b: b * 0.3 });
      const diag = `M6.4 3.8L20.2 13.8M20.2 3.8L6.4 13.8`;
      const topTri = `M6.6 3.8H20.0L13.3 8.8Z`;
      const botTri = `M6.6 13.8H20.0L13.3 8.8Z`;
      const pole = `M6.4 3.4V20.6`;
      return {
        keylines: drawKeylines([], [...F.anchors, [13.3, 8.8], [6.4, 20.6]]),
        line: `<path d="${topTri}" fill="currentColor" stroke="none"/><path d="${botTri}" fill="currentColor" stroke="none"/><path d="${diag}"/><path d="${F.d}"/><path d="${pole}"/>`,
        solid: {
          face: [topTri, botTri],
          stroke: [diag, F.d, pole]
        },
        duotone: {
          tone: [F.d],
          secondary: [pole],
          line: `<path d="${topTri}" fill="currentColor" stroke="none"/><path d="${botTri}" fill="currentColor" stroke="none"/><path d="${diag}"/><path d="${F.d}"/><path d="${pole}"/>`
        }
      };
    }
};
