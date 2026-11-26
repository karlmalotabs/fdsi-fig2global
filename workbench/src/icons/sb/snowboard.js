// Surgical-precision icon module: fdsi-snowboard (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { tangentHull2, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-112-snowboard",
  slug: "snowboard",
  name: "#112. Snowboard / Halfpipe Board (45° Round-Nose Capsule Deck + 2 Angled Bindings)",
  area: "sb",
  order: 145,
  desc: "45° round-ended snowboard deck (`tangentHull2([6.2, 17.8], 3.3, [17.8, 6.2], 3.3)`) with 2 perpendicular binding straps inside.",
  meta: {
      "slug": "snowboard",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Winter X Games and Olympic snowboard halfpipe, slopestyle, and cross.",
      "tags": [
          "snowboard",
          "board",
          "bindings",
          "halfpipe",
          "slopestyle",
          "winter-sports"
      ]
  },
  build: () => {
      const board = tangentHull2([6.2, 17.8], 3.3, [17.8, 6.2], 3.3);
      const b1 = `M7.6 12.2L11.8 16.4`;
      const b2 = `M12.2 7.6L16.4 11.8`;
      const h1 = capsule(8.2, 12.8, 11.2, 15.8, 0.95);
      const h2 = capsule(12.8, 8.2, 15.8, 11.2, 0.95);
      return {
        keylines: drawKeylines([[6.2, 17.8, 3.3], [17.8, 6.2, 3.3]], [[6.2, 17.8], [17.8, 6.2]]),
        line: `<path d="${board.d}"/><path d="${b1}"/><path d="${b2}"/>`,
        solid: {
          fill: [board.d],
          holeExact: [h1, h2]
        },
        duotone: { tone: [board.d], secondary: [b1, b2], line: `<path d="${board.d}"/><path d="${b1}"/><path d="${b2}"/>` }
      };
    }
};
