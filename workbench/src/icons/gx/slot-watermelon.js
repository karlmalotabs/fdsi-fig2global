// Surgical-precision icon module: fdsi-slot-watermelon (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-146-slot-melon",
  slug: "slot-watermelon",
  name: "#146. Slot Watermelon Slice (2 Separate Padded Shapes — Outer Rind Band + Inner Wedge with Seeds)",
  area: "gx",
  order: 179,
  desc: "Built like Curling Stone & Crown: Semicircular watermelon wedge (cx=12, cy=9.0, R=8.8) split in Solid into 2 separate padded shapes (Inner Fruit Wedge with 3 seed cutouts + Outer Rind Arc)!",
  meta: {
      "slug": "slot-watermelon",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Watermelon slice symbol for high-paying fruit slot combinations.",
      "tags": [
          "watermelon",
          "melon",
          "fruit",
          "slice",
          "seeds",
          "classic-slots"
      ]
  },
  build: () => {
      const outer = `M3.2 9.0A8.8 8.8 0 0 0 20.8 9.0Z`;
      const rindSeam = `M5.8 9.0A6.2 6.2 0 0 0 18.2 9.0`;
      const s1 = circleD(9.2,  11.8, 0.9);
      const s2 = circleD(12.0, 13.4, 0.9);
      const s3 = circleD(14.8, 11.8, 0.9);
      const seeds = `${s1}${s2}${s3}`;
      // Solid: 2 Separate Padded Shapes (Inner Fruit Semicircle R=5.6 with 3 seed holes + Outer Rind Crescent Ring R=7.2..9.0)!
      const fruitSolid = `M6.2 8.6A5.8 5.8 0 0 0 17.8 8.6Z`;
      const rindSolid  = `M3.0 8.6H4.6A7.4 7.4 0 0 0 19.4 8.6H21.0A9.0 9.0 0 0 1 3.0 8.6Z`;
      const seedHoles = [circleD(9.4, 11.2, 0.95), circleD(12.0, 12.6, 0.95), circleD(14.6, 11.2, 0.95)];
      return {
        keylines: drawKeylines([[12, 9.0, 8.8], [12, 9.0, 6.2]], [[3.2, 9.0], [20.8, 9.0]]),
        line: `<path d="${outer}"/><path d="${rindSeam}"/><path d="${seeds}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [fruitSolid, rindSolid],
          holeExact: seedHoles
        },
        duotone: { tone: [outer], secondary: [rindSeam], line: `<path d="${outer}"/><path d="${rindSeam}"/><path d="${seeds}" fill="currentColor" stroke="none"/>` }
      };
    }
};
