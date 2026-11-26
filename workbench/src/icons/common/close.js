// Surgical-precision icon module: fdsi-close (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-close-x",
  slug: "close",
  name: "Close X (12×12 Optical Glyph)",
  area: "common",
  order: 1,
  desc: "Crisp 45° X mark in the 12×12 optical glyph zone (6.5..17.5). Solid uses thicker 2.4px intersecting capsule bars.",
  meta: {
      "slug": "close",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Dismiss modal, close drawer, clear input, or cancel current action.",
      "tags": [
          "close",
          "dismiss",
          "cancel",
          "clear",
          "remove",
          "x",
          "cross",
          "modal"
      ],
      "status": "approved"
  },
  build: ({ s }) => {
      const xLine = `M6.8 6.8L17.2 17.2M17.2 6.8L6.8 17.2`;
      const c1 = capsule([6.8, 6.8], [17.2, 17.2], s + 0.45);
      const c2 = capsule([17.2, 6.8], [6.8, 17.2], s + 0.45);
      return {
        keylines: drawKeylines([[12, 12, 7.35]], [[6.8, 6.8], [17.2, 17.2], [17.2, 6.8], [6.8, 17.2]]),
        line: `<path d="${xLine}"/>`,
        solid: { face: [c1, c2] },
        duotone: { tone: [circleD(12, 12, 8.5)], secondary: [`M17.2 6.8L6.8 17.2`], line: `<path d="M6.8 6.8L17.2 17.2"/>` }
      };
    }
};
