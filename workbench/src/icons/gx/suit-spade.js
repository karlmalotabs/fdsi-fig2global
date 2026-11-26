// Surgical-precision icon module: fdsi-suit-spade (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-63-suit-spade",
  slug: "suit-spade",
  name: "#63. Spade Suit (Unified Continuous Suit Silhouette in Line & Solid — Zero Stem Gap!)",
  area: "gx",
  order: 96,
  desc: "FIXED: Merged the inverted heart blade and flared pedestal tail into one single, continuous closed Spade silhouette (`fill: [spade]`) in both Line and Solid with zero knockout gap!",
  meta: {
      "slug": "suit-spade",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Spade card suit for poker hand rankings, card filters, and hi-lo games.",
      "tags": [
          "spade",
          "suit",
          "cards",
          "poker",
          "black",
          "ace",
          "casino"
      ]
  },
  build: () => {
      // Single continuous closed Spade suit contour (apex at (12, 3.2), two bottom lobes at y=13.2..16.2, and flared pedestal stem from (10.5, 15.0) to (8.4, 20.4)–(15.6, 20.4)):
      const spade =
        `M12.0 3.2` +
        `C9.2 6.6 4.0 9.8 4.0 13.4` +
        `A3.8 3.8 0 0 0 10.6 16.0` +
        `L8.5 20.4H15.5L13.4 16.0` +
        `A3.8 3.8 0 0 0 20.0 13.4` +
        `C20.0 9.8 14.8 6.6 12.0 3.2Z`;
      return {
        keylines: drawKeylines([[7.8, 13.4, 3.8], [16.2, 13.4, 3.8]], [[12, 3.2], [8.5, 20.4], [15.5, 20.4]]),
        line: `<path d="${spade}"/>`,
        solid: { fill: [spade] },
        duotone: { tone: [spade], line: `<path d="${spade}"/>` }
      };
    }
};
