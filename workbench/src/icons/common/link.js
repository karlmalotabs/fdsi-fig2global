// Surgical-precision icon module: fdsi-link (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-95-link-chain",
  slug: "link",
  name: "#95. Link / Referral URL (2 Interlocking 45° Stadium Links)",
  area: "common",
  order: 128,
  desc: "2 open 45° stadium capsule chain links interlocking at center (12, 12): Bottom-Left link around (8.8, 15.2) and Top-Right link around (15.2, 8.8).",
  meta: {
      "slug": "link",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Copy direct URL link or connect linked accounts and referrals.",
      "tags": [
          "link",
          "chain",
          "url",
          "hyperlink",
          "connect",
          "referral"
      ]
  },
  build: () => {
      // Bottom-left U-stadium link: from (10.2, 10.6) down-left to (4.6, 16.2), semicircular cap R=3.1 to (7.8, 19.4), up-right to (13.4, 13.8)
      // Top-right U-stadium link: from (13.8, 13.4) up-right to (19.4, 7.8), semicircular cap R=3.1 to (16.2, 4.6), down-left to (10.6, 10.2)
      const linkBL = `M9.8 10.4L5.0 15.2A3.1 3.1 0 0 0 9.4 19.6L14.2 14.8`;
      const linkTR = `M14.2 13.6L19.0 8.8A3.1 3.1 0 0 0 14.6 4.4L9.8 9.2`;
      const coreBridge = `M9.2 14.8L14.8 9.2`;
      return {
        keylines: drawKeylines([[7.2, 17.4, 3.1], [16.8, 6.6, 3.1]], [[9.2, 14.8], [14.8, 9.2]]),
        line: `<path d="${linkBL}"/><path d="${linkTR}"/><path d="${coreBridge}"/>`,
        solid: { stroke: [linkBL, linkTR, coreBridge] },
        duotone: {
          tone: [capsule(6.8, 17.2, 17.2, 6.8, 3.1)],
          secondary: [coreBridge],
          line: `<path d="${linkBL}"/><path d="${linkTR}"/><path d="${coreBridge}"/>`
        }
      };
    }
};
