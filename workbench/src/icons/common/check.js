// Surgical-precision icon module: fdsi-check (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { roundOpen, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-87-check-tick",
  slug: "check",
  name: "#87. Checkmark / Confirmation Tick (Compact 14×14 Zone)",
  area: "common",
  order: 120,
  desc: "Crisp 45°/50° confirmation tick (M5.5 12.5 L10.0 17.0 L18.5 7.5) with soft corner fillet at (10.0, 17.0).",
  meta: {
      "slug": "check",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Confirm selection, indicate completed state, or verify valid input.",
      "tags": [
          "check",
          "tick",
          "confirm",
          "done",
          "valid",
          "success",
          "complete",
          "selected"
      ]
  },
  build: ({ r }) => {
      const chk = roundOpen([[5.5, 12.5], [10.0, 17.0], [18.5, 7.5]], Math.min(r * 0.35, 0.7));
      return {
        keylines: drawKeylines([[12, 12, 6.5]], [[5.5, 12.5], [10.0, 17.0], [18.5, 7.5]]),
        line: `<path d="${chk}"/>`,
        solid: { stroke: [chk] },
        duotone: { secondary: [chk], line: `<path d="${chk}"/>` }
      };
    }
};
