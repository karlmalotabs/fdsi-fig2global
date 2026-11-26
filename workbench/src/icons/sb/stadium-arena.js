// Surgical-precision icon module: fdsi-stadium-arena (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { ellipseD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-60-stadium-arena",
  slug: "stadium-arena",
  name: "#60. Stadium / Arena Venue (2 Separate Padded Shapes — Upper Bowl Rim + Lower Arched Facade)",
  area: "sb",
  order: 93,
  desc: "Built like Crown & Curling Stone: Elliptical upper stadium bowl rim (cx=12, cy=7.4, rx=8.8, ry=3.0) + lower stadium facade wall (y=7.4..19.6) with center arched entrance gate!",
  meta: {
      "slug": "stadium-arena",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Venue details, home/away stadium factor, and tournament host arenas.",
      "tags": [
          "stadium",
          "arena",
          "venue",
          "colosseum",
          "ground",
          "home-advantage"
      ]
  },
  build: () => {
      const topRim = ellipseD(12.0, 7.4, 8.8, 3.0);
      const outerWall = `M3.2 7.4L4.6 17.6A7.6 2.4 0 0 0 19.4 17.6L20.8 7.4`;
      const gate = `M9.4 19.4V14.8A2.6 2.6 0 0 1 14.6 14.8V19.4`;
      // Solid mode: 2 Separate Padded Shapes (Top Elliptical Stadium Bowl + Lower Facade Wall separated by a 1.5px rim gap, with arched entrance gate cutout!):
      const topBowlSolid = ellipseD(12.0, 7.0, 8.8, 2.8);
      const botWallSolid =
        `M3.5 9.8` +
        `A9.2 3.2 0 0 0 20.5 9.8` +
        `L19.4 17.8` +
        `A7.6 2.4 0 0 1 4.6 17.8Z`;
      const gateHole = `M9.2 20.4V15.0A2.8 2.8 0 0 1 14.8 15.0V20.4Z`;
      return {
        keylines: drawKeylines([[12, 7.4, 3.0]], [[3.2, 7.4], [20.8, 7.4], [4.6, 17.6], [19.4, 17.6]]),
        line: `<path d="${topRim}"/><path d="${outerWall}"/><path d="${gate}"/>`,
        solid: {
          face: [topBowlSolid, botWallSolid],
          holeExact: [gateHole]
        },
        duotone: { tone: [botWallSolid], secondary: [topRim, gate], line: `<path d="${topRim}"/><path d="${outerWall}"/><path d="${gate}"/>` }
      };
    }
};
