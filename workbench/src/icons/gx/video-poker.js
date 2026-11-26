// Surgical-precision icon module: fdsi-video-poker (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-154-royal-flush",
  slug: "video-poker",
  name: "#154. Video Poker / Live Card Stream (Playing Card with Large Bold Suit Symbol + Video Camera Lens!)",
  area: "gx",
  order: 187,
  desc: "FIXED SUIT SIZE: Enlarged the diamond suit symbol inside the card from 5.0×5.6px to a bold, commanding 7.2×8.4px (`x=5.5..12.7, y=7.8..16.2`)!",
  meta: {
      "slug": "video-poker",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Video Poker and live-streamed casino poker tables (Jacks or Better, Hold'em).",
      "tags": [
          "video-poker",
          "poker",
          "stream",
          "camera",
          "card",
          "live-poker",
          "holdem"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.4);
      const card = bloatRect({ x: 3.0, y: 4.0, w: 12.4, h: 16.0, r: cr, b: b * 0.4 });
      // Large, bold 7.2 x 8.4px Diamond Suit symbol centered at (9.2, 12.0):
      const pip = bloatPoly([[9.2, 7.8], [12.8, 12.0], [9.2, 16.2], [5.6, 12.0]], 0.4, 0, { minEdge: 2.0 });
      const camLensLine = bloatPoly([[15.4, 9.6], [21.0, 6.8], [21.0, 17.2], [15.4, 14.4]], [0.4, cr, cr, 0.4], b * 0.3, { minEdge: 2.0 });
      const camLensSolid = bloatPoly([[16.8, 9.2], [21.2, 6.8], [21.2, 17.2], [16.8, 14.8]], [0.7, cr, cr, 0.7], b * 0.3, { minEdge: 2.0 });
      return {
        keylines: drawKeylines([], [...card.anchors, ...camLensLine.anchors, [9.2, 7.8], [12.8, 12.0], [9.2, 16.2], [5.6, 12.0]]),
        line: `<path d="${card.d}"/><path d="${camLensLine.d}"/><path d="${pip.d}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [card.d, camLensSolid.d],
          holeExact: [pip.d]
        },
        duotone: {
          tone: [card.d],
          secondary: [camLensLine.d],
          line: `<path d="${card.d}"/><path d="${camLensLine.d}"/><path d="${pip.d}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
