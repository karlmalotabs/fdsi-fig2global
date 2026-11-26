// Surgical-precision icon module: fdsi-match-substitution (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatPoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-47-match-substitution",
  slug: "match-substitution",
  name: "#47. Player Substitution (Plump Rounded Solid Arrows — Soft Filleted Tips & Wings)",
  area: "sb",
  order: 80,
  desc: "FIXED SHARP SOLID ARROWS: Uses `bloatPoly` + full `fill` (`stroke-linejoin=round`) so the arrow tips, wing corners, and shaft bases have plush ~1.4px rounded fillets!",
  meta: {
      "slug": "match-substitution",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Player substitution markets and Super Sub rollover (bet carries over to sub).",
      "tags": [
          "substitution",
          "sub",
          "super-sub",
          "player-on",
          "player-off",
          "arrows"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.45, 0.85);
      const upLine = `M7.6 20.2V4.0M3.6 8.2L7.6 3.8L11.6 8.2`;
      const dnLine = `M16.4 3.8V20.0M12.4 15.8L16.4 20.2L20.4 15.8`;
      // Solid mode: Inset arrow cores rendered in `fill` (`stroke-linejoin="round"` adds +s/2 = 0.88px circular radius to every corner!)
      const upCore = bloatPoly([
        [7.5, 4.3], [11.3, 8.5], [8.3, 8.5], [8.3, 19.4], [6.7, 19.4], [6.7, 8.5], [3.7, 8.5]
      ], [cr, 0.55, 0.2, 0.55, 0.55, 0.2, 0.55], b * 0.2, { minEdge: 1.2 });
      const dnCore = bloatPoly([
        [16.5, 19.7], [20.3, 15.5], [17.3, 15.5], [17.3, 4.6], [15.7, 4.6], [15.7, 15.5], [12.7, 15.5]
      ], [cr, 0.55, 0.2, 0.55, 0.55, 0.2, 0.55], b * 0.2, { minEdge: 1.2 });
      return {
        keylines: drawKeylines([], [[7.6, 3.8], [7.6, 20.2], [16.4, 3.8], [16.4, 20.2]]),
        line: `<path d="${upLine}"/><path d="${dnLine}"/>`,
        solid: { fill: [upCore.d, dnCore.d] },
        duotone: { tone: [upCore.d], secondary: [dnLine], line: `<path d="${upLine}"/><path d="${dnLine}"/>` }
      };
    }
};
