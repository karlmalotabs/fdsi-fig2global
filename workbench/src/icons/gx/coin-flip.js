// Surgical-precision icon module: fdsi-coin-flip (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-158-coin-flip",
  slug: "coin-flip",
  name: "#158. Coin Flip — Heads or Tails (2 Opposite Coins + Bidirectional Flip Arrows!)",
  area: "gx",
  order: 191,
  desc: "NEW APPROACH: Top-Left 'Heads' Coin (8.0, 8.0, R=4.2) and Bottom-Right 'Tails' Coin (16.0, 16.0, R=4.2) swapping places via 2 crisp corner flip arrows!",
  meta: {
      "slug": "coin-flip",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Heads or Tails 50/50 instant coin flip game and side bet.",
      "tags": [
          "coin-flip",
          "heads-or-tails",
          "50-50",
          "toss",
          "instant-game",
          "arcade"
      ]
  },
  build: () => {
      const c1 = circleD(8.0,  8.0,  4.2);
      const c2 = circleD(16.0, 16.0, 4.2);
      const c1S = circleD(8.0,  8.0,  4.4);
      const c2S = circleD(16.0, 16.0, 4.4);
      const slot1 = `M8.0 6.2V9.8`;
      const slot2 = `M14.2 16.0H17.8`;
      const h1 = capsule(8.0,  6.0,  8.0,  10.0, 0.85);
      const h2 = capsule(14.0, 16.0, 18.0, 16.0, 0.85);
      // Top-Right & Bottom-Left flip arrows:
      const arrTR = `M14.2 5.0H18.8V9.6M18.8 5.0L14.6 9.2`;
      const arrBL = `M9.8 19.0H5.2V14.4M5.2 19.0L9.4 14.8`;
      return {
        keylines: drawKeylines([[8.0, 8.0, 4.2], [16.0, 16.0, 4.2]], [[18.8, 5.0], [5.2, 19.0]]),
        line: `<path d="${c1}"/><path d="${slot1}"/><path d="${c2}"/><path d="${slot2}"/><path d="${arrTR}"/><path d="${arrBL}"/>`,
        solid: {
          face: [c1S, c2S],
          holeExact: [h1, h2],
          stroke: [arrTR, arrBL]
        },
        duotone: {
          tone: [c1, c2],
          secondary: [arrTR, arrBL, slot1, slot2],
          line: `<path d="${c1}"/><path d="${slot1}"/><path d="${c2}"/><path d="${slot2}"/><path d="${arrTR}"/><path d="${arrBL}"/>`
        }
      };
    }
};
