// Surgical-precision icon module: fdsi-user (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a-01-user-account",
  slug: "user",
  name: "#1. User Profile / Account (2 Separate Padded Shapes — Head Circle + Shoulder Arch)",
  area: "common",
  order: 34,
  desc: "Circle head (cx=12, cy=7.4, r=3.6) + separate bloated dome shoulder body (x=4.4..19.6, y=14.0..20.4). Solid: 2 separate padded shapes with 3.0px neck gap!",
  meta: {
      "slug": "user",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Open player profile, account overview, or personal details.",
      "tags": [
          "user",
          "profile",
          "account",
          "avatar",
          "person",
          "member",
          "player"
      ]
  },
  build: () => {
      const head = circleD(12.0, 7.4, 3.6);
      const headSolid = circleD(12.0, 7.4, 4.0);
      // Clean rounded dome shoulder body (flat bottom y=20.2 with r=1.8 corners, arched shoulders up to y=13.8):
      const shoulders = `M4.5 18.6C4.5 15.2 7.8 13.6 12.0 13.6C16.2 13.6 19.5 15.2 19.5 18.6A1.6 1.6 0 0 1 17.9 20.2H6.1A1.6 1.6 0 0 1 4.5 18.6Z`;
      const shouldersSolid = `M4.2 18.6C4.2 15.0 7.6 13.4 12.0 13.4C16.4 13.4 19.8 15.0 19.8 18.6A1.8 1.8 0 0 1 18.0 20.4H6.0A1.8 1.8 0 0 1 4.2 18.6Z`;
      return {
        keylines: drawKeylines([[12, 7.4, 3.6], [12, 18.6, 7.5]], [[12, 7.4], [4.5, 18.6], [19.5, 18.6]]),
        line: `<path d="${head}"/><path d="${shoulders}"/>`,
        solid: { face: [headSolid, shouldersSolid] },
        duotone: { tone: [shoulders], secondary: [head], line: `<path d="${head}"/><path d="${shoulders}"/>` }
      };
    }
};
