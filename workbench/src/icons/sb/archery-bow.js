// Surgical-precision icon module: fdsi-archery-bow (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-35-archery-bow",
  slug: "archery-bow",
  name: "#35. Recurve Archery Bow & Broadhead Arrow (45° Drawn V-String + Recurve Limbs + Broadhead)",
  area: "sb",
  order: 68,
  desc: "FIXED PRECISION: Symmetrical 45° recurve bow limbs curving through riser (14.6, 9.4) to tips (4.6, 8.2) & (15.8, 19.4), tensioned V-bowstring drawn to nock (5.4, 18.6), and sharp triangular broadhead at (20.4, 3.6)!",
  meta: {
      "slug": "archery-bow",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Olympic recurve and compound archery head-to-head and medal markets.",
      "tags": [
          "archery",
          "bow",
          "arrow",
          "recurve",
          "target",
          "olympic"
      ]
  },
  build: () => {
      // Symmetrical 45° Recurve Bow Limbs around the 45° axis (riser center at (14.5, 9.5)):
      // Upper limb: from tip (4.6, 8.2) with recurve flick, arching through (11.2, 5.2) to riser (14.5, 9.5)
      // Lower limb: from riser (14.5, 9.5) arching through (18.8, 12.8) to recurve tip (15.8, 19.4)
      const bowLine =
        `M4.6 8.2` +
        `C6.4 6.2 11.2 5.4 14.5 9.5` +
        `C18.6 12.8 17.8 17.6 15.8 19.4`;
      // Drawn V-Bowstring pulled back from limb tips (4.6, 8.2) & (15.8, 19.4) to the arrow nock at (5.4, 18.6):
      const string = `M4.6 8.2L5.4 18.6L15.8 19.4`;
      // Arrow shaft from nock (5.4, 18.6) through riser (14.5, 9.5) to broadhead base (19.0, 5.0):
      const shaft = `M5.4 18.6L19.0 5.0`;
      // Sharp triangular broadhead at (20.6, 3.4) (filled polygon so it's razor-sharp in both Line and Solid!):
      const head = `M15.8 5.0L20.6 3.4L19.0 8.2L18.0 6.0Z`;
      // Tapered solid recurve bow limb silhouette for Solid mode:
      const bowSolid =
        `M4.6 8.2` +
        `C6.6 5.6 11.8 4.6 15.3 8.7` +
        `C19.4 12.2 18.4 17.4 15.8 19.4` +
        `C17.2 16.8 17.2 13.0 13.7 10.3` +
        `C11.0 6.8 7.2 6.8 4.6 8.2Z`;
      return {
        keylines: drawKeylines([], [[4.6, 8.2], [15.8, 19.4], [5.4, 18.6], [14.5, 9.5], [20.6, 3.4]]),
        line: `<path d="${bowLine}"/><path d="${string}"/><path d="${shaft}"/><path d="${head}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [bowSolid],
          face: [head],
          stroke: [string, shaft]
        },
        duotone: {
          tone: [`M4.6 8.2C6.4 6.2 11.2 5.4 14.5 9.5C18.6 12.8 17.8 17.6 15.8 19.4L5.4 18.6Z`],
          secondary: [shaft],
          line: `<path d="${bowLine}"/><path d="${string}"/><path d="${shaft}"/><path d="${head}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
