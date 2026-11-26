// Surgical-precision icon module: fdsi-jackpot-meter (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-140-jackpot-gauge",
  slug: "jackpot-meter",
  name: "#140. Hot-Streak / Jackpot Meter Gauge (Squash/Roulette-Style Open Dial Window + Needle in Solid!)",
  area: "gx",
  order: 173,
  desc: "FIXED SOLID LEGIBILITY: Replaced the heavy black dome with a bold semicircular gauge rim + wide open interior dial window containing the center pivot hub and 45° red-hot needle!",
  meta: {
      "slug": "jackpot-meter",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Must-drop jackpot thermometer gauge and hot-payout readiness meter.",
      "tags": [
          "jackpot",
          "meter",
          "gauge",
          "hot-drop",
          "progressive",
          "dial",
          "thermometer"
      ]
  },
  build: () => {
      const arch = `M3.2 16.8A8.8 8.8 0 0 1 20.8 16.8`;
      const baseTicks = `M3.2 16.8H6.2M17.8 16.8H20.8M12.0 8.0V10.2M5.8 10.6L7.4 12.2`;
      const hub = circleD(12.0, 16.8, 2.1);
      const needle = `M12.0 16.8L17.4 10.8`;
      // Solid mode: Bold semicircular outer rim (`outerDome` minus `innerWindow`) + center hub (`over`) + needle (`stroke`)!
      const outerDome = `M2.6 16.8A9.4 9.4 0 0 1 21.4 16.8A0.9 0.9 0 0 1 20.5 17.7H3.5A0.9 0.9 0 0 1 2.6 16.8Z`;
      const innerWindow = `M5.8 18.2V16.8A6.2 6.2 0 0 1 18.2 16.8V18.2Z`;
      return {
        keylines: drawKeylines([[12, 16.8, 8.8], [12, 16.8, 2.1]], [[3.2, 16.8], [20.8, 16.8], [17.4, 10.8]]),
        line: `<path d="${arch}"/><path d="${baseTicks}"/><path d="${hub}" fill="currentColor" stroke="none"/><path d="${needle}"/>`,
        solid: {
          face: [outerDome],
          holeExact: [innerWindow],
          over: [circleD(12.0, 16.8, 2.3)],
          stroke: [needle]
        },
        duotone: {
          tone: [`M3.2 16.8A8.8 8.8 0 0 1 20.8 16.8Z`],
          secondary: [needle, baseTicks],
          line: `<path d="${arch}"/><path d="${baseTicks}"/><path d="${hub}" fill="currentColor" stroke="none"/><path d="${needle}"/>`
        }
      };
    }
};
