// Surgical-precision icon module: fdsi-wheel-of-fortune (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { P, polar, circleD, bloatPoly, drawKeylines, nextUid } from "../../engine/primitives.js";

export default {
  id: "pack-d-67-wheel-of-fortune",
  slug: "wheel-of-fortune",
  name: "#67. Wheel of Fortune / Game Show (Donut Prize Wheel + 6 Radial Spokes + Top Pointer)",
  area: "gx",
  order: 100,
  desc: "Built like Roulette Wheel: Prize wheel (cx=12, cy=13.0, R=8.0) with 6 radial spokes at 60° + top pointer wedge at (12.0, 2.8..5.8).",
  meta: {
      "slug": "wheel-of-fortune",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Live casino game shows, Crazy Time prize wheels, and daily spin bonuses.",
      "tags": [
          "wheel",
          "game-show",
          "fortune",
          "spin",
          "prize",
          "live-casino",
          "bonus"
      ]
  },
  build: ({ b, r }) => {
      const outer = circleD(12.0, 13.0, 7.8);
      const hub = circleD(12.0, 13.0, 2.2);
      const spokes = [30, 90, 150, 210, 270, 330].map(deg =>
        `M${P(polar(12.0, 13.0, 2.2, deg))}L${P(polar(12.0, 13.0, 7.8, deg))}`
      ).join("");
      const pointer = bloatPoly([[9.6, 2.6], [14.4, 2.6], [12.0, 6.2]], 0.45, b * 0.2, { minEdge: 1.5 });
      const pointerHalo = bloatPoly([[8.2, 1.8], [15.8, 1.8], [12.0, 7.6]], 0.7, b * 0.2, { minEdge: 1.5 });
      const uidWf = "wf6_" + (nextUid());
      const lineM = `<defs><mask id="${uidWf}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${pointer.d}" fill="#000" stroke="#000" stroke-width="1.4"/></mask></defs>` +
                    `<g mask="url(#${uidWf})"><path d="${outer}"/><path d="${hub}"/><path d="${spokes}"/></g>` +
                    `<path d="${pointer.d}" fill="currentColor" stroke="none"/>`;
      return {
        keylines: drawKeylines([[12, 13.0, 7.8], [12, 13.0, 2.2]], [[12, 6.2], [9.6, 2.6], [14.4, 2.6]]),
        line: lineM,
        solid: {
          fill: [outer],
          holeExact: [circleD(12.0, 13.0, 5.2), pointerHalo.d],
          over: [circleD(12.0, 13.0, 2.2), pointer.d],
          stroke: [spokes]
        },
        duotone: { tone: [outer], secondary: [spokes], line: lineM }
      };
    }
};
