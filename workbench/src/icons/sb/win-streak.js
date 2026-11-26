// Surgical-precision icon module: fdsi-win-streak (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-134-win-streak",
  slug: "win-streak",
  name: "#134. Winning Streak / Combo Multiplier (3 Separate Padded Ascending Stars + Trajectory)",
  area: "sb",
  order: 167,
  desc: "3 ascending 4-point sparkle stars at (5.6, 16.8), (11.6, 11.6), and (18.0, 6.4) above a rising streak curve (`M5.6 20.2 Q12.8 18.8 19.6 11.4`).",
  meta: {
      "slug": "win-streak",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Multi-bet winning streak challenge and progressive combo boost.",
      "tags": [
          "win-streak",
          "combo",
          "stars",
          "challenge",
          "milestone",
          "hot-streak"
      ]
  },
  build: () => {
      const mkStar = (cx, cy, R) =>
        `M${f(cx)} ${f(cy - R)}` +
        `Q${f(cx + R * 0.16)} ${f(cy - R * 0.16)} ${f(cx + R)} ${f(cy)}` +
        `Q${f(cx + R * 0.16)} ${f(cy + R * 0.16)} ${f(cx)} ${f(cy + R)}` +
        `Q${f(cx - R * 0.16)} ${f(cy + R * 0.16)} ${f(cx - R)} ${f(cy)}` +
        `Q${f(cx - R * 0.16)} ${f(cy - R * 0.16)} ${f(cx)} ${f(cy - R)}Z`;
      const s1 = mkStar(5.4,  15.6, 2.5);
      const s2 = mkStar(11.4, 10.6, 3.1);
      const s3 = mkStar(18.0, 5.8,  3.8);
      const curve = `M5.6 20.2Q13.4 18.8 20.0 11.8`;
      return {
        keylines: drawKeylines([[5.4, 15.6, 2.5], [11.4, 10.6, 3.1], [18.0, 5.8, 3.8]], [[5.6, 20.2], [20.0, 11.8]]),
        line: `<path d="${s1}" fill="currentColor" stroke="none"/><path d="${s2}" fill="currentColor" stroke="none"/><path d="${s3}"/><path d="${curve}"/>`,
        solid: {
          face: [s1, s2, s3],
          stroke: [curve]
        },
        duotone: {
          tone: [s3],
          secondary: [s1, s2, curve],
          line: `<path d="${s1}" fill="currentColor" stroke="none"/><path d="${s2}" fill="currentColor" stroke="none"/><path d="${s3}"/><path d="${curve}"/>`
        }
      };
    }
};
