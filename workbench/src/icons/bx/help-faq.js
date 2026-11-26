// Surgical-precision icon module: fdsi-help-faq (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-20-help-question",
  slug: "help-faq",
  name: "#20. Help / FAQ (Exact 9.0px Circle + Geometric Question Hook & Dot)",
  area: "bx",
  order: 53,
  desc: "Outer circle (cx=12, cy=12, R=9.0) + exact r=2.3 question hook arc centering at (12, 9.5) curving into vertical stem (12, 13.6) + bottom dot (12, 17.0).",
  meta: {
      "slug": "help-faq",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Help center, frequently asked questions (FAQ), and betting guides.",
      "tags": [
          "help",
          "question",
          "faq",
          "support",
          "guide",
          "how-to",
          "assistance"
      ]
  },
  build: () => {
      const outer = circleD(12.0, 12.0, 9.0);
      const outerSolid = circleD(12.0, 12.0, 9.2);
      // Question hook: starts at (9.7, 9.2), 240° clockwise arc around (12.0, 9.2, r=2.3) to (13.4, 11.0), smooth curve to (12.0, 12.6) then vertical to (12.0, 13.8):
      const hook = `M9.7 9.2A2.3 2.3 0 1 1 13.6 10.9C12.8 11.6 12.0 12.1 12.0 13.2V13.8`;
      const dot = circleD(12.0, 17.0, 1.05);
      const dotHole = circleD(12.0, 17.0, 1.25);
      return {
        keylines: drawKeylines([[12, 12, 9.0], [12, 9.2, 2.3], [12, 17.0, 1.05]], [[9.7, 9.2], [12, 13.8], [12, 17.0]]),
        line: `<path d="${outer}"/><path d="${hook}"/><path d="${dot}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [outerSolid],
          cut: [hook],
          holeExact: [dotHole]
        },
        duotone: { tone: [outer], secondary: [hook], line: `<path d="${outer}"/><path d="${hook}"/><path d="${dot}" fill="currentColor" stroke="none"/>` }
      };
    }
};
