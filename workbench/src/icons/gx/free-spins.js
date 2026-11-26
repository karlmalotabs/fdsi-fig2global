// Surgical-precision icon module: fdsi-free-spins (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-73-free-spins-cycle",
  slug: "free-spins",
  name: "#73. Free Spins / Respin Cycle (2 Chasing 145° Circular Arcs + Filled Center Star)",
  area: "gx",
  order: 106,
  desc: "2 symmetric chasing circular arrows (R=8.6) with vertical-tangent arrowheads at (3.4, 12.0) and (20.6, 12.0) + filled 4-point sparkle star in the center!",
  meta: {
      "slug": "free-spins",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Free spins bonus rounds, respin mechanics, and auto-spin controls.",
      "tags": [
          "free-spins",
          "respin",
          "spin",
          "cycle",
          "arrows",
          "bonus-round",
          "slots"
      ]
  },
  build: () => {
      // Top arc from 200° to 360° (terminating at (20.6, 12.0) heading straight DOWN -> symmetric chevron M18.2 9.4 L20.6 12.2 L23.0 9.4)
      // Bottom arc from 20° to 180° (terminating at (3.4, 12.0) heading straight UP -> symmetric chevron M1.0 14.6 L3.4 11.8 L5.8 14.6)
      const arcTop = arcPath(12.0, 12.0, 8.4, 205, 360);
      const headR  = `M18.0 9.4L20.4 12.2L22.8 9.4`;
      const arcBot = arcPath(12.0, 12.0, 8.4, 25, 180);
      const headL  = `M1.2 14.6L3.6 11.8L6.0 14.6`;
      const star = `M12.0 7.6Q12.6 11.4 16.4 12.0Q12.6 12.6 12.0 16.4Q11.4 12.6 7.6 12.0Q11.4 11.4 12.0 7.6Z`;
      return {
        keylines: drawKeylines([[12, 12, 8.4]], [[20.4, 12.2], [3.6, 11.8], [12, 12]]),
        line: `<path d="${arcTop}"/><path d="${headR}"/><path d="${arcBot}"/><path d="${headL}"/><path d="${star}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [star],
          stroke: [arcTop, headR, arcBot, headL]
        },
        duotone: {
          tone: [circleD(12, 12, 8.4)],
          secondary: [arcTop, headR, arcBot, headL],
          line: `<path d="${arcTop}"/><path d="${headR}"/><path d="${arcBot}"/><path d="${headL}"/><path d="${star}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
