// Surgical-precision icon module: fdsi-coins (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, ellipseD, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-d-71-coin-stack",
  slug: "coins",
  name: "#71. High-Stakes Coins (Front Circular Treasury Coin + Staggered Coin Stack Behind — Zero Database Look!)",
  area: "payments",
  order: 104,
  desc: "FIXED DATABASE LOOK: Replaced the single vertical cylinder column (which reads as a SQL database) with a bold front circular Casino/Gold Coin (15.4, 14.6, R=5.2) leaning in front of a 3-coin stack on the left!",
  meta: {
      "slug": "coins",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "High-stakes bankroll, loyalty coins, or multi-currency balance.",
      "tags": [
          "coins",
          "stack",
          "bankroll",
          "currency",
          "money",
          "gold",
          "wealth",
          "balance"
      ]
  },
  build: () => {
      // Front circular gold coin at bottom-right (cx=15.4, cy=14.6, R=5.2) with vertical treasury bar:
      const frontCoin = circleD(15.4, 14.6, 5.2);
      const frontCoinSolid = circleD(15.4, 14.6, 5.5);
      const frontHalo = circleD(15.4, 14.6, 6.9);
      const slotLine = `M15.4 12.2V17.0`;
      const slotHole = capsule(15.4, 12.2, 15.4, 17.0, 0.9);
      // Left 3-coin cylinder stack (cx=8.8, rx=5.8, ry=2.0, spanning y=4.2..18.2):
      const topEll = ellipseD(8.8, 6.2, 5.8, 2.0);
      const stackWalls =
        `M3.0 6.2V16.2A5.8 2.0 0 0 0 14.6 16.2V6.2` +
        `M3.0 9.6A5.8 2.0 0 0 0 14.6 9.6` +
        `M3.0 13.0A5.8 2.0 0 0 0 14.6 13.0`;
      // Solid: 3 separate padded stack slices on the left (masked by `frontHalo`) + `frontCoinWithSlot` in `over`!
      const sTop = ellipseD(8.8, 6.0, 5.9, 2.05);
      const sMid = `M2.9 8.4A6.4 2.3 0 0 0 14.7 8.4V11.2A5.9 2.05 0 0 1 2.9 11.2Z`;
      const sBot = `M2.9 12.8A6.4 2.3 0 0 0 14.7 12.8V16.4A5.9 2.05 0 0 1 2.9 16.4Z`;
      const frontWithSlot = `${frontCoinSolid}${slotHole}`;

      const uidCs = "cs6_" + (nextUid());
      const lineM = `<defs><mask id="${uidCs}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${frontCoin}" fill="#000" stroke="#000" stroke-width="1.5"/></mask></defs>` +
                    `<g mask="url(#${uidCs})"><path d="${topEll}"/><path d="${stackWalls}"/></g>` +
                    `<path d="${frontCoin}"/><path d="${slotLine}"/>`;
      return {
        keylines: drawKeylines([[15.4, 14.6, 5.2], [8.8, 6.2, 2.0]], [[3.0, 6.2], [14.6, 6.2], [15.4, 14.6]]),
        line: lineM,
        solid: {
          face: [sTop, sMid, sBot],
          holeExact: [frontHalo],
          over: [frontWithSlot]
        },
        duotone: { tone: [frontCoin], secondary: [topEll, stackWalls, slotLine], line: lineM }
      };
    }
};
