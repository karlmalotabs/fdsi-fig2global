// Surgical-precision icon module: fdsi-baccarat (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-152-card-shoe",
  slug: "baccarat",
  name: "#152. Baccarat — Banker vs. Player (Wide 3.6px Gap Between Crown & 2 Dealt Cards!)",
  area: "gx",
  order: 185,
  desc: "FIXED LINE SPACING: Widened the vertical gap between the Royal Crown (y=3.0..7.8) and the 2 Dealt Cards (y=11.4..20.6) to 3.6px (and 3.6px horizontally between cards) so Line, Solid, and Duotone have generous breathing room!",
  meta: {
      "slug": "baccarat",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "VIP Baccarat (Punto Banco) comparing Player and Banker dealt hands.",
      "tags": [
          "baccarat",
          "punto-banco",
          "banker",
          "player",
          "cards",
          "crown",
          "table-games"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 1.0);
      // Line mode: Crown from y=3.0..7.8, Cards from y=11.4..20.6 (3.6px vertical centerline gap!) and x=3.0..10.2 / x=13.8..21.0 (3.6px horizontal gap!):
      const crownLine = bloatPoly(
        [[5.4, 3.8], [8.8, 6.4], [12.0, 2.8], [15.2, 6.4], [18.6, 3.8], [17.6, 7.8], [6.4, 7.8]],
        [0.45, 0.35, 0.45, 0.35, 0.45, 0.8, 0.8], b * 0.25, { minEdge: 1.5 }
      );
      const cardL_Line = bloatRect({ x: 3.0,  y: 11.4, w: 7.2, h: 9.2, r: cr, b: b * 0.3 });
      const cardR_Line = bloatRect({ x: 13.8, y: 11.4, w: 7.2, h: 9.2, r: cr, b: b * 0.3 });
      const pipL = circleD(6.6,  16.0, 1.1);
      const pipR = circleD(17.4, 16.0, 1.1);

      // Solid mode: Slightly fuller shapes with 2.6px clear padding gap:
      const crownSolid = bloatPoly(
        [[5.0, 3.6], [8.6, 6.4], [12.0, 2.6], [15.4, 6.4], [19.0, 3.6], [18.0, 8.4], [6.0, 8.4]],
        [0.5, 0.4, 0.5, 0.4, 0.5, 0.9, 0.9], b * 0.3, { minEdge: 1.8 }
      );
      const cardL_Solid = bloatRect({ x: 3.0,  y: 11.0, w: 7.6, h: 9.6, r: cr, b: b * 0.35 });
      const cardR_Solid = bloatRect({ x: 13.4, y: 11.0, w: 7.6, h: 9.6, r: cr, b: b * 0.35 });

      return {
        keylines: drawKeylines([[6.6, 16.0, 1.1], [17.4, 16.0, 1.1]], [...crownLine.anchors, ...cardL_Line.anchors, ...cardR_Line.anchors]),
        line: `<path d="${crownLine.d}"/><path d="${cardL_Line.d}"/><path d="${cardR_Line.d}"/><path d="${pipL}" fill="currentColor" stroke="none"/><path d="${pipR}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [crownSolid.d, cardL_Solid.d, cardR_Solid.d],
          holeExact: [circleD(6.8, 15.8, 1.3), circleD(17.2, 15.8, 1.3)]
        },
        duotone: {
          tone: [cardL_Line.d, cardR_Line.d],
          secondary: [crownLine.d],
          line: `<path d="${crownLine.d}"/><path d="${cardL_Line.d}"/><path d="${cardR_Line.d}"/><path d="${pipL}" fill="currentColor" stroke="none"/><path d="${pipR}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
