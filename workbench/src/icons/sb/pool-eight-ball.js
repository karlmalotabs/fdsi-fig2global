// Surgical-precision icon module: fdsi-pool-eight-ball (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-29-pool-eight-ball",
  slug: "pool-eight-ball",
  name: "#29. 8-Ball Pool / Snooker (Zero Overlap Clipping on Solid Figure-8!)",
  area: "sb",
  order: 62,
  desc: "FIXED 8-BALL SOLID: Previously putting both loops of the '8' in a single `evenodd` path caused their waist intersection to cancel out into a white clip gap! Now `topRing` and `botRing` are 2 separate `<path>` elements in `over` so the waist merges seamlessly!",
  meta: {
      "slug": "pool-eight-ball",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "World Snooker Tour, 8-Ball, and 9-Ball pool frame and match markets.",
      "tags": [
          "pool",
          "8-ball",
          "snooker",
          "billiards",
          "cue-sports",
          "black-ball"
      ]
  },
  build: () => {
      const ball = circleD(12.0, 12.0, 9.0);
      const ballSolid = circleD(12.0, 12.0, 9.2);
      const loopTop = circleD(12.0, 9.4, 2.1);
      const loopBot = circleD(12.0, 13.9, 2.4);
      // 2 separate `<path>` elements in `over` so their waist overlap (`y = 11.15..11.85`) paints solid black instead of canceling out under evenodd!
      const topRing = circleD(12.0, 9.5, 2.35) + circleD(12.0, 9.4, 1.05);
      const botRing = circleD(12.0, 13.8, 2.65) + circleD(12.0, 13.9, 1.20);
      return {
        keylines: drawKeylines([[12, 12, 9.0], [12, 9.4, 2.1], [12, 13.9, 2.4]], [[12, 9.4], [12, 13.9]]),
        line: `<path d="${ball}"/><path d="${loopTop}"/><path d="${loopBot}"/>`,
        solid: {
          fill: [ballSolid],
          holeExact: [circleD(12.0, 11.7, 6.0)],
          over: [topRing, botRing]
        },
        duotone: {
          tone: [ball],
          secondary: [loopTop, loopBot],
          line: `<path d="${ball}"/><path d="${loopTop}"/><path d="${loopBot}"/>`
        }
      };
    }
};
