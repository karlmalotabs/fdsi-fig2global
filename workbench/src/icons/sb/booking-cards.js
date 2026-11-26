// Surgical-precision icon module: fdsi-booking-cards (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, facePoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-c-44-booking-cards",
  slug: "booking-cards",
  name: "#44. Yellow / Red Booking Cards (Parallel Tilted Portrait Cards — Uniform 3.3px Back Card Band, Zero Slivers!)",
  area: "sb",
  order: 77,
  desc: "FIXED SOLID: Previously fanning one tilted card behind an upright card created a 0.4px acute spike at the bottom-left! Now both portrait penalty cards share a parallel -9° tilt shifted by (+4.8, +2.6), with `facePoly(..., { offset: -1.55 })` for a 100% uniform 1.55px gap!",
  meta: {
      "slug": "booking-cards",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Total booking points, yellow/red cards shown, and player to be carded markets.",
      "tags": [
          "cards",
          "yellow-card",
          "red-card",
          "booking",
          "sending-off",
          "referee",
          "foul"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.4);
      // Parallel -9° tilted portrait penalty cards (10.1 x 13.6px each), shifted by (+4.8, +2.6):
      const backPts  = [[3.6, 4.8], [13.6, 3.2], [15.6, 16.6], [5.6, 18.2]];
      const frontPts = [[8.4, 7.4], [18.4, 5.8], [20.4, 19.2], [10.4, 20.8]];
      const back  = bloatPoly(backPts,  cr, b * 0.45, { minEdge: 3.0 });
      const front = bloatPoly(frontPts, cr, b * 0.45, { minEdge: 3.0 });
      // For Solid mode, expand both cards by -0.55px via facePoly so they match the full outer stroke weight of Line mode,
      // and expand `frontHalo` by -2.1px so there is a uniform 1.55px parallel gap between Front and Back cards!
      const backSolid  = facePoly(backPts,  { offset: -0.55, r: cr + 0.35, bulge: b * 0.45 });
      const frontSolid = facePoly(frontPts, { offset: -0.55, r: cr + 0.35, bulge: b * 0.45 });
      const frontHalo  = facePoly(frontPts, { offset: -2.15, r: cr + 1.15, bulge: b * 0.45 });

      const uidBk = "bk6_" + (nextUid());
      const lineM = `<defs><mask id="${uidBk}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${frontHalo}" fill="#000"/></mask></defs>` +
                    `<path d="${back.d}" mask="url(#${uidBk})"/><path d="${front.d}"/>`;
      return {
        keylines: drawKeylines([], [...front.anchors, ...back.anchors]),
        line: lineM,
        solid: {
          face: [backSolid],
          holeExact: [frontHalo],
          over: [frontSolid]
        },
        duotone: { tone: [front.d], secondary: [back.d], line: lineM }
      };
    }
};
