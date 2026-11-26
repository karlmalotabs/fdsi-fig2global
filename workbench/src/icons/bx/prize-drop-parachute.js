// Surgical-precision icon module: fdsi-prize-drop-parachute (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-139-prize-parachute",
  slug: "prize-drop-parachute",
  name: "#139. Cash Drop / Airdrop Parachute (Semicircular Canopy + Rigging Lines + Prize Box)",
  area: "bx",
  order: 172,
  desc: "Semicircular parachute canopy (cx=12, cy=10.6, R=8.2) + 2 diagonal suspension cords converging to aseparate padded prize box at bottom (x=9.2..14.8, y=15.8..20.6)!",
  meta: {
      "slug": "prize-drop-parachute",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Daily cash drop, airdrop bonus, and random prize giveaway.",
      "tags": [
          "parachute",
          "airdrop",
          "prize-drop",
          "bonus",
          "giveaway",
          "reward",
          "box"
      ]
  },
  build: ({ b, r }) => {
      const canopy = `M3.8 10.6A8.2 8.2 0 0 1 20.2 10.6Z`;
      const cords  = `M4.2 10.6L9.4 15.8M19.8 10.6L14.6 15.8M12.0 10.6V15.8`;
      const box = bloatRect({ x: 9.0, y: 15.8, w: 6.0, h: 4.8, r: Math.min(r * 0.4, 0.9), b: b * 0.25 });
      return {
        keylines: drawKeylines([[12, 10.6, 8.2]], [[3.8, 10.6], [20.2, 10.6], ...box.anchors]),
        line: `<path d="${canopy}"/><path d="${cords}"/><path d="${box.d}"/>`,
        solid: {
          fill: [canopy],
          face: [box.d],
          stroke: [cords]
        },
        duotone: { tone: [canopy, box.d], secondary: [cords], line: `<path d="${canopy}"/><path d="${cords}"/><path d="${box.d}"/>` }
      };
    }
};
