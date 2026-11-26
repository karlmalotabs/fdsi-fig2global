// Surgical-precision icon module: fdsi-suit-club (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-64-suit-club",
  slug: "suit-club",
  name: "#64. Club Suit (Unified Continuous Trefoil Silhouette — Solid Matches Line 1:1!)",
  area: "gx",
  order: 97,
  desc: "FIXED: Solid now uses the exact same continuous 3-lobe trefoil + pedestal stem silhouette (`fill: [clubLine]`) as Line mode!",
  meta: {
      "slug": "suit-club",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Club trefoil card suit for poker, blackjack side bets, and suit markets.",
      "tags": [
          "club",
          "clover",
          "suit",
          "cards",
          "poker",
          "trefoil",
          "casino"
      ]
  },
  build: () => {
      const clubLine =
        `M9.4 9.2` +
        `A3.6 3.6 0 1 1 14.6 9.2` +
        `A3.6 3.6 0 1 1 14.2 15.4` +
        `L15.6 20.4H8.4L9.8 15.4` +
        `A3.6 3.6 0 1 1 9.4 9.2Z`;
      return {
        keylines: drawKeylines([[12, 6.4, 3.6], [7.2, 12.4, 3.6], [16.8, 12.4, 3.6]], [[8.4, 20.4], [15.6, 20.4]]),
        line: `<path d="${clubLine}"/>`,
        solid: { fill: [clubLine] },
        duotone: { tone: [clubLine], line: `<path d="${clubLine}"/>` }
      };
    }
};
