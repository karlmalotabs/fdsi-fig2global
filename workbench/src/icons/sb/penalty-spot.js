// Surgical-precision icon module: fdsi-penalty-spot (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-c2-121-penalty-spot",
  slug: "penalty-spot",
  name: "#121. Penalty Kick Spot (Goalpost Arch in Background + Football on Foreground Penalty Spot)",
  area: "sb",
  order: 154,
  desc: "Wide goalpost arch (x=3.0..21.0, y=4.0..15.2) with recessed net crossbar + foreground football (cx=12.0, cy=16.8, R=3.6) sitting on the penalty spot!",
  meta: {
      "slug": "penalty-spot",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Penalty kick awarded, penalty shootout winner, and spot-kick conversion.",
      "tags": [
          "penalty",
          "spot-kick",
          "shootout",
          "goal",
          "football",
          "12-yards"
      ]
  },
  build: () => {
      const goalArch = `M3.0 15.2V5.6A1.6 1.6 0 0 1 4.6 4.0H19.4A1.6 1.6 0 0 1 21.0 5.6V15.2`;
      const goalNet  = `M3.0 9.6H21.0M9.0 4.0V15.2M15.0 4.0V15.2`;
      const ball = circleD(12.0, 16.8, 3.6);
      const ballSolid = circleD(12.0, 16.8, 3.8);
      const ballHalo = circleD(12.0, 16.8, 5.2);
      const uidPk = "pk6_" + (nextUid());
      const lineM = `<defs><mask id="${uidPk}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${ballHalo}" fill="#000"/></mask></defs>` +
                    `<g mask="url(#${uidPk})"><path d="${goalNet}"/><path d="${goalArch}"/></g><path d="${ball}"/>`;
      return {
        keylines: drawKeylines([[12, 16.8, 3.6]], [[3.0, 4.0], [21.0, 4.0], [3.0, 15.2], [21.0, 15.2]]),
        line: lineM,
        solid: {
          face: [ballSolid],
          stroke: [goalArch, `M3.0 9.6H21.0M9.0 4.0V11.2M15.0 4.0V11.2`]
        },
        duotone: { tone: [`M3.0 4.0H21.0V15.2H3.0Z`, ball], secondary: [goalNet], line: lineM }
      };
    }
};
