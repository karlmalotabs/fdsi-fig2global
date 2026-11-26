// Surgical-precision icon module: fdsi-jockey-cap (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-118-jockey-cap",
  slug: "jockey-cap",
  name: "#118. Horse Racing Jockey Silk Cap (2 Separate Padded Dome Panel Halves + Visor Peak)",
  area: "sb",
  order: 151,
  desc: "Hemispherical jockey silk cap dome (cx=10.8, cy=14.6, R=7.4) with top button pom + front visor bill extending to (21.2, 14.6). Solid: 2 separate silk dome panels + visor!",
  meta: {
      "slug": "jockey-cap",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Thoroughbred flat and national hunt horse racing silks and jockey specials.",
      "tags": [
          "jockey",
          "cap",
          "silks",
          "horse-racing",
          "helmet",
          "turf",
          "racecourse"
      ]
  },
  build: () => {
      const dome = `M3.4 14.6A7.4 7.4 0 0 1 18.2 14.6Z`;
      const seam = `M10.8 7.2V14.6`;
      const pom = circleD(10.8, 5.4, 1.3);
      const bill = `M3.0 14.6H21.0`;
      // Solid: 2 separate padded quarter-circle silk panels (`leftSilk`, `rightSilk`) + top pom + bottom visor bar!
      const leftSilk  = `M3.4 13.8A7.4 7.4 0 0 1 10.0 7.2V13.8Z`;
      const rightSilk = `M11.6 7.2A7.4 7.4 0 0 1 18.2 13.8H11.6Z`;
      const billSolid = capsule(3.0, 15.6, 21.0, 15.6, 1.05);
      return {
        keylines: drawKeylines([[10.8, 14.6, 7.4], [10.8, 5.4, 1.3]], [[3.4, 14.6], [18.2, 14.6], [21.0, 14.6]]),
        line: `<path d="${dome}"/><path d="${seam}"/><path d="${pom}" fill="currentColor" stroke="none"/><path d="${bill}"/>`,
        solid: {
          face: [leftSilk, rightSilk, circleD(10.8, 5.2, 1.5), billSolid]
        },
        duotone: { tone: [dome], secondary: [seam, bill], line: `<path d="${dome}"/><path d="${seam}"/><path d="${pom}" fill="currentColor" stroke="none"/><path d="${bill}"/>` }
      };
    }
};
