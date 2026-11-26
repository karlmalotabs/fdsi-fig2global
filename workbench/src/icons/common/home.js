// Surgical-precision icon module: fdsi-home (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, bloatPoly, edgeY, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-nav-home",
  slug: "home",
  name: "Navigation Home (5-Vertex House + Arch Door)",
  area: "common",
  order: 11,
  desc: "5-vertex bloated house with the arched doorway locked to the bloated bottom floor via edgeY and punched in Solid.",
  meta: {
      "slug": "home",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Return to the main lobby, home screen, or primary dashboard.",
      "tags": [
          "home",
          "house",
          "lobby",
          "main",
          "start",
          "dashboard",
          "navigation"
      ],
      "status": "approved"
  },
  build: ({ b, r }) => {
      const H = bloatPoly([[12, 3.2], [20.2, 10.0], [20.2, 20.2], [3.8, 20.2], [3.8, 10.0]], Math.min(r, 2.0), b);
      const yL = edgeY(H.poly, 9.6, "bottom"), yR = edgeY(H.poly, 14.4, "bottom");
      const door = `M9.6 ${f(yL)}V14.6A2.4 2.4 0 0 1 14.4 14.6V${f(yR)}`;
      const doorHole = `M9.4 22V14.6A2.6 2.6 0 0 1 14.6 14.6V22Z`;
      return {
        keylines: drawKeylines([[12, 14.6, 2.4]], [...H.anchors, [9.6, yL], [14.4, yR]]),
        line: `<path d="${H.d}"/><path d="${door}"/>`,
        solid: { fill: [H.d], holeExact: [doorHole] },
        duotone: { tone: [H.d], secondary: [door], line: `<path d="${H.d}"/>` }
      };
    }
};
