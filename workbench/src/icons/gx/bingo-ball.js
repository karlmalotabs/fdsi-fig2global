// Surgical-precision icon module: fdsi-bingo-ball (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-78-bingo-ball",
  slug: "bingo-ball",
  name: "#78. Keno / Bingo / Lotto Ball (R=9.0 Sphere + Lucky Number '7' Inside)",
  area: "gx",
  order: 111,
  desc: "Outer lottery ball sphere (cx=12, cy=12, R=9.0) + inner number ring (r=5.6) + bold '7' glyph (M9.6 9.4 H14.4 L11.2 15.6). Solid: filled ball + white patch + '7' in `over`!",
  meta: {
      "slug": "bingo-ball",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Bingo rooms, Keno draws, lotto numbers, and live ball-draw game shows.",
      "tags": [
          "bingo",
          "lotto",
          "ball",
          "number",
          "draw",
          "keno",
          "7"
      ]
  },
  build: () => {
      const ball = circleD(12.0, 12.0, 9.0);
      const ballSolid = circleD(12.0, 12.0, 9.2);
      const seven = `M9.6 9.4H14.4L11.2 15.6`;
      const sevenSolid = capsule(9.6, 9.4, 14.4, 9.4, 0.95) + capsule(14.4, 9.4, 11.2, 15.6, 0.95);
      // Note: to avoid evenodd self-cancellation at the top-right corner (14.4, 9.4) of '7', pass the two capsules as 2 separate array entries in `over`!
      const sTop = capsule(9.6, 9.4, 14.4, 9.4, 0.95);
      const sDiag = capsule(14.4, 9.4, 11.2, 15.6, 0.95);
      return {
        keylines: drawKeylines([[12, 12, 9.0], [12, 12, 5.6]], [[9.6, 9.4], [14.4, 9.4], [11.2, 15.6]]),
        line: `<path d="${ball}"/><path d="${seven}"/>`,
        solid: {
          fill: [ballSolid],
          holeExact: [circleD(12.0, 12.0, 5.8)],
          over: [sTop, sDiag]
        },
        duotone: { tone: [ball], secondary: [seven], line: `<path d="${ball}"/><path d="${seven}"/>` }
      };
    }
};
