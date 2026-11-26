// Surgical-precision icon module: fdsi-golden-boot (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-c2-126-golden-boot",
  slug: "golden-boot",
  name: "#126. Golden Boot / Top Goalscorer (2 Separate Padded Boot Shapes in Solid — Zero Knockout Lines!)",
  area: "sb",
  order: 159,
  desc: "FIXED SOLID (Zero Knockouts!): Removed `holeExact` stripe knockouts! Solid is built from 2 separate, self-contained rounded shapes (Left Heel/Ankle Quarter + Right Vamp/Toe Box separated by a 1.6px diagonal gap) + short sole cleats!",
  meta: {
      "slug": "golden-boot",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "First goalscorer, anytime scorer, and tournament Golden Boot winner.",
      "tags": [
          "golden-boot",
          "cleat",
          "football-boot",
          "goalscorer",
          "striker",
          "top-scorer"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      const bootPts = [
        [3.6, 6.6], [9.8, 6.6], [12.4, 10.8],
        [19.8, 12.2], [20.6, 16.4], [3.6, 16.4]
      ];
      const boot = bloatPoly(bootPts, [cr, 0.8, 0.6, 1.4, cr, cr], b * 0.35, { minEdge: 2.0 });
      const stripe = `M9.8 16.4L12.0 10.4`;
      const studsLine = `M5.6 16.4V17.9M8.8 16.4V17.9M15.4 16.4V17.9M18.2 16.4V17.9`;
      // SOLID MODE: 2 Separate Padded Rounded Shapes (Left Heel Quarter + Right Toe Vamp separated by a 1.6px diagonal gap — ZERO knockout lines!):
      const heelQuarter = bloatPoly(
        [[3.4, 6.4], [10.0, 6.4], [11.6, 9.8], [9.2, 16.4], [3.4, 16.4]],
        [cr, 0.85, 0.75, 0.75, cr], b * 0.35, { minEdge: 1.8 }
      );
      const frontVamp = bloatPoly(
        [[13.0, 10.6], [20.0, 12.0], [20.8, 16.4], [11.0, 16.4]],
        [0.75, 1.4, cr, 0.75], b * 0.35, { minEdge: 1.8 }
      );
      const uidGb = "gb6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidGb}"><path d="${boot.d}"/></clipPath></defs>` +
                    `<path d="${boot.d}"/><g clip-path="url(#${uidGb})"><path d="${stripe}"/></g><path d="${studsLine}"/>`;
      return {
        keylines: drawKeylines([], [...heelQuarter.anchors, ...frontVamp.anchors]),
        line: lineM,
        solid: {
          face: [heelQuarter.d, frontVamp.d],
          stroke: [studsLine]
        },
        duotone: { tone: [heelQuarter.d, frontVamp.d], secondary: [stripe, studsLine], line: lineM }
      };
    }
};
