// Surgical-precision icon module: fdsi-extra-time-watch (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-46-extra-time-watch",
  slug: "extra-time-watch",
  name: "#46. Injury / Extra Time (+90' Stopwatch + Bold Plus Cross Inside)",
  area: "sb",
  order: 79,
  desc: "Circular timer dial (cx=12, cy=13.2, R=7.8) + top crown T-bar (y=2.8..5.4) + bold centered '+' symbol inside. Solid: filled dial with crisp capsule '+' cross window!",
  meta: {
      "slug": "extra-time-watch",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Injury time, stoppage minutes added, and extra-time qualification markets.",
      "tags": [
          "extra-time",
          "injury-time",
          "stoppage",
          "stopwatch",
          "overtime",
          "90-plus"
      ]
  },
  build: () => {
      const dial = circleD(12.0, 13.2, 7.8);
      const dialSolid = circleD(12.0, 13.2, 8.1);
      const crown = `M9.5 2.8H14.5M12.0 2.8V5.2`;
      const plusLine = `M12.0 9.8V16.6M8.6 13.2H15.4`;
      const hV = capsule(12.0, 9.6, 12.0, 16.8, 1.0);
      const hH = capsule(8.4, 13.2, 15.6, 13.2, 1.0);
      return {
        keylines: drawKeylines([[12, 13.2, 7.8]], [[12, 9.8], [12, 16.6], [8.6, 13.2], [15.4, 13.2]]),
        line: `<path d="${dial}"/><path d="${crown}"/><path d="${plusLine}"/>`,
        solid: {
          fill: [dialSolid],
          holeExact: [hV, hH],
          stroke: [crown]
        },
        duotone: { tone: [dial], secondary: [plusLine, crown], line: `<path d="${dial}"/><path d="${crown}"/><path d="${plusLine}"/>` }
      };
    }
};
