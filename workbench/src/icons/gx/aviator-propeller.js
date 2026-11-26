// Surgical-precision icon module: fdsi-aviator-propeller (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d2-150-aviator-prop",
  slug: "aviator-propeller",
  name: "#150. Aviator Propeller (3 Separate Padded Shapes — Center Spinner Hub + 2 Tapered Blades)",
  area: "gx",
  order: 183,
  desc: "Iconic Aviator game propeller: Center spinner hub circle (12, 12, r=2.2) + 2 symmetrical 45° `tangentHull2` tapered propeller blades at Bottom-Left & Top-Right!",
  meta: {
      "slug": "aviator-propeller",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Spinning aircraft propeller icon for Aviator and flight crash games.",
      "tags": [
          "aviator",
          "propeller",
          "plane",
          "flight",
          "crash",
          "spin",
          "blades"
      ]
  },
  build: () => {
      const hub = circleD(12.0, 12.0, 2.1);
      const hubSolid = circleD(12.0, 12.0, 2.3);
      // 2 tapered propeller blades along 45° axis using tangentHull2 (separated from hub by a clean gap in Solid!):
      const bladeTR = tangentHull2([14.4, 9.6], 1.1, [18.8, 5.2], 2.2);
      const bladeBL = tangentHull2([9.6, 14.4], 1.1, [5.2, 18.8], 2.2);
      const bladeTR_S = tangentHull2([15.2, 8.8], 1.15, [19.0, 5.0], 2.3);
      const bladeBL_S = tangentHull2([8.8, 15.2], 1.15, [5.0, 19.0], 2.3);
      // Motion arc ticks at top-left and bottom-right:
      const spinArcs = `${arcPath(12, 12, 8.8, 195, 255)}${arcPath(12, 12, 8.8, 15, 75)}`;
      return {
        keylines: drawKeylines([[12, 12, 2.1], [18.8, 5.2, 2.2], [5.2, 18.8, 2.2]], [[12, 12]]),
        line: `<path d="${hub}"/><path d="${bladeTR.d}"/><path d="${bladeBL.d}"/><path d="${spinArcs}"/>`,
        solid: {
          face: [hubSolid, bladeTR_S.d, bladeBL_S.d],
          stroke: [spinArcs]
        },
        duotone: {
          tone: [bladeTR.d, bladeBL.d],
          secondary: [hub, spinArcs],
          line: `<path d="${hub}"/><path d="${bladeTR.d}"/><path d="${bladeBL.d}"/><path d="${spinArcs}"/>`
        }
      };
    }
};
