// Surgical-precision icon module: fdsi-scratchcard (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, roundOpen, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-d2-155-scratchcard",
  slug: "scratchcard",
  name: "#155. Scratchcard / Instant Win (Bloated Card + Zig-Zag Scratch Track + Coin Disc)",
  area: "gx",
  order: 188,
  desc: "Bloated scratchcard ticket (x=3.2..19.2, y=4.2..19.8) with a diagonal zig-zag scratch reveal path + foreground coin disc at bottom-right (17.6, 16.8, r=3.2)!",
  meta: {
      "slug": "scratchcard",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Instant-win digital scratchcards with coin reveal track.",
      "tags": [
          "scratchcard",
          "scratch",
          "instant-win",
          "lottery",
          "reveal",
          "coin",
          "ticket"
      ]
  },
  build: ({ b, r }) => {
      const card = bloatRect({ x: 3.2, y: 4.2, w: 15.6, h: 15.6, r: Math.min(r + 0.3, 2.1), b });
      const zig = roundOpen([[6.8, 8.6], [13.2, 8.6], [7.2, 13.4], [13.6, 13.4]], Math.min(r * 0.3, 0.5));
      const coin = circleD(17.6, 16.8, 3.2);
      const coinSolid = circleD(17.6, 16.8, 3.5);
      const coinHalo = circleD(17.6, 16.8, 4.9);
      const uidSc = "sc6_" + (nextUid());
      const lineM = `<defs><mask id="${uidSc}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${coin}" fill="#000" stroke="#000" stroke-width="1.5"/></mask></defs>` +
                    `<path d="${card.d}" mask="url(#${uidSc})"/><path d="${zig}" mask="url(#${uidSc})"/><path d="${coin}"/>`;
      return {
        keylines: drawKeylines([[17.6, 16.8, 3.2]], [...card.anchors, [17.6, 16.8]]),
        line: lineM,
        solid: {
          fill: [card.d],
          cut: [zig],
          holeExact: [coinHalo],
          over: [coinSolid]
        },
        duotone: { tone: [card.d], secondary: [zig, coin], line: lineM }
      };
    }
};
