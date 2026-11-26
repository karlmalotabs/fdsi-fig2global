// Surgical-precision icon module: fdsi-slot-machine-reels (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-159-jackpot-banner",
  slug: "slot-machine-reels",
  name: "#159. 3-Reel Slot Machine (3 Separate Padded Reel Columns + Center Payline + Pull Lever!)",
  area: "gx",
  order: 192,
  desc: "REBUILT AS 3-REEL SLOT MACHINE: 3 vertical slot reel drums (x=2.8..17.8, y=5.2..18.8) with aligned center payline symbols + classic side pull lever & knob at (20.8, 6.4)!",
  meta: {
      "slug": "slot-machine-reels",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "3-reel slot machine window with aligned payline and side pull lever.",
      "tags": [
          "slot-machine",
          "reels",
          "payline",
          "lever",
          "one-armed-bandit",
          "spins"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 1.0);
      // Outer 3-reel frame + 2 vertical reel dividers + center payline ticks + right pull lever:
      const frame = bloatRect({ x: 2.8, y: 5.2, w: 15.0, h: 13.6, r: Math.min(r + 0.2, 1.8), b: b * 0.35 });
      const dividers = `M7.8 5.2V18.8M12.8 5.2V18.8`;
      const payline = `M4.6 12.0H6.2M9.5 12.0H11.1M14.5 12.0H16.1`;
      const lever = `M17.8 14.2H20.8V7.8`;
      const knob = circleD(20.8, 6.2, 1.5);
      // Solid mode: 3 Separate Padded Reel Columns (`r1`, `r2`, `r3`) with center payline windows + pull lever & knob!
      const r1 = bloatRect({ x: 2.8,  y: 5.2, w: 4.1, h: 13.6, r: [1.4, 0.6, 0.6, 1.4], b: b * 0.25 });
      const r2 = bloatRect({ x: 8.25, y: 5.2, w: 4.1, h: 13.6, r: 0.6, b: b * 0.25 });
      const r3 = bloatRect({ x: 13.7, y: 5.2, w: 4.1, h: 13.6, r: [0.6, 1.4, 1.4, 0.6], b: b * 0.25 });
      const h1 = circleD(4.85,  12.0, 1.15);
      const h2 = circleD(10.3,  12.0, 1.15);
      const h3 = circleD(15.75, 12.0, 1.15);
      return {
        keylines: drawKeylines([[20.8, 6.2, 1.5]], [...frame.anchors, [7.8, 12.0], [12.8, 12.0]]),
        line: `<path d="${frame.d}"/><path d="${dividers}"/><path d="${payline}"/><path d="${lever}"/><path d="${knob}" fill="currentColor" stroke="none"/>`,
        solid: {
          face: [r1.d, r2.d, r3.d, circleD(20.8, 6.2, 1.7)],
          holeExact: [h1, h2, h3],
          stroke: [lever]
        },
        duotone: {
          tone: [frame.d],
          secondary: [dividers, payline, lever],
          line: `<path d="${frame.d}"/><path d="${dividers}"/><path d="${payline}"/><path d="${lever}"/><path d="${knob}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
