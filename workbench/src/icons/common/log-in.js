// Surgical-precision icon module: fdsi-log-in (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, capsule, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "ui-log-in",
  slug: "log-in",
  name: "Log In (Organic Contour-Hugging Arrowhead Knockout — Zero Inner-Wing Bleed)",
  area: "common",
  order: 13,
  desc: "FIXED SOLID: Uses an organic contour-hugging capsule + closed round-joined arrowhead shield (`M10.2 8.0 L14.8 12.0 L10.2 16.0 Z`) so the punch follows the arrow shape organically with zero black door bleed behind the inner wings!",
  meta: {
      "slug": "log-in",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Sign in to an existing player account or enter authenticated session.",
      "tags": [
          "login",
          "sign-in",
          "enter",
          "auth",
          "account",
          "session",
          "door",
          "arrow"
      ],
      "status": "approved"
  },
  build: ({ s, b, r }) => {
      const D = bloatRect({ x: 10.2, y: 3.8, w: 10.0, h: 16.4, r: Math.min(r + 0.4, 2.4), b });
      const arr = `M3.5 12.0H14.5M11.0 8.5L14.6 12.0L11.0 15.5`;
      // Organic contour-hugging knockout:
      // 1. Sleek round-capped capsule along the shaft (3.5, 12) -> (14.6, 12)
      // 2. Closed arrowhead wedge extending slightly back (`x = 9.4..14.8`) stroked with round joins in `knocks` AND filled in `holeExact`!
      //    This gives a smooth, organic rounded arrowhead contour AND completely clears the inner side behind the chevron wings!
      const shaftCapsule = capsule(3.5, 12.0, 14.5, 12.0, s * 1.28);
      const headWedge = `M9.4 8.0L14.7 12.0L9.4 16.0Z`;
      const uidL = "li6_" + (nextUid());
      const lineM = `<defs><mask id="${uidL}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/>` +
                    `<path d="M3.5 12.0H14.6M9.4 8.0L14.7 12.0L9.4 16.0Z" fill="#000" stroke="#000" stroke-width="${f(s * 2.4)}" stroke-linecap="round" stroke-linejoin="round"/></mask></defs>` +
                    `<path d="${D.d}" mask="url(#${uidL})"/><path d="${arr}"/>`;
      return {
        keylines: drawKeylines([], [[3.5, 12], [14.6, 12], [11.0, 8.5], [11.0, 15.5]]),
        line: lineM,
        solid: {
          fill: [D.d],
          holeExact: [shaftCapsule, headWedge],
          knocks: [arr, headWedge],
          stroke: [arr]
        },
        duotone: { tone: [D.d], secondary: [arr], line: lineM }
      };
    }
};
