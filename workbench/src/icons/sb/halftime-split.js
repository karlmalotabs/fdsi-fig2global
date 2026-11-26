// Surgical-precision icon module: fdsi-halftime-split (sb)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-c2-125-halftime-split",
  slug: "halftime-split",
  name: "#125. Half-Time / 45' Match Timer (Stopwatch + 12-to-6 Half-Pie Sector)",
  area: "sb",
  order: 158,
  desc: "REBUILT AS HALF-TIME STOPWATCH: Match stopwatch (cx=12, cy=13.2, R=7.8 with top crown T-button & side pusher) with the right 12-to-6 half-pie sector filled to show 50% / Half-Time!",
  meta: {
      "slug": "halftime-split",
      "area": "sb",
      "alias": "",
      "crsKey": "",
      "description": "Half-Time / Full-Time (HT/FT) double result and 1st-half markets.",
      "tags": [
          "half-time",
          "45-minutes",
          "first-half",
          "ht-ft",
          "stopwatch",
          "period"
      ]
  },
  build: () => {
      const dial = circleD(12.0, 13.2, 7.8);
      const dialSolid = circleD(12.0, 13.2, 8.1);
      const crown = `M9.5 2.8H14.5M12.0 2.8V5.2M17.8 7.4L19.4 5.8`;
      // Right 12-to-6 half-pie sector inside the stopwatch (cx=12, cy=13.2, r=5.0 -> 0 to 45 minutes!):
      const halfPieLine = `M12.0 8.2A5.0 5.0 0 0 1 12.0 18.2Z`;
      const vHand = `M12.0 5.4V21.0`;
      // In Solid mode: filled stopwatch body with the left half-circle window punched out (`leftWindow`) so the right half stays solid and the left half is open!
      const leftWindow = `M11.2 7.8A5.5 5.5 0 0 0 11.2 18.6Z`;
      return {
        keylines: drawKeylines([[12, 13.2, 7.8], [12, 13.2, 5.0]], [[12, 5.4], [12, 21.0], [19.4, 5.8]]),
        line: `<path d="${dial}"/><path d="${crown}"/><path d="${vHand}"/><path d="${halfPieLine}" fill="currentColor" stroke="none"/>`,
        solid: {
          fill: [dialSolid],
          holeExact: [leftWindow],
          stroke: [crown]
        },
        duotone: {
          tone: [dial],
          secondary: [crown, vHand],
          line: `<path d="${dial}"/><path d="${crown}"/><path d="${vHand}"/><path d="${halfPieLine}" fill="currentColor" stroke="none"/>`
        }
      };
    }
};
