// Surgical-precision icon module: fdsi-futsal-ball (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-119-futsal-ball",
  slug: "futsal-ball",
  name: "#119. Futsal / Indoor Football (4 Separate Padded Spherical Sector Shapes in Solid — Zero Cut Lines!)",
  area: "sb",
  order: 152,
  desc: "FIXED SOLID: Removed the raw `cut` knockout lines! Solid is now built from 4 separate, self-contained rounded quadrant shapes (`qTR`, `qBR`, `qBL`, `qTL`) framing the central diamond!",
  meta: {
      "slug": "futsal-ball",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "FIFA and UEFA indoor 5-a-side futsal match and tournament markets.",
      "tags": [
          "futsal",
          "indoor-football",
          "5-a-side",
          "ball",
          "court",
          "soccer"
      ]
  },
  build: ({ b, r }) => {
      const ball = circleD(12.0, 12.0, 9.0);
      const P4 = bloatPoly([[12.0, 8.2], [15.8, 12.0], [12.0, 15.8], [8.2, 12.0]], Math.min(r * 0.35, 0.7), b * 0.3, { minEdge: 2.0 });
      const seams = `M12.0 8.2V3.0M15.8 12.0H21.0M12.0 15.8V21.0M8.2 12.0H3.0`;
      // SOLID MODE: 4 Independent Rounded Spherical Sector Shapes (Top-Right, Bottom-Right, Bottom-Left, Top-Left)
      // Each sector has an outer R=9.2 circular arc, 2 straight padded radial walls (offset 0.82px from x=12 and y=12), and a diagonal inner wall parallel to the center diamond (offset 1.5px)!
      const qTR =
        `M12.8 3.6A0.7 0.7 0 0 1 13.5 2.9` +
        `A9.2 9.2 0 0 1 21.1 10.5` +
        `A0.7 0.7 0 0 1 20.4 11.2` +
        `H17.2L12.8 6.8Z`;
      const qBR =
        `M17.2 12.8H20.4A0.7 0.7 0 0 1 21.1 13.5` +
        `A9.2 9.2 0 0 1 13.5 21.1` +
        `A0.7 0.7 0 0 1 12.8 20.4` +
        `V17.2Z`;
      const qBL =
        `M11.2 17.2V20.4A0.7 0.7 0 0 1 10.5 21.1` +
        `A9.2 9.2 0 0 1 2.9 13.5` +
        `A0.7 0.7 0 0 1 3.6 12.8` +
        `H6.8Z`;
      const qTL =
        `M6.8 11.2H3.6A0.7 0.7 0 0 1 2.9 10.5` +
        `A9.2 9.2 0 0 1 10.5 2.9` +
        `A0.7 0.7 0 0 1 11.2 3.6` +
        `V6.8Z`;
      return {
        keylines: drawKeylines([[12, 12, 9.0]], P4.anchors),
        line: `<path d="${ball}"/><path d="${P4.d}" fill="currentColor" stroke="none"/><path d="${seams}"/>`,
        solid: {
          // 4 separate, self-contained rounded sector shapes — ZERO knockout lines!
          face: [qTR, qBR, qBL, qTL]
        },
        duotone: { tone: [ball], secondary: [seams], line: `<path d="${ball}"/><path d="${P4.d}" fill="currentColor" stroke="none"/><path d="${seams}"/>` }
      };
    }
};
