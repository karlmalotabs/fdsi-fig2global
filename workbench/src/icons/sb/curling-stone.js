// Surgical-precision icon module: fdsi-curling-stone (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-37-curling-stone",
  slug: "curling-stone",
  name: "#37. Curling Stone (2-Part Split Granite Body + L-Shaped Top Handle)",
  area: "sb",
  order: 70,
  desc: "Built like Betslip & Crown: Wide bloated granite stone body (x=3.0..21.0, y=10.0..20.2) split by an equatorial striking band + bold top gooseneck handle (y=4.5..10.0).",
  meta: {
      "slug": "curling-stone",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Winter Olympic and World Championship curling end and match markets.",
      "tags": [
          "curling",
          "stone",
          "granite",
          "ice",
          "winter-sports",
          "olympic"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 0.6, 3.2);
      const stone = bloatRect({ x: 3.0, y: 10.2, w: 18.0, h: 10.0, r: cr, b: b * 0.6 });
      const band = spanLine(stone, 15.2, b * 0.4);
      const handle = `M8.8 10.2V6.6A1.8 1.8 0 0 1 10.6 4.8H16.2`;
      // Solid: 2 separate padded granite halves (Upper Stone Half y=10.2..14.3 + Lower Stone Half y=16.1..20.2) + handle!
      const topStone = bloatRect({ x: 3.0, y: 10.2, w: 18.0, h: 4.1, r: [cr, cr, 0.8, 0.8], b: b * 0.45 });
      const botStone = bloatRect({ x: 3.0, y: 16.1, w: 18.0, h: 4.1, r: [0.8, 0.8, cr, cr], b: b * 0.45 });
      return {
        keylines: drawKeylines([], [...stone.anchors, [8.8, 4.8], [16.2, 4.8]]),
        line: `<path d="${stone.d}"/><path d="${band}"/><path d="${handle}"/>`,
        solid: {
          face: [topStone.d, botStone.d],
          stroke: [handle]
        },
        duotone: { tone: [stone.d], secondary: [band, handle], line: `<path d="${stone.d}"/><path d="${band}"/><path d="${handle}"/>` }
      };
    }
};
