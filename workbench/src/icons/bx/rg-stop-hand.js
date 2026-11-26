// Surgical-precision icon module: fdsi-rg-stop-hand (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-160-rg-stop-hand",
  slug: "rg-stop-hand",
  name: "#160. Responsible Gaming — Stop Hand (Unified Palm-Thumb Base + 4 Aligned Fingers!)",
  area: "bx",
  order: 193,
  desc: "FIXED HAND ANATOMY: Integrated the thumb and rounded palm into a single natural lower-hand silhouette (`x=3.2..19.4, y=10.8..20.6`), with the 4 fingers aligned directly across the top of the palm (`x=6.8..19.4`)!",
  meta: {
      "slug": "rg-stop-hand",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Responsible Gaming self-exclusion, deposit cap, or take-a-break stop prompt.",
      "tags": [
          "responsible-gaming",
          "rg",
          "stop",
          "hand",
          "self-exclusion",
          "limit",
          "protection",
          "pause"
      ]
  },
  build: () => {
      // Line mode: Natural 5-finger open stop hand:
      // 4 fingers spanning x=6.8..19.2:
      // Index: x=6.8..9.6 (top y=4.6), Middle: x=10.0..12.8 (top y=3.2), Ring: x=13.2..16.0 (top y=4.0), Pinky: x=16.4..19.2 (top y=6.0)
      // Left thumb extends at 45° to (3.4, 11.6) and curves smoothly around the bottom of the palm (R=6.2) to (19.2, 14.6)!
      const handLine =
        `M6.8 11.2V5.0A1.4 1.4 0 0 1 9.6 5.0V10.0` +
        `M9.8 10.0V3.6A1.4 1.4 0 0 1 12.6 3.6V10.0` +
        `M12.8 10.0V4.4A1.4 1.4 0 0 1 15.6 4.4V10.2` +
        `M15.8 10.2V6.2A1.4 1.4 0 0 1 18.6 6.2V14.4` +
        `A6.0 6.0 0 0 1 6.8 15.8` +
        `L3.6 12.2A1.5 1.5 0 0 1 5.8 10.0L6.8 11.2Z`;

      // Solid mode:
      // - 4 separate rounded finger pills (`f1..f4`) aligned with the palm (`x = 6.6..18.8, y = 3.0..9.6`)
      // - 1 unified Palm + Thumb silhouette below (`palmThumbSolid` at `y = 11.0..20.6`, 1.4px below the fingers!)
      const f1 = capsule(8.1,  5.0, 8.1,  8.6, 1.25);
      const f2 = capsule(11.2, 3.6, 11.2, 8.6, 1.25);
      const f3 = capsule(14.3, 4.4, 14.3, 8.6, 1.25);
      const f4 = capsule(17.4, 6.0, 17.4, 8.6, 1.25);
      const palmThumbSolid =
        `M6.8 11.0H18.0` +
        `A1.0 1.0 0 0 1 19.0 12.0V14.4` +
        `A6.2 6.2 0 0 1 6.8 16.0` +
        `L3.4 12.2A1.6 1.6 0 0 1 5.8 10.0L6.8 11.0Z`;

      return {
        keylines: drawKeylines([[12.8, 14.4, 6.0]], [[8.1, 3.8], [11.2, 2.4], [14.3, 3.2], [17.4, 4.8], [3.6, 12.2]]),
        line: `<path d="${handLine}"/>`,
        solid: {
          face: [f1, f2, f3, f4, palmThumbSolid]
        },
        duotone: {
          tone: [palmThumbSolid],
          secondary: [handLine],
          line: `<path d="${handLine}"/>`
        }
      };
    }
};
