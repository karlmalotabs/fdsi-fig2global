// Surgical-precision icon module: fdsi-playing-cards (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, facePoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-d-61-playing-cards",
  slug: "playing-cards",
  name: "#61. Playing Cards / Blackjack Pair (Parallel Tilted Portrait Cards + Diamond Pip)",
  area: "gx",
  order: 94,
  desc: "Uses the validated Parallel-Tilt Card recipe from #44 Booking Cards: Back card + Front card shifted (+4.8, +2.6) with a uniform 1.55px `facePoly` halo + center diamond pip inside the front card!",
  meta: {
      "slug": "playing-cards",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Card table games including Blackjack, Poker, Baccarat, and Solitaire.",
      "tags": [
          "cards",
          "playing-cards",
          "deck",
          "blackjack",
          "poker",
          "table-games",
          "casino"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.4);
      const backPts  = [[3.6, 4.8], [13.6, 3.2], [15.6, 16.6], [5.6, 18.2]];
      const frontPts = [[8.4, 7.4], [18.4, 5.8], [20.4, 19.2], [10.4, 20.8]];
      const back  = bloatPoly(backPts,  cr, b * 0.45, { minEdge: 3.0 });
      const front = bloatPoly(frontPts, cr, b * 0.45, { minEdge: 3.0 });
      // Center diamond pip inside the front card (centered at (14.4, 13.3)):
      const pip = bloatPoly([[14.4, 10.6], [16.8, 13.3], [14.4, 16.0], [12.0, 13.3]], 0.35, 0, { minEdge: 2.0 });
      const backSolid  = facePoly(backPts,  { offset: -0.55, r: cr + 0.35, bulge: b * 0.45 });
      const frontSolid = facePoly(frontPts, { offset: -0.55, r: cr + 0.35, bulge: b * 0.45 });
      const frontHalo  = facePoly(frontPts, { offset: -2.15, r: cr + 1.15, bulge: b * 0.45 });
      // In Solid mode, punch `pip.d` out of `frontSolid` using evenodd concatenation `${frontSolid}${pip.d}` inside `over`!
      const frontWithPipHole = `${frontSolid}${pip.d}`;
      const uidPc = "pc6_" + (nextUid());
      const lineM = `<defs><mask id="${uidPc}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${frontHalo}" fill="#000"/></mask></defs>` +
                    `<path d="${back.d}" mask="url(#${uidPc})"/><path d="${front.d}"/><path d="${pip.d}" fill="currentColor" stroke="none"/>`;
      return {
        keylines: drawKeylines([], [...front.anchors, ...back.anchors]),
        line: lineM,
        solid: {
          face: [backSolid],
          holeExact: [frontHalo],
          over: [frontWithPipHole]
        },
        duotone: { tone: [front.d], secondary: [back.d], line: lineM }
      };
    }
};
