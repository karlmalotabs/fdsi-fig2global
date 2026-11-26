// Surgical-precision icon module: fdsi-smartphone (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, circleD, capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-99-smartphone",
  slug: "smartphone",
  name: "#99. Smartphone / Mobile Betting App (Bloated Handset + Top Speaker + Home Indicator)",
  area: "common",
  order: 132,
  desc: "Vertical bloated smartphone body (x=6.0..18.0, y=3.0..21.0) with top speaker slot at y=6.2 and bottom home indicator dot/pill at y=17.6.",
  meta: {
      "slug": "smartphone",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Mobile app download, SMS verification, or device management.",
      "tags": [
          "smartphone",
          "mobile",
          "phone",
          "device",
          "app",
          "ios",
          "android"
      ]
  },
  build: ({ b, r }) => {
      const P = bloatRect({ x: 6.0, y: 3.0, w: 12.0, h: 18.0, r: Math.min(r + 0.4, 2.3), b });
      const speaker = `M10.4 6.2H13.6`;
      const homeDot = circleD(12.0, 17.4, 1.05);
      const speakerHole = capsule(10.2, 6.2, 13.8, 6.2, 0.85);
      const homeHole = circleD(12.0, 17.4, 1.25);
      return {
        keylines: drawKeylines([[12, 17.4, 1.05]], P.anchors),
        line: `<path d="${P.d}"/><path d="${speaker}"/><path d="${homeDot}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [P.d], holeExact: [speakerHole, homeHole] },
        duotone: { tone: [P.d], secondary: [speaker], line: `<path d="${P.d}"/><path d="${speaker}"/><path d="${homeDot}" fill="currentColor" stroke="none"/>` }
      };
    }
};
