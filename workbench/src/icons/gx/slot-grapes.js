// Surgical-precision icon module: fdsi-slot-grapes (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-147-slot-grapes",
  slug: "slot-grapes",
  name: "#147. Slot Grapes Cluster (6 Separate Padded Grape Spheres in 3-2-1 Pyramid + Top Stem)",
  area: "gx",
  order: 180,
  desc: "Built like Shamrock Clover: 6 circular grapes arranged in a 3-2-1 triangular cluster (Row 1 at y=9.0, Row 2 at y=13.8, Bottom grape at y=18.4) + curved top vine stem!",
  meta: {
      "slug": "slot-grapes",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Cluster of royal grapes for fruit slots and cascading cluster-pay games.",
      "tags": [
          "grapes",
          "fruit",
          "bunch",
          "cluster",
          "vine",
          "classic-slots"
      ]
  },
  build: () => {
      // 3-2-1 triangular grape pyramid (centers separated by 5.2px so each r=2.15 grape has clear breathing space!):
      const coords = [
        [6.8, 8.8], [12.0, 8.8], [17.2, 8.8],
        [9.4, 13.6], [14.6, 13.6],
        [12.0, 18.4]
      ];
      const grapesLine  = coords.map(([x, y]) => circleD(x, y, 2.1)).join("");
      const grapesSolid = coords.map(([x, y]) => circleD(x, y, 2.25));
      const stem = `M12.0 6.6V3.6C12.0 3.6 14.4 3.2 15.8 4.6`;
      return {
        keylines: drawKeylines(coords.map(([x, y]) => [x, y, 2.1]), [[12, 3.6], [15.8, 4.6]]),
        line: `<path d="${grapesLine}"/><path d="${stem}"/>`,
        solid: {
          face: grapesSolid,
          stroke: [stem]
        },
        duotone: { tone: grapesSolid, secondary: [stem], line: `<path d="${grapesLine}"/><path d="${stem}"/>` }
      };
    }
};
