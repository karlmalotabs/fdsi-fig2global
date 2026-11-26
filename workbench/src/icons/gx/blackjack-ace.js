// Surgical-precision icon module: fdsi-blackjack-ace (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-153-blackjack-21",
  slug: "blackjack-ace",
  name: "#153. Blackjack Ace Card (Bloated Portrait Card + Bold 'A' Ace Peak & Crossbar)",
  area: "gx",
  order: 186,
  desc: "Bloated portrait playing card (x=5.0..19.0, y=3.2..20.8) featuring a large, crisp 'A' Ace glyph (M8.6 16.6 L12.0 7.4 L15.4 16.6 M9.8 14.0 H14.2)!",
  meta: {
      "slug": "blackjack-ace",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Blackjack 21 table games featuring the Ace card.",
      "tags": [
          "blackjack",
          "21",
          "ace",
          "card",
          "pontoon",
          "table-games",
          "casino"
      ]
  },
  build: ({ b, r }) => {
      const C = bloatRect({ x: 5.0, y: 3.2, w: 14.0, h: 17.6, r: Math.min(r + 0.3, 2.2), b });
      const ace = `M8.6 16.6L12.0 7.4L15.4 16.6M9.8 14.0H14.2`;
      return {
        keylines: drawKeylines([], [...C.anchors, [12, 7.4], [8.6, 16.6], [15.4, 16.6]]),
        line: `<path d="${C.d}"/><path d="${ace}"/>`,
        solid: {
          fill: [C.d],
          cut: [ace]
        },
        duotone: { tone: [C.d], secondary: [ace], line: `<path d="${C.d}"/><path d="${ace}"/>` }
      };
    }
};
