// Surgical-precision icon module: fdsi-fencing-sabres (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { capsule, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b2-106-fencing-sabres",
  slug: "fencing-sabres",
  name: "#106. Fencing Crossed Sabres (2 Crossed 45° Blades + Hemispherical Bell Guards + Over/Under Mask)",
  area: "sb",
  order: 139,
  desc: "2 crossed 45° fencing foils/sabres from bottom-corners to top-corners (3.8..20.2) with hemispherical bell guards at (7.4, 16.6) and (16.6, 16.6).",
  meta: {
      "slug": "fencing-sabres",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Olympic foil, épée, and sabre fencing bout and medal markets.",
      "tags": [
          "fencing",
          "sabres",
          "foils",
          "epee",
          "swords",
          "crossed",
          "olympic"
      ]
  },
  build: ({ s }) => {
      // Sabre 1 (bottom-left (3.6, 20.4) to top-right (20.2, 3.8)) with bell guard centered at (7.2, 16.8):
      const blade1 = `M3.6 20.4L20.2 3.8`;
      const guard1 = `M5.2 14.8A2.8 2.8 0 0 1 9.2 18.8Z`;
      // Sabre 2 (bottom-right (20.4, 20.4) to top-left (3.8, 3.8)) with bell guard centered at (16.8, 16.8):
      const blade2 = `M20.4 20.4L3.8 3.8`;
      const guard2 = `M14.8 18.8A2.8 2.8 0 0 1 18.8 14.8Z`;
      // Mask blade2 where blade1 crosses over at center (12, 12):
      const crossMask = capsule(9.5, 14.5, 14.5, 9.5, s * 1.3);
      const uidFc = "fc6_" + (nextUid());
      const lineM = `<defs><mask id="${uidFc}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${crossMask}" fill="#000"/></mask></defs>` +
                    `<path d="${blade2}" mask="url(#${uidFc})"/><path d="${guard2}"/>` +
                    `<path d="${blade1}"/><path d="${guard1}"/>`;
      return {
        keylines: drawKeylines([[7.2, 16.8, 2.8], [16.8, 16.8, 2.8]], [[3.8, 3.8], [20.2, 3.8], [12, 12]]),
        line: lineM,
        solid: {
          fill: [guard1, guard2],
          stroke: [blade1, `M20.4 20.4L14.2 14.2M9.8 9.8L3.8 3.8`]
        },
        duotone: { tone: [guard1, guard2], secondary: [blade1, blade2], line: lineM }
      };
    }
};
