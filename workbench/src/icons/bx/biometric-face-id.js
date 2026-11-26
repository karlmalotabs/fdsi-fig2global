// Surgical-precision icon module: fdsi-biometric-face-id (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-98-face-id",
  slug: "biometric-face-id",
  name: "#98. Biometric Face ID (4 Scanner Corner Brackets + Eyes, L-Nose & Smile)",
  area: "bx",
  order: 131,
  desc: "4 rounded scanner viewfinder brackets at (3.6..20.4, 3.6..20.4) framing a clean biometric face: 2 vertical eye ticks, center L-nose, and curved smile arc.",
  meta: {
      "slug": "biometric-face-id",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Biometric Face ID authentication for instant secure login and withdrawals.",
      "tags": [
          "face-id",
          "biometric",
          "scan",
          "authentication",
          "login",
          "security",
          "face"
      ]
  },
  build: () => {
      const corners =
        `M3.6 8.2V5.4A1.8 1.8 0 0 1 5.4 3.6H8.2` +
        `M15.8 3.6H18.6A1.8 1.8 0 0 1 20.4 5.4V8.2` +
        `M20.4 15.8V18.6A1.8 1.8 0 0 1 18.6 20.4H15.8` +
        `M8.2 20.4H5.4A1.8 1.8 0 0 1 3.6 18.6V15.8`;
      const face = `M8.6 8.8V10.4M15.4 8.8V10.4M12.0 8.8V12.6H10.8M9.2 15.6A4.2 4.2 0 0 0 14.8 15.6`;
      const bg = bloatRect({ x: 3.6, y: 3.6, w: 16.8, h: 16.8, r: 2.2, b: 0.25 });
      return {
        keylines: drawKeylines([], [[3.6, 3.6], [20.4, 3.6], [20.4, 20.4], [3.6, 20.4], [12, 12.6]]),
        line: `<path d="${corners}"/><path d="${face}"/>`,
        solid: {
          fill: [bg.d],
          cut: [face]
        },
        duotone: { tone: [bg.d], secondary: [face], line: `<path d="${corners}"/><path d="${face}"/>` }
      };
    }
};
