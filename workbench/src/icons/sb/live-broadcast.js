// Surgical-precision icon module: fdsi-live-broadcast (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bet-live-broadcast",
  slug: "live-broadcast",
  name: "Live In-Play (Bold Center Core + Symmetrical Broadcast Waves)",
  area: "sb",
  order: 21,
  desc: "Bold center live core (12, 12, r=2.4) + 2 pairs of wide symmetrical ±44° broadcast wave arcs (r=5.8, r=9.2) with 3.4px radial breathing room.",
  meta: {
      "slug": "live-broadcast",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Live in-play betting events currently underway with real-time odds.",
      "tags": [
          "live",
          "in-play",
          "broadcast",
          "radio",
          "waves",
          "real-time",
          "now"
      ]
  },
  build: () => {
      const core = circleD(12, 12, 2.3);
      const coreSolid = circleD(12, 12, 2.8);
      const aR1 = arcPath(12, 12, 5.8, -44, 44);
      const aL1 = arcPath(12, 12, 5.8, 136, 224);
      const aR2 = arcPath(12, 12, 9.2, -44, 44);
      const aL2 = arcPath(12, 12, 9.2, 136, 224);
      const waves = `${aR1}${aL1}${aR2}${aL2}`;
      const outerDisc = circleD(12, 12, 9.2);
      return {
        keylines: drawKeylines([[12, 12, 2.3], [12, 12, 5.8], [12, 12, 9.2]], [[12, 12]]),
        line: `<path d="${core}"/><path d="${waves}"/>`,
        solid: { fill: [coreSolid], stroke: [waves] },
        duotone: { tone: [outerDisc], secondary: [core], line: `<path d="${coreSolid}" fill="currentColor"/><path d="${waves}"/>` }
      };
    }
};
