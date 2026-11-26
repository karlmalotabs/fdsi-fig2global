// Surgical-precision icon module: fdsi-log-out (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, capsule, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "ui-log-out",
  slug: "log-out",
  name: "Log Out (Organic Contour-Hugging Arrow Knockout)",
  area: "common",
  order: 14,
  desc: "FIXED SOLID: Replaces the boxy square cutout with an organic contour-hugging capsule + rounded arrowhead shield that follows the exact shape of the arrow!",
  meta: {
      "slug": "log-out",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Sign out of the current player account and end the active session.",
      "tags": [
          "logout",
          "sign-out",
          "exit",
          "leave",
          "session",
          "account",
          "door"
      ],
      "status": "todo"
  },
  build: ({ s, b, r }) => {
      const D = bloatRect({ x: 3.8, y: 3.8, w: 9.8, h: 16.4, r: Math.min(r + 0.4, 2.4), b });
      const arr = `M9.5 12.0H20.4M16.8 8.4L20.5 12.0L16.8 15.6`;
      // Organic contour-hugging knockout:
      // 1. Sleek round-capped capsule around the shaft (r = s * 1.28)
      // 2. Plus filled arrowhead triangle (M15.6 7.2 L21.4 12.0 L15.6 16.8 Z) in knocks + holeExact so the knockout hugs the arrow organically!
      const shaftCapsule = capsule(9.5, 12.0, 20.5, 12.0, s * 1.28);
      const headClosed = `M15.8 8.0L20.5 12.0L15.8 16.0Z`;
      // In Line mode, mask the door wall cleanly where the arrow exits (smooth rounded pill + head contour)
      const uidO = "lo6_" + (nextUid());
      const lineM = `<defs><mask id="${uidO}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>` +
                    `<path d="M9.5 12.0H21.0M15.8 7.4L20.8 12.0L15.8 16.6Z" fill="#000" stroke="#000" stroke-width="${f(s * 2.5)}" stroke-linecap="round" stroke-linejoin="round"/></mask></defs>` +
                    `<path d="${D.d}" mask="url(#${uidO})"/><path d="${arr}"/>`;
      return {
        keylines: drawKeylines([], [[9.5, 12], [20.5, 12], [16.8, 8.4], [16.8, 15.6]]),
        line: lineM,
        solid: {
          fill: [D.d],
          holeExact: [shaftCapsule, headClosed],
          knocks: [arr, headClosed],
          stroke: [arr]
        },
        duotone: { tone: [D.d], secondary: [arr], line: lineM }
      };
    }
};
