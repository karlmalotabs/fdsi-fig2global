// Surgical-precision icon module: fdsi-mma-octagon (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-33-mma-octagon",
  slug: "mma-octagon",
  name: "#33. MMA Open-Finger Fight Glove (100% Separate Padded Shapes — Zero Knockouts!)",
  area: "sb",
  order: 66,
  desc: "REBUILT SOLID (Zero Knockouts, Just Like Crown & Diamond!): Built from independent, self-contained rounded shapes with 1.5px padding gaps: 4 Rounded Finger Sleeves + Separate Left Thumb Pad + Main Dorsal Strike Pad + Lower Wrist Cuff!",
  meta: {
      "slug": "mma-octagon",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "UFC, Bellator, and PFL Mixed Martial Arts (MMA) fight winner and round markets.",
      "tags": [
          "mma",
          "ufc",
          "glove",
          "fight",
          "combat",
          "cage",
          "grappling",
          "knockout"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.6, 1.5);
      // LINE MODE:
      const glovePad =
        `M6.4 7.6` +
        `H18.0` +
        `A1.8 1.8 0 0 1 19.8 9.4` +
        `V13.2` +
        `A1.8 1.8 0 0 1 18.0 15.0` +
        `H6.4` +
        `C4.4 15.0 3.0 13.8 3.0 11.4` +
        `C3.0 9.0 4.4 7.6 6.4 7.6Z`;
      const thumbCrease = `M6.6 7.6V15.0`;
      const fingersLine =
        `M6.6 7.6V5.0A1.45 1.45 0 0 1 9.5 5.0V7.6` +
        `M9.7 7.6V4.3A1.5 1.5 0 0 1 12.7 4.3V7.6` +
        `M12.9 7.6V4.5A1.5 1.5 0 0 1 15.9 4.5V7.6` +
        `M16.1 7.6V5.2A1.45 1.45 0 0 1 19.0 5.2V7.6`;
      const cuffLine = `M6.6 15.0V18.4A1.8 1.8 0 0 0 8.4 20.2H16.6A1.8 1.8 0 0 0 18.4 18.4V15.0`;

      // SOLID MODE: 100% Independent, Self-Contained Rounded Shapes (`face` only — ZERO `holeExact` / `cut` knockouts!):
      // 1–4. Four separate rounded finger sleeves across the top (y = 2.8..6.8):
      const f1 = bloatRect({ x: 6.4,  y: 3.5, w: 2.6, h: 3.3, r: 0.9, b: 0.15 });
      const f2 = bloatRect({ x: 10.0, y: 2.8, w: 2.6, h: 4.0, r: 0.9, b: 0.15 });
      const f3 = bloatRect({ x: 13.6, y: 3.0, w: 2.6, h: 3.8, r: 0.9, b: 0.15 });
      const f4 = bloatRect({ x: 17.2, y: 3.7, w: 2.5, h: 3.1, r: 0.9, b: 0.15 });
      // 5. Separate rounded Left Thumb Pad (x = 2.6..5.8, y = 7.8..14.8 — 1.5px clear of dorsalPad!):
      const thumbPad = bloatPoly(
        [[2.8, 8.8], [5.8, 7.8], [5.8, 14.8], [3.0, 13.8]],
        [1.2, 0.9, 0.9, 1.2],
        0.28 + b * 0.3,
        { minEdge: 2.0, edgeBulge: [0.3, 0, 0.3, 0.8] }
      );
      // 6. Separate Main Dorsal Strike Pad (x = 7.3..20.2, y = 8.2..14.8 — 1.4px below fingers, 1.5px right of thumbPad!):
      const dorsalPad = bloatRect({ x: 7.3, y: 8.2, w: 12.9, h: 6.6, r: 1.6, b: 0.2 + b * 0.4 });
      // 7. Separate Bottom Velcro Wrist Cuff (x = 6.4..19.0, y = 16.3..20.5 — 1.5px below dorsalPad!):
      const wristCuff = bloatRect({ x: 6.4, y: 16.3, w: 12.6, h: 4.2, r: [1.0, 1.0, cr, cr], b: 0.18 + b * 0.35 });

      return {
        keylines: drawKeylines([], [...dorsalPad.anchors, ...thumbPad.anchors, ...wristCuff.anchors]),
        line: `<path d="${glovePad}"/><path d="${thumbCrease}"/><path d="${fingersLine}"/><path d="${cuffLine}"/>`,
        solid: {
          // 7 completely independent rounded shapes — ZERO knockout lines!
          face: [f1.d, f2.d, f3.d, f4.d, thumbPad.d, dorsalPad.d, wristCuff.d]
        },
        duotone: {
          tone: [dorsalPad.d, thumbPad.d],
          secondary: [thumbCrease, fingersLine, cuffLine],
          line: `<path d="${glovePad}"/><path d="${thumbCrease}"/><path d="${fingersLine}"/><path d="${cuffLine}"/>`
        }
      };
    }
};
