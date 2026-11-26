// Surgical-precision icon module: fdsi-martial-arts-belt (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b-34-martial-arts-belt",
  slug: "martial-arts-belt",
  name: "#34. Judo / Karate / BJJ Belt (Dynamic 2-Tone Color: Dark Crimson Center Knot + Lighter Red Sides!)",
  area: "sb",
  order: 67,
  desc: "FIXED COLOR: In Color mode, the central knot is deep dark crimson (`#be123c`) while the side waistbands are lighter red (`#fb7185`) and the hanging tails are soft coral (`#fda4af`)!",
  meta: {
      "slug": "martial-arts-belt",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Judo, Karate, Taekwondo, and Brazilian Jiu-Jitsu (BJJ) combat sports.",
      "tags": [
          "martial-arts",
          "judo",
          "karate",
          "bjj",
          "black-belt",
          "combat",
          "olympic"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.9);
      const bandL = bloatRect({ x: 3.0, y: 7.8, w: 6.4, h: 4.4, r: cr, b: b * 0.3 });
      const bandR = bloatRect({ x: 14.6, y: 7.8, w: 6.4, h: 4.4, r: cr, b: b * 0.3 });
      const knot = bloatRect({ x: 9.4, y: 6.8, w: 5.2, h: 6.4, r: cr, b: b * 0.35 });
      const tailL = bloatPoly([[9.6, 13.2], [11.8, 13.2], [8.8, 20.4], [5.4, 19.0]], 0.65, b * 0.25, { minEdge: 2.0 });
      const tailR = bloatPoly([[12.2, 13.2], [14.4, 13.2], [18.6, 19.0], [15.2, 20.4]], 0.65, b * 0.25, { minEdge: 2.0 });
      const sBandL = bloatRect({ x: 2.8, y: 7.8, w: 5.4, h: 4.4, r: 0.9, b: b * 0.25 });
      const sBandR = bloatRect({ x: 15.8, y: 7.8, w: 5.4, h: 4.4, r: 0.9, b: b * 0.25 });
      const sKnot  = bloatRect({ x: 9.5, y: 6.8, w: 5.0, h: 6.2, r: 1.0, b: b * 0.3 });
      const sTailL = bloatPoly([[9.0, 14.4], [11.4, 14.4], [8.6, 20.6], [5.2, 19.2]], 0.7, b * 0.2, { minEdge: 2.0 });
      const sTailR = bloatPoly([[12.6, 14.4], [15.0, 14.4], [18.8, 19.2], [15.4, 20.6]], 0.7, b * 0.2, { minEdge: 2.0 });
      const lineStr = `<path d="${bandL.d}"/><path d="${bandR.d}"/><path d="${tailL.d}"/><path d="${tailR.d}"/><path d="${knot.d}"/>`;
      return {
        keylines: drawKeylines([], [...knot.anchors, [5.4, 19.0], [18.6, 19.0]]),
        line: lineStr,
        solid: { face: [sBandL.d, sBandR.d, sKnot.d, sTailL.d, sTailR.d] },
        duotone: { tone: [tailL.d, tailR.d, bandL.d, bandR.d], secondary: [knot.d], line: lineStr },
        color: (dark) => `<path d="${tailL.d}" fill="${dark ? '#881337' : '#fecdd3'}" stroke="none"/><path d="${tailR.d}" fill="${dark ? '#881337' : '#fecdd3'}" stroke="none"/>` +
               `<path d="${bandL.d}" fill="${dark ? '#be123c' : '#fda4af'}" stroke="none"/><path d="${bandR.d}" fill="${dark ? '#be123c' : '#fda4af'}" stroke="none"/>` +
               `<path d="${knot.d}" fill="${dark ? '#f43f5e' : '#e11d48'}" stroke="none"/>` + lineStr
      };
    }
};
