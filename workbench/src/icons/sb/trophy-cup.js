// Surgical-precision icon module: fdsi-trophy-cup (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-41-trophy-cup",
  slug: "trophy-cup",
  name: "#41. Championship Trophy Cup (2 Separate Padded Shapes — U-Chalice + Pedestal Base)",
  area: "sb",
  order: 74,
  desc: "Built like Crown & Filter Funnel: Deep U-shaped trophy bowl (x=6.4..17.6, y=3.4..13.2) with symmetric C-handles + pedestal stem & base (y=17.4..20.4). Solid: 2 separate padded shapes + handles!",
  meta: {
      "slug": "trophy-cup",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Championship outrights, tournament winners, and league futures markets.",
      "tags": [
          "trophy",
          "cup",
          "champion",
          "outrights",
          "futures",
          "winner",
          "league"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      // U-shaped trophy chalice bowl: flat top rim at y=3.6 (x=6.4..17.6) with r=0.8 top corners, vertical sides to y=8.4, and r=5.6 semicircular bottom bowl to y=14.0!
      const cup = `M7.2 3.6H16.8A0.8 0.8 0 0 1 17.6 4.4V8.4A5.6 5.6 0 0 1 6.4 8.4V4.4A0.8 0.8 0 0 1 7.2 3.6Z`;
      const handles = `M6.4 5.4H4.4A1.6 1.6 0 0 0 2.8 7.0V8.2A3.2 3.2 0 0 0 6.0 11.4H6.6M17.6 5.4H19.6A1.6 1.6 0 0 1 21.2 7.0V8.2A3.2 3.2 0 0 1 18.0 11.4H17.4`;
      const stem = `M12.0 14.0V17.4`;
      const baseLine = bloatRect({ x: 6.6, y: 17.4, w: 10.8, h: 3.0, r: cr, b: b * 0.3 });
      // Solid: 2 Separate Padded Shapes (Upper Trophy Bowl y=3.4..14.0 + Lower Stepped Pedestal Plinth y=16.0..20.6, separated by a 2.0px gap!) + side handle strokes!
      const cupSolid = `M7.0 3.4H17.0A1.0 1.0 0 0 1 18.0 4.4V8.4A6.0 6.0 0 0 1 6.0 8.4V4.4A1.0 1.0 0 0 1 7.0 3.4Z`;
      const baseSolid = bloatPoly([
        [9.6, 15.8], [14.4, 15.8], [14.4, 17.4], [17.8, 17.4], [17.8, 20.6], [6.2, 20.6], [6.2, 17.4], [9.6, 17.4]
      ], [0.7, 0.7, 0.25, 0.9, 0.9, 0.9, 0.9, 0.25], b * 0.25, { minEdge: 1.5 });
      return {
        keylines: drawKeylines([[12, 8.4, 5.6]], [[6.4, 3.6], [17.6, 3.6], [6.6, 20.4], [17.4, 20.4]]),
        line: `<path d="${cup}"/><path d="${handles}"/><path d="${stem}"/><path d="${baseLine.d}"/>`,
        solid: {
          face: [cupSolid, baseSolid.d],
          stroke: [handles]
        },
        duotone: { tone: [cup], secondary: [handles, stem, baseLine.d], line: `<path d="${cup}"/><path d="${handles}"/><path d="${stem}"/><path d="${baseLine.d}"/>` }
      };
    }
};
