// Surgical-precision icon module: fdsi-theme-dark (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-100-moon-dark",
  slug: "theme-dark",
  name: "#100. Theme / Dark Mode Crescent Moon (Exact Intersecting Circular Arcs)",
  area: "common",
  order: 133,
  desc: "Constructed from 2 exact intersecting circles: Outer circle (12.2, 12.0, R=8.6) and Inner offset cutout circle (15.6, 8.6, R=7.4) meeting at (11.2, 3.5) and (20.5, 12.8)!",
  meta: {
      "slug": "theme-dark",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Toggle dark mode appearance or night-time display theme.",
      "tags": [
          "moon",
          "dark",
          "night",
          "theme",
          "appearance",
          "mode"
      ]
  },
  build: () => {
      // Exact crescent moon formed by outer arc R=8.6 and inner concave arc R=7.2 between tips (11.2, 3.6) and (20.4, 12.8):
      const moon = `M11.2 3.6A8.6 8.6 0 1 0 20.4 12.8A6.8 6.8 0 0 1 11.2 3.6Z`;
      return {
        keylines: drawKeylines([[12.0, 12.0, 8.6], [15.8, 8.2, 6.8]], [[11.2, 3.6], [20.4, 12.8]]),
        line: `<path d="${moon}"/>`,
        solid: { fill: [moon] },
        duotone: { tone: [moon], line: `<path d="${moon}"/>` }
      };
    }
};
