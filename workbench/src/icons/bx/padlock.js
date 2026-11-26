// Surgical-precision icon module: fdsi-padlock (bx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { f, capsule, bloatRect, edgeY, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "ui-padlock",
  slug: "padlock",
  name: "Security Padlock (Bloated Body + edgeY Shackle)",
  area: "bx",
  order: 16,
  desc: "Bloated lock body (4.8..19.2 × 10.5..20.5) + r=3.8 shackle arch locked to top edgeY + vertical capsule keyhole.",
  meta: {
      "slug": "padlock",
      "area": "bx",
      "alias": "",
      "crsKey": "",
      "description": "Locked market, password security, or encrypted account data.",
      "tags": [
          "padlock",
          "lock",
          "security",
          "password",
          "encrypted",
          "closed",
          "private"
      ],
      "status": "todo"
  },
  build: ({ b, r }) => {
      const B = bloatRect({ x: 4.8, y: 10.5, w: 14.4, h: 10.0, r: Math.min(r + 0.4, 2.4), b });
      const yL = edgeY(B.poly, 8.2, "top"), yR = edgeY(B.poly, 15.8, "top");
      const shackle = `M8.2 ${f(yL)}V7.2A3.8 3.8 0 0 1 15.8 7.2V${f(yR)}`;
      const kh = `M12.0 14.2V17.0`;
      const khHole = capsule([12.0, 14.0], [12.0, 17.2], 1.8);
      return {
        keylines: drawKeylines([[12, 7.2, 3.8]], [[8.2, yL], [15.8, yR], [12, 14.2], [12, 17.0]]),
        line: `<path d="${B.d}"/><path d="${shackle}"/><path d="${kh}"/>`,
        solid: { fill: [B.d], holeExact: [khHole], stroke: [shackle] },
        duotone: { tone: [B.d], secondary: [shackle], line: `<path d="${B.d}"/><path d="${kh}"/>` }
      };
    }
};
