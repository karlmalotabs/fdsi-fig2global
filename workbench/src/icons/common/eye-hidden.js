// Surgical-precision icon module: fdsi-eye-hidden (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-a-10-eye-hidden",
  slug: "eye-hidden",
  name: "#10. Eye Off / Hide Balance (Ogive Eye + Bold 45° Privacy Slash with Contour Knockout)",
  area: "common",
  order: 43,
  desc: "Almond eye contour + iris + bold 45° privacy slash (M4.2 4.2 L19.8 19.8) with organic capsule mask so the slash cuts cleanly across the eye.",
  meta: {
      "slug": "eye-hidden",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Hide wallet balance, mask password input, or enable privacy mode.",
      "tags": [
          "eye",
          "hide",
          "hidden",
          "mask",
          "invisible",
          "private",
          "balance",
          "password"
      ]
  },
  build: ({ s }) => {
      const eye = `M2.4 12.0A10.4 10.4 0 0 1 21.6 12.0A10.4 10.4 0 0 1 2.4 12.0Z`;
      const pupil = circleD(12.0, 12.0, 3.0);
      const slash = `M4.2 4.2L19.8 19.8`;
      const slashMask = capsule(3.8, 3.8, 20.2, 20.2, s * 1.35);
      const uidE = "eh6_" + (nextUid());
      const lineM = `<defs><mask id="${uidE}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${slashMask}" fill="#000"/></mask></defs>` +
                    `<path d="${eye}" mask="url(#${uidE})"/><path d="${pupil}" mask="url(#${uidE})"/><path d="${slash}"/>`;
      return {
        keylines: drawKeylines([[12, 12, 3.0]], [[4.2, 4.2], [19.8, 19.8], [2.4, 12], [21.6, 12]]),
        line: lineM,
        solid: {
          fill: [eye],
          holeExact: [circleD(12.0, 12.0, 3.6), slashMask],
          stroke: [slash]
        },
        duotone: { tone: [eye], secondary: [slash], line: lineM }
      };
    }
};
