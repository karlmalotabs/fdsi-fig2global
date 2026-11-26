// Surgical-precision icon module: fdsi-search (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-search",
  slug: "search",
  name: "Search Magnifier (Squash-Style Inner Lens Window in Solid)",
  area: "common",
  order: 12,
  desc: "r=6.6 circular lens at (10.5, 10.5) + 45° handle locked via polar(10.5, 10.5, 6.6, 45); Solid punches an r=3.8 lens window.",
  meta: {
      "slug": "search",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Search events, teams, leagues, slot titles, or help articles.",
      "tags": [
          "search",
          "find",
          "magnifier",
          "lookup",
          "query",
          "explore",
          "filter"
      ],
      "status": "approved"
  },
  build: () => {
      const cx = 10.5, cy = 10.5, R = 6.6;
      const lens = circleD(cx, cy, R);
      const pRim = polar(cx, cy, R, 45);
      const handle = `M${P(pRim)}L20.5 20.5`;
      return {
        keylines: drawKeylines([[cx, cy, R], [cx, cy, 3.8]], [[cx, cy], pRim, [20.5, 20.5]]),
        line: `<path d="${lens}"/><path d="${handle}"/>`,
        solid: { fill: [lens], holeExact: [circleD(cx, cy, 3.8)], stroke: [handle] },
        duotone: { tone: [lens], secondary: [handle], line: `<path d="${lens}"/><path d="${handle}"/>` }
      };
    }
};
