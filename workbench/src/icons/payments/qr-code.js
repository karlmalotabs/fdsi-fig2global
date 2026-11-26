// Surgical-precision icon module: fdsi-qr-code (payments)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-07-qr-scan",
  slug: "qr-code",
  name: "#7. QR Code / Fast Deposit (3 Finder Modules + 4th Data Cross)",
  area: "payments",
  order: 40,
  desc: "3 bloated QR finder squares at Top-Left, Top-Right, and Bottom-Left (6.6×6.6px each) + bold L-corner & dot in Bottom-Right. Solid: 3 filled finder squares with inner core dots + data blocks!",
  meta: {
      "slug": "qr-code",
      "area": "payments",
      "alias": "",
      "crsKey": "",
      "description": "Scan QR code for instant mobile payment, Pix, Swish, or retail ticket check.",
      "tags": [
          "qr",
          "scan",
          "barcode",
          "mobile-pay",
          "pix",
          "instant",
          "camera"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 1.0);
      const tl = bloatRect({ x: 3.4, y: 3.4, w: 7.0, h: 7.0, r: cr, b: b * 0.35 });
      const tr = bloatRect({ x: 13.6, y: 3.4, w: 7.0, h: 7.0, r: cr, b: b * 0.35 });
      const bl = bloatRect({ x: 3.4, y: 13.6, w: 7.0, h: 7.0, r: cr, b: b * 0.35 });
      const brLine = `M14.0 14.0H17.0V17.0M19.8 14.0V19.8H14.0`;
      const brBlock1 = bloatRect({ x: 13.6, y: 13.6, w: 3.2, h: 3.2, r: 0.7, b: 0.15 });
      const brBlock2 = bloatRect({ x: 17.4, y: 17.4, w: 3.2, h: 3.2, r: 0.7, b: 0.15 });
      const hTL = bloatRect({ x: 5.5, y: 5.5, w: 2.8, h: 2.8, r: 0.5, b: 0.1 });
      const hTR = bloatRect({ x: 15.7, y: 5.5, w: 2.8, h: 2.8, r: 0.5, b: 0.1 });
      const hBL = bloatRect({ x: 5.5, y: 15.7, w: 2.8, h: 2.8, r: 0.5, b: 0.1 });
      return {
        keylines: drawKeylines([], [...tl.anchors, ...tr.anchors, ...bl.anchors]),
        line: `<path d="${tl.d}"/><path d="${tr.d}"/><path d="${bl.d}"/><path d="${brLine}"/>`,
        solid: {
          face: [tl.d, tr.d, bl.d, brBlock1.d, brBlock2.d],
          holeExact: [hTL.d, hTR.d, hBL.d]
        },
        duotone: { tone: [tl.d, tr.d, bl.d], secondary: [brLine], line: `<path d="${tl.d}"/><path d="${tr.d}"/><path d="${bl.d}"/><path d="${brLine}"/>` }
      };
    }
};
