// Surgical-precision icon module: fdsi-money-back (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-55-money-back-refund",
  slug: "money-back",
  name: "#55. Money-Back / Stake Refund (Exact 180° Vertical-Tangent Refund Arrowhead + Coin Core)",
  area: "payments",
  order: 88,
  desc: "FIXED ARROWHEAD: Previously the arc passed through an off-angle L-bracket! Now the 310° refund arc terminates at the exact 180° left horizontal extremum (3.8, 12.0) where the tangent is 100% vertical, capped by a symmetric ±45° downward chevron (M1.3 9.2 L3.8 12.0 L6.3 9.2)!",
  meta: {
      "slug": "money-back",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Stake refund or money-back guarantee when a match condition triggers.",
      "tags": [
          "money-back",
          "refund",
          "cashback",
          "return",
          "stake",
          "guarantee",
          "coin"
      ]
  },
  build: () => {
      // Circle centered at (12.4, 12.0) with R=8.6:
      // 180° is (3.8, 12.0), where the circle tangent is 100% vertical!
      // Sweep clockwise from 180° (3.8, 12.0) over top (-90°), right (0°), and bottom (90°) to 132° (6.65, 18.4):
      const arc = arcPath(12.4, 12.0, 8.6, 180, 492);
      // Symmetric downward chevron whose tip sits on the exact 180° arc endpoint (3.8, 12.0):
      const arrow = `M1.3 9.2L3.8 12.0L6.3 9.2`;
      const coin = circleD(12.4, 12.0, 4.3);
      const coinSolid = circleD(12.4, 12.0, 4.7);
      const slotLine = `M12.4 9.8V14.2`;
      const slotHole = capsule(12.4, 9.8, 12.4, 14.2, 0.9);
      return {
        keylines: drawKeylines([[12.4, 12, 8.6], [12.4, 12, 4.3]], [[3.8, 12.0], [1.3, 9.2], [6.3, 9.2], [12.4, 12]]),
        line: `<path d="${arc}"/><path d="${arrow}"/><path d="${coin}"/><path d="${slotLine}"/>`,
        solid: {
          face: [coinSolid],
          holeExact: [slotHole],
          stroke: [arc, arrow]
        },
        duotone: { tone: [coin], secondary: [arc, arrow], line: `<path d="${arc}"/><path d="${arrow}"/><path d="${coin}"/><path d="${slotLine}"/>` }
      };
    }
};
