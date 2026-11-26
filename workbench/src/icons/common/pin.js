// Surgical-precision icon module: fdsi-pin (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-94-pin-thumbtack",
  slug: "pin",
  name: "#94. Pin / Sticky Event (2 Separate Padded Solid Shapes — Top Cap + Flared Bell + Needle)",
  area: "common",
  order: 127,
  desc: "Vertical/angled thumbtack pin: Top head bar (x=7.2..16.8, y=3.6) + tapered body flaring to lower skirt (x=5.4..18.6, y=14.4) + bottom needle pin (y=14.4..20.8).",
  meta: {
      "slug": "pin",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Pin a favorite league, live scoreboard, or market group to the top of the page.",
      "tags": [
          "pin",
          "thumbtack",
          "sticky",
          "keep",
          "top",
          "attach",
          "fix"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      // Symmetrical upright thumbtack (super clean and recognizable at 24px, matching Bell & Filter Funnel!):
      const bodyPts = [
        [7.2, 3.8], [16.8, 3.8],
        [15.4, 9.6], [18.6, 13.4], [18.6, 15.0],
        [5.4, 15.0], [5.4, 13.4], [8.6, 9.6]
      ];
      const B = bloatPoly(bodyPts, [cr, cr, 0.4, 0.7, 0.7, 0.7, 0.7, 0.4], b * 0.3, { minEdge: 1.5 });
      const topBarLine = `M6.2 3.8H17.8`;
      const needle = `M12.0 15.0V20.8`;
      // Solid: 2 Separate Padded Shapes (Upper Tack Cap Pill y=3.2..6.2 + Lower Flared Skirt Bell y=7.8..15.2) + needle stroke!
      const capSolid = bloatRect({ x: 6.4, y: 3.2, w: 11.2, h: 3.0, r: 1.1, b: b * 0.2 });
      const skirtSolid = bloatPoly([
        [8.4, 7.8], [15.6, 7.8], [18.8, 13.0], [18.8, 15.2], [5.2, 15.2], [5.2, 13.0]
      ], [0.7, 0.7, 0.8, 0.85, 0.85, 0.8], b * 0.3, { minEdge: 1.5 });
      return {
        keylines: drawKeylines([], [[7.2, 3.8], [16.8, 3.8], [5.4, 15.0], [18.6, 15.0], [12, 20.8]]),
        line: `<path d="${B.d}"/><path d="${topBarLine}"/><path d="${needle}"/>`,
        solid: {
          face: [capSolid.d, skirtSolid.d],
          stroke: [needle]
        },
        duotone: { tone: [B.d], secondary: [topBarLine, needle], line: `<path d="${B.d}"/><path d="${topBarLine}"/><path d="${needle}"/>` }
      };
    }
};
