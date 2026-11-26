// Surgical-precision icon module: fdsi-greyhound-sprint (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "greyhound-coursing",
  slug: "greyhound-sprint",
  name: "Sprinting Greyhound (Athlete-Pictogram Arc Hull + Soft-Joint Limbs)",
  area: "sb",
  order: 196,
  desc: "FIXED (Uses the Proven Athlete Pictogram Architecture): Intersecting circular-arc sighthound torso (deep brisket + whippet waist tuck) + roundOpen extension legs & whip tail.",
  meta: {
      "slug": "greyhound-sprint",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Live greyhound track racing win, forecast, and tricast markets.",
      "tags": [
          "greyhound",
          "dog-racing",
          "sprint",
          "hound",
          "coursing",
          "tricast"
      ]
  },
  build: () => {
      // Sleek sighthound head + arched spine + deep brisket + dramatic whippet waist tuck built from pure circular arcs:
      const torso =
        `M6.0 10.5` +
        `A9.5 9.5 0 0 1 14.8 9.2` +           // arched sighthound spine (R=9.5 arc)
        `L16.5 5.8L15.2 4.5L17.8 4.8` +       // slender neck & swept ear
        `L21.2 6.8A1.0 1.0 0 0 1 20.2 8.6` +  // pointed sighthound snout
        `L17.5 8.4L16.2 12.2` +               // throat into chest
        `A3.5 3.5 0 0 1 11.8 13.0` +          // deep round brisket chest (R=3.5 arc)
        `A4.2 4.2 0 0 0 6.8 12.2` +           // dramatic whippet abdominal waist tuck (R=4.2 concave arc)!
        `A1.5 1.5 0 0 1 6.0 10.5Z`;
      // Smooth roundOpen extension legs (just like road-cycling & sprint!) + curved whip tail:
      const frontLeg = roundOpen([[14.8, 12.4], [18.2, 15.2], [21.2, 14.8]], 1.4);
      const hindLeg = roundOpen([[6.8, 11.8], [4.2, 15.2], [2.2, 16.5]], 1.4);
      const tail = `M6.0 10.5A4.5 4.5 0 0 1 2.2 7.5`;
      return {
        keylines: drawKeylines([[14.0, 11.2, 3.5], [9.2, 14.2, 4.2]], [[6.0, 10.5], [14.8, 9.2], [21.2, 6.8], [11.8, 13.0]]),
        line: `<path d="${torso}" fill="currentColor" stroke="none"/><path d="${frontLeg}"/><path d="${hindLeg}"/><path d="${tail}"/>`,
        solid: {
          face: [torso],
          tubes: [[frontLeg, 1.85], [hindLeg, 1.85], [tail, 1.6]]
        },
        duotone: {
          tone: [torso],
          secondary: [frontLeg, hindLeg, tail],
          line: `<path d="${torso}"/><path d="${frontLeg}"/><path d="${hindLeg}"/><path d="${tail}"/>`
        }
      };
    }
};
