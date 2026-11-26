// Surgical-precision icon module: fdsi-goal-posts (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { bloatRect, facePoly, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c-49-goal-posts",
  slug: "goal-posts",
  name: "#49. 3D Football Goal Net / Score (Solid Matches Line 1:1 — Pure Linear Wireframe Net)",
  area: "sb",
  order: 82,
  desc: "FIXED SOLID: Because a 3D goal net is a pure open wireframe structure (front posts, 4 diagonal depth struts, and rear net mesh), Solid renders the exact same crisp linear geometry as Line!",
  meta: {
      "slug": "goal-posts",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Total goals, over/under goals, both teams to score (BTTS), and correct score.",
      "tags": [
          "goal",
          "net",
          "score",
          "btts",
          "over-under",
          "goalposts",
          "football"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.55, 1.3);
      const frontArch = `M2.8 19.8V6.2A1.4 1.4 0 0 1 4.2 4.8H19.8A1.4 1.4 0 0 1 21.2 6.2V19.8`;
      const backBox = bloatRect({ x: 6.4, y: 8.4, w: 11.2, h: 8.6, r: cr * 0.7, b: b * 0.2 });
      const depthStruts = `M3.3 5.3L6.6 8.6M20.7 5.3L17.4 8.6M2.8 19.8L6.6 16.8M21.2 19.8L17.4 16.8`;
      const netMesh = `M10.1 8.4V17.0M13.9 8.4V17.0M6.4 12.7H17.6`;
      const topRoof = facePoly(
        [[2.8, 4.8], [21.2, 4.8], [17.4, 8.6], [6.6, 8.6]],
        { offset: 0, r: 0.5, bulge: 0 }
      );
      return {
        keylines: drawKeylines([], [[2.8, 4.8], [21.2, 4.8], [6.4, 8.4], [17.6, 8.4], [6.4, 17.0], [17.6, 17.0]]),
        line: `<path d="${backBox.d}"/><path d="${netMesh}"/><path d="${depthStruts}"/><path d="${frontArch}"/>`,
        solid: {
          stroke: [backBox.d, netMesh, depthStruts, frontArch]
        },
        duotone: {
          tone: [backBox.d, topRoof],
          secondary: [netMesh, depthStruts],
          line: `<path d="${backBox.d}"/><path d="${netMesh}"/><path d="${depthStruts}"/><path d="${frontArch}"/>`
        }
      };
    }
};
