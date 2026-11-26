// Surgical-precision icon module: fdsi-kyc-id-card (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-97-kyc-id-card",
  slug: "kyc-id-card",
  name: "#97. KYC ID Card / Verification (Bloated Badge Card + Avatar Head/Shoulders + Text Bar)",
  area: "bx",
  order: 130,
  desc: "Landscape KYC identity card (x=2.8..21.2, y=4.8..19.2) with user avatar head (8.4, 10.2, r=1.8) & shoulder arch on the left + 2 verification lines on the right.",
  meta: {
      "slug": "kyc-id-card",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Know Your Customer (KYC) document upload and identity verification.",
      "tags": [
          "kyc",
          "id-card",
          "identity",
          "passport",
          "license",
          "verification",
          "document"
      ]
  },
  build: ({ b, r }) => {
      const C = bloatRect({ x: 2.8, y: 4.8, w: 18.4, h: 14.4, r: Math.min(r + 0.4, 2.3), b });
      const head = circleD(8.4, 10.0, 1.85);
      const sh = `M5.6 15.6C5.6 13.8 6.8 13.0 8.4 13.0C10.0 13.0 11.2 13.8 11.2 15.6`;
      const shSolid = `M5.4 15.8C5.4 13.6 6.7 12.8 8.4 12.8C10.1 12.8 11.4 13.6 11.4 15.8Z`;
      const lines = `M13.8 10.0H18.0M13.8 14.2H16.8`;
      const hHead = circleD(8.4, 9.8, 2.05);
      const hL1 = capsule(13.8, 10.0, 18.0, 10.0, 0.9);
      const hL2 = capsule(13.8, 14.2, 16.8, 14.2, 0.9);
      return {
        keylines: drawKeylines([[8.4, 10.0, 1.85]], C.anchors),
        line: `<path d="${C.d}"/><path d="${head}" fill="currentColor" stroke="none"/><path d="${sh}"/><path d="${lines}"/>`,
        solid: {
          fill: [C.d],
          holeExact: [hHead, shSolid, hL1, hL2]
        },
        duotone: { tone: [C.d], secondary: [lines, sh], line: `<path d="${C.d}"/><path d="${head}" fill="currentColor" stroke="none"/><path d="${sh}"/><path d="${lines}"/>` }
      };
    }
};
