// Surgical-precision icon module: fdsi-bet-protection-shield (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, bloatPoly, edgeY, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-136-bet-shield-tick",
  slug: "bet-protection-shield",
  name: "#136. Bet Protection Shield (2 Separate Padded Shield Halves in Solid — Left & Right Heraldic Split)",
  area: "bx",
  order: 169,
  desc: "Heraldic shield split vertically along x=12.0 into 2 separate padded solid halves (`leftShield`, `rightShield`) with a 1.6px center seam gap!",
  meta: {
      "slug": "bet-protection-shield",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Protected bet token or acca insurance coverage against a single losing leg.",
      "tags": [
          "shield",
          "protection",
          "insurance",
          "safe-bet",
          "cover",
          "heraldic"
      ]
  },
  build: ({ b, r }) => {
      const pts = [[12.0, 3.2], [19.6, 6.2], [19.6, 12.2], [12.0, 20.6], [4.4, 12.2], [4.4, 6.2]];
      const S = bloatPoly(pts, [Math.min(r, 1.4), Math.min(r, 1.8), 2.6, Math.min(r, 1.4), 2.6, Math.min(r, 1.8)], b, { minEdge: 4 });
      const vSeam = `M12.0 ${f(edgeY(S.poly, 12, 'top'))}V${f(edgeY(S.poly, 12, 'bottom'))}`;
      // Solid: 2 Separate Padded Heraldic Shield Halves (Left Half x=4.2..11.2 + Right Half x=12.8..19.8)!
      const leftHalf = bloatPoly(
        [[11.2, 3.5], [11.2, 20.0], [4.2, 12.2], [4.2, 6.2]],
        [0.75, 0.85, 2.4, 1.6], b * 0.6, { minEdge: 3.0, edgeBulge: [0, 0.8, 0.8, 0.6] }
      );
      const rightHalf = bloatPoly(
        [[12.8, 3.5], [19.8, 6.2], [19.8, 12.2], [12.8, 20.0]],
        [0.75, 1.6, 2.4, 0.85], b * 0.6, { minEdge: 3.0, edgeBulge: [0.6, 0.8, 0.8, 0] }
      );
      return {
        keylines: drawKeylines([], S.anchors),
        line: `<path d="${S.d}"/><path d="${vSeam}"/>`,
        solid: { face: [leftHalf.d, rightHalf.d] },
        duotone: { tone: [leftHalf.d], secondary: [vSeam], line: `<path d="${S.d}"/><path d="${vSeam}"/>` }
      };
    }
};
