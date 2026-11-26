// Surgical-precision icon module: fdsi-volume-on (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { arcPath, bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-91-volume-on",
  slug: "volume-on",
  name: "#91. Sound On / Speaker (Bloated Acoustic Horn + 2 Concentric Sound Wave Arcs)",
  area: "common",
  order: 124,
  desc: "Bloated speaker horn polygon (left driver box x=3.4..7.6, y=9.2..14.8 flaring to cone x=13.2, y=5.0..19.0) + 2 concentric ±42° sound wave arcs (r=4.2, r=7.4).",
  meta: {
      "slug": "volume-on",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Audio enabled for live stream commentary, game sound effects, or match alerts.",
      "tags": [
          "volume",
          "sound",
          "audio",
          "speaker",
          "unmute",
          "listen",
          "on"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const hornPts = [[3.4, 9.2], [7.6, 9.2], [13.2, 5.0], [13.2, 19.0], [7.6, 14.8], [3.4, 14.8]];
      const H = bloatPoly(hornPts, [cr, 0.35, cr, cr, 0.35, cr], b * 0.35, { minEdge: 2.0 });
      const w1 = arcPath(13.2, 12.0, 4.2, -42, 42);
      const w2 = arcPath(13.2, 12.0, 7.4, -42, 42);
      // Solid: 2 separate padded shapes for the speaker (Driver Box + Flared Cone, like Megaphone!) + sound waves!
      const driver = bloatRect({ x: 3.2, y: 9.0, w: 3.6, h: 6.0, r: 0.9, b: b * 0.2 });
      const cone = bloatPoly([[8.2, 8.6], [13.6, 4.6], [13.6, 19.4], [8.2, 15.4]], [0.7, cr, cr, 0.7], b * 0.35, { minEdge: 2.0 });
      return {
        keylines: drawKeylines([[13.2, 12.0, 4.2], [13.2, 12.0, 7.4]], H.anchors),
        line: `<path d="${H.d}"/><path d="${w1}"/><path d="${w2}"/>`,
        solid: {
          face: [driver.d, cone.d],
          stroke: [w1, w2]
        },
        duotone: { tone: [H.d], secondary: [w1, w2], line: `<path d="${H.d}"/><path d="${w1}"/><path d="${w2}"/>` }
      };
    }
};
