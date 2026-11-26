// Surgical-precision icon module: fdsi-lucky-horseshoe (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-65-lucky-horseshoe",
  slug: "lucky-horseshoe",
  name: "#65. Lucky Horseshoe (3 Separate Padded Shapes in Solid — U-Arch + 2 Squared Heel Caps)",
  area: "gx",
  order: 98,
  desc: "Thick concentric U-horseshoe arch (cx=12, cy=12.4, R_out=8.4, R_in=4.4) opening upward to y=4.0 + 2 heel end-caps at top-left & top-right. Solid: 3 separate padded shapes!",
  meta: {
      "slug": "lucky-horseshoe",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Lucky horseshoe jackpot slots, western themes, and fortune symbols.",
      "tags": [
          "horseshoe",
          "luck",
          "fortune",
          "charm",
          "gold",
          "slots",
          "western"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.7);
      const shoeLine =
        `M3.6 4.0H7.6V12.2A4.4 4.4 0 0 0 16.4 12.2V4.0H20.4V12.2A8.4 8.4 0 0 1 3.6 12.2Z`;
      const seamL = `M3.6 7.4H7.6`;
      const seamR = `M16.4 7.4H20.4`;
      // Solid: 3 Separate Padded Shapes (2 Upper Heel Blocks at y=3.6..7.2 + Lower U-Arch from y=8.8..20.8)!
      const capL = bloatRect({ x: 3.4,  y: 3.6, w: 4.4, h: 3.6, r: cr, b: b * 0.2 });
      const capR = bloatRect({ x: 16.2, y: 3.6, w: 4.4, h: 3.6, r: cr, b: b * 0.2 });
      const archSolid =
        `M3.4 9.6A0.8 0.8 0 0 1 4.2 8.8H7.0A0.8 0.8 0 0 1 7.8 9.6V12.2` +
        `A4.2 4.2 0 0 0 16.2 12.2V9.6A0.8 0.8 0 0 1 17.0 8.8H19.8A0.8 0.8 0 0 1 20.6 9.6V12.2` +
        `A8.6 8.6 0 0 1 3.4 12.2Z`;
      return {
        keylines: drawKeylines([[12, 12.2, 8.4], [12, 12.2, 4.4]], [[3.6, 4.0], [7.6, 4.0], [16.4, 4.0], [20.4, 4.0]]),
        line: `<path d="${shoeLine}"/><path d="${seamL}"/><path d="${seamR}"/>`,
        solid: { face: [capL.d, capR.d, archSolid] },
        duotone: { tone: [shoeLine], secondary: [seamL, seamR], line: `<path d="${shoeLine}"/><path d="${seamL}"/><path d="${seamR}"/>` }
      };
    }
};
