// Surgical-precision icon module: fdsi-bookmark (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-12-bookmark-ribbon",
  slug: "bookmark",
  name: "#12. Bookmark / Saved Event (Bloated Vertical Ribbon + Inverted V-Tail)",
  area: "common",
  order: 45,
  desc: "Vertical bloated ribbon banner (x=6.0..18.0, y=3.5..20.5) with a crisp 90° inverted V-notch apex at (12.0, 15.2).",
  meta: {
      "slug": "bookmark",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Bookmark a match, market, or promotion for quick access later.",
      "tags": [
          "bookmark",
          "save",
          "ribbon",
          "pin",
          "watch",
          "saved",
          "later"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.6, 1.4);
      const pts = [[6.0, 3.5], [18.0, 3.5], [18.0, 20.4], [12.0, 15.2], [6.0, 20.4]];
      const B = bloatPoly(pts, [cr, cr, 0.55, 0.5, 0.55], b * 0.5, {
        minEdge: 3.0,
        edgeBulge: [0.6, 0.9, 0, 0, 0.9]
      });
      return {
        keylines: drawKeylines([], B.anchors),
        line: `<path d="${B.d}"/>`,
        solid: { fill: [B.d] },
        duotone: { tone: [B.d], line: `<path d="${B.d}"/>` }
      };
    }
};
