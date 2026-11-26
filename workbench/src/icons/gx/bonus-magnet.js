// Surgical-precision icon module: fdsi-bonus-magnet (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-72-bonus-magnet",
  slug: "bonus-magnet",
  name: "#72. Bonus Magnet (Classic Red U-Arch + Silver/Gold Pole Tips in Color Mode!)",
  area: "gx",
  order: 105,
  desc: "FIXED COLOR: Inverted U-shaped magnet now renders with a classic Crimson Red arch (`#fb7185`) and Golden-Silver pole tips (`#fde047`) instead of purple!",
  meta: {
      "slug": "bonus-magnet",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Cash-collect magnet symbols, sticky wild features, and bonus attractors.",
      "tags": [
          "magnet",
          "collect",
          "attract",
          "bonus",
          "feature",
          "wild",
          "slots"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.35, 0.7);
      const magLine =
        `M3.6 20.0H7.6V11.8A4.4 4.4 0 0 1 16.4 11.8V20.0H20.4V11.8A8.4 8.4 0 0 0 3.6 11.8Z`;
      const seamL = `M3.6 16.4H7.6`;
      const seamR = `M16.4 16.4H20.4`;
      const poleL = bloatRect({ x: 3.4,  y: 16.8, w: 4.4, h: 3.6, r: cr, b: b * 0.2 });
      const poleR = bloatRect({ x: 16.2, y: 16.8, w: 4.4, h: 3.6, r: cr, b: b * 0.2 });
      const archSolid =
        `M3.4 14.4A0.8 0.8 0 0 0 4.2 15.2H7.0A0.8 0.8 0 0 0 7.8 14.4V11.8` +
        `A4.2 4.2 0 0 1 16.2 11.8V14.4A0.8 0.8 0 0 0 17.0 15.2H19.8A0.8 0.8 0 0 0 20.6 14.4V11.8` +
        `A8.6 8.6 0 0 0 3.4 11.8Z`;
      const topArchColor = `M3.6 16.4V11.8A8.4 8.4 0 0 1 20.4 11.8V16.4H16.4V11.8A4.4 4.4 0 0 0 7.6 11.8V16.4Z`;
      const tipsColor = `M3.6 16.4H7.6V20.0H3.6ZM16.4 16.4H20.4V20.0H16.4Z`;
      const lineStr = `<path d="${magLine}"/><path d="${seamL}"/><path d="${seamR}"/>`;
      return {
        keylines: drawKeylines([[12, 11.8, 8.4], [12, 11.8, 4.4]], [[3.6, 20.0], [7.6, 20.0], [16.4, 20.0], [20.4, 20.0]]),
        line: lineStr,
        solid: { face: [archSolid, poleL.d, poleR.d] },
        duotone: { tone: [topArchColor], secondary: [seamL, seamR], line: lineStr },
        color: (dark) => `<path d="${topArchColor}" fill="${dark ? '#9f1239' : '#fda4af'}" stroke="none"/><path d="${tipsColor}" fill="${dark ? '#b45309' : '#fde047'}" stroke="none"/>` + lineStr
      };
    }
};
