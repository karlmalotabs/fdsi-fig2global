// Surgical-precision icon module: fdsi-casino-dice (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-62-casino-dice",
  slug: "casino-dice",
  name: "#62. Casino Craps Die (Bloated Cube Face + 5 Bold Circular Pips)",
  area: "gx",
  order: 95,
  desc: "Bloated square die (x=4.0..20.0, y=4.0..20.0) with 5 bold circular pips (r=1.35 at (8.2, 8.2), (15.8, 8.2), (12.0, 12.0), (8.2, 15.8), (15.8, 15.8)).",
  meta: {
      "slug": "casino-dice",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Craps, Lightning Dice, Sic Bo, and dice-based table games.",
      "tags": [
          "dice",
          "craps",
          "cube",
          "pips",
          "roll",
          "random",
          "casino",
          "table-games"
      ]
  },
  build: ({ b, r }) => {
      const D = bloatRect({ x: 4.0, y: 4.0, w: 16.0, h: 16.0, r: Math.min(r + 0.4, 2.5), b });
      const pipCoords = [[8.2, 8.2], [15.8, 8.2], [12.0, 12.0], [8.2, 15.8], [15.8, 15.8]];
      const pips = pipCoords.map(([x, y]) => circleD(x, y, 1.35)).join("");
      const pipHoles = pipCoords.map(([x, y]) => circleD(x, y, 1.55));
      return {
        keylines: drawKeylines(pipCoords.map(([x, y]) => [x, y, 1.35]), D.anchors),
        line: `<path d="${D.d}"/><path d="${pips}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [D.d], holeExact: pipHoles },
        duotone: { tone: [D.d], line: `<path d="${D.d}"/><path d="${pips}" fill="currentColor" stroke="none"/>` }
      };
    }
};
