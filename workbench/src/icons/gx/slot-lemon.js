// Surgical-precision icon module: fdsi-slot-lemon (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-145-slot-lemon",
  slug: "slot-lemon",
  name: "#145. Slot Lemon / Citrus Fruit (45° Prolate Citrus Hull + Nipple Tips + Leaf)",
  area: "gx",
  order: 178,
  desc: "45° prolate citrus hull (`R=11.0` circular arcs with rounded citrus tips at (4.4, 19.6) and (19.6, 4.4)) + curved highlight arc inside.",
  meta: {
      "slug": "slot-lemon",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Citrus lemon fruit symbol for classic fruit machines and juicy slots.",
      "tags": [
          "lemon",
          "citrus",
          "fruit",
          "classic-slots",
          "arcade",
          "yellow"
      ]
  },
  build: () => {
      const hull = `M3.8 18.6A11.0 11.0 0 0 1 18.6 3.8A1.35 1.35 0 0 1 20.2 5.4A11.0 11.0 0 0 1 5.4 20.2A1.35 1.35 0 0 1 3.8 18.6Z`;
      const shine = `M7.6 13.6A7.6 7.6 0 0 1 13.6 7.6`;
      const shineHole = `M7.6 13.6A7.6 7.6 0 0 1 13.6 7.6`;
      return {
        keylines: drawKeylines([], [[4.4, 19.6], [19.6, 4.4], [7.6, 13.6], [13.6, 7.6]]),
        line: `<path d="${hull}"/><path d="${shine}"/>`,
        solid: {
          fill: [hull],
          cut: [shineHole]
        },
        duotone: { tone: [hull], secondary: [shine], line: `<path d="${hull}"/><path d="${shine}"/>` }
      };
    }
};
