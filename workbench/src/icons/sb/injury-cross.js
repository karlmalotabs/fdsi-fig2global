// Surgical-precision icon module: fdsi-injury-cross (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-124-injury-cross",
  slug: "injury-cross",
  name: "#124. Medical / Injury Stoppage (Bloated First-Aid Case + Top Handle + Bold Plus Cross)",
  area: "sb",
  order: 157,
  desc: "Bloated medical kit case (x=3.2..20.8, y=6.8..20.2) + top carrying handle (x=8.8..15.2, y=3.6..6.8) + centered '+' medical cross inside!",
  meta: {
      "slug": "injury-cross",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Injury stoppage, medical treatment on pitch, and injury protection.",
      "tags": [
          "injury",
          "medical",
          "first-aid",
          "kit",
          "cross",
          "stoppage",
          "physio"
      ]
  },
  build: ({ b, r }) => {
      const B = bloatRect({ x: 3.2, y: 6.8, w: 17.6, h: 13.4, r: Math.min(r + 0.3, 2.1), b });
      const handle = `M8.8 6.8V4.8A1.2 1.2 0 0 1 10.0 3.6H14.0A1.2 1.2 0 0 1 15.2 4.8V6.8`;
      const cross = `M12.0 10.4V16.6M8.9 13.5H15.1`;
      const hV = capsule(12.0, 10.2, 12.0, 16.8, 0.95);
      const hH = capsule(8.7, 13.5, 15.3, 13.5, 0.95);
      return {
        keylines: drawKeylines([], [...B.anchors, [12, 13.5]]),
        line: `<path d="${B.d}"/><path d="${handle}"/><path d="${cross}"/>`,
        solid: {
          fill: [B.d],
          holeExact: [hV, hH],
          stroke: [handle]
        },
        duotone: { tone: [B.d], secondary: [handle, cross], line: `<path d="${B.d}"/><path d="${handle}"/><path d="${cross}"/>` }
      };
    }
};
