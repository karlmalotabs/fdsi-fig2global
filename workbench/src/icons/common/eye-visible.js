// Surgical-precision icon module: fdsi-eye-visible (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-09-eye-visible",
  slug: "eye-visible",
  name: "#9. Eye / Show Balance (Symmetric Intersecting Ogive Arcs + Pupil Ring)",
  area: "common",
  order: 42,
  desc: "Almond eye contour formed by 2 exact circular arcs (R=11.8) meeting at (2.4, 12.0) and (21.6, 12.0) + center iris circle (r=3.0). Solid: filled eye with concentric iris ring!",
  meta: {
      "slug": "eye-visible",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Show wallet balance, reveal password, or unhide sensitive account data.",
      "tags": [
          "eye",
          "show",
          "visible",
          "reveal",
          "view",
          "balance",
          "password",
          "privacy"
      ]
  },
  build: () => {
      // Exact circular arc ogive from (2.4, 12.0) to (21.6, 12.0) with peak at y=5.4 and y=18.6 (R=10.3):
      const eye = `M2.4 12.0A10.4 10.4 0 0 1 21.6 12.0A10.4 10.4 0 0 1 2.4 12.0Z`;
      const pupil = circleD(12.0, 12.0, 3.0);
      return {
        keylines: drawKeylines([[12, 12, 3.0], [12, 15.8, 10.4], [12, 8.2, 10.4]], [[2.4, 12], [21.6, 12], [12, 12]]),
        line: `<path d="${eye}"/><path d="${pupil}"/>`,
        solid: {
          fill: [eye],
          holeExact: [circleD(12.0, 12.0, 4.2)],
          over: [circleD(12.0, 12.0, 2.1)]
        },
        duotone: { tone: [eye], secondary: [pupil], line: `<path d="${eye}"/><path d="${pupil}"/>` }
      };
    }
};
