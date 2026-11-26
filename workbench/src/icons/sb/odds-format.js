// Surgical-precision icon module: fdsi-odds-format (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-137-odds-format",
  slug: "odds-format",
  name: "#137. Odds Format / Margin % (Bloated Badge + Diagonal Slash & 2 Counter Dots)",
  area: "sb",
  order: 170,
  desc: "Bloated rounded square badge (x=3.6..20.4, y=3.6..20.4) containing a bold 45° odds slash (M8.4 15.6 L15.6 8.4) and 2 circular pips at (8.8, 8.8) & (15.2, 15.2).",
  meta: {
      "slug": "odds-format",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Switch between Decimal (2.50), Fractional (6/4), and American (+150) odds.",
      "tags": [
          "odds-format",
          "percentage",
          "margin",
          "decimal",
          "fractional",
          "american"
      ]
  },
  build: ({ b, r }) => {
      const B = bloatRect({ x: 3.6, y: 3.6, w: 16.8, h: 16.8, r: Math.min(r + 0.4, 2.5), b });
      const slash = `M8.2 15.8L15.8 8.2`;
      const d1 = circleD(8.8,  8.8,  1.35);
      const d2 = circleD(15.2, 15.2, 1.35);
      const slashHole = capsule(8.2, 15.8, 15.8, 8.2, 0.92);
      return {
        keylines: drawKeylines([[8.8, 8.8, 1.35], [15.2, 15.2, 1.35]], B.anchors),
        line: `<path d="${B.d}"/><path d="${slash}"/><path d="${d1}" fill="currentColor" stroke="none"/><path d="${d2}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [B.d],
          holeExact: [slashHole, circleD(8.8, 8.8, 1.55), circleD(15.2, 15.2, 1.55)]
        },
        duotone: { tone: [B.d], secondary: [slash], line: `<path d="${B.d}"/><path d="${slash}"/><path d="${d1}" fill="currentColor" stroke="none"/><path d="${d2}" fill="currentColor" stroke="none"/>` }
      };
    }
};
