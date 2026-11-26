// Surgical-precision icon module: fdsi-ice-hockey (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-25-ice-hockey",
  slug: "ice-hockey",
  name: "#25. Ice Hockey Stick & Puck (2 Separate Padded Shapes — L-Blade Stick + Flat Puck)",
  area: "sb",
  order: 58,
  desc: "Diagonal hockey stick shaft from (19.5, 3.5) down to heel (9.5, 17.5) with bloated curved hockey blade (x=3.5..11.5, y=14.8..19.2) + separate puck disc at (17.2, 18.2).",
  meta: {
      "slug": "ice-hockey",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "NHL, KHL, and World Championship ice hockey stick and puck markets.",
      "tags": [
          "ice-hockey",
          "nhl",
          "stick",
          "puck",
          "rink",
          "winter-sports"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      // Unified L-shaped hockey stick polygon (shaft + curved toe blade) + separate puck pill:
      const stickPts = [
        [18.4, 3.2], [20.4, 4.4],
        [11.2, 18.8], [4.0, 18.8], [4.0, 15.0], [9.4, 15.0]
      ];
      const stick = bloatPoly(stickPts, [0.6, 0.6, 1.2, 1.1, 1.1, 0.5], b * 0.3, { minEdge: 2.0 });
      const puck = bloatRect({ x: 14.2, y: 16.2, w: 6.2, h: 3.4, r: 1.2, b: b * 0.25 });
      return {
        keylines: drawKeylines([], [...stick.anchors, ...puck.anchors]),
        line: `<path d="${stick.d}"/><path d="${puck.d}"/>`,
        solid: { face: [stick.d, puck.d] },
        duotone: { tone: [stick.d], secondary: [puck.d], line: `<path d="${stick.d}"/><path d="${puck.d}"/>` }
      };
    }
};
