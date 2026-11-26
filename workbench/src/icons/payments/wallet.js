// Surgical-precision icon module: fdsi-wallet (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-a-02-wallet-balance",
  slug: "wallet",
  name: "#2. Wallet / Balance (Bloated Wallet Body + Separate Padded Clasp Tab)",
  area: "payments",
  order: 35,
  desc: "Bloated wallet body (x=3.2..20.0, y=5.2..19.6) + right-side magnetic clasp tab (x=14.6..21.0, y=9.8..15.0) with coin snap dot. Solid: wallet with contour-hugging clasp pocket + separate clasp pill!",
  meta: {
      "slug": "wallet",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "View player wallet balance, real-money and bonus funds, and cashier overview.",
      "tags": [
          "wallet",
          "balance",
          "cashier",
          "funds",
          "money",
          "account",
          "bankroll"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r + 0.3, 2.2);
      const W = bloatRect({ x: 3.2, y: 5.2, w: 16.8, h: 14.4, r: cr, b });
      const clasp = bloatRect({ x: 14.4, y: 9.8, w: 6.6, h: 5.2, r: 1.5, b: b * 0.25 });
      const claspHalo = bloatRect({ x: 13.0, y: 8.4, w: 9.0, h: 8.0, r: 2.3, b: b * 0.25 });
      const snapDot = circleD(16.8, 12.4, 0.95);
      const uidW = "wa6_" + (nextUid());
      const lineM = `<defs><mask id="${uidW}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${clasp.d}" fill="#000"/></mask></defs>` +
                    `<path d="${W.d}" mask="url(#${uidW})"/><path d="${clasp.d}"/><path d="${snapDot}" fill="currentColor" stroke="none"/>`;
      return {
        keylines: drawKeylines([[16.8, 12.4, 0.95]], [...W.anchors, ...clasp.anchors]),
        line: lineM,
        solid: {
          face: [W.d],
          holeExact: [claspHalo.d],
          over: [clasp.d]
        },
        duotone: { tone: [W.d], secondary: [clasp.d], line: lineM }
      };
    }
};
