// Surgical-precision icon module: fdsi-live-dealer (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-75-live-dealer-bowtie",
  slug: "live-dealer",
  name: "#75. Live Casino Dealer / Croupier (Single Smooth Hairline Sweep + Tuxedo Shoulders & Bowtie!)",
  area: "gx",
  order: 108,
  desc: "FIXED HAIRLINE: Replaced the 2-part hair line with ONE single smooth sweeping hairline curve (`M8.0 6.8 Q12.0 6.8 14.8 4.2`) across the head in both Line and Solid!",
  meta: {
      "slug": "live-dealer",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Live Casino studio streams hosted by real professional croupiers.",
      "tags": [
          "live-dealer",
          "croupier",
          "host",
          "bowtie",
          "tuxedo",
          "live-casino",
          "studio"
      ]
  },
  build: ({ b, r }) => {
      // 1. Head circle (cx=12.0, cy=7.4, R=4.2) + ONE single smooth side-swept hairline curve:
      const head = circleD(12.0, 7.4, 4.2);
      const hairline = `M8.0 6.8Q12.0 6.8 14.8 4.2`;
      // 2. Dealer Bowtie at the collar/chest (centered at (12.0, 15.6)):
      const bowtieLine = `M8.6 13.6L15.4 17.6V13.6L8.6 17.6Z`;
      // 3. Tuxedo Shoulders framing the bowtie:
      const shouldersLine =
        `M8.0 14.0C5.4 14.8 4.0 16.8 4.0 19.2A1.2 1.2 0 0 0 5.2 20.4H18.8A1.2 1.2 0 0 0 20.0 19.2C20.0 16.8 18.6 14.8 16.0 14.0`;

      // SOLID MODE: Single smooth hairline cut (`hairCut`) + Left & Right Tuxedo Shoulders + Bowtie:
      const headSolid = circleD(12.0, 7.4, 4.4);
      const hairCut = `M7.4 6.8Q12.0 6.8 15.2 3.8`;
      const shL = bloatPoly([[3.8, 20.4], [3.8, 17.2], [6.8, 14.2], [7.4, 20.4]], [1.1, 1.4, 0.7, 0.7], b * 0.25, { minEdge: 1.8 });
      const shR = bloatPoly([[16.6, 20.4], [17.2, 14.2], [20.2, 17.2], [20.2, 20.4]], [0.7, 0.7, 1.4, 1.1], b * 0.25, { minEdge: 1.8 });
      const bowL = bloatPoly([[8.6, 13.5], [11.6, 15.6], [8.6, 17.7]], 0.45, b * 0.15, { minEdge: 1.5 });
      const bowR = bloatPoly([[15.4, 13.5], [15.4, 17.7], [12.4, 15.6]], 0.45, b * 0.15, { minEdge: 1.5 });

      return {
        keylines: drawKeylines([[12, 7.4, 4.2]], [[8.0, 6.8], [14.8, 4.2], [8.6, 13.6], [15.4, 13.6]]),
        line: `<path d="${head}"/><path d="${hairline}"/><path d="${shouldersLine}"/><path d="${bowtieLine}" fill="currentColor" stroke-linejoin="round"/>`,
        solid: {
          fill: [headSolid],
          cut: [hairCut],
          face: [shL.d, shR.d, bowL.d, bowR.d]
        },
        duotone: {
          tone: [ `M4.0 20.4C4.0 16.4 6.4 13.8 12.0 13.8C17.6 13.8 20.0 16.4 20.0 20.4Z` ],
          secondary: [hairline, bowtieLine],
          line: `<path d="${head}"/><path d="${hairline}"/><path d="${shouldersLine}"/><path d="${bowtieLine}" fill="currentColor" stroke-linejoin="round"/>`
        }
      };
    }
};
