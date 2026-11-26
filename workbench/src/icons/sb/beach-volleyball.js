// Surgical-precision icon module: fdsi-beach-volleyball (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-b2-120-beach-volleyball",
  slug: "beach-volleyball",
  name: "#120. Beach Volleyball (Volleyball Flying Over Full-Width Net & Posts!)",
  area: "sb",
  order: 153,
  desc: "REBUILT WITH BALL + NET: Volleyball (cx=12.0, cy=6.6, R=3.6 with Y-seams) soaring over a full-width beach volleyball net (x=3.2..20.8, y=12.6..18.6) and side posts!",
  meta: {
      "slug": "beach-volleyball",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "FIVB Pro Tour and Olympic 2-on-2 beach volleyball markets.",
      "tags": [
          "beach-volleyball",
          "net",
          "ball",
          "sand",
          "fivb",
          "olympic"
      ]
  },
  build: () => {
      const ball = circleD(12.0, 6.6, 3.6);
      const ballSolid = circleD(12.0, 6.6, 3.8);
      const ballSeams = `M12.0 6.6V3.0M12.0 6.6L15.1 8.4M12.0 6.6L8.9 8.4`;
      const netFrame = `M3.2 11.8V20.6M20.8 11.8V20.6M3.2 12.8H20.8M3.2 18.4H20.8`;
      const netMesh  = `M3.2 15.6H20.8M7.6 12.8V18.4M12.0 12.8V18.4M16.4 12.8V18.4`;
      const netBox   = `M3.2 12.8H20.8V18.4H3.2Z`;
      return {
        keylines: drawKeylines([[12, 6.6, 3.6]], [[3.2, 12.8], [20.8, 12.8], [3.2, 18.4], [20.8, 18.4]]),
        line: `<path d="${ball}"/><path d="${ballSeams}"/><path d="${netFrame}"/><path d="${netMesh}"/>`,
        solid: {
          fill: [ballSolid],
          cut: [ballSeams],
          stroke: [netFrame, netMesh]
        },
        duotone: {
          tone: [ball, netBox],
          secondary: [ballSeams, netMesh],
          line: `<path d="${ball}"/><path d="${ballSeams}"/><path d="${netFrame}"/><path d="${netMesh}"/>`
        }
      };
    }
};
