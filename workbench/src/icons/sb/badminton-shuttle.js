// Surgical-precision icon module: fdsi-badminton-shuttle (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-28-badminton-shuttle",
  slug: "badminton-shuttle",
  name: "#28. Badminton Shuttlecock (45° Angled — Cork Nose + Flared Feather Skirt)",
  area: "sb",
  order: 61,
  desc: "FIXED 45° ANGLE: Angled at 45° with the hemispherical cork nose pointing bottom-left (4.6, 19.4) and the flared feather skirt opening toward top-right (13.2, 3.2)–(20.8, 10.8). Solid: 2 separate padded shapes!",
  meta: {
      "slug": "badminton-shuttle",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "BWF World Tour and Olympic badminton match and handicap markets.",
      "tags": [
          "badminton",
          "shuttlecock",
          "birdie",
          "feathers",
          "racket-sports"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      // 45° Flared Feather Skirt from neck (6.4, 13.0)–(11.0, 17.6) out to top-right crown (13.2, 3.2)–(20.8, 10.8):
      const skirtPts = [[6.4, 13.0], [13.2, 3.2], [20.8, 10.8], [11.0, 17.6]];
      const skirt = bloatPoly(skirtPts, [0.45, cr, cr, 0.45], b * 0.35, { minEdge: 2.5 });
      const ribs = `M7.9 14.5L15.7 5.7M9.5 16.1L18.3 8.3`;
      // Hemispherical cork nose at bottom-left: from (6.4, 13.0) down-left to arc around (4.6, 19.4) to (11.0, 17.6):
      const corkLine = `M6.4 13.0L5.1 14.3A3.25 3.25 0 0 0 9.7 18.9L11.0 17.6`;

      // Solid mode: 2 Separate Padded Shapes (45° Feather Skirt + 45° Hemispherical Cork Dome separated by a 1.8px diagonal gap!):
      const skirtSolid = bloatPoly([[7.5, 11.7], [13.2, 3.2], [20.8, 10.8], [12.3, 16.5]], [0.75, cr, cr, 0.75], b * 0.35, { minEdge: 2.5 });
      const corkSolid = `M5.9 13.3L4.9 14.3A3.4 3.4 0 0 0 9.7 19.1L10.7 18.1Z`;
      const ribCut1 = capsule(8.6, 13.6, 15.8, 5.6, 0.78);
      const ribCut2 = capsule(10.4, 15.4, 18.4, 8.2, 0.78);

      return {
        keylines: drawKeylines([[7.3, 16.7, 3.25]], skirtPts),
        line: `<path d="${skirt.d}"/><path d="${ribs}"/><path d="${corkLine}"/>`,
        solid: {
          face: [skirtSolid.d, corkSolid],
          holeExact: [ribCut1, ribCut2]
        },
        duotone: { tone: [skirt.d], secondary: [ribs, corkLine], line: `<path d="${skirt.d}"/><path d="${ribs}"/><path d="${corkLine}"/>` }
      };
    }
};
