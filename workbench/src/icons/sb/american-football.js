// Surgical-precision icon module: fdsi-american-football (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, capsule, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b-21-american-football",
  slug: "american-football",
  name: "#21. American Football / NFL (Full-Width Solid Matching Outline 1:1!)",
  area: "sb",
  order: 54,
  desc: "FIXED THIN SOLID: Previously the Solid `face` pieces had half-width 5.2px (10.4px total, `stroke=none`) while the Outline `hull` had half-width 6.7px + stroke = 15.1px! Now the 3 Solid pieces match the full 15.0px outer contour of the Outline 1:1!",
  meta: {
      "slug": "american-football",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "NFL, NCAA College Football, and CFL gridiron betting markets.",
      "tags": [
          "american-football",
          "nfl",
          "ncaa",
          "gridiron",
          "super-bowl",
          "pigskin"
      ]
  },
  build: () => {
      // Outline hull: chord from (3.8, 19.0)/(5.0, 20.2) to (19.0, 3.8)/(20.2, 5.0) with R=12.8 circular arcs (half-width at center = 6.7px, + stroke = 7.55px):
      const hull = `M3.8 19.0A12.8 12.8 0 0 1 19.0 3.8A0.95 0.95 0 0 1 20.2 5.0A12.8 12.8 0 0 1 5.0 20.2A0.95 0.95 0 0 1 3.8 19.0Z`;
      const stripeBL = `M4.6 13.0L11.0 19.4`;
      const stripeTR = `M13.0 4.6L19.4 11.0`;
      const laces = `M9.5 14.5L14.5 9.5M9.6 11.8L12.2 14.4M11.8 9.6L14.4 12.2`;

      // Exact points on the FULL outer boundary of the Outline football (R = 12.8, dC = 5.45 -> half-width at center = 7.35px -> 14.7px full width!):
      const K = 0.70710678, R = 12.8, dC = 5.45;
      const pt = (t, side) => {
        const w = Math.max(0.5, Math.sqrt(R * R - t * t) - dC);
        return [12 + K * t - K * w * side, 12 - K * t - K * w * side];
      };
      // 3 Separate Padded Solid Shapes along the exact full-width R=12.8 contour:
      // Center Barrel spans t in [-4.5, +4.5] with rounded r=0.8 corners at the stripe cuts:
      const bTL = pt(-4.3, 1), bTR = pt(4.3, 1), bBR = pt(4.3, -1), bBL = pt(-4.3, -1);
      const bTL_c = pt(-4.85, 0.84), bTR_c = pt(4.85, 0.84), bBR_c = pt(4.85, -0.84), bBL_c = pt(-4.85, -0.84);
      const centerBarrelD =
        `M${P(bTL)}` +
        `A12.8 12.8 0 0 1 ${P(bTR)}` +
        `Q${P(pt(4.85, 0.98))} ${P(bTR_c)}` +
        `L${P(bBR_c)}` +
        `Q${P(pt(4.85, -0.98))} ${P(bBR)}` +
        `A12.8 12.8 0 0 1 ${P(bBL)}` +
        `Q${P(pt(-4.85, -0.98))} ${P(bBL_c)}` +
        `L${P(bTL_c)}` +
        `Q${P(pt(-4.85, 0.98))} ${P(bTL)}Z`;

      // Bottom-Left Polar Cap (from t = -6.5 to tip (3.5, 18.9)..(5.1, 20.5)):
      const tBL_U = pt(-6.5, 1), tBL_L = pt(-6.5, -1);
      const tipBL_D =
        `M3.5 18.9` +
        `A12.8 12.8 0 0 1 ${P(tBL_U)}` +
        `L${P(tBL_L)}` +
        `A12.8 12.8 0 0 1 5.1 20.5` +
        `A1.15 1.15 0 0 1 3.5 18.9Z`;

      // Top-Right Polar Cap (from t = +6.5 to tip (18.9, 3.5)..(20.5, 5.1)):
      const tTR_U = pt(6.5, 1), tTR_L = pt(6.5, -1);
      const tipTR_D =
        `M${P(tTR_U)}` +
        `A12.8 12.8 0 0 1 18.9 3.5` +
        `A1.15 1.15 0 0 1 20.5 5.1` +
        `A12.8 12.8 0 0 1 ${P(tTR_L)}` +
        `Z`;

      const laceHole = capsule(9.3, 14.7, 14.7, 9.3, 0.95);
      const cross1 = capsule(9.5, 11.7, 12.3, 14.5, 0.82);
      const cross2 = capsule(11.7, 9.5, 14.5, 12.3, 0.82);

      const uidF = "af6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidF}"><path d="${hull}"/></clipPath></defs>` +
                    `<path d="${hull}"/><g clip-path="url(#${uidF})"><path d="${stripeBL}"/><path d="${stripeTR}"/></g><path d="${laces}"/>`;
      return {
        keylines: drawKeylines([], [[4.0, 20.0], [20.0, 4.0], bTL, bTR, bBR, bBL]),
        line: lineM,
        solid: {
          face: [tipBL_D, centerBarrelD, tipTR_D],
          holeExact: [laceHole, cross1, cross2]
        },
        duotone: { tone: [centerBarrelD], secondary: [stripeBL, stripeTR, laces], line: lineM }
      };
    }
};
