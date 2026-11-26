// Surgical-precision icon module: fdsi-esports-gamepad (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, capsule, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "esports-gamepad",
  slug: "esports-gamepad",
  name: "Pro Esports Gamepad (4-Circle Tangent Horn Construction)",
  area: "sb",
  order: 218,
  desc: "FIXED: Built from 2 circular face lobes C_L(6.8, 10.8, R=4.0) & C_R(17.2, 10.8, R=4.0) tangent into 2 rounded grip horns C_HL(5.0, 17.0, r=2.1) & C_HR(19.0, 17.0, r=2.1).",
  meta: {
      "slug": "esports-gamepad",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "CS2, League of Legends, Dota 2, EA FC, and competitive Esports betting.",
      "tags": [
          "esports",
          "gaming",
          "gamepad",
          "controller",
          "cs2",
          "lol",
          "dota",
          "virtuals"
      ]
  },
  build: () => {
      // Exact circular-arc gamepad silhouette:
      // Top deck (6.8, 6.8) -> (17.2, 6.8)
      // Right shoulder arc (R=4.0) around (17.2, 10.8) to (21.1, 11.6)
      // Outer right tangent down to right horn tip (21.0, 17.4), horn tip arc (R=2.1) to (16.9, 17.8)
      // Inner right horn up to bridge (14.6, 14.2), flat/arched center bridge to (9.4, 14.2)
      // Symmetric left horn & left shoulder arc back to (6.8, 6.8)!
      const pad =
        `M6.8 6.8H17.2` +
        `A4.0 4.0 0 0 1 21.1 11.6` +          // right shoulder circular lobe (R=4.0)
        `L21.0 17.2` +                        // outer right grip tangent
        `A2.1 2.1 0 0 1 16.9 17.8` +          // right grip horn rounded tip (R=2.1)
        `L14.8 14.2` +                        // inner right horn
        `H9.2` +                              // center bridge
        `L7.1 17.8` +                         // inner left horn
        `A2.1 2.1 0 0 1 3.0 17.2` +           // left grip horn rounded tip (R=2.1)
        `L2.9 11.6` +                         // outer left grip tangent
        `A4.0 4.0 0 0 1 6.8 6.8Z`;            // left shoulder circular lobe (R=4.0)
      // D-pad centered at left lobe center (7.0, 10.8); buttons centered at right lobe (16.0, 11.8) & (18.2, 9.6)!
      const dpad = `M7.0 9.0V12.6M5.2 10.8H8.8`;
      const b1 = circleD(16.0, 11.8, 1.0), b2 = circleD(18.2, 9.6, 1.0);
      const holes = [
        capsule([7.0, 9.0], [7.0, 12.6], 1.4), capsule([5.2, 10.8], [8.8, 10.8], 1.4),
        circleD(16.0, 11.8, 1.2), circleD(18.2, 9.6, 1.2)
      ];
      return {
        keylines: drawKeylines([[6.8, 10.8, 4.0], [17.2, 10.8, 4.0], [5.0, 17.0, 2.1], [19.0, 17.0, 2.1]], [[6.8, 6.8], [17.2, 6.8], [14.8, 14.2], [9.2, 14.2]]),
        line: `<path d="${pad}"/><path d="${dpad}"/><path d="${b1}" fill="currentColor" stroke="none"/><path d="${b2}" fill="currentColor" stroke="none"/>`,
        solid: { fill: [pad], holeExact: holes },
        duotone: { tone: [pad], secondary: [dpad], line: `<path d="${pad}"/><path d="${b1}" fill="currentColor" stroke="none"/><path d="${b2}" fill="currentColor" stroke="none"/>` }
      };
    }
};
