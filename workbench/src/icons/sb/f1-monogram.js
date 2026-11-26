// Surgical-precision icon module: fdsi-f1-monogram (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-114-racing-helmet",
  slug: "f1-monogram",
  name: "#114. Formula 1 — Stylized Forward-Slanted 'F1' Speed Monogram (Wide 3.4px Gap Between Top Wing & L-Stem!)",
  area: "sb",
  order: 147,
  desc: "FIXED SPACING: Widened the vertical separation between the top F-wing (y=5.0..7.8) and the lower L-shaped F-stem (y=11.2..18.8) to 3.4px so both Line and Solid have generous breathing room!",
  meta: {
      "slug": "f1-monogram",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Formula 1 Grand Prix race, qualifying, and constructors championship.",
      "tags": [
          "f1",
          "formula-1",
          "grand-prix",
          "monogram",
          "motorsport",
          "racing"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.65);
      // Line mode polygons (3.4px vertical gap between top wing bottom y=7.8 and L-stem top y=11.2, and 3.0px horizontal gap to '1'):
      const fTopLine = bloatPoly([[6.2, 5.0], [15.0, 5.0], [14.2, 7.8], [5.4, 7.8]], cr, b * 0.15, { minEdge: 1.2 });
      const fBotLine = bloatPoly([
        [4.4, 11.2], [12.8, 11.2], [12.0, 13.8], [6.4, 13.8], [5.0, 18.8], [2.4, 18.8]
      ], [cr, cr, cr, 0.25, cr, cr], b * 0.15, { minEdge: 1.2 });
      const oneLine = bloatPoly([[18.0, 5.0], [20.8, 5.0], [16.8, 18.8], [14.0, 18.8]], cr, b * 0.15, { minEdge: 1.2 });

      // Solid mode polygons (2.4px clear vertical gap between y=8.4 and y=10.8):
      const fTopSolid = bloatPoly([[6.0, 4.6], [15.4, 4.6], [14.4, 8.2], [5.0, 8.2]], cr, b * 0.2, { minEdge: 1.5 });
      const fBotSolid = bloatPoly([
        [4.2, 10.6], [13.2, 10.6], [12.2, 14.0], [6.6, 14.0], [5.2, 19.2], [2.0, 19.2]
      ], [cr, cr, cr, 0.3, cr, cr], b * 0.2, { minEdge: 1.5 });
      const oneSolid = bloatPoly([[17.6, 4.6], [21.2, 4.6], [17.0, 19.2], [13.4, 19.2]], cr, b * 0.2, { minEdge: 1.5 });

      const lineShapes = `<path d="${fTopLine.d}"/><path d="${fBotLine.d}"/><path d="${oneLine.d}"/>`;
      return {
        keylines: drawKeylines([], [...fTopLine.anchors, ...oneLine.anchors]),
        line: lineShapes,
        solid: {
          face: [fTopSolid.d, fBotSolid.d, oneSolid.d]
        },
        duotone: {
          tone: [fTopLine.d, fBotLine.d, oneLine.d],
          line: lineShapes
        }
      };
    }
};
