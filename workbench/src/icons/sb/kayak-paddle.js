// Surgical-precision icon module: fdsi-kayak-paddle (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-102-kayak-paddle",
  slug: "kayak-paddle",
  name: "#102. Kayak & Double-Bladed Paddle (Pointed Kayak Hull + Crossed Double-Blade Paddle)",
  area: "sb",
  order: 135,
  desc: "REBUILT WITH KAYAK + PADDLE: Pointed symmetric kayak ogive hull (y=2.8..21.2, x=8.4..15.6) with center cockpit + horizontal double-bladed paddle (x=2.4..21.6) across the beam!",
  meta: {
      "slug": "kayak-paddle",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Canoe sprint, kayak slalom, and whitewater paddling markets.",
      "tags": [
          "kayak",
          "canoe",
          "paddle",
          "boat",
          "slalom",
          "water-sports",
          "olympic"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.4, 0.8);
      // Pointed kayak ogive hull from bow (12.0, 2.8) to stern (12.0, 21.2) using exact R=13.5 circular arcs:
      const kayak = `M12.0 2.8A13.5 13.5 0 0 1 12.0 21.2A13.5 13.5 0 0 1 12.0 2.8Z`;
      // Left and Right paddle blades + horizontal paddle shaft at y=12.0:
      const bladeL = bloatPoly([[2.4, 9.6], [6.4, 10.5], [6.4, 13.5], [2.4, 14.4]], cr, b * 0.25, { minEdge: 1.8 });
      const bladeR = bloatPoly([[17.6, 10.5], [21.6, 9.6], [21.6, 14.4], [17.6, 13.5]], cr, b * 0.25, { minEdge: 1.8 });
      const shaft = `M6.4 12.0H17.6`;
      // Solid mode:
      // - Upper Kayak Bow (`kayakBow`, y=2.8..10.2) + Lower Kayak Stern (`kayakStern`, y=13.8..21.2) as 2 separate padded shapes!
      // - Plus `bladeL.d`, `bladeR.d` in `face` and `shaft` in `stroke`!
      const kayakBow   = `M12.0 2.8A13.5 13.5 0 0 1 15.6 10.2H8.4A13.5 13.5 0 0 1 12.0 2.8Z`;
      const kayakStern = `M8.4 13.8H15.6A13.5 13.5 0 0 1 12.0 21.2A13.5 13.5 0 0 1 8.4 13.8Z`;
      return {
        keylines: drawKeylines([], [[12, 2.8], [12, 21.2], ...bladeL.anchors, ...bladeR.anchors]),
        line: `<path d="${kayak}"/><path d="${bladeL.d}"/><path d="${bladeR.d}"/><path d="${shaft}"/>`,
        solid: {
          face: [kayakBow, kayakStern, bladeL.d, bladeR.d],
          stroke: [shaft]
        },
        duotone: {
          tone: [kayak],
          secondary: [bladeL.d, bladeR.d, shaft],
          line: `<path d="${kayak}"/><path d="${bladeL.d}"/><path d="${bladeR.d}"/><path d="${shaft}"/>`
        }
      };
    }
};
