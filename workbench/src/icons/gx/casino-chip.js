// Surgical-precision icon module: fdsi-casino-chip (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "casino-chip",
  slug: "casino-chip",
  name: "Casino Chip (Filled Center + 4 Rim Stripes in Solid)",
  area: "gx",
  order: 215,
  desc: "FIXED SOLID: Outer chip ring with 4 cardinal rim cutouts and a bold solid inner medallion with a negative-space diamond pip.",
  meta: {
      "slug": "casino-chip",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Table games, live casino chips, and wagering denomination selector.",
      "tags": [
          "chip",
          "token",
          "casino",
          "table-games",
          "bet",
          "stake",
          "wager"
      ]
  },
  build: ({ b, r }) => {
      const outer = circleD(12, 12, 9), inner = circleD(12, 12, 5.2);
      const pts = [0, 90, 180, -90].flatMap(d => [polar(12, 12, 5.2, d), polar(12, 12, 9, d)]);
      const ticks = [0, 90, 180, -90].map(deg => `M${P(polar(12, 12, 5.2, deg))}L${P(polar(12, 12, 9, deg))}`).join("");
      const pip = bloatPoly([[12, 9.2], [14.8, 12], [12, 14.8], [9.2, 12]], Math.min(r * 0.25, 0.5), b * 0.3, { minEdge: 2 });
      const innerMedallion = `${circleD(12, 12, 4.4)}${pip.d}`;
      return {
        keylines: drawKeylines([[12, 12, 9], [12, 12, 5.2]], pts),
        line: `<path d="${outer}"/><path d="${inner}"/><path d="${ticks}"/><path d="${pip.d}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [outer],
          holeExact: [circleD(12, 12, 6.2)],
          over: [innerMedallion],
          stroke: [ticks]
        },
        duotone: { tone: [outer], secondary: [inner, ticks], line: `<path d="${outer}"/><path d="${pip.d}" fill="currentColor" stroke="none"/>` }
      };
    }
};
