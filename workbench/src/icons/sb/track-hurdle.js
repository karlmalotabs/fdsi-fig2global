// Surgical-precision icon module: fdsi-track-hurdle (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b2-108-track-hurdle",
  slug: "track-hurdle",
  name: "#108. Track & Field Hurdle (Bloated Top Crossbar with Diagonal Stripes + Side Legs)",
  area: "sb",
  order: 141,
  desc: "Bloated horizontal hurdle top board (x=3.2..20.8, y=5.0..10.2) with 2 diagonal zebra stripes + vertical side legs & base feet to y=19.8.",
  meta: {
      "slug": "track-hurdle",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "110m/400m hurdles, steeplechase, and track & field athletics events.",
      "tags": [
          "hurdles",
          "track",
          "athletics",
          "barrier",
          "steeplechase",
          "running"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      const bar = bloatRect({ x: 3.2, y: 5.0, w: 17.6, h: 5.2, r: cr, b: b * 0.35 });
      const stripes = `M8.2 10.2L10.8 5.0M13.2 10.2L15.8 5.0`;
      const legs = `M5.6 10.2V19.6H8.8M18.4 10.2V19.6H15.2`;
      const sHole1 = capsule(8.2, 10.4, 10.8, 4.8, 0.82);
      const sHole2 = capsule(13.2, 10.4, 15.8, 4.8, 0.82);
      const uidHd = "hd6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidHd}"><path d="${bar.d}"/></clipPath></defs>` +
                    `<path d="${bar.d}"/><g clip-path="url(#${uidHd})"><path d="${stripes}"/></g><path d="${legs}"/>`;
      return {
        keylines: drawKeylines([], [...bar.anchors, [5.6, 19.6], [18.4, 19.6]]),
        line: lineM,
        solid: {
          fill: [bar.d],
          holeExact: [sHole1, sHole2],
          stroke: [legs]
        },
        duotone: { tone: [bar.d], secondary: [stripes, legs], line: lineM }
      };
    }
};
