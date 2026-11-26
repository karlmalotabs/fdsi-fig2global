// Surgical-precision icon module: fdsi-shield-verified (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "shield-verified",
  slug: "shield-verified",
  name: "Verified Security Shield (6-Vertex Heraldic Hull)",
  area: "bx",
  order: 220,
  desc: "6-vertex bloated heraldic shield + interior verification checkmark punched via capsule holes in Solid.",
  meta: {
      "slug": "shield-verified",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Verified player identity, licensed operator seal, or protected transaction.",
      "tags": [
          "shield",
          "verified",
          "approved",
          "trusted",
          "kyc",
          "safe",
          "security"
      ]
  },
  build: ({ b, r }) => {
      const pts = [[12, 2.8], [19.5, 5.5], [19, 13], [12, 21.2], [5, 13], [4.5, 5.5]];
      const S = bloatPoly(pts, [Math.min(r, 1.5), Math.min(r, 1.8), Math.min(r + 1, 3), Math.min(r, 1.5), Math.min(r + 1, 3), Math.min(r, 1.8)], b, { minEdge: 4 });
      const chk = `M9 12.2L11.2 14.5L15.5 9.8`;
      const chkHoles = [capsule([9, 12.2], [11.2, 14.5], 1.8), capsule([11.2, 14.5], [15.5, 9.8], 1.8)];
      return {
        keylines: drawKeylines([], [...S.anchors, [9, 12.2], [11.2, 14.5], [15.5, 9.8]]),
        line: `<path d="${S.d}"/><path d="${chk}"/>`,
        solid: { fill: [S.d], holeExact: chkHoles },
        duotone: { tone: [S.d], secondary: [chk], line: `<path d="${S.d}"/><path d="${chk}"/>` }
      };
    }
};
