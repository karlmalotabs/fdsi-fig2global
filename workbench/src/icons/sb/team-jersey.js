// Surgical-precision icon module: fdsi-team-jersey (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-50-team-jersey",
  slug: "team-jersey",
  name: "#50. Player Props / Team Kit Jersey (3 Separate Padded Shapes — Left Sleeve + Torso + Right Sleeve)",
  area: "sb",
  order: 83,
  desc: "Classic football/sports jersey with V-neck collar, angled short sleeves (x=2.6..21.4), and number '7' or chest stripe. Solid: 3 separate padded shapes (Left Sleeve + Torso + Right Sleeve)!",
  meta: {
      "slug": "team-jersey",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Player props, anytime goalscorer, shots on target, and assists markets.",
      "tags": [
          "jersey",
          "shirt",
          "kit",
          "player-props",
          "goalscorer",
          "squad",
          "number"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.95);
      // Unified jersey outline for Line mode:
      const jerseyPts = [
        [8.4, 3.8], [12.0, 6.6], [15.6, 3.8],
        [21.2, 7.6], [18.8, 11.8], [16.8, 10.4],
        [16.8, 20.2], [7.2, 20.2],
        [7.2, 10.4], [5.2, 11.8], [2.8, 7.6]
      ];
      const J = bloatPoly(jerseyPts, [0.4, 0.5, 0.4, cr, cr, 0.3, cr, cr, 0.3, cr, cr], b * 0.3, { minEdge: 1.8 });
      const numLine = `M10.2 11.0H13.8L11.4 16.4`;
      // Solid mode: 3 Separate Padded Shapes (Left Raglan Sleeve + Center Torso with '7' cut + Right Raglan Sleeve)!
      const torsoSolid = bloatPoly([
        [8.2, 4.0], [12.0, 6.8], [15.8, 4.0], [16.8, 9.6], [16.8, 20.4], [7.2, 20.4], [7.2, 9.6]
      ], [0.6, 0.6, 0.6, 0.5, cr, cr, 0.5], b * 0.3, { minEdge: 2.0 });
      const sleeveL = bloatPoly([[6.8, 4.8], [5.8, 11.4], [2.6, 8.2]], 0.75, b * 0.25, { minEdge: 2.0 });
      const sleeveR = bloatPoly([[17.2, 4.8], [21.4, 8.2], [18.2, 11.4]], 0.75, b * 0.25, { minEdge: 2.0 });
      const numHole = capsule(10.2, 11.0, 13.8, 11.0, 0.85) + capsule(13.8, 11.0, 11.4, 16.4, 0.85);
      return {
        keylines: drawKeylines([], [[8.4, 3.8], [12.0, 6.6], [15.6, 3.8], [7.2, 20.2], [16.8, 20.2]]),
        line: `<path d="${J.d}"/><path d="${numLine}"/>`,
        solid: {
          face: [sleeveL.d, sleeveR.d, torsoSolid.d],
          holeExact: [numHole]
        },
        duotone: { tone: [J.d], secondary: [numLine], line: `<path d="${J.d}"/><path d="${numLine}"/>` }
      };
    }
};
