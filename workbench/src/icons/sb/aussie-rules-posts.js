// Surgical-precision icon module: fdsi-aussie-rules-posts (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-40-aussie-rules-posts",
  slug: "aussie-rules-posts",
  name: "#40. Australian Rules / Rugby H-Posts (H-Goalposts + Outer Behind Posts + Turf Line)",
  area: "sb",
  order: 73,
  desc: "2 tall center goalposts (x=8.5, x=15.5, y=3.4..20.2) joined by crossbar at y=11.8 + 2 shorter outer behind posts (x=4.0, x=20.0, y=8.8..20.2) on turf base.",
  meta: {
      "slug": "aussie-rules-posts",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Australian Rules Football (AFL) goalposts for match and margin betting.",
      "tags": [
          "aussie-rules",
          "afl",
          "goalposts",
          "footy",
          "australia",
          "behind-posts"
      ]
  },
  build: () => {
      const centerH = `M8.5 3.4V20.2M15.5 3.4V20.2M8.5 11.6H15.5`;
      const outerPosts = `M4.0 8.8V20.2M20.0 8.8V20.2M2.6 20.2H21.4`;
      // In Solid mode, build bold rounded pill posts + crossbar
      const p1 = capsule(4.0, 9.0, 4.0, 20.0, 0.95);
      const p2 = capsule(8.5, 3.6, 8.5, 20.0, 1.05);
      const p3 = capsule(15.5, 3.6, 15.5, 20.0, 1.05);
      const p4 = capsule(20.0, 9.0, 20.0, 20.0, 0.95);
      const cross = capsule(8.5, 11.6, 15.5, 11.6, 0.95);
      const turf = capsule(2.6, 20.2, 21.4, 20.2, 0.95);
      return {
        keylines: drawKeylines([], [[8.5, 3.4], [15.5, 3.4], [4.0, 8.8], [20.0, 8.8], [8.5, 11.6], [15.5, 11.6]]),
        line: `<path d="${centerH}"/><path d="${outerPosts}"/>`,
        solid: { face: [p1, p2, p3, p4, cross, turf] },
        duotone: { tone: [p2, p3, cross], secondary: [outerPosts], line: `<path d="${centerH}"/><path d="${outerPosts}"/>` }
      };
    }
};
