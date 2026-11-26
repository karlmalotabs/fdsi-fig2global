// Surgical-precision icon module: fdsi-close-circle (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-close-circle",
  slug: "close-circle",
  name: "Close Circle (Dismiss Badge)",
  area: "common",
  order: 2,
  desc: "r=9 circular container with a compact 7×7 centered 45° X (8.5..15.5) punched via capsule holes in Solid.",
  meta: {
      "slug": "close-circle",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Enclosed circular close action for clearing search fields, tags, or toast alerts.",
      "tags": [
          "close",
          "circle",
          "clear",
          "reset",
          "cancel",
          "remove",
          "delete",
          "chip"
      ],
      "status": "approved",
      "reworkNote": "Something is really wrong about it"
  },
  build: ({ s }) => {
      const ring = circleD(12, 12, 9);
      const xCross = `M9.0 9.0L15.0 15.0M15.0 9.0L9.0 15.0`;
      const holes = [capsule([9.0, 9.0], [15.0, 15.0], s), capsule([15.0, 9.0], [9.0, 15.0], s)];
      return {
        keylines: drawKeylines([[12, 12, 9], [12, 12, 4.25]], [[9, 9], [15, 15], [15, 9], [9, 15]]),
        line: `<path d="${ring}"/><path d="${xCross}"/>`,
        solid: { fill: [ring], holeExact: holes },
        duotone: { tone: [ring], secondary: [xCross], line: `<path d="${ring}"/>` }
      };
    }
};
