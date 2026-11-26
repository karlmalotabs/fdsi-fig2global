// Surgical-precision icon module: fdsi-rugby-ball (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b-22-rugby-ball",
  slug: "rugby-ball",
  name: "#22. Rugby Ball (45° Rounded Oval Hull + Longitudinal Panel Seams)",
  area: "sb",
  order: 55,
  desc: "Fuller 45° rugby oval with rounded polar tips + longitudinal seam arcs curving from tip to tip. Solid: filled rugby hull with crisp seam cuts.",
  meta: {
      "slug": "rugby-ball",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Rugby Union, Rugby League, Six Nations, and NRL betting markets.",
      "tags": [
          "rugby",
          "union",
          "league",
          "six-nations",
          "nrl",
          "oval-ball"
      ]
  },
  build: () => {
      // Rounded 45° rugby oval using r=2.0 tip caps at (5.0, 19.0) and (19.0, 5.0) + wide r=13.0 belly arcs:
      const hull = `M3.8 17.8A12.8 12.8 0 0 1 17.8 3.8A2.1 2.1 0 0 1 20.2 6.2A12.8 12.8 0 0 1 6.2 20.2A2.1 2.1 0 0 1 3.8 17.8Z`;
      const seamCenter = `M4.6 19.4L19.4 4.6`;
      const seamUpper = `M4.6 19.4A16.5 16.5 0 0 1 19.4 4.6`;
      const seamLower = `M4.6 19.4A16.5 16.5 0 0 0 19.4 4.6`;
      const uidR = "rb6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidR}"><path d="${hull}"/></clipPath></defs>` +
                    `<path d="${hull}"/><g clip-path="url(#${uidR})"><path d="${seamUpper}"/><path d="${seamLower}"/></g>`;
      return {
        keylines: drawKeylines([], [[4.6, 19.4], [19.4, 4.6], [12, 12]]),
        line: lineM,
        solid: { fill: [hull], cut: [seamUpper, seamLower] },
        duotone: { tone: [hull], secondary: [seamUpper, seamLower], line: lineM }
      };
    }
};
