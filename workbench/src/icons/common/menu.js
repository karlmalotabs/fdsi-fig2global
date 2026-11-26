// Surgical-precision icon module: fdsi-menu (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-nav-menu",
  slug: "menu",
  name: "Navigation Hamburger Menu (14×14 Zone)",
  area: "common",
  order: 9,
  desc: "Three balanced horizontal bars (x=4.5..19.5 at y=7, 12, and 4.5..14.5 at y=17); Solid uses 3 separate padded pill bars.",
  meta: {
      "slug": "menu",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Open primary application navigation drawer or mobile hamburger menu.",
      "tags": [
          "menu",
          "hamburger",
          "navigation",
          "drawer",
          "bars",
          "sidebar",
          "list"
      ],
      "status": "approved"
  },
  build: ({ s }) => {
      const b1 = `M4.5 7.0H19.5`, b2 = `M4.5 12.0H19.5`, b3 = `M4.5 17.0H14.5`;
      const w = s + 0.45;
      return {
        keylines: drawKeylines([], [[4.5, 7], [19.5, 7], [4.5, 12], [19.5, 12], [4.5, 17], [14.5, 17]]),
        line: `<path d="${b1}${b2}${b3}"/>`,
        solid: { face: [capsule([4.5, 7], [19.5, 7], w), capsule([4.5, 12], [19.5, 12], w), capsule([4.5, 17], [14.5, 17], w)] },
        duotone: { secondary: [b2], line: `<path d="${b1}${b3}"/>` }
      };
    }
};
