// Surgical-precision icon module: fdsi-free-bet-gift (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-free-bet-gift",
  slug: "free-bet-gift",
  name: "Free Bet / Bonus Gift Box (4 Separate Padded Quarter-Panels + Bold Bow)",
  area: "bx",
  order: 31,
  desc: "Built like Crown & Diamond: 4 separate, self-contained padded rounded rectangles (Left Lid, Right Lid, Left Box, Right Box) with wide 2.0px ribbon gaps + bold top bow.",
  meta: {
      "slug": "free-bet-gift",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Free bet token, welcome bonus package, or promotional gift drop.",
      "tags": [
          "gift",
          "free-bet",
          "bonus",
          "present",
          "reward",
          "promotion",
          "welcome"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      const Lid = bloatRect({ x: 3.4, y: 8.0, w: 17.2, h: 4.2, r: cr, b: b * 0.35 });
      const Box = bloatRect({ x: 4.8, y: 12.2, w: 14.4, h: 8.2, r: cr, b: b * 0.35 });
      const vRibbon = `M12.0 8.0V20.4`;
      const bow = `M12.0 8.0C8.8 8.0 7.0 5.8 7.8 4.0C8.6 2.4 11.2 4.0 12.0 8.0ZM12.0 8.0C15.2 8.0 17.0 5.8 16.2 4.0C15.4 2.4 12.8 4.0 12.0 8.0Z`;
      // Solid: 4 separate padded quarter-panels with 2.0px horizontal and vertical ribbon gaps!
      const lidL = bloatRect({ x: 3.4, y: 7.8, w: 7.6, h: 4.0, r: 1.0, b: b * 0.25 });
      const lidR = bloatRect({ x: 13.0, y: 7.8, w: 7.6, h: 4.0, r: 1.0, b: b * 0.25 });
      const boxL = bloatRect({ x: 4.8, y: 13.6, w: 6.2, h: 6.8, r: 1.15, b: b * 0.25 });
      const boxR = bloatRect({ x: 13.0, y: 13.6, w: 6.2, h: 6.8, r: 1.15, b: b * 0.25 });
      return {
        keylines: drawKeylines([], [...Lid.anchors, ...Box.anchors]),
        line: `<path d="${Box.d}"/><path d="${Lid.d}"/><path d="${vRibbon}"/><path d="${bow}"/>`,
        solid: {
          face: [lidL.d, lidR.d, boxL.d, boxR.d],
          stroke: [bow]
        },
        duotone: { tone: [Box.d], secondary: [Lid.d, vRibbon, bow], line: `<path d="${Box.d}"/><path d="${Lid.d}"/><path d="${vRibbon}"/><path d="${bow}"/>` }
      };
    }
};
