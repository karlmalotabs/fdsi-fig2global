// Surgical-precision icon module: fdsi-water-polo (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, sectorFace, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "waterpolo-ball",
  slug: "water-polo",
  name: "Water Polo (3 Padded Sector Panels + 2 Sinusoidal Water Waves)",
  area: "sb",
  order: 208,
  desc: "FIXED SOLID: 3 separated sectorFace panels (like Diamond facets) padded 1.8px above the 2 sinusoidal water waves.",
  meta: {
      "slug": "water-polo",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "LEN Champions League and Olympic water polo match and total goals.",
      "tags": [
          "water-polo",
          "ball",
          "aquatics",
          "pool",
          "olympic",
          "team-sports"
      ]
  },
  build: ({ s }) => {
      const cx = 12, cy = 8.4, R = 5.4;
      const ball = circleD(cx, cy, R);
      const pTop = polar(cx, cy, R, -90), pRight = polar(cx, cy, R, 30), pLeft = polar(cx, cy, R, 150);
      const seams = `M${P(pTop)}L12 8.4M12 8.4L${P(pRight)}M12 8.4L${P(pLeft)}`;
      const f1 = sectorFace(cx, cy, R, -90, 30, s * 0.9, 0.55);
      const f2 = sectorFace(cx, cy, R, 30, 150, s * 0.9, 0.55);
      const f3 = sectorFace(cx, cy, R, 150, 270, s * 0.9, 0.55);
      const wave1 = `M2.5 16.6Q5.2 14.8 7.8 16.6T13.2 16.6T18.5 16.6T21.5 16.6`;
      const wave2 = `M2.5 20.2Q5.2 18.4 7.8 20.2T13.2 20.2T18.5 20.2T21.5 20.2`;
      const waterTone = `M2.5 16.6Q5.2 14.8 7.8 16.6T13.2 16.6T18.5 16.6T21.5 16.6V20.2Q18.8 22.0 18.5 20.2T13.2 20.2T7.8 20.2T2.5 20.2Z`;
      return {
        keylines: drawKeylines([[cx, cy, R]], [[cx, cy], pTop, pRight, pLeft]),
        line: `<path d="${ball}"/><path d="${seams}"/><path d="${wave1}"/><path d="${wave2}"/>`,
        solid: { faces: [f1, f2, f3], stroke: [wave1, wave2] },
        duotone: { tone: [ball, waterTone], secondary: [wave1, wave2, seams], line: `<path d="${ball}"/><path d="${wave1}"/><path d="${wave2}"/>` }
      };
    }
};
