// Surgical-precision icon module: fdsi-notification-bell (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "bell-alert",
  slug: "notification-bell",
  name: "Notification Bell (2 Separate Padded Solid Shapes — Bell Dome & Clapper)",
  area: "bx",
  order: 221,
  desc: "FIXED SOLID: Bell dome stops at y=16.0 and the solid half-moon clapper sits at y=18.2 (2.2px clear padding gap between them!).",
  meta: {
      "slug": "notification-bell",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Push notifications, account alerts, and promotional message inbox.",
      "tags": [
          "bell",
          "notification",
          "alert",
          "inbox",
          "push",
          "reminder",
          "updates"
      ]
  },
  build: () => {
      const bell = `M6.4 13.2V9.6A5.6 5.6 0 0 1 17.6 9.6V13.2L19.5 16.0H4.5Z`;
      const clapper = `M9.8 19.2A2.4 2.4 0 0 0 14.2 19.2`;
      const clapperSolid = `M9.4 18.2A2.6 2.6 0 0 0 14.6 18.2Z`;
      return {
        keylines: drawKeylines([[12, 9.6, 5.6], [12, 18.2, 2.6]], [[6.4, 9.6], [17.6, 9.6], [4.5, 16.0], [19.5, 16.0]]),
        line: `<path d="${bell}"/><path d="${clapper}"/>`,
        solid: { fill: [bell], face: [clapperSolid] },
        duotone: { tone: [bell], secondary: [clapper], line: `<path d="${bell}"/><path d="${clapper}"/>` }
      };
    }
};
