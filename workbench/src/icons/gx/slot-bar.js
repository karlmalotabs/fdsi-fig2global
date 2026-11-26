// Surgical-precision icon module: fdsi-slot-bar (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-143-slot-bar",
  slug: "slot-bar",
  name: "#143. Slot BAR Symbol (2 Stacked Padded Bullion Plaques + Inner Emboss Bars)",
  area: "gx",
  order: 176,
  desc: "2 stacked horizontal slot BAR plaques: Upper BAR (x=3.2..20.8, y=4.2..10.8) + Lower BAR (x=3.2..20.8, y=13.2..19.8) with inner horizontal emboss lines!",
  meta: {
      "slug": "slot-bar",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Classic double BAR bullion symbol for vintage Vegas stepper slots.",
      "tags": [
          "bar",
          "slot-bar",
          "classic-slots",
          "stepper",
          "vintage",
          "vegas"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      const topBar = bloatRect({ x: 3.2, y: 4.2,  w: 17.6, h: 6.6, r: cr, b: b * 0.35 });
      const botBar = bloatRect({ x: 3.2, y: 13.2, w: 17.6, h: 6.6, r: cr, b: b * 0.35 });
      const emboss = `M7.2 7.5H16.8M7.2 16.5H16.8`;
      const h1 = capsule(7.2, 7.5,  16.8, 7.5,  0.88);
      const h2 = capsule(7.2, 16.5, 16.8, 16.5, 0.88);
      return {
        keylines: drawKeylines([], [...topBar.anchors, ...botBar.anchors]),
        line: `<path d="${topBar.d}"/><path d="${botBar.d}"/><path d="${emboss}"/>`,
        solid: {
          face: [topBar.d, botBar.d],
          holeExact: [h1, h2]
        },
        duotone: { tone: [topBar.d, botBar.d], secondary: [emboss], line: `<path d="${topBar.d}"/><path d="${botBar.d}"/><path d="${emboss}"/>` }
      };
    }
};
