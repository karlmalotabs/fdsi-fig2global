// Surgical-precision icon module: fdsi-falcon-raptor (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "falcon-head",
  slug: "falcon-raptor",
  name: "Diving Falcon (Same Architecture as Greyhound — Filled Body + Swept Wing Lines)",
  area: "sb",
  order: 197,
  desc: "FIXED: Uses the winning Greyhound/Horse architecture — sleek filled raptor body + hooked beak paired with 2 swept wing & tail strokes.",
  meta: {
      "slug": "falcon-raptor",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Eagles, Falcons, and avian team mascots or virtual bird racing.",
      "tags": [
          "falcon",
          "eagle",
          "hawk",
          "bird",
          "raptor",
          "mascot",
          "wings"
      ]
  },
  build: () => {
      // Sleek diving raptor body + hooked beak (filled in both Line and Solid, just like Greyhound!):
      const body =
        `M7.5 13.5` +
        `Q12.0 10.5 16.5 9.8` +                 // streamlined back
        `A3.0 3.0 0 0 1 21.2 12.2` +            // hooked raptor head & beak tip!
        `L19.2 13.5L17.8 12.4` +                // beak hook underside
        `C15.5 15.2 11.5 16.2 7.5 14.8Z`;       // full breast curve
      // Swept primary wing rising above the back + secondary wing/tail lines (just like the horse's detached legs!):
      const wingMain = roundOpen([[14.5, 10.2], [9.5, 4.2], [4.2, 5.8]], 1.5);
      const wingFar = roundOpen([[16.2, 9.8], [13.2, 5.2], [9.5, 6.2]], 1.2);
      const tail = roundOpen([[7.5, 14.2], [3.5, 16.5], [2.5, 14.5]], 1.2);
      return {
        keylines: drawKeylines([[18.5, 11.8, 2.5]], [[9.5, 4.2], [4.2, 5.8], [21.2, 12.2]]),
        line: `<path d="${body}" fill="currentColor" stroke="none"/><path d="${wingMain}"/><path d="${wingFar}"/><path d="${tail}"/>`,
        solid: {
          face: [body],
          tubes: [[wingMain, 1.95], [wingFar, 1.75], [tail, 1.8]]
        },
        duotone: {
          tone: [body],
          secondary: [wingFar, tail],
          line: `<path d="${body}"/><path d="${wingMain}"/>`
        }
      };
    }
};
