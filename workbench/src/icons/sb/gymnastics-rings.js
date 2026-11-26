// Surgical-precision icon module: fdsi-gymnastics-rings (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, tangentHull2, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-107-gymnastics-rings",
  slug: "gymnastics-rings",
  name: "#107. Artistic Gymnastics (Stick-Figure Gymnast in Iron Cross on Hanging Rings!)",
  area: "sb",
  order: 140,
  desc: "REBUILT WITH STICK FIGURE + HANGING RINGS: Gymnast (hollow head in Line, solid head in Solid, `tangentHull2` torso + vertical legs) holding 2 suspended gymnastics rings in an Iron Cross!",
  meta: {
      "slug": "gymnastics-rings",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Artistic gymnastics all-around and apparatus medal markets.",
      "tags": [
          "gymnastics",
          "rings",
          "iron-cross",
          "athlete",
          "artistic",
          "olympic"
      ]
  },
  build: () => {
      // 2 hanging straps from y=2.8 to rings at (5.0, 9.8, r=1.9) and (19.0, 9.8, r=1.9):
      const straps = `M5.0 2.8V7.9M19.0 2.8V7.9`;
      const ringL = circleD(5.0, 9.8, 1.9);
      const ringR = circleD(19.0, 9.8, 1.9);
      // Stick-figure gymnast in Iron Cross pose:
      const headLine = circleD(12.0, 7.2, 2.05);
      const headSolid = circleD(12.0, 7.2, 2.3);
      const torso = tangentHull2([12.0, 11.4], 1.75, [12.0, 15.8], 1.15);
      const arms = `M6.9 10.8L10.4 11.4M13.6 11.4L17.1 10.8`;
      const legs = `M11.1 15.8L10.6 20.6M12.9 15.8L13.4 20.6`;
      return {
        keylines: drawKeylines([[12, 7.2, 2.05], [5.0, 9.8, 1.9], [19.0, 9.8, 1.9], [12, 11.4, 1.75]], [[5.0, 2.8], [19.0, 2.8], [12, 20.6]]),
        line: `<path d="${straps}"/><path d="${ringL}"/><path d="${ringR}"/><path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${arms}"/><path d="${legs}"/>`,
        solid: {
          face: [headSolid, torso.d],
          stroke: [straps, ringL, ringR, arms, legs]
        },
        duotone: {
          tone: [torso.d, ringL, ringR],
          secondary: [straps, arms],
          line: `<path d="${straps}"/><path d="${ringL}"/><path d="${ringR}"/><path d="${headLine}"/><path d="${torso.d}" fill="currentColor" stroke="none"/><path d="${arms}"/><path d="${legs}"/>`
        }
      };
    }
};
