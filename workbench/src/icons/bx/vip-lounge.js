// Surgical-precision icon module: fdsi-vip-lounge (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-76-vip-martini",
  slug: "vip-lounge",
  name: "#76. VIP Lounge Cocktail / Martini (2 Separate Padded Bowl Shapes + Stem & Base)",
  area: "bx",
  order: 109,
  desc: "Built like Filter Funnel: V-shaped martini glass bowl (x=4.0..20.0, y=4.2..13.4) split by a liquid meniscus line + vertical stem to base (x=7.5..16.5, y=20.2).",
  meta: {
      "slug": "vip-lounge",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Exclusive VIP hospitality lounge, private tables, and concierge perks.",
      "tags": [
          "vip",
          "lounge",
          "martini",
          "cocktail",
          "hospitality",
          "club",
          "exclusive"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      const bowl = bloatPoly([[4.0, 4.4], [20.0, 4.4], [12.0, 13.4]], [cr, cr, 0.6], b * 0.3, { minEdge: 2.5 });
      const liquidLine = `M6.8 7.6H17.2`;
      const stem = `M12.0 13.4V20.2M7.6 20.2H16.4`;
      // Solid: 2 Separate Padded Shapes for the Cocktail Bowl (Upper Rim Band + Lower Liquid Cone) + stem & base!
      const topRim = bloatPoly([[3.8, 4.2], [20.2, 4.2], [17.8, 7.0], [6.2, 7.0]], [cr, cr, 0.6, 0.6], b * 0.2, { minEdge: 2.0 });
      const botCone = bloatPoly([[7.5, 8.6], [16.5, 8.6], [12.0, 13.8]], [0.7, 0.7, 0.75], b * 0.25, { minEdge: 2.0 });
      return {
        keylines: drawKeylines([], [...bowl.anchors, [7.6, 20.2], [16.4, 20.2]]),
        line: `<path d="${bowl.d}"/><path d="${liquidLine}"/><path d="${stem}"/>`,
        solid: {
          face: [topRim.d, botCone.d],
          stroke: [stem]
        },
        duotone: { tone: [botCone.d], secondary: [liquidLine, stem], line: `<path d="${bowl.d}"/><path d="${liquidLine}"/><path d="${stem}"/>` }
      };
    }
};
