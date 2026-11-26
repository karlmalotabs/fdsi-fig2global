// Surgical-precision icon module: fdsi-tail-tipster (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-133-tail-tipster",
  slug: "tail-tipster",
  name: "#133. Copy / Tail Tipster Bet (2 Separate Padded Betslip Cards + Crisp Horizontal-Tangent Arrowhead!)",
  area: "sb",
  order: 166,
  desc: "FIXED ARROWHEAD: The copy-over arrow now runs along a clean horizontal track at y=4.6 (`M6.8 7.0 A2.4 2.4 0 0 1 9.2 4.6 H17.2`) into a large, symmetric ±45° rightward arrowhead (`M14.6 2.2 L17.4 4.6 L14.6 7.0`)!",
  meta: {
      "slug": "tail-tipster",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Social betting: copy and tail a featured tipster's or friend's betslip.",
      "tags": [
          "copy-bet",
          "tail",
          "tipster",
          "social-betting",
          "follow",
          "share-slip"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.2);
      const cardL = bloatRect({ x: 3.2,  y: 9.2, w: 7.8, h: 11.2, r: cr, b: b * 0.35 });
      const cardR = bloatRect({ x: 13.0, y: 9.2, w: 7.8, h: 11.2, r: cr, b: b * 0.35 });
      const arrow = `M6.8 7.2A2.6 2.6 0 0 1 9.4 4.6H17.2M14.6 2.2L17.4 4.6L14.6 7.0`;
      const rowL = capsule(5.4,  14.8, 8.8,  14.8, 0.85);
      const rowR = capsule(15.2, 14.8, 18.6, 14.8, 0.85);
      return {
        keylines: drawKeylines([], [...cardL.anchors, ...cardR.anchors, [17.4, 4.6], [14.6, 2.2], [14.6, 7.0]]),
        line: `<path d="${cardL.d}"/><path d="${cardR.d}"/><path d="${arrow}"/>`,
        solid: {
          face: [cardL.d, cardR.d],
          holeExact: [rowL, rowR],
          stroke: [arrow]
        },
        duotone: { tone: [cardR.d], secondary: [cardL.d, arrow], line: `<path d="${cardL.d}"/><path d="${cardR.d}"/><path d="${arrow}"/>` }
      };
    }
};
