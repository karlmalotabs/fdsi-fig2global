// Surgical-precision icon module: fdsi-calendar (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, spanLine, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-16-calendar-schedule",
  slug: "calendar",
  name: "Calendar / Match Schedule",
  area: "sb",
  order: 49,
  desc: "Built like Betslip & Crown: 2 separate padded shapes in Solid — Top Header Bar (y=4.8..9.0) + 2 top ring pegs + Lower Calendar Body (y=10.8..20.5) with 2 date dots!",
  meta: {
      "slug": "calendar",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Browse upcoming fixture schedules, match dates, or transaction history by date.",
      "tags": [
          "calendar",
          "date",
          "schedule",
          "fixtures",
          "events",
          "day",
          "month",
          "planner"
      ],
      "status": "todo",
      "reworkNote": "asdasdadaslkdjaslkd jalkjd alksjd alksjd alksjd.  aklsdjaskldja da asda s"
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 0.2, 2.0);
      const C = bloatRect({ x: 3.5, y: 5.0, w: 17.0, h: 15.5, r: cr, b });
      const hdrLine = spanLine(C, 9.8, b * 0.4);
      const pegs = `M8.2 3.2V6.4M15.8 3.2V6.4`;
      const dotsLine = `M8.2 14.5H10.2M13.8 14.5H15.8`;
      // Solid: 2 separate padded shapes (Top Header + Lower Body with 1.8px gap!)
      const topBar = bloatRect({ x: 3.5, y: 5.0, w: 17.0, h: 4.0, r: [cr, cr, 0.8, 0.8], b: b * 0.35 });
      const botBody = bloatRect({ x: 3.5, y: 10.8, w: 17.0, h: 9.7, r: [0.8, 0.8, cr, cr], b: b * 0.45 });
      const d1 = circleD(9.2, 15.5, 1.35);
      const d2 = circleD(14.8, 15.5, 1.35);
      return {
        keylines: drawKeylines([[9.2, 15.5, 1.35], [14.8, 15.5, 1.35]], [...topBar.anchors, ...botBody.anchors]),
        line: `<path d="${C.d}"/><path d="${hdrLine}"/><path d="${pegs}"/><path d="${dotsLine}"/>`,
        solid: {
          face: [topBar.d, botBody.d],
          holeExact: [d1, d2],
          stroke: [pegs]
        },
        duotone: { tone: [botBody.d], secondary: [hdrLine, pegs, dotsLine], line: `<path d="${C.d}"/><path d="${hdrLine}"/><path d="${pegs}"/><path d="${dotsLine}"/>` }
      };
    }
};
