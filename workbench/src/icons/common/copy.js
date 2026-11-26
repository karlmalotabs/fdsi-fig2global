// Surgical-precision icon module: fdsi-copy (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-a-14-copy-duplicate",
  slug: "copy",
  name: "#14. Copy Betslip Code (2 Separate Padded Shapes — Front Card + Back L-Frame)",
  area: "common",
  order: 47,
  desc: "Front bloated card (x=8.2..20.4, y=8.2..20.4) + back card (x=3.6..15.8, y=3.6..15.8) masked with a wide 1.8px padded halo around the front card!",
  meta: {
      "slug": "copy",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Copy betslip booking code, transaction ID, or referral link to clipboard.",
      "tags": [
          "copy",
          "duplicate",
          "clipboard",
          "clone",
          "code",
          "paste"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.65, 1.6);
      const front = bloatRect({ x: 8.2, y: 8.2, w: 12.2, h: 12.2, r: cr, b: b * 0.5 });
      const back = bloatRect({ x: 3.6, y: 3.6, w: 12.2, h: 12.2, r: cr, b: b * 0.5 });
      const frontHalo = bloatRect({ x: 6.4, y: 6.4, w: 15.8, h: 15.8, r: cr + 0.8, b: b * 0.5 });
      const uidCp = "cp6_" + (nextUid());
      const lineM = `<defs><mask id="${uidCp}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${front.d}" fill="#000" stroke="#000" stroke-width="1.6"/></mask></defs>` +
                    `<path d="${back.d}" mask="url(#${uidCp})"/><path d="${front.d}"/>`;
      return {
        keylines: drawKeylines([], [...front.anchors, ...back.anchors]),
        line: lineM,
        solid: {
          face: [back.d],
          holeExact: [frontHalo.d],
          over: [front.d]
        },
        duotone: { tone: [front.d], secondary: [back.d], line: lineM }
      };
    }
};
