// Surgical-precision icon module: fdsi-builder-lego-unified (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, facePoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "bet-builder-lego-unified",
  slug: "builder-lego-unified",
  name: "Bet Builder — Isometric Lego Block (Variant B: Unified Crown-Stud + 2 Side Faces — Zero Top Seam)",
  area: "sb",
  order: 27,
  desc: "Variant B: In Solid mode, the Top Diamond Face and the Raised Stud are merged into ONE continuous solid crown silhouette (only the 3 Y-seams divide the block — zero line on top!).",
  meta: {
      "slug": "builder-lego-unified",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Bet Builder single-block variant for multi-market match combinations.",
      "tags": [
          "bet-builder",
          "lego",
          "isometric",
          "cube",
          "same-game-parlay",
          "custom"
      ]
  },
  build: ({ b, r, s }) => {
      const N = [12.0, 5.6], E = [19.8, 9.5], C = [12.0, 13.8], W = [4.2, 9.5];
      const SE = [19.8, 17.0], S = [12.0, 21.2], SW = [4.2, 17.0];
      // Unified silhouette in Line mode without the inner back-ellipse line: just the raised stud dome + front base arc, or full stud!
      const H = bloatPoly([N, E, SE, S, SW, W], Math.min(r * 0.7, 1.5), b * 0.65);
      const ySeam = `M4.4 9.6L12.0 13.8L19.6 9.6M12.0 13.8V21.0`;
      const studArch = `M8.2 7.5V5.4A3.8 1.9 0 1 1 15.8 5.4V7.5A3.8 1.9 0 0 1 8.2 7.5Z`;
      const studMask = `M8.2 5.4A3.8 1.9 0 1 1 15.8 5.4V7.6A3.8 1.9 0 0 1 8.2 7.6Z`;

      const h = s * 0.44, outOff = -h * 0.35, rO = Math.min(r * 0.6, 1.3), rI = 0.65;
      const topFace = facePoly([N, E, C, W],   { offset: [outOff, h, h, outOff], r: [rO, rO, rI, rO], bulge: [b*0.25, 0, 0, b*0.25] });
      const leftFace = facePoly([W, C, S, SW], { offset: [h, h, outOff, outOff], r: [rO, rI, rO, rO], bulge: [0, 0, b*0.25, b*0.25] });
      const rightFace = facePoly([C, E, SE, S],{ offset: [h, outOff, outOff, h], r: [rI, rO, rO, rO], bulge: [0, b*0.25, b*0.25, 0] });
      // Merged Top Crown + Stud dome (no halo cut on topFace at all — `studDomed` merges directly with `topFace`!):
      const studDomed = `M8.0 8.5V5.2A4.0 2.0 0 1 1 16.0 5.2V8.5Z`;

      const uidU = "bbu6_" + (nextUid());
      const lineM = `<defs><mask id="${uidU}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${studMask}" fill="#000"/></mask></defs>` +
                    `<path d="${H.d}" mask="url(#${uidU})"/><path d="${ySeam}" mask="url(#${uidU})"/><path d="${studArch}"/>`;
      return {
        keylines: drawKeylines([[12, 5.4, 3.8]], [N, E, C, W, S]),
        line: lineM,
        solid: {
          // 3 shapes total: Top Face merged seamlessly with Stud Dome + Left Face + Right Face!
          face: [topFace, leftFace, rightFace],
          over: [studDomed]
        },
        duotone: { tone: [leftFace, rightFace], secondary: [studArch, ySeam], line: lineM }
      };
    }
};
