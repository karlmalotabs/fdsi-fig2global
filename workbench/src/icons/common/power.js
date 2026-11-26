// Surgical-precision icon module: fdsi-power (common)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { polar, circleD, arcPath, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-a2-90-power-switch",
  slug: "power",
  name: "#90. Power / Log Off Switch (270° Open Arc + Top Vertical Power Bar)",
  area: "common",
  order: 123,
  desc: "Open 270° circular power arc (cx=12, cy=13.0, R=7.8, from -45° clockwise to -135°) + top vertical power toggle stem (M12.0 3.4 V11.8).",
  meta: {
      "slug": "power",
      "area": "common",
      "alias": "",
      "crsKey": "",
      "description": "Quickly end session, log out, or toggle system power state.",
      "tags": [
          "power",
          "switch",
          "off",
          "shutdown",
          "logout",
          "disconnect"
      ]
  },
  build: () => {
      const ring = arcPath(12.0, 13.0, 7.8, -45, 225);
      const stem = `M12.0 3.4V11.8`;
      return {
        keylines: drawKeylines([[12, 13.0, 7.8]], [polar(12, 13.0, 7.8, -45), polar(12, 13.0, 7.8, 225), [12, 3.4], [12, 11.8]]),
        line: `<path d="${ring}"/><path d="${stem}"/>`,
        solid: { stroke: [ring, stem] },
        duotone: { tone: [circleD(12, 13.0, 7.8)], secondary: [stem], line: `<path d="${ring}"/><path d="${stem}"/>` }
      };
    }
};
