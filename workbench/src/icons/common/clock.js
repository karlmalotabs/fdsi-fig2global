// Surgical-precision icon module: fdsi-clock (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-17-clock-time",
  slug: "clock",
  name: "#17. Clock / Kick-Off Time (Exact 9.0px Dial + 12:20 Hands)",
  area: "common",
  order: 50,
  desc: "Circular clock dial (cx=12, cy=12, R=9.0) + vertical minute hand (12, 7.0) and 40° hour hand (15.6, 14.4). Solid: filled dial with crisp round-capped hand cut!",
  meta: {
      "slug": "clock",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Display match kick-off time, countdown, or recent activity.",
      "tags": [
          "clock",
          "time",
          "schedule",
          "kickoff",
          "countdown",
          "hour",
          "recent"
      ]
  },
  build: ({ r }) => {
      const dial = circleD(12.0, 12.0, 9.0);
      const dialSolid = circleD(12.0, 12.0, 9.2);
      const hands = roundOpen([[12.0, 6.8], [12.0, 12.0], [15.8, 14.4]], Math.min(r * 0.3, 0.5));
      return {
        keylines: drawKeylines([[12, 12, 9.0]], [[12, 6.8], [12, 12], [15.8, 14.4]]),
        line: `<path d="${dial}"/><path d="${hands}"/>`,
        solid: { fill: [dialSolid], cut: [hands] },
        duotone: { tone: [dial], secondary: [hands], line: `<path d="${dial}"/><path d="${hands}"/>` }
      };
    }
};
