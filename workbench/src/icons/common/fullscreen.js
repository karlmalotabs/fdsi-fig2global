// Surgical-precision icon module: fdsi-fullscreen (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-93-fullscreen-expand",
  slug: "fullscreen",
  name: "#93. Fullscreen / Expand View (4 Corner Brackets + Outward 45° Rays)",
  area: "common",
  order: 126,
  desc: "4 symmetric corner L-brackets at (3.8, 3.8), (20.2, 3.8), (20.2, 20.2), (3.8, 20.2) with 4 outward 45° expansion rays leaving an open 5.6px center.",
  meta: {
      "slug": "fullscreen",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Expand live stream video or casino game canvas to full screen.",
      "tags": [
          "fullscreen",
          "expand",
          "maximize",
          "enlarge",
          "video",
          "screen"
      ]
  },
  build: () => {
      const corners =
        `M3.8 9.0V3.8H9.0` +
        `M15.0 3.8H20.2V9.0` +
        `M20.2 15.0V20.2H15.0` +
        `M9.0 20.2H3.8V15.0`;
      const rays =
        `M3.8 3.8L9.2 9.2` +
        `M20.2 3.8L14.8 9.2` +
        `M20.2 20.2L14.8 14.8` +
        `M3.8 20.2L9.2 14.8`;
      const centerBox = bloatRect({ x: 7.5, y: 7.5, w: 9.0, h: 9.0, r: 1.5, b: 0.2 });
      return {
        keylines: drawKeylines([], [[3.8, 3.8], [20.2, 3.8], [20.2, 20.2], [3.8, 20.2]]),
        line: `<path d="${corners}"/><path d="${rays}"/>`,
        solid: { stroke: [corners, rays] },
        duotone: { tone: [centerBox.d], secondary: [rays], line: `<path d="${corners}"/><path d="${rays}"/>` }
      };
    }
};
