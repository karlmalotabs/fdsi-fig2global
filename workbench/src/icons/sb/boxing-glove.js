// Surgical-precision icon module: fdsi-boxing-glove (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "boxing-glove-pro",
  slug: "boxing-glove",
  name: "Boxing Glove (Keyline Dome Arcs + Continuous Thumb Cut)",
  area: "sb",
  order: 201,
  desc: "Restored: Main Knuckle Dome Circle (13.0, 9.2, r=6.2) + Thumb Bolster Circle (6.6, 10.2, r=2.6) + bloatRect cuff + continuous U-shaped thumbWrap cut.",
  meta: {
      "slug": "boxing-glove",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Professional Championship Boxing bout winner, method of victory, and round betting.",
      "tags": [
          "boxing",
          "glove",
          "heavyweight",
          "bout",
          "knockout",
          "ring",
          "fight"
      ]
  },
  build: ({ b, r }) => {
      const mitt =
        `M7.2 15.5` +
        `C4.8 14.5 4.0 12.5 4.0 10.2` +
        `A2.6 2.6 0 0 1 6.6 7.6` +
        `A6.2 6.2 0 0 1 19.2 9.2` +
        `C19.2 12.2 18.8 14.2 18.0 15.5Z`;
      const thumbWrap = `M6.6 7.6H11.2A2.4 2.4 0 0 1 11.2 12.4H8.5`;
      const thumbCut = `M5.5 7.6H11.2A2.4 2.4 0 0 1 11.2 12.4H8.5`;
      const cuff = bloatRect({ x: 7.2, y: 15.5, w: 10.8, h: 4.8, r: Math.min(r * 0.7, 1.6), b: b * 0.4 });
      const cuffSolid = bloatRect({ x: 7.2, y: 16.5, w: 10.8, h: 4.0, r: Math.min(r * 0.7, 1.5), b: b * 0.4 });
      return {
        keylines: drawKeylines([[13.0, 9.2, 6.2], [6.6, 10.2, 2.6], [11.2, 10.0, 2.4]], [[6.6, 7.6], [19.2, 9.2], [7.2, 15.5], [18.0, 15.5]]),
        line: `<path d="${mitt}"/><path d="${thumbWrap}"/><path d="${cuff.d}"/>`,
        solid: {
          fill: [mitt, cuffSolid.d],
          cut: [thumbCut, `M3.0 15.8H21.0`]
        },
        duotone: {
          tone: [mitt],
          secondary: [thumbWrap, cuff.d],
          line: `<path d="${mitt}"/><path d="${cuff.d}"/>`
        }
      };
    }
};
