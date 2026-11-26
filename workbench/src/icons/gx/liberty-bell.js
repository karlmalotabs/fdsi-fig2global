// Surgical-precision icon module: fdsi-liberty-bell (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-148-liberty-bell",
  slug: "liberty-bell",
  name: "#148. Slot Liberty Bell (3-Segment Tapered Z-Lightning Crack + Separate Padded Clapper!)",
  area: "gx",
  order: 181,
  desc: "FIXED CRACK: Replaced the wide triangle bite with a true 3-segment Z-lightning crack that breaks the bottom rim (1.8px wide) and zigs-and-zags to a razor-sharp point at (11.2, 7.6)!",
  meta: {
      "slug": "liberty-bell",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Iconic cracked golden Liberty Bell symbol from original mechanical slots.",
      "tags": [
          "liberty-bell",
          "bell",
          "cracked",
          "golden",
          "classic-slots",
          "jackpot"
      ]
  },
  build: () => {
      // Line mode: Bell dome broken at the bottom rim (x=12.2..14.2) by a 3-segment Z-zig-zag crack:
      const bellCrackedLine =
        `M12.0 16.0H4.5L6.4 13.2V9.6A5.6 5.6 0 0 1 17.6 9.6V13.2L19.5 16.0H14.4` +
        `M13.2 16.0L10.8 13.0L13.4 11.2L11.4 7.8`;
      const bellFull = `M6.4 13.2V9.6A5.6 5.6 0 0 1 17.6 9.6V13.2L19.5 16.0H4.5Z`;
      // Solid mode: True 3-segment tapered Z-lightning crack polygon (1.8px wide at bottom rim y=17.0, zig-zagging through two opposing bends to a sharp 0px tip at (11.2, 7.5)!):
      const zigFissure =
        `M12.2 17.0` +
        `L9.9 13.0` +
        `L12.5 11.2` +
        `L11.2 7.5` +
        `L14.5 11.5` +
        `L11.8 13.3` +
        `L14.1 17.0Z`;
      const clapper = `M9.8 19.2A2.4 2.4 0 0 0 14.2 19.2`;
      const clapperSolid = `M9.4 18.2A2.6 2.6 0 0 0 14.6 18.2Z`;
      return {
        keylines: drawKeylines([[12, 9.6, 5.6], [12, 18.2, 2.6]], [[11.2, 7.5], [13.4, 11.2], [10.8, 13.0], [13.2, 16.0]]),
        line: `<path d="${bellCrackedLine}"/><path d="${clapper}"/>`,
        solid: {
          fill: [bellFull],
          holeExact: [zigFissure],
          face: [clapperSolid]
        },
        duotone: { tone: [bellFull], secondary: [clapper], line: `<path d="${bellCrackedLine}"/><path d="${clapper}"/>` }
      };
    }
};
