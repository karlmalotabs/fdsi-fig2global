// Surgical-precision icon module: fdsi-crash-curve (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-149-crash-plane",
  slug: "crash-curve",
  name: "#149. Crash Game Multiplier Curve (G1 Tangent-Locked Parabolic Curve + Symmetric 45° Delta Head)",
  area: "gx",
  order: 182,
  desc: "FIXED ALIGNMENT: Control point P1=(8.0, 16.0) is locked on the exact 45° ray from P2=(13.0, 11.0), so the parabolic climb curve transitions with 0.00° kink into the symmetric 45° delta jet/arrowhead at (20.2, 3.8)!",
  meta: {
      "slug": "crash-curve",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Rising exponential multiplier curve and delta jet for Aviator/Crash games.",
      "tags": [
          "crash",
          "curve",
          "aviator",
          "jet",
          "plane",
          "multiplier",
          "graph"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.65);
      // Symmetric 45° Delta Jet / Arrowhead centered on the 45° axis (x + y = 24) with apex at (20.4, 3.6):
      // Left wing at (11.2, 6.2), inner notch at (14.4, 9.6), right wing at (17.8, 12.8) — 100% symmetric across x + y = 24!
      const deltaPts = [
        [20.4, 3.6],   // Apex on 45° axis (20.4 + 3.6 = 24.0)
        [17.8, 12.8],  // Lower-right wingtip
        [14.6, 9.4],   // Center tail notch on 45° axis (14.6 + 9.4 = 24.0)
        [11.2, 6.2]    // Upper-left wingtip (symmetric to [17.8, 12.8]!)
      ];
      const delta = bloatPoly(deltaPts, [cr, cr, 0.3, cr], b * 0.25, { minEdge: 1.8 });
      // Parabolic climb trail whose control point (8.0, 16.0) lies on the exact 45° ray (x + y = 24) into (14.6, 9.4):
      const climbCurve = `M3.4 17.6Q8.0 16.0 14.6 9.4`;
      const axes = `M3.4 5.2V20.4H19.4`;
      return {
        keylines: drawKeylines([], [[20.4, 3.6], [17.8, 12.8], [11.2, 6.2], [14.6, 9.4], [8.0, 16.0], [3.4, 17.6]]),
        line: `<path d="${axes}"/><path d="${climbCurve}"/><path d="${delta.d}"/>`,
        solid: {
          fill: [delta.d],
          stroke: [axes, climbCurve]
        },
        duotone: {
          tone: [delta.d, `M3.4 17.6Q8.0 16.0 14.6 9.4L14.6 20.4H3.4Z`],
          secondary: [climbCurve],
          line: `<path d="${axes}"/><path d="${climbCurve}"/><path d="${delta.d}"/>`
        }
      };
    }
};
