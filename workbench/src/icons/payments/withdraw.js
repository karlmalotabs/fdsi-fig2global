// Surgical-precision icon module: fdsi-withdraw (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-04-wallet-withdraw",
  slug: "withdraw",
  name: "#4. Withdrawal / Payout (2 Non-Overlapping Shapes — Upward Arrow + Bloated Tray)",
  area: "payments",
  order: 37,
  desc: "Companion to Deposit: Bold upward withdrawal arrow (y=3.2..13.6) + separate bloated wallet tray base below (x=3.5..20.5, y=15.6..20.4).",
  meta: {
      "slug": "withdraw",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Withdraw winnings from the player wallet to a linked bank or card.",
      "tags": [
          "withdraw",
          "payout",
          "cashout",
          "transfer",
          "winnings",
          "wallet",
          "bank"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      const trayLine = `M3.8 14.2V18.4A2.0 2.0 0 0 0 5.8 20.4H18.2A2.0 2.0 0 0 0 20.2 18.4V14.2`;
      const traySolid = bloatRect({ x: 3.5, y: 15.6, w: 17.0, h: 4.8, r: cr, b: b * 0.35 });
      const arrLine = `M12.0 13.4V3.6M8.0 7.4L12.0 3.4L16.0 7.4`;
      const arrPoly = bloatPoly([
        [12.0, 3.0], [17.2, 8.2], [13.8, 8.2], [13.8, 13.6], [10.2, 13.6], [10.2, 8.2], [6.8, 8.2]
      ], [0.55, 0.5, 0.25, 0.6, 0.6, 0.25, 0.5], b * 0.25, { minEdge: 1.8 });
      return {
        keylines: drawKeylines([], [[12, 3.4], [12, 13.4], [8, 7.4], [16, 7.4], [3.8, 20.4], [20.2, 20.4]]),
        line: `<path d="${trayLine}"/><path d="${arrLine}"/>`,
        solid: { face: [arrPoly.d, traySolid.d] },
        duotone: { tone: [traySolid.d], secondary: [arrLine], line: `<path d="${trayLine}"/><path d="${arrLine}"/>` }
      };
    }
};
