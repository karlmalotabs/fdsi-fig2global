// Surgical-precision icon module: fdsi-bracket-tree (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-130-bracket-tree",
  slug: "bracket-tree",
  name: "#130. Knockout Tournament Bracket (2 Seed Pairings Converging to Final Winner Node)",
  area: "sb",
  order: 163,
  desc: "Left top bracket (y=4.2..9.4) and bottom bracket (y=14.6..19.8) converging via semifinal bridge (x=10.6..16.2) into a bold championship node at (18.8, 12.0, r=2.2).",
  meta: {
      "slug": "bracket-tree",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Knockout tournament bracket predictor, path to the final, and playoffs.",
      "tags": [
          "bracket",
          "tournament",
          "knockout",
          "playoffs",
          "draw",
          "tree"
      ]
  },
  build: () => {
      const tree =
        `M3.6 4.4H9.6V9.6H3.6` +
        `M3.6 14.4H9.6V19.6H3.6` +
        `M9.6 7.0H14.0V17.0H9.6` +
        `M14.0 12.0H16.6`;
      const finalNode = circleD(18.8, 12.0, 2.2);
      const finalSolid = circleD(18.8, 12.0, 2.6);
      return {
        keylines: drawKeylines([[18.8, 12.0, 2.2]], [[9.6, 7.0], [9.6, 17.0], [14.0, 12.0], [18.8, 12.0]]),
        line: `<path d="${tree}"/><path d="${finalNode}"/>`,
        solid: {
          face: [finalSolid],
          stroke: [tree]
        },
        duotone: { tone: [finalSolid], secondary: [tree], line: `<path d="${tree}"/><path d="${finalNode}"/>` }
      };
    }
};
