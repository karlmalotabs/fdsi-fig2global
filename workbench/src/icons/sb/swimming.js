// Surgical-precision icon module: fdsi-swimming (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "swimming-crawl",
  slug: "swimming",
  name: "Swimming Crawl (Curved Recovery Arm & Back Line — No Triangle!)",
  area: "sb",
  order: 205,
  desc: "FIXED (Replaced Triangle with Clean Curved Line): Swimmer r=2.3 head + single continuous curved recovery arm & shoulder line above 2 sinusoidal water waves.",
  meta: {
      "slug": "swimming",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Olympic and World Aquatics freestyle, butterfly, and relay swimming.",
      "tags": [
          "swimming",
          "swimmer",
          "pool",
          "aquatics",
          "freestyle",
          "water-sports"
      ]
  },
  build: () => {
      const head = circleD(16.2, 9.2, 2.2);
      // Single clean curved stroke: starts at water entry (4.0, 12.2), rises to bent elbow (8.8, 5.2), comes down to shoulder (12.6, 10.5) and trails back to (5.5, 12.2)!
      const arm = roundOpen([[4.2, 12.2], [8.8, 5.2], [12.5, 11.2], [6.2, 12.2]], 1.4);
      const wave1 = `M2.5 15.6Q5.5 13.4 8.5 15.6T14.5 15.6T20.5 15.6`;
      const wave2 = `M2.5 19.5Q5.5 17.3 8.5 19.5T14.5 19.5T20.5 19.5`;
      return {
        keylines: drawKeylines([[16.2, 9.2, 2.2]], [[4.2, 12.2], [8.8, 5.2], [12.5, 11.2]]),
        line: `<path d="${head}"/><path d="${arm}"/><path d="${wave1}"/><path d="${wave2}"/>`,
        solid: {
          fill: [head],
          tubes: [[arm, 2.0]],
          stroke: [wave1, wave2]
        },
        duotone: {
          tone: [`M2.5 15.6Q5.5 13.4 8.5 15.6T14.5 15.6T20.5 15.6V19.5H2.5Z`, head],
          secondary: [wave1, wave2],
          line: `<path d="${head}"/><path d="${arm}"/>`
        }
      };
    }
};
