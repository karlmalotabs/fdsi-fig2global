// Surgical-precision icon module: fdsi-table-tennis (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-27-table-tennis",
  slug: "table-tennis",
  name: "#27. Table Tennis / Ping Pong (3 Separate Padded Shapes — Paddle Head + Handle + Ball)",
  area: "sb",
  order: 60,
  desc: "Circular paddle head (cx=10.5, cy=10.0, R=6.4) with rubber grip seam + flared handle to (4.2, 19.8) + ping-pong ball at (18.8, 16.8). Solid: 3 separate padded shapes!",
  meta: {
      "slug": "table-tennis",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "24/7 international table tennis and ping-pong set and point markets.",
      "tags": [
          "table-tennis",
          "ping-pong",
          "paddle",
          "racket",
          "ball",
          "ittf"
      ]
  },
  build: () => {
      const head = circleD(10.8, 9.8, 6.2);
      const seam = `M6.0 13.6L14.6 5.0`;
      const handle = `M6.8 14.6L3.8 18.8A1.3 1.3 0 0 0 5.8 20.6L9.6 16.6`;
      const handleSolid = capsule(6.8, 15.2, 4.4, 19.2, 1.65);
      const ball = circleD(18.6, 16.8, 2.2);
      const ballSolid = circleD(18.6, 16.8, 2.5);
      return {
        keylines: drawKeylines([[10.8, 9.8, 6.2], [18.6, 16.8, 2.2]], [[6.0, 13.6], [14.6, 5.0], [4.4, 19.2]]),
        line: `<path d="${head}"/><path d="${seam}"/><path d="${handle}"/><path d="${ball}"/>`,
        solid: {
          fill: [head],
          cut: [seam],
          face: [handleSolid, ballSolid]
        },
        duotone: { tone: [head, ball], secondary: [seam, handle], line: `<path d="${head}"/><path d="${seam}"/><path d="${handle}"/><path d="${ball}"/>` }
      };
    }
};
