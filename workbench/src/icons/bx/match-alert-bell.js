// Surgical-precision icon module: fdsi-match-alert-bell (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-138-match-alert",
  slug: "match-alert-bell",
  name: "#138. Live Match Alert / Kick-Off Bell (2 Padded Bell Shapes + Flanking Ringing Arcs)",
  area: "bx",
  order: 171,
  desc: "Ringing notification bell (dome + separate padded clapper below, like #39 Bell) flanked by 2 symmetric acoustic ringing arcs at top-left and top-right!",
  meta: {
      "slug": "match-alert-bell",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Live goal alerts, kick-off reminders, and bet settlement notifications.",
      "tags": [
          "bell",
          "ringing",
          "match-alert",
          "goal-alert",
          "live-notification",
          "alarm"
      ]
  },
  build: () => {
      const bell = `M6.8 13.2V9.8A5.2 5.2 0 0 1 17.2 9.8V13.2L19.0 16.0H5.0Z`;
      const clapper = `M9.8 19.2A2.4 2.4 0 0 0 14.2 19.2`;
      const clapperSolid = `M9.4 18.2A2.6 2.6 0 0 0 14.6 18.2Z`;
      const ringL = arcPath(12.0, 9.8, 8.4, 195, 240);
      const ringR = arcPath(12.0, 9.8, 8.4, 300, 345);
      return {
        keylines: drawKeylines([[12, 9.8, 5.2], [12, 9.8, 8.4]], [[5.0, 16.0], [19.0, 16.0]]),
        line: `<path d="${bell}"/><path d="${clapper}"/><path d="${ringL}"/><path d="${ringR}"/>`,
        solid: {
          fill: [bell],
          face: [clapperSolid],
          stroke: [ringL, ringR]
        },
        duotone: { tone: [bell], secondary: [clapper, ringL, ringR], line: `<path d="${bell}"/><path d="${clapper}"/><path d="${ringL}"/><path d="${ringR}"/>` }
      };
    }
};
