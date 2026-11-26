// Surgical-precision icon module: fdsi-builder-lego (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { ellipseD, bloatPoly, facePoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "bet-builder-lego",
  slug: "builder-lego",
  name: "Bet Builder — Isometric Lego Block (Variant A: Unsplit Solid Stud + 3 Cube Faces)",
  area: "sb",
  order: 26,
  desc: "Removed the line near the tip of the stud! The top cylindrical stud is now 1 single unified solid shape (no split cap line) sitting cleanly in the top diamond face.",
  meta: {
      "slug": "builder-lego",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Bet Builder tool for combining multiple markets from the same match.",
      "tags": [
          "bet-builder",
          "same-game-multi",
          "lego",
          "block",
          "custom-bet",
          "combine"
      ]
  },
  build: ({ b, r, s }) => {
      const N = [12.0, 5.4], E = [19.8, 9.4], C = [12.0, 13.8], W = [4.2, 9.4];
      const SE = [19.8, 17.0], S = [12.0, 21.2], SW = [4.2, 17.0];
      const hexPts = [N, E, SE, S, SW, W];
      const H = bloatPoly(hexPts, Math.min(r * 0.7, 1.5), b * 0.65);
      const ySeam = `M4.4 9.5L12.0 13.8L19.6 9.5M12.0 13.8V21.0`;

      // Line mode: outer top arch of the stud + vertical side walls + bottom front curve (no extra line near the tip!)
      const studTop = ellipseD(12.0, 5.5, 3.7, 1.85);
      const studWalls = `M8.3 5.5V8.3A3.7 1.85 0 0 0 15.7 8.3V5.5`;
      const studMask = `M8.3 5.5A3.7 1.85 0 1 1 15.7 5.5V8.3A3.7 1.85 0 0 1 8.3 8.3Z`;

      const h = s * 0.44, outOff = -h * 0.35, rO = Math.min(r * 0.6, 1.3), rI = 0.65;
      const topFace = facePoly([N, E, C, W],   { offset: [outOff, h, h, outOff], r: [rO, rO, rI, rO], bulge: [b*0.25, 0, 0, b*0.25] });
      const leftFace = facePoly([W, C, S, SW], { offset: [h, h, outOff, outOff], r: [rO, rI, rO, rO], bulge: [0, 0, b*0.25, b*0.25] });
      const rightFace = facePoly([C, E, SE, S],{ offset: [h, outOff, outOff, h], r: [rI, rO, rO, rO], bulge: [0, b*0.25, b*0.25, 0] });

      // Halo cuts topFace around the stud; studSolid is ONE single solid cylinder shape (zero line near the tip!)
      const studHalo = `M6.9 3.0H17.1V8.4A5.1 2.75 0 0 1 6.9 8.4Z`;
      const studSolid = `M8.3 5.4A3.7 1.9 0 1 1 15.7 5.4V8.25A3.7 1.9 0 0 1 8.3 8.25Z`;

      const uidI = "bbi6_" + (nextUid());
      const lineM = `<defs><mask id="${uidI}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${studMask}" fill="#000"/></mask></defs>` +
                    `<path d="${H.d}" mask="url(#${uidI})"/><path d="${ySeam}" mask="url(#${uidI})"/><path d="${studTop}"/><path d="${studWalls}"/>`;
      return {
        keylines: drawKeylines([[12, 5.5, 3.7]], [N, E, C, W, S]),
        line: lineM,
        solid: {
          face: [topFace, leftFace, rightFace],
          holeExact: [studHalo],
          over: [studSolid]
        },
        duotone: { tone: [leftFace, rightFace], secondary: [studTop, studWalls, ySeam], line: lineM }
      };
    }
};
