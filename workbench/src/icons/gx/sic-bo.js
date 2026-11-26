// Surgical-precision icon module: fdsi-sic-bo (gx)
// Multi-agent safe: edit this file directly and the Workbench will hot-reload automatically.
import { circleD, bloatRect, drawKeylines } from "../../engine/primitives.js";

export default {
  id: "pack-d-77-sic-bo-dome",
  slug: "sic-bo",
  name: "#77. Sic Bo / Live Table Cloche Dome (2 Separate Padded Shapes — Bell Dome + Base Plinth)",
  area: "gx",
  order: 110,
  desc: "Semicircular dealer cloche dome (cx=12, cy=15.0, R=8.0) with top knob circle (12, 4.8, r=1.8) + bloated base tray below (x=2.8..21.2, y=15.0..19.6).",
  meta: {
      "slug": "sic-bo",
      "area": "gx",
      "alias": "",
      "crsKey": "",
      "description": "Super Sic Bo and Asian live dealer dice shaker dome games.",
      "tags": [
          "sic-bo",
          "cloche",
          "dome",
          "dice-cup",
          "asian-games",
          "live-casino"
      ]
  },
  build: ({ b, r }) => {
      const cr = Math.min(r * 0.5, 1.15);
      const dome = `M4.0 15.0V14.2A8.0 8.0 0 0 1 20.0 14.2V15.0`;
      const knob = circleD(12.0, 4.6, 1.7);
      const knobSolid = circleD(12.0, 4.4, 2.0);
      const trayLine = bloatRect({ x: 2.8, y: 15.0, w: 18.4, h: 4.4, r: cr, b: b * 0.35 });
      // Solid: 3 Separate Padded Shapes (Top Knob + Semicircular Dome + Base Tray)!
      const domeSolid = `M3.8 13.8A8.2 8.2 0 0 1 20.2 13.8A0.9 0.9 0 0 1 19.3 14.8H4.7A0.9 0.9 0 0 1 3.8 13.8Z`;
      const traySolid = bloatRect({ x: 2.8, y: 16.4, w: 18.4, h: 3.8, r: cr, b: b * 0.35 });
      return {
        keylines: drawKeylines([[12, 14.2, 8.0], [12, 4.6, 1.7]], trayLine.anchors),
        line: `<path d="${dome}"/><path d="${knob}"/><path d="${trayLine.d}"/>`,
        solid: { face: [knobSolid, domeSolid, traySolid.d] },
        duotone: { tone: [domeSolid], secondary: [knob, trayLine.d], line: `<path d="${dome}"/><path d="${knob}"/><path d="${trayLine.d}"/>` }
      };
    }
};
