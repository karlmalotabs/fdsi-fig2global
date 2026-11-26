// Surgical-precision icon module: fdsi-shield-security (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-shield-security",
  slug: "shield-security",
  name: "Security Shield (6-Vertex Heraldic Hull + Check)",
  area: "bx",
  order: 15,
  desc: "6-vertex bloated heraldic shield with interior verification checkmark punched via capsule holes in Solid.",
  meta: {
      "slug": "shield-security",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Account security center, two-factor protection, and safe play guarantee.",
      "tags": [
          "shield",
          "security",
          "protection",
          "safe",
          "trust",
          "check",
          "guard"
      ],
      "status": "todo"
  },
  build: ({ b, r }) => {
      const pts = [[12, 3.0], [19.5, 5.6], [19.0, 13.0], [12, 21.0], [5.0, 13.0], [4.5, 5.6]];
      const S = bloatPoly(pts, [Math.min(r, 1.5), Math.min(r, 1.8), Math.min(r + 1, 3), Math.min(r, 1.5), Math.min(r + 1, 3), Math.min(r, 1.8)], b, { minEdge: 4 });
      const chk = `M9.0 12.2L11.2 14.4L15.4 9.8`;
      const chkHoles = [capsule([9.0, 12.2], [11.2, 14.4], 1.75), capsule([11.2, 14.4], [15.4, 9.8], 1.75)];
      return {
        keylines: drawKeylines([], [...S.anchors, [9, 12.2], [11.2, 14.4], [15.4, 9.8]]),
        line: `<path d="${S.d}"/><path d="${chk}"/>`,
        solid: { fill: [S.d], holeExact: chkHoles },
        duotone: { tone: [S.d], secondary: [chk], line: `<path d="${S.d}"/><path d="${chk}"/>` }
      };
    }
};
