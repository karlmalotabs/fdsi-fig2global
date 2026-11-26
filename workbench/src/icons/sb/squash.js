// Surgical-precision icon module: fdsi-squash (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "squash-racket",
  slug: "squash",
  name: "Squash Racket & Ball (Symmetrical Teardrop Hoop + 4 Rounded Window Holes)",
  area: "sb",
  order: 209,
  desc: "FIXED: Built from an r=5.5 upper circular arc tangent into a V-throat at (9.5, 16.2) + vertical shaft + 4 individual rounded string windows in Solid.",
  meta: {
      "slug": "squash",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "PSA World Tour squash match, game handicap, and point markets.",
      "tags": [
          "squash",
          "racket",
          "ball",
          "court",
          "psa",
          "racquet-sports"
      ]
  },
  build: ({ s }) => {
      // Exact teardrop racket head: r=5.4 top circle at (9.5, 8.2) tangent down to throat apex (9.5, 16.0)!
      const hoop = `M4.5 10.2A5.4 5.4 0 1 1 14.5 10.2L9.5 16.0Z`;
      const strings = `M4.2 8.2H14.8M9.5 2.8V16.0`;
      const handle = `M9.5 16.0V21.2`;
      const ball = circleD(18.2, 17.8, 2.5);
      // In Solid mode: filled teardrop hoop with a single bold rounded interior teardrop cutout (or 4 rounded quadrant windows) + filled ball!
      const innerTeardrop = `M6.5 9.6A3.2 3.2 0 1 1 12.5 9.6L9.5 13.4Z`;
      return {
        keylines: drawKeylines([[9.5, 8.2, 5.4], [18.2, 17.8, 2.5]], [[4.5, 10.2], [14.5, 10.2], [9.5, 16.0], [9.5, 21.2]]),
        line: `<path d="${hoop}"/><path d="${strings}"/><path d="${handle}"/><path d="${ball}"/>`,
        solid: {
          fill: [hoop, ball],
          holeExact: [innerTeardrop],
          stroke: [handle, `M6.2 8.2H12.8M9.5 4.8V13.4`]
        },
        duotone: {
          tone: [hoop, ball],
          secondary: [strings],
          line: `<path d="${hoop}"/><path d="${handle}"/><path d="${ball}"/>`
        }
      };
    }
};
