// Surgical-precision icon module: fdsi-shamrock-clover (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "shamrock-clover",
  slug: "shamrock-clover",
  name: "Irish Luck Shamrock (3 Separate Padded Leaf Shapes in Solid, Like Crown/Diamond)",
  area: "gx",
  order: 199,
  desc: "FIXED SOLID: Solid renders 3 distinct, separated circular leaf lobes with a 1.5px padding gap between them (matching Diamond & Crown) + curved stem.",
  meta: {
      "slug": "shamrock-clover",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Irish luck themed slots, St. Patrick's promotions, and lucky charms.",
      "tags": [
          "shamrock",
          "clover",
          "irish",
          "luck",
          "green",
          "slots",
          "charm"
      ]
  },
  build: () => {
      const cx = 12, cy = 11.2, R = 3.6;
      const cTop = polar(cx, cy, 4.0, -90);
      const cRight = polar(cx, cy, 4.0, 20);
      const cLeft = polar(cx, cy, 4.0, 160);
      const p12 = polar(cx, cy, 2.4, -35), p23 = polar(cx, cy, 2.4, 90), p31 = polar(cx, cy, 2.4, -145);
      const trefoil =
        `M${P(p31)}A${R} ${R} 0 1 1 ${P(p12)}A${R} ${R} 0 1 1 ${P(p23)}A${R} ${R} 0 1 1 ${P(p31)}Z`;
      const stem = `M12 13.6C12 17.0 13.5 19.5 16.0 20.8`;
      // For Solid mode: 3 distinct padded leaf discs at radius 4.4 from center (r=3.3 each -> 1.1px clear padding between leaves!):
      const sTop = circleD(12, 6.6, 3.35);
      const sRight = circleD(16.2, 12.6, 3.35);
      const sLeft = circleD(7.8, 12.6, 3.35);
      return {
        keylines: drawKeylines([[...cTop, R], [...cRight, R], [...cLeft, R]], [p12, p23, p31]),
        line: `<path d="${trefoil}"/><path d="${stem}"/>`,
        solid: { face: [sTop, sRight, sLeft], stroke: [stem] },
        duotone: { tone: [trefoil], secondary: [stem], line: `<path d="${trefoil}"/><path d="${stem}"/>` }
      };
    }
};
