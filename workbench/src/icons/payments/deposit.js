// Surgical-precision icon module: fdsi-deposit (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-03-wallet-deposit",
  slug: "deposit",
  name: "#3. Deposit / Top-Up (2 Non-Overlapping Shapes — Downward Arrow + Bloated Tray)",
  area: "payments",
  order: 36,
  desc: "ZERO overlapping knockouts: Bold downward deposit arrow (y=3.2..13.4) + separate bloated wallet tray base below (x=3.5..20.5, y=14.8..20.4).",
  meta: {
      "slug": "deposit",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Top up player wallet balance via instant deposit methods.",
      "tags": [
          "deposit",
          "top-up",
          "add-funds",
          "pay-in",
          "wallet",
          "cashier",
          "credit"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      // Separate bloated tray base at bottom (y=15.0..20.4) with raised lip walls in Line and solid bar in Solid:
      const trayLine = `M3.8 14.2V18.4A2.0 2.0 0 0 0 5.8 20.4H18.2A2.0 2.0 0 0 0 20.2 18.4V14.2`;
      const traySolid = bloatRect({ x: 3.5, y: 15.6, w: 17.0, h: 4.8, r: cr, b: b * 0.35 });
      // Bold downward arrow above (y=3.4..13.2) — completely clear of the tray!
      const arrLine = `M12.0 3.4V13.2M8.0 9.4L12.0 13.4L16.0 9.4`;
      const arrPoly = bloatPoly([
        [12.0, 13.8], [17.2, 8.6], [13.8, 8.6], [13.8, 3.2], [10.2, 3.2], [10.2, 8.6], [6.8, 8.6]
      ], [0.55, 0.5, 0.25, 0.6, 0.6, 0.25, 0.5], b * 0.25, { minEdge: 1.8 });
      return {
        keylines: drawKeylines([], [[12, 3.4], [12, 13.4], [8, 9.4], [16, 9.4], [3.8, 20.4], [20.2, 20.4]]),
        line: `<path d="${trayLine}"/><path d="${arrLine}"/>`,
        solid: { face: [arrPoly.d, traySolid.d] },
        duotone: { tone: [traySolid.d], secondary: [arrLine], line: `<path d="${trayLine}"/><path d="${arrLine}"/>` }
      };
    }
};
