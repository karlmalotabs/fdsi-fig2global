// Surgical-precision icon module: fdsi-heart (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-11-heart-favorite",
  slug: "heart",
  name: "#11. Heart / Favorite (Exact 2-Circle Lobe Tangents to Rounded Apex)",
  area: "common",
  order: 44,
  desc: "Constructed from 2 exact top lobe circles (8.2, 8.8, r=4.4) and (15.8, 8.8, r=4.4) meeting at top cleft (12.0, 6.6) and tangent-tapering to a soft rounded bottom apex (12.0, 19.8).",
  meta: {
      "slug": "heart",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Save a sport, team, league, or casino game to player favorites.",
      "tags": [
          "heart",
          "favorite",
          "like",
          "love",
          "save",
          "wishlist",
          "preferred"
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
        keylines: drawKeylines([[8.2, 9.0, 4.4], [15.8, 9.0, 4.4]], [[12, 6.8], [12, 19.6], [3.8, 9.0], [20.2, 9.0]]),
        line: `<path d="${heart}"/>`,
        solid: { fill: [heart] },
        duotone: { tone: [heart], line: `<path d="${heart}"/>` }
      };
    }
};
