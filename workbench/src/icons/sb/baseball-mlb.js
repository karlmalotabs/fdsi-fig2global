// Surgical-precision icon module: fdsi-baseball-mlb (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, rad2deg, circleD, arcD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-23-baseball-mlb",
  slug: "baseball-mlb",
  name: "Baseball / MLB",
  area: "sb",
  order: 56,
  desc: "Exact R=9.0 sphere with 2 symmetric rim-to-rim C-seam arcs centered at (1.8, 12) and (22.2, 12) (R=7.0), 6 perpendicular radial cross-stitches in Line and Solid modes, and authentic white leather + crimson red stitching in Color mode (Light & Dark).",
  meta: {
      "slug": "baseball-mlb",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "MLB, NPB, and international baseball moneyline, run line, and total markets.",
      "tags": [
          "baseball",
          "mlb",
          "ball",
          "stitches",
          "home-run",
          "inning",
          "pitcher"
      ],
      "status": "approved",
      "comments": [
          {
              "id": "c_1795770820595",
              "author": "designer",
              "text": "Stiches need to be fixed as they dont look corrrect. Solid variant has no stitches at all. And solid looks like tennis ball. \nPerhaps stiching can be more represetative",
              "status": "resolved",
              "createdAt": "2026-11-27T09:13:40.595Z"
          },
          {
              "id": "c_1795770899777_995j",
              "author": "designer",
              "text": "Stiches need to be fixed as they dont look corrrect. Solid variant has no stitches at all. And solid looks like tennis ball. \nPerhaps stiching can be more represetative",
              "status": "resolved",
              "createdAt": "2026-11-27T09:14:59.777Z"
          },
          {
              "id": "c_1795771310075_ai",
              "author": "ai",
              "text": "Fixed baseball seam geometry to span rim-to-rim with perpendicular radial cross-stitches centered across both seams, and added the cross-stitch cuts to Solid mode so it reads as a stitched baseball rather than a tennis ball.",
              "status": "resolved",
              "createdAt": "2026-11-27T09:21:50.075Z"
          },
          {
              "id": "c_1795771347964",
              "author": "designer",
              "text": "Color mode of baseball need to be real color of baseball. should work well in dark and light mode",
              "status": "resolved",
              "createdAt": "2026-11-27T09:22:27.964Z"
          },
          {
              "id": "c_1795771394751_jo3a",
              "author": "designer",
              "text": "Color mode of baseball need to be real color of baseball. should work well in dark and light mode",
              "status": "resolved",
              "createdAt": "2026-11-27T09:23:14.751Z"
          },
          {
              "id": "c_1795771685348_ai",
              "author": "ai",
              "text": "Updated Color mode to render authentic white/alabaster cowhide leather panels with dimensional side-crescent shading and MLB crimson red seams/stitches in both Light and Dark modes.",
              "status": "resolved",
              "createdAt": "2026-11-27T09:28:05.348Z"
          }
      ]
  },
  build: () => {
    const R = 9.0, cxL = 1.8, cxR = 22.2, cy = 12.0, rSeam = 7.0;
    const d = 12.0 - cxL;
    // Exact trigonometric intersection angle where the R=7.0 seam arcs meet the R=9.0 ball boundary:
    const angRim = rad2deg(Math.acos((rSeam * rSeam - R * R + d * d) / (2 * rSeam * d)));

    const ball = circleD(12.0, 12.0, R);
    const pLT = polar(cxL, cy, rSeam, -angRim);
    const pLB = polar(cxL, cy, rSeam, angRim);
    const pRB = polar(cxR, cy, rSeam, 180 - angRim);
    const pRT = polar(cxR, cy, rSeam, 180 + angRim);

    const seamL = arcD(cxL, cy, rSeam, -angRim, angRim, 1);
    const seamR = arcD(cxR, cy, rSeam, 180 - angRim, 180 + angRim, 1);

    // Closed left & right crescent leather panels for dimensional shading in Color mode:
    const panelL = `M${P(pLT)}A${rSeam} ${rSeam} 0 0 1 ${P(pLB)}A${R} ${R} 0 0 1 ${P(pLT)}Z`;
    const panelR = `M${P(pRB)}A${rSeam} ${rSeam} 0 0 1 ${P(pRT)}A${R} ${R} 0 0 1 ${P(pRB)}Z`;

    // Extended seam cuts for Solid mode so the mask cleanly slices through the outer stroke rim:
    const seamL_cut = arcD(cxL, cy, rSeam, -68, 68, 1);
    const seamR_cut = arcD(cxR, cy, rSeam, 112, 248, 1);

    // 3 perpendicular radial cross-stitches per seam at -38°, 0°, +38° (centered on rSeam = 7.0, h = 1.25):
    const rIn = rSeam - 1.25, rOut = rSeam + 1.25;
    const stitch = (cx, deg) => `M${P(polar(cx, cy, rIn, deg))}L${P(polar(cx, cy, rOut, deg))}`;
    const ticksL = [-38, 0, 38].map((a) => stitch(cxL, a)).join("");
    const ticksR = [218, 180, 142].map((a) => stitch(cxR, a)).join("");

    const lineM = `<path d="${ball}"/><path d="${seamL}"/><path d="${seamR}"/><path d="${ticksL}"/><path d="${ticksR}"/>`;
    return {
      keylines: drawKeylines(
        [[12, 12, R], [cxL, cy, rSeam], [cxR, cy, rSeam]],
        [[12, 12], pLT, pLB, pRB, pRT]
      ),
      line: lineM,
      solid: {
        fill: [ball],
        cut: [seamL_cut, seamR_cut, ticksL, ticksR]
      },
      duotone: {
        tone: [ball],
        secondary: [seamL, seamR, ticksL, ticksR],
        line: lineM
      },
      color: (dark) => {
        const leatherCenter = dark ? "#e2e8f0" : "#ffffff";
        const leatherSide = dark ? "#cbd5e1" : "#e2e8f0";
        const stitchRed = dark ? "#e11d48" : "#dc2626";
        return (
          `<path d="${ball}" fill="${leatherCenter}" stroke="none"/>` +
          `<path d="${panelL}" fill="${leatherSide}" stroke="none"/>` +
          `<path d="${panelR}" fill="${leatherSide}" stroke="none"/>` +
          `<path d="${seamL}" fill="none" stroke="${stitchRed}"/>` +
          `<path d="${seamR}" fill="none" stroke="${stitchRed}"/>` +
          `<path d="${ticksL}" fill="none" stroke="${stitchRed}"/>` +
          `<path d="${ticksR}" fill="none" stroke="${stitchRed}"/>` +
          `<path d="${ball}"/>`
        );
      }
    };
  }
};
