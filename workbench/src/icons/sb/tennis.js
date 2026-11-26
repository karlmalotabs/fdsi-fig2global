// Surgical-precision icon module: fdsi-tennis (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { add, mul, P, deg2rad, circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "tennis-racket",
  slug: "tennis",
  name: "Tennis Racket & Ball (Squash-Style Rounded Interior Window in Solid!)",
  area: "sb",
  order: 210,
  desc: "FIXED SOLID: Uses the approved Squash Racket solid pattern — filled 45° elliptical hoop with a bold interior elliptical window + cross strings + padded ball.",
  meta: {
      "slug": "tennis",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "ATP, WTA, and Grand Slam tennis match, set, and live point betting.",
      "tags": [
          "tennis",
          "racket",
          "ball",
          "atp",
          "wta",
          "grand-slam",
          "wimbledon"
      ]
  },
  build: () => {
      const cx = 13.5, cy = 8.5, a = 6.0, b = 4.5, u = [Math.SQRT1_2, -Math.SQRT1_2], v = [Math.SQRT1_2, Math.SQRT1_2];
      const E = (deg, ra = a, rb = b) => {
        const r = deg2rad(deg);
        return add([cx, cy], add(mul(u, ra * Math.cos(r)), mul(v, rb * Math.sin(r))));
      };
      const p1 = E(0), p2 = E(180);
      const hoop = `M${P(p1)}A${a} ${b} -45 1 0 ${P(p2)}A${a} ${b} -45 1 0 ${P(p1)}Z`;
      // Inner elliptical window for Solid mode (ra=3.6, rb=2.4 -> exact Squash Racket style!):
      const ip1 = E(0, 3.6, 2.4), ip2 = E(180, 3.6, 2.4);
      const innerWindow = `M${P(ip1)}A3.6 2.4 -45 1 0 ${P(ip2)}A3.6 2.4 -45 1 0 ${P(ip1)}Z`;
      const tL = E(152), tR = E(208), T = [6.2, 15.8], H = [3.2, 18.8];
      const throat = `M${P(tL)}L${P(T)}L${P(tR)}M${P(T)}L${P(H)}`;
      const strings = `M${P(E(-90))}L${P(E(90))}M${P(E(0))}L${P(E(180))}`;
      const ball = circleD(18.5, 18.0, 2.4);
      return {
        keylines: drawKeylines([[18.5, 18.0, 2.4]], [p1, p2, tL, tR, T, H]),
        line: `<path d="${hoop}"/><path d="${strings}"/><path d="${throat}"/><path d="${ball}"/>`,
        solid: {
          fill: [hoop, ball],
          holeExact: [innerWindow],
          stroke: [throat, `M${P(E(-90, 3.6, 2.4))}L${P(E(90, 3.6, 2.4))}M${P(ip1)}L${P(ip2)}`]
        },
        duotone: {
          tone: [hoop, ball],
          secondary: [strings],
          line: `<path d="${hoop}"/><path d="${throat}"/><path d="${ball}"/>`
        }
      };
    }
};
