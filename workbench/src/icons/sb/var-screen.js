// Surgical-precision icon module: fdsi-var-screen (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-48-var-screen",
  slug: "var-screen",
  name: "#48. VAR / Video Assistant Referee (Bloated Monitor + Corner Frame Brackets + Stand)",
  area: "sb",
  order: 81,
  desc: "Bloated widescreen VAR monitor (x=3.0..21.0, y=4.0..17.0) with 2 opposing L-focus brackets inside + separate padded stand bar below (y=19.8).",
  meta: {
      "slug": "var-screen",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Video Assistant Referee (VAR) review and overturned decision specials.",
      "tags": [
          "var",
          "video-referee",
          "review",
          "monitor",
          "screen",
          "decision"
      ]
  },
  build: ({ b, r }) => {
      const S = bloatRect({ x: 3.0, y: 4.0, w: 18.0, h: 13.0, r: Math.min(r + 0.4, 2.4), b });
      // Opposing VAR camera frame L-brackets inside the screen:
      const brackets = `M7.2 10.6V7.6H10.4M16.8 10.4V13.4H13.6`;
      const standLine = `M8.0 20.2H16.0`;
      const standPill = capsule(8.0, 20.0, 16.0, 20.0, 1.1);
      return {
        keylines: drawKeylines([], [...S.anchors, [7.2, 7.6], [16.8, 13.4]]),
        line: `<path d="${S.d}"/><path d="${brackets}"/><path d="${standLine}"/>`,
        solid: {
          face: [S.d, standPill],
          cut: [brackets]
        },
        duotone: { tone: [S.d], secondary: [brackets, standLine], line: `<path d="${S.d}"/><path d="${brackets}"/><path d="${standLine}"/>` }
      };
    }
};
