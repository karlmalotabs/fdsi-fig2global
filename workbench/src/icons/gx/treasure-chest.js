// Surgical-precision icon module: fdsi-treasure-chest (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-70-treasure-chest",
  slug: "treasure-chest",
  name: "#70. Treasure Chest / Mystery Drop (2 Separate Padded Shapes — Domed Lid + Lower Chest Box)",
  area: "gx",
  order: 103,
  desc: "Built like Betslip & Crown: 2 separate padded shapes in Solid — Domed Upper Chest Lid (y=4.2..9.8) + Lower Chest Box (y=11.6..20.2) with center keyhole lock!",
  meta: {
      "slug": "treasure-chest",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Pirate adventure slots, hold-and-win chests, and bonus feature unlocks.",
      "tags": [
          "treasure",
          "chest",
          "booty",
          "pirate",
          "loot",
          "bonus",
          "jackpot"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.4);
      // Line mode: Domed lid + lower box + horizontal clasp band + center lock plate
      const chest = `M3.6 10.2V8.2C3.6 5.4 6.8 4.0 12.0 4.0C17.2 4.0 20.4 5.4 20.4 8.2V18.4A1.8 1.8 0 0 1 18.6 20.2H5.4A1.8 1.8 0 0 1 3.6 18.4Z`;
      const seam = `M3.6 10.6H9.8M14.2 10.6H20.4`;
      const lock = bloatRect({ x: 9.8, y: 8.6, w: 4.4, h: 4.2, r: 0.9, b: 0.15 });
      // Solid mode: 2 Separate Padded Shapes (Domed Upper Lid y=3.8..9.6 + Lower Chest Box y=11.4..20.4) with keyhole cutout!
      const lidSolid = `M3.4 8.6C3.4 5.2 6.6 3.8 12.0 3.8C17.4 3.8 20.6 5.2 20.6 8.6A1.0 1.0 0 0 1 19.6 9.6H4.4A1.0 1.0 0 0 1 3.4 8.6Z`;
      const boxSolid = bloatRect({ x: 3.4, y: 11.4, w: 17.2, h: 9.0, r: [0.9, 0.9, cr, cr], b: b * 0.4 });
      const lockHole = circleD(12.0, 15.2, 1.5);
      return {
        keylines: drawKeylines([[12, 15.2, 1.5]], [[3.6, 10.6], [20.4, 10.6], ...lock.anchors]),
        line: `<path d="${chest}"/><path d="${seam}"/><path d="${lock.d}"/>`,
        solid: {
          face: [lidSolid, boxSolid.d],
          holeExact: [lockHole]
        },
        duotone: { tone: [boxSolid.d], secondary: [seam, lock.d], line: `<path d="${chest}"/><path d="${seam}"/><path d="${lock.d}"/>` }
      };
    }
};
