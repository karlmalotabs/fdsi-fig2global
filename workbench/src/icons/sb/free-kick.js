// Surgical-precision icon module: fdsi-free-kick (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-122-free-kick",
  slug: "free-kick",
  name: "#122. Free Kick / Curling Shot (Ball at Bottom-Left + Curling Arc Over 2-Pillar Wall to Top-Right)",
  area: "sb",
  order: 155,
  desc: "Football at bottom-left (5.8, 17.8, r=2.6) + sweeping trajectory arc curling over 2 defender wall pillars (x=13.6, 18.2) to top-right arrowhead (19.6, 4.6)!",
  meta: {
      "slug": "free-kick",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Direct free-kick goal, set-piece specials, and shot outside the box.",
      "tags": [
          "free-kick",
          "set-piece",
          "wall",
          "curling-shot",
          "football",
          "goal"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.4, 0.85);
      const ball = circleD(5.8, 17.8, 2.6);
      const ballSolid = circleD(5.8, 17.8, 2.9);
      // Curling free-kick trajectory from (5.8, 13.4) up and right to (19.4, 4.8) with arrowhead:
      const traj = `M5.8 13.2C5.8 6.8 11.4 4.8 19.4 4.8M16.2 2.4L19.6 4.8L16.2 7.2`;
      // 2 separate padded defender wall pillars at bottom-right (x=12.4..15.6 and x=17.2..20.4, y=11.4..20.4):
      const p1 = bloatRect({ x: 12.4, y: 11.4, w: 3.2, h: 9.0, r: cr, b: b * 0.25 });
      const p2 = bloatRect({ x: 17.2, y: 11.4, w: 3.2, h: 9.0, r: cr, b: b * 0.25 });
      return {
        keylines: drawKeylines([[5.8, 17.8, 2.6]], [[19.6, 4.8], ...p1.anchors, ...p2.anchors]),
        line: `<path d="${ball}"/><path d="${traj}"/><path d="${p1.d}"/><path d="${p2.d}"/>`,
        solid: {
          face: [ballSolid, p1.d, p2.d],
          stroke: [traj]
        },
        duotone: { tone: [ball, p1.d, p2.d], secondary: [traj], line: `<path d="${ball}"/><path d="${traj}"/><path d="${p1.d}"/><path d="${p2.d}"/>` }
      };
    }
};
