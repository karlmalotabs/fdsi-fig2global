// Surgical-precision icon module: fdsi-suit-heart (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-141-suit-heart",
  slug: "suit-heart",
  name: "#141. Heart Suit (Companion to #63 Spade & #64 Club — Unified Continuous Suit Silhouette)",
  area: "gx",
  order: 174,
  desc: "Exact 2-circle top lobes (8.2, 9.0, r=4.4) & (15.8, 9.0, r=4.4) meeting at cleft (12.0, 6.8) and tapering to rounded apex (12.0, 19.6).",
  meta: {
      "slug": "suit-heart",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Heart card suit for card game UI, suit side bets, and royal flush displays.",
      "tags": [
          "heart",
          "suit",
          "cards",
          "poker",
          "red",
          "romance",
          "casino"
      ]
  },
  build: () => {
      const heart =
        `M12.0 6.8` +
        `A4.4 4.4 0 0 0 3.8 9.0` +
        `C3.8 13.6 8.4 16.8 11.3 19.4` +
        `A1.0 1.0 0 0 0 12.7 19.4` +
        `C15.6 16.8 20.2 13.6 20.2 9.0` +
        `A4.4 4.4 0 0 0 12.0 6.8Z`;
      return {
        keylines: drawKeylines([[8.2, 9.0, 4.4], [15.8, 9.0, 4.4]], [[12, 6.8], [12, 19.6]]),
        line: `<path d="${heart}"/>`,
        solid: { fill: [heart] },
        duotone: { tone: [heart], line: `<path d="${heart}"/>` }
      };
    }
};
