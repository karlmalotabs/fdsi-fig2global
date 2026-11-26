// Surgical-precision icon module: fdsi-darts-target (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { tangentHull2, capsule, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-30-darts-target",
  slug: "darts-target",
  name: "#30. Competition Dart (45° Steel-Tip Dart — Tail Flight Fins + Torpedo Barrel + Needle Point)",
  area: "sb",
  order: 63,
  desc: "REBUILT AS THE DART ITSELF: 45° competition dart with aerodynamic tail flight fins, a `tangentHull2` tapered torpedo barrel with grip rings, and a sharp steel needle point at (20.6, 3.4)!",
  meta: {
      "slug": "darts-target",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "PDC World Darts Championship and Premier League 180s and match markets.",
      "tags": [
          "darts",
          "pdc",
          "steel-tip",
          "flight",
          "bullseye",
          "180",
          "oche"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.65);
      // 1. Aerodynamic Tail Flight Fin polygon at bottom-left (centered around shaft (5.0, 19.0) -> (9.6, 14.4)):
      const flightPts = [
        [3.4, 15.0],  // Upper-left fin corner
        [7.2, 11.2],  // Upper-right fin corner
        [9.6, 14.4],  // Front flight junction on shaft
        [12.8, 16.8], // Lower-right fin corner
        [9.0, 20.6],  // Lower-left fin corner
        [6.4, 17.6]   // Rear notch on shaft
      ];
      const flight = bloatPoly(flightPts, [cr, cr, 0.3, cr, cr, 0.3], b * 0.25, { minEdge: 2.0 });
      // 2. Tapered Torpedo Dart Barrel along 45° axis from (10.6, 13.4, r=1.15) swelling to front nose (15.8, 8.2, r=2.05):
      const barrel = tangentHull2([10.6, 13.4], 1.15, [15.8, 8.2], 2.05);
      // 3. Center shaft + grip ring seams + sharp steel needle point to (20.6, 3.4):
      const centerShaft = `M6.4 17.6L10.6 13.4`;
      const needle = `M17.2 6.8L20.6 3.4`;
      const gripRings = `M11.8 10.0L14.0 12.2M13.6 7.8L16.2 10.4`;

      // Solid mode:
      // - Flight split into 2 separate padded fin wings (`finUpper`, `finLower`) across the 45° shaft!
      // - Torpedo barrel (`barrel.d`) separated from the fins, with 2 grip ring cuts (`grip1`, `grip2`)!
      // - Steel needle point (`needle`)!
      const finUpper = bloatPoly([[3.4, 15.0], [7.2, 11.2], [9.2, 13.6], [5.8, 17.0]], 0.55, b * 0.2, { minEdge: 1.8 });
      const finLower = bloatPoly([[7.0, 18.2], [10.4, 14.8], [12.8, 16.8], [9.0, 20.6]], 0.55, b * 0.2, { minEdge: 1.8 });
      const gripCut1 = capsule(11.4, 9.6, 14.4, 12.6, 0.72);
      const gripCut2 = capsule(13.2, 7.4, 16.6, 10.8, 0.72);

      return {
        keylines: drawKeylines([[10.6, 13.4, 1.15], [15.8, 8.2, 2.05]], [[20.6, 3.4], [3.4, 15.0], [9.0, 20.6]]),
        line: `<path d="${flight.d}"/><path d="${centerShaft}"/><path d="${barrel.d}"/><path d="${gripRings}"/><path d="${needle}"/>`,
        solid: {
          face: [finUpper.d, finLower.d, barrel.d],
          holeExact: [gripCut1, gripCut2],
          stroke: [centerShaft, needle]
        },
        duotone: {
          tone: [flight.d, barrel.d],
          secondary: [centerShaft, gripRings, needle],
          line: `<path d="${flight.d}"/><path d="${centerShaft}"/><path d="${barrel.d}"/><path d="${gripRings}"/><path d="${needle}"/>`
        }
      };
    }
};
