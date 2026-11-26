// Surgical-precision icon module: fdsi-sliders (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, bloatRect, edgeX, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-tuning-sliders",
  slug: "sliders",
  name: "Tuning Sliders (edgeX-Locked Tracks + Bloated Knobs)",
  area: "common",
  order: 20,
  desc: "Two horizontal tracks locked via edgeX to the left and right walls of two bloated adjustment knobs.",
  meta: {
      "slug": "sliders",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Adjust granular filter parameters, bet ranges, or display controls.",
      "tags": [
          "sliders",
          "tuning",
          "controls",
          "adjust",
          "preferences",
          "options",
          "equalizer"
      ]
  },
  build: ({ b, r }) => {
      const k1 = bloatRect({ x: 7.0, y: 5.0, w: 4.5, h: 5.0, r: Math.min(r, 1.5), b: b * 0.5 });
      const k2 = bloatRect({ x: 12.5, y: 14.0, w: 4.5, h: 5.0, r: Math.min(r, 1.5), b: b * 0.5 });
      const x1L = edgeX(k1.poly, 7.5, "left"), x1R = edgeX(k1.poly, 7.5, "right");
      const x2L = edgeX(k2.poly, 16.5, "left"), x2R = edgeX(k2.poly, 16.5, "right");
      const tracks = `M3.5 7.5H${f(x1L)}M${f(x1R)} 7.5H20.5M3.5 16.5H${f(x2L)}M${f(x2R)} 16.5H20.5`;
      return {
        keylines: drawKeylines([], [[x1L, 7.5], [x1R, 7.5], [x2L, 16.5], [x2R, 16.5]]),
        line: `<path d="${tracks}"/><path d="${k1.d}"/><path d="${k2.d}"/>`,
        solid: { fill: [k1.d, k2.d], stroke: [tracks] },
        duotone: { tone: [k1.d, k2.d], secondary: [tracks], line: `<path d="${k1.d}"/><path d="${k2.d}"/>` }
      };
    }
};
