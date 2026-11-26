// Surgical-precision icon module: fdsi-plus (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-85-plus-add",
  slug: "plus",
  name: "#85. Plus / Add (Compact 12×12 Zone Orthogonal Cross)",
  area: "common",
  order: 118,
  desc: "Orthogonal 11×11px plus cross centered at (12, 12) (M12.0 6.5 V17.5 M6.5 12.0 H17.5).",
  meta: {
      "slug": "plus",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Add selection to betslip, increase stake amount, or create a new item.",
      "tags": [
          "plus",
          "add",
          "new",
          "create",
          "increase",
          "increment",
          "expand"
      ]
  },
  build: () => {
      const plus = `M12.0 6.5V17.5M6.5 12.0H17.5`;
      return {
        keylines: drawKeylines([[12, 12, 5.5]], [[12, 6.5], [12, 17.5], [6.5, 12], [17.5, 12]]),
        line: `<path d="${plus}"/>`,
        solid: { stroke: [plus] },
        duotone: { secondary: [plus], line: `<path d="M12.0 6.5V17.5"/>` }
      };
    }
};
