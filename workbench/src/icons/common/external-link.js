// Surgical-precision icon module: fdsi-external-link (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-a2-96-external-link",
  slug: "external-link",
  name: "#96. External Link / Pop-Out Window (Bloated Card + Organic 45° Outgoing Arrow Knockout)",
  area: "common",
  order: 129,
  desc: "Bloated container card (x=3.6..17.6, y=6.4..20.4) + bold 45° outgoing arrow from (11.0, 13.0) to (20.4, 3.6) with organic capsule + arrowhead knockout!",
  meta: {
      "slug": "external-link",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Open detailed statistics, regulatory info, or external page in a new window.",
      "tags": [
          "external",
          "open",
          "new-tab",
          "window",
          "popout",
          "launch",
          "out"
      ]
  },
  build: ({ s, b, r }) => {
      const box = bloatRect({ x: 3.6, y: 6.4, w: 14.0, h: 14.0, r: Math.min(r + 0.3, 2.1), b });
      const arr = `M11.2 12.8L20.2 3.8M14.6 3.8H20.2V9.4`;
      const shaftCap = capsule(11.0, 13.0, 20.4, 3.6, s * 1.35);
      const headWedge = `M13.6 2.8H21.2V10.4Z`;
      const uidEl = "el6_" + (nextUid());
      const lineM = `<defs><mask id="${uidEl}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>` +
                    `<path d="${shaftCap}${headWedge}" fill="#000"/></mask></defs>` +
                    `<path d="${box.d}" mask="url(#${uidEl})"/><path d="${arr}"/>`;
      return {
        keylines: drawKeylines([], [...box.anchors, [11.2, 12.8], [20.2, 3.8]]),
        line: lineM,
        solid: {
          fill: [box.d],
          holeExact: [shaftCap, headWedge],
          stroke: [arr]
        },
        duotone: { tone: [box.d], secondary: [arr], line: lineM }
      };
    }
};
