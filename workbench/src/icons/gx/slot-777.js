// Surgical-precision icon module: fdsi-slot-777 (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, circleD, capsule, bloatPoly, edgeX, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "slot-777",
  slug: "slot-777",
  name: "Jackpot 777 Slot Machine",
  area: "gx",
  order: 213,
  desc: "Bloated cabinet frame + twin lucky '77' glyphs (capsule holes in Solid) + pull lever locked to right wall via edgeX.",
  meta: {
      "slug": "slot-777",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Classic Vegas 777 slot machine cabinet and video slots category.",
      "tags": [
          "slots",
          "777",
          "jackpot",
          "machine",
          "reels",
          "vegas",
          "casino"
      ]
  },
  build: ({ b, r }) => {
      const C = bloatPoly([[3, 4.5], [17.5, 4.5], [17.5, 19.5], [3, 19.5]], Math.min(r, 2.4), b);
      const lx = edgeX(C.poly, 13.5, "right");
      const lever = `M${f(lx)} 13.5H20.5V8`;
      const knob = circleD(20.5, 6.8, 1.4);
      const sevens = `M5.5 9H9.5L7 15.5M11.5 9H15.5L13 15.5`;
      const sevenHoles = [
        capsule([5.5, 9.2], [9.3, 9.2], 1.65), capsule([9.3, 9.2], [7.0, 15.3], 1.65),
        capsule([11.5, 9.2], [15.3, 9.2], 1.65), capsule([15.3, 9.2], [13.0, 15.3], 1.65)
      ];
      return {
        keylines: drawKeylines([[20.5, 6.8, 1.4]], [...C.anchors, [lx, 13.5]]),
        line: `<path d="${C.d}"/><path d="${sevens}"/><path d="${lever}"/><path d="${knob}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [C.d], holeExact: sevenHoles, face: [knob], stroke: [lever] },
        duotone: { tone: [C.d], secondary: [sevens], line: `<path d="${C.d}"/><path d="${lever}"/><path d="${knob}" fill="currentColor" stroke="none"/>` }
      };
    }
};
