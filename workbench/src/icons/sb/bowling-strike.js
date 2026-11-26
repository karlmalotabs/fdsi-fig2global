// Surgical-precision icon module: fdsi-bowling-strike (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-b-36-bowling-strike",
  slug: "bowling-strike",
  name: "#36. Bowling Pin & Ball (Larger Bold r=1.05 Finger Holes in Line & Solid!)",
  area: "sb",
  order: 69,
  desc: "FIXED FINGER HOLES: Increased the 3 bowling ball finger holes from r=0.65 to bold r=1.05 (2.1px diameter) and punched them into the Solid ball too!",
  meta: {
      "slug": "bowling-strike",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "PBA ten-pin bowling strike and tournament outright markets.",
      "tags": [
          "bowling",
          "ten-pin",
          "pin",
          "ball",
          "strike",
          "alley"
      ]
  },
  build: () => {
      const pin =
        `M9.0 3.0` +
        `A2.3 2.3 0 0 1 11.3 5.3` +
        `C11.3 6.8 10.4 7.8 10.6 9.4` +
        `C10.8 11.0 13.0 12.8 13.0 15.6` +
        `C13.0 18.0 11.8 19.6 10.8 20.2` +
        `H7.2` +
        `C6.2 19.6 5.0 18.0 5.0 15.6` +
        `C5.0 12.8 7.2 11.0 7.4 9.4` +
        `C7.6 7.8 6.7 6.8 6.7 5.3` +
        `A2.3 2.3 0 0 1 9.0 3.0Z`;
      const stripe = `M7.3 8.8H10.7`;
      const stripeHole = capsule(7.1, 8.8, 10.9, 8.8, 0.9);
      const ball = circleD(16.4, 15.6, 4.8);
      const ballHalo = circleD(16.4, 15.6, 6.3);
      // 3 bold, clearly visible finger holes (r=1.05 -> 2.1px diameter each!):
      const h1 = circleD(14.8, 13.8, 1.05);
      const h2 = circleD(17.5, 14.2, 1.05);
      const h3 = circleD(15.6, 16.5, 1.05);
      const holes = `${h1}${h2}${h3}`;
      // In Solid mode, combine `ball` and `holes` in one evenodd path in `over` so the 3 bold finger holes are punched out of the solid bowling ball too!
      const ballSolidWithHoles = `${ball}${holes}`;
      const uidBw = "bw6_" + (nextUid());
      const lineM = `<defs><mask id="${uidBw}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${ball}" fill="#000"/></mask></defs>` +
                    `<path d="${pin}" mask="url(#${uidBw})"/><path d="${stripe}"/><path d="${ball}"/><path d="${holes}" fill="currentColor" stroke="none"/>`;
      return {
        keylines: drawKeylines([[9.0, 5.3, 2.3], [9.0, 15.6, 4.0], [16.4, 15.6, 4.8]], [[14.8, 13.8], [17.5, 14.2], [15.6, 16.5]]),
        line: lineM,
        solid: {
          fill: [pin],
          holeExact: [stripeHole, ballHalo],
          over: [ballSolidWithHoles]
        },
        duotone: { tone: [pin], secondary: [ball, stripe], line: lineM }
      };
    }
};
