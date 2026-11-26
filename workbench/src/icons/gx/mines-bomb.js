// Surgical-precision icon module: fdsi-mines-bomb (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-69-mines-bomb",
  slug: "mines-bomb",
  name: "#69. Mines / Crash Bomb (Cast-Iron Sphere + Tilted Fuse Cap + 4-Point Spark Star)",
  area: "gx",
  order: 102,
  desc: "Spherical bomb body (cx=10.4, cy=13.8, R=6.8) with highlight arc + angled fuse collar at (14.8, 8.6) + fuse cord to 4-point spark at (19.4, 4.8).",
  meta: {
      "slug": "mines-bomb",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Minesweeper casino arcade game where players avoid hidden bombs.",
      "tags": [
          "mines",
          "bomb",
          "explosive",
          "fuse",
          "arcade",
          "crash",
          "instant-game"
      ]
  },
  build: () => {
      const bomb = circleD(10.4, 13.8, 6.8);
      const bombSolid = circleD(10.4, 13.8, 7.1);
      const glint = arcPath(10.4, 13.8, 4.2, 195, 255);
      const glintHole = capsule(6.8, 12.4, 8.8, 10.4, 0.85);
      const fuse = `M14.8 9.0L16.8 7.0M18.8 3.2V6.8M17.0 5.0H20.6`;
      return {
        keylines: drawKeylines([[10.4, 13.8, 6.8], [10.4, 13.8, 4.2]], [[14.8, 9.0], [18.8, 5.0]]),
        line: `<path d="${bomb}"/><path d="${glint}"/><path d="${fuse}"/>`,
        solid: {
          fill: [bombSolid],
          holeExact: [glintHole],
          stroke: [fuse]
        },
        duotone: { tone: [bomb], secondary: [glint, fuse], line: `<path d="${bomb}"/><path d="${glint}"/><path d="${fuse}"/>` }
      };
    }
};
