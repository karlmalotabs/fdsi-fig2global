// Surgical-precision icon module: fdsi-field-hockey (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-110-field-hockey",
  slug: "field-hockey",
  name: "#110. Field Hockey J-Stick & Ball (Tapered J-Hook Stick + Grip Seam + Ball)",
  area: "sb",
  order: 143,
  desc: "Diagonal field hockey shaft from top-right (18.8, 3.6) down-left to a curved J-hook toe at (4.0, 14.8)–(10.4, 19.6) + field hockey ball at (17.2, 17.2).",
  meta: {
      "slug": "field-hockey",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "FIH Pro League and Olympic turf field hockey match markets.",
      "tags": [
          "field-hockey",
          "stick",
          "ball",
          "turf",
          "fih",
          "olympic"
      ]
  },
  build: () => {
      // Classic J-curve field hockey stick + ball:
      const stickLine =
        `M17.8 3.6L8.2 16.4` +
        `A1.6 1.6 0 0 1 5.4 15.2` +
        `A1.5 1.5 0 0 0 2.8 16.4` +
        `C3.2 19.8 7.8 21.2 10.6 18.0` +
        `L20.2 5.2Z`;
      const ball = circleD(17.2, 17.2, 2.4);
      const ballSolid = circleD(17.2, 17.2, 2.7);
      return {
        keylines: drawKeylines([[17.2, 17.2, 2.4]], [[19.0, 4.4], [6.8, 18.6], [4.1, 15.8]]),
        line: `<path d="${stickLine}"/><path d="${ball}"/>`,
        solid: {
          fill: [stickLine],
          face: [ballSolid]
        },
        duotone: { tone: [stickLine, ball], line: `<path d="${stickLine}"/><path d="${ball}"/>` }
      };
    }
};
