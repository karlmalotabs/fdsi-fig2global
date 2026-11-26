// Surgical-precision icon module: fdsi-greyhound-bust (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "greyhound-bust",
  slug: "greyhound-bust",
  name: "Horse Racing & Jockey (Muscular Neck Throat + Equal 2.6px Parallel Far-Leg Spacing)",
  area: "sb",
  order: 195,
  desc: "REFINED: Smooth muscular throat curve + identical 2.6px parallel spacing between each primary leg and its short far-side leg tick + crouched jockey.",
  meta: {
      "slug": "greyhound-bust",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Greyhound racing portrait mark for dog track cards and specials.",
      "tags": [
          "greyhound",
          "dog-racing",
          "sighthound",
          "whippet",
          "bust",
          "track"
      ]
  },
  build: () => {
      const horseTorso =
        `M5.8 10.4` +
        `Q9.8 9.8 13.4 10.0` +
        `A8.5 8.5 0 0 1 16.8 5.6` +
        `L17.8 4.0L18.6 5.8` +
        `L21.5 8.0A1.0 1.0 0 0 1 20.4 9.8` +
        `L17.4 9.6` +
        `Q15.8 11.2 15.6 14.0` +                // smooth muscular throat into chest
        `C13.5 15.4 9.0 15.4 6.2 14.2` +
        `A2.0 2.0 0 0 1 5.8 10.4Z`;
      const hindThigh = tangentHull2([7.0, 13.0], 2.1, [4.6, 16.2], 0.85);
      const nearHind = `M4.6 16.2L2.5 18.8`;
      const nearFore = roundOpen([[14.8, 14.0], [17.0, 16.6], [18.4, 18.4]], 1.4);
      const farFore = `M12.6 16.0L13.9 17.7`;
      const farHind = `M7.2 16.4L5.9 18.1`;
      const tail = `M5.2 11.4A4.0 4.0 0 0 0 2.0 14.2`;
      const jHead = circleD(11.8, 4.2, 1.75);
      const jSpine = roundOpen([[7.8, 8.2], [9.5, 6.8], [13.8, 7.6]], 1.2);
      return {
        keylines: drawKeylines([[11.8, 4.2, 1.75], [7.0, 13.0, 2.1], [4.6, 16.2, 0.85]], [[12.6, 16.0], [7.2, 16.4]]),
        line: `<path d="${jHead}"/><path d="${jSpine}" stroke-width="1.85"/><path d="${horseTorso}" fill="currentColor" stroke="none"/><path d="${hindThigh.d}" fill="currentColor" stroke="none"/><path d="${nearFore}"/><path d="${nearHind}"/><path d="${farFore}"/><path d="${farHind}"/><path d="${tail}"/>`,
        solid: {
          fill: [jHead],
          face: [horseTorso, hindThigh.d],
          tubes: [
            [jSpine, 1.95],
            [nearFore, 1.8], [nearHind, 1.75],
            [farFore, 1.55], [farHind, 1.55],
            [tail, 1.6]
          ]
        },
        duotone: {
          tone: [horseTorso, hindThigh.d, jHead],
          secondary: [farFore, farHind, tail],
          line: `<path d="${jHead}"/><path d="${jSpine}" stroke-width="1.85"/><path d="${horseTorso}"/><path d="${hindThigh.d}" fill="currentColor" stroke="none"/><path d="${nearFore}"/><path d="${nearHind}"/>`
        }
      };
    }
};
