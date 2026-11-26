// Surgical-precision icon module: fdsi-volleyball-panel (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b-31-volleyball-panel",
  slug: "volleyball-panel",
  name: "#31. Volleyball (3-Way 120° Curved Panel Seams + 3 Padded Sector Faces in Solid)",
  area: "sb",
  order: 64,
  desc: "Exact R=9.0 sphere divided at 120° (-90°, 30°, 150°) by 3 curved panel seams + 3 secondary parallel panel arcs. Solid: 3 separate padded spherical wedges!",
  meta: {
      "slug": "volleyball-panel",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Indoor FIVB and league volleyball set, point, and outright markets.",
      "tags": [
          "volleyball",
          "ball",
          "fivb",
          "indoor",
          "sets",
          "team-sports"
      ]
  },
  build: () => {
      const ball = circleD(12.0, 12.0, 9.0);
      const pTop = polar(12, 12, 9.0, -90);
      const pBR = polar(12, 12, 9.0, 30);
      const pBL = polar(12, 12, 9.0, 150);
      // 3 primary curved Y-seams radiating from center (12, 12) to the 3 boundary points at 120°:
      const ySeams = `M12 12A9.0 9.0 0 0 1 ${P(pTop)}M12 12A9.0 9.0 0 0 1 ${P(pBR)}M12 12A9.0 9.0 0 0 1 ${P(pBL)}`;
      // 3 secondary curved panel seams inside each sector:
      const sub1 = `M12.0 7.2A8.5 8.5 0 0 1 18.2 13.2`;
      const sub2 = `M16.2 14.4A8.5 8.5 0 0 1 7.8 16.5`;
      const sub3 = `M7.8 14.4A8.5 8.5 0 0 1 10.2 5.4`;
      const uidV = "vb6_" + (nextUid());
      const lineM = `<defs><clipPath id="${uidV}"><path d="${ball}"/></clipPath></defs>` +
                    `<path d="${ball}"/><g clip-path="url(#${uidV})"><path d="${ySeams}"/><path d="${sub1}"/><path d="${sub2}"/><path d="${sub3}"/></g>`;
      return {
        keylines: drawKeylines([[12, 12, 9.0]], [pTop, pBR, pBL, [12, 12]]),
        line: lineM,
        solid: {
          fill: [circleD(12.0, 12.0, 9.2)],
          cut: [ySeams, sub1, sub2, sub3]
        },
        duotone: { tone: [ball], secondary: [ySeams, sub1, sub2, sub3], line: lineM }
      };
    }
};
