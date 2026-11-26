// Surgical-precision icon module: fdsi-moto-gp (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "moto-gp",
  slug: "moto-gp",
  name: "MotoGP Superbike (Open Wheels + Colored Sportbike Fairing & Rider!)",
  area: "sb",
  order: 212,
  desc: "FIXED WHEELS: Wheels stay open rings in Duotone & Color mode while the sportbike fairing is Crimson Red (`#fb7185`) and the rider helmet is Gold (`#fbbf24`)!",
  meta: {
      "slug": "moto-gp",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "MotoGP, WorldSBK, and Isle of Man TT superbike motorcycle racing.",
      "tags": [
          "motogp",
          "motorcycle",
          "superbike",
          "racing",
          "motorsport",
          "rider"
      ]
  },
  build: () => {
      const wRear = circleD(5.8, 17.2, 3.4), wFront = circleD(18.2, 17.2, 3.4);
      const fairing =
        `M4.5 11.8L9.8 10.8L15.2 9.0L19.5 11.8` +
        `L16.5 13.5H10.2L6.8 12.8Z`;
      const fork = `M15.2 9.5L18.2 17.2`;
      const rHead = circleD(13.8, 4.6, 2.0);
      const rTorso = tangentHull2([10.5, 7.2], 1.25, [7.5, 10.0], 0.9);
      const lineStr = `<path d="${wRear}"/><path d="${wFront}"/><path d="${fairing}"/><path d="${fork}"/><path d="${rHead}"/><path d="${rTorso.d}" fill="currentColor" stroke="none"/>`;
      return {
        keylines: drawKeylines([[5.8, 17.2, 3.4], [18.2, 17.2, 3.4], [13.8, 4.6, 2.0]], rTorso.pts),
        line: lineStr,
        solid: {
          fill: [rHead, fairing],
          face: [rTorso.d],
          stroke: [wRear, wFront, fork]
        },
        duotone: {
          tone: [fairing, rHead],
          secondary: [wRear, wFront, fork],
          line: `<path d="${fairing}"/><path d="${rHead}"/><path d="${rTorso.d}" fill="currentColor" stroke="none"/>`
        },
        color: (dark) => `<path d="${fairing}" fill="${dark ? '#9f1239' : '#fda4af'}" stroke="none"/><path d="${rHead}" fill="${dark ? '#b45309' : '#fde047'}" stroke="none"/>` + lineStr
      };
    }
};
